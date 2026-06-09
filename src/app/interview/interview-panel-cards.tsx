"use client";

import type { ReactNode } from "react";

const questionCardClassName =
  "rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm";

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
  placeholder = "Record any additional observations or verbal clarifications...",
}: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <article className={questionCardClassName}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--clinical-surface)] text-[#727783]">
          <NotesIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--clinical-on-surface)]">
            Notes
          </p>
          <textarea
            value={value}
            disabled={readOnly}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="mt-3 w-full resize-none rounded-lg border border-[#e5e7eb] bg-[var(--clinical-surface)] px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-[#727783] focus:border-[var(--clinical-primary)] focus:bg-white"
          />
        </div>
      </div>
    </article>
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
            ? "border-[var(--clinical-primary)] bg-[var(--clinical-primary)]/5 text-[var(--clinical-primary)]"
            : "border-[#e5e7eb] bg-white text-[var(--clinical-on-surface-variant)] hover:border-[#c2c6d4]"
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
            ? "border-slate-500 bg-slate-50 text-slate-800"
            : "border-[#e5e7eb] bg-white text-[var(--clinical-on-surface-variant)] hover:border-[#c2c6d4]"
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
          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
          : "border-[#e5e7eb] bg-white text-[var(--clinical-on-surface)] hover:border-[#c2c6d4]"
      }`}
    >
      {selected && <CheckIcon className="h-3.5 w-3.5 shrink-0" />}
      {label}
    </button>
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
    <article className="flex gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <CheckIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-base font-semibold text-emerald-950">{title}</p>
        <p className="mt-1 text-sm font-medium text-emerald-900">{summary}</p>
        <p className="mt-2 text-sm leading-6 text-emerald-900">{detail}</p>
        <p className="mt-3 text-sm text-emerald-800">{footer}</p>
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
