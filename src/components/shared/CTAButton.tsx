import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface CTAButtonProps {
  label: string;
  href: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "lg";
  external?: boolean;
  className?: string;
  showArrow?: boolean;
}

export default function CTAButton({
  label,
  href,
  variant = "primary",
  size = "default",
  external,
  className,
  showArrow,
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center gap-2 font-medium rounded-full transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-700 shadow-lg shadow-primary/25 hover:shadow-primary/40",
    outline:
      "border-2 border-white/40 text-white hover:bg-white/15 hover:border-white/60 bg-transparent",
    ghost:
      "text-primary hover:bg-primary-light hover:text-primary-700",
  };

  const sizes = {
    default: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const Component = external ? "a" : Link;
  const extraProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Component
      href={href}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...extraProps}
    >
      {label}
      {showArrow && <ArrowRight className="size-4" />}
    </Component>
  );
}
