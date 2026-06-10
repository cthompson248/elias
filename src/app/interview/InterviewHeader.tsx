"use client";

import Link from "next/link";
import { useState } from "react";
import { donor } from "./data";
import { loadInterviewRole, type InterviewRole } from "./interview-role";

export type InterviewNavId = "interview" | "history" | "eligibility" | "profile";

const TAB_NAV: { id: Exclude<InterviewNavId, "profile">; label: string }[] = [
  { id: "interview", label: "Interview" },
  { id: "history", label: "History" },
  { id: "eligibility", label: "Eligibility" },
];

export function InterviewHeader({
  activeNav,
  onTabChange,
}: {
  activeNav: InterviewNavId;
  onTabChange?: (tab: Exclude<InterviewNavId, "profile">) => void;
}) {
  const [interviewRole] = useState<InterviewRole>(() => loadInterviewRole());
  const initials = donor.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-[var(--clinical-outline)] bg-white px-6 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--clinical-surface-insights)] text-sm font-semibold text-[var(--clinical-on-surface-variant)]">
          {initials}
        </div>
        <div className="min-w-0 leading-tight">
          <p className="font-[family-name:var(--font-public-sans)] text-base font-semibold">
            {donor.name} ({donor.profile.age})
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
        {activeNav === "profile" ? (
          <span className={navItemClassName(true)}>
            Profile
            <NavUnderline />
          </span>
        ) : (
          <Link href="/interview" className={navItemClassName(false)}>
            Profile
          </Link>
        )}

        {TAB_NAV.map((tab) => {
          const active = activeNav === tab.id;
          const className = navItemClassName(active);

          if (onTabChange) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={className}
              >
                {tab.label}
                {active && <NavUnderline />}
              </button>
            );
          }

          if (tab.id === "interview") {
            return (
              <Link key={tab.id} href="/interview/review" className={className}>
                {tab.label}
                {active && <NavUnderline />}
              </Link>
            );
          }

          return (
            <span key={tab.id} className={className}>
              {tab.label}
              {active && <NavUnderline />}
            </span>
          );
        })}
      </nav>

      <div className="flex items-center justify-end gap-3">
        <IconButton label="Notifications">
          <BellIcon className="h-5 w-5" />
        </IconButton>
        <IconButton label="Settings">
          <GearIcon className="h-5 w-5" />
        </IconButton>
      </div>
    </header>
  );
}

function navItemClassName(active: boolean) {
  return `relative pb-0.5 text-sm font-medium transition-colors ${
    active
      ? "text-[var(--clinical-primary)]"
      : "text-[var(--clinical-on-surface-variant)] hover:text-[var(--clinical-on-surface)]"
  }`;
}

function NavUnderline() {
  return (
    <span className="absolute -bottom-3 left-0 right-0 h-0.5 rounded-full bg-[var(--clinical-primary)]" />
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

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        strokeLinecap="round"
      />
    </svg>
  );
}
