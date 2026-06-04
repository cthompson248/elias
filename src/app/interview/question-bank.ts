import type { EscalationLevel, InterviewQuestion, QuestionReviewStatus } from "./data";
import type { DonorScreeningResponse } from "./data";
import { lifebloodQuestionBank } from "./lifeblood-questions";

export interface QuestionBankEntry {
  id: string;
  code: string;
  emqCode: string;
  category: string;
  question: string;
  reviewStatus: QuestionReviewStatus;
  escalation: EscalationLevel;
  tabletResponse: DonorScreeningResponse | null;
  flowKey?: string;
  wiDirection?: string;
}

/** Lifeblood donor questionnaire — Sections A, B, C (47 Yes/No questions) */
export const questionBank: QuestionBankEntry[] = lifebloodQuestionBank;

export function questionBankToInterview(entry: QuestionBankEntry): InterviewQuestion {
  return {
    id: entry.id,
    code: entry.code,
    emqCode: entry.emqCode,
    category: entry.category,
    question: entry.question,
    reviewStatus: entry.reviewStatus,
    escalation: entry.escalation,
    tabletResponse: entry.tabletResponse,
    flowKey: entry.flowKey,
    wiDirection: entry.wiDirection,
  };
}

export function groupBankByCategory(
  entries: QuestionBankEntry[]
): { category: string; questions: QuestionBankEntry[] }[] {
  const order: string[] = [];
  const map = new Map<string, QuestionBankEntry[]>();
  for (const q of entries) {
    if (!map.has(q.category)) {
      map.set(q.category, []);
      order.push(q.category);
    }
    map.get(q.category)!.push(q);
  }
  return order.map((category) => ({
    category,
    questions: map.get(category)!,
  }));
}
