import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Waves, 
  CloudRain, 
  Zap, 
  ShieldAlert, 
  Compass, 
  MapPin, 
  Flame, 
  Activity, 
  AlertTriangle,
  FileText,
  Volume2,
  Navigation,
  Mountain,
  Users,
  CheckCircle2,
  Footprints,
  ShieldCheck,
  Droplets,
  Home
} from "lucide-react";
import { calculateLocationDynamicStatus } from "../utils/physicsEngine";
import { SINGLE_WORD_RATINGS } from "../data/historicalLocations";

export default function LocationDossierModal({ 
  location, 
  vei, 
  timeMinutes, 
  onClose,
  windDirection = "B",
  windSpeedKmH = 35 
}) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, escape, experts, modern
  const [fullscreenElement, setFullscreenElement] = useState(() => 
    typeof document !== "undefined" ? document.fullscreenElement : null
  );

  // Sync fullscreen changes to ensure modal re-portals to active fullscreen element
  useEffect(() => {
    const handleFsChange = () => {
      setFullscreenElement(document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Reset tab to overview whenever a new location is opened
  useEffect(() => {
    if (location) {
      setActiveTab("overview");
    }
  }, [location]);

  // Keyboard shortcut: close with Escape key
  useEffect(() => {
    if (!location) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location, onClose]);

  if (!location) return null;

  const targetContainer = fullscreenElement || (typeof document !== "undefined" ? document.body : null);
  if (!targetContainer) return null;

  const dynamicStatus = calculateLocationDynamicStatus(location, vei, timeMinutes, { windDirection, windSpeedKmH });
  const ratingKey = dynamicStatus?.hazardLevel || location.singleWordRating || "WASPADA";
  const ratingConfig = SINGLE_WORD_RATINGS[ratingKey] || SINGLE_WORD_RATINGS.WASPADA;

  // Kalkulasi Analisis Bahaya Sekunder Spesifik Daerah (Secondary Hazards Assessment)
  const secondaryHazards = (() => {
    const dist = location.distanceKm || 20;
    const elev = location.elevation || 250;
    const ashCm = dynamicStatus?.dynamicAshCm ?? location.baseAshDepthCm ?? 0;

    // 1. Lahar Hujan / Dingin di Lembah Sungai
    let laharRisk = "RENDAH";
    let laharDesc = "Daerah berada di punggungan bukit atau di luar jangkauan alur sungai primer.";
    let laharBadgeColor = "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (dist <= 25 && elev <= 900) {
      laharRisk = "KRITIS (ZONA MERAH LAHAR)";
      laharDesc = `Terletak di radius ${dist} km dengan elevasi ${elev} mdpl. Sangat rawan diterjang banjir lahar dingin berkecepatan 40-70 km/jam saat curah hujan hulu > 50 mm/jam.`;
      laharBadgeColor = "text-red-400 border-red-500/40 bg-red-500/15";
    } else if (dist <= 50 && elev <= 600) {
      laharRisk = "SIAGA (SEDIMENTASI DAS)";
      laharDesc = `Aliran sedimen pasir dan batu lahar berpotensi meluap menimbun jembatan dan mendangkalkan sungai daerah dalam 2–6 jam pasca-hujan.`;
      laharBadgeColor = "text-amber-400 border-amber-500/40 bg-amber-500/15";
    } else if (dist <= 80) {
      laharRisk = "WASPADA (PENDANGKALAN HILIR)";
      laharDesc = `Potensi pendangkalan muara sungai dan luapan lumpur sekunder di bantaran dataran rendah.`;
      laharBadgeColor = "text-blue-400 border-blue-500/40 bg-blue-500/15";
    }

    // 2. Beban Atap Runtuh Abu Basah (Wet Ash Load)
    const wetLoadKgPerM2 = Math.round(ashCm * 18);
    let roofRisk = "AMAN";
    let roofDesc = "Beban abu minimal, atap rumah aman dari keruntuhan struktural.";
    let roofBadgeColor = "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (ashCm >= 15) {
      roofRisk = "BAHAYA KERUNTUHAN EKSTREM";
      roofDesc = `Tebal abu ${ashCm} cm setara beban basah ~${wetLoadKgPerM2} kg/m². Atap seng, asbes, dan genteng kayu berisiko ambruk mendadak jika tersiram hujan. Segera bersihkan dengan tali pengaman!`;
      roofBadgeColor = "text-red-400 border-red-500/40 bg-red-500/15";
    } else if (ashCm >= 5) {
      roofRisk = "SIAGA AMBRUK (BEBAN TINGGI)";
      roofDesc = `Beban abu basah mencapai ~${wetLoadKgPerM2} kg/m². Bersihkan atap sebelum hujan lebat turun. Dilarang menaiki atap seorang diri tanpa pengaman.`;
      roofBadgeColor = "text-amber-400 border-amber-500/40 bg-amber-500/15";
    } else if (ashCm > 0) {
      roofRisk = "WASPADA (LAPISAN ABU KOROSIF)";
      roofDesc = `Lapisan abu ${ashCm} cm memicu korosi seng dan talang air tersumbat lumpur padat.`;
      roofBadgeColor = "text-cyan-400 border-cyan-500/40 bg-cyan-500/10";
    }

    // 3. Pencemaran Air Bersih & Asidifikasi
    let waterRisk = "WASPADA";
    let waterDesc = "Pantau kejernihan air; gunakan penyaring dan tutup wadah penampung.";
    let waterBadgeColor = "text-cyan-400 border-cyan-500/40 bg-cyan-500/10";
    if (dist <= 35 || ashCm >= 8) {
      waterRisk = "KRITIS (KONTAMINASI ASAM & LOGAM BERAT)";
      waterDesc = "Sumber air tanah/sumur tercemar senyawa fluorida (F⁻), asam sulfat (pH < 4.5), dan silika tajam. Dilarang meminum air tanpa uji lab; wajib bergantung pada tangki air bantuan BPBD.";
      waterBadgeColor = "text-red-400 border-red-500/40 bg-red-500/15";
    } else if (dist <= 75 || ashCm >= 2) {
      waterRisk = "SIAGA (KONTAMINASI ABU TERLARUT)";
      waterDesc = "Tandon air dan pipa PDAM rentan tersumbat endapan abu halus berasa asam. Tutup rapat tandon air.";
      waterBadgeColor = "text-amber-400 border-amber-500/40 bg-amber-500/15";
    }

    // 4. Kelumpuhan Jaringan Listrik PLN (Flashover Trafo)
    let powerRisk = "WASPADA";
    let powerDesc = "Gangguan transmisi intermiten jika abu berterbangan tertiup angin.";
    let powerBadgeColor = "text-cyan-400 border-cyan-500/40 bg-cyan-500/10";
    if (ashCm >= 5) {
      powerRisk = "BAHAYA PADAM TOTAL (FLASHOVER TRAFO)";
      powerDesc = "Debu silika lembab bersifat semi-konduktor, memicu loncatan bunga api listrik (flashover) pada isolator gardu trafo PLN. Wajib siapkan genset darurat dan lampu lentera baterai.";
      powerBadgeColor = "text-red-400 border-red-500/40 bg-red-500/15";
    } else if (ashCm >= 1) {
      powerRisk = "SIAGA KORSLETING";
      powerDesc = "Potensi korsleting instalasi luar ruangan saat udara lembab atau embun malam.";
      powerBadgeColor = "text-amber-400 border-amber-500/40 bg-amber-500/15";
    }

    // 5. Blokade Jalan & Lumpur Licin (Road Slip Hazard)
    let roadRisk = "NORMAL";
    let roadDesc = "Kondisi aspal jalan raya masih dalam batas gesekan normal.";
    let roadBadgeColor = "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (ashCm >= 3) {
      roadRisk = "LUMPOH / SUPER LICIN (KOEFISIEN GESEK < 0.2)";
      roadDesc = "Campuran abu tebal dan gerimis menciptakan lumpur licin seperti lapisan oli/es. Pengendara motor dilarang melintas; kecepatan mobil dibatasi maks 20 km/jam.";
      roadBadgeColor = "text-red-400 border-red-500/40 bg-red-500/15";
    } else if (ashCm > 0.5) {
      roadRisk = "WASPADA JALAN LICIN";
      roadDesc = "Abu silika menurunkan daya cengkeram rem hingga 50%. Wajib kurangi kecepatan dan nyalakan lampu kabut.";
      roadBadgeColor = "text-amber-400 border-amber-500/40 bg-amber-500/15";
    }

    return {
      lahar: { risk: laharRisk, desc: laharDesc, badgeColor: laharBadgeColor },
      roof: { risk: roofRisk, desc: roofDesc, badgeColor: roofBadgeColor, wetLoadKgPerM2 },
      water: { risk: waterRisk, desc: waterDesc, badgeColor: waterBadgeColor },
      power: { risk: powerRisk, desc: powerDesc, badgeColor: powerBadgeColor },
      road: { risk: roadRisk, desc: roadDesc, badgeColor: roadBadgeColor }
    };
  })();

  return createPortal(
    <div 
      className="fixed inset-0 z-modal-top flex items-center justify-center p-3 sm:p-5 bg-modal-backdrop-live animate-modal-enter"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 100001,
        pointerEvents: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: 'min(78vh, 560px)', margin: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div 
          className="px-5 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/95 flex items-center justify-between gap-3 shrink-0"
          style={{ padding: '14px 20px' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">{location.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {location.province}
                </span>
                <span 
                  style={{ backgroundColor: ratingConfig.bgColor, color: ratingConfig.borderColor, borderColor: ratingConfig.borderColor }}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-sm flex items-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: ratingConfig.borderColor }}></span>
                  {ratingKey} (VEI {vei})
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                <span>Jarak Radius: <strong className="text-amber-400 font-mono">{location.distanceKm} KM</strong></span>
                <span>•</span>
                <span>Arah Mata Angin: <strong className="text-slate-200">{location.bearing}</strong></span>
                <span>•</span>
                <span>Status KRB Dinamis: <strong className="text-amber-300">{dynamicStatus?.zoneKrb || location.historicalZone}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-[10px] text-slate-400 font-mono">Esc / Klik luar</span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition shadow-sm"
              title="Tutup Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Threat Alert Banner */}
        <div 
          style={{ 
            backgroundColor: `${dynamicStatus.threatColor}15`, 
            borderColor: `${dynamicStatus.threatColor}40`,
            padding: '10px 20px'
          }}
          className="px-5 sm:px-6 py-2.5 border-y flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-semibold shrink-0"
        >
          <div className="flex items-start sm:items-center gap-2.5 min-w-0" style={{ color: dynamicStatus.threatColor }}>
            <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse mt-0.5 sm:mt-0" />
            <div className="text-xs">
              <span>STATUS DINAMIS (T+{timeMinutes}m, VEI {vei}): </span>
              <strong className="underline underline-offset-2">{dynamicStatus.currentThreat}</strong>
              {dynamicStatus.hazardReason && (
                <span className="text-[11px] font-normal text-slate-300 ml-2 inline-block sm:inline">
                  — {dynamicStatus.hazardReason}
                </span>
              )}
            </div>
          </div>
          <div className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 shrink-0 flex items-center gap-2 self-start sm:self-center">
            <span>Tingkat Keparahan:</span>
            <b style={{ color: ratingConfig.color }}>{ratingConfig.label}</b>
          </div>
        </div>

        {/* Tab Navigation Strip - 4 Proportional Buttons with Clean Insets */}
        <div 
          className="shrink-0 px-4 sm:px-6 py-2.5 border-b border-slate-800/80 bg-slate-950/90 overflow-hidden"
          style={{ padding: '10px 20px' }}
        >
          <div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "8px", width: "100%" }}
          >
            <button
              onClick={() => setActiveTab("overview")}
              style={{ minWidth: 0, height: "40px" }}
              className={`px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center select-none w-full min-w-0 text-xs font-bold ${
                activeTab === "overview"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="truncate">Profil & Rekam Dampak</span>
            </button>

            <button
              onClick={() => setActiveTab("escape")}
              style={{ minWidth: 0, height: "40px" }}
              className={`px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center select-none w-full min-w-0 text-xs font-bold ${
                activeTab === "escape"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/10"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Navigation className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="truncate">Rute Evakuasi Dataran Tinggi</span>
            </button>

            <button
              onClick={() => setActiveTab("experts")}
              style={{ minWidth: 0, height: "40px" }}
              className={`px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center select-none w-full min-w-0 text-xs font-bold ${
                activeTab === "experts"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-md shadow-sky-500/10"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-sky-400" />
              <span className="truncate">Analisis 7 Pakar</span>
            </button>

            <button
              onClick={() => setActiveTab("modern")}
              style={{ minWidth: 0, height: "40px" }}
              className={`px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center select-none w-full min-w-0 text-xs font-bold ${
                activeTab === "modern"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-500/10"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Users className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="truncate">Demografi Modern (What-If)</span>
            </button>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" style={{ padding: '20px' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Metric Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Waves className="w-4 h-4 text-cyan-400" />
                    <span>ETA Tsunami</span>
                  </div>
                  <div className="mt-1 text-lg font-black text-cyan-400 font-mono">
                    {location.baseTsunamiMinutes > 0 && location.baseTsunamiMinutes < 900 
                      ? `${location.baseTsunamiMinutes} Menit` 
                      : "Aman Tsunami"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Tinggi: ~{location.baseWaveHeightM}m
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <CloudRain className="w-4 h-4 text-purple-400" />
                    <span>Hujan Abu Tephra</span>
                  </div>
                  <div className="mt-1 text-lg font-black text-purple-400 font-mono">
                    {location.baseAshDepthCm} cm
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Bahaya beban atap & napas
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Intensitas Gempa</span>
                  </div>
                  <div className="mt-1 text-lg font-black text-amber-400 font-mono">
                    {location.mmiScale?.split("-")[0]}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {location.mmiScale?.split("-")[1] || "Guncangan Kuat"}
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Volume2 className="w-4 h-4 text-rose-400" />
                    <span>Tekanan Suara</span>
                  </div>
                  <div className="mt-1 text-lg font-black text-rose-400 font-mono">
                    {location.baseDecibel} dB
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Gegar overpressure
                  </div>
                </div>
              </div>

              {/* Seismik Skala Richter & Estimasi Kehancuran Konstruksi Bangunan */}
              <div className="bg-amber-950/20 border border-amber-500/40 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                  <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span>ANALISIS SEISMIK & DAYA HANCUR GEMPA VULKANIK-TEKTONIK</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 font-mono shadow">
                    M {dynamicStatus.localFeltRichter} FELT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Magnitudo Sumber Letusan:</span>
                    <div className="font-mono font-black text-white text-sm mt-0.5">Mw {dynamicStatus.sourceMagnitudeRichter} (Pusat)</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Energi Seismik Kaldera</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Intensitas Lokal {location.name}:</span>
                    <div className="font-mono font-black text-amber-400 text-sm mt-0.5">{dynamicStatus.localMmi}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Skala Modifikasi Mercalli</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Estimasi PGA Tanah:</span>
                    <div className="font-mono font-black text-amber-300 text-sm mt-0.5">{dynamicStatus.earthquakeHazards.pgaEstimateG}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Percepatan Puncak Batuan Dasar</div>
                  </div>
                </div>

                {/* Building Destruction Progress Bar */}
                <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-bold">Estimasi Indeks Kerusakan Gedung / Bangunan:</span>
                    <span className="font-mono font-black text-amber-400 text-sm">{dynamicStatus.buildingDestructionPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        dynamicStatus.buildingDestructionPct >= 70 ? 'bg-red-500' :
                        dynamicStatus.buildingDestructionPct >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(5, dynamicStatus.buildingDestructionPct)}%` }}
                    />
                  </div>
                  <div className="text-xs text-amber-200 font-semibold pt-0.5">
                    Klasifikasi Lapangan: <strong>{dynamicStatus.earthquakeHazards.structuralDamage}</strong>
                  </div>
                </div>

                {/* Structural Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-rose-300 flex items-center justify-between">
                      <span>🏠 Bangunan Non-Engineered (Rumah Bata/Batako Rakyat):</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {dynamicStatus.earthquakeHazards.nonEngineeredDamage}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-sky-300 flex items-center justify-between">
                      <span>🏢 Bangunan Engineered (Gedung Bertingkat Beton Bertulang):</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {dynamicStatus.earthquakeHazards.engineeredDamage}
                    </p>
                  </div>
                </div>

                {/* Soil & Geotechnical Risks */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-amber-300">⚠️ Risiko Geoteknik & Kegagalan Tanah:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <div>• Likuefaksi (Pesisir/Muara): <strong className="text-white">{dynamicStatus.earthquakeHazards.liquefactionRisk}</strong></div>
                    <div>• Longsor Lereng/Tebing: <strong className="text-white">{dynamicStatus.earthquakeHazards.landslideRisk}</strong></div>
                  </div>
                  <p className="text-slate-400 text-[11px] italic leading-relaxed pt-1 border-t border-slate-800">
                    {dynamicStatus.earthquakeHazards.description}
                  </p>
                </div>
              </div>

              {/* ANALISIS BAHAYA SEKUNDER DAERAH (SECONDARY HAZARDS) */}
              <div className="bg-blue-950/20 border border-blue-500/40 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-500/30 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Waves className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-blue-300 text-sm flex items-center gap-2">
                        <span>ANALISIS BAHAYA SEKUNDER DAERAH ({location.name.toUpperCase()})</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Ancaman mematikan jam s/d pekan pasca-erupsi: lahar hujan, beban atap abu basah, asidifikasi air, & pemadaman listrik.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/25 text-blue-300 border border-blue-400/40 shrink-0 self-start sm:self-center">
                    PASCA-ERUPSI & CUACA
                  </span>
                </div>

                {/* 4 Secondary Hazard Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Card 1: Lahar Dingin di DAS */}
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-blue-300">
                        <Waves className="w-4 h-4 text-blue-400" />
                        <span>Banjir Lahar Hujan (DAS Sungai)</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${secondaryHazards.lahar.badgeColor}`}>
                        {secondaryHazards.lahar.risk}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {secondaryHazards.lahar.desc}
                    </p>
                    <div className="text-[10px] text-blue-400 font-semibold pt-1 border-t border-slate-800/80">
                      💡 Protap: Jauhi bantaran sungai min. 500m saat hulu gunung hujan lebat &gt; 50 mm/jam.
                    </div>
                  </div>

                  {/* Card 2: Beban Atap Abu Basah */}
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-purple-300">
                        <Home className="w-4 h-4 text-purple-400" />
                        <span>Beban Runtuh Atap Abu Basah</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${secondaryHazards.roof.badgeColor}`}>
                        {secondaryHazards.roof.risk}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {secondaryHazards.roof.desc}
                    </p>
                    <div className="text-[10px] text-purple-400 font-semibold pt-1 border-t border-slate-800/80">
                      💡 Protap: Semprotkan sedikit air sebelum menyapu abu; jangan naik atap sendirian tanpa tali pengaman.
                    </div>
                  </div>

                  {/* Card 3: Krisis Air Bersih & Asidifikasi */}
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                        <Droplets className="w-4 h-4 text-cyan-400" />
                        <span>Krisis Air Bersih & Asidifikasi</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${secondaryHazards.water.badgeColor}`}>
                        {secondaryHazards.water.risk}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {secondaryHazards.water.desc}
                    </p>
                    <div className="text-[10px] text-cyan-400 font-semibold pt-1 border-t border-slate-800/80">
                      💡 Protap: Tutup tandon air; racun fluor & asam belerang tidak bisa disaring kain biasa.
                    </div>
                  </div>

                  {/* Card 4: Pemadaman Listrik & Flashover Trafo */}
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>Pemadaman Listrik (Flashover Trafo)</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${secondaryHazards.power.badgeColor}`}>
                        {secondaryHazards.power.risk}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {secondaryHazards.power.desc}
                    </p>
                    <div className="text-[10px] text-amber-400 font-semibold pt-1 border-t border-slate-800/80">
                      💡 Protap: Siapkan lampu senter, radio baterai analog (VHF 142/145 MHz), dan hindari trafo berasap.
                    </div>
                  </div>
                </div>

                {/* Road Slip & Logistics Warning Bar */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>Kondisi Jalan Raya & Mobilitas Evakuasi:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${secondaryHazards.road.badgeColor}`}>
                        {secondaryHazards.road.risk}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {secondaryHazards.road.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Catatan Sejarah */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>Kronologi & Bukti Lapangan Bersejarah</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {location.historicalFacts}
                </p>
                {location.historicalVictims && (
                  <div className="mt-2 text-xs bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl text-red-300 font-semibold">
                    Estimasi Korban Jiwa: {location.historicalVictims}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ESCAPE ROUTE & SAFE HIGHLANDS */}
          {activeTab === "escape" && (
            <div className="space-y-6">
              {location.escapeRoute ? (
                <div className="space-y-4">
                  {/* Safe Haven Highlight Card */}
                  <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Mountain className="w-5 h-5 text-emerald-400" />
                        <span>Titik Dataran Tinggi Aman (Safe Haven)</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Elevasi: +{location.escapeRoute.safeElevationM} mdpl
                      </span>
                    </div>

                    <div className="text-lg font-black text-white">
                      {location.escapeRoute.safeHavenName}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-slate-400">Jarak Tempuh:</span>
                        <div className="font-bold text-white text-sm mt-0.5">
                          {location.escapeRoute.walkingDistanceKm} KM
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-slate-400">Estimasi Jalan Kaki:</span>
                        <div className="font-bold text-emerald-400 text-sm mt-0.5">
                          ~{location.escapeRoute.estimatedWalkMinutes} Menit
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-slate-400">Status Golden Time:</span>
                        <div className="font-bold text-amber-400 text-sm mt-0.5">
                          {location.baseTsunamiMinutes > location.escapeRoute.estimatedWalkMinutes 
                            ? "CUKUP (Evakuasi Segera)" 
                            : "KRITIS (Lari Cepat!)"}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-emerald-400">Instruksi Rute:</strong> {location.escapeRoute.evacuationAdvice}
                    </div>
                  </div>

                  {/* Step-by-Step SOP Evakuasi */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Footprints className="w-4 h-4 text-emerald-400" />
                      <span>SOP Langkah Penyelamatan Mandiri:</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Detik 0–5:</strong> Jangan tunggu sirine atau melihat air laut surut. Begitu terjadi dentuman kolosal atau guncangan gempa, segera keluar dari rumah dan jauhi pantai.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Menit 5–25:</strong> Bergerak tegak lurus menjauhi pantai menuju <strong>{location.escapeRoute.safeHavenName}</strong>. Dilarang evakuasi menggunakan mobil jika terjadi kemacetan total; evakuasi jalan kaki atau sepeda motor.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Larangan Keras:</strong> Jangan pernah mengungsi menyusuri alur sungai atau jembatan pesisir, karena gelombang tsunami menerobos masuk ke daratan melalui muara sungai.</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                  Wilayah ini tidak memerlukan evakuasi tsunami laut (berada di dataran tinggi atau luar jangkauan air).
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ANALISIS 7 PAKAR */}
          {activeTab === "experts" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-red-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>1. Geologi & Vulkanologi</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {location.expertAnalysis?.geology || "Paparan material piroklastik dan dinamika kawah."}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-purple-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>2. Geodesi & Deformasi</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {location.expertAnalysis?.geodesy || "Pengikisan garis pantai dan subsidensi litosfer lokal."}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>3. Seismologi & Infrasonik</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {location.expertAnalysis?.seismology || "Guncangan gempa vulkanik dan gelombang akustik udara."}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>4. Kimia Gas & Toksikologi</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {location.expertAnalysis?.chemistry || "Aerosol sulfat korosif dan partikel abu silika kaca."}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5" />
                    <span>5. Iklim & Meteorologi</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {location.expertAnalysis?.climatology || "Pengaruh arah angin monsun dan kegelapan total."}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>6. Evakuasi & BPBD</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {location.expertAnalysis?.evacuation || "Protokol batas waktu emas penyelamatan nyawa."}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>7. Survival 72 Jam & Tanggap Medis Darurat</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {location.expertAnalysis?.survival || "Siapkan tas siaga bencana 72 jam, pelindung mata goggle, dan masker N95."}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: MODERN DEMOGRAPHICS WHAT-IF */}
          {activeTab === "modern" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Users className="w-5 h-5 text-rose-400" />
                  <span>Proyeksi Kerentanan Demografi Terkini (Sensus Modern):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400">Populasi Berisiko Hari Ini:</span>
                    <div className="font-black text-white text-sm mt-1">
                      {location.modernDemographics?.currentPopulation || "Puluhan ribu jiwa"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400">Estimasi Kerugian Wilayah:</span>
                    <div className="font-black text-amber-400 text-sm mt-1">
                      {location.modernDemographics?.economicImpact || "Lumpuhnya perekonomian lokal"}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    Objek Vital Nasional Terancam:
                  </span>
                  <p className="text-slate-200 font-semibold leading-relaxed">
                    {location.modernDemographics?.criticalInfrastructure || "Jaringan transportasi, fasilitas energi, dan pelabuhan penyeberangan."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    targetContainer
  );
}
