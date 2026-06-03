"use client";

import { useState } from "react";
import {
  activeClarification,
  checklistSections,
  clinicalInsight,
  donor,
  interviewHistory,
  linkedProtocols,
  totalQuestions,
  type ClarificationAnswer,
  type Outcome,
} from "./data";

export default function InterviewPage() {
  const [activeTab, setActiveTab] = useState<"interview" | "history" | "eligibility">(
    "interview"
  );
  const [activeItemId, setActiveItemId] = useState("dental");
  const [selectedAnswer, setSelectedAnswer] = useState<ClarificationAnswer>(null);
  const [notes, setNotes] = useState("");
  const [_outcome, setOutcome] = useState<Outcome | null>(null);

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
            <>
              <div className="shrink-0 border-b border-[var(--clinical-outline)] bg-white px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--clinical-primary-container)] text-[var(--clinical-primary)]">
                    <DocumentIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="font-[family-name:var(--font-public-sans)] text-xl font-semibold">
                      Clarification Required
                    </h1>
                    <p className="text-sm text-[var(--clinical-on-surface-variant)]">
                      Following up on: {activeClarification.topic}
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
                <article className="rounded-2xl border border-[var(--clinical-outline)] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                  <p className="text-base font-semibold text-[var(--clinical-on-surface)]">
                    {activeClarification.question}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--clinical-on-surface-variant)]">
                    {activeClarification.guidance}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {activeClarification.answerOptions.map((opt) => {
                      const selected = selectedAnswer === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedAnswer(opt.id)}
                          className={`min-w-[180px] flex-1 rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                            selected
                              ? "border-[var(--clinical-primary)] bg-[#eef4fc] text-[var(--clinical-primary-dark)]"
                              : "border-[var(--clinical-primary)] bg-white text-[var(--clinical-primary)] hover:bg-[#eef4fc]/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8">
                    <label
                      htmlFor="staff-notes"
                      className="text-xs font-semibold uppercase tracking-wider text-[#727783]"
                    >
                      Clinical Staff Notes
                    </label>
                    <textarea
                      id="staff-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter detailed procedure notes here..."
                      rows={4}
                      className="mt-2 w-full resize-none rounded-lg border border-[var(--clinical-outline-variant)] bg-[var(--clinical-surface)] px-4 py-3 text-sm outline-none transition-[border-color] placeholder:text-[#727783] focus:border-[var(--clinical-primary)] focus:border-2 focus:bg-white"
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[var(--clinical-outline)] pt-6">
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-4 py-2.5 text-sm font-medium text-[var(--clinical-on-surface-variant)] hover:bg-[#edeeef]"
                    >
                      Consult Nurse
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutcome("deferred")}
                      className="rounded-lg bg-[var(--clinical-error)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Major (Defer)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutcome("eligible")}
                      className="rounded-lg bg-[var(--clinical-primary-dark)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--clinical-primary)]"
                    >
                      Minor (Proceed)
                    </button>
                  </div>
                </article>

                <section className="mt-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#727783]">
                    Interview History
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {interviewHistory.map((entry) => (
                      <li
                        key={entry.event}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--clinical-primary)]" />
                        <div>
                          <p className="font-medium">{entry.event}</p>
                          <p className="text-xs text-[var(--clinical-on-surface-variant)]">
                            {entry.time}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
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
              {selectedAnswer === "anesthetic" && (
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
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#727783]">
                  Linked Protocols
                </h3>
                <ExternalLinkIcon className="h-4 w-4 text-[#727783]" />
              </div>
              <ul className="space-y-2">
                {linkedProtocols.map((protocol) => (
                  <li key={protocol}>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-[var(--clinical-outline)] bg-white px-4 py-3 text-left text-sm font-medium text-[var(--clinical-on-surface)] transition-colors hover:border-[var(--clinical-primary)] hover:bg-[#eef4fc]/30"
                    >
                      {protocol}
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

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
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

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
