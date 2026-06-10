"use client";

import { useMemo, useState } from "react";
import {
  donationTypeOptions,
  donor,
  type DonationType,
  type DonorProfileDetails,
  type DonorSex,
} from "./data";

type EditableField = keyof Pick<
  DonorProfileDetails,
  | "donorNumber"
  | "sex"
  | "donationType"
  | "heightCm"
  | "weightKg"
  | "dateOfBirth"
  | "aboGroup"
>;

export function DonorProfilePanel() {
  const [profile, setProfile] = useState<DonorProfileDetails>(donor.profile);

  function updateField<K extends EditableField>(
    field: K,
    value: DonorProfileDetails[K]
  ) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  const heightImperial = useMemo(
    () => formatHeightImperial(profile.heightCm),
    [profile.heightCm]
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <section className="rounded-lg border border-[var(--clinical-outline)] bg-white p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
          Donor details
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          <ProfileField label="Donor number">
            <input
              type="text"
              value={profile.donorNumber}
              onChange={(e) => updateField("donorNumber", e.target.value)}
              className={profileInputClassName}
            />
          </ProfileField>

          <ProfileField label="Sex">
            <div className="relative">
              <select
                value={profile.sex}
                onChange={(e) =>
                  updateField("sex", e.target.value as DonorSex | "")
                }
                className={`${profileInputClassName} appearance-none pr-14`}
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {profile.sex && (
                <button
                  type="button"
                  aria-label="Clear sex"
                  onClick={() => updateField("sex", "")}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-[var(--clinical-on-surface-variant)] hover:text-[var(--clinical-on-surface)]"
                >
                  <ClearIcon className="h-3.5 w-3.5" />
                </button>
              )}
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--clinical-on-surface-variant)]" />
            </div>
          </ProfileField>

          <ProfileField label="Date of birth">
            <input
              type="text"
              value={profile.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
              placeholder="DD/MM/YYYY"
              className={profileInputClassName}
            />
          </ProfileField>

          <ProfileField label="ABO Group">
            <input
              type="text"
              value={profile.aboGroup}
              onChange={(e) => updateField("aboGroup", e.target.value)}
              className={profileInputClassName}
            />
          </ProfileField>

          <ProfileField label="Type">
            <div className="relative">
              <select
                value={profile.donationType}
                onChange={(e) =>
                  updateField(
                    "donationType",
                    e.target.value as DonationType | ""
                  )
                }
                className={`${profileInputClassName} appearance-none pr-8 ${
                  profile.donationType === ""
                    ? "text-[var(--clinical-on-surface-variant)]"
                    : ""
                }`}
              >
                <option value="">Select Type</option>
                {donationTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--clinical-on-surface-variant)]" />
            </div>
          </ProfileField>

          <ProfileField label="Height (cm)">
            <input
              type="text"
              inputMode="numeric"
              value={profile.heightCm}
              onChange={(e) => updateField("heightCm", e.target.value)}
              className={profileInputClassName}
            />
            {heightImperial && (
              <p className="mt-1 text-[11px] text-[var(--clinical-on-surface-variant)]">
                {heightImperial}
              </p>
            )}
          </ProfileField>

          <ProfileField label="Weight (kg)">
            <input
              type="text"
              inputMode="numeric"
              value={profile.weightKg}
              onChange={(e) => updateField("weightKg", e.target.value)}
              className={profileInputClassName}
            />
          </ProfileField>
        </div>
      </section>
    </div>
  );
}

const profileInputClassName =
  "w-full rounded-md border border-[var(--clinical-outline)] bg-white px-2.5 py-2 text-sm text-[var(--clinical-on-surface)] outline-none focus:border-[var(--clinical-on-surface)] focus:ring-1 focus:ring-[var(--clinical-on-surface)]";

function ProfileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-[var(--clinical-on-surface-variant)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function formatHeightImperial(heightCm: string): string | null {
  const cm = Number.parseFloat(heightCm);
  if (!Number.isFinite(cm) || cm <= 0) return null;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}' ${inches}"`;
}

function ClearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
