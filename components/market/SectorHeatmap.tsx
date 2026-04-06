// @TASK P2-S2-T1
export interface Sector {
  id: number
  name: string
  change_rate: number
  color: string
}

export default function SectorHeatmap({ sectors }: { sectors: Sector[] }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">섹터 히트맵</h3>
      <div className="grid grid-cols-4 gap-2">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className={`${sector.color} rounded-lg p-2 flex flex-col items-center justify-center`}
          >
            <span className="text-xs font-medium text-white">{sector.name}</span>
            <span className="text-xs text-white/80">
              {sector.change_rate >= 0 ? '+' : ''}{sector.change_rate.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
