"use client";

import type { KeyboardEvent } from "react";
import {
  BinaryChoiceButtons,
  FollowUpOptionPill,
  GuidanceActionPanel,
  InterviewNotesCard,
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
  /** Is the partner a current Lifeblood donor? */
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
  notes,
  readOnly,
  onTogglePrecanned,
  onAddCustomPill,
  onRemoveCustomPill,
  onCustomInputChange,
  onNotesChange,
  onPartnerLifebloodDonorChange,
}: {
  selection: C14ScenarioSelectionState;
  guidanceState: SexualContactGuidanceState;
  notes: string;
  readOnly?: boolean;
  onTogglePrecanned: (pillId: string) => void;
  onAddCustomPill: (label: string) => void;
  onRemoveCustomPill: (label: string) => void;
  onCustomInputChange: (value: string) => void;
  onNotesChange: (value: string) => void;
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
      <InterviewNotesCard
        value={notes}
        onChange={onNotesChange}
        readOnly={readOnly}
      />

      <QuestionPanelCard
        title="Which scenario best describes the donor's situation?"
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
          className="mt-3 w-full rounded-lg border border-[#e5e7eb] bg-[var(--clinical-surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[#727783] focus:border-[var(--clinical-primary)] focus:bg-white"
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
        <article className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm leading-6 text-blue-900">
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
  entry,
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
  const showActions =
    (showPartnerDonorQuestion && partnerNotDonor) || !showPartnerDonorQuestion;

  return (
    <>
      {showPartnerDonorQuestion && (
        <QuestionPanelCard title="Is the partner a current Lifeblood donor?">
          <BinaryChoiceButtons
            yesSelected={partnerIsDonor}
            noSelected={partnerNotDonor}
            onSelectYes={() => onPartnerLifebloodDonorChange(true)}
            onSelectNo={() => onPartnerLifebloodDonorChange(false)}
          />
        </QuestionPanelCard>
      )}

      {showPartnerDonorQuestion && partnerIsDonor && (
        <QuestionPanelCard title="Partner is a current Lifeblood donor">
          <p className="text-sm leading-6 text-[var(--clinical-on-surface-variant)]">
            {entry.scenarioNotePartnerIsDonor}
          </p>
        </QuestionPanelCard>
      )}

      {showActions && <GuidanceActions entry={entry} />}
    </>
  );
}

function GuidanceActions({ entry }: { entry: SexualContactGuidanceEntry }) {
  const { primary, deferralCode } = entry.actions;

  return (
    <GuidanceActionPanel
      title={`Apply deferral ${deferralCode}`}
      summary={`${primary.donationType} · ${primary.deferralWindow}`}
      detail={primary.detail}
    />
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
      body: "Select scenario pills that describe the donor's situation.",
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
      body: "Confirm whether the partner is a current Lifeblood donor to show the correct GSBD pathway.",
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
