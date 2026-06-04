"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { donor } from "./data";
import {
  groupBankByCategory,
  questionBank,
  type QuestionBankEntry,
} from "./question-bank";
import {
  getTabletYesIds,
  loadInterviewSelection,
  saveInterviewSelection,
} from "./session";

const COLUMN_COUNT = 3;

export default function InterviewSelectionPage() {
  const router = useRouter();
  const tabletYesIds = useMemo(() => new Set(getTabletYesIds()), []);
  const grouped = useMemo(() => groupBankByCategory(questionBank), []);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const saved = loadInterviewSelection();
    if (saved?.length) return new Set(saved);
    return new Set(getTabletYesIds());
  });
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return grouped;
    return grouped
      .map((group) => ({
        ...group,
        questions: group.questions.filter(
          (q) =>
            q.code.toLowerCase().includes(query) ||
            q.question.toLowerCase().includes(query) ||
            q.category.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.questions.length > 0);
  }, [grouped, search]);

  const columnGroups = useMemo(
    () => balanceGroupsIntoColumns(filteredGroups, COLUMN_COUNT),
    [filteredGroups]
  );

  const visibleCount = filteredGroups.reduce(
    (n, g) => n + g.questions.length,
    0
  );

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllTabletYes() {
    setSelectedIds(new Set(getTabletYesIds()));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function selectVisible() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const group of filteredGroups) {
        for (const q of group.questions) next.add(q.id);
      }
      return next;
    });
  }

  function continueToReview() {
    if (selectedIds.size === 0) return;
    saveInterviewSelection(Array.from(selectedIds));
    router.push("/interview/review");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--clinical-surface)] text-[var(--clinical-on-surface)]">
      <header className="shrink-0 border-b border-[var(--clinical-outline)] bg-white px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#727783]">
              Pre-interview · Load review queue
            </p>
            <h1 className="font-[family-name:var(--font-public-sans)] text-lg font-semibold">
              Select questions for review
            </h1>
            <p className="text-sm text-[var(--clinical-on-surface-variant)]">
              {donor.name} · {donor.donorId}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-[var(--clinical-on-surface-variant)] lg:inline">
              <span className="font-semibold text-[var(--clinical-on-surface)]">
                {selectedIds.size}
              </span>{" "}
              selected · {visibleCount} shown
            </span>
            <Link
              href="/"
              className="text-sm font-medium text-[var(--clinical-on-surface-variant)] hover:text-[var(--clinical-on-surface)]"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <div className="shrink-0 border-b border-[var(--clinical-outline)] bg-white px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code or question…"
            className="min-w-[200px] flex-1 rounded-lg border border-[var(--clinical-outline)] px-3 py-2 text-sm outline-none focus:border-[var(--clinical-primary)] focus:ring-2 focus:ring-[var(--clinical-primary)]/20"
          />
          <ActionButton onClick={selectAllTabletYes}>
            All tablet Yes ({tabletYesIds.size})
          </ActionButton>
          <ActionButton onClick={selectVisible}>Select visible</ActionButton>
          <ActionButton onClick={clearSelection} variant="muted">
            Clear
          </ActionButton>
          <p className="w-full text-xs text-blue-800 lg:hidden">
            Prototype: mock tablet Yes responses until digital questionnaire API is connected.
          </p>
        </div>
      </div>

      {visibleCount === 0 ? (
        <p className="flex flex-1 items-center justify-center text-sm text-[#727783]">
          No questions match your search.
        </p>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-4 lg:grid-cols-3">
          {columnGroups.map((groups, colIndex) => (
            <div
              key={colIndex}
              className="flex min-h-0 flex-col gap-3 overflow-y-auto lg:overflow-hidden"
            >
              {groups.map((group) => (
                <section
                  key={group.category}
                  className="shrink-0 rounded-lg border border-[var(--clinical-outline)] bg-white lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:flex lg:flex-col"
                >
                  <h2 className="shrink-0 border-b border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#727783]">
                    {group.category}
                  </h2>
                  <ul className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                    {group.questions.map((q) => (
                      <SelectionRow
                        key={q.id}
                        question={q}
                        selected={selectedIds.has(q.id)}
                        onToggle={() => toggle(q.id)}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ))}
        </div>
      )}

      <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-[var(--clinical-outline)] bg-white px-6 py-3">
        <p className="text-sm text-[var(--clinical-on-surface-variant)]">
          {selectedIds.size === 0
            ? "Select at least one question."
            : `${selectedIds.size} loaded into Review`}
        </p>
        <button
          type="button"
          disabled={selectedIds.size === 0}
          onClick={continueToReview}
          className="rounded-lg bg-[var(--clinical-primary-dark)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--clinical-primary)] disabled:cursor-not-allowed disabled:bg-[#c2c6d4]"
        >
          Continue to interview
        </button>
      </footer>
    </div>
  );
}

/** Spread category blocks across columns so each column has similar height */
function balanceGroupsIntoColumns<
  T extends { category: string; questions: unknown[] },
>(groups: T[], columnCount: number): T[][] {
  const columns: T[][] = Array.from({ length: columnCount }, () => []);
  const heights = Array(columnCount).fill(0);

  for (const group of groups) {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(group);
    heights[shortest] += group.questions.length + 1;
  }

  return columns;
}

function SelectionRow({
  question,
  selected,
  onToggle,
}: {
  question: QuestionBankEntry;
  selected: boolean;
  onToggle: () => void;
}) {
  const isYes = question.tabletResponse === "yes";

  return (
    <li className="border-b border-[var(--clinical-outline)] last:border-b-0">
      <label
        className={`flex cursor-pointer items-center gap-2 px-2 py-1.5 transition-colors hover:bg-[var(--clinical-surface)] ${
          selected ? "bg-[#eef4fc]/60" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="h-3.5 w-3.5 shrink-0 rounded accent-[var(--clinical-primary)]"
        />
        <span className="w-[4.25rem] shrink-0 font-mono text-[11px] font-bold text-[var(--clinical-primary)]">
          {question.code}
        </span>
        <span
          className="min-w-0 flex-1 truncate text-xs text-[var(--clinical-on-surface)]"
          title={question.question}
        >
          {question.question}
        </span>
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            isYes
              ? "bg-emerald-50 text-emerald-700"
              : question.tabletResponse === "no"
                ? "bg-slate-100 text-slate-500"
                : "bg-amber-50 text-amber-700"
          }`}
        >
          {isYes ? "Y" : question.tabletResponse === "no" ? "N" : "—"}
        </span>
      </label>
    </li>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "muted";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
        variant === "muted"
          ? "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface-variant)] hover:bg-[var(--clinical-surface)]"
          : "border-[var(--clinical-primary)] bg-white text-[var(--clinical-primary-dark)] hover:bg-[#eef4fc]"
      }`}
    >
      {children}
    </button>
  );
}
