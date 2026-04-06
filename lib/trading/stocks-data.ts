// @TASK T-TRADING - 국내/해외 종목 데이터 (100개+)

export interface StockItem {
  symbol: string
  name: string
  price: number
  change_rate: number
  sector: string
  market: 'domestic' | 'overseas'
}

export const DOMESTIC_STOCKS: StockItem[] = [
  { symbol: '005930', name: '삼성전자', price: 75400, change_rate: 1.89, sector: '반도체', market: 'domestic' },
  { symbol: '000660', name: 'SK하이닉스', price: 198000, change_rate: 2.59, sector: '반도체', market: 'domestic' },
  { symbol: '035720', name: '카카오', price: 52400, change_rate: 4.17, sector: 'IT', market: 'domestic' },
  { symbol: '035420', name: 'NAVER', price: 195000, change_rate: -0.51, sector: 'IT', market: 'domestic' },
  { symbol: '051910', name: 'LG화학', price: 315000, change_rate: -2.47, sector: '화학', market: 'domestic' },
  { symbol: '006400', name: '삼성SDI', price: 285000, change_rate: 1.07, sector: '배터리', market: 'domestic' },
  { symbol: '207940', name: '삼성바이오로직스', price: 780000, change_rate: 0.78, sector: '바이오', market: 'domestic' },
  { symbol: '068270', name: '셀트리온', price: 168000, change_rate: -1.18, sector: '바이오', market: 'domestic' },
  { symbol: '005380', name: '현대차', price: 245000, change_rate: 0.41, sector: '자동차', market: 'domestic' },
  { symbol: '000270', name: '기아', price: 118000, change_rate: 1.29, sector: '자동차', market: 'domestic' },
  { symbol: '005490', name: 'POSCO홀딩스', price: 385000, change_rate: -0.78, sector: '철강', market: 'domestic' },
  { symbol: '066570', name: 'LG전자', price: 95400, change_rate: 0.63, sector: 'IT·전자', market: 'domestic' },
  { symbol: '017670', name: 'SK텔레콤', price: 52800, change_rate: -0.19, sector: '통신', market: 'domestic' },
  { symbol: '030200', name: 'KT', price: 38500, change_rate: 0.26, sector: '통신', market: 'domestic' },
  { symbol: '055550', name: '신한지주', price: 47200, change_rate: 0.85, sector: '금융', market: 'domestic' },
  { symbol: '105560', name: 'KB금융', price: 73100, change_rate: 1.24, sector: '금융', market: 'domestic' },
  { symbol: '086790', name: '하나금융지주', price: 58300, change_rate: 0.69, sector: '금융', market: 'domestic' },
  { symbol: '316140', name: '우리금융지주', price: 14250, change_rate: -0.35, sector: '금융', market: 'domestic' },
  { symbol: '032830', name: '삼성생명', price: 89500, change_rate: 0.56, sector: '보험', market: 'domestic' },
  { symbol: '000810', name: '삼성화재', price: 320000, change_rate: 0.31, sector: '보험', market: 'domestic' },
  { symbol: '011170', name: '롯데케미칼', price: 98700, change_rate: -1.52, sector: '화학', market: 'domestic' },
  { symbol: '034730', name: 'SK', price: 162000, change_rate: -0.61, sector: '지주', market: 'domestic' },
  { symbol: '018260', name: '삼성에스디에스', price: 166000, change_rate: 0.91, sector: 'IT', market: 'domestic' },
  { symbol: '096770', name: 'SK이노베이션', price: 118500, change_rate: -2.05, sector: '에너지', market: 'domestic' },
  { symbol: '009150', name: '삼성전기', price: 148000, change_rate: 0.68, sector: '전기전자', market: 'domestic' },
  { symbol: '028260', name: '삼성물산', price: 131500, change_rate: 0.38, sector: '건설', market: 'domestic' },
  { symbol: '010950', name: 'S-Oil', price: 74200, change_rate: -1.73, sector: '에너지', market: 'domestic' },
  { symbol: '011200', name: 'HMM', price: 18450, change_rate: 3.22, sector: '해운', market: 'domestic' },
  { symbol: '042660', name: '한화오션', price: 32100, change_rate: 2.88, sector: '조선', market: 'domestic' },
  { symbol: '010140', name: '삼성중공업', price: 11850, change_rate: 1.97, sector: '조선', market: 'domestic' },
  { symbol: '034020', name: '두산에너빌리티', price: 21350, change_rate: 4.53, sector: '에너지', market: 'domestic' },
  { symbol: '000100', name: '유한양행', price: 94000, change_rate: -0.53, sector: '제약', market: 'domestic' },
  { symbol: '128940', name: '한미약품', price: 352000, change_rate: 1.15, sector: '제약', market: 'domestic' },
  { symbol: '302440', name: 'SK바이오사이언스', price: 64800, change_rate: -2.31, sector: '바이오', market: 'domestic' },
  { symbol: '091990', name: '셀트리온헬스케어', price: 72400, change_rate: 0.97, sector: '바이오', market: 'domestic' },
  { symbol: '003550', name: 'LG', price: 89300, change_rate: 0.34, sector: '지주', market: 'domestic' },
  { symbol: '012330', name: '현대모비스', price: 235000, change_rate: 0.21, sector: '자동차부품', market: 'domestic' },
  { symbol: '009830', name: '한화솔루션', price: 27150, change_rate: 1.68, sector: '태양광', market: 'domestic' },
  { symbol: '000720', name: '현대건설', price: 38400, change_rate: -0.78, sector: '건설', market: 'domestic' },
  { symbol: '001040', name: 'CJ', price: 75400, change_rate: 0.53, sector: '지주', market: 'domestic' },
  { symbol: '097950', name: 'CJ제일제당', price: 235000, change_rate: -1.26, sector: '식품', market: 'domestic' },
  { symbol: '004020', name: '현대제철', price: 25150, change_rate: -0.99, sector: '철강', market: 'domestic' },
  { symbol: '024110', name: '기업은행', price: 13450, change_rate: 0.75, sector: '금융', market: 'domestic' },
  { symbol: '139480', name: '이마트', price: 63800, change_rate: 0.47, sector: '유통', market: 'domestic' },
  { symbol: '035250', name: '강원랜드', price: 14750, change_rate: -0.34, sector: '레저', market: 'domestic' },
  { symbol: '021240', name: '코웨이', price: 51800, change_rate: 0.78, sector: '가전', market: 'domestic' },
  { symbol: '086280', name: '현대글로비스', price: 185000, change_rate: 0.27, sector: '물류', market: 'domestic' },
  { symbol: '047050', name: '포스코인터내셔널', price: 54700, change_rate: 1.49, sector: '무역', market: 'domestic' },
  { symbol: '015760', name: '한국전력', price: 21250, change_rate: -0.23, sector: '유틸리티', market: 'domestic' },
  { symbol: '009540', name: 'HD한국조선해양', price: 168500, change_rate: 2.14, sector: '조선', market: 'domestic' },
]

