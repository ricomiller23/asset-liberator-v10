import React from "react";
import { ShieldAlert, Database, Layers, Users, Download, Search, BarChart3, Radio, Landmark, Sparkles } from "lucide-react";

export type NavTabType = "screener" | "events" | "lenders" | "crm";

interface NavbarProps {
  activeTab: NavTabType;
  onTabChange: (tab: NavTabType) => void;
  onOpenGlobalSearch: () => void;
  onOpenReport?: () => void;
  stats?: {
    totalSubsidiaryRevenue: number;
    totalSeniorDebt: number;
    totalToxicDebtExtinguished: number;
    totalContacts: number;
    totalTargets: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenGlobalSearch,
  onOpenReport,
  stats,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(245,211,120,0.25)] bg-[rgba(7,10,16,0.92)] backdrop-blur-xl shadow-[0_12px_36px_-10px_rgba(0,0,0,0.85)] max-w-full overflow-x-hidden">
      {/* Top Telemetry Bar */}
      <div className="border-b border-[rgba(245,211,120,0.14)] bg-[rgba(5,8,14,0.96)] px-3 sm:px-6 py-1.5 text-[10px] sm:text-[11px] text-stone-300 max-w-full overflow-x-hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-mono font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
              <span>SEC EDGAR & UCC FORENSIC 3D RADAR</span>
            </span>
            <span className="hidden md:inline text-[rgba(245,211,120,0.3)]">|</span>
            <span className="hidden md:inline text-stone-400 text-[10.5px]">
              Three Hard Gates • Event-Driven 8-K Telemetry • Inverted Senior Lender Index
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 font-mono text-[9.5px] sm:text-[11px] shrink-0 font-medium">
            {stats && (
              <>
                <span className="text-stone-300">
                  QUALIFIED SUB REV: <strong className="text-emerald-400 font-bold">${(stats.totalSubsidiaryRevenue / 1000000).toFixed(1)}M</strong>
                </span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-300">
                  SR DEBT: <strong className="text-cyan-400 font-bold">${(stats.totalSeniorDebt / 1000000).toFixed(1)}M</strong>
                </span>
                <span className="text-stone-400 hidden sm:inline">•</span>
                <span className="hidden sm:inline text-stone-300">
                  TOXIC WIPED: <strong className="text-amber-400 font-bold">${(stats.totalToxicDebtExtinguished / 1000000).toFixed(1)}M</strong>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex flex-wrap max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-3 gap-2 sm:gap-3 max-w-full overflow-x-hidden">
        {/* Brand Crest */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f5d378]/25 via-[#c99636]/15 to-transparent border border-[rgba(245,211,120,0.5)] text-[#f5d378] shadow-[0_4px_16px_rgba(212,164,65,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]">
            <ShieldAlert className="h-5 w-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-mono text-xs sm:text-sm font-extrabold tracking-wider text-[#f5d378] truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                ASSET LIBERATOR
              </span>
              <span className="crest-badge shrink-0">
                ROYAL 3D SALON
              </span>
            </div>
            <h1 className="text-xs sm:text-xs font-semibold tracking-tight text-stone-300 truncate hidden xs:block">
              Public Carve-Out &amp; Clean Shell Rollup Engine
            </h1>
          </div>
        </div>

        {/* Global Search Bar (Center / 3D Inset Omnibar) */}
        <div className="w-full sm:flex-1 sm:max-w-md sm:mx-2 order-3 sm:order-2">
          <button
            id="nav-global-search-btn"
            onClick={onOpenGlobalSearch}
            className="w-full flex items-center justify-between rounded-xl border border-[rgba(245,211,120,0.22)] bg-[rgba(9,14,24,0.85)] px-3 py-1.5 sm:py-2 text-xs text-stone-300 hover:border-[rgba(245,211,120,0.55)] hover:text-white transition group shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(245,211,120,0.15)] min-h-[40px]"
          >
            <div className="flex items-center space-x-2 truncate">
              <Search className="h-3.5 w-3.5 text-[#f5d378] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate text-stone-400 group-hover:text-stone-200">
                <span className="hidden sm:inline">Search people, companies, tickers, lenders...</span>
                <span className="sm:hidden">Search targets &amp; lenders...</span>
              </span>
            </div>
            <div className="flex items-center space-x-1 shrink-0 ml-2">
              <kbd className="hidden md:inline-flex items-center rounded border border-[rgba(245,211,120,0.25)] bg-[#070a10] px-1.5 py-0.5 text-[9px] font-mono text-[#f5d378] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 order-2 sm:order-3 max-w-full overflow-x-auto">
          <div className="flex rounded-xl bg-[rgba(6,10,18,0.95)] p-0.5 sm:p-1 border border-[rgba(245,211,120,0.22)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] text-xs">
            <button
              id="nav-tab-screener"
              onClick={() => onTabChange("screener")}
              className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2.5 py-1.5 font-medium transition ${
                activeTab === "screener"
                  ? "bg-gradient-to-b from-[#f5d378] to-[#c99636] text-[#070a10] font-bold shadow-[0_4px_12px_rgba(212,164,65,0.4)]"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Layers className={`h-3.5 w-3.5 shrink-0 ${activeTab === "screener" ? "text-[#070a10]" : "text-emerald-400"}`} />
              <span className="text-[11px] sm:text-xs">Screener</span>
            </button>

            <button
              id="nav-tab-events"
              onClick={() => onTabChange("events")}
              className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2.5 py-1.5 font-medium transition ${
                activeTab === "events"
                  ? "bg-gradient-to-b from-[#f5d378] to-[#c99636] text-[#070a10] font-bold shadow-[0_4px_12px_rgba(212,164,65,0.4)]"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Radio className={`h-3.5 w-3.5 shrink-0 ${activeTab === "events" ? "text-[#070a10]" : "text-amber-400"}`} />
              <span className="text-[11px] sm:text-xs">8-K Events</span>
            </button>

            <button
              id="nav-tab-lenders"
              onClick={() => onTabChange("lenders")}
              className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2.5 py-1.5 font-medium transition ${
                activeTab === "lenders"
                  ? "bg-gradient-to-b from-[#f5d378] to-[#c99636] text-[#070a10] font-bold shadow-[0_4px_12px_rgba(212,164,65,0.4)]"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Landmark className={`h-3.5 w-3.5 shrink-0 ${activeTab === "lenders" ? "text-[#070a10]" : "text-purple-400"}`} />
              <span className="text-[11px] sm:text-xs">Lenders</span>
            </button>

            <button
              id="nav-tab-crm"
              onClick={() => onTabChange("crm")}
              className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2.5 py-1.5 font-medium transition ${
                activeTab === "crm"
                  ? "bg-gradient-to-b from-[#f5d378] to-[#c99636] text-[#070a10] font-bold shadow-[0_4px_12px_rgba(212,164,65,0.4)]"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Users className={`h-3.5 w-3.5 shrink-0 ${activeTab === "crm" ? "text-[#070a10]" : "text-cyan-400"}`} />
              <span className="text-[11px] sm:text-xs">CRM</span>
            </button>
          </div>

          {onOpenReport && (
            <button
              id="nav-open-report-btn"
              onClick={onOpenReport}
              className="btn-secondary-3d px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-cyan-300 min-h-[36px]"
            >
              <BarChart3 className="h-3.5 w-3.5 text-cyan-400 mr-1.5" />
              <span className="hidden md:inline">Report</span>
            </button>
          )}

          <a
            id="nav-export-csv-btn"
            href="/api/export?format=csv"
            download
            className="btn-gold-3d px-3 py-1.5 text-xs font-bold text-[#070a10] min-h-[36px] hidden sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5 mr-1 text-[#070a10]" />
            <span>CSV Export</span>
          </a>
        </div>
      </div>
    </header>
  );
};
