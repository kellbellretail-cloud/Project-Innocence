export type EvidenceCategory = 
  | 'alibi' 
  | 'digital' 
  | 'physical' 
  | 'witness' 
  | 'document' 
  | 'financial'
  | 'other';

export type ExculpatoryRating = 'critical' | 'high' | 'moderate' | 'supporting';

export interface ChainOfCustody {
  custodian: string;
  dateSecured: string;
  storageLocation: string;
  hashOrVerification?: string;
  status: 'secured' | 'pending_subpoena' | 'in_transit' | 'archived';
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: EvidenceCategory;
  description: string;
  timestamp: string; // Event or record date/time
  source: string;
  exculpatoryRating: ExculpatoryRating;
  chainOfCustody: ChainOfCustody;
  fileAttachment?: {
    name: string;
    type: string;
    size: number;
    dataUrl?: string;
  };
  tags: string[];
  linkedOpposingIds: string[];
  verified: boolean;
  notes?: string;
  createdAt: string;
}

export type OpposingClaimType = 
  | 'anticipated_evidence' 
  | 'conjured_claim' 
  | 'altered_record' 
  | 'false_witness' 
  | 'hearsay_rumor';

export type ThreatLevel = 'critical' | 'high' | 'medium' | 'speculative';

export type ClaimStatus = 
  | 'anticipated_risk' 
  | 'active_allegation' 
  | 'rebutted_internally' 
  | 'motion_prepared';

export interface OpposingClaimItem {
  id: string;
  title: string;
  originator: string;
  type: OpposingClaimType;
  threatLevel: ThreatLevel;
  allegationDetails: string;
  factualReality: string;
  counterStrategy: string;
  evidentiaryDefects: string[];
  counterEvidenceIds: string[];
  potentialSubpoenas: string;
  status: ClaimStatus;
  createdAt: string;
}

export type LawCategory = 
  | 'constitutional' 
  | 'evidence_rules' 
  | 'exculpatory_brady' 
  | 'defense_motions' 
  | 'procedure_standards';

export interface LawLibraryItem {
  id: string;
  category: LawCategory;
  title: string;
  citation: string;
  ruleSummary: string;
  defenseApplication: string;
  fullTextSnippet: string;
  tags: string[];
  keyPhrases: string[];
  bookmarked?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  referencedLawId?: string;
}

export interface CaseOverview {
  caseTitle: string;
  caseNumber?: string;
  jurisdiction?: string;
  defenseCounsel?: string;
  coreDefenseTheory: string;
  incidentDateRange?: string;
  lastUpdated: string;
}

export interface FloridaDocketEntry {
  id: string;
  docketIndex: number;
  dateFiled: string;
  title: string;
  filingParty: 'State of Florida' | 'Defense' | 'Presiding Judge' | 'Clerk of Court';
  documentType: 'information_indictment' | 'motion' | 'notice_discovery' | 'order' | 'subpoena' | 'minute_entry' | 'witness_list' | 'other';
  description: string;
  pageCount?: number;
  exculpatoryRelevance?: string;
  isOpposingThreat?: boolean;
}

export interface FloridaCourtCase {
  ucn: string; // Uniform Case Number e.g. 13-2025-CF-004182-A001-HC
  county: string;
  circuit: string;
  division: string;
  courtType: string;
  caseStatus: string;
  presidingJudge: string;
  stateAttorneyOffice: string;
  filingDate: string;
  nextHearing?: {
    type: string;
    date: string;
    courtroom: string;
  };
  discoveryStatus: {
    demandFiled: boolean;
    demandDate?: string;
    stateDisclosureReceived: boolean;
    stateDisclosureDeadline?: string;
    alibiNoticeFiled: boolean;
    alibiDeadline?: string;
    rule3220Compliance: 'compliant' | 'overdue_disclosure' | 'demand_needed';
  };
  docketEntries: FloridaDocketEntry[];
}

export type AgencyType = 
  | 'police_dept' 
  | 'sheriff' 
  | 'clerk_court' 
  | 'merchant_cctv' 
  | 'telecom' 
  | 'ems_hospital' 
  | 'other';

export type EvidenceRequestType = 
  | 'body_cam' 
  | 'dashcam' 
  | 'cad_911' 
  | 'officer_personnel_giglio' 
  | 'surveillance_cctv' 
  | 'telecom_records' 
  | 'medical_ems' 
  | 'police_reports';

