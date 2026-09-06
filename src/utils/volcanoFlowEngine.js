/**
 * volcanoFlowEngine.js
 * Mesin Simulasi Geodinamika Aliran Lava & Banjir Lahar Realistis
 * Memperhitungkan kontur ketinggian tekstur permukaan geologi terendah (thalwegs / lembah sungai nyata),
 * sifat reologi 3 tipe magma (Basalt, Andesit, Riolit), dan perambatan timeline dinamis terikat skala VEI.
 */

// 1. Klasifikasi Reologi & Termodinamika 3 Tipe Magma Utama
export const MAGMA_TYPES = {
  basalt: {
    id: "basalt",
    name: "Basaltik (Mafik)",
    label: "Basaltik (Encer & Cepat)",
    shortDesc: "Viskositas sangat rendah, mengalir sangat kencang menembus jarak puluhan kilometer.",
    sio2: "48 - 52% (Mafik)",
    tempC: 1180,
    viscosityPaS: 100, // Sangat encer (~10^2 Pa·s)
    viscosityLabel: "10² Pa·s (Sangat Encer)",
    steepSpeedKmH: 28.0, // Kecepatan di lereng curam kawah (>20°)
    plainSpeedKmH: 3.5,  // Kecepatan saat memasuki dataran landai (<5°)
    maxRunoutKm: 48,     // Jangkauan maksimal
    colorHead: "#ffe600", // Kuning pijar ekstrem
    colorBody: "#ff4d00", // Oranye-merah membara
    colorCrust: "#3a0904", // Kerak pendinginan gelap
    glowStyle: "rgba(255, 230, 0, 0.95)",
    coolingRatePerKm: 6.5, // Penurunan suhu per km aliran (°C/km)
    morphology: "Pāhoehoe & 'A'ā Pijar",
    hazardDetail: "Aliran sangat fluida menenggelamkan lembah sungai dengan cepat, merusak jembatan dan infrastruktur dataran rendah."
  },
  andesite: {
    id: "andesite",
    name: "Andesitik (Menengah)",
    label: "Andesitik (Khas Stratovulkan RI)",
    shortDesc: "Viskositas sedang, membentuk lidah lava tebal dan kubah labil pemicu awan panas & lahar.",
    sio2: "57 - 63% (Menengah)",
    tempC: 950,
    viscosityPaS: 100000, // Viskositas sedang (~10^5 Pa·s)
    viscosityLabel: "10⁵ Pa·s (Viskositas Sedang)",
    steepSpeedKmH: 6.2,  // Kecepatan di lereng curam
    plainSpeedKmH: 0.8,  // Kecepatan di dataran
    maxRunoutKm: 18,     // Jangkauan maksimal
    colorHead: "#ff3b30", // Merah terang membara
    colorBody: "#c41c00", // Crimson pekat
    colorCrust: "#27120e", // Kerak blok vulkanik
    glowStyle: "rgba(255, 59, 48, 0.9)",
    coolingRatePerKm: 14.0,
    morphology: "Lava Bongkah (Block Lava)",
    hazardDetail: "Lidah lava tebal mudah longsor menghasilkan awan panas guguran (wedhus gembel) dan banjir lahar hujan di alur sungai."
  },
  rhyolite: {
    id: "rhyolite",
    name: "Riolitik / Dasitik (Felsik)",
    label: "Riolitik (Sangat Kental / Merayap)",
    shortDesc: "Viskositas ekstrem, merayap sangat lambat, menyumbat kawah pembentuk erupsi eksplosif paroksismal.",
    sio2: "69 - 75% (Felsik)",
    tempC: 760,
    viscosityPaS: 100000000, // Viskositas ekstrem (~10^8 Pa·s)
    viscosityLabel: "10⁸ Pa·s (Kental Ekstrem)",
    steepSpeedKmH: 0.45, // Sangat lambat merayap (hanya beberapa ratus meter/jam)
    plainSpeedKmH: 0.08,
    maxRunoutKm: 5.5,
    colorHead: "#e056fd", // Ungu pijar keperakan
    colorBody: "#680072", // Ungu gelap berselingan pijar
    colorCrust: "#1a0b1c", // Kerak obsidian pekat
    glowStyle: "rgba(224, 86, 253, 0.9)",
    coolingRatePerKm: 28.0,
    morphology: "Kubah Sumbat Kawah (Cryptodome)",
    hazardDetail: "Menyumbat ventilasi magma, memicu akumulasi tekanan gas kolosal hingga terjadi letusan plinian katastropik dan runtuhan kaldera."
  }
};

