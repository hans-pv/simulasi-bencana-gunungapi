import React, { useState } from "react";
import { EXPERT_CATEGORIES } from "../data/expertInsights";
import { 
  Flame, 
  Activity, 
  Layers, 
  Zap, 
  CloudRain, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  BookOpen,
  MapPin,
  Sparkles
} from "lucide-react";

export default function ExpertAdvisoryPanel({ vei, timeMinutes, selectedLocation }) {
  const [selectedExpertId, setSelectedExpertId] = useState("geology");

  const currentExpert = EXPERT_CATEGORIES.find((e) => e.id === selectedExpertId) || EXPERT_CATEGORIES[0];

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Flame": return <Flame className="w-4 h-4" />;
      case "Layers": return <Layers className="w-4 h-4" />;
      case "Activity": return <Activity className="w-4 h-4" />;
      case "Zap": return <Zap className="w-4 h-4" />;
      case "CloudRain": return <CloudRain className="w-4 h-4" />;
      case "AlertTriangle": return <AlertTriangle className="w-4 h-4" />;
      case "ShieldAlert": return <ShieldAlert className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <BookOpen className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Pusat Komando 7 Pilar Ahli Lintas Disiplin
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                7 Pakar Senior
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Konsorsium telaah ilmiah dari sudut pandang Geologi, Geodesi, Seismik, Kimia, Iklim, Evakuasi, dan Survival
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedLocation && (
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Fokus Kota: {selectedLocation.name}</span>
            </span>
          )}
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            VEI {vei} • T+{timeMinutes}m
          </span>
        </div>
      </div>

      {/* 7 Expert Category Navigation - Compact & Ergonomic Pill Grid (Lebih Nyaman Dilihat) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-xs">
        {EXPERT_CATEGORIES.map((cat, idx) => {
          const isSelected = cat.id === selectedExpertId;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedExpertId(cat.id)}
              className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-2 btn-premium relative text-left group ${
                isSelected
                  ? "bg-slate-900 text-white border-2 shadow-sm"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
              }`}
              style={{
                borderColor: isSelected ? cat.color : undefined,
                boxShadow: isSelected ? `0 0 10px ${cat.color}25` : undefined,
                backgroundColor: isSelected ? `${cat.color}12` : undefined,
              }}
              title={`${cat.name} — ${cat.roleTag}`}
            >
              <div 
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{ 
                  backgroundColor: `${cat.color}20`,
                  color: cat.color 
                }}
              >
                {getIcon(cat.icon)}
              </div>
              <div className="flex flex-col min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono font-bold opacity-75 shrink-0" style={{ color: cat.color }}>
                    0{idx + 1}
                  </span>
                  <span className={`text-[11px] font-extrabold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                    {cat.shortTitle || cat.name.replace("Ahli ", "")}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-medium truncate">
                  {cat.roleTag || cat.badge.split(" & ")[0]}
                </span>
              </div>
              {isSelected && (
                <span 
                  className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" 
                  style={{ backgroundColor: cat.color }} 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Expert Intel Card */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
        {/* Discipline Title & Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <span 
              style={{ color: currentExpert.color, backgroundColor: `${currentExpert.color}15`, borderColor: `${currentExpert.color}40` }}
              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
            >
              {currentExpert.badge}
            </span>
            <h4 className="text-base font-extrabold text-white mt-1.5">
              {currentExpert.title}
            </h4>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {currentExpert.summary}
        </p>

        {/* Selected City Contextual Briefing Box */}
        {selectedLocation && selectedLocation.expertAnalysis && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Analisis Khusus untuk {selectedLocation.name}:</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              {selectedLocation.expertAnalysis[currentExpert.id] || 
               `Daerah ${selectedLocation.name} (jarak ${selectedLocation.distanceKm} km) terpapar dampak sesuai profil risiko ${selectedLocation.singleWordRating}. Ikuti arahan rute evakuasi ke ${selectedLocation.escapeRoute?.safeHavenName || 'dataran tinggi'}.`}
            </p>
          </div>
        )}

        {/* Key Knowledge Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {currentExpert.keyPoints.map((point, idx) => (
            <div 
              key={idx} 
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5"
            >
              <h5 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentExpert.color }}></span>
                <span>{point.heading}</span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Actionable Recommendations Checklist */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
          <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Rekomendasi & Arahan Tanggap Darurat:</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {currentExpert.recommendations.map((rec, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-slate-300 text-[11px] leading-relaxed flex items-start gap-2"
              >
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
