"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  filterChecklistQuestions,
  getChecklistCounts,
  getRelevantReferenceGuidance,
  initialQuestionResponses,
  screeningFlows,
  type ChecklistFilter,
  type DonorScreeningResponse,
  type FollowUpQuestion,
  type InterviewQuestion,
  type QuestionReviewStatus,
  type ScreeningQuestionFlow,
} from "../data";
import { GuidancePanel, NextStepBanner } from "../GuidancePanel";
import {
  buildAggregatedInterviewGuidance,
  getFollowUpCompleteVariant,
  getQuestionGuidanceContribution,
  isQuestionFollowUpComplete,
} from "../interview-guidance";
import {
  B5ActivitySelection,
  HazardousActivityGuidance,
  type HazardousActivityState,
} from "../HazardousActivityGuidance";
import {
  lookupHazardousActivity,
} from "../hazardous-activities";
import {
  FollowUpOptionPill,
  FollowUpCompleteCard,
  type FollowUpCompleteVariant,
  InterviewNotesCard,
  QuestionPanelCard,
} from "../interview-panel-cards";
import {
  C14ScenarioSelection,
  deriveC14GuidanceState,
  type C14ScenarioSelectionState,
  type SexualContactGuidanceState,
} from "../SexualContactGuidance";
import {
  getAllInterviewQuestions,
  getSessionReviewQueueIds,
  initialC8FollowUpAnswers,
} from "../session";
import { donor } from "../data";
import { CountryOfBirthPanel } from "../CountryOfBirthPanel";
import {
  getCountryByCode,
  CHAGAS_GUIDANCE,
} from "../country-of-birth";
import {
  maxEscalation,
  needsNurseHighlight,
  resolveInterviewEscalation,
  type EscalationLevel,
} from "../escalation";
import { InterviewHeader } from "../InterviewHeader";
import {
  canRoleEdit,
  getFollowUpRoleNotice,
  getRoleEscalationNotice,
  loadInterviewRole,
  type InterviewRole,
} from "../interview-role";

type FollowUpAnswer = { pillId: string | null; custom: string };

const COUNTRY_OF_BIRTH_ID = "nurse-mandatory-country-of-birth";

