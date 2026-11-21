import React, { useState } from 'react';
import { 
  ShieldCheck, Plus, Search, Filter, Calendar, MapPin, UserCheck, 
  FileText, Hash, Link as LinkIcon, Trash2, Edit3, Sparkles, CheckCircle2, 
  Paperclip, Eye, ExternalLink, ArrowRight, X
} from 'lucide-react';
import { EvidenceItem, EvidenceCategory, ExculpatoryRating, OpposingClaimItem } from '../types';

interface MyEvidenceVaultProps {
  evidenceList: EvidenceItem[];
  opposingList: OpposingClaimItem[];
  onAddEvidence: (item: EvidenceItem) => void;
  onUpdateEvidence: (item: EvidenceItem) => void;
  onDeleteEvidence: (id: string) => void;
  onAnalyzeEvidence: (item: EvidenceItem) => void;
  onConsultParalegalWithEvidence: (item: EvidenceItem) => void;
  onViewOpposingClaim: (opposingId: string) => void;
}

export const MyEvidenceVault: React.FC<MyEvidenceVaultProps> = ({
  evidenceList,
  opposingList,
  onAddEvidence,
  onUpdateEvidence,
  onDeleteEvidence,
  onAnalyzeEvidence,
  onConsultParalegalWithEvidence,
  onViewOpposingClaim,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EvidenceItem | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<any | null>(null);

  // Filtered evidence items
  const filteredItems = evidenceList.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesRating = selectedRating === 'all' || item.exculpatoryRating === selectedRating;

    return matchesSearch && matchesCategory && matchesRating;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EvidenceItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, _title?: string) => {
    onDeleteEvidence(id);
  };

  const getCategoryBadgeClass = (category: EvidenceCategory) => {
    switch (category) {
      case 'alibi':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'digital':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'financial':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'witness':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'physical':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getRatingBadgeClass = (rating: ExculpatoryRating) => {
    switch (rating) {
      case 'critical':
        return 'bg-emerald-600 text-white font-bold';
      case 'high':
        return 'bg-emerald-500 text-white font-semibold';
      case 'moderate':
        return 'bg-teal-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">My Evidence Vault</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              {evidenceList.length} Exhibits Secured
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Store, catalog, and secure all affirmative exculpatory evidence, alibis, timestamps, and witness affidavits.
          </p>
        </div>

        <button
          id="btn-add-defense-evidence"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Defense Evidence</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="evidence-search-input"
            type="text"
            placeholder="Search exhibits, alibi details, sources, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
          />
        </div>

        <div>
          <select
            id="evidence-filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          >
            <option value="all">All Categories</option>
            <option value="alibi">Alibi & Location</option>
            <option value="digital">Digital & Telecom</option>
            <option value="financial">Financial & Receipts</option>
            <option value="witness">Witness Affidavits</option>
            <option value="physical">Physical Evidence</option>
            <option value="document">Official Documents</option>
          </select>
        </div>

        <div>
          <select
            id="evidence-filter-rating"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          >
            <option value="all">All Exculpatory Values</option>
            <option value="critical">Critical (Case-Dispositive)</option>
            <option value="high">High (Direct Proof)</option>
            <option value="moderate">Moderate (Corroborating)</option>
            <option value="supporting">Supporting (Contextual)</option>
          </select>
        </div>
      </div>

      {/* Evidence List / Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 p-8">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No defense exhibits found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {searchTerm || selectedCategory !== 'all' || selectedRating !== 'all'
              ? "No items match your current filter criteria. Try resetting filters or changing search keywords."
              : "Your vault is currently empty. Click 'Add Defense Evidence' above to log receipts, alibis, messages, or affidavits."}
          </p>
          {(searchTerm || selectedCategory !== 'all' || selectedRating !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedRating('all'); }}
              className="mt-3 text-xs text-emerald-700 font-semibold hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => {
            const linkedClaims = opposingList.filter(opp => item.linkedOpposingIds.includes(opp.id));

            return (
              <div
                key={item.id}
                id={`evidence-card-${item.id}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-5 space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(item.category)}`}>
                      {item.category.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wide ${getRatingBadgeClass(item.exculpatoryRating)}`}>
                      {item.exculpatoryRating} VALUE
                    </span>
                    {item.verified && (
                      <span className="flex items-center gap-1 text-emerald-700 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Authenticity</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-medium">{item.timestamp}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">{item.title}</h3>
                  <p className="text-sm text-slate-700 mt-1.5 whitespace-pre-line leading-relaxed">{item.description}</p>
                </div>

                {/* Source & Custody Details Box */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 font-semibold block">Origin / Evidentiary Source:</span>
                    <span className="text-slate-800 font-medium">{item.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Chain of Custody Custodian:</span>
                    <span className="text-slate-800 font-medium">
                      {item.chainOfCustody.custodian} ({item.chainOfCustody.storageLocation})
                    </span>
                  </div>
                  {item.chainOfCustody.hashOrVerification && (
                    <div className="md:col-span-2 flex items-center gap-1.5 text-slate-600 font-mono bg-white p-1.5 rounded border border-slate-200 truncate">
                      <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">Verification: {item.chainOfCustody.hashOrVerification}</span>
                    </div>
                  )}
                </div>

                {/* File Attachment & Tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center flex-wrap gap-1.5">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {item.fileAttachment && (
                    <button
                      onClick={() => setPreviewAttachment(item.fileAttachment)}
                      className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 font-medium transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{item.fileAttachment.name} ({(item.fileAttachment.size / 1024).toFixed(1)} KB)</span>
                    </button>
                  )}
                </div>

                {/* Refutes / Dismantles Opposing Claims Banner */}
                {linkedClaims.length > 0 && (
                  <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3 text-xs">
                    <span className="font-bold text-rose-800 flex items-center gap-1.5 mb-1.5">
                      <LinkIcon className="w-3.5 h-3.5" />
                      Directly Dismantles Opposing / Conjured Claim(s):
                    </span>
                    <div className="space-y-1">
                      {linkedClaims.map(claim => (
                        <div key={claim.id} className="flex items-center justify-between text-slate-800 bg-white p-1.5 rounded border border-rose-100">
                          <span className="font-medium truncate mr-2">&bull; {claim.title}</span>
                          <button
                            onClick={() => onViewOpposingClaim(claim.id)}
                            className="text-rose-700 hover:text-rose-900 flex items-center gap-1 text-[11px] font-semibold shrink-0"
                          >
                            <span>View Threat</span>
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
                      id={`btn-analyze-evidence-${item.id}`}
                      onClick={() => onAnalyzeEvidence(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-md border border-amber-300 transition-colors"
                      title="Run AI Evidentiary Stress Test & Admissibility Analysis"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Paralegal Analysis</span>
                    </button>

                    <button
                      onClick={() => onConsultParalegalWithEvidence(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-md border border-slate-200 transition-colors"
                      title="Open in Paralegal Chat"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Consult in Chat</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Exhibit Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete Exhibit"
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

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-slate-900 truncate">{previewAttachment.name}</h4>
              <button onClick={() => setPreviewAttachment(null)} className="text-slate-500 hover:text-slate-800 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            {previewAttachment.dataUrl && previewAttachment.type.startsWith('image/') ? (
              <img src={previewAttachment.dataUrl} alt={previewAttachment.name} className="max-h-[400px] mx-auto rounded border" />
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded border text-sm text-slate-600">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p>Document file attached: <strong>{previewAttachment.name}</strong></p>
                <p className="text-xs text-slate-400 mt-1">Size: {(previewAttachment.size / 1024).toFixed(1)} KB &bull; Type: {previewAttachment.type || 'Document'}</p>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewAttachment(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Evidence Modal */}
      {isModalOpen && (
        <EvidenceFormModal
          isOpen={isModalOpen}
          initialData={editingItem}
          opposingList={opposingList}
          onClose={() => setIsModalOpen(false)}
          onSave={(savedItem) => {
            if (editingItem) {
              onUpdateEvidence(savedItem);
            } else {
              onAddEvidence(savedItem);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Sub-component: Evidence Modal Form
interface EvidenceFormModalProps {
  isOpen: boolean;
  initialData: EvidenceItem | null;
  opposingList: OpposingClaimItem[];
  onClose: () => void;
  onSave: (item: EvidenceItem) => void;
}

const EvidenceFormModal: React.FC<EvidenceFormModalProps> = ({
  isOpen,
  initialData,
  opposingList,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<EvidenceCategory>(initialData?.category || 'alibi');
  const [description, setDescription] = useState(initialData?.description || '');
  const [timestamp, setTimestamp] = useState(initialData?.timestamp || '');
  const [source, setSource] = useState(initialData?.source || '');
  const [exculpatoryRating, setExculpatoryRating] = useState<ExculpatoryRating>(initialData?.exculpatoryRating || 'high');
  const [custodian, setCustodian] = useState(initialData?.chainOfCustody.custodian || '');
  const [dateSecured, setDateSecured] = useState(initialData?.chainOfCustody.dateSecured || new Date().toISOString().split('T')[0]);
  const [storageLocation, setStorageLocation] = useState(initialData?.chainOfCustody.storageLocation || 'Defense Vault Archive');
  const [hashOrVerification, setHashOrVerification] = useState(initialData?.chainOfCustody.hashOrVerification || '');
  const [tagsStr, setTagsStr] = useState(initialData?.tags.join(', ') || '');
  const [linkedOpposingIds, setLinkedOpposingIds] = useState<string[]>(initialData?.linkedOpposingIds || []);
  const [verified, setVerified] = useState(initialData?.verified ?? true);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [attachment, setAttachment] = useState<any>(initialData?.fileAttachment || null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFormError('Please provide a title and description for this evidence item.');
      return;
    }
    setFormError('');

    const tags = tagsStr.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

    const newItem: EvidenceItem = {
      id: initialData?.id || `ev-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim(),
      timestamp: timestamp.trim() || 'Date Unspecified',
      source: source.trim() || 'Direct Defense Custody',
      exculpatoryRating,
      chainOfCustody: {
        custodian: custodian.trim() || 'Defense Team',
        dateSecured: dateSecured || new Date().toISOString().split('T')[0],
        storageLocation: storageLocation.trim() || 'Defense Vault',
        hashOrVerification: hashOrVerification.trim() || undefined,
        status: 'secured',
      },
      fileAttachment: attachment,
      tags: tags.length > 0 ? tags : ['defense', category],
      linkedOpposingIds,
      verified,
      notes: notes.trim() || undefined,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(newItem);
  };

  const toggleLinkedClaim = (id: string) => {
    setLinkedOpposingIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              {initialData ? 'Edit Defense Evidence Exhibit' : 'Log New Defense Evidence Exhibit'}
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
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Exhibit Title *
              </label>
              <input
                id="form-evidence-title"
                type="text"
                required
                placeholder="e.g. Google Maps Location Telemetry & Store Receipt"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                id="form-evidence-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as EvidenceCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="alibi">Alibi & Location</option>
                <option value="digital">Digital & Telecom</option>
                <option value="financial">Financial & Receipts</option>
                <option value="witness">Witness Affidavit</option>
                <option value="physical">Physical Item</option>
                <option value="document">Official Document</option>
                <option value="other">Other Exhibit</option>
              </select>
            </div>
          </div>

          {/* Timestamp & Exculpatory Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Date & Time Anchor (Crucial for Alibi)
              </label>
              <input
                id="form-evidence-timestamp"
                type="text"
                placeholder="e.g. 2025-10-12 19:45 or Exact Date/Time"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Exculpatory Value *
              </label>
              <select
                id="form-evidence-rating"
                value={exculpatoryRating}
                onChange={(e) => setExculpatoryRating(e.target.value as ExculpatoryRating)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="critical">Critical (Disproves Case / Complete Alibi)</option>
                <option value="high">High (Direct Proof of Innocence)</option>
                <option value="moderate">Moderate (Corroborating Fact)</option>
                <option value="supporting">Supporting (Background Context)</option>
              </select>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Factual Description & Proof Summary *
            </label>
            <textarea
              id="form-evidence-description"
              required
              rows={3}
              placeholder="Detail what this evidence proves, how it establishes your innocence, and why it cannot be refuted..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Source & Custody Details */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-600" />
              Chain of Custody & Authentication (FRE 901)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-0.5">
                  Evidentiary Source / Origin
                </label>
                <input
                  type="text"
                  placeholder="e.g. AT&T Subpoena, Target POS, Dr. Smith"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-0.5">
                  Current Custodian / Holder
                </label>
                <input
                  type="text"
                  placeholder="e.g. Defense Attorney, Investigator, Self"
                  value={custodian}
                  onChange={(e) => setCustodian(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-0.5">
                  Storage Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Encrypted Drive, Evidence Locker A"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-0.5">
                  Hash / Certificate / Notary Seal
                </label>
                <input
                  type="text"
                  placeholder="e.g. SHA-256 hash, Notary Stamp #, Cert FRE 902"
                  value={hashOrVerification}
                  onChange={(e) => setHashOrVerification(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                />
              </div>
            </div>
          </div>

          {/* Dismantles Opposing Claims Checkboxes */}
          {opposingList.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Link to Opposing / Conjured Claim(s) This Dismantles:
              </label>
              <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-200 max-h-36 overflow-y-auto space-y-1.5 text-xs">
                {opposingList.map(opp => (
                  <label key={opp.id} className="flex items-start gap-2 cursor-pointer p-1 rounded hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={linkedOpposingIds.includes(opp.id)}
                      onChange={() => toggleLinkedClaim(opp.id)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-800">
                      <strong>[{opp.threatLevel.toUpperCase()}]</strong> {opp.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* File Attachment & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="e.g. alibi, receipt, timestamp, camera"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Attach File / Document / Photo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>
              {attachment && (
                <div className="flex items-center justify-between mt-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <span className="truncate">{attachment.name}</span>
                  <button type="button" onClick={() => setAttachment(null)} className="text-slate-400 hover:text-rose-600 ml-1">
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Verified Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="form-evidence-verified"
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <label htmlFor="form-evidence-verified" className="text-xs text-slate-700 font-medium cursor-pointer">
              Verified authenticity: Ready to be disclosed in formal defense discovery / reciprocal filings.
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              id="form-evidence-submit"
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all"
            >
              {initialData ? 'Save Changes' : 'Add to Defense Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
