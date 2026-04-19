import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:py-32">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            SUST Statistics · Batch 34
          </p>
          <h1 className="font-serif text-5xl leading-tight tracking-tight sm:text-7xl">
            IRIS 34
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A landing page is on the way — a proper introduction to the batch,
            the curriculum, and the memories. For now, the GPA calculator is
            live.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Open calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Curriculum
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
