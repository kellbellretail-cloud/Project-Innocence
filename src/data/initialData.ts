import { EvidenceItem, OpposingClaimItem, LawLibraryItem, CaseOverview, EvidenceRequest } from '../types';

export const initialCaseOverview: CaseOverview = {
  caseTitle: "Defense Investigation & Innocence Dossier",
  caseNumber: "CR-2026-8842",
  jurisdiction: "Superior Court / Criminal Defense Division",
  defenseCounsel: "Retained / Appointed Defense Team & Pro Se Advocacy",
  coreDefenseTheory: "Total factual impossibility & verified alibi. Complete contradiction between verifiable digital metadata and fabricated opposing witness claims.",
  incidentDateRange: "October 12, 2025 – October 14, 2025",
  lastUpdated: new Date().toISOString(),
};

export const initialEvidenceItems: EvidenceItem[] = [
  {
    id: "ev-1",
    title: "Google Timeline & GPS Telemetry (Exculpatory Alibi)",
    category: "alibi",
    description: "Verified Google Takeout location history data and synced Garmin GPS activity file showing presence 14.2 miles away at the exact time of the alleged incident (19:42 - 20:15).",
    timestamp: "2025-10-12 19:45",
    source: "Google Account Archive & Raw GPX File",
    exculpatoryRating: "critical",
    chainOfCustody: {
      custodian: "Forensic Digital Examiner & Defense Archive",
      dateSecured: "2025-10-15",
      storageLocation: "Encrypted Defense Drive (SHA-256 Verified)",
      hashOrVerification: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      status: "secured"
    },
    tags: ["alibi", "gps", "digital forensics", "timestamp"],
    linkedOpposingIds: ["opp-1", "opp-2"],
    verified: true,
    notes: "Cross-corroborated by highway toll transponder timestamp at 19:28 (Exit 44).",
    createdAt: "2025-10-16T14:20:00Z"
  },
  {
    id: "ev-2",
    title: "Supermarket POS Terminal Receipt & Timestamped Video Request",
    category: "financial",
    description: "Itemized debit card transaction receipt from Metro Grocers with authorization timestamp 19:58:12. Formal preservation / spoliation letter served on store management for camera feed #4.",
    timestamp: "2025-10-12 19:58",
    source: "Chase Bank Statement & Physical Store Slip",
    exculpatoryRating: "critical",
    chainOfCustody: {
      custodian: "Investigator Marcus Vance",
      dateSecured: "2025-10-13",
      storageLocation: "Physical Evidence Locker #A-14",
      hashOrVerification: "POS TxID: #99482-A8",
      status: "secured"
    },
    tags: ["financial", "surveillance", "alibi", "preservation"],
    linkedOpposingIds: ["opp-1"],
    verified: true,
    notes: "Manager confirmed video backup was pulled and sequestered pursuant to our preservation notice.",
    createdAt: "2025-10-16T15:00:00Z"
  },
  {
    id: "ev-3",
    title: "Carrier-Certified SMS Call Detail Records (CDR)",
    category: "digital",
    description: "Subpoenaed cellular carrier records disproving fabricated text messages. Proves no outgoing messages or calls occurred between the accused and the complaining witness during the alleged harassment window.",
    timestamp: "2025-10-13 14:00",
    source: "AT&T Legal Compliance Subpoena Response",
    exculpatoryRating: "high",
    chainOfCustody: {
      custodian: "Defense Attorney Office",
      dateSecured: "2025-10-22",
      storageLocation: "Case File Exhibit Envelope B",
      hashOrVerification: "AT&T Custodian of Records Certificate FRE 902(11)",
      status: "secured"
    },
    tags: ["telecom", "records", "impeachment", "certified"],
    linkedOpposingIds: ["opp-3"],
    verified: true,
    notes: "Shows the screenshot presented by opposing party was created using a spoofed web SMS generator.",
    createdAt: "2025-10-23T10:10:00Z"
  },
  {
    id: "ev-4",
    title: "Sworn Eyewitness Affidavit of Dr. Elena Rostova",
    category: "witness",
    description: "Notarized affidavit from attending clinic physician confirming the accused was present at the medical clinic triage desk from 19:30 through 20:20 completing admission intake.",
    timestamp: "2025-10-12 19:35",
    source: "Dr. Elena Rostova (MD, Board Certified)",
    exculpatoryRating: "critical",
    chainOfCustody: {
      custodian: "Defense Notary Record",
      dateSecured: "2025-10-18",
      storageLocation: "Legal Vault & Court Reciprocal Filing Copy",
      hashOrVerification: "Notary Seal #NY-882194",
      status: "secured"
    },
    tags: ["witness", "alibi", "sworn affidavit", "credible"],
    linkedOpposingIds: ["opp-1", "opp-2"],
    verified: true,
    notes: "Completely disinterested third-party witness with zero motive to fabricate.",
    createdAt: "2025-10-19T09:30:00Z"
  }
];