export default function InterviewReviewPage() {
  const router = useRouter();
  const allQuestions = useMemo(() => getAllInterviewQuestions(), []);
  const reviewQueueIds = useMemo(
    () => new Set(getSessionReviewQueueIds()),
    []
  );
  const reviewQueue = useMemo(
    () => allQuestions.filter((q) => reviewQueueIds.has(q.id)),
    [allQuestions, reviewQueueIds]
  );
  const [activeTab, setActiveTab] = useState<"interview" | "history" | "eligibility">(
    "interview"
  );
  const [countryOfBirth, setCountryOfBirth] = useState<string | null>(null);
  const [checklistFilter, setChecklistFilter] = useState<ChecklistFilter>("review");
  const [activeItemId, setActiveItemId] = useState<string>(
    () => COUNTRY_OF_BIRTH_ID
  );
  const [questionResponses, setQuestionResponses] = useState(() =>
    initialQuestionResponses(allQuestions, reviewQueueIds)
  );
  const [followUpAnswers, setFollowUpAnswers] = useState<
    Record<string, Record<string, FollowUpAnswer>>
  >(() => initialC8FollowUpAnswers());
  const [notesByQuestion, setNotesByQuestion] = useState<Record<string, string>>(
    {}
  );
  const [interviewRole] = useState<InterviewRole>(() => loadInterviewRole());
  const [b5CustomInput, setB5CustomInput] = useState("");
  const [b5HazardousState, setB5HazardousState] = useState<HazardousActivityState>({
    matchedId: null,
    lookupAttempted: false,
    adviceReadToDonor: false,
    donorDecision: null,
  });
  const [c14Scenario, setC14Scenario] = useState<C14ScenarioSelectionState>({
    selectedPrecannedIds: [],
    customPills: [],
    customInput: "",
  });
  const [c14PartnerDonor, setC14PartnerDonor] = useState<boolean | null>(null);
  const c14GuidanceState = useMemo(
    () => deriveC14GuidanceState(c14Scenario, c14PartnerDonor),
    [c14Scenario, c14PartnerDonor]
  );

  useEffect(() => {
    if (reviewQueueIds.size === 0) {
      router.replace("/interview");
    }
  }, [reviewQueueIds.size, router]);

  const relevantReferenceGuidance = useMemo(
    () => getRelevantReferenceGuidance(allQuestions, questionResponses),
    [allQuestions, questionResponses]
  );

  const guidanceInput = useMemo(
    () => ({
      reviewQueue,
      questionResponses,
      followUpAnswers,
      notesByQuestion,
      b5CustomInput,
      b5HazardousState,
      c14Scenario,
      c14PartnerDonor,
    }),
    [
      reviewQueue,
      questionResponses,
      followUpAnswers,
      notesByQuestion,
      b5CustomInput,
      b5HazardousState,
      c14Scenario,
      c14PartnerDonor,
    ]
  );

  const aggregatedGuidance = useMemo(
    () => buildAggregatedInterviewGuidance(guidanceInput),
    [guidanceInput]
  );

  const nextStepState = useMemo(
    () =>
      buildInterviewNextStep({
        countryOfBirth,
        reviewQueue,
        questionResponses,
        followUpAnswers,
        b5HazardousState,
        c14Scenario,
        c14PartnerDonor,
        notesByQuestion,
        interviewRole,
        overallStatus: aggregatedGuidance.overallStatus,
      }),
    [
      countryOfBirth,
      reviewQueue,
      questionResponses,
      followUpAnswers,
      b5HazardousState,
      c14Scenario,
      c14PartnerDonor,
      notesByQuestion,
      interviewRole,
      aggregatedGuidance.overallStatus,
    ]
  );

  const checklistCounts = getChecklistCounts(allQuestions, reviewQueueIds);
  const filteredQuestions = filterChecklistQuestions(
    allQuestions,
    checklistFilter,
    reviewQueueIds
  );
  const activeQuestion = allQuestions.find((q) => q.id === activeItemId);

  if (reviewQueueIds.size === 0) {
    return null;
  }
  const activeFlowKey = activeQuestion?.flowKey;
  const activeFlow = activeFlowKey ? screeningFlows[activeFlowKey] : null;
  const donorResponse = questionResponses[activeItemId] ?? null;
  const activeFollowUps = activeFlowKey
    ? (followUpAnswers[activeFlowKey] ?? {})
    : {};

  const notes = notesByQuestion[activeItemId] ?? "";

  const activeFollowUpComplete = activeQuestion
    ? isQuestionFollowUpComplete(activeQuestion, donorResponse, {
        followUpAnswers,
        b5HazardousState,
        c14Scenario,
        c14PartnerDonor,
        notesByQuestion,
      })
    : false;

  const activeContribution =
    activeQuestion && donorResponse === "yes"
      ? getQuestionGuidanceContribution(activeQuestion, guidanceInput)
      : null;
  const activeFollowUpCompleteVariant = activeContribution
    ? getFollowUpCompleteVariant(activeContribution)
    : "complete";
  const activeFollowUpDeferralNote = activeContribution?.action ?? undefined;

  let effectiveEscalation: EscalationLevel = activeQuestion
    ? resolveInterviewEscalation(
        activeQuestion.escalation,
        activeFlow?.followUps ?? [],
        activeFollowUps,
        false
      )
    : "dsna";

  if (
    activeFlowKey === "b5" &&
    b5HazardousState.donorDecision === "continue"
  ) {
    effectiveEscalation = "consult_nurse";
  }

  if (
    activeFlowKey === "c14" &&
    c14GuidanceState.lookupAttempted &&
    c14GuidanceState.uncertain
  ) {
    effectiveEscalation = "consult_nurse";
  }

  const selectedCountry = countryOfBirth ? getCountryByCode(countryOfBirth) : null;
  const chagasRisk = selectedCountry?.chagasRisk ?? false;

  const canEdit = canRoleEdit(interviewRole, effectiveEscalation);

  function setQuestionResponse(
    questionId: string,
    response: DonorScreeningResponse
  ) {
    setQuestionResponses((prev) => ({ ...prev, [questionId]: response }));
  }

  function updateFollowUp(
    flowKey: string,
    followUpId: string,
    update: Partial<FollowUpAnswer>
  ) {
    setFollowUpAnswers((prev) => {
      const current = prev[flowKey]?.[followUpId] ?? {
        pillId: null,
        custom: "",
      };
      return {
        ...prev,
        [flowKey]: {
          ...prev[flowKey],
          [followUpId]: { ...current, ...update },
        },
      };
    });
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--clinical-surface)] text-[var(--clinical-on-surface)]">
      <InterviewHeader activeNav={activeTab} onTabChange={setActiveTab} />

      {/* Three-column body: sidebars 1/4 each, main 1/2 */}
      <div className="grid min-h-0 flex-1 grid-cols-4">
        {/* Left: checklist */}
        <aside className="col-span-1 flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-[var(--clinical-outline)] bg-[#FAFBFC]">
          <div className="shrink-0 p-3">
            <ChecklistFilterBar
              filter={checklistFilter}
              counts={checklistCounts}
              onChange={setChecklistFilter}
            />
          </div>

          <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-4">
            {/* Mandatory nurse question — always pinned first */}
            <li>
              <MandatoryQuestionCard
                isActive={activeItemId === COUNTRY_OF_BIRTH_ID}
                answered={countryOfBirth !== null}
                chagasRisk={chagasRisk}
                selectedCountryName={selectedCountry?.name ?? null}
                onSelect={() => setActiveItemId(COUNTRY_OF_BIRTH_ID)}
              />
            </li>
            {filteredQuestions.map((question) => (
              <li key={question.id}>
                <ChecklistQuestionCard
                  question={question}
                  isActive={question.id === activeItemId}
                  response={questionResponses[question.id] ?? null}
                  onSelect={() => setActiveItemId(question.id)}
                  onResponseChange={(response) =>
                    setQuestionResponse(question.id, response)
                  }
                />
              </li>
            ))}
          </ul>
        </aside>

        {/* Center: clarification */}
        <main className="col-span-2 flex min-h-0 min-w-0 flex-col overflow-hidden">
          {activeItemId === COUNTRY_OF_BIRTH_ID && activeTab === "interview" ? (
            <CountryOfBirthPanel
              selectedCode={countryOfBirth}
              onSelect={setCountryOfBirth}
            />
          ) : activeTab !== "interview" ? (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--clinical-on-surface-variant)]">
              {activeTab === "history"
                ? "Donor history view — prototype placeholder."
                : "Eligibility summary view — prototype placeholder."}
            </div>
          ) : activeFlow && activeFlowKey ? (
            <ScreeningDetailPanel
              flow={activeFlow}
              questionCode={activeQuestion?.code}
              interviewRole={interviewRole}
              donorResponse={donorResponse}
              readOnly={!canEdit}
              followUpAnswers={activeFollowUps}
              onSelectPill={(followUpId, pillId) =>
                updateFollowUp(activeFlowKey, followUpId, { pillId })
              }
              onCustomChange={(followUpId, custom) =>
                updateFollowUp(activeFlowKey, followUpId, { custom })
              }
              notes={notes}
              onNotesChange={(value) => {
                setNotesByQuestion((prev) => ({
                  ...prev,
                  [activeItemId]: value,
                }));
              }}
              hazardousActivityState={
                activeFlowKey === "b5" ? b5HazardousState : undefined
              }
              b5CustomInput={activeFlowKey === "b5" ? b5CustomInput : ""}
              onB5CustomInputChange={(value) => {
                setB5CustomInput(value);
                setB5HazardousState({
                  matchedId: null,
                  lookupAttempted: false,
                  adviceReadToDonor: false,
                  donorDecision: null,
                });
              }}
              onB5CustomLookup={() => {
                const match = lookupHazardousActivity(b5CustomInput);
                setB5HazardousState({
                  matchedId: match?.id ?? null,
                  lookupAttempted: true,
                  adviceReadToDonor: false,
                  donorDecision: null,
                });
              }}
              onSelectB5Activity={(activityId) => {
                const deselect = b5HazardousState.matchedId === activityId;
                setB5CustomInput("");
                setB5HazardousState({
                  matchedId: deselect ? null : activityId,
                  lookupAttempted: !deselect,
                  adviceReadToDonor: false,
                  donorDecision: null,
                });
              }}
              onAdviceReadToDonorChange={(read) =>
                setB5HazardousState((prev) => ({
                  ...prev,
                  adviceReadToDonor: read,
                  donorDecision: read ? prev.donorDecision : null,
                }))
              }
              onHazardousDonorDecision={(decision) =>
                setB5HazardousState((prev) => ({ ...prev, donorDecision: decision }))
              }
              c14Scenario={
                activeFlowKey === "c14" ? c14Scenario : undefined
              }
              c14GuidanceState={
                activeFlowKey === "c14" ? c14GuidanceState : undefined
              }
              onC14TogglePrecanned={(pillId) => {
                setC14Scenario((prev) => {
                  const selected = prev.selectedPrecannedIds.includes(pillId)
                    ? prev.selectedPrecannedIds.filter((id) => id !== pillId)
                    : [...prev.selectedPrecannedIds, pillId];
                  return { ...prev, selectedPrecannedIds: selected };
                });
                setC14PartnerDonor(null);
              }}
              onC14AddCustomPill={(label) => {
                setC14Scenario((prev) => {
                  if (
                    prev.customPills.some(
                      (pill) => pill.toLowerCase() === label.toLowerCase()
                    )
                  ) {
                    return { ...prev, customInput: "" };
                  }
                  return {
                    ...prev,
                    customPills: [...prev.customPills, label],
                    customInput: "",
                  };
                });
                setC14PartnerDonor(null);
              }}
              onC14RemoveCustomPill={(label) => {
                setC14Scenario((prev) => ({
                  ...prev,
                  customPills: prev.customPills.filter((pill) => pill !== label),
                }));
                setC14PartnerDonor(null);
              }}
              onC14CustomInputChange={(value) =>
                setC14Scenario((prev) => ({ ...prev, customInput: value }))
              }
              onPartnerLifebloodDonorChange={setC14PartnerDonor}
              followUpComplete={activeFollowUpComplete}
              followUpCompleteVariant={activeFollowUpCompleteVariant}
              followUpDeferralNote={activeFollowUpDeferralNote}
            />
          ) : activeQuestion ? (
            <div className="flex flex-1 flex-col overflow-y-auto bg-white px-8 py-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                {activeQuestion.code} · {activeQuestion.category}
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-public-sans)] text-2xl font-semibold leading-tight">
                  {activeQuestion.question}
                </h1>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--clinical-on-surface-variant)]">
              Select a question from the checklist.
            </div>
          )}
        </main>

        {/* Right: clinical insights */}
        <aside className="col-span-1 flex min-h-0 min-w-0 flex-col overflow-y-auto border-l border-[var(--clinical-outline)] bg-[#F5F6F8]">
          <NextStepBanner
            prompt={nextStepState.prompt}
            doneCount={nextStepState.doneCount}
            totalCount={nextStepState.totalCount}
          />

          <div className="min-h-0 flex-1 px-4 pb-6 pt-4">
            {chagasRisk && (
              <ChagasRiskCard country={selectedCountry!.name} />
            )}
            <GuidancePanel
              guidance={aggregatedGuidance}
              donorWeightKg={parseFloat(donor.profile.weightKg) || undefined}
              donorSex={donor.profile.sex || undefined}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatQuestionCodeList(codes: string[]): string {
  if (codes.length === 1) return codes[0];
  if (codes.length === 2) return `${codes[0]} and ${codes[1]}`;
  return `${codes.slice(0, -1).join(", ")}, and ${codes[codes.length - 1]}`;
}

