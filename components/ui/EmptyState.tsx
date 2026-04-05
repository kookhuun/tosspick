interface EmptyStateProps {
  message: string
  description?: string
}

export default function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-base font-medium text-gray-900">{message}</p>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
    </div>
  )
}
