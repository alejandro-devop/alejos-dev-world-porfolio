import { redirect } from "next/navigation";
import { defaultLocale } from "@/config/i18n";

/**
 * Root `/` route — immediately redirects to the default locale.
 * The middleware handles this for most cases; this is a safe fallback.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