export const initialOpposingClaims: OpposingClaimItem[] = [
  {
    id: "opp-1",
    title: "Fabricated Eyewitness Allegation of Presence at Crime Scene",
    originator: "Complaining Witness / Hostile Associate (Kevin M.)",
    type: "false_witness",
    threatLevel: "critical",
    allegationDetails: "Kevin M. claims he allegedly saw the accused stepping out of a dark sedan outside the downtown venue around 19:50 on October 12th.",
    factualReality: "The accused was 14.2 miles away at Metro Grocers / Medical Clinic with GPS, credit card, and disinterested physician corroboration.",
    counterStrategy: "Impeach witness using FRE 613 (prior inconsistent statements to 911 dispatch where he initially said he 'didn't see the face clearly') and confront with airtight alibi timeline.",
    evidentiaryDefects: [
      "Contradicted by objective digital GPS and POS timestamps",
      "Prior inconsistent statement given during initial 911 call",
      "Lighting conditions at 19:50 made positive identification impossible without streetlights",
      "Documented financial dispute between Kevin M. and accused establishes motive to lie (FRE 608/609)"
    ],
    counterEvidenceIds: ["ev-1", "ev-2", "ev-4"],
    potentialSubpoenas: "911 CAD dispatch audio recording, Kevin M.'s phone location data during the call, street light municipal outage logs.",
    status: "rebutted_internally",
    createdAt: "2025-10-17T11:00:00Z"
  },
  {
    id: "opp-2",
    title: "Anticipated Speculative 'Accomplice / Co-Conspirator' Theory",
    originator: "Prosecution / Detective Smith Anticipated Theory",
    type: "anticipated_evidence",
    threatLevel: "high",
    allegationDetails: "If our direct alibi holds, the other side may attempt to pivot and conjure a speculative conspiracy theory that the accused 'paid someone else' or coordinated remotely.",
    factualReality: "There is zero financial transfer, zero communications, and zero relationship between the accused and the actual perpetrators.",
    counterStrategy: "Pre-emptively prepare complete financial disclosure (all bank accounts, Venmo, Zelle, CashApp, crypto wallets) showing clean ledger with no unusual withdrawals. Demand Brady disclosure of all third-party investigative leads.",
    evidentiaryDefects: [
      "Pure speculation without a scintilla of evidentiary foundation (FRE 602)",
      "Absence of any co-conspirator statement meeting FRE 801(d)(2)(E)",
      "Unfairly prejudicial and speculative under FRE 403"
    ],
    counterEvidenceIds: ["ev-3"],
    potentialSubpoenas: "Full police investigative binder, all interview notes with actual suspects, polygraph examination reports, Brady material request.",
    status: "anticipated_risk",
    createdAt: "2025-10-18T13:40:00Z"
  },
  {
    id: "opp-3",
    title: "Conjured / Altered Screenshot of Threatening Text Exchange",
    originator: "Opposing Party / Social Media Post",
    type: "altered_record",
    threatLevel: "critical",
    allegationDetails: "A cropped screenshot circulated alleging a heated text argument where the accused supposedly sent a threatening message at 14:15 on October 13th.",
    factualReality: "The screenshot is a fabricated simulation created with an online fake-text generator. The font kerning, battery icon position, and bubble padding do not match iOS native typography.",
    counterStrategy: "File Motion in Limine under FRE 901 (Failure of Authentication) and FRE 1002 (Best Evidence Rule). Present AT&T certified CDR logs proving no message was transmitted through the cellular network.",
    evidentiaryDefects: [
      "Lack of authentic metadata / failure to produce the native device (FRE 901)",
      "Violation of Best Evidence Rule (FRE 1002) - producing altered secondary image instead of forensic extraction",
      "Direct contradiction by AT&T certified telecommunications records (FRE 902(11))"
    ],
    counterEvidenceIds: ["ev-3"],
    potentialSubpoenas: "Forensic extraction (Cellebrite) of the accuser's actual mobile phone to examine native sqlite database (sms.db).",
    status: "motion_prepared",
    createdAt: "2025-10-24T16:15:00Z"
  }
];

