"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  Boxes,
  ChevronRight,
  FlaskConical,
  Sigma,
  Sparkle,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { curriculum } from "@/lib/curriculum";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CourseDetailDialog } from "./course-detail-dialog";
import { CoachmarkHint } from "./coachmark-hint";
import { useCollapseRow } from "./collapse-stack";

type CourseWithSemester = Course & { semesterName: string };

const DEPT_LABELS: Record<string, string> = {
  STA: "Statistics",
  MAT: "Mathematics",
  ENG: "English",
  CSE: "Computer Science",
  SPS: "Sociology / Pol. Sci.",
  ECO: "Economics",
};

function flatCourses(): CourseWithSemester[] {
  const out: CourseWithSemester[] = [];
  for (const s of curriculum.semesters) {
    for (const c of s.courses) {
      out.push({ ...c, semesterName: s.name });
    }
  }
  return out;
}

function deptOf(code: string): string {
  return code.split(/\s+/)[0] || "OTHER";
}

function sumCredits(items: { credits: number }[]): number {
  return items.reduce((sum, c) => sum + c.credits, 0);
}

function CourseLine({ course }: { course: CourseWithSemester }) {
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
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground">
              {course.title}
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
              {course.semesterName}
            </span>
          </span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {course.credits.toFixed(1)} cr
          </span>
        </button>
      }
    />
  );
}

function CourseList({ courses }: { courses: CourseWithSemester[] }) {
  return (
    <div className="divide-y divide-border/40 [&>*:nth-child(even)]:bg-muted/25">
      {courses.map((c) => (
        <CourseLine key={c.code} course={c} />
      ))}
    </div>
  );
}

type BucketProps = {
  icon: LucideIcon;
  label: string;
  accent: string;
  count: number;
  credits: number;
  children: React.ReactNode;
};

