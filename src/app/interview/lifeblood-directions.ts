import type { EscalationLevel } from "./escalation";

export interface QuestionDirection {
  paperCode: string;
  emqCode: string;
  escalation: EscalationLevel;
  /** WI-00037 direction summary for Clinical Insights */
  direction: string;
}

/** WI-00037 v17 — eMQ code + paper code + escalation + direction text */
export const questionDirections: Record<string, QuestionDirection> = {
  a1: {
    paperCode: "A1",
    emqCode: "AW",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a2: {
    paperCode: "A2",
    emqCode: "3U",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a3: {
    paperCode: "A3",
    emqCode: "JF",
    escalation: "dsna_if_allowed",
    direction:
      "DSNA may continue only for allow-listed scenarios (e.g. resolved iron/B12 deficiency, G6PD, defined surgery outcomes, minor injury recovered, cold/flu/COVID resolved, routine check, repeat medication). Consult a nurse for all other scenarios.",
  },
  a4: {
    paperCode: "A4",
    emqCode: "UO",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a5: {
    paperCode: "A5",
    emqCode: "4N",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a6: {
    paperCode: "A6",
    emqCode: "SF",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a7: {
    paperCode: "A7",
    emqCode: "WW",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a8: {
    paperCode: "A8",
    emqCode: "ER",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a9: {
    paperCode: "A9",
    emqCode: "6A",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a10: {
    paperCode: "A10",
    emqCode: "RM",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a11: {
    paperCode: "A11",
    emqCode: "Z1",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a13: {
    paperCode: "A13",
    emqCode: "AU",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a14: {
    paperCode: "A14",
    emqCode: "8A",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  a15: {
    paperCode: "A15",
    emqCode: "DR",
    escalation: "dsna",
    direction: "DSNA can continue; confirm travel details including PNG (A15a) as per GSBD.",
  },
  a16: {
    paperCode: "A16",
    emqCode: "GA",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  b1: {
    paperCode: "B1",
    emqCode: "HA",
    escalation: "consult_nurse",
    direction:
      "Consult a nurse if there is an underlying health concern, or the donor is feeling unwell due to a medication side effect.",
  },
  b2: {
    paperCode: "B2",
    emqCode: "9M",
    escalation: "dsna",
    direction:
      "If Yes to side effects: confirm whether reported to Lifeblood (B2a). Nurse must take over if donor responds No.",
  },
  b3: {
    paperCode: "B3",
    emqCode: "R3",
    escalation: "consult_nurse",
    direction:
      "Consult a nurse if allergy not previously recorded. Nurse must take over if history of anaphylaxis.",
  },
  b5: {
    paperCode: "B5",
    emqCode: "2B",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  b6: {
    paperCode: "B6",
    emqCode: "PQ",
    escalation: "consult_nurse",
    direction:
      "Dental medication (not local anaesthetic): consult nurse. Aspirin/NSAIDs: ask what for; consult if ongoing/prescribed/not in notes. Cuts: DSNA OK for papercut/small scratch; consult nurse otherwise.",
  },
  b7: {
    paperCode: "B7",
    emqCode: "KE",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  b8: {
    paperCode: "B8",
    emqCode: "WA",
    escalation: "dsna_if_allowed",
    direction:
      "DSNA may continue only for allow-listed scenarios (same as A3/JF). Consult a nurse for all other scenarios; nurse assesses per GSBD.",
  },
  b9: {
    paperCode: "B9",
    emqCode: "BA",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  b10: {
    paperCode: "B10",
    emqCode: "VA",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  b11: {
    paperCode: "B11",
    emqCode: "LX",
    escalation: "consult_nurse",
    direction:
      "Consult a nurse if diagnosis is not known. Nurse must take over if diagnosis cannot be established and deferral/DEL call required.",
  },
  b12: {
    paperCode: "B12",
    emqCode: "0B",
    escalation: "consult_nurse",
    direction:
      "Identify medication. Consult nurse if change to regular meds in Medical Notes. Oral acne medication: consult nurse. Several medication classes DSNA can manage per WI/GSBD.",
  },
  b13: {
    paperCode: "B13",
    emqCode: "1P",
    escalation: "consult_nurse",
    direction:
      "If Yes: identify medication. Consult nurse if change to regular medication recorded in Medical Notes.",
  },
  b14: {
    paperCode: "B14",
    emqCode: "IF",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  b15: {
    paperCode: "B15",
    emqCode: "QH",
    escalation: "dsna",
    direction: "If Yes: confirm timing via B15a (pregnant in last 9 months) per GSBD.",
  },
  b16: {
    paperCode: "B16",
    emqCode: "FA",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  b17: {
    paperCode: "B17",
    emqCode: "LI",
    escalation: "consult_nurse",
    direction: "Confirm overseas travel destinations and dates; nurse assesses per travel deferral matrix.",
  },
  b18: {
    paperCode: "B18",
    emqCode: "VS",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c1: {
    paperCode: "C1",
    emqCode: "YG",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c2: {
    paperCode: "C2",
    emqCode: "HJ",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c3: {
    paperCode: "C3",
    emqCode: "4X",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c4: {
    paperCode: "C4",
    emqCode: "MT",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c5: {
    paperCode: "C5",
    emqCode: "OJ",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c6: {
    paperCode: "C6",
    emqCode: "8P",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c7: {
    paperCode: "C7",
    emqCode: "8S",
    escalation: "dsna",
    direction: "If Yes: confirm C7a (anal sex in last 3 months) per GSBD.",
  },
  c8: {
    paperCode: "C8",
    emqCode: "WK",
    escalation: "dsna",
    direction: "If Yes: confirm C8a (anal sex in last 3 months) per GSBD.",
  },
  c9: {
    paperCode: "C9",
    emqCode: "W7",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c10: {
    paperCode: "C10",
    emqCode: "GM",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c11: {
    paperCode: "C11",
    emqCode: "RA",
    escalation: "dsna",
    direction:
      "Confirm procedure type, date and regulated provider; apply skin penetration deferral per GSBD.",
  },
  c12: {
    paperCode: "C12",
    emqCode: "XL",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c13: {
    paperCode: "C13",
    emqCode: "ND",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
  c14: {
    paperCode: "C14",
    emqCode: "LR",
    escalation: "dsna",
    direction: "DSNA can continue and manage as per GSBD.",
  },
};

export function getDirection(id: string): QuestionDirection | undefined {
  return questionDirections[id];
}
