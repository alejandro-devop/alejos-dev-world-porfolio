/**
 * JsonLd — injects JSON-LD structured data into the document <head>.
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", ... }} />
 *
 * Security: `data` must always come from trusted, server-controlled sources —
 * never from user input or unsanitized CMS fields, as it is rendered via
 * dangerouslySetInnerHTML.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Safe: data is always constructed server-side from static JSON files.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
