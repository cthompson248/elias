import {
  clinicalInsightByFlow,
  screeningFlows,
  type DonorScreeningResponse,
  type InterviewQuestion,
  type ScreeningQuestionFlow,
} from "./data";
import type { HazardousActivityState } from "./HazardousActivityGuidance";
import {
  c8AnalSexDeclinedGuidance,
  c8AnalSexNoGuidance,
  c8AnalSexYesGuidance,
} from "./c8-multiple-partners-guidance";
import { parseC8AnalSexResponse } from "./c8-multiple-partners-guidance";
import {
  deriveC14GuidanceState,
  type C14ScenarioSelectionState,
} from "./SexualContactGuidance";
import {
  formatPrimaryDeferralSummary,
  getSexualContactGuidanceById,
} from "./sexual-contact-guidance";
import {
  getHazardousActivityById,
  hazardousActivitiesGeneralAdvice,
} from "./hazardous-activities";
import type { FollowUpCompleteVariant } from "./interview-panel-cards";

type FollowUpAnswer = { pillId: string | null; custom: string };

export type GuidanceSeverity =
  | "clear"
  | "restricted"
  | "defer"
  | "review"
  | "pending";

export type QuestionGuidanceStatus = "complete" | "incomplete" | "needs_review";

export interface QuestionGuidanceContribution {
  questionId: string;
  questionCode: string;
  flowKey?: string;
  status: QuestionGuidanceStatus;
  donorMessage: string | null;
  reasoning: string;
  reference: string;
  deferralNote?: string;
  severity: GuidanceSeverity;
  /** e.g. "three-month" — used when synthesising plasma vs whole-blood messaging */
  wholeBloodDeferralPeriod?: string;
}

export interface AggregatedInterviewGuidance {
  overallStatus:
    | "eligible"
    | "restricted"
    | "deferred"
    | "pending"
    | "review";
  /** Final donor-facing script — only set when all flagged items are resolved. */
  sayToDonor: string | null;
  /** Staff-facing prompt while follow-ups are still in progress. */
  nursePrompt: string | null;
  pendingQuestionCodes: string[];
  contributions: QuestionGuidanceContribution[];
  pendingCount: number;
}

export interface InterviewGuidanceInput {
  reviewQueue: InterviewQuestion[];
  questionResponses: Record<string, DonorScreeningResponse | null>;
  followUpAnswers: Record<string, Record<string, FollowUpAnswer>>;
  notesByQuestion: Record<string, string>;
  b5HazardousState: HazardousActivityState;
  c14Scenario: C14ScenarioSelectionState;
  c14PartnerDonor: boolean | null;
}

function areStandardFollowUpsComplete(
  flow: ScreeningQuestionFlow,
  followUpAnswers: Record<string, FollowUpAnswer>
): boolean {
  return flow.followUps.every((followUp) => {
    const answer = followUpAnswers[followUp.id];
    return Boolean(answer?.pillId || answer?.custom?.trim());
  });
}

export function isQuestionFollowUpComplete(
  question: InterviewQuestion,
  response: DonorScreeningResponse | null,
  input: Pick<
    InterviewGuidanceInput,
    | "followUpAnswers"
    | "b5HazardousState"
    | "c14Scenario"
    | "c14PartnerDonor"
    | "notesByQuestion"
  >
): boolean {
  if (response !== "yes") return response === "no";

  const flowKey = question.flowKey;
  if (!flowKey) return true;

  const flow = screeningFlows[flowKey];
  if (!flow) return true;

  const followUps = input.followUpAnswers[flowKey] ?? {};

  if (flow.hazardousActivity) {
    const { lookupAttempted, matchedId, donorDecision } = input.b5HazardousState;
    if (!lookupAttempted) return false;
    if (!matchedId) return lookupAttempted;
    return donorDecision !== null;
  }

  if (flow.sexualContactGuidance) {
    const state = deriveC14GuidanceState(
      input.c14Scenario,
      input.c14PartnerDonor
    );
    if (!state.lookupAttempted) return false;
    if (state.uncertain) return true;
    if (state.showPartnerDonorQuestion && state.partnerIsLifebloodDonor === null) {
      return false;
    }
    return true;
  }

  if (flow.c8MultiplePartnersGuidance) {
    return parseC8AnalSexResponse(followUps.c8a?.pillId) !== null;
  }

  const trigger = flow.followUpTrigger ?? flow.donorResponse;
  if (response !== trigger) return true;

  return areStandardFollowUpsComplete(flow, followUps);
}

