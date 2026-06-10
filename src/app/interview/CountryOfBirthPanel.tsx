"use client";

import { useState } from "react";
import {
  COMMON_COUNTRIES,
  searchCountries,
  type Country,
} from "./country-of-birth";

interface Props {
  selectedCode: string | null;
  onSelect: (code: string | null) => void;
}

export function CountryOfBirthPanel({ selectedCode, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const searchResults = query.trim() ? searchCountries(query) : [];
  // Resolve selected country — check common list, then search results, then full list
  const allResolved = [...COMMON_COUNTRIES, ...searchResults];
  const selectedCountry = selectedCode
    ? (allResolved.find((c) => c.code === selectedCode) ??
      { code: selectedCode, name: selectedCode, chagasRisk: false })
    : null;

  function handleSelect(country: Country) {
    if (selectedCode === country.code) {
      onSelect(null);
    } else {
      onSelect(country.code);
      setQuery("");
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-white">
      <div>

      {/* Header */}
      <div className="shrink-0 border-b border-[var(--clinical-outline)] px-8 py-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
          Mandatory nurse question
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-public-sans)] text-2xl font-semibold leading-tight text-[var(--clinical-on-surface)]">
          What is your country of birth?
        </h1>
        <p className="mt-2 text-sm text-[var(--clinical-on-surface-variant)]">
          Used to identify Chagas disease risk. Select from the list below or
          search by country name.
        </p>
      </div>

      {/* Search */}
      <div className="shrink-0 px-8 pt-5">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--clinical-on-surface-variant)]" />
          <input
            type="search"
            placeholder="Search countries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--clinical-outline)] bg-white py-2.5 pl-9 pr-4 text-sm text-[var(--clinical-on-surface)] outline-none focus:border-[var(--clinical-on-surface)] focus:ring-1 focus:ring-[var(--clinical-on-surface)] placeholder:text-[var(--clinical-on-surface-variant)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--clinical-on-surface-variant)] hover:text-[var(--clinical-on-surface)]"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Selected badge */}
      {selectedCountry && (
        <div className="shrink-0 px-8 pt-4">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${
              selectedCountry.chagasRisk
                ? "border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)] text-[var(--clinical-warning)]"
                : "clinical-toggle-yes-selected"
            }`}
          >
            {selectedCountry.chagasRisk && (
              <AlertIcon className="h-3.5 w-3.5 shrink-0" />
            )}
            {selectedCountry.name}
            {selectedCountry.chagasRisk && (
              <span className="font-semibold">— Chagas risk</span>
            )}
            <button
              type="button"
              aria-label="Clear selection"
              onClick={() => onSelect(null)}
              className="ml-1 opacity-60 hover:opacity-100"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Search results */}
      {searchResults.length > 0 ? (
        <div className="px-8 pt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
            Search results
          </p>
          <div className="flex flex-wrap gap-2">
            {searchResults.map((country) => (
              <CountryChip
                key={country.code}
                country={country}
                selected={selectedCode === country.code}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      ) : query.trim() ? (
        <div className="px-8 pt-4 text-sm text-[var(--clinical-on-surface-variant)]">
          No countries found for &ldquo;{query}&rdquo;.
        </div>
      ) : null}

      {/* Common countries */}
      {!query.trim() && (
        <div className="px-8 pt-5 pb-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--clinical-on-surface-variant)]">
            Common countries
          </p>
          <div className="flex flex-wrap gap-2">
            {COMMON_COUNTRIES.map((country) => (
              <CountryChip
                key={country.code}
                country={country}
                selected={selectedCode === country.code}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Result card — shown once a country is selected */}
      {selectedCountry && (
        <div className="px-8 pt-5 pb-8">
          <article
            className={`rounded-xl border p-5 ${
              selectedCountry.chagasRisk
                ? "border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)]/90"
                : "border-[#a8e0cc] bg-[#D6F4EA]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
                  selectedCountry.chagasRisk
                    ? "bg-[var(--clinical-warning)]"
                    : "bg-[#0D7A5E]"
                }`}
              >
                {selectedCountry.chagasRisk ? (
                  <AlertIcon className="h-5 w-5" />
                ) : (
                  <CheckIcon className="h-5 w-5" />
                )}
              </span>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    selectedCountry.chagasRisk
                    ? "text-[var(--clinical-warning)]"
                    : "text-[#0D7A5E]"
                  }`}
                >
                  {selectedCountry.chagasRisk
                    ? "Chagas risk country"
                    : "Not a Chagas risk country"}
                </p>
                <p className="mt-0.5 text-sm text-[var(--clinical-on-surface-variant)]">
                  {selectedCountry.chagasRisk
                    ? "See the Guidance panel for the required action."
                    : `${selectedCountry.name} is not an endemic region for Chagas disease.`}
                </p>
              </div>
            </div>
          </article>
        </div>
      )}

      </div>
    </div>
  );
}

function CountryChip({
  country,
  selected,
  onSelect,
}: {
  country: Country;
  selected: boolean;
  onSelect: (c: Country) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(country)}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        selected
          ? country.chagasRisk
            ? "border-[var(--clinical-warning-subtle-border)] bg-[var(--clinical-warning-subtle)] text-[var(--clinical-warning)]"
            : "clinical-toggle-yes-selected"
          : country.chagasRisk
          ? "border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-300 hover:bg-orange-100"
          : "border-[var(--clinical-outline)] bg-white text-[var(--clinical-on-surface)] hover:border-[var(--clinical-on-surface-variant)]"
      }`}
    >
      {country.chagasRisk && (
        <AlertIcon className="h-3.5 w-3.5 shrink-0" />
      )}
      {country.name}
    </button>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
