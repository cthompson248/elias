"use client";

import { useState } from "react";
import {
  checklistSections,
  clinicalInsight,
  dentalScreeningFlow,
  donor,
  referenceGuidance,
  totalQuestions,
  type DonorScreeningResponse,
  type FollowUpQuestion,
} from "./data";

type FollowUpAnswer = { pillId: string | null; custom: string };

export default function InterviewPage() {
  const [activeTab, setActiveTab] = useState<"interview" | "history" | "eligibility">(
    "interview"
  );
  const [activeItemId, setActiveItemId] = useState("dental");
  const [donorResponse, setDonorResponse] = useState<DonorScreeningResponse>(
    dentalScreeningFlow.donorResponse
  );
  const [followUpAnswers, setFollowUpAnswers] = useState<
    Record<string, FollowUpAnswer>
  >({
    "procedure-type": { pillId: "cleaning", custom: "" },
  });
  const [notes, setNotes] = useState("");

  const pharmacologicalAnswer =
    donorResponse === "yes"
      ? (followUpAnswers["pharmacological"]?.pillId ?? null)
      : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--clinical-surface)] text-[var(--clinical-on-surface)]">
      {/* Top header */}
      <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-[var(--clinical-outline)] bg-white px-6 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dbe4ed] text-sm font-semibold text-[var(--clinical-on-surface-variant)]">
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

          <div className="hidden text-sm text-[var(--clinical-on-surface-variant)] md:block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#727783]">
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
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
          >
            <AlertIcon className="h-4 w-4" />
            Emergency Alert
          </button>
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
        <aside className="col-span-1 flex min-h-0 min-w-0 flex-col overflow-y-auto border-r border-[var(--clinical-outline)] bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-[family-name:var(--font-public-sans)] text-sm font-semibold">
              Interview Checklist
            </h2>
            <span className="rounded-full bg-[var(--clinical-primary)] px-2.5 py-0.5 text-xs font-semibold text-white">
              {totalQuestions} Questions
            </span>
          </div>

          <nav className="flex flex-col gap-6 px-3 pb-6">
            {checklistSections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-2 text-[11px] font-semibold tracking-wide text-[#727783]">
                  {section.title}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {section.items.map((item) => {
                    const active = item.id === activeItemId;
                    const isClarification = item.status === "clarification";
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setActiveItemId(item.id)}
                          className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                            isClarification
                              ? "border border-amber-200 bg-amber-50"
                              : active
                                ? "bg-[var(--clinical-surface)]"
                                : "hover:bg-[var(--clinical-surface)]"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <StatusIcon status={item.status} />
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  isClarification
                                    ? "text-amber-800"
                                    : "text-[var(--clinical-on-surface)]"
                                }`}
                              >
                                {item.label}
                              </p>
                              {item.subtext && (
                                <p className="mt-0.5 text-xs text-amber-700">
                                  {item.subtext}
                                </p>
                              )}
                              {isClarification && (
                                <p className="mt-1 text-xs font-semibold text-amber-600">
                                  Needs Clarification
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Center: clarification */}
        <main className="col-span-2 flex min-h-0 min-w-0 flex-col overflow-hidden">
          {activeTab !== "interview" ? (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--clinical-on-surface-variant)]">
              {activeTab === "history"
                ? "Donor history view — prototype placeholder."
                : "Eligibility summary view — prototype placeholder."}
            </div>
          ) : activeItemId === "dental" ? (
            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-8 py-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#727783]">
                {dentalScreeningFlow.section} · {dentalScreeningFlow.questionNumber}
              </p>
              <div className="mt-2 flex items-center justify-between gap-6">
                <h1 className="min-w-0 flex-1 font-[family-name:var(--font-public-sans)] text-2xl font-semibold leading-tight text-[var(--clinical-on-surface)]">
                  {dentalScreeningFlow.question}
                </h1>
                <div className="flex shrink-0 items-center gap-2">
                  <DonorResponseButton
                    label="Yes"
                    selected={donorResponse === "yes"}
                    variant="yes"
                    onClick={() => setDonorResponse("yes")}
                  />
                  <DonorResponseButton
                    label="No"
                    selected={donorResponse === "no"}
                    variant="no"
                    onClick={() => setDonorResponse("no")}
                  />
                </div>
              </div>

              <div
                className={`mt-6 transition-opacity ${
                  donorResponse === "no"
                    ? "pointer-events-none opacity-40 grayscale"
                    : ""
                }`}
                aria-hidden={donorResponse === "no"}
              >
                {donorResponse === "yes" && (
                  <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                    <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        Why this is flagged
                      </p>
                      <p className="mt-1 text-sm leading-6 text-blue-800">
                        {dentalScreeningFlow.flagReason}
                      </p>
                    </div>
                  </div>
                )}

                <section className={donorResponse === "yes" ? "mt-8" : "mt-0"}>
                  <h2 className="text-base font-semibold text-[var(--clinical-on-surface)]">
                    Follow-up questions
                  </h2>
                  {donorResponse === "no" && (
                    <p className="mt-2 text-sm text-[#727783]">
                      Not required for a &ldquo;No&rdquo; response.
                    </p>
                  )}
                  <div className="mt-4 flex flex-col gap-4">
                    {dentalScreeningFlow.followUps.map((followUp) => (
                      <FollowUpQuestionCard
                        key={followUp.id}
                        followUp={followUp}
                        disabled={donorResponse === "no"}
                        answer={
                          followUpAnswers[followUp.id] ?? {
                            pillId: null,
                            custom: "",
                          }
                        }
                        onSelectPill={(pillId) =>
                          setFollowUpAnswers((prev) => ({
                            ...prev,
                            [followUp.id]: {
                              pillId,
                              custom: prev[followUp.id]?.custom ?? "",
                            },
                          }))
                        }
                        onCustomChange={(custom) =>
                          setFollowUpAnswers((prev) => ({
                            ...prev,
                            [followUp.id]: {
                              pillId: prev[followUp.id]?.pillId ?? null,
                              custom,
                            },
                          }))
                        }
                      />
                    ))}
                  </div>
                </section>
              </div>

              <section className="mt-8">
                <h2 className="text-base font-semibold text-[var(--clinical-on-surface)]">
                  Notes
                </h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    donorResponse === "no"
                      ? "Add any additional context for this negative response…"
                      : "Record any additional observations or verbal clarifications..."
                  }
                  rows={5}
                  className="mt-3 w-full resize-none rounded-xl border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-4 py-3 text-sm leading-6 outline-none placeholder:text-[#727783] focus:border-[var(--clinical-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--clinical-primary)]/20"
                />
              </section>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--clinical-on-surface-variant)]">
              This checklist item is complete — no clarification needed.
            </div>
          )}
        </main>

        {/* Right: clinical insights */}
        <aside className="col-span-1 flex min-h-0 min-w-0 flex-col overflow-y-auto border-l border-[var(--clinical-outline)] bg-[var(--clinical-surface-insights)]">
          <div className="px-5 py-4">
            <h2 className="font-[family-name:var(--font-public-sans)] text-sm font-semibold">
              Clinical Insights
            </h2>
          </div>

          <div className="px-4 pb-6">
            <article className="rounded-xl border border-[var(--clinical-outline)] border-l-4 border-l-[var(--clinical-secondary)] bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-secondary)]">
                Analysis
              </p>
              <p className="mt-2 font-[family-name:var(--font-public-sans)] text-base font-semibold">
                {clinicalInsight.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--clinical-on-surface-variant)]">
                {clinicalInsight.body}
              </p>
              {(pharmacologicalAnswer === "anesthetic" ||
                pharmacologicalAnswer === "both") && (
                <p className="mt-3 rounded-lg bg-teal-50 px-3 py-2 text-xs font-medium text-teal-800">
                  {clinicalInsight.deferralNote}
                </p>
              )}
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-[var(--clinical-surface)] px-3 py-2.5 text-xs text-[var(--clinical-on-surface-variant)]">
                <BookIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#727783]" />
                <span>
                  <span className="font-semibold">Ref: </span>
                  {clinicalInsight.reference}
                </span>
              </div>
            </article>

            <section className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-[#727783]">
                Reference guidance
              </h3>
              <ul className="flex flex-col gap-2">
                {referenceGuidance.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="group flex w-full items-center gap-3 rounded-lg border border-[#e5e7eb] bg-white px-3 py-3 text-left transition-colors hover:border-[var(--clinical-outline-variant)] hover:bg-[var(--clinical-surface)]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-violet-600">
                        <BookIcon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-[var(--clinical-on-surface)]">
                        {item.label}
                      </span>
                      <ChevronRightIcon className="h-4 w-4 shrink-0 text-[#c2c6d4] transition-colors group-hover:text-[#727783]" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DonorResponseButton({
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
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
        selected
          ? variant === "yes"
            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
            : "border-slate-400 bg-slate-100 text-slate-700"
          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface-variant)] hover:border-[#c2c6d4] hover:bg-[var(--clinical-surface)]"
      }`}
      aria-pressed={selected}
    >
      {variant === "yes" ? (
        <ThumbsUpIcon
          className={`h-4 w-4 ${selected ? "text-emerald-600" : "text-[#c2c6d4]"}`}
        />
      ) : (
        <ThumbsDownIcon
          className={`h-4 w-4 ${selected ? "text-[#727783]" : "text-[#c2c6d4]"}`}
        />
      )}
      {label}
    </button>
  );
}