// 2. Dataset Lembah Topografi Terendah Nyata (*Thalwegs / Natural River Canyons*)
// Mengikuti kontur depresi terendah gunung api di Indonesia berdasarkan peta topografi PVMBG / DEM
export const VOLCANO_DRAINAGE_BASINS = {
  // GUNUNG MERAPI
  merapi_2010: [
    {
      id: "kali_gendol",
      name: "DAS Kali Gendol (Sektor Selatan-Tenggara)",
      desc: "Lembah terjal jalur utama awan panas & lahar 2010 sejauh 17 km menuju Cangkringan & Kalasan.",
      startElevationM: 2930,
      endElevationM: 180,
      path: [
        [-7.5407, 110.4457], // Puncak Merapi (2930 mdpl)
        [-7.5615, 110.4530], // Jurang bunker Kaliadem (1420 mdpl)
        [-7.5920, 110.4610], // Bronggang - Cangkringan (820 mdpl)
        [-7.6350, 110.4720], // Morangan (450 mdpl)
        [-7.6850, 110.4850], // Bimomartani Ngemplak (270 mdpl)
        [-7.7350, 110.4980], // Jembatan Kalasan / Sleman Timur (180 mdpl)
      ]
    },
    {
      id: "kali_woro",
      name: "DAS Kali Woro (Sektor Tenggara menuju Klaten)",
      desc: "Ngarai dalam penampung pasir lahar dan bongkah batu besar menuju Candi Plaosan.",
      startElevationM: 2930,
      endElevationM: 195,
      path: [
        [-7.5407, 110.4457], // Puncak
        [-7.5580, 110.4650], // Lereng atas Deles Indah (1300 mdpl)
        [-7.5850, 110.4900], // Kendalsari Kemalang (850 mdpl)
        [-7.6250, 110.5150], // Balerante Klaten (480 mdpl)
        [-7.6750, 110.5350], // Manisrenggo (290 mdpl)
        [-7.7200, 110.5500], // Prambanan Utara (195 mdpl)
      ]
    },
    {
      id: "kali_boyong",
      name: "DAS Kali Boyong / Code (Sektor Selatan menuju Sleman & Yogya)",
      desc: "Alur lembah sungai sempit yang membelah kota Yogyakarta di hilirnya.",
      startElevationM: 2930,
      endElevationM: 150,
      path: [
        [-7.5407, 110.4457], // Puncak
        [-7.5650, 110.4350], // Turgo - Plawangan (1200 mdpl)
        [-7.6000, 110.4280], // Kaliurang Barat (850 mdpl)
        [-7.6500, 110.4200], // Pakembinangun (520 mdpl)
        [-7.7100, 110.4100], // Ngaglik (280 mdpl)
        [-7.7700, 110.3950], // Ringroad Utara / Sungai Code (150 mdpl)
      ]
    },
    {
      id: "kali_krasak",
      name: "DAS Kali Krasak & Bebeng (Sektor Barat Daya menuju Muntilan)",
      desc: "Cekungan patahan kubah lava barat, jalur lahar menembus jalan arteri Magelang-Yogya.",
      startElevationM: 2930,
      endElevationM: 240,
      path: [
        [-7.5407, 110.4457], // Puncak
        [-7.5550, 110.4250], // Kawah Bebeng (1600 mdpl)
        [-7.5800, 110.4000], // Jurang Jero (1050 mdpl)
        [-7.6200, 110.3700], // Srumbung (620 mdpl)
        [-7.6650, 110.3450], // Salam - Tempel (360 mdpl)
        [-7.7050, 110.3200], // Jembatan Krasak Muntilan (240 mdpl)
      ]
    }
  ],

  // GUNUNG SEMERU
  semeru_2021: [
    {
      id: "besuk_kobokan",
      name: "DAS Besuk Kobokan & Curah Kobokan (Sektor Tenggara)",
      desc: "Lembah paling rendah dan mematikan, jalur luncuran awan panas & lahar menerjang Gladak Perak.",
      startElevationM: 3676,
      endElevationM: 120,
      path: [
        [-8.1080, 112.9220], // Puncak Mahameru (3676 mdpl)
        [-8.1400, 112.9450], // Jonggring Saloko Flank (2100 mdpl)
        [-8.1800, 112.9800], // Dusun Sumbersari Curah Kobokan (850 mdpl)
        [-8.2150, 113.0150], // Jembatan Gladak Perak Candipuro (420 mdpl)
        [-8.2500, 113.0500], // Pasirian Hilir (210 mdpl)
        [-8.2950, 113.0900], // Pesisir Laut Selatan Samudera Hindia (120 mdpl)
      ]
    },
    {
      id: "kali_regoyo",
      name: "DAS Kali Regoyo & Kali Leprak (Sektor Selatan)",
      desc: "Cekungan lembah pengalir jutaan meter kubik material lahar dingin Semeru.",
      startElevationM: 3676,
      endElevationM: 160,
      path: [
        [-8.1080, 112.9220], // Puncak
        [-8.1500, 112.9250], // Lereng Selatan Sumberwuluh (1800 mdpl)
        [-8.1950, 112.9400], // Gondoruso (750 mdpl)
        [-8.2350, 112.9600], // Jugosari (390 mdpl)
        [-8.2750, 112.9850], // Pronojiwo Selatan (160 mdpl)
      ]
    },
    {
      id: "besuk_bang",
      name: "DAS Besuk Bang & Besuk Sarat (Sektor Timur)",
      desc: "Lembah dalam mengarah ke perkebunan tebu dan pemukiman Pasrujambe.",
      startElevationM: 3676,
      endElevationM: 280,
      path: [
        [-8.1080, 112.9220], // Puncak
        [-8.1250, 112.9650], // Lereng Timur (2200 mdpl)
        [-8.1550, 113.0100], // Pasrujambe Atas (1100 mdpl)
        [-8.1850, 113.0550], // Senduro Barat (620 mdpl)
        [-8.2150, 113.0950], // Ketinggian Dataran Lumajang (280 mdpl)
      ]
    }
  ],

  // GUNUNG GEDE - PANGRANGO (PROYEKSI 2046 & HISTORIS)
  gede_2046: [
    {
      id: "cikundul_cianjur",
      name: "Lembah Sungai Cikundul (Lereng Timur Laut menuju Cianjur)",
      desc: "Alur lembah sungai terendah mengalirkan lahar dan lava langsung membelah Kota Cianjur.",
      startElevationM: 2958,
      endElevationM: 290,
      path: [
        [-6.7860, 106.9840], // Kawah Ratu Gunung Gede (2958 mdpl)
        [-6.7720, 107.0100], // Suryakencana Timur (2400 mdpl)
        [-6.7550, 107.0450], // Cipanas Hulu (1200 mdpl)
        [-6.7750, 107.0900], // Pacet - Sukaresmi (780 mdpl)
        [-6.8050, 107.1250], // Cugenang (520 mdpl)
        [-6.8200, 107.1400], // Pusat Kota Cianjur (290 mdpl)
      ]
    },
    {
      id: "cimandiri_sukabumi",
      name: "Lembah DAS Cimandiri (Lereng Selatan menuju Sukabumi)",
      desc: "Lembah patahan tektonik aktif Cimandiri, jalur lahar tercepat menuju Sukabumi.",
      startElevationM: 2958,
      endElevationM: 450,
      path: [
        [-6.7860, 106.9840], // Puncak
        [-6.8200, 106.9650], // Selabintana Atas (1500 mdpl)
        [-6.8550, 106.9450], // Sukabumi Utara (950 mdpl)
        [-6.8900, 106.9300], // Cisaat (680 mdpl)
        [-6.9250, 106.9200], // Cikembar / Lembah Cimandiri (450 mdpl)
      ]
    },
    {
      id: "cibalagung_bogor",
      name: "Lembah Sungai Cibalagung / Cisadane Hulu (Lereng Barat Laut ke Bogor)",
      desc: "Ngarai hulu pengalir air dan sedimen letusan menembus Cisarua dan Megamendung.",
      startElevationM: 2958,
      endElevationM: 320,
      path: [
        [-6.7860, 106.9840], // Puncak Gede
        [-6.7550, 106.9550], // Lembah Pelana Pangrango (2100 mdpl)
        [-6.7200, 106.9350], // Tugu Puncak (1300 mdpl)
        [-6.6850, 106.9150], // Cisarua Hulu (850 mdpl)
        [-6.6500, 106.8850], // Megamendung - Gadog (540 mdpl)
        [-6.6150, 106.8400], // Ciawi - Bogor Selatan (320 mdpl)
      ]
    }
  ],

  // GUNUNG KRAKATAU 1883
  krakatau_1883: [
    {
      id: "palung_selat_timur",
      name: "Palung Selat Sunda Sektor Timur (Arah Carita & Labuan)",
      desc: "Alur jurang laut runtuhan kaldera 1883 tempat luncuran piroklastik melintasi air laut.",
      startElevationM: 813,
      endElevationM: -250,
      path: [
        [-6.1021, 105.4230], // Kaldera Krakatau (813 mdpl)
        [-6.1200, 105.4800], // Palung Pulau Sebuku (-120m)
        [-6.1500, 105.5700], // Cekungan Selat Sunda Tengah (-80m)
        [-6.2000, 105.6900], // Pesisir Teluk Lada Carita (5 mdpl)
        [-6.3750, 105.8250], // Labuan Pesisir Banten (4 mdpl)
      ]
    },
    {
      id: "palung_selat_utara",
      name: "Palung Sektor Utara (Arah Sebesi & Kalianda Lampung)",
      desc: "Jalur runtuhan piroklastik yang menyapu habis seluruh penduduk Pulau Sebesi.",
      startElevationM: 813,
      endElevationM: -180,
      path: [
        [-6.1021, 105.4230], // Kaldera Krakatau
        [-6.0200, 105.4500], // Selat Sebesi (-110m)
        [-5.9500, 105.4900], // Pulau Sebesi (400 mdpl)
        [-5.8200, 105.5500], // Rajabasa Flank Laut (-40m)
        [-5.7350, 105.5900], // Pesisir Teluk Kalianda (5 mdpl)
      ]
    },
    {
      id: "palung_selat_tenggara",
      name: "Palung Rakata Sektor Tenggara (Arah Anyer & Ujung Kulon)",
      desc: "Koridor runtuhan kaldera bawah laut yang memicu tsunami setinggi 42 meter.",
      startElevationM: 813,
      endElevationM: -320,
      path: [
        [-6.1021, 105.4230], // Kaldera
        [-6.1600, 105.4400], // Tebing Rakata Runtuh (-220m)
        [-6.2500, 105.5200], // Dasar Selat Krakatau (-90m)
        [-6.0500, 105.8800], // Mercusuar Anyer Cikoneng (6 mdpl)
      ]
    }
  ],

  // GUNUNG KELUD (1919)
  kelud_1919: [
    {
      id: "kali_badak",
      name: "DAS Kali Badak & Kali Lahar (Sektor Barat Daya ke Blitar)",
      desc: "Alur utama tumpahnya 38 juta m³ air danau kawah bercampur batu lahar panas 1919.",
      startElevationM: 1731,
      endElevationM: 160,
      path: [
        [-7.9300, 112.3080], // Danau Kawah Kelud (1731 mdpl)
        [-7.9650, 112.2800], // Jurang Gedang (1100 mdpl)
        [-8.0100, 112.2450], // Nglegok (550 mdpl)
        [-8.0550, 112.2100], // Garum Barat (320 mdpl)
        [-8.0950, 112.1700], // Kota Blitar (160 mdpl)
      ]
    },
    {
      id: "kali_konto",
      name: "DAS Kali Konto (Sektor Utara-Barat Laut ke Pujon & Kediri)",
      desc: "Lembah sempit yang menerobos ke arah Kandangan dan Pare.",
      startElevationM: 1731,
      endElevationM: 190,
      path: [
        [-7.9300, 112.3080], // Kawah
        [-7.8950, 112.2900], // Lereng Utara (1200 mdpl)
        [-7.8550, 112.2650], // Kasembon - Kandangan (580 mdpl)
        [-7.8050, 112.2350], // Pare Timur (290 mdpl)
        [-7.7550, 112.1950], // Dataran Rendah Kediri (190 mdpl)
      ]
    }
  ],

  // GUNUNG TAMBORA 1815
  tambora_1815: [
    {
      id: "lembah_sanggar",
      name: "Lembah Patahan Sanggar (Lereng Timur ke Teluk Sanggar)",
      desc: "Alur aliran piroklastik dan lava 1815 yang memusnahkan Kerajaan Sanggar.",
      startElevationM: 2851,
      endElevationM: 5,
      path: [
        [-8.2500, 118.0000], // Kaldera Raksasa Tambora (2851 mdpl)
        [-8.2350, 118.0800], // Dinding Kaldera Timur (1650 mdpl)
        [-8.2100, 118.1700], // Punggungan Oi Bura (750 mdpl)
        [-8.1900, 118.2500], // Dataran Kerajaan Sanggar (110 mdpl)
        [-8.1800, 118.3200], // Pesisir Teluk Sanggar (5 mdpl)
      ]
    },
    {
      id: "lembah_teluk_saleh",
      name: "Lembah Tambora Barat (Lereng Barat ke Teluk Saleh)",
      desc: "Alur runtuhan lereng raksasa pemusnah Kerajaan Tambora kuno.",
      startElevationM: 2851,
      endElevationM: 2,
      path: [
        [-8.2500, 118.0000], // Kaldera
        [-8.2800, 117.9300], // Lereng Barat Terjal (1400 mdpl)
        [-8.3200, 117.8600], // Kawasan Hutan Tambora (520 mdpl)
        [-8.3600, 117.8000], // Situs Kota Tambora Terkubur (85 mdpl)
        [-8.4100, 117.7500], // Muara Pesisir Teluk Saleh (2 mdpl)
      ]
    }
  ],

  // GUNUNG SINABUNG
  sinabung_2014: [
    {
      id: "lembah_lau_borus",
      name: "DAS Lembah Sungai Lau Borus (Sektor Tenggara)",
      desc: "Alur ngarai terjal tempat tumpukan lava kubah runtuh berulang kali menimbun desa Sukameriah & Bekerah.",
      startElevationM: 2460,
      endElevationM: 680,
      path: [
        [3.1700, 98.3920], // Puncak Kawah Sinabung (2460 mdpl)
        [3.1550, 98.4050], // Lereng Kubah Lava (1650 mdpl)
        [3.1350, 98.4200], // Desa Terkubur Sukameriah (1120 mdpl)
        [3.1100, 98.4450], // Simacem - Bekerah (890 mdpl)
        [3.0800, 98.4750], // Sabo Dam Lau Borus Tiganderket (680 mdpl)
      ]
    }
  ],

  // GUNUNG SLAMET
  slamet_2046: [
    {
      id: "kali_gung_slawi",
      name: "DAS Kali Gung (Lereng Utara menuju Slawi & Tegal)",
      desc: "Alur lembah sungai terendah pengalir sedimen vulkanik ke pantai utara Jawa.",
      startElevationM: 3428,
      endElevationM: 65,
      path: [
        [-7.2420, 109.2080], // Puncak Slamet (3428 mdpl)
        [-7.2000, 109.1950], // Guci Hulu (1350 mdpl)
        [-7.1500, 109.1750], // Bumijawa (820 mdpl)
        [-7.0800, 109.1500], // Lebaksiu (340 mdpl)
        [-6.9800, 109.1350], // Slawi - DAS Kali Gung (65 mdpl)
      ]
    },
    {
      id: "kali_pelus_purwokerto",
      name: "DAS Kali Pelus (Lereng Selatan menuju Baturraden & Purwokerto)",
      desc: "Lembah curam tempat lahar hujan mengancam pariwisata Baturraden.",
      startElevationM: 3428,
      endElevationM: 110,
      path: [
        [-7.2420, 109.2080], // Puncak Slamet
        [-7.2800, 109.2150], // Pancuran Tujuh (1280 mdpl)
        [-7.3150, 109.2250], // Baturraden (740 mdpl)
        [-7.3650, 109.2380], // Sumbang (360 mdpl)
        [-7.4200, 109.2500], // Purwokerto Timur (110 mdpl)
      ]
    }
  ]
};

