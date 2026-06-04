/** GSBD — Sexual contact deferrals (C14 injecting drug user contact) */

export interface SexualContactGuidanceEntry {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  relatesTo: string;
  explanation: string;
  scenarioNotePartnerNotDonor: string;
  scenarioNotePartnerIsDonor: string;
  actions: {
    allogeneic: string;
    ongoing: string;
    contradicts: string;
    recall: string;
    autologous: string;
  };
  deferralCode: string;
}

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
    ],
    relatesTo: "Donor Declaration question 14",
    explanation:
      "If a donor had sex with a person who ever injected drugs not prescribed by a registered doctor or dentist, a restricted donation may be possible.",
    scenarioNotePartnerNotDonor:
      "Partner is not a current Lifeblood donor — the Lifeblood-donor partner exception does not apply. Follow the actions below.",
    scenarioNotePartnerIsDonor:
      "Partner is a current Lifeblood donor — the deferral may not apply. See Managing exceptions to Donor Declaration question C14 in GSBD before proceeding.",
    actions: {
      allogeneic:
        "Accept for 'plasma only for fractionation' for 3 months from the date of last sexual contact with an injecting drug user and apply the T190 deferral.",
      ongoing:
        "If ongoing contact is expected, the end date of the T190 deferral can be extended.",
      contradicts:
        "For this question, if a donor contradicts a 'Yes' answer from any previous attendance (i.e. a related active deferral is in place), contact an MO.",
      recall: "If a recall is required, collect UR samples for testing.",
      autologous: "Accept.",
    },
    deferralCode: "T190",
  },
];

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
