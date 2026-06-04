// Mock data for the Stitch "Clinical Precision" donor interview mockup.

import type { EscalationLevel } from "./escalation";

export type DonorScreeningResponse = "yes" | "no";

export type { EscalationLevel };

export type Outcome = "eligible" | "nurse_review" | "deferred" | null;

export type QuestionReviewStatus = "ok" | "clarify" | "attention" | "pending";

export type ChecklistFilter = "review" | "all" | "clear";

export interface QuickOption {
  id: string;
  label: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  quickOptions: QuickOption[];
  escalation: EscalationLevel;
  /** Pill selections that require nurse takeover (e.g. B2a = No) */
  takeoverOnPillIds?: string[];
  /** Pill selections that require nurse consult before DSNA continues */
  consultOnPillIds?: string[];
}

export interface ScreeningQuestionFlow {
  section: string;
  questionNumber: string;
  question: string;
  donorResponse: DonorScreeningResponse;
  /** Show follow-ups when centre-panel response matches this (defaults to donorResponse) */
  followUpTrigger?: DonorScreeningResponse;
  flagReason: string;
  followUps: FollowUpQuestion[];
}

export interface InterviewQuestion {
  id: string;
  /** Paper questionnaire code, e.g. B6 */
  code: string;
  /** Electronic questionnaire code from WI-00037, e.g. PQ */
  emqCode: string;
  category: string;
  question: string;
  reviewStatus: QuestionReviewStatus;
  escalation: EscalationLevel;
  /** Response from the waiting-room tablet; null if not yet answered */
  tabletResponse: DonorScreeningResponse | null;
  /** Maps to a detailed screening flow in the main panel */
  flowKey?: string;
  /** WI-00037 direction text */
  wiDirection?: string;
}

export interface Donor {
  name: string;
  donorId: string;
  bloodType: string;
  lastDonation: string;
}

export const donor: Donor = {
  name: "Marcus Thorne",
  donorId: "8823-A",
  bloodType: "O-Neg",
  lastDonation: "4 months ago",
};

export function filterInterviewQuestions(
  questions: InterviewQuestion[],
  filter: ChecklistFilter
): InterviewQuestion[] {
  switch (filter) {
    case "review":
      return questions.filter((q) => q.reviewStatus !== "ok");
    case "clear":
      return questions.filter((q) => q.reviewStatus === "ok");
    default:
      return questions;
  }
}

export function getChecklistCounts(questions: InterviewQuestion[]) {
  return {
    review: questions.filter((q) => q.reviewStatus !== "ok").length,
    clear: questions.filter((q) => q.reviewStatus === "ok").length,
    all: questions.length,
  };
}

import {
  lifebloodClinicalInsights,
  lifebloodScreeningFlows,
} from "./lifeblood-flows";

export const screeningFlows = lifebloodScreeningFlows;

export const clinicalInsightByFlow = lifebloodClinicalInsights;

export const referenceGuidance = [
  {
    id: "questionnaire-a",
    label: "Donor questionnaire — Section A (new & returned donors)",
  },
  {
    id: "questionnaire-b",
    label: "Donor questionnaire — Section B (medical)",
  },
  {
    id: "questionnaire-c",
    label: "Donor questionnaire — Section C (declaration)",
  },
  {
    id: "travel-matrix",
    label: "Travel deferral matrix",
  },
];

export function initialQuestionResponses(
  questions: InterviewQuestion[]
): Record<string, DonorScreeningResponse | null> {
  return Object.fromEntries(questions.map((q) => [q.id, q.tabletResponse]));
}
