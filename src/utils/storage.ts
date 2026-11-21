import { EvidenceItem, OpposingClaimItem, LawLibraryItem, CaseOverview, ChatMessage, EvidenceRequest, ScoresheetState } from '../types';
import { initialCaseOverview, initialEvidenceItems, initialOpposingClaims, initialLawLibrary, initialEvidenceRequests } from '../data/initialData';
import { DEFAULT_SCORESHEET_STATE } from './scoresheetCalc';

const STORAGE_KEYS = {
  CASE_OVERVIEW: 'project_innocence_case_overview_v1',
  MY_EVIDENCE: 'project_innocence_defense_evidence_v1',
  OPPOSING_CLAIMS: 'project_innocence_opposing_claims_v1',
  LAW_LIBRARY: 'project_innocence_law_library_v1',
  CHAT_HISTORY: 'project_innocence_chat_history_v1',
  EVIDENCE_REQUESTS: 'project_innocence_evidence_requests_v1',
  SCORESHEET: 'project_innocence_scoresheet_v1',
};

export function loadCaseOverview(): CaseOverview {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CASE_OVERVIEW);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading case overview:", e);
  }
  return initialCaseOverview;
}

export function saveCaseOverview(overview: CaseOverview): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CASE_OVERVIEW, JSON.stringify(overview));
  } catch (e) {
    console.error("Error saving case overview:", e);
  }
}

export function loadEvidenceItems(): EvidenceItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MY_EVIDENCE);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading defense evidence:", e);
  }
  return initialEvidenceItems;
}

export function saveEvidenceItems(items: EvidenceItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MY_EVIDENCE, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving defense evidence:", e);
  }
}

export function loadOpposingClaims(): OpposingClaimItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.OPPOSING_CLAIMS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading opposing claims:", e);
  }
  return initialOpposingClaims;
}

export function saveOpposingClaims(items: OpposingClaimItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OPPOSING_CLAIMS, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving opposing claims:", e);
  }
}

export function loadLawLibrary(): LawLibraryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LAW_LIBRARY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading law library:", e);
  }
  return initialLawLibrary;
}

export function saveLawLibrary(items: LawLibraryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAW_LIBRARY, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving law library:", e);
  }
}

export function loadChatHistory(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading chat history:", e);
  }
  return [
    {
      id: "msg-welcome",
      role: "assistant",
      content: "Welcome to **Project Innocence Paralegal Assistant**. I am here to help you organize your defense, examine exculpatory evidence, spot weaknesses or fabrication red flags in the opposing party's claims, cross-reference relevant statutes and constitutional rules (like Brady v. Maryland and Hearsay rules), and prepare strategic inquiries for your legal counsel.\n\nHow can I assist your defense today?",
      timestamp: new Date().toISOString(),
      suggestedActions: [
        "Analyze vulnerabilities in the opposing claims",
        "Draft a Brady exculpatory evidence checklist",
        "Spot hearsay & fabrication risks in witness statements",
        "Build a verified alibi chronological timeline"
      ]
    }
  ];
}

export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
  } catch (e) {
    console.error("Error saving chat history:", e);
  }
}

export function loadEvidenceRequests(): EvidenceRequest[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EVIDENCE_REQUESTS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading evidence requests:", e);
  }
  return initialEvidenceRequests;
}

export function saveEvidenceRequests(requests: EvidenceRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVIDENCE_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error("Error saving evidence requests:", e);
  }
}

export function loadScoresheetState(): ScoresheetState {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SCORESHEET);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading scoresheet state:", e);
  }
  return DEFAULT_SCORESHEET_STATE;
}

export function saveScoresheetState(state: ScoresheetState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCORESHEET, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving scoresheet state:", e);
  }
}

export function exportCaseBackup(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    caseOverview: loadCaseOverview(),
    defenseEvidence: loadEvidenceItems(),
    opposingClaims: loadOpposingClaims(),
    lawLibrary: loadLawLibrary(),
    chatHistory: loadChatHistory(),
    evidenceRequests: loadEvidenceRequests(),
    scoresheet: loadScoresheetState(),
  };
  return JSON.stringify(data, null, 2);
}

export function importCaseBackup(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.defenseEvidence && parsed.opposingClaims) {
      if (parsed.caseOverview) saveCaseOverview(parsed.caseOverview);
      saveEvidenceItems(parsed.defenseEvidence);
      saveOpposingClaims(parsed.opposingClaims);
      if (parsed.lawLibrary) saveLawLibrary(parsed.lawLibrary);
      if (parsed.chatHistory) saveChatHistory(parsed.chatHistory);
      if (parsed.evidenceRequests) saveEvidenceRequests(parsed.evidenceRequests);
      if (parsed.scoresheet) saveScoresheetState(parsed.scoresheet);
      return true;
    }
  } catch (e) {
    console.error("Error parsing case backup:", e);
  }
  return false;
}

export function resetToDemoData(): void {
  saveCaseOverview(initialCaseOverview);
  saveEvidenceItems(initialEvidenceItems);
  saveOpposingClaims(initialOpposingClaims);
  saveLawLibrary(initialLawLibrary);
  saveChatHistory([]);
  saveEvidenceRequests(initialEvidenceRequests);
}
