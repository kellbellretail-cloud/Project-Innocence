import React, { useState } from 'react';
import { Settings, X, Scale, FileText, Check } from 'lucide-react';
import { CaseOverview } from '../types';

interface CaseDetailsModalProps {
  isOpen: boolean;
  caseOverview: CaseOverview;
  onClose: () => void;
  onSave: (updated: CaseOverview) => void;
}

export const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({
  isOpen,
  caseOverview,
  onClose,
  onSave,
}) => {
  const [caseTitle, setCaseTitle] = useState(caseOverview.caseTitle);
  const [caseNumber, setCaseNumber] = useState(caseOverview.caseNumber || '');
  const [jurisdiction, setJurisdiction] = useState(caseOverview.jurisdiction || '');
  const [defenseCounsel, setDefenseCounsel] = useState(caseOverview.defenseCounsel || '');
  const [coreDefenseTheory, setCoreDefenseTheory] = useState(caseOverview.coreDefenseTheory);
  const [incidentDateRange, setIncidentDateRange] = useState(caseOverview.incidentDateRange || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      caseTitle: caseTitle.trim() || 'Defense Case Dossier',
      caseNumber: caseNumber.trim() || undefined,
      jurisdiction: jurisdiction.trim() || undefined,
      defenseCounsel: defenseCounsel.trim() || undefined,
      coreDefenseTheory: coreDefenseTheory.trim() || 'Complete factual innocence.',
      incidentDateRange: incidentDateRange.trim() || undefined,
      lastUpdated: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 my-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900 font-serif">Case Information & Defense Theory</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Case Title / File Reference *</label>
            <input
              type="text"
              required
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Docket / Case Number</label>
              <input
                type="text"
                placeholder="e.g. CR-2026-8842"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Court / Jurisdiction</label>
              <input
                type="text"
                placeholder="e.g. Superior Court of California"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Defense Counsel / Team</label>
              <input
                type="text"
                placeholder="e.g. Jane Doe, Esq. / Pro Se"
                value={defenseCounsel}
                onChange={(e) => setDefenseCounsel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Incident Date Range</label>
              <input
                type="text"
                placeholder="e.g. October 12, 2025"
                value={incidentDateRange}
                onChange={(e) => setIncidentDateRange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Core Defense Theory & Innocence Proposition *</label>
            <textarea
              required
              rows={3}
              placeholder="State the core narrative: e.g., verified physical alibi, impossibility of presence, witness motive to fabricate, digital timestamp contradiction..."
              value={coreDefenseTheory}
              onChange={(e) => setCoreDefenseTheory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
            >
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