function Bucket({ icon: Icon, label, accent, count, credits, children }: BucketProps) {
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useCollapseRow(0, sectionRef, open, () => setOpen(false));
  return (
    <section
      ref={sectionRef}
      data-open={open ? "true" : undefined}
      className={cn(
        "self-start rounded-lg border border-border bg-[color-mix(in_oklab,var(--card)_55%,transparent)] backdrop-blur-sm",
        // On mobile, an open bucket grabs the full width so the course rows
        // don't get crushed into half a viewport. The sibling bucket then
        // wraps below into the next grid row.
        open && "col-span-2 sm:col-span-1",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 p-2.5 text-left transition-colors hover:bg-muted/20 sm:gap-3 sm:p-4"
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform sm:h-4 sm:w-4",
            open && "rotate-90",
          )}
        />
        <Icon
          className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
          style={{ color: accent }}
        />
        <h2 className="min-w-0 truncate font-serif text-sm tracking-tight sm:text-base">
          {label}{" "}
          <span className="font-mono text-[10px] font-normal text-muted-foreground sm:text-xs">
            ({count})
          </span>
        </h2>
        <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-foreground/85 sm:text-xs">
          {credits.toFixed(1)} cr
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-border/60"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function DeptGroup({
  dept,
  courses,
}: {
  dept: string;
  courses: CourseWithSemester[];
}) {
  const [open, setOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  useCollapseRow(1, rowRef, open, () => setOpen(false));
  return (
    <div ref={rowRef} className="border-t border-border/40 first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/30"
      >
        <ChevronRight
          className={cn(
            "h-3 w-3 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
        />
        <span className="rounded border border-foreground/20 bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-foreground/85">
          {dept}
        </span>
        <span className="text-xs text-muted-foreground">
          {DEPT_LABELS[dept] ?? "Other"}
        </span>
        <span className="ml-auto flex items-center gap-3 text-[11px] tabular-nums text-muted-foreground">
          <span>{courses.length} courses</span>
          <span className="font-mono text-foreground/85">
            {sumCredits(courses).toFixed(1)} cr
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="overflow-hidden"
          >
            <CourseList courses={courses} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NonMajorBuckets({ courses }: { courses: CourseWithSemester[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, CourseWithSemester[]>();
    for (const c of courses) {
      const d = deptOf(c.code);
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(c);
    }
    // Sort by department label, falling back to code
    return Array.from(map.entries()).sort(([a], [b]) =>
      (DEPT_LABELS[a] ?? a).localeCompare(DEPT_LABELS[b] ?? b),
    );
  }, [courses]);

  return (
    <div>
      {grouped.map(([dept, list]) => (
        <DeptGroup key={dept} dept={dept} courses={list} />
      ))}
    </div>
  );
}

export function CurriculumBreakdown() {
  const all = useMemo(flatCourses, []);

  // Theory bucket = pure theory courses.
  const theory = useMemo(
    () => all.filter((c) => c.course_type === "Theory"),
    [all],
  );
  // Lab bucket folds Capstone (Field Work, Research Project) — they're the
  // same conceptual category: applied / project credit.
  const lab = useMemo(
    () =>
      all.filter(
        (c) => c.course_type === "Lab" || c.course_type === "Capstone",
      ),
    [all],
  );
  const major = useMemo(() => all.filter((c) => c.isMajor), [all]);
  const nonMajor = useMemo(() => all.filter((c) => !c.isMajor), [all]);
  const optional = useMemo(
    () => all.filter((c) => c.course_type === "Optional"),
    [all],
  );

  const totalCredits = sumCredits(all);
  const theoryCr = sumCredits(theory);
  const labCr = sumCredits(lab);
  const majorCr = sumCredits(major);
  const optionalCr = sumCredits(optional);

  return (
    <div className="space-y-3">
      <header className="flex items-center gap-2 px-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Sigma className="h-3.5 w-3.5" />
        Curriculum overview
      </header>

      {/* Top summary cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <SummaryCard
          label="Total credits"
          value={totalCredits.toFixed(1)}
          accent="#d2c1b6"
          sub={
            optionalCr > 0
              ? `${(totalCredits - optionalCr).toFixed(1)} core + ${optionalCr.toFixed(1)} optional`
              : undefined
          }
        />
        <SummaryCard
          label="Theory credits"
          value={theoryCr.toFixed(1)}
          accent="#5df2c5"
          sub={`${theory.length} courses`}
        />
        <SummaryCard
          label="Lab + project"
          value={labCr.toFixed(1)}
          accent="#3e99c2"
          sub={`${lab.length} courses`}
        />
        <SummaryCard
          label="Major credits"
          value={majorCr.toFixed(1)}
          accent="#a25edd"
          sub={`${major.length} courses`}
        />
      </div>

      {/* 2×2 expandable buckets — same layout on mobile and desktop */}
      <div className="grid grid-cols-2 items-start gap-2 sm:gap-3">
        <CoachmarkHint
          sessionKey="iris:hint:breakdown-bucket"
          label="Tap to see what's inside"
          persist={false}
          className="has-[section[data-open=true]]:col-span-2 sm:has-[section[data-open=true]]:col-span-1"
        >
          <Bucket
            icon={BookOpen}
            label="Theory"
            accent="#5df2c5"
            count={theory.length}
            credits={theoryCr}
          >
            <CourseList courses={theory} />
          </Bucket>
        </CoachmarkHint>

        <Bucket
          icon={FlaskConical}
          label="Lab"
          accent="#3e99c2"
          count={lab.length}
          credits={labCr}
        >
          <CourseList courses={lab} />
        </Bucket>

        <Bucket
          icon={Target}
          label="Major"
          accent="#a25edd"
          count={major.length}
          credits={majorCr}
        >
          <CourseList courses={major} />
        </Bucket>

        <Bucket
          icon={Boxes}
          label="Non-major"
          accent="#d2c1b6"
          count={nonMajor.length}
          credits={sumCredits(nonMajor)}
        >
          <NonMajorBuckets courses={nonMajor} />
        </Bucket>

        {/* Optional gets the full row underneath the 2×2 grid */}
        {optional.length > 0 && (
          <div className="col-span-2">
            <Bucket
              icon={Sparkle}
              label="Optional credits"
              accent="#d2c1b6"
              count={optional.length}
              credits={optionalCr}
            >
              <CourseList courses={optional} />
            </Bucket>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="rounded-md border border-border/70 bg-[color-mix(in_oklab,var(--card)_55%,transparent)] px-3 py-2.5 backdrop-blur-sm">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className="mt-0.5 font-serif text-xl tabular-nums"
        style={{ color: accent }}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
          {sub}
        </div>
      )}
    </div>
  );
}
