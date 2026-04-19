"use client";

import type { Course, CourseGrade } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseDetailDialog } from "./course-detail-dialog";
import {
  GRADE_OPTIONS,
  LETTER_OPTIONS,
  LETTER_TO_GPA,
  gpaToLetter,
  marksToGpa,
} from "@/lib/grades";

type Props = {
  course: Course;
  grade: CourseGrade | undefined;
  onChange: (next: CourseGrade) => void;
};

export function CourseRow({ course, grade, onChange }: Props) {
  const g = grade ?? {};

  function setMarks(value: string) {
    if (value === "") {
      onChange({});
      return;
    }
    const marks = parseFloat(value);
    const gpa = marksToGpa(marks);
    if (gpa === null) {
      onChange({ marks });
      return;
    }
    onChange({ marks, gpa, letter: gpaToLetter(gpa) });
  }

  function setGpa(value: string | null) {
    if (!value) {
      onChange({});
      return;
    }
    const gpa = parseFloat(value);
    onChange({ gpa, letter: gpaToLetter(gpa) });
  }

  function setLetter(value: string | null) {
    if (!value) {
      onChange({});
      return;
    }
    const gpa = LETTER_TO_GPA[value];
    onChange({ letter: value, gpa });
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 px-5 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8">
      {/* Identity */}
      <div className="flex items-start gap-3 min-w-0">
        <CourseDetailDialog course={course} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="rounded border border-[#a25edd]/40 bg-[#a25edd]/10 px-1.5 py-0.5 font-mono text-xs font-semibold tracking-tight text-[#a25edd]">
              {course.code}
            </span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {course.credits} credits
            </span>
            {g.gpa !== undefined && (
              <span className="ml-auto inline-flex items-baseline gap-1.5 rounded-sm border border-[#3abd96]/25 bg-[#0f2a24] px-2 py-0.5 text-xs font-semibold tabular-nums text-[#6fd4b2]">
                {g.gpa.toFixed(2)}
                {g.letter && (
                  <span className="text-[#6fd4b2]/70">· {g.letter}</span>
                )}
              </span>
            )}
          </div>
          <div className="mt-1.5 text-base font-semibold leading-snug text-foreground">
            {course.title}
          </div>
        </div>
      </div>

      {/* Grade inputs — always visible */}
      <div className="grid grid-cols-3 gap-3 md:w-95">
        <Field label="Marks (0–100)">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="any"
            placeholder="0–100"
            className="h-9 font-mono tabular-nums"
            value={g.marks ?? ""}
            onChange={(e) => setMarks(e.target.value)}
            aria-label={`Total marks for ${course.code}`}
          />
        </Field>

        <Field label="GPA">
          <Select
            value={g.gpa !== undefined ? String(g.gpa) : ""}
            onValueChange={setGpa}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {GRADE_OPTIONS.map((gpa) => (
                <SelectItem key={gpa} value={String(gpa)}>
                  {gpa.toFixed(2)} · {gpaToLetter(gpa) || "—"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Letter">
          <Select value={g.letter ?? ""} onValueChange={setLetter}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {LETTER_OPTIONS.map((letter) => (
                <SelectItem key={letter} value={letter}>
                  {letter} · {LETTER_TO_GPA[letter].toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
