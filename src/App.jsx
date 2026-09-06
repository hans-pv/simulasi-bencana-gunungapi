import React, { useState, useEffect, useRef } from "react";
import ThreeVolcanoScene from "./components/ThreeVolcanoScene";
import KrakatauMap from "./components/KrakatauMap";
import TimelineController from "./components/TimelineController";
import HazardLegend from "./components/HazardLegend";
import AffectedPlacesPanel from "./components/AffectedPlacesPanel";
import ExpertAdvisoryPanel from "./components/ExpertAdvisoryPanel";
import LocationDossierModal from "./components/LocationDossierModal";
import VolcanoSelectorModal from "./components/VolcanoSelectorModal";
import ApiKeyModal from "./components/ApiKeyModal";
import { HISTORICAL_VOLCANOES } from "./data/historicalVolcanoes";
import { getHazardRadiiForVei } from "./utils/physicsEngine";
import { volcanicAudio } from "./utils/audioSynth";
import LaymanSafetyModal from "./components/LaymanSafetyModal";
import GlobalImpactPanel from "./components/GlobalImpactPanel";
import { 
  Flame, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Key, 
  Sun, 
  ChevronDown, 
  Mountain, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Clock,
  Globe,
  HeartHandshake,
  Compass
} from "lucide-react";

