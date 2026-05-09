export type Domain =
  | "Design Secure Architectures"
  | "Design Resilient Architectures"
  | "Design High-Performing Architectures"
  | "Design Cost-Optimized Architectures";

export interface Question {
  id: string;
  domain: Domain;
  question: string;
  question_type: "single" | "multiple";
  options: { key: string; text: string }[];
  correct: string;
  explanations: Record<string, string | null | undefined>;
  created_at: string;
}

export interface ExamSession {
  id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  total: number;
  answers: Record<string, string>;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  is_correct: boolean;
  selected: string;
  attempted_at: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}

export interface DomainStats {
  domain: Domain;
  total: number;
  correct: number;
  percentage: number;
}

export interface QuestionStats {
  question_id: string;
  times_practiced: number;
  times_correct: number;
  accuracy: number;
}
