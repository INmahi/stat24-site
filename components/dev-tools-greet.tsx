"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const DEV_URL = "https://inmlink.netlify.app";

export function DevToolsGreet() {
  // `seq` re-keys the toast so the same trigger can re-play the animation.
  const [seq, setSeq] = useState(0);
  const [visible, setVisible] = useState(false);

  const trigger = useCallback(() => {
    setSeq((n) => n + 1);
    setVisible(true);
  }, []);

  useEffect(() => {
    // Stylised console signature — shown the moment they do manage to open DevTools.
    const big =
      "font-family:ui-serif,Georgia,serif;font-size:22px;font-weight:700;color:#5df2c5;";
    const small =
      "font-family:ui-sans-serif,system-ui;font-size:12px;color:#d2c1b6;";
    try {
      console.log("%c👀 I see you being curious.", big);
      console.log(
        `%cGood luck poking around. Meet the developer → ${DEV_URL}`,
        small,
      );
    } catch {
      // some hosts seal console
    }

    const isInspectCombo = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "F12") return true;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && /^[ijcIJC]$/.test(k)) return true; // inspector / console / picker
      if (mod && /^[uU]$/.test(k)) return true; // view-source
      if (mod && /^[sS]$/.test(k)) return true; // save page
      return false;
    };

    const onKey = (e: KeyboardEvent) => {
      if (isInspectCombo(e)) {
        e.preventDefault();
        e.stopPropagation();
        trigger();
      }
    };

    const onContext = (e: MouseEvent) => {
      e.preventDefault();
      trigger();
    };

    // Heuristic devtools detector — fires if the devtools panel is docked and
    // steals enough viewport to change the outer/inner delta.
    let wasOpen = false;
    const poll = window.setInterval(() => {
      const threshold = 160;
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      const open = widthGap > threshold || heightGap > threshold;
      if (open && !wasOpen) trigger();
      wasOpen = open;
    }, 1000);

    window.addEventListener("keydown", onKey, { capture: true });
    window.addEventListener("contextmenu", onContext, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKey, { capture: true });
      window.removeEventListener("contextmenu", onContext, { capture: true });
      window.clearInterval(poll);
    };
  }, [trigger]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 4200);
    return () => clearTimeout(t);
  }, [seq, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={seq}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="pointer-events-auto fixed bottom-6 left-1/2 z-9999 flex -translate-x-1/2 items-center gap-3 rounded-full border border-accent/50 bg-background/90 px-4 py-2 text-sm shadow-lg backdrop-blur-md"
        >
          <span className="font-medium text-accent">
            👀 I see you being curious — good luck!
          </span>
          <a
            href={DEV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
          >
            Meet the developer →
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
