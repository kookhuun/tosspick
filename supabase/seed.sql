-- ============================================================
-- tosspick 시드 데이터
-- UI가 빈 화면 없이 동작하도록 하는 샘플 데이터
-- 실제 운영 시 외부 툴이 POST /api/ingest/* 로 덮어씀
-- ============================================================

-- 시장 지수
insert into public.market_indices (id, name, current_value, change, change_rate) values
  ('KOSPI',  'KOSPI',   2680.00,  12.30,  0.46),
  ('KOSDAQ', 'KOSDAQ',   870.50,  -3.20, -0.37),
  ('SPX',    'S&P 500', 5234.18,  18.92,  0.36),
  ('IXIC',   'NASDAQ', 16421.97,  74.12,  0.45)
on conflict (id) do update set
  current_value = excluded.current_value,
  change        = excluded.change,
  change_rate   = excluded.change_rate,
  updated_at    = now();

-- 공포탐욕 지수
insert into public.fear_greed_index (id, score, label) values
  (1, 52, 'neutral')
on conflict (id) do update set
  score      = excluded.score,
  label      = excluded.label,
  updated_at = now();

-- 국내 섹터
insert into public.sectors (name, change_rate, color) values
  ('반도체',   1.24, 'bg-green-500'),
  ('2차전지',  0.83, 'bg-green-400'),
  ('자동차',   0.52, 'bg-green-300'),
  ('바이오',  -0.31, 'bg-red-300'),
  ('금융',     0.18, 'bg-green-200'),
  ('에너지',  -0.75, 'bg-red-400'),
  ('철강/소재', 0.41, 'bg-green-300'),
  ('통신',    -0.12, 'bg-red-200'),
  ('유통',     0.05, 'bg-green-100'),
  ('화학',    -0.58, 'bg-red-400'),
  ('조선',     1.03, 'bg-green-500'),
  ('IT서비스', 0.66, 'bg-green-400')
on conflict (name) do update set
  change_rate = excluded.change_rate,
  color       = excluded.color,
  updated_at  = now();

-- 국내 종목 (KOSPI/KOSDAQ 대표 종목)
insert into public.tickers (symbol, name, market, current_price, price_change, price_change_rate, volume, market_cap) values
  ('005930', '삼성전자',    'KOSPI',  73400, 400,   0.55, 12500000, 438000000000000),
  ('000660', 'SK하이닉스',  'KOSPI', 179500, 2500,  1.41,  3200000, 130700000000000),
  ('005380', '현대차',      'KOSPI', 241500, -500, -0.21,   800000,  51400000000000),
  ('035420', 'NAVER',       'KOSPI', 185000, 1500,  0.82,   450000,  30300000000000),
  ('051910', 'LG화학',      'KOSPI', 318000, -2000,-0.62,   210000,  22400000000000),
  ('006400', '삼성SDI',     'KOSPI', 272000, 1000,  0.37,   180000,  18700000000000),
  ('207940', '삼성바이오로직스','KOSPI',793000,-3000,-0.38,   90000,  53100000000000),
  ('035720', '카카오',      'KOSPI',  42300,  300,  0.71,  2100000,  18600000000000),
  ('012330', '현대모비스',  'KOSPI', 238500, -500, -0.21,   250000,  22500000000000),
  ('028260', '삼성물산',    'KOSPI', 135000,  500,  0.37,   310000,  25900000000000),
  ('247540', '에코프로비엠','KOSDAQ',168500, 2500,  1.51,   580000,  14900000000000),
  ('086520', '에코프로',    'KOSDAQ',740000,11000,  1.51,   150000,  16900000000000),
  ('196170', '알테오젠',    'KOSDAQ',181000,-1500, -0.82,   320000,  12600000000000),
  ('091990', '셀트리온헬스케어','KOSDAQ',49850, 350, 0.71,  1200000,   7100000000000),
  ('068270', '셀트리온',    'KOSPI', 172500, 1500,  0.88,   850000,  23600000000000)
on conflict (symbol) do update set
  current_price     = excluded.current_price,
  price_change      = excluded.price_change,
  price_change_rate = excluded.price_change_rate,
  volume            = excluded.volume,
  market_cap        = excluded.market_cap,
  updated_at        = now();

-- 해외 종목 (NYSE/NASDAQ 섹터별)
insert into public.tickers (symbol, name, market, current_price, price_change, price_change_rate, volume, market_cap, sector) values
  -- Technology
  ('AAPL',  'Apple',           'NASDAQ', 228.87, 1.23,  0.54, 55000000, 3510000000000, 'Technology'),
  ('MSFT',  'Microsoft',       'NASDAQ', 415.32, 2.10,  0.51, 22000000, 3080000000000, 'Technology'),
  ('NVDA',  'NVIDIA',          'NASDAQ', 875.42, 15.20, 1.77, 42000000, 2160000000000, 'Technology'),
  ('META',  'Meta',            'NASDAQ', 527.15, -3.20,-0.60, 18000000, 1340000000000, 'Technology'),
  ('GOOGL', 'Alphabet',        'NASDAQ', 175.98, 0.85,  0.49, 24000000, 2160000000000, 'Technology'),
  ('AVGO',  'Broadcom',        'NASDAQ', 165.20, 1.10,  0.67,  8000000,  770000000000, 'Technology'),
  -- Consumer
  ('AMZN',  'Amazon',          'NASDAQ', 199.11, 1.45,  0.73, 35000000, 2100000000000, 'Consumer'),
  ('TSLA',  'Tesla',           'NASDAQ', 172.63,-9.32, -5.12, 98000000,  552000000000, 'Consumer'),
  ('HD',    'Home Depot',      'NYSE',   380.45, 2.30,  0.61,  3200000,  378000000000, 'Consumer'),
  ('MCD',   'McDonald''s',     'NYSE',   295.10,-0.80, -0.27,  2800000,  212000000000, 'Consumer'),
  -- Financials
  ('JPM',   'JPMorgan Chase',  'NYSE',   227.35, 1.20,  0.53,  9500000,  654000000000, 'Financials'),
  ('BAC',   'Bank of America', 'NYSE',    40.12,-0.33, -0.82, 42000000,  316000000000, 'Financials'),
  ('GS',    'Goldman Sachs',   'NYSE',   510.22, 3.15,  0.62,  1800000,  166000000000, 'Financials'),
  ('V',     'Visa',            'NYSE',   280.15, 1.05,  0.38,  6200000,  568000000000, 'Financials'),
  -- Healthcare
  ('LLY',   'Eli Lilly',       'NYSE',   785.20,-5.40, -0.68,  3800000,  747000000000, 'Healthcare'),
  ('UNH',   'UnitedHealth',    'NYSE',   536.45, 2.10,  0.39,  2200000,  492000000000, 'Healthcare'),
  ('JNJ',   'Johnson & Johnson','NYSE',  152.30,-0.50, -0.33,  5800000,  366000000000, 'Healthcare'),
  -- Energy
  ('XOM',   'ExxonMobil',      'NYSE',   118.50, 0.80,  0.68, 16000000,  475000000000, 'Energy'),
  ('CVX',   'Chevron',         'NYSE',   155.20,-0.40, -0.26,  8500000,  285000000000, 'Energy'),
  -- Industrials
  ('CAT',   'Caterpillar',     'NYSE',   378.90, 2.50,  0.66,  2100000,  180000000000, 'Industrials'),
  ('BA',    'Boeing',          'NYSE',   175.40,-2.20, -1.24,  7800000,  131000000000, 'Industrials')
on conflict (symbol) do update set
  current_price     = excluded.current_price,
  price_change      = excluded.price_change,
  price_change_rate = excluded.price_change_rate,
  volume            = excluded.volume,
  market_cap        = excluded.market_cap,
  sector            = excluded.sector,
  updated_at        = now();

-- 글로벌 지표 (환율/원자재/채권)
insert into public.global_indicators (type, name, value, change, change_rate, ai_impact_summary) values
  ('exchange_rate', 'USD/KRW', 1354.50,  3.20,  0.24, '달러 강세 → 수출주 단기 긍정'),
  ('exchange_rate', 'EUR/KRW', 1462.30, -1.50, -0.10, '유로 약세 → 유럽 수출 영향 미미'),
  ('exchange_rate', 'JPY/KRW',  891.20,  2.10,  0.24, '엔화 강세 → 일본 경쟁주 부담'),
  ('commodity',     'WTI 원유',  82.45,  0.75,  0.92, '유가 상승 → 정유·에너지주 긍정'),
  ('commodity',     '금',      2342.80, 12.30,  0.53, '금 강세 → 안전자산 선호 신호'),
  ('bond',          '미국 10년물', 4.42,  0.03,  0.68, '금리 상승 → 성장주 밸류에이션 압박')
on conflict (name) do update set
  value              = excluded.value,
  change             = excluded.change,
  change_rate        = excluded.change_rate,
  ai_impact_summary  = excluded.ai_impact_summary,
  updated_at         = now();

-- 샘플 뉴스
insert into public.news_items (title, summary_one_line, impact_direction, related_tickers, source_url, published_at) values
  (
    '삼성전자, HBM3E 양산 돌입… 엔비디아 납품 기대',
    'AI 반도체 수요 확대로 하반기 실적 개선 전망',
    'positive',
    ARRAY['005930', 'NVDA'],
    'https://example.com/news/samsung-hbm3e',
    now() - interval '2 hours'
  ),
  (
    '미 연준, 금리 동결 유지… 연내 1회 인하 시사',
    '고금리 장기화 우려 완화, 성장주 반등 기대',
    'positive',
    ARRAY['AAPL', 'MSFT', 'GOOGL'],
    'https://example.com/news/fed-rate-hold',
    now() - interval '4 hours'
  ),
  (
    '테슬라, 1분기 인도량 예상치 하회… 주가 급락',
    '가격 인하에도 수요 부진, 마진 압박 지속',
    'negative',
    ARRAY['TSLA'],
    'https://example.com/news/tesla-delivery',
    now() - interval '6 hours'
  ),
  (
    '에코프로비엠, 2분기 영업이익 흑자 전환 전망',
    '배터리 소재 수요 회복세로 실적 개선 기대',
    'positive',
    ARRAY['247540', '086520'],
    'https://example.com/news/ecopro-q2',
    now() - interval '8 hours'
  ),
  (
    'WTI 원유 82달러 돌파… 중동 긴장 지속',
    '유가 상승으로 정유·에너지株 강세, 항공株 부담',
    'neutral',
    ARRAY['XOM', 'CVX'],
    'https://example.com/news/oil-price',
    now() - interval '10 hours'
  )
on conflict (source_url) do nothing;
