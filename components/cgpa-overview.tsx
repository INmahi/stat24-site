"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Plus, RotateCcw, Sparkles, X } from "lucide-react";

import { curriculum } from "@/lib/curriculum";
import { useCgpaStore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OPEN_CHAT_EVENT } from "@/components/chat-panel";

function labelFor(index: number): string {
  return `${Math.floor(index / 2) + 1}-${(index % 2) + 1}`;
}

function fmtCredits(n: number): string {
  return Number.isInteger(n) ? n.toFixed(0) : n.toFixed(1);
}

function parseGpa(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = parseFloat(raw);
  if (isNaN(n) || n < 0 || n > 4) return null;
  return n;
}

export function CgpaOverview() {
  const { history, hydrated } = useCgpaStore();
  const semesters = curriculum.semesters;
  const totalSemesters = semesters.length;
  const totalProgramCredits = useMemo(
    () => semesters.reduce((sum, s) => sum + s.total_credits, 0),
    [semesters],
  );

  const [slots, setSlots] = useState<{ gpa: string }[]>([{ gpa: "" }]);

  const { cgpa, filledCredits, filledCount } = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    let count = 0;
    slots.forEach((slot, i) => {
      const gpa = parseGpa(slot.gpa);
      if (gpa === null) return;
      const credits = semesters[i]?.total_credits ?? 0;
      totalCredits += credits;
      totalPoints += gpa * credits;
      count += 1;
    });
    return {
      cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
      filledCredits: totalCredits,
      filledCount: count,
    };
  }, [slots, semesters]);

  function updateGpa(i: number, value: string) {
    setSlots((prev) => {
      const next = [...prev];
      next[i] = { gpa: value };
      return next;
    });
  }

  function addSemester() {
    if (slots.length >= totalSemesters) return;
    setSlots((prev) => [...prev, { gpa: "" }]);
  }

  function removeAt(i: number) {
    if (slots.length <= 1) return;
    setSlots((prev) => prev.filter((_, idx) => idx !== i));
  }

  function loadFromMemory() {
    let lastSavedIndex = -1;
    semesters.forEach((s, i) => {
      if (history[s.name]) lastSavedIndex = i;
    });
    if (lastSavedIndex < 0) return;
    const length = Math.max(slots.length, lastSavedIndex + 1);
    const next: { gpa: string }[] = [];
    for (let i = 0; i < length; i++) {
      const saved = history[semesters[i].name];
      if (saved) {
        next.push({ gpa: saved.gpa.toFixed(2) });
      } else {
        next.push(slots[i] ?? { gpa: "" });
      }
    }
    setSlots(next);
  }

  function reset() {
    setSlots([{ gpa: "" }]);
  }

  const hasMemory = hydrated && Object.keys(history).length > 0;
  const canAdd = slots.length < totalSemesters;
  const percent =
    totalProgramCredits > 0
      ? Math.round((filledCredits / totalProgramCredits) * 100)
      : 0;

  return (
    <section className="rounded-lg border border-border bg-[color-mix(in_oklab,var(--card)_55%,transparent)] backdrop-blur-sm">
      {/* Summary header */}
      <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <p className="font-serif text-base italic tracking-[0.2em] text-muted-foreground sm:text-lg">
            CGPA
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <motion.span
              key={cgpa.toFixed(2)}
              initial={{ opacity: 0.4, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="font-serif text-5xl leading-none tracking-tight tabular-nums sm:text-6xl"
              style={{ color: filledCount > 0 ? "#3abd96" : undefined }}
            >
              {filledCount > 0 ? cgpa.toFixed(2) : "—"}
            </motion.span>
            <span className="font-serif text-xl text-muted-foreground">
              /4
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            {filledCount} of {totalSemesters} semesters ·{" "}
            {fmtCredits(filledCredits)} of {fmtCredits(totalProgramCredits)}{" "}
            credits covered · {percent}% done
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-end">
          <span className="text-xs text-muted-foreground">
            need comeback strategy 😏?
          </span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            discuss with AI
          </button>
        </div>
      </div>

      {/* Semester pills — wrap naturally within their column; memory actions stack on the right. */}
      <div className="flex items-start gap-3 p-4 sm:p-5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {slots.map((slot, i) => {
            const sem = semesters[i];
            const credits = sem?.total_credits ?? 0;
            const parsed = parseGpa(slot.gpa);
            const invalid = slot.gpa.trim() !== "" && parsed === null;
            const valid = parsed !== null;
            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "group relative flex h-11 shrink-0 items-stretch overflow-hidden rounded-md border transition-colors",
                  invalid
                    ? "border-destructive"
                    : valid
                      ? "border-[#3e99c2]/80"
                      : "border-border",
                )}
              >
                <div
                  className={cn(
                    "flex w-11 flex-col items-center justify-center border-r px-0.5 leading-none",
                    valid
                      ? "border-[#3e99c2]/60 bg-[#3e99c2]/15 text-[#3e99c2]"
                      : "border-border bg-muted/50 text-foreground/85",
                  )}
                >
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    {labelFor(i)}
                  </span>
                  <span className="mt-0.5 font-mono text-[9px] tabular-nums text-muted-foreground">
                    {fmtCredits(credits)}
                  </span>
                </div>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={4}
                  step="0.01"
                  placeholder="—"
                  value={slot.gpa}
                  onChange={(e) => updateGpa(i, e.target.value)}
                  className="h-full w-14 min-w-0 bg-transparent px-1 text-center font-mono text-sm tabular-nums outline-hidden placeholder:text-muted-foreground/60"
                  aria-label={`GPA for semester ${labelFor(i)}`}
                />
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="grid w-6 place-items-center border-l border-border text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100"
                    aria-label={`Remove semester ${labelFor(i)}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {canAdd && (
          <motion.button
            type="button"
            layout
            onClick={addSemester}
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-md border border-dashed border-border bg-background/30 px-2.5 text-xs font-medium text-foreground/90 transition-colors hover:border-solid hover:bg-muted hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="font-mono tabular-nums">{labelFor(slots.length)}</span>
          </motion.button>
        )}
        </div>

        <div className="flex shrink-0 flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadFromMemory}
            disabled={!hasMemory}
            title={hasMemory ? "Pull saved GPAs from the calculator" : "No saved GPAs yet"}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Load from memory
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            className="group border-border/50 bg-muted/60 text-muted-foreground hover:bg-destructive/15 hover:text-foreground hover:border-destructive/40"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" />
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}
