"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { OPEN_CHAT_EVENT } from "@/components/chat-panel";

function openChat() {
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
}

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/calculator", label: "Calculator" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card font-serif text-[13px] text-foreground/90">
            i
          </span>
          <span className="hidden sm:inline">IRIS 34</span>
          <span className="hidden text-xs font-normal text-muted-foreground sm:inline">
            · SUST Statistics
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden sm:block">
            <ul className="flex items-center gap-1 rounded-full border border-border/60 bg-card/50 p-1">
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href} className="relative">
                    <Link
                      href={l.href}
                      className={cn(
                        "relative z-10 block px-4 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "text-background"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute inset-0 -z-10 rounded-full bg-foreground"
                        />
                      )}
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={openChat}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
            aria-label="Open AI assistant"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask AI
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground sm:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60 bg-background/95 sm:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-card hover:text-foreground",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openChat();
                  }}
                  className="flex w-full items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm font-medium text-accent"
                >
                  <Sparkles className="h-4 w-4" />
                  Ask AI
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
