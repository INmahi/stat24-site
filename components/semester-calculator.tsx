"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Save, Trash2 } from "lucide-react";

import { curriculum } from "@/lib/curriculum";
import { computeSemesterGpa } from "@/lib/grades";
import { useCgpaStore } from "@/lib/storage";
import type { CourseGrade } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CourseRow } from "./course-row";

function ordinal(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  if (mod10 === 1) return `${n}st`;
  if (mod10 === 2) return `${n}nd`;
  if (mod10 === 3) return `${n}rd`;
  return `${n}th`;
}

function labelFor(index: number): string {
  const year = Math.floor(index / 2) + 1;
  const sem = (index % 2) + 1;
  return `${ordinal(year)} Year ${ordinal(sem)} Semester`;
}

export function SemesterCalculator() {
  const [semesterIndex, setSemesterIndex] = useState<string>("");
  const [grades, setGrades] = useState<Record<string, CourseGrade>>({});
  const { save, remove, history, courseGrades, saveCourseGrades, hydrated } =
    useCgpaStore();

  const semester =
    semesterIndex === "" ? null : curriculum.semesters[parseInt(semesterIndex)];

  useEffect(() => {
    if (!hydrated || !semester) return;
    saveCourseGrades(semester.name, grades);
  }, [grades, semester, hydrated, saveCourseGrades]);

  const { gpa, completedCredits } = useMemo(() => {
    if (!semester) return { gpa: 0, completedCredits: 0 };
    return computeSemesterGpa(
      semester.courses.map((c) => ({
        credits: c.credits,
        gpa: grades[c.code]?.gpa,
      })),
    );
  }, [semester, grades]);

  const totalCredits = semester?.total_credits ?? 0;
  const saved = semester ? history[semester.name] : undefined;

  function handleSelect(value: string | null) {
    const idx = value ?? "";
    setSemesterIndex(idx);
    if (idx === "") {
      setGrades({});
      return;
    }
    const name = curriculum.semesters[parseInt(idx)]?.name;
    setGrades(name ? (courseGrades[name] ?? {}) : {});
  }

  function handleSave() {
    if (!semester || completedCredits === 0) return;
    save(semester.name, gpa, completedCredits);
  }

  function handleRemove() {
    if (!semester) return;
    remove(semester.name);
    setGrades({});
  }

  return (
    <section className="rounded-lg border border-border bg-[color-mix(in_oklab,var(--card)_55%,transparent)] backdrop-blur-sm">
      <header className="flex flex-col gap-3 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Semester GPA
          </p>
          <h2 className="mt-1 font-serif text-xl tracking-tight">
            Per-course entry
          </h2>
        </div>
        <Select value={semesterIndex} onValueChange={handleSelect}>
          <SelectTrigger className="h-9 w-full sm:w-72">
            {semesterIndex === "" ? (
              <span className="text-muted-foreground">
                Choose a semester…
              </span>
            ) : (
              <span>{labelFor(parseInt(semesterIndex))}</span>
            )}
          </SelectTrigger>
          <SelectContent>
            {curriculum.semesters.map((s, i) => (
              <SelectItem key={s.name} value={String(i)}>
                <span>{labelFor(i)}</span>
                {history[s.name] && (
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {history[s.name].gpa.toFixed(2)}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      <AnimatePresence mode="wait">
        {semester ? (
          <motion.div
            key={semester.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Course rows — alternating zebra shade, edge-to-edge. */}
            <div className="divide-y divide-border/60 [&>*:nth-child(even)]:bg-muted/25">
              {semester.courses.map((course) => (
                <CourseRow
                  key={course.code}
                  course={course}
                  grade={grades[course.code]}
                  onChange={(next) =>
                    setGrades((prev) => ({
                      ...prev,
                      [course.code]: next,
                    }))
                  }
                />
              ))}
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-2 border-t border-border/70 sm:grid-cols-4">
              <Stat label="Total credits" value={totalCredits.toFixed(1)} />
              <Stat
                label="Filled credits"
                value={completedCredits.toFixed(1)}
              />
              <Stat
                label="Semester GPA"
                value={completedCredits > 0 ? gpa.toFixed(2) : "—"}
                highlight
                ready={completedCredits > 0}
              />
              <Stat
                label="Progress"
                value={
                  totalCredits > 0
                    ? `${Math.round((completedCredits / totalCredits) * 100)}%`
                    : "0%"
                }
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 border-t border-border/70 p-4">
              <Button
                onClick={handleSave}
                disabled={completedCredits === 0}
                size="sm"
              >
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {saved ? "Update saved GPA" : "Save to memory"}
              </Button>
              {saved && (
                <Button variant="outline" size="sm" onClick={handleRemove}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Remove from memory
                </Button>
              )}
              {saved && (
                <span className="ml-auto self-center text-[11px] text-muted-foreground">
                  Saved GPA: {saved.gpa.toFixed(2)} over{" "}
                  {saved.credits.toFixed(1)} credits
                </span>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center text-sm text-muted-foreground"
          >
            Select a semester above to begin entering grades.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Stat({
  label,
  value,
  highlight,
  ready,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  ready?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 border-border/60 px-5 py-3 transition-colors not-last:border-r",
        ready && "bg-[#3abd96]/10",
      )}
    >
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          highlight
            ? "font-serif text-lg tabular-nums"
            : "font-mono text-sm tabular-nums",
          ready && highlight && "text-[#3abd96]",
        )}
      >
        {value}
      </span>
    </div>
  );
}
