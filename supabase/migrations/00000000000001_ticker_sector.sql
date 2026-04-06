-- tickers에 sector 연결 추가 (해외 히트맵용)
alter table public.tickers
  add column if not exists sector text; -- 섹터명 (sectors.name 참조, FK 미사용)

create index if not exists idx_tickers_sector on tickers(sector);
create index if not exists idx_tickers_market_sector on tickers(market, sector);
