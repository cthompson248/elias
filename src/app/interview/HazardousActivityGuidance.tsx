"use client";

import type { InterviewRole } from "./interview-role";
import {
  getHazardousActivityById,
  hazardousActivitiesGeneralAdvice,
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
  interviewRole,
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
    <div className="mt-6 space-y-6">
      {noMatch && (
        <p className="text-sm text-amber-800">
          No matching GSBD entry for &ldquo;{activityNotes.trim()}&rdquo;. Check
          the hazardous activities section in GSBD or refine your note.
        </p>
      )}

      {matched && (
        <>
          <GeneralAdviceBlock />

          <section className="rounded-xl border border-[var(--clinical-outline)] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-secondary)]">
              {matched.label} · {matched.donationTypes}
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--clinical-on-surface)]">
              {matched.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--clinical-on-surface)]">
              Donor decision
            </h3>
            <p className="mt-1 text-sm text-[var(--clinical-on-surface-variant)]">
              Record what the donor decides after you have read the advice.
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

          {state.donorDecision === "continue" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              <p className="font-semibold">Nurse — medical note required</p>
              <p className="mt-1">{matched.ifContinueDonation}</p>
              {interviewRole === "dsna" && (
                <p className="mt-2 font-medium">
                  Ask a nurse to add the medical note in NBMS before the donor
                  proceeds.
                </p>
              )}
              <div className="mt-3 rounded-lg border border-amber-300/60 bg-white/80 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-900/80">
                  Example medical note
                </p>
                <p className="mt-1 text-sm italic text-amber-950">
                  &ldquo;{matched.medicalNoteExample}&rdquo;
                </p>
              </div>
            </div>
          )}

          {state.donorDecision === "defer" && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900">
              <p className="font-semibold">Deferral {matched.deferralCode}</p>
              <p className="mt-1">{matched.ifNotDonate}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function GeneralAdviceBlock() {
  const g = hazardousActivitiesGeneralAdvice;
  return (
    <section className="rounded-xl border border-violet-200 bg-violet-50/80 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-800">
        {g.sectionTitle}
      </p>
      <p className="mt-2 text-sm leading-6 text-violet-950/90">{g.preamble}</p>
      <div className="mt-4 rounded-lg border border-violet-300/50 bg-white px-3 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-violet-900">
          Read to donor
        </p>
        <p className="mt-2 text-sm font-medium leading-6 text-violet-950">
          &ldquo;{g.readToDonor}&rdquo;
        </p>
      </div>
      <p className="mt-3 text-sm leading-6 text-violet-950/90">
        {g.additionalAdvice}
      </p>
    </section>
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
