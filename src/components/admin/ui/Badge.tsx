import { cn } from "@/lib/utils"

const variants = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-neutral-100 text-neutral-700 border-neutral-200",
  destructive: "bg-red-100 text-red-700 border-red-200",
  outline: "bg-transparent text-neutral-600 border-neutral-300",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
}

interface BadgeProps {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
