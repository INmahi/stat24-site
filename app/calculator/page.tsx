import { CgpaOverview } from "@/components/cgpa-overview";
import { SemesterCalculator } from "@/components/semester-calculator";

export default function CalculatorPage() {
  return (
    <>
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              GPA · CGPA
            </p>
            <h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">
              Calculator
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Compute a semester GPA with flexible grade entry. Track cumulative
              GPA across all eight semesters.
            </p>
          </div>

          <CgpaOverview />
          <SemesterCalculator />
        </div>
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        IRIS 34 · SUST Statistics 2024
      </footer>
    </>
  );
}
