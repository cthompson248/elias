"use client";

import { useState } from "react";

// ─── Section anchor IDs ───────────────────────────────────────────────────────
const SECTIONS = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing & Radius" },
  { id: "elevation", label: "Elevation" },
  { id: "buttons", label: "Buttons" },
  { id: "badges", label: "Badges & Status" },
  { id: "forms", label: "Form Elements" },
  { id: "cards", label: "Cards" },
  { id: "banners", label: "Banners" },
  { id: "interview-header", label: "Interview Header" },
  { id: "inventory", label: "Component Inventory" },
];

// ─── Color tokens ─────────────────────────────────────────────────────────────
const COLOR_GROUPS = [
  {
    name: "Brand",
    tokens: [
      { token: "--clinical-primary", hex: "#a4152d", label: "Primary (Brand Red)", usage: "Accents, active states, links" },
      { token: "--clinical-primary-dark", hex: "#5e0024", label: "Primary Dark (Jarrah)", usage: "Primary buttons, pressed states" },
      { token: "--clinical-burgundy", hex: "#64150d", label: "Burgundy", usage: "Yes-toggle selected state" },
      { token: "--clinical-on-primary", hex: "#ffffff", label: "On Primary", usage: "Text/icons on primary fills", border: true },
    ],
  },
  {
    name: "Primary Containers",
    tokens: [
      { token: "--clinical-primary-container", hex: "#fcf4f2", label: "Primary Container", usage: "Info banners, defer backgrounds" },
      { token: "--clinical-primary-subtle-border", hex: "#f9c9bf", label: "Primary Subtle Border", usage: "Borders on primary tint surfaces" },
    ],
  },
  {
    name: "Secondary (Teal)",
    tokens: [
      { token: "--clinical-secondary", hex: "#165766", label: "Secondary (Teal)", usage: "Focus rings, secondary accent" },
      { token: "--clinical-secondary-container", hex: "#dceffa", label: "Secondary Container", usage: "Teal tint backgrounds" },
    ],
  },
  {
    name: "Surfaces",
    tokens: [
      { token: "--clinical-surface", hex: "#f6f7f8", label: "Surface", usage: "App background" },
      { token: "--clinical-surface-container", hex: "#ffffff", label: "Surface Container", usage: "Cards, panels", border: true },
      { token: "--clinical-surface-insights", hex: "#eaedef", label: "Surface Insights", usage: "Guidance/support sidebar tint" },
    ],
  },
  {
    name: "Text",
    tokens: [
      { token: "--clinical-on-surface", hex: "#171d20", label: "On Surface", usage: "Primary body text" },
      { token: "--clinical-on-surface-variant", hex: "#5f7581", label: "On Surface Variant", usage: "Labels, secondary copy, hints" },
    ],
  },
  {
    name: "Borders",
    tokens: [
      { token: "--clinical-outline", hex: "#dbe1e4", label: "Outline", usage: "Card and input borders" },
      { token: "--clinical-outline-variant", hex: "#acbac2", label: "Outline Variant", usage: "Stronger borders, dividers" },
    ],
  },
  {
    name: "Semantic",
    tokens: [
      { token: "--clinical-success", hex: "#3fa21c", label: "Success", usage: "Eligible, cleared, OK" },
      { token: "--clinical-warning", hex: "#aa761c", label: "Warning", usage: "Nurse review, caution, restricted" },
      { token: "--clinical-error", hex: "#a51b00", label: "Error", usage: "Deferral, high risk" },
      { token: "--clinical-warning-subtle", hex: "#fdf8ed", label: "Warning Subtle", usage: "Warning/restricted backgrounds" },
      { token: "--clinical-warning-subtle-border", hex: "#f4daa6", label: "Warning Subtle Border", usage: "Warning/restricted borders" },
      { token: "--clinical-read-aloud", hex: "#d3f4ea", label: "Read Aloud", usage: "Read-aloud confirmation checkbox bg" },
      { token: "--clinical-read-aloud-border", hex: "#a8e6d4", label: "Read Aloud Border", usage: "Read-aloud checkbox border" },
    ],
  },
];

// ─── Typography scale ─────────────────────────────────────────────────────────
const TYPE_SCALE = [
  { name: "display-lg", fontFamily: "Public Sans", size: "48px", weight: "700", lineHeight: "56px", tracking: "-0.02em", className: "font-[family-name:var(--font-public-sans)] text-5xl font-bold leading-[56px] tracking-[-0.02em]" },
  { name: "headline-lg", fontFamily: "Public Sans", size: "32px", weight: "600", lineHeight: "40px", tracking: "-0.01em", className: "font-[family-name:var(--font-public-sans)] text-[32px] font-semibold leading-[40px] tracking-[-0.01em]" },
  { name: "headline-md", fontFamily: "Public Sans", size: "24px", weight: "600", lineHeight: "32px", tracking: "—", className: "font-[family-name:var(--font-public-sans)] text-2xl font-semibold leading-8" },
  { name: "title-lg", fontFamily: "Inter", size: "20px", weight: "600", lineHeight: "28px", tracking: "—", className: "text-xl font-semibold leading-7" },
  { name: "body-lg", fontFamily: "Inter", size: "18px", weight: "400", lineHeight: "28px", tracking: "—", className: "text-lg leading-7" },
  { name: "body-md", fontFamily: "Inter", size: "16px", weight: "400", lineHeight: "24px", tracking: "—", className: "text-base leading-6" },
  { name: "label-md", fontFamily: "Inter", size: "14px", weight: "500", lineHeight: "20px", tracking: "0.01em", className: "text-sm font-medium leading-5 tracking-[0.01em]" },
  { name: "label-sm", fontFamily: "Inter", size: "12px", weight: "600", lineHeight: "16px", tracking: "0.05em", className: "text-xs font-semibold leading-4 tracking-[0.05em] uppercase" },
];

// ─── Spacing scale ────────────────────────────────────────────────────────────
const SPACING = [
  { name: "xs", px: "4px", tw: "p-1", desc: "Tight padding within pills" },
  { name: "sm", px: "12px", tw: "p-3", desc: "Compact rows, dense tables" },
  { name: "md", px: "16px", tw: "p-4", desc: "Standard card padding" },
  { name: "lg", px: "24px", tw: "p-6", desc: "Section padding, gutter" },
  { name: "xl", px: "32px", tw: "p-8", desc: "Generous padding for CTAs" },
];

const RADII = [
  { name: "sm", value: "0.25rem (4px)", tw: "rounded-sm", desc: "Checkboxes, tight chips" },
  { name: "DEFAULT", value: "0.5rem (8px)", tw: "rounded", desc: "Buttons, inputs" },
  { name: "md", value: "0.75rem (12px)", tw: "rounded-xl", desc: "Legacy, rarely used" },
  { name: "lg", value: "1rem (16px)", tw: "rounded-xl", desc: "Cards, data containers" },
  { name: "xl", value: "1.5rem (24px)", tw: "rounded-2xl", desc: "Large feature cards" },
  { name: "full", value: "9999px", tw: "rounded-full", desc: "Pills, badges, avatars" },
];

