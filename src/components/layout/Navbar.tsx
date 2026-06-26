"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  {
    label: "Profil",
    dropdown: [
      { label: "Profil & Sejarah", href: "/profil" },
      { label: "Guru & Staf", href: "/guru-dan-staf" },
      { label: "Fasilitas", href: "/fasilitas" },
      { label: "Prestasi", href: "/prestasi" },
    ],
  },
  { label: "Berita", href: "/berita" },
  { label: "SPMB", href: "https://denpasar.spmb.id/" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Check if we're on the homepage for initial transparent state
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // Set initial state
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isTransparent = isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isTransparent
            ? "bg-transparent text-white"
            : "bg-white/95 backdrop-blur-xl shadow-sm text-neutral-800"
        )}
      >
        <nav className="container-custom flex items-center justify-between h-16 md:h-20">
          {/* Logo + School Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.png"
              alt="Logo SMP Negeri 17 Denpasar"
              width={40}
              height={40}
              className={cn(
                "w-10 h-10 rounded-xl object-contain transition-opacity",
                isTransparent
                  ? "bg-white/20"
                  : "bg-transparent"
              )}
            />
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-sm md:text-base leading-tight">
                SMP Negeri 17
              </div>
              <div className="text-xs md:text-sm leading-tight opacity-80">
                Denpasar
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              if ("dropdown" in item && item.dropdown) {
                const isActive = item.dropdown.some((d) =>
                  pathname.startsWith(d.href)
                );
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isTransparent
                          ? "hover:bg-white/10"
                          : "hover:bg-neutral-100",
                        isActive && (isTransparent ? "bg-white/15" : "bg-primary-light text-primary")
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform",
                          dropdownOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 overflow-hidden"
                        >
                          {item.dropdown.map((d) => (
                            <Link
                              key={d.href}
                              href={d.href}
                              className={cn(
                                "block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors",
                                pathname === d.href &&
                                  "text-primary bg-primary-light font-medium"
                              )}
                            >
                              {d.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href!);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href!}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isTransparent
                        ? "hover:bg-white/10"
                        : "hover:bg-neutral-100",
                      isActive &&
                        (isTransparent
                          ? "bg-white/15"
                          : "bg-primary-light text-primary")
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA Button (Desktop) */}
          <div className="hidden lg:block">
            <Link href="/kontak">
              <Button
                variant={isTransparent ? "outline" : "default"}
                size="sm"
                className={cn(
                  "gap-2 rounded-full",
                  isTransparent &&
                    "border-white/40 text-white hover:bg-white/15 hover:border-white/60 bg-transparent"
                )}
              >
                <Phone className="size-4" />
                Hubungi Kami
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isTransparent ? "hover:bg-white/10" : "hover:bg-neutral-100"
            )}
            aria-label="Buka menu"
          >
            <Menu className="size-6" />
          </button>
        </nav>

        {/* Mobile overlay line */}
        {!isTransparent && (
          <div className="h-px bg-neutral-200" />
        )}
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={NAV_ITEMS}
        pathname={pathname}
      />
    </>
  );
}
