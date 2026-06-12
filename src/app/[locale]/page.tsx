import type { PageProps } from "@/types";
import type { Locale } from "@/config/i18n";
import { locales } from "@/config/i18n";
import { notFound } from "next/navigation";
import {
  getHero,
  getAbout,
  getSkills,
  getExperience,
  getProjects,
  getServices,
  getTestimonials,
} from "@/data";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!(locales as readonly string[]).includes(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const [
    hero,
    about,
    skills,
    experience,
    projects,
    services,
    testimonials,
  ] = await Promise.all([
    getHero(locale),
    getAbout(locale),
    getSkills(locale),
    getExperience(locale),
    getProjects(locale),
    getServices(locale),
    getTestimonials(locale),
  ]);

  return (
    <>
      <HeroSection data={hero} locale={locale} />
      <AboutSection data={about} locale={locale} />
      <SkillsSection data={skills} locale={locale} />
      <ExperienceSection data={experience} locale={locale} />
      <ProjectsSection data={projects} locale={locale} />
      <ServicesSection data={services} locale={locale} />
      <TestimonialsSection data={testimonials} locale={locale} />
      <ContactSection locale={locale} email={about.email} />
    </>
  );
}
