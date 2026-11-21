import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ShieldCheck, 
  HelpCircle,
  FileText,
  Key,
  Database,
  ArrowRight
} from 'lucide-react';

interface BrevardClerkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadBrevardCase: () => void;
}

export const BrevardClerkModal: React.FC<BrevardClerkModalProps> = ({
  isOpen,
  onClose,
  onLoadBrevardCase,
}) => {
  const [copiedUcn, setCopiedUcn] = useState(false);
  const sampleBrevardUcn = "05-2025-CF-028419-AXXX-XX";

  if (!isOpen) return null;

  const handleCopyUcn = () => {
    navigator.clipboard.writeText(sampleBrevardUcn);
    setCopiedUcn(true);
    setTimeout(() => setCopiedUcn(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">Brevard County Clerk of Courts & API Guide</h3>
              <p className="text-xs text-slate-400">
                18th Judicial Circuit of Florida &bull; Rachel M. Sadoff, Clerk of Court & Comptroller
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Direct Answer Box */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-slate-900 space-y-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <h4 className="font-bold text-amber-950">Can you use the Brevard County Clerk of Courts API?</h4>
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              <strong>Short Answer:</strong> Florida Court Clerks (including Brevard County) <strong>do not offer an unrestricted, open public REST API</strong> for automated scraping by third-party web apps due to Florida Supreme Court privacy mandates (<strong>Fla. R. Gen. Prac. & Jud. Admin. 2.420</strong> and <strong>AOSC15-18</strong>).
            </p>
            <p className="text-xs leading-relaxed text-slate-700">
              However, <strong>Project Innocence</strong> integrates with Brevard County records via official public access links, UCN parsers, and the statewide Florida Court Clerks & Comptrollers (FCCC) CCIS framework.
            </p>
          </div>

          {/* Official Brevard County Clerk Access Channels */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              Official Brevard County & Florida Judicial Gateways
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Brevard Public Records Search */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Brevard Public Records Search</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Public Web</span>
                </div>
                <p className="text-xs text-slate-600">
                  Direct online portal for criminal, felony, misdemeanor, and traffic dockets maintained by Rachel M. Sadoff.
                </p>
                <div className="pt-1">
                  <a
                    href="https://vweb1.brevardclerk.us/psi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <span>Launch Brevard Case Search (vweb1)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* FCCC CCIS API */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Statewide CCIS Web API</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Bar / Agency API</span>
                </div>
                <p className="text-xs text-slate-600">
                  Comprehensive Case Information System (CCIS) operated by FCCC. Connects all 67 county clerks with programmatic XML/REST APIs for verified Florida Bar attorneys.
                </p>
                <div className="pt-1">
                  <a
                    href="https://www.flclerks.com/page/CCIS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <span>FCCC CCIS API Documentation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Florida Courts E-Filing Authority */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Florida Courts E-Filing Portal</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">E-Service</span>
                </div>
                <p className="text-xs text-slate-600">
                  Official statewide portal to serve motions, discovery notices, and alibi statements directly to the 18th Judicial Circuit.
                </p>
                <div className="pt-1">
                  <a
                    href="https://www.myflcourtaccess.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <span>MyFLCourtAccess Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Brevard County Sheriff Inmate Search */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Brevard Sheriff Inmate Search</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">BCSO Booking</span>
                </div>
                <p className="text-xs text-slate-600">
                  Verify arrest date, arresting agency, bond amount, and assigned booking number in Brevard County (Sharpes Jail).
                </p>
                <div className="pt-1">
                  <a
                    href="https://www.brevardsheriff.com/home/how-do-i/inmate-search/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <span>BCSO Inmate Search</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Brevard County Case Number Structure */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                Brevard County Uniform Case Number (UCN) Standard
              </h4>
              <button
                onClick={handleCopyUcn}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white"
              >
                {copiedUcn ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedUcn ? 'Copied' : 'Copy Sample'}</span>
              </button>
            </div>

            <div className="font-mono text-sm sm:text-base font-bold text-emerald-400 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>{sampleBrevardUcn}</span>
              <span className="text-[10px] text-slate-500 font-sans font-normal">County Code 05 = Brevard</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
              <div><strong className="text-amber-400">05:</strong> Brevard County</div>
              <div><strong className="text-amber-400">2025:</strong> Filing Year</div>
              <div><strong className="text-amber-400">CF:</strong> Circuit Felony</div>
              <div><strong className="text-amber-400">028419:</strong> Sequential #</div>
            </div>
          </div>

          {/* Brevard 18th Circuit Courthouses */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">Brevard County 18th Judicial Circuit Facilities</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p>&bull; <strong>Harry T. and Harriette V. Moore Justice Center</strong>: 2825 Judge Fran Jamieson Way, Viera, FL 32940 (Main Criminal Felony Division)</p>
              <p>&bull; <strong>Titusville Historic Courthouse</strong>: 506 S Palm Ave, Titusville, FL 32796</p>
              <p>&bull; <strong>Melbourne Branch Courthouse</strong>: 51 S Nieman Ave, Melbourne, FL 32901</p>
              <p>&bull; <strong>State Attorney Office (18th Circuit)</strong>: Phil Archer, State Attorney (Brevard & Seminole)</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Click below to load sample Brevard County felony docket into Project Innocence.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
            >
              Close
            </button>

            <button
              onClick={() => {
                onLoadBrevardCase();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-sm"
            >
              <span>Load Brevard Case into Portal & Scorecard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
