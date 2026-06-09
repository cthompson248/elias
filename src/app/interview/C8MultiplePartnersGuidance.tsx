"use client";

import {
  GuidanceActionPanel,
  QuestionPanelCard,
} from "./interview-panel-cards";
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
      <QuestionPanelCard title="No anal sex in the last 3 months">
        <p className="text-sm leading-6 text-[var(--clinical-on-surface-variant)]">
          {c8AnalSexNoGuidance.explanation}
        </p>
      </QuestionPanelCard>
    );
  }

  if (analSexResponse === "declined") {
    return (
      <QuestionPanelCard title="Donor declined to answer C8a">
        <p className="text-sm leading-6 text-[var(--clinical-on-surface-variant)]">
          {c8AnalSexDeclinedGuidance.explanation}
        </p>
      </QuestionPanelCard>
    );
  }

  const entry = c8AnalSexYesGuidance;

  return (
    <GuidanceActionPanel
      title={`Apply deferral ${entry.deferralCode}`}
      summary="Plasma only (fractionation) · 6 months from date of attendance"
      detail={entry.actions.allogeneic}
    />
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
