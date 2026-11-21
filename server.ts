import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Project Innocence",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// Paralegal Chat endpoint
app.post("/api/paralegal/chat", async (req, res) => {
  try {
    const { messages, caseContext } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Messages array is required." });
      return;
    }

    const ai = getGenAI();

    // Prepare case context string
    let contextStr = "";
    if (caseContext) {
      contextStr = `\n--- ACTIVE CASE CONTEXT ("PROJECT INNOCENCE") ---
Total Defense Evidence Items Logged: ${caseContext.defenseEvidenceCount || 0}
Total Opposing / Conjured Claims Logged: ${caseContext.opposingCount || 0}
Case Overview / Focus: ${caseContext.caseSummary || "Active defense investigation & innocence verification"}
Defense Evidence Highlights:
${Array.isArray(caseContext.defenseItems) ? caseContext.defenseItems.map((item: any, idx: number) => `  ${idx + 1}. [${item.category || "General"}] "${item.title}": ${item.description} (Exculpatory Value: ${item.exculpatoryRating || "High"})`).join("\n") : "None logged yet."}

Opposing Claims / Potential Fabrications:
${Array.isArray(caseContext.opposingItems) ? caseContext.opposingItems.map((item: any, idx: number) => `  ${idx + 1}. [${item.threatLevel || "Threat"}] Allegation: "${item.title}" - Reality / Counter: ${item.counterStrategy || "Pending rebuttal"}`).join("\n") : "None logged yet."}

Referenced Statutes / Rules of Evidence:
${Array.isArray(caseContext.referencedLaws) ? caseContext.referencedLaws.map((l: any) => `  - ${l.title} (${l.citation}): ${l.ruleSummary}`).join("\n") : "Standard Constitutional & Federal Rules of Evidence Apply"}
---------------------------------------------\n`;
    }

    const systemInstruction = `You are a dedicated, meticulous, and empowering senior criminal and civil defense paralegal for "Project Innocence".
Your mission is to help the accused or their defense team systematically organize evidence, preserve an airtight defense timeline, dismantle false or manufactured claims, identify exculpatory proof, and navigate evidentiary rules.

Your key competencies:
1. EXCULPATORY EVIDENCE PRESERVATION: How to document alibis, digital metadata, chain of custody, GPS, phone logs, and surveillance preservation letters (spoliation letters).
2. DISMANTLING CONJURED / OPPOSING CLAIMS: Identify hearsay (FRE 801/802), lack of foundation, inconsistent statements (FRE 613), impeachment targets (FRE 608/609), fabrication motives, and fabrication vulnerabilities.
3. CONSTITUTIONAL DEFENSE & BRADY MATERIAL: Apply Brady v. Maryland (exculpatory duty), Giglio v. United States (impeachment duty), 4th Amendment exclusionary rule (Mapp v. Ohio), 5th Amendment Miranda / due process, and 6th Amendment Confrontation Clause (Crawford v. Washington).
4. DEFENSE DRAFTING & STRATEGY: Help outline motions (Motion to Suppress, Motion in Limine, Brady Disclosure Demand, Subpoena Duces Tecum) and cross-examination questions.

Guidelines:
- Ground your answers in the user's active case context provided above when relevant.
- Be structured, clear, and proactive. Use markdown formatting with bolding, numbered steps, bullet points, and clean headings.
- If the user asks about an opposing claim, dissect how to counter it with both affirmative defense evidence and evidentiary challenges.
- Provide a brief, professional note that your assistance is for defense organization and paralegal support, to be finalized with licensed defense counsel.`;

    if (!ai) {
      // Fallback if API key is not configured yet
      const lastUserMessage = messages[messages.length - 1]?.content || "";
      const fallbackReply = generateParalegalFallback(lastUserMessage, caseContext);
      res.json({ reply: fallbackReply });
      return;
    }

    // Format chat history into Gemini prompt
    const conversationHistory = messages.map((m: { role: string; content: string }) => {
      const speaker = m.role === "assistant" ? "Paralegal Assistant" : "Defense User";
      return `${speaker}: ${m.content}`;
    }).join("\n\n");

    const prompt = `${contextStr}
Here is the ongoing conversation:
${conversationHistory}

Please provide your paralegal response to the latest query from the Defense User:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    const reply = response.text || "I have reviewed your case details and am ready to assist with further evidentiary analysis.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Paralegal chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate paralegal response.",
    });
  }
});

// Deep Evidence Analysis Endpoint
app.post("/api/paralegal/analyze", async (req, res) => {
  try {
    const { item, type } = req.body;
    if (!item) {
      res.status(400).json({ error: "Item to analyze is required." });
      return;
    }

    const ai = getGenAI();

    const systemInstruction = `You are a senior criminal defense paralegal. You are conducting an in-depth evidentiary stress-test and legal analysis of an item in Project Innocence. Return structured markdown with:
1. **Evidentiary Weight & Admissibility Analysis** (Rules of Evidence, authenticity, hearsay exceptions or objections).
2. **Vulnerabilities & Anticipated Opposing Attacks** (How the opposing party will try to challenge or spin this).
3. **Actionable Hardening Steps & Subpoenas** (Preservation letters, corroborating records to subpoena, witness affidavits to secure).
4. **Recommended Defense Motions / Next Steps** (e.g., Motion in Limine, Brady demand, chain of custody affidavit).`;

    const prompt = type === "opposing"
      ? `Conduct a deep vulnerability and rebuttal analysis on this OPPOSING / CONJURED CLAIM:
Title: ${item.title}
Alleged Claim / Fabricated Scenario: ${item.description || "N/A"}
Opposing Party / Originator: ${item.source || "Unknown"}
Threat Level: ${item.threatLevel || "High"}
Proposed Counter Strategy: ${item.counterStrategy || "None yet"}
Identified Contradictions: ${item.inconsistencies || "None logged"}

How do we completely dismantle this claim in court?`
      : `Conduct an evidentiary hardening and exculpatory analysis on this DEFENSE EVIDENCE:
Title: ${item.title}
Category: ${item.category || "General"}
Description: ${item.description || "N/A"}
Date & Time Anchor: ${item.timestamp || "Unspecified"}
Source / Custodian: ${item.source || "Defendant"}
Exculpatory Value: ${item.exculpatoryRating || "High"}
Notes: ${item.notes || "None"}

How do we maximize its courtroom impact and protect it from exclusion?`;

    if (!ai) {
      const fallbackAnalysis = `### Evidentiary Hardening Report for "${item.title}"

#### 1. Evidentiary Weight & Admissibility
- **Legal Character**: ${type === "opposing" ? "Anticipated Opposing Exhibit / Allegation" : "Affirmative Exculpatory Evidence"}
- **Federal Rules of Evidence Relevance**: Under FRE 401 and 402, this is directly material to establishing the factual defense.
- **Authenticity (FRE 901)**: Ensure a certified custodian affidavit (FRE 902(11) for business records) or original digital metadata (hashes) is retained.

#### 2. Anticipated Vulnerabilities
- ${type === "opposing" ? "Opposing side will attempt to establish credibility through circumstantial narrative and potential biased witness testimony." : "The prosecution or plaintiff may argue lack of direct eyewitness corroboration or attempt to challenge time synchronization."}
- Look for gaps between physical digital records and sworn deposition statements.

#### 3. Actionable Defense Steps
1. Issue an immediate **Evidence Preservation / Spoliation Notice** to third-party custodians.
2. Draft a formal **Sworn Declaration under penalty of perjury** memorializing exact recollection while fresh.
3. Cross-reference with phone carrier CDR logs, Google Takeout location history, or merchant POS timestamp logs.

#### 4. Recommended Motions
- ${type === "opposing" ? "**Motion in Limine**: Move to exclude under FRE 403 (unfair prejudice) or FRE 802 (inadmissible hearsay without recognized exception)." : "**Notice of Alibi / Defense Disclosure**: Provide timely reciprocal discovery under local criminal/civil rules to prevent preclusion at trial."}`;
      res.json({ analysis: fallbackAnalysis });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ analysis: response.text || "Analysis complete." });
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to generate legal analysis." });
  }
});

// Helper for offline / pre-API-key fallback responses
function generateParalegalFallback(userQuery: string, context?: any): string {
  const queryLower = userQuery.toLowerCase();
  
  if (queryLower.includes("brady") || queryLower.includes("prosecution") || queryLower.includes("hide")) {
    return `### Brady v. Maryland & Exculpatory Disclosure Protocol

Under the landmark Supreme Court precedent in **Brady v. Maryland, 373 U.S. 83 (1963)** and **Giglio v. United States, 405 U.S. 150 (1972)**:
- **Constitutional Duty**: The government has an affirmative, non-delegable duty under the Due Process Clause of the 14th Amendment to disclose *all* evidence favorable to the defense that is material to either guilt or punishment.
- **Kyles v. Whitley (1995)**: This duty extends to all evidence known to police officers and state investigators, not just the prosecutors.
- **Recommended Action**:
  1. Draft a **Specific Brady / Giglio Request** requesting all officer disciplinary records, conflicting witness 911 statements, notes from initial witness canvassing, and any incentives or deals given to cooperating witnesses.
  2. Maintain a chronological tracking log in your **My Evidence Vault** noting any withheld reports.`;
  }

  if (queryLower.includes("hearsay") || queryLower.includes("rumor") || queryLower.includes("he said")) {
    return `### Hearsay Analysis (Federal Rules of Evidence 801-805)

Hearsay is an out-of-court statement offered in court to prove the truth of the matter asserted (FRE 801(c)). It is generally **inadmissible** under FRE 802 unless a specific exception applies.

**Key Objections & Defense Filters:**
1. **Lack of Personal Knowledge (FRE 602)**: If the opposing party's witness did not witness the act firsthand, their testimony is speculative and inadmissible.
2. **Hearsay Within Hearsay (FRE 805)**: If an opposing document quotes a third party, each layer must independently qualify under an exception.
3. **Confrontation Clause (Crawford v. Washington, 541 U.S. 36)**: In criminal cases, "testimonial" hearsay cannot be admitted against the defendant unless the declarant is unavailable and the defense had a prior opportunity for cross-examination.`;
  }

  if (queryLower.includes("fabricat") || queryLower.includes("conjure") || queryLower.includes("lie") || queryLower.includes("false")) {
    return `### Strategy for Dismantling Conjured or Fabricated Claims

When countering manufactured or conjured evidence:
1. **Lock in the Details Immediately**: Get their statements pinned down early (via initial police report, text messages, or preliminary hearing testimony). Fabricated stories break down under microscopic chronological scrutiny.
2. **Forensic Digital Audit**:
   - Fabricated text messages, screenshots, or receipts lack native server-side logs. Subpoena certified raw telecom records (AT&T, Verizon, Apple Cloud, Google).
   - Check photo EXIF metadata (lens type, GPS coordinates, camera model, compression artifacts).
3. **Motive & Bias (FRE 608 / 609 / 613)**:
   - Document any financial dispute, custody battle, jealousy, or pending civil litigation that establishes motive to fabricate.
4. **Alibi Overlap**: Cross-link your affirmative proof in the **My Evidence Vault** to establish that their alleged sequence was physically or temporally impossible.`;
  }

  return `### Paralegal Case Organization Response

Thank you for providing this update. As your Project Innocence paralegal assistant, here is our recommended defense workflow:

1. **Vault Integration**:
   - Ensure every physical receipt, timestamped GPS point, and text screenshot is entered into **"My Evidence Vault"**.
   - Note the exact custodian and date secured to preserve strict **Chain of Custody (FRE 901)**.
2. **Opposing Claims Pre-Emption**:
   - For every accusation you suspect the opposing party may conjure up, log it under **"Opposing & Conjured Evidence"**.
   - Map out your counter-evidence and identify contradictory statements or hearsay defects.
3. **Legal Foundations**:
   - Review the **Law Library** tab for relevant motions (e.g., Motion in Limine to exclude prejudicial claims, or Motion to Suppress).

*Tip: You can ask me to draft specific witness questions, outline a Brady discovery demand, or analyze any specific piece of evidence.*`;
}

// Florida Clerk of Courts API Endpoints
app.get("/api/florida-courts/directory", (_req, res) => {
  const circuits = [
    { circuit: "1st Judicial Circuit", counties: ["Escambia", "Okaloosa", "Santa Rosa", "Walton"], clerkPortal: "Escambia Clerk / Tyler Odyssey" },
    { circuit: "2nd Judicial Circuit", counties: ["Leon (Tallahassee)", "Franklin", "Gadsden", "Jefferson", "Liberty", "Wakulla"], clerkPortal: "Leon County Clerk Public Records" },
    { circuit: "4th Judicial Circuit", counties: ["Duval (Jacksonville)", "Clay", "Nassau"], clerkPortal: "Duval CORE & Clerk Portal" },
    { circuit: "6th Judicial Circuit", counties: ["Pinellas (Clearwater/St. Pete)", "Pasco"], clerkPortal: "Pinellas Odyssey Public Access" },
    { circuit: "9th Judicial Circuit", counties: ["Orange (Orlando)", "Osceola"], clerkPortal: "MyOrangeClerk & OpenRecords API" },
    { circuit: "11th Judicial Circuit", counties: ["Miami-Dade (Miami)"], clerkPortal: "Miami-Dade County Clerk Online System (COC)" },
    { circuit: "13th Judicial Circuit", counties: ["Hillsborough (Tampa)"], clerkPortal: "Hillsborough HOVER & Odyssey Portal" },
    { circuit: "15th Judicial Circuit", counties: ["Palm Beach (West Palm Beach)"], clerkPortal: "Palm Beach eCaseView Portal" },
    { circuit: "17th Judicial Circuit", counties: ["Broward (Fort Lauderdale)"], clerkPortal: "Broward County Clerk Case Search" },
    { circuit: "18th Judicial Circuit", counties: ["Brevard (Titusville/Melbourne)", "Seminole (Sanford)"], clerkPortal: "Brevard / Seminole Clerk Portal" },
    { circuit: "20th Judicial Circuit", counties: ["Lee (Fort Myers)", "Collier (Naples)", "Charlotte", "Hendry", "Glades"], clerkPortal: "Lee / Collier County Clerk Portal" },
  ];

  res.json({
    statewidePortal: "https://www.myflcourtaccess.com",
    portalName: "Florida Courts E-Filing Portal (Statewide FCCC)",
    statutoryFramework: "Fla. R. Crim. P. 3.220 & Fla. Stat. § 119",
    circuits,
  });
});

app.post("/api/florida-courts/lookup", async (req, res) => {
  try {
    const { ucn, county, division } = req.body;

    // Default sample if empty or user tests with sample
    const targetUcn = (ucn || "13-2025-CF-004182-A001-HC").trim().toUpperCase();
    const targetCounty = county || "Hillsborough";
    const targetDivision = division || "Circuit Criminal (Felony)";

    // Parse Florida UCN parts
    // Florida UCN format: CC-YYYY-DD-SSSSSS-XXXX-XX
    const ucnRegex = /^([0-9]{2})-?([0-9]{4})-?([A-Za-z]{2})-?([0-9]{6})-?([A-Za-z0-9]{4})-?([A-Za-z0-9]{2})$/;
    const matches = targetUcn.match(ucnRegex);

    let countyCode = "13";
    let filingYear = "2025";
    let divisionCode = "CF";
    let seqNumber = "004182";

    if (matches) {
      countyCode = matches[1];
      filingYear = matches[2];
      divisionCode = matches[3].toUpperCase();
      seqNumber = matches[4];
    }

    const isBrevard = targetCounty.toLowerCase().includes("brevard") || countyCode === "05";
    const circuitName = isBrevard ? "18th Judicial Circuit (Brevard & Seminole Counties)" :
             targetCounty.includes("Miami") ? "11th Judicial Circuit" :
             targetCounty.includes("Broward") ? "17th Judicial Circuit" :
             targetCounty.includes("Hillsborough") ? "13th Judicial Circuit" :
             targetCounty.includes("Orange") ? "9th Judicial Circuit" :
             targetCounty.includes("Palm Beach") ? "15th Judicial Circuit" :
             targetCounty.includes("Duval") ? "4th Judicial Circuit" : "18th Judicial Circuit (Brevard County)";

    const judgeName = isBrevard ? "Hon. Charles G. Crawford, Circuit Court Judge" : "Hon. Marcus E. Vance, Circuit Court Judge";
    const stateAtty = isBrevard 
      ? "Office of the State Attorney, 18th Judicial Circuit (Phil Archer, State Attorney)" 
      : `Office of the State Attorney, ${targetCounty} County (State of Florida)`;
    const hearingCourtroom = isBrevard
      ? "Courtroom 3-A, Harry T. and Harriette V. Moore Justice Center, 2825 Judge Fran Jamieson Way, Viera, FL 32940"
      : "Courtroom 4-C, George Edgecomb Courthouse";

    // Generate comprehensive, authentic Florida court case record grounded in Florida procedural rules
    const courtCase = {
      ucn: targetUcn,
      county: isBrevard ? "Brevard (Titusville/Viera)" : targetCounty,
      circuit: circuitName,
      division: targetDivision,
      courtType: divisionCode === "CF" ? "Circuit Court (Felony Division)" : "County Court (Misdemeanor Division)",
      caseStatus: "Active / Pre-Trial Discovery Phase",
      presidingJudge: judgeName,
      stateAttorneyOffice: stateAtty,
      clerkOfCourt: isBrevard ? "Rachel M. Sadoff, Clerk of the Circuit Court & Comptroller, Brevard County" : `Clerk of the Circuit Court, ${targetCounty} County`,
      filingDate: `${filingYear}-10-18`,
      nextHearing: {
        type: "Pre-Trial Disposition & Calendar Call",
        date: "2026-10-14 09:30 AM",
        courtroom: hearingCourtroom,
      },
      discoveryStatus: {
        demandFiled: true,
        demandDate: `${filingYear}-10-24`,
        stateDisclosureReceived: true,
        stateDisclosureDeadline: `${filingYear}-11-08`,
        alibiNoticeFiled: false,
        alibiDeadline: "10 days prior to trial (Fla. R. Crim. P. 3.200)",
        rule3220Compliance: "overdue_disclosure",
      },
      docketEntries: [
        {
          id: "fl-doc-01",
          docketIndex: 1,
          dateFiled: `${filingYear}-10-18`,
          title: "Information / Charging Document Filed",
          filingParty: "State of Florida",
          documentType: "information_indictment",
          description: "Formal Information filed by Assistant State Attorney. Count 1: Alleged offense under Fla. Stat. § 812.014. Bond set at $5,000.",
          pageCount: 3,
          isOpposingThreat: true,
        },
        {
          id: "fl-doc-02",
          docketIndex: 2,
          dateFiled: `${filingYear}-10-20`,
          title: "Notice of Appearance & Written Plea of Not Guilty",
          filingParty: "Defense",
          documentType: "pleading",
          description: "Notice of Appearance of Defense Counsel and written entry of Not Guilty plea. Waiver of formal arraignment.",
          pageCount: 2,
          isOpposingThreat: false,
        },
        {
          id: "fl-doc-03",
          docketIndex: 3,
          dateFiled: `${filingYear}-10-24`,
          title: "Defense Notice of Discovery & Demand for Favorable Evidence (Fla. R. Crim. P. 3.220)",
          filingParty: "Defense",
          documentType: "notice_discovery",
          description: "Formal invocation of Florida reciprocal discovery rule 3.220. Specifically demanding CAD 911 audio recordings, officer body-worn camera (BWC), and all exculpatory material under Brady v. Maryland.",
          pageCount: 6,
          exculpatoryRelevance: "Demands all Brady/Giglio impeachment materials within 15 days.",
          isOpposingThreat: false,
        },
        {
          id: "fl-doc-04",
          docketIndex: 4,
          dateFiled: `${filingYear}-11-06`,
          title: "State's Response to Demand for Discovery (First Disclosure)",
          filingParty: "State of Florida",
          documentType: "witness_list",
          description: "State's list of Category A, B, and C witnesses. Includes arresting deputy and complaining witness. Attached initial incident report. Note: 911 dispatch audio omitted from disclosure.",
          pageCount: 14,
          exculpatoryRelevance: "Missing 911 CAD recording and BWC video constitutes incomplete Rule 3.220 compliance.",
          isOpposingThreat: true,
        },
        {
          id: "fl-doc-05",
          docketIndex: 5,
          dateFiled: `${filingYear}-11-20`,
          title: "Defense Motion to Compel Brady Material & Evidence Preservation",
          filingParty: "Defense",
          documentType: "motion",
          description: "Defense motion requesting court order compelling the State Attorney and Sheriff's Office to produce unedited 911 call logs and store surveillance footage prior to automated purge cycles.",
          pageCount: 5,
          exculpatoryRelevance: "Protects against evidence spoliation.",
          isOpposingThreat: false,
        },
        {
          id: "fl-doc-06",
          docketIndex: 6,
          dateFiled: `${filingYear}-12-04`,
          title: "Court Order Granting Defense Motion to Compel Discovery",
          filingParty: "Presiding Judge",
          documentType: "order",
          description: "Order signed by Hon. Marcus E. Vance directing State Attorney to disclose all CAD logs, merchant surveillance video, and officer disciplinary summaries within 10 days.",
          pageCount: 2,
          exculpatoryRelevance: "Court order enforcing mandatory disclosure of corroborating defense proof.",
          isOpposingThreat: false,
        },
        {
          id: "fl-doc-07",
          docketIndex: 7,
          dateFiled: `${filingYear}-12-18`,
          title: "State's Supplemental Discovery Disclosure & Exhibit List",
          filingParty: "State of Florida",
          documentType: "witness_list",
          description: "State adds second witness statement and screenshot of alleged text messages provided by complaining witness. (Evidentiary foundation contested by defense).",
          pageCount: 8,
          isOpposingThreat: true,
        },
        {
          id: "fl-doc-08",
          docketIndex: 8,
          dateFiled: "2026-01-15",
          title: "Defense Subpoena Duces Tecum for Cellular Tower & Geolocation Data",
          filingParty: "Defense",
          documentType: "subpoena",
          description: "Subpoena issued to Verizon Wireless / Apple Inc. demanding certified CDR and location records for the defendant's mobile device to substantiate affirmative alibi defense.",
          pageCount: 4,
          exculpatoryRelevance: "Provides objective digital proof of defendant's physical location at time of incident.",
          isOpposingThreat: false,
        },
        {
          id: "fl-doc-09",
          docketIndex: 9,
          dateFiled: "2026-02-10",
          title: "Minute Order: Pre-Trial Conference Continued to Calendar Call",
          filingParty: "Clerk of Court",
          documentType: "minute_entry",
          description: "Court in session. Assistant State Attorney and Defense Counsel present. Motion in limine schedule set. Calendar call confirmed for Courtroom 4-C.",
          pageCount: 1,
          isOpposingThreat: false,
        },
      ],
    };

    res.json({
      success: true,
      case: courtCase,
      source: "Florida Courts Unified Case Query Service (Simulated Live Feed with FCCC Rule 3.220 Schema)",
    });
  } catch (err: any) {
    console.error("Florida court lookup error:", err);
    res.status(500).json({ error: err.message || "Failed to query Florida court docket." });
  }
});

app.post("/api/florida-courts/draft-notice", async (req, res) => {
  try {
    const { type, caseData, alibiDetails } = req.body;
    const ai = getGenAI();

    const prompt = type === "alibi"
      ? `Draft a formal, professional FLORIDA RULE OF CRIMINAL PROCEDURE 3.200 NOTICE OF ALIBI for filing with the Clerk of Court.
Court: IN THE CIRCUIT COURT OF THE ${caseData?.circuit || "13TH JUDICIAL CIRCUIT"} IN AND FOR ${caseData?.county || "HILLSBOROUGH"} COUNTY, FLORIDA.
Case Number / UCN: ${caseData?.ucn || "13-2025-CF-004182-A001-HC"}
State of Florida v. Defendant
Alibi Details: ${alibiDetails || "Defendant was at a distinct geographic location, supported by digital POS receipt and verified third-party witnesses."}
Include the formal legal caption, statement of alibi under Rule 3.200, names and addresses of alibi witnesses, and certificate of service on the Office of the State Attorney.`
      : `Draft a formal, hard-hitting FLORIDA RULE OF CRIMINAL PROCEDURE 3.220 WRITTEN DEMAND FOR DISCOVERY & BRADY/GIGLIO EXCULPATORY EVIDENCE for filing with the Florida Clerk of Courts.
Court: IN THE CIRCUIT COURT OF THE ${caseData?.circuit || "13TH JUDICIAL CIRCUIT"} IN AND FOR ${caseData?.county || "HILLSBOROUGH"} COUNTY, FLORIDA.
Case Number / UCN: ${caseData?.ucn || "13-2025-CF-004182-A001-HC"}
State of Florida v. Defendant
Demand specific production of:
1. Category A, B, and C witness statements and notes.
2. CAD 911 audio recordings and radio dispatch logs.
3. Law enforcement body-worn camera (BWC) and dashcam video.
4. All favorable and exculpatory evidence under Brady v. Maryland, 373 U.S. 83 (1963) and Kyles v. Whitley, 514 U.S. 419 (1995).
5. All impeachment and witness incentive materials under Giglio v. United States, 405 U.S. 150 (1972).
Include formal caption, legal authorities, and certificate of service.`;

    if (!ai) {
      // High-grade legal template fallback
      const fallbackDraft = type === "alibi"
        ? `IN THE CIRCUIT COURT OF THE ${caseData?.circuit || "13TH JUDICIAL CIRCUIT"}\nIN AND FOR ${caseData?.county?.toUpperCase() || "HILLSBOROUGH"} COUNTY, FLORIDA\n\nSTATE OF FLORIDA,\n    Plaintiff,\n\nv.                                    CASE NO. / UCN: ${caseData?.ucn || "13-2025-CF-004182-A001-HC"}\n                                      DIVISION: CRIMINAL\n[DEFENDANT NAME],\n    Defendant.\n___________________________________/\n\nDEFENDANT'S NOTICE OF ALIBI PURSUANT TO FLA. R. CRIM. P. 3.200\n\nCOMES NOW the Defendant, by and through undersigned counsel, and pursuant to Rule 3.200 of the Florida Rules of Criminal Procedure, hereby provides formal notice of Defendant's intention to claim an alibi defense at the trial of this cause, and states:\n\n1. At the time of the alleged offense, Defendant was not present at the location alleged in the Information.\n2. Specifically, Defendant was present at [Insert Specific Location, Address, Business], engaged in [Brief Activity].\n3. The names and contact addresses of witnesses by whom the Defendant proposes to establish the alibi are:\n   a. [Witness 1 Name, Address, Phone]\n   b. [Witness 2 Name, Address, Phone]\n   c. Custodian of Records, [Business / Entity holding timestamped records]\n4. Documentary corroboration includes timestamped digital records, POS receipts, and telecommunications geolocation data.\n\nCERTIFICATE OF SERVICE\nI HEREBY CERTIFY that a true and correct copy of the foregoing has been electronically furnished via the Florida Courts E-Filing Portal to the Office of the State Attorney, on this _____ day of ____________, 2026.\n\nRespectfully submitted,\n/s/ Defense Counsel / Pro Se`
        : `IN THE CIRCUIT COURT OF THE ${caseData?.circuit || "13TH JUDICIAL CIRCUIT"}\nIN AND FOR ${caseData?.county?.toUpperCase() || "HILLSBOROUGH"} COUNTY, FLORIDA\n\nSTATE OF FLORIDA,\n    Plaintiff,\n\nv.                                    CASE NO. / UCN: ${caseData?.ucn || "13-2025-CF-004182-A001-HC"}\n                                      DIVISION: CRIMINAL\n[DEFENDANT NAME],\n    Defendant.\n___________________________________/\n\nDEFENDANT'S NOTICE OF DISCOVERY AND WRITTEN DEMAND FOR EXCULPATORY EVIDENCE (FLA. R. CRIM. P. 3.220 & BRADY v. MARYLAND)\n\nCOMES NOW the Defendant, and serves this Notice of Discovery pursuant to Rule 3.220(a) of the Florida Rules of Criminal Procedure and the Fourteenth Amendment of the United States Constitution, demanding that the State Attorney disclose and permit inspection, copying, testing, and photographing of the following within fifteen (15) days:\n\n1. Category A, B, and C witnesses under Fla. R. Crim. P. 3.220(b)(1)(A).\n2. All written, recorded, or oral statements of the Defendant and co-defendants.\n3. All electronic recordings, including CAD 911 dispatch tapes, radio transmissions, Body-Worn Camera (BWC) footage, and cruiser video.\n4. All tangible evidence and photographs intended to be used at hearing or trial.\n5. SPECIFIC BRADY DEMAND: All evidence or information within the possession, custody, or control of the State Attorney, law enforcement agencies, or state witnesses that tends to negate the guilt of the accused, reduce punishment, or impeach state witnesses pursuant to Brady v. Maryland, 373 U.S. 83 (1963), Giglio v. United States, 405 U.S. 150 (1972), and Kyles v. Whitley, 514 U.S. 419 (1995).\n\nCERTIFICATE OF SERVICE\nFurnished via Florida Courts E-Filing Portal to the State Attorney's Office.`;
      
      res.json({ draft: fallbackDraft });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Florida criminal defense attorney and paralegal specializing in Florida Rules of Criminal Procedure. Return perfectly formatted Florida court pleadings with captions, statutory citations, and certificates of service.",
        temperature: 0.2,
      },
    });

    res.json({ draft: response.text || "Draft generated successfully." });
  } catch (err: any) {
    console.error("Florida motion draft error:", err);
    res.status(500).json({ error: err.message || "Failed to generate motion draft." });
  }
});

// Records & Body Camera Request Center AI Drafting Endpoint
app.post("/api/records-request/draft", async (req, res) => {
  try {
    const { 
      requestType, 
      agencyName, 
      agencyType, 
      incidentDate, 
      timeWindow, 
      officersInvolved, 
      badgeNumbers, 
      incidentNumber, 
      location, 
      priority,
      specificNeeds,
      statuteBasis 
    } = req.body;

    const ai = getGenAI();

    const systemInstruction = `You are a premier senior criminal defense investigator and legal drafting specialist for "Project Innocence".
You draft authoritative, formally formatted public records demands, body camera preservation notices, and subpoenas designed to:
1. Compel disclosure of law enforcement body-worn camera (BWC), dashcam, 911 CAD audio, merchant CCTV, or disciplinary records.
2. Put the recipient on binding legal notice of an affirmative Duty to Preserve (Litigation Hold / Anti-Spoliation).
3. Warn of sanctions under Brady v. Maryland, Kyles v. Whitley, and adverse inference jury instructions if automated overwrite loops delete the footage.
4. Cite relevant public records statutes (e.g. Florida Sunshine Law Chapter 119, Fla. Stat. § 943.1718, FOIA 5 U.S.C. § 552, or Common Law subpoena standards).

Provide a complete, ready-to-mail/serve legal document with formal header, recipient address block, statement of statutory authority, itemized request list, litigation hold/spoliation warnings, and signature line.`;

    const prompt = `Draft a formal, hard-hitting records demand / evidence preservation notice for:
- Request Type: ${requestType || "Body-Worn Camera (BWC) Footage"}
- Recipient Agency / Entity: ${agencyName || "City Police Department / Public Records Unit"}
- Entity Type: ${agencyType || "Law Enforcement Agency"}
- Incident Date: ${incidentDate || "October 12, 2025"}
- Time Frame / Window: ${timeWindow || "19:00 - 21:00 EST"}
- Officers / Deputies Involved: ${officersInvolved || "Arresting & Assisting Officers"}
- Badge / ID Numbers: ${badgeNumbers || "Unknown / Requested"}
- Police CAD / Incident Report #: ${incidentNumber || "Pending disclosure"}
- Exact Location: ${location || "Scene of the alleged incident"}
- Priority Level: ${priority || "Emergency Evidence Preservation Hold"}
- Governing Statute / Authority: ${statuteBasis || "Florida Sunshine Law (Chapter 119, Fla. Stat.) & Due Process Clause"}
- Specific Defense Focus / Exculpatory Details: ${specificNeeds || "Secure all unedited audio/video before automated retention purge cycle deletes exculpatory material."}

Format as an official legal document with all necessary legal protections against premature deletion.`;

    if (!ai) {
      const fallbackLetter = `FORMAL NOTICE OF EVIDENCE PRESERVATION & PUBLIC RECORDS DEMAND
PURSUANT TO ${statuteBasis || "CHAPTER 119, FLORIDA STATUTES"} AND CONSTITUTIONAL DUE PROCESS

TO: Custodian of Public Records / Legal Bureau
AGENCY / ENTITY: ${agencyName || "Law Enforcement Agency / Records Division"}
INCIDENT / REPORT NO: ${incidentNumber || "Incident Date " + (incidentDate || "Pending")}
DATE OF INCIDENT: ${incidentDate || "October 12, 2025"}
TIME SPAN COVERED: ${timeWindow || "All relevant hours surrounding incident"}
LOCATION: ${location || "Location of incident and transport route"}
OFFICERS / PERSONNEL INVOLVED: ${officersInvolved || "All dispatched units, including badge " + (badgeNumbers || "assigned")}

DEMAND FOR PUBLIC RECORDS & DIGITAL RECORDINGS:
Pursuant to ${statuteBasis || "Chapter 119, Florida Statutes (Public Records Act)"}, the Sixth and Fourteenth Amendments to the United States Constitution, and the landmark doctrines of Brady v. Maryland, 373 U.S. 83 (1963) and Kyles v. Whitley, 514 U.S. 419 (1995), formal demand is hereby made for electronic inspection and certified copies of the following:

1. All Body-Worn Camera (BWC) audio and video recordings captured by all officers, deputies, supervisors, and assisting personnel who responded, arrived on scene, or participated in transport or booking.
2. All in-car cruiser dashcam video, vehicle interior/backseat prisoner transport recordings, and ambient microphone transmissions.
3. Complete, unedited Computer-Aided Dispatch (CAD) incident logs, including dispatcher keystrokes, unit arrival timestamps, and initial 911 caller audio recordings.
4. Any and all digital metadata, hash verification values, and chain-of-custody tracking logs associated with these digital media files.
5. Specific focus: ${specificNeeds || "All exculpatory audio/video establishing physical demeanors, timeline, and absence of unlawful conduct."}

EMERGENCY NOTICE TO SUSPEND ROUTINE PURGING & PREVENT SPOLIATION:
BE ADVISED that this matter involves an active criminal defense investigation. You are hereby placed on FORMAL LEGAL NOTICE that you are under an affirmative, non-delegable legal duty to PRESERVE all relevant audio, video, electronic dispatch, and documentary materials.
You are strictly instructed to:
A. IMMEDIATELY FLAG this incident and all associated media files as "EVIDENTIARY HOLD / LITIGATION PENDING" to bypass and suspend any standard 30-day, 60-day, or 90-day automated purge/overwrite loops.
B. Prohibit any routine deletion, editing, redaction, or transfer that could alter native file checksums or metadata.
C. Failure to preserve these exculpatory records will constitute deliberate spoliation of evidence, entitling the defense to dismissal of charges, suppression of state testimony, and an adverse inference instruction against the prosecution.

METHOD OF PRODUCTION:
Please furnish these records electronically via secure digital download link or encrypted flash media. If any statutory exemptions are asserted under public records law, you are required to specify the exact statutory citation and provide a detailed privilege log within the statutory timeframe.

Dated this _____ day of _______________, 2026.

Respectfully submitted,
Defense Team & Legal Records Coordinator
Project Innocence Defense Network`;

      res.json({ letter: fallbackLetter });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.25,
      },
    });

    res.json({ letter: response.text || "Letter drafted successfully." });
  } catch (err: any) {
    console.error("Records request draft error:", err);
    res.status(500).json({ error: err.message || "Failed to generate records demand." });
  }
});

// Brevard County Clerk & API Info endpoint
app.get("/api/florida-courts/brevard-info", (_req, res) => {
  res.json({
    county: "Brevard County",
    countyCode: "05",
    circuit: "18th Judicial Circuit (Brevard and Seminole)",
    clerk: "Rachel M. Sadoff, Clerk of the Circuit Court and Comptroller",
    publicSearchUrl: "https://vweb1.brevardclerk.us/psi/",
    officialPortal: "https://www.brevardclerk.us",
    inmateSearchUrl: "https://www.brevardsheriff.com/home/how-do-i/inmate-search/",
    statewideEPortal: "https://www.myflcourtaccess.com",
    apiAvailability: {
      hasOpenPublicRestApi: false,
      reason: "Florida Supreme Court Administrative Order AOSC15-18 and Fla. R. Gen. Prac. & Jud. Admin. 2.420 restrict open public automated REST API access to protect confidential filings and victim privacy.",
      authorizedApiAccess: "Florida attorneys and justice partners may query Brevard dockets programmatically via the statewide Florida Court Clerks & Comptrollers (FCCC) CCIS Web API.",
      publicDirectAccess: "Public case search is freely accessible via the Brevard Clerk Odyssey Web Portal without authentication.",
    },
    courthouses: [
      { name: "Harry T. and Harriette V. Moore Justice Center", address: "2825 Judge Fran Jamieson Way, Viera, FL 32940", division: "Main Felony / Criminal Division" },
      { name: "Titusville Historic Courthouse", address: "506 S Palm Ave, Titusville, FL 32796", division: "North Brevard Branch" },
      { name: "Melbourne Courthouse", address: "51 S Nieman Ave, Melbourne, FL 32901", division: "South Brevard Branch" },
    ],
    stateAttorney: "Office of the State Attorney, 18th Judicial Circuit (Phil Archer, State Attorney)",
    sampleUcn: "05-2025-CF-028419-AXXX-XX",
  });
});

// Florida Criminal Punishment Code (CPC) Scoresheet AI Audit
app.post("/api/scoresheet/analyze", async (req, res) => {
  try {
    const { scoresheet, totals } = req.body;
    if (!scoresheet || !totals) {
      res.status(400).json({ error: "Scoresheet state and totals are required." });
      return;
    }

    const ai = getGenAI();

    const systemInstruction = `You are a premier senior Florida criminal defense paralegal and appellate legal analyst specializing in the Florida Criminal Punishment Code (Fla. R. Crim. P. 3.704 & 3.992 / Fla. Stat. § 921.0024).
Analyze the defense sentencing scoresheet for strategic leverage, state over-scoring risks, evidentiary objections, and statutory downward departure viability under Fla. Stat. § 921.0026.
Format your output in professional Markdown with clear section headers, bolding, and bullet points:
1. **SENTENCING THRESHOLD & EXPOSURE AUDIT** (Explain the Lowest Permissible Sentence vs Non-Prison eligibility, and maximum exposure).
2. **VULNERABILITIES & OVER-SCORING OBJECTIONS** (Scrutinize victim injury scoring under Wendt v. State, 10-year prior record decay under § 921.0021(5), and legal status proof).
3. **DOWNWARD DEPARTURE STRATEGY (§ 921.0026)** (Evaluate the defense's asserted departure grounds and evidentiary burdens).
4. **RECOMMENDED DEFENSE COUNSEL MOTIONS & PLEA LEVERAGE** (Concrete action steps for counsel to reduce points or secure a non-state prison disposition).`;

    const prompt = `Review this Florida Criminal Punishment Code Scoresheet calculation for:
Defendant: ${scoresheet.defendantName || "Defendant"}
Case Number: ${scoresheet.courtCaseNumber || "N/A"}
County / Circuit: ${scoresheet.county || "Florida"}
Judge: ${scoresheet.judgeName || "Assigned Circuit Judge"}

SCORESHEET METRICS:
- Primary Offense: ${scoresheet.primaryOffense?.statute} - ${scoresheet.primaryOffense?.description} [Level ${scoresheet.primaryOffense?.level}, Degree: ${scoresheet.primaryOffense?.degree}] = ${totals.primaryPoints} pts
- Additional Offenses Points: ${totals.additionalPoints} pts (${scoresheet.additionalOffenses?.length || 0} additional counts)
- Victim Injury Points: ${totals.victimInjuryPoints} pts (Slight: ${scoresheet.victimInjury?.slight}, Moderate: ${scoresheet.victimInjury?.moderate}, Severe: ${scoresheet.victimInjury?.severe}, Death: ${scoresheet.victimInjury?.death})
- Prior Record Points: ${totals.priorRecordPoints} pts (Misdemeanors: ${scoresheet.priorRecord?.misdemeanors})
- Legal Status Violation: ${scoresheet.legalStatus?.active ? "Active (+4.0 pts)" : "None (0.0 pts)"}
- Community Sanctions: ${totals.communitySanctionPoints} pts
- Enhancements: ${totals.enhancementPoints} pts (Firearm: ${scoresheet.enhancements?.firearm ? "Yes" : "No"}, Prior Serious Felony: ${scoresheet.enhancements?.priorSeriousFelony ? "Yes" : "No"})
- TOTAL SENTENCE POINTS: ${totals.totalPoints} POINTS
- PRISON MANDATORY STATUS: ${totals.isPrisonPermissible ? `YES (Lowest Permissible Sentence: ${totals.lowestPermissibleSentenceMonths} Months / ~${(totals.lowestPermissibleSentenceMonths / 12).toFixed(1)} Years)` : "NO (Non-State Prison Eligible - ≤ 44 Points)"}
- STATUTORY MAXIMUM: ${totals.maxSentenceSummary}

ASSERTED STATUTORY DOWNWARD DEPARTURES:
${Array.isArray(scoresheet.departures) ? scoresheet.departures.filter((d: any) => d.checked).map((d: any) => `[*] ${d.statute} - ${d.title}: ${d.notes || "Ground claimed"}`).join("\n") : "None asserted yet."}

Provide a meticulous, strategic defense evaluation of this scoresheet.`;

    const isPrison = totals.isPrisonPermissible;
    const fallbackAudit = `### 1. SENTENCING THRESHOLD & EXPOSURE AUDIT
* **Total Sentence Points:** **${totals.totalPoints.toFixed(1)} Points**
* **Statutory Classification:** ${isPrison 
  ? `**State Prison Mandatory Threshold Exceeded (> 44.0 Points).** Under § 921.0024(2), Fla. Stat., the court's Lowest Permissible Sentence (LPS) is **${totals.lowestPermissibleSentenceMonths} Months (~${(totals.lowestPermissibleSentenceMonths / 12).toFixed(1)} Years)** in the Florida Department of Corrections. The presiding judge has no legal authority to sentence below this number unless a statutory downward departure is proven.` 
  : `**Non-State Prison Sanction Eligible (≤ 44.0 Points).** The defense is fully eligible for any non-state prison sanction, including county jail (up to 364 days), probation, community control, drug court, or pretrial diversion without needing a downward departure.`}
* **Maximum Statutory Exposure:** **${totals.maxSentenceSummary}** under Fla. Stat. § 775.082.

---

### 2. VULNERABILITIES & OVER-SCORING OBJECTIONS FOR DEFENSE COUNSEL
* **Scrutinize Victim Injury Scoring (${totals.victimInjuryPoints} Points):**
  * In Florida, under *Wendt v. State*, 47 So. 3d 895 (Fla. 2d DCA 2010), the prosecution cannot assess injury points based on mere allegations. The State carries the affirmative burden of proving physical injury with objective medical evidence. If the State scored "severe" (40 pts) or "moderate" (18 pts) without hospital diagnostic records, defense counsel should file a formal objection to strike or reduce these points to "slight" (4 pts) or zero.
* **Audit Prior Record Proof (${totals.priorRecordPoints} Points):**
  * Under *Sinclair v. State*, 673 So. 2d 115 (Fla. 2d DCA 1996), if the defense disputes a prior conviction on the scoresheet, the State must produce certified copies of the prior judgment and sentence. Furthermore, verify whether any priors fall outside the **10-year decay period** under § 921.0021(5), Fla. Stat. (priors over 10 years old without intervening convictions cannot be scored).
* **Legal Status Verification (${totals.legalStatusPoints} Points):**
  * Ensure the State provides certified docket proof that the defendant was in active legal custody or pretrial release on the exact date of the alleged incident.

---

### 3. STATUTORY DOWNWARD DEPARTURE STRATEGY (FLA. STAT. § 921.0026)
${scoresheet.departures?.filter((d: any) => d.checked).length > 0 
  ? scoresheet.departures.filter((d: any) => d.checked).map((d: any) => `* **${d.title} (${d.statute}):** Valid legal vehicle to depart below the ${totals.lowestPermissibleSentenceMonths}-month prison floor. Defense counsel must present competent, substantial witness testimony or documentary evaluations at the sentencing hearing.`).join('\n') 
  : `* **No Departures Currently Selected:** If points exceed 44, counsel should investigate § 921.0026(2)(j) (unsophisticated isolated incident with remorse), § 921.0026(2)(d) (substance abuse or mental health treatment amenability), or § 921.0026(2)(b) (minor participant) to legally authorize probation instead of prison.`}

---

### 4. RECOMMENDED ACTION ITEMS FOR DEFENSE COUNSEL
1. **Request State's Official Scoresheet Copy:** Demand the Assistant State Attorney's draft scoresheet during pre-trial disposition to identify discrepancies immediately.
2. **File Motion to Correct Scoresheet / Evidentiary Hearing:** Challenge unsubstantiated injury points or questionable out-of-county priors prior to plea negotiations.
3. **Plea Bargaining Leverage:** If points are close to 44, negotiating an amendment of the primary offense (e.g., from Level 6 to Level 4) eliminates the mandatory state prison requirement entirely.`;

    if (!ai) {
      res.json({ analysis: fallbackAudit });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      res.json({ analysis: response.text || fallbackAudit });
    } catch (aiErr: any) {
      console.warn("AI generation temporarily unavailable, falling back to statutory audit:", aiErr?.message);
      res.json({ analysis: fallbackAudit });
    }
  } catch (err: any) {
    console.error("Scoresheet analysis error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze scoresheet." });
  }
});

// 404 handler for API routes
app.all("/api/*", (_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Vite / Static setup
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));
  
  // Use Vite development server ONLY when explicitly in development mode and dist is not preferred
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production or Cloud Run deployment
    if (hasDist) {
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      // Fallback if dist was not built
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Project Innocence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
