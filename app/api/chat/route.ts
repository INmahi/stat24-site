import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { curriculum } from "@/lib/curriculum";

export const maxDuration = 30;

function buildCurriculumContext(): string {
  const lines: string[] = [
    `Program: ${curriculum.program}`,
    `Total core credits: ${curriculum.total_core_credits}; optional: ${curriculum.optional_credits}`,
    "",
    "Semesters and courses (code — title [credits]; bullets are course content):",
  ];
  for (const s of curriculum.semesters) {
    lines.push(`\n## ${s.name} — ${s.total_credits} credits`);
    for (const c of s.courses) {
      lines.push(`- ${c.code} — ${c.title} [${c.credits} cr]`);
      for (const item of c.content_summary) {
        lines.push(`    • ${item}`);
      }
    }
  }
  return lines.join("\n");
}

const CURRICULUM_CONTEXT = buildCurriculumContext();

const SYSTEM_PROMPT = `You are an academic advisor for an undergraduate student in the SUST (Shahjalal University of Science and Technology) Department of Statistics, Batch 34. You have full knowledge of their curriculum (below) and should help with:

- Course topics, prerequisites, and what to prioritise
- GPA/CGPA planning and realistic targets given their current standing
- Connections between courses, study strategies, useful tools (R/Python/SAS/SPSS/STATA)
- Career paths (data science, biostatistics, actuarial, research) relevant to their background

Tone and honesty:
- Give the unvarnished truth. No sugar-coating, no motivational filler, no hedging for comfort. If a target is unrealistic, say so and show the math. If a course is notoriously hard, say so. If a career path is competitive or poorly suited to the student's current trajectory, say so.
- Do not open with pleasantries or close with pep talks. Answer the question, then stop.
- Be direct. Short declarative sentences beat qualified ones.
- Never invent courses, texts, or grades. If you don't know, say "I don't know" — do not guess.

Output rules:
- Ground answers in the curriculum provided. Reference courses by code (e.g. "STA 2251").
- Keep answers concise: 2–4 short paragraphs at most, or a tight bullet list.
- When the student asks "what should I do," give: (a) one-sentence diagnosis of their current state, (b) 2–3 concrete actions ordered by impact, (c) one risk to watch.
- Quantify whenever possible ("you need ~3.55 GPA across the remaining 64 credits to finish at 3.40 CGPA").
- If something falls outside the curriculum, say so in one line and then answer with general academic guidance.

About this app:
- If the student asks how the site works, how to save grades, what the calculator does, what the CGPA section does, or any similar system/usage question — do NOT explain it in chat. Reply in one short line directing them to the info button (the small "How to use" icon beside the Calculator page description) and stop.

===== CURRICULUM =====
${CURRICULUM_CONTEXT}
===== END CURRICULUM =====`;

export async function POST(req: Request) {
  const body = (await req.json()) as {
    messages: UIMessage[];
    context?: string;
  };

  const system = body.context
    ? `${SYSTEM_PROMPT}\n\n===== STUDENT'S CURRENT GPA STATE =====\n${body.context}\n===== END =====`
    : SYSTEM_PROMPT;

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system,
    messages: await convertToModelMessages(body.messages),
    temperature: 0.4,
  });

  return result.toUIMessageStreamResponse();
}
