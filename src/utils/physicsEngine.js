/**
 * Krakatau 1883 Physics & Hazard Calculation Engine
 * Memodelkan kalkulasi radius, kecepatan gelombang, sebaran abu, dan metrik dinamis
 */

// Parameter dasar erupsi Krakatau 1883
export const VEI_PRESETS = {
  4: {
    label: "VEI 4 - Fase Awal Mei 1883",
    description: "Erupsi pembuka freatik & sub-plinian skala sedang. Belum terjadi kolaps kaldera masif.",
    megatons: 10,
    columnHeightKm: 20,
    pyroclasticMaxRadiusKm: 15,
    tsunamiBaseSpeedKmH: 90,
    tsunamiMaxRunupMultiplier: 0.25,
    ashMaxRadiusKm: 120,
    shockwaveBaseDb: 150,
  },
  5: {
    label: "VEI 5 - Erupsi Plinian Kuat",
    description: "Kolom letusan abu tinggi, sebagian dinding kawah mulai retak, tsunami lokal menengah.",
    megatons: 50,
    columnHeightKm: 40,
    pyroclasticMaxRadiusKm: 28,
    tsunamiBaseSpeedKmH: 150,
    tsunamiMaxRunupMultiplier: 0.6,
    ashMaxRadiusKm: 260,
    shockwaveBaseDb: 162,
  },
  6: {
    label: "VEI 6 - Paroksismal 27 Agustus 1883 (Historical)",
    description: "Peristiwa sebenarnya: 4 letusan kolosal, kaldera runtuh ke laut, tsunami 42m, dentuman terdengar 4.800 km.",
    megatons: 200,
    columnHeightKm: 80,
    pyroclasticMaxRadiusKm: 45,
    tsunamiBaseSpeedKmH: 220,
    tsunamiMaxRunupMultiplier: 1.0,
    ashMaxRadiusKm: 650,
    shockwaveBaseDb: 172,
  },
  7: {
    label: "VEI 7 - Super-Krakatau (Skenario Ekstrem)",
    description: "Skenario hipotetis letusan kataklismik ultra-kolosal; tsunami melintasi Pulau Jawa & Sumatra, dampak iklim global dasawarsa.",
    megatons: 1000,
    columnHeightKm: 95,
    pyroclasticMaxRadiusKm: 80,
    tsunamiBaseSpeedKmH: 290,
    tsunamiMaxRunupMultiplier: 1.8,
    ashMaxRadiusKm: 1400,
    shockwaveBaseDb: 185,
  }
};

/**
 * Menghitung radius perambatan gelombang tsunami pada waktu T+ (menit)
 * Kecepatan berkurang saat merambat ke perairan dangkal Laut Jawa
 */
export function calculateTsunamiRadius(vei, timeMinutes) {
  const config = VEI_PRESETS[vei] || VEI_PRESETS[6];
  if (timeMinutes <= 0) return 0;

  // Kecepatan dalam km per menit (rata-rata 120 - 250 km/jam di Selat Sunda)
  const speedKmPerMin = config.tsunamiBaseSpeedKmH / 60;
  
  // Perambatan gelombang: cepat di menit awal, melambat di perairan dangkal
  const radius = speedKmPerMin * timeMinutes * Math.pow(0.998, timeMinutes);
  return Math.max(0, radius);
}

/**
 * Menghitung radius sebaran awan abu vulkanik pada waktu T+ (menit)
 */
export function calculateAshRadius(vei, timeMinutes) {
  const config = VEI_PRESETS[vei] || VEI_PRESETS[6];
  if (timeMinutes <= 0) return 0;

  // Pertumbuhan plume vertikal & ekspansi payung abu
  const maxRadius = config.ashMaxRadiusKm;
  // Membumbung dan menyebar selama 6 jam pertama, lalu stabil merambat
  const progress = Math.min(1, timeMinutes / (6 * 60));
  return Math.max(5, maxRadius * Math.pow(progress, 0.75));
}

/**
 * Menghitung radius rambat gelombang kejut atmosferik (kecepatan suara ~1235 km/jam = ~20.5 km/menit)
 */
export function calculateShockwaveRadius(timeMinutes) {
  if (timeMinutes <= 0) return 0;
  const speedOfSoundKmPerMin = 20.58; // ~343 m/s
  return speedOfSoundKmPerMin * timeMinutes;
}

/**
 * Menghitung zona bahaya radius statis maksimum berdasarkan VEI
 */
