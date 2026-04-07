"use client"

export default function BaboPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 p-6 text-center">
      <span className="text-6xl animate-bounce">🤪</span>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
        안국현바보 페이지
      </h1>
      <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
        이곳은 안국현바보를 위한 특별한 공간입니다. 
        아무런 기능은 없지만, 존재만으로 충분합니다.
      </p>
      <button 
        onClick={() => window.history.back()}
        className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all active:scale-95"
      >
        뒤로가기
      </button>
    </div>
  )
}