// ─── Component inventory ──────────────────────────────────────────────────────
const COMPONENT_INVENTORY = [
  { name: "InterviewHeader", file: "src/app/interview/InterviewHeader.tsx", type: "Layout", desc: "Donor identity bar with avatar, name/ID, last donation, nav tabs (Profile, Interview, History, Eligibility), and icon buttons." },
  { name: "DonorProfilePanel", file: "src/app/interview/DonorProfilePanel.tsx", type: "Panel", desc: "Editable donor profile form: donor number, sex, DOB, ABO, donation type, height/weight, and visit measurements (haemoglobin, pulse, radial)." },
  { name: "CountryOfBirthPanel", file: "src/app/interview/CountryOfBirthPanel.tsx", type: "Panel", desc: "Mandatory Chagas disease check. Country search field + selected-country chips." },
  { name: "GuidancePanel", file: "src/app/interview/GuidancePanel.tsx", type: "Panel", desc: "Right-sidebar AI guidance: suggested donor response (dark Jarrah card), plasma volume card, reasoning cards per question." },
  { name: "NextStepBanner", file: "src/app/interview/GuidancePanel.tsx", type: "Banner", desc: "Progress prompt with a labelled progress bar showing X of Y questions complete." },
  { name: "EscalationBanner", file: "src/app/interview/GuidancePanel.tsx", type: "Banner", desc: "Contextual notice (amber/rose/blue tones) for warnings, escalations, and nurse-review flags." },
  { name: "QuestionPanelCard", file: "src/app/interview/interview-panel-cards.tsx", type: "Card", desc: "White bordered card wrapper with a title and optional hint; hosts BinaryChoiceButtons and follow-up content." },
  { name: "InterviewNotesCard", file: "src/app/interview/interview-panel-cards.tsx", type: "Input", desc: "Inline notes text input with a notes icon, used for free-text interview annotations." },
  { name: "BinaryChoiceButtons", file: "src/app/interview/interview-panel-cards.tsx", type: "Input", desc: "Two-button Yes/No toggle pair. Yes uses clinical-toggle-yes-selected (burgundy fill). No uses surface-insights fill when selected." },
  { name: "FollowUpOptionPill", file: "src/app/interview/interview-panel-cards.tsx", type: "Input", desc: "Selectable pill chip for multi-select follow-up answers. Selected state mirrors yes-toggle." },
  { name: "FollowUpCompleteCard", file: "src/app/interview/interview-panel-cards.tsx", type: "Card", desc: "Status summary card shown once a question is resolved. Five variants: cleared, complete, restricted, review, defer." },
  { name: "GuidanceActionPanel", file: "src/app/interview/interview-panel-cards.tsx", type: "Card", desc: "Success-styled action summary card with a green icon, title, summary, detail text, and footer note." },
  { name: "HazardousActivityGuidance", file: "src/app/interview/HazardousActivityGuidance.tsx", type: "Flow", desc: "B5-specific: pill picker for hazardous activities + custom input, read-aloud advice block, confirmation checkbox, and continue/defer decision." },
  { name: "SexualContactGuidance", file: "src/app/interview/SexualContactGuidance.tsx", type: "Flow", desc: "C14-specific: scenario selection pills + custom entries, then resolved guidance with partner Lifeblood donor follow-up." },
  { name: "InterviewRoleSwitcher", file: "src/app/interview/InterviewRoleSwitcher.tsx", type: "Utility", desc: "DSNA vs Nurse role toggle (defined but not yet wired into UI)." },
  { name: "ChecklistQuestionCard", file: "src/app/interview/review/page.tsx", type: "Card", desc: "Inline card in the left checklist panel. Shows question code, label, answer status badge, and expand/collapse." },
  { name: "ReviewStatusBadge", file: "src/app/interview/review/page.tsx", type: "Badge", desc: "Pill badge on checklist rows: unanswered / yes / no / complete with colour coding." },
  { name: "ScreeningDetailPanel", file: "src/app/interview/review/page.tsx", type: "Panel", desc: "Centre panel for the active question: question text, BinaryChoiceButtons, follow-up questions, notes, and FollowUpCompleteCard." },
  { name: "DonorResponseButton", file: "src/app/interview/review/page.tsx", type: "Input", desc: "Large accessible toggle buttons in the screening detail panel." },
  { name: "MandatoryQuestionCard", file: "src/app/interview/review/page.tsx", type: "Card", desc: "Special card for mandatory (non-skippable) Chagas/travel questions." },
  { name: "SelectionRow", file: "src/app/interview/page.tsx", type: "Input", desc: "Checkbox row in the question-selection screen for loading questions into the interview." },
  { name: "C8aSelectionRow", file: "src/app/interview/page.tsx", type: "Input", desc: "C8a variant of SelectionRow with a radio group for partner-count follow-up." },
  { name: "ActionButton", file: "src/app/interview/page.tsx", type: "Button", desc: "Primary CTA button ('Continue to interview') — disabled until ≥1 question is selected." },
];

