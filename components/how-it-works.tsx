"use client";

import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function HowItWorks() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label="How to use this page"
            title="How to use this page"
            className="inline-flex h-5 shrink-0 translate-y-0.5 items-center gap-1 rounded border border-amber-500/60 bg-amber-500/15 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400 transition-colors hover:bg-amber-500/25 hover:text-amber-300"
          />
        }
      >
        <AlertTriangle className="h-3 w-3" />
        How to use
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to use IRIS 34</DialogTitle>
          <DialogDescription>
            A short tour of the calculator, the memory store, and the advisor.
          </DialogDescription>
        </DialogHeader>

        <ol className="space-y-3 text-sm">
          <li>
            <span className="font-medium text-foreground">
              1. Enter a semester result.
            </span>{" "}
            <span className="text-muted-foreground">
              Open the Semester-wise Results section, pick the semester from
              the dropdown, and fill in marks, GPA, or letter grade for each
              course. The three inputs stay synchronised, so you can use
              whichever number you have on hand.
            </span>
          </li>
          <li>
            <span className="font-medium text-foreground">
              2. Save to memory.
            </span>{" "}
            <span className="text-muted-foreground">
              Click <em>Save to memory</em> to store that semester's GPA
              locally on your device. Individual course grades persist
              automatically — returning to a saved semester brings them back.
            </span>
          </li>
          <li>
            <span className="font-medium text-foreground">
              3. Review your CGPA.
            </span>{" "}
            <span className="text-muted-foreground">
              In the CGPA section you can enter semester GPAs directly, or
              press <em>Load from memory</em> to pull in everything you have
              saved so far. The running CGPA and progress update live.
            </span>
          </li>
          <li>
            <span className="font-medium text-foreground">
              4. Talk to the advisor.
            </span>{" "}
            <span className="text-muted-foreground">
              The <em>Ask AI</em> button in the nav (and the comeback-strategy
              button on this page) opens a chat grounded in the full SUST
              Statistics curriculum. If you have saved grades, the advisor
              sees them and can give targeted feedback; on the Curriculum page
              it stays general instead.
            </span>
          </li>
        </ol>

        <p className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          All data lives in your browser's local storage — nothing is uploaded.
          Clearing site data or switching devices wipes the memory.
        </p>
      </DialogContent>
    </Dialog>
  );
}
