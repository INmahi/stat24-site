"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  BookMarked,
  BookOpen,
  FlaskConical,
  Info,
  Sparkle,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Course } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  course: Course;
  /**
   * Optional custom trigger. When provided, the entire node opens the dialog
   * (used by the curriculum page to make the whole course row clickable).
   * When omitted, falls back to a small ghost Info button.
   */
  trigger?: ReactNode;
};

function typeMeta(course: Course): {
  label: string;
  icon: LucideIcon;
  color: string;
} | null {
  switch (course.course_type) {
    case "Theory":
      return { label: "Theory", icon: BookOpen, color: "#5df2c5" };
    case "Lab":
      return { label: "Lab", icon: FlaskConical, color: "#3e99c2" };
    case "Capstone":
      return { label: "Capstone", icon: Target, color: "#3e99c2" };
    case "Optional":
      return { label: "Optional", icon: Sparkle, color: "#d2c1b6" };
    default:
      return null;
  }
}

export function CourseDetailDialog({ course, trigger }: Props) {
  const tm = typeMeta(course);
  const TypeIcon = tm?.icon;

  return (
    <Dialog>
      {trigger ? (
        // The supplied node IS the trigger element — no wrapper, so parent
        // `nth-child` background rules apply directly to the button.
        <DialogTrigger render={trigger as React.ReactElement} />
      ) : (
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
      )}

      <DialogContent
        className={cn(
          "w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] max-h-[88vh]",
          "overflow-y-auto p-0 sm:w-full sm:max-w-2xl",
        )}
      >
        {/* Header band */}
        <div className="border-b border-border/60 bg-[color-mix(in_oklab,var(--card)_70%,transparent)] px-5 py-4">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-[#a25edd]/40 bg-[#a25edd]/10 px-2 py-0.5 font-mono text-xs font-semibold tracking-tight text-[#a25edd]">
                {course.code}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {course.credits} credit{course.credits === 1 ? "" : "s"}
              </span>
              {tm && TypeIcon && (
                <span
                  className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                  style={{
                    color: tm.color,
                    borderColor: `${tm.color}66`,
                    backgroundColor: `${tm.color}1a`,
                  }}
                >
                  <TypeIcon className="h-3 w-3" />
                  {tm.label}
                </span>
              )}
              {course.isMajor && (
                <span className="inline-flex items-center gap-1 rounded border border-foreground/20 bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/80">
                  Major
                </span>
              )}
            </div>
            <DialogTitle className="mt-2 text-left font-serif text-lg leading-snug tracking-tight sm:text-xl">
              {course.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-5 py-5">
          {course.content_summary.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" /> Content summary
              </h3>
              <ul className="space-y-2">
                {course.content_summary.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className="border-l-2 border-[#a25edd]/40 pl-3 text-sm leading-relaxed"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          {course.main_texts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.06 }}
              className="space-y-3"
            >
              <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                <BookMarked className="h-3.5 w-3.5" /> Main texts
              </h3>
              <ul className="space-y-1.5">
                {course.main_texts.map((text, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-border/50 bg-muted/30 px-3 py-1.5 text-sm italic leading-relaxed text-muted-foreground"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
