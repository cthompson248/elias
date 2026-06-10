"use client";

import type { KeyboardEvent, ReactNode } from "react";

const questionCardClassName =
  "rounded-xl border border-[var(--clinical-outline)] bg-white p-5 shadow-sm";

export function QuestionPanelCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <article className={questionCardClassName}>
      <p className="text-sm font-semibold leading-snug text-[var(--clinical-on-surface)]">
        {title}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-[var(--clinical-on-surface-variant)]">
          {hint}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </article>
  );
}

export function InterviewNotesCard({
  value,
  onChange,
  readOnly,
  placeholder = "Add interview notes",
  className = "",
  onKeyDown,
}: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-3 py-2 ${className}`}
    >
      <NotesIcon className="h-4 w-4 shrink-0 text-[var(--clinical-on-surface-variant)]" />
      <input
        type="text"
        value={value}
        disabled={readOnly}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--clinical-on-surface-variant)]"
      />
    </div>
  );
}

export function BinaryChoiceButtons({
  yesSelected,
  noSelected,
  onSelectYes,
  onSelectNo,
  readOnly,
}: {
  yesSelected: boolean;
  noSelected: boolean;
  onSelectYes: () => void;
  onSelectNo: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        aria-pressed={yesSelected}
        disabled={readOnly}
        onClick={onSelectYes}
        className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors ${
          yesSelected
            ? "clinical-toggle-yes-selected"
            : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface-variant)] hover:border-[var(--clinical-outline-variant)]"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        aria-pressed={noSelected}
        disabled={readOnly}
        onClick={onSelectNo}
        className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors ${
          noSelected
            ? "border-[var(--clinical-outline-variant)] bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface)]"
            : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface-variant)] hover:border-[var(--clinical-outline-variant)]"
        }`}
      >
        No
      </button>
    </div>
  );
}

export function FollowUpOptionPill({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        selected
          ? "clinical-toggle-yes-selected"
          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface)] hover:border-[var(--clinical-outline-variant)]"
      }`}
    >
      {selected && <CheckIcon className="h-3.5 w-3.5 shrink-0" />}
      {label}
    </button>
  );
}

export type FollowUpCompleteVariant =
  | "cleared"
  | "complete"
  | "restricted"
  | "review"
  | "defer";

export function FollowUpCompleteCard({
  variant = "complete",
  note,
}: {
  variant?: FollowUpCompleteVariant;
  note?: string;
}) {
  const config = {
    cleared: {
      title: "No follow-up needed",
      body: "A No answer clears this item — see Guidance for your overall eligibility.",
      articleClass: "border-[#a8e0cc] bg-[#D6F4EA]",
      iconClass: "bg-[#0D7A5E]",
      titleClass: "text-[#0D7A5E]",
      bodyClass: "text-[var(--clinical-on-surface-variant)]",
      noteBoxClass: "border-[#a8e0cc] bg-white/60",
      noteTextClass: "text-[var(--clinical-on-surface)]",
      icon: "check" as const,
    },
    complete: {
      title: "No further questions for this item",
      body: "See the Guidance panel for what to tell the donor.",
      articleClass: "border-[#a8e0cc] bg-[#D6F4EA]",
      iconClass: "bg-[#0D7A5E]",
      titleClass: "text-[#0D7A5E]",
      bodyClass: "text-[var(--clinical-on-surface-variant)]",
      noteBoxClass: "border-[#a8e0cc] bg-white/60",
      noteTextClass: "text-[var(--clinical-on-surface)]",
      icon: "check" as const,
    },
    restricted: {
      title: "Restricted donation",
      body: "See the Guidance panel for what to tell the donor.",
      articleClass:
        "border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)]/90",
      iconClass: "bg-[var(--clinical-warning)]",
      titleClass: "text-[var(--clinical-warning)]",
      bodyClass: "text-[var(--clinical-on-surface-variant)]",
      noteBoxClass:
        "border-[var(--clinical-warning-subtle-border)] bg-white/70",
      noteTextClass: "text-[var(--clinical-warning)]",
      icon: "alert" as const,
    },
    review: {
      title: "Nurse review needed",
      body: "See the Guidance panel for what to tell the donor.",
      articleClass:
        "border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)]/90",
      iconClass: "bg-[var(--clinical-warning)]",
      titleClass: "text-[var(--clinical-warning)]",
      bodyClass: "text-[var(--clinical-on-surface-variant)]",
      noteBoxClass:
        "border-[var(--clinical-warning-subtle-border)] bg-white/70",
      noteTextClass: "text-[var(--clinical-warning)]",
      icon: "alert" as const,
    },
    defer: {
      title: "Not donating today",
      body: "See the Guidance panel for what to tell the donor.",
      articleClass:
        "border-[var(--clinical-primary-subtle-border)] bg-[var(--clinical-primary-container)]/90",
      iconClass: "bg-[var(--clinical-primary)]",
      titleClass: "text-[var(--clinical-primary-dark)]",
      bodyClass: "text-[var(--clinical-on-surface-variant)]",
      noteBoxClass:
        "border-[var(--clinical-primary-subtle-border)] bg-white/70",
      noteTextClass: "text-[var(--clinical-primary-dark)]",
      icon: "alert" as const,
    },
  }[variant];

  return (
    <article
      className={`mt-6 rounded-xl border p-5 ${config.articleClass}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${config.iconClass}`}
        >
          {config.icon === "check" ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <AlertIcon className="h-5 w-5" />
          )}
        </span>
        <p className={`text-sm font-semibold ${config.titleClass}`}>
          {config.title}
        </p>
      </div>
      {note && (
        <div
          className={`mt-4 rounded-lg border px-3 py-2.5 ${config.noteBoxClass}`}
        >
          <p
            className={`text-xs font-medium leading-relaxed ${config.noteTextClass}`}
          >
            {note}
          </p>
        </div>
      )}
    </article>
  );
}

export function GuidanceActionPanel({
  title,
  summary,
  detail,
  footer = "Review clinical guidance in the right panel before submitting.",
}: {
  title: string;
  summary: string;
  detail: string;
  footer?: string;
}) {
  return (
    <article className="flex gap-4 rounded-xl border border-[var(--clinical-success-subtle-border)] bg-[var(--clinical-success-subtle)] p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--clinical-success)] text-white">
        <CheckIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-base font-semibold text-[var(--clinical-success)]">
          {title}
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--clinical-on-surface)]">
          {summary}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--clinical-on-surface-variant)]">
          {detail}
        </p>
        <p className="mt-3 text-sm text-[var(--clinical-on-surface-variant)]">
          {footer}
        </p>
      </div>
    </article>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        d="M12 9v4M12 17h.01"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NotesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
    </svg>
  );
}
