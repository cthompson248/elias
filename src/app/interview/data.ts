// Mock data + a small, transparent decision-support "rule engine" for the
// blood donation eligibility interview prototype. The engine is intentionally
// deterministic and rule-based: it returns rationale + references rather than a
// black-box answer, so the staff member keeps final judgment.

export type RiskLevel = "low" | "attention" | "high";

export type Outcome =
  | "eligible"
  | "nurse_review"
  | "doctor_review"
  | "deferred";

export interface FollowUp {
  id: string;
  prompt: string;
}

export interface Answer {
  id: string;
  section: string;
  question: string;
  /** The donor's tablet response, summarised. */
  response: string;
  risk: RiskLevel;
  /** Recommended follow-up questions surfaced by the workflow. */
  followUps?: FollowUp[];
  /** Short guidance reference (e.g. guideline clause). */
  reference?: string;
}

export interface Donor {
  name: string;
  donorId: string;
  age: number;
  sex: string;
  bloodType: string;
  donationType: string;
  appointment: string;
  lastDonation: string;
  totalDonations: number;
}

export const donor: Donor = {
  name: "Maya Okafor",
  donorId: "DNR-04821",
  age: 34,
  sex: "Female",
  bloodType: "O+",
  donationType: "Whole blood",
  appointment: "Today, 2:40 PM · Room 3",
  lastDonation: "104 days ago",
  totalDonations: 7,
};

export const sections = [
  "Identity & Eligibility",
  "General Health",
  "Medications",
  "Travel & Exposure",
  "Lifestyle & Risk",
  "Recent Procedures",
] as const;

