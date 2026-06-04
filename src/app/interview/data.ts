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
  /** B5: GSBD hazardous activity lookup instead of pill follow-ups */
  hazardousActivity?: boolean;
  /** C14: GSBD sexual contact lookup from notes below the question */
  sexualContactGuidance?: boolean;
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

/** @deprecated Use filterChecklistQuestions with full bank + review queue ids */
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

/** Review = pre-screen selection; All = full questionnaire; Clear = not in review queue */
export function filterChecklistQuestions(
  allQuestions: InterviewQuestion[],
  filter: ChecklistFilter,
  reviewQueueIds: ReadonlySet<string>
): InterviewQuestion[] {
  switch (filter) {
    case "review":
      return allQuestions.filter((q) => reviewQueueIds.has(q.id));
    case "clear":
      return allQuestions.filter((q) => !reviewQueueIds.has(q.id));
    default:
      return allQuestions;
  }
}

export function getChecklistCounts(
  allQuestions: InterviewQuestion[],
  reviewQueueIds: ReadonlySet<string>
) {
  const review = allQuestions.filter((q) => reviewQueueIds.has(q.id)).length;
  return {
    review,
    clear: allQuestions.length - review,
    all: allQuestions.length,
  };
}

import {
  lifebloodClinicalInsights,
  lifebloodScreeningFlows,
} from "./lifeblood-flows";

export const screeningFlows = lifebloodScreeningFlows;

export const clinicalInsightByFlow = lifebloodClinicalInsights;

/** Quick links to GSBD sections (not the paper/eMQ questionnaire). */
export const referenceGuidance = [
  {
    id: "gsbd-hazardous-activities",
    label: "GSBD — Hazardous occupational/recreational activities",
  },
  {
    id: "gsbd-travel",
    label: "GSBD — Travel deferrals",
  },
  {
    id: "gsbd-medications",
    label: "GSBD — Medication deferrals",
  },
  {
    id: "gsbd-allow-listed-medical",
    label: "GSBD — Allow-listed medical scenarios",
  },
  {
    id: "gsbd-pregnancy",
    label: "GSBD — Pregnancy deferrals",
  },
  {
    id: "gsbd-skin-penetration",
    label: "GSBD — Skin penetration (tattoo, piercing, acupuncture)",
  },
  {
    id: "gsbd-sexual-activity",
    label: "GSBD — Sexual activity deferrals",
  },
  {
    id: "gsbd-adverse-reactions",
    label: "GSBD — Adverse donation reactions",
  },
];

export type ReferenceGuidanceItem = (typeof referenceGuidance)[number];

/** GSBD quick links keyed by interview flow (lifeblood-flows.ts). */
const flowReferenceGuidanceIds: Record<string, string[]> = {
  a3: ["gsbd-allow-listed-medical"],
  a15: ["gsbd-travel"],
  b2: ["gsbd-adverse-reactions"],
  b5: ["gsbd-hazardous-activities"],
  b6: ["gsbd-medications"],
  b8: ["gsbd-allow-listed-medical"],
  b11: ["gsbd-sexual-activity"],
  b12: ["gsbd-medications"],
  b13: ["gsbd-medications"],
  b15: ["gsbd-pregnancy"],
  b17: ["gsbd-travel"],
  c7: ["gsbd-sexual-activity"],
  c8: ["gsbd-sexual-activity"],
  c11: ["gsbd-skin-penetration"],
  c14: ["gsbd-sexual-activity"],
};

/** GSBD quick links for primary questions without a dedicated flow. */
const questionReferenceGuidanceIds: Record<string, string[]> = {
  a13: ["gsbd-travel"],
  b16: ["gsbd-travel"],
};

export function referenceGuidanceIdsForQuestion(
  question: InterviewQuestion
): string[] {
  if (question.flowKey && flowReferenceGuidanceIds[question.flowKey]) {
    return flowReferenceGuidanceIds[question.flowKey];
  }
  return questionReferenceGuidanceIds[question.id] ?? [];
}

/** GSBD sections linked to questions the donor has answered Yes to. */
export function getRelevantReferenceGuidance(
  questions: InterviewQuestion[],
  responses: Record<string, DonorScreeningResponse | null>
): ReferenceGuidanceItem[] {
  const linked = new Set<string>();
  for (const q of questions) {
    if (responses[q.id] !== "yes") continue;
    for (const id of referenceGuidanceIdsForQuestion(q)) {
      linked.add(id);
    }
  }
  return referenceGuidance.filter((item) => linked.has(item.id));
}

/** Selected review-queue items default to Yes (tablet flagged in external system). */
export function initialQuestionResponses(
  allQuestions: InterviewQuestion[],
  reviewQueueIds: ReadonlySet<string>
): Record<string, DonorScreeningResponse | null> {
  return Object.fromEntries(
    allQuestions.map((q) => [
      q.id,
      reviewQueueIds.has(q.id) ? "yes" : q.tabletResponse,
    ])
  );
}
