"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Show a one-shot coachmark when the target element first scrolls into view.
 * Persists dismissal in sessionStorage so it doesn't re-fire on the same tab.
 *
 * Usage:
 *   const { ref, show, dismiss } = useCoachmark("iris:hint:foo");
 *   <section ref={ref}>{show && <Tooltip onClose={dismiss} />}</section>
 */
export function useCoachmark<T extends HTMLElement = HTMLElement>(
  sessionKey: string,
  options?: { threshold?: number; autoDismissMs?: number; persist?: boolean },
) {
  const ref = useRef<T | null>(null);
  const [show, setShow] = useState(false);
  const dismissedRef = useRef(false);
  const persistEnabled = options?.persist !== false;

  const persist = useCallback(() => {
    if (!persistEnabled) return;
    try {
      sessionStorage.setItem(sessionKey, "1");
    } catch {
      /* ignore */
    }
  }, [sessionKey, persistEnabled]);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setShow(false);
    persist();
  }, [persist]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (persistEnabled && sessionStorage.getItem(sessionKey)) {
      dismissedRef.current = true;
      return;
    }
    const el = ref.current;
    if (!el) return;

    const threshold = options?.threshold ?? 0.4;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !dismissedRef.current) {
            setShow(true);
            obs.disconnect();
            return;
          }
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [sessionKey, options?.threshold, persistEnabled]);

  // Auto-dismiss after a while.
  useEffect(() => {
    if (!show) return;
    const ms = options?.autoDismissMs ?? 2000;
    const t = window.setTimeout(() => dismiss(), ms);
    return () => window.clearTimeout(t);
  }, [show, dismiss, options?.autoDismissMs]);

  return { ref, show, dismiss };
}
