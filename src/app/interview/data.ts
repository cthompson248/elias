// Mock data for the Stitch "Clinical Precision" donor interview mockup.

export type DonorScreeningResponse = "yes" | "no";

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
}

export interface ScreeningQuestionFlow {
  section: string;
  questionNumber: string;
  question: string;
  donorResponse: DonorScreeningResponse;
  flagReason: string;
  followUps: FollowUpQuestion[];
}

export interface InterviewQuestion {
  id: string;
  /** Short code for nurse selection, e.g. MED-07 */
  code: string;
  category: string;
  question: string;
  reviewStatus: QuestionReviewStatus;
  /** Response from the waiting-room tablet; null if not yet answered */
  tabletResponse: DonorScreeningResponse | null;
  /** Maps to a detailed screening flow in the main panel */
  flowKey?: string;
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
