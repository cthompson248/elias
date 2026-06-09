"use client";

import type { AggregatedInterviewGuidance } from "./interview-guidance";
import type { ReferenceGuidanceItem } from "./data";

export function NextStepBanner({
  nursePrompt,
  pendingQuestionCodes,
  totalCount,
}: {
  nursePrompt: string;
  pendingQuestionCodes: string[];
  totalCount: number;
}) {
  const pendingCount = pendingQuestionCodes.length;
  const doneCount = Math.max(0, totalCount - pendingCount);
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <section className="shrink-0 border-b border-[var(--clinical-primary-subtle-border)] bg-[var(--clinical-primary-container)] px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-primary-dark)]">
        Next step
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-[var(--clinical-on-surface)]">
        {nursePrompt}
      </p>
      {totalCount > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-[var(--clinical-on-surface-variant)]">
              {doneCount} of {totalCount} complete
            </span>
            <span className="text-xs font-semibold text-[var(--clinical-primary-dark)]">
              {pct}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--clinical-primary-subtle-border)]">
            <div
              className="h-full rounded-full bg-[var(--clinical-primary-dark)] transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
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
}: {
  guidance: AggregatedInterviewGuidance;
  referenceLinks?: ReferenceGuidanceItem[];
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
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">Reasoning</h3>
          <ul className="flex flex-col gap-3">
            {resolvedContributions.map((item) => (
              <li key={item.questionId}>
                <article className="rounded-xl border border-[var(--clinical-outline)] bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-primary)]">
                    {item.questionCode}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--clinical-on-surface)]">
                    {item.reasoning}
                  </p>
                  {item.deferralNote && item.status === "complete" && (
                    <p className="mt-3 rounded-lg border border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)] px-3 py-2 text-xs font-medium leading-snug text-[var(--clinical-warning)]">
                      {item.deferralNote}
                    </p>
                  )}
                  {item.reference && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[var(--clinical-secondary)] px-2.5 py-1 text-xs font-medium text-[var(--clinical-secondary)] transition-colors hover:bg-[var(--clinical-secondary)] hover:text-white cursor-pointer">
                      <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
                      {item.reference}
                    </span>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}

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

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
