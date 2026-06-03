// Mock data for the Stitch "Clinical Precision" donor interview mockup.

export type ChecklistStatus = "complete" | "clarification" | "pending";

export type ClarificationAnswer =
  | "none"
  | "anesthetic"
  | "antibiotics"
  | null;

export type Outcome = "eligible" | "nurse_review" | "deferred" | null;

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

export const activeClarification = {
  topic: "Recent Dental Work",
  question:
    "Was any local anesthetic or antibiotics used during the procedure?",
  guidance:
    "The duration of deferral depends on the invasiveness and the use of pharmacological agents.",
  answerOptions: [
    { id: "none" as const, label: "None / Routine Cleaning" },
    { id: "anesthetic" as const, label: "Local Anesthetic Only" },
    { id: "antibiotics" as const, label: "Antibiotics Prescribed" },
  ],
};

export const clinicalInsight = {
  title: "Flagged: Dental Work",
  body: "Standard deferral applies from the procedure date. Routine cleaning with no pharmacological agents may proceed after 24 hours. Local anesthetic extends deferral to 72 hours. Antibiotic prescription requires full course completion plus 7 symptom-free days.",
  reference: "Blood Service Guideline v4.2 Sec 12",
  deferralNote: "72h deferral from procedure date when local anesthetic was used.",
};

export const linkedProtocols = [
  "Infectious Disease Protocol",
  "Surgical Deferrals",
];

export const interviewHistory = [
  { event: "Screening started by Staff-224", time: "Today, 09:12 AM" },
];

export function computeProgress(reviewedCount: number, total: number) {
  return Math.round((reviewedCount / total) * 100);
}

/** Reviewed = complete items + clarification resolved */
export const reviewedBaseline = 20;
