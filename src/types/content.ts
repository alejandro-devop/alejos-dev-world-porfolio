// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** A link with a human label. */
export interface Link {
  label: string;
  url: string;
}

/** Open-Graph / Twitter card overrides on a per-page basis. */
export interface OgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export interface SeoData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: OgImage;
  twitterHandle: string;
  canonicalUrl: string;
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export interface HeroData {
  greeting: string;
  name: string;
  tagline: string;
  subtagline: string;
  cta: {
    primary: Link;
    secondary: Link;
  };
  availableForWork?: boolean;
  availableForWorkLabel?: string;
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export interface AboutData {
  headline: string;
  paragraphs: string[];
  location: string;
  email: string;
  resumeUrl: string;
  socialLinks: Link[];
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Skill {
  name: string;
  level: SkillLevel;
  /** Relative path to icon, or an icon-pack key. Optional. */
  icon?: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export type SkillsData = SkillCategory[];

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export interface ExperienceEntry {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  startDate: string; // ISO 8601 date string, e.g. "2022-03"
  endDate: string | "present";
  location: string;
  remote: boolean;
  highlights: string[];
  technologies: string[];
}

export type ExperienceData = ExperienceEntry[];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type ProjectStatus = "completed" | "in-progress" | "archived";

export interface ProjectImage {
  id: string;
  projectId: string;
  locale: string;
  url: string;
  position: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags?: string[];
  status?: ProjectStatus;
  featured?: boolean;
  imageUrl?: string;
  images?: ProjectImage[];
  liveUrl?: string;
  repoUrl?: string;
  startDate?: string;
  endDate?: string;
}

export type ProjectsData = Project[];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export interface Service {
  id: string;
  title: string;
  description: string;
  /** Icon key or relative path. */
  icon: string;
  highlights: string[];
}

export type ServicesData = Service[];

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorAvatarUrl?: string;
  quote: string;
  date?: string; // ISO 8601 YYYY-MM-DD
  featured: boolean;
}

export type TestimonialsData = Testimonial[];

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export type BlogPostStatus = "published" | "draft";

/** A single block of rich content within a blog post. */
export type BlogContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "blockquote"; text: string };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Relative or absolute URL for the cover image. */
  coverImageUrl?: string;
  tags: string[];
  status: BlogPostStatus;
  publishedAt: string; // ISO 8601
  readingTimeMinutes: number;
  externalUrl?: string; // for cross-posted articles
  /** Optional full body content — present on detail pages. */
  content?: BlogContentBlock[];
}

export type BlogData = BlogPost[];

// ---------------------------------------------------------------------------
// Content map — used by the loader so callers are fully typed
// ---------------------------------------------------------------------------

/**
 * Maps each JSON filename key to its typed data shape.
 * Add a new key here when you add a new content section.
 */
export interface ContentMap {
  hero: HeroData;
  about: AboutData;
  skills: SkillsData;
  experience: ExperienceData;
  projects: ProjectsData;
  services: ServicesData;
  testimonials: TestimonialsData;
  blog: BlogData;
  seo: SeoData;
}

export type ContentKey = keyof ContentMap;
