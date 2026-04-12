export interface EvaluationResult {
  grammar_score: number;
  structure_score: number;
  argumentation_score: number;
  critical_thinking_score: number;
  overall_grade: string;
  strengths: string[];
  improvements: string[];
  detailed_feedback: string;
}

export interface Evaluation {
  id: string;
  user_id: string;
  essay_text: string;
  grade_level: string;
  rubric_type: string;
  student_name: string | null;
  results: EvaluationResult;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  plan: "free" | "pro";
  stripe_customer_id: string | null;
  evaluations_this_month: number;
  current_period_start: string;
  created_at: string;
}

export type GradeLevel =
  | "elementary"
  | "middle_school"
  | "high_school"
  | "university";
export type RubricType =
  | "argumentative"
  | "narrative"
  | "expository"
  | "persuasive"
  | "research";
