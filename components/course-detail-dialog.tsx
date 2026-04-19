"use client";

import { motion } from "motion/react";
import type { Course } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookMarked, BookOpen, Info } from "lucide-react";

export function CourseDetailDialog({ course }: { course: Course }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            aria-label={`Details for ${course.code}`}
          />
        }
      >
        <Info className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs rounded bg-muted px-2 py-0.5">
              {course.code}
            </span>
            <span>{course.title}</span>
          </DialogTitle>
          <DialogDescription>
            {course.credits} credit{course.credits === 1 ? "" : "s"}
          </DialogDescription>
        </DialogHeader>

        {course.content_summary.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <BookOpen className="h-4 w-4" /> Content summary
            </h3>
            <ul className="space-y-2">
              {course.content_summary.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="text-sm leading-relaxed pl-4 border-l-2 border-primary/40"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.section>
        )}

        {course.main_texts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            className="space-y-2"
          >
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <BookMarked className="h-4 w-4" /> Main texts
            </h3>
            <ul className="space-y-1.5">
              {course.main_texts.map((text, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed italic text-muted-foreground"
                >
                  {text}
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </DialogContent>
    </Dialog>
  );
}
