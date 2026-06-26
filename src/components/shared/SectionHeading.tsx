import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean; // White text variant for dark backgrounds
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  light,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" && "text-center",
        className
      )}
    >
      <h2
        className={cn(
          "font-heading text-3xl md:text-4xl font-bold mb-3",
          light ? "text-white" : "text-neutral-900"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "h-1 w-16 rounded-full mb-4",
          align === "center" && "mx-auto",
          light
            ? "bg-gradient-to-r from-white/80 to-white/40"
            : "bg-gradient-to-r from-primary to-secondary"
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "text-base md:text-lg max-w-2xl",
            align === "center" && "mx-auto",
            light ? "text-white/80" : "text-neutral-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
