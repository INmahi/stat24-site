import { curriculum } from "./curriculum";
import type { CgpaHistory, CourseGrade } from "./types";
import { computeCgpa } from "./grades";

type CourseGradesMap = Record<string, Record<string, CourseGrade>>;

function formatCourseGrade(g: CourseGrade): string | null {
  const bits: string[] = [];
  if (g.marks !== undefined) bits.push(`${g.marks.toFixed(1)} marks`);
  if (g.gpa !== undefined) bits.push(`GPA ${g.gpa.toFixed(2)}`);
  if (g.letter) bits.push(g.letter);
  return bits.length ? bits.join(" · ") : null;
}

/** Plain-text summary of the user's saved GPA and (if any) per-course grades, for the chat model. */
export function buildUserContext(
  history: CgpaHistory,
  courseGrades: CourseGradesMap = {},
): string | undefined {
  const savedEntries = Object.entries(history);
  const hasCourseDetails = Object.values(courseGrades).some(
    (m) => Object.keys(m).length > 0,
  );
  if (savedEntries.length === 0 && !hasCourseDetails) return undefined;

  const lines: string[] = [];

  if (savedEntries.length > 0) {
    const { cgpa, totalCredits } = computeCgpa(savedEntries.map(([, v]) => v));
    lines.push(
      `Current CGPA: ${cgpa.toFixed(2)} over ${totalCredits.toFixed(1)} credits (${savedEntries.length} semester${savedEntries.length === 1 ? "" : "s"} saved).`,
      "Per-semester GPAs:",
    );
    for (const s of curriculum.semesters) {
      const saved = history[s.name];
      if (saved) {
        lines.push(
          `- ${s.name}: GPA ${saved.gpa.toFixed(2)} (${saved.credits.toFixed(1)} cr of ${s.total_credits.toFixed(1)})`,
        );
      }
    }
  }

  if (hasCourseDetails) {
    lines.push("", "Per-course grades (where entered):");
    for (const s of curriculum.semesters) {
      const semGrades = courseGrades[s.name];
      if (!semGrades) continue;
      const rows: string[] = [];
      for (const c of s.courses) {
        const g = semGrades[c.code];
        if (!g) continue;
        const formatted = formatCourseGrade(g);
        if (formatted) rows.push(`    - ${c.code} (${c.title}): ${formatted}`);
      }
      if (rows.length) {
        lines.push(`  ${s.name}:`);
        lines.push(...rows);
      }
    }
  }

  return lines.join("\n");
}
