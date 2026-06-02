"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { localeTransition } from "@/lib/motion";

type NavigateFn = () => void;

type LocaleTransitionContextValue = {
  startLocaleTransition: (navigate: NavigateFn) => void;
};

const LocaleTransitionContext =
  createContext<LocaleTransitionContextValue | null>(null);

export function useLocaleTransition() {
  const ctx = useContext(LocaleTransitionContext);
  if (!ctx) {
    throw new Error("useLocaleTransition must be used within LocaleTransition");
  }
  return ctx;
}

interface LocaleTransitionProps {
  children: ReactNode;
}

/**
 * Fades page content out before locale navigation, then fades in after the
 * new route is active. Used by LanguageSwitcher for EN ↔ ES transitions.
 */
export function LocaleTransition({ children }: LocaleTransitionProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"visible" | "hidden">("visible");
  const navigateRef = useRef<NavigateFn | null>(null);
  const awaitingFadeIn = useRef(false);

  const startLocaleTransition = useCallback(
    (navigate: NavigateFn) => {
      if (reducedMotion) {
        navigate();
        return;
      }
      navigateRef.current = navigate;
      awaitingFadeIn.current = true;
      setPhase("hidden");
    },
    [reducedMotion],
  );

  const handleAnimationComplete = useCallback(() => {
    if (!navigateRef.current) return;
    const navigate = navigateRef.current;
    navigateRef.current = null;
    navigate();
  }, []);

  useEffect(() => {
    if (!awaitingFadeIn.current) return;
    awaitingFadeIn.current = false;
    setPhase("visible");
  }, [pathname]);

  return (
    <LocaleTransitionContext.Provider value={{ startLocaleTransition }}>
      <motion.div
        initial={false}
        animate={phase}
        variants={localeTransition}
        onAnimationComplete={handleAnimationComplete}
        className="flex flex-1 flex-col"
        style={{ pointerEvents: phase === "hidden" ? "none" : undefined }}
      >
        {children}
      </motion.div>
    </LocaleTransitionContext.Provider>
  );
}
