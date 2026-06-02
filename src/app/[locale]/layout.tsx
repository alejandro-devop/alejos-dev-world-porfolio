import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, defaultLocale } from "@/config/i18n";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/lib/content";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocaleTransition } from "@/components/LocaleTransition";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { JsonLd } from "@/components/JsonLd";
import { ThemeInitScript } from "@/components/ThemeInitScript";
import { ThemeColorMeta } from "@/components/ThemeColorMeta";
import type { LocaleLayoutProps } from "@/types";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Build per-locale metadata including hreflang alternates, OG, and Twitter. */
export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (locales as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : defaultLocale;

  const seo = await getSeo(locale);
  const canonicalUrl = `${siteConfig.url}/${locale}`;

  // Build alternate language map for hreflang.
  const languages: Record<string, string> = {
    "x-default": `${siteConfig.url}/${defaultLocale}`,
  };
  for (const l of locales) {
    languages[l] = `${siteConfig.url}/${l}`;
  }

  return {
    title: {
      default: seo.title,
      template: `%s | ${seo.title}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: seo.title,
      description: seo.description,
      locale: locale === "es" ? "es_AR" : "en_US",
      alternateLocale: locale === "en" ? ["es_AR"] : ["en_US"],
      images: [
        {
          url: seo.ogImage.url,
          width: seo.ogImage.width,
          height: seo.ogImage.height,
          alt: seo.ogImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      creator: seo.twitterHandle,
      images: [seo.ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;

  // Narrow the string to a known Locale; unknown values trigger 404.
  if (!(locales as readonly string[]).includes(rawLocale)) notFound();
  const locale = rawLocale as (typeof locales)[number];

  // JSON-LD: Person + WebSite structured data for the portfolio.
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alejandro Gómez",
    url: siteConfig.url,
    jobTitle:
      locale === "es" ? "Desarrollador Full-Stack" : "Full-Stack Developer",
    sameAs: [
      "https://github.com/alejogdev",
      "https://linkedin.com/in/alejogdev",
      "https://twitter.com/alejogdev",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-background text-foreground`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme init must be in <head> as a native <script> so React 19 knows
            its position in the document and avoids the sync-script ordering warning. */}
        <ThemeInitScript />
        <ThemeColorMeta />
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Fixed animated background — rendered below all content */}
          <BackgroundEffects />
          {/* z-[1] ensures content stacks above the z-0 background */}
          <div className="relative z-[1] flex flex-col flex-1 min-h-full">
            <LocaleTransition>
              {/* Top padding offsets the fixed navbar */}
              <Navbar locale={locale} />
              <main
                className="flex-1 flex flex-col"
                style={{ paddingTop: "var(--nav-height)" }}
              >
                {children}
              </main>
              <Footer locale={locale} />
            </LocaleTransition>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
