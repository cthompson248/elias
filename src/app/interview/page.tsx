"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DonorProfilePanel } from "./DonorProfilePanel";
import { InterviewHeader } from "./InterviewHeader";
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
      <InterviewHeader activeNav="profile" />

      <div className="grid min-h-0 flex-1 grid-cols-4 overflow-hidden">
        <aside className="col-span-1 min-h-0 overflow-y-auto border-r border-[var(--clinical-outline)] bg-[var(--clinical-surface)]">
          <DonorProfilePanel />
        </aside>

        <div className="col-span-3 flex min-h-0 flex-col overflow-hidden">
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
              <p className="w-full text-xs text-[var(--clinical-on-surface-variant)] lg:hidden">
                Prototype: mock tablet Yes responses until digital questionnaire API is connected.
              </p>
            </div>
          </div>

          {visibleCount === 0 ? (
            <p className="flex flex-1 items-center justify-center text-sm text-[var(--clinical-on-surface-variant)]">
              No questions match your search.
            </p>
          ) : (
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-6 lg:grid-cols-3">
              {columnGroups.map((groups, colIndex) => (
                <div
                  key={colIndex}
                  className="flex min-h-0 flex-col gap-4 overflow-y-auto lg:overflow-hidden"
                >
                  {groups.map((group) => (
                    <section
                      key={group.category}
                      className="shrink-0 rounded-xl border border-[var(--clinical-outline)] bg-white lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:flex lg:flex-col"
                    >
                      <h2 className="shrink-0 border-b border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
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
        </div>
      </div>

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
          className="rounded-lg bg-[var(--clinical-primary-dark)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--clinical-primary)] disabled:cursor-not-allowed disabled:bg-[var(--clinical-outline-variant)]"
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
  return (
    <li className="border-b border-[var(--clinical-outline)] last:border-b-0">
      <label
        className={`flex cursor-pointer items-start gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--clinical-surface)] ${
          selected ? "bg-[var(--clinical-primary-container)]/60" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[var(--clinical-primary)]"
        />
        <span className="w-[4.5rem] shrink-0 font-mono text-xs font-bold tracking-wide text-[var(--clinical-primary)]">
          {question.code}
        </span>
        <span
          className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-snug text-[var(--clinical-on-surface)]"
          title={question.question}
        >
          {question.question}
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
          : "border-[var(--clinical-primary)] bg-white text-[var(--clinical-primary-dark)] hover:bg-[var(--clinical-primary-container)]"
      }`}
    >
      {children}
    </button>
  );
}
