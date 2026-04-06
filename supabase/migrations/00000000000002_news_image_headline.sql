-- news_items에 이미지 URL과 AI 헤드라인 추가
alter table public.news_items
  add column if not exists image_url text,
  add column if not exists ai_headline text; -- AI가 생성한 캐치한 한국어 헤드라인