function buildInterviewNextStep({
  countryOfBirth,
  reviewQueue,
  questionResponses,
  followUpAnswers,
  b5HazardousState,
  c14Scenario,
  c14PartnerDonor,
  notesByQuestion,
  interviewRole,
  overallStatus,
}: {
  countryOfBirth: string | null;
  reviewQueue: InterviewQuestion[];
  questionResponses: Record<string, DonorScreeningResponse | null>;
  followUpAnswers: Record<string, Record<string, FollowUpAnswer>>;
  b5HazardousState: HazardousActivityState;
  c14Scenario: C14ScenarioSelectionState;
  c14PartnerDonor: boolean | null;
  notesByQuestion: Record<string, string>;
  interviewRole: InterviewRole;
  overallStatus: "eligible" | "restricted" | "deferred" | "pending" | "review";
}): {
  prompt: string;
  doneCount: number;
  totalCount: number;
} {
  const followUpInput = {
    followUpAnswers,
    b5HazardousState,
    c14Scenario,
    c14PartnerDonor,
    notesByQuestion,
  };

  const countryComplete = countryOfBirth !== null;
  const queueItems = reviewQueue.map((question) => ({
    question,
    complete: isQuestionFollowUpComplete(
      question,
      questionResponses[question.id] ?? null,
      followUpInput
    ),
  }));

  const totalCount = 1 + reviewQueue.length;
  const doneCount =
    (countryComplete ? 1 : 0) + queueItems.filter((item) => item.complete).length;

  const pendingCodes: string[] = [];
  if (!countryComplete) pendingCodes.push("Chagas Check");
  for (const item of queueItems) {
    if (!item.complete) pendingCodes.push(item.question.code);
  }

  let peakEscalation: EscalationLevel = "dsna";
  let b5DonorContinues = false;

  for (const { question } of queueItems) {
    const flowKey = question.flowKey;
    const flow = flowKey ? screeningFlows[flowKey] : null;
    const followUps = flowKey ? (followUpAnswers[flowKey] ?? {}) : {};
    let level = resolveInterviewEscalation(
      question.escalation,
      flow?.followUps ?? [],
      followUps,
      false
    );

    if (flowKey === "b5" && b5HazardousState.donorDecision === "continue") {
      level = "consult_nurse";
      b5DonorContinues = true;
    }

    if (flowKey === "c14") {
      const state = deriveC14GuidanceState(c14Scenario, c14PartnerDonor);
      if (state.lookupAttempted && state.uncertain) {
        level = "consult_nurse";
      }
    }

    if (needsNurseHighlight(level)) {
      peakEscalation = maxEscalation(peakEscalation, level);
    }
  }

  if (pendingCodes.length > 0) {
    const codes = formatQuestionCodeList(pendingCodes);
    return {
      prompt:
        pendingCodes.length === 1 && pendingCodes[0] === "Chagas Check"
          ? "Record the donor's country of birth."
          : `Complete the follow-up questions for ${codes}.`,
      doneCount,
      totalCount,
    };
  }

  const nurseNotice = getRoleEscalationNotice(interviewRole, peakEscalation, {
    b5DonorContinues,
  });

  if (
    (needsNurseHighlight(peakEscalation) || overallStatus === "review") &&
    nurseNotice
  ) {
    return {
      prompt: nurseNotice.body,
      doneCount,
      totalCount,
    };
  }

  if (overallStatus === "review") {
    return {
      prompt: "A nurse review is required before the donor can proceed.",
      doneCount,
      totalCount,
    };
  }

  return {
    prompt:
      "All questions complete. Review the guidance below before proceeding.",
    doneCount,
    totalCount,
  };
}

