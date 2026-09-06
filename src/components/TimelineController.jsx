import React from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Flame, 
  Clock, 
  Sparkles,
  Waves,
  Layers,
  Thermometer,
  Zap
} from "lucide-react";
import { VEI_PRESETS } from "../utils/physicsEngine";
import { getVolcanoPresets } from "../data/historicalVolcanoes";
import { MAGMA_TYPES } from "../utils/volcanoFlowEngine";

export default function TimelineController({
  activeVolcano,
  vei,
  setVei,
  timeMinutes,
  setTimeMinutes,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  isAudioMuted,
  onToggleAudio,
  onTriggerBlast,
  magmaType = "andesite",
  setMagmaType
}) {
  const currentConfig = VEI_PRESETS[vei] || VEI_PRESETS[6];
  const presets = getVolcanoPresets(activeVolcano);
  const activeMagma = MAGMA_TYPES[magmaType] || MAGMA_TYPES.andesite;

  // Format minutes into "T+ X jam Y menit"
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `T+${mins} Menit`;
    if (mins === 0) return `T+${hrs} Jam`;
    return `T+${hrs} Jam ${mins} Menit`;
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeMinutes(0);
  };

  const applyPreset = (presetVei, defaultTime = 45) => {
    setVei(presetVei);
    setTimeMinutes(defaultTime);
    onTriggerBlast(presetVei);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Top Row: Historical Presets & Audio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Preset Skenario {activeVolcano?.name ? `${activeVolcano.name}:` : "Sejarah:"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset, idx) => {
            const isActive = vei === preset.vei;
            const isPrimary = idx === 0;

            let activeStyle = "bg-amber-500 text-slate-950 shadow-lg border-amber-300";
            if (preset.vei >= 8) {
              activeStyle = "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border-purple-400";
            } else if (preset.vei === 7) {
              activeStyle = "bg-rose-600 text-white shadow-lg shadow-rose-600/30 border-rose-400";
            } else if (preset.vei === 6) {
              activeStyle = "bg-red-600 text-white shadow-lg shadow-red-600/30 border-red-400";
            }

            return (
              <button
                key={idx}
                onClick={() => applyPreset(preset.vei, preset.defaultTime || 45)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border btn-premium ${
                  isActive
                    ? activeStyle
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
                title={preset.desc || preset.label}
              >
                {isPrimary && <Flame className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                <span>{preset.label}</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          {/* Sound Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              !isAudioMuted
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
            }`}
            title={isAudioMuted ? "Aktifkan Efek Suara Vulkanik" : "Bisukan Efek Suara"}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="hidden md:inline">{!isAudioMuted ? "Suara Aktif" : "Mute"}</span>
          </button>
        </div>
      </div>

      {/* Main Controls Grid: VEI Slider & Time Scrubber */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: VEI Strength Slider */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Kekuatan Letusan (Volcanic Explosivity Index)
              </label>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-amber-400">VEI {vei}</span>
              <span className="text-[11px] text-slate-400 ml-1.5">({currentConfig.megatons} Megaton TNT)</span>
            </div>
          </div>

          <input
            type="range"
            min="4"
            max="7"
            step="1"
            value={vei}
            onChange={(e) => {
              const newVei = parseInt(e.target.value, 10);
              setVei(newVei);
              onTriggerBlast(newVei);
            }}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />

          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span className={vei === 4 ? "text-amber-400 font-bold" : ""}>VEI 4 (10 MT)</span>
            <span className={vei === 5 ? "text-amber-400 font-bold" : ""}>VEI 5 (50 MT)</span>
            <span className={vei === 6 ? "text-red-400 font-bold" : ""}>VEI 6 (200 MT - 1883)</span>
            <span className={vei === 7 ? "text-purple-400 font-bold" : ""}>VEI 7 (1000 MT)</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
            <strong className="text-slate-200">{currentConfig.label}:</strong> {currentConfig.description}
          </p>
        </div>

        {/* Right Column: Timeline Scrubber T+0 to T+24h */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Timeline Waktu Perambatan Dampak
              </label>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-cyan-400 tracking-tight">
                {formatTime(timeMinutes)}
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="720" // 0 to 12 hours (720 min)
            step="1"
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />

          {/* Time playback controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  isPlaying
                    ? "bg-amber-500 text-slate-950"
                    : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "Jeda" : "Mulai Simulasi"}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                title="Reset ke Waktu T+0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed Multipliers */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {[1, 5, 15, 30].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 text-[10px] rounded font-bold transition ${
                    playbackSpeed === spd
                      ? "bg-cyan-500 text-slate-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-semibold text-slate-500 pt-0.5">
            <span>T+0 (Ledakan)</span>
            <span>T+1 Jam</span>
            <span>T+3 Jam</span>
            <span>T+6 Jam</span>
            <span>T+12 Jam</span>
          </div>
        </div>
      </div>

      {/* Magma Rheology & Lava/Lahar Flow Controller */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/90 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Komposisi Magma & Dinamika Aliran Lava
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  {activeMagma.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Memperhitungkan viskositas fluida, suhu erupsi, dan kemiringan kontur lembah terendah.
              </p>
            </div>
          </div>

          {/* 3 Magma Type Selection Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {Object.values(MAGMA_TYPES).map((m) => {
              const isSelected = magmaType === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMagmaType?.(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-orange-500/20 border-amber-300 ring-1 ring-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                  }`}
                  title={m.shortDesc}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                    style={{ backgroundColor: m.colorHead }}
                  />
                  <span>{m.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Physics Specs Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Viskositas</span>
              <span className="text-xs font-black text-amber-300 font-mono">{activeMagma.viscosityLabel}</span>
            </div>
            <Waves className="w-4 h-4 text-amber-400 shrink-0 opacity-75" />
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Suhu Erupsi</span>
              <span className="text-xs font-black text-red-400 font-mono">{activeMagma.tempC}°C</span>
            </div>
            <Thermometer className="w-4 h-4 text-red-400 shrink-0 opacity-75" />
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Silika (SiO₂)</span>
              <span className="text-xs font-black text-cyan-300 font-mono">{activeMagma.sio2}</span>
            </div>
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 opacity-75" />
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Laju Lereng Terjal</span>
              <span className="text-xs font-black text-emerald-300 font-mono">~{activeMagma.steepSpeedKmH} km/jam</span>
            </div>
            <Flame className="w-4 h-4 text-emerald-400 shrink-0 opacity-75" />
          </div>
        </div>

        {/* Dynamic Behavior Note */}
        <div className="text-[11px] text-slate-300 flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 animate-ping" />
          <span>
            <strong className="text-orange-300">Karakteristik Aliran:</strong> {activeMagma.hazardDetail}
          </span>
        </div>
      </div>
    </div>
  );
}
