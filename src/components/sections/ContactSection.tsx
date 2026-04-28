"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger, defaultViewport } from "@/lib/motion";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface ContactSectionProps {
  locale: Locale;
  email: string;
}

const COPY = {
  en: {
    label: "Contact",
    heading: "Let's work together",
    description:
      "Have a project in mind or just want to say hi? Send me a message.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    messageLabel: "Message",
    messagePlaceholder: "Tell me about your project…",
    submit: "Send message",
    sending: "Sending…",
    successHeading: "Message sent!",
    successBody:
      "Thanks for reaching out. I'll get back to you within 24–48 hours.",
    orEmail: "Or email me directly",
  },
  es: {
    label: "Contacto",
    heading: "Trabajemos juntos",
    description:
      "¿Tenés un proyecto en mente o simplemente querés saludar? Enviame un mensaje.",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
    messageLabel: "Mensaje",
    messagePlaceholder: "Contame sobre tu proyecto…",
    submit: "Enviar mensaje",
    sending: "Enviando…",
    successHeading: "¡Mensaje enviado!",
    successBody: "Gracias por escribirme. Te responderé en 24–48 horas.",
    orEmail: "O escribime directo",
  },
} as const;

export function ContactSection({ locale, email }: ContactSectionProps) {
  const t = COPY[locale];
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // UI-only: simulate a short delay then show success state.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-spacing container-page"
    >
      <SectionHeader
        id="contact-heading"
        label={t.label}
        heading={t.heading}
        description={t.description}
        centered
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="mt-12 max-w-xl mx-auto"
      >
        {sent ? (
          <div className="card-surface flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="size-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-500"
                aria-hidden
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">
                {t.successHeading}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.successBody}
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="card-surface p-6 md:p-8 flex flex-col gap-5"
          >
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              {/* Name */}
              <motion.div variants={fadeUp} className="flex flex-col gap-2">
                <label
                  htmlFor="contact-name"
                  className="text-sm font-medium text-foreground"
                >
                  {t.nameLabel}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  autoComplete="name"
                  className={cn(
                    "w-full rounded-xl border border-border bg-background",
                    "px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60",
                    "focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
                  )}
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={fadeUp} className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className="text-sm font-medium text-foreground"
                >
                  {t.emailLabel}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                  className={cn(
                    "w-full rounded-xl border border-border bg-background",
                    "px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60",
                    "focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
                  )}
                />
              </motion.div>

              {/* Message */}
              <motion.div variants={fadeUp} className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-foreground"
                >
                  {t.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder={t.messagePlaceholder}
                  className={cn(
                    "w-full rounded-xl border border-border bg-background",
                    "px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60",
                    "focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none",
                  )}
                />
              </motion.div>

              {/* Submit */}
              <motion.div variants={fadeUp}>
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full rounded-xl px-6 py-3.5 text-sm font-semibold",
                    "bg-primary text-primary-foreground",
                    "hover:opacity-85 active:scale-[0.98] transition-all duration-150",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  {loading ? t.sending : t.submit}
                </button>
              </motion.div>
            </motion.div>
          </form>
        )}

        {/* Direct email fallback */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.orEmail}{" "}
          <a
            href={`mailto:${email}`}
            className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            {email}
          </a>
        </p>
      </motion.div>
    </section>
  );
}