export const OVERSEAS_STOCKS: StockItem[] = [
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.4, change_rate: 2.71, sector: 'Tech', market: 'overseas' },
  { symbol: 'AAPL', name: 'Apple', price: 187.3, change_rate: -0.64, sector: 'Tech', market: 'overseas' },
  { symbol: 'MSFT', name: 'Microsoft', price: 420.2, change_rate: 0.83, sector: 'Tech', market: 'overseas' },
  { symbol: 'TSLA', name: 'Tesla', price: 178.5, change_rate: -4.44, sector: 'EV', market: 'overseas' },
  { symbol: 'META', name: 'Meta', price: 507.2, change_rate: 2.51, sector: 'Social', market: 'overseas' },
  { symbol: 'AMZN', name: 'Amazon', price: 198.5, change_rate: 1.2, sector: 'Commerce', market: 'overseas' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 172.3, change_rate: 0.94, sector: 'Tech', market: 'overseas' },
  { symbol: 'BRKB', name: 'Berkshire Hathaway', price: 420.1, change_rate: 0.31, sector: 'Finance', market: 'overseas' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.4, change_rate: 0.55, sector: 'Finance', market: 'overseas' },
  { symbol: 'V', name: 'Visa', price: 274.3, change_rate: 0.42, sector: 'Finance', market: 'overseas' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.7, change_rate: -0.28, sector: 'Healthcare', market: 'overseas' },
  { symbol: 'WMT', name: 'Walmart', price: 68.4, change_rate: 0.37, sector: 'Retail', market: 'overseas' },
  { symbol: 'XOM', name: 'ExxonMobil', price: 104.2, change_rate: -0.91, sector: 'Energy', market: 'overseas' },
  { symbol: 'BAC', name: 'Bank of America', price: 38.1, change_rate: 0.79, sector: 'Finance', market: 'overseas' },
  { symbol: 'UNH', name: 'UnitedHealth', price: 527.8, change_rate: -0.53, sector: 'Healthcare', market: 'overseas' },
  { symbol: 'LLY', name: 'Eli Lilly', price: 798.4, change_rate: 1.47, sector: 'Pharma', market: 'overseas' },
  { symbol: 'AVGO', name: 'Broadcom', price: 1380.5, change_rate: 1.83, sector: 'Semiconductor', market: 'overseas' },
  { symbol: 'MA', name: 'Mastercard', price: 474.2, change_rate: 0.61, sector: 'Finance', market: 'overseas' },
  { symbol: 'PG', name: 'Procter & Gamble', price: 163.8, change_rate: 0.14, sector: 'Consumer', market: 'overseas' },
  { symbol: 'ORCL', name: 'Oracle', price: 127.4, change_rate: 1.22, sector: 'Tech', market: 'overseas' },
  { symbol: 'COST', name: 'Costco', price: 889.7, change_rate: 0.48, sector: 'Retail', market: 'overseas' },
  { symbol: 'HD', name: 'Home Depot', price: 342.1, change_rate: -0.33, sector: 'Retail', market: 'overseas' },
  { symbol: 'ABBV', name: 'AbbVie', price: 167.3, change_rate: 0.72, sector: 'Pharma', market: 'overseas' },
  { symbol: 'KO', name: 'Coca-Cola', price: 61.4, change_rate: 0.16, sector: 'Consumer', market: 'overseas' },
  { symbol: 'MRK', name: 'Merck', price: 127.8, change_rate: -1.14, sector: 'Pharma', market: 'overseas' },
  { symbol: 'CVX', name: 'Chevron', price: 151.2, change_rate: -0.58, sector: 'Energy', market: 'overseas' },
  { symbol: 'CRM', name: 'Salesforce', price: 296.4, change_rate: 1.35, sector: 'Tech', market: 'overseas' },
  { symbol: 'AMD', name: 'AMD', price: 168.7, change_rate: 3.21, sector: 'Semiconductor', market: 'overseas' },
  { symbol: 'INTC', name: 'Intel', price: 31.4, change_rate: -2.18, sector: 'Semiconductor', market: 'overseas' },
  { symbol: 'NFLX', name: 'Netflix', price: 628.3, change_rate: 0.87, sector: 'Streaming', market: 'overseas' },
  { symbol: 'ADBE', name: 'Adobe', price: 483.2, change_rate: -0.76, sector: 'Tech', market: 'overseas' },
  { symbol: 'TXN', name: 'Texas Instruments', price: 172.4, change_rate: 0.53, sector: 'Semiconductor', market: 'overseas' },
  { symbol: 'QCOM', name: 'Qualcomm', price: 168.5, change_rate: 1.97, sector: 'Semiconductor', market: 'overseas' },
  { symbol: 'MU', name: 'Micron Technology', price: 117.3, change_rate: 2.44, sector: 'Semiconductor', market: 'overseas' },
  { symbol: 'UBER', name: 'Uber', price: 78.4, change_rate: 1.58, sector: 'Tech', market: 'overseas' },
  { symbol: 'PYPL', name: 'PayPal', price: 62.8, change_rate: -1.23, sector: 'Finance', market: 'overseas' },
  { symbol: 'SQ', name: 'Block (Square)', price: 71.4, change_rate: -0.84, sector: 'Finance', market: 'overseas' },
  { symbol: 'SPOT', name: 'Spotify', price: 248.7, change_rate: 1.12, sector: 'Streaming', market: 'overseas' },
  { symbol: 'ABNB', name: 'Airbnb', price: 147.3, change_rate: 0.69, sector: 'Travel', market: 'overseas' },
  { symbol: 'SHOP', name: 'Shopify', price: 68.4, change_rate: 1.78, sector: 'Commerce', market: 'overseas' },
  { symbol: 'SNOW', name: 'Snowflake', price: 148.2, change_rate: -2.14, sector: 'Tech', market: 'overseas' },
  { symbol: 'PLTR', name: 'Palantir', price: 24.7, change_rate: 3.77, sector: 'AI', market: 'overseas' },
  { symbol: 'ARM', name: 'Arm Holdings', price: 128.4, change_rate: 2.33, sector: 'Semiconductor', market: 'overseas' },
  { symbol: 'SMCI', name: 'Super Micro', price: 873.2, change_rate: 4.51, sector: 'Tech', market: 'overseas' },
  { symbol: 'GS', name: 'Goldman Sachs', price: 468.3, change_rate: 0.44, sector: 'Finance', market: 'overseas' },
  { symbol: 'MS', name: 'Morgan Stanley', price: 97.4, change_rate: 0.28, sector: 'Finance', market: 'overseas' },
  { symbol: 'WFC', name: 'Wells Fargo', price: 57.8, change_rate: 0.61, sector: 'Finance', market: 'overseas' },
  { symbol: 'C', name: 'Citigroup', price: 62.4, change_rate: 0.96, sector: 'Finance', market: 'overseas' },
  { symbol: 'SBUX', name: 'Starbucks', price: 94.7, change_rate: -0.42, sector: 'Consumer', market: 'overseas' },
  { symbol: 'DIS', name: 'Disney', price: 111.3, change_rate: 0.73, sector: 'Media', market: 'overseas' },
]

export const ALL_STOCKS: StockItem[] = [...DOMESTIC_STOCKS, ...OVERSEAS_STOCKS]

export function getDomesticSectors(): string[] {
  return [...new Set(DOMESTIC_STOCKS.map((s) => s.sector))]
}

export function getOverseasSectors(): string[] {
  return [...new Set(OVERSEAS_STOCKS.map((s) => s.sector))]
}
