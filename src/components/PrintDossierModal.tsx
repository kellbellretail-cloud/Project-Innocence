import React from 'react';
import { Printer, X, Scale, ShieldCheck, AlertTriangle, BookOpen } from 'lucide-react';
import { CaseOverview, EvidenceItem, OpposingClaimItem, LawLibraryItem } from '../types';

interface PrintDossierModalProps {
  isOpen: boolean;
  caseOverview: CaseOverview;
  evidenceList: EvidenceItem[];
  opposingList: OpposingClaimItem[];
  lawLibrary: LawLibraryItem[];
  onClose: () => void;
}

export const PrintDossierModal: React.FC<PrintDossierModalProps> = ({
  isOpen,
  caseOverview,
  evidenceList,
  opposingList,
  lawLibrary,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl border border-slate-200 max-h-[94vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:m-0 print:p-0">
        {/* Controls - Hidden when printing */}
        <div className="flex items-center justify-between border-b pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-slate-800" />
            <h3 className="text-xl font-bold text-slate-900 font-serif">Defense Case Dossier & Summary</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-6 text-slate-900 font-serif">
          {/* Header Block */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold tracking-tight uppercase font-serif">PROJECT INNOCENCE</h1>
                <h2 className="text-base font-semibold text-slate-700">{caseOverview.caseTitle}</h2>
                <div className="text-xs font-sans text-slate-500 mt-1">
                  Docket: {caseOverview.caseNumber || 'Pending'} &bull; Jurisdiction: {caseOverview.jurisdiction || 'Unspecified'} &bull; Defense: {caseOverview.defenseCounsel || 'Defense Vault'}
                </div>
              </div>
              <div className="text-right text-xs font-sans text-slate-500">
                <div>Date: {new Date().toLocaleDateString()}</div>
                <div>CONFIDENTIAL DEFENSE WORK PRODUCT</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs font-sans leading-relaxed">
              <strong>Core Defense Proposition & Alibi Theory: </strong>
              {caseOverview.coreDefenseTheory}
            </div>
          </div>

          {/* Section 1: Affirmative Defense Exhibits (Evidence I Have) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold uppercase tracking-wider font-sans border-b border-slate-300 pb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Section 1: Affirmative Defense Evidence Vault ({evidenceList.length} Exhibits)
            </h3>

            <div className="space-y-3 font-sans text-xs">
              {evidenceList.map((item, idx) => (
                <div key={item.id} className="p-3 border border-slate-200 rounded bg-white space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Exhibit #{idx + 1}: {item.title}</span>
                    <span className="uppercase text-emerald-800">[{item.category}] - {item.exculpatoryRating} Value</span>
                  </div>
                  <div className="text-slate-500">
                    Anchor: <strong>{item.timestamp}</strong> &bull; Origin: {item.source}
                  </div>
                  <p className="text-slate-800 pt-1 leading-relaxed">{item.description}</p>
                  <div className="text-slate-600 font-mono text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200">
                    Custodian: {item.chainOfCustody.custodian} ({item.chainOfCustody.storageLocation}) | Status: {item.chainOfCustody.status}
                    {item.chainOfCustody.hashOrVerification && ` | Verification: ${item.chainOfCustody.hashOrVerification}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Opposing Claims & Fabrication Counter-Strategies */}
          <div className="space-y-3 pt-4">
            <h3 className="text-base font-bold uppercase tracking-wider font-sans border-b border-slate-300 pb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              Section 2: Opposing / Conjured Allegations & Demolition Strategies ({opposingList.length} Items)
            </h3>

            <div className="space-y-3 font-sans text-xs">
              {opposingList.map((opp, idx) => (
                <div key={opp.id} className="p-3 border border-slate-200 rounded bg-white space-y-2">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Threat #{idx + 1}: {opp.title}</span>
                    <span className="uppercase text-rose-800">[{opp.threatLevel} THREAT] - {opp.status}</span>
                  </div>
                  <div className="text-slate-500">
                    Source / Originator: <strong>{opp.originator}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                    <div>
                      <strong className="text-rose-900">Allegation: </strong>
                      <span>{opp.allegationDetails}</span>
                    </div>
                    <div>
                      <strong className="text-emerald-900">Factual Reality: </strong>
                      <span>{opp.factualReality}</span>
                    </div>
                  </div>
                  <div>
                    <strong>Rebuttal Plan: </strong>
                    <span>{opp.counterStrategy}</span>
                  </div>
                  {opp.evidentiaryDefects.length > 0 && (
                    <div className="text-[11px] text-rose-800 font-medium">
                      Evidentiary Defects: {opp.evidentiaryDefects.join('; ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Legal Authorities */}
          <div className="space-y-3 pt-4">
            <h3 className="text-base font-bold uppercase tracking-wider font-sans border-b border-slate-300 pb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-700" />
              Section 3: Key Governing Legal Authorities Cited
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-sans text-xs">
              {lawLibrary.slice(0, 6).map(law => (
                <div key={law.id} className="p-2 border rounded bg-slate-50/60">
                  <div className="font-bold text-slate-900">{law.title}</div>
                  <div className="text-slate-500 font-mono text-[10px]">{law.citation}</div>
                  <div className="text-slate-700 text-[11px] mt-1">{law.ruleSummary}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Confidential Notice */}
          <div className="pt-6 border-t border-slate-300 text-center text-[10px] font-sans text-slate-500 uppercase tracking-widest">
            Privileged Defense Work Product &bull; Protected under Attorney-Client & Sixth Amendment Doctrines
          </div>
        </div>
      </div>
    </div>
  );
};
