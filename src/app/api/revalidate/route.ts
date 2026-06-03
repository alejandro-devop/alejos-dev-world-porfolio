import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type { ContentKey } from "@/types/content";
import { getContentCacheTags } from "@/config/backend";

const ALL_SECTIONS: ContentKey[] = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "services",
  "testimonials",
  "blog",
  "seo",
];

/**
 * On-demand cache purge for CMS content fetched by the portfolio.
 *
 * POST /api/revalidate?secret=YOUR_SECRET
 * Body (optional JSON): { "locale": "es", "sections": ["hero"] }
 *
 * Omit body fields to revalidate all locales and sections.
 */
export async function POST(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { status: false, errors: ["Unauthorized"] },
      { status: 401 },
    );
  }

  let locale: string | undefined;
  let sections: ContentKey[] | undefined;

  try {
    const body = (await request.json()) as {
      locale?: string;
      sections?: ContentKey[];
    };
    locale = body.locale;
    sections = body.sections;
  } catch {
    // Empty body is valid — revalidate everything.
  }

  const tags = new Set<string>();

  if (locale && sections?.length) {
    for (const tag of getContentCacheTags(locale, sections)) {
      tags.add(tag);
    }
  } else if (locale) {
    tags.add("portfolio-content");
    tags.add(`portfolio-content-${locale}`);
    for (const section of ALL_SECTIONS) {
      tags.add(`portfolio-content-${locale}-${section}`);
    }
  } else {
    tags.add("portfolio-content");
    for (const loc of ["en", "es"] as const) {
      tags.add(`portfolio-content-${loc}`);
      for (const section of ALL_SECTIONS) {
        tags.add(`portfolio-content-${loc}-${section}`);
      }
    }
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({
    status: true,
    revalidatedTags: [...tags],
  });
}
