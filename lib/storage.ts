"use client";

import { useEffect, useState, useCallback } from "react";
import type { CgpaHistory, CourseGrade } from "./types";

const KEY = "sta-cgpa:history:v1";
const COURSES_KEY = "sta-cgpa:course-grades:v1";

type CourseGradesMap = Record<string, Record<string, CourseGrade>>;

export function useCgpaStore() {
  const [history, setHistory] = useState<CgpaHistory>({});
  const [courseGrades, setCourseGrades] = useState<CourseGradesMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    try {
      const raw = localStorage.getItem(COURSES_KEY);
      if (raw) setCourseGrades(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(history));
    } catch {
      // storage full / disabled
    }
  }, [history, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(COURSES_KEY, JSON.stringify(courseGrades));
    } catch {
      // ignore
    }
  }, [courseGrades, hydrated]);

  const save = useCallback((semesterName: string, gpa: number, credits: number) => {
    setHistory((prev) => ({
      ...prev,
      [semesterName]: { gpa, credits, updatedAt: Date.now() },
    }));
  }, []);

  const remove = useCallback((semesterName: string) => {
    setHistory((prev) => {
      const next = { ...prev };
      delete next[semesterName];
      return next;
    });
    setCourseGrades((prev) => {
      const next = { ...prev };
      delete next[semesterName];
      return next;
    });
  }, []);

  const saveCourseGrades = useCallback(
    (semesterName: string, grades: Record<string, CourseGrade>) => {
      setCourseGrades((prev) => ({ ...prev, [semesterName]: grades }));
    },
    [],
  );

  const clear = useCallback(() => {
    setHistory({});
    setCourseGrades({});
  }, []);

  return {
    history,
    courseGrades,
    save,
    remove,
    saveCourseGrades,
    clear,
    hydrated,
  };
}
