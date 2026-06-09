/** GSBD — Occupational/recreational activities hazardous after donating (B5) */

export interface HazardousActivityEntry {
  id: string;
  label: string;
  keywords: string[];
  donationTypes: string;
  steps: string[];
  ifContinueDonation: string;
  ifNotDonate: string;
  deferralCode: string;
  /** Example medical note for nurse (NBMS) */
  medicalNoteExample: string;
}

export const hazardousActivitiesGeneralAdvice = {
  sectionTitle:
    "Occupational/recreational activities that may be hazardous after donating",
  preamble:
    "Provide donors with the following information each time a donor states an intention to undertake any occupational/recreational activities listed in this section after donating blood within the time period specified on the questionnaire.",
  readToDonor:
    "An accident resulting from failure to heed this medical advice may result in rejection of insurance claims, breach of contracts of employment and/or expose you to civil litigation.",
  additionalAdvice:
    "Additionally, advise first-time donors or donors with a history of fainting not to perform a hazardous occupation or activity on the same day as donating.",
};

export const hazardousActivities: HazardousActivityEntry[] = [
  {
    id: "pilot",
    label: "Pilot / Air crew",
    keywords: [
      "pilot",
      "air crew",
      "aircrew",
      "plane",
      "flying",
      "aviation",
      "aircraft",
      "flight",
    ],
    donationTypes: "All donation types",
    steps: [
      "Follow the actions in the General advice entry.",
      "Tell the donor to wait 24 hours before undertaking this activity.",
      "Ask the donor to check any employer-specific guidelines that they may be required to follow.",
    ],
    ifContinueDonation:
      "Advise the donor of the actions in the Pilot / Air crew entry, read the general advice, and advise on waiting periods. If the donor elects to continue donation, document in NBMS medical notes that you provided advice. A nurse must record the medical note before the donor proceeds.",
    ifNotDonate:
      "If the donor elects not to donate, assign deferral code T230 for the time period specified in GSBD.",
    deferralCode: "T230",
    medicalNoteExample:
      "Donor is a pilot; general advice given as per the GSBD. Donor would like to proceed.",
  },
  {
    id: "diving",
    label: "Underwater diving",
    keywords: ["diving", "dive", "scuba", "underwater"],
    donationTypes: "All donation types",
    steps: [
      "Follow the actions in the General advice entry.",
      "Tell the donor to wait 24 hours before undertaking this activity.",
    ],
    ifContinueDonation:
      "If the donor elects to continue donation, document in NBMS medical notes that you provided advice. A nurse must record the medical note.",
    ifNotDonate:
      "If the donor elects not to donate, assign deferral code T230 for the time period specified in GSBD.",
    deferralCode: "T230",
    medicalNoteExample:
      "Donor intends underwater diving; general advice given as per GSBD. Donor would like to proceed.",
  },
  {
    id: "machinery",
    label: "Operating heavy machinery",
    keywords: ["machinery", "heavy machinery", "crane", "forklift"],
    donationTypes: "All donation types",
    steps: [
      "Follow the actions in the General advice entry.",
      "Tell the donor to wait 24 hours before undertaking this activity.",
    ],
    ifContinueDonation:
      "If the donor elects to continue donation, document in NBMS medical notes that you provided advice. A nurse must record the medical note.",
    ifNotDonate:
      "If the donor elects not to donate, assign deferral code T230 for the time period specified in GSBD.",
    deferralCode: "T230",
    medicalNoteExample:
      "Donor operates heavy machinery; general advice given as per GSBD. Donor would like to proceed.",
  },
];

export function lookupHazardousActivity(
  query: string
): HazardousActivityEntry | null {
  const normalised = query.trim().toLowerCase();
  if (!normalised) return null;

  for (const entry of hazardousActivities) {
    if (
      entry.keywords.some(
        (kw) => normalised === kw || normalised.includes(kw)
      ) ||
      entry.label.toLowerCase().includes(normalised)
    ) {
      return entry;
    }
  }
  return null;
}

export function getHazardousActivityById(
  id: string
): HazardousActivityEntry | undefined {
  return hazardousActivities.find((a) => a.id === id);
}

export type HazardousDonorDecision = "continue" | "defer" | null;

/** Text staff read aloud to the donor before recording their decision. */
export function buildHazardousReadAloudText(entry: HazardousActivityEntry): string {
  const general = hazardousActivitiesGeneralAdvice.readToDonor;
  const activitySpecific = `For ${entry.label.toLowerCase()}, you should wait 24 hours after donating before doing this activity — and check any rules your employer requires.`;
  return `${general} ${activitySpecific}`;
}

export function buildHazardousOutcomeMessage(
  entry: HazardousActivityEntry,
  decision: Exclude<HazardousDonorDecision, null>
): string {
  if (decision === "defer") {
    return `You've decided not to donate today because of your planned ${entry.label.toLowerCase()} — that's the safest choice. If you change your mind about donating, you'll need to wait the period set out in our guidelines before you can give blood again.`;
  }
  return `You've chosen to continue with your donation — I just need to have a nurse review this with you before we can move forward.`;
}
