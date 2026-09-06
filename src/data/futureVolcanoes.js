/**
 * 5 Katalog Potensi Erupsi Katastropik Aktif di Masa Depan (~2046 M / 20 Tahun ke Depan)
 * Berdasarkan Studi Vulkanologi & Data Pemantauan Resmi:
 * - PVMBG (Pusat Vulkanologi dan Mitigasi Bencana Geologi - Badan Geologi ESDM)
 * - MAGMA Indonesia (Multiplatform Application for Geohazard Mitigation and Assessment)
 * - Smithsonian Institution - Global Volcanism Program (GVP)
 * - USGS Volcano Hazards Program & Publikasi Internasional (IAVCEI, Nature Geoscience)
 * 
 * Daftar 5 Gunung Berpotensi Katastropik 2046:
 * 16. Gunung Gede - Pangrango (Jawa Barat) - Ancaman Megapolitan Jabodetabek & Cianjur
 * 17. Gunung Slamet (Jawa Tengah) - Raksasa Terbesar Jawa & Ancaman Koridor Pantura/Banyumas
 * 18. Gunung Kerinci (Jambi & Sumatera Barat) - Puncak Tertinggi & Koridor Trans-Sumatera
 * 19. Gunung Marapi (Sumatera Barat) - Letusan Eksplosif Tanpa Prekursor & Megagalodo
 * 20. Gunung Rinjani - Barujari (Lombok, NTB) - Ledakan Freatomagmatik & Megatsunami Kaldera Danau Segara Anak
 */

import { gedeLocations } from "./volcanoLocations/gedeLocations";
import { slametLocations } from "./volcanoLocations/slametLocations";
import { kerinciLocations } from "./volcanoLocations/kerinciLocations";
import { marapiLocations } from "./volcanoLocations/marapiLocations";
import { rinjaniLocations } from "./volcanoLocations/rinjaniLocations";

