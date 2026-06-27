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
    <div className={cn("flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-neutral-500">{title}</p>
        <p className="text-xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>{value}</p>
        {trend && (
          <p className={cn("text-xs font-medium", trend.positive ? "text-emerald-600" : "text-red-600")}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
    </div>
  )
}
