import Link from "next/link";
import { cn } from "@/lib/utils";
import { SiteWordmark } from "@/components/SiteWordmark";
import type { Locale } from "@/config/i18n";
import type { Link as ContentLink } from "@/types/content";

interface FooterLink {
  labelEn: string;
  labelEs: string;
  href: string;
}

const NAV_LINKS: FooterLink[] = [
  { labelEn: "About", labelEs: "Sobre mí", href: "#about" },
  { labelEn: "Projects", labelEs: "Proyectos", href: "#projects" },
  { labelEn: "Contact", labelEs: "Contacto", href: "#contact" },
];

interface FooterProps {
  locale: Locale;
  socialLinks?: ContentLink[];
}

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function Footer({ locale, socialLinks = [] }: FooterProps) {
  const label = (link: FooterLink) =>
    locale === "es" ? link.labelEs : link.labelEn;

  const social = socialLinks.filter((link) => hasText(link.url));
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container-page py-12 md:py-16">
        <div
          className={cn(
            "grid grid-cols-1 gap-10",
            social.length > 0 ? "sm:grid-cols-3" : "sm:grid-cols-2",
          )}
        >
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href={`/${locale}`}
              className="hover:opacity-80 transition-opacity"
            >
              <SiteWordmark />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[22ch]">
              {locale === "es"
                ? "Desarrollador full-stack. Buenos Aires, Argentina."
                : "Full-stack developer. Buenos Aires, Argentina."}
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              {locale === "es" ? "Navegación" : "Navigation"}
            </p>
            <ul className="space-y-2.5" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {label(link)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {social.length > 0 && (
            <nav aria-label="Social links">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {locale === "es" ? "Redes" : "Social"}
              </p>
              <ul className="space-y-2.5" role="list">
                {social.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 inline-flex items-center gap-1.5"
                    >
                      {hasText(link.label) ? link.label : link.url.trim()}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Bottom bar */}
        <div
          className={cn(
            "mt-10 pt-6 border-t border-border",
            "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2",
          )}
        >
          <p className="text-xs text-muted-foreground">
            © {year} Alejandro Gómez.{" "}
            {locale === "es"
              ? "Todos los derechos reservados."
              : "All rights reserved."}
          </p>
          <p className="text-xs text-muted-foreground">
            {locale === "es"
              ? "Hecho con Next.js & Tailwind CSS"
              : "Built with Next.js & Tailwind CSS"}
          </p>
        </div>
      </div>
    </footer>
  );
}
