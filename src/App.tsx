import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MyEvidenceVault } from './components/MyEvidenceVault';
import { OpposingClaimsVault } from './components/OpposingClaimsVault';
import { LawLibrary } from './components/LawLibrary';
import { ParalegalChat } from './components/ParalegalChat';
import { TimelineView } from './components/TimelineView';
import { DeepAnalysisModal } from './components/DeepAnalysisModal';
import { CaseDetailsModal } from './components/CaseDetailsModal';
import { PrintDossierModal } from './components/PrintDossierModal';
import { FloridaClerkPortal } from './components/FloridaClerkPortal';
import { RequestCenter } from './components/RequestCenter';
import { SentencingScoresheet } from './components/SentencingScoresheet';
import { BrevardClerkModal } from './components/BrevardClerkModal';

import { 
  EvidenceItem, OpposingClaimItem, LawLibraryItem, 
  CaseOverview, ChatMessage, EvidenceRequest, ScoresheetState 
} from './types';

import {
  loadCaseOverview, saveCaseOverview,
  loadEvidenceItems, saveEvidenceItems,
  loadOpposingClaims, saveOpposingClaims,
  loadLawLibrary, saveLawLibrary,
  loadChatHistory, saveChatHistory,
  loadEvidenceRequests, saveEvidenceRequests,
  loadScoresheetState, saveScoresheetState,
  exportCaseBackup, importCaseBackup
} from './utils/storage';
import { calculateScoresheet } from './utils/scoresheetCalc';