export default function App() {
  // Active Volcano State (Default: Krakatau 1883)
  const [activeVolcanoId, setActiveVolcanoId] = useState("krakatau_1883");
  const [isVolcanoSelectorOpen, setIsVolcanoSelectorOpen] = useState(false);
  const [carouselFilter, setCarouselFilter] = useState("all"); // "all" | "future" | "historical"
  
  // Layman User Mode vs Expert Mode
  const [userAudienceMode, setUserAudienceMode] = useState("layman"); // "layman" (Warga) | "expert" (Geofisika)
  const [isLaymanSafetyModalOpen, setIsLaymanSafetyModalOpen] = useState(false);
  const [isGlobalImpactOpen, setIsGlobalImpactOpen] = useState(false);

  const activeVolcano = HISTORICAL_VOLCANOES.find((v) => v.id === activeVolcanoId) || HISTORICAL_VOLCANOES[0];

  // Core Simulation States
  const [vei, setVei] = useState(activeVolcano.defaultVei);
  const [timeMinutes, setTimeMinutes] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(5);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [magmaType, setMagmaType] = useState("andesite"); // "basalt", "andesite", "rhyolite"

  // Simulation Mode: "historical" (Rekonstruksi Fakta Sejarah) vs "whatif" (Proyeksi Modern 2026)
  const [simulationMode, setSimulationMode] = useState("whatif");

  // Global Atmosphere Theme: Mode Siang Saja (Day Theme Only)
  const effectiveTheme = "day";

  // Selected Location for Deep Dive Dossier
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Google Maps API Key State
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(() => {
    return localStorage.getItem("KRAKATAU_GMAPS_KEY") || "";
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Manual Wind Direction & Speed Simulation State
  const [windDirection, setWindDirection] = useState("B"); // 8 directions: U, TL, T, TG, S, BD, B, BL
  const [windSpeedKmH, setWindSpeedKmH] = useState(35); // km/h

  // View Mode: "master" (Split), "3d-focus", "map-focus"
  const [viewMode, setViewMode] = useState("master");

  const hazardRadii = getHazardRadiiForVei(vei);

  const volcanoScrollRef = useRef(null);

  const scrollVolcanoes = (direction) => {
    if (volcanoScrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      volcanoScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Handle Switch Volcano with Universal 3-Way Synchronization
  const handleSelectVolcano = (volcano) => {
    if (!volcano) return;
    setActiveVolcanoId(volcano.id);
    setVei(volcano.defaultVei);
    setTimeMinutes(30);
    setSelectedLocation(null);

    // Keep front page carousel filter in sync with selected volcano type
    if (volcano.isFutureProjection && carouselFilter === "historical") {
      setCarouselFilter("future");
    } else if (!volcano.isFutureProjection && carouselFilter === "future") {
      setCarouselFilter("historical");
    }

    if (!isAudioMuted) {
      volcanicAudio.playBlast(volcano.defaultVei);
    }
  };

  // Handle Carousel Category Filter Switch with Auto-Synchronization
  const handleFilterChange = (filterType) => {
    setCarouselFilter(filterType);
    if (filterType === "future" && !activeVolcano.isFutureProjection) {
      const firstFuture = HISTORICAL_VOLCANOES.find((v) => v.isFutureProjection);
      if (firstFuture) handleSelectVolcano(firstFuture);
    } else if (filterType === "historical" && activeVolcano.isFutureProjection) {
      const firstHist = HISTORICAL_VOLCANOES.find((v) => !v.isFutureProjection);
      if (firstHist) handleSelectVolcano(firstHist);
    }
  };

  // Auto-scroll front page carousel to center the actively selected volcano card
  useEffect(() => {
    if (volcanoScrollRef.current) {
      const activeCard = volcanoScrollRef.current.querySelector(`[data-volcano-id="${activeVolcanoId}"]`);
      if (activeCard) {
        activeCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeVolcanoId, carouselFilter]);

  // Lock Atmosphere Theme to Day Mode
  useEffect(() => {
    document.body.className = "theme-day";
    document.documentElement.className = "theme-day";
  }, []);

  // Simulation Time Progress Loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeMinutes((prev) => {
          const next = prev + playbackSpeed;
          if (next >= 720) {
            setIsPlaying(false);
            return 720;
          }
          return next;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Handle Save Google Maps Key
  const handleSaveApiKey = (key) => {
    setGoogleMapsApiKey(key);
    localStorage.setItem("KRAKATAU_GMAPS_KEY", key);
  };

  // Toggle Audio
  const handleToggleAudio = () => {
    const unmuted = volcanicAudio.toggleMute();
    setIsAudioMuted(!unmuted);
    if (unmuted) {
      volcanicAudio.playBlast(vei);
    }
  };

  // Trigger Blast Sound
  const handleTriggerBlast = (newVei) => {
    if (!isAudioMuted) {
      volcanicAudio.playBlast(newVei);
      volcanicAudio.playTsunamiWhoosh();
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans transition-all bg-slate-950">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo, Volcano Selector & Title */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl text-white shadow-lg shrink-0 transition-all ${
              activeVolcano.isFutureProjection
                ? "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 shadow-violet-500/30 ring-1 ring-cyan-400"
                : "bg-gradient-to-br from-red-600 to-amber-600 shadow-red-600/30"
            }`}>
              {activeVolcano.isFutureProjection ? (
                <Sparkles className="w-6 h-6 text-cyan-200 animate-pulse" />
              ) : (
                <Flame className="w-6 h-6 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Volcano Selector Button opens Full Modal */}
                <button
                  onClick={() => setIsVolcanoSelectorOpen(true)}
                  className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black text-white flex items-center gap-2 shadow-md btn-premium transition border ${
                    activeVolcano.isFutureProjection
                      ? "bg-slate-900/95 border-violet-500 hover:border-cyan-400 shadow-violet-900/30"
                      : "bg-slate-900 border-slate-700 hover:border-amber-400"
                  }`}
                >
                  {activeVolcano.isFutureProjection ? (
                    <Clock className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Mountain className="w-4 h-4 text-red-500" />
                  )}
                  <span>{activeVolcano.name} ({activeVolcano.year})</span>
                  {activeVolcano.isFutureProjection && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-600/40 text-cyan-300 font-mono border border-cyan-400/40">
                      🔮 ~2046
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                  activeVolcano.isFutureProjection
                    ? "bg-violet-600/30 text-cyan-300 border-cyan-400/40"
                    : "bg-red-600/30 text-red-400 border-red-500/40"
                }`}>
                  VEI {vei} • {hazardRadii.pyroclasticRadiusKm} KM KRB
                </span>

                {/* Scenario Switcher Pill */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-bold">
                  <button
                    onClick={() => setSimulationMode("whatif")}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                      simulationMode === "whatif"
                        ? activeVolcano.isFutureProjection
                          ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow"
                          : "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    <span>What-If Modern</span>
                  </button>

                  <button
                    onClick={() => setSimulationMode("historical")}
                    className={`px-2.5 py-1 rounded-md transition ${
                      simulationMode === "historical"
                        ? "bg-slate-800 text-amber-400 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Historis Eksak
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                {activeVolcano.subtitle} • <span className={activeVolcano.isFutureProjection ? "text-cyan-300 font-semibold" : "text-slate-300 font-medium"}>{activeVolcano.province}</span>
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
            {/* Layman vs Expert Mode Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-bold shadow-sm">
              <button
                onClick={() => setUserAudienceMode("layman")}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
                  userAudienceMode === "layman"
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Mode Sederhana Warga: Panduan Evakuasi Cepat & Bahasa Awam"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Mode Warga</span>
              </button>

              <button
                onClick={() => setUserAudienceMode("expert")}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
                  userAudienceMode === "expert"
                    ? "bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Mode Geofisika & Vulkanologi Lengkap"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Mode Ahli</span>
              </button>
            </div>

            {/* Quick Action: Panduan Warga (Do's & Don'ts) */}
            <button
              onClick={() => setIsLaymanSafetyModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Buka Panduan Keselamatan Praktis, Do's & Don'ts, dan Cek Rumah"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Panduan Warga</span>
            </button>

            {/* Quick Action: Dampak Global & Penerbangan */}
            <button
              onClick={() => setIsGlobalImpactOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 hover:text-indigo-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Buka Analisis Dampak Global (Penerbangan NOTAM, Rantai Pangan, Iklim)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Dampak Global</span>
            </button>

            {/* Active Theme Indicator (Mode Siang Saja) */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs font-bold text-amber-500 shadow-sm"
              title="Kondisi Pencahayaan: Siang Tropis Terang (Mode Siang Saja)"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xl:inline">Tema Siang</span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode("master")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition btn-premium ${
                  viewMode === "master" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode("3d-focus")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition btn-premium ${
                  viewMode === "3d-focus" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                3D
              </button>
              <button
                onClick={() => setViewMode("map-focus")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition btn-premium ${
                  viewMode === "map-focus" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Peta
              </button>
            </div>

            {/* Google Maps Key Button */}
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-400/50 transition btn-premium"
              title="Pengaturan Google Maps API Key"
            >
              <Key className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleAudio}
              className={`p-2 rounded-xl border transition btn-premium ${
                !isAudioMuted
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
              title={isAudioMuted ? "Aktifkan Suara Vulkanik" : "Mute Suara"}
            >
              {!isAudioMuted ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Modern What-If Alert Banner (If in What-If mode) */}
      {simulationMode === "whatif" && activeVolcano.modernWhatIf && (
        <div className={`border-b px-4 sm:px-6 py-2.5 transition-all ${
          activeVolcano.isFutureProjection
            ? "bg-gradient-to-r from-violet-950/90 via-slate-950/95 to-cyan-950/90 border-cyan-500/40 shadow-inner"
            : "bg-gradient-to-r from-red-950/70 via-slate-900/90 to-red-950/70 border-red-500/30"
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className={`flex items-center gap-2 font-bold ${
              activeVolcano.isFutureProjection ? "text-cyan-300" : "text-rose-300"
            }`}>
              {activeVolcano.isFutureProjection ? (
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />
              )}
              <span>
                {activeVolcano.isFutureProjection ? "PROYEKSI KATASTROPIK MASA DEPAN (~2046): " : "PROYEKSI WHAT-IF HARI INI: "}
                {activeVolcano.modernWhatIf.totalPopulationAtRisk} Terancam • Estimasi Risiko {activeVolcano.modernWhatIf.economicRiskUSD}
              </span>
            </div>

            <div className={`text-[11px] truncate ${
              activeVolcano.isFutureProjection ? "text-violet-200/90" : "text-slate-400"
            }`}>
              Objek Vital: {activeVolcano.modernWhatIf.criticalAssets?.[0]} • {activeVolcano.isFutureProjection ? "Acuan Ilmiah: PVMBG / USGS / Smithsonian GVP" : "Mitigasi BNPB"}
            </div>
          </div>
        </div>
      )}

      {/* Layman Friendly Quick Helper Strip (Mode Warga) */}
      {userAudienceMode === "layman" && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/95 to-teal-950/60 border-b border-emerald-500/30 px-4 sm:px-6 py-2 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30 shrink-0 flex items-center gap-1">
                <HeartHandshake className="w-3 h-3" />
                <span>MODE WARGA</span>
              </span>
              <span className="text-slate-300 text-[11px]">
                💡 <strong>Skala Nyata:</strong> Radius Bahaya Langsung <strong>{hazardRadii.pyroclasticRadiusKm} KM</strong> • Tinggi Kolom Abu {hazardRadii.pyroclasticRadiusKm * 2} KM setara <strong>2.5× Tinggi Puncak Everest</strong>.
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setIsLaymanSafetyModalOpen(true)}
                className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 transition shadow flex items-center gap-1.5 text-xs"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>📍 Cek Status Rumah Saya</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* ROW 0: Front Page Scrollable Volcano Cards Carousel (Daftar Pilihan Kartu Gunung di Halaman Muka) */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-cyan-500 text-white shadow-md shadow-red-600/20 shrink-0">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black text-white">
                    Katalog Simulasi Gunung Berapi Indonesia
                  </h2>
                  <span className="text-[10px] bg-red-600/25 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    {HISTORICAL_VOLCANOES.length} Skenario
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  15 Erupsi Historis Terdahsyat + 5 Proyeksi Katastropik ~2046 (20 Tahun ke Depan)
                </p>
              </div>
            </div>

            {/* Category Filter Pills & Modal Button */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs font-bold gap-1">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    carouselFilter === "all"
                      ? "bg-slate-700 text-white shadow-sm font-black"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Semua ({HISTORICAL_VOLCANOES.length})
                </button>

                <button
                  onClick={() => handleFilterChange("future")}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    carouselFilter === "future"
                      ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 text-white shadow-md shadow-violet-500/30 ring-1 ring-cyan-300 font-black"
                      : "text-cyan-300 hover:bg-slate-800/80 hover:text-cyan-200"
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                  <span>🔮 Proyeksi ~2046 (5)</span>
                </button>

                <button
                  onClick={() => handleFilterChange("historical")}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    carouselFilter === "historical"
                      ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-600/30 font-black"
                      : "text-amber-400 hover:bg-slate-800/80 hover:text-amber-300"
                  }`}
                >
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span>🌋 Historis (15)</span>
                </button>
              </div>

              {/* Scroll Arrows & Modal Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollVolcanoes("left")}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                  title="Geser Kiri"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollVolcanoes("right")}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                  title="Geser Kanan"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsVolcanoSelectorOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold transition flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Grid (20)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Scrollable Cards Strip */}
          <div 
            ref={volcanoScrollRef}
            className="flex gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth scrollbar-thin overscroll-x-contain"
          >
            {HISTORICAL_VOLCANOES.filter((v) => {
              if (carouselFilter === "future") return v.isFutureProjection;
              if (carouselFilter === "historical") return !v.isFutureProjection;
              return true;
            }).map((volcano) => {
              const isCurrent = volcano.id === activeVolcanoId;
              const isFuture = volcano.isFutureProjection;

              return (
                <div
                  key={volcano.id}
                  data-volcano-id={volcano.id}
                  onClick={() => handleSelectVolcano(volcano)}
                  style={{ width: "290px", minWidth: "290px", flexShrink: 0 }}
                  className={`rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between select-none relative overflow-hidden ${
                    isCurrent
                      ? isFuture
                        ? "bg-gradient-to-b from-slate-950 via-violet-950/50 to-slate-950 border-cyan-400 ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/25"
                        : "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/15 ring-2 ring-amber-400"
                      : isFuture
                      ? "bg-slate-950/80 border-violet-500/40 hover:border-cyan-400/80 hover:bg-slate-900/90 shadow-sm shadow-violet-950/40"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90"
                  }`}
                >
                  <div>
                    {/* Future Projection Tag if applicable */}
                    {isFuture && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-violet-600/30 to-cyan-500/30 text-cyan-300 border border-cyan-400/40 mb-1.5">
                        <Clock className="w-2.5 h-2.5 text-fuchsia-400" />
                        <span>PROYEKSI ~2046 (20 THN)</span>
                      </div>
                    )}

                    {/* Top Row: Title, Year, VEI */}
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <div>
                        <div className="font-black text-sm text-white flex items-center gap-1.5">
                          <span>{volcano.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                            isFuture
                              ? "bg-violet-950/80 text-cyan-300 border-violet-500/50"
                              : "bg-slate-800 text-amber-300 border-slate-700"
                          }`}>
                            {volcano.year}
                          </span>
                        </div>
                        <span className={`text-[10px] ${isFuture ? "text-cyan-400/80" : "text-slate-400"}`}>
                          {volcano.province}
                        </span>
                      </div>

                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        isFuture
                          ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm shadow-cyan-500/30"
                          : volcano.defaultVei >= 7
                          ? "bg-red-600 text-white shadow-sm shadow-red-600/40"
                          : volcano.defaultVei === 6
                          ? "bg-orange-600 text-white"
                          : "bg-amber-600 text-slate-950"
                      }`}>
                        VEI {volcano.defaultVei}
                      </span>
                    </div>

                    {/* Subtitle Snippet */}
                    <p className={`text-[11px] font-medium line-clamp-1 mb-1 ${
                      isFuture ? "text-cyan-200/95" : "text-amber-200/90"
                    }`}>
                      {volcano.subtitle}
                    </p>

                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {volcano.description}
                    </p>
                  </div>

                  {/* Card Bottom: Status & Select */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium text-[10px]">
                      {volcano.locations?.length || 25} Titik Kota
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVolcano(volcano);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1.5 ${
                        isCurrent
                          ? isFuture
                            ? "bg-cyan-400 text-slate-950 font-black shadow-sm"
                            : "bg-amber-400 text-slate-950 font-black shadow-sm"
                          : isFuture
                          ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-sm shadow-violet-600/30"
                          : "bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-500 hover:to-amber-500 shadow-sm"
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                          <span>Sedang Aktif</span>
                        </>
                      ) : (
                        <>
                          <span>{isFuture ? "Simulasi" : "Pilih"}</span>
                          <ChevronRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ROW 1: Visual Stage (Split 3D Three.js & Multi-Style GeoMap) */}
        <div className={`grid gap-4 ${
          viewMode === "master" 
            ? "grid-cols-1 lg:grid-cols-2" 
            : "grid-cols-1"
        }`}>
          {/* 3D Three.js Volcano Stage */}
          {(viewMode === "master" || viewMode === "3d-focus") && (
            <div className={`w-full ${viewMode === "3d-focus" ? "h-[620px]" : "h-[470px]"}`}>
              <ThreeVolcanoScene 
                activeVolcano={activeVolcano}
                vei={vei} 
                timeMinutes={timeMinutes} 
                isPlaying={isPlaying}
                themeMode={effectiveTheme}
              />
            </div>
          )}

          {/* Interactive GeoMap Engine (Google Maps standard styles & Escape Routes) */}
          {(viewMode === "master" || viewMode === "map-focus") && (
            <div className={`w-full ${viewMode === "map-focus" ? "h-[620px]" : "h-[470px]"}`}>
              <KrakatauMap
                activeVolcano={activeVolcano}
                volcanoes={HISTORICAL_VOLCANOES}
                onSelectVolcano={handleSelectVolcano}
                vei={vei}
                timeMinutes={timeMinutes}
                setTimeMinutes={setTimeMinutes}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                selectedLocation={selectedLocation}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
                googleMapsApiKey={googleMapsApiKey}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                themeMode={effectiveTheme}
                windDirection={windDirection}
                setWindDirection={setWindDirection}
                windSpeedKmH={windSpeedKmH}
                setWindSpeedKmH={setWindSpeedKmH}
                magmaType={magmaType}
              />
            </div>
          )}
        </div>

        {/* ROW 2: Hazard Legend Bar */}
        <HazardLegend hazardRadii={hazardRadii} />

        {/* ROW 3: Simulation Parameters & Timeline Control Hub */}
        <TimelineController
          activeVolcano={activeVolcano}
          vei={vei}
          setVei={setVei}
          timeMinutes={timeMinutes}
          setTimeMinutes={setTimeMinutes}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
          isAudioMuted={isAudioMuted}
          onToggleAudio={handleToggleAudio}
          onTriggerBlast={handleTriggerBlast}
          magmaType={magmaType}
          setMagmaType={setMagmaType}
        />

        {/* ROW 4: Affected Places Directory for Active Volcano with Escape Routes */}
        <AffectedPlacesPanel
          locations={activeVolcano.locations}
          volcanoName={`${activeVolcano.name} (${activeVolcano.year})`}
          vei={vei}
          timeMinutes={timeMinutes}
          selectedLocation={selectedLocation}
          onSelectLocation={(loc) => setSelectedLocation(loc)}
          windDirection={windDirection}
          windSpeedKmH={windSpeedKmH}
        />

        {/* ROW 5: Multi-Disciplinary 7-Expert Command Center */}
        <ExpertAdvisoryPanel 
          vei={vei} 
          timeMinutes={timeMinutes}
          selectedLocation={selectedLocation}
        />
      </main>

      {/* Location-Specific Deep Dive Dossier Modal */}
      <LocationDossierModal
        location={selectedLocation}
        vei={vei}
        timeMinutes={timeMinutes}
        onClose={() => setSelectedLocation(null)}
        windDirection={windDirection}
        windSpeedKmH={windSpeedKmH}
      />

      {/* 15 Volcanoes Selector Catalog Modal */}
      <VolcanoSelectorModal
        isOpen={isVolcanoSelectorOpen}
        onClose={() => setIsVolcanoSelectorOpen(false)}
        activeVolcanoId={activeVolcanoId}
        onSelectVolcano={handleSelectVolcano}
      />

      {/* Google Maps API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={googleMapsApiKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* Layman Safety & Rapid Action Modal (Mode Warga) */}
      <LaymanSafetyModal
        isOpen={isLaymanSafetyModalOpen}
        onClose={() => setIsLaymanSafetyModalOpen(false)}
        activeVolcano={activeVolcano}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
        vei={vei}
        timeMinutes={timeMinutes}
        windDirection={windDirection}
        windSpeedKmH={windSpeedKmH}
      />

      {/* Global Impact Matrix Modal (Penerbangan, Rantai Pasok, Iklim) */}
      <GlobalImpactPanel
        isOpen={isGlobalImpactOpen}
        onClose={() => setIsGlobalImpactOpen(false)}
        activeVolcano={activeVolcano}
        vei={vei}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="text-slate-400 font-bold">
          Platform Edukasi & Simulasi Cepat Multi-Bencana Vulkanik Indonesia
        </p>
        <p className="max-w-3xl mx-auto text-[11px] text-slate-600">
          Katalog 15 Erupsi Berdampak Besar: Supervolcano Toba (~74.000 BP), Tambora (1815), Samalas/Rinjani (1257), Krakatau (1883), Kelud (1919), Merapi (2010), Agung (1963), Galunggung (1982), Papandayan (1772), Awu (1856), Semeru (2021), Sinabung (2010), Ruang (1871/2024), Batur (1917), dan Gamalama (1775).
        </p>
        <p className="text-[10px] text-slate-600">
          Integrasi Three.js 3D Physics Engine, Leaflet / Google Maps Geospatial Canvas, dan Konsorsium 7 Pilar Ahli Kebencanaan Nasional.
        </p>
      </footer>
    </div>
  );
}
