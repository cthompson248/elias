"use client";

import type { InterviewRole } from "./interview-role";
import {
  getHazardousActivityById,
  type HazardousDonorDecision,
} from "./hazardous-activities";

export interface HazardousActivityState {
  matchedId: string | null;
  lookupAttempted: boolean;
  donorDecision: HazardousDonorDecision;
}

export function HazardousActivityGuidance({
  state,
  activityNotes,
  onDonorDecision,
}: {
  state: HazardousActivityState;
  activityNotes: string;
  onDonorDecision: (decision: HazardousDonorDecision) => void;
  interviewRole: InterviewRole;
}) {
  const matched = state.matchedId
    ? getHazardousActivityById(state.matchedId)
    : null;
  const noMatch =
    state.lookupAttempted && !matched && activityNotes.trim().length > 0;

  if (!state.lookupAttempted) return null;

  return (
    <div className="mt-6 space-y-4">
      {noMatch && (
        <p className="text-sm text-amber-800">
          No matching GSBD entry for &ldquo;{activityNotes.trim()}&rdquo;. Check
          the hazardous activities section in GSBD or refine your note.
        </p>
      )}

      {matched && (
        <section className="rounded-xl border border-[#e5e7eb] bg-white p-4">
          <p className="text-sm font-semibold text-[var(--clinical-on-surface)]">
            Record the donor&apos;s decision
          </p>
          <p className="mt-1 text-sm text-[var(--clinical-on-surface-variant)]">
            Read the guidance on the right, then record what they decide.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <DecisionButton
              label="Donor continues with donation"
              selected={state.donorDecision === "continue"}
              onClick={() => onDonorDecision("continue")}
            />
            <DecisionButton
              label="Donor elects not to donate"
              selected={state.donorDecision === "defer"}
              onClick={() => onDonorDecision("defer")}
            />
          </div>
        </section>
      )}
    </div>
  );
}

function DecisionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
        selected
          ? "border-[var(--clinical-primary)] bg-[var(--clinical-primary)]/5 text-[var(--clinical-on-surface)] ring-1 ring-[var(--clinical-primary)]/30"
          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface)] hover:border-[#c2c6d4]"
      }`}
    >
      {label}
    </button>
  );
}

export function buildB5ClinicalInsight(
  matchedId: string | null,
  donorDecision: HazardousDonorDecision
) {
  const matched = matchedId ? getHazardousActivityById(matchedId) : null;
  if (!matched) {
    return {
      title: "Flagged: B5 Hazardous activity",
      body: "Donor answered Yes. Add interview notes and press Enter to load GSBD guidance when the note describes a hazardous activity.",
      reference:
        "GSBD — Hazardous occupational/recreational activities · WI-00037 2B",
    };
  }
  if (donorDecision === "continue") {
    return {
      title: `B5 · ${matched.label} — continue`,
      body: matched.ifContinueDonation,
      reference: `GSBD · Deferral ${matched.deferralCode} if not donating`,
      deferralNote: "Nurse medical note required in NBMS before proceed.",
    };
  }
  if (donorDecision === "defer") {
    return {
      title: `B5 · ${matched.label} — defer`,
      body: matched.ifNotDonate,
      reference: `GSBD deferral code ${matched.deferralCode}`,
      deferralNote: `Apply ${matched.deferralCode} per GSBD time period.`,
    };
  }
  return {
    title: `B5 · ${matched.label}`,
    body: `Follow GSBD steps for ${matched.label}. Read general advice to the donor, then record their decision.`,
    reference: "GSBD — Hazardous occupational/recreational activities",
  };
}