export function getHazardRadiiForVei(vei) {
  const config = VEI_PRESETS[vei] || VEI_PRESETS[6];
  return {
    pyroclasticRadiusKm: config.pyroclasticMaxRadiusKm,
    tsunamiExtremeRadiusKm: config.pyroclasticMaxRadiusKm * 1.6,
    tsunamiHighRiskRadiusKm: config.pyroclasticMaxRadiusKm * 3.2,
    tsunamiModerateRadiusKm: config.pyroclasticMaxRadiusKm * 6.0,
    ashDenseRadiusKm: config.ashMaxRadiusKm * 0.45,
    ashLightRadiusKm: config.ashMaxRadiusKm,
  };
}

export const WIND_DIRECTIONS = {
  U: { key: "U", name: "Utara", angle: 0, label: "U (0°)", arrow: "↑", headingText: "Menuju Utara (0°)" },
  TL: { key: "TL", name: "Timur Laut", angle: 45, label: "TL (45°)", arrow: "↗", headingText: "Menuju Timur Laut (45°)" },
  T: { key: "T", name: "Timur", angle: 90, label: "T (90°)", arrow: "→", headingText: "Menuju Timur (90°)" },
  TG: { key: "TG", name: "Tenggara", angle: 135, label: "TG (135°)", arrow: "↘", headingText: "Menuju Tenggara (135°)" },
  S: { key: "S", name: "Selatan", angle: 180, label: "S (180°)", arrow: "↓", headingText: "Menuju Selatan (180°)" },
  BD: { key: "BD", name: "Barat Daya", angle: 225, label: "BD (225°)", arrow: "↙", headingText: "Menuju Barat Daya (225°)" },
  B: { key: "B", name: "Barat", angle: 270, label: "B (270°)", arrow: "←", headingText: "Menuju Barat (270°)" },
  BL: { key: "BL", name: "Barat Laut", angle: 315, label: "BL (315°)", arrow: "↖", headingText: "Menuju Barat Laut (315°)" },
};

export const BEARING_TO_ANGLE = {
  "U": 0, "Utara": 0, "N": 0,
  "TL": 45, "Timur Laut": 45, "NE": 45,
  "T": 90, "Timur": 90, "E": 90,
  "TG": 135, "Tenggara": 135, "SE": 135,
  "S": 180, "Selatan": 180,
  "BD": 225, "Barat Daya": 225, "SW": 225,
  "B": 270, "Barat": 270, "W": 270,
  "BL": 315, "Barat Laut": 315, "NW": 315,
};

/**
 * Menghitung kondisi dinamis untuk sebuah lokasi pada nilai VEI, waktu T+, dan arah/kecepatan angin
 */
