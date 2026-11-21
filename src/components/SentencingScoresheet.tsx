import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Scale, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Copy, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Building2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { 
  ScoresheetState, 
  OffenseSeverityLevel, 
  ScoresheetOffense,
  DownwardDepartureItem
} from '../types';
import { 
  calculateScoresheet, 
  PRIMARY_OFFENSE_POINTS, 
  ADDITIONAL_OFFENSE_POINTS, 
  PRIOR_RECORD_POINTS, 
  VICTIM_INJURY_POINTS,
  COMMON_FLORIDA_OFFENSES,
  generatePrintableScoresheetText,
  DEFAULT_SCORESHEET_STATE
} from '../utils/scoresheetCalc';

interface SentencingScoresheetProps {
  scoresheet: ScoresheetState;
  onUpdateScoresheet: (updated: ScoresheetState) => void;
  onOpenBrevardGuide: () => void;
  onConsultParalegalWithScoresheet?: (summaryText: string) => void;
}

export const SentencingScoresheet: React.FC<SentencingScoresheetProps> = ({
  scoresheet,
  onUpdateScoresheet,
  onOpenBrevardGuide,
  onConsultParalegalWithScoresheet,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'offenses' | 'injury_priors' | 'sanctions_enhancements' | 'departures'>('offenses');
  const [copiedText, setCopiedText] = useState(false);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [expandedDepartureId, setExpandedDepartureId] = useState<string | null>(null);

  // Compute live totals
  const totals = useMemo(() => calculateScoresheet(scoresheet), [scoresheet]);

  // Handle Primary Offense Updates
  const updatePrimary = (field: keyof ScoresheetOffense, value: any) => {
    onUpdateScoresheet({
      ...scoresheet,
      primaryOffense: {
        ...scoresheet.primaryOffense,
        [field]: value,
      },
    });
  };

  // Select a preset common Florida offense for primary
  const applyCommonOffenseToPrimary = (statute: string) => {
    const found = COMMON_FLORIDA_OFFENSES.find(o => o.statute === statute);
    if (!found) return;
    onUpdateScoresheet({
      ...scoresheet,
      primaryOffense: {
        ...scoresheet.primaryOffense,
        statute: found.statute,
        description: found.description,
        level: found.level,
        degree: found.degree,
      },
    });
  };

  // Additional Offenses
  const handleAddAdditionalOffense = () => {
    const newOffense: ScoresheetOffense = {
      id: `add-off-${Date.now()}`,
      statute: '§ 812.014',
      description: 'Grand Theft',
      level: 3,
      degree: '3rd_degree',
      counts: 1,
    };
    onUpdateScoresheet({
      ...scoresheet,
      additionalOffenses: [...scoresheet.additionalOffenses, newOffense],
    });
  };

  const handleUpdateAdditional = (id: string, field: keyof ScoresheetOffense, value: any) => {
    onUpdateScoresheet({
      ...scoresheet,
      additionalOffenses: scoresheet.additionalOffenses.map(o => 
        o.id === id ? { ...o, [field]: value } : o
      ),
    });
  };

  const handleRemoveAdditional = (id: string) => {
    onUpdateScoresheet({
      ...scoresheet,
      additionalOffenses: scoresheet.additionalOffenses.filter(o => o.id !== id),
    });
  };

  // Victim Injury
  const updateVictimInjury = (field: keyof typeof scoresheet.victimInjury, delta: number) => {
    const cur = scoresheet.victimInjury[field];
    const updated = Math.max(0, cur + delta);
    onUpdateScoresheet({
      ...scoresheet,
      victimInjury: {
        ...scoresheet.victimInjury,
        [field]: updated,
      },
    });
  };

  // Prior Record
  const updatePriorCount = (field: keyof typeof scoresheet.priorRecord, delta: number) => {
    const cur = scoresheet.priorRecord[field];
    const updated = Math.max(0, cur + delta);
    onUpdateScoresheet({
      ...scoresheet,
      priorRecord: {
        ...scoresheet.priorRecord,
        [field]: updated,
      },
    });
  };

  // Legal Status
  const toggleLegalStatus = () => {
    onUpdateScoresheet({
      ...scoresheet,
      legalStatus: {
        ...scoresheet.legalStatus,
        active: !scoresheet.legalStatus.active,
      },
    });
  };

  // Community Sanctions
  const updateCommunitySanction = (field: keyof typeof scoresheet.communitySanctions, delta: number) => {
    const cur = scoresheet.communitySanctions[field];
    const updated = Math.max(0, cur + delta);
    onUpdateScoresheet({
      ...scoresheet,
      communitySanctions: {
        ...scoresheet.communitySanctions,
        [field]: updated,
      },
    });
  };

  // Enhancements
  const toggleEnhancement = (field: keyof typeof scoresheet.enhancements) => {
    onUpdateScoresheet({
      ...scoresheet,
      enhancements: {
        ...scoresheet.enhancements,
        [field]: !scoresheet.enhancements[field],
      },
    });
  };

  // Departures
  const toggleDeparture = (id: string) => {
    onUpdateScoresheet({
      ...scoresheet,
      departures: scoresheet.departures.map(d => 
        d.id === id ? { ...d, checked: !d.checked } : d
      ),
    });
  };

  const updateDepartureNotes = (id: string, notes: string) => {
    onUpdateScoresheet({
      ...scoresheet,
      departures: scoresheet.departures.map(d => 
        d.id === id ? { ...d, notes } : d
      ),
    });
  };

  // Copy text representation
  const handleCopyScoresheet = () => {
    const text = generatePrintableScoresheetText(scoresheet, totals);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Print scoresheet
  const handlePrint = () => {
    window.print();
  };

  // Run AI Legal Analysis on Scoresheet
  const handleAnalyzeWithAI = async () => {
    setAnalyzingAI(true);
    setAiAnalysisResult(null);
    try {
      const res = await fetch('/api/scoresheet/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scoresheet,
          totals,
        }),
      });
      const data = await res.json();
      setAiAnalysisResult(data.analysis || 'Analysis complete.');
    } catch (e: any) {
      setAiAnalysisResult(`Paralegal server connection error: ${e.message}`);
    } finally {
      setAnalyzingAI(false);
    }
  };

  const handleApplyBrevardPreset = () => {
    onUpdateScoresheet({
      ...scoresheet,
      courtCaseNumber: "05-2025-CF-028419-AXXX-XX",
      county: "Brevard (Titusville/Viera) - 18th Judicial Circuit",
      judgeName: "Hon. Charles G. Crawford (18th Circuit)",
      attorneyName: scoresheet.attorneyName || "Defense Counsel of Record",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif">Florida Criminal Punishment Code Scoresheet</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  FLA. R. CRIM. P. 3.992(a)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official statutory sentencing scorecard calculator, prison threshold verifier, and downward departure planner.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenBrevardGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-amber-500/30 transition-colors shadow-sm"
            title="Brevard County Clerk API & Public Access Guide"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Brevard Clerk API Guide</span>
          </button>

          <button
            onClick={handleCopyScoresheet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors shadow-sm"
          >
            {copiedText ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedText ? 'Copied!' : 'Copy Scoresheet'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleAnalyzeWithAI}
            disabled={analyzingAI}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-xs font-semibold text-slate-950 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{analyzingAI ? 'Auditing Points...' : 'Paralegal Audit'}</span>
          </button>
        </div>
      </div>

      {/* Case Header & County Quick Select */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 font-semibold mb-1">Defendant Name</label>
          <input
            type="text"
            value={scoresheet.defendantName}
            onChange={(e) => onUpdateScoresheet({ ...scoresheet, defendantName: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none font-medium"
            placeholder="Defendant Full Name"
          />
        </div>

        <div>
          <label className="block text-slate-500 font-semibold mb-1">Florida UCN / Case Number</label>
          <input
            type="text"
            value={scoresheet.courtCaseNumber}
            onChange={(e) => onUpdateScoresheet({ ...scoresheet, courtCaseNumber: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none font-mono font-medium text-slate-800"
            placeholder="05-2025-CF-XXXXXX"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-slate-500 font-semibold">County & Circuit</label>
            <button
              type="button"
              onClick={handleApplyBrevardPreset}
              className="text-[10px] text-amber-600 hover:text-amber-700 font-bold underline"
              title="Set to Brevard County (18th Circuit)"
            >
              Set Brevard
            </button>
          </div>
          <input
            type="text"
            value={scoresheet.county}
            onChange={(e) => onUpdateScoresheet({ ...scoresheet, county: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none font-medium"
            placeholder="Brevard (Titusville/Viera) - 18th Circuit"
          />
        </div>

        <div>
          <label className="block text-slate-500 font-semibold mb-1">Presiding Judge</label>
          <input
            type="text"
            value={scoresheet.judgeName}
            onChange={(e) => onUpdateScoresheet({ ...scoresheet, judgeName: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none font-medium"
            placeholder="Hon. Charles G. Crawford"
          />
        </div>
      </div>

      {/* STATUTORY CALCULATION SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Points Card */}
        <div className={`rounded-xl border p-4.5 shadow-sm transition-all ${
          totals.isPrisonPermissible 
            ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total Sentence Points
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              totals.isPrisonPermissible ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
            }`}>
              {totals.isPrisonPermissible ? 'PRISON MANDATORY (> 44 pts)' : 'NON-PRISON ELIGIBLE (≤ 44 pts)'}
            </span>
          </div>
          
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight font-mono">
              {totals.totalPoints.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-500">points</span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            {totals.isPrisonPermissible 
              ? 'Exceeds 44.0 points. By Florida statute, the court must sentence to state prison absent a valid downward departure.' 
              : '44.0 points or fewer. The court has full legal authority to order county jail, probation, diversion, or community control.'}
          </p>
        </div>

        {/* Lowest Permissible Sentence Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Lowest Permissible Sentence (LPS)
              </span>
              <span className="text-[10px] font-mono text-slate-400">§ 921.0024(2)</span>
            </div>

            <div className="mt-2">
              <div className="text-2xl font-bold font-mono text-slate-900">
                {totals.isPrisonPermissible ? (
                  <span className="text-rose-600">{totals.lowestPermissibleSentenceMonths} Months</span>
                ) : (
                  <span className="text-emerald-600">0.0 Months Prison</span>
                )}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">
                {totals.isPrisonPermissible ? (
                  <span>Equivalent to ~{(totals.lowestPermissibleSentenceMonths / 12).toFixed(2)} Years Prison Minimum</span>
                ) : (
                  <span>Eligible for Probation / County Jail up to 364 Days</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
            {totals.isPrisonPermissible ? (
              <span>Formula: <code>(Total Points - 28) × 0.75</code></span>
            ) : (
              <span>No mandatory minimum state prison term required by scoresheet.</span>
            )}
          </div>
        </div>

        {/* Maximum Statutory Exposure Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Maximum Statutory Exposure
              </span>
              <span className="text-[10px] font-mono text-slate-400">§ 775.082</span>
            </div>

            <div className="mt-2">
              <div className="text-2xl font-bold font-mono text-amber-700">
                {totals.statutoryMaxYears >= 999 ? 'Life / Capital' : `${totals.statutoryMaxYears} Years`}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">
                {totals.statutoryMaxYears >= 999 ? 'Life Incarceration Max' : `${totals.statutoryMaxMonths} Months Maximum Consecutive`}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Primary: Level {scoresheet.primaryOffense.level} ({scoresheet.primaryOffense.degree.replace('_', ' ')})</span>
            <span className="font-semibold text-slate-700">Subtotal: {totals.subtotalPoints.toFixed(1)} pts</span>
          </div>
        </div>
      </div>

      {/* AI Paralegal Analysis Results Box */}
      {aiAnalysisResult && (
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-4 shadow-sm text-slate-900">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">AI Paralegal Scoresheet Audit & Vulnerability Analysis</h3>
            </div>
            <button
              onClick={() => setAiAnalysisResult(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Dismiss
            </button>
          </div>
          <div className="mt-3 text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-sans text-slate-800">
            {aiAnalysisResult}
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs for Scoresheet Sections */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs sm:text-sm font-medium overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('offenses')}
          className={`pb-2.5 px-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'offenses'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          1 & 2. Primary & Additional Offenses ({totals.primaryPoints + totals.additionalPoints} pts)
        </button>

        <button
          onClick={() => setActiveSubTab('injury_priors')}
          className={`pb-2.5 px-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'injury_priors'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          3 & 4. Victim Injury & Prior Record ({totals.victimInjuryPoints + totals.priorRecordPoints} pts)
        </button>

        <button
          onClick={() => setActiveSubTab('sanctions_enhancements')}
          className={`pb-2.5 px-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'sanctions_enhancements'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          5 & 6. Legal Status, Violations & Enhancements ({totals.legalStatusPoints + totals.communitySanctionPoints + totals.enhancementPoints} pts)
        </button>

        <button
          onClick={() => setActiveSubTab('departures')}
          className={`pb-2.5 px-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
            activeSubTab === 'departures'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          7. Statutory Downward Departures ({scoresheet.departures.filter(d => d.checked).length} Asserted)
        </button>
      </div>

      {/* SUBTAB 1: PRIMARY & ADDITIONAL OFFENSES */}
      {activeSubTab === 'offenses' && (
        <div className="space-y-6">
          {/* Section I: Primary Offense */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">I</span>
                  Primary Offense at Sentencing
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The most severe offense charged at conviction. Establishes the core statutory level.
                </p>
              </div>

              <div className="flex items-center gap-2 text-right">
                <span className="text-xs font-semibold text-slate-500">Primary Points:</span>
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-mono font-bold text-sm">
                  {totals.primaryPoints.toFixed(1)} PTS
                </span>
              </div>
            </div>

            {/* Quick Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Quick Select Common Florida Charge:
              </label>
              <select
                onChange={(e) => applyCommonOffenseToPrimary(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>-- Select Florida Statute Preset (Auto-fills Level & Degree) --</option>
                {COMMON_FLORIDA_OFFENSES.map(o => (
                  <option key={o.statute} value={o.statute}>
                    [{o.category}] {o.statute} - {o.description} (Level {o.level}, {o.degree.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Florida Statute</label>
                <input
                  type="text"
                  value={scoresheet.primaryOffense.statute}
                  onChange={(e) => updatePrimary('statute', e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono"
                  placeholder="e.g. § 810.02(3)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Offense Description</label>
                <input
                  type="text"
                  value={scoresheet.primaryOffense.description}
                  onChange={(e) => updatePrimary('description', e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md"
                  placeholder="Burglary of Unoccupied Dwelling"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Felony Degree</label>
                <select
                  value={scoresheet.primaryOffense.degree}
                  onChange={(e) => updatePrimary('degree', e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md"
                >
                  <option value="3rd_degree">3rd Degree Felony (Max 5 Yrs)</option>
                  <option value="2nd_degree">2nd Degree Felony (Max 15 Yrs)</option>
                  <option value="1st_degree">1st Degree Felony (Max 30 Yrs)</option>
                  <option value="1st_degree_life">1st Degree Punishable by Life</option>
                  <option value="life">Life Felony</option>
                  <option value="capital">Capital Offense</option>
                </select>
              </div>
            </div>

            {/* Level Selector Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Severity Level (Florida CPC Level 1 to 10):
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as OffenseSeverityLevel[]).map(lvl => {
                  const pts = PRIMARY_OFFENSE_POINTS[lvl];
                  const isSelected = scoresheet.primaryOffense.level === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => updatePrimary('level', lvl)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'bg-amber-600 border-amber-700 text-white font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px] font-medium">Lvl {lvl}</div>
                      <div className="text-xs font-mono font-bold mt-0.5">{pts} pts</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section II: Additional Offenses */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">II</span>
                  Additional Offenses at Sentencing
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Any other offenses before the court for sentencing alongside the primary offense.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Additional Points:</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono font-bold text-sm">
                  {totals.additionalPoints.toFixed(1)} PTS
                </span>
                <button
                  type="button"
                  onClick={handleAddAdditionalOffense}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-xs border border-amber-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Count</span>
                </button>
              </div>
            </div>

            {scoresheet.additionalOffenses.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-lg">
                No additional offenses logged. Click "Add Count" above to include secondary charges.
              </div>
            ) : (
              <div className="space-y-3">
                {scoresheet.additionalOffenses.map((off, idx) => (
                  <div key={off.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
                    <div className="md:col-span-1 font-bold text-slate-500 font-mono">
                      #{idx + 1}
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Statute</label>
                      <input
                        type="text"
                        value={off.statute}
                        onChange={(e) => handleUpdateAdditional(off.id, 'statute', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono"
                        placeholder="§ 812.014"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Description</label>
                      <input
                        type="text"
                        value={off.description}
                        onChange={(e) => handleUpdateAdditional(off.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                        placeholder="Charge description"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Level</label>
                      <select
                        value={off.level}
                        onChange={(e) => handleUpdateAdditional(off.id, 'level', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-bold"
                      >
                        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as OffenseSeverityLevel[]).map(l => (
                          <option key={l} value={l}>
                            Lvl {l} ({ADDITIONAL_OFFENSE_POINTS[l]} pts)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Counts</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={off.counts}
                        onChange={(e) => handleUpdateAdditional(off.id, 'counts', Math.max(1, Number(e.target.value)))}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-center font-bold"
                      />
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditional(off.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-200 transition-colors"
                        title="Remove Offense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: VICTIM INJURY & PRIOR RECORD */}
      {activeSubTab === 'injury_priors' && (
        <div className="space-y-6">
          {/* Section III: Victim Injury */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">III</span>
                  Victim Injury Points
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assessed per victim. Under Florida law (*Wendt v. State*), the State has the burden of proof to demonstrate medical injury severity.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Victim Injury Points:</span>
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-mono font-bold text-sm">
                  {totals.victimInjuryPoints.toFixed(1)} PTS
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* 2nd Deg Murder */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">2nd Deg Murder</div>
                  <div className="text-[11px] text-slate-500 font-mono">240.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateVictimInjury('secondDegreeMurder', -1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.victimInjury.secondDegreeMurder}</span>
                  <button
                    onClick={() => updateVictimInjury('secondDegreeMurder', 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >+</button>
                </div>
              </div>

              {/* Death */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Death</div>
                  <div className="text-[11px] text-slate-500 font-mono">120.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateVictimInjury('death', -1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.victimInjury.death}</span>
                  <button
                    onClick={() => updateVictimInjury('death', 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >+</button>
                </div>
              </div>

              {/* Severe */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Severe Injury</div>
                  <div className="text-[11px] text-slate-500 font-mono">40.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateVictimInjury('severe', -1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.victimInjury.severe}</span>
                  <button
                    onClick={() => updateVictimInjury('severe', 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >+</button>
                </div>
              </div>

              {/* Moderate */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Moderate Injury</div>
                  <div className="text-[11px] text-slate-500 font-mono">18.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateVictimInjury('moderate', -1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.victimInjury.moderate}</span>
                  <button
                    onClick={() => updateVictimInjury('moderate', 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >+</button>
                </div>
              </div>

              {/* Slight */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Slight Injury</div>
                  <div className="text-[11px] text-slate-500 font-mono">4.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateVictimInjury('slight', -1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.victimInjury.slight}</span>
                  <button
                    onClick={() => updateVictimInjury('slight', 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >+</button>
                </div>
              </div>

              {/* Sex Penetration */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Sex Penetration</div>
                  <div className="text-[11px] text-slate-500 font-mono">80.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateVictimInjury('sexPenetration', -1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.victimInjury.sexPenetration}</span>
                  <button
                    onClick={() => updateVictimInjury('sexPenetration', 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >+</button>
                </div>
              </div>

              {/* Sex Contact */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Sex Contact</div>
                  <div className="text-[11px] text-slate-500 font-mono">40.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateVictimInjury('sexContact', -1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.victimInjury.sexContact}</span>
                  <button
                    onClick={() => updateVictimInjury('sexContact', 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Section IV: Prior Record */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">IV</span>
                  Prior Criminal Record Points
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prior convictions within the statutory 10-year decay period (§ 921.0021(5), Fla. Stat.).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Prior Points:</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono font-bold text-sm">
                  {totals.priorRecordPoints.toFixed(1)} PTS
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as OffenseSeverityLevel[]).map(l => {
                const key = `level${l}` as keyof typeof scoresheet.priorRecord;
                const count = scoresheet.priorRecord[key];
                const ptsEach = PRIOR_RECORD_POINTS[l];
                return (
                  <div key={l} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Lvl {l} Priors</span>
                      <span className="text-[10px] font-mono text-slate-400">{ptsEach} ea</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => updatePriorCount(key, -1)}
                        className="w-6 h-6 rounded bg-white border border-slate-300 font-bold"
                      >-</button>
                      <span className="font-mono font-bold text-sm">{count}</span>
                      <button
                        onClick={() => updatePriorCount(key, 1)}
                        className="w-6 h-6 rounded bg-white border border-slate-300 font-bold"
                      >+</button>
                    </div>
                  </div>
                );
              })}

              {/* Prior Misdemeanors */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Misdemeanors</span>
                  <span className="text-[10px] font-mono text-slate-400">0.2 ea</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => updatePriorCount('misdemeanors', -1)}
                    className="w-6 h-6 rounded bg-white border border-slate-300 font-bold"
                  >-</button>
                  <span className="font-mono font-bold text-sm">{scoresheet.priorRecord.misdemeanors}</span>
                  <button
                    onClick={() => updatePriorCount('misdemeanors', 1)}
                    className="w-6 h-6 rounded bg-white border border-slate-300 font-bold"
                  >+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LEGAL STATUS, SANCTIONS & ENHANCEMENTS */}
      {activeSubTab === 'sanctions_enhancements' && (
        <div className="space-y-6">
          {/* Section V: Legal Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">V</span>
                  Legal Status Violation Points
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assessed at 4.0 points if the offense occurred while under escape, fleeing, pretrial release, probation, or parole.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono font-bold text-sm">
                {totals.legalStatusPoints.toFixed(1)} PTS
              </span>
            </div>

            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={scoresheet.legalStatus.active}
                onChange={toggleLegalStatus}
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800">Defendant was in legal status at time of offense (+4.0 Points)</span>
                <p className="text-slate-500">Includes pretrial release on bond, state probation, community control, parole, or active warrant/escape.</p>
              </div>
            </label>
          </div>

          {/* Section VI: Community Sanctions */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">VI</span>
                  Community Sanction Violations (Probation / Community Control)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Points assessed for prior or current violations of probation or community control.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono font-bold text-sm">
                {totals.communitySanctionPoints.toFixed(1)} PTS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Technical Violations</div>
                  <div className="text-[11px] text-slate-500 font-mono">6.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCommunitySanction('technicalCount', -1)} className="w-6 h-6 bg-white border rounded font-bold">-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.communitySanctions.technicalCount}</span>
                  <button onClick={() => updateCommunitySanction('technicalCount', 1)} className="w-6 h-6 bg-white border rounded font-bold">+</button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Violation w/ New Misd.</div>
                  <div className="text-[11px] text-slate-500 font-mono">12.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCommunitySanction('newMisdemeanorCount', -1)} className="w-6 h-6 bg-white border rounded font-bold">-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.communitySanctions.newMisdemeanorCount}</span>
                  <button onClick={() => updateCommunitySanction('newMisdemeanorCount', 1)} className="w-6 h-6 bg-white border rounded font-bold">+</button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Violation w/ New Felony</div>
                  <div className="text-[11px] text-slate-500 font-mono">24.0 pts each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCommunitySanction('newFelonyCount', -1)} className="w-6 h-6 bg-white border rounded font-bold">-</button>
                  <span className="font-mono font-bold w-4 text-center">{scoresheet.communitySanctions.newFelonyCount}</span>
                  <button onClick={() => updateCommunitySanction('newFelonyCount', 1)} className="w-6 h-6 bg-white border rounded font-bold">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Section VII: Enhancements */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">VII</span>
                  Statutory Sentencing Enhancements & Multipliers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Firearm possession, prior serious violent felony, and statutory offense multipliers.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-mono font-bold text-sm">
                {totals.enhancementPoints.toFixed(1)} PTS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={scoresheet.enhancements.firearm}
                  onChange={() => toggleEnhancement('firearm')}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-800">Firearm Enhancement (+18.0 Points)</span>
                  <p className="text-slate-500">Fla. Stat. § 775.087(2) firearm possession enhancement.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={scoresheet.enhancements.semiautomaticOrMachineGun}
                  onChange={() => toggleEnhancement('semiautomaticOrMachineGun')}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-800">Semiautomatic / Machine Gun (+25.0 Points)</span>
                  <p className="text-slate-500">Enhanced firearm capacity factor.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={scoresheet.enhancements.priorSeriousFelony}
                  onChange={() => toggleEnhancement('priorSeriousFelony')}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-800">Prior Serious Felony (+30.0 Points)</span>
                  <p className="text-slate-500">Fla. Stat. § 921.0024(1)(b) qualification.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={scoresheet.enhancements.drugTraffickingMultiplier}
                  onChange={() => toggleEnhancement('drugTraffickingMultiplier')}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-800">Drug Trafficking Multiplier (1.5x)</span>
                  <p className="text-slate-500">Subtotal point multiplier for qualifying trafficking.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: STATUTORY DOWNWARD DEPARTURES */}
      {activeSubTab === 'departures' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                Florida Statutory Downward Departure Grounds (Fla. Stat. § 921.0026)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                If the scoresheet exceeds 44 points, a Florida trial judge cannot sentence below the Lowest Permissible Sentence unless one of these statutory departure grounds is legally established with competent substantial evidence.
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold">
              {scoresheet.departures.filter(d => d.checked).length} Grounds Asserted
            </div>
          </div>

          <div className="space-y-3">
            {scoresheet.departures.map(d => {
              const isExpanded = expandedDepartureId === d.id;
              return (
                <div
                  key={d.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    d.checked 
                      ? 'bg-amber-50/60 border-amber-300 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={d.checked}
                        onChange={() => toggleDeparture(d.id)}
                        className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                            {d.statute}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{d.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{d.description}</p>
                      </div>
                    </label>

                    <button
                      type="button"
                      onClick={() => setExpandedDepartureId(isExpanded ? null : d.id)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Notes / Factual Evidence Box */}
                  {(isExpanded || d.checked) && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Defense Factual Basis & Supporting Evidence Logged:
                      </label>
                      <textarea
                        rows={2}
                        value={d.notes}
                        onChange={(e) => updateDepartureNotes(d.id, e.target.value)}
                        placeholder="Detail the witness testimony, medical/addiction evaluations, lack of sophistication, or victim initiation evidence supporting this departure ground..."
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Official Rule 3.992 Scoresheet Preview & Quick Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold">Rule 3.992(a) Official Scoresheet Output Summary</h4>
          </div>
          <button
            onClick={handleCopyScoresheet}
            className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedText ? 'Copied to Clipboard' : 'Copy Full Official Text'}</span>
          </button>
        </div>

        <pre className="text-[11px] font-mono leading-relaxed bg-slate-950 p-4 rounded-lg overflow-x-auto text-slate-300 border border-slate-800 max-h-56 scrollbar-thin">
          {generatePrintableScoresheetText(scoresheet, totals)}
        </pre>
      </div>
    </div>
  );
};
