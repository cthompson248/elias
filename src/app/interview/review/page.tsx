"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  donor,
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
import { EscalationBanner, GuidancePanel, NextStepBanner } from "../GuidancePanel";
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
  getHazardousActivityById,
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
} from "../session";
import { resolveInterviewEscalation, type EscalationLevel } from "../escalation";
import {
  canRoleEdit,
  getFollowUpRoleNotice,
  getRoleEscalationNotice,
  loadInterviewRole,
  type InterviewRole,
} from "../interview-role";

type FollowUpAnswer = { pillId: string | null; custom: string };

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
  const [checklistFilter, setChecklistFilter] = useState<ChecklistFilter>("review");
  const [activeItemId, setActiveItemId] = useState(
    () => reviewQueue[0]?.id ?? allQuestions[0]?.id ?? "b6"
  );
  const [questionResponses, setQuestionResponses] = useState(() =>
    initialQuestionResponses(allQuestions, reviewQueueIds)
  );
  const [followUpAnswers, setFollowUpAnswers] = useState<
    Record<string, Record<string, FollowUpAnswer>>
  >({});
  const [notesByQuestion, setNotesByQuestion] = useState<Record<string, string>>(
    {}
  );
  const [interviewRole] = useState<InterviewRole>(() => loadInterviewRole());
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
      b5HazardousState,
      c14Scenario,
      c14PartnerDonor,
    }),
    [
      reviewQueue,
      questionResponses,
      followUpAnswers,
      notesByQuestion,
      b5HazardousState,
      c14Scenario,
      c14PartnerDonor,
    ]
  );

  const aggregatedGuidance = useMemo(
    () => buildAggregatedInterviewGuidance(guidanceInput),
    [guidanceInput]
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

  const activeFollowUpCompleteVariant =
    activeQuestion && donorResponse === "yes"
      ? getFollowUpCompleteVariant(
          getQuestionGuidanceContribution(activeQuestion, guidanceInput)
        )
      : "complete";

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

  const roleNotice = getRoleEscalationNotice(interviewRole, effectiveEscalation, {
    b5DonorContinues:
      activeFlowKey === "b5" && b5HazardousState.donorDecision === "continue",
  });
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
      {/* Top header */}
      <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-[var(--clinical-outline)] bg-white px-6 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--clinical-surface-insights)] text-sm font-semibold text-[var(--clinical-on-surface-variant)]">
            MT
          </div>
          <div className="min-w-0 leading-tight">
            <p className="font-[family-name:var(--font-public-sans)] text-base font-semibold">
              {donor.name}
            </p>
            <p className="text-sm text-[var(--clinical-on-surface-variant)]">
              ID: {donor.donorId} · Type: {donor.bloodType}
            </p>
          </div>

          <div className="hidden h-9 w-px bg-[var(--clinical-outline)] sm:block" />

          <p className="hidden rounded-full border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--clinical-on-surface-variant)] sm:block">
            {interviewRole === "dsna" ? "DSNA" : "Nurse"}
          </p>

          <div className="hidden text-sm text-[var(--clinical-on-surface-variant)] md:block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
              Last Donation
            </span>
            <p className="font-medium text-[var(--clinical-on-surface)]">
              {donor.lastDonation}
            </p>
          </div>
        </div>

        <nav className="flex items-center justify-center gap-6">
          {(
            [
              { id: "interview" as const, label: "Interview" },
              { id: "history" as const, label: "History" },
              { id: "eligibility" as const, label: "Eligibility" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-0.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-[var(--clinical-primary)]"
                  : "text-[var(--clinical-on-surface-variant)] hover:text-[var(--clinical-on-surface)]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute -bottom-3 left-0 right-0 h-0.5 rounded-full bg-[var(--clinical-primary)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/interview"
            className="rounded-lg border border-[var(--clinical-outline)] px-3 py-2 text-sm font-medium text-[var(--clinical-on-surface-variant)] transition-colors hover:bg-[var(--clinical-surface)]"
          >
            Change selection
          </Link>
          <IconButton label="Notifications">
            <BellIcon className="h-5 w-5" />
          </IconButton>
          <IconButton label="Settings">
            <GearIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </header>

      {/* Three-column body: sidebars 1/4 each, main 1/2 */}
      <div className="grid min-h-0 flex-1 grid-cols-4">
        {/* Left: checklist */}
        <aside className="col-span-1 flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-[var(--clinical-outline)] bg-[var(--clinical-surface)]">
          <div className="shrink-0 p-3">
            <ChecklistFilterBar
              filter={checklistFilter}
              counts={checklistCounts}
              onChange={setChecklistFilter}
            />
          </div>

          <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-4">
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
          {activeTab !== "interview" ? (
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
                if (activeFlowKey === "b5") {
                  setB5HazardousState({
                    matchedId: null,
                    lookupAttempted: false,
                    adviceReadToDonor: false,
                    donorDecision: null,
                  });
                }
              }}
              hazardousActivityState={
                activeFlowKey === "b5" ? b5HazardousState : undefined
              }
              onHazardousLookupFromNotes={(noteText) => {
                const match = lookupHazardousActivity(noteText);
                setB5HazardousState({
                  matchedId: match?.id ?? null,
                  lookupAttempted: true,
                  adviceReadToDonor: false,
                  donorDecision: null,
                });
              }}
              onSelectB5Activity={(activityId) => {
                const entry = getHazardousActivityById(activityId);
                if (!entry) return;
                const deselect = b5HazardousState.matchedId === activityId;
                setNotesByQuestion((prev) => ({
                  ...prev,
                  [activeItemId]: deselect ? "" : entry.label,
                }));
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
        <aside className="col-span-1 flex min-h-0 min-w-0 flex-col overflow-y-auto border-l border-[var(--clinical-outline)] bg-[var(--clinical-surface-insights)]">
          {aggregatedGuidance.sayToDonor === null &&
            aggregatedGuidance.nursePrompt && (
              <NextStepBanner
                nursePrompt={aggregatedGuidance.nursePrompt}
                pendingQuestionCodes={aggregatedGuidance.pendingQuestionCodes}
                totalCount={aggregatedGuidance.contributions.length}
              />
            )}

          {roleNotice && <EscalationBanner notice={roleNotice} />}

          <div className="min-h-0 flex-1 px-4 pb-6 pt-4">
            <GuidancePanel
              guidance={aggregatedGuidance}

            />
          </div>
        </aside>
      </div>
    </div>
  );
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
  onHazardousLookupFromNotes,
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
  onHazardousLookupFromNotes?: (noteText: string) => void;
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
}) {
  const followUpTrigger = flow.followUpTrigger ?? flow.donorResponse;
  const showFollowUps = donorResponse === followUpTrigger;
  const showHazardousFlow =
    flow.hazardousActivity &&
    donorResponse === "yes" &&
    hazardousActivityState &&
    onHazardousLookupFromNotes &&
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
      className={`min-h-0 flex-1 overflow-y-auto bg-white px-8 py-8 ${readOnly ? "pointer-events-none opacity-60" : ""}`}
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
        onKeyDown={
          showHazardousFlow && onHazardousLookupFromNotes
            ? (e) => {
                if (e.key !== "Enter" || e.shiftKey) return;
                e.preventDefault();
                onHazardousLookupFromNotes(e.currentTarget.value);
              }
            : undefined
        }
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
              readOnly={readOnly}
              onSelectActivity={onSelectB5Activity}
            />
          </div>
          <HazardousActivityGuidance
            interviewRole={interviewRole}
            state={hazardousActivityState}
            activityNotes={notes}
            onAdviceReadToDonorChange={onAdviceReadToDonorChange}
            onDonorDecision={onHazardousDonorDecision}
          />
        </>
      )}

      {donorResponse === "no" && (
        <FollowUpCompleteCard variant="cleared" />
      )}

      {donorResponse === "yes" && followUpComplete && (
        <FollowUpCompleteCard variant={followUpCompleteVariant} />
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

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--clinical-on-surface-variant)] transition-colors hover:bg-[var(--clinical-surface)]"
    >
      {children}
    </button>
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

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
    </svg>
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