function buildB5Contribution(
  question: InterviewQuestion,
  notes: string,
  state: HazardousActivityState
): QuestionGuidanceContribution {
  const insight = clinicalInsightByFlow.b5;
  const base = {
    questionId: question.id,
    questionCode: question.code,
    flowKey: "b5",
    reference: insight.reference,
  };

  if (!state.lookupAttempted) {
    return {
      ...base,
      status: "incomplete",
      donorMessage: null,
      reasoning:
        "Record the planned hazardous activity in interview notes and press Enter to load GSBD guidance.",
      severity: "pending",
    };
  }

  const matched = state.matchedId
    ? getHazardousActivityById(state.matchedId)
    : null;

  if (!matched) {
    return {
      ...base,
      status: notes.trim() ? "needs_review" : "incomplete",
      donorMessage: notes.trim()
        ? "I need to check with a colleague about your planned activity before we can confirm whether you can donate today."
        : null,
      reasoning:
        "No matching GSBD hazardous activity entry for the note provided. Refine the note or consult GSBD.",
      severity: notes.trim() ? "review" : "pending",
    };
  }

  const generalAdvice = hazardousActivitiesGeneralAdvice.readToDonor;

  if (state.donorDecision === null) {
    return {
      ...base,
      status: "incomplete",
      donorMessage: null,
      reasoning: `Follow GSBD steps for ${matched.label}. Read general advice to the donor, then record their decision.`,
      severity: "pending",
    };
  }

  if (state.donorDecision === "defer") {
    return {
      ...base,
      status: "complete",
      donorMessage: `You've decided not to donate today because of your planned ${matched.label.toLowerCase()} — that's the safest choice. If you change your mind about donating, you'll need to wait the period set out in our guidelines before you can give blood again.`,
      reasoning: matched.ifNotDonate,
      deferralNote: `Apply deferral ${matched.deferralCode} per GSBD.`,
      severity: "defer",
    };
  }

  return {
    ...base,
    status: "complete",
    donorMessage: `${generalAdvice} For ${matched.label.toLowerCase()}, you should wait 24 hours after donating before doing this activity — and check any rules your employer requires.`,
    reasoning: matched.ifContinueDonation,
    deferralNote: "Nurse medical note required in NBMS before proceed.",
    severity: "review",
  };
}

function buildC8Contribution(
  question: InterviewQuestion,
  followUps: Record<string, FollowUpAnswer>
): QuestionGuidanceContribution {
  const insight = clinicalInsightByFlow.c8;
  const base = {
    questionId: question.id,
    questionCode: question.code,
    flowKey: "c8",
    reference: insight.reference,
  };

  const analSexResponse = parseC8AnalSexResponse(followUps.c8a?.pillId);

  if (!analSexResponse) {
    return {
      ...base,
      status: "incomplete",
      donorMessage: null,
      reasoning:
        "Confirm whether the donor has had anal sex in the last 3 months (C8a) before determining eligibility.",
      severity: "pending",
    };
  }

  if (analSexResponse === "yes") {
    return {
      ...base,
      status: "complete",
      donorMessage:
        "Based on your responses, you're currently eligible to donate plasma, but we have a six-month deferral on whole blood.",
      reasoning: c8AnalSexYesGuidance.explanation,
      deferralNote: c8AnalSexYesGuidance.actions.allogeneic,
      reference: `GSBD · ${c8AnalSexYesGuidance.deferralCode}`,
      severity: "restricted",
      wholeBloodDeferralPeriod: "six-month",
    };
  }

  if (analSexResponse === "no") {
    return {
      ...base,
      status: "complete",
      donorMessage:
        "You haven't had anal sex in the last three months, so this answer doesn't restrict your donation — you're fine to continue on this point.",
      reasoning: c8AnalSexNoGuidance.explanation,
      severity: "clear",
    };
  }

  return {
    ...base,
    status: "needs_review",
    donorMessage:
      "I need to check with a colleague before we can confirm your eligibility on this question — I won't keep you waiting long.",
    reasoning: c8AnalSexDeclinedGuidance.explanation,
    severity: "review",
  };
}

