/** Browser chrome / overscroll tint — matches globals.css background tokens. */
export function ThemeColorMeta() {
  return (
    <>
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#fcfcfc"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#171717"
      />
    </>
  );
}
