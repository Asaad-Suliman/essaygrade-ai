import OpenAI from "openai";

export async function evaluateEssay(
  essay: string,
  gradeLevel: string,
  rubricType: string,
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert essay evaluator for educational institutions. Evaluate the following student essay based on the specified rubric type and grade level. Be constructive, specific, and encouraging.

Grade Level: ${gradeLevel}
Rubric Type: ${rubricType}

Respond ONLY with valid JSON in this exact format, no markdown, no code blocks:
{
  "grammar_score": <1-10>,
  "structure_score": <1-10>,
  "argumentation_score": <1-10>,
  "critical_thinking_score": <1-10>,
  "overall_grade": "<A+|A|A-|B+|B|B-|C+|C|C-|D|F>",
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "detailed_feedback": "A 2-3 sentence summary of the essay quality with specific, actionable advice."
}`,
      },
      {
        role: "user",
        content: essay,
      },
    ],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from AI");

  const cleaned = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  return JSON.parse(cleaned);
}
