"use client";

import type { KeyboardEvent } from "react";
import {
  BinaryChoiceButtons,
  FollowUpOptionPill,
  QuestionPanelCard,
} from "./interview-panel-cards";
import {
  c14ScenarioPills,
  formatPrimaryDeferralSummary,
  getSexualContactGuidanceById,
  resolveC14Guidance,
  type SexualContactGuidanceEntry,
} from "./sexual-contact-guidance";

export interface SexualContactGuidanceState {
  matchedId: string | null;
  lookupAttempted: boolean;
  uncertain: boolean;
  /** Show partner donor follow-up (injecting partner scenario) */
  showPartnerDonorQuestion: boolean;
  /** Is your partner a current Lifeblood donor? */
  partnerIsLifebloodDonor: boolean | null;
}

export interface C14ScenarioSelectionState {
  selectedPrecannedIds: string[];
  customPills: string[];
  customInput: string;
}

export function deriveC14GuidanceState(
  scenario: C14ScenarioSelectionState,
  partnerIsLifebloodDonor: boolean | null
): SexualContactGuidanceState {
  const hasSelection =
    scenario.selectedPrecannedIds.length > 0 || scenario.customPills.length > 0;

  if (!hasSelection) {
    return {
      matchedId: null,
      lookupAttempted: false,
      uncertain: false,
      showPartnerDonorQuestion: false,
      partnerIsLifebloodDonor: null,
    };
  }

  const resolved = resolveC14Guidance({
    selectedPrecannedIds: scenario.selectedPrecannedIds,
    customPills: scenario.customPills,
  });

  return {
    ...resolved,
    lookupAttempted: true,
    partnerIsLifebloodDonor,
  };
}

export function C14ScenarioSelection({
  selection,
  guidanceState,
  readOnly,
  onTogglePrecanned,
  onAddCustomPill,
  onRemoveCustomPill,
  onCustomInputChange,
  onPartnerLifebloodDonorChange,
}: {
  selection: C14ScenarioSelectionState;
  guidanceState: SexualContactGuidanceState;
  readOnly?: boolean;
  onTogglePrecanned: (pillId: string) => void;
  onAddCustomPill: (label: string) => void;
  onRemoveCustomPill: (label: string) => void;
  onCustomInputChange: (value: string) => void;
  onPartnerLifebloodDonorChange: (value: boolean) => void;
}) {
  function handleCustomKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    const value = selection.customInput.trim();
    if (!value) return;
    onAddCustomPill(value);
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <QuestionPanelCard
        title="Which of these best describes your situation?"
        hint="Select all that apply."
      >
        <div className="flex flex-wrap gap-2">
          {c14ScenarioPills.map((pill) => {
            const selected = selection.selectedPrecannedIds.includes(pill.id);
            return (
              <FollowUpOptionPill
                key={pill.id}
                label={pill.label}
                selected={selected}
                disabled={readOnly}
                onClick={() => onTogglePrecanned(pill.id)}
              />
            );
          })}
          {selection.customPills.map((label) => (
            <FollowUpOptionPill
              key={label}
              label={label}
              selected
              disabled={readOnly}
              onClick={() => onRemoveCustomPill(label)}
            />
          ))}
        </div>

        <input
          type="text"
          value={selection.customInput}
          disabled={readOnly}
          onChange={(e) => onCustomInputChange(e.target.value)}
          onKeyDown={handleCustomKeyDown}
          placeholder="Or type a custom response..."
          className="mt-3 w-full rounded-lg border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--clinical-on-surface-variant)] focus:border-[var(--clinical-primary)] focus:bg-white"
        />
      </QuestionPanelCard>

      <SexualContactGuidance
        state={guidanceState}
        onPartnerLifebloodDonorChange={onPartnerLifebloodDonorChange}
      />
    </div>
  );
}

