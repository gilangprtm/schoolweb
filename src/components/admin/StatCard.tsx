import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  className?: string
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20",
      className
    )}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-card-foreground tracking-tight">{value}</p>
        {trend && (
          <p className={cn("text-xs font-medium mt-0.5", trend.positive ? "text-emerald-600" : "text-red-500")}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
    </div>
  )
}
