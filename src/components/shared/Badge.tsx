import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "accent" | "outline" | "success" | "warning";
  className?: string;
}

const variantStyles = {
  primary: "bg-primary text-white hover:bg-primary-700 border-transparent",
  secondary: "bg-secondary text-white hover:bg-secondary-700 border-transparent",
  accent: "bg-accent text-accent-foreground hover:bg-accent-600 border-transparent",
  outline: "border-neutral-300 text-neutral-600 hover:bg-neutral-100",
  success: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
  warning: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
};

export default function Badge({ label, variant = "primary", className }: BadgeProps) {
  return (
    <ShadcnBadge
      variant="outline"
      className={cn("font-medium text-xs px-2.5 py-0.5", variantStyles[variant], className)}
    >
      {label}
    </ShadcnBadge>
  );
}
