/**
 * Merge CMS person name into SEO strings that still use a static placeholder in JSON.
 * Expected formats: "Name | Role" (title), "Name — Role" (og alt).
 */
export function resolvePersonTitle(seoTitle: string, personName: string): string {
  const name = personName.trim();
  if (!name) return seoTitle;

  const pipeIndex = seoTitle.indexOf("|");
  if (pipeIndex === -1) return name;

  const suffix = seoTitle.slice(pipeIndex + 1).trim();
  return suffix ? `${name} | ${suffix}` : name;
}

export function resolvePersonOgAlt(ogAlt: string, personName: string): string {
  const name = personName.trim();
  if (!name) return ogAlt;

  const match = ogAlt.match(/^[^—\-]+([—\-].+)$/u);
  if (!match) return ogAlt;

  return `${name}${match[1]}`;
}