export const initialLawLibrary: LawLibraryItem[] = [
  {
    id: "law-1",
    category: "exculpatory_brady",
    title: "Brady v. Maryland (373 U.S. 83)",
    citation: "373 U.S. 83 (1963) / Constitutional Due Process",
    ruleSummary: "The prosecution violates the 14th Amendment Due Process Clause if it withholds evidence favorable to an accused upon request, where the evidence is material either to guilt or to punishment, irrespective of the good or bad faith of the prosecution.",
    defenseApplication: "File an exhaustive, specific Brady Demand Letter requiring the state to produce all exculpatory witness statements, notes of conflicting descriptions, and negative alibi checks. If evidence was suppressed, move for dismissal or new trial.",
    fullTextSnippet: "Suppression by the prosecution of evidence favorable to an accused upon request violates due process where the evidence is material either to guilt or to punishment, irrespective of the good faith or bad faith of the prosecution.",
    tags: ["brady", "exculpatory", "due process", "disclosure", "constitutional"],
    keyPhrases: ["favorable to the accused", "materiality", "suppression of evidence"],
    bookmarked: true
  },
  {
    id: "law-2",
    category: "exculpatory_brady",
    title: "Giglio v. United States (405 U.S. 150)",
    citation: "405 U.S. 150 (1972) / Impeachment Evidence as Brady Material",
    ruleSummary: "The Brady doctrine extends to evidence affecting the credibility of prosecution witnesses (e.g., plea deals, promises of leniency, non-prosecution agreements, informant payments, or prior acts of dishonesty).",
    defenseApplication: "Subpoena the prosecutor's deal memos, immunity agreements, or deferred prosecution understandings regarding any hostile witness who may testify or fabricate claims against the client.",
    fullTextSnippet: "When the reliability of a given witness may well be determinative of guilt or innocence, nondisclosure of evidence affecting credibility falls within this general rule.",
    tags: ["giglio", "impeachment", "witness bias", "deals", "credibility"],
    keyPhrases: ["witness credibility", "leniency agreements", "impeachment material"],
    bookmarked: true
  },
  {
    id: "law-3",
    category: "exculpatory_brady",
    title: "Kyles v. Whitley (514 U.S. 419)",
    citation: "514 U.S. 419 (1995) / Imputed Knowledge of Police Files",
    ruleSummary: "The individual prosecutor has a duty to learn of any favorable evidence known to others acting on the government's behalf in the case, including police officers and forensic investigators. A prosecutor cannot claim ignorance of what is in the police detective's desk drawer.",
    defenseApplication: "Use when prosecutors argue they did not 'possess' 911 audio or field notes held by investigating officers. The law strictly imputes police knowledge directly onto the prosecution.",
    fullTextSnippet: "The individual prosecutor has a duty to learn of any favorable evidence known to the others acting on the government's behalf in the case, including the police.",
    tags: ["kyles", "police files", "imputed knowledge", "investigator notes"],
    keyPhrases: ["duty to learn", "police files", "collective government knowledge"]
  },
  {
    id: "law-4",
    category: "evidence_rules",
    title: "Federal Rule of Evidence 801 & 802: The Hearsay Rule",
    citation: "Fed. R. Evid. 801, 802 / State Counterparts",
    ruleSummary: "Hearsay is an out-of-court statement offered by a party to prove the truth of the matter asserted in the statement. Hearsay is strictly inadmissible unless an explicit federal statute or recognized exception applies.",
    defenseApplication: "Object to second-hand rumors, police report recitations of bystander claims, or manufactured gossip. Demand the actual declarant take the stand under oath.",
    fullTextSnippet: "'Hearsay' means a statement that the declarant does not make while testifying at the current trial or hearing; and a party offers in evidence to prove the truth of the matter asserted. Hearsay is not admissible unless these rules provide otherwise.",
    tags: ["hearsay", "evidence", "out-of-court", "objection", "admissibility"],
    keyPhrases: ["truth of the matter asserted", "declarant unavailable", "inadmissible hearsay"],
    bookmarked: true
  },
  {
    id: "law-5",
    category: "constitutional",
    title: "Crawford v. Washington: Confrontation Clause",
    citation: "541 U.S. 36 (2004) / Sixth Amendment",
    ruleSummary: "Under the Sixth Amendment's Confrontation Clause, 'testimonial' out-of-court statements by witnesses are barred from admission unless the witness is unavailable and the defendant had a prior opportunity for cross-examination.",
    defenseApplication: "Preclude police interrogation transcripts, formal victim declarations, or lab analyst affidavits if the author is not brought to trial for live cross-examination under fire.",
    fullTextSnippet: "Where testimonial statements are at issue, the only indicium of reliability sufficient to satisfy constitutional demands is the one the Constitution actually prescribes: confrontation.",
    tags: ["confrontation clause", "sixth amendment", "cross-examination", "testimonial"],
    keyPhrases: ["testimonial statements", "right of confrontation", "prior opportunity to cross-examine"],
    bookmarked: true
  },
  {
    id: "law-6",
    category: "evidence_rules",
    title: "Federal Rule of Evidence 901: Authenticating or Identifying Evidence",
    citation: "Fed. R. Evid. 901 / Digital Authenticity Standards",
    ruleSummary: "To satisfy the requirement of authenticating or identifying an item of evidence, the proponent must produce evidence sufficient to support a finding that the item is what the proponent claims it is (e.g., digital chain of custody, hash values, telecom server validation).",
    defenseApplication: "Challenge manufactured screenshots, cropped images, or unverified printouts. If the opposing party cannot produce the native raw file and hardware source, move to exclude for lack of authentication.",
    fullTextSnippet: "The proponent must produce evidence sufficient to support a finding that the item is what the proponent claims it is. Testimony of a witness with knowledge; Distinctive characteristics; Certified domestic records.",
    tags: ["authentication", "chain of custody", "digital evidence", "screenshots", "metadata"],
    keyPhrases: ["sufficient to support a finding", "distinctive characteristics", "native file"]
  },
  {
    id: "law-7",
    category: "evidence_rules",
    title: "Federal Rule of Evidence 403: Excluding Prejudicial Evidence",
    citation: "Fed. R. Evid. 403 / Balancing Test",
    ruleSummary: "The court may exclude relevant evidence if its probative value is substantially outweighed by a danger of one or more of the following: unfair prejudice, confusing the issues, misleading the jury, undue delay, or needlessly presenting cumulative evidence.",
    defenseApplication: "Use in a Motion in Limine to exclude inflammatory accusations, uncharged rumors, or dramatic opposing characterizations that lack direct probative relevance.",
    fullTextSnippet: "The court may exclude relevant evidence if its probative value is substantially outweighed by a danger of unfair prejudice, confusing the issues, misleading the jury, undue delay, wasting time, or needlessly presenting cumulative evidence.",
    tags: ["prejudice", "probative value", "limine", "relevance", "rule 403"],
    keyPhrases: ["unfair prejudice", "substantially outweighed", "misleading the jury"]
  },
  {
    id: "law-8",
    category: "defense_motions",
    title: "Motion in Limine Framework & Guidelines",
    citation: "Pre-Trial Defense Practice / Evidentiary Exclusion",
    ruleSummary: "A procedural motion submitted prior to trial requesting a judicial order barring the opposing party from mentioning, referencing, or offering certain prejudicial, inadmissible, or unauthenticated evidence in front of the jury.",
    defenseApplication: "Prepare limine motions targeting: 1) Conjured social media screenshots lacking native phone extraction; 2) Speculative character propensity claims; 3) Unqualified hearsay from non-testifying informants.",
    fullTextSnippet: "A motion in limine prevents the jury from ever hearing inadmissible, prejudicial, or fabricated evidence, preserving the record and preventing the 'bell from being rung' in open court.",
    tags: ["motions", "motion in limine", "pre-trial", "evidentiary bar", "strategy"],
    keyPhrases: ["prevent prejudicial disclosure", "order to exclude", "pre-trial motion"],
    bookmarked: true
  },
  {
    id: "law-9",
    category: "procedure_standards",
    title: "Spoliation of Evidence & Third-Party Preservation Notices",
    citation: "Federal Common Law & Civil/Criminal Sanction Doctrines",
    ruleSummary: "The intentional, reckless, or negligent destruction or alteration of evidence relevant to pending or reasonably foreseeable litigation. Parties have an affirmative legal duty to preserve relevant records once on notice.",
    defenseApplication: "Immediately dispatch formal Evidence Preservation Demand Letters to gas stations, traffic cameras, cellular carriers, and hotels before automated 7-30 day surveillance overwrite cycles purge exculpatory footage.",
    fullTextSnippet: "Once a party reasonably anticipates litigation, it must suspend its routine document retention/destruction policy and put in place a 'litigation hold' to ensure the preservation of relevant documents.",
    tags: ["spoliation", "preservation letter", "surveillance", "cctv", "litigation hold"],
    keyPhrases: ["duty to preserve", "litigation hold", "adverse inference instruction"]
  },
  {
    id: "law-10",
    category: "constitutional",
    title: "Fourth Amendment Exclusionary Rule & Mapp v. Ohio",
    citation: "367 U.S. 643 (1961) / Fruit of the Poisonous Tree",
    ruleSummary: "Evidence obtained in violation of the Fourth Amendment's protection against unreasonable searches and seizures is inadmissible in state and federal court. All secondary evidence derived from an illegal search is tainted under the 'Fruit of the Poisonous Tree' doctrine (Wong Sun v. U.S.).",
    defenseApplication: "Move to suppress any phone data, vehicle search, or residence search conducted without a valid warrant, exceeding the warrant's four corners, or lacking genuine probable cause.",
    fullTextSnippet: "All evidence obtained by searches and seizures in violation of the Constitution is, by that same authority, inadmissible in a state court.",
    tags: ["fourth amendment", "search and seizure", "suppression", "warrant", "exclusionary rule"],
    keyPhrases: ["fruit of the poisonous tree", "unreasonable search", "motion to suppress"]
  },
  {
    id: "law-fl-1",
    category: "procedure_standards",
    title: "Florida Rule of Criminal Procedure 3.220: Discovery Mandate",
    citation: "Fla. R. Crim. P. 3.220 / Florida Reciprocal Discovery",
    ruleSummary: "Within 15 days after service of the Notice of Discovery, the prosecutor shall disclose all Category A witnesses, written/recorded statements of the defendant, electronic recordings (including 911 CAD tapes and body camera video), and all material information within the state's possession or control that tends to negate the guilt of the defendant (Brady material).",
    defenseApplication: "Serve Notice of Discovery immediately upon entry of plea. If the State Attorney fails to provide 911 recordings or witness notes within 15 days, move for a Richardson hearing and sanctions under Fla. R. Crim. P. 3.220(n).",
    fullTextSnippet: "Within 15 days after service of the Notice of Discovery, the prosecutor shall serve a written Discovery Exhibit disclosing: The names and addresses of all persons known to have information relevant to the offense; Any written or recorded statements; Electronic recordings including 911 calls; Any material information that tends to negate guilt.",
    tags: ["florida", "discovery", "rule 3.220", "richardson hearing", "exculpatory"],
    keyPhrases: ["15 days after service", "category a witnesses", "electronic recordings", "negate guilt"],
    bookmarked: true
  },
  {
    id: "law-fl-2",
    category: "defense_motions",
    title: "Florida Rule of Criminal Procedure 3.200: Notice of Alibi",
    citation: "Fla. R. Crim. P. 3.200 / Notice of Alibi Defense",
    ruleSummary: "On written demand of the prosecuting attorney, or affirmatively, a defendant who intends to offer evidence of an alibi shall serve notice not less than 10 days before trial stating the specific place at which the defendant claims to have been and the names and addresses of the witnesses upon whom the defendant intends to rely.",
    defenseApplication: "Lock in your alibi defense by compiling GPS timestamps, merchant receipts, and witness contact info from the My Evidence Vault. Serve the written notice at least 10 days prior to trial to prevent preclusion.",
    fullTextSnippet: "A defendant who intends to offer evidence of an alibi in defense shall, not less than 10 days before trial or at other time as the court directs, file and serve on the prosecuting attorney a notice in writing of an intention to claim an alibi.",
    tags: ["florida", "alibi", "rule 3.200", "witness disclosure", "defense notice"],
    keyPhrases: ["not less than 10 days before trial", "specific place", "alibi witnesses"],
    bookmarked: true
  },
  {
    id: "law-fl-3",
    category: "constitutional",
    title: "Florida Government-in-the-Sunshine & Public Records (Chapter 119)",
    citation: "Fla. Stat. § 119.01 & Fla. Const. Art. I, § 24",
    ruleSummary: "Every person who has custody of a public record shall permit the record to be inspected and copied by any person desiring to do so. Applies to Clerk of Courts files, Sheriff 911 dispatch tapes, police call-for-service logs, and communications.",
    defenseApplication: "Submit formal Chapter 119 Public Records Requests directly to the County Clerk of Court, County Sheriff's Office, and municipal police departments for CAD dispatch logs, radio audio, and officer disciplinary histories independently of criminal discovery.",
    fullTextSnippet: "It is the policy of this state that all state, county, and municipal records are open for personal inspection and copying by any person. Providing access to public records is a duty of each agency.",
    tags: ["florida", "sunshine law", "chapter 119", "public records", "clerk records", "cad logs"],
    keyPhrases: ["open for personal inspection", "duty of each agency", "public records request"],
    bookmarked: true
  }
];

