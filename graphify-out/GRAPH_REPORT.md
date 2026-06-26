# Graph Report - alejos-dev-world  (2026-06-26)

## Corpus Check
- Corpus is ~33,964 words - fits in a single context window. You may not need a graph.

## Summary
- 379 nodes · 777 edges · 26 communities (15 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Hero & Avatar Components|Hero & Avatar Components]]
- [[_COMMUNITY_Dependencies & Packages|Dependencies & Packages]]
- [[_COMMUNITY_Section Props & i18n Locale|Section Props & i18n Locale]]
- [[_COMMUNITY_Backend Config & API|Backend Config & API]]
- [[_COMMUNITY_Navbar & Language Switcher|Navbar & Language Switcher]]
- [[_COMMUNITY_App Router & Metadata|App Router & Metadata]]
- [[_COMMUNITY_Background Effects|Background Effects]]
- [[_COMMUNITY_Component Aliases & Hooks|Component Aliases & Hooks]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Admin API Integration|Admin API Integration]]
- [[_COMMUNITY_Footer|Footer]]
- [[_COMMUNITY_Glass Design System|Glass Design System]]
- [[_COMMUNITY_Next.js Config & CSP|Next.js Config & CSP]]
- [[_COMMUNITY_CV & Resume Assets|CV & Resume Assets]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Backend Rollout Docs|Backend Rollout Docs]]
- [[_COMMUNITY_Blog Section|Blog Section]]
- [[_COMMUNITY_Env Local|Env Local]]
- [[_COMMUNITY_File Icon|File Icon]]
- [[_COMMUNITY_Globe Icon|Globe Icon]]
- [[_COMMUNITY_Avatar Image|Avatar Image]]
- [[_COMMUNITY_Next.js Logo|Next.js Logo]]
- [[_COMMUNITY_Vercel Logo|Vercel Logo]]
- [[_COMMUNITY_Window Icon|Window Icon]]

## God Nodes (most connected - your core abstractions)
1. `Locale` - 34 edges
2. `cn()` - 34 edges
3. `Framer Motion` - 21 edges
4. `compilerOptions` - 16 edges
5. `loadContent()` - 14 edges
6. `defaultViewport` - 13 edges
7. `fadeUp` - 12 edges
8. `getBlog()` - 11 edges
9. `getAllContent()` - 11 edges
10. `SectionHeader()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `alejos-dev-world Portfolio` --uses--> `Geist Font`  [EXTRACTED]
  AGENTS.md → README.md
- `alejos-dev-world Portfolio` --uses--> `Tailwind CSS`  [EXTRACTED]
  AGENTS.md → DESIGN.md
- `alejos-dev-world Portfolio` --uses--> `Vercel Deployment Platform`  [EXTRACTED]
  AGENTS.md → README.md
- `generateMetadata()` --calls--> `getSeo()`  [EXTRACTED]
  src/app/[locale]/blog/page.tsx → src/lib/content.ts
- `LanguageSwitcherProps` --references--> `Locale`  [EXTRACTED]
  src/components/LanguageSwitcher.tsx → src/config/i18n.ts

## Import Cycles
- None detected.

## Communities (26 total, 11 thin omitted)

### Community 0 - "Hero & Avatar Components"
Cohesion: 0.09
Nodes (43): AnimatedHeroName(), AnimatedHeroNameInner(), AnimatedHeroNameProps, HeroAvatar(), HeroAvatarProps, HeroIntro(), HeroIntroProps, Framer Motion (+35 more)

### Community 1 - "Dependencies & Packages"
Cohesion: 0.04
Nodes (45): dependencies, @base-ui/react, class-variance-authority, clsx, framer-motion, lucide-react, next, next-themes (+37 more)

### Community 2 - "Section Props & i18n Locale"
Cohesion: 0.08
Nodes (35): Locale, AboutSectionProps, BlogSectionProps, ContactSectionProps, ExperienceSectionProps, HeroSectionProps, ProjectsSectionProps, LEVEL_DOTS (+27 more)

### Community 3 - "Backend Config & API"
Cohesion: 0.15
Nodes (33): BackendConfig, DEFAULT_BACKEND_SECTIONS, getBackendBulkContentUrl(), getBackendConfig(), getBackendSections(), getContentCacheTags(), getContentFetchInit(), isBackendEnabled() (+25 more)

### Community 4 - "Navbar & Language Switcher"
Cohesion: 0.10
Nodes (24): LanguageSwitcher(), LanguageSwitcherProps, useLocaleTransition(), NAV_LINKS, Navbar(), NavbarPosition, NavbarProps, NavLink (+16 more)

### Community 5 - "App Router & Metadata"
Cohesion: 0.11
Nodes (15): BlogListPage(), generateMetadata(), JsonLd(), locales, siteConfig, getBlog(), BlogPostPage(), BlogPostPageProps (+7 more)

### Community 6 - "Background Effects"
Cohesion: 0.09
Nodes (21): BackgroundEffects(), DRIFT_CLASSES, MORPH_DURATIONS, useMediaQuery(), WAVES, LocaleTransition(), LocaleTransitionContext, LocaleTransitionContextValue (+13 more)

### Community 7 - "Component Aliases & Hooks"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "Admin API Integration"
Cohesion: 0.11
Nodes (19): Admin API, alejos-dev-world Portfolio, src/config/backend.ts, BACKEND_SECTIONS Env Var, BACKEND_URL Env Var, Content Loaders, src/lib/content.ts, src/data/index.ts (+11 more)

### Community 10 - "Footer"
Cohesion: 0.24
Nodes (7): Footer(), FooterLink, FooterProps, NAV_LINKS, SiteWordmark(), SiteWordmarkProps, Link

### Community 11 - "Glass Design System"
Cohesion: 0.22
Nodes (9): backdrop-filter CSS, BackgroundEffects Component, .glass-card CSS Class, src/app/globals.css, HeroSection Component, Home Page, OKLCH Color Tokens, Orbs Background Layer (+1 more)

### Community 12 - "Next.js Config & CSP"
Cohesion: 0.50
Nodes (3): ContentSecurityPolicy, nextConfig, securityHeaders

### Community 13 - "CV & Resume Assets"
Cohesion: 0.67
Nodes (3): About resumeUrl Field, CV PDF English, CV PDF Spanish

## Knowledge Gaps
- **146 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+141 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Framer Motion` connect `Hero & Avatar Components` to `Dependencies & Packages`, `Section Props & i18n Locale`, `Navbar & Language Switcher`, `Background Effects`, `Glass Design System`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `framer-motion` connect `Dependencies & Packages` to `Hero & Avatar Components`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _146 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Hero & Avatar Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08633879781420765 - nodes in this community are weakly interconnected._
- **Should `Dependencies & Packages` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._
- **Should `Section Props & i18n Locale` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._
- **Should `Backend Config & API` be split into smaller, more focused modules?**
  _Cohesion score 0.14793741109530584 - nodes in this community are weakly interconnected._