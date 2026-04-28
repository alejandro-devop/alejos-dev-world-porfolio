/**
 * Data barrel — re-exports typed loaders and types for convenience.
 *
 * Usage in a Server Component:
 *
 *   import { getHero, getProjects } from "@/data";
 *   const hero = await getHero(locale);
 */
export {
  getHero,
  getAbout,
  getSkills,
  getExperience,
  getProjects,
  getServices,
  getTestimonials,
  getBlog,
  getSeo,
  getAllContent,
} from "@/lib/content";

export type { AllContent } from "@/lib/content";
