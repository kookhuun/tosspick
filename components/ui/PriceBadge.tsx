interface PriceBadgeProps {
  changeRate: number
}

export default function PriceBadge({ changeRate }: PriceBadgeProps) {
  const formatted = `${changeRate >= 0 ? '+' : ''}${changeRate.toFixed(2)}%`

  const colorClass =
    changeRate > 0
      ? 'text-green-600 bg-green-50'
      : changeRate < 0
        ? 'text-red-600 bg-red-50'
        : 'text-gray-600 bg-gray-50'

  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {formatted}
    </span>
  )
}