function buildC14Contribution(
  question: InterviewQuestion,
  scenario: C14ScenarioSelectionState,
  partnerDonor: boolean | null
): QuestionGuidanceContribution {
  const insight = clinicalInsightByFlow.c14;
  const base = {
    questionId: question.id,
    questionCode: question.code,
    flowKey: "c14",
    reference: insight.reference,
  };

  const state = deriveC14GuidanceState(scenario, partnerDonor);

  if (!state.lookupAttempted) {
    return {
      ...base,
      status: "incomplete",
      donorMessage: null,
      reasoning:
        "Select the scenario options that describe the donor's situation to determine the correct GSBD pathway.",
      severity: "pending",
    };
  }

  if (state.uncertain) {
    return {
      ...base,
      status: "needs_review",
      donorMessage:
        "I'm not completely sure how your answer fits our guidelines on this one — a nurse will help us work out the next step.",
      reasoning:
        "The selected scenario could not be matched confidently to GSBD. A nurse should review before continuing.",
      severity: "review",
    };
  }

  const matched = state.matchedId
    ? getSexualContactGuidanceById(state.matchedId)
    : null;

  if (!matched) {
    return {
      ...base,
      status: "incomplete",
      donorMessage: null,
      reasoning: insight.body,
      severity: "pending",
    };
  }

  if (state.showPartnerDonorQuestion && state.partnerIsLifebloodDonor === null) {
    return {
      ...base,
      status: "incomplete",
      donorMessage: null,
      reasoning:
        "Confirm whether the partner is a current Lifeblood donor — this determines whether the deferral applies.",
      severity: "pending",
    };
  }

  if (state.showPartnerDonorQuestion && state.partnerIsLifebloodDonor === true) {
    return {
      ...base,
      status: "complete",
      donorMessage:
        "Because your partner is a current Lifeblood donor, the usual restriction for this contact may not apply — we'll confirm the details before you donate today.",
      reasoning: matched.scenarioNotePartnerIsDonor,
      reference: "GSBD — Managing exceptions to Donor Declaration question C14",
      severity: "clear",
    };
  }

  if (state.showPartnerDonorQuestion && state.partnerIsLifebloodDonor === false) {
    return {
      ...base,
      status: "complete",
      donorMessage:
        "Based on your responses, you're currently eligible to donate plasma, but we have a three-month deferral on whole blood.",
      reasoning: matched.scenarioNotePartnerNotDonor,
      deferralNote: formatPrimaryDeferralSummary(matched.actions),
      reference: `GSBD · ${matched.actions.deferralCode}`,
      severity: "restricted",
      wholeBloodDeferralPeriod: "three-month",
    };
  }

  return {
    ...base,
    status: "complete",
    donorMessage:
      "Based on your responses, you're currently eligible to donate plasma, but we have a three-month deferral on whole blood.",
    reasoning: matched.explanation,
    deferralNote: formatPrimaryDeferralSummary(matched.actions),
    reference: `GSBD · ${matched.actions.deferralCode}`,
    severity: "restricted",
    wholeBloodDeferralPeriod: "three-month",
  };
}

function buildGenericContribution(
  question: InterviewQuestion,
  flow: ScreeningQuestionFlow,
  followUps: Record<string, FollowUpAnswer>
): QuestionGuidanceContribution {
  const flowKey = question.flowKey!;
  const insight = clinicalInsightByFlow[flowKey];
  const trigger = flow.followUpTrigger ?? flow.donorResponse;
  const followUpsNeeded = flow.followUps.length > 0;

  const base = {
    questionId: question.id,
    questionCode: question.code,
    flowKey,
    reference: insight?.reference ?? "GSBD",
    reasoning: insight?.body ?? flow.flagReason,
    deferralNote: insight?.deferralNote,
  };

  if (followUpsNeeded && !areStandardFollowUpsComplete(flow, followUps)) {
    return {
      ...base,
      status: "incomplete",
      donorMessage: null,
      reasoning:
        base.reasoning +
        " Complete the follow-up questions for this item to determine eligibility.",
      severity: "pending",
    };
  }

  const donorMessage = buildGenericDonorMessage(flowKey, flow, followUps);
  const severity = inferGenericSeverity(flowKey, followUps);

  return {
    ...base,
    status: severity === "review" ? "needs_review" : "complete",
    donorMessage,
    severity,
  };
}

