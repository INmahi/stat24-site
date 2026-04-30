export const LETTER_TO_GPA: Record<string, number> = {
  "A+": 4.0,
  A: 3.75,
  "A-": 3.5,
  "B+": 3.25,
  B: 3.0,
  "B-": 2.75,
  "C+": 2.5,
  C: 2.25,
  "C-": 2.0,
  F: 0.0,
};

export const GRADE_OPTIONS = [4, 3.75, 3.5, 3.25, 3.0, 2.75, 2.5, 2.25, 2.0, 0] as const;
export const LETTER_OPTIONS = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "F"] as const;

/** SUST percentage → GPA table. */
export function marksToGpa(marks: number): number | null {
  if (isNaN(marks) || marks < 0 || marks > 100) return null;
  if (marks >= 80) return 4.0;
  if (marks >= 75) return 3.75;
  if (marks >= 70) return 3.5;
  if (marks >= 65) return 3.25;
  if (marks >= 60) return 3.0;
  if (marks >= 55) return 2.75;
  if (marks >= 50) return 2.5;
  if (marks >= 45) return 2.25;
  if (marks >= 40) return 2.0;
  return 0.0;
}

export function gpaToLetter(gpa: number): string {
  const entry = Object.entries(LETTER_TO_GPA).find(([, v]) => v === gpa);
  return entry?.[0] ?? "";
}

export interface GpaClass {
  label: string;
  emoji: string;
  className: string;
}

export function gpaClass(gpa: number): GpaClass {
  if (gpa >= 3.75) return { label: "Excellent", emoji: "🌟", className: "text-emerald-500" };
  if (gpa >= 3.5) return { label: "Great", emoji: "🎉", className: "text-green-500" };
  if (gpa >= 3.0) return { label: "Good", emoji: "👍", className: "text-sky-400" };
  if (gpa >= 2.5) return { label: "Fair", emoji: "😊", className: "text-amber-400" };
  if (gpa >= 2.0) return { label: "Keep trying", emoji: "📚", className: "text-orange-400" };
  return { label: "Don't give up", emoji: "💪", className: "text-red-400" };
}

/**
 * SUST rule: a failed course (GPA = 0) does not count toward the GPA denominator.
 * Numerator is sum(credits·gpa) over every graded course. Denominator is
 * sum(credits) over only the courses with gpa > 0 (i.e., excluding fails).
 *
 * `filledCredits` reports everything the student has entered (used for UI
 * "Filled credits" and progress), while `passedCredits` is the figure that
 * actually weights the GPA — and that is what gets stored for CGPA.
 */
export function computeSemesterGpa(
  entries: Array<{ gpa?: number; credits: number }>,
): { gpa: number; filledCredits: number; passedCredits: number } {
  let filledCredits = 0;
  let passedCredits = 0;
  let totalPoints = 0;
  for (const e of entries) {
    if (e.gpa !== undefined && !isNaN(e.gpa) && e.gpa >= 0) {
      filledCredits += e.credits;
      totalPoints += e.gpa * e.credits;
      if (e.gpa > 0) passedCredits += e.credits;
    }
  }
  return {
    gpa: passedCredits > 0 ? totalPoints / passedCredits : 0,
    filledCredits,
    passedCredits,
  };
}

export function computeCgpa(
  entries: Array<{ gpa: number; credits: number }>,
): { cgpa: number; totalCredits: number } {
  let totalCredits = 0;
  let totalPoints = 0;
  for (const e of entries) {
    totalCredits += e.credits;
    totalPoints += e.gpa * e.credits;
  }
  return {
    cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
    totalCredits,
  };
}
