/**
 * Data barrel — re-exports typed loaders from `@/lib/content`.
 *
 * Content comes from the admin API when BACKEND_URL is set; JSON under
 * `src/data/{locale}/` is the fallback.
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
