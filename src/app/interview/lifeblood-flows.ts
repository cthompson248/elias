import type { ScreeningQuestionFlow } from "./data";

/** Interview-room follow-ups (paper sub-questions + nurse clarification) */
export const lifebloodScreeningFlows: Record<string, ScreeningQuestionFlow> = {
  a1: {
    section: "SECTION A",
    questionNumber: "A1",
    question: "Have you ever volunteered to donate blood or plasma before?",
    donorResponse: "yes",
    flagReason:
      "Confirm prior donation history. Capture where and when if the donor volunteered before.",
    followUps: [
      {
        id: "a1a",
        question: "Where and when did you previously donate?",
        quickOptions: [
          { id: "lifeblood", label: "Australian Red Cross Lifeblood" },
          { id: "other-au", label: "Other Australian centre" },
          { id: "overseas", label: "Overseas" },
          { id: "unknown", label: "Donor unsure — see notes" },
        ],
      },
    ],
  },

  a15: {
    section: "SECTION A",
    questionNumber: "A15",
    question: "Been outside Australia in the last 3 years?",
    donorResponse: "yes",
    flagReason: "Travel may require deferral depending on destination and duration.",
    followUps: [
      {
        id: "a15a",
        question: "Have you been in Papua New Guinea (PNG) in the last 3 years?",
        quickOptions: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "unsure", label: "Donor unsure" },
        ],
      },
    ],
  },

  b2: {
    section: "SECTION B",
    questionNumber: "B2",
    question:
      "Did you have any side effects after leaving the donor centre after your last donation?",
    donorResponse: "yes",
    flagReason:
      "Prior adverse events may affect eligibility or require medical review.",
    followUps: [
      {
        id: "b2a",
        question:
          "Did you report this to Australian Red Cross Lifeblood?",
        quickOptions: [
          { id: "yes", label: "Yes — reported to Lifeblood" },
          { id: "no", label: "No — not reported" },
          { id: "first", label: "First donation — not applicable" },
        ],
      },
    ],
  },

  b6: {
    section: "SECTION B",
    questionNumber: "B6",
    question:
      "In the last week: dental work, aspirin/pain killers/anti-inflammatories, or cuts/abrasions/sores/rashes?",
    donorResponse: "yes",
    flagReason:
      "Dental work, NSAIDs and skin breaks can affect donation timing and product suitability.",
    followUps: [
      {
        id: "dental",
        question: "Had dental work, cleaning, fillings or extractions in the last week?",
        quickOptions: [
          { id: "yes", label: "Yes — dental work" },
          { id: "no", label: "No dental work" },
        ],
      },
      {
        id: "nsaids",
        question:
          "Taken aspirin, pain killers or anti-inflammatory preparations in the last week?",
        quickOptions: [
          { id: "yes", label: "Yes — aspirin/NSAIDs" },
          { id: "no", label: "No" },
        ],
      },
      {
        id: "skin",
        question: "Had cuts, abrasions, sores or rashes in the last week?",
        quickOptions: [
          { id: "yes", label: "Yes — cuts/sores/rashes" },
          { id: "no", label: "No" },
        ],
      },
    ],
  },

  b12: {
    section: "SECTION B",
    questionNumber: "B12",
    question:
      "Since last donation (or last 12 months if new): any medication including regular, trial, or acne/skin medications?",
    donorResponse: "yes",
    flagReason:
      "Some medications (e.g. NSAIDs, antibiotics, acne treatments) affect eligibility or product type.",
    followUps: [
      {
        id: "med-type",
        question: "What medication was taken and how recently?",
        quickOptions: [
          { id: "regular", label: "Regular prescription medication" },
          { id: "nsaid", label: "Aspirin / anti-inflammatory" },
          { id: "antibiotic", label: "Antibiotics" },
          { id: "acne", label: "Acne or skin condition medication" },
          { id: "trial", label: "Clinical trial medication" },
          { id: "other", label: "Other — see notes" },
        ],
      },
    ],
  },

  b15: {
    section: "SECTION B",
    questionNumber: "B15",
    question:
      "Since last donation (or last 12 months if new): been pregnant (including miscarriage/termination)?",
    donorResponse: "yes",
    flagReason: "Pregnancy history affects eligibility — confirm timing.",
    followUps: [
      {
        id: "b15a",
        question: "Have you been pregnant in the last 9 months?",
        quickOptions: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "na", label: "Not applicable (male donor)" },
        ],
      },
    ],
  },

  b17: {
    section: "SECTION B",
    questionNumber: "B17",
    question: "Since your last donation, have you been outside Australia?",
    donorResponse: "yes",
    flagReason:
      "Overseas travel may require deferral. Confirm countries, dates and malaria-risk exposure.",
    followUps: [
      {
        id: "destinations",
        question: "Which countries or regions, and when?",
        quickOptions: [
          { id: "malaria-risk", label: "Malaria-risk region" },
          { id: "png", label: "Papua New Guinea" },
          { id: "uk-eu", label: "UK / Europe" },
          { id: "other", label: "Other — see notes" },
        ],
      },
    ],
  },

  c7: {
    section: "SECTION C",
    questionNumber: "C7",
    question:
      "In the last 6 months, sex (excluding oral) with someone new?",
    donorResponse: "yes",
    flagReason:
      "New partner sexual history may fall in a window-period risk category. Clarify with donor privately.",
    followUps: [
      {
        id: "c7a",
        question: "Have you had anal sex in the last 3 months?",
        quickOptions: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "declined", label: "Donor declined to answer" },
        ],
      },
    ],
  },

  c8: {
    section: "SECTION C",
    questionNumber: "C8",
    question:
      "In the last 6 months, sex (excluding oral) with more than one person?",
    donorResponse: "yes",
    flagReason:
      "Multiple partners may increase window-period risk. Clarify with donor privately.",
    followUps: [
      {
        id: "c8a",
        question: "Have you had anal sex in the last 3 months?",
        quickOptions: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "declined", label: "Donor declined to answer" },
        ],
      },
    ],
  },

  c11: {
    section: "SECTION C",
    questionNumber: "C11",
    question:
      "In the last 4 months, tattoo, body/ear piercing or acupuncture?",
    donorResponse: "yes",
    flagReason:
      "Skin penetration procedures carry standard deferral windows — confirm type, date and regulated provider.",
    followUps: [
      {
        id: "procedure",
        question: "What procedure, when, and was it at a licensed/regulated provider?",
        quickOptions: [
          { id: "tattoo", label: "Tattoo" },
          { id: "piercing", label: "Piercing" },
          { id: "acupuncture", label: "Acupuncture" },
          { id: "multiple", label: "More than one" },
          { id: "other", label: "Other — see notes" },
        ],
      },
    ],
  },
};

