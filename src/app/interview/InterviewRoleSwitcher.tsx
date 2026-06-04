"use client";

import { useState } from "react";
import {
  loadInterviewRole,
  saveInterviewRole,
  type InterviewRole,
} from "./interview-role";

/** Prototype until login supplies role. */
export function InterviewRoleSwitcher() {
  const [role, setRole] = useState<InterviewRole>(() => loadInterviewRole());

  function select(next: InterviewRole) {
    setRole(next);
    saveInterviewRole(next);
  }

  return (
    <div
      className="flex rounded-lg border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Interview role (prototype)"
    >
      {(["dsna", "nurse"] as const).map((value) => {
        const active = role === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => select(value)}
            className={`rounded-md px-3 py-1.5 uppercase tracking-wide transition-colors ${
              active
                ? "bg-white text-[var(--clinical-on-surface)] shadow-sm"
                : "text-[var(--clinical-on-surface-variant)] hover:text-[var(--clinical-on-surface)]"
            }`}
          >
            {value === "dsna" ? "DSNA" : "Nurse"}
          </button>
        );
      })}
    </div>
  );
}
