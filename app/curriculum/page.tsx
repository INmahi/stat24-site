import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CurriculumPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:py-28">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Curriculum
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
          Coming soon
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          A hierarchical view of the B.Sc. (Hons.) Statistics curriculum — year
          by year, with theory/lab/major breakdowns and an AI assistant
          dedicated to the syllabus.
        </p>

        <Link
          href="/calculator"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Go to calculator
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
