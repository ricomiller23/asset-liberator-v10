import React from "react";
import { Search, Filter, SlidersHorizontal, RefreshCcw, Sparkles, Clock, ShieldCheck, Layers } from "lucide-react";
import { SearchFilters, PlaybookType, TargetTier, TargetVertical } from "@/lib/types";

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  resultCount: number;
  allTotal?: number;
  tierCounts?: {
    verified: number;
    screened: number;
    radar: number;
    disqualified: number;
  };
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  resultCount,
  allTotal,
  tierCounts,
  onRefresh,
  isRefreshing,
}) => {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, query: e.target.value });
  };

  const handlePlaybookSelect = (playbook: PlaybookType | "all") => {
    onFilterChange({ ...filters, playbook });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as any });
  };

  const handleReset = () => {
    onFilterChange({
      query: "",
      sector: "all",
      playbook: "all",
      exchange: "all",
      filingStatus: "all",
      minRevenue: undefined,
      revenueTier: "all",
      tier: "all",
      vertical: "all",
      leadTime: "all",
      sortBy: "roi",
    });
  };

  return (
    <div className="filter-console-3d p-4 sm:p-5 space-y-3.5">
      {/* Top Bar: Search + Sort */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f5d378]" />
          <input
            id="filter-search-input"
            type="text"
            placeholder="Search Ticker, Name, Subsidiary, EX-21 Entity, Lender (e.g. Streeterville, SourceHOV)..."
            value={filters.query || ""}
            onChange={handleQueryChange}
            className="w-full rounded-xl border border-[rgba(245,211,120,0.25)] bg-[rgba(5,8,14,0.92)] py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-stone-400 focus:border-[rgba(245,211,120,0.7)] focus:outline-none focus:ring-1 focus:ring-[#f5d378] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] min-h-[42px]"
          />
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-stone-300 shrink-0 bg-[rgba(6,10,18,0.9)] px-3 py-1.5 rounded-xl border border-[rgba(245,211,120,0.18)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
            <span className="font-mono text-[#f5d378] font-black">{resultCount}</span>
            <span className="text-[11px] sm:text-xs text-stone-400">targets</span>
          </div>

          <div className="flex items-center space-x-1.5 flex-1 sm:flex-initial">
            <span className="text-stone-300 text-[11px] sm:text-xs shrink-0 font-semibold">Sort:</span>
            <select
              id="filter-sort-select"
              value={filters.sortBy || "roi"}
              onChange={handleSortChange}
              className="w-full sm:w-auto rounded-xl border border-[rgba(245,211,120,0.25)] bg-[rgba(6,10,18,0.95)] px-3 py-2 text-[11px] sm:text-xs font-bold text-[#f5d378] focus:border-[#f5d378] focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] min-h-[40px]"
            >
              <option value="roi">Highest Rollup ROI</option>
              <option value="catalyst_asc">⏱ Imminent Catalyst Clock (Days)</option>
              <option value="revenue">Highest Sub Revenue</option>
              <option value="distress">Vehicle Distress</option>
              <option value="debt_asc">Lowest Senior Debt Buyout</option>
            </select>
          </div>

          <button
            id="filter-refresh-btn"
            onClick={() => {
              if (onRefresh) onRefresh();
              else handleReset();
            }}
            className="btn-secondary-3d p-2 text-stone-300 hover:text-white shrink-0 cursor-pointer min-w-[40px] min-h-[40px]"
            title="Refresh universe & live catalyst clocks"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#f5d378]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Row 1: Funnel Tiers */}
      <div className="flex items-center gap-1.5 pt-2.5 border-t border-[rgba(245,211,120,0.14)] text-xs overflow-x-auto scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
        <span className="text-[10px] sm:text-[11px] font-mono text-[#f5d378] mr-1 uppercase tracking-wider shrink-0 flex items-center gap-1 font-bold">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          FUNNEL TIERS:
        </span>
        {[
          {
            id: "all",
            label: `All (${allTotal || 381})`,
          },
          {
            id: "verified",
            label: `Qualified Tier 1 (${tierCounts?.verified ?? 18})`,
          },
          {
            id: "screened",
            label: `Screened (${tierCounts?.screened ?? 102})`,
          },
          {
            id: "radar",
            label: `Radar (${tierCounts?.radar ?? 257})`,
          },
          {
            id: "disqualified",
            label: `Excluded (${tierCounts?.disqualified ?? 4})`,
          },
        ].map((item) => {
          const isSelected = (filters.tier || "all") === item.id;
          return (
            <button
              key={item.id}
              id={`filter-tier-${item.id}`}
              onClick={() => onFilterChange({ ...filters, tier: item.id as TargetTier | "all" })}
              className={`rounded-lg px-2.5 py-1 text-[11px] sm:text-xs transition font-semibold shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-[rgba(245,211,120,0.25)] to-[rgba(201,150,54,0.15)] text-[#f5d378] border border-[rgba(245,211,120,0.55)] shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
                  : "bg-[rgba(6,10,18,0.85)] text-stone-300 hover:text-white border border-[rgba(245,211,120,0.14)] hover:border-[rgba(245,211,120,0.3)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Row 2: Coherent Industry Verticals */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-[rgba(245,211,120,0.14)] text-xs overflow-x-auto scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
        <span className="text-[10px] sm:text-[11px] font-mono text-cyan-400 mr-1 uppercase tracking-wider shrink-0 flex items-center gap-1 font-bold">
          <Layers className="h-3 w-3" />
          VERTICAL:
        </span>
        {[
          { id: "all", label: "All Verticals" },
          { id: "b2b_software", label: "B2B Software & Enterprise Services" },
          { id: "specialty_manufacturing", label: "Specialty Industrial Manufacturing" },
          { id: "solar_energy", label: "Solar & Energy Transition" },
          { id: "pre_revenue_ip", label: "Pre-Revenue IP (Separate Product)" },
          { id: "cross_border_canada", label: "🇨🇦 Canada (TSX/TSXV/CSE)" },
          { id: "cross_border_australia", label: "🇦🇺 Australia (ASX)" },
          { id: "all_foreign", label: "🌐 All Foreign Stocks" },
        ].map((item) => {
          const isSelected = (filters.vertical || "all") === item.id;
          return (
            <button
              key={item.id}
              id={`filter-vertical-${item.id}`}
              onClick={() => onFilterChange({ ...filters, vertical: item.id as any })}
              className={`rounded-lg px-2.5 py-1 text-[11px] sm:text-xs transition font-semibold shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-purple-500/25 to-purple-600/15 text-purple-300 border border-purple-500/50 shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
                  : "bg-[rgba(6,10,18,0.85)] text-stone-300 hover:text-white border border-[rgba(245,211,120,0.14)] hover:border-[rgba(245,211,120,0.3)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Row 3: Catalyst Clock */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-[rgba(245,211,120,0.14)] text-xs overflow-x-auto scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
        <span className="text-[10px] sm:text-[11px] font-mono text-amber-400 mr-1 uppercase tracking-wider shrink-0 flex items-center gap-1 font-bold">
          <Clock className="h-3 w-3" />
          CATALYST CLOCK:
        </span>
        {[
          { id: "all", label: "All Clocks" },
          { id: "inside_90d", label: "Active: Inside 90-Day Catalyst Window (Maturity / Forbearance)" },
          { id: "outside_90d", label: "Radar: > 90 Days (Monitored)" },
        ].map((item) => {
          const isSelected = (filters.leadTime || "all") === item.id;
          return (
            <button
              key={item.id}
              id={`filter-clock-${item.id}`}
              onClick={() => onFilterChange({ ...filters, leadTime: item.id as any })}
              className={`rounded-lg px-2.5 py-1 text-[11px] sm:text-xs transition font-semibold shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-amber-500/25 to-amber-600/15 text-amber-300 border border-amber-500/50 shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
                  : "bg-[rgba(6,10,18,0.85)] text-stone-300 hover:text-white border border-[rgba(245,211,120,0.14)] hover:border-[rgba(245,211,120,0.3)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Row 4: Playbook Quick Chips */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-[rgba(245,211,120,0.14)] text-xs overflow-x-auto scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
        <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mr-1 uppercase tracking-wider shrink-0 font-bold">
          PLAYBOOK:
        </span>
        {[
          { id: "all", label: "All Playbooks" },
          { id: "article_9_foreclosure", label: "Article 9 UCC Foreclosure" },
          { id: "section_363_sale", label: "Section 363 Stalking Horse" },
          { id: "consensual_carveout", label: "Consensual Carve-Out" },
          { id: "abc_receivership", label: "ABC / State Receivership" },
        ].map((item) => {
          const isSelected = (filters.playbook || "all") === item.id;
          return (
            <button
              key={item.id}
              id={`filter-playbook-${item.id}`}
              onClick={() => handlePlaybookSelect(item.id as any)}
              className={`rounded-lg px-2.5 py-1 text-[11px] sm:text-xs transition font-semibold shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-emerald-500/25 to-emerald-600/15 text-emerald-300 border border-emerald-500/50 shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
                  : "bg-[rgba(6,10,18,0.85)] text-stone-300 hover:text-white border border-[rgba(245,211,120,0.14)] hover:border-[rgba(245,211,120,0.3)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
