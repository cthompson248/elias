"use client";

import { useMemo, useState } from "react";
import {
  answers as allAnswers,
  donor,
  evaluateFactors,
  factorLibrary,
  outcomeMeta,
  sections,
  type Outcome,
  type RiskLevel,
} from "./data";

const riskMeta: Record<
  RiskLevel,
  { label: string; dot: string; chip: string; ring: string }
> = {
  low: {
    label: "Low risk",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-100",
  },
  attention: {
    label: "Needs attention",
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700",
    ring: "ring-amber-200",
  },
  high: {
    label: "Flagged",
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700",
    ring: "ring-rose-200",
  },
};

export default function InterviewPage() {
  const [activeSection, setActiveSection] = useState<string>(sections[0]);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const flaggedCount = useMemo(
    () => allAnswers.filter((a) => a.risk !== "low").length,
    []
  );
  const reviewedCount = Object.values(reviewed).filter(Boolean).length;
  const progress = Math.round((reviewedCount / allAnswers.length) * 100);

  const guidance = useMemo(
    () => evaluateFactors(selectedFactors),
    [selectedFactors]
  );

  const visibleAnswers = useMemo(() => {
    return allAnswers.filter((a) => {
      if (showFlaggedOnly && a.risk === "low") return false;
      return a.section === activeSection;
    });
  }, [activeSection, showFlaggedOnly]);

  const sectionStats = useMemo(() => {
    return sections.map((s) => {
      const items = allAnswers.filter((a) => a.section === s);
      const flagged = items.filter((a) => a.risk !== "low").length;
      const done = items.filter((a) => reviewed[a.id]).length;
      const worst: RiskLevel = items.some((a) => a.risk === "high")
        ? "high"
        : items.some((a) => a.risk === "attention")
          ? "attention"
          : "low";
      return { section: s, total: items.length, flagged, done, worst };
    });
  }, [reviewed]);

  function toggleFactor(id: string) {
    setSelectedFactors((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      {/* ===================== TOP BAR ===================== */}
      <header className="flex shrink-0 items-center gap-6 border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-sm font-bold text-white">
            ＋
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Donor Eligibility Review</p>
            <p className="text-xs text-slate-500">Triage interview · Room 3</p>
          </div>
        </div>

        <div className="mx-2 h-9 w-px bg-slate-200" />

        {/* Donor summary */}
        <div className="flex items-center gap-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
            {donor.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{donor.name}</p>
            <p className="text-xs text-slate-500">
              {donor.donorId} · {donor.age}/{donor.sex[0]} · {donor.bloodType}
            </p>
          </div>
          <Stat label="Donation" value={donor.donationType} />
          <Stat label="Last donation" value={donor.lastDonation} />
          <Stat label="Lifetime" value={`${donor.totalDonations} donations`} />
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="text-right leading-tight">
            <p className="text-xs text-slate-500">Review progress</p>
            <p className="text-sm font-semibold">
              {reviewedCount}/{allAnswers.length} answers · {progress}%
            </p>
          </div>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-rose-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <StatusPill outcome={outcome} />
        </div>
      </header>

      {/* ===================== THREE REGIONS ===================== */}
      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)_360px]">
        {/* -------- LEFT: checklist / section navigator -------- */}
        <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-slate-200 bg-white">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Interview checklist
            </p>
          </div>
          <nav className="flex flex-col gap-1 px-3 pb-4">
            {sectionStats.map((s) => {
              const active = s.section === activeSection;
              return (
                <button
                  key={s.section}
                  onClick={() => setActiveSection(s.section)}
                  className={`group rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-slate-300 bg-slate-50"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${riskMeta[s.worst].dot}`}
                    />
                    <span className="text-sm font-medium">{s.section}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 pl-4 text-xs text-slate-500">
                    <span>
                      {s.done}/{s.total} reviewed
                    </span>
                    {s.flagged > 0 && (
                      <span className="rounded bg-rose-50 px-1.5 py-0.5 font-medium text-rose-600">
                        {s.flagged} flagged
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-200 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Summary
            </p>
            <Legend dot="bg-emerald-500" label={`${allAnswers.length - flaggedCount} low risk`} />
            <Legend
              dot="bg-amber-500"
              label={`${allAnswers.filter((a) => a.risk === "attention").length} need attention`}
            />
            <Legend
              dot="bg-rose-500"
              label={`${allAnswers.filter((a) => a.risk === "high").length} flagged`}
            />
          </div>
        </aside>

        {/* -------- CENTER: questionnaire review -------- */}
        <main className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
            <div>
              <h2 className="text-base font-semibold">{activeSection}</h2>
              <p className="text-xs text-slate-500">
                {visibleAnswers.length} answers · review with the donor and capture
                clarifications
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showFlaggedOnly}
                onChange={(e) => setShowFlaggedOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-rose-600"
              />
              Flagged only
            </label>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-5">
            {visibleAnswers.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No answers match this filter in {activeSection}.
              </p>
            )}
            {visibleAnswers.map((a) => {
              const meta = riskMeta[a.risk];
              const isReviewed = !!reviewed[a.id];
              return (
                <article
                  key={a.id}
                  className={`rounded-xl border bg-white p-4 transition-shadow ${
                    a.risk === "low"
                      ? "border-slate-200"
                      : `border-l-4 shadow-sm ring-1 ${meta.ring} ${
                          a.risk === "high"
                            ? "border-l-rose-500"
                            : "border-l-amber-500"
                        }`
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {a.question}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        <span className="text-slate-400">Donor answered: </span>
                        <span className="font-medium text-slate-800">
                          {a.response}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${meta.chip}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {a.reference && (
                    <p className="mt-2 rounded-md bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                      <span className="font-semibold text-slate-500">Guidance · </span>
                      {a.reference}
                    </p>
                  )}

                  {a.followUps && a.followUps.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Recommended follow-up
                      </p>
                      <ul className="space-y-1.5">
                        {a.followUps.map((f) => (
                          <li
                            key={f.id}
                            className="flex items-start gap-2 text-sm text-slate-700"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                            {f.prompt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(a.risk !== "low" || notes[a.id]) && (
                    <textarea
                      value={notes[a.id] ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [a.id]: e.target.value }))
                      }
                      placeholder="Capture clarification from the donor…"
                      rows={2}
                      className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                    />
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setReviewed((prev) => ({ ...prev, [a.id]: !prev[a.id] }))
                      }
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        isReviewed
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                          isReviewed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-400 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      {isReviewed ? "Reviewed" : "Mark reviewed"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        {/* -------- RIGHT: AI decision support + escalation + outcome -------- */}
        <aside className="flex min-h-0 flex-col overflow-y-auto border-l border-slate-200 bg-white">
          {/* AI decision-support panel */}
          <section className="border-b border-slate-200 p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                AI
              </span>
              <h3 className="text-sm font-semibold">Decision support</h3>
            </div>
            <p className="mb-3 text-xs text-slate-500">
              Select the donor factors that apply. The assistant returns
              rule-based guidance with sources — you keep the final call.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {factorLibrary.map((f) => {
                const on = selectedFactors.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFactor(f.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      on
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {guidance ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div
                  className={`mb-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${outcomeMeta[guidance.outcome].tone} ${outcomeMeta[guidance.outcome].text} ${outcomeMeta[guidance.outcome].border}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${outcomeMeta[guidance.outcome].dot}`}
                  />
                  {outcomeMeta[guidance.outcome].label}
                </div>
                <p className="text-sm font-medium text-slate-800">
                  {guidance.headline}
                </p>

                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Why
                </p>
                <ul className="mt-1 space-y-2">
                  {guidance.rationale.map((r) => (
                    <li
                      key={r.factor}
                      className="rounded-lg border border-slate-200 bg-white p-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${outcomeMeta[r.severity].dot}`}
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          {r.factor}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{r.detail}</p>
                      <p className="mt-1 text-[11px] font-medium text-indigo-600">
                        ↳ {r.reference}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-2.5 py-2">
                  <span className="text-xs text-slate-500">
                    Confidence:{" "}
                    <span className="font-semibold capitalize text-slate-700">
                      {guidance.confidence}
                    </span>
                  </span>
                  <button
                    onClick={() => setOutcome(guidance.outcome)}
                    className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700"
                  >
                    Apply to outcome
                  </button>
                </div>

                <p className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-400">
                  <span>ⓘ</span>
                  Guidance is advisory and rule-based. Confirm with the donor and
                  use clinical judgment before deciding.
                </p>
              </div>
            ) : (
              <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
                Select one or more factors to see structured guidance.
              </p>
            )}
          </section>

          {/* Escalation guidance */}
          <section className="border-b border-slate-200 p-4">
            <h3 className="mb-2 text-sm font-semibold">Escalation guidance</h3>
            <div className="space-y-2 text-xs">
              <EscalationRow
                tone="bg-amber-50 text-amber-700"
                title="Nurse review"
                desc="Borderline Hb, prior fainting, travel risk needing confirmation."
              />
              <EscalationRow
                tone="bg-orange-50 text-orange-700"
                title="Doctor / specialist"
                desc="Anticoagulants, window-period exposure, unclear medical history."
              />
              <EscalationRow
                tone="bg-rose-50 text-rose-700"
                title="Defer"
                desc="Active infection, antibiotics, recent tattoo within window."
              />
            </div>
          </section>

          {/* Final recommendation */}
          <section className="mt-auto p-4">
            <h3 className="mb-2 text-sm font-semibold">Final outcome</h3>
            <div className="grid grid-cols-1 gap-2">
              {(
                [
                  "eligible",
                  "nurse_review",
                  "doctor_review",
                  "deferred",
                ] as Outcome[]
              ).map((o) => {
                const m = outcomeMeta[o];
                const active = outcome === o;
                return (
                  <button
                    key={o}
                    onClick={() => setOutcome(o)}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      active
                        ? `${m.tone} ${m.text} ${m.border} ring-1 ${m.border}`
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${m.dot}`} />
                    {m.label}
                  </button>
                );
              })}
            </div>
            <button
              disabled={!outcome}
              className="mt-3 w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Confirm &amp; sign off
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="leading-tight">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5 text-xs text-slate-600">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </div>
  );
}

function EscalationRow({
  tone,
  title,
  desc,
}: {
  tone: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-2.5 rounded-lg border border-slate-200 p-2.5">
      <span className={`mt-0.5 h-fit rounded px-1.5 py-0.5 font-semibold ${tone}`}>
        {title}
      </span>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}

function StatusPill({ outcome }: { outcome: Outcome | null }) {
  if (!outcome) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-500">
        <span className="h-2 w-2 rounded-full bg-slate-400" />
        In review
      </span>
    );
  }
  const m = outcomeMeta[outcome];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${m.tone} ${m.text} ${m.border}`}
    >
      <span className={`h-2 w-2 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}
