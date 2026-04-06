'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { GLOSSARY_TERMS } from '@/lib/learn/glossary-data'
import TermModal from './TermModal'
import type { GlossaryTerm } from '@/lib/learn/glossary-data'

const MAX_SCRAPS = 20

interface ScrapItem {
  id: string
  text: string
  createdAt: number
}

function loadScraps(): ScrapItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('tosspick_scraps')
    return raw ? (JSON.parse(raw) as ScrapItem[]) : []
  } catch {
    return []
  }
}

function saveScraps(items: ScrapItem[]) {
  try {
    localStorage.setItem('tosspick_scraps', JSON.stringify(items))
  } catch {
    // localStorage 쓰기 실패 무시
  }
}

export default function FloatingHelper() {
  const pathname = usePathname()

  // /auth 경로면 렌더링 안 함
  if (pathname.includes('/auth')) return null

  return <FloatingHelperInner />
}

function FloatingHelperInner() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [scrapeMode, setScrapeMode] = useState(false)
  const [scraps, setScraps] = useState<ScrapItem[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<{
    itemId: string
    term: GlossaryTerm | null
  } | null>(null)
  const [modalTerm, setModalTerm] = useState<GlossaryTerm | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 초기 로드
  useEffect(() => {
    setScraps(loadScraps())
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), 2500)
  }, [])

  // 스크랩 모드: mouseup 이벤트로 텍스트 캡처
  useEffect(() => {
    if (!scrapeMode) return

    function handleMouseUp() {
      const selection = window.getSelection()
      const text = selection?.toString().trim() ?? ''
      if (text.length < 2) return

      setScraps((prev) => {
        const newItem: ScrapItem = {
          id: `${Date.now()}-${Math.random()}`,
          text: text.slice(0, 200),
          createdAt: Date.now(),
        }
        const updated = [newItem, ...prev].slice(0, MAX_SCRAPS)
        saveScraps(updated)
        return updated
      })

      showToast(`"${text.slice(0, 20)}${text.length > 20 ? '…' : ''}" 스크랩됨`)
      setScrapeMode(false)
      setPanelOpen(true)
      selection?.removeAllRanges()
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [scrapeMode, showToast])

  function toggleScrapeMode() {
    if (panelOpen) {
      setPanelOpen(false)
      return
    }
    setScrapeMode((v) => !v)
    if (!scrapeMode) {
      showToast('텍스트를 선택하세요')
    }
  }

  function deleteScrap(id: string) {
    setScraps((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      saveScraps(updated)
      return updated
    })
    if (analysisResult?.itemId === id) setAnalysisResult(null)
  }

  function analyzeScrap(item: ScrapItem) {
    const q = item.text.toLowerCase().trim()
    const matched = GLOSSARY_TERMS.find(
      (t) =>
        t.term.toLowerCase() === q ||
        t.term_en?.toLowerCase() === q ||
        t.id === q ||
        t.term.toLowerCase().includes(q) ||
        (t.term_en?.toLowerCase().includes(q) ?? false)
    )
    setAnalysisResult({ itemId: item.id, term: matched ?? null })
  }

  const fabClass =
    'fixed z-40 flex items-center justify-center rounded-full shadow-xl transition-all duration-200 ' +
    'bottom-20 right-4 w-14 h-14 md:bottom-6 md:right-6 ' +
    (scrapeMode
      ? 'bg-yellow-400 hover:bg-yellow-500 scale-110'
      : 'bg-blue-600 hover:bg-blue-700 hover:scale-110')

  return (
    <>
      {/* 스크랩 모드 오버레이 */}
      {scrapeMode && (
        <div
          className="pointer-events-none fixed inset-0 z-30 bg-blue-600/5 ring-2 ring-inset ring-blue-400/30"
          aria-hidden="true"
        />
      )}

      {/* 토스트 */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-36 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg md:bottom-20"
        >
          {toast}
        </div>
      )}

      {/* FAB 버튼 */}
      <button
        onClick={() => {
          if (panelOpen) {
            setPanelOpen(false)
          } else {
            setPanelOpen(true)
            setScrapeMode(false)
          }
        }}
        aria-label="스크랩 패널 열기"
        className={fabClass}
      >
        <span className="text-xl" aria-hidden="true">
          {scrapeMode ? '✋' : '📖'}
        </span>
      </button>

      {/* 스크랩 버튼 (패널 닫혀 있을 때만) */}
      {!panelOpen && (
        <button
          onClick={toggleScrapeMode}
          aria-label={scrapeMode ? '스크랩 모드 취소' : '텍스트 스크랩'}
          className={
            'fixed z-40 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 ' +
            'bottom-36 right-4 w-10 h-10 md:bottom-22 md:right-6 ' +
            (scrapeMode ? 'bg-yellow-400 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')
          }
        >
          <span className="text-sm" aria-hidden="true">
            {scrapeMode ? '✕' : '✂️'}
          </span>
        </button>
      )}

      {/* 스크랩 패널 오버레이 */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setPanelOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 스크랩 패널 — 모바일: 하단 시트, 데스크톱: 우측 사이드 패널 */}
      {panelOpen && (
        <aside
          role="complementary"
          aria-label="스크랩 패널"
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-white shadow-2xl
                     md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:w-80 md:rounded-none md:rounded-l-2xl"
          style={{ maxHeight: '70vh' }}
        >
          {/* 패널 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">
              내 스크랩
              <span className="ml-1.5 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                {scraps.length}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setScrapeMode(true)
                  setPanelOpen(false)
                  showToast('텍스트를 선택하세요')
                }}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                + 스크랩
              </button>
              <button
                onClick={() => setPanelOpen(false)}
                aria-label="패널 닫기"
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 드래그 핸들 (모바일) */}
          <div className="flex justify-center py-1 md:hidden">
            <div className="h-1 w-10 rounded-full bg-gray-200" aria-hidden="true" />
          </div>

          {/* 스크랩 목록 */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {scraps.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                <p className="mb-2 text-3xl">✂️</p>
                <p>스크랩된 텍스트가 없습니다.</p>
                <p className="mt-1 text-xs">
                  위의 + 스크랩 버튼을 눌러<br />
                  페이지의 텍스트를 선택하세요.
                </p>
              </div>
            ) : (
              <ul className="space-y-3 pt-2">
                {scraps.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex-1 text-sm leading-relaxed text-gray-800 line-clamp-3">
                        {item.text}
                      </p>
                      <button
                        onClick={() => deleteScrap(item.id)}
                        aria-label="스크랩 삭제"
                        className="flex-shrink-0 text-gray-300 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>

                    <button
                      onClick={() => analyzeScrap(item)}
                      className="mt-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-sm ring-1 ring-blue-100 hover:bg-blue-50"
                    >
                      용어 분석
                    </button>

                    {/* 분석 결과 */}
                    {analysisResult?.itemId === item.id && (
                      <div className="mt-2">
                        {analysisResult.term ? (
                          <button
                            onClick={() => {
                              setModalTerm(analysisResult.term)
                            }}
                            className="w-full rounded-lg bg-blue-50 px-3 py-2 text-left text-xs text-blue-700 hover:bg-blue-100"
                          >
                            <span className="font-semibold">
                              {analysisResult.term.term}
                            </span>
                            <span className="ml-1 text-blue-500">→ 설명 보기</span>
                            <p className="mt-0.5 text-gray-500 line-clamp-2">
                              {analysisResult.term.short_def}
                            </p>
                          </button>
                        ) : (
                          <p className="rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-600">
                            이 용어는 아직 사전에 없습니다. 더 많은 용어가 추가될 예정입니다.
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      )}

      {/* 스크랩 분석으로 열린 용어 모달 */}
      <TermModal
        term={modalTerm}
        onClose={() => setModalTerm(null)}
        onTermClick={(id) => {
          const found = GLOSSARY_TERMS.find((t) => t.id === id)
          if (found) setModalTerm(found)
        }}
      />
    </>
  )
}
