"use client";

import type { KeyboardEvent } from "react";
import type { InterviewRole } from "./interview-role";
import {
  buildHazardousReadAloudText,
  getHazardousActivityById,
  hazardousActivities,
  type HazardousDonorDecision,
} from "./hazardous-activities";
import { FollowUpOptionPill, QuestionPanelCard } from "./interview-panel-cards";

export interface HazardousActivityState {
  matchedId: string | null;
  lookupAttempted: boolean;
  adviceReadToDonor: boolean;
  donorDecision: HazardousDonorDecision;
}

export function B5ActivitySelection({
  selectedId,
  customInput,
  readOnly,
  onSelectActivity,
  onCustomInputChange,
  onCustomKeyDown,
}: {
  selectedId: string | null;
  customInput: string;
  readOnly?: boolean;
  onSelectActivity: (activityId: string) => void;
  onCustomInputChange: (value: string) => void;
  onCustomKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <QuestionPanelCard
      title="Which hazardous activity is planned?"
      hint="Select the activity the donor intends within the next 3 days."
    >
      <div className="flex flex-wrap gap-2">
        {hazardousActivities.map((activity) => (
          <FollowUpOptionPill
            key={activity.id}
            label={activity.label}
            selected={selectedId === activity.id}
            disabled={readOnly}
            onClick={() => onSelectActivity(activity.id)}
          />
        ))}
      </div>

      <input
        type="text"
        value={customInput}
        disabled={readOnly}
        onChange={(e) => onCustomInputChange(e.target.value)}
        onKeyDown={onCustomKeyDown}
        placeholder="Or type a custom response..."
        className="mt-3 w-full rounded-lg border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--clinical-on-surface-variant)] focus:border-[var(--clinical-primary)] focus:bg-white"
      />
    </QuestionPanelCard>
  );
}

export function HazardousActivityGuidance({
  state,
  activityNotes,
  onAdviceReadToDonorChange,
  onDonorDecision,
}: {
  state: HazardousActivityState;
  activityNotes: string;
  onAdviceReadToDonorChange: (value: boolean) => void;
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
        <p className="text-sm text-[var(--clinical-warning)]">
          No matching GSBD entry for &ldquo;{activityNotes.trim()}&rdquo;. Check
          the hazardous activities section in GSBD or refine your note.
        </p>
      )}

      {matched && (
        <>
          <section className="rounded-xl border border-[var(--clinical-read-aloud-border)] bg-[var(--clinical-read-aloud)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-secondary)]">
              Medical advice
            </p>
            <p className="mt-3 text-sm font-medium leading-6 text-[var(--clinical-on-surface)]">
              &ldquo;{buildHazardousReadAloudText(matched)}&rdquo;
            </p>
            <label className="clinical-read-aloud-confirm mt-4 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3.5">
              <input
                type="checkbox"
                checked={state.adviceReadToDonor}
                onChange={(e) => onAdviceReadToDonorChange(e.target.checked)}
              />
              <span className="text-sm font-medium leading-snug text-[var(--clinical-on-surface)]">
                I have read this advice to the donor
              </span>
            </label>
          </section>

          {state.adviceReadToDonor && (
            <section className="rounded-xl border border-[var(--clinical-outline)] bg-white p-4">
              <p className="text-sm font-medium leading-6 text-[var(--clinical-on-surface)]">
                Would you like to continue with your donation today?
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <DecisionButton
                  label="Yes, continue with donation"
                  variant="yes"
                  selected={state.donorDecision === "continue"}
                  onClick={() => onDonorDecision("continue")}
                />
                <DecisionButton
                  label="No, prefer not to donate today"
                  selected={state.donorDecision === "defer"}
                  onClick={() => onDonorDecision("defer")}
                />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function DecisionButton({
  label,
  selected,
  onClick,
  variant = "neutral",
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: "yes" | "neutral";
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
        selected
          ? variant === "yes"
            ? "clinical-toggle-yes-selected"
            : "border-[var(--clinical-outline-variant)] bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface)]"
          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface)] hover:border-[var(--clinical-outline-variant)]"
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
      body: "Donor answered Yes. Select a hazardous activity below or type a custom response and press Enter to load GSBD guidance.",
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
