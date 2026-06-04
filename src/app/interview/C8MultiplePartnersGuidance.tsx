"use client";

import {
  c8AnalSexDeclinedGuidance,
  c8AnalSexNoGuidance,
  c8AnalSexYesGuidance,
  type C8AnalSexResponse,
} from "./c8-multiple-partners-guidance";

export function C8MultiplePartnersGuidance({
  analSexResponse,
}: {
  analSexResponse: C8AnalSexResponse | null;
}) {
  if (!analSexResponse) return null;

  if (analSexResponse === "no") {
    return (
      <div className="mt-6 space-y-4">
        <GuidanceExplanation text={c8AnalSexNoGuidance.explanation} />
        <p className="text-xs text-[var(--clinical-on-surface-variant)]">
          <span className="font-semibold">Ref: </span>
          {c8AnalSexNoGuidance.relatesTo} · GSBD — Sexual activity deferrals
        </p>
      </div>
    );
  }

  if (analSexResponse === "declined") {
    return (
      <div className="mt-6">
        <section className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
            Explanation
          </p>
          <p className="mt-2 font-medium leading-6">
            {c8AnalSexDeclinedGuidance.explanation}
          </p>
        </section>
      </div>
    );
  }

  const entry = c8AnalSexYesGuidance;

  return (
    <div className="mt-6 space-y-4">
      <GuidanceExplanation text={entry.explanation} />

      <section className="rounded-xl border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] p-4">
        <p className="text-sm font-semibold text-[var(--clinical-on-surface)]">
          Action
        </p>
        <p className="mt-1 text-xs text-[var(--clinical-on-surface-variant)]">
          Allogeneic / therapeutic
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--clinical-on-surface-variant)]">
          <li>
            <span className="font-medium text-[var(--clinical-on-surface)]">
              Primary pathway:{" "}
            </span>
            {entry.actions.allogeneic}
          </li>
          <li>{entry.actions.existingDeferral}</li>
          <li>
            <span className="font-medium text-[var(--clinical-on-surface)]">
              MO may shorten deferral:{" "}
            </span>
            {entry.actions.moShorten}
          </li>
          <li>{entry.actions.recall}</li>
          <li>
            <span className="font-medium text-[var(--clinical-on-surface)]">
              Autologous:{" "}
            </span>
            {entry.actions.autologous}
          </li>
        </ul>
        <p className="mt-4 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-900">
          Deferral code {entry.deferralCode}
        </p>
      </section>
    </div>
  );
}

function GuidanceExplanation({ text }: { text: string }) {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
        Explanation
      </p>
      <p className="mt-2 font-medium leading-6">{text}</p>
    </section>
  );
}

export function buildC8ClinicalInsight(
  analSexResponse: C8AnalSexResponse | null
) {
  if (!analSexResponse) {
    return {
      title: "Flagged: C8 Multiple partners",
      body: "Confirm C8a (anal sex in the last 3 months) to load GSBD guidance for this scenario.",
      reference: "GSBD — Sexual activity deferrals · WI-00037 WK",
    };
  }

  if (analSexResponse === "yes") {
    return {
      title: `C8 · ${c8AnalSexYesGuidance.label}`,
      body: c8AnalSexYesGuidance.explanation,
      reference: `GSBD · ${c8AnalSexYesGuidance.deferralCode}`,
      deferralNote: c8AnalSexYesGuidance.actions.allogeneic,
    };
  }

  if (analSexResponse === "no") {
    return {
      title: `C8 · ${c8AnalSexNoGuidance.label}`,
      body: c8AnalSexNoGuidance.explanation,
      reference: "GSBD — Sexual activity deferrals · WI-00037 WK",
    };
  }

  return {
    title: "C8 · C8a declined",
    body: c8AnalSexDeclinedGuidance.explanation,
    reference: "GSBD — Sexual activity deferrals",
  };
}

export function parseC8AnalSexResponse(
  pillId: string | null | undefined
): C8AnalSexResponse | null {
  if (pillId === "yes" || pillId === "no" || pillId === "declined") {
    return pillId;
  }
  return null;
}
