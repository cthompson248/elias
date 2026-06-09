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
        escalation: "dsna",
        quickOptions: [
          { id: "lifeblood", label: "Australian Red Cross Lifeblood" },
          { id: "other-au", label: "Other Australian centre" },
          { id: "overseas", label: "Overseas" },
          { id: "unknown", label: "Donor unsure — see notes" },
        ],
      },
    ],
  },

  a3: {
    section: "SECTION A",
    questionNumber: "A3",
    question:
      "Ever had anaemia or a blood disorder, or a serious illness, operation or hospital admission?",
    donorResponse: "yes",
    flagReason:
      "DSNA may only continue for WI allow-listed scenarios; otherwise consult a nurse.",
    followUps: [
      {
        id: "a3-scenario",
        question: "Which scenario best describes the donor's history?",
        escalation: "dsna_if_allowed",
        consultOnPillIds: ["other", "unsure"],
        quickOptions: [
          { id: "iron-b12", label: "Resolved iron / B12 deficiency" },
          { id: "g6pd", label: "G6PD deficiency" },
          { id: "surgery-ok", label: "Defined surgery — recovered per GSBD" },
          { id: "minor-injury", label: "Minor injury — fully recovered" },
          { id: "respiratory", label: "Cold / flu / COVID — resolved" },
          { id: "routine", label: "Routine check — no ongoing issue" },
          { id: "repeat-med", label: "Repeat medication — unchanged" },
          { id: "other", label: "Other — not on allow list" },
          { id: "unsure", label: "Donor unsure" },
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
        escalation: "dsna",
        quickOptions: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "unsure", label: "Donor unsure" },
        ],
      },
    ],
  },

  b1: {
    section: "SECTION B",
    questionNumber: "B1",
    question: "Are you feeling healthy and well?",
    donorResponse: "no",
    followUpTrigger: "no",
    flagReason:
      "If the donor is unwell or has a medication side effect, consult a nurse before proceeding.",
    followUps: [
      {
        id: "b1-reason",
        question: "Why is the donor not feeling healthy and well?",
        escalation: "consult_nurse",
        quickOptions: [
          { id: "unwell", label: "Feeling unwell today" },
          { id: "med-side-effect", label: "Medication side effect" },
          { id: "other", label: "Other concern" },
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
      "Prior adverse events may affect eligibility. Confirm whether reported to Lifeblood (B2a).",
    followUps: [
      {
        id: "b2a",
        question: "Did you report this to Australian Red Cross Lifeblood?",
        escalation: "dsna",
        takeoverOnPillIds: ["no"],
        quickOptions: [
          { id: "yes", label: "Yes — reported to Lifeblood" },
          { id: "no", label: "No — not reported" },
          { id: "first", label: "First donation — not applicable" },
        ],
      },
    ],
  },

  b5: {
    section: "SECTION B",
    questionNumber: "B5",
    question:
      "In the next 3 days, do you intend to participate in any activity which would place you or others at risk of injury if you were to become unwell after donating, such as driving public transport, operating heavy machinery, underwater diving, piloting a plane?",
    donorResponse: "yes",
    hazardousActivity: true,
    flagReason:
      "Donor intends a hazardous occupational or recreational activity. Identify the activity in GSBD and read the general advice to the donor.",
    followUps: [],
  },

  b3: {
    section: "SECTION B",
    questionNumber: "B3",
    question: "Are you allergic to the antiseptic chlorhexidine?",
    donorResponse: "yes",
    flagReason:
      "Consult nurse if allergy not in Medical Notes. Nurse takeover if history of anaphylaxis.",
    followUps: [
      {
        id: "b3-allergy",
        question: "Describe the chlorhexidine allergy",
        escalation: "consult_nurse",
        takeoverOnPillIds: ["anaphylaxis"],
        quickOptions: [
          { id: "mild", label: "Mild reaction — known to Lifeblood" },
          { id: "not-recorded", label: "Not previously recorded" },
          { id: "anaphylaxis", label: "History of anaphylaxis" },
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
      "Dental meds (not local anaesthetic), NSAIDs and skin breaks have distinct WI escalation paths.",
    followUps: [
      {
        id: "dental",
        question:
          "Had dental work, cleaning, fillings or extractions in the last week?",
        escalation: "dsna",
        consultOnPillIds: ["yes"],
        quickOptions: [
          { id: "yes", label: "Yes — dental work" },
          { id: "no", label: "No dental work" },
        ],
      },
      {
        id: "nsaids",
        question:
          "Taken aspirin, pain killers or anti-inflammatory preparations in the last week?",
        escalation: "dsna",
        consultOnPillIds: ["ongoing", "prescribed", "not-in-notes"],
        quickOptions: [
          { id: "yes-once", label: "Yes — one-off / OTC" },
          { id: "ongoing", label: "Yes — ongoing use" },
          { id: "prescribed", label: "Yes — prescribed" },
          { id: "not-in-notes", label: "Yes — not in Medical Notes" },
          { id: "no", label: "No" },
        ],
      },
      {
        id: "nsaid-what-for",
        question: "If aspirin/NSAIDs: what was it taken for?",
        escalation: "consult_nurse",
        consultOnPillIds: ["ongoing-pain", "prescribed", "unknown"],
        quickOptions: [
          { id: "headache", label: "Headache / one-off pain" },
          { id: "injury", label: "Recent injury" },
          { id: "ongoing-pain", label: "Ongoing pain condition" },
          { id: "prescribed", label: "Prescribed indication" },
          { id: "unknown", label: "Donor unsure" },
          { id: "na", label: "Not applicable" },
        ],
      },
      {
        id: "skin",
        question: "Had cuts, abrasions, sores or rashes in the last week?",
        escalation: "dsna",
        consultOnPillIds: ["significant", "infected"],
        quickOptions: [
          { id: "papercut", label: "Papercut / small scratch" },
          { id: "significant", label: "Larger cut / abrasion / sore" },
          { id: "infected", label: "Infected or weeping" },
          { id: "no", label: "No" },
        ],
      },
    ],
  },

  b8: {
    section: "SECTION B",
    questionNumber: "B8",
    question:
      "Since last donation (or last 12 months if new): unwell, seen a health practitioner, tests, or surgery?",
    donorResponse: "yes",
    flagReason:
      "DSNA may continue only for WI allow-listed scenarios (same as A3); otherwise consult nurse.",
    followUps: [
      {
        id: "b8-scenario",
        question: "Which scenario applies?",
        escalation: "dsna_if_allowed",
        consultOnPillIds: ["other", "unsure"],
        quickOptions: [
          { id: "iron-b12", label: "Resolved iron / B12 deficiency" },
          { id: "respiratory", label: "Cold / flu / COVID — resolved" },
          { id: "routine", label: "Routine check — no ongoing issue" },
          { id: "repeat-med", label: "Repeat medication — unchanged" },
          { id: "other", label: "Other — consult nurse" },
          { id: "unsure", label: "Donor unsure" },
        ],
      },
    ],
  },

  b11: {
    section: "SECTION B",
    questionNumber: "B11",
    question:
      "Since last donation (or last 12 months if new): sexually transmitted infection (e.g. syphilis, gonorrhoea, genital herpes)?",
    donorResponse: "yes",
    flagReason:
      "Consult nurse if diagnosis unknown. Nurse takeover if diagnosis cannot be established (DEL).",
    followUps: [
      {
        id: "b11-diagnosis",
        question: "Is the STI diagnosis known and documented?",
        escalation: "consult_nurse",
        takeoverOnPillIds: ["unknown-del"],
        quickOptions: [
          { id: "known-treated", label: "Known diagnosis — treated per GSBD" },
          { id: "known-active", label: "Known — may need deferral" },
          { id: "unknown", label: "Diagnosis not known — consult nurse" },
          {
            id: "unknown-del",
            label: "Cannot establish diagnosis — DEL / nurse takeover",
          },
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
      "Identify medication class. Consult nurse for Medical Notes changes, oral acne meds, and several classes per WI.",
    followUps: [
      {
        id: "med-type",
        question: "What medication was taken and how recently?",
        escalation: "dsna",
        consultOnPillIds: ["notes-change", "acne-oral", "trial"],
        quickOptions: [
          { id: "regular", label: "Regular prescription — unchanged in notes" },
          { id: "notes-change", label: "Change to regular meds in Medical Notes" },
          { id: "nsaid", label: "Aspirin / anti-inflammatory" },
          { id: "antibiotic", label: "Antibiotics" },
          { id: "acne-oral", label: "Oral acne / skin medication" },
          { id: "trial", label: "Clinical trial medication" },
          { id: "other", label: "Other — see notes" },
        ],
      },
    ],
  },

  b13: {
    section: "SECTION B",
    questionNumber: "B13",
    question:
      "Since last donation (or last 12 months if new): PrEP for HIV, or injectable medications?",
    donorResponse: "yes",
    flagReason:
      "Identify medication. Consult nurse if change to regular medication in Medical Notes.",
    followUps: [
      {
        id: "b13-med",
        question: "Which medication applies?",
        escalation: "consult_nurse",
        consultOnPillIds: ["notes-change", "injectable-other"],
        quickOptions: [
          { id: "prep", label: "PrEP for HIV" },
          { id: "injectable-known", label: "Injectable — known in notes" },
          { id: "notes-change", label: "New or changed — not in Medical Notes" },
          { id: "injectable-other", label: "Other injectable" },
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
    flagReason: "Pregnancy history affects eligibility — confirm timing (B15a).",
    followUps: [
      {
        id: "b15a",
        question: "Have you been pregnant in the last 9 months?",
        escalation: "dsna",
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
      "Overseas travel may require deferral. Nurse assesses destinations and malaria risk.",
    followUps: [
      {
        id: "destinations",
        question: "Which countries or regions, and when?",
        escalation: "consult_nurse",
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
    question: "In the last 6 months, sex (excluding oral) with someone new?",
    donorResponse: "yes",
    flagReason:
      "New partner sexual history may fall in a window-period risk category. Clarify with donor privately.",
    followUps: [
      {
        id: "c7a",
        question: "Have you had anal sex in the last 3 months?",
        escalation: "dsna",
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
    c8MultiplePartnersGuidance: true,
    flagReason:
      "Multiple partners may increase window-period risk. Clarify with donor privately.",
    followUps: [
      {
        id: "c8a",
        question: "Have you had anal sex in the last 3 months?",
        escalation: "dsna",
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
        question:
          "What procedure, when, and was it at a licensed/regulated provider?",
        escalation: "dsna",
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

  c14: {
    section: "SECTION C",
    questionNumber: "C14",
    question:
      'Have you engaged in sexual activity with someone who has ever "used drugs" by injection or been injected, even once, with drugs not prescribed by a doctor or dentist?',
    donorResponse: "yes",
    sexualContactGuidance: true,
    flagReason:
      "Sexual contact with a person who has injected non-prescribed drugs may require a restricted donation pathway.",
    followUps: [],
  },
};

export const lifebloodClinicalInsights: Record<
  string,
  { title: string; body: string; reference: string; deferralNote?: string }
> = {
  a1: {
    title: "Flagged: A1 Prior donation",
    body: "Check when and where the donor last donated, and whether they've been deferred before.",
    reference: "Donor Questionnaire Section A · WI-00037 AW",
  },
  a3: {
    title: "Flagged: A3 Medical history",
    body: "Some medical histories are fine to proceed with — select the scenario above. If it's not on the list, get a nurse.",
    reference: "WI-00037 JF · GSBD",
  },
  a15: {
    title: "Flagged: A15 Recent travel",
    body: "Confirm where the donor has been. Travel to Papua New Guinea in the last 3 years may mean they can't donate today.",
    reference: "Travel deferral matrix · WI-00037 DR",
    deferralNote: "PNG in the last 3 years — check the current travel policy.",
  },
  b1: {
    title: "Flagged: B1 Feeling unwell",
    body: "If the donor feels unwell because of an illness or a medication side effect, get a nurse to check before continuing.",
    reference: "WI-00037 HA",
  },
  b2: {
    title: "Flagged: B2 Post-donation effects",
    body: "If the donor had a reaction after a previous donation but didn't report it at the time, a nurse must take over from here.",
    reference: "Adverse reaction protocol · WI-00037 9M",
  },
  b5: {
    title: "Flagged: B5 Hazardous activity",
    body: "Select the activity the donor is planning, or type it in the notes box and press Enter.",
    reference:
      "GSBD — Hazardous occupational/recreational activities · WI-00037 2B",
  },
  b3: {
    title: "Flagged: B3 Chlorhexidine allergy",
    body: "If the allergy isn't already on file, get a nurse. If the donor has ever had a severe allergic reaction (anaphylaxis), a nurse must take over.",
    reference: "WI-00037 R3",
  },
  b6: {
    title: "Flagged: B6 Recent dental / NSAIDs / skin",
    body: "Check what medication was taken and why. Cuts are usually fine if they're small — anything larger needs a nurse.",
    reference: "Medication & procedure deferral guides · WI-00037 PQ",
    deferralNote: "Anti-inflammatory medication taken in the last 48 hours may affect platelet donation.",
  },
  b8: {
    title: "Flagged: B8 Recent health events",
    body: "Some recent illnesses or procedures are fine to proceed with — select the scenario above. If it's not on the list, get a nurse.",
    reference: "WI-00037 WA · GSBD",
  },
  b11: {
    title: "Flagged: B11 STI history",
    body: "Check which STI and when it was diagnosed. If the details can't be confirmed, a nurse must take over.",
    reference: "WI-00037 LX",
  },
  b12: {
    title: "Flagged: B12 Medications",
    body: "Go through all current medications. If anything has changed since their last visit, or they're taking certain acne tablets, get a nurse.",
    reference: "Medication deferral guide · WI-00037 0B",
  },
  b13: {
    title: "Flagged: B13 PrEP / injectables",
    body: "Check which medication it is. If it's not already recorded in their notes, get a nurse to update the file.",
    reference: "WI-00037 1P",
  },
  b15: {
    title: "Flagged: B15 Pregnancy history",
    body: "A recent pregnancy means the donor can't give blood today. Let them know how long they need to wait.",
    reference: "Pregnancy deferral standard · WI-00037 QH",
  },
  b17: {
    title: "Flagged: B17 Overseas travel",
    body: "A nurse will check the travel guidelines based on where the donor went and how long they were away.",
    reference: "Travel deferral matrix · WI-00037 LI",
  },
  c7: {
    title: "Flagged: C7 New partner",
    body: "Ask C7a about anal sex in the last 3 months — the answer determines whether a deferral applies.",
    reference: "Sexual behaviour risk policy · WI-00037 8S",
  },
  c8: {
    title: "Flagged: C8 Multiple partners",
    body: "Answer C8a — this tells us whether a deferral applies.",
    reference: "GSBD — Sexual activity deferrals · WI-00037 WK",
  },
  c14: {
    title: "Flagged: C14 Sexual contact",
    body: "Choose the options that best describe the donor's situation to work out the next step.",
    reference: "GSBD — Sexual activity deferrals",
  },
  c11: {
    title: "Flagged: C11 Tattoo / piercing / acupuncture",
    body: "There's usually a waiting period after these procedures before someone can donate — confirm the date it was done.",
    reference: "Skin penetration policy · WI-00037 RA",
    deferralNote: "Usually a 4-month wait after a tattoo or piercing — confirm the exact date.",
  },
};
