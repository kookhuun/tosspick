"use client"

import { useState } from 'react'

export default function BaboPage() {
  const [emojiPos, setEmojiPos] = useState<{ x: number, y: number } | null>(null)

  const handleBaboClick = () => {
    // 랜덤 좌표 생성 (화면 내부 10%~90% 범위 권장)
    const randomX = Math.floor(Math.random() * 80) + 10
    const randomY = Math.floor(Math.random() * 80) + 10
    
    setEmojiPos({ x: randomX, y: randomY })

    // 5초 후 사라지게 함
    setTimeout(() => {
      setEmojiPos(null)
    }, 5000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 p-6 text-center">
      <span className="text-6xl animate-bounce">🤪</span>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
        안국현바보 페이지
      </h1>
      <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
        이곳은 안국현바보를 위한 특별한 공간입니다. 
        아무런 기능은 없지만, 존재만으로 충분합니다.
      </p>

      {/* 새 버튼 추가 */}
      <div className="flex flex-col gap-3 mt-4">
        <button 
          onClick={handleBaboClick}
          className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
        >
          국현이바보
        </button>
        
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-full text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
        >
          뒤로가기
        </button>
      </div>

      {/* 랜덤 위치에 나타나는 강아지 이모지 */}
      {emojiPos && (
        <div 
          className="fixed pointer-events-none z-50 transition-opacity duration-300 animate-in fade-in zoom-in"
          style={{ 
            left: `${emojiPos.x}%`, 
            top: `${emojiPos.y}%`,
            fontSize: '4rem'
          }}
        >
          🐶
        </div>
      )}
    </div>
  )
}
