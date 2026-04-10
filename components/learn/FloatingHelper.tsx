'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { GLOSSARY_DATA } from '@/lib/learn/glossary-data'
import TermModal from './TermModal'
import type { GlossaryTerm } from '@/lib/learn/glossary-data'

const FAB_BOTTOM_BASE = 'calc(1rem + env(safe-area-inset-bottom))'
const FAB_SECONDARY_BOTTOM = 'calc(5.5rem + env(safe-area-inset-bottom))'

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
  if (pathname && pathname.includes('/auth')) return null

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
  const [scrolled, setScrolled] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 초기 로드
  useEffect(() => {
    setScraps(loadScraps())
  }, [])

  // 스크롤 감지: 모바일에서 FAB 축소
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
    const matched = GLOSSARY_DATA.find(
      (t) =>
        t.term.toLowerCase() === q ||
        t.id === q ||
        t.term.toLowerCase().includes(q)
    )
    setAnalysisResult({ itemId: item.id, term: matched ?? null })
  }

  // 모바일: 스크롤 시 56px→44px / 데스크톱: 고정 56px
  const fabSizeClass = scrolled
    ? 'w-11 h-11 md:w-14 md:h-14'
    : 'w-14 h-14'

  const fabClass =
    'fixed z-40 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 ' +
    'right-4 md:right-6 ' +
    fabSizeClass + ' ' +
    (scrapeMode
      ? 'bg-yellow-400 hover:bg-yellow-500 scale-110'
      : 'bg-blue-600 hover:bg-blue-700 hover:scale-110') + ' ' +
    (!scrolled && !panelOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100')

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
          className="fixed left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg"
          style={{ bottom: 'calc(9rem + env(safe-area-inset-bottom))' }}
        >
          {toast}
        </div>
      )}

      {/* FAB 버튼 (메인) */}
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
        style={{ bottom: FAB_BOTTOM_BASE }}
      >
        <span className={scrolled ? 'text-base md:text-xl' : 'text-xl'} aria-hidden="true">
          {scrapeMode ? '✋' : '📖'}
        </span>
      </button>

      {/* 보조 스크랩 버튼 — 모바일 기본 숨김, md 이상에서만 노출 */}
      {!panelOpen && (
        <button
          onClick={toggleScrapeMode}
          aria-label={scrapeMode ? '스크랩 모드 취소' : '텍스트 스크랩'}
          className={
            'hidden md:flex fixed z-40 items-center justify-center rounded-full shadow-lg transition-all duration-200 ' +
            'right-6 w-10 h-10 ' +
            (scrapeMode ? 'bg-yellow-400 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')
          }
          style={{ bottom: FAB_SECONDARY_BOTTOM }}
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

      {/* 스크랩 패널 */}
      {panelOpen && (
        <aside
          role="complementary"
          aria-label="스크랩 패널"
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-white shadow-2xl
                     md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:w-80 md:rounded-none md:rounded-l-2xl"
          style={{ maxHeight: '70vh' }}
        >
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

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {scraps.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                <p className="mb-2 text-3xl">✂️</p>
                <p>스크랩된 텍스트가 없습니다.</p>
              </div>
            ) : (
              <ul className="space-y-3 pt-2">
                {scraps.map((item) => (
                  <li key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex-1 text-sm text-gray-800 line-clamp-3">{item.text}</p>
                      <button onClick={() => deleteScrap(item.id)} className="text-gray-300 hover:text-red-400">✕</button>
                    </div>
                    <button
                      onClick={() => analyzeScrap(item)}
                      className="mt-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-sm ring-1 ring-blue-100 hover:bg-blue-50"
                    >
                      용어 분석
                    </button>
                    {analysisResult?.itemId === item.id && (
                      <div className="mt-2">
                        {analysisResult.term ? (
                          <button
                            onClick={() => setModalTerm(analysisResult.term)}
                            className="w-full rounded-lg bg-blue-50 px-3 py-2 text-left text-xs text-blue-700 hover:bg-blue-100"
                          >
                            <span className="font-semibold">{analysisResult.term.term}</span>
                            <p className="mt-0.5 text-gray-500 line-clamp-2">{analysisResult.term.short_definition}</p>
                          </button>
                        ) : (
                          <p className="rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-600">사전에 없는 용어입니다.</p>
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

      <TermModal term={modalTerm} onClose={() => setModalTerm(null)} />
    </>
  )
}