export const answers: Answer[] = [
  // Identity & Eligibility
  {
    id: "q1",
    section: "Identity & Eligibility",
    question: "Are you feeling well and healthy today?",
    response: "Yes",
    risk: "low",
  },
  {
    id: "q2",
    section: "Identity & Eligibility",
    question: "Have you donated in the last 12 weeks?",
    response: "No — last donation 104 days ago",
    risk: "low",
  },
  {
    id: "q3",
    section: "Identity & Eligibility",
    question: "Did you eat in the last 4 hours?",
    response: "Yes",
    risk: "low",
  },
  {
    id: "q4",
    section: "Identity & Eligibility",
    question: "Have you brought valid photo ID?",
    response: "Yes",
    risk: "low",
  },

  // General Health
  {
    id: "q5",
    section: "General Health",
    question: "Have you had a fever or infection in the last 7 days?",
    response: "Yes — mild sore throat 3 days ago, no fever now",
    risk: "attention",
    reference: "Acute infection — defer until 7 days symptom-free",
    followUps: [
      { id: "q5f1", prompt: "Confirm current temperature is normal." },
      { id: "q5f2", prompt: "Any antibiotics started for this? If so, when?" },
      { id: "q5f3", prompt: "Are symptoms fully resolved today?" },
    ],
  },
  {
    id: "q6",
    section: "General Health",
    question: "Do you have a heart or lung condition?",
    response: "No",
    risk: "low",
  },
  {
    id: "q7",
    section: "General Health",
    question: "Have you ever fainted during or after a donation?",
    response: "Yes — once, in 2022",
    risk: "attention",
    reference: "Prior vasovagal reaction — flag for monitored donation",
    followUps: [
      { id: "q7f1", prompt: "Were there complications or just light-headedness?" },
      { id: "q7f2", prompt: "Confirm donor has eaten and hydrated today." },
    ],
  },
  {
    id: "q8",
    section: "General Health",
    question: "Are you pregnant or have you been in the last 6 months?",
    response: "No",
    risk: "low",
  },

  // Medications
  {
    id: "q9",
    section: "Medications",
    question: "Are you currently taking any antibiotics?",
    response: "Yes — started amoxicillin 2 days ago",
    risk: "high",
    reference: "Active antibiotic course indicates ongoing infection",
    followUps: [
      { id: "q9f1", prompt: "What is the antibiotic being treated for?" },
      { id: "q9f2", prompt: "When is the course expected to finish?" },
    ],
  },
  {
    id: "q10",
    section: "Medications",
    question: "Have you taken aspirin or anti-inflammatories in 48 hours?",
    response: "No",
    risk: "low",
  },
  {
    id: "q11",
    section: "Medications",
    question: "Are you on any blood-thinning medication?",
    response: "No",
    risk: "low",
  },
  {
    id: "q12",
    section: "Medications",
    question: "Have you taken acne medication (e.g. isotretinoin)?",
    response: "No",
    risk: "low",
  },

  // Travel & Exposure
  {
    id: "q13",
    section: "Travel & Exposure",
    question: "Have you travelled outside the country in the last 6 months?",
    response: "Yes — Kenya, returned 5 weeks ago",
    risk: "attention",
    reference: "Malaria-risk region — 4-month deferral may apply",
    followUps: [
      { id: "q13f1", prompt: "Which regions within Kenya, and for how long?" },
      { id: "q13f2", prompt: "Any fever or illness since returning?" },
      { id: "q13f3", prompt: "Did you take malaria prophylaxis?" },
    ],
  },
  {
    id: "q14",
    section: "Travel & Exposure",
    question: "Have you had close contact with anyone with hepatitis?",
    response: "No",
    risk: "low",
  },
  {
    id: "q15",
    section: "Travel & Exposure",
    question: "Have you received a blood transfusion abroad?",
    response: "No",
    risk: "low",
  },
  {
    id: "q16",
    section: "Travel & Exposure",
    question: "Have you been exposed to anyone with a known infection?",
    response: "No",
    risk: "low",
  },

  // Lifestyle & Risk
  {
    id: "q17",
    section: "Lifestyle & Risk",
    question: "Have you had a new sexual partner in the last 3 months?",
    response: "Prefer to discuss in person",
    risk: "attention",
    reference: "Discuss privately — assess window-period risk",
    followUps: [
      { id: "q17f1", prompt: "Explain confidentiality, then assess risk gently." },
    ],
  },
  {
    id: "q18",
    section: "Lifestyle & Risk",
    question: "Do you use intravenous recreational drugs?",
    response: "No",
    risk: "low",
  },
  {
    id: "q19",
    section: "Lifestyle & Risk",
    question: "Have you consumed alcohol in the last 24 hours?",
    response: "No",
    risk: "low",
  },
  {
    id: "q20",
    section: "Lifestyle & Risk",
    question: "Do you smoke or vape?",
    response: "Occasionally",
    risk: "low",
  },

  // Recent Procedures
  {
    id: "q21",
    section: "Recent Procedures",
    question: "Have you had a tattoo or piercing in the last 6 months?",
    response: "Yes — small tattoo 8 weeks ago",
    risk: "high",
    reference: "Tattoo <6 months — standard deferral window",
    followUps: [
      { id: "q21f1", prompt: "Was it done at a licensed, regulated studio?" },
      { id: "q21f2", prompt: "Confirm exact date of the procedure." },
    ],
  },
  {
    id: "q22",
    section: "Recent Procedures",
    question: "Have you had surgery in the last 6 months?",
    response: "No",
    risk: "low",
  },
  {
    id: "q23",
    section: "Recent Procedures",
    question: "Have you had dental work in the last 7 days?",
    response: "No",
    risk: "low",
  },
  {
    id: "q24",
    section: "Recent Procedures",
    question: "Have you had any vaccinations in the last 4 weeks?",
    response: "Yes — flu shot 3 weeks ago",
    risk: "low",
    reference: "Inactivated vaccine — no deferral required",
  },
];

// ---------------------------------------------------------------------------
// AI decision-support engine
// ---------------------------------------------------------------------------
// A library of recognised donor factors. The "AI" combines selected factors,
// returns the most restrictive recommendation, and always exposes the
// rationale + the source guidance behind each contribution.

export interface Factor {
  id: string;
  label: string;
  group: string;
  severity: Outcome;
  detail: string;
  reference: string;
}