function buildGenericDonorMessage(
  flowKey: string,
  flow: ScreeningQuestionFlow,
  followUps: Record<string, FollowUpAnswer>
): string {
  if (flowKey === "b6") {
    const nsaid = followUps.nsaids?.pillId;
    if (nsaid === "yes-once") {
      return "You took an over-the-counter painkiller recently — that's usually fine, but we may need to check whether platelet donation is okay for you today.";
    }
    if (nsaid === "ongoing" || nsaid === "prescribed") {
      return "Because you're taking anti-inflammatory medication, we need to check what it's for and whether it affects your donation today.";
    }
    if (nsaid === "not-in-notes") {
      return "You're on medication that isn't recorded in our system yet — we'll update your records and confirm what that means for donating today.";
    }
  }

  if (flowKey === "c11" && followUps.procedure?.pillId) {
    return "Because of your recent tattoo, piercing, or acupuncture, you'll need to wait about four months from the procedure date before you can donate — we'll confirm the exact date with you.";
  }

  if (flowKey === "a15" && followUps.a15a?.pillId === "yes") {
    return "You've travelled to Papua New Guinea recently — we'll check our travel guidelines to confirm when you can donate again.";
  }

  if (flowKey === "b15") {
    return "Because of your recent pregnancy, you can't donate today — we'll explain how long you need to wait before you're eligible again.";
  }

  if (flowKey === "b2" && followUps.b2a?.pillId === "no") {
    return "You had side effects after your last donation that weren't reported to us — a nurse needs to review this with you before we can continue.";
  }

  return `We've noted your answer about ${flow.questionNumber}. I'll explain exactly what it means for your donation once we've finished reviewing your flagged items.`;
}

function inferGenericSeverity(
  flowKey: string,
  followUps: Record<string, FollowUpAnswer>
): GuidanceSeverity {
  if (flowKey === "c11" && followUps.procedure?.pillId) return "restricted";
  if (flowKey === "a15" && followUps.a15a?.pillId === "yes") return "restricted";
  if (flowKey === "b15") return "defer";
  if (flowKey === "b2" && followUps.b2a?.pillId === "no") return "review";
  if (flowKey === "b6") {
    const nsaid = followUps.nsaids?.pillId;
    if (["yes-once", "ongoing", "prescribed", "not-in-notes"].includes(nsaid ?? "")) {
      return "review";
    }
  }
  if (["a3", "b1", "b3", "b8", "b11", "b12", "b13", "b17", "c7"].includes(flowKey)) {
    return "review";
  }
  return "clear";
}

function buildQuestionContribution(
  question: InterviewQuestion,
  input: InterviewGuidanceInput
): QuestionGuidanceContribution | null {
  const response = input.questionResponses[question.id];
  if (response !== "yes") return null;

  const flowKey = question.flowKey;
  if (!flowKey) {
    return {
      questionId: question.id,
      questionCode: question.code,
      status: "complete",
      donorMessage:
        "We've noted your answer to this question — it doesn't change your eligibility on its own.",
      reasoning: "No dedicated follow-up flow configured for this question.",
      reference: "GSBD",
      severity: "clear",
    };
  }

  const flow = screeningFlows[flowKey];
  if (!flow) return null;

  const followUps = input.followUpAnswers[flowKey] ?? {};

  if (flow.hazardousActivity) {
    return buildB5Contribution(
      question,
      input.notesByQuestion[question.id] ?? "",
      input.b5HazardousState
    );
  }

  if (flow.sexualContactGuidance) {
    return buildC14Contribution(
      question,
      input.c14Scenario,
      input.c14PartnerDonor
    );
  }

  if (flow.c8MultiplePartnersGuidance) {
    return buildC8Contribution(question, followUps);
  }

  return buildGenericContribution(question, flow, followUps);
}

export function getQuestionGuidanceContribution(
  question: InterviewQuestion,
  input: InterviewGuidanceInput
): QuestionGuidanceContribution | null {
  return buildQuestionContribution(question, input);
}

export function getFollowUpCompleteVariant(
  contribution: QuestionGuidanceContribution | null
): FollowUpCompleteVariant {
  if (!contribution) return "complete";
  if (contribution.severity === "restricted") return "restricted";
  if (contribution.severity === "defer") return "defer";
  if (
    contribution.severity === "review" ||
    contribution.status === "needs_review"
  ) {
    return "review";
  }
  return "complete";
}

function formatPlasmaRestrictionMessage(period: string): string {
  return `Based on your responses, you're currently eligible to donate plasma, but we have a ${period} deferral on whole blood.`;
}

function pickStrictestDeferralPeriod(
  restricted: QuestionGuidanceContribution[]
): string {
  const order = ["six-month", "four-month", "three-month"];
  for (const period of order) {
    if (restricted.some((item) => item.wholeBloodDeferralPeriod === period)) {
      return period;
    }
  }
  return restricted[0]?.wholeBloodDeferralPeriod ?? "three-month";
}

