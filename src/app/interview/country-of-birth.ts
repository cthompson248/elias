/**
 * Country data for the "Country of Birth" nurse mandatory question.
 * Chagas-endemic countries are flagged per WHO / GSBD guidance.
 */

export interface Country {
  code: string;
  name: string;
  /** True if this country is a Chagas disease endemic region. */
  chagasRisk: boolean;
}

/** Countries shown as quick-pick tiles before any search input. */
export const COMMON_COUNTRIES: Country[] = [
  { code: "AU", name: "Australia", chagasRisk: false },
  { code: "NZ", name: "New Zealand", chagasRisk: false },
  { code: "GB", name: "United Kingdom", chagasRisk: false },
  { code: "IN", name: "India", chagasRisk: false },
  { code: "CN", name: "China", chagasRisk: false },
  { code: "PH", name: "Philippines", chagasRisk: false },
  { code: "VN", name: "Vietnam", chagasRisk: false },
  { code: "IT", name: "Italy", chagasRisk: false },
  { code: "GR", name: "Greece", chagasRisk: false },
  { code: "IE", name: "Ireland", chagasRisk: false },
  { code: "ZA", name: "South Africa", chagasRisk: false },
  { code: "US", name: "United States", chagasRisk: false },
  { code: "CA", name: "Canada", chagasRisk: false },
  { code: "DE", name: "Germany", chagasRisk: false },
  { code: "NL", name: "Netherlands", chagasRisk: false },
  { code: "LK", name: "Sri Lanka", chagasRisk: false },
];

