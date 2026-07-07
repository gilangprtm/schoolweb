import Link from "next/link";
import { cn } from "@/lib/utils";
import { FileX, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon = FileX,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 md:py-20 px-4",
        className,
      )}
    >
      <div className="size-20 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
        <Icon className="size-10 text-neutral-300" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-neutral-700 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-neutral-500 max-w-md mb-6">{description}</p>
      )}
    </div>
  );
}
