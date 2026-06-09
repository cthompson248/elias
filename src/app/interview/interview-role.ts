import {
  blocksDsna,
  needsNurseHighlight,
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
  level: EscalationLevel,
  context?: { b5DonorContinues?: boolean }
): RoleEscalationNotice | null {
  if (!needsNurseHighlight(level)) return null;

  if (context?.b5DonorContinues && level === "consult_nurse") {
    return {
      title: "Nurse consult required",
      body: "Donor has elected to continue donation. A nurse must record the medical note before the donor proceeds.",
      tone: "amber",
    };
  }

  if (role === "nurse") {
    if (level === "nurse_takeover") {
      return {
        title: "Nurse required",
        body: "Complete this question per GSBD before the donor proceeds.",
        tone: "rose",
      };
    }
    return {
      title: "Nurse assessment",
      body: "Assess this item per GSBD and record the outcome in the interview notes.",
      tone: "amber",
    };
  }

  if (level === "nurse_takeover") {
    return {
      title: "Nurse required",
      body: "A nurse must complete this question. Ask a nurse to take over before proceeding.",
      tone: "rose",
    };
  }

  return {
    title: "Nurse consult required",
    body: "Ask a nurse to review this question before you mark it complete.",
    tone: "amber",
  };
}

export function getFollowUpRoleNotice(
  role: InterviewRole,
  escalation: EscalationLevel
): string | null {
  if (role !== "dsna" || !needsNurseHighlight(escalation)) return null;
  if (escalation === "nurse_takeover") {
    return "A nurse must complete this follow-up.";
  }
  return "Ask a nurse to review this follow-up.";
}

export function canRoleEdit(
  role: InterviewRole,
  level: EscalationLevel
): boolean {
  if (role === "nurse") return true;
  return !blocksDsna(level);
}