function FollowUpQuestionCard({
  followUp,
  answer,
  onSelectPill,
  onCustomChange,
  disabled = false,
}: {
  followUp: FollowUpQuestion;
  answer: FollowUpAnswer;
  onSelectPill: (pillId: string) => void;
  onCustomChange: (custom: string) => void;
  disabled?: boolean;
}) {
  const isComplete = Boolean(answer.pillId || answer.custom.trim());

  return (
    <article
      className={`rounded-xl border-2 bg-white p-5 transition-colors ${
        isComplete ? "border-emerald-300" : "border-[var(--clinical-outline)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            isComplete ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
          }`}
        >
          <FollowUpIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-snug text-[var(--clinical-on-surface)]">
              {followUp.question}
            </p>
            {isComplete && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {followUp.quickOptions.map((opt) => {
              const selected = answer.pillId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectPill(opt.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                    selected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface)] hover:border-[#c2c6d4]"
                  }`}
                >
                  {selected && <CheckIcon className="h-3.5 w-3.5 shrink-0" />}
                  {opt.label}
                </button>
              );
            })}
          </div>

          <textarea
            value={answer.custom}
            disabled={disabled}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="Or type a custom response..."
            rows={2}
            className="mt-3 w-full resize-none rounded-lg border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[#727783] focus:border-[var(--clinical-primary)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
      </div>
    </article>
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

function StatusIcon({ status }: { status: "complete" | "clarification" | "pending" }) {
  if (status === "complete") {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckIcon className="h-3 w-3" />
      </span>
    );
  }
  if (status === "clarification") {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <span className="text-xs font-bold">!</span>
      </span>
    );
  }
  return (
    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-[var(--clinical-outline-variant)]" />
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

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 10v12M7 10l-4-4V4a2 2 0 012-2h3.5a2 2 0 011.7.9l1.3 2.6a4 4 0 002.2 2.2L17 10v8a2 2 0 01-2 2h-6.5a2 2 0 01-1.7-.9L7 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbsDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 14V2M17 14l4-4V4a2 2 0 00-2-2h-3.5a2 2 0 00-1.7.9l-1.3 2.6a4 4 0 00-2.2 2.2L7 14v8a2 2 0 002 2h6.5a2 2 0 001.7-.9L17 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FollowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
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
