const THEME_INIT = `(function(){try{var k="theme",r=document.documentElement,s=localStorage.getItem(k),d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})();`;

/**
 * Applies the saved theme class before first paint (no white flash in dark mode).
 * Must be rendered inside <head> as a native <script> — using next/script with
 * beforeInteractive in a Fragment root layout triggers a React 19 ordering warning
 * because React can't determine script order outside a real document context.
 * Sync with ThemeProvider: storageKey "theme".
 */
export function ThemeInitScript() {
  return (
    <script
      id="theme-init"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: THEME_INIT }}
    />
  );
}
