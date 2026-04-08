import Anthropic from '@anthropic-ai/sdk';
import { EvaluationResult, GradeLevel, RubricType } from '@/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function evaluateEssay(
  essay: string,
  gradeLevel: GradeLevel,
  rubricType: RubricType
): Promise<EvaluationResult> {
  const gradeLevelLabel: Record<GradeLevel, string> = {
    elementary: 'Elementary School',
    middle_school: 'Middle School',
    high_school: 'High School',
    university: 'University',
  };

  const rubricLabel: Record<RubricType, string> = {
    argumentative: 'Argumentative',
    narrative: 'Narrative',
    expository: 'Expository',
    persuasive: 'Persuasive',
    research: 'Research Paper',
  };

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: `You are an expert essay evaluator for educational institutions. Evaluate the following student essay based on the specified rubric type and grade level. Be constructive, specific, and encouraging.

Grade Level: ${gradeLevelLabel[gradeLevel]}
Rubric Type: ${rubricLabel[rubricType]}

Respond ONLY with valid JSON in this exact format:
{
  "grammar_score": <1-10>,
  "structure_score": <1-10>,
  "argumentation_score": <1-10>,
  "critical_thinking_score": <1-10>,
  "overall_grade": "<A+|A|A-|B+|B|B-|C+|C|C-|D|F>",
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "detailed_feedback": "A 2-3 sentence summary of the essay's quality with specific, actionable advice."
}`,
    messages: [{ role: 'user', content: essay }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const result = JSON.parse(text) as EvaluationResult;
  return result;
}
