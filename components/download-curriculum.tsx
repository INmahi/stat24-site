"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Braces,
  ChevronDown,
  Download,
  FileText,
} from "lucide-react";

import { cn } from "@/lib/utils";

const PDF_HREF = "/iris34-curriculum.pdf";
const JSON_HREF = "/iris34-curriculum.json";

export function DownloadCurriculum() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-foreground/30 bg-foreground/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-background transition-colors sm:gap-1.5 sm:rounded-md sm:px-3 sm:py-1.5 sm:text-xs sm:normal-case sm:tracking-normal",
          "hover:bg-foreground hover:text-background",
        )}
      >
        <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="hidden sm:inline">Download 24-25 curriculum</span>
        <span className="sm:hidden">Download</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform sm:h-3.5 sm:w-3.5",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute right-0 z-30 mt-1.5 w-64 overflow-hidden rounded-md border border-border bg-popover/95 p-1 text-sm shadow-xl backdrop-blur"
          >
            <a
              href={PDF_HREF}
              download="IRIS34-curriculum.pdf"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 rounded-sm px-3 py-2 transition-colors hover:bg-muted/60"
            >
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#3e99c2]" />
              <span className="flex-1">
                <span className="block font-medium text-foreground">
                  Download as PDF | Session 2024-2025
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  Official department booklet
                </span>
              </span>
            </a>
            <a
              href={JSON_HREF}
              download="IRIS34-curriculum.json"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 rounded-sm px-3 py-2 transition-colors hover:bg-muted/60"
            >
              <Braces className="mt-0.5 h-4 w-4 shrink-0 text-[#a25edd]" />
              <span className="flex-1">
                <span className="block font-medium text-foreground">
                  Download as JSON
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  Structured data for analysis or import
                </span>
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
