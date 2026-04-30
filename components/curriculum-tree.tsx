"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Layers,
} from "lucide-react";

import { curriculum } from "@/lib/curriculum";
import type { Course, Semester } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CourseDetailDialog } from "./course-detail-dialog";
import { CoachmarkHint } from "./coachmark-hint";
import { useCollapseRow } from "./collapse-stack";

const ORDINAL = ["1st", "2nd", "3rd", "4th"];

function CourseLine({ course }: { course: Course }) {
  return (
    <CourseDetailDialog
      course={course}
      trigger={
        <button
          type="button"
          className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
        >
          <span className="rounded border border-[#a25edd]/40 bg-[#a25edd]/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold tracking-tight text-[#a25edd]">
            {course.code}
          </span>
          <span className="min-w-0 truncate text-sm font-medium text-foreground">
            {course.title}
          </span>
          <span className="flex items-center gap-2 text-[11px] tabular-nums">
            {course.course_type === "Lab" && (
              <FlaskConical className="h-3 w-3 text-[#3e99c2]" />
            )}
            <span className="font-mono text-muted-foreground">
              {course.credits.toFixed(1)} cr
            </span>
          </span>
        </button>
      }
    />
  );
}

function SemesterRow({
  semester,
  semIndex,
  defaultOpen,
}: {
  semester: Semester;
  semIndex: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const rowRef = useRef<HTMLDivElement>(null);
  useCollapseRow(1, rowRef, open, () => setOpen(false));
  const theoryCount = semester.courses.filter(
    (c) => c.course_type === "Theory",
  ).length;
  const labCount = semester.courses.filter(
    (c) => c.course_type === "Lab" || c.course_type === "Capstone",
  ).length;

  return (
    <div ref={rowRef} className="border-t border-border/50 first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/30"
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
        />
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {ORDINAL[semIndex]} Sem
        </span>
        <span className="ml-auto flex flex-wrap items-center justify-end gap-x-3 gap-y-0.5 text-[11px] tabular-nums text-muted-foreground">
          <span className="hidden sm:inline">
            {semester.courses.length}c · {theoryCount}T · {labCount}L
          </span>
          <span className="sm:hidden">
            {semester.courses.length} courses
          </span>
          <span className="font-mono text-foreground/85">
            {semester.total_credits.toFixed(1)} cr
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-border/40 [&>*:nth-child(even)]:bg-muted/25">
              {semester.courses.map((c) => (
                <CourseLine key={c.code} course={c} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function YearBlock({ yearIndex }: { yearIndex: number }) {
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useCollapseRow(0, sectionRef, open, () => setOpen(false));
  const semesters = [
    curriculum.semesters[yearIndex * 2],
    curriculum.semesters[yearIndex * 2 + 1],
  ].filter(Boolean) as Semester[];
  const yearCredits = semesters.reduce((s, x) => s + x.total_credits, 0);
  const yearCourses = semesters.reduce((s, x) => s + x.courses.length, 0);

  return (
    <section
      ref={sectionRef}
      className="self-start rounded-lg border border-border bg-[color-mix(in_oklab,var(--card)_55%,transparent)] backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/20"
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
        />
        <GraduationCap className="h-4 w-4 text-accent/80" />
        <h2 className="font-serif text-lg tracking-tight">
          {ORDINAL[yearIndex]} Year
        </h2>
        <span className="ml-auto flex items-center gap-3 text-xs tabular-nums text-muted-foreground">
          <span className="hidden sm:inline">{yearCourses} courses</span>
          <span className="font-mono text-foreground/85">
            {yearCredits.toFixed(1)} cr
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60"
          >
            {semesters.map((s, i) => (
              <SemesterRow key={s.name} semester={s} semIndex={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function CurriculumTree() {
  return (
    <div className="space-y-3">
      <header className="flex items-center gap-2 px-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Layers className="h-3.5 w-3.5" />
        Year-by-year
      </header>
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
        {[0, 1, 2, 3].map((y) =>
          y === 0 ? (
            <CoachmarkHint
              key={y}
              sessionKey="iris:hint:year-1"
              label="Click to expand semesters"
              persist={false}
            >
              <YearBlock yearIndex={y} />
            </CoachmarkHint>
          ) : (
            <YearBlock key={y} yearIndex={y} />
          ),
        )}
      </div>
    </div>
  );
}
