-- 투자판 토스 (tosspick) 초기 마이그레이션
-- resources.yaml 기반 15개 테이블 생성

-- ============================================================
-- 1. user_profiles (Supabase Auth 연동)
-- ============================================================
create table public.user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  nickname text not null,
  avatar_url text,
  provider text not null default 'email', -- kakao, google, email
  created_at timestamptz default now() not null
);

alter table public.user_profiles enable row level security;

create policy "본인 프로필 조회 허용"
  on user_profiles for select
  using (auth.uid() = id);

create policy "본인 프로필 수정 허용"
  on user_profiles for update
  using (auth.uid() = id);

-- Auth 회원가입 시 user_profiles 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, nickname, provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)),
    coalesce(new.raw_app_meta_data->>'provider', 'email')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. tickers (종목 기본 정보)
-- ============================================================
create table public.tickers (
  id uuid default gen_random_uuid() primary key,
  symbol text not null unique,
  name text not null,
  market text not null check (market in ('KOSPI', 'KOSDAQ', 'NYSE', 'NASDAQ')),
  current_price numeric(15, 2) default 0,
  price_change numeric(15, 2) default 0,
  price_change_rate numeric(8, 4) default 0,
  volume bigint default 0,
  market_cap bigint default 0,
  updated_at timestamptz default now() not null
);

create index idx_tickers_symbol on tickers(symbol);
create index idx_tickers_market on tickers(market);
create index idx_tickers_price_change_rate on tickers(price_change_rate desc);

-- ============================================================
-- 3. ticker_details (종목 상세 분석)
-- ============================================================
create table public.ticker_details (
  ticker_id uuid references public.tickers(id) on delete cascade primary key,
  per numeric(10, 4),
  pbr numeric(10, 4),
  eps numeric(15, 2),
  dividend_rate numeric(8, 4),
  chart_data jsonb default '{}',
  ai_earnings_summary text,
  ai_opinion text check (ai_opinion in ('buy_consider', 'caution', 'hold')),
  ai_opinion_reason text[], -- 근거 2개 이상
  ai_causal_story text,
  latest_earnings_date date,
  next_earnings_date date,
  ai_analyzed_at timestamptz -- AI 분석 캐시 기준 시각
);

-- ============================================================
-- 4. news_items (AI 요약 뉴스)
-- ============================================================
create table public.news_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary_one_line text, -- 50자 이내 AI 요약
  impact_direction text not null default 'neutral'
    check (impact_direction in ('positive', 'negative', 'neutral')),
  related_tickers text[] default '{}', -- 종목 코드 최대 3개
  source_url text not null unique,
  published_at timestamptz not null,
  collected_at timestamptz default now() not null
);

create index idx_news_published_at on news_items(published_at desc);
create index idx_news_related_tickers on news_items using gin(related_tickers);

-- ============================================================
-- 5. market_indices (시장 지수)
-- ============================================================
create table public.market_indices (
  id text primary key, -- 'KOSPI', 'KOSDAQ', 'SPX', 'IXIC'
  name text not null,
  current_value numeric(15, 4) not null default 0,
  change numeric(15, 4) default 0,
  change_rate numeric(8, 4) default 0,
  updated_at timestamptz default now() not null
);

-- ============================================================
-- 6. sectors (섹터별 시장 동향)
-- ============================================================
create table public.sectors (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  change_rate numeric(8, 4) default 0,
  color text default 'gray', -- Tailwind 색상 계열
  updated_at timestamptz default now() not null
);

-- ============================================================
-- 7. fear_greed_index (공포탐욕 지수)
-- ============================================================
create table public.fear_greed_index (
  id int primary key default 1, -- 단일 행
  score int not null check (score between 0 and 100),
  label text not null check (label in ('extreme_fear', 'fear', 'neutral', 'greed', 'extreme_greed')),
  updated_at timestamptz default now() not null
);

-- ============================================================
-- 8. global_indicators (글로벌 매크로 지표)
-- ============================================================
create table public.global_indicators (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('exchange_rate', 'commodity', 'bond')),
  name text not null,
  value numeric(15, 4) not null default 0,
  change numeric(15, 4) default 0,
  change_rate numeric(8, 4) default 0,
  ai_impact_summary text, -- "달러 강세 → 수출주 긍정적" 50자 이내
  updated_at timestamptz default now() not null
);