// 3. Fallback Prosedural: Jika Gunung Tidak Memiliki Jalur Khusus di Kamus
// Dihitung berdasarkan vektor penurunan ketinggian radial alami menuruni kerucut stratovulkanik
export function getVolcanoValleys(volcano) {
  if (!volcano) return [];
  
  const id = volcano.id;
  if (VOLCANO_DRAINAGE_BASINS[id]) {
    return VOLCANO_DRAINAGE_BASINS[id];
  }

  // Cek kecocokan nama parsial
  const nameLower = (volcano.name || "").toLowerCase();
  for (const [key, valleys] of Object.entries(VOLCANO_DRAINAGE_BASINS)) {
    const rootName = key.split("_")[0];
    if (nameLower.includes(rootName)) {
      return valleys;
    }
  }

  // Buat alur lembah prosedural yang terarah mengikuti kemiringan lereng topografi
  const summitLat = volcano.coords?.lat || -6.102;
  const summitLng = volcano.coords?.lng || 105.423;
  const summitElev = volcano.coords?.elevation || 2500;

  // 4 sektor lembah drainase utama
  const sectors = [
    { angle: 35, name: "Lembah Drainase Timur Laut", descentElev: 250 },
    { angle: 125, name: "Lembah Alur Sungai Tenggara", descentElev: 180 },
    { angle: 215, name: "Lembah Cekungan Barat Daya", descentElev: 310 },
    { angle: 305, name: "Lembah Jurang Ngarai Barat Laut", descentElev: 420 }
  ];

  return sectors.map((sec, sIdx) => {
    const path = [];
    const steps = 6;
    const maxLenKm = 25;
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const dKm = frac * maxLenKm;
      // Meandering sungai di lembah terendah
      const meanderAngle = sec.angle + Math.sin(i * 1.2 + sIdx) * 16;
      const rad = (meanderAngle * Math.PI) / 180;
      const lat = summitLat + (dKm * Math.cos(rad)) / 111;
      const lng = summitLng + (dKm * Math.sin(rad)) / (111 * Math.cos((summitLat * Math.PI) / 180));
      path.push([lat, lng]);
    }

    return {
      id: `procedural_valley_${sIdx}`,
      name: `${sec.name} (${volcano.name})`,
      desc: `Alur lembah sungai pengalir sedimen dan lava menuruni lereng ${volcano.name}.`,
      startElevationM: summitElev,
      endElevationM: sec.descentElev,
      path
    };
  });
}

