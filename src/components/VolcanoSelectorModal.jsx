import React, { useState, useEffect } from "react";
import { 
  X, 
  Mountain, 
  Search, 
  Flame, 
  Users, 
  ChevronRight,
  CheckCircle2,
  Filter,
  Sparkles,
  Clock,
  BookOpen,
  ShieldAlert
} from "lucide-react";
import { HISTORICAL_VOLCANOES } from "../data/historicalVolcanoes";

export default function VolcanoSelectorModal({
  isOpen,
  onClose,
  activeVolcanoId,
  onSelectVolcano
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredVolcanoes = HISTORICAL_VOLCANOES.filter((v) => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "future") return matchesSearch && v.isFutureProjection;
    if (selectedFilter === "super") return matchesSearch && v.defaultVei >= 7 && !v.isFutureProjection;
    if (selectedFilter === "island") return matchesSearch && (v.terrainType === "island_sea" || v.terrainType === "island_composite");
    if (selectedFilter === "modern") return matchesSearch && (v.year.includes("19") || v.year.includes("20")) && !v.isFutureProjection;
    return matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-modal-enter"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header - Fixed & Pinned at Top */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/95 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-600 via-red-600 to-amber-600 text-white shadow-lg shadow-red-600/30">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white">
                  Katalog Erupsi Bersejarah & Potensi Katastropik 2046
                </h2>
                <span className="text-[10px] bg-red-600/30 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  {filteredVolcanoes.length} dari {HISTORICAL_VOLCANOES.length} Katalog
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih skenario bencana bersejarah atau eksplorasi proyeksi ilmiah 5 gunung berapi masa depan (~2046)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title="Tutup Katalog (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar - Fixed & Pinned */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari gunung, lokasi, atau tahun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden sm:block mr-1" />
            
            {/* All */}
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedFilter === "all" 
                  ? "bg-amber-500 text-slate-950 shadow" 
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Semua {HISTORICAL_VOLCANOES.length}
            </button>

            {/* NEW: Futuristic Future Projection Filter Pill */}
            <button
              onClick={() => setSelectedFilter("future")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedFilter === "future" 
                  ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 text-white shadow-lg shadow-violet-600/40 ring-1 ring-cyan-300" 
                  : "bg-violet-950/40 text-violet-300 border border-violet-700/50 hover:bg-violet-900/60 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>🔮 Proyeksi Masa Depan (~2046)</span>
            </button>

            {/* Supervolcano */}
            <button
              onClick={() => setSelectedFilter("super")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedFilter === "super" 
                  ? "bg-amber-500 text-slate-950 shadow" 
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Supervolcano (VEI 7-8)
            </button>

            {/* Island & Tsunami */}
            <button
              onClick={() => setSelectedFilter("island")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedFilter === "island" 
                  ? "bg-amber-500 text-slate-950 shadow" 
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Kepulauan & Tsunami
            </button>

            {/* Modern Era */}
            <button
              onClick={() => setSelectedFilter("modern")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedFilter === "modern" 
                  ? "bg-amber-500 text-slate-950 shadow" 
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Era Modern (Abad 20-21)
            </button>
          </div>
        </div>

        {/* Scrollable Volcano Grid Container */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overscroll-contain">
          {filteredVolcanoes.map((volcano) => {
            const isCurrent = volcano.id === activeVolcanoId;
            const isFuture = volcano.isFutureProjection;

            return (
              <div
                key={volcano.id}
                onClick={() => {
                  onSelectVolcano(volcano);
                  onClose();
                }}
                className={`cursor-pointer rounded-2xl border transition-all p-4 flex flex-col justify-between ${
                  isFuture
                    ? isCurrent
                      ? "bg-violet-950/40 border-cyan-400 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400"
                      : "bg-gradient-to-br from-slate-950/95 via-violet-950/25 to-slate-950/95 border-violet-700/60 hover:border-cyan-400 hover:shadow-lg hover:shadow-violet-950/40"
                    : isCurrent
                      ? "bg-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90"
                }`}
              >
                <div>
                  {/* Card Top Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-black ${isFuture ? "text-cyan-100" : "text-white"}`}>
                          {volcano.name}
                        </span>

                        {isFuture ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-violet-900/60 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>Proyeksi ~2046</span>
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-md font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                            {volcano.year}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {volcano.province}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isFuture ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-600/30 border border-cyan-300/40">
                          VEI {volcano.defaultVei} • PROYEKSI
                        </span>
                      ) : (
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                          volcano.defaultVei >= 7 
                            ? "bg-red-600 text-white shadow-md shadow-red-600/40" 
                            : volcano.defaultVei === 6 
                            ? "bg-orange-600 text-white" 
                            : "bg-amber-600 text-slate-950"
                        }`}>
                          VEI {volcano.defaultVei}
                        </span>
                      )}

                      <span className="text-[10px] text-slate-500 font-mono">
                        {volcano.tephraKm3} km³ tephra
                      </span>
                    </div>
                  </div>

                  {/* Subtitle with distinct futuristic icon for Future Projections */}
                  <div className={`mt-2.5 text-xs font-semibold flex items-center gap-1.5 ${
                    isFuture ? "text-cyan-300" : "text-amber-200/90"
                  }`}>
                    {isFuture ? (
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
                    ) : (
                      <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span>{volcano.subtitle}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {volcano.description}
                  </p>

                  {/* Scientific Rationale & Official Expert Sources for Future Volcanoes */}
                  {isFuture && volcano.scientificRationale && (
                    <div className="mt-2.5 p-2 rounded-xl bg-violet-950/40 border border-violet-800/40 text-[10px] text-violet-200 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-cyan-300 uppercase tracking-wider">
                        <BookOpen className="w-3 h-3 text-cyan-400" />
                        <span>Dasar Ilmiah & Studi Ahli Resmi (PVMBG/GVP):</span>
                      </div>
                      <p className="line-clamp-2 text-slate-300">
                        {volcano.scientificRationale}
                      </p>
                    </div>
                  )}

                  {/* Modern What-If Preview Box */}
                  {volcano.modernWhatIf && (
                    <div className={`mt-3 p-2.5 rounded-xl border text-[11px] space-y-1.5 ${
                      isFuture 
                        ? "bg-slate-950/80 border-violet-800/50" 
                        : "bg-slate-900/90 border-slate-800/80"
                    }`}>
                      <div className="font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider text-rose-400">
                        {isFuture ? <ShieldAlert className="w-3 h-3 text-cyan-400" /> : <Users className="w-3 h-3" />}
                        <span>{isFuture ? "Proyeksi Dampak 20 Tahun ke Depan:" : "Simulasi Jika Terjadi Hari Ini:"}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Populasi Berisiko:</span>
                        <b className={isFuture ? "text-cyan-300" : "text-rose-300"}>
                          {volcano.modernWhatIf.totalPopulationAtRisk}
                        </b>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Estimasi Kerugian:</span>
                        <b className={isFuture ? "text-amber-300" : "text-amber-400"}>
                          {volcano.modernWhatIf.economicRiskUSD}
                        </b>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
                  isFuture ? "border-violet-900/50" : "border-slate-800/60"
                }`}>
                  <span className={`text-[11px] font-medium ${isFuture ? "text-cyan-400/80" : "text-slate-500"}`}>
                    {volcano.locations?.length || 25} Titik Kota Terpetakan
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVolcano(volcano);
                      onClose();
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 btn-premium ${
                      isFuture
                        ? isCurrent
                          ? "bg-violet-900 text-cyan-300 border border-cyan-400/50 shadow"
                          : "bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400 shadow-md shadow-violet-600/40"
                        : isCurrent
                          ? "bg-slate-800 text-amber-400 border border-amber-400/40"
                          : "bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-500 hover:to-amber-500 shadow-md shadow-red-600/30"
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isFuture ? "text-cyan-400" : "text-amber-400"}`} />
                        <span>Sedang Aktif</span>
                      </>
                    ) : (
                      <>
                        <span>{isFuture ? "Simulasi 2046" : "Muat Simulasi"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <span>Katalog 20 Gunung: 15 Erupsi Sejarah + 5 Proyeksi Katastropik 20 Tahun ke Depan (2046)</span>
          <span className="text-slate-500">Klik kartu atau tombol untuk memuat simulasi</span>
        </div>
      </div>
    </div>
  );
}