create index idx_global_indicators_type on global_indicators(type);

-- ============================================================
-- 9. glossary_terms (투자 용어 사전)
-- ============================================================
create table public.glossary_terms (
  id uuid default gen_random_uuid() primary key,
  term text not null unique,
  short_definition text not null,
  full_explanation text not null,
  example text not null,
  category text not null check (category in ('basic', 'indicator', 'chart', 'earnings', 'macro')),
  related_terms text[] default '{}'
);

create index idx_glossary_category on glossary_terms(category);
create index idx_glossary_term_search on glossary_terms using gin(to_tsvector('korean', term || ' ' || short_definition));

-- ============================================================
-- 10. watchlist_items (관심주)
-- ============================================================
create table public.watchlist_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  ticker_id uuid references public.tickers(id) on delete cascade not null,
  added_at timestamptz default now() not null,
  alert_enabled boolean default false,
  unique (user_id, ticker_id)
);

alter table public.watchlist_items enable row level security;

create policy "본인 관심주만 접근"
  on watchlist_items for all
  using (auth.uid() = user_id);

-- ============================================================
-- 11. trade_records (가상 매매 기록)
-- ============================================================
create table public.trade_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  ticker_id uuid references public.tickers(id) on delete cascade not null,
  type text not null check (type in ('buy', 'sell')),
  quantity numeric(15, 4) not null,
  price numeric(15, 2) not null,
  recorded_at date not null default current_date,
  memo text
);

alter table public.trade_records enable row level security;

create policy "본인 매매기록만 접근"
  on trade_records for all
  using (auth.uid() = user_id);

create index idx_trade_records_user on trade_records(user_id, recorded_at desc);

-- ============================================================
-- 12. earnings_events (실적 발표 일정)
-- ============================================================
create table public.earnings_events (
  id uuid default gen_random_uuid() primary key,
  ticker_id uuid references public.tickers(id) on delete cascade not null,
  scheduled_date date not null,
  is_confirmed boolean default false,
  result_eps numeric(15, 4),
  result_revenue bigint
);

create index idx_earnings_ticker on earnings_events(ticker_id, scheduled_date);

-- ============================================================
-- 13. community_posts (커뮤니티 게시글)
-- ============================================================
create table public.community_posts (
  id uuid default gen_random_uuid() primary key,
  ticker_id uuid references public.tickers(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  category text not null default 'general'
    check (category in ('general', 'question', 'bullish', 'bearish')),
  like_count int default 0,
  comment_count int default 0,
  created_at timestamptz default now() not null
);

alter table public.community_posts enable row level security;

create policy "게시글 공개 조회"
  on community_posts for select
  using (true);

create policy "인증 사용자만 작성"
  on community_posts for insert
  with check (auth.uid() = author_id);

create policy "본인 게시글만 삭제"
  on community_posts for delete
  using (auth.uid() = author_id);

create index idx_community_posts_ticker on community_posts(ticker_id, created_at desc);

-- ============================================================
-- 14. comments (커뮤니티 댓글)
-- ============================================================
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  parent_comment_id uuid references public.comments(id) on delete cascade, -- 대댓글
  like_count int default 0,
  created_at timestamptz default now() not null
);

alter table public.comments enable row level security;

create policy "댓글 공개 조회"
  on comments for select
  using (true);

create policy "인증 사용자만 댓글 작성"
  on comments for insert
  with check (auth.uid() = author_id);

create policy "본인 댓글만 삭제"
  on comments for delete
  using (auth.uid() = author_id);

create index idx_comments_post on comments(post_id, created_at asc);

-- ============================================================
-- 15. notifications (사용자 알림)
-- ============================================================
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('news', 'earnings', 'community_reply', 'system')),
  title text not null,
  body text not null,
  deep_link text not null,
  is_read boolean default false,
  created_at timestamptz default now() not null
);

alter table public.notifications enable row level security;

create policy "본인 알림만 접근"
  on notifications for all
  using (auth.uid() = user_id);

create index idx_notifications_user on notifications(user_id, created_at desc);
