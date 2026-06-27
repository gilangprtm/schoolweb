import Link from "next/link"
import { ChevronRight, Plus } from "lucide-react"

interface BreadcrumbLink { label: string; href: string }

interface PageHeaderProps {
  title: string
  breadcrumbs: BreadcrumbLink[]
  actionLabel?: string
  actionHref?: string
}

export function PageHeader({ title, breadcrumbs, actionLabel, actionHref }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <nav className="mb-1 flex items-center gap-1.5 text-sm text-neutral-500">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />}
            {i < breadcrumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:text-neutral-700">{crumb.label}</Link>
            ) : (
              <span className="font-medium text-neutral-800">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h1>
        {actionLabel && actionHref && (
          <Link href={actionHref} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> {actionLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
