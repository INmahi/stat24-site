"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Crosshair cursor — chart-axis styling. Follows the pointer 1:1 with no
 * smoothing. Only active on fine-pointer devices (mouse / trackpad); coarse
 * pointers and touch see the native cursor.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const listener = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("custom-cursor-active");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const el = e.target as Element | null;
      hovering = !!el?.closest(
        "button, a, input, select, textarea, [role='button'], [role='tab'], [data-slot='trigger']",
      );
    };
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
    };

    const tick = () => {
      currentX = targetX;
      currentY = targetY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${hovering ? 1.4 : 1})`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] transition-[scale] duration-150 will-change-transform"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        className="text-foreground"
      >
        {/* Outer sphere — soft, prominent halo */}
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.45"
        />
        {/* Inner ring — tighter accent */}
        <circle
          cx="16"
          cy="16"
          r="6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeOpacity="0.7"
        />
        {/* Center dot */}
        <circle cx="16" cy="16" r="1.6" fill="currentColor" />
      </svg>
    </div>
  );
}