// 4. Kalkulator Jarak Euclidean & Geodetik Antara Titik-Titik Jalur Lembah (KM)
function getPathTotalLengthKm(path) {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const [lat1, lng1] = path[i];
    const [lat2, lng2] = path[i + 1];
    const dLat = (lat2 - lat1) * 111;
    const midLat = ((lat1 + lat2) / 2) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * 111 * Math.cos(midLat);
    total += Math.sqrt(dLat * dLat + dLng * dLng);
  }
  return total;
}

// 5. Interpolasi Titik Geografis Berdasarkan Jarak Tempuh Aliran
export function interpolatePathAtDistance(path, targetDistKm) {
  if (!path || path.length === 0) return { point: null, subPath: [], fraction: 0, currentElevationM: 0 };
  if (path.length === 1 || targetDistKm <= 0.05) {
    return { point: path[0], subPath: [path[0]], fraction: 0, currentElevationM: 0 };
  }

  let accumulatedDist = 0;
  const subPath = [path[0]];

  for (let i = 0; i < path.length - 1; i++) {
    const [lat1, lng1] = path[i];
    const [lat2, lng2] = path[i + 1];
    const dLat = (lat2 - lat1) * 111;
    const midLat = ((lat1 + lat2) / 2) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * 111 * Math.cos(midLat);
    const segDist = Math.sqrt(dLat * dLat + dLng * dLng);

    if (accumulatedDist + segDist >= targetDistKm) {
      const remainingDist = targetDistKm - accumulatedDist;
      const segFrac = Math.max(0, Math.min(1, remainingDist / (segDist || 0.001)));
      const interLat = lat1 + (lat2 - lat1) * segFrac;
      const interLng = lng1 + (lng2 - lng1) * segFrac;
      const endPoint = [interLat, interLng];
      subPath.push(endPoint);
      return {
        point: endPoint,
        subPath,
        segmentIndex: i,
        segmentFraction: segFrac
      };
    }

    accumulatedDist += segDist;
    subPath.push([lat2, lng2]);
  }

  // Jika melebihi panjang alur, berhenti di titik akhir
  return {
    point: path[path.length - 1],
    subPath,
    segmentIndex: path.length - 2,
    segmentFraction: 1
  };
}

