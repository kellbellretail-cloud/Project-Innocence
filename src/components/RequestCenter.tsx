import React, { useState } from 'react';
import { 
  Video, 
  FileText, 
  PhoneCall, 
  ShieldAlert, 
  Building2, 
  Smartphone, 
  Stethoscope, 
  AlertTriangle, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Printer, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Send, 
  Calendar, 
  X, 
  Sparkles, 
  ArrowRight, 
  FolderPlus,
  Filter
} from 'lucide-react';
import { EvidenceRequest, EvidenceRequestType, AgencyType, RequestStatus, EvidenceItem } from '../types';

interface RequestCenterProps {
  requests: EvidenceRequest[];
  onAddRequest: (request: EvidenceRequest) => void;
  onUpdateRequest: (request: EvidenceRequest) => void;
  onDeleteRequest: (id: string) => void;
  onSendToEvidenceVault: (item: Partial<EvidenceItem>) => void;
}

export const RequestCenter: React.FC<RequestCenterProps> = ({
  requests,
  onAddRequest,
  onUpdateRequest,
  onDeleteRequest,
  onSendToEvidenceVault,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | EvidenceRequestType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | RequestStatus>('all');
  
  // Modal State for New / Edit Request
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formAgencyName, setFormAgencyName] = useState('');
  const [formAgencyType, setFormAgencyType] = useState<AgencyType>('police_dept');
  const [formRequestType, setFormRequestType] = useState<EvidenceRequestType>('body_cam');
  const [formPriority, setFormPriority] = useState<'emergency_preservation' | 'high' | 'standard'>('emergency_preservation');
  const [formOfficersInvolved, setFormOfficersInvolved] = useState('');
  const [formBadgeNumbers, setFormBadgeNumbers] = useState('');
  const [formIncidentNumber, setFormIncidentNumber] = useState('');
  const [formIncidentDate, setFormIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTimeWindow, setFormTimeWindow] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formStatuteBasis, setFormStatuteBasis] = useState('Fla. Stat. § 119.071 & Fla. Stat. § 943.1718 / Fla. R. Crim. P. 3.220');
  const [formTrackingNumber, setFormTrackingNumber] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formLetter, setFormLetter] = useState('');
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  // Letter View Modal
  const [viewLetterRequest, setViewLetterRequest] = useState<EvidenceRequest | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Success Notification for sent to vault
  const [sentVaultNotice, setSentVaultNotice] = useState<string | null>(null);

  // Quick Preset Handlers
  const handleOpenNewWithPreset = (type: EvidenceRequestType) => {
    setEditingRequestId(null);
    setFormRequestType(type);

    if (type === 'body_cam') {
      setFormTitle('Arresting & Assisting Officer Body-Worn Camera (BWC) Demand');
      setFormAgencyName('City Police Department / Records & Video Unit');
      setFormAgencyType('police_dept');
      setFormPriority('emergency_preservation');
      setFormStatuteBasis('Fla. Stat. § 119.071(2)(l) & Fla. Stat. § 943.1718 / Fla. R. Crim. P. 3.220');
      setFormTimeWindow('30 mins prior to initial stop through booking intake');
    } else if (type === 'cad_911') {
      setFormTitle('911 Caller Audio Recordings & CAD Incident Keystroke Log');
      setFormAgencyName('County Emergency Communications & 911 Dispatch Bureau');
      setFormAgencyType('sheriff');
      setFormPriority('high');
      setFormStatuteBasis('Fla. Stat. § 119.01 & Fla. Const. Art. I, § 24 (Florida Sunshine Law)');
      setFormTimeWindow('Initial call placement through last unit cleared');
    } else if (type === 'surveillance_cctv') {
      setFormTitle('Commercial / Merchant CCTV Video Emergency Preservation Notice');
      setFormAgencyName('Plaza Management & Retail Loss Prevention Bureau');
      setFormAgencyType('merchant_cctv');
      setFormPriority('emergency_preservation');
      setFormStatuteBasis('Common Law Duty to Preserve / Subpoena Duces Tecum In Anticipation of Trial');
      setFormTimeWindow('1 hour window spanning alleged incident time');
    } else if (type === 'officer_personnel_giglio') {
      setFormTitle('Officer Internal Affairs & Brady/Giglio Disciplinary History Demand');
      setFormAgencyName('City Police Department - Internal Affairs & Professional Standards');
      setFormAgencyType('police_dept');
      setFormPriority('high');
      setFormStatuteBasis('Brady v. Maryland, 373 U.S. 83 & Giglio v. United States, 405 U.S. 150');
      setFormTimeWindow('Complete career disciplinary record & sustained complaints');
    } else if (type === 'telecom_records') {
      setFormTitle('Cellular Provider Tower & Call Detail Records (CDR) Preservation Subpoena');
      setFormAgencyName('Cellular Carrier Law Enforcement Compliance Bureau');
      setFormAgencyType('telecom');
      setFormPriority('high');
      setFormStatuteBasis('18 U.S.C. § 2703(f) & Rule 17 Subpoena Duces Tecum');
      setFormTimeWindow('Target date 00:00 to 23:59 EST');
    } else if (type === 'medical_ems') {
      setFormTitle('Paramedic / EMS Run Sheet & Emergency Room Triage Records');
      setFormAgencyName('County Fire Rescue / Emergency Medical Services Records');
      setFormAgencyType('ems_hospital');
      setFormPriority('standard');
      setFormStatuteBasis('HIPAA Qualified Protective Order / State Evidence Code');
      setFormTimeWindow('Dispatch time through hospital admission');
    }

    setFormOfficersInvolved('');
    setFormBadgeNumbers('');
    setFormIncidentNumber('');
    setFormIncidentDate(new Date().toISOString().split('T')[0]);
    setFormLocation('');
    setFormTrackingNumber('');
    setFormNotes('');
    setFormLetter('');
    setIsModalOpen(true);
  };

  const handleEditRequest = (req: EvidenceRequest) => {
    setEditingRequestId(req.id);
    setFormTitle(req.title);
    setFormAgencyName(req.agencyName);
    setFormAgencyType(req.agencyType);
    setFormRequestType(req.requestType);
    setFormPriority(req.priority);
    setFormOfficersInvolved(req.officersInvolved || '');
    setFormBadgeNumbers(req.badgeNumbers || '');
    setFormIncidentNumber(req.incidentNumber || '');
    setFormIncidentDate(req.incidentDate);
    setFormTimeWindow(req.timeWindow || '');
    setFormLocation(req.location || '');
    setFormStatuteBasis(req.statuteBasis);
    setFormTrackingNumber(req.trackingNumber || '');
    setFormNotes(req.notes || '');
    setFormLetter(req.formalDemandLetter);
    setIsModalOpen(true);
  };

  const handleGenerateAILetter = async () => {
    setIsGeneratingLetter(true);
    try {
      const res = await fetch('/api/records-request/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: formRequestType,
          agencyName: formAgencyName,
          agencyType: formAgencyType,
          incidentDate: formIncidentDate,
          timeWindow: formTimeWindow,
          officersInvolved: formOfficersInvolved,
          badgeNumbers: formBadgeNumbers,
          incidentNumber: formIncidentNumber,
          location: formLocation,
          priority: formPriority,
          statuteBasis: formStatuteBasis,
          specificNeeds: formNotes,
        }),
      });

      const data = await res.json();
      if (data.letter) {
        setFormLetter(data.letter);
      }
    } catch (err) {
      console.error('Error generating letter:', err);
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLetter = formLetter.trim() || `DEMAND FOR RECORDS: ${formTitle}\nAgency: ${formAgencyName}\nIncident: ${formIncidentNumber || formIncidentDate}`;
    
    // Auto-calculate retention risk
    let retentionRisk = undefined;
    if (formRequestType === 'body_cam') {
      retentionRisk = "CRITICAL: Police body camera files risk automated overwrite after 90 days if not formally flagged with a litigation hold.";
    } else if (formRequestType === 'surveillance_cctv') {
      retentionRisk = "EMERGENCY: Commercial CCTV DVRs typically overwrite rolling recordings within 7 to 14 days!";
    } else if (formRequestType === 'cad_911') {
      retentionRisk = "HIGH: 911 dispatch audio tapes are frequently purged after 30 to 60 days.";
    }

    if (editingRequestId) {
      const existing = requests.find(r => r.id === editingRequestId);
      if (existing) {
        onUpdateRequest({
          ...existing,
          title: formTitle,
          agencyName: formAgencyName,
          agencyType: formAgencyType,
          requestType: formRequestType,
          priority: formPriority,
          officersInvolved: formOfficersInvolved,
          badgeNumbers: formBadgeNumbers,
          incidentNumber: formIncidentNumber,
          incidentDate: formIncidentDate,
          timeWindow: formTimeWindow,
          location: formLocation,
          statuteBasis: formStatuteBasis,
          trackingNumber: formTrackingNumber,
          notes: formNotes,
          formalDemandLetter: finalLetter,
          retentionRiskWarning: retentionRisk,
        });
      }
    } else {
      const newReq: EvidenceRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: formTitle,
        agencyName: formAgencyName,
        agencyType: formAgencyType,
        requestType: formRequestType,
        priority: formPriority,
        officersInvolved: formOfficersInvolved,
        badgeNumbers: formBadgeNumbers,
        incidentNumber: formIncidentNumber,
        incidentDate: formIncidentDate,
        timeWindow: formTimeWindow,
        location: formLocation,
        statuteBasis: formStatuteBasis,
        status: 'pending',
        trackingNumber: formTrackingNumber,
        dateSent: new Date().toISOString().split('T')[0],
        deadlineDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: formNotes,
        formalDemandLetter: finalLetter,
        retentionRiskWarning: retentionRisk,
        createdAt: new Date().toISOString(),
      };
      onAddRequest(newReq);
    }

    setIsModalOpen(false);
  };

  const handlePushToEvidenceVault = (req: EvidenceRequest) => {
    onSendToEvidenceVault({
      title: `Obtained Record: ${req.title}`,
      category: req.requestType === 'body_cam' || req.requestType === 'dashcam' || req.requestType === 'surveillance_cctv' ? 'digital' : 'document',
      description: `Official records received from ${req.agencyName} in response to demand (Tracking #${req.trackingNumber || req.incidentNumber || 'N/A'}). Covers incident on ${req.incidentDate} (${req.timeWindow || 'Full event'}).`,
      source: req.agencyName,
      exculpatoryRating: 'critical',
      chainOfCustody: {
        custodian: `${req.agencyName} (Custodian of Records)`,
        dateSecured: new Date().toISOString().split('T')[0],
        storageLocation: 'Project Innocence Secured Digital Vault',
        status: 'secured',
      },
      tags: ['public_records_request', req.requestType, 'law_enforcement_records'],
      verified: true,
    });

    onUpdateRequest({
      ...req,
      status: 'fulfilled',
    });

    setSentVaultNotice(`Record "${req.title}" has been successfully imported into your Evidence Vault!`);
    setTimeout(() => setSentVaultNotice(null), 4000);
  };

  const handleCopyLetter = (letter: string) => {
    navigator.clipboard.writeText(letter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  // Filtered requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.officersInvolved && req.officersInvolved.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.incidentNumber && req.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || req.requestType === selectedType;
    const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getRequestIcon = (type: EvidenceRequestType) => {
    switch (type) {
      case 'body_cam':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'dashcam':
        return <Video className="w-4 h-4 text-amber-500" />;
      case 'cad_911':
        return <PhoneCall className="w-4 h-4 text-blue-500" />;
      case 'officer_personnel_giglio':
        return <ShieldAlert className="w-4 h-4 text-purple-500" />;
      case 'surveillance_cctv':
        return <Building2 className="w-4 h-4 text-emerald-500" />;
      case 'telecom_records':
        return <Smartphone className="w-4 h-4 text-indigo-500" />;
      case 'medical_ems':
        return <Stethoscope className="w-4 h-4 text-teal-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold font-serif tracking-tight">Evidence & Records Request Center</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  BODY CAM & RECORDS DESK
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ANTI-SPOLIATION PROTOCOLS
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                Issue authoritative preservation notices and public records demands for police body-worn camera (BWC), 
                cruiser dashcam, 911 dispatch tapes, merchant CCTV, and officer disciplinary histories before automated purge loops erase exculpatory proof.
              </p>
            </div>
          </div>

          <button
            id="new-record-request-btn"
            onClick={() => handleOpenNewWithPreset('body_cam')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Records Demand</span>
          </button>
        </div>

        {/* Retention Purge Warnings Banner */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/80 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">Body-Worn Camera (BWC)</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                Most departments auto-purge unflagged footage after <strong>90 days</strong> (or 30 days for routine encounters).
              </span>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/80 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">Commercial / Private CCTV</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                Retail & gas station DVRs typically overwrite footage in <strong>7 to 14 days</strong>. Immediate preservation notice required!
              </span>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/80 flex items-start gap-2.5">
            <PhoneCall className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">911 CAD & Audio Tapes</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                Dispatch audio servers frequently compress and rotate recordings within <strong>30 to 60 days</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {sentVaultNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{sentVaultNotice}</span>
        </div>
      )}

      {/* Quick 1-Click Drafting Presets */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Quick Request Templates & Emergency Holds
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => handleOpenNewWithPreset('body_cam')}
            className="flex flex-col items-start p-3 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 mb-2 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Body Camera</span>
            <span className="text-[11px] text-slate-500 block">BWC & Audio Hold</span>
          </button>

          <button
            onClick={() => handleOpenNewWithPreset('cad_911')}
            className="flex flex-col items-start p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mb-2 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">911 CAD Tapes</span>
            <span className="text-[11px] text-slate-500 block">Audio & Dispatch Logs</span>
          </button>

          <button
            onClick={() => handleOpenNewWithPreset('surveillance_cctv')}
            className="flex flex-col items-start p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 mb-2 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Merchant CCTV</span>
            <span className="text-[11px] text-slate-500 block">Store DVR Spoliation</span>
          </button>

          <button
            onClick={() => handleOpenNewWithPreset('officer_personnel_giglio')}
            className="flex flex-col items-start p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700 mb-2 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Officer Files</span>
            <span className="text-[11px] text-slate-500 block">Brady / Giglio Disciplinary</span>
          </button>

          <button
            onClick={() => handleOpenNewWithPreset('telecom_records')}
            className="flex flex-col items-start p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 mb-2 group-hover:scale-105 transition-transform">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Telecom CDR</span>
            <span className="text-[11px] text-slate-500 block">Cell Tower Geolocation</span>
          </button>

          <button
            onClick={() => handleOpenNewWithPreset('medical_ems')}
            className="flex flex-col items-start p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all group shadow-2xs"
          >
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700 mb-2 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">EMS / Medical</span>
            <span className="text-[11px] text-slate-500 block">First Responder Reports</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by agency, officer name, report #..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="all">All Request Types ({requests.length})</option>
            <option value="body_cam">Body-Worn Camera</option>
            <option value="cad_911">911 CAD & Audio</option>
            <option value="surveillance_cctv">Merchant CCTV</option>
            <option value="officer_personnel_giglio">Officer Disciplinary</option>
            <option value="telecom_records">Telecom / Cell Tower</option>
            <option value="medical_ems">Medical / EMS</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Response</option>
            <option value="fulfilled">Fulfilled (Secured)</option>
            <option value="overdue">Overdue / Follow-Up Needed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Active Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <Video className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-semibold text-slate-800">No Evidence Requests Found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Start by generating a formal Body Camera Demand, 911 CAD tape request, or merchant surveillance preservation hold.
            </p>
            <button
              onClick={() => handleOpenNewWithPreset('body_cam')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Draft Body Camera Demand
            </button>
          </div>
        ) : (
          filteredRequests.map(req => {
            const isEmergency = req.priority === 'emergency_preservation';
            const isFulfilled = req.status === 'fulfilled';
            const isOverdue = req.status === 'overdue';

            return (
              <div
                key={req.id}
                className={`bg-white rounded-xl border p-5 shadow-2xs transition-all space-y-4 ${
                  isEmergency ? 'border-rose-200 hover:border-rose-300' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-100 shrink-0">
                      {getRequestIcon(req.requestType)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900 font-serif">
                          {req.title}
                        </h4>

                        {/* Priority Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isEmergency
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : req.priority === 'high'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {req.priority.replace('_', ' ')}
                        </span>

                        {/* Status Badge */}
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isFulfilled
                            ? 'bg-emerald-100 text-emerald-800'
                            : isOverdue
                            ? 'bg-rose-100 text-rose-800 font-bold'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status === 'fulfilled' ? 'Fulfilled / Received' :
                           req.status === 'overdue' ? 'Overdue (Follow Up)' :
                           req.status === 'pending' ? 'Served / Pending' : req.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                        <span className="font-semibold text-slate-900">{req.agencyName}</span>
                        {req.incidentNumber && (
                          <span>&bull; Ref: <strong className="font-mono">{req.incidentNumber}</strong></span>
                        )}
                        {req.incidentDate && (
                          <span>&bull; Incident Date: <strong>{req.incidentDate}</strong></span>
                        )}
                        {req.timeWindow && (
                          <span>&bull; Time: <strong>{req.timeWindow}</strong></span>
                        )}
                      </div>

                      {req.officersInvolved && (
                        <div className="text-xs text-slate-600">
                          Target Officers: <strong className="text-slate-800">{req.officersInvolved}</strong>
                        </div>
                      )}

                      {req.retentionRiskWarning && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-100 inline-flex mt-1 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{req.retentionRiskWarning}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto flex-wrap sm:flex-nowrap">
                    {/* Status Toggle Dropdown */}
                    <select
                      value={req.status}
                      onChange={(e) => onUpdateRequest({ ...req, status: e.target.value as RequestStatus })}
                      className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 font-medium"
                    >
                      <option value="pending">Pending Response</option>
                      <option value="overdue">Mark Overdue</option>
                      <option value="fulfilled">Mark Fulfilled</option>
                      <option value="draft">Draft</option>
                    </select>

                    <button
                      onClick={() => setViewLetterRequest(req)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                      title="View & Print Official Demand Letter"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Demand Letter</span>
                    </button>

                    <button
                      onClick={() => handlePushToEvidenceVault(req)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                      title="Send obtained video or record straight to My Evidence Vault"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>Push to Evidence</span>
                    </button>

                    <button
                      onClick={() => handleEditRequest(req)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                      title="Edit Request Parameters"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteRequest(req.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100"
                      title="Delete Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create or Edit Records Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base">
                    {editingRequestId ? 'Edit Evidence & Records Request' : 'Draft New Evidence Demand & Preservation Notice'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generates legally enforceable public records demands & litigation hold notices
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form id="record-request-form" onSubmit={handleSaveForm} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Demand Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Arresting Officer Body Camera Footage Demand"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Request Category
                  </label>
                  <select
                    value={formRequestType}
                    onChange={(e) => setFormRequestType(e.target.value as EvidenceRequestType)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="body_cam">Body-Worn Camera (BWC)</option>
                    <option value="dashcam">Cruiser Dashcam & Transport Van</option>
                    <option value="cad_911">911 Audio & CAD Dispatch Logs</option>
                    <option value="surveillance_cctv">Commercial / Merchant CCTV</option>
                    <option value="officer_personnel_giglio">Officer Disciplinary / Giglio File</option>
                    <option value="telecom_records">Cellular CDR & Tower Logs</option>
                    <option value="medical_ems">EMS Run Sheet & Hospital Records</option>
                    <option value="police_reports">Initial Field Notes & Supplemental Reports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority / Preservation Level
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="emergency_preservation">Emergency Preservation Hold (Anti-Spoliation)</option>
                    <option value="high">High Priority (Statutory Time Limit)</option>
                    <option value="standard">Standard Public Records Demand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Agency / Entity Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formAgencyName}
                    onChange={(e) => setFormAgencyName(e.target.value)}
                    placeholder="e.g. Tampa Police Dept / Hillsborough Sheriff"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Agency Entity Type
                  </label>
                  <select
                    value={formAgencyType}
                    onChange={(e) => setFormAgencyType(e.target.value as AgencyType)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="police_dept">Municipal Police Department</option>
                    <option value="sheriff">County Sheriff's Office</option>
                    <option value="clerk_court">Clerk of the Court</option>
                    <option value="merchant_cctv">Private Merchant / Property Management</option>
                    <option value="telecom">Telecommunications Carrier (AT&T, Verizon, etc.)</option>
                    <option value="ems_hospital">EMS Rescue / Hospital Facility</option>
                    <option value="other">Other Entity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Officers / Deputies Involved
                  </label>
                  <input
                    type="text"
                    value={formOfficersInvolved}
                    onChange={(e) => setFormOfficersInvolved(e.target.value)}
                    placeholder="e.g. Officer D. Miller, Deputy Kowalski"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge / Unit Numbers
                  </label>
                  <input
                    type="text"
                    value={formBadgeNumbers}
                    onChange={(e) => setFormBadgeNumbers(e.target.value)}
                    placeholder="e.g. Badge #4182, Vehicle #12"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formIncidentDate}
                    onChange={(e) => setFormIncidentDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Span Window
                  </label>
                  <input
                    type="text"
                    value={formTimeWindow}
                    onChange={(e) => setFormTimeWindow(e.target.value)}
                    placeholder="e.g. 19:15 to 21:00 EST"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location of Encounter / Cameras
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Intersection of 4th Ave & Elm St / Parking Lot North"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Statutory Grounds & Authority
                  </label>
                  <input
                    type="text"
                    value={formStatuteBasis}
                    onChange={(e) => setFormStatuteBasis(e.target.value)}
                    placeholder="e.g. Fla. Stat. § 119.071 & § 943.1718 / Brady v. Maryland"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specific Exculpatory Details or Specific Items Needed
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Explain what this video/record will prove (e.g., proves defendant was calm, did not resist, or was 10 miles away at checkout counter)."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* AI Letter Generator Button */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Formal Legal Demand Letter</h4>
                  <p className="text-[11px] text-slate-500">
                    Use our AI Paralegal Engine to generate an authoritative anti-spoliation demand citing statutes and retention duties.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAILetter}
                  disabled={isGeneratingLetter}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold shadow transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-200" />
                  <span>{isGeneratingLetter ? 'Drafting Letter...' : 'Generate Legal Letter with AI'}</span>
                </button>
              </div>

              {/* Demand Letter Content */}
              <div>
                <textarea
                  rows={8}
                  value={formLetter}
                  onChange={(e) => setFormLetter(e.target.value)}
                  placeholder="Click 'Generate Legal Letter with AI' above or paste your custom public records demand letter here..."
                  className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-slate-50"
                />
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500">
                All records requests include automatic tracking and evidence vault conversion.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="record-request-form"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow transition-colors"
                >
                  {editingRequestId ? 'Update Request' : 'Save & Issue Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View & Print Full Formal Demand Letter */}
      {viewLetterRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="font-serif font-bold text-base">
                    {viewLetterRequest.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Recipient: {viewLetterRequest.agencyName} &bull; Stat: {viewLetterRequest.statuteBasis}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewLetterRequest(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-900 bg-white p-5 rounded-lg border border-slate-300 leading-relaxed shadow-inner">
                {viewLetterRequest.formalDemandLetter}
              </pre>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Ready to dispatch via email, certified mail, or agency records portal.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLetter(viewLetterRequest.formalDemandLetter)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow transition-colors"
                >
                  {copiedLetter ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setViewLetterRequest(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
