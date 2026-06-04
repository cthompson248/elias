"use client";

import {
  getSexualContactGuidanceById,
  type SexualContactGuidanceEntry,
} from "./sexual-contact-guidance";

export interface SexualContactGuidanceState {
  matchedId: string | null;
  lookupAttempted: boolean;
  /** Is the partner a current Lifeblood donor? */
  partnerIsLifebloodDonor: boolean | null;
}

export function SexualContactGuidance({
  state,
  activityNotes,
  onPartnerLifebloodDonorChange,
}: {
  state: SexualContactGuidanceState;
  activityNotes: string;
  onPartnerLifebloodDonorChange: (value: boolean) => void;
}) {
  const matched = state.matchedId
    ? getSexualContactGuidanceById(state.matchedId)
    : null;
  const noMatch =
    state.lookupAttempted && !matched && activityNotes.trim().length > 0;

  if (!state.lookupAttempted) return null;

  return (
    <div className="mt-6 space-y-4">
      {noMatch && (
        <p className="text-sm text-amber-800">
          No matching GSBD entry for &ldquo;{activityNotes.trim()}&rdquo;. Check
          GSBD — Sexual activity deferrals.
        </p>
      )}

      {matched && (
        <SexualContactGuidanceCard
          entry={matched}
          partnerIsLifebloodDonor={state.partnerIsLifebloodDonor}
          onPartnerLifebloodDonorChange={onPartnerLifebloodDonorChange}
        />
      )}
    </div>
  );
}

function SexualContactGuidanceCard({
  entry,
  partnerIsLifebloodDonor,
  onPartnerLifebloodDonorChange,
}: {
  entry: SexualContactGuidanceEntry;
  partnerIsLifebloodDonor: boolean | null;
  onPartnerLifebloodDonorChange: (value: boolean) => void;
}) {
  const partnerNotDonor = partnerIsLifebloodDonor === false;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
          Explanation
        </p>
        <p className="mt-2 font-medium leading-6">{entry.explanation}</p>
      </section>

      <section>
        <p className="text-sm font-semibold text-[var(--clinical-on-surface)]">
          Is the partner a current Lifeblood donor?
        </p>
        <div className="mt-3 flex gap-2">
          <PartnerDonorButton
            label="Yes"
            selected={partnerIsLifebloodDonor === true}
            variant="yes"
            onClick={() => onPartnerLifebloodDonorChange(true)}
          />
          <PartnerDonorButton
            label="No"
            selected={partnerIsLifebloodDonor === false}
            variant="no"
            onClick={() => onPartnerLifebloodDonorChange(false)}
          />
        </div>
      </section>

      {partnerNotDonor && (
        <section className="rounded-xl border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--clinical-on-surface)]">
            Action
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--clinical-on-surface-variant)]">
            <li>
              <span className="font-medium text-[var(--clinical-on-surface)]">
                Allogeneic / therapeutic:{" "}
              </span>
              {entry.actions.allogeneic}
            </li>
            <li>{entry.actions.ongoing}</li>
            <li>
              <span className="font-medium text-[var(--clinical-on-surface)]">
                Contradicts prior Yes:{" "}
              </span>
              {entry.actions.contradicts}
            </li>
            <li>{entry.actions.recall}</li>
            <li>
              <span className="font-medium text-[var(--clinical-on-surface)]">
                Autologous:{" "}
              </span>
              {entry.actions.autologous}
            </li>
          </ul>
          <p className="mt-4 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-900">
            Deferral code {entry.deferralCode}
          </p>
        </section>
      )}
    </div>
  );
}

function PartnerDonorButton({
  label,
  selected,
  variant,
  onClick,
}: {
  label: string;
  selected: boolean;
  variant: "yes" | "no";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex flex-1 items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
        selected
          ? variant === "yes"
            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
            : "border-slate-400 bg-slate-100 text-slate-700"
          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface-variant)] hover:border-[#c2c6d4]"
      }`}
    >
      {label}
    </button>
  );
}

export function buildC14ClinicalInsight(
  matchedId: string | null,
  partnerIsLifebloodDonor: boolean | null
) {
  const matched = matchedId ? getSexualContactGuidanceById(matchedId) : null;
  if (!matched) {
    return {
      title: "Flagged: C14 Sexual contact",
      body: "Add interview notes below the question and press Enter to load GSBD guidance.",
      reference: "GSBD — Sexual activity deferrals",
    };
  }
  if (partnerIsLifebloodDonor === true) {
    return {
      title: `C14 · ${matched.label}`,
      body: matched.scenarioNotePartnerIsDonor,
      reference: "GSBD — Managing exceptions to Donor Declaration question C14",
    };
  }
  if (partnerIsLifebloodDonor === false) {
    return {
      title: `C14 · ${matched.label}`,
      body: matched.scenarioNotePartnerNotDonor,
      reference: `GSBD · ${matched.deferralCode}`,
      deferralNote: matched.actions.allogeneic,
    };
  }
  return {
    title: `C14 · ${matched.label}`,
    body: "Confirm whether the partner is a current Lifeblood donor to show the correct GSBD pathway.",
    reference: "GSBD — Sexual activity deferrals",
  };
}
