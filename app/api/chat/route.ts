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

Rules:
- Ground answers in the curriculum provided. Reference courses by code (e.g. "STA 2251").
- Keep answers concise (2–4 short paragraphs at most). Use bullet lists when helpful.
- If something falls outside the curriculum, say so briefly and answer with general academic guidance.
- Be encouraging but honest about difficulty and workload.
- Never invent courses, texts, or grades. If you don't know, say so.

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