export default function App() {
  const [activeTab, setActiveTab] = useState<'defense' | 'opposing' | 'library' | 'chat' | 'timeline' | 'florida' | 'requests' | 'scorecard'>('defense');
  
  // Case Data State
  const [caseOverview, setCaseOverview] = useState<CaseOverview>(loadCaseOverview);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(loadEvidenceItems);
  const [opposingList, setOpposingList] = useState<OpposingClaimItem[]>(loadOpposingClaims);
  const [lawLibrary, setLawLibrary] = useState<LawLibraryItem[]>(loadLawLibrary);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(loadChatHistory);
  const [requestsList, setRequestsList] = useState<EvidenceRequest[]>(loadEvidenceRequests);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Modal States
  const [deepAnalysis, setDeepAnalysis] = useState<{
    isOpen: boolean;
    title: string;
    analysisText: string;
    type: 'defense' | 'opposing';
  }>({
    isOpen: false,
    title: '',
    analysisText: '',
    type: 'defense',
  });

  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [isBrevardModalOpen, setIsBrevardModalOpen] = useState(false);
  const [scoresheet, setScoresheet] = useState<ScoresheetState>(loadScoresheetState);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Compute live scoresheet totals
  const scoresheetTotals = calculateScoresheet(scoresheet);

  const handleLoadBrevardCase = () => {
    setScoresheet(prev => ({
      ...prev,
      courtCaseNumber: "05-2025-CF-028419-AXXX-XX",
      county: "Brevard (Titusville/Viera) - 18th Judicial Circuit",
      judgeName: "Hon. Charles G. Crawford",
      primaryOffense: {
        id: "off-brevard-1",
        statute: "§ 810.02(3)",
        description: "Burglary of Unoccupied Dwelling",
        degree: "2nd_degree",
        level: 6,
        counts: 1,
      },
    }));
    setActiveTab('scorecard');
    showToast("Brevard County 18th Circuit case loaded into Sentencing Scorecard.");
  };

  // Save states upon update
  useEffect(() => {
    saveCaseOverview(caseOverview);
  }, [caseOverview]);

  useEffect(() => {
    saveEvidenceItems(evidenceList);
  }, [evidenceList]);

  useEffect(() => {
    saveOpposingClaims(opposingList);
  }, [opposingList]);

  useEffect(() => {
    saveLawLibrary(lawLibrary);
  }, [lawLibrary]);

  useEffect(() => {
    saveChatHistory(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    saveEvidenceRequests(requestsList);
  }, [requestsList]);

  useEffect(() => {
    saveScoresheetState(scoresheet);
  }, [scoresheet]);

  // Request Center Handlers
  const handleAddRequest = (request: EvidenceRequest) => {
    setRequestsList(prev => [request, ...prev]);
  };

  const handleUpdateRequest = (request: EvidenceRequest) => {
    setRequestsList(prev => prev.map(r => r.id === request.id ? request : r));
  };

  const handleDeleteRequest = (id: string) => {
    setRequestsList(prev => prev.filter(r => r.id !== id));
    showToast("Records request removed from log.");
  };

  const handleSendRequestToVault = (itemData: Partial<EvidenceItem>) => {
    const newEvidence: EvidenceItem = {
      id: `ev-rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: itemData.title || "Disclosed Law Enforcement Record",
      category: itemData.category || "digital",
      description: itemData.description || "Official records obtained pursuant to formal public records demand / subpoena.",
      timestamp: itemData.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 16),
      source: itemData.source || "Official Agency Response",
      exculpatoryRating: itemData.exculpatoryRating || "critical",
      chainOfCustody: itemData.chainOfCustody || {
        custodian: "Public Records Liaison / Defense Archive",
        dateSecured: new Date().toISOString().split('T')[0],
        storageLocation: "Project Innocence Digital Vault",
        status: "secured",
      },
      tags: itemData.tags || ["public_records", "body_cam", "official_disclosure"],
      linkedOpposingIds: itemData.linkedOpposingIds || [],
      verified: true,
      createdAt: new Date().toISOString(),
    };
    setEvidenceList(prev => [newEvidence, ...prev]);
  };

  // Evidence Handlers
  const handleAddEvidence = (item: EvidenceItem) => {
    setEvidenceList(prev => [item, ...prev]);
  };

  const handleUpdateEvidence = (item: EvidenceItem) => {
    setEvidenceList(prev => prev.map(e => e.id === item.id ? item : e));
  };

  const handleDeleteEvidence = (id: string) => {
    setEvidenceList(prev => prev.filter(e => e.id !== id));
  };

  // Opposing Claims Handlers
  const handleAddOpposingClaim = (item: OpposingClaimItem) => {
    setOpposingList(prev => [item, ...prev]);
  };

  const handleUpdateOpposingClaim = (item: OpposingClaimItem) => {
    setOpposingList(prev => prev.map(o => o.id === item.id ? item : o));
  };

  const handleDeleteOpposingClaim = (id: string) => {
    setOpposingList(prev => prev.filter(o => o.id !== id));
  };

  // Law Library Handlers
  const handleToggleBookmark = (id: string) => {
    setLawLibrary(prev => prev.map(l => l.id === id ? { ...l, bookmarked: !l.bookmarked } : l));
  };

  const handleAddCustomLaw = (item: LawLibraryItem) => {
    setLawLibrary(prev => [item, ...prev]);
  };

  // Florida Clerk Import Handlers
  const handleImportFloridaEvidence = (partialItem: Partial<EvidenceItem>) => {
    const newItem: EvidenceItem = {
      id: `fl-ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: partialItem.title || 'Florida Court Record',
      category: partialItem.category || 'document',
      description: partialItem.description || 'Retrieved from Florida Clerk of Courts docket.',
      timestamp: partialItem.timestamp || new Date().toISOString().split('T')[0],
      source: partialItem.source || 'Florida Clerk of Courts',
      exculpatoryRating: partialItem.exculpatoryRating || 'high',
      chainOfCustody: partialItem.chainOfCustody || {
        custodian: 'Florida Clerk of Courts',
        dateSecured: new Date().toISOString().split('T')[0],
        storageLocation: 'Official Florida E-Filing System',
        status: 'secured',
      },
      tags: partialItem.tags || ['florida_court_record'],
      linkedOpposingIds: [],
      verified: true,
      createdAt: new Date().toISOString(),
    };
    setEvidenceList(prev => [newItem, ...prev]);
  };

  const handleImportFloridaOpposing = (partialClaim: Partial<OpposingClaimItem>) => {
    const newClaim: OpposingClaimItem = {
      id: `fl-opp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: partialClaim.title || 'Prosecution Allegation',
      originator: partialClaim.originator || 'State of Florida / State Attorney',
      type: partialClaim.type || 'anticipated_evidence',
      threatLevel: partialClaim.threatLevel || 'high',
      allegationDetails: partialClaim.allegationDetails || 'Filing in court docket.',
      factualReality: partialClaim.factualReality || 'Contested allegation requiring rebuttal.',
      counterStrategy: partialClaim.counterStrategy || 'Review for Florida Rule 3.220 disclosure compliance and cross-examination.',
      evidentiaryDefects: ['Contested factual basis', 'Requires reciprocal discovery scrutiny'],
      counterEvidenceIds: [],
      potentialSubpoenas: 'Subpoena arresting officer notes and raw CAD 911 audio',
      status: partialClaim.status || 'active_allegation',
      createdAt: new Date().toISOString(),
    };
    setOpposingList(prev => [newClaim, ...prev]);
  };

  // Deep Analysis Handlers (Calling Express backend)
  const handleAnalyzeEvidence = async (item: EvidenceItem) => {
    try {
      setDeepAnalysis({
        isOpen: true,
        title: item.title,
        analysisText: "Evaluating evidentiary weight, chain of custody, and admissibility with AI paralegal engine...",
        type: 'defense',
      });

      const res = await fetch('/api/paralegal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, type: 'defense' }),
      });
      const data = await res.json();
      setDeepAnalysis(prev => ({
        ...prev,
        analysisText: data.analysis || "Unable to generate analysis at this time.",
      }));
    } catch (err: any) {
      console.error(err);
      setDeepAnalysis(prev => ({
        ...prev,
        analysisText: `Failed to connect to paralegal server: ${err.message}`,
      }));
    }
  };

  const handleAnalyzeOpposingClaim = async (item: OpposingClaimItem) => {
    try {
      setDeepAnalysis({
        isOpen: true,
        title: item.title,
        analysisText: "Evaluating claim vulnerabilities, hearsay defects, and impeachment strategy with AI paralegal engine...",
        type: 'opposing',
      });

      const res = await fetch('/api/paralegal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, type: 'opposing' }),
      });
      const data = await res.json();
      setDeepAnalysis(prev => ({
        ...prev,
        analysisText: data.analysis || "Unable to generate analysis at this time.",
      }));
    } catch (err: any) {
      console.error(err);
      setDeepAnalysis(prev => ({
        ...prev,
        analysisText: `Failed to connect to paralegal server: ${err.message}`,
      }));
    }
  };

  // Chat Handlers
  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setIsChatLoading(true);

    try {
      const caseContext = {
        caseSummary: caseOverview.coreDefenseTheory,
        defenseEvidenceCount: evidenceList.length,
        opposingCount: opposingList.length,
        defenseItems: evidenceList.slice(0, 8),
        opposingItems: opposingList.slice(0, 8),
        referencedLaws: lawLibrary.slice(0, 5),
      };

      const res = await fetch('/api/paralegal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          caseContext,
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || "I have received your inquiry. Please let me know how else I can assist your defense strategy.",
        timestamp: new Date().toISOString(),
        suggestedActions: [
          "What specific motions should we file?",
          "How can we authenticate this digital evidence?",
          "Draft cross-examination questions for this witness",
        ],
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `I encountered an issue connecting to the paralegal reasoning engine: ${err.message}. Please check your connection or retry shortly.`,
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([]);
    showToast("Paralegal conversation history cleared.");
  };

  // Quick navigation cross-referencing
  const handleConsultParalegalWithEvidence = (item: EvidenceItem) => {
    setActiveTab('chat');
    handleSendMessage(`How does our defense exhibit "${item.title}" (${item.description}) legally protect against potential charges, and what steps should we take to ensure its complete admissibility under Rule 901?`);
  };

  const handleConsultParalegalWithClaim = (item: OpposingClaimItem) => {
    setActiveTab('chat');
    handleSendMessage(`How do we completely dismantle this opposing allegation: "${item.title}" (${item.allegationDetails})? What evidentiary objections (like hearsay or lack of personal knowledge) apply?`);
  };

  const handleConsultParalegalWithLaw = (law: LawLibraryItem) => {
    setActiveTab('chat');
    handleSendMessage(`How can we specifically apply ${law.title} (${law.citation}) to strengthen our Project Innocence defense and protect our client?`);
  };

  // Export / Import Backup
  const handleExportBackup = () => {
    const jsonStr = exportCaseBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Project_Innocence_Case_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Encrypted case backup downloaded successfully.");
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        const success = importCaseBackup(content);
        if (success) {
          setCaseOverview(loadCaseOverview());
          setEvidenceList(loadEvidenceItems());
          setOpposingList(loadOpposingClaims());
          setLawLibrary(loadLawLibrary());
          setChatMessages(loadChatHistory());
          setRequestsList(loadEvidenceRequests());
          showToast("Case backup successfully restored!", "success");
        } else {
          showToast("Failed to parse backup file. Please ensure it is a valid Project Innocence JSON backup.", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        defenseCount={evidenceList.length}
        opposingCount={opposingList.length}
        requestsCount={requestsList.length}
        scoresheetPoints={scoresheetTotals.totalPoints}
        caseOverview={caseOverview}
        onOpenCaseModal={() => setIsCaseModalOpen(true)}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onPrintDossier={() => setIsDossierModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'defense' && (
          <MyEvidenceVault
            evidenceList={evidenceList}
            opposingList={opposingList}
            onAddEvidence={handleAddEvidence}
            onUpdateEvidence={handleUpdateEvidence}
            onDeleteEvidence={handleDeleteEvidence}
            onAnalyzeEvidence={handleAnalyzeEvidence}
            onConsultParalegalWithEvidence={handleConsultParalegalWithEvidence}
            onViewOpposingClaim={() => setActiveTab('opposing')}
          />
        )}

        {activeTab === 'opposing' && (
          <OpposingClaimsVault
            opposingList={opposingList}
            evidenceList={evidenceList}
            onAddOpposingClaim={handleAddOpposingClaim}
            onUpdateOpposingClaim={handleUpdateOpposingClaim}
            onDeleteOpposingClaim={handleDeleteOpposingClaim}
            onAnalyzeOpposingClaim={handleAnalyzeOpposingClaim}
            onConsultParalegalWithClaim={handleConsultParalegalWithClaim}
            onViewDefenseEvidence={() => setActiveTab('defense')}
          />
        )}

        {activeTab === 'library' && (
          <LawLibrary
            lawLibrary={lawLibrary}
            onToggleBookmark={handleToggleBookmark}
            onAddCustomLaw={handleAddCustomLaw}
            onConsultParalegalWithLaw={handleConsultParalegalWithLaw}
          />
        )}

        {activeTab === 'chat' && (
          <ParalegalChat
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            isLoading={isChatLoading}
            evidenceList={evidenceList}
            opposingList={opposingList}
            lawLibrary={lawLibrary}
            caseOverview={caseOverview}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            evidenceList={evidenceList}
            opposingList={opposingList}
            onViewEvidence={() => setActiveTab('defense')}
            onViewOpposing={() => setActiveTab('opposing')}
          />
        )}

        {activeTab === 'requests' && (
          <RequestCenter
            requests={requestsList}
            onAddRequest={handleAddRequest}
            onUpdateRequest={handleUpdateRequest}
            onDeleteRequest={handleDeleteRequest}
            onSendToEvidenceVault={handleSendRequestToVault}
          />
        )}

        {activeTab === 'florida' && (
          <FloridaClerkPortal
            onImportToEvidence={handleImportFloridaEvidence}
            onImportToOpposing={handleImportFloridaOpposing}
            alibiCount={evidenceList.filter(e => e.category === 'alibi').length}
            onOpenBrevardGuide={() => setIsBrevardModalOpen(true)}
            onNavigateToScorecard={(info) => {
              if (info) {
                setScoresheet(prev => ({
                  ...prev,
                  courtCaseNumber: info.ucn,
                  county: info.county,
                }));
              }
              setActiveTab('scorecard');
            }}
          />
        )}

        {activeTab === 'scorecard' && (
          <SentencingScoresheet
            scoresheet={scoresheet}
            onUpdateScoresheet={(updated) => setScoresheet(updated)}
            onOpenBrevardGuide={() => setIsBrevardModalOpen(true)}
            onConsultParalegalWithScoresheet={(summary) => {
              handleSendMessage(`Please review this Florida Criminal Punishment Code (CPC) Scoresheet and provide strategic advice: ${summary}`);
              setActiveTab('chat');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Project Innocence</strong> &bull; Defense Vault & Legal Case Intelligence
          </div>
          <div className="text-[11px] text-slate-400">
            Encrypted Local Preservation &bull; Brady v. Maryland Grounded &bull; Florida CPC Scoring &bull; Gemini 3.8 Legal AI
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DeepAnalysisModal
        isOpen={deepAnalysis.isOpen}
        title={deepAnalysis.title}
        analysisText={deepAnalysis.analysisText}
        type={deepAnalysis.type}
        onClose={() => setDeepAnalysis(prev => ({ ...prev, isOpen: false }))}
      />

      <CaseDetailsModal
        isOpen={isCaseModalOpen}
        caseOverview={caseOverview}
        onClose={() => setIsCaseModalOpen(false)}
        onSave={(updated) => setCaseOverview(updated)}
      />

      <PrintDossierModal
        isOpen={isDossierModalOpen}
        caseOverview={caseOverview}
        evidenceList={evidenceList}
        opposingList={opposingList}
        lawLibrary={lawLibrary}
        onClose={() => setIsDossierModalOpen(false)}
      />

      <BrevardClerkModal
        isOpen={isBrevardModalOpen}
        onClose={() => setIsBrevardModalOpen(false)}
        onLoadBrevardCase={handleLoadBrevardCase}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium border ${
            toastMessage.type === 'error'
              ? 'bg-rose-900/90 text-rose-100 border-rose-700'
              : 'bg-slate-900/95 text-emerald-300 border-slate-700'
          }`}>
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs ml-2 p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
