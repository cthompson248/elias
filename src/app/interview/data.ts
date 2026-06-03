// Mock data for the Stitch "Clinical Precision" donor interview mockup.

export type ChecklistStatus = "complete" | "clarification" | "pending";

export type DonorScreeningResponse = "yes" | "no";

export type Outcome = "eligible" | "nurse_review" | "deferred" | null;

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
  /** Response recorded on the waiting-room tablet */
  donorResponse: DonorScreeningResponse;
  flagReason: string;
  followUps: FollowUpQuestion[];
}

export interface ChecklistItem {
  id: string;
  section: string;
  label: string;
  status: ChecklistStatus;
  subtext?: string;
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

export const totalQuestions = 30;

export const checklistSections: { title: string; items: ChecklistItem[] }[] = [
  {
    title: "SECTION 1: RECENT HEALTH",
    items: [
      { id: "wellbeing", section: "SECTION 1: RECENT HEALTH", label: "General Wellbeing", status: "complete" },
      { id: "medication", section: "SECTION 1: RECENT HEALTH", label: "Medication intake", status: "complete" },
      {
        id: "dental",
        section: "SECTION 1: RECENT HEALTH",
        label: "Recent dental work",
        status: "clarification",
        subtext: "Reported: 3 days ago",
      },
    ],
  },
  {
    title: "SECTION 2: TRAVEL HISTORY",
    items: [
      { id: "africa", section: "SECTION 2: TRAVEL HISTORY", label: "Sub-Saharan Africa", status: "complete" },
      { id: "eu", section: "SECTION 2: TRAVEL HISTORY", label: "European Union (Last 3mo)", status: "complete" },
    ],
  },
  {
    title: "SECTION 3: LIFESTYLE",
    items: [
      { id: "tattoo", section: "SECTION 3: LIFESTYLE", label: "Tattoo or Piercing", status: "complete" },
      { id: "acupuncture", section: "SECTION 3: LIFESTYLE", label: "Acupuncture history", status: "complete" },
    ],
  },
];

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

export const clinicalInsight = {
  title: "Flagged: Dental Work",
  body: "Standard deferral applies from the procedure date. Routine cleaning with no pharmacological agents may proceed after 24 hours. Local anesthetic extends deferral to 72 hours. Antibiotic prescription requires full course completion plus 7 symptom-free days.",
  reference: "Blood Service Guideline v4.2 Sec 12",
  deferralNote: "72h deferral from procedure date when local anesthetic was used.",
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

export const interviewHistory = [
  { event: "Screening started by Staff-224", time: "Today, 09:12 AM" },
];

export function computeProgress(reviewedCount: number, total: number) {
  return Math.round((reviewedCount / total) * 100);
}

/** Reviewed = complete items + clarification resolved */
export const reviewedBaseline = 20;
