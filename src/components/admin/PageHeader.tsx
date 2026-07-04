import Link from "next/link"
import { Plus } from "lucide-react"

interface PageHeaderProps {
  title: string
  breadcrumbs?: { label: string; href: string }[]
  actionLabel?: string
  actionHref?: string
}

export function PageHeader({ title, actionLabel, actionHref }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> {actionLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
