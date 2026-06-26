"use client";

import { useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCounterProps {
  value: number;
  label: string;
  icon?: LucideIcon;
  suffix?: string;
  className?: string;
}

export default function StatsCounter({
  value,
  label,
  icon: Icon,
  suffix = "",
  className,
}: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, {
    stiffness: 80,
    damping: 30,
  });

  // Drive spring when in view
  if (isInView) {
    spring.set(value);
  }

  const display = useTransform(spring, (v) => `${Math.floor(v)}${suffix}`);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={cn("text-center", className)}
    >
      {Icon && (
        <div className="mb-2 inline-flex size-10 items-center justify-center rounded-full bg-white/15">
          <Icon className="size-5 text-white" />
        </div>
      )}
      <motion.div
        className="text-4xl md:text-5xl font-heading font-extrabold text-white tabular-nums"
      >
        {display}
      </motion.div>
      <div className="mt-1 text-sm md:text-base text-white/70 font-medium">
        {label}
      </div>
    </motion.div>
  );
}