function ChecklistFilterBar({
  filter,
  counts,
  onChange,
}: {
  filter: ChecklistFilter;
  counts: { review: number; clear: number; all: number };
  onChange: (filter: ChecklistFilter) => void;
}) {
  const tabs: { id: ChecklistFilter; label: string; count?: number }[] = [
    { id: "review", label: "Review", count: counts.review },
    { id: "all", label: "All" },
    { id: "clear", label: "Clear", count: counts.clear },
  ];

  return (
    <div
      className="flex rounded-xl bg-[var(--clinical-surface-insights)] p-1"
      role="tablist"
      aria-label="Filter checklist questions"
    >
      {tabs.map((tab) => {
        const active = filter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-white text-[var(--clinical-on-surface)] shadow-sm"
                : "text-[var(--clinical-on-surface-variant)] hover:text-[var(--clinical-on-surface)]"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums ${
                  active
                    ? "bg-[var(--clinical-surface)] text-[var(--clinical-on-surface-variant)]"
                    : "bg-white/80 text-[var(--clinical-on-surface-variant)]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ChecklistQuestionCard({
  question,
  isActive,
  response,
  onSelect,
  onResponseChange,
}: {
  question: InterviewQuestion;
  isActive: boolean;
  response: DonorScreeningResponse | null;
  onSelect: () => void;
  onResponseChange: (response: DonorScreeningResponse) => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`cursor-pointer rounded-xl border bg-white p-4 transition-shadow ${
        isActive
          ? "border-[var(--clinical-primary)] ring-1 ring-[var(--clinical-primary-subtle-border)]"
          : "border-[var(--clinical-outline)] hover:border-[var(--clinical-outline-variant)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <ReviewStatusBadge status={question.reviewStatus} />
          <span className="truncate text-xs text-[var(--clinical-on-surface-variant)]">
            {question.category}
          </span>
        </div>
        {question.reviewStatus === "ok" && response !== null ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--clinical-success)] text-white">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
        ) : (
          <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--clinical-outline-variant)]" />
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className="font-mono text-xs font-bold tracking-wide text-[var(--clinical-primary)]">
          {question.code}
        </p>
      </div>
      <p className="mt-1 text-sm font-semibold leading-snug text-[var(--clinical-on-surface)]">
        {question.question}
      </p>

      <div
        className="mt-3 grid grid-cols-2 gap-2"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DonorResponseButton
          label="Yes"
          compact
          selected={response === "yes"}
          variant="yes"
          onClick={() => onResponseChange("yes")}
        />
        <DonorResponseButton
          label="No"
          compact
          selected={response === "no"}
          variant="no"
          onClick={() => onResponseChange("no")}
        />
      </div>
    </article>
  );
}

function ReviewStatusBadge({ status }: { status: QuestionReviewStatus }) {
  const styles: Record<
    QuestionReviewStatus,
    { label: string; className: string }
  > = {
    ok: {
      label: "OK",
      className:
        "bg-[#f3faef] text-[var(--clinical-success)] border-[#c9e1bd]",
    },
    clarify: {
      label: "Clarify",
      className:
        "bg-[var(--clinical-primary-container)] text-[var(--clinical-primary)] border-[var(--clinical-primary-subtle-border)]",
    },
    attention: {
      label: "Attention",
      className:
        "bg-[var(--clinical-warning-subtle)] text-[var(--clinical-warning)] border-[var(--clinical-warning-subtle-border)]",
    },
    pending: {
      label: "Pending",
      className:
        "bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface-variant)] border-[var(--clinical-outline)]",
    },
  };
  const meta = styles[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.className}`}
    >
      {status === "ok" && <CheckIcon className="h-3 w-3" />}
      {status === "clarify" && <span className="text-[10px]">?</span>}
      {status === "attention" && <AlertIcon className="h-3 w-3" />}
      {meta.label}
    </span>
  );
}

function ScreeningDetailPanel({
  flow,
  questionCode,
  interviewRole,
  donorResponse,
  readOnly,
  followUpAnswers,
  onSelectPill,
  onCustomChange,
  notes,
  onNotesChange,
  hazardousActivityState,
  b5CustomInput,
  onB5CustomInputChange,
  onB5CustomLookup,
  onSelectB5Activity,
  onAdviceReadToDonorChange,
  onHazardousDonorDecision,
  c14Scenario,
  c14GuidanceState,
  onC14TogglePrecanned,
  onC14AddCustomPill,
  onC14RemoveCustomPill,
  onC14CustomInputChange,
  onPartnerLifebloodDonorChange,
  followUpComplete,
  followUpCompleteVariant,
  followUpDeferralNote,
}: {
  flow: ScreeningQuestionFlow;
  questionCode?: string;
  interviewRole: InterviewRole;
  donorResponse: DonorScreeningResponse | null;
  readOnly: boolean;
  followUpAnswers: Record<string, FollowUpAnswer>;
  onSelectPill: (followUpId: string, pillId: string | null) => void;
  onCustomChange: (followUpId: string, custom: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  hazardousActivityState?: HazardousActivityState;
  b5CustomInput?: string;
  onB5CustomInputChange?: (value: string) => void;
  onB5CustomLookup?: () => void;
  onSelectB5Activity?: (activityId: string) => void;
  onAdviceReadToDonorChange?: (read: boolean) => void;
  onHazardousDonorDecision?: (
    decision: HazardousActivityState["donorDecision"]
  ) => void;
  c14GuidanceState?: SexualContactGuidanceState;
  c14Scenario?: C14ScenarioSelectionState;
  onC14TogglePrecanned?: (pillId: string) => void;
  onC14AddCustomPill?: (label: string) => void;
  onC14RemoveCustomPill?: (label: string) => void;
  onC14CustomInputChange?: (value: string) => void;
  onPartnerLifebloodDonorChange?: (value: boolean) => void;
  followUpComplete: boolean;
  followUpCompleteVariant: FollowUpCompleteVariant;
  followUpDeferralNote?: string;
}) {
  const followUpTrigger = flow.followUpTrigger ?? flow.donorResponse;
  const showFollowUps = donorResponse === followUpTrigger;
  const showHazardousFlow =
    flow.hazardousActivity &&
    donorResponse === "yes" &&
    hazardousActivityState &&
    onB5CustomInputChange &&
    onB5CustomLookup &&
    onSelectB5Activity &&
    onAdviceReadToDonorChange &&
    onHazardousDonorDecision;
  const showSexualContactFlow =
    flow.sexualContactGuidance &&
    donorResponse === "yes" &&
    c14GuidanceState &&
    c14Scenario &&
    onC14TogglePrecanned &&
    onC14AddCustomPill &&
    onC14RemoveCustomPill &&
    onC14CustomInputChange &&
    onPartnerLifebloodDonorChange;
  return (
    <div
      className={`min-h-0 flex-1 overflow-y-auto bg-[#F5F6F8] px-8 py-8 ${readOnly ? "pointer-events-none opacity-60" : ""}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
        {questionCode ?? flow.questionNumber} · {flow.section}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-public-sans)] text-2xl font-semibold leading-tight text-[var(--clinical-on-surface)]">
        {flow.question}
      </h1>

      <InterviewNotesCard
        className="mt-4"
        value={notes}
        onChange={onNotesChange}
        readOnly={readOnly}
      />

      {showSexualContactFlow && (
        <>
          <C14ScenarioSelection
            selection={c14Scenario}
            guidanceState={c14GuidanceState}
            readOnly={readOnly}
            onTogglePrecanned={onC14TogglePrecanned}
            onAddCustomPill={onC14AddCustomPill}
            onRemoveCustomPill={onC14RemoveCustomPill}
            onCustomInputChange={onC14CustomInputChange}
            onPartnerLifebloodDonorChange={
              onPartnerLifebloodDonorChange ?? (() => {})
            }
          />
        </>
      )}

      {showFollowUps && !flow.hazardousActivity && !flow.sexualContactGuidance && (
        <div
          className={`flex flex-col gap-4 ${flow.c8MultiplePartnersGuidance ? "mt-6" : "mt-8"}`}
        >
          {flow.followUps.map((followUp) => (
            <FollowUpQuestionCard
              key={followUp.id}
              followUp={followUp}
              answer={
                followUpAnswers[followUp.id] ?? {
                  pillId: null,
                  custom: "",
                }
              }
              onSelectPill={(pillId) => onSelectPill(followUp.id, pillId)}
              onCustomChange={(custom) =>
                onCustomChange(followUp.id, custom)
              }
              readOnly={readOnly}
              interviewRole={interviewRole}
            />
          ))}

        </div>
      )}

      {showHazardousFlow && (
        <>
          <div className="mt-6">
            <B5ActivitySelection
              selectedId={hazardousActivityState.matchedId}
              customInput={b5CustomInput ?? ""}
              readOnly={readOnly}
              onSelectActivity={onSelectB5Activity}
              onCustomInputChange={onB5CustomInputChange}
              onCustomKeyDown={(e) => {
                if (e.key !== "Enter" || e.shiftKey) return;
                e.preventDefault();
                onB5CustomLookup?.();
              }}
            />
          </div>
          <HazardousActivityGuidance
            interviewRole={interviewRole}
            state={hazardousActivityState}
            activityNotes={b5CustomInput ?? ""}
            onAdviceReadToDonorChange={onAdviceReadToDonorChange}
            onDonorDecision={onHazardousDonorDecision}
          />
        </>
      )}

      {donorResponse === "no" && (
        <FollowUpCompleteCard variant="cleared" />
      )}

      {donorResponse === "yes" && followUpComplete && (
        <FollowUpCompleteCard
          variant={followUpCompleteVariant}
          note={followUpDeferralNote}
        />
      )}
    </div>
  );
}

function DonorResponseButton({
  label,
  selected,
  variant,
  onClick,
  compact = false,
}: {
  label: string;
  selected: boolean;
  variant: "yes" | "no";
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center rounded-lg border font-semibold transition-colors ${
        compact ? "px-2.5 py-2 text-xs" : "px-3 py-2 text-sm"
      } ${
        selected
          ? variant === "yes"
            ? "clinical-toggle-yes-selected"
            : "border-[var(--clinical-outline-variant)] bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface-variant)]"
          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface-variant)] hover:border-[var(--clinical-outline-variant)] hover:bg-[var(--clinical-surface)]"
      }`}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

function FollowUpQuestionCard({
  followUp,
  answer,
  onSelectPill,
  onCustomChange,
  readOnly = false,
  interviewRole,
}: {
  followUp: FollowUpQuestion;
  answer: FollowUpAnswer;
  onSelectPill: (pillId: string | null) => void;
  onCustomChange: (custom: string) => void;
  readOnly?: boolean;
  interviewRole: InterviewRole;
}) {
  const followUpNotice = getFollowUpRoleNotice(interviewRole, followUp.escalation);

  return (
    <QuestionPanelCard title={followUp.question}>
      {followUpNotice && (
        <p className="mb-4 text-xs font-medium text-[var(--clinical-warning)]">
          {followUpNotice}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {followUp.quickOptions.map((opt) => {
          const selected = answer.pillId === opt.id;
          return (
            <FollowUpOptionPill
              key={opt.id}
              label={opt.label}
              selected={selected}
              disabled={readOnly}
              onClick={() => onSelectPill(selected ? null : opt.id)}
            />
          );
        })}
      </div>

      <textarea
        value={answer.custom}
        disabled={readOnly}
        onChange={(e) => onCustomChange(e.target.value)}
        placeholder="Or type a custom response..."
        rows={2}
        className="mt-3 w-full resize-none rounded-lg border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--clinical-on-surface-variant)] focus:border-[var(--clinical-primary)] focus:bg-white"
      />
    </QuestionPanelCard>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L1 21h22L12 2zm0 4.5L19.5 19h-15L12 6.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
    </svg>
  );
}

function MandatoryQuestionCard({
  isActive,
  answered,
  chagasRisk,
  selectedCountryName,
  onSelect,
}: {
  isActive: boolean;
  answered: boolean;
  chagasRisk: boolean;
  selectedCountryName: string | null;
  onSelect: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`cursor-pointer rounded-xl border bg-white p-4 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clinical-primary)] ${
        isActive
          ? "border-[var(--clinical-primary)] ring-1 ring-[var(--clinical-primary-subtle-border)]"
          : "border-[var(--clinical-outline)] hover:border-[var(--clinical-outline-variant)]"
      }`}
    >
      {/* Top row — category + status icon */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded-full border border-[var(--clinical-primary-subtle-border)] bg-[var(--clinical-primary-container)] px-2 py-0.5 text-[10px] font-semibold text-[var(--clinical-primary)]">
            Mandatory
          </span>
        </div>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--clinical-outline-variant)]" />
      </div>

      {/* Question */}
      <p className="mt-2 font-mono text-xs font-bold tracking-wide text-[var(--clinical-primary)]">
        Chagas Check
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug text-[var(--clinical-on-surface)]">
        What is your country of birth?
      </p>

      {/* Answer badge */}
      {answered && selectedCountryName && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="clinical-toggle-yes-selected inline-flex items-center rounded-lg px-2.5 py-2 text-xs font-semibold">
            {selectedCountryName}
          </span>
          {chagasRisk && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)] px-2.5 py-2 text-xs font-semibold text-[var(--clinical-warning)]">
              ⚠ Chagas risk
            </span>
          )}
        </div>
      )}
    </article>
  );
}

function ChagasRiskCard({ country }: { country: string }) {
  return (
    <article className="mb-4 overflow-hidden rounded-xl border border-[var(--clinical-warning-subtle-border)] bg-white shadow-sm">
      <div className="border-b border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)] px-4 py-2.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--clinical-warning)]">
          ⚠ Chagas Risk — {country}
        </p>
      </div>
      <div className="border-b border-[var(--clinical-outline)] px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clinical-warning)]">
          Action
        </p>
        <p className="mt-1 text-sm font-medium leading-snug text-[var(--clinical-on-surface)]">
          {CHAGAS_GUIDANCE.action}
        </p>
      </div>
      <div className="px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clinical-on-surface-variant)]">
          Why
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--clinical-on-surface-variant)]">
          {CHAGAS_GUIDANCE.reasoning}
        </p>
      </div>
      <div className="border-t border-[var(--clinical-outline)] px-4 py-2.5">
        <span className="text-xs font-medium text-[var(--clinical-secondary)]">
          {CHAGAS_GUIDANCE.reference}
        </span>
      </div>
    </article>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 004 19.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
