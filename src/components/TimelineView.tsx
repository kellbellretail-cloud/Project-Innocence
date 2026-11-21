import React, { useState } from 'react';
import { 
  Clock, Calendar, ShieldCheck, AlertTriangle, Filter, CheckCircle2, 
  ArrowRight, Sparkles, MapPin, Hash 
} from 'lucide-react';
import { EvidenceItem, OpposingClaimItem } from '../types';

interface TimelineViewProps {
  evidenceList: EvidenceItem[];
  opposingList: OpposingClaimItem[];
  onViewEvidence: (id: string) => void;
  onViewOpposing: (id: string) => void;
}

interface TimelineEntry {
  id: string;
  type: 'defense' | 'opposing';
  title: string;
  timestamp: string;
  details: string;
  categoryOrThreat: string;
  sourceOrOrigin: string;
  rawItem: EvidenceItem | OpposingClaimItem;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  evidenceList,
  opposingList,
  onViewEvidence,
  onViewOpposing,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'defense' | 'opposing'>('all');

  // Build unified chronological list
  const entries: TimelineEntry[] = [
    ...evidenceList.map(ev => ({
      id: ev.id,
      type: 'defense' as const,
      title: ev.title,
      timestamp: ev.timestamp || 'Date Not Specified',
      details: ev.description,
      categoryOrThreat: ev.category.toUpperCase(),
      sourceOrOrigin: ev.source,
      rawItem: ev,
    })),
    ...opposingList.map(opp => ({
      id: opp.id,
      type: 'opposing' as const,
      title: opp.title,
      timestamp: opp.createdAt.split('T')[0] || 'Allegation Period',
      details: opp.allegationDetails,
      categoryOrThreat: `${opp.threatLevel.toUpperCase()} THREAT`,
      sourceOrOrigin: opp.originator,
      rawItem: opp,
    })),
  ];

  // Sort chronological
  entries.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const filteredEntries = entries.filter(e => {
    if (filterType === 'defense') return e.type === 'defense';
    if (filterType === 'opposing') return e.type === 'opposing';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">Defense Chronology & Timeline</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200">
              {entries.length} Anchor Points
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Compare affirmative alibis, verified receipts, and witness timestamps against manufactured allegations to prove factual impossibility.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterType === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Events ({entries.length})
          </button>
          <button
            onClick={() => setFilterType('defense')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterType === 'defense' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Defense Exhibits ({evidenceList.length})
          </button>
          <button
            onClick={() => setFilterType('opposing')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterType === 'opposing' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Opposing Claims ({opposingList.length})
          </button>
        </div>
      </div>

      {/* Alibi Contradiction Highlight Box */}
      <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-rose-50 p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Alibi Impossibility Analysis</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          When opposing claims assert presence at a specific location or time, cross-link your digital GPS, POS cashier receipts, or physician affidavits. In court, timestamped business records (FRE 803(6)) conclusively refute subjective witness assertions.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
        {filteredEntries.map((entry, index) => {
          const isDefense = entry.type === 'defense';

          return (
            <div key={`${entry.id}-${index}`} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                  isDefense ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {isDefense ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              </div>

              {/* Card */}
              <div
                className={`bg-white rounded-xl p-4 border shadow-2xs hover:shadow-sm transition-all space-y-2 ${
                  isDefense ? 'border-emerald-200 hover:border-emerald-300' : 'border-rose-200 hover:border-rose-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isDefense ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {entry.categoryOrThreat}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {entry.timestamp}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500">
                    Source: <strong className="text-slate-800">{entry.sourceOrOrigin}</strong>
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 font-serif">{entry.title}</h4>

                <p className="text-xs text-slate-700 leading-relaxed">{entry.details}</p>

                <div className="pt-2 flex justify-end">
                  {isDefense ? (
                    <button
                      onClick={() => onViewEvidence(entry.id)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                    >
                      <span>View in Defense Vault</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewOpposing(entry.id)}
                      className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
                    >
                      <span>View Opposing Threat Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