/** Full country list — Chagas-endemic countries included and flagged. */
export const ALL_COUNTRIES: Country[] = [
  // Common donor countries first
  ...COMMON_COUNTRIES,

  // Africa
  { code: "EG", name: "Egypt", chagasRisk: false },
  { code: "ET", name: "Ethiopia", chagasRisk: false },
  { code: "GH", name: "Ghana", chagasRisk: false },
  { code: "KE", name: "Kenya", chagasRisk: false },
  { code: "NG", name: "Nigeria", chagasRisk: false },
  { code: "TZ", name: "Tanzania", chagasRisk: false },
  { code: "UG", name: "Uganda", chagasRisk: false },
  { code: "ZW", name: "Zimbabwe", chagasRisk: false },

  // Asia
  { code: "BD", name: "Bangladesh", chagasRisk: false },
  { code: "FJ", name: "Fiji", chagasRisk: false },
  { code: "HK", name: "Hong Kong", chagasRisk: false },
  { code: "ID", name: "Indonesia", chagasRisk: false },
  { code: "JP", name: "Japan", chagasRisk: false },
  { code: "KR", name: "South Korea", chagasRisk: false },
  { code: "MY", name: "Malaysia", chagasRisk: false },
  { code: "MM", name: "Myanmar", chagasRisk: false },
  { code: "NP", name: "Nepal", chagasRisk: false },
  { code: "PK", name: "Pakistan", chagasRisk: false },
  { code: "SG", name: "Singapore", chagasRisk: false },
  { code: "TH", name: "Thailand", chagasRisk: false },
  { code: "TW", name: "Taiwan", chagasRisk: false },

  // Europe
  { code: "AT", name: "Austria", chagasRisk: false },
  { code: "BE", name: "Belgium", chagasRisk: false },
  { code: "BG", name: "Bulgaria", chagasRisk: false },
  { code: "HR", name: "Croatia", chagasRisk: false },
  { code: "CY", name: "Cyprus", chagasRisk: false },
  { code: "CZ", name: "Czech Republic", chagasRisk: false },
  { code: "DK", name: "Denmark", chagasRisk: false },
  { code: "EE", name: "Estonia", chagasRisk: false },
  { code: "FI", name: "Finland", chagasRisk: false },
  { code: "FR", name: "France", chagasRisk: false },
  { code: "HU", name: "Hungary", chagasRisk: false },
  { code: "IS", name: "Iceland", chagasRisk: false },
  { code: "LT", name: "Lithuania", chagasRisk: false },
  { code: "LU", name: "Luxembourg", chagasRisk: false },
  { code: "MT", name: "Malta", chagasRisk: false },
  { code: "NO", name: "Norway", chagasRisk: false },
  { code: "PL", name: "Poland", chagasRisk: false },
  { code: "PT", name: "Portugal", chagasRisk: false },
  { code: "RO", name: "Romania", chagasRisk: false },
  { code: "RS", name: "Serbia", chagasRisk: false },
  { code: "SK", name: "Slovakia", chagasRisk: false },
  { code: "SI", name: "Slovenia", chagasRisk: false },
  { code: "ES", name: "Spain", chagasRisk: false },
  { code: "SE", name: "Sweden", chagasRisk: false },
  { code: "CH", name: "Switzerland", chagasRisk: false },
  { code: "UA", name: "Ukraine", chagasRisk: false },

  // Middle East
  { code: "AF", name: "Afghanistan", chagasRisk: false },
  { code: "IQ", name: "Iraq", chagasRisk: false },
  { code: "IR", name: "Iran", chagasRisk: false },
  { code: "LB", name: "Lebanon", chagasRisk: false },
  { code: "SA", name: "Saudi Arabia", chagasRisk: false },
  { code: "TR", name: "Turkey", chagasRisk: false },

  // Pacific
  { code: "PG", name: "Papua New Guinea", chagasRisk: false },
  { code: "WS", name: "Samoa", chagasRisk: false },
  { code: "TO", name: "Tonga", chagasRisk: false },

  // Chagas-endemic Latin America — flagged ⚠️
  { code: "MX", name: "Mexico", chagasRisk: true },
  { code: "GT", name: "Guatemala", chagasRisk: true },
  { code: "BZ", name: "Belize", chagasRisk: true },
  { code: "HN", name: "Honduras", chagasRisk: true },
  { code: "SV", name: "El Salvador", chagasRisk: true },
  { code: "NI", name: "Nicaragua", chagasRisk: true },
  { code: "CR", name: "Costa Rica", chagasRisk: true },
  { code: "PA", name: "Panama", chagasRisk: true },
  { code: "CO", name: "Colombia", chagasRisk: true },
  { code: "VE", name: "Venezuela", chagasRisk: true },
  { code: "EC", name: "Ecuador", chagasRisk: true },
  { code: "PE", name: "Peru", chagasRisk: true },
  { code: "BO", name: "Bolivia", chagasRisk: true },
  { code: "BR", name: "Brazil", chagasRisk: true },
  { code: "PY", name: "Paraguay", chagasRisk: true },
  { code: "UY", name: "Uruguay", chagasRisk: true },
  { code: "AR", name: "Argentina", chagasRisk: true },
  { code: "CL", name: "Chile", chagasRisk: true },
  { code: "GY", name: "Guyana", chagasRisk: true },
  { code: "SR", name: "Suriname", chagasRisk: true },
];

export function searchCountries(query: string): Country[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) || c.code.toLowerCase().startsWith(q)
  ).slice(0, 12);
}

export function getCountryByCode(code: string): Country | undefined {
  return ALL_COUNTRIES.find((c) => c.code === code);
}

export const CHAGAS_RISK_COUNTRIES: Country[] = ALL_COUNTRIES.filter(
  (c) => c.chagasRisk
);

export const CHAGAS_GUIDANCE = {
  action:
    "Check NBMS for an existing Chagas screen. If no prior screen, flag for Chagas deferral assessment per GSBD — Chagas disease (Trypanosoma cruzi) guidelines.",
  reasoning:
    "Chagas disease (Trypanosoma cruzi) is endemic in Latin America. Donors born in endemic countries require screening to prevent transfusion-transmitted infection. A prior negative screen on record does not exempt the donor from reassessment if travel or other risk factors have changed.",
  reference: "GSBD — Chagas disease (Trypanosoma cruzi)",
};
