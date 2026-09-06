import React from "react";
import { 
  Globe, 
  Plane, 
  Utensils, 
  ThermometerSnowflake, 
  X, 
  AlertTriangle,
  CloudLightning
} from "lucide-react";
import { DISASTER_PRACTICAL_GUIDELINES } from "../data/disasterGuidelinesData";

export default function GlobalImpactPanel({
  isOpen,
  onClose,
  activeVolcano,
  vei
}) {
  if (!isOpen) return null;

  const { aviation, foodSupplyChain, globalClimate } = DISASTER_PRACTICAL_GUIDELINES.globalImpacts;

  const columnHeightKm = Math.round(activeVolcano?.defaultVei ? (activeVolcano.defaultVei >= 7 ? 45 : activeVolcano.defaultVei === 6 ? 35 : activeVolcano.defaultVei === 5 ? 25 : 15) : 20);
  const metaphorHeight = DISASTER_PRACTICAL_GUIDELINES.realWorldMetaphors.columnHeight(columnHeightKm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/20 shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Matriks Dampak Nasional & Global
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-cyan-300 font-bold border border-cyan-400/30">
                  Global Aviation & Supply Chain
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kajian dampak makro erupsi <strong className="text-cyan-300">{activeVolcano?.name}</strong> (VEI {vei || activeVolcano?.defaultVei}) terhadap penerbangan internasional, logistik pangan, dan iklim bumi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-World Scale Metaphor Bar */}
        <div className="bg-gradient-to-r from-indigo-950/70 via-slate-950/80 to-cyan-950/70 border-b border-indigo-500/30 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <CloudLightning className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Skala Kolom Letusan: {metaphorHeight.metric}</span>
          </div>
          <span className="text-slate-300 text-[11px] bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60 font-medium">
            💡 {metaphorHeight.metaphor}
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          {/* Section 1: Aviation NOTAM & Airspace Closure */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Plane className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white">{aviation.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {aviation.description}
            </p>

            {/* Airports List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {aviation.affectedAirportsSample.map((apt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-cyan-400">{apt.code}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      Potensi NOTAM Merah
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{apt.name}</h4>
                  <p className="text-[10px] text-slate-400">{apt.threat}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Food Supply Chain Disruptions */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white">{foodSupplyChain.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {foodSupplyChain.description}
            </p>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-amber-300 block">Dampak Riil ke Sentra Konsumsi Perkotaan:</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {foodSupplyChain.examples.map((ex, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Global Climate Anomaly (Volcanic Winter & Aerosol SO2) */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ThermometerSnowflake className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white">{globalClimate.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {globalClimate.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {globalClimate.effects.map((eff, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-slate-300 space-y-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mb-1" />
                  <p className="leading-relaxed">{eff}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Referensi: ICAO (International Civil Aviation Organization) & VAAC Darwin/Tokyo</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