export const FUTURE_VOLCANOES = [
  // 16. GUNUNG GEDE - PANGRANGO (Proyeksi ~2046)
  {
    id: "gede_2046",
    name: "Gunung Gede - Pangrango",
    year: "Proyeksi ~2046 M",
    isFutureProjection: true,
    category: "future_projection",
    badgeLabel: "🔮 PROYEKSI 2046",
    subtitle: "Potensi Paroksismal Siklus 200 Tahunan & Ancaman Megapolitan Jabodetabek",
    province: "Cianjur, Sukabumi & Bogor, Jawa Barat",
    coords: {
      lat: -6.786,
      lng: 106.983,
      name: "Kawah Ratu & Kawah Gumuruh (Puncak Gede)",
      elevation: 2958,
    },
    defaultVei: 5,
    megatons: 120,
    tephraKm3: 1.2,
    columnHeightKm: 28,
    primaryHazard: "Awan Panas Piroklastik Lembah Cipanas-Sukabumi, Hujan Abu Silika Jabodetabek, & Lahar Hujan DAS Ciliwung",
    terrainType: "twin_peaks_andesite",
    description: "Gunung Gede telah tertidur lebih dari 180 tahun sejak letusan 1840. Studi tomografi seismik ITB dan PVMBG mengidentifikasi kantung magma dangkal aktif yang terus terisi. Berada hanya 70-80 km dari Jakarta dan mengapit pemukiman padat Cianjur-Sukabumi-Bogor, erupsi paroksismal masa depan diproyeksikan menjadi bencana paling berdampak dalam sejarah Pulau Jawa modern.",
    scientificRationale: "Siklus istirahat panjang (>180 tahun) mengakibatkan akumulasi tekanan gas volatil magma andesitik-dasitik tinggi. Jalur sesar aktif Cugenang dan sesar Cimandiri yang memotong lereng Gede mempermudah pelepasan energi magma secara mendadak.",
    officialReferences: [
      "PVMBG Badan Geologi ESDM - Peta Kawasan Rawan Bencana Gunung Gede (2023)",
      "Smithsonian Global Volcanism Program - Gede Volcano Data (GVP: 263060)",
      "Widiyantoro et al. (2022) - Seismic Tomography of Active Magma Reservoirs in Western Java",
      "Badan Nasional Penanggulangan Bencana (BNPB) - Kajian Risiko Bencana Provinsi Jawa Barat"
    ],
    modernWhatIf: {
      totalPopulationAtRisk: "12.8 Juta Jiwa di Cianjur, Sukabumi, Bogor, dan Depok Selatan",
      criticalAssets: [
        "Jalur Vital Puncak & Tol Jagorawi (urat nadi wisata & logistik Jakarta-Bandung)",
        "Istana Kepresidenan Cipanas & Kawasan Pertahanan Nasional Sentul",
        "Hulu DAS Ciliwung (sumber banjir dan pasokan air baku metropolitan Jakarta)",
        "Jalur Rel Ganda Kereta Api Bogor-Sukabumi dan Jaringan Transmisi Listrik 500 kV Jawa-Bali"
      ],
      economicRiskUSD: "$42 Miliar USD",
      flightDisruption: "Penutupan Bandara Internasional Soekarno-Hatta (CGK) dan Bandara Halim (HLP) akibat sebaran abu tebal",
      supplyChainImpact: "Lumpuhnya distribusi sayur-mayur dan komoditas pangan dari Jawa Barat ke DKI Jakarta"
    },
    locations: gedeLocations,
  },

  // 17. GUNUNG SLAMET (Proyeksi ~2046)
  {
    id: "slamet_2046",
    name: "Gunung Slamet",
    year: "Proyeksi ~2046 M",
    isFutureProjection: true,
    category: "future_projection",
    badgeLabel: "🔮 PROYEKSI 2046",
    subtitle: "Ancaman Runtuhan Lereng Sektor Raksasa & Luncuran Piroklastik Baturraden",
    province: "Banyumas, Purbalingga, Tegal, Brebes & Pemalang, Jawa Tengah",
    coords: {
      lat: -7.242,
      lng: 109.208,
      name: "Kawah IV / Kawah Aktif Puncak Slamet",
      elevation: 3428,
    },
    defaultVei: 5,
    megatons: 150,
    tephraKm3: 1.8,
    columnHeightKm: 30,
    primaryHazard: "Debris Avalanche Flank Collapse, Awan Panas Baturraden-Guci, & Lahar Dingin Sungai Comal-Kali Gung",
    terrainType: "massive_stratovolcano",
    description: "Gunung Slamet merupakan gunung api bertubuh kerucut tunggal terbesar volumenya di Pulau Jawa. Struktur kawah ganda di puncaknya dan ketidakstabilan lereng barat daya mengindikasikan potensi flank collapse (longsoran sektor raksasa) seperti peristiwa Gunung St. Helens 1980 jika diinjeksi magma basaltik baru bervolume besar.",
    scientificRationale: "Data deformasi GPS dan tiltmeter PVMBG Pos Gambuhan mencatat inflasi berkala tubuh gunung. Sejarah geologi menunjukkan Slamet purba pernah mengalami keruntuhan sektor yang membentuk endapan longsoran vulkanik terbesar di Jawa Tengah.",
    officialReferences: [
      "PVMBG - Peta Kawasan Rawan Bencana Gunungapi Slamet (Jawa Tengah)",
      "Smithsonian Global Volcanism Program - Slamet (GVP: 263180)",
      "USGS Volcano Hazards Program - Comparative Stratovolcano Flank Failure Analogies",
      "Badan Geologi ESDM - Laporan Pemantauan Deformasi dan Kegempaan Gunung Slamet"
    ],
    modernWhatIf: {
      totalPopulationAtRisk: "5.4 Juta Jiwa di 5 Kabupaten sekitar (Banyumas, Tegal, Brebes, Purbalingga, Pemalang)",
      criticalAssets: [
        "Jalur Kereta Api Ganda Lintas Jakarta-Yogyakarta-Surabaya (Stasiun Purwokerto & Bumiayu)",
        "Jalur Arteri Pantura (Tegal-Pemalang) dan Jalan Tol Pejagan-Pemalang",
        "Kawasan Objek Vital Nasional Kilang Minyak Pertamina RU IV Cilacap (58 km selatan)",
        "Sentra Bawang Merah Nasional Brebes & Pertanian Holtikultura Baturraden"
      ],
      economicRiskUSD: "$28 Miliar USD",
      flightDisruption: "Penutupan total Bandara Jenderal Soedirman Purbalingga dan gangguan rute udara Jawa Tengah",
      supplyChainImpact: "Terputusnya konektivitas kereta api penumpang dan logistik utama antara Jakarta dan Jawa Tengah/Timur"
    },
    locations: slametLocations,
  },

  // 18. GUNUNG KERINCI (Proyeksi ~2046)
  {
    id: "kerinci_2046",
    name: "Gunung Kerinci",
    year: "Proyeksi ~2046 M",
    isFutureProjection: true,
    category: "future_projection",
    badgeLabel: "🔮 PROYEKSI 2046",
    subtitle: "Paroksismal Plinian Puncak Tertinggi & Pemutusan Koridor Trans-Sumatera",
    province: "Kerinci & Solok Selatan, Jambi & Sumatera Barat",
    coords: {
      lat: -1.697,
      lng: 101.264,
      name: "Kawah Puncak Indrapura",
      elevation: 3805,
    },
    defaultVei: 5,
    megatons: 180,
    tephraKm3: 2.1,
    columnHeightKm: 34,
    primaryHazard: "Hujan Bom Piroklastik Kersik Tuo, Aliran Piroklastik Kayu Aro, & Banjir Lahar Batang Merao",
    terrainType: "towering_composite_cone",
    description: "Dengan ketinggian 3.805 mdpl, letusan Plinian berskala besar di Gunung Kerinci akan melontarkan kolom abu menembus lapisan stratosfer hingga ketinggian 34 km. Hal ini berpotensi memicu pendinginan iklim regional Sumatera dan menyelimuti lembah padat perkebunan Kayu Aro serta memutus akses Trans-Sumatera.",
    scientificRationale: "Kawah aktif Kerinci menyimpan danau asam hidrotermal bersuhu tinggi. Erupsi freatomagmatik transisi ke magmatik paroksismal dapat terjadi jika kubah magma basaltik-andesitik naik dengan cepat menembus akuifer kawah.",
    officialReferences: [
      "PVMBG - Peta Kawasan Rawan Bencana Gunung Kerinci (2022)",
      "Smithsonian Global Volcanism Program - Kerinci Volcano (GVP: 261170)",
      "Balai Taman Nasional Kerinci Seblat (TNKS) - Dokumen Mitigasi Kawasan Warisan Dunia UNESCO",
      "Pusat Vulkanologi dan Mitigasi Bencana Geologi - Pemantauan Seismik dan Emisi SO2 Kerinci"
    ],
    modernWhatIf: {
      totalPopulationAtRisk: "1.6 Juta Jiwa di Kabupaten Kerinci, Kota Sungai Penuh, dan Solok Selatan",
      criticalAssets: [
        "Perkebunan Teh Kayu Aro Tertua & PTPN VI (pilar ekonomi agroindustri regional)",
        "Jalan Nasional Lintas Tengah Sumatera dan Jalur Strategis Solok Selatan-Kerinci",
        "Bandara Depati Parbo Kerinci & Bandara Muara Bungo Jambi",
        "Hulu Sungai Batanghari (sungai terpanjang di Sumatera)"
      ],
      economicRiskUSD: "$14.5 Miliar USD",
      flightDisruption: "Lumpuhnya seluruh koridor aviasi Pulau Sumatera (Padang, Jambi, Palembang, Pekanbaru)",
      supplyChainImpact: "Krisis pasokan komoditas teh, kayu manis (cassiavera), beras payo, dan sayuran dataran tinggi"
    },
    locations: kerinciLocations,
  },

  // 19. GUNUNG MARAPI (Proyeksi ~2046)
  {
    id: "marapi_2046",
    name: "Gunung Marapi",
    year: "Proyeksi ~2046 M",
    isFutureProjection: true,
    category: "future_projection",
    badgeLabel: "🔮 PROYEKSI 2046",
    subtitle: "Erupsi Paroksismal Multi-Kawah & Bencana Megagalodo Lembah Anai",
    province: "Agam & Tanah Datar, Sumatera Barat",
    coords: {
      lat: -0.381,
      lng: 100.473,
      name: "Kawah Verbeek & Kompleks Kawah Puncak",
      elevation: 2891,
    },
    defaultVei: 4,
    megatons: 60,
    tephraKm3: 0.45,
    columnHeightKm: 18,
    primaryHazard: "Letusan Eksplosif Freatomagmatik Tiba-Tiba, Aliran Piroklastik Batu Palano, & Banjir Lahar Dingin Galodo",
    terrainType: "multi_crater_plateau",
    description: "Gunung Marapi merupakan gunung api dengan frekuensi erupsi tertinggi di Sumatera. Karakter letusannya yang sering terjadi tiba-tiba tanpa sinyal seismik panjang membuatnya sangat berbahaya bagi kota-kota berpenduduk padat di sekitarnya seperti Bukittinggi, Padang Panjang, dan Batusangkar.",
    scientificRationale: "Sistem saluran magma terbuka dengan perangkap gas dangkal membuat fluida hidrotermal mudah terpicu mendidih mendadak. Akumulasi jutaan ton material piroklastik di igir puncak Marapi menjadikannya bom waktu lahar dingin (galodo) setiap kali musim hujan tiba.",
    officialReferences: [
      "PVMBG Pos Pengamatan Gunung Marapi Bukittinggi - Laporan Kebencanaan Galodo 2024",
      "Smithsonian Global Volcanism Program - Marapi Volcano (GVP: 261140)",
      "Ikatan Ahli Geologi Indonesia (IAGI) - Kajian Geomorfologi dan Bahaya Lahar Marapi",
      "BMKG Stasiun Geofisika Padang Panjang - Pemantauan Kegempaan dan Radar Cuaca"
    ],
    modernWhatIf: {
      totalPopulationAtRisk: "2.8 Juta Jiwa di Bukittinggi, Padang Panjang, Agam, dan Tanah Datar",
      criticalAssets: [
        "Jalan Nasional Lembah Anai (urat nadi logistik dan transportasi Padang-Bukittinggi-Riau)",
        "Pusat Sejarah & Wisata Budaya Kota Bukittinggi (Jam Gadang & Pasar Atas)",
        "Cagar Budaya Rumah Adat Minangkabau Istano Basa Pagaruyung",
        "Jalur Kereta Api Wisata dan Jembatan Kereta Api Bersejarah Lembah Anai"
      ],
      economicRiskUSD: "$16.8 Miliar USD",
      flightDisruption: "Penutupan berulang Bandara Internasional Minangkabau (BIM) Padang Pariaman",
      supplyChainImpact: "Terputusnya jalur pasokan sembako dan mobilitas penduduk antara pesisir barat dan pedalaman Sumatera"
    },
    locations: marapiLocations,
  },

  // 20. GUNUNG RINJANI - BARUJARI (Proyeksi ~2046)
  {
    id: "rinjani_2046",
    name: "Gunung Rinjani - Barujari",
    year: "Proyeksi ~2046 M",
    isFutureProjection: true,
    category: "future_projection",
    badgeLabel: "🔮 PROYEKSI 2046",
    subtitle: "Mega-Erupsi Freatomagmatik Danau Segara Anak & Megatsunami Kaldera",
    province: "Lombok Utara & Lombok Timur, Nusa Tenggara Barat",
    coords: {
      lat: -8.420,
      lng: 116.458,
      name: "Kawah Aktif Anak Gunung Barujari / Danau Segara Anak",
      elevation: 3726,
    },
    defaultVei: 6,
    megatons: 350,
    tephraKm3: 15.0,
    columnHeightKm: 38,
    primaryHazard: "Megatsunami Danau Segara Anak, Lahar Mendidih Kokok Putih, & Awan Panas Plinian Sembalun",
    terrainType: "caldera_lake_volcano",
    description: "Berlokasi di dalam kaldera raksasa sisa super-letusan Samalas 1257, anak gunung api Barujari tumbuh di tengah danau kawah Segara Anak yang menampung 1,3 miliar meter kubik air. Reaktivasi magmatik paroksismal VEI 6 di masa depan diproyeksikan memicu ledakan freatomagmatik katastropik, mendidihkan air danau, dan memuntahkan banjir lahar mendidih raksasa ke Sungai Kokok Putih.",
    scientificRationale: "Interaksi antara magma bertemperatur 1.100°C dengan volume air danau sebesar 1,3 miliar m³ memicu erupsi eksplosif termal ekstrem (Fuel-Coolant Interaction). Gelombang tsunami danau kaldera berketinggian 40+ meter dapat melompati bibir Plawangan.",
    officialReferences: [
      "Lavigne et al. (2013) - Source of the Great A.D. 1257 Mystery Eruption: Mount Samalas, Rinjani Volcanic Complex",
      "PVMBG - Peta Kawasan Rawan Bencana Kompleks Rinjani-Samalas",
      "Smithsonian Global Volcanism Program - Rinjani Volcano (GVP: 264030)",
      "Balai Taman Nasional Gunung Rinjani (BTNR) - Kajian Mitigasi Danau Segara Anak"
    ],
    modernWhatIf: {
      totalPopulationAtRisk: "3.5 Juta Jiwa di seluruh Pulau Lombok dan pesisir barat Pulau Sumbawa",
      criticalAssets: [
        "Sirkuit Internasional Mandalika (KEK Pariwisata Lombok Tengah)",
        "Bandara Internasional Lombok Zainuddin Abdul Madjid (BIL)",
        "Pelabuhan Penyeberangan Ferry Kayangan-Poto Tano (penghubung Lombok-Sumbawa)",
        "Lumbung Tembakau Virginia Nasional dan Sentra Hortikultura Sembalun"
      ],
      economicRiskUSD: "$32 Miliar USD",
      flightDisruption: "Lumpuhnya ruang udara aviasi Bali-Lombok-Sumbawa-Australia selama berminggu-minggu",
      supplyChainImpact: "Lumpuhnya sektor pariwisata internasional Indonesia dan jalur logistik penyeberangan Selat Lombok & Selat Alas"
    },
    locations: rinjaniLocations,
  }
];
