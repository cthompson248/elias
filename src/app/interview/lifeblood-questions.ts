/**
 * Lifeblood donor questionnaire (Sections A, B, C) — paper form content.
 * Tablet responses are mock data until digital integration; sub-questions
 * (e.g. C7a) are handled as interview follow-ups in lifeblood-flows.ts.
 */

import type { DonorScreeningResponse, QuestionReviewStatus } from "./data";
import type { QuestionBankEntry } from "./question-bank";
import { questionDirections } from "./lifeblood-directions";

const A = "Section A · New & returned donors";
const B = "Section B · Medical questionnaire";
const C = "Section C · Donor declaration";

function entry(
  code: string,
  category: string,
  question: string,
  tablet: DonorScreeningResponse | null = "no",
  status: QuestionReviewStatus = "pending",
  flowKey?: string
): QuestionBankEntry {
  const id = code.toLowerCase();
  const dir = questionDirections[id];
  return {
    id,
    code,
    emqCode: dir?.emqCode ?? code,
    category,
    question,
    tabletResponse: tablet,
    reviewStatus: status,
    escalation: dir?.escalation ?? "dsna",
    flowKey,
    wiDirection: dir?.direction,
  };
}

/** Primary Yes/No questions only (excludes text-only items B4, A12; sub-codes are follow-ups) */
export const lifebloodQuestionBank: QuestionBankEntry[] = [
  // —— Section A ——
  entry(
    "A1",
    A,
    "Have you ever volunteered to donate blood or plasma before?",
    "no",
    "pending",
    "a1"
  ),
  entry("A2", A, "Have you ever been advised not to give blood?", "no"),
  entry(
    "A3",
    A,
    "Ever had anaemia or a blood disorder, or a serious illness, operation or hospital admission?",
    "yes",
    "clarify",
    "a3"
  ),
  entry(
    "A4",
    A,
    "Ever had stroke/epilepsy, heart or blood pressure problems, or rheumatic fever/heart murmur?",
    "no"
  ),
  entry("A5", A, "Ever had bowel disease, or lung problems including tuberculosis (TB)?", "no"),
  entry(
    "A6",
    A,
    "Ever had diabetes, a thyroid disorder, or an autoimmune disease (e.g. rheumatoid arthritis, lupus)?",
    "no"
  ),
  entry(
    "A7",
    A,
    "Ever had cancer (including melanoma), or received a transplant or graft?",
    "no"
  ),
  entry(
    "A8",
    A,
    "Ever had jaundice/hepatitis, malaria/Q fever/Chagas', or syphilis?",
    "no"
  ),
  entry(
    "A9",
    A,
    "Ever had treatment with TIGASON (Etretinate) or NEOTIGASON (Acitretin)?",
    "no"
  ),
  entry(
    "A10",
    A,
    "Neurosurgical procedure involving head, brain or spinal cord between 1972 and 1989?",
    "no"
  ),
  entry(
    "A11",
    A,
    "Received human growth hormone (short stature) or human pituitary hormone (infertility) before 1986?",
    "no"
  ),
  entry("A13", A, "Have you ever been outside Australia, including being born overseas?", "yes", "clarify"),
  entry(
    "A14",
    A,
    "Ever spent a continuous period of 6 months or more outside Australia?",
    "no"
  ),
  entry(
    "A15",
    A,
    "Been outside Australia in the last 3 years?",
    "yes",
    "attention",
    "a15"
  ),
  entry(
    "A16",
    A,
    "Ever received a transfusion or blood products in Mexico, Central or South America?",
    "no"
  ),

  // —— Section B (B4 weight omitted — free text on paper form) ——
  entry("B1", B, "Are you feeling healthy and well?", "no", "clarify", "b1"),
  entry(
    "B2",
    B,
    "Any side effects after leaving the donor centre after your last donation?",
    "no",
    "pending",
    "b2"
  ),
  entry("B3", B, "Are you allergic to the antiseptic chlorhexidine?", "yes", "clarify", "b3"),
  entry(
    "B5",
    B,
    "In the next 3 days, do you intend to participate in any activity which would place you or others at risk of injury if you were to become unwell after donating, such as driving public transport, operating heavy machinery, underwater diving, piloting a plane?",
    "yes",
    "clarify",
    "b5"
  ),
  entry(
    "B6",
    B,
    "In the last week: dental work/cleaning/fillings/extractions, aspirin/pain killers/anti-inflammatories, or cuts/abrasions/sores/rashes?",
    "yes",
    "clarify",
    "b6"
  ),
  entry(
    "B7",
    B,
    "In the last week, had gastric upset, diarrhoea, abdominal pain or vomiting?",
    "no"
  ),
  entry(
    "B8",
    B,
    "Since last donation (or last 12 months if new): unwell, seen a health practitioner, tests, or surgery?",
    "yes",
    "clarify",
    "b8"
  ),
  entry(
    "B9",
    B,
    "Since last donation (or last 12 months if new): chest pain/angina or irregular heartbeat?",
    "no"
  ),
  entry(
    "B10",
    B,
    "Since last donation (or last 12 months if new): shingles/chickenpox or immunisations (other than flu vaccine in Australia)?",
    "no"
  ),
  entry(
    "B11",
    B,
    "Since last donation (or last 12 months if new): sexually transmitted infection (e.g. syphilis, gonorrhoea, genital herpes)?",
    "yes",
    "clarify",
    "b11"
  ),
  entry(
    "B12",
    B,
    "Since last donation (or last 12 months if new): any medication (regular, trial, acne/skin)?",
    "yes",
    "clarify",
    "b12"
  ),
  entry(
    "B13",
    B,
    "Since last donation (or last 12 months if new): PrEP for HIV, or injectable medications?",
    "no",
    "pending",
    "b13"
  ),
  entry(
    "B14",
    B,
    "Family history of CJD, GSS, or fatal familial insomnia?",
    "no"
  ),
  entry(
    "B15",
    B,
    "Since last donation (or last 12 months if new): been pregnant (including miscarriage/termination)?",
    "no",
    "pending",
    "b15"
  ),
  entry("B16", B, "Been in Papua New Guinea (PNG) in the last 3 years?", "no"),
  entry(
    "B17",
    B,
    "Since your last donation, have you been outside Australia?",
    "yes",
    "attention",
    "b17"
  ),
  entry(
    "B18",
    B,
    "Since your last donation, received a transfusion or injection of blood or blood products?",
    "no"
  ),

  // —— Section C ——
  entry(
    "C1",
    C,
    "EVER thought you could be infected with HIV or have AIDS?",
    "no"
  ),
  entry(
    "C2",
    C,
    "EVER had a test showing hepatitis B, hepatitis C, HIV or HTLV?",
    "no"
  ),
  entry(
    "C3",
    C,
    'In the last 5 years, "used drugs" by injection or been injected with non-prescribed drugs?',
    "no"
  ),
  entry(
    "C4",
    C,
    "In the last 12 months, illness with both a rash AND swollen glands (with or without fever)?",
    "no"
  ),
  entry(
    "C5",
    C,
    "In the last 12 months, imprisoned or held in lock-up/detention?",
    "no"
  ),
  entry(
    "C6",
    C,
    "In the last 12 months, (yellow) jaundice or hepatitis, or contact with someone who has?",
    "no"
  ),
  entry(
    "C7",
    C,
    "In the last 6 months, sex (excluding oral) with someone new?",
    "yes",
    "clarify",
    "c7"
  ),
  entry(
    "C8",
    C,
    "In the last 6 months, sex (excluding oral) with more than one person?",
    "no",
    "pending",
    "c8"
  ),
  entry(
    "C9",
    C,
    "In the last 4 months, injured with a used needle (needlestick)?",
    "no"
  ),
  entry(
    "C10",
    C,
    "In the last 4 months, blood splash to eyes, mouth, nose or broken skin?",
    "no"
  ),
  entry(
    "C11",
    C,
    "In the last 4 months, tattoo, body/ear piercing or acupuncture?",
    "yes",
    "clarify",
    "c11"
  ),
  entry("C12", C, "In the last 4 months, had a blood transfusion?", "no"),
  entry(
    "C13",
    C,
    "In the last 3 months, sexual activity with someone who tested positive for hep B/C, HIV or HTLV?",
    "no"
  ),
  entry(
    "C14",
    C,
    'Have you engaged in sexual activity with someone who has ever "used drugs" by injection or been injected, even once, with drugs not prescribed by a doctor or dentist?',
    "no"
  ),
];
