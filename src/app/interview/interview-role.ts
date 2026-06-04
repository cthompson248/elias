import {
  blocksDsna,
  requiresNurseConsult,
  type EscalationLevel,
} from "./escalation";

/** Set at login in production; prototype uses sessionStorage. */
export type InterviewRole = "dsna" | "nurse";

const ROLE_KEY = "elias-interview-role";

export function loadInterviewRole(): InterviewRole {
  if (typeof window === "undefined") return "dsna";
  const raw = sessionStorage.getItem(ROLE_KEY);
  return raw === "nurse" ? "nurse" : "dsna";
}

export function saveInterviewRole(role: InterviewRole) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ROLE_KEY, role);
}

export interface RoleEscalationNotice {
  title: string;
  body: string;
  tone: "amber" | "rose" | "blue";
}

export function getRoleEscalationNotice(
  role: InterviewRole,
  level: EscalationLevel
): RoleEscalationNotice | null {
  if (role === "nurse") {
    if (level === "nurse_takeover") {
      return {
        title: "Nurse ownership",
        body: "Complete this question per WI-00037 and GSBD before the donor proceeds.",
        tone: "rose",
      };
    }
    if (requiresNurseConsult(level)) {
      return {
        title: "Nurse assessment",
        body: "Assess this item per GSBD and record the outcome in the interview notes.",
        tone: "amber",
      };
    }
    return null;
  }

  if (blocksDsna(level)) {
    return {
      title: "Nurse required",
      body: "A nurse must complete this question. Ask a nurse to take over this item before proceeding.",
      tone: "rose",
    };
  }
  if (requiresNurseConsult(level)) {
    return {
      title: "Nurse consult required",
      body: "Ask a nurse to review this question before you mark it complete. You may continue recording donor responses and notes while waiting.",
      tone: "amber",
    };
  }
  if (level === "dsna_if_allowed") {
    return {
      title: "Allowed scenarios only",
      body: "Continue only if the donor's answer matches an allow-listed scenario in WI-00037. Otherwise, ask a nurse to review.",
      tone: "blue",
    };
  }
  return null;
}

export function getFollowUpRoleNotice(
  role: InterviewRole,
  escalation: EscalationLevel
): string | null {
  if (role !== "dsna") return null;
  if (escalation === "nurse_takeover") {
    return "This follow-up requires a nurse. Ask a nurse to complete it.";
  }
  if (escalation === "consult_nurse") {
    return "Nurse consult required for this follow-up.";
  }
  return null;
}

export function canRoleEdit(
  role: InterviewRole,
  level: EscalationLevel
): boolean {
  if (role === "nurse") return true;
  return !blocksDsna(level);
}