export type RequestStatus = 
  | 'draft' 
  | 'pending' 
  | 'partially_received' 
  | 'fulfilled' 
  | 'exemption_denied' 
  | 'overdue';

export interface EvidenceRequest {
  id: string;
  title: string;
  agencyName: string;
  agencyType: AgencyType;
  requestType: EvidenceRequestType;
  priority: 'emergency_preservation' | 'high' | 'standard';
  officersInvolved?: string;
  badgeNumbers?: string;
  incidentNumber?: string;
  incidentDate: string;
  timeWindow?: string;
  location?: string;
  statuteBasis: string;
  status: RequestStatus;
  trackingNumber?: string;
  dateSent?: string;
  deadlineDate?: string;
  notes?: string;
  formalDemandLetter: string;
  retentionRiskWarning?: string;
  createdAt: string;
}

// ==========================================
// FLORIDA CRIMINAL PUNISHMENT CODE (CPC)
// SENTENCING SCORESHEET / SCORECARD TYPES
// (Fla. R. Crim. P. 3.704 & 3.992 / Fla. Stat. § 921.0024)
// ==========================================

export type OffenseSeverityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type FelonyDegree = 
  | 'capital' 
  | 'life' 
  | '1st_degree_life'
  | '1st_degree' 
  | '2nd_degree' 
  | '3rd_degree' 
  | '1st_deg_misd';

export interface ScoresheetOffense {
  id: string;
  statute: string;
  description: string;
  degree: FelonyDegree;
  level: OffenseSeverityLevel;
  counts: number;
}

export interface VictimInjuryCounts {
  secondDegreeMurder: number; // 240 pts
  death: number; // 120 pts
  severe: number; // 40 pts
  moderate: number; // 18 pts
  slight: number; // 4 pts
  sexPenetration: number; // 80 pts
  sexContact: number; // 40 pts
}

export interface PriorRecordCounts {
  level1: number; // 0.5
  level2: number; // 0.8
  level3: number; // 1.6
  level4: number; // 2.4
  level5: number; // 3.6
  level6: number; // 9.0
  level7: number; // 14.0
  level8: number; // 19.0
  level9: number; // 23.0
  level10: number; // 29.0
  misdemeanors: number; // 0.2
}

export interface LegalStatusViolation {
  active: boolean; // 4 points (escape, fleeing, failure to appear, pretrial release, probation, parole)
  description?: string;
}

export interface CommunitySanctionViolations {
  technicalCount: number; // 6 pts each
  newMisdemeanorCount: number; // 12 pts each
  newFelonyCount: number; // 24 pts each
}

export interface SentencingEnhancements {
  firearm: boolean; // 18 pts (Fla. Stat. § 775.087(2))
  semiautomaticOrMachineGun: boolean; // 25 pts
  priorSeriousFelony: boolean; // 30 pts (Fla. Stat. § 921.0024(1)(b))
  drugTraffickingMultiplier: boolean; // Multiplier 1.5x or 2.0x
  lawEnforcementVictimMultiplier: boolean; // Multiplier 2.0x or 2.5x
}

export interface DownwardDepartureItem {
  id: string;
  statute: string; // e.g. "Fla. Stat. § 921.0026(2)(a)"
  title: string;
  description: string;
  checked: boolean;
  notes: string;
}

export interface ScoresheetState {
  defendantName: string;
  courtCaseNumber: string;
  county: string;
  judgeName: string;
  attorneyName: string;
  primaryOffense: ScoresheetOffense;
  additionalOffenses: ScoresheetOffense[];
  victimInjury: VictimInjuryCounts;
  priorRecord: PriorRecordCounts;
  legalStatus: LegalStatusViolation;
  communitySanctions: CommunitySanctionViolations;
  enhancements: SentencingEnhancements;
  departures: DownwardDepartureItem[];
}

export interface ScoresheetCalculatedTotals {
  primaryPoints: number;
  additionalPoints: number;
  victimInjuryPoints: number;
  priorRecordPoints: number;
  legalStatusPoints: number;
  communitySanctionPoints: number;
  enhancementPoints: number;
  subtotalPoints: number;
  totalPoints: number;
  isPrisonPermissible: boolean; // true if totalPoints > 44
  lowestPermissibleSentenceMonths: number; // (totalPoints - 28) * 0.75
  lowestPermissibleSentenceYears: string;
  statutoryMaxYears: number;
  statutoryMaxMonths: number;
  maxSentenceSummary: string;
}

