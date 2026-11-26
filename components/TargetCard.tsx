import React from "react";
import { TargetCompany, ExecutiveContact } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { 
  Building2, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle,
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  UserCheck,
  ExternalLink, 
  FileCode2, 
  Send,
  Scale,
  Pencil,
  PhoneCall,
  Clock,
  Layers,
  HelpCircle,
  Sparkles
} from "lucide-react";

interface TargetCardProps {
  target: TargetCompany;
  onOpenDrawer: (target: TargetCompany) => void;
  onOpenPlaybook: (target: TargetCompany) => void;
  onOpenOutreach: (target: TargetCompany) => void;
  onOpenEditContact?: (target: TargetCompany, contact: ExecutiveContact | null) => void;
  onOpenLogCall?: (target: TargetCompany, contact: ExecutiveContact | null) => void;
}

export const TargetCard: React.FC<TargetCardProps> = ({
  target,
  onOpenDrawer,
  onOpenPlaybook,
  onOpenOutreach,
  onOpenEditContact,
  onOpenLogCall,
}) => {
  const getRoiColor = (roi: number) => {
    if (roi >= 85) return "text-emerald-300 bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_16px_rgba(52,211,153,0.25)]";
    if (roi >= 60) return "text-cyan-300 bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_16px_rgba(56,189,248,0.25)]";
    if (roi >= 35) return "text-amber-300 bg-amber-500/15 border-amber-500/40 shadow-[0_0_16px_rgba(251,191,36,0.25)]";
    return "text-rose-300 bg-rose-500/15 border-rose-500/40 shadow-[0_0_16px_rgba(251,113,133,0.25)]";
  };

  const getTierBadge = (tier: string) => {
    if (tier === "verified") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]";
    if (tier === "screened") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]";
    if (tier === "radar") return "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]";
    return "bg-rose-500/20 text-rose-300 border-rose-500/40 line-through opacity-80";
  };

  const getExchangeBadge = (exchange: string) => {
    if (exchange === "EXPERT_MARKET") return "bg-rose-500/15 text-rose-300 border-rose-500/30";
    if (exchange === "PINK_LIMITED") return "bg-orange-500/15 text-orange-300 border-orange-500/30";
    if (exchange === "PINK_CURRENT") return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    if (exchange === "OTCID_BASIC") return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    if (exchange === "OTCQB") return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    if (exchange === "OTCQX") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    if (exchange === "TSX" || exchange === "TSXV" || exchange === "CSE" || exchange === "NEO") return "bg-red-500/20 text-red-300 border-red-500/40";
    if (exchange === "ASX") return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  };

  const formatPlaybook = (p: string) => {
    if (p === "article_9_foreclosure") return "Article 9 UCC Foreclosure";
    if (p === "section_363_sale") return "Section 363 Stalking Horse";
    if (p === "abc_receivership") return "ABC / State Receivership";
    if (p === "consensual_carveout") return "Consensual Carve-Out";
    return p;
  };

  const primaryContact = target.contacts[0];
  const isDisqualified = target.tier === "disqualified";

  return (
    <div 
      id={`target-card-${target.ticker.toLowerCase()}`}
      className={`card-3d group relative flex flex-col justify-between overflow-hidden ${
        isDisqualified 
          ? "border-rose-900/50 bg-[#090d16]/70 opacity-75 hover:opacity-100" 
          : ""
      }`}
    >
      {/* Top Banner: Ticker, Name, Tier, Exchange, 3D ROI Badge */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-[#f5d378] bg-[rgba(245,211,120,0.14)] px-2.5 py-0.5 rounded-lg border border-[rgba(245,211,120,0.4)] shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]">
                {target.ticker}
              </span>
              <span className={`font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${getTierBadge(target.tier)}`}>
                {target.tier === "disqualified" ? "Excluded Current Filer" : `${target.tier.toUpperCase()} TIER`}
              </span>
              <span className={`font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getExchangeBadge(target.exchange)}`}>
                {["TSX", "TSXV", "CSE", "NEO"].includes(target.exchange)
                  ? `🇨🇦 ${target.exchange}`
                  : target.exchange === "ASX"
                  ? `🇦🇺 ASX`
                  : target.exchange}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {target.cik ? `CIK:${target.cik}` : `ID:${target.id}`}
              </span>
            </div>
            
            <h3 className="mt-1.5 text-sm sm:text-base font-extrabold text-white group-hover:text-[#f5d378] transition truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {target.name}
            </h3>
            <p className="text-[11px] text-stone-300 truncate">
              Vertical: {target.vertical?.toUpperCase().replace("_", " ")} • Sector: {target.sector}
            </p>

            {/* Sourced Primary Receipts Links */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <a
                href={target.secEdgarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 rounded-md bg-[rgba(16,36,28,0.7)] px-2 py-0.5 text-[9px] font-mono text-emerald-300 hover:text-emerald-100 border border-emerald-500/35 transition shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
              >
                <span>EDGAR 10-K</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </a>
              <a
                href={target.latestFilingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 rounded-md bg-[rgba(36,28,14,0.7)] px-2 py-0.5 text-[9px] font-mono text-amber-300 hover:text-amber-100 border border-amber-500/35 transition shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
              >
                <span>Receipt: {target.latestFilingType}</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </a>
              {target.extractionFeasibility.uccSearchNumber && (
                <span className="inline-flex items-center space-x-1 rounded-md bg-[#070a10] px-2 py-0.5 text-[9px] font-mono text-cyan-300 border border-[rgba(245,211,120,0.2)] shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                  <span>UCC-1 #{target.extractionFeasibility.uccSearchNumber}</span>
                </span>
              )}
            </div>
          </div>

          {/* 3D Tri-Factor ROI Badge */}
          <div className="flex flex-col items-end shrink-0">
            <div className={`roi-badge-3d flex flex-col items-center justify-center rounded-2xl border px-3.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_12px_rgba(0,0,0,0.6)] ${getRoiColor(target.scores.rollupOpportunityIndex)}`}>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-90">
                {isDisqualified ? "DISQUALIFIED" : "Rollup ROI"}
              </span>
              <span className="font-mono text-lg sm:text-2xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {target.scores.rollupOpportunityIndex}
              </span>
            </div>
            
            {/* Catalyst Clock Countdown */}
            {target.forcingEvent && (
              <div className={`mt-1.5 flex items-center space-x-1 rounded-md px-2 py-0.5 text-[9px] font-mono font-bold border ${
                target.forcingEvent.leadTimeWindow === "inside_90d_active"
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(251,191,36,0.25)] animate-pulse"
                  : "bg-[#070a10] text-stone-300 border-[rgba(245,211,120,0.2)]"
              }`}>
                <Clock className="h-2.5 w-2.5" />
                <span>⏱ {target.forcingEvent.daysRemaining}d catalyst</span>
              </div>
            )}
          </div>
        </div>

        {/* Disqualification Banner if Current Filer */}
        {isDisqualified && target.disqualificationReason && (
          <div className="mt-2.5 rounded-xl border border-rose-800/60 bg-rose-950/40 p-2.5 text-[11px] text-rose-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{target.disqualificationReason}</span>
            </div>
          </div>
        )}

        {/* Three Hard Gates Funnel Bar */}
        <div className="panel-inset-3d mt-3 p-2.5 sm:p-3 text-xs">
          <div className="text-[10px] font-mono text-stone-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="font-bold flex items-center gap-1 text-[#f5d378]">
              <Sparkles className="h-3 w-3" />
              THREE HARD GATES AUDIT
            </span>
            <span className={`font-bold ${
              target.threeGates?.overallGate === "passed_all_3" 
                ? "text-emerald-400" 
                : target.threeGates?.overallGate === "partial_screened" 
                ? "text-cyan-400" 
                : "text-rose-400"
            }`}>
              {target.threeGates?.overallGate === "passed_all_3" ? "PASSED ALL 3" : target.threeGates?.overallGate === "partial_screened" ? "PARTIAL SCREENED" : "FAILED GATE"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            {/* Gate 1 */}
            <div className={`flex items-center space-x-1 rounded-lg p-1.5 border shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] ${
              target.threeGates?.gate1_parentDistress.passed
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-400"
            }`}>
              {target.threeGates?.gate1_parentDistress.passed ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <XCircle className="h-3 w-3 shrink-0" />}
              <span className="truncate font-semibold">G1: Distress</span>
            </div>

            {/* Gate 2 */}
            <div className={`flex items-center space-x-1 rounded-lg p-1.5 border shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] ${
              target.threeGates?.gate2_separableValue.passed
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-400"
            }`}>
              {target.threeGates?.gate2_separableValue.passed ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <XCircle className="h-3 w-3 shrink-0" />}
              <span className="truncate font-semibold">G2: EX-21 Sub</span>
            </div>

            {/* Gate 3 */}
            <div className={`flex items-center space-x-1 rounded-lg p-1.5 border shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] ${
              target.threeGates?.gate3_controlPoint.passed
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/40 bg-amber-500/10 text-amber-300"
            }`}>
              {target.threeGates?.gate3_controlPoint.passed ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <HelpCircle className="h-3 w-3 shrink-0" />}
              <span className="truncate font-semibold">G3: &le;2 Lenders</span>
            </div>
          </div>
        </div>

        {/* The Separable Operating Asset & Segment-Profit Mismatch (3D Inset Slab) */}
        <div className="panel-inset-3d mt-3 p-3.5 sm:p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#f5d378] font-bold">
              Separable EX-21 Subsidiary:
            </span>
            <span className="text-[10px] font-mono text-stone-300">
              Clean Shell Fit: <strong className="text-emerald-400 capitalize">{target.extractionFeasibility.cleanShellFit}</strong>
            </span>
          </div>

          <p className="mt-1 font-extrabold text-white text-xs sm:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
            {target.asset.subsidiaryName}
          </p>
          <p className="mt-1 text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
            {target.asset.businessSummary}
          </p>

          {/* Segment-Profit Mismatch Callout */}
          {target.segmentMismatch && (
            <div className="mt-2.5 rounded-lg bg-[rgba(10,16,28,0.9)] border border-[rgba(245,211,120,0.18)] p-2 text-[10px] font-mono flex items-center justify-between text-stone-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
              <span className="text-rose-400 font-bold">Parent Loss: ${(Math.abs(target.segmentMismatch.parentConsolidatedLoss) / 1e6).toFixed(1)}M</span>
              <span className="text-[#f5d378]">&rarr;</span>
              <span className="text-emerald-400 font-bold">Sub Cash Flow: ${target.asset.annualRevenue > 0 ? (target.asset.annualRevenue / 1e6).toFixed(1) + 'M Rev' : '$0 Pre-Rev IP'}</span>
              <span className="text-cyan-400 font-bold">Spread: +${(target.segmentMismatch.spreadDelta / 1e6).toFixed(1)}M</span>
            </div>
          )}

          {/* Financial Breakdown Grid */}
          <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-[rgba(245,211,120,0.14)] text-[11px]">
            <div>
              <span className="text-[9.5px] text-stone-400 font-mono">SUB REVENUE</span>
              <p className="font-mono font-bold text-white">
                {target.asset.annualRevenue > 0 ? formatCurrency(target.asset.annualRevenue) : "$0 (Pre-Rev IP)"}
              </p>
            </div>
            <div>
              <span className="text-[9.5px] text-stone-400 font-mono">SENIOR SECURED DEBT</span>
              <p className="font-mono font-bold text-amber-400">
                {formatCurrency(target.extractionFeasibility.seniorSecuredDebtAmount)}
              </p>
            </div>
            <div>
              <span className="text-[9.5px] text-stone-400 font-mono">EST. BUYOUT COST</span>
              <p className="font-mono font-bold text-emerald-400">
                {formatCurrency(target.extractionFeasibility.estimatedAcquisitionCost)}
              </p>
            </div>
            <div>
              <span className="text-[9.5px] text-stone-400 font-mono">SENIOR CREDITOR</span>
              <p className="font-mono font-semibold text-stone-200 truncate" title={target.extractionFeasibility.seniorSecuredHolder}>
                {target.extractionFeasibility.seniorSecuredHolder.split("/")[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Contact Person Box */}
        {primaryContact && (
          <div className="panel-inset-3d mt-3 flex items-center justify-between p-3 text-xs">
            <div className="min-w-0">
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400">
                Primary Decision Maker:
              </span>
              <p className="font-bold text-stone-100 truncate">
                {primaryContact.name} • <span className="text-[#f5d378] font-normal">{primaryContact.title}</span>
              </p>
              <p className="font-mono text-[10px] text-stone-300 truncate">
                {primaryContact.phone} • {primaryContact.email}
              </p>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0 ml-2">
              {onOpenLogCall && (
                <button
                  id={`btn-call-${target.ticker.toLowerCase()}`}
                  onClick={() => onOpenLogCall(target, primaryContact)}
                  className="btn-secondary-3d p-2 text-emerald-400 hover:text-emerald-300 min-w-[36px] min-h-[36px]"
                  title="Log Call"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                </button>
              )}
              {onOpenEditContact && (
                <button
                  id={`btn-edit-contact-${target.ticker.toLowerCase()}`}
                  onClick={() => onOpenEditContact(target, primaryContact)}
                  className="btn-secondary-3d p-2 text-[#f5d378] hover:text-white min-w-[36px] min-h-[36px]"
                  title="Edit Contact"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="border-t border-[rgba(245,211,120,0.18)] bg-[rgba(6,10,18,0.95)] p-3 sm:p-4 flex items-center justify-between gap-2.5">
        <button
          id={`btn-playbook-${target.ticker.toLowerCase()}`}
          onClick={() => onOpenPlaybook(target)}
          className="btn-secondary-3d flex-1 py-2 px-3 text-xs font-semibold text-stone-200 min-h-[38px]"
        >
          <Scale className="h-3.5 w-3.5 text-cyan-400 mr-1.5 shrink-0" />
          <span className="truncate">{formatPlaybook(target.extractionFeasibility.recommendedPlaybook)}</span>
        </button>

        <button
          id={`btn-outreach-${target.ticker.toLowerCase()}`}
          onClick={() => onOpenOutreach(target)}
          className="btn-gold-3d px-3.5 py-2 text-xs font-bold min-h-[38px]"
        >
          <Send className="h-3.5 w-3.5 mr-1" />
          <span>Outreach</span>
        </button>

        <button
          id={`btn-dossier-${target.ticker.toLowerCase()}`}
          onClick={() => onOpenDrawer(target)}
          className="btn-secondary-3d px-3 py-2 text-xs font-semibold text-stone-200 min-h-[38px]"
          title="Open Dossier"
        >
          <span>Dossier</span>
          <ArrowRight className="h-3.5 w-3.5 ml-1 text-[#f5d378]" />
        </button>
      </div>
    </div>
  );
};
