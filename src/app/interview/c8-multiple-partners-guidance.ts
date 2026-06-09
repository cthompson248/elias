/** GSBD — Sexual contact: anal sex with multiple partners (C8 / C8a) */

export type C8AnalSexResponse = "yes" | "no" | "declined";

export interface C8MultiplePartnersGuidance {
  relatesTo: string;
  category: string;
  label: string;
  explanation: string;
  actions: {
    allogeneic: string;
    existingDeferral: string;
    moShorten: string;
    recall: string;
    autologous: string;
  };
  deferralCode: string;
}

export const c8AnalSexYesGuidance: C8MultiplePartnersGuidance = {
  category: "Sexual contact (continued)",
  label: "Anal sex, multiple sexual partners",
  relatesTo: "Donor Declaration questions 8/8a",
  explanation:
    "If in the last 6 months the donor has had sex (vaginal or anal) with more than one person and in the last 3 months had anal sex with at least one of these people, a restricted donation may be possible. Anal sex refers to both penetrative and receptive penile-anal sex with or without condoms.",
  actions: {
    allogeneic:
      "Accept for 'plasma only for fractionation' for 6 months from the date of attendance and apply the A185 deferral.",
    existingDeferral:
      "Where an active A185 deferral is in place and the donor answers No to question C8 or C8a and is otherwise eligible for a whole blood donation, contact an MO only where the donor requests to donate whole blood, is unsuitable for plasma, or attends a mobile or pop-up site.",
    moShorten:
      "The A185 deferral end date can be shortened to yesterday's date if the donor has not had multiple partners in the last 6 months or there has been no anal sex in the previous 3 months.",
    recall: "If a recall is required, collect UR samples for testing.",
    autologous: "Accept.",
  },
  deferralCode: "A185",
};

export const c8AnalSexNoGuidance = {
  category: "Sexual contact (continued)",
  label: "Multiple partners — no anal sex in last 3 months",
  relatesTo: "Donor Declaration questions 8/8a",
  explanation:
    "If there has been no anal sex in the last 3 months, accept for unrestricted donation.",
};

export const c8AnalSexDeclinedGuidance = {
  explanation:
    "The donor declined to answer C8a. Document privately and consult GSBD — Sexual activity deferrals before proceeding.",
};

export function parseC8AnalSexResponse(
  pillId: string | null | undefined
): C8AnalSexResponse | null {
  if (pillId === "yes" || pillId === "no" || pillId === "declined") {
    return pillId;
  }
  return null;
}
