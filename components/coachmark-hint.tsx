"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { useCoachmark } from "./use-coachmark";
import { cn } from "@/lib/utils";

type Props = {
  sessionKey: string;
  label: string;
  children: ReactNode;
  /** When false, the hint shows on every page load instead of being remembered. */
  persist?: boolean;
  /** Extra classes for the wrapper div — useful for grid spans, etc. */
  className?: string;
};

/**
 * Wraps a target element and shows a pointing-tooltip when that target first
 * scrolls into view. Dismisses on close button, on any click inside the
 * wrapper (so opening the underlying element also dismisses it), or on
 * auto-timeout from `useCoachmark`.
 */
export function CoachmarkHint({
  sessionKey,
  label,
  children,
  persist,
  className,
}: Props) {
  const { ref, show, dismiss } = useCoachmark<HTMLDivElement>(sessionKey, {
    persist,
  });

  return (
    <div
      ref={ref}
      onClick={() => show && dismiss()}
      className={cn("relative self-start", className)}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            data-no-row-collapse
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="pointer-events-auto absolute -top-3 left-3 z-20 flex -translate-y-full items-center gap-2 rounded-full border border-accent/50 bg-background/95 px-3 py-1.5 text-xs font-medium text-accent shadow-lg backdrop-blur"
          >
            <span aria-hidden>👉</span>
            <span>{label}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              aria-label="Dismiss tip"
              className="grid h-5 w-5 place-items-center rounded-full text-accent/70 transition-colors hover:bg-accent/10 hover:text-accent"
            >
              <X className="h-3 w-3" />
            </button>
            {/* Arrow pointing down at the wrapped element */}
            <span className="absolute -bottom-1 left-6 h-2 w-2 rotate-45 border-b border-r border-accent/50 bg-background/95" />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}
