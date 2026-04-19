export interface Course {
  code: string;
  title: string;
  credits: number;
  content_summary: string[];
  main_texts: string[];
}

export interface Semester {
  name: string;
  total_credits: number;
  optional?: number;
  courses: Course[];
}

export interface Curriculum {
  program: string;
  total_core_credits: number;
  optional_credits: number;
  semesters: Semester[];
}

export interface SavedSemester {
  gpa: number;
  credits: number;
  updatedAt: number;
}

export type CgpaHistory = Record<string, SavedSemester>;

export interface CourseGrade {
  /** Total marks 0–100 (source of truth if the user typed marks). */
  marks?: number;
  /** Derived from marks, or directly picked from the GPA select. */
  gpa?: number;
  /** Derived from GPA, or directly picked from the letter select. */
  letter?: string;
}
