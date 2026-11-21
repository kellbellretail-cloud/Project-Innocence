import React, { useState } from 'react';
import { 
  BookOpen, Search, Bookmark, BookmarkCheck, Copy, Check, 
  MessageSquare, Plus, Scale, Shield, FileText, Gavel, ExternalLink, X
} from 'lucide-react';
import { LawLibraryItem, LawCategory } from '../types';

interface LawLibraryProps {
  lawLibrary: LawLibraryItem[];
  onToggleBookmark: (id: string) => void;
  onAddCustomLaw: (item: LawLibraryItem) => void;
  onConsultParalegalWithLaw: (law: LawLibraryItem) => void;
}

export const LawLibrary: React.FC<LawLibraryProps> = ({
  lawLibrary,
  onToggleBookmark,
  onAddCustomLaw,
  onConsultParalegalWithLaw,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredLaws = lawLibrary.filter((law) => {
    const matchesSearch =
      law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.citation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.ruleSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.defenseApplication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedCategory === 'bookmarked') {
      return matchesSearch && law.bookmarked;
    }

    const matchesCategory = selectedCategory === 'all' || law.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCitation = (law: LawLibraryItem) => {
    const textToCopy = `${law.title} (${law.citation})\nSummary: ${law.ruleSummary}\nDefense Application: ${law.defenseApplication}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(law.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryColor = (category: LawCategory) => {
    switch (category) {
      case 'constitutional':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'evidence_rules':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'exculpatory_brady':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'defense_motions':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'procedure_standards':
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getCategoryTitle = (category: LawCategory) => {
    switch (category) {
      case 'constitutional':
        return 'Constitutional Protections';
      case 'evidence_rules':
        return 'Rules of Evidence';
      case 'exculpatory_brady':
        return 'Brady & Exculpatory Duty';
      case 'defense_motions':
        return 'Defense Motion Frameworks';
      case 'procedure_standards':
        return 'Procedures & Burden of Proof';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">Constitutional & Defense Law Library</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
              {lawLibrary.length} Legal Authorities
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Authoritative federal rules of evidence, constitutional protections (Brady, Confrontation Clause, Exclusionary Rule), and defense motion precedents.
          </p>
        </div>

        <button
          id="btn-add-custom-law"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Statute / Precedent</span>
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="law-search-input"
            type="text"
            placeholder="Search by case name (e.g. Brady, Giglio), rule # (FRE 801, FRE 901), or topic (hearsay, suppression)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Authorities ({lawLibrary.length})
          </button>

          <button
            onClick={() => setSelectedCategory('exculpatory_brady')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'exculpatory_brady'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Brady & Exculpatory
          </button>

          <button
            onClick={() => setSelectedCategory('evidence_rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'evidence_rules'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Rules of Evidence (FRE)
          </button>

          <button
            onClick={() => setSelectedCategory('constitutional')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'constitutional'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Constitutional Rights
          </button>

          <button
            onClick={() => setSelectedCategory('defense_motions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'defense_motions'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Defense Motions & Limine
          </button>

          <button
            onClick={() => setSelectedCategory('bookmarked')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'bookmarked'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Saved Bookmarks</span>
          </button>
        </div>
      </div>

      {/* Law Cards */}
      {filteredLaws.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No legal precedents found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search terms or selecting 'All Authorities'.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLaws.map((law) => {
            const isExpanded = expandedId === law.id;

            return (
              <div
                key={law.id}
                id={`law-card-${law.id}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all p-5 space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(law.category)}`}>
                      {getCategoryTitle(law.category)}
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-medium">
                      {law.citation}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleBookmark(law.id)}
                      className={`p-1.5 rounded transition-colors ${
                        law.bookmarked ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={law.bookmarked ? 'Remove Bookmark' : 'Bookmark this Authority'}
                    >
                      {law.bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleCopyCitation(law)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Copy Legal Citation & Defense Application"
                    >
                      {copiedId === law.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{law.title}</span>
                </h3>

                {/* Plain English Rule Summary */}
                <div className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900">Legal Rule: </span>
                  {law.ruleSummary}
                </div>

                {/* Practical Defense Application */}
                <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200/80 text-xs space-y-1">
                  <span className="font-bold text-blue-950 uppercase tracking-wider block">
                    How to Apply in Your Defense:
                  </span>
                  <p className="text-slate-800 leading-relaxed">{law.defenseApplication}</p>
                </div>

                {/* Expandable Statutory Snippet / Judicial Holding */}
                {isExpanded && (
                  <div className="bg-slate-900 text-slate-200 p-3.5 rounded-lg text-xs font-serif leading-relaxed border border-slate-800 space-y-1.5">
                    <span className="text-amber-400 font-sans font-bold uppercase tracking-wider text-[11px] block">
                      Exact Court Holding / Statutory Snippet:
                    </span>
                    <blockquote className="italic text-slate-300 border-l-2 border-amber-500 pl-3">
                      "{law.fullTextSnippet}"
                    </blockquote>
                  </div>
                )}

                {/* Tags & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {law.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : law.id)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100"
                    >
                      {isExpanded ? 'Hide Snippet' : 'View Court Snippet'}
                    </button>

                    <button
                      id={`btn-cite-law-in-chat-${law.id}`}
                      onClick={() => onConsultParalegalWithLaw(law)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-md border border-amber-300 transition-colors"
                      title="Ask Paralegal Chatbot how to apply this rule to your specific case"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                      <span>Ask Paralegal About This Rule</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Law Modal */}
      {isAddModalOpen && (
        <AddCustomLawModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(item) => {
            onAddCustomLaw(item);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Add Custom Law Modal Subcomponent
interface AddCustomLawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: LawLibraryItem) => void;
}

const AddCustomLawModal: React.FC<AddCustomLawModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [citation, setCitation] = useState('');
  const [category, setCategory] = useState<LawCategory>('constitutional');
  const [ruleSummary, setRuleSummary] = useState('');
  const [defenseApplication, setDefenseApplication] = useState('');
  const [fullTextSnippet, setFullTextSnippet] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !ruleSummary.trim()) {
      setFormError('Please provide a title and legal rule summary.');
      return;
    }
    setFormError('');

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    const newItem: LawLibraryItem = {
      id: `law-custom-${Date.now()}`,
      category,
      title: title.trim(),
      citation: citation.trim() || 'State / Federal Authority',
      ruleSummary: ruleSummary.trim(),
      defenseApplication: defenseApplication.trim() || 'Cite in pre-trial motions or evidentiary objections.',
      fullTextSnippet: fullTextSnippet.trim() || ruleSummary.trim(),
      tags: tags.length > 0 ? tags : ['custom', category],
      keyPhrases: [title.trim()],
      bookmarked: true,
    };

    onSave(newItem);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 my-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Add Custom Statute or Court Precedent
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. State v. Davis or Penal Code § 245"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Citation</label>
              <input
                type="text"
                placeholder="e.g. 123 F.3d 456 (2022) or Cal. Evid. Code 352"
                value={citation}
                onChange={(e) => setCitation(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as LawCategory)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="constitutional">Constitutional Protections</option>
              <option value="evidence_rules">Rules of Evidence</option>
              <option value="exculpatory_brady">Brady & Exculpatory Duty</option>
              <option value="defense_motions">Defense Motion Practice</option>
              <option value="procedure_standards">Standards & Procedure</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Legal Rule Summary *</label>
            <textarea
              required
              rows={2}
              placeholder="What principle of law does this authority establish?"
              value={ruleSummary}
              onChange={(e) => setRuleSummary(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Defense Application</label>
            <textarea
              rows={2}
              placeholder="How will the defense use this in the case?"
              value={defenseApplication}
              onChange={(e) => setDefenseApplication(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Court Holding Snippet</label>
            <textarea
              rows={2}
              placeholder="Exact language from the opinion or statute..."
              value={fullTextSnippet}
              onChange={(e) => setFullTextSnippet(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tags (Comma Separated)</label>
            <input
              type="text"
              placeholder="e.g. search, alibi, phone, state law"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
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
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm"
            >
              Add Authority
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