// 6. Fungsi Utama: Kalkulasi Perambatan Aliran Lava & Lahar Realistis
export function calculateLavaFlowPropagation(volcano, timeMinutes, vei, magmaTypeId = "andesite") {
  const magma = MAGMA_TYPES[magmaTypeId] || MAGMA_TYPES.andesite;
  const valleys = getVolcanoValleys(volcano);

  // Multiplier skala energi letusan VEI terhadap debit dan kecepatan dorong hidrolik
  // VEI 4: 0.75x, VEI 5: 1.0x, VEI 6: 1.4x, VEI 7: 1.9x, VEI 8: 2.5x
  const veiMultiplier = Math.max(0.6, 1.0 + (vei - 5) * 0.35);

  // Waktu efektif aliran (menit ke jam)
  const timeHours = timeMinutes / 60;

  const valleySimulations = valleys.map((valley) => {
    const totalValleyLengthKm = getPathTotalLengthKm(valley.path);
    const elevDropM = Math.max(50, valley.startElevationM - valley.endElevationM);
    const avgSlopeDeg = Math.min(45, Math.max(2, (elevDropM / (totalValleyLengthKm * 1000 || 1)) * (180 / Math.PI) * 1.5));

    // Kecepatan lereng atas vs dataran bawah
    const effectiveSpeedKmH = (
      magma.steepSpeedKmH * Math.pow(Math.sin((avgSlopeDeg * Math.PI) / 180), 0.6) * 0.8 +
      magma.plainSpeedKmH * 0.2
    ) * veiMultiplier;

    // Perambatan jarak tempuh ujung aliran lava pada waktu T+timeMinutes
    // Pertumbuhan non-linear (cepat di awal saat menuruni lereng terjal puncak, melambat karena pendinginan dan dataran landai)
    let reachedDistanceKm = 0;
    if (timeHours > 0) {
      reachedDistanceKm = Math.min(
        valley.path.length > 0 ? totalValleyLengthKm : 20,
        Math.min(magma.maxRunoutKm * (vei / 5), effectiveSpeedKmH * timeHours * 1.2 * (1 / (1 + reachedDistanceKm * 0.05)))
      );
    }

    // Koreksi pembatasan jangkauan fisik magma
    const maxPossibleDistance = Math.min(totalValleyLengthKm, magma.maxRunoutKm * Math.pow(veiMultiplier, 0.7));
    reachedDistanceKm = Math.min(maxPossibleDistance, reachedDistanceKm);

    // Dapatkan subpath koordinat aktif sampai front saat ini
    const { point: frontPoint, subPath: activeSubPath } = interpolatePathAtDistance(
      valley.path,
      reachedDistanceKm
    );

    // Hitung elevasi terkini di kepala aliran
    const pathFrac = totalValleyLengthKm > 0 ? reachedDistanceKm / totalValleyLengthKm : 0;
    const currentElevM = Math.round(valley.startElevationM - pathFrac * elevDropM);

    // Hitung suhu permukaan lava terkini (mendingin seiring jarak tempuh)
    const currentTempC = Math.max(
      120,
      Math.round(magma.tempC - reachedDistanceKm * magma.coolingRatePerKm * (1 / veiMultiplier))
    );

    // Kecepatan aliran seketika di ujung kepala (km/jam)
    const currentSpeedKmH = parseFloat((effectiveSpeedKmH * (1 - pathFrac * 0.65)).toFixed(1));

    // Status bahaya lahar hujan sekunder (mengalir jauh melampaui lava jika terjadi hujan di lereng hulu)
    // Kecepatan lahar dingin di sungai: 25 - 55 km/jam
    const laharSpeedKmH = (22 + (vei - 4) * 6);
    const laharReachedDistanceKm = Math.min(totalValleyLengthKm, timeHours * laharSpeedKmH * 0.9);
    const { subPath: laharSubPath } = interpolatePathAtDistance(valley.path, laharReachedDistanceKm);

    return {
      valleyId: valley.id,
      valleyName: valley.name,
      valleyDesc: valley.desc,
      totalLengthKm: parseFloat(totalValleyLengthKm.toFixed(1)),
      reachedDistanceKm: parseFloat(reachedDistanceKm.toFixed(2)),
      frontPoint,
      activeLavaSubPath: activeSubPath,
      laharSubPath: laharSubPath,
      currentElevM,
      currentTempC,
      currentSpeedKmH,
      isFlowActive: timeMinutes > 0 && reachedDistanceKm > 0.1,
      hasReachedFoot: pathFrac >= 0.95
    };
  });

  return {
    magma,
    vei,
    timeMinutes,
    veiMultiplier,
    valleySimulations,
    // Statistik agregat
    maxFrontDistanceKm: Math.max(0, ...valleySimulations.map(v => v.reachedDistanceKm)),
    avgCurrentSpeedKmH: parseFloat((valleySimulations.reduce((acc, v) => acc + v.currentSpeedKmH, 0) / (valleySimulations.length || 1)).toFixed(1))
  };
}
