import { Sigma, Layers } from "lucide-react";

import { CurriculumTree } from "@/components/curriculum-tree";
import { CurriculumBreakdown } from "@/components/curriculum-breakdown";
import { DownloadCurriculum } from "@/components/download-curriculum";
import { CollapseStackProvider } from "@/components/collapse-stack";
import { curriculum } from "@/lib/curriculum";

export default function CurriculumPage() {
  return (
    <>
      <main className="flex-1">
        <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:space-y-10 sm:py-10">
          {/* Header */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
              Curriculum
            </p>
            <h1 className="mt-1.5 font-serif text-2xl tracking-tight sm:mt-2 sm:text-4xl">
              {curriculum.program}
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
              4 years at a glance — tap{" "}
              <span className="font-semibold text-accent">Ask AI</span>
              {" "}for a detailed analysis or any course-level Q&amp;A.
            </p>

            {/* In-page nav pills + download — kept on a single row at every width */}
            <div className="mt-3 flex items-center gap-1.5 sm:mt-4 sm:gap-2">
              <a
                href="#breakdown"
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs sm:normal-case sm:tracking-normal"
              >
                <Sigma className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Overview
              </a>
              <a
                href="#year-by-year"
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs sm:normal-case sm:tracking-normal"
              >
                <Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Year-by-year
              </a>
              <div className="ml-auto">
                <DownloadCurriculum />
              </div>
            </div>
          </div>

          <CollapseStackProvider>
            {/* Breakdown — section 1 */}
            <section id="breakdown" className="scroll-mt-24">
              <CurriculumBreakdown />
            </section>

            {/* Visual divider — Σ marks the seam between sections */}
            <div className="relative" aria-hidden>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background font-serif text-base text-muted-foreground">
                  Σ
                </span>
              </div>
            </div>

            {/* Year-by-year — section 2 */}
            <section id="year-by-year" className="scroll-mt-24">
              <CurriculumTree />
            </section>
          </CollapseStackProvider>
        </div>
      </main>

      <footer className="border-t border-border/60 bg-background/80 py-6 text-center text-[11px] uppercase tracking-[0.15em] text-muted-foreground backdrop-blur-md">
        IRIS 34 · SUST Statistics 2024 · <a href="https://inmlink.netlify.app" target="_blank" rel="noopener noreferrer"> <span className="text-base align-middle">&copy;</span> Ishat Noor Mahi </a> | <a href="https://www.facebook.com/msi.akib.50" target="_blank" rel="noopener noreferrer"> Zeehad er bondhu Akib </a>
      </footer>
    </>
  );
}
