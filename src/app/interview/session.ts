import {
  questionBank,
  questionBankToInterview,
  type QuestionBankEntry,
} from "./question-bank";
import type { InterviewQuestion } from "./data";

const SELECTION_KEY = "elias-interview-selection";

export function saveInterviewSelection(questionIds: string[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SELECTION_KEY, JSON.stringify(questionIds));
}

export function loadInterviewSelection(): string[] | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SELECTION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : null;
  } catch {
    return null;
  }
}

export function clearInterviewSelection() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SELECTION_KEY);
}

export function getSessionReviewQueueIds(): string[] {
  return loadInterviewSelection() ?? [];
}

/** Full questionnaire (same list as the pre-interview selection screen). */
export function getAllInterviewQuestions(): InterviewQuestion[] {
  return questionBank.map(questionBankToInterview);
}

/** Questions selected on the pre-screen for DSNA review (subset of the bank). */
export function getSessionReviewQueueQuestions(): InterviewQuestion[] {
  const ids = getSessionReviewQueueIds();
  if (!ids.length) return [];
  const byId = new Map(questionBank.map((q) => [q.id, q]));
  return ids
    .map((id) => byId.get(id))
    .filter((q): q is QuestionBankEntry => Boolean(q))
    .map(questionBankToInterview);
}

/** @deprecated Use getAllInterviewQuestions + getSessionReviewQueueIds */
export function getSessionInterviewQuestions(): InterviewQuestion[] {
  return getSessionReviewQueueQuestions();
}

export function getTabletYesIds(): string[] {
  return questionBank
    .filter((q) => q.tabletResponse === "yes")
    .map((q) => q.id);
}
