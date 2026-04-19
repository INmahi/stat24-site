"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Flip to `true` to re-enable the click-spill effect site-wide.
const ENABLED = false;

const SYMBOLS = [
  "Σ",
  "μ",
  "σ",
  "∫",
  "x̄",
  "π",
  "ρ",
  "λ",
  "θ",
  "β",
  "χ²",
  "∞",
  "√",
  "≈",
  "δ",
];

const COLORS = ["#3abd96", "#5df2c5", "#a25edd", "#3e99c2", "#d2c1b6"];

type Drop = {
  id: number;
  symbol: string;
  x: number;
  y: number;
  dx: number;
  peak: number;
  fall: number;
  rot: number;
  size: number;
  color: string;
  duration: number;
};

/**
 * Statistical-symbol spill on every click — water-drop spray from the click
 * point. Symbols launch upward with an arc, gravity-fall past the origin, and
 * fade out. Zero-impact when idle; hardware accelerated via `motion`.
 */
export function ClickSpill() {
  if (!ENABLED) return null;
  return <ClickSpillInner />;
}

function ClickSpillInner() {
  const [drops, setDrops] = useState<Drop[]>([]);

  const spawn = useCallback((x: number, y: number) => {
    const count = 6 + Math.floor(Math.random() * 4); // 6..9
    const nextId = Date.now();
    const newOnes: Drop[] = Array.from({ length: count }, (_, i) => {
      // Direction: spread around straight-up (±55°).
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.6);
      const thrust = 45 + Math.random() * 35;
      const dx = Math.cos(angle) * thrust;
      const peak = Math.sin(angle) * thrust; // negative (upward)
      return {
        id: nextId + i,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        x,
        y,
        dx,
        peak,
        fall: 70 + Math.random() * 50, // downward travel past origin
        rot: (Math.random() - 0.5) * 220,
        size: 14 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: 6.0 + Math.random() * 2.0,
      };
    });
    setDrops((prev) => {
      // Cap to keep things sane under rapid clicking.
      const merged = [...prev, ...newOnes];
      return merged.length > 80 ? merged.slice(merged.length - 80) : merged;
    });
  }, []);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      // Skip multi-touch / non-primary pointers so we don't double-spawn.
      if (e.pointerType === "touch" && !e.isPrimary) return;
      spawn(e.clientX, e.clientY);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [spawn]);

  const handleDone = useCallback((id: number) => {
    setDrops((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-9998 overflow-hidden"
    >
      <AnimatePresence>
        {drops.map((d) => (
          <motion.span
            key={d.id}
            initial={{
              x: d.x,
              y: d.y,
              opacity: 0,
              scale: 0.6,
              rotate: 0,
            }}
            animate={{
              x: [d.x, d.x + d.dx * 0.5, d.x + d.dx],
              y: [d.y, d.y + d.peak, d.y + d.fall],
              opacity: [0, 1, 0],
              scale: [0.6, 1, 0.9],
              rotate: [0, d.rot * 0.5, d.rot],
            }}
            transition={{
              duration: d.duration,
              times: [0, 0.4, 1],
              y: { ease: ["easeOut", "easeIn"] },
              x: { ease: "linear" },
              rotate: { ease: "linear" },
              opacity: { ease: "easeOut" },
              scale: { ease: "easeOut" },
            }}
            onAnimationComplete={() => handleDone(d.id)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              translate: "-50% -50%",
              color: d.color,
              fontSize: `${d.size}px`,
              fontFamily: "var(--font-serif)",
              fontWeight: 500,
              textShadow: `0 0 8px ${d.color}40`,
              willChange: "transform, opacity",
            }}
          >
            {d.symbol}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