function buildOutcomeFromComplete(
  items: QuestionGuidanceContribution[]
): string {
  const withMessages = items.filter((item) => item.donorMessage);
  if (withMessages.length === 0) {
    return "Based on your answers today, we'll confirm your eligibility before you donate.";
  }

  const hasDefer = withMessages.some((item) => item.severity === "defer");
  const restricted = withMessages.filter((item) => item.severity === "restricted");
  const review = withMessages.filter((item) => item.severity === "review");
  const allClear = withMessages.every((item) => item.severity === "clear");

  if (allClear && review.length === 0) {
    return "Based on your answers today, none of the items we reviewed change your eligibility — you're clear to continue with your donation.";
  }

  if (hasDefer && restricted.length === 0 && review.length === 0) {
    return withMessages.find((item) => item.severity === "defer")!.donorMessage!;
  }

  if (restricted.length > 0) {
    const period = pickStrictestDeferralPeriod(restricted);
    if (review.length > 0) {
      return `${formatPlasmaRestrictionMessage(period)} I just need to have a nurse review one of your answers with you before we can move forward.`;
    }
    if (restricted.length > 1) {
      return `${formatPlasmaRestrictionMessage(period)} Where more than one restriction applies, we'll follow the strictest one for your donation today.`;
    }
    return formatPlasmaRestrictionMessage(period);
  }

  if (review.length > 0) {
    if (review.length === 1) return review[0].donorMessage!;
    return "We need a nurse to review some of your answers before we can confirm your eligibility today.";
  }

  return withMessages[0].donorMessage!;
}

function formatQuestionCodeList(codes: string[]): string {
  if (codes.length === 1) return codes[0];
  if (codes.length === 2) return `${codes[0]} and ${codes[1]}`;
  return `${codes.slice(0, -1).join(", ")}, and ${codes[codes.length - 1]}`;
}

function buildTopLevelGuidance(contributions: QuestionGuidanceContribution[]): {
  sayToDonor: string | null;
  nursePrompt: string | null;
  pendingQuestionCodes: string[];
} {
  if (contributions.length === 0) {
    return {
      sayToDonor:
        "You haven't flagged any concerns on the items we've reviewed — you're clear to continue with your donation today.",
      nursePrompt: null,
      pendingQuestionCodes: [],
    };
  }

  const incomplete = contributions.filter((item) => item.status === "incomplete");
  const pendingQuestionCodes = incomplete.map((item) => item.questionCode);

  if (incomplete.length > 0) {
    const codes = formatQuestionCodeList(pendingQuestionCodes);
    return {
      sayToDonor: null,
      nursePrompt: `Complete the follow-up questions for ${codes} to see what to tell the donor.`,
      pendingQuestionCodes,
    };
  }

  const resolved = contributions.filter((item) => item.status !== "incomplete");
  return {
    sayToDonor: buildOutcomeFromComplete(resolved),
    nursePrompt: null,
    pendingQuestionCodes: [],
  };
}

function deriveOverallStatus(
  contributions: QuestionGuidanceContribution[]
): AggregatedInterviewGuidance["overallStatus"] {
  if (contributions.some((item) => item.status === "incomplete")) {
    return "pending";
  }
  if (contributions.some((item) => item.severity === "defer")) {
    return "deferred";
  }
  if (contributions.some((item) => item.severity === "restricted")) {
    return "restricted";
  }
  if (
    contributions.some(
      (item) => item.severity === "review" || item.status === "needs_review"
    )
  ) {
    return "review";
  }
  return "eligible";
}

export function buildAggregatedInterviewGuidance(
  input: InterviewGuidanceInput
): AggregatedInterviewGuidance {
  const contributions = input.reviewQueue
    .map((question) => buildQuestionContribution(question, input))
    .filter((item): item is QuestionGuidanceContribution => item !== null);

  const pendingCount = contributions.filter(
    (item) => item.status === "incomplete"
  ).length;

  const topLevel = buildTopLevelGuidance(contributions);

  return {
    overallStatus: deriveOverallStatus(contributions),
    sayToDonor: topLevel.sayToDonor,
    nursePrompt: topLevel.nursePrompt,
    pendingQuestionCodes: topLevel.pendingQuestionCodes,
    contributions,
    pendingCount,
  };
}
