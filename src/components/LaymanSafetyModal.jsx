import React, { useState } from "react";
import { 
  ShieldAlert, 
  X, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Users, 
  Waves, 
  MapPin, 
  Compass, 
  HeartHandshake, 
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import { DISASTER_PRACTICAL_GUIDELINES } from "../data/disasterGuidelinesData";
import { calculateLocationDynamicStatus, getHazardRadiiForVei } from "../utils/physicsEngine";

function getSafeHavenName(loc) {
  if (!loc) return "Pusat Evakuasi Terdekat";
  if (typeof loc.safeHaven === "string" && loc.safeHaven.trim()) {
    return loc.safeHaven;
  }
  if (loc.escapeRoute && typeof loc.escapeRoute === "object") {
    return loc.escapeRoute.safeHavenName || "Shelter Tinggi";
  }
  return "Shelter Tinggi Terdekat";
}

function getEscapeRouteDesc(loc) {
  if (!loc) return "Ikuti instruksi petugas BPBD / SAR ke dataran tinggi";
  if (typeof loc.escapeRoute === "string" && loc.escapeRoute.trim()) {
    return loc.escapeRoute;
  }
  if (loc.escapeRoute && typeof loc.escapeRoute === "object") {
    return loc.escapeRoute.evacuationAdvice || `Jalur evakuasi menuju ${loc.escapeRoute.safeHavenName || "Tempat Aman"} (Jarak ${loc.escapeRoute.walkingDistanceKm || 3} km)`;
  }
  return "Ikuti rambu evakuasi resmi ke titik kumpul aman";
}

function getEscapeTimeMinutes(loc) {
  if (!loc) return 30;
  if (typeof loc.escapeTimeMin === "number") return loc.escapeTimeMin;
  if (loc.escapeRoute && typeof loc.escapeRoute === "object") {
    return loc.escapeRoute.estimatedWalkMinutes || 45;
  }
  return 35;
}

export default function LaymanSafetyModal({
  isOpen,
  onClose,
  activeVolcano,
  onSelectLocation,
  vei = 6,
  timeMinutes = 45,
  windDirection = "B",
  windSpeedKmH = 35
}) {
  const [activeTab, setActiveTab] = useState("check"); // "check" | "dos" | "vulnerable" | "radio" | "secondary"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("during"); // "before" | "during" | "after"

  const hazardRadii = getHazardRadiiForVei(vei);

  if (!isOpen) return null;

  const locations = activeVolcano?.locations || [];

  // Filtered locations for 1-Click Search supporting both object & string escapeRoute formats
  const searchResults = searchQuery.trim()
    ? locations.filter(loc => {
        const q = searchQuery.toLowerCase();
        const nameMatch = loc.name?.toLowerCase().includes(q);
        const safeHavenMatch = getSafeHavenName(loc).toLowerCase().includes(q);
        const routeMatch = getEscapeRouteDesc(loc).toLowerCase().includes(q);
        return nameMatch || safeHavenMatch || routeMatch;
      })
    : locations.slice(0, 8);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "KATASTROPIK":
        return { bg: "bg-red-600/30 text-red-400 border-red-500/50", label: "🔴 ZONA KATASTROPIK (KRB III)" };
      case "KRITIS":
        return { bg: "bg-orange-600/30 text-orange-400 border-orange-500/50", label: "🟠 ZONA KRITIS (KRB II)" };
      case "BAHAYA":
        return { bg: "bg-amber-600/30 text-amber-400 border-amber-500/50", label: "🟡 ZONA BAHAYA (KRB I)" };
      case "WASPADA":
        return { bg: "bg-sky-600/30 text-sky-400 border-sky-500/50", label: "🔵 ZONA WASPADA SEKTORAL" };
      case "AMAN":
        return { bg: "bg-emerald-600/30 text-emerald-400 border-emerald-500/50", label: "🟢 ZONA AMAN / PUSAT SHELTER" };
      default:
        return { bg: "bg-slate-700 text-slate-300 border-slate-600", label: severity };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Modal - Fixed at top */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Panduan Keselamatan Warga & Aksi Cepat Bencana
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Mode Warga
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Wilayah: <strong className="text-emerald-300">{activeVolcano?.name}</strong> • Level Erupsi: <strong className="text-amber-400 font-mono">VEI {vei}</strong> (Radius Awan Panas KRB III: <strong className="text-rose-400">{hazardRadii.pyroclasticRadiusKm} KM</strong>) • Status bahaya zona otomatis menyesuaikan dengan skala letusan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Strip - 5 Horizontal Proportional Buttons, NO Scrolling */}
        <div className="shrink-0 px-3 sm:px-5 py-3 border-b border-slate-800/80 bg-slate-950/90 overflow-hidden">
          <div 
            className="grid grid-cols-5 gap-2 w-full"
            style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "8px", width: "100%" }}
          >
            <button
              onClick={() => setActiveTab("check")}
              style={{ minWidth: 0, height: "42px" }}
              className={`px-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-center select-none w-full min-w-0 ${
                activeTab === "check"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 ring-1 ring-emerald-300"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700"
              }`}
              title="1-Klik Cek Status Rumah & Lokasi Saya"
            >
              <Search className="w-4 h-4 shrink-0 text-current" />
              <span className="text-xs font-bold truncate">Cek Rumah</span>
            </button>

            <button
              onClick={() => setActiveTab("dos")}
              style={{ minWidth: 0, height: "42px" }}
              className={`px-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-center select-none w-full min-w-0 ${
                activeTab === "dos"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 ring-1 ring-emerald-300"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700"
              }`}
              title="Panduan Do's & Don'ts Tindakan Nyata Warga"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-current" />
              <span className="text-xs font-bold truncate">Do's & Don'ts</span>
            </button>

            <button
              onClick={() => setActiveTab("vulnerable")}
              style={{ minWidth: 0, height: "42px" }}
              className={`px-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-center select-none w-full min-w-0 ${
                activeTab === "vulnerable"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 ring-1 ring-emerald-300"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700"
              }`}
              title="Protokol Kelompok Rentan: Lansia, Balita, & Difabel"
            >
              <Users className="w-4 h-4 shrink-0 text-current" />
              <span className="text-xs font-bold truncate">Kelompok Rentan</span>
            </button>

            <button
              onClick={() => setActiveTab("radio")}
              style={{ minWidth: 0, height: "42px" }}
              className={`px-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-center select-none w-full min-w-0 ${
                activeTab === "radio"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 ring-1 ring-emerald-300"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700"
              }`}
              title="Saluran Radio & Sinyal Darurat Saat Blackout"
            >
              <Radio className="w-4 h-4 shrink-0 text-current" />
              <span className="text-xs font-bold truncate">Radio Blackout</span>
            </button>

            <button
              onClick={() => setActiveTab("secondary")}
              style={{ minWidth: 0, height: "42px" }}
              className={`px-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-center select-none w-full min-w-0 ${
                activeTab === "secondary"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 ring-1 ring-emerald-300"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700"
              }`}
              title="Bahaya Sekunder: Banjir Lahar Dingin & Air Bersih"
            >
              <Waves className="w-4 h-4 shrink-0 text-current" />
              <span className="text-xs font-bold truncate">Bahaya Lahar</span>
            </button>
          </div>
        </div>

        {/* Tab Content Area - VERTICAL SCROLL ONLY */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 scrollbar-thin">
          {/* TAB 1: 1-Klik Cek Status Rumah Saya */}
          {activeTab === "check" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Ketik Nama Desa / Kecamatan / Daerah Tempat Tinggal Anda:
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: Cipanas, Pacet, Baturraden, Sembalun, Koto Baru..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Menampilkan hasil dari 25 titik pemetaan resmi PVMBG untuk sekitar kawah {activeVolcano?.name} pada simulasi skala <strong>VEI {vei}</strong>.
                </p>
              </div>

              {/* Search Results Grid */}
              <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "12px" }}
              >
                {searchResults.map((loc) => {
                  const dynamicStatus = calculateLocationDynamicStatus(loc, vei, timeMinutes, {
                    windDirection,
                    windSpeedKmH,
                  });
                  const badge = getSeverityBadge(dynamicStatus.hazardLevel);
                  const isPyroclasticEngulfed = loc.distanceKm <= hazardRadii.pyroclasticRadiusKm;

                  return (
                    <div
                      key={loc.name}
                      onClick={() => {
                        if (onSelectLocation) onSelectLocation(loc);
                        onClose();
                      }}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-black text-sm text-white group-hover:text-emerald-300 transition">
                              {loc.name}
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              Jarak Kawah: <strong className={isPyroclasticEngulfed ? "text-rose-400 font-black" : "text-slate-200"}>{loc.distanceKm} KM</strong> • Elevasi: {loc.elevationM} m
                            </span>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>

                        {/* Dynamic Threat Reason based on current VEI */}
                        <div className="mb-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5 leading-relaxed">
                          <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            dynamicStatus.hazardLevel === "KATASTROPIK" ? "text-red-400" :
                            dynamicStatus.hazardLevel === "KRITIS" ? "text-orange-400" :
                            dynamicStatus.hazardLevel === "BAHAYA" ? "text-amber-400" :
                            dynamicStatus.hazardLevel === "WASPADA" ? "text-cyan-400" : "text-emerald-400"
                          }`} />
                          <span>
                            <strong>Status VEI {vei}:</strong> {dynamicStatus.hazardReason}
                          </span>
                        </div>

                        <div className="bg-slate-900/80 p-2.5 rounded-lg text-xs space-y-1.5 border border-slate-800/80">
                          <div className="flex items-start gap-1.5 text-slate-300 font-medium">
                            <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">Rute Lari: {getEscapeRouteDesc(loc)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Titik Aman: {getSafeHavenName(loc)} ({getEscapeTimeMinutes(loc)} Mnt)</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-mono">
                          {(loc.lat ?? loc.coordinates?.lat)?.toFixed(3)}, {(loc.lng ?? loc.coordinates?.lng)?.toFixed(3)}
                        </span>
                        <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                          Lihat di Peta & Jalur ➔
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {searchResults.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Tidak ditemukan nama daerah "{searchQuery}" pada katalog {activeVolcano?.name}. Coba ketik nama kecamatan atau desa terdekat.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Do's & Don'ts Tindakan Nyata */}
          {activeTab === "dos" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Phase Selector */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold gap-1">
                <button
                  onClick={() => setSelectedPhase("before")}
                  className={`flex-1 py-2 rounded-lg transition ${
                    selectedPhase === "before"
                      ? "bg-amber-500 text-slate-950 font-black shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  1. Pra-Erupsi (Siaga)
                </button>
                <button
                  onClick={() => setSelectedPhase("during")}
                  className={`flex-1 py-2 rounded-lg transition ${
                    selectedPhase === "during"
                      ? "bg-red-600 text-white font-black shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  2. Saat Erupsi (Darurat)
                </button>
                <button
                  onClick={() => setSelectedPhase("after")}
                  className={`flex-1 py-2 rounded-lg transition ${
                    selectedPhase === "after"
                      ? "bg-emerald-600 text-white font-black shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  3. Pasca-Erupsi (Pemulihan)
                </button>
              </div>

              {/* Content Phase */}
              {(() => {
                const phaseData = DISASTER_PRACTICAL_GUIDELINES.dosAndDonts[selectedPhase];
                return (
                  <div className="space-y-4">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-200">{phaseData.phase}</span>
                      <span className="text-[11px] text-slate-400">Ikuti instruksi demi keselamatan nyawa</span>
                    </div>

                    <div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}
                    >
                      {/* DO's */}
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-sm pb-2 border-b border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>DO (Wajib Dilakukan):</span>
                        </div>
                        <ul className="space-y-2.5 text-xs text-emerald-100/90 leading-relaxed">
                          {phaseData.dos.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* DONT's */}
                      <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                        <div className="flex items-center gap-2 text-rose-400 font-black text-sm pb-2 border-b border-rose-500/20">
                          <XCircle className="w-4 h-4" />
                          <span>DON'T (Dilarang Keras):</span>
                        </div>
                        <ul className="space-y-2.5 text-xs text-rose-100/90 leading-relaxed">
                          {phaseData.donts.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-rose-400 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: Protokol Kelompok Rentan */}
          {activeTab === "vulnerable" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{DISASTER_PRACTICAL_GUIDELINES.vulnerableGroups.title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {DISASTER_PRACTICAL_GUIDELINES.vulnerableGroups.subtitle}
                </p>
              </div>

              <div className="space-y-3">
                {DISASTER_PRACTICAL_GUIDELINES.vulnerableGroups.guidelines.map((group, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800">
                      <h4 className="text-sm font-bold text-emerald-300">{group.group}</h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {group.priority}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                      {group.actions.map((act, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Radio & Komunikasi Saat Blackout */}
          {activeTab === "radio" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>{DISASTER_PRACTICAL_GUIDELINES.blackoutCommunication.title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {DISASTER_PRACTICAL_GUIDELINES.blackoutCommunication.subtitle}
                </p>
              </div>

              {/* Radio Channels Grid */}
              <div 
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}
              >
                {DISASTER_PRACTICAL_GUIDELINES.blackoutCommunication.radios.map((rad, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                      {rad.band}
                    </span>
                    <h4 className="font-bold text-xs text-white">{rad.organization}</h4>
                    <p className="text-sm font-black text-cyan-400 font-mono">{rad.frequencies}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{rad.function}</p>
                  </div>
                ))}
              </div>

              {/* Analog S.O.S Signals */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Sinyal Darurat Manual & Suara (Jika Tidak Ada Radio HT):</span>
                </div>
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs"
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}
                >
                  {DISASTER_PRACTICAL_GUIDELINES.blackoutCommunication.analogSignals.map((sig, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <strong className="text-amber-300 block mb-1">{sig.signal}</strong>
                      <span className="text-slate-400 text-[11px]">{sig.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Bahaya Sekunder Lahar Dingin & Air Bersih */}
          {activeTab === "secondary" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Waves className="w-4 h-4 text-blue-400" />
                  <span>{DISASTER_PRACTICAL_GUIDELINES.secondaryHazards.title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {DISASTER_PRACTICAL_GUIDELINES.secondaryHazards.description}
                </p>
              </div>

              {/* Lahar Dingin Card */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-blue-300">
                    {DISASTER_PRACTICAL_GUIDELINES.secondaryHazards.laharDingin.name}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold">
                    Pemicu: Hujan Hulu &gt; 50 mm/jam
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Karakteristik:</strong> {DISASTER_PRACTICAL_GUIDELINES.secondaryHazards.laharDingin.characteristics}
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-blue-200">
                  <strong className="text-blue-300">Mitigasi Warga:</strong> {DISASTER_PRACTICAL_GUIDELINES.secondaryHazards.laharDingin.mitigation}
                </div>
              </div>

              {/* Water Contamination Card */}
              <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-teal-300">
                    {DISASTER_PRACTICAL_GUIDELINES.secondaryHazards.waterContamination.name}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/40 font-bold">
                    Dampak Air PDAM & Sumur
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Dampak:</strong> {DISASTER_PRACTICAL_GUIDELINES.secondaryHazards.waterContamination.impact}
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-teal-200">
                  <strong className="text-teal-300">Mitigasi Warga:</strong> {DISASTER_PRACTICAL_GUIDELINES.secondaryHazards.waterContamination.mitigation}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Fixed at bottom */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Sumber: Pedoman Kesiapsiagaan BNPB, PVMBG, & Palang Merah Indonesia (PMI)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
