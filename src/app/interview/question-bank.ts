import type { InterviewQuestion, QuestionReviewStatus } from "./data";
import type { DonorScreeningResponse } from "./data";

export interface QuestionBankEntry {
  id: string;
  /** Short code shown to nurses, e.g. MED-07 */
  code: string;
  category: string;
  question: string;
  reviewStatus: QuestionReviewStatus;
  tabletResponse: DonorScreeningResponse | null;
  flowKey?: string;
}

type Row = [
  id: string,
  code: string,
  category: string,
  question: string,
  tablet: DonorScreeningResponse | null,
  status: QuestionReviewStatus,
  flowKey?: string,
];

function row(...args: Row): QuestionBankEntry {
  const [id, code, category, question, tabletResponse, reviewStatus, flowKey] =
    args;
  return {
    id,
    code,
    category,
    question,
    tabletResponse,
    reviewStatus,
    flowKey,
  };
}

/** Full screening form — tablet responses simulate future API payload */
export const questionBank: QuestionBankEntry[] = [
  // General health (8)
  row("feeling-well", "GH-01", "General health", "Are you feeling well today?", "yes", "ok"),
  row("sleep", "GH-02", "General health", "Slept at least 5 hours last night?", "yes", "ok"),
  row("eaten", "GH-03", "General health", "Eaten in the last 4 hours?", "yes", "ok"),
  row("flu-symptoms", "GH-04", "General health", "Any cold or flu symptoms in the last 7 days?", "no", "ok"),
  row("fever", "GH-05", "General health", "Had a fever in the last 2 weeks?", "no", "ok"),
  row("cough", "GH-06", "General health", "Persistent cough in the last 4 weeks?", "no", "pending"),
  row("weight-loss", "GH-07", "General health", "Unexplained weight loss in the last 6 months?", "no", "pending"),
  row("fatigue", "GH-08", "General health", "Unusual fatigue affecting daily activities?", "no", "pending"),

  // Medical history (6)
  row("chronic", "MH-01", "Medical history", "Diagnosed with any chronic condition?", "no", "pending"),
  row("heart", "MH-02", "Medical history", "Heart, lung, or blood vessel disease?", "no", "pending"),
  row("cancer", "MH-03", "Medical history", "Cancer or malignant disorder?", "no", "pending"),
  row("diabetes", "MH-04", "Medical history", "Diabetes or thyroid disorder?", "no", "pending"),
  row("anemia", "MH-05", "Medical history", "Anemia or blood disorder?", "no", "pending"),
  row("epilepsy", "MH-06", "Medical history", "Epilepsy, seizures, or fainting?", "yes", "clarify"),

  // Medications (5)
  row("medications", "MED-07", "Medications", "Taken any medication in the last 14 days?", "yes", "clarify", "medications"),
  row("antibiotics", "MED-08", "Medications", "Antibiotics in the last 2 weeks?", "no", "pending"),
  row("blood-thinners", "MED-09", "Medications", "Blood-thinning medication?", "no", "pending"),
  row("nsaids", "MED-10", "Medications", "Aspirin or anti-inflammatories in 48 hours?", "yes", "attention"),
  row("acne-meds", "MED-11", "Medications", "Acne medication (e.g. isotretinoin)?", "no", "pending"),

  // Travel (5)
  row("travel", "TR-12", "Travel", "Traveled outside the country in the last 3 years?", "yes", "attention"),
  row("malaria", "TR-13", "Travel", "Travel to malaria-risk region in last 6 months?", "no", "pending"),
  row("hepatitis-contact", "TR-14", "Travel", "Contact with hepatitis while abroad?", "no", "pending"),
  row("transfusion-abroad", "TR-15", "Travel", "Blood transfusion outside the UK?", "no", "pending"),
  row("uk-resident", "TR-16", "Travel", "UK resident for at least 12 months?", "yes", "ok"),

  // Lifestyle (6)
  row("tattoos", "LS-17", "Lifestyle", "New tattoos or piercings in the last 4 months?", "no", "pending"),
  row("acupuncture", "LS-18", "Lifestyle", "Acupuncture in the last 4 months?", "no", "pending"),
  row("alcohol", "LS-19", "Lifestyle", "Alcohol in the last 24 hours?", "no", "pending"),
  row("smoking", "LS-20", "Lifestyle", "Smoke or vape?", "yes", "ok"),
  row("drugs-iv", "LS-21", "Lifestyle", "Intravenous recreational drugs?", "no", "pending"),
  row("prison", "LS-22", "Lifestyle", "Imprisoned for more than 72 hours?", "no", "pending"),

  // Sexual history (4)
  row("sexual", "SH-23", "Sexual history", "Any new sexual partners in the last 3 months?", "yes", "clarify"),
  row("sti", "SH-24", "Sexual history", "Treated for STI in the last 12 months?", "no", "pending"),
  row("prep", "SH-25", "Sexual history", "Taking PrEP or PEP?", "no", "pending"),
  row("sex-work", "SH-26", "Sexual history", "Sex work or paid for sex in last 12 months?", "no", "pending"),

  // Recent procedures (4)
  row("dental", "RP-27", "Recent procedures", "Surgery or dental work in the last 6 months?", "yes", "clarify", "dental"),
  row("surgery", "RP-28", "Recent procedures", "Major surgery in the last 6 months?", "no", "pending"),
  row("vaccination", "RP-29", "Recent procedures", "Vaccination in the last 4 weeks?", "yes", "ok"),
  row("endoscopy", "RP-30", "Recent procedures", "Endoscopy in the last 6 months?", "no", "pending"),

  // Disclosure & eligibility (10)
  row("disclosure", "DC-31", "Disclosure", "Anything else we should know about your health?", "yes", "attention"),
  row("pregnancy", "DC-32", "Disclosure", "Pregnant or breastfeeding?", "no", "pending"),
  row("donated-before", "DC-33", "Disclosure", "Donated blood before?", "yes", "ok"),
  row("donation-gap", "DC-34", "Disclosure", "Donated in the last 12 weeks?", "no", "ok"),
  row("id-present", "DC-35", "Disclosure", "Valid photo ID presented?", "yes", "ok"),
  row("consent", "DC-36", "Disclosure", "Consent form signed?", "yes", "ok"),
  row("hemoglobin", "DC-37", "Disclosure", "Haemoglobin within range today?", "yes", "ok"),
  row("arm-check", "DC-38", "Disclosure", "Arm inspection satisfactory?", "yes", "ok"),
  row("deferral-history", "DC-39", "Disclosure", "Previously deferred from donation?", "no", "pending"),
  row("interview-complete", "DC-40", "Disclosure", "Waiting-room questionnaire complete?", "yes", "ok"),
];

export function questionBankToInterview(entry: QuestionBankEntry): InterviewQuestion {
  return {
    id: entry.id,
    code: entry.code,
    category: entry.category,
    question: entry.question,
    reviewStatus: entry.reviewStatus,
    tabletResponse: entry.tabletResponse,
    flowKey: entry.flowKey,
  };
}

export function groupBankByCategory(
  entries: QuestionBankEntry[]
): { category: string; questions: QuestionBankEntry[] }[] {
  const order: string[] = [];
  const map = new Map<string, QuestionBankEntry[]>();
  for (const q of entries) {
    if (!map.has(q.category)) {
      map.set(q.category, []);
      order.push(q.category);
    }
    map.get(q.category)!.push(q);
  }
  return order.map((category) => ({
    category,
    questions: map.get(category)!,
  }));
}
