"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  pathname: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  items,
  pathname,
}: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-white z-50 lg:hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={onClose}
              >
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                  S1
                </div>
                <span className="font-heading font-bold text-sm">
                  SMPN 17 Denpasar
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Tutup menu"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-2">
              {items.map((item) => {
                if ("dropdown" in item && item.dropdown) {
                  const isExpanded = expandedItem === item.label;
                  const isActive = item.dropdown.some((d) =>
                    pathname.startsWith(d.href)
                  );
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3 text-base font-medium transition-colors",
                          isActive
                            ? "text-primary bg-primary-light"
                            : "text-neutral-700 hover:bg-neutral-50"
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-neutral-50"
                          >
                            {item.dropdown.map((d) => (
                              <Link
                                key={d.href}
                                href={d.href}
                                onClick={onClose}
                                className={cn(
                                  "block pl-10 pr-4 py-2.5 text-sm transition-colors hover:bg-neutral-100",
                                  pathname === d.href &&
                                    "text-primary font-medium bg-primary-light"
                                )}
                              >
                                {d.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href!);

                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    onClick={onClose}
                    className={cn(
                      "block px-4 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary-light"
                        : "text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* CTA at bottom */}
            <div className="p-4 border-t border-neutral-200">
              <Link href="/kontak" onClick={onClose}>
                <Button className="w-full gap-2" size="lg">
                  <Phone className="size-4" />
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
