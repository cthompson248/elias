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

export const medicationsScreeningFlow: ScreeningQuestionFlow = {
  section: "MEDICATIONS",
  questionNumber: "Q7",
  question: "Taken any medication in the last 14 days?",
  donorResponse: "yes",
  flagReason:
    "Some medications (e.g. NSAIDs) affect platelet function. Confirm type and timing.",
  followUps: [
    {
      id: "med-type",
      question: "What medication was taken and how recently?",
      quickOptions: [
        { id: "paracetamol", label: "Paracetamol, yesterday" },
        { id: "ibuprofen", label: "Ibuprofen, 3 days ago" },
        { id: "antibiotics", label: "Antibiotics, 7 days ago" },
        { id: "iron", label: "Iron supplement, daily" },
        { id: "other", label: "Other — see notes" },
      ],
    },
    {
      id: "donation-product",
      question: "Is the donor scheduled for whole blood or platelets today?",
      quickOptions: [
        { id: "whole", label: "Whole blood" },
        { id: "platelets", label: "Platelets" },
        { id: "plasma", label: "Plasma" },
        { id: "unknown", label: "Not yet confirmed" },
      ],
    },
  ],
};

export const dentalScreeningFlow: ScreeningQuestionFlow = {
  section: "RECENT PROCEDURES",
  questionNumber: "Q23",
  question: "Have you had dental work in the last 7 days?",
  donorResponse: "yes",
  flagReason:
    "Dental procedures may require deferral depending on invasiveness and whether local anesthetic or antibiotics were used. Confirm type and timing with the donor.",
  followUps: [
    {
      id: "procedure-type",
      question: "What type of procedure was performed and when?",
      quickOptions: [
        { id: "cleaning", label: "Routine cleaning, 3 days ago" },
        { id: "filling", label: "Filling, 3 days ago" },
        { id: "extraction", label: "Extraction, 3 days ago" },
        { id: "other", label: "Other — see notes" },
      ],
    },
    {
      id: "pharmacological",
      question:
        "Was any local anesthetic or antibiotics used during the procedure?",
      quickOptions: [
        { id: "none", label: "None / routine cleaning only" },
        { id: "anesthetic", label: "Local anesthetic only" },
        { id: "antibiotics", label: "Antibiotics prescribed" },
        { id: "both", label: "Both anesthetic and antibiotics" },
      ],
    },
    {
      id: "donation-type",
      question: "Is the donor scheduled for whole blood or platelets today?",
      quickOptions: [
        { id: "whole", label: "Whole blood" },
        { id: "platelets", label: "Platelets" },
        { id: "plasma", label: "Plasma" },
        { id: "unknown", label: "Not yet confirmed" },
      ],
    },
  ],
};

export const screeningFlows: Record<string, ScreeningQuestionFlow> = {
  medications: medicationsScreeningFlow,
  dental: dentalScreeningFlow,
};

export const clinicalInsightByFlow: Record<
  string,
  { title: string; body: string; reference: string; deferralNote?: string }
> = {
  medications: {
    title: "Flagged: Medication intake",
    body: "NSAIDs such as ibuprofen can affect platelet function. Confirm timing and whether the donor is donating platelets today before proceeding.",
    reference: "Medication Deferral Guide §4.2",
    deferralNote:
      "Ibuprofen within 48 hours may require deferral for platelet donation.",
  },
  dental: {
    title: "Flagged: Dental Work",
    body: "Standard deferral applies from the procedure date. Routine cleaning with no pharmacological agents may proceed after 24 hours. Local anesthetic extends deferral to 72 hours. Antibiotic prescription requires full course completion plus 7 symptom-free days.",
    reference: "Blood Service Guideline v4.2 Sec 12",
    deferralNote:
      "72h deferral from procedure date when local anesthetic was used.",
  },
};

export const referenceGuidance = [
  {
    id: "dental-deferral",
    label: "Donor eligibility manual §12.4 — Dental procedures",
  },
  {
    id: "surgical-deferral",
    label: "Surgical deferral guideline §2.1",
  },
  {
    id: "anaesthetic-table",
    label: "Local anaesthetic deferral table",
  },
];

export function initialQuestionResponses(
  questions: InterviewQuestion[]
): Record<string, DonorScreeningResponse | null> {
  return Object.fromEntries(questions.map((q) => [q.id, q.tabletResponse]));
}
