import { siteContent } from "@/data/siteContent";
import {
  createChatMessage,
  type ChatCompletionRequest,
  type ChatCompletionResponse,
  type ChatProvider,
} from "./types";

const ENQUIRE_CTA =
  "Please use the Enquire button or the enquiry form on this site, and the Vanae team can help you personally.";

/** Unrelated / unknown questions — no confirmed brochure answer. */
const FALLBACK = `I don’t have confirmed information on that yet. ${ENQUIRE_CTA}`;

/** Pricing, investment returns, and possession — restricted topics. */
const RESTRICTED =
  `I don’t have confirmed pricing, investment, or possession information. ${ENQUIRE_CTA}`;

const SUGGESTED_QUESTIONS = [
  "What is Vanae?",
  "Where is Vanae located?",
  "What residences are available?",
  "Tell me about the clubhouse",
  "What outdoor amenities are there?",
  "What floor plans can I see?",
] as const;

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function matches(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

function outdoorAmenitySummary(): string {
  const groups = siteContent.outdoorAmenities.categories
    .map((cat) => `${cat.name}: ${cat.items.join(", ")}`)
    .join("\n");
  return `Outdoor amenities from the brochure include:\n${groups}`;
}

function clubhouseSummary(): string {
  const size = siteContent.clubhouse.sizeLabel;
  const groups = siteContent.clubhouse.categories
    .map((cat) => `${cat.name}: ${cat.items.join(", ")}`)
    .join("\n");
  return `${siteContent.clubhouse.heading} is approximately ${size}. Indoor spaces from the brochure include:\n${groups}\n\nNote: the outdoor Swimming Pool is listed under outdoor amenities; the clubhouse lists a separate indoor Pool.`;
}

function floorPlanSummary(): string {
  const master = siteContent.floorPlans.masterPlan.title;
  const units = siteContent.floorPlans.plans
    .map((p) => p.caption)
    .join("; ");
  return `You can explore the ${master.toLowerCase()} and these unit layouts on the Floor Plans section: ${units}. I don’t have pricing or possession dates in confirmed content.`;
}

function locationSummary(): string {
  const loc = siteContent.location;
  return `${loc.copy}\n\nProject site: ${loc.siteAddress}\n\nMain office: ${loc.corporateAddress}`;
}

function overviewSummary(): string {
  const o = siteContent.overview;
  const details = o.projectDetails
    .map((d) => `${d.value} ${d.label}`)
    .join(" · ");
  return `${o.paragraphs.join(" ")}\n\nAt a glance: ${details}.`;
}

function registrationSummary(): string {
  const f = siteContent.footer;
  const hmda = f.hmdaNumber
    ? `\nHMDA Application No.: ${f.hmdaNumber}`
    : "";
  return `Registration details on this site:\nRERA No.: ${f.reraNumber}${hmda}`;
}

function greetingSummary(): string {
  return `Welcome to Vanae. I’m here to help you explore the residences, amenities, floor plans and lifestyle. Ask a question or choose a suggestion below — I’ll share confirmed brochure details only. For personal assistance, use Enquire.`;
}

/**
 * Deterministic keyword routing over confirmed siteContent only.
 * Never invents prices, distances, possession, or returns.
 */
export function buildDemoReply(userText: string): string {
  const q = normalize(userText);

  if (!q) {
    return "Please type a question about VANAE, or choose one of the suggested prompts.";
  }

  if (
    matches(q, [
      "price",
      "cost",
      "rate",
      "sqft rate",
      "sq ft rate",
      "booking amount",
      "emi",
      "investment",
      "return",
      "roi",
      "possession",
      "handover",
      "ready to move",
      "discount",
    ])
  ) {
    return RESTRICTED;
  }

  if (
    /^(hi|hello|hey)\b/.test(q) ||
    matches(q, ["good morning", "good evening", "good afternoon"])
  ) {
    return greetingSummary();
  }

  if (
    matches(q, [
      "rera",
      "hmda",
      "registration",
      "approved",
      "approval",
    ])
  ) {
    return registrationSummary();
  }

  if (
    matches(q, [
      "floor plan",
      "floorplan",
      "unit plan",
      "master plan",
      "4485",
      "2555",
      "2360",
      "1765",
      "sft",
      "sq.ft",
      "sq ft",
    ])
  ) {
    return floorPlanSummary();
  }

  if (
    matches(q, [
      "clubhouse",
      "club house",
      "banquet",
      "gym",
      "spa",
      "theatre",
      "theater",
      "indoor",
    ])
  ) {
    return clubhouseSummary();
  }

  if (
    matches(q, [
      "outdoor amenit",
      "amenities",
      "amenity",
      "garden",
      "lawn",
      "swimming",
      "basketball",
      "tennis",
      "yoga",
      "landscape",
      "pet park",
    ])
  ) {
    return outdoorAmenitySummary();
  }

  if (
    matches(q, [
      "where",
      "location",
      "address",
      "kollur",
      "orr",
      "hyderabad",
      "map",
      "site",
      "office",
      "how to reach",
    ])
  ) {
    return locationSummary();
  }

  if (
    matches(q, [
      "bhk",
      "residences",
      "apartment",
      "flat",
      "home",
      "tower",
      "floor",
      "ceiling",
      "stilt",
      "family",
      "1200",
      "configuration",
    ])
  ) {
    return overviewSummary();
  }

  if (
    matches(q, [
      "what is vanae",
      "about vanae",
      "tell me about",
      "project",
      "overview",
      "vanae",
    ])
  ) {
    return overviewSummary();
  }

  if (
    matches(q, [
      "enquire",
      "inquiry",
      "enquiry",
      "contact",
      "call",
      "email",
      "whatsapp",
      "visit",
    ])
  ) {
    return "You can reach the Vanae team through the Enquire button or the enquiry section on this website. I don’t publish phone or email details that aren’t confirmed on the site.";
  }

  if (matches(q, ["thank", "thanks"])) {
    return "You’re welcome. Explore the Floor Plans, Amenities, and Clubhouse sections anytime — or ask another question.";
  }

  return FALLBACK;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * Local demo provider — no network, no API keys.
 * Replace via `getChatProvider()` when a real backend is ready.
 */
export class DemoChatProvider implements ChatProvider {
  readonly id = "demo";
  readonly displayName = "Vanae Demo Assistant";

  async complete(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const lastUser = [...request.messages]
      .reverse()
      .find((m) => m.role === "user");
    const text = lastUser?.content ?? "";

    // Brief pause so the UI can show a typing state.
    await delay(420 + Math.min(680, text.length * 8));

    return {
      message: createChatMessage("assistant", buildDemoReply(text)),
    };
  }
}

export const demoSuggestedQuestions: readonly string[] = SUGGESTED_QUESTIONS;

export const demoWelcomeMessage = greetingSummary();
