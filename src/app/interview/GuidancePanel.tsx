"use client";

import type { AggregatedInterviewGuidance } from "./interview-guidance";
import type { ReferenceGuidanceItem } from "./data";

export function NextStepBanner({
  nursePrompt,
  pendingQuestionCodes,
}: {
  nursePrompt: string;
  pendingQuestionCodes: string[];
}) {
  return (
    <section className="shrink-0 border-b border-[var(--clinical-primary-subtle-border)] bg-[var(--clinical-primary-container)] px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-primary-dark)]">
        Next step
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-[var(--clinical-on-surface)]">
        {nursePrompt}
      </p>
      {pendingQuestionCodes.length > 0 && (
        <p className="mt-2 text-xs text-[var(--clinical-on-surface-variant)]">
          Pending: {pendingQuestionCodes.join(", ")}
        </p>
      )}
    </section>
  );
}

export function EscalationBanner({
  notice,
}: {
  notice: { title: string; body: string; tone: "amber" | "rose" | "blue" };
}) {
  const palette = {
    amber: {
      wrap: "border-b border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)]",
      label: "text-[var(--clinical-warning)]",
      body: "text-[var(--clinical-on-surface)]",
    },
    rose: {
      wrap: "border-b border-[var(--clinical-primary-subtle-border)] bg-[var(--clinical-primary-container)]",
      label: "text-[var(--clinical-primary)]",
      body: "text-[var(--clinical-on-surface)]",
    },
    blue: {
      wrap: "border-b border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)]",
      label: "text-[var(--clinical-warning)]",
      body: "text-[var(--clinical-on-surface)]",
    },
  }[notice.tone];

  return (
    <section
      className={`shrink-0 px-5 py-4 ${palette.wrap}`}
      role="status"
    >
      <p
        className={`text-[11px] font-semibold uppercase tracking-wider ${palette.label}`}
      >
        {notice.title}
      </p>
      <p className={`mt-2 text-sm font-medium leading-6 ${palette.body}`}>
        {notice.body}
      </p>
    </section>
  );
}

export function GuidancePanel({
  guidance,
  referenceLinks,
}: {
  guidance: AggregatedInterviewGuidance;
  referenceLinks: ReferenceGuidanceItem[];
}) {
  const {
    sayToDonor,
    contributions,
    overallStatus,
    pendingCount,
  } = guidance;
  const resolvedContributions = contributions.filter(
    (item) => item.status !== "incomplete"
  );
  const guidanceReady = sayToDonor !== null;
  const showSayToDonor = guidanceReady && overallStatus !== "review";

  return (
    <>
      {showSayToDonor ? (
        <article className="rounded-xl border border-[var(--clinical-outline)] border-l-4 border-l-[var(--clinical-primary)] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-primary)]">
            Say to donor
          </p>
          <p className="mt-3 font-[family-name:var(--font-public-sans)] text-lg font-semibold leading-snug text-[var(--clinical-on-surface)]">
            &ldquo;{sayToDonor}&rdquo;
          </p>
          <StatusBadge status={overallStatus} pendingCount={pendingCount} />
        </article>
      ) : null}

      {resolvedContributions.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-2 text-sm font-medium text-[var(--clinical-on-surface-variant)]">Reasoning</h3>
          <ul className="flex flex-col gap-2">
            {resolvedContributions.map((item) => (
              <li key={item.questionId}>
                <article className="rounded-lg border border-[var(--clinical-outline)] bg-white px-3 py-2.5">
                  <p className="text-sm leading-snug text-[var(--clinical-on-surface-variant)]">
                    <span className="font-semibold text-[var(--clinical-on-surface)]">
                      {item.questionCode}
                    </span>
                    <span aria-hidden="true"> · </span>
                    {item.reasoning}
                  </p>
                  {item.deferralNote && item.status === "complete" && (
                    <p className="mt-1.5 text-xs font-medium leading-snug text-teal-800">
                      {item.deferralNote}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs leading-snug text-[var(--clinical-on-surface-variant)]">
                    {item.reference}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h3 className="mb-3 text-sm font-medium text-[var(--clinical-on-surface-variant)]">
          Reference guidance
        </h3>
        {referenceLinks.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {referenceLinks.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="group flex w-full items-center gap-3 rounded-lg border border-[var(--clinical-outline)] bg-white px-3 py-3 text-left transition-colors hover:border-[var(--clinical-outline-variant)] hover:bg-[var(--clinical-surface)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-violet-600">
                    <BookIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-[var(--clinical-on-surface)]">
                    {item.label}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--clinical-outline-variant)] transition-colors group-hover:text-[var(--clinical-on-surface-variant)]" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-[var(--clinical-outline)] bg-white px-3 py-3 text-sm text-[var(--clinical-on-surface-variant)]">
            GSBD guides appear here when the donor answers Yes to a question
            that links to a reference section.
          </p>
        )}
      </section>
    </>
  );
}

function StatusBadge({
  status,
  pendingCount,
}: {
  status: AggregatedInterviewGuidance["overallStatus"];
  pendingCount: number;
}) {
  const labels: Record<AggregatedInterviewGuidance["overallStatus"], string> = {
    eligible: "Eligible to continue",
    restricted: "Restricted donation",
    deferred: "Not donating today",
    pending: "Awaiting follow-ups",
    review: "Nurse review needed",
  };

  const styles: Record<AggregatedInterviewGuidance["overallStatus"], string> = {
    eligible:
      "bg-[#f3faef] text-[var(--clinical-success)] border-[#c9e1bd]",
    restricted:
      "bg-[var(--clinical-warning-subtle)] text-[var(--clinical-warning)] border-[var(--clinical-warning-subtle-border)]",
    deferred:
      "bg-[var(--clinical-primary-container)] text-[var(--clinical-primary)] border-[var(--clinical-primary-subtle-border)]",
    pending:
      "bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface-variant)] border-[var(--clinical-outline)]",
    review:
      "bg-[var(--clinical-primary-container)] text-[var(--clinical-primary-dark)] border-[var(--clinical-primary-subtle-border)]",
  };

  return (
    <p
      className={`mt-4 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </p>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
