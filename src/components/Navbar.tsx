"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { slideInLeft, stagger } from "@/lib/motion";
import type { Locale } from "@/config/i18n";

// ---------------------------------------------------------------------------
// Nav links — keyed so the active state can highlight any route
// ---------------------------------------------------------------------------
interface NavLink {
  labelEn: string;
  labelEs: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { labelEn: "About", labelEs: "Sobre mí", href: "#about" },
  { labelEn: "Experience", labelEs: "Experiencia", href: "#experience" },
  { labelEn: "Projects", labelEs: "Proyectos", href: "#projects" },
  { labelEn: "Services", labelEs: "Servicios", href: "#services" },
  { labelEn: "Contact", labelEs: "Contacto", href: "#contact" },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface NavbarProps {
  locale: Locale;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Shadow the nav on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const label = (link: NavLink) =>
    locale === "es" ? link.labelEs : link.labelEn;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 nav-glass",
          "transition-shadow duration-300",
          scrolled && "shadow-sm",
        )}
        style={{ height: "var(--nav-height)" }}
      >
        <nav
          className="container-page h-full flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo / wordmark */}
          <Link
            href={`/${locale}`}
            className="text-[15px] font-semibold tracking-tight hover:opacity-70 transition-opacity"
            aria-label="Go to homepage"
          >
            alejo<span className="text-muted-foreground">.</span>dev
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-accent transition-colors duration-150",
                  )}
                >
                  {label(link)}
                </a>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className={cn(
                "md:hidden size-9 rounded-full flex items-center justify-center",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                "transition-colors duration-150",
              )}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
              {/* Animated bars */}
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <motion.line
                  x1="2"
                  y1="5"
                  x2="16"
                  y2="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={
                    menuOpen
                      ? { y1: 9, y2: 9, rotate: 45 }
                      : { y1: 5, y2: 5, rotate: 0 }
                  }
                  style={{ originX: "9px", originY: "9px" }}
                  transition={{ duration: 0.2 }}
                />
                <motion.line
                  x1="2"
                  y1="9"
                  x2="16"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={{ opacity: menuOpen ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.line
                  x1="2"
                  y1="13"
                  x2="16"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={
                    menuOpen
                      ? { y1: 9, y2: 9, rotate: -45 }
                      : { y1: 13, y2: 13, rotate: 0 }
                  }
                  style={{ originX: "9px", originY: "9px" }}
                  transition={{ duration: 0.2 }}
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-background/95 backdrop-blur-xl"
            style={{ paddingTop: "var(--nav-height)" }}
          >
            <motion.ul
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="container-page pt-8 flex flex-col gap-1"
              role="list"
            >
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} variants={slideInLeft}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3.5 rounded-xl",
                      "text-lg font-medium text-foreground",
                      "hover:bg-accent transition-colors duration-150",
                    )}
                  >
                    {label(link)}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