export const initialEvidenceRequests: EvidenceRequest[] = [
  {
    id: "req-1",
    title: "Arresting Officer Body-Worn Camera (BWC) Footage Demand",
    agencyName: "City Police Department / Central Records & Video Unit",
    agencyType: "police_dept",
    requestType: "body_cam",
    priority: "emergency_preservation",
    officersInvolved: "Officer D. Miller (Badge #4182), Assisting Deputy J. Kowalski",
    badgeNumbers: "#4182, #3911",
    incidentNumber: "25-CAD-094182",
    incidentDate: "2025-10-12",
    timeWindow: "19:15 EST - 21:00 EST (Includes Pre-Contact & Transport)",
    location: "Intersection of 4th Ave & Elm St (Traffic Stop & Field Encounter)",
    statuteBasis: "Fla. Stat. § 119.071(2)(l) & Fla. Stat. § 943.1718 / Fla. R. Crim. P. 3.220",
    status: "pending",
    trackingNumber: "BWC-2025-08412",
    dateSent: "2025-10-18",
    deadlineDate: "2025-11-02",
    retentionRiskWarning: "CRITICAL PURGE RISK: Most police departments maintain an automated 90-day unflagged video purge cycle. Ensure formal spoliation hold is logged with city risk management.",
    notes: "Crucial footage will disprove claims that the accused appeared agitated or made spontaneous un-Mirandized statements.",
    formalDemandLetter: `PUBLIC RECORDS DEMAND FOR LAW ENFORCEMENT BODY-WORN CAMERA (BWC) FOOTAGE
AND EMERGENCY NOTICE OF EVIDENCE PRESERVATION

TO: Custodian of Public Records / Video Analysis Unit
AGENCY: City Police Department / Records Bureau
RE: Incident / CAD Report No: 25-CAD-094182
DATE OF INCIDENT: October 12, 2025
TIME SPAN: 19:15 EST through 21:00 EST
OFFICERS INVOLVED: Officer D. Miller (Badge #4182); Assisting Deputy J. Kowalski (#3911)

Pursuant to Chapter 119, Florida Statutes (or applicable State/Federal Public Records Law) and the Sixth and Fourteenth Amendments to the United States Constitution, formal request is hereby made for the inspection and electronic copies of all Body-Worn Camera (BWC) audio and video recordings captured by the above-referenced officers and all backup/assisting personnel.

SPECIFIC ITEMS REQUESTED:
1. Complete, unedited native digital video and audio recordings from the BWC units of Officer D. Miller, Deputy Kowalski, and any assisting units on scene.
2. All footage starting thirty (30) minutes prior to initial contact through transport and booking intake.
3. Native metadata logs, system upload timestamps, and camera serial number audits.

EMERGENCY SPOLIATION & LITIGATION HOLD NOTICE:
This matter is subject to active criminal defense proceedings. You are formally placed on legal notice that failure to preserve this digital recording, or allowing it to be overwritten or deleted pursuant to standard automated 30, 60, or 90-day retention policies, will constitute unlawful spoliation of evidence, entitling the defense to an adverse inference instruction and dismissal sanctions under Brady v. Maryland and Kyles v. Whitley.

Respectfully submitted,
Defense Team / Project Innocence Records Unit`,
    createdAt: "2025-10-18T10:00:00Z"
  },
  {
    id: "req-2",
    title: "911 Audio Dispatch Tapes & CAD Keystroke Incident Log",
    agencyName: "County Emergency Communications & 911 Dispatch Bureau",
    agencyType: "sheriff",
    requestType: "cad_911",
    priority: "high",
    incidentNumber: "911-2025-55198",
    incidentDate: "2025-10-12",
    timeWindow: "19:40 EST - 20:15 EST",
    location: "4th Avenue Commercial Corridor",
    statuteBasis: "Fla. Stat. § 119.01 & Fla. Const. Art. I, § 24 (Florida Sunshine Law)",
    status: "overdue",
    trackingNumber: "GovQA-FL-9912",
    dateSent: "2025-10-19",
    deadlineDate: "2025-11-03",
    retentionRiskWarning: "High: 911 audio recordings on VOIP trunk lines are often archived or purged after 30 to 60 days.",
    notes: "The initial 911 caller gave a description that directly contradicts the physical attributes of the accused. Missing from initial discovery disclosure.",
    formalDemandLetter: `PUBLIC RECORDS DEMAND FOR 911 AUDIO RECORDINGS & COMPUTER-AIDED DISPATCH (CAD) LOGS

TO: Public Records Officer, Emergency Dispatch Bureau
RE: 911 Call Recording & Event Log No: 911-2025-55198
DATE: October 12, 2025 | APPROXIMATE TIME: 19:40 to 20:15 EST

Please provide electronic copies of the following public records under Florida Public Records Law (Chapter 119):
1. The uncompressed audio recording of the 911 telephone call placed regarding the incident on October 12, 2025.
2. The complete Computer-Aided Dispatch (CAD) log, including all dispatcher notes, unit assignments, timestamps, caller ANI/ALI data, and radio transmission audio.
3. Law enforcement radio dispatch transmissions for all channels covering this sector during the incident window.

These records contain direct exculpatory witness descriptions material to defense identity.

Respectfully submitted,
Defense Team / Records Coordinator`,
    createdAt: "2025-10-19T14:30:00Z"
  },
  {
    id: "req-3",
    title: "Commercial Merchant CCTV Video Preservation & Subpoena Notice",
    agencyName: "Metro Grocers / Plaza Property Management",
    agencyType: "merchant_cctv",
    requestType: "surveillance_cctv",
    priority: "emergency_preservation",
    incidentDate: "2025-10-12",
    timeWindow: "19:30 EST - 20:20 EST",
    location: "Metro Grocers, 8820 North Boulevard (Registers 1-4 & Parking Lot North)",
    statuteBasis: "Common Law Duty to Preserve / Subpoena Duces Tecum In Anticipation of Trial",
    status: "fulfilled",
    trackingNumber: "SUBP-2025-014",
    dateSent: "2025-10-14",
    deadlineDate: "2025-10-21",
    retentionRiskWarning: "CRITICAL: Commercial DVR systems typically overwrite rolling footage every 7 to 14 days. Hand-delivered preservation notice required.",
    notes: "Successfully secured! Footage verified the client was standing at Register 3 paying with debit card at 19:48, completely debunking the state's timeline.",
    formalDemandLetter: `LEGAL NOTICE OF EVIDENCE PRESERVATION & DEMAND TO PREVENT SPOLIATION (SURVEILLANCE VIDEO)

TO: Risk Management / Store Manager / Loss Prevention Director
ENTITY: Metro Grocers & Commercial Plaza Management
LOCATION: 8820 North Boulevard
DATE OF FOOTAGE: October 12, 2025 | TIME: 19:30 - 20:20 EST

DEMAND TO PRESERVE AND SECURE RECORDINGS:
You are hereby formally notified of pending criminal proceedings and instructed to immediately PRESERVE and prevent the destruction, deletion, or automated overwriting of all digital video and audio recordings captured by all indoor and outdoor surveillance cameras at your premises on the above date and time.

SPECIFIC CAMERA FEEDS TO EXTRACT:
- All cameras capturing Point of Sale checkout registers (Registers 1 through 6).
- All cameras capturing customer entrance/exit doors and vestibules.
- Outdoor cameras capturing the north customer parking lot.

DO NOT RELY ON AUTOMATED ARCHIVING:
Because digital video recorders (DVRs) typically overwrite previous recordings within 7 to 14 days, you must immediately manually export this footage onto an external hard drive or flash media. A formal Subpoena Duces Tecum will be served for production.

Respectfully submitted,
Defense Counsel & Investigation Team`,
    createdAt: "2025-10-14T09:00:00Z"
  },
  {
    id: "req-4",
    title: "Officer Internal Affairs & Brady/Giglio Disciplinary History Demand",
    agencyName: "City Police Department - Internal Affairs Division",
    agencyType: "police_dept",
    requestType: "officer_personnel_giglio",
    priority: "high",
    officersInvolved: "Officer D. Miller (Badge #4182)",
    badgeNumbers: "#4182",
    incidentDate: "2025-10-12",
    statuteBasis: "Brady v. Maryland, 373 U.S. 83 & Giglio v. United States, 405 U.S. 150 / Fla. Stat. § 119",
    status: "pending",
    trackingNumber: "IA-RECORDS-4182",
    dateSent: "2025-10-22",
    deadlineDate: "2025-11-06",
    retentionRiskWarning: "Disciplinary files are public records under Florida law once investigation is concluded.",
    notes: "Seeking prior sustained complaints regarding false statements in police affidavits or failure to activate body-worn cameras.",
    formalDemandLetter: `FORMAL BRADY / GIGLIO DISCOVERY DEMAND FOR OFFICER DISCIPLINARY & PERSONNEL RECORDS

TO: Internal Affairs Division / Professional Standards Bureau
AGENCY: City Police Department
OFFICER NAME: Officer D. Miller | BADGE NO: #4182

Pursuant to Giglio v. United States, 405 U.S. 150 (1972), Brady v. Maryland, 373 U.S. 83 (1963), and Florida Sunshine Law Chapter 119, the defense hereby demands full disclosure and certified copies of the complete personnel and internal affairs file for the arresting officer:

RECORDS REQUESTED:
1. Complete Internal Affairs investigation histories, including all citizen complaints alleging untruthfulness, falsification of reports, evidence mishandling, failure to activate body cameras, or excessive force.
2. Any Letters of Reprimand, suspensions, disciplinary demotions, or counseling notices.
3. Inclusion on any countywide Brady/Giglio 'Do Not Call' or disclosure list maintained by the State Attorney's Office.

Under established constitutional precedent, this material must be disclosed for cross-examination and impeachment under the Sixth Amendment Confrontation Clause.

Respectfully submitted,
Defense Investigation Bureau`,
    createdAt: "2025-10-22T16:00:00Z"
  }
];