export function calculateLocationDynamicStatus(location, vei, timeMinutes, windOptions = {}) {
  const config = VEI_PRESETS[vei] || VEI_PRESETS[6];
  const distance = location.distanceKm;

  const windDirKey = windOptions.windDirection || "B"; // default ke Barat (seperti Krakatau 1883)
  const windSpeedKmH = windOptions.windSpeedKmH || 35; // km/jam
  const windAngle = WIND_DIRECTIONS[windDirKey]?.angle ?? 270;

  // 1. Status Tsunami
  const adjustedArrivalMin = Math.round(location.baseTsunamiMinutes * (VEI_PRESETS[6].tsunamiBaseSpeedKmH / config.tsunamiBaseSpeedKmH));
  const hasTsunamiArrived = timeMinutes >= adjustedArrivalMin && location.baseWaveHeightM > 0;
  const currentWaveHeight = Math.max(0, location.baseWaveHeightM * config.tsunamiMaxRunupMultiplier);

  // 2. Status Awan Panas / Piroklastik
  const inPyroclasticZone = distance <= config.pyroclasticMaxRadiusKm;

  // 3. Status Gelombang Kejut
  const shockwaveArrivalTimeMin = Math.round(distance / 20.58);
  const hasShockwaveArrived = timeMinutes >= shockwaveArrivalTimeMin;
  const dynamicDb = Math.max(50, Math.round(config.shockwaveBaseDb - 20 * Math.log10(Math.max(1, distance / 20))));

  // 4. Status Abu Vulkanik Berdasarkan Arah Mata Angin & Kecepatan Angin
  // Ambil sudut bearing lokasi dari gunung
  const locationBearingAngle = BEARING_TO_ANGLE[location.bearing] ?? 270;
  let angleDiff = Math.abs(locationBearingAngle - windAngle);
  if (angleDiff > 180) angleDiff = 360 - angleDiff;

  // Faktor dispersi arah angin:
  // Jika sejajar arah tiup angin (angleDiff <= 45°), plume memanjang jauh ke arah tersebut
  const isDirectDownwind = angleDiff <= 45;
  const isCrosswind = angleDiff > 45 && angleDiff <= 90;
  let windDispersionFactor = 1.0;

  if (isDirectDownwind) {
    // Memanjang ke arah angin seiring kecepatan angin
    windDispersionFactor = 1.1 + (windSpeedKmH / 50) * 0.7; // 1.1x s/d 2.2x
  } else if (isCrosswind) {
    windDispersionFactor = 0.65;
  } else {
    // Upwind (melawan arah angin): abu hanya terdorong oleh gaya ledakan awal payung payung asap
    windDispersionFactor = Math.max(0.2, 0.45 - (windSpeedKmH / 100) * 0.2);
  }

  const baseAshRadius = calculateAshRadius(vei, timeMinutes);
  const directionalAshRadius = baseAshRadius * windDispersionFactor;
  const isCoveredByAsh = distance <= directionalAshRadius;

  // Ketebalan abu (cm): Lebih pekat drastis di koridor downwind
  const distanceFactor = Math.max(0.01, Math.exp(-distance / (70 * windDispersionFactor)));
  const veiMultiplier = (config.megatons / 200);
  const downwindMultiplier = isDirectDownwind ? 1.8 : (isCrosswind ? 0.8 : 0.2);
  
  const dynamicAshCm = isCoveredByAsh 
    ? Math.round(Math.max(0.2, location.baseAshDepthCm * distanceFactor * veiMultiplier * downwindMultiplier * (timeMinutes / 180)) * 10) / 10 
    : 0;

  // 5. Kalkulasi Gempa Skala Richter & Kerusakan Konstruksi Bangunan
  let sourceMagnitudeRichter = 5.2;
  if (vei === 5) sourceMagnitudeRichter = 6.2;
  else if (vei === 6) sourceMagnitudeRichter = 7.2; // Krakatau 1883 ~7.2 Mw
  else if (vei === 7) sourceMagnitudeRichter = 8.2; // Tambora 1815 / Samalas
  else if (vei >= 8) sourceMagnitudeRichter = 9.1; // Toba Supervolcano

  // Atenuasi jarak hiposentral (km)
  const distAttenuation = 1.35 * Math.log10(Math.max(1, distance / 12));
  const localFeltRichter = Math.max(1.5, Math.round((sourceMagnitudeRichter - distAttenuation) * 10) / 10);

  // Klasifikasi Kerusakan Bangunan Struktur (Non-engineered vs Engineered)
  let localMmi = "I - Instrumental";
  let buildingDestructionPct = 0;
  let earthquakeHazards = {
    structuralDamage: "Nihil",
    nonEngineeredDamage: "0% - Tidak Ada Kerusakan",
    engineeredDamage: "0% - Struktur Utuh Sempurna",
    liquefactionRisk: "Nihil",
    landslideRisk: "Nihil",
    pgaEstimateG: "< 0.02g",
    description: "Getaran gempa vulkanik hanya terekam oleh seismometer instrumen BMKG."
  };

  if (localFeltRichter >= 7.5) {
    localMmi = "IX - X (Violent / Disastrous)";
    buildingDestructionPct = 90;
    earthquakeHazards = {
      structuralDamage: "Kehancuran Parah / Roboh Total Masif",
      nonEngineeredDamage: "85%–100% Roboh Total (Runtuh Dinding Pembawa Beban)",
      engineeredDamage: "35%–60% Kerusakan Struktural Berat (Potensi Soft-Story Failure Kolom)",
      liquefactionRisk: "Ekstrem (Semburan pasir & tanah pesisir aluvial amblas seketika)",
      landslideRisk: "Ekstrem (Longsoran lereng masif menutup jalan)",
      pgaEstimateG: "> 0.50g",
      description: "Fondasi bangunan retak patah, dinding bata ambruk serentak, jalan terbelah, jembatan bergeser dari tumpuan."
    };
  } else if (localFeltRichter >= 6.8) {
    localMmi = "VIII (Severe / Destruktif)";
    buildingDestructionPct = 65;
    earthquakeHazards = {
      structuralDamage: "Kerusakan Berat Struktur Bata & Bangunan Tua",
      nonEngineeredDamage: "50%–75% Rusak Berat / Sebagian Runtuh",
      engineeredDamage: "15%–30% Retak Struktural Kolom & Balok Pengikat",
      liquefactionRisk: "Tinggi di zona muara, rawa, dan pesisir reklamasi",
      landslideRisk: "Tinggi pada lereng bukit curam >30°",
      pgaEstimateG: "0.30g – 0.50g",
      description: "Dinding tembok bata tanpa tulangan roboh, genteng berjatuhan masif, cerobong patah, retakan tanah selebar 5-10 cm."
    };
  } else if (localFeltRichter >= 5.8) {
    localMmi = "VII (Very Strong)";
    buildingDestructionPct = 35;
    earthquakeHazards = {
      structuralDamage: "Kerusakan Sedang Bangunan Non-Struktur",
      nonEngineeredDamage: "20%–40% Rusak Sedang (Retak Plester & Dinding Terpisah)",
      engineeredDamage: "5%–10% Kerusakan Partisi Arsitektural / Kaca Pecah",
      liquefactionRisk: "Sedang di sedimen pasir jenuh air",
      landslideRisk: "Sedang pada tebing lapuk",
      pgaEstimateG: "0.15g – 0.30g",
      description: "Seluruh warga berhamburan panik keluar rumah, retak dinding bata tembus plester, kaca jendela pecah berhamburan."
    };
  } else if (localFeltRichter >= 4.8) {
    localMmi = "VI (Strong)";
    buildingDestructionPct = 10;
    earthquakeHazards = {
      structuralDamage: "Kerusakan Ringan / Kosmetik",
      nonEngineeredDamage: "<10% Retak Rambut Plester Tembok",
      engineeredDamage: "Aman Struktural Penuh (0% Rusak)",
      liquefactionRisk: "Rendah",
      landslideRisk: "Rendah",
      pgaEstimateG: "0.05g – 0.15g",
      description: "Getaran dirasakan oleh seluruh penduduk di dalam dan luar ruangan, perabotan bergeser, lukisan dinding berayun keras."
    };
  } else if (localFeltRichter >= 3.8) {
    localMmi = "IV - V (Moderate)";
    buildingDestructionPct = 0;
    earthquakeHazards = {
      structuralDamage: "Nihil (Getaran Nyata Tanpa Kerusakan Fisik)",
      nonEngineeredDamage: "0% Rusak",
      engineeredDamage: "0% Rusak",
      liquefactionRisk: "Nihil",
      landslideRisk: "Nihil",
      pgaEstimateG: "0.02g – 0.05g",
      description: "Terasa nyata di dalam rumah seperti truk bermuatan berat melintas cepat, jendela dan pintu berderik."
    };
  }

  // 6. Penilaian Tingkat Ancaman Saat Ini
  let currentThreat = "AMAN / BELUM TERDAMPAK";
  let threatColor = "#30d158";

  if (inPyroclasticZone) {
    currentThreat = "DESTRUKSI TERMAL TOTAL (AWAN PANAS >500°C)";
    threatColor = "#ff3b30";
  } else if (hasTsunamiArrived && currentWaveHeight >= 15) {
    currentThreat = `TSUNAMI EKSTREM RUN-UP ${currentWaveHeight.toFixed(1)} METER SEDANG MENERJANG`;
    threatColor = "#ff2d55";
  } else if (hasTsunamiArrived && currentWaveHeight > 3) {
    currentThreat = `TSUNAMI TINGGI ${currentWaveHeight.toFixed(1)} METER`;
    threatColor = "#ff9500";
  } else if (hasTsunamiArrived && currentWaveHeight > 0) {
    currentThreat = `ANOMALI GELOMBANG PASANG ${currentWaveHeight.toFixed(1)} METER`;
    threatColor = "#ffd60a";
  } else if (isCoveredByAsh && dynamicAshCm > 10) {
    currentThreat = `HUJAN ABU PEKAT (${dynamicAshCm} cm) KORIDOR ANGIN ${windDirKey}`;
    threatColor = "#af52de";
  } else if (hasShockwaveArrived && dynamicDb >= 150) {
    currentThreat = `GELOMBANG KEJUT SUARA MERUSAK (${dynamicDb} dB)`;
    threatColor = "#ff9500";
  } else if (timeMinutes < adjustedArrivalMin && distance < 120 && location.baseWaveHeightM > 0) {
    const remainingTime = adjustedArrivalMin - timeMinutes;
    currentThreat = `PERINGATAN DINI: TSUNAMI AKAN TIBA DALAM ${remainingTime} MENIT!`;
    threatColor = "#ff453a";
  }

  // 7. Dynamic Hazard Severity Level synchronized with VEI & Distance
  // Menyesuaikan level bahaya secara dinamis sesuai skala energi letusan VEI
  let hazardLevel = "AMAN";
  let zoneKrb = "ZONA AMAN (SHELTER PENGUNGSIAN)";
  let zoneBadge = "🟢 ZONA AMAN / PUSAT SHELTER";
  let hazardReason = "Di luar jangkauan bahaya langsung awan panas & gelombang pasang.";

  const isTsunamiVolcano = location.baseWaveHeightM > 0;
  const pyroRadius = config.pyroclasticMaxRadiusKm;

  if (distance <= pyroRadius || (isTsunamiVolcano && currentWaveHeight >= 15) || dynamicAshCm >= 30) {
    hazardLevel = "KATASTROPIK";
    zoneKrb = "KRB III - Kehancuran Mutlak";
    zoneBadge = "🔴 ZONA KATASTROPIK (KRB III)";
    hazardReason = distance <= pyroRadius 
      ? `Terjangkau awan panas & gelombang piroklastik >500°C (Radius KRB III VEI ${vei}: ${pyroRadius} KM).`
      : `Terlanda dampak kolosal ekstrem (Tsunami ${currentWaveHeight.toFixed(1)}m / Hujan Abu ${dynamicAshCm}cm).`;
  } else if (distance <= pyroRadius * 1.6 || (isTsunamiVolcano && currentWaveHeight >= 4) || (isCoveredByAsh && dynamicAshCm >= 10) || localFeltRichter >= 6.8) {
    hazardLevel = "KRITIS";
    zoneKrb = "KRB II - Zona Kritis Evakuasi Total";
    zoneBadge = "🟠 ZONA KRITIS (KRB II)";
    hazardReason = distance <= pyroRadius * 1.6
      ? `Terpapar lontaran bom vulkanik & hempasan awan panas sekunder (Jarak ${distance} KM dari kawah).`
      : `Ancaman destruktif tinggi akibat tsunami atau hujan abu lebat.`;
  } else if (distance <= pyroRadius * 2.8 || (isTsunamiVolcano && currentWaveHeight >= 1.5) || (isCoveredByAsh && dynamicAshCm >= 2) || localFeltRichter >= 5.5) {
    hazardLevel = "BAHAYA";
    zoneKrb = "KRB I - Zona Bahaya Erupsi & Lahar";
    zoneBadge = "🟡 ZONA BAHAYA (KRB I)";
    hazardReason = `Terancam banjir lahar hujan di lembah sungai, hujan abu lebat, dan getaran seismik merusak.`;
  } else if (distance <= pyroRadius * 4.5 || isCoveredByAsh || localFeltRichter >= 4.0) {
    hazardLevel = "WASPADA";
    zoneKrb = "ZONA WASPADA SEKTORAL";
    zoneBadge = "🔵 ZONA WASPADA SEKTORAL";
    hazardReason = `Paparan hujan abu tipis, bau belerang SO2, dan potensi gangguan logistik regional.`;
  } else {
    hazardLevel = "AMAN";
    zoneKrb = "ZONA AMAN";
    zoneBadge = "🟢 ZONA AMAN / PUSAT SHELTER";
    hazardReason = `Lokasi aman di luar perimeter bahaya langsung skala VEI ${vei}. Cocok untuk shelter pengungsian.`;
  }

  return {
    hazardLevel,
    zoneKrb,
    zoneBadge,
    hazardReason,
    singleWordRating: hazardLevel,
    distanceKm: distance,
    adjustedArrivalMin,
    hasTsunamiArrived,
    currentWaveHeight: parseFloat(currentWaveHeight.toFixed(1)),
    inPyroclasticZone,
    shockwaveArrivalTimeMin,
    hasShockwaveArrived,
    dynamicDb,
    dynamicAshCm,
    isCoveredByAsh,
    isDirectDownwind,
    windDirKey,
    windSpeedKmH,
    directionalAshRadiusKm: Math.round(directionalAshRadius),
    sourceMagnitudeRichter,
    localFeltRichter,
    localMmi,
    buildingDestructionPct,
    earthquakeHazards,
    currentThreat,
    threatColor,
  };
}
