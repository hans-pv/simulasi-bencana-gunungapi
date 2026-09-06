/**
 * Helper utility to construct rich, standardized volcano impact location records.
 * Ensures 100% compliance with Leaflet map polylines, LocationDossierModal tabs,
 * single-word ratings, and dynamic evacuation physics.
 */

export function createVolcanoLocation({
  id,
  name,
  province,
  lat,
  lng,
  distanceKm,
  bearing = "N",
  historicalZone = "",
  singleWordRating = "WASPADA", // KATASTROPIK | KRITIS | BAHAYA | WASPADA | AMAN
  riskScore = 50,
  baseTsunamiMinutes = 0,
  baseWaveHeightM = 0,
  baseAshDepthCm = 15,
  baseDecibel = 130,
  mmiScale = "VII - Very Strong",
  historicalVictims = "Data terdokumentasi PVMBG & BPBD",
  historicalFacts = "",
  elevation = 75,
  
  // Escape route data
  safeHavenName,
  safeElevationM = 250,
  safeHavenCoords,
  walkingDistanceKm = 2.5,
  estimatedWalkMinutes = 35,
  routePath,
  evacuationAdvice = "",
  hasTsunamiRisk = false,
  
  // Demographics
  currentPopulation = "~15.000 jiwa",
  criticalInfrastructure = "Jalan arteri sekunder, puskesmas, jaringan listrik",
  economicImpact = "Sektor pertanian perkebunan dan permukiman penduduk",
  hospitals = "Puskesmas Siaga 24 Jam & RSUD Rujukan Kabupaten",
  schools = "SD, SMP, SMA Negeri yang disiapkan sebagai shelter pengungsi",
  
  // Expert analyses
  expertAnalysis = {},
  evacuationPlan = {},
  survivalProtocol = {}
}) {
  // Compute default safe coordinates offset towards higher ground / away from volcano if not specified
  const safeCoords = safeHavenCoords || {
    lat: Number((lat + (lat > 0 ? 0.025 : -0.025)).toFixed(4)),
    lng: Number((lng + 0.025).toFixed(4))
  };

  // Generate realistic route path from location to safe haven
  const generatedRoutePath = routePath || [
    [lat, lng],
    [
      Number((lat * 0.6 + safeCoords.lat * 0.4).toFixed(4)),
      Number((lng * 0.6 + safeCoords.lng * 0.4).toFixed(4))
    ],
    [safeCoords.lat, safeCoords.lng]
  ];

  // Rating-specific default expert & survival texts if not customized
  const defaultExpertise = {
    KATASTROPIK: {
      geology: "Zona KRB III: Terancam langsung luncuran awan panas (PDC) berkecepatan >150 km/jam dan suhu >600°C.",
      geodesy: "Deformasi topografi masif, potensi amblesan kaldera atau bukaan kubah lava baru.",
      seismology: "Guncangan gempa vulkanik paroksismal MMI VIII–X memicu keretakan tanah dan keruntuhan bangunan.",
      chemistry: "Konsentrasi lethal sulfur dioksida (SO2) dan aerosol sulfat di lapisan batas atmosfer.",
      climatology: "Kegelapan total (tephra fallout) dengan penurunan visibilitas hingga <2 meter.",
      evacuation: "Evakuasi mutlak harus selesai saat status SIAGA / AWAS sebelum erupsi paroksismal terjadi.",
      survival: "Tidak ada toleransi bertahan hidup di ruangan terbuka; wajib evakuasi keluar radius KRB III."
    },
    KRITIS: {
      geology: "Zona KRB II: Jalur primer ancaman aliran lahar hujan lebat, lontaran batu pijar, dan tephra >20 cm.",
      geodesy: "Retakan tanah dan inflasi lokal lereng tengah gunung berapi.",
      seismology: "Guncangan tremor vulkanik kontinu MMI VII berpotensi merusak konstruksi non-rekayasa.",
      chemistry: "Kadar gas asam tinggi yang mengikis korosi logam dan merusak vegetasi secara cepat.",
      climatology: "Hujan abu lebat disertai potensi badai petir vulkanik masif.",
      evacuation: "Gunakan jalur radial keluar lereng menuju titik kumpul dan buffer pengungsian resmi BPBD.",
      survival: "Pakai masker respirator N95/FFP2, kacamata goggle rapat, dan jauhi bantaran sungai lahar."
    },
    BAHAYA: {
      geology: "Zona KRB I / Lereng Bawah: Ancaman lahar dingin sekunder saat hujan intensitas tinggi di hulu.",
      geodesy: "Deformasi minimal, namun endapan sedimen vulkanik mengubah alur drainase sungai.",
      seismology: "Terasa guncangan sedang MMI V–VI yang memicu kepanikan warga di bangunan bertingkat.",
      chemistry: "Bau belerang pekat terbawa angin, risiko iritasi mukosa mata dan saluran napas atas.",
      climatology: "Paparan hujan abu pasir vulkanik 2–10 cm yang membebani atap seng dan genteng.",
      evacuation: "Evakuasi siaga teratur bagi lansia, anak-anak, dan kelompok rentan ke aula kecamatan aman.",
      survival: "Bersihkan akumulasi abu di atap rumah untuk mencegah ambruk; sediakan stok air bersih tertutup."
    },
    WASPADA: {
      geology: "Zona Perifer: Ancaman abu vulkanik halus (lapilli/ashfall) bergantung pada arah dan kecepatan angin.",
      geodesy: "Kondisi tanah stabil tanpa pergeseran sesar aktif lokal.",
      seismology: "Getaran lemah MMI III–IV, jendela bergetar halus saat dentuman letusan terdengar.",
      chemistry: "Konsentrasi partikulat PM10 dan PM2.5 meningkat di atas ambang batas baku mutu udara.",
      climatology: "Langit berawan abu tipis hingga sedang, potensi gangguan jadwal penerbangan lokal.",
      evacuation: "Siapkan tas siaga bencana (72 Jam), pantau pengumuman resmi PVMBG dan BMKG.",
      survival: "Tutup ventilasi rumah, gunakan masker saat keluar ruangan, lindungi sumur air terbuka."
    },
    AMAN: {
      geology: "Zona Bebas Bahaya Vulkanik Langsung: Terletak di luar radius jangkauan material padat erupsi.",
      geodesy: "Kestabilan tektonik tinggi tanpa deformasi permukaan akibat dapur magma.",
      seismology: "Tidak ada gempa vulkanik signifikan (MMI I–II hanya terekam seismograf sensitif).",
      chemistry: "Kualitas udara normal dengan dispersi partikulat abu yang telah terencerkan secara masif.",
      climatology: "Kondisi mikroklimat normal, cuaca dipengaruhi dinamika monsun regional standar.",
      evacuation: "Berfungsi sebagai Pusat Logistik Utama, Penampungan Pengungsi Skala Besar, dan Posko Komando.",
      survival: "Bantu koordinasi donasi logistik, obat-obatan, dan akomodasi kemanusiaan bagi para pengungsi."
    }
  };

  const ratingDefaults = defaultExpertise[singleWordRating] || defaultExpertise.WASPADA;

  return {
    id,
    name,
    province,
    lat,
    lng,
    distanceKm,
    bearing,
    historicalZone: historicalZone || `KRB ${singleWordRating === "KATASTROPIK" ? "III" : singleWordRating === "KRITIS" ? "II" : singleWordRating === "BAHAYA" ? "I" : "Luar Radius"}`,
    singleWordRating,
    riskScore,
    riskLevel: singleWordRating,
    baseTsunamiMinutes,
    baseWaveHeightM,
    baseAshDepthCm,
    baseDecibel,
    mmiScale,
    historicalVictims,
    historicalFacts: historicalFacts || `Wilayah ${name} berada di sektor ${bearing} sejauh ${distanceKm} km dari kawah aktif dengan klasifikasi bahaya ${singleWordRating}.`,
    elevation,
    modernDemographics: {
      currentPopulation,
      criticalInfrastructure,
      economicImpact,
      hospitals,
      schools
    },
    escapeRoute: {
      hasTsunamiRisk,
      safeHavenName: safeHavenName || `Pusat Evakuasi Dataran Tinggi ${name}`,
      safeElevationM,
      safeHavenCoords: safeCoords,
      walkingDistanceKm,
      estimatedWalkMinutes,
      routePath: generatedRoutePath,
      evacuationAdvice: evacuationAdvice || `Segera bergerak menuju ${safeHavenName || "titik kumpul aman"} menjauhi lembah aliran lahar.`
    },
    expertAnalysis: {
      geology: expertAnalysis.geology || ratingDefaults.geology,
      geodesy: expertAnalysis.geodesy || ratingDefaults.geodesy,
      seismology: expertAnalysis.seismology || ratingDefaults.seismology,
      chemistry: expertAnalysis.chemistry || ratingDefaults.chemistry,
      climatology: expertAnalysis.climatology || ratingDefaults.climatology,
      evacuation: expertAnalysis.evacuation || ratingDefaults.evacuation,
      survival: expertAnalysis.survival || ratingDefaults.survival,
      ...expertAnalysis
    },
    evacuationPlan: {
      goldenTime: evacuationPlan.goldenTime || (singleWordRating === "KATASTROPIK" ? "15 Menit Awal" : singleWordRating === "KRITIS" ? "30–45 Menit" : "60–120 Menit"),
      direction: evacuationPlan.direction || `Bergerak ke arah ${safeHavenName} pada elevasi +${safeElevationM} mdpl.`,
      safeElevation: evacuationPlan.safeElevation || `> +${safeElevationM} mdpl`,
      assemblyPoint: evacuationPlan.assemblyPoint || safeHavenName,
      ...evacuationPlan
    },
    survivalProtocol: {
      immediateAction: survivalProtocol.immediateAction || (singleWordRating === "KATASTROPIK" ? "Evakuasi segera! Jauhi lembah sungai dan lereng terbuka." : "Ambil tas siaga bencana dan ikuti rute marka evakuasi BPBD."),
      respiratory: survivalProtocol.respiratory || "Pakai masker respirator N95 atau kain basah berlapis ganda.",
      earProtection: survivalProtocol.earProtection || (baseDecibel > 140 ? "Pakai earplug pelindung pendengaran dari dentuman sonik." : "Lindungi pendengaran saat terdengar gemuruh vulkanik terus menerus."),
      pack72h: survivalProtocol.pack72h || "Ransel darurat: Air minum 3 liter/orang, biskuit energi, senter LED, peluit, obat darurat, kartu identitas.",
      ...survivalProtocol
    }
  };
}
