/** GSBD — Sexual contact deferrals (C14 injecting drug user contact) */

export interface SexualContactGuidanceActions {
  primary: {
    donationType: string;
    deferralWindow: string;
    detail: string;
  };
  deferralCode: string;
}

export interface SexualContactGuidanceEntry {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  relatesTo: string;
  explanation: string;
  scenarioNotePartnerNotDonor: string;
  scenarioNotePartnerIsDonor: string;
  /** C14: partner Lifeblood donor question before showing actions */
  requiresPartnerDonorQuestion?: boolean;
  actions: SexualContactGuidanceActions;
}

export interface C14ScenarioPill {
  id: string;
  label: string;
  guidanceId?: string;
  /** Selecting this pill flags uncertainty — nurse review */
  uncertain?: boolean;
}

/** Common C14 scenarios staff can select (multi-select). */
export const c14ScenarioPills: C14ScenarioPill[] = [
  {
    id: "partner-injects",
    label: "Partner injects drugs",
    guidanceId: "c14-injecting-partner",
  },
  {
    id: "former-partner",
    label: "Former partner — injection history",
    guidanceId: "c14-former-partner",
  },
  {
    id: "donor-unsure",
    label: "Donor unsure — needs clarification",
    uncertain: true,
  },
];

export const sexualContactGuidanceEntries: SexualContactGuidanceEntry[] = [
  {
    id: "c14-injecting-partner",
    label: "Injecting drug user contact, current or past",
    category: "Sexual contact (continued)",
    keywords: [
      "partner injects",
      "injecting drug",
      "injection",
      "iv drug",
      "needle",
      "used drugs",
      "injected",
      "ongoing contact",
    ],
    relatesTo: "Donor Declaration question 14",
    requiresPartnerDonorQuestion: true,
    explanation:
      "If a donor had sex with a person who ever injected drugs not prescribed by a registered doctor or dentist, a restricted donation may be possible.",
    scenarioNotePartnerNotDonor:
      "Partner is not a current Lifeblood donor — the Lifeblood-donor partner exception does not apply. Follow the actions below.",
    scenarioNotePartnerIsDonor:
      "Partner is a current Lifeblood donor — the deferral may not apply. See Managing exceptions to Donor Declaration question C14 in GSBD before proceeding.",
    actions: {
      primary: {
        donationType: "Plasma only (fractionation)",
        deferralWindow: "3 months from last sexual contact",
        detail:
          "Accept for plasma only for fractionation and apply the T190 deferral from the date of last sexual contact with an injecting drug user.",
      },
      deferralCode: "T190",
    },
  },
  {
    id: "c14-former-partner",
    label: "Former partner — injection history",
    category: "Sexual contact (continued)",
    keywords: [
      "former partner",
      "past contact",
      "no longer injects",
      "history",
      "previously injected",
    ],
    relatesTo: "Donor Declaration question 14",
    requiresPartnerDonorQuestion: false,
    explanation:
      "Sexual contact with a person who previously injected non-prescribed drugs may still require a restricted donation pathway. Confirm timing of last contact and whether injection is ongoing.",
    scenarioNotePartnerNotDonor:
      "Assess last contact date and apply GSBD deferral windows for sexual contact with an injecting drug user.",
    scenarioNotePartnerIsDonor:
      "Assess last contact date and apply GSBD deferral windows for sexual contact with an injecting drug user.",
    actions: {
      primary: {
        donationType: "Plasma only (fractionation)",
        deferralWindow: "3 months from last sexual contact",
        detail:
          "Accept for plasma only for fractionation and apply the T190 deferral where GSBD criteria are met.",
      },
      deferralCode: "T190",
    },
  },
];

export function formatPrimaryDeferralSummary(
  actions: SexualContactGuidanceActions
): string {
  return `${actions.primary.donationType} · ${actions.deferralCode} · ${actions.primary.deferralWindow}`;
}

const guidancePriority = ["c14-injecting-partner", "c14-former-partner"];

export function lookupSexualContactGuidance(
  query: string
): SexualContactGuidanceEntry | null {
  const normalised = query.trim().toLowerCase();
  if (!normalised) return null;

  for (const entry of sexualContactGuidanceEntries) {
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

export function getSexualContactGuidanceById(
  id: string
): SexualContactGuidanceEntry | undefined {
  return sexualContactGuidanceEntries.find((e) => e.id === id);
}

export function resolveC14Guidance(input: {
  selectedPrecannedIds: string[];
  customPills: string[];
}): {
  matchedId: string | null;
  uncertain: boolean;
  showPartnerDonorQuestion: boolean;
} {
  const { selectedPrecannedIds, customPills } = input;
  const hasSelection =
    selectedPrecannedIds.length > 0 || customPills.length > 0;

  if (!hasSelection) {
    return {
      matchedId: null,
      uncertain: false,
      showPartnerDonorQuestion: false,
    };
  }

  if (selectedPrecannedIds.includes("donor-unsure")) {
    return {
      matchedId: null,
      uncertain: true,
      showPartnerDonorQuestion: false,
    };
  }

  const guidanceIds = new Set<string>();

  for (const id of selectedPrecannedIds) {
    const pill = c14ScenarioPills.find((p) => p.id === id);
    if (pill?.guidanceId) guidanceIds.add(pill.guidanceId);
  }

  const labels = [
    ...selectedPrecannedIds
      .map((id) => c14ScenarioPills.find((p) => p.id === id)?.label)
      .filter((label): label is string => Boolean(label)),
    ...customPills,
  ];

  for (const label of labels) {
    const match = lookupSexualContactGuidance(label);
    if (match) guidanceIds.add(match.id);
  }

  if (guidanceIds.size === 0) {
    return {
      matchedId: null,
      uncertain: true,
      showPartnerDonorQuestion: false,
    };
  }

  const matchedId =
    guidancePriority.find((id) => guidanceIds.has(id)) ??
    [...guidanceIds][0] ??
    null;

  const showPartnerDonorQuestion =
    selectedPrecannedIds.includes("partner-injects") ||
    (matchedId
      ? (getSexualContactGuidanceById(matchedId)?.requiresPartnerDonorQuestion ??
        false)
      : false);

  return {
    matchedId,
    uncertain: false,
    showPartnerDonorQuestion,
  };
}