export const factorLibrary: Factor[] = [
  {
    id: "f_antibiotics",
    label: "Active antibiotic course",
    group: "Medications",
    severity: "deferred",
    detail:
      "Antibiotics usually indicate an underlying infection. Defer until the course is complete and the donor is symptom-free.",
    reference: "Medication Deferral Guide §4.2",
  },
  {
    id: "f_tattoo",
    label: "Tattoo / piercing < 6 months",
    group: "Procedures",
    severity: "deferred",
    detail:
      "Standard 4–6 month deferral for non-sterile skin penetration due to bloodborne infection window period.",
    reference: "Skin Penetration Policy §2.1",
  },
  {
    id: "f_malaria",
    label: "Travel to malaria-risk region",
    group: "Travel",
    severity: "nurse_review",
    detail:
      "Possible malaria exposure. Verify region, duration, and prophylaxis. A 4-month deferral may apply; nurse to confirm region risk tier.",
    reference: "Travel Deferral Matrix — Tier 2",
  },
  {
    id: "f_fever",
    label: "Recent fever / infection",
    group: "Health",
    severity: "deferred",
    detail:
      "Defer until 7 days symptom-free to avoid collecting during an active infection.",
    reference: "Acute Illness Guideline §1.4",
  },
  {
    id: "f_faint",
    label: "Prior fainting at donation",
    group: "Health",
    severity: "nurse_review",
    detail:
      "Eligible but flag for a monitored donation with extra hydration and post-donation observation.",
    reference: "Adverse Reaction Protocol §3",
  },
  {
    id: "f_partner",
    label: "Possible window-period exposure",
    group: "Lifestyle",
    severity: "doctor_review",
    detail:
      "Sexual-history risk that may fall inside a testing window period. Requires private clinical assessment.",
    reference: "Sexual Behaviour Risk Policy §5",
  },
  {
    id: "f_anticoag",
    label: "Blood-thinning medication",
    group: "Medications",
    severity: "doctor_review",
    detail:
      "Anticoagulants affect platelet products and donor safety. Refer to clinician for product-specific guidance.",
    reference: "Medication Deferral Guide §6.1",
  },
  {
    id: "f_lowhb",
    label: "History of low haemoglobin",
    group: "Health",
    severity: "nurse_review",
    detail:
      "Confirm today's Hb meets the threshold before proceeding. Borderline results need nurse review.",
    reference: "Haemoglobin Standard §2",
  },
  {
    id: "f_vaccine",
    label: "Recent inactivated vaccine",
    group: "Procedures",
    severity: "eligible",
    detail:
      "Inactivated vaccines (e.g. flu) carry no deferral. Live vaccines would differ — confirm the vaccine type.",
    reference: "Vaccination Guideline §1.1",
  },
];

const outcomeRank: Record<Outcome, number> = {
  eligible: 0,
  nurse_review: 1,
  doctor_review: 2,
  deferred: 3,
};

export interface GuidanceResult {
  outcome: Outcome;
  headline: string;
  rationale: { factor: string; detail: string; reference: string; severity: Outcome }[];
  confidence: "high" | "moderate";
}

export function evaluateFactors(selectedIds: string[]): GuidanceResult | null {
  const selected = factorLibrary.filter((f) => selectedIds.includes(f.id));
  if (selected.length === 0) return null;

  const outcome = selected.reduce<Outcome>((worst, f) => {
    return outcomeRank[f.severity] > outcomeRank[worst] ? f.severity : worst;
  }, "eligible");

  const headlineMap: Record<Outcome, string> = {
    eligible: "No deferral indicated — donor appears eligible.",
    nurse_review: "Proceed with nurse review before donating.",
    doctor_review: "Escalate to doctor / specialist review.",
    deferred: "Deferral indicated for this combination of factors.",
  };

  // Confidence drops when factors point to conflicting outcomes.
  const distinct = new Set(selected.map((f) => f.severity)).size;
  const confidence = distinct > 2 ? "moderate" : "high";

  return {
    outcome,
    headline: headlineMap[outcome],
    rationale: selected
      .slice()
      .sort((a, b) => outcomeRank[b.severity] - outcomeRank[a.severity])
      .map((f) => ({
        factor: f.label,
        detail: f.detail,
        reference: f.reference,
        severity: f.severity,
      })),
    confidence,
  };
}

export const outcomeMeta: Record<
  Outcome,
  { label: string; tone: string; dot: string; text: string; border: string }
> = {
  eligible: {
    label: "Eligible to proceed",
    tone: "bg-emerald-50",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  nurse_review: {
    label: "Needs nurse review",
    tone: "bg-amber-50",
    dot: "bg-amber-500",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  doctor_review: {
    label: "Needs doctor / specialist",
    tone: "bg-orange-50",
    dot: "bg-orange-500",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  deferred: {
    label: "Deferred",
    tone: "bg-rose-50",
    dot: "bg-rose-500",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};
