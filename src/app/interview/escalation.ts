/** WI-00037 escalation levels for DSNA interview scope */

export type EscalationLevel =
  | "dsna"
  | "dsna_if_allowed"
  | "consult_nurse"
  | "nurse_takeover";

export interface EscalationMeta {
  level: EscalationLevel;
  label: string;
  shortLabel: string;
  className: string;
}

export const escalationMeta: Record<EscalationLevel, EscalationMeta> = {
  dsna: {
    level: "dsna",
    label: "DSNA — manage per GSBD",
    shortLabel: "DSNA",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  dsna_if_allowed: {
    level: "dsna_if_allowed",
    label: "DSNA — only for allowed scenarios (see WI)",
    shortLabel: "DSNA if allowed",
    className: "bg-blue-50 text-blue-800 border-blue-200",
  },
  consult_nurse: {
    level: "consult_nurse",
    label: "Consult nurse before proceeding",
    shortLabel: "Nurse consult",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  nurse_takeover: {
    level: "nurse_takeover",
    label: "Nurse must take over interview",
    shortLabel: "Nurse takeover",
    className: "bg-rose-50 text-rose-800 border-rose-200",
  },
};

export function requiresNurseConsult(level: EscalationLevel): boolean {
  return level === "consult_nurse" || level === "dsna_if_allowed";
}

export function blocksDsna(level: EscalationLevel): boolean {
  return level === "nurse_takeover";
}

const escalationRank: Record<EscalationLevel, number> = {
  dsna: 0,
  dsna_if_allowed: 1,
  consult_nurse: 2,
  nurse_takeover: 3,
};

export function maxEscalation(
  a: EscalationLevel,
  b: EscalationLevel
): EscalationLevel {
  return escalationRank[a] >= escalationRank[b] ? a : b;
}

export type FollowUpAnswerSlice = { pillId: string | null; custom: string };

export function resolveInterviewEscalation(
  questionLevel: EscalationLevel,
  followUps: { id: string; escalation: EscalationLevel; takeoverOnPillIds?: string[]; consultOnPillIds?: string[] }[],
  answers: Record<string, FollowUpAnswerSlice>,
  manualTakeover: boolean
): EscalationLevel {
  if (manualTakeover) return "nurse_takeover";

  let level = questionLevel;
  for (const fu of followUps) {
    const pillId = answers[fu.id]?.pillId;
    if (!pillId) continue;
    if (fu.takeoverOnPillIds?.includes(pillId)) return "nurse_takeover";
    level = maxEscalation(level, fu.escalation);
    if (fu.consultOnPillIds?.includes(pillId)) {
      level = maxEscalation(level, "consult_nurse");
    }
  }
  return level;
}

