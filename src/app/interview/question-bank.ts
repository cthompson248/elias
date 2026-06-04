import type { InterviewQuestion, QuestionReviewStatus } from "./data";
import type { DonorScreeningResponse } from "./data";
import { lifebloodQuestionBank } from "./lifeblood-questions";

export interface QuestionBankEntry {
  id: string;
  /** Short code shown to nurses, e.g. B6, C7 */
  code: string;
  category: string;
  question: string;
  reviewStatus: QuestionReviewStatus;
  tabletResponse: DonorScreeningResponse | null;
  /** Links to lifeblood-flows.ts when interview follow-ups exist */
  flowKey?: string;
}

/** Lifeblood donor questionnaire — Sections A, B, C (47 Yes/No questions) */
export const questionBank: QuestionBankEntry[] = lifebloodQuestionBank;

export function questionBankToInterview(entry: QuestionBankEntry): InterviewQuestion {
  return {
    id: entry.id,
    code: entry.code,
    category: entry.category,
    question: entry.question,
    reviewStatus: entry.reviewStatus,
    tabletResponse: entry.tabletResponse,
    flowKey: entry.flowKey,
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
