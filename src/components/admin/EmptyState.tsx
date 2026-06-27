import Link from "next/link"
import { type LucideIcon, Plus } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <Icon className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          <Link href={actionHref} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            <Plus className="h-4 w-4" /> {actionLabel}
          </Link>
        </div>
      )}
    </div>
  )
}
