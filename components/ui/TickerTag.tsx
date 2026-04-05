import Link from 'next/link'

interface TickerTagProps {
  symbol: string
  name: string
}

export default function TickerTag({ symbol, name }: TickerTagProps) {
  return (
    <Link
      href={`/stock/${symbol}`}
      className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
    >
      {name}
    </Link>
  )
}