export function SexualContactGuidance({
  state,
  onPartnerLifebloodDonorChange,
}: {
  state: SexualContactGuidanceState;
  onPartnerLifebloodDonorChange: (value: boolean) => void;
}) {
  const matched = state.matchedId
    ? getSexualContactGuidanceById(state.matchedId)
    : null;

  if (!state.lookupAttempted) return null;

  return (
    <>
      {state.uncertain && (
        <article className="rounded-xl border border-[var(--clinical-primary-subtle-border)] bg-[var(--clinical-primary-container)] px-4 py-4 text-sm leading-6 text-[var(--clinical-on-surface)]">
          <p className="font-semibold">Needs nurse review</p>
          <p className="mt-1">
            The selected scenario could not be matched confidently to GSBD. Hand
            to a nurse to review before continuing.
          </p>
        </article>
      )}

      {matched && (
        <SexualContactGuidancePanels
          entry={matched}
          showPartnerDonorQuestion={state.showPartnerDonorQuestion}
          partnerIsLifebloodDonor={state.partnerIsLifebloodDonor}
          onPartnerLifebloodDonorChange={onPartnerLifebloodDonorChange}
        />
      )}
    </>
  );
}

function SexualContactGuidancePanels({
  showPartnerDonorQuestion,
  partnerIsLifebloodDonor,
  onPartnerLifebloodDonorChange,
}: {
  entry: SexualContactGuidanceEntry;
  showPartnerDonorQuestion: boolean;
  partnerIsLifebloodDonor: boolean | null;
  onPartnerLifebloodDonorChange: (value: boolean) => void;
}) {
  const partnerNotDonor = partnerIsLifebloodDonor === false;
  const partnerIsDonor = partnerIsLifebloodDonor === true;

  return (
    <>
      {showPartnerDonorQuestion && (
        <QuestionPanelCard title="Is your partner a current Lifeblood donor?">
          <BinaryChoiceButtons
            yesSelected={partnerIsDonor}
            noSelected={partnerNotDonor}
            onSelectYes={() => onPartnerLifebloodDonorChange(true)}
            onSelectNo={() => onPartnerLifebloodDonorChange(false)}
          />
        </QuestionPanelCard>
      )}
    </>
  );
}

export function buildC14ClinicalInsight(
  state: SexualContactGuidanceState
) {
  if (state.uncertain && state.lookupAttempted) {
    return {
      title: "C14 · Needs nurse review",
      body: "The selected scenario could not be matched confidently to GSBD. A nurse should review before continuing.",
      reference: "GSBD — Sexual activity deferrals",
    };
  }

  const matched = state.matchedId
    ? getSexualContactGuidanceById(state.matchedId)
    : null;

  if (!matched || !state.lookupAttempted) {
    return {
      title: "Flagged: C14 Sexual contact",
      body: "Select the options that describe your situation.",
      reference: "GSBD — Sexual activity deferrals",
    };
  }

  if (
    state.showPartnerDonorQuestion &&
    state.partnerIsLifebloodDonor === true
  ) {
    return {
      title: `C14 · ${matched.label}`,
      body: matched.scenarioNotePartnerIsDonor,
      reference: "GSBD — Managing exceptions to Donor Declaration question C14",
    };
  }

  if (
    state.showPartnerDonorQuestion &&
    state.partnerIsLifebloodDonor === false
  ) {
    return {
      title: `C14 · ${matched.label}`,
      body: matched.scenarioNotePartnerNotDonor,
      reference: `GSBD · ${matched.actions.deferralCode}`,
      deferralNote: formatPrimaryDeferralSummary(matched.actions),
    };
  }

  if (state.showPartnerDonorQuestion) {
    return {
      title: `C14 · ${matched.label}`,
      body: "Confirm whether your partner is a current Lifeblood donor to show the correct GSBD pathway.",
      reference: "GSBD — Sexual activity deferrals",
    };
  }

  return {
    title: `C14 · ${matched.label}`,
    body: matched.explanation,
    reference: `GSBD · ${matched.actions.deferralCode}`,
    deferralNote: formatPrimaryDeferralSummary(matched.actions),
  };
}
