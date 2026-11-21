import React, { useState } from 'react';
import { 
  AlertTriangle, Plus, Search, ShieldAlert, Sparkles, FileText, 
  Trash2, Edit3, ArrowRight, ShieldCheck, CheckCircle, Crosshair, 
  HelpCircle, EyeOff, Gavel, X
} from 'lucide-react';
import { OpposingClaimItem, OpposingClaimType, ThreatLevel, ClaimStatus, EvidenceItem } from '../types';

interface OpposingClaimsVaultProps {
  opposingList: OpposingClaimItem[];
  evidenceList: EvidenceItem[];
  onAddOpposingClaim: (item: OpposingClaimItem) => void;
  onUpdateOpposingClaim: (item: OpposingClaimItem) => void;
  onDeleteOpposingClaim: (id: string) => void;
  onAnalyzeOpposingClaim: (item: OpposingClaimItem) => void;
  onConsultParalegalWithClaim: (item: OpposingClaimItem) => void;
  onViewDefenseEvidence: (evidenceId: string) => void;
}

export const OpposingClaimsVault: React.FC<OpposingClaimsVaultProps> = ({
  opposingList,
  evidenceList,
  onAddOpposingClaim,
  onUpdateOpposingClaim,
  onDeleteOpposingClaim,
  onAnalyzeOpposingClaim,
  onConsultParalegalWithClaim,
  onViewDefenseEvidence,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedThreat, setSelectedThreat] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OpposingClaimItem | null>(null);

  const filteredList = opposingList.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.allegationDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.counterStrategy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesThreat = selectedThreat === 'all' || item.threatLevel === selectedThreat;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesType && matchesThreat && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: OpposingClaimItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, _title?: string) => {
    onDeleteOpposingClaim(id);
  };

  const getThreatBadge = (level: ThreatLevel) => {
    switch (level) {
      case 'critical':
        return 'bg-rose-700 text-white font-bold';
      case 'high':
        return 'bg-rose-500 text-white font-semibold';
      case 'medium':
        return 'bg-amber-600 text-white';
      case 'speculative':
        return 'bg-slate-600 text-white';
    }
  };

  const getTypeBadge = (type: OpposingClaimType) => {
    switch (type) {
      case 'conjured_claim':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'altered_record':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'false_witness':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'hearsay_rumor':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'rebutted_internally':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'motion_prepared':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'active_allegation':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'anticipated_risk':
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Banner */}
      <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">Opposing & Conjured Claims Vault</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold border border-rose-200">
              {opposingList.length} Threats Tracked
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Catalog claims the other side possesses, plans to assert, or may fabricate. Prepare bulletproof counter-strategies before trial.
          </p>
        </div>

        <button
          id="btn-add-opposing-claim"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Log Opposing / Conjured Claim</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative lg:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="opposing-search-input"
            type="text"
            placeholder="Search claims, fabrications, parties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
          />
        </div>

        <div>
          <select
            id="opposing-filter-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
          >
            <option value="all">All Claim Types</option>
            <option value="conjured_claim">Manufactured / Conjured Claim</option>
            <option value="altered_record">Altered / Spoofed Record</option>
            <option value="false_witness">False / Hostile Witness</option>
            <option value="hearsay_rumor">Hearsay / Rumor</option>
            <option value="anticipated_evidence">Anticipated Prosecution Evidence</option>
          </select>
        </div>

        <div>
          <select
            id="opposing-filter-threat"
            value={selectedThreat}
            onChange={(e) => setSelectedThreat(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
          >
            <option value="all">All Threat Levels</option>
            <option value="critical">Critical Threat</option>
            <option value="high">High Threat</option>
            <option value="medium">Medium Threat</option>
            <option value="speculative">Speculative / Low</option>
          </select>
        </div>

        <div>
          <select
            id="opposing-filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
          >
            <option value="all">All Defense Statuses</option>
            <option value="rebutted_internally">Rebutted Internally</option>
            <option value="motion_prepared">Motion Prepared</option>
            <option value="active_allegation">Active Allegation</option>
            <option value="anticipated_risk">Anticipated Risk</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      {filteredList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 p-8">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No opposing claims found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {searchTerm || selectedType !== 'all' || selectedThreat !== 'all' || selectedStatus !== 'all'
              ? "No items match your filter settings. Reset filters to see all tracked claims."
              : "No opposing or conjured claims logged yet. Click 'Log Opposing / Conjured Claim' above to plan your defense rebuttal."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredList.map((item) => {
            const linkedDefenseItems = evidenceList.filter(ev => item.counterEvidenceIds.includes(ev.id));

            return (
              <div
                key={item.id}
                id={`opposing-card-${item.id}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-rose-300 shadow-xs hover:shadow-md transition-all p-5 space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTypeBadge(item.type)}`}>
                      {item.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wide ${getThreatBadge(item.threatLevel)}`}>
                      {item.threatLevel} THREAT
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Originator: <span className="text-slate-800 font-semibold">{item.originator}</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{item.title}</span>
                  </h3>
                </div>

                {/* Side-by-Side: The Allegation vs Factual Reality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* The Allegation Box */}
                  <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200/80 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900 uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      What They Claim or May Conjure Up:
                    </div>
                    <p className="text-slate-800 leading-relaxed">{item.allegationDetails}</p>
                  </div>

                  {/* Factual Reality Box */}
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      The Factual Reality (Defense Truth):
                    </div>
                    <p className="text-slate-800 leading-relaxed">{item.factualReality}</p>
                  </div>
                </div>

                {/* Counter Strategy & Demolition Plan */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Gavel className="w-3.5 h-3.5 text-indigo-600" />
                    Rebuttal Strategy & Evidentiary Demolition:
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">{item.counterStrategy}</p>

                  {/* Identified Evidentiary Defects */}
                  {item.evidentiaryDefects.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80">
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">
                        Identified Evidentiary Vulnerabilities / Rule Defects:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.evidentiaryDefects.map((defect, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-rose-100/80 text-rose-800 border border-rose-200 font-medium">
                            &bull; {defect}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subpoenas */}
                  {item.potentialSubpoenas && (
                    <div className="pt-2 text-slate-600 border-t border-slate-200/80">
                      <span className="font-bold text-slate-700">Subpoenas / Discovery to Compel: </span>
                      <span>{item.potentialSubpoenas}</span>
                    </div>
                  )}
                </div>

                {/* Linked Affirmative Defense Evidence */}
                {linkedDefenseItems.length > 0 && (
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3 text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Counter-Evidence Ready in Your Vault ({linkedDefenseItems.length}):
                    </span>
                    <div className="space-y-1">
                      {linkedDefenseItems.map(ev => (
                        <div key={ev.id} className="flex items-center justify-between text-slate-800 bg-white p-1.5 rounded border border-emerald-100">
                          <span className="font-medium truncate mr-2">&bull; [{ev.category.toUpperCase()}] {ev.title} ({ev.timestamp})</span>
                          <button
                            onClick={() => onViewDefenseEvidence(ev.id)}
                            className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-[11px] font-semibold shrink-0"
                          >
                            <span>View Exhibit</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-analyze-opposing-${item.id}`}
                      onClick={() => onAnalyzeOpposingClaim(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-semibold rounded-md border border-rose-300 transition-colors"
                      title="Run AI Vulnerability & Rebuttal Analysis"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                      <span>Paralegal Rebuttal Plan</span>
                    </button>

                    <button
                      onClick={() => onConsultParalegalWithClaim(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-md border border-slate-200 transition-colors"
                      title="Ask Paralegal Chatbot about this claim"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Consult in Chat</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Claim Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete Claim"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Opposing Claim Modal */}
      {isModalOpen && (
        <OpposingFormModal
          isOpen={isModalOpen}
          initialData={editingItem}
          evidenceList={evidenceList}
          onClose={() => setIsModalOpen(false)}
          onSave={(savedItem) => {
            if (editingItem) {
              onUpdateOpposingClaim(savedItem);
            } else {
              onAddOpposingClaim(savedItem);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Modal Form Subcomponent
interface OpposingFormModalProps {
  isOpen: boolean;
  initialData: OpposingClaimItem | null;
  evidenceList: EvidenceItem[];
  onClose: () => void;
  onSave: (item: OpposingClaimItem) => void;
}

const OpposingFormModal: React.FC<OpposingFormModalProps> = ({
  isOpen,
  initialData,
  evidenceList,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [originator, setOriginator] = useState(initialData?.originator || '');
  const [type, setType] = useState<OpposingClaimType>(initialData?.type || 'conjured_claim');
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>(initialData?.threatLevel || 'high');
  const [status, setStatus] = useState<ClaimStatus>(initialData?.status || 'anticipated_risk');
  const [allegationDetails, setAllegationDetails] = useState(initialData?.allegationDetails || '');
  const [factualReality, setFactualReality] = useState(initialData?.factualReality || '');
  const [counterStrategy, setCounterStrategy] = useState(initialData?.counterStrategy || '');
  const [evidentiaryDefectsStr, setEvidentiaryDefectsStr] = useState(
    initialData?.evidentiaryDefects.join('\n') || ''
  );
  const [potentialSubpoenas, setPotentialSubpoenas] = useState(initialData?.potentialSubpoenas || '');
  const [counterEvidenceIds, setCounterEvidenceIds] = useState<string[]>(initialData?.counterEvidenceIds || []);

  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !allegationDetails.trim()) {
      setFormError('Please provide a title and allegation summary.');
      return;
    }
    setFormError('');

    const defects = evidentiaryDefectsStr
      .split('\n')
      .map(d => d.trim().replace(/^[-*•]\s*/, ''))
      .filter(Boolean);

    const newItem: OpposingClaimItem = {
      id: initialData?.id || `opp-${Date.now()}`,
      title: title.trim(),
      originator: originator.trim() || 'Opposing Party / Unknown',
      type,
      threatLevel,
      status,
      allegationDetails: allegationDetails.trim(),
      factualReality: factualReality.trim() || 'Directly disputed by affirmative defense evidence.',
      counterStrategy: counterStrategy.trim() || 'Prepare impeachment and motion in limine to exclude.',
      evidentiaryDefects: defects.length > 0 ? defects : ['Lack of authentic foundation', 'Potential hearsay'],
      counterEvidenceIds,
      potentialSubpoenas: potentialSubpoenas.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(newItem);
  };

  const toggleEvidenceLink = (id: string) => {
    setCounterEvidenceIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              {initialData ? 'Edit Opposing / Conjured Claim' : 'Log Anticipated Opposing / Conjured Claim'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Originator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Claim / Allegation Title *
              </label>
              <input
                id="form-opposing-title"
                type="text"
                required
                placeholder="e.g. Fabricated SMS Screenshot or False Eyewitness"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Originator / Source *
              </label>
              <input
                id="form-opposing-originator"
                type="text"
                required
                placeholder="e.g. Complaining Witness, Detective, Former Business Partner"
                value={originator}
                onChange={(e) => setOriginator(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Type, Threat, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nature of Claim *
              </label>
              <select
                id="form-opposing-type"
                value={type}
                onChange={(e) => setType(e.target.value as OpposingClaimType)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="conjured_claim">Manufactured / Conjured Claim</option>
                <option value="altered_record">Altered / Spoofed Record</option>
                <option value="false_witness">False / Hostile Witness</option>
                <option value="hearsay_rumor">Hearsay / Rumor</option>
                <option value="anticipated_evidence">Anticipated Prosecution Proof</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Threat Level *
              </label>
              <select
                id="form-opposing-threat"
                value={threatLevel}
                onChange={(e) => setThreatLevel(e.target.value as ThreatLevel)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="critical">Critical Threat</option>
                <option value="high">High Threat</option>
                <option value="medium">Medium Threat</option>
                <option value="speculative">Speculative / Unlikely</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Current Defense Status *
              </label>
              <select
                id="form-opposing-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ClaimStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="anticipated_risk">Anticipated Risk</option>
                <option value="active_allegation">Active Allegation</option>
                <option value="rebutted_internally">Rebutted Internally</option>
                <option value="motion_prepared">Motion to Exclude Prepared</option>
              </select>
            </div>
          </div>

          {/* Allegation Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              What They Claim or May Conjure Up *
            </label>
            <textarea
              id="form-opposing-allegation"
              required
              rows={3}
              placeholder="Describe the accusation, story, or exhibit they may fabricate or present..."
              value={allegationDetails}
              onChange={(e) => setAllegationDetails(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Factual Reality */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              The Factual Reality (What Actually Happened) *
            </label>
            <textarea
              id="form-opposing-reality"
              required
              rows={2}
              placeholder="State the absolute truth, timeline, and facts that disprove this fabrication..."
              value={factualReality}
              onChange={(e) => setFactualReality(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Counter Strategy */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Rebuttal Strategy & Demolition Plan *
            </label>
            <textarea
              id="form-opposing-strategy"
              required
              rows={2}
              placeholder="How the defense will demolish this (e.g. impeachment with prior statements, cellular tower records, lack of chain of custody)..."
              value={counterStrategy}
              onChange={(e) => setCounterStrategy(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Evidentiary Defects (One per line) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Evidentiary Defects & Rule Violations (One per line)
            </label>
            <textarea
              rows={2}
              placeholder="Inadmissible Hearsay (FRE 802)&#10;Lack of Authenticity / Fake Screenshot (FRE 901)&#10;Witness Bias / Motive to Fabricate (FRE 608)"
              value={evidentiaryDefectsStr}
              onChange={(e) => setEvidentiaryDefectsStr(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono"
            />
          </div>

          {/* Link to My Evidence Vault */}
          {evidenceList.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Link Defense Exhibits in Your Vault That Refute This:
              </label>
              <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200 max-h-36 overflow-y-auto space-y-1.5 text-xs">
                {evidenceList.map(ev => (
                  <label key={ev.id} className="flex items-start gap-2 cursor-pointer p-1 rounded hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={counterEvidenceIds.includes(ev.id)}
                      onChange={() => toggleEvidenceLink(ev.id)}
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-slate-800">
                      <strong>[{ev.category.toUpperCase()}]</strong> {ev.title} ({ev.timestamp})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Subpoenas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Subpoenas & Records to Demand to Expose Fabrication
            </label>
            <input
              type="text"
              placeholder="e.g. 911 CAD dispatch audio, Cellebrite phone dump of accuser, native EXIF data"
              value={potentialSubpoenas}
              onChange={(e) => setPotentialSubpoenas(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              id="form-opposing-submit"
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm transition-all"
            >
              {initialData ? 'Save Changes' : 'Log Opposing Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
