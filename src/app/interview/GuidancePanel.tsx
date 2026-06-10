"use client";

import { useState } from "react";
import type { AggregatedInterviewGuidance } from "./interview-guidance";
import { calculatePlasmaVolume, type DonorSex, type ReferenceGuidanceItem } from "./data";

export function NextStepBanner({
  prompt,
  doneCount,
  totalCount,
}: {
  prompt: string;
  doneCount: number;
  totalCount: number;
}) {
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <section className="shrink-0 border-b border-[var(--clinical-outline)] bg-[#F5F6F8] px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
        Next step
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-[var(--clinical-on-surface)]">
        {prompt}
      </p>
      {totalCount > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-[var(--clinical-on-surface-variant)]">
              {doneCount} of {totalCount} complete
            </span>
            <span className="text-xs font-semibold text-[var(--clinical-on-surface)]">
              {pct}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--clinical-outline)]">
            <div
              className="h-full rounded-full bg-[var(--clinical-primary)] transition-all duration-300"
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
  donorWeightKg,
  donorSex,
}: {
  guidance: AggregatedInterviewGuidance;
  referenceLinks?: ReferenceGuidanceItem[];
  donorWeightKg?: number;
  donorSex?: DonorSex | "";
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

  const plasmaVolume =
    overallStatus === "restricted" && donorWeightKg && donorWeightKg > 0
      ? calculatePlasmaVolume(donorWeightKg, donorSex ?? "")
      : null;

  return (
    <>
      {showSayToDonor ? (
        <article className="rounded-xl border border-[var(--clinical-primary-dark)] bg-[var(--clinical-primary-dark)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Suggested response
          </p>
          <p className="mt-3 font-[family-name:var(--font-public-sans)] text-lg font-semibold leading-snug text-white">
            &ldquo;{sayToDonor}&rdquo;
          </p>
          <StatusBadge status={overallStatus} pendingCount={pendingCount} />
        </article>
      ) : null}

      {plasmaVolume && (
        <PlasmaVolumeCard volume={plasmaVolume} />
      )}

      {resolvedContributions.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">Reasoning</h3>
          <ul className="flex flex-col gap-3">
            {resolvedContributions.map((item) => (
              <li key={item.questionId}>
                <ContributionCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      )}

    </>
  );
}

function PlasmaVolumeCard({ volume }: { volume: ReturnType<typeof calculatePlasmaVolume> }) {
  const { volumeMl, pct, maxMl, collectMl } = volume;
  const isCapped = volumeMl > maxMl;

  return (
    <article className="mt-4 overflow-hidden rounded-xl border border-[var(--clinical-outline)] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--clinical-outline)] px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
          Volume to Collect
        </p>
        <CopyChip code={`${collectMl} mL`} />
      </div>
      <div className="px-4 py-3">
        <p className="text-sm text-[var(--clinical-on-surface-variant)]">
          {isCapped ? (
            <>
              Calc. {volumeMl} mL at {pct}%{" "}
              <span className="font-semibold text-[var(--clinical-warning)]">
                — capped at {maxMl} mL max
              </span>
            </>
          ) : (
            <>{pct}% of TBV &middot; max {maxMl} mL</>
          )}
        </p>
      </div>
    </article>
  );
}

function CopyChip({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const display = label ? (
    <span>{label}: <span className="font-bold">{code}</span></span>
  ) : (
    <span className="font-bold">{code}</span>
  );

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : `Copy ${code} to clipboard`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums transition-all duration-150 ${
        copied
          ? "border-[#c9e1bd] bg-[#f3faef] text-[var(--clinical-success)]"
          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface)] hover:border-[var(--clinical-primary)] hover:bg-[var(--clinical-primary-container)] hover:text-[var(--clinical-primary)]"
      }`}
    >
      {copied ? (
        <>
          <CheckIcon className="h-3.5 w-3.5 shrink-0" />
          {display}
          <span>Copied</span>
        </>
      ) : (
        <>
          {display}
          <ClipboardIcon className="h-3.5 w-3.5 shrink-0 opacity-60" />
        </>
      )}
    </button>
  );
}

function ContributionCard({ item }: { item: AggregatedInterviewGuidance["contributions"][number] }) {
  const actionPalette: Record<string, { wrap: string; label: string; text: string }> = {
    restricted: {
      wrap: "bg-[var(--clinical-warning-subtle)] border-[var(--clinical-warning-subtle-border)]",
      label: "text-[var(--clinical-warning)]",
      text: "text-[var(--clinical-on-surface)]",
    },
    defer: {
      wrap: "bg-[var(--clinical-primary-container)] border-[var(--clinical-primary-subtle-border)]",
      label: "text-[var(--clinical-primary)]",
      text: "text-[var(--clinical-on-surface)]",
    },
    review: {
      wrap: "bg-amber-50 border-amber-200",
      label: "text-amber-700",
      text: "text-[var(--clinical-on-surface)]",
    },
    clear: {
      wrap: "bg-[var(--clinical-surface-insights)]",
      label: "text-[var(--clinical-on-surface-variant)]",
      text: "text-[var(--clinical-on-surface)]",
    },
    pending: {
      wrap: "bg-[var(--clinical-surface-insights)] border-[var(--clinical-outline)]",
      label: "text-[var(--clinical-on-surface-variant)]",
      text: "text-[var(--clinical-on-surface-variant)]",
    },
  };

  const severity = item.severity in actionPalette ? item.severity : "clear";
  const palette = actionPalette[severity];
  const showAction = item.action && item.status !== "incomplete";

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--clinical-outline)] bg-white shadow-sm">
      {/* Header row */}
      <div className="flex items-center gap-2 border-b border-[var(--clinical-outline)] px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-primary)]">
          {item.questionCode}
        </span>
        {item.deferralCode && (
          <span className="ml-auto">
            <CopyChip code={item.deferralCode} label="Deferral" />
          </span>
        )}
      </div>

      {/* Action block — leads the card */}
      {showAction && (
        <div className={`border-b border-[var(--clinical-outline)] px-4 py-3 ${palette.wrap}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${palette.label}`}>
            Action
          </p>
          <p className={`mt-1 text-sm font-medium leading-snug ${palette.text}`}>
            {item.action}
          </p>
        </div>
      )}

      {/* Reasoning */}
      <div className="px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clinical-on-surface-variant)]">
          Why
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--clinical-on-surface-variant)]">
          {item.reasoning}
        </p>
      </div>

      {/* Reference link */}
      {item.reference && (
        <div className="border-t border-[var(--clinical-outline)] px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--clinical-secondary)] cursor-pointer hover:underline">
            <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
            {item.reference}
          </span>
        </div>
      )}
    </article>
  );
}

function SeverityPill({ severity }: { severity: string }) {
  const map: Record<string, { label: string; className: string }> = {
    restricted: { label: "Restricted", className: "bg-[var(--clinical-warning-subtle)] text-[var(--clinical-warning)] border-[var(--clinical-warning-subtle-border)]" },
    defer: { label: "Defer", className: "bg-[var(--clinical-primary-container)] text-[var(--clinical-primary)] border-[var(--clinical-primary-subtle-border)]" },
    review: { label: "Review needed", className: "bg-amber-50 text-amber-700 border-amber-200" },
    clear: { label: "Clear", className: "bg-[#f3faef] text-[var(--clinical-success)] border-[#c9e1bd]" },
    pending: { label: "Pending", className: "bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface-variant)] border-[var(--clinical-outline)]" },
  };
  const entry = map[severity] ?? map.pending;
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${entry.className}`}>
      {entry.label}
    </span>
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
    eligible: "border-white bg-white text-[var(--clinical-on-surface)]",
    restricted: "border-white bg-white text-[var(--clinical-on-surface)]",
    deferred: "border-white bg-white text-[var(--clinical-on-surface)]",
    pending: "border-white bg-white text-[var(--clinical-on-surface)]",
    review: "border-white bg-white text-[var(--clinical-on-surface)]",
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
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M9 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
