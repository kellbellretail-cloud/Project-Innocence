import React from 'react';
import { Scale, ShieldCheck, BookOpen, MessageSquare, Clock, AlertTriangle, Download, Upload, FileText, Settings, Building2, Video, Calculator } from 'lucide-react';
import { CaseOverview } from '../types';

interface HeaderProps {
  activeTab: 'defense' | 'opposing' | 'library' | 'chat' | 'timeline' | 'florida' | 'requests' | 'scorecard';
  setActiveTab: (tab: 'defense' | 'opposing' | 'library' | 'chat' | 'timeline' | 'florida' | 'requests' | 'scorecard') => void;
  defenseCount: number;
  opposingCount: number;
  requestsCount: number;
  scoresheetPoints?: number;
  caseOverview: CaseOverview;
  onOpenCaseModal: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onPrintDossier: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  defenseCount,
  opposingCount,
  requestsCount,
  scoresheetPoints,
  caseOverview,
  onOpenCaseModal,
  onExportBackup,
  onImportBackup,
  onPrintDossier,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-serif">Project Innocence</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DEFENSE VAULT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Case Management &bull; Exculpatory Evidence &bull; Fabrication Counter-Strategy &bull; AI Paralegal
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="header-case-info-btn"
              onClick={onOpenCaseModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700"
              title="Edit Case Information"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium truncate max-w-[130px]">{caseOverview.caseTitle}</span>
            </button>

            <button
              id="header-print-dossier-btn"
              onClick={onPrintDossier}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700"
              title="Print / PDF Complete Case Dossier"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Dossier</span>
            </button>

            <button
              id="header-export-btn"
              onClick={onExportBackup}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700"
              title="Export Encrypted JSON Case Backup"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Backup</span>
            </button>

            <button
              id="header-import-btn"
              onClick={onImportBackup}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700"
              title="Import JSON Case File"
            >
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Restore</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none" aria-label="Tabs">
          <button
            id="nav-tab-defense-evidence"
            onClick={() => setActiveTab('defense')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'defense'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>My Evidence Vault</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'defense' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-700 text-slate-300'
            }`}>
              {defenseCount}
            </span>
          </button>

          <button
            id="nav-tab-opposing-claims"
            onClick={() => setActiveTab('opposing')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'opposing'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-300" />
            <span>Opposing & Conjured Claims</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'opposing' ? 'bg-rose-800 text-rose-100' : 'bg-slate-700 text-slate-300'
            }`}>
              {opposingCount}
            </span>
          </button>

          <button
            id="nav-tab-law-library"
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'library'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-300" />
            <span>Law Library</span>
          </button>

          <button
            id="nav-tab-paralegal-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-300" />
            <span>Paralegal Assistant</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
              AI
            </span>
          </button>

          <button
            id="nav-tab-case-timeline"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-300" />
            <span>Defense Chronology</span>
          </button>

          <button
            id="nav-tab-request-center"
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'requests'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4 text-rose-400" />
            <span>Body Cam & Records Desk</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'requests' ? 'bg-rose-800 text-rose-100' : 'bg-slate-700 text-slate-300'
            }`}>
              {requestsCount}
            </span>
          </button>

          <button
            id="nav-tab-florida-clerk"
            onClick={() => setActiveTab('florida')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'florida'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Florida Clerk API</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              FL COURTS
            </span>
          </button>

          <button
            id="nav-tab-sentencing-scorecard"
            onClick={() => setActiveTab('scorecard')}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'scorecard'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>Sentencing Scorecard</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              activeTab === 'scorecard' 
                ? 'bg-amber-800 text-amber-100' 
                : typeof scoresheetPoints === 'number' && scoresheetPoints > 44 
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' 
                  : 'bg-slate-700 text-slate-300'
            }`}>
              {typeof scoresheetPoints === 'number' ? `${scoresheetPoints.toFixed(1)} PTS` : 'CPC'}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
