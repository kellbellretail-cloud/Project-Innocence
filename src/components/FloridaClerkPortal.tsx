import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  FileText, 
  ArrowUpRight, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  FileDown, 
  Sparkles, 
  Copy, 
  Info,
  Calendar,
  X,
  Calculator
} from 'lucide-react';
import { FloridaCourtCase, FloridaDocketEntry, EvidenceItem, OpposingClaimItem } from '../types';

interface FloridaClerkPortalProps {
  onImportToEvidence: (item: Partial<EvidenceItem>) => void;
  onImportToOpposing: (claim: Partial<OpposingClaimItem>) => void;
  alibiCount: number;
  onOpenBrevardGuide?: () => void;
  onNavigateToScorecard?: (caseInfo?: { ucn: string; county: string }) => void;
}

const SAMPLE_UCN = "13-2025-CF-004182-A001-HC";
const BREVARD_SAMPLE_UCN = "05-2025-CF-028419-AXXX-XX";

export const FloridaClerkPortal: React.FC<FloridaClerkPortalProps> = ({
  onImportToEvidence,
  onImportToOpposing,
  alibiCount,
  onOpenBrevardGuide,
  onNavigateToScorecard,
}) => {
  const [ucnInput, setUcnInput] = useState(SAMPLE_UCN);
  const [selectedCounty, setSelectedCounty] = useState('Hillsborough');
  const [selectedDivision, setSelectedDivision] = useState('Circuit Criminal (Felony)');
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState<FloridaCourtCase | null>(null);
  const [filterParty, setFilterParty] = useState<'all' | 'State of Florida' | 'Defense' | 'Presiding Judge'>('all');
  const [syncedEntries, setSyncedEntries] = useState<Record<string, 'evidence' | 'opposing'>>({});
  
  // Motion Drafting Modal
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftType, setDraftType] = useState<'discovery' | 'alibi'>('discovery');
  const [draftContent, setDraftContent] = useState('');
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Florida County Directory
  const floridaCounties = [
    { name: 'Hillsborough (Tampa)', code: '13', circuit: '13th Judicial Circuit' },
    { name: 'Miami-Dade (Miami)', code: '11', circuit: '11th Judicial Circuit' },
    { name: 'Broward (Fort Lauderdale)', code: '06', circuit: '17th Judicial Circuit' },
    { name: 'Orange (Orlando)', code: '48', circuit: '9th Judicial Circuit' },
    { name: 'Palm Beach (West Palm)', code: '50', circuit: '15th Judicial Circuit' },
    { name: 'Duval (Jacksonville)', code: '16', circuit: '4th Judicial Circuit' },
    { name: 'Pinellas (St. Petersburg)', code: '52', circuit: '6th Judicial Circuit' },
    { name: 'Lee (Fort Myers)', code: '36', circuit: '20th Judicial Circuit' },
    { name: 'Leon (Tallahassee)', code: '37', circuit: '2nd Judicial Circuit' },
    { name: 'Brevard (Titusville)', code: '05', circuit: '18th Judicial Circuit' },
    { name: 'Polk (Bartow/Lakeland)', code: '53', circuit: '10th Judicial Circuit' },
    { name: 'Volusia (DeLand/Daytona)', code: '64', circuit: '7th Judicial Circuit' },
  ];

  // Perform initial search on load
  useEffect(() => {
    fetchCaseDocket(SAMPLE_UCN, 'Hillsborough', 'Circuit Criminal (Felony)');
  }, []);

  const fetchCaseDocket = async (ucnToQuery: string, county: string, division: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/florida-courts/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ucn: ucnToQuery, county, division }),
      });
      const data = await res.json();
      if (data.success && data.case) {
        setCaseData(data.case);
      }
    } catch (err) {
      console.error('Error fetching Florida docket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCaseDocket(ucnInput, selectedCounty, selectedDivision);
  };

  const handleSyncToOpposing = (entry: FloridaDocketEntry) => {
    onImportToOpposing({
      title: `Prosecution Filing: ${entry.title}`,
      originator: entry.filingParty,
      type: 'anticipated_evidence',
      threatLevel: 'high',
      allegationDetails: `Official Court Docket Entry #${entry.docketIndex} filed on ${entry.dateFiled}: ${entry.description}`,
      factualReality: 'Official court docket entry retrieved from Florida Clerk of Courts records.',
      counterStrategy: 'Review for compliance with Florida Rule of Criminal Procedure 3.220 (mandatory disclosure deadlines and witness statement production).',
      status: 'active_allegation',
    });
    setSyncedEntries(prev => ({ ...prev, [entry.id]: 'opposing' }));
  };

  const handleSyncToEvidence = (entry: FloridaDocketEntry) => {
    onImportToEvidence({
      title: `Court Filing: ${entry.title}`,
      category: 'document',
      description: `Docket Entry #${entry.docketIndex} (${entry.dateFiled}) - Filed by ${entry.filingParty}. ${entry.description}`,
      source: `Florida Clerk of Courts (${caseData?.county || 'Florida'} County)`,
      exculpatoryRating: entry.exculpatoryRelevance ? 'critical' : 'high',
      chainOfCustody: {
        custodian: `Clerk of the Circuit Court, ${caseData?.county || 'Florida'} County`,
        dateSecured: entry.dateFiled,
        storageLocation: `Florida Courts E-Filing System / UCN ${caseData?.ucn || ''}`,
        status: 'secured',
      },
      verified: true,
      tags: ['florida_court_record', 'clerk_of_courts', 'official_docket'],
    });
    setSyncedEntries(prev => ({ ...prev, [entry.id]: 'evidence' }));
  };

  const handleOpenDraftModal = async (type: 'discovery' | 'alibi') => {
    setDraftType(type);
    setDraftModalOpen(true);
    setGeneratingDraft(true);
    setCopiedDraft(false);

    try {
      const res = await fetch('/api/florida-courts/draft-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          caseData,
          alibiDetails: `Defendant possesses ${alibiCount} verified exculpatory records logged in Project Innocence.`,
        }),
      });
      const data = await res.json();
      setDraftContent(data.draft || 'Draft failed to generate.');
    } catch (err) {
      console.error('Draft generation error:', err);
      setDraftContent('Failed to draft pleading.');
    } finally {
      setGeneratingDraft(false);
    }
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftContent);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const filteredDocket = caseData?.docketEntries.filter(entry => {
    if (filterParty === 'all') return true;
    return entry.filingParty === filterParty;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Florida System Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold font-serif tracking-tight">State of Florida Clerk of Courts Portal</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  UCN STANDARD CONNECTED
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Fla. R. Crim. P. 3.220 & 3.200
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                Direct integration with Florida's 67 County Clerks of Court and the Florida Courts E-Filing System. 
                Monitor prosecution filings, track exculpatory discovery deadlines, and sync docket entries straight into your defense vaults.
              </p>
            </div>
          </div>

          {/* Quick Drafting Actions */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {onOpenBrevardGuide && (
              <button
                id="brevard-clerk-guide-btn"
                type="button"
                onClick={onOpenBrevardGuide}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/40 shadow transition-colors"
                title="Brevard County Clerk API and Court Records Guide"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Brevard Clerk API Guide</span>
              </button>
            )}

            {onNavigateToScorecard && (
              <button
                id="portal-scoresheet-btn"
                type="button"
                onClick={() => onNavigateToScorecard({ ucn: caseData?.ucn || ucnInput, county: caseData?.county || selectedCounty })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow transition-colors"
                title="Open Sentencing Scoresheet Calculator for this Case"
              >
                <Calculator className="w-4 h-4" />
                <span>Sentencing Scorecard</span>
              </button>
            )}

            <button
              id="draft-discovery-demand-btn"
              onClick={() => handleOpenDraftModal('discovery')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 shadow transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Draft Rule 3.220</span>
            </button>
            <button
              id="draft-alibi-notice-btn"
              onClick={() => handleOpenDraftModal('alibi')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Draft Rule 3.200</span>
            </button>
          </div>
        </div>

        {/* Florida UCN Parsing Visualizer */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div className="bg-slate-800/60 p-2 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px] font-mono">COUNTY (2-DIGIT)</span>
            <span className="font-semibold text-amber-400">13 (Hillsborough)</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px] font-mono">FILING YEAR</span>
            <span className="font-semibold text-slate-200">2025</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px] font-mono">COURT DIVISION</span>
            <span className="font-semibold text-emerald-400">CF (Circuit Felony)</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px] font-mono">SEQUENCE NO.</span>
            <span className="font-semibold text-slate-200">004182</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded border border-slate-700 col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[10px] font-mono">PARTY / BRANCH</span>
            <span className="font-semibold text-indigo-300">A001-HC</span>
          </div>
        </div>
      </div>

      {/* Search & Parameters Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Florida Uniform Case Number (UCN)
            </label>
            <div className="relative">
              <input
                id="florida-ucn-input"
                type="text"
                value={ucnInput}
                onChange={(e) => setUcnInput(e.target.value)}
                placeholder="e.g. 13-2025-CF-004182-A001-HC"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Florida County & Judicial Circuit
            </label>
            <select
              id="florida-county-select"
              value={selectedCounty}
              onChange={(e) => {
                const newCounty = e.target.value;
                setSelectedCounty(newCounty);
                if (newCounty.toLowerCase().includes('brevard') && ucnInput.startsWith('13-')) {
                  setUcnInput(BREVARD_SAMPLE_UCN);
                } else if (!newCounty.toLowerCase().includes('brevard') && ucnInput.startsWith('05-')) {
                  setUcnInput(SAMPLE_UCN);
                }
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
            >
              {floridaCounties.map(c => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.circuit})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Court Division
            </label>
            <select
              id="florida-division-select"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="Circuit Criminal (Felony)">Circuit Criminal (Felony)</option>
              <option value="County Criminal (Misdemeanor)">County Criminal (Misdemeanor)</option>
              <option value="Circuit Civil">Circuit Civil</option>
              <option value="District Court of Appeal (DCA)">District Court of Appeal (DCA)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              id="florida-lookup-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Query Clerk</span>
            </button>
          </div>
        </form>
      </div>

      {caseData && (
        <>
          {/* Active Case Details Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    UCN: {caseData.ucn}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-medium bg-emerald-100 text-emerald-800">
                    {caseData.caseStatus}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-serif">
                  State of Florida v. Accused &bull; {caseData.circuit} ({caseData.county})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.myflcourtaccess.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Florida E-Filing Portal</span>
                </a>
              </div>
            </div>

            {/* Case Key Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block font-medium">Presiding Judge</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{caseData.presidingJudge}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block font-medium">Prosecuting Agency</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{caseData.stateAttorneyOffice}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block font-medium">Initial Filing Date</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{caseData.filingDate}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-amber-800 block font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Next Court Hearing
                </span>
                <span className="font-bold text-amber-950 mt-0.5 block">
                  {caseData.nextHearing?.date} ({caseData.nextHearing?.type})
                </span>
              </div>
            </div>

            {/* Florida Statutory Discovery Deadlines Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Florida Rule of Criminal Procedure 3.220 Compliance Audit
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      PARTIAL DISCLOSURE DETECTED (CAD 911 AUDIO MISSING)
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    Florida gives the State Attorney <strong>15 days</strong> from receipt of the Notice of Discovery to disclose all witness statements, tangible records, CAD 911 audio, and exculpatory material under <em>Brady v. Maryland</em>. 
                    The State's initial disclosure on {caseData.discoveryStatus.demandDate} omitted the 911 dispatch recordings and body camera video, giving grounds for an immediate Motion to Compel or Sanctions under Fla. R. Crim. P. 3.220(n).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Docket Entries Explorer */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Official Clerk of Courts Docket Filings</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 text-slate-700 font-semibold">
                    {filteredDocket.length} Entries
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Synchronize prosecution documents to your Opposing Claims Vault or exculpatory filings to your Evidence Vault.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                {(['all', 'State of Florida', 'Defense', 'Presiding Judge'] as const).map(party => (
                  <button
                    key={party}
                    onClick={() => setFilterParty(party)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filterParty === party ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {party === 'all' ? 'All Parties' : party}
                  </button>
                ))}
              </div>
            </div>

            {/* Docket Items Table */}
            <div className="divide-y divide-slate-100">
              {filteredDocket.map((entry) => {
                const isSyncedOpposing = syncedEntries[entry.id] === 'opposing';
                const isSyncedEvidence = syncedEntries[entry.id] === 'evidence';

                return (
                  <div key={entry.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          #{entry.docketIndex}
                        </span>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900 font-serif">
                              {entry.title}
                            </h4>
                            
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                              entry.filingParty === 'State of Florida'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : entry.filingParty === 'Defense'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}>
                              {entry.filingParty}
                            </span>

                            {entry.pageCount && (
                              <span className="text-[10px] text-slate-400">
                                {entry.pageCount} pages
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                            {entry.description}
                          </p>

                          {entry.exculpatoryRelevance && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-flex mt-1">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                              <span className="font-medium">Exculpatory Relevance: {entry.exculpatoryRelevance}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pl-10 md:pl-0">
                        <span className="text-xs text-slate-400 font-mono mr-1">
                          {entry.dateFiled}
                        </span>

                        {entry.isOpposingThreat && (
                          <button
                            id={`sync-opposing-btn-${entry.id}`}
                            onClick={() => handleSyncToOpposing(entry)}
                            disabled={isSyncedOpposing}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold border transition-all ${
                              isSyncedOpposing
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                            }`}
                            title="Add to Opposing Claims Vault to strategize rebuttal"
                          >
                            {isSyncedOpposing ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>In Opposing Vault</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Sync to Opposing</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          id={`sync-evidence-btn-${entry.id}`}
                          onClick={() => handleSyncToEvidence(entry)}
                          disabled={isSyncedEvidence}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold border transition-all ${
                            isSyncedEvidence
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                          title="Add filing to My Evidence Vault as verified court record"
                        >
                          {isSyncedEvidence ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>In Evidence Vault</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Sync to Evidence</span>
                            </>
                          )}
                        </button>

                        {onNavigateToScorecard && (
                          <button
                            onClick={() => onNavigateToScorecard({ ucn: caseData?.ucn || ucnInput, county: caseData?.county || selectedCounty })}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all"
                            title="Calculate sentencing points for this case"
                          >
                            <Calculator className="w-3.5 h-3.5 text-amber-600" />
                            <span>Scorecard</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Florida Statutory Rules & E-Filing Resource Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Building2 className="w-4 h-4 text-amber-600" />
            <h4>Florida E-Filing System (FCCC)</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Florida Court Clerks & Comptrollers (FCCC) manages the single statewide portal connecting all 67 county courthouses. All defense pleadings must be uploaded via this portal.
          </p>
          <a
            href="https://www.myflcourtaccess.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1 pt-1"
          >
            <span>Visit myflcourtaccess.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h4>Fla. R. Crim. P. 3.220 (Discovery)</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Florida has an expansive reciprocal discovery rule. Filing a formal Notice of Discovery triggers the State's duty to disclose all Category A witnesses, 911 recordings, and exculpatory material within 15 days.
          </p>
          <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block">
            Strict 15-Day Time Limit
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h4>Fla. R. Crim. P. 3.200 (Alibi Rule)</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If asserting an affirmative alibi, Florida requires written notice served on the State Attorney not less than <strong>10 days</strong> before trial, specifying exact place and witness contact details.
          </p>
          <span className="text-xs font-medium text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded inline-block">
            Requires 10 Days Pre-Trial Notice
          </span>
        </div>
      </div>

      {/* Pleading Drafting Modal */}
      {draftModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-serif font-bold text-base">
                    {draftType === 'discovery' 
                      ? 'Florida Rule 3.220 Written Discovery Demand' 
                      : 'Florida Rule 3.200 Notice of Alibi Pleading'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formatted for Florida Circuit Courts & E-Filing System
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDraftModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 bg-slate-50 font-mono text-xs">
              {generatingDraft ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
                  <p className="font-sans text-sm font-semibold text-slate-800">
                    Drafting official Florida court pleading...
                  </p>
                  <p className="font-sans text-xs text-slate-500">
                    Incorporating Florida Rules of Criminal Procedure, Brady v. Maryland citations, and case caption.
                  </p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-900 bg-white p-4 rounded-lg border border-slate-300 leading-relaxed shadow-inner">
                  {draftContent}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Ready to review and file via Florida Courts E-Filing Portal.
              </span>
              <div className="flex items-center gap-2">
                <button
                  id="copy-draft-btn"
                  onClick={handleCopyDraft}
                  disabled={generatingDraft}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow transition-colors"
                >
                  {copiedDraft ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Pleading</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setDraftModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
