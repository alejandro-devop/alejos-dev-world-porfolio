import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getHero } from "@/lib/content";
import { defaultLocale } from "@/config/i18n";

/**
 * GET /og.png — social card (Open Graph / Twitter).
 *
 * The URL is referenced by `seo.ogImage.url` in every locale, so it must stay
 * exactly `/og.png`. Rendered once per deploy (force-static); name and tagline
 * come from the CMS with a hardcoded fallback so the card never 404s again.
 */
export const dynamic = "force-static";

const WIDTH = 1200;
const HEIGHT = 630;

const FALLBACK_NAME = "Alejandro Quiroz";
const FALLBACK_TAGLINE =
  "Full-Stack Developer building fast, accessible web experiences.";

async function loadHeroCopy() {
  try {
    const hero = await getHero(defaultLocale);
    return {
      name: hero.name.trim() || FALLBACK_NAME,
      tagline: hero.tagline.trim() || FALLBACK_TAGLINE,
    };
  } catch {
    return { name: FALLBACK_NAME, tagline: FALLBACK_TAGLINE };
  }
}

export async function GET() {
  const [{ name, tagline }, outfitRegular, outfitSemiBold] = await Promise.all([
    loadHeroCopy(),
    readFile(join(process.cwd(), "assets/fonts/Outfit-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Outfit-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          fontFamily: "Outfit",
          color: "#f4f4f8",
          backgroundColor: "#08080f",
          backgroundImage:
            "radial-gradient(ellipse 60% 55% at 18% 8%, rgba(76, 81, 191, 0.38), transparent 70%), radial-gradient(ellipse 55% 50% at 88% 18%, rgba(124, 58, 237, 0.28), transparent 70%), radial-gradient(ellipse 65% 55% at 55% 100%, rgba(20, 184, 166, 0.16), transparent 72%)",
        }}
      >
        {/* Wave traces, echoing BackgroundEffects */}
        <svg
          width={WIDTH}
          height="150"
          viewBox="0 0 1440 120"
          style={{ position: "absolute", top: 60, left: 0, opacity: 0.55 }}
        >
          <path
            d="M0,65 C80,28 190,95 320,48 C430,12 530,88 670,44 C790,14 900,82 1020,52 C1140,24 1300,78 1440,58"
            fill="none"
            stroke="#6d6ff0"
            strokeWidth="2.5"
          />
          <path
            d="M0,74 C80,37 190,104 320,57 C430,21 530,97 670,53 C790,23 900,91 1020,61 C1140,33 1300,87 1440,67"
            fill="none"
            stroke="#6d6ff0"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
        </svg>
        <svg
          width={WIDTH}
          height="150"
          viewBox="0 0 1440 120"
          style={{ position: "absolute", bottom: 30, left: 0, opacity: 0.4 }}
        >
          <path
            d="M0,58 C140,98 270,18 410,64 C520,98 660,18 780,56 C920,96 1060,16 1190,62 C1310,98 1400,42 1440,60"
            fill="none"
            stroke="#8b7cf6"
            strokeWidth="2"
          />
        </svg>

        {/* Wordmark */}
        <div style={{ display: "flex", fontSize: 34, fontWeight: 600 }}>
          <span style={{ color: "#f4f4f8" }}>Alejo</span>
          <span style={{ color: "#818cf8" }}>Dev</span>
        </div>

        {/* Name */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 92,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {name}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            maxWidth: 860,
            fontSize: 34,
            fontWeight: 400,
            lineHeight: 1.35,
            color: "#a6a6bd",
          }}
        >
          {tagline}
        </div>

        {/* Footer: domain */}
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 26,
            color: "#6d6ff0",
          }}
        >
          me.alejosworld.com
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Outfit", data: outfitRegular, style: "normal", weight: 400 },
        { name: "Outfit", data: outfitSemiBold, style: "normal", weight: 600 },
      ],
    },
  );
}
