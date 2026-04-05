type Direction = 'positive' | 'negative' | 'neutral'

interface ImpactBadgeProps {
  direction: Direction
}

const CONFIG: Record<Direction, { label: string; className: string }> = {
  positive: { label: '긍정', className: 'text-green-700 bg-green-100' },
  negative: { label: '부정', className: 'text-red-700 bg-red-100' },
  neutral: { label: '중립', className: 'text-gray-700 bg-gray-100' },
}

export default function ImpactBadge({ direction }: ImpactBadgeProps) {
  const { label, className } = CONFIG[direction]
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