export const lifebloodClinicalInsights: Record<
  string,
  { title: string; body: string; reference: string; deferralNote?: string }
> = {
  a1: {
    title: "Flagged: A1 Prior donation",
    body: "Verify prior donation history and any prior deferrals before proceeding.",
    reference: "Donor Questionnaire Section A",
  },
  a15: {
    title: "Flagged: A15 Recent travel",
    body: "Confirm destinations. PNG travel may require specific deferral assessment.",
    reference: "Travel deferral matrix",
    deferralNote: "PNG in last 3 years — confirm against current travel policy.",
  },
  b2: {
    title: "Flagged: B2 Post-donation effects",
    body: "Prior reactions may require nurse or medical review before proceeding.",
    reference: "Adverse reaction protocol",
  },
  b6: {
    title: "Flagged: B6 Recent dental / NSAIDs / skin",
    body: "Dental work and NSAIDs can affect timing; skin breaks may require assessment.",
    reference: "Medication & procedure deferral guides",
    deferralNote: "NSAIDs within 48 hours may affect platelet donation.",
  },
  b12: {
    title: "Flagged: B12 Medications",
    body: "Confirm all medications including regular, trial and acne/skin treatments.",
    reference: "Medication deferral guide",
  },
  b15: {
    title: "Flagged: B15 Pregnancy history",
    body: "Pregnancy within deferral window excludes donation today.",
    reference: "Pregnancy deferral standard",
  },
  b17: {
    title: "Flagged: B17 Overseas travel",
    body: "Apply travel deferral matrix for region and duration since return.",
    reference: "Travel deferral matrix",
  },
  c7: {
    title: "Flagged: C7 New partner",
    body: "Assess window-period risk. C7a anal sex response may extend deferral requirements.",
    reference: "Sexual behaviour risk policy",
  },
  c8: {
    title: "Flagged: C8 Multiple partners",
    body: "Assess window-period risk. C8a anal sex response may extend deferral requirements.",
    reference: "Sexual behaviour risk policy",
  },
  c11: {
    title: "Flagged: C11 Tattoo / piercing / acupuncture",
    body: "Standard deferral from procedure date applies for non-exempt skin penetration.",
    reference: "Skin penetration policy §2.1",
    deferralNote: "Typical 4-month deferral for tattoo/piercing — confirm date.",
  },
};
