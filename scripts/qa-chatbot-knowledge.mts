import { buildDemoReply } from "../src/lib/chatbot/demoProvider.ts";
import { siteContent } from "../src/data/siteContent.ts";

type Case = {
  name: string;
  q: string;
  expectIncludes: string[];
  expectNotIncludes?: string[];
};

const tests: Case[] = [
  {
    name: "overview",
    q: "What is Vanae?",
    expectIncludes: ["3 & 4 BHK", "six towers", "36 floors", "11 ft"],
  },
  {
    name: "location",
    q: "Where is Vanae located?",
    expectIncludes: ["Kollur Exit 2", "Nagulapalli"],
  },
  {
    name: "main_office",
    q: "What is the main office address?",
    expectIncludes: ["7D, 7th floor", "Weave", "Financial District", "500089"],
  },
  {
    name: "project_site",
    q: "What is the project site address?",
    expectIncludes: ["VANAE, Kollur Exit 2", "502300"],
  },
  {
    name: "outdoor",
    q: "What outdoor amenities are there?",
    expectIncludes: ["Butterfly Garden", "Swimming Pool", "First Impressions"],
  },
  {
    name: "clubhouse",
    q: "Tell me about the clubhouse",
    expectIncludes: ["1,00,000 SFT", "Banquet Hall", "Super Gym"],
  },
  {
    name: "clubhouse_area",
    q: "How big is the clubhouse?",
    expectIncludes: ["1,00,000 SFT"],
  },
  {
    name: "floor_plans",
    q: "What floor plans can I see?",
    expectIncludes: ["4,485 SFT", "2,555 SFT", "2,360 SFT", "1,765 SFT"],
  },
  {
    name: "rera",
    q: "What is the RERA number?",
    expectIncludes: [siteContent.footer.reraNumber],
  },
  {
    name: "hmda",
    q: "What is the HMDA approval?",
    expectIncludes: [siteContent.footer.hmdaNumber, "HMDA Application"],
  },
  {
    name: "price",
    q: "What is the price per sqft?",
    expectIncludes: ["pricing"],
    expectNotIncludes: ["₹", "lakh", "crore", "1.2"],
  },
  {
    name: "possession",
    q: "When is possession?",
    expectIncludes: ["possession"],
  },
  {
    name: "roi",
    q: "What returns can I expect?",
    expectIncludes: ["investment"],
  },
  {
    name: "phone",
    q: "What is your phone number?",
    expectIncludes: ["Enquire"],
  },
  {
    name: "unrelated",
    q: "Who won the World Cup?",
    expectIncludes: ["confirmed information"],
  },
  {
    name: "whitespace",
    q: "  Where is Vanae located?  ",
    expectIncludes: ["Kollur Exit 2"],
  },
  {
    name: "empty",
    q: "   ",
    expectIncludes: ["type a question"],
  },
  {
    name: "misleading_price_assumption",
    q: "Is the starting price 1.5 crore?",
    expectIncludes: ["pricing"],
    expectNotIncludes: ["1.5", "crore"],
  },
];

let fail = 0;
for (const t of tests) {
  const a = buildDemoReply(t.q);
  const missing = t.expectIncludes.filter(
    (s) => !a.toLowerCase().includes(s.toLowerCase())
  );
  const bad = (t.expectNotIncludes || []).filter((s) =>
    a.toLowerCase().includes(s.toLowerCase())
  );
  if (missing.length || bad.length) {
    fail += 1;
    console.log("FAIL", t.name, { missing, bad, preview: a.slice(0, 220) });
  } else {
    console.log("PASS", t.name);
  }
}

console.log(fail === 0 ? "ALL_KNOWLEDGE_PASS" : `KNOWLEDGE_FAILS=${fail}`);