export default function DesignSystemPage() {
  const [yesSelected, setYesSelected] = useState(false);
  const [noSelected, setNoSelected] = useState(false);
  const [pill1, setPill1] = useState(false);
  const [pill2, setPill2] = useState(true);
  const [pill3, setPill3] = useState(false);

  function handleYes() { setYesSelected(true); setNoSelected(false); }
  function handleNo() { setYesSelected(false); setNoSelected(true); }

  return (
    <div className="min-h-screen bg-[var(--clinical-surface)]">
      {/* ── Page header ── */}
      <header className="border-b border-[var(--clinical-outline)] bg-white px-8 py-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
          Elias · Prototype
        </p>
        <h1 className="font-[family-name:var(--font-public-sans)] text-3xl font-semibold text-[var(--clinical-on-surface)]">
          Clinical Precision — Design System
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--clinical-on-surface-variant)]">
          A reference for the dev team. Every colour token, type style, spacing value, and UI
          component used in this prototype — with notes on usage, variants, and file locations.
        </p>
      </header>

      <div className="flex">
        {/* ── Sticky sidebar nav ── */}
        <aside className="sticky top-0 h-screen w-52 shrink-0 overflow-y-auto border-r border-[var(--clinical-outline)] bg-white py-6">
          <p className="mb-3 px-5 text-[10px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
            Contents
          </p>
          <nav className="flex flex-col gap-0.5 px-3">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-md px-3 py-1.5 text-sm text-[var(--clinical-on-surface-variant)] transition-colors hover:bg-[var(--clinical-surface)] hover:text-[var(--clinical-on-surface)]"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="min-w-0 flex-1 space-y-16 px-10 py-10">

          {/* ════════════════════════════════════════ COLORS */}
          <section id="colors">
            <SectionHeader
              title="Colors"
              desc="All CSS custom properties defined in globals.css. Used as arbitrary Tailwind values — e.g. bg-[var(--clinical-primary)] or text-[var(--clinical-on-surface-variant)]."
            />
            <div className="mt-6 space-y-8">
              {COLOR_GROUPS.map((group) => (
                <div key={group.name}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                    {group.name}
                  </h3>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                    {group.tokens.map((t) => (
                      <div
                        key={t.token}
                        className="overflow-hidden rounded-xl border border-[var(--clinical-outline)] bg-white shadow-sm"
                      >
                        <div
                          className="h-14"
                          style={{
                            backgroundColor: t.hex,
                            border: t.border ? "1px solid var(--clinical-outline)" : undefined,
                          }}
                        />
                        <div className="px-3 py-2.5">
                          <p className="text-xs font-semibold text-[var(--clinical-on-surface)]">
                            {t.label}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-[var(--clinical-on-surface-variant)]">
                            {t.hex}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] text-[var(--clinical-on-surface-variant)]">
                            {t.token}
                          </p>
                          <p className="mt-1.5 text-[11px] leading-4 text-[var(--clinical-on-surface-variant)]">
                            {t.usage}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Undeclared tokens note */}
            <div className="mt-6 rounded-lg border border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)] px-4 py-3">
              <p className="text-xs font-semibold text-[var(--clinical-warning)]">Missing tokens</p>
              <p className="mt-1 text-xs leading-5 text-[var(--clinical-on-surface)]">
                <code className="rounded bg-white/60 px-1 font-mono">--clinical-success-subtle</code> and{" "}
                <code className="rounded bg-white/60 px-1 font-mono">--clinical-success-subtle-border</code>{" "}
                are referenced in <code className="rounded bg-white/60 px-1 font-mono">GuidanceActionPanel</code> but not
                defined in globals.css. Add them: <code className="rounded bg-white/60 px-1 font-mono">#f3faef</code> and{" "}
                <code className="rounded bg-white/60 px-1 font-mono">#c9e1bd</code> respectively.
              </p>
            </div>
          </section>

          {/* ════════════════════════════════════════ TYPOGRAPHY */}
          <section id="typography">
            <SectionHeader
              title="Typography"
              desc="Two-font system. Public Sans (display) for headings — institutional, sturdy. Inter (body) for data labels and copy — neutral, high-density readable. Loaded via next/font/google in interview/layout.tsx."
            />
            <div className="mt-6 space-y-1 rounded-xl border border-[var(--clinical-outline)] bg-white overflow-hidden">
              {TYPE_SCALE.map((t, i) => (
                <div
                  key={t.name}
                  className={`flex items-baseline gap-6 px-6 py-5 ${i < TYPE_SCALE.length - 1 ? "border-b border-[var(--clinical-outline)]" : ""}`}
                >
                  <div className="w-32 shrink-0">
                    <p className="text-xs font-semibold text-[var(--clinical-on-surface)]">{t.name}</p>
                    <p className="mt-0.5 text-[10px] text-[var(--clinical-on-surface-variant)]">{t.fontFamily}</p>
                    <p className="mt-0.5 text-[10px] text-[var(--clinical-on-surface-variant)]">
                      {t.size} / {t.weight}
                    </p>
                    <p className="text-[10px] text-[var(--clinical-on-surface-variant)]">lh {t.lineHeight}</p>
                    {t.tracking !== "—" && (
                      <p className="text-[10px] text-[var(--clinical-on-surface-variant)]">ls {t.tracking}</p>
                    )}
                  </div>
                  <p
                    className={`min-w-0 flex-1 text-[var(--clinical-on-surface)] ${t.className}`}
                    style={{ lineHeight: t.lineHeight }}
                  >
                    The quick brown fox
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-[var(--clinical-outline)] bg-white px-5 py-4">
              <p className="text-xs font-semibold text-[var(--clinical-on-surface)]">Usage patterns in code</p>
              <ul className="mt-2 space-y-1.5 text-xs leading-5 text-[var(--clinical-on-surface-variant)]">
                <li><code className="rounded bg-[var(--clinical-surface)] px-1 font-mono">font-[family-name:var(--font-public-sans)]</code> — Public Sans headings</li>
                <li><code className="rounded bg-[var(--clinical-surface)] px-1 font-mono">font-[family-name:var(--font-inter)]</code> — explicit Inter (body defaults to Inter via globals.css)</li>
                <li><code className="rounded bg-[var(--clinical-surface)] px-1 font-mono">text-[11px] font-semibold uppercase tracking-wider</code> — section labels / overline pattern</li>
                <li><code className="rounded bg-[var(--clinical-surface)] px-1 font-mono">text-[10px] font-bold uppercase tracking-widest</code> — card header labels (e.g. "Action", "Why")</li>
              </ul>
            </div>
          </section>

          {/* ════════════════════════════════════════ SPACING & RADIUS */}
          <section id="spacing">
            <SectionHeader
              title="Spacing & Radius"
              desc="8px base scale throughout. Border radii follow a rounded aesthetic balancing professionalism and modern software feel."
            />
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                  Spacing scale
                </h3>
                <div className="overflow-hidden rounded-xl border border-[var(--clinical-outline)] bg-white">
                  {SPACING.map((s, i) => (
                    <div
                      key={s.name}
                      className={`flex items-center gap-4 px-4 py-3 ${i < SPACING.length - 1 ? "border-b border-[var(--clinical-outline)]" : ""}`}
                    >
                      <div
                        className="shrink-0 rounded bg-[var(--clinical-secondary)]"
                        style={{ width: s.px, height: "12px" }}
                      />
                      <div>
                        <p className="text-xs font-semibold text-[var(--clinical-on-surface)]">
                          {s.name} · {s.px}
                        </p>
                        <p className="text-[11px] text-[var(--clinical-on-surface-variant)]">{s.desc}</p>
                      </div>
                      <code className="ml-auto shrink-0 rounded bg-[var(--clinical-surface)] px-2 py-0.5 text-[11px] font-mono text-[var(--clinical-on-surface-variant)]">
                        {s.tw}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                  Border radius
                </h3>
                <div className="overflow-hidden rounded-xl border border-[var(--clinical-outline)] bg-white">
                  {RADII.map((r, i) => (
                    <div
                      key={r.name}
                      className={`flex items-center gap-4 px-4 py-3 ${i < RADII.length - 1 ? "border-b border-[var(--clinical-outline)]" : ""}`}
                    >
                      <div
                        className="h-8 w-8 shrink-0 border-2 border-[var(--clinical-primary)] bg-[var(--clinical-primary-container)]"
                        style={{ borderRadius: r.value.split(" ")[0] }}
                      />
                      <div>
                        <p className="text-xs font-semibold text-[var(--clinical-on-surface)]">
                          {r.name} · {r.value}
                        </p>
                        <p className="text-[11px] text-[var(--clinical-on-surface-variant)]">{r.desc}</p>
                      </div>
                      <code className="ml-auto shrink-0 rounded bg-[var(--clinical-surface)] px-2 py-0.5 text-[11px] font-mono text-[var(--clinical-on-surface-variant)]">
                        {r.tw}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════ ELEVATION */}
          <section id="elevation">
            <SectionHeader
              title="Elevation"
              desc="Tonal layering with low-contrast outlines rather than heavy shadows. Keeps the UI calm and clinical."
            />
            <div className="mt-6 grid grid-cols-4 gap-4">
              {[
                { label: "Level 0 — Background", bg: "#f6f7f8", border: false, shadow: false, note: "App background surface" },
                { label: "Level 1 — Cards", bg: "#ffffff", border: true, shadow: false, note: "1px solid #dbe1e4, no shadow" },
                { label: "Level 2 — Active/Hover", bg: "#ffffff", border: true, shadow: true, note: "shadow: 0 4px 12px rgba(0,0,0,0.05)" },
                { label: "Guidance Sidebar", bg: "#eaedef", border: false, shadow: false, note: "Warm tint separates support layer" },
              ].map((e) => (
                <div key={e.label} className="flex flex-col gap-3">
                  <div
                    className="flex h-24 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: e.bg,
                      border: e.border ? "1px solid #dbe1e4" : "1px dashed #dbe1e4",
                      boxShadow: e.shadow ? "0 4px 12px rgba(0,0,0,0.05)" : undefined,
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: "#5f7581" }}
                    >
                      {e.bg}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--clinical-on-surface)]">{e.label}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--clinical-on-surface-variant)]">{e.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ════════════════════════════════════════ BUTTONS */}
          <section id="buttons">
            <SectionHeader
              title="Buttons"
              desc="All buttons are hand-built with Tailwind — no component library. Interactive focus rings use the teal secondary colour."
            />
            <div className="mt-6 space-y-6">
              <ComponentFrame label="Primary button" file="src/app/interview/page.tsx — ActionButton">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-lg bg-[var(--clinical-primary-dark)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--clinical-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--clinical-secondary)]"
                  >
                    Continue to interview
                  </button>
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-lg bg-[var(--clinical-outline)] px-5 py-2.5 text-sm font-semibold text-[var(--clinical-on-surface-variant)] opacity-60"
                  >
                    Continue (disabled)
                  </button>
                </div>
                <PropsList props={[
                  { name: "bg", value: "clinical-primary-dark (#5e0024)", note: "hover → clinical-primary (#a4152d)" },
                  { name: "focus ring", value: "clinical-secondary teal", note: "2px outline, offset 2px" },
                  { name: "disabled", value: "cursor-not-allowed + opacity-60", note: "" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Binary choice — Yes / No" file="src/app/interview/interview-panel-cards.tsx — BinaryChoiceButtons">
                <div className="max-w-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      aria-pressed={yesSelected}
                      onClick={handleYes}
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
                      onClick={handleNo}
                      className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                        noSelected
                          ? "border-[var(--clinical-outline-variant)] bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface)]"
                          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface-variant)] hover:border-[var(--clinical-outline-variant)]"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
                <PropsList props={[
                  { name: "Yes selected", value: ".clinical-toggle-yes-selected", note: "Defined in globals.css @layer components — burgundy fill #64150d" },
                  { name: "No selected", value: "surface-insights bg + outline-variant border", note: "No global class needed" },
                  { name: "Unselected", value: "white bg + outline border", note: "hover → outline-variant border" },
                  { name: "aria-pressed", value: "true/false", note: "Required for accessibility" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Follow-up option pills" file="src/app/interview/interview-panel-cards.tsx — FollowUpOptionPill">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Tattooing", sel: pill1, set: setPill1 },
                    { label: "Body piercing", sel: pill2, set: setPill2 },
                    { label: "Acupuncture", sel: pill3, set: setPill3 },
                    { label: "None of the above", sel: false, set: () => {} },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      aria-pressed={p.sel}
                      onClick={() => p.set((v: boolean) => !v)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        p.sel
                          ? "clinical-toggle-yes-selected"
                          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface)] hover:border-[var(--clinical-outline-variant)]"
                      }`}
                    >
                      {p.sel && (
                        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {p.label}
                    </button>
                  ))}
                </div>
                <PropsList props={[
                  { name: "Selected", value: ".clinical-toggle-yes-selected (reuses yes-toggle class)", note: "Shows a check icon when selected" },
                  { name: "Unselected", value: "white bg + outline border", note: "" },
                  { name: "Shape", value: "rounded-full (pill)", note: "Distinguishes from rectangular action buttons" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Icon buttons" file="src/app/interview/InterviewHeader.tsx — IconButton">
                <div className="flex gap-2">
                  {["Bell", "Gear"].map((name) => (
                    <button
                      key={name}
                      type="button"
                      aria-label={name}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--clinical-on-surface-variant)] transition-colors hover:bg-[var(--clinical-surface)]"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {name === "Bell" ? (
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <>
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
                          </>
                        )}
                      </svg>
                    </button>
                  ))}
                </div>
                <PropsList props={[
                  { name: "Size", value: "h-9 w-9 (36×36px)", note: "Minimum 44px tap target — consider padding wrapper for mobile" },
                  { name: "Hover", value: "bg-[var(--clinical-surface)]", note: "Subtle grey background on hover" },
                  { name: "Icons", value: "Inline SVG", note: "No icon library — defined locally per file" },
                ]} />
              </ComponentFrame>
            </div>
          </section>

          {/* ════════════════════════════════════════ BADGES */}
          <section id="badges">
            <SectionHeader
              title="Badges & Status"
              desc="Status indicators always pair colour with a text label. Pill shape (rounded-full) distinguishes them from action buttons."
            />
            <div className="mt-6 space-y-6">
              <ComponentFrame label="Severity pills" file="src/app/interview/GuidancePanel.tsx — SeverityPill">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Clear", className: "bg-[#f3faef] text-[var(--clinical-success)] border-[#c9e1bd]" },
                    { label: "Restricted", className: "bg-[var(--clinical-warning-subtle)] text-[var(--clinical-warning)] border-[var(--clinical-warning-subtle-border)]" },
                    { label: "Defer", className: "bg-[var(--clinical-primary-container)] text-[var(--clinical-primary)] border-[var(--clinical-primary-subtle-border)]" },
                    { label: "Review needed", className: "bg-amber-50 text-amber-700 border-amber-200" },
                    { label: "Pending", className: "bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface-variant)] border-[var(--clinical-outline)]" },
                  ].map((b) => (
                    <span
                      key={b.label}
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${b.className}`}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
                <PropsList props={[
                  { name: "Clear", value: "#f3faef bg / success text / #c9e1bd border", note: "" },
                  { name: "Restricted", value: "warning-subtle bg / warning text / warning-subtle-border", note: "" },
                  { name: "Defer", value: "primary-container bg / primary text / primary-subtle-border", note: "" },
                  { name: "Review", value: "amber-50 / amber-700 / amber-200", note: "Tailwind amber (not a CSS var)" },
                  { name: "Pending", value: "surface-insights bg / on-surface-variant / outline border", note: "" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Review status badges (checklist)" file="src/app/interview/review/page.tsx — ReviewStatusBadge">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Unanswered", className: "bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface-variant)]" },
                    { label: "Yes", className: "bg-[var(--clinical-primary-container)] text-[var(--clinical-primary)]" },
                    { label: "No", className: "bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface)]" },
                    { label: "Complete", className: "bg-[#f3faef] text-[var(--clinical-success)]" },
                  ].map((b) => (
                    <span
                      key={b.label}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${b.className}`}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </ComponentFrame>

              <ComponentFrame label="Overall status badge (guidance panel)" file="src/app/interview/GuidancePanel.tsx — StatusBadge">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Eligible to continue",
                    "Restricted donation",
                    "Not donating today",
                    "Awaiting follow-ups",
                    "Nurse review needed",
                  ].map((label) => (
                    <span
                      key={label}
                      className="inline-flex rounded-full border border-white bg-white px-2.5 py-1 text-xs font-semibold text-[var(--clinical-on-surface)]"
                      style={{ boxShadow: "0 0 0 1px #dbe1e4" }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-[var(--clinical-on-surface-variant)]">
                  These appear on the dark Jarrah guidance card, so they use a white fill for contrast.
                </p>
              </ComponentFrame>
            </div>
          </section>

          {/* ════════════════════════════════════════ FORMS */}
          <section id="forms">
            <SectionHeader
              title="Form Elements"
              desc="All inputs are hand-built. No form library. Standard text, select, and textarea patterns share a common base class."
            />
            <div className="mt-6 space-y-6">
              <ComponentFrame label="Profile text input" file="src/app/interview/DonorProfilePanel.tsx — profileInputClassName">
                <div className="max-w-xs space-y-4">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-[var(--clinical-on-surface-variant)]">
                      Donor number
                    </label>
                    <input
                      type="text"
                      defaultValue="D-4827193"
                      className="w-full rounded-md border border-[var(--clinical-outline)] bg-white px-2.5 py-2 text-sm text-[var(--clinical-on-surface)] outline-none focus:border-[var(--clinical-on-surface)] focus:ring-1 focus:ring-[var(--clinical-on-surface)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-[var(--clinical-on-surface-variant)]">
                      Height (cm)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 172"
                      className="w-full rounded-md border border-[var(--clinical-outline)] bg-white px-2.5 py-2 text-sm text-[var(--clinical-on-surface)] outline-none focus:border-[var(--clinical-on-surface)] focus:ring-1 focus:ring-[var(--clinical-on-surface)]"
                    />
                  </div>
                </div>
                <PropsList props={[
                  { name: "Base", value: "rounded-md, 1px outline border, white bg", note: "" },
                  { name: "Focus", value: "border-on-surface + ring-1 ring-on-surface", note: "Uses dark text colour for focus ring (not teal)" },
                  { name: "Label", value: "11px font-medium uppercase-ish, on-surface-variant", note: "" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Notes input" file="src/app/interview/interview-panel-cards.tsx — InterviewNotesCard">
                <div className="max-w-sm">
                  <div className="flex items-center gap-2 rounded-lg border border-[var(--clinical-outline)] bg-[var(--clinical-surface)] px-3 py-2">
                    <svg className="h-4 w-4 shrink-0 text-[var(--clinical-on-surface-variant)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Add interview notes"
                      className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--clinical-on-surface-variant)]"
                    />
                  </div>
                </div>
                <PropsList props={[
                  { name: "Container", value: "surface bg (not white), outline border, rounded-lg", note: "Visually distinct from profile inputs" },
                  { name: "Icon", value: "NotesIcon SVG, on-surface-variant colour", note: "" },
                  { name: "Input", value: "transparent bg, no border, no ring", note: "Container provides the visual treatment" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Select / dropdown" file="src/app/interview/DonorProfilePanel.tsx">
                <div className="max-w-xs">
                  <label className="mb-1 block text-[11px] font-medium text-[var(--clinical-on-surface-variant)]">
                    Sex
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-md border border-[var(--clinical-outline)] bg-white px-2.5 py-2 pr-8 text-sm text-[var(--clinical-on-surface)] outline-none focus:border-[var(--clinical-on-surface)] focus:ring-1 focus:ring-[var(--clinical-on-surface)]">
                      <option value="">Select sex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <svg className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--clinical-on-surface-variant)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <PropsList props={[
                  { name: "appearance-none", value: "Hides native arrow", note: "Custom ChevronDown SVG overlaid" },
                  { name: "Clear button", value: "Absolute-positioned ×", note: "Only shown when a value is selected" },
                ]} />
              </ComponentFrame>
            </div>
          </section>

          {/* ════════════════════════════════════════ CARDS */}
          <section id="cards">
            <SectionHeader
              title="Cards"
              desc="White bordered cards with rounded-xl. Elevation Level 1. The FollowUpCompleteCard has five status-driven variants."
            />
            <div className="mt-6 space-y-6">
              <ComponentFrame label="Question panel card" file="src/app/interview/interview-panel-cards.tsx — QuestionPanelCard">
                <div className="max-w-sm">
                  <article className="rounded-xl border border-[var(--clinical-outline)] bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold leading-snug text-[var(--clinical-on-surface)]">
                      Have you had any tattoos, body piercing, or acupuncture in the last 4 months?
                    </p>
                    <p className="mt-1 text-xs text-[var(--clinical-on-surface-variant)]">
                      Including tattoo touch-ups and semi-permanent makeup
                    </p>
                    <div className="mt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" className="rounded-lg border-2 border-[var(--clinical-outline)] bg-white px-4 py-3 text-sm font-semibold text-[var(--clinical-on-surface-variant)] hover:border-[var(--clinical-outline-variant)]">Yes</button>
                        <button type="button" className="rounded-lg border-2 border-[var(--clinical-outline)] bg-white px-4 py-3 text-sm font-semibold text-[var(--clinical-on-surface-variant)] hover:border-[var(--clinical-outline-variant)]">No</button>
                      </div>
                    </div>
                  </article>
                </div>
                <PropsList props={[
                  { name: "Container", value: "rounded-xl, outline border, white, shadow-sm", note: "" },
                  { name: "Title", value: "text-sm font-semibold on-surface", note: "" },
                  { name: "Hint", value: "text-xs on-surface-variant, mt-1", note: "Optional" },
                  { name: "Children", value: "mt-4 wrapper", note: "Usually BinaryChoiceButtons or pills" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Follow-up complete card — all variants" file="src/app/interview/interview-panel-cards.tsx — FollowUpCompleteCard">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(["cleared", "complete", "restricted", "review", "defer"] as const).map((variant) => {
                    const config = {
                      cleared: { title: "No follow-up needed", body: "A No answer clears this item.", articleClass: "border-[#a8e0cc] bg-[#D6F4EA]", iconClass: "bg-[#0D7A5E]", titleClass: "text-[#0D7A5E]", icon: "check" as const },
                      complete: { title: "No further questions", body: "See the Guidance panel.", articleClass: "border-[#a8e0cc] bg-[#D6F4EA]", iconClass: "bg-[#0D7A5E]", titleClass: "text-[#0D7A5E]", icon: "check" as const },
                      restricted: { title: "Restricted donation", body: "See the Guidance panel.", articleClass: "border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)]/90", iconClass: "bg-[var(--clinical-warning)]", titleClass: "text-[var(--clinical-warning)]", icon: "alert" as const },
                      review: { title: "Nurse review needed", body: "See the Guidance panel.", articleClass: "border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)]/90", iconClass: "bg-[var(--clinical-warning)]", titleClass: "text-[var(--clinical-warning)]", icon: "alert" as const },
                      defer: { title: "Not donating today", body: "See the Guidance panel.", articleClass: "border-[var(--clinical-primary-subtle-border)] bg-[var(--clinical-primary-container)]/90", iconClass: "bg-[var(--clinical-primary)]", titleClass: "text-[var(--clinical-primary-dark)]", icon: "alert" as const },
                    }[variant];
                    return (
                      <div key={variant}>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                          variant=&quot;{variant}&quot;
                        </p>
                        <article className={`rounded-xl border p-4 ${config.articleClass}`}>
                          <div className="flex items-center gap-3">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${config.iconClass}`}>
                              {config.icon === "check" ? (
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              ) : (
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              )}
                            </span>
                            <div>
                              <p className={`text-sm font-semibold ${config.titleClass}`}>{config.title}</p>
                              <p className="text-xs text-[var(--clinical-on-surface-variant)]">{config.body}</p>
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </ComponentFrame>

              <ComponentFrame label="Guidance reasoning card (ContributionCard)" file="src/app/interview/GuidancePanel.tsx — ContributionCard">
                <div className="max-w-sm">
                  <article className="overflow-hidden rounded-xl border border-[var(--clinical-outline)] bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-[var(--clinical-outline)] px-4 py-2.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-primary)]">B5</span>
                      <span className="ml-auto rounded-md border border-[var(--clinical-outline)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--clinical-on-surface)]">
                        Deferral: <span className="font-bold">B5-12M</span>
                      </span>
                    </div>
                    <div className="border-b border-[var(--clinical-outline)] bg-[var(--clinical-warning-subtle)] px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clinical-warning)]">Action</p>
                      <p className="mt-1 text-sm font-medium text-[var(--clinical-on-surface)]">Defer for 12 months from date of activity</p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--clinical-on-surface-variant)]">Why</p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--clinical-on-surface-variant)]">Tattooing and body piercing carry a risk of bloodborne virus transmission if performed with non-sterile equipment.</p>
                    </div>
                  </article>
                </div>
                <PropsList props={[
                  { name: "Header", value: "question code + optional CopyChip for deferral code", note: "" },
                  { name: "Action block", value: "Tinted bg matching severity (warning/defer/review/clear)", note: "Only shown when status !== incomplete" },
                  { name: "Why block", value: "Plain reasoning text", note: "Always shown" },
                  { name: "Footer", value: "Reference link with ExternalLinkIcon", note: "Optional" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Copy chip" file="src/app/interview/GuidancePanel.tsx — CopyChip">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[var(--clinical-outline)] bg-white px-2.5 py-1 text-xs font-medium tabular-nums hover:border-[var(--clinical-primary)] hover:bg-[var(--clinical-primary-container)] hover:text-[var(--clinical-primary)]"
                  >
                    <span className="font-bold">320 mL</span>
                    <svg className="h-3.5 w-3.5 shrink-0 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="2" width="6" height="4" rx="1" /><path d="M9 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3" /></svg>
                  </button>
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#c9e1bd] bg-[#f3faef] px-2.5 py-1 text-xs font-medium text-[var(--clinical-success)]"
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="font-bold">320 mL</span>
                    <span>Copied</span>
                  </button>
                  <span className="text-[11px] text-[var(--clinical-on-surface-variant)]">Default → Copied state</span>
                </div>
              </ComponentFrame>
            </div>
          </section>

          {/* ════════════════════════════════════════ BANNERS */}
          <section id="banners">
            <SectionHeader
              title="Banners"
              desc="Full-width section banners for guidance, progress, and escalation. Appear in the right guidance sidebar."
            />
            <div className="mt-6 space-y-6">
              <ComponentFrame label="Next step banner (progress)" file="src/app/interview/GuidancePanel.tsx — NextStepBanner">
                <div className="max-w-sm overflow-hidden rounded-xl border border-[var(--clinical-outline)]">
                  <section className="shrink-0 border-b border-[var(--clinical-outline)] bg-[#F5F6F8] px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                      Next step
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6 text-[var(--clinical-on-surface)]">
                      Ask the donor about their travel history in the last 12 months.
                    </p>
                    <div className="mt-3">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs text-[var(--clinical-on-surface-variant)]">3 of 8 complete</span>
                        <span className="text-xs font-semibold text-[var(--clinical-on-surface)]">38%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--clinical-outline)]">
                        <div className="h-full rounded-full bg-[var(--clinical-primary)] transition-all duration-300" style={{ width: "38%" }} />
                      </div>
                    </div>
                  </section>
                </div>
              </ComponentFrame>

              <ComponentFrame label="Escalation banners — all tones" file="src/app/interview/GuidancePanel.tsx — EscalationBanner">
                <div className="max-w-sm space-y-2">
                  {[
                    { tone: "amber", title: "Nurse review required", body: "This donor has disclosed recent travel to a malaria-endemic region. Escalate to the attending nurse before proceeding." },
                    { tone: "rose", title: "Deferral triggered", body: "Donor must be deferred for 12 months from the date of last hazardous activity." },
                  ].map((b) => {
                    const palette = b.tone === "amber"
                      ? { wrap: "border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)]", label: "text-[var(--clinical-warning)]" }
                      : { wrap: "border-[var(--clinical-primary-subtle-border)] bg-[var(--clinical-primary-container)]", label: "text-[var(--clinical-primary)]" };
                    return (
                      <div key={b.tone} className={`overflow-hidden rounded-xl border ${palette.wrap}`}>
                        <section className="px-5 py-4">
                          <p className={`text-[11px] font-semibold uppercase tracking-wider ${palette.label}`}>{b.title}</p>
                          <p className="mt-2 text-sm font-medium leading-6 text-[var(--clinical-on-surface)]">{b.body}</p>
                        </section>
                      </div>
                    );
                  })}
                </div>
                <PropsList props={[
                  { name: "amber", value: "warning-subtle bg + warning-subtle-border + warning text", note: "For nurse reviews and cautions" },
                  { name: "rose", value: "primary-container bg + primary-subtle-border + primary text", note: "For deferrals and high-risk flags" },
                  { name: "blue", value: "Same as amber currently", note: "Palette mapped to amber colours" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Suggested response card (dark Jarrah)" file="src/app/interview/GuidancePanel.tsx — GuidancePanel">
                <div className="max-w-sm">
                  <article className="rounded-xl border border-[var(--clinical-primary-dark)] bg-[var(--clinical-primary-dark)] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                      Suggested response
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-public-sans)] text-lg font-semibold leading-snug text-white">
                      &ldquo;Thank you for telling us. Due to that activity, we need to defer your donation for 12 months.&rdquo;
                    </p>
                    <p className="mt-4 inline-flex rounded-full border border-white bg-white px-2.5 py-1 text-xs font-semibold text-[var(--clinical-on-surface)]">
                      Not donating today
                    </p>
                  </article>
                </div>
                <PropsList props={[
                  { name: "Background", value: "clinical-primary-dark (#5e0024) — deep Jarrah", note: "Strongest visual element on the screen" },
                  { name: "Text", value: "Public Sans, text-lg font-semibold, white", note: "Quoted phrasing with curly quotes" },
                  { name: "Status badge", value: "White pill on dark surface", note: "All status text colours use white bg for contrast" },
                ]} />
              </ComponentFrame>

              <ComponentFrame label="Guidance action panel (success)" file="src/app/interview/interview-panel-cards.tsx — GuidanceActionPanel">
                <div className="max-w-sm">
                  <article className="flex gap-4 rounded-xl border p-5" style={{ borderColor: "#c9e1bd", backgroundColor: "#f3faef" }}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--clinical-success)] text-white">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-[var(--clinical-success)]">Eligible to proceed</p>
                      <p className="mt-1 text-sm font-medium text-[var(--clinical-on-surface)]">No restrictions apply for this item.</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--clinical-on-surface-variant)]">The donor&apos;s answer does not trigger any deferral or restriction criteria under current guidelines.</p>
                      <p className="mt-3 text-sm text-[var(--clinical-on-surface-variant)]">Review clinical guidance in the right panel before submitting.</p>
                    </div>
                  </article>
                </div>
                <div className="mt-3 rounded-lg border border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)] px-4 py-3">
                  <p className="text-[11px] font-semibold text-[var(--clinical-warning)]">Token note</p>
                  <p className="text-[11px] leading-5 text-[var(--clinical-on-surface)]">
                    This component uses <code className="rounded bg-white/60 px-1 font-mono">--clinical-success-subtle</code> (#f3faef) and{" "}
                    <code className="rounded bg-white/60 px-1 font-mono">--clinical-success-subtle-border</code> (#c9e1bd) — add these to globals.css.
                  </p>
                </div>
              </ComponentFrame>
            </div>
          </section>

          {/* ════════════════════════════════════════ INTERVIEW HEADER */}
          <section id="interview-header">
            <SectionHeader
              title="Interview Header"
              desc="Top navigation bar present on all interview routes. Three-column grid: donor identity (left), tab nav (centre), icon actions (right)."
            />
            <div className="mt-6">
              <ComponentFrame label="InterviewHeader" file="src/app/interview/InterviewHeader.tsx">
                <div className="overflow-hidden rounded-xl border border-[var(--clinical-outline)]">
                  <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-[var(--clinical-outline)] bg-white px-6 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--clinical-surface-insights)] text-sm font-semibold text-[var(--clinical-on-surface-variant)]">
                        SJ
                      </div>
                      <div className="min-w-0 leading-tight">
                        <p className="font-[family-name:var(--font-public-sans)] text-base font-semibold">
                          Sarah Johnson (34)
                        </p>
                        <p className="text-sm text-[var(--clinical-on-surface-variant)]">
                          ID: D-4827193 · Type: O+
                        </p>
                      </div>
                      <div className="h-9 w-px bg-[var(--clinical-outline)]" />
                      <div className="text-sm text-[var(--clinical-on-surface-variant)]">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                          Last Donation
                        </span>
                        <p className="font-medium text-[var(--clinical-on-surface)]">12 Mar 2025</p>
                      </div>
                    </div>
                    <nav className="flex items-center justify-center gap-6">
                      {["Profile", "Interview", "History", "Eligibility"].map((tab, i) => (
                        <span
                          key={tab}
                          className={`relative pb-0.5 text-sm font-medium ${i === 1 ? "text-[var(--clinical-primary)]" : "text-[var(--clinical-on-surface-variant)]"}`}
                        >
                          {tab}
                          {i === 1 && <span className="absolute -bottom-3 left-0 right-0 h-0.5 rounded-full bg-[var(--clinical-primary)]" />}
                        </span>
                      ))}
                    </nav>
                    <div className="flex items-center justify-end gap-3">
                      {["Bell", "Gear"].map((name) => (
                        <button key={name} type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--clinical-on-surface-variant)] hover:bg-[var(--clinical-surface)]">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {name === "Bell" ? <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" /> : <><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" /></>}
                          </svg>
                        </button>
                      ))}
                    </div>
                  </header>
                </div>
                <PropsList props={[
                  { name: "Layout", value: "3-col grid: [1fr auto 1fr]", note: "Centre nav stays centred regardless of side content width" },
                  { name: "Avatar", value: "Initials-based, h-11 w-11 rounded-full, surface-insights bg", note: "" },
                  { name: "Active tab", value: "primary text + absolute underline bar", note: "NavUnderline: h-0.5 rounded-full bg-primary at -bottom-3" },
                  { name: "Profile tab", value: "Link to /interview", note: "Other tabs link to /interview/review or are placeholder spans" },
                ]} />
              </ComponentFrame>
            </div>
          </section>

          {/* ════════════════════════════════════════ INVENTORY */}
          <section id="inventory">
            <SectionHeader
              title="Component Inventory"
              desc="Every component in the prototype. Use this as a checklist when breaking down frontend work for the dev team."
            />
            <div className="mt-6 overflow-hidden rounded-xl border border-[var(--clinical-outline)] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--clinical-outline)] bg-[var(--clinical-surface)]">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                      Component
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                      File
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPONENT_INVENTORY.map((c, i) => (
                    <tr
                      key={c.name}
                      className={`border-b border-[var(--clinical-outline)] ${i % 2 === 1 ? "bg-[var(--clinical-surface)]" : "bg-white"}`}
                    >
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs font-semibold text-[var(--clinical-primary-dark)]">
                          {c.name}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <TypeBadge type={c.type} />
                      </td>
                      <td className="px-4 py-3">
                        <code className="font-mono text-[11px] text-[var(--clinical-on-surface-variant)]">
                          {c.file}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-xs leading-5 text-[var(--clinical-on-surface-variant)]">
                        {c.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* File structure diagram */}
            <div className="mt-8">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
                File structure
              </h3>
              <div className="overflow-hidden rounded-xl border border-[var(--clinical-outline)] bg-[var(--clinical-on-surface)] p-5">
                <pre className="font-mono text-xs leading-6 text-white/80">{`src/app/
├── layout.tsx                   Root layout (Geist fonts, globals.css)
├── page.tsx                     Home / prototype entry
├── globals.css                  Tailwind + clinical CSS variables
└── interview/
    ├── layout.tsx               Inter + Public Sans font loading
    ├── page.tsx                 Question selection screen (/interview)
    ├── review/
    │   └── page.tsx             Main interview workflow (/interview/review)
    ├── InterviewHeader.tsx      Donor identity bar + tab nav
    ├── DonorProfilePanel.tsx    Editable donor profile form
    ├── CountryOfBirthPanel.tsx  Chagas country check
    ├── GuidancePanel.tsx        Right-sidebar AI guidance
    ├── interview-panel-cards.tsx  Shared card/button primitives
    ├── HazardousActivityGuidance.tsx  B5 flow
    ├── SexualContactGuidance.tsx      C14 flow
    ├── C8MultiplePartnersGuidance.tsx Stub (unused)
    ├── InterviewRoleSwitcher.tsx      Role toggle (not wired up)
    ├── data.ts                  Donor data + type definitions
    ├── session.ts               localStorage session helpers
    ├── interview-guidance.ts    Guidance aggregation logic
    └── questionnaire.content.json`}</pre>
              </div>
            </div>

            {/* Dev notes */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[var(--clinical-outline)] bg-white p-5">
                <p className="text-xs font-semibold text-[var(--clinical-on-surface)]">Refactoring opportunities</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-[var(--clinical-on-surface-variant)]">
                  <li>• Inline components in <code className="font-mono">review/page.tsx</code> should be extracted to dedicated files (e.g. <code className="font-mono">ChecklistQuestionCard.tsx</code>)</li>
                  <li>• No shared <code className="font-mono">src/components/</code> folder — all UI lives under <code className="font-mono">interview/</code></li>
                  <li>• Path alias <code className="font-mono">@/*</code> is configured but unused — adopt it</li>
                  <li>• No icon library; inline SVGs are duplicated across files (e.g. <code className="font-mono">CheckIcon</code>)</li>
                  <li>• <code className="font-mono">C8MultiplePartnersGuidance</code> is a stub that returns <code className="font-mono">null</code></li>
                  <li>• <code className="font-mono">InterviewRoleSwitcher</code> is defined but not imported anywhere</li>
                </ul>
              </div>
              <div className="rounded-xl border border-[var(--clinical-outline)] bg-white p-5">
                <p className="text-xs font-semibold text-[var(--clinical-on-surface)]">Build notes</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-[var(--clinical-on-surface-variant)]">
                  <li>• <strong>Next.js 16 / React 19</strong> — App Router, no Pages Router</li>
                  <li>• <strong>Tailwind CSS v4</strong> — no <code className="font-mono">tailwind.config.*</code> file; configured via <code className="font-mono">@theme</code> in CSS</li>
                  <li>• <strong>No UI library</strong> — shadcn, Radix, Preline not installed</li>
                  <li>• <strong>No icon library</strong> — inline SVG per file</li>
                  <li>• Fonts loaded per-layout via <code className="font-mono">next/font/google</code></li>
                  <li>• State in <code className="font-mono">localStorage</code> via <code className="font-mono">session.ts</code></li>
                  <li>• All interview components are <code className="font-mono">&quot;use client&quot;</code></li>
                </ul>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border-b border-[var(--clinical-outline)] pb-4">
      <h2 className="font-[family-name:var(--font-public-sans)] text-2xl font-semibold text-[var(--clinical-on-surface)]">
        {title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--clinical-on-surface-variant)]">{desc}</p>
    </div>
  );
}

function ComponentFrame({
  label,
  file,
  children,
}: {
  label: string;
  file: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--clinical-outline)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--clinical-outline)] px-5 py-3">
        <p className="text-sm font-semibold text-[var(--clinical-on-surface)]">{label}</p>
        <code className="rounded bg-[var(--clinical-surface)] px-2 py-0.5 text-[11px] font-mono text-[var(--clinical-on-surface-variant)]">
          {file}
        </code>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function PropsList({
  props,
}: {
  props: { name: string; value: string; note: string }[];
}) {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-[var(--clinical-outline)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--clinical-outline)] bg-[var(--clinical-surface)]">
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--clinical-on-surface-variant)]">Prop / Token</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--clinical-on-surface-variant)]">Value</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--clinical-on-surface-variant)]">Note</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p, i) => (
            <tr key={p.name} className={`border-b border-[var(--clinical-outline)] last:border-0 ${i % 2 === 1 ? "bg-[var(--clinical-surface)]" : "bg-white"}`}>
              <td className="px-3 py-2">
                <code className="font-mono text-xs font-semibold text-[var(--clinical-primary-dark)]">{p.name}</code>
              </td>
              <td className="px-3 py-2 font-mono text-xs text-[var(--clinical-on-surface-variant)]">{p.value}</td>
              <td className="px-3 py-2 text-xs text-[var(--clinical-on-surface-variant)]">{p.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TYPE_BADGE_STYLES: Record<string, string> = {
  Layout: "bg-[var(--clinical-secondary-container)] text-[var(--clinical-secondary)]",
  Panel: "bg-[var(--clinical-primary-container)] text-[var(--clinical-primary)]",
  Banner: "bg-[var(--clinical-warning-subtle)] text-[var(--clinical-warning)]",
  Card: "bg-[#f3faef] text-[var(--clinical-success)]",
  Input: "bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface-variant)]",
  Button: "bg-[var(--clinical-primary-dark)] text-white",
  Badge: "bg-[#eaedef] text-[var(--clinical-on-surface-variant)]",
  Flow: "bg-amber-50 text-amber-700",
  Utility: "bg-[var(--clinical-outline)] text-[var(--clinical-on-surface-variant)]",
};

function TypeBadge({ type }: { type: string }) {
  const style = TYPE_BADGE_STYLES[type] ?? "bg-[var(--clinical-surface-insights)] text-[var(--clinical-on-surface-variant)]";
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${style}`}>
      {type}
    </span>
  );
}
