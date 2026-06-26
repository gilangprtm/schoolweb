"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterPill {
  label: string;
  value: string;
}

interface FilterPillsProps {
  items: FilterPill[];
  activeItem: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterPills({
  items,
  activeItem,
  onChange,
  className,
}: FilterPillsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none",
        className
      )}
    >
      {items.map((item) => {
        const isActive = activeItem === item.value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              isActive
                ? "text-white"
                : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 bg-neutral-50 border border-neutral-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
