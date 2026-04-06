// Ingest API 공통 인증
// INGEST_API_KEY 환경변수와 Authorization: Bearer <key> 헤더 검증

export function verifyIngestKey(request: Request): boolean {
  const key = process.env.INGEST_API_KEY
  if (!key) return false // 키 미설정 시 모든 요청 차단
  return request.headers.get('Authorization') === `Bearer ${key}`
}
