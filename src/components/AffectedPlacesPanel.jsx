import React, { useState, useMemo } from "react";
import { calculateLocationDynamicStatus } from "../utils/physicsEngine";
import { SINGLE_WORD_RATINGS } from "../data/historicalLocations";
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Mountain,
  Zap
} from "lucide-react";

export default function AffectedPlacesPanel({ 
  locations = [], 
  volcanoName = "Gunung Krakatau",
  vei, 
  timeMinutes, 
  selectedLocation, 
  onSelectLocation,
  windDirection = "B",
  windSpeedKmH = 35
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("ALL");

  // Dynamic Hazard Level Calculation for every location synchronized with VEI & T+
  const locationsWithStatus = useMemo(() => {
    return locations.map((loc) => {
      const dynamicStatus = calculateLocationDynamicStatus(loc, vei, timeMinutes, {
        windDirection,
        windSpeedKmH,
      });
      return {
        ...loc,
        dynamicStatus,
        dynamicRating: dynamicStatus.hazardLevel,
      };
    });
  }, [locations, vei, timeMinutes, windDirection, windSpeedKmH]);

  const filteredLocations = locationsWithStatus.filter((loc) => {
    const matchesSearch = 
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.province.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterRating === "ALL") return true;
    return loc.dynamicRating === filterRating;
  });

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Daftar Wilayah Terdampak: <span className="text-amber-400">{volcanoName}</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-800 text-amber-400 border border-slate-700 font-mono">
              {locations.length} Lokasi
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih kota untuk melihat profil risiko komposit, rute evakuasi ke dataran tinggi (+mdpl), dan rekomendasi 7 pakar
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kota, kabupaten, pulau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      {/* Filter Chips with Single-Word Taxonomy */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterRating("ALL")}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap btn-premium ${
            filterRating === "ALL" ? "bg-amber-500 text-slate-950 shadow" : "bg-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          Semua ({locations.length})
        </button>

        {Object.entries(SINGLE_WORD_RATINGS).map(([key, config]) => {
          const count = locationsWithStatus.filter((l) => l.dynamicRating === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilterRating(key)}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap btn-premium ${
                filterRating === key
                  ? "bg-slate-950 text-white border-2 shadow"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
              style={{
                borderColor: filterRating === key ? config.borderColor : "transparent",
                color: filterRating === key ? config.color : undefined
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
              <span>{key} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Locations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 max-h-[500px] overflow-y-auto pr-1">
        {filteredLocations.map((loc) => {
          const dynamicStatus = loc.dynamicStatus;
          const isSelected = selectedLocation?.id === loc.id;
          const ratingKey = loc.dynamicRating || "WASPADA";
          const ratingConfig = SINGLE_WORD_RATINGS[ratingKey] || SINGLE_WORD_RATINGS.WASPADA;

          return (
            <div
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? "bg-slate-800/90 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400"
                  : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
              }`}
            >
              <div>
                {/* Location Title & Single Word Rating Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-white text-sm group-hover:text-amber-400 transition flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{loc.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {loc.province} • Jarak {loc.distanceKm} km ({loc.bearing})
                    </p>
                  </div>

                  {/* Single-Word Verdict Tag */}
                  <div className="flex flex-col items-end">
                    <span 
                      style={{ 
                        backgroundColor: ratingConfig.bgColor, 
                        color: ratingConfig.borderColor, 
                        borderColor: ratingConfig.borderColor 
                      }}
                      className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shadow-sm"
                    >
                      {ratingKey}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 font-mono mt-0.5">
                      Skor {loc.riskScore || 50}/100
                    </span>
                  </div>
                </div>

                {/* Threat Indicators Row */}
                <div className="grid grid-cols-2 gap-1.5 mt-3 text-[11px]">
                  <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">ETA Tsunami:</span>
                    <b className="text-cyan-400 font-mono">
                      {loc.baseTsunamiMinutes > 0 && loc.baseTsunamiMinutes < 900 
                        ? `${loc.baseTsunamiMinutes}m` 
                        : "Aman"}
                    </b>
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Abu ({windDirection}):</span>
                    <b className="text-purple-400 font-mono">
                      {dynamicStatus.dynamicAshCm} cm {dynamicStatus.isDirectDownwind ? '⚠️' : ''}
                    </b>
                  </div>

                  {/* Richter scale & building damage indicator */}
                  <div className="p-1.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-center justify-between col-span-2 text-[10.5px]">
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Gempa (M {dynamicStatus.localFeltRichter}):</span>
                    </span>
                    <b className="text-amber-400 truncate max-w-[170px]" title={dynamicStatus.earthquakeHazards.structuralDamage}>
                      {dynamicStatus.earthquakeHazards.structuralDamage}
                    </b>
                  </div>
                </div>

                {/* Safe Highland Badge */}
                {loc.escapeRoute && loc.escapeRoute.safeHavenName && (
                  <div className="mt-2.5 p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[10px] flex items-center justify-between text-emerald-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mountain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{loc.escapeRoute.safeHavenName}</span>
                    </div>
                    <span className="font-extrabold text-emerald-400 shrink-0 ml-1">
                      +{loc.escapeRoute.safeElevationM}m
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic Status Ticker */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span 
                  className="font-semibold truncate max-w-[190px]"
                  style={{ color: dynamicStatus.threatColor }}
                >
                  ● {dynamicStatus.currentThreat}
                </span>

                <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                  <span>Detail</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
