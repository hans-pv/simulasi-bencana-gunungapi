/**
 * Dataset Komprehensif 10 Erupsi Gunung Berapi Terdahsyat dalam Sejarah Indonesia
 * Dilengkapi Skenario 'What-If Hari Ini' (Demografi BPS Modern, Objek Vital Nasional, Risiko Ekonomi)
 * 1. Supervolcano Toba (~74.000 BP) - VEI 8
 * 2. Gunung Tambora (1815) - VEI 7
 * 3. Gunung Samalas / Rinjani (1257) - VEI 7
 * 4. Gunung Krakatau (1883) - VEI 6
 * 5. Gunung Kelud (1919 / 1586) - VEI 4-5
 * 6. Gunung Merapi (2010 / 1006) - VEI 4
 * 7. Gunung Agung (1963) - VEI 5
 * 8. Gunung Galunggung (1982) - VEI 4
 * 9. Gunung Papandayan (1772) - VEI 4
 * 10. Gunung Awu (1856 / 1966) - VEI 4
 */

import { HISTORICAL_LOCATIONS as KRAKATAU_LOCS, KRAKATAU_COORDS } from "./historicalLocations";
import { EXTRA_VOLCANOES } from "./extraVolcanoes";
import { FUTURE_VOLCANOES } from "./futureVolcanoes";

// Import 25-location comprehensive catalogs with 5 locations per severity category
import { tobaLocations } from "./volcanoLocations/tobaLocations";
import { tamboraLocations } from "./volcanoLocations/tamboraLocations";
import { samalasLocations } from "./volcanoLocations/samalasLocations";
import { keludLocations } from "./volcanoLocations/keludLocations";
import { merapiLocations } from "./volcanoLocations/merapiLocations";
import { agungLocations } from "./volcanoLocations/agungLocations";
import { galunggungLocations } from "./volcanoLocations/galunggungLocations";
import { papandayanLocations } from "./volcanoLocations/papandayanLocations";
import { awuLocations } from "./volcanoLocations/awuLocations";

export const VOLCANO_HISTORICAL_PRESETS = {
  krakatau_1883: [
    { label: "27 Ags 1883 (VEI 6)", shortLabel: "27 Ags 1883", vei: 6, defaultTime: 45, badge: "Paroksismal", desc: "Puncak keruntuhan kaldera 1883" },
    { label: "Awal Mei 1883 (VEI 4)", shortLabel: "Mei 1883", vei: 4, defaultTime: 20, badge: "Fase Awal", desc: "Aktivitas pembuka kawah Perboewatan" },
    { label: "Super-Krakatau (VEI 7)", shortLabel: "What-If Krakatau", vei: 7, defaultTime: 60, badge: "Ekstrem", desc: "Skenario kolosal gabungan Selat Sunda" },
  ],
  toba_supervolcano: [
    { label: "Erupsi Paroksismal YTT (~74.000 BP, VEI 8)", shortLabel: "Paroksismal YTT", vei: 8, defaultTime: 30, badge: "Supervolcano", desc: "Erupsi kaldera Toba terbesar Kuarter Bumi" },
    { label: "Fase Pembuka Kaldera (VEI 7)", shortLabel: "Fase Awal Toba", vei: 7, defaultTime: 20, badge: "Plinian Awal", desc: "Semburan gas & runtuhan awal dinding kaldera" },
    { label: "Musim Dingin Vulkanik (VEI 8)", shortLabel: "Musim Dingin 10 Thn", vei: 8, defaultTime: 90, badge: "Dampak Global", desc: "Hamburan 2.800 km³ tephra ke stratosfer" },
  ],
  tambora_1815: [
    { label: "10-11 Apr 1815 (VEI 7)", shortLabel: "10 Apr 1815", vei: 7, defaultTime: 45, badge: "Paroksismal", desc: "Puncak letusan pembentuk kaldera raksasa" },
    { label: "5 Apr 1815 (VEI 5)", shortLabel: "5 Apr 1815", vei: 5, defaultTime: 20, badge: "Fase Awal", desc: "Dentuman pertama terdengar hingga Jawa" },
    { label: "Super-Tambora (VEI 8)", shortLabel: "Super-Tambora", vei: 8, defaultTime: 60, badge: "What-If Ekstrem", desc: "Skenario keruntuhan katastropik global" },
  ],
  samalas_1257: [
    { label: "Puncak Erupsi 1257 M (VEI 7)", shortLabel: "Pertengahan 1257", vei: 7, defaultTime: 45, badge: "Paroksismal", desc: "Kolaps Rinjani Purba pembentuk Segara Anak" },
    { label: "Fase Plinian Pembuka (VEI 5)", shortLabel: "Fase Awal", vei: 5, defaultTime: 20, badge: "Hujan Batu Apung", desc: "Hamburan tephra tebal menimbun Pamatan" },
    { label: "Super-Samalas (VEI 8)", shortLabel: "Super-Samalas", vei: 8, defaultTime: 60, badge: "What-If Ekstrem", desc: "Skenario keruntuhan masif lintas benua" },
  ],
  kelud_1919: [
    { label: "19-20 Mei 1919 (VEI 4)", shortLabel: "19 Mei 1919", vei: 4, defaultTime: 25, badge: "Lahar Panas", desc: "Tumpahnya 38 juta m³ air danau kawah" },
    { label: "Erupsi 1586 Purba (VEI 5)", shortLabel: "Erupsi 1586", vei: 5, defaultTime: 40, badge: "Dahsyat Purba", desc: "Bencana lahar terluas dalam naskah sejarah Jawa" },
    { label: "Erupsi 13 Feb 2014 (VEI 4)", shortLabel: "Erupsi 2014", vei: 4, defaultTime: 20, badge: "Plume 17 km", desc: "Hujan abu pekat melumpuhkan 7 bandara Jawa" },
  ],
  merapi_2010: [
    { label: "Puncak 5 Nov 2010 (VEI 4)", shortLabel: "5 Nov 2010", vei: 4, defaultTime: 30, badge: "Awan Panas 17 km", desc: "Wedhus gembel Kali Gendol hingga radius 17 km" },
    { label: "Awal Erupsi 26 Okt 2010 (VEI 3)", shortLabel: "26 Okt 2010", vei: 3, defaultTime: 15, badge: "Fase Pertama", desc: "Awan panas perdana dan evakuasi KRB III" },
    { label: "Letusan Purba 1006 M (VEI 5)", shortLabel: "Erupsi 1006 M", vei: 5, defaultTime: 45, badge: "Kolaps Mataram", desc: "Runtuhan sektor barat Merapi yang menimbun Borobudur" },
  ],
  agung_1963: [
    { label: "Puncak 17 Mar 1963 (VEI 5)", shortLabel: "17 Mar 1963", vei: 5, defaultTime: 35, badge: "Paroksismal", desc: "Awan panas meluncur hingga 14 km pantai utara Bali" },
    { label: "Fase Awal 18 Feb 1963 (VEI 3)", shortLabel: "18 Feb 1963", vei: 3, defaultTime: 15, badge: "Leleran Lava", desc: "Lava mengalir ke lereng utara dan hujan abu lokal" },
    { label: "Erupsi Kedua 16 Mei 1963 (VEI 4)", shortLabel: "16 Mei 1963", vei: 4, defaultTime: 30, badge: "Gelombang Lanjutan", desc: "Awan panas piroklastik susulan berjarak 10 km" },
  ],
  galunggung_1982: [
    { label: "Erupsi Utama 1982 (VEI 4)", shortLabel: "Juni - Des 1982", vei: 4, defaultTime: 30, badge: "Petir & Aviasi", desc: "Abu silika mematikan 4 mesin Boeing 747 BA009" },
    { label: "5 Apr 1982 (VEI 3)", shortLabel: "5 Apr 1982", vei: 3, defaultTime: 15, badge: "Fase Awal", desc: "Hujan pasir dan lontaran abu tebal di Priangan Timur" },
    { label: "Erupsi Purba 1822 (VEI 5)", shortLabel: "Erupsi 1822", vei: 5, defaultTime: 45, badge: "Kolosal Priangan", desc: "Lahar panas dan awan panas meluluhlantakkan 114 desa" },
  ],
  papandayan_1772: [
    { label: "11-12 Ags 1772 (VEI 4)", shortLabel: "11 Ags 1772", vei: 4, defaultTime: 30, badge: "Kolaps Longsor", desc: "Runtuhnya lereng timur laut menimbun 40 desa seketika" },
    { label: "Fase Freatik Pembuka (VEI 3)", shortLabel: "Fase Pembuka", vei: 3, defaultTime: 15, badge: "Letusan Kawah", desc: "Semburan belerang dan gemuruh gempa vulkanik lokal" },
    { label: "Skenario Kolaps Sektor (VEI 5)", shortLabel: "What-If Kolaps", vei: 5, defaultTime: 45, badge: "Longsor Lembah", desc: "Proyeksi longsoran masif ke arah Garut dan Bandung" },
  ],
  awu_1966: [
    { label: "12 Ags 1966 (VEI 4)", shortLabel: "12 Ags 1966", vei: 4, defaultTime: 25, badge: "Lahar Panas Kawah", desc: "Tumpahan air danau kawah menewaskan ribuan warga pesisir" },
    { label: "Erupsi Dahsyat 1856 (VEI 4)", shortLabel: "Erupsi 1856", vei: 4, defaultTime: 35, badge: "Tsunami Kawah", desc: "Bencana terparah Kepulauan Sangihe sepanjang sejarah" },
    { label: "Skenario Letusan Katastropik (VEI 5)", shortLabel: "What-If Pesisir", vei: 5, defaultTime: 45, badge: "Tsunami Pesisir", desc: "Gelombang tsunami lokal melanda Kepulauan Sangihe" },
  ],
  semeru_2021: [
    { label: "Puncak 4 Des 2021 (VEI 4)", shortLabel: "4 Des 2021", vei: 4, defaultTime: 30, badge: "Awan Panas APG", desc: "Awan panas guguran Besuk Kobokan menimbun Gladak Perak" },
    { label: "Erupsi Lahar 1909 (VEI 4)", shortLabel: "Erupsi 1909", vei: 4, defaultTime: 25, badge: "Lahar Panas", desc: "Lahar masif meluluhlantakkan perkebunan Lumajang" },
    { label: "Skenario Super-Semeru (VEI 5)", shortLabel: "What-If Kolaps", vei: 5, defaultTime: 50, badge: "Kolaps Kubah", desc: "Runtuhan kubah masif menembus perbatasan Malang" },
  ],
  sinabung_2010: [
    { label: "Erupsi Paroksismal 2014 (VEI 4)", shortLabel: "Februari 2014", vei: 4, defaultTime: 30, badge: "Awan Panas Berulang", desc: "Guguran kubah lava melenyapkan Sukameriah" },
    { label: "Reaktivasi 29 Ags 2010 (VEI 3)", shortLabel: "29 Ags 2010", vei: 3, defaultTime: 15, badge: "Bangkit 400 Thn", desc: "Letusan pertama setelah tidur sejak abad 17" },
    { label: "Skenario Kaldera Baru (VEI 5)", shortLabel: "What-If Karo", vei: 5, defaultTime: 45, badge: "Ekstrem", desc: "Runtuhan lereng masif menuju Danau Lau Borus" },
  ],
  ruang_1871: [
    { label: "Tsunami Vulkanik 1871 (VEI 4)", shortLabel: "3 Mar 1871", vei: 4, defaultTime: 25, badge: "Tsunami 25m", desc: "Kolaps lereng pulau memicu tsunami 25m ke Tagulandang" },
    { label: "Paroksismal 17 Apr 2024 (VEI 4)", shortLabel: "17 Apr 2024", vei: 4, defaultTime: 35, badge: "Petir Vulkanik", desc: "Kolom letusan 19 km melumpuhkan Bandara Manado" },
    { label: "Skenario Kolaps Total (VEI 5)", shortLabel: "What-If Kolosal", vei: 5, defaultTime: 50, badge: "Tsunami Selat", desc: "Runtuhan kaldera bawah laut mengancam Minahasa Utara" },
  ],
  batur_1917: [
    { label: "Bencana Gejer Bali 1917 (VEI 5)", shortLabel: "Gejer Bali 1917", vei: 5, defaultTime: 35, badge: "1.372 Korban", desc: "Gempa vulkanik & longsoran masif menimbun ribuan pura" },
    { label: "Aliran Lava Batur 1926 (VEI 4)", shortLabel: "Lava 1926", vei: 4, defaultTime: 25, badge: "Lava Hitam", desc: "Lava mengubur Desa Batur dan Pura Ulun Danu lama" },
    { label: "Skenario Kaldera Purba (VEI 6)", shortLabel: "Batur Purba", vei: 6, defaultTime: 60, badge: "What-If Kaldera", desc: "Letusan kolosal pembentuk Danau Batur 29.000 BP" },
  ],
  gamalama_1775: [
    { label: "Amblesan Tolire 1775 (VEI 4)", shortLabel: "5-7 Sep 1775", vei: 4, defaultTime: 30, badge: "Maar Tolire", desc: "Desa Soela Takomi lenyap dalam semalam membentuk Danau Tolire" },
    { label: "Erupsi Abu 4 Des 2011 (VEI 3)", shortLabel: "4 Des 2011", vei: 3, defaultTime: 15, badge: "Hujan Abu", desc: "Hujan abu pekat melumpuhkan Bandara Babullah Ternate" },
    { label: "Skenario Kolaps Pulau (VEI 5)", shortLabel: "What-If Ternate", vei: 5, defaultTime: 45, badge: "Tsunami Pulau", desc: "Kolaps sektor Gamalama memicu tsunami ke Tidore dan Halmahera" },
  ],
  gede_2046: [
    { label: "Plinian Klimaks 2046 (VEI 5)", shortLabel: "Plinian 2046", vei: 5, defaultTime: 45, badge: "Proyeksi 2046", desc: "Awan panas meluncur ke Cipanas & Sukabumi" },
    { label: "Fase Magmatik Awal (VEI 4)", shortLabel: "Fase Awal", vei: 4, defaultTime: 20, badge: "Prekursor", desc: "Aktivitas pembuka Kawah Ratu & sesar Cugenang" },
    { label: "Super-Gede Paroksismal (VEI 6)", shortLabel: "Super-Gede", vei: 6, defaultTime: 60, badge: "Ekstrem Jabodetabek", desc: "Skenario runtuhan lereng dan abu lebat Jakarta" },
  ],
  slamet_2046: [
    { label: "Flank Collapse 2046 (VEI 5)", shortLabel: "Kolaps Lereng 2046", vei: 5, defaultTime: 45, badge: "Proyeksi 2046", desc: "Longsoran sektor raksasa ke Baturraden" },
    { label: "Eksplosif Kawah IV (VEI 4)", shortLabel: "Kawah IV", vei: 4, defaultTime: 20, badge: "Fase Awal", desc: "Hujan abu lebat menutup jalur Pantura" },
    { label: "Super-Slamet Plinian (VEI 6)", shortLabel: "Super-Slamet", vei: 6, defaultTime: 60, badge: "Ekstrem Jawa", desc: "Lahar hujan menyapu DAS Serayu & Comal" },
  ],
  kerinci_2046: [
    { label: "Paroksismal Plinian 2046 (VEI 5)", shortLabel: "Plinian 2046", vei: 5, defaultTime: 45, badge: "Proyeksi 2046", desc: "Plume 34 km menembus stratosfer" },
    { label: "Freatomagmatik Kawah (VEI 4)", shortLabel: "Freatomagmatik", vei: 4, defaultTime: 20, badge: "Fase Awal", desc: "Lontaran bom andesit ke Kayu Aro" },
    { label: "Super-Kerinci Trans-Sumatera (VEI 6)", shortLabel: "Super-Kerinci", vei: 6, defaultTime: 60, badge: "Ekstrem Sumatera", desc: "Kelumpuhan ruang udara regional Sumatera" },
  ],
  marapi_2046: [
    { label: "Paroksismal Megagalodo 2046 (VEI 4)", shortLabel: "Megagalodo 2046", vei: 4, defaultTime: 30, badge: "Proyeksi 2046", desc: "Banjir lahar dingin menyapu Lembah Anai" },
    { label: "Eksplosif Verbeek Awal (VEI 3)", shortLabel: "Fase Awal", vei: 3, defaultTime: 15, badge: "Mendadak", desc: "Letusan tanpa prekursor seismik panjang" },
    { label: "Super-Marapi Multi-Kawah (VEI 5)", shortLabel: "Super-Marapi", vei: 5, defaultTime: 45, badge: "Ekstrem Minang", desc: "Lahar dan abu menutup Bukittinggi & Padang Panjang" },
  ],
  rinjani_2046: [
    { label: "Mega-Erupsi Segara Anak 2046 (VEI 6)", shortLabel: "Segara Anak 2046", vei: 6, defaultTime: 50, badge: "Proyeksi 2046", desc: "Tsunami kaldera & lahar mendidih Kokok Putih" },
    { label: "Reaktivasi Barujari (VEI 4)", shortLabel: "Barujari", vei: 4, defaultTime: 20, badge: "Fase Awal", desc: "Semburan lava pijar di danau kaldera" },
    { label: "Super-Rinjani Samalas II (VEI 7)", shortLabel: "Samalas II", vei: 7, defaultTime: 60, badge: "Katastropik Global", desc: "Skenario pendinginan iklim global jilid dua" },
  ],
};

export function getVolcanoPresets(volcano) {
  if (!volcano) return VOLCANO_HISTORICAL_PRESETS.krakatau_1883;
  if (volcano.historicalPresets && volcano.historicalPresets.length > 0) {
    return volcano.historicalPresets;
  }
  if (VOLCANO_HISTORICAL_PRESETS[volcano.id]) {
    return VOLCANO_HISTORICAL_PRESETS[volcano.id];
  }
  const defaultVei = volcano.defaultVei || 6;
  return [
    { 
      label: `Puncak ${volcano.name} (VEI ${defaultVei})`, 
      shortLabel: `VEI ${defaultVei}`, 
      vei: defaultVei, 
      defaultTime: 45, 
      badge: "Erupsi Sejarah" 
    },
    { 
      label: `Fase Awal Letusan (VEI ${Math.max(1, defaultVei - 1)})`, 
      shortLabel: `VEI ${Math.max(1, defaultVei - 1)}`, 
      vei: Math.max(1, defaultVei - 1), 
      defaultTime: 20, 
      badge: "Fase Awal" 
    },
    { 
      label: `Skenario Maksimal (VEI ${Math.min(8, defaultVei + 1)})`, 
      shortLabel: `VEI ${Math.min(8, defaultVei + 1)}`, 
      vei: Math.min(8, defaultVei + 1), 
      defaultTime: 60, 
      badge: "What-If Ekstrem" 
    }
  ];
}

export const HISTORICAL_VOLCANOES = [
  // 1. GUNUNG KRAKATAU (1883)
  {
    id: "krakatau_1883",
    name: "Gunung Krakatau",
    year: "1883 M",
    subtitle: "Paroksismal Kolaps Kaldera & Tsunami Selat Sunda",
    province: "Selat Sunda (Lampung & Banten)",
    coords: KRAKATAU_COORDS,
    defaultVei: 6,
    megatons: 200,
    tephraKm3: 21,
    columnHeightKm: 36,
    primaryHazard: "Tsunami Trans-Samudra >30 Meter & Awan Panas Lintas Laut",
    terrainType: "island_sea",
    description: "Letusan legendaris yang meruntuhkan pulau vulkanik Krakatau ke dalam kaldera bawah laut, membangkitkan gelombang tsunami raksasa hingga 36–41 meter di Anyer dan Teluk Betung, serta melontarkan gelombang kejut atmosfer yang mengitari bumi hingga 7 kali.",
    modernWhatIf: {
      totalPopulationAtRisk: "4.5 Juta Jiwa di pesisir Banten dan Lampung Selatan",
      criticalAssets: [
        "Pelabuhan Penyeberangan Merak-Bakauheni (urat nadi transportasi Jawa-Sumatra)",
        "PLTU Suralaya 4.025 MW (pemasok 17% listrik Jawa-Bali)",
        "Kawasan Industri Baja Krakatau Steel & Petrokimia Cilegon",
        "Bandara Internasional Soekarno-Hatta (ancaman abu silika pada aviasi)"
      ],
      economicRiskUSD: "$48 Miliar USD",
      flightDisruption: "Penutupan total koridor udara Jakarta-Sumatra-Singapura selama 7-14 hari",
      supplyChainImpact: "Putusnya pasokan komoditas pangan pokok antar pulau Sumatra-Jawa seketika"
    },
    locations: KRAKATAU_LOCS,
  },

  // 2. GUNUNG TAMBORA (1815)
  {
    id: "tambora_1815",
    name: "Gunung Tambora",
    year: "1815 M",
    subtitle: "Erupsi Terbesar Sejarah Tertulis Manusia (Year Without a Summer)",
    province: "Sumbawa, Nusa Tenggara Barat",
    coords: {
      lat: -8.2500,
      lng: 118.0000,
      name: "Kaldera Gunung Tambora",
      elevation: 2851,
    },
    defaultVei: 7,
    megatons: 850,
    tephraKm3: 160,
    columnHeightKm: 44,
    primaryHazard: "Awan Panas 700°C, Tsunami Teluk Saleh, & Hujan Abu Global",
    terrainType: "coastal_volcano",
    description: "Letusan ultra-plinian terdahsyat dalam 10.000 tahun terakhir. Memusnahkan tiga kerajaan (Tambora, Pekat, Sanggar), menurunkan temperatur bumi 3°C, dan membunuh lebih dari 71.000–100.000 jiwa.",
    modernWhatIf: {
      totalPopulationAtRisk: "1.8 Juta Jiwa di Pulau Sumbawa, Lombok, dan Flores Barat",
      criticalAssets: [
        "Bandara Sultan Muhammad Kaharuddin Sumbawa & Bandara Bima",
        "Pelabuhan Badas & Pelabuhan Poto Tano",
        "Pusat Pertanian Jagung & Tambak Udang Nasional Teluk Saleh",
        "Kawasan Konservasi Komodo & Labuan Bajo (hujan abu pekat)"
      ],
      economicRiskUSD: "$24 Miliar USD",
      flightDisruption: "Lumpuhnya seluruh penerbangan kawasan Bali, NTB, NTT, dan rute Australia utara",
      supplyChainImpact: "Krisis pangan gandum/beras global dan anomali iklim panen dunia selama 3 tahun"
    },
    locations: tamboraLocations,
  },

  // 3. SUPERVOLCANO TOBA (~74.000 BP)
  {
    id: "toba_supervolcano",
    name: "Supervolcano Toba",
    year: "~74.000 BP",
    subtitle: "Erupsi Supervulkanik Terbesar Kuarter Bumi (Musim Dingin Vulkanik 10 Tahun)",
    province: "Sumatera Utara",
    coords: {
      lat: 2.6845,
      lng: 98.7844,
      name: "Kaldera Danau Toba",
      elevation: 905,
    },
    defaultVei: 8,
    megatons: 10000,
    tephraKm3: 2800,
    columnHeightKm: 70,
    primaryHazard: "Aliran Piroklastik Raksasa 30.000 km², Abu Menutupi Benua, & Pendinginan Global 5°C",
    terrainType: "giant_caldera_lake",
    description: "Letusan supervolcano terbesar dalam sejarah geologi 2,5 juta tahun terakhir. Menyemburkan 2.800 km³ material magma, menutupi seluruh Asia Selatan dengan lapisan abu tebal, dan memicu hambatan genetik (genetic bottleneck) manusia purba.",
    modernWhatIf: {
      totalPopulationAtRisk: "25 Juta Jiwa di Sumatra Utara, Riau, Aceh, Malaysia, dan Singapura",
      criticalAssets: [
        "Kota Metropolitan Medan (pusat ekonomi Sumatra)",
        "Kawasan Industri & Pelabuhan Internasional Belawan & Kuala Tanjung",
        "Jalan Tol Trans-Sumatera (JTTS) koridor Medan-Tebing Tinggi-Parapat",
        "Pembangkit Listrik Tenaga Air (PLTA) Asahan 1, 2, & 3"
      ],
      economicRiskUSD: "$320 Miliar USD",
      flightDisruption: "Lumpuhnya seluruh koridor penerbangan Asia Tenggara, Samudra Hindia, dan rute Australia-Eropa",
      supplyChainImpact: "Kegagalan pertanian total benua Asia dan krisis peradaban global modern"
    },
    locations: tobaLocations,
  },

  // 4. GUNUNG SAMALAS / RINJANI (1257)
  {
    id: "samalas_1257",
    name: "Gunung Samalas (Rinjani Purba)",
    year: "1257 M",
    subtitle: "Erupsi Pemicu Zaman Es Kecil Abad Pertengahan & Lenyapnya Kerajaan Pamatan",
    province: "Lombok, Nusa Tenggara Barat",
    coords: {
      lat: -8.4167,
      lng: 116.4667,
      name: "Kaldera Segara Anak (Eks Samalas)",
      elevation: 2000,
    },
    defaultVei: 7,
    megatons: 600,
    tephraKm3: 40,
    columnHeightKm: 43,
    primaryHazard: "Kolaps Kaldera Segara Anak, Awan Panas >50 KM, & Musim Dingin Vulkanik",
    terrainType: "island_mountain",
    description: "Letusan terdahsyat milenium kedua Masehi (1257 M) yang melenyapkan Gunung Samalas dan menyisakan kaldera Segara Anak. Jejak sulfur di lapisan es kutub membuktikan erupsi ini memicu 'Zaman Es Kecil' (Little Ice Age) di Eropa dan gagal panen massal.",
    modernWhatIf: {
      totalPopulationAtRisk: "3.8 Juta Jiwa di seluruh Pulau Lombok dan Bali Timur",
      criticalAssets: [
        "Bandara Internasional Zainuddin Abdul Madjid (BIZAM) Praya",
        "Sirkuit Internasional Mandalika & Kawasan Ekonomi Khusus (KEK) Mandalika",
        "Pusat Pemerintahan Kota Mataram & Pelabuhan Lembar",
        "Kawasan Pariwisata Tiga Gili (Trawangan, Meno, Air) & Senggigi"
      ],
      economicRiskUSD: "$28 Miliar USD",
      flightDisruption: "Penutupan total seluruh rute penerbangan domestik dan internasional Lombok-Bali-Surabaya",
      supplyChainImpact: "Lumpuhnya total pariwisata internasional Indonesia dan krisis perikanan/pangan NTB"
    },
    locations: samalasLocations,
  },

  // 5. GUNUNG KELUD (1919)
  {
    id: "kelud_1919",
    name: "Gunung Kelud",
    year: "1919 M",
    subtitle: "Tragedi Semburan Danau Kawah Lahar Panas & Terowongan Ampera",
    province: "Jawa Timur",
    coords: {
      lat: -7.9300,
      lng: 112.3080,
      name: "Kawah Gunung Kelud",
      elevation: 1731,
    },
    defaultVei: 4,
    megatons: 40,
    tephraKm3: 0.5,
    columnHeightKm: 25,
    primaryHazard: "Lahar Letusan Panas Seketika (40 Juta m³ Air Danau Kawah Terhempas)",
    terrainType: "crater_lake_volcano",
    description: "Letusan freatomagmatik yang memuntahkan 40 juta meter kubik air danau kawah bercampur material magma, menyapu 104 desa dan menewaskan 5.160 jiwa dalam hitungan menit. Memelopori pembangunan sistem terowongan drainase kawah terhebat di dunia (Terowongan Ampera).",
    modernWhatIf: {
      totalPopulationAtRisk: "3.2 Juta Jiwa di Kediri, Blitar, Tulungagung, dan Malang Barat",
      criticalAssets: [
        "Pusat Industri Rokok Gudang Garam Kediri (penyerap puluhan ribu tenaga kerja)",
        "Bandara Internasional Dhoho Kediri (bandara baru)",
        "Sentra Pertanian Tebu & Peternakan Sapi Perah Jawa Timur",
        "Jalur Kereta Api Lintas Selatan Jawa (Kertosono-Blitar-Malang)"
      ],
      economicRiskUSD: "$12 Miliar USD",
      flightDisruption: "Penutupan bandara Surabaya (SUB), Solo (SOC), dan Yogyakarta (YIA) akibat hujan abu tephra",
      supplyChainImpact: "Kerusakan industri pengolahan gula dan susu segar nasional"
    },
    locations: keludLocations,
  },

  // 6. GUNUNG MERAPI (2010)
  {
    id: "merapi_2010",
    name: "Gunung Merapi",
    year: "2010 M",
    subtitle: "Erupsi Satu Abad: Awan Panas 'Wedhus Gembel' >15 KM & 350+ Korban",
    province: "D.I. Yogyakarta & Jawa Tengah",
    coords: {
      lat: -7.5407,
      lng: 110.4457,
      name: "Kubah Lava Gunung Merapi",
      elevation: 2930,
    },
    defaultVei: 4,
    megatons: 50,
    tephraKm3: 0.15,
    columnHeightKm: 18,
    primaryHazard: "Awan Panas Guguran (PDC) Menuruni Kali Gendol & Lahar Dingin Masif",
    terrainType: "inland_mountain",
    description: "Erupsi terbesar Merapi dalam 100 tahun terakhir. Paroksismal 5 November 2010 memuntahkan kubah lava dengan luncuran awan panas berkecepatan 150 km/jam sejauh 17 km di sepanjang Kali Gendol, menewaskan juru kunci Mbah Maridjan dan 350+ warga.",
    modernWhatIf: {
      totalPopulationAtRisk: "4.8 Juta Jiwa di Kabupaten Sleman, Magelang, Boyolali, Klaten, dan Kota Yogyakarta",
      criticalAssets: [
        "Situs Warisan Budaya Dunia Candi Borobudur & Candi Prambanan",
        "Bandara Internasional Yogyakarta (YIA) Kulon Progo & Adisutjipto",
        "Pusat Pendidikan Universitas Gadjah Mada (UGM) & Kawasan Malioboro",
        "Jaringan Kereta Rel Listrik (KRL) & Jalur Kereta Utama Lintas Selatan"
      ],
      economicRiskUSD: "$16 Miliar USD",
      flightDisruption: "Kelumpuhan total navigasi udara Jawa bagian tengah selama 2-4 pekan",
      supplyChainImpact: "Terhentinya kegiatan pariwisata heritage dan ekonomi kreatif DIY senilai ratusan miliar per hari"
    },
    locations: merapiLocations,
  },

  // 7. GUNUNG AGUNG (1963)
  {
    id: "agung_1963",
    name: "Gunung Agung",
    year: "1963 M",
    subtitle: "Erupsi Upacara Eka Dasa Rudra & Abu Menutupi Seluruh Pulau Bali",
    province: "Bali",
    coords: {
      lat: -8.3430,
      lng: 115.5080,
      name: "Puncak Gunung Agung",
      elevation: 3142,
    },
    defaultVei: 5,
    megatons: 110,
    tephraKm3: 1.0,
    columnHeightKm: 28,
    primaryHazard: "Aliran Awan Panas Paroksismal, Lahar Hujan, & Hujan Abu Batu Apung",
    terrainType: "island_mountain",
    description: "Letusan eksplosif dahsyat saat masyarakat Bali mempersiapkan upacara suci 100 tahun sekali 'Eka Dasa Rudra' di Pura Besakih. Awan panas meluncur hingga 14 km ke arah utara dan lahar hujan menelan lebih dari 1.500 korban jiwa serta memicu krisis pangan Bali.",
    modernWhatIf: {
      totalPopulationAtRisk: "4.3 Juta Jiwa di seluruh Pulau Bali",
      criticalAssets: [
        "Pura Agung Besakih (Pura Ibu terbesar umat Hindu di Bali)",
        "Bandara Internasional I Gusti Ngurah Rai (pintu gerbang 60% devisa pariwisata Indonesia)",
        "Kawasan Pariwisata Karangasem, Amed, Candidasa, dan Sanur",
        "Jalur Logistik Utama Pelabuhan Padangbai (penghubung Bali-Lombok)"
      ],
      economicRiskUSD: "$22 Miliar USD",
      flightDisruption: "Penutupan bandara Bali berpekan-pekan melumpuhkan pariwisata senilai Rp 1,5 Triliun per minggu",
      supplyChainImpact: "Lumpuhnya rantai pasok logistik bahan pokok Nusa Tenggara Barat dari Jawa"
    },
    locations: agungLocations,
  },

  // 8. GUNUNG GALUNGGUNG (1982)
  {
    id: "galunggung_1982",
    name: "Gunung Galunggung",
    year: "1982 M",
    subtitle: "Erupsi Eksplosif 9 Bulan & Insiden Mesin Mati British Airways 009",
    province: "Tasikmalaya, Jawa Barat",
    coords: {
      lat: -7.2500,
      lng: 108.0580,
      name: "Kawah Gunung Galunggung",
      elevation: 2168,
    },
    defaultVei: 4,
    megatons: 65,
    tephraKm3: 0.35,
    columnHeightKm: 20,
    primaryHazard: "Hujan Pasir Silika Tajam Berbulan-bulan & Petir Vulkanik Ekstrem",
    terrainType: "inland_mountain",
    description: "Erupsi berlangsung selama 9 bulan (Mei 1982 - Januari 1983) disertai badai petir vulkanik spektakuler. Erupsi ini menjadi tonggak sejarah keselamatan penerbangan dunia ketika pesawat Boeing 747 British Airways 009 mengalami mati keempat mesin jetnya setelah menembus abu silika Galunggung di ketinggian 37.000 kaki.",
    modernWhatIf: {
      totalPopulationAtRisk: "2.6 Juta Jiwa di Tasikmalaya, Ciamis, Garut, dan Pangandaran",
      criticalAssets: [
        "Jalan Nasional Lintas Selatan Jawa (koridor Nagreg-Gentong-Tasikmalaya)",
        "Jalur Kereta Api Argo Wilis & Lodaya (Bandung-Kroya-Surabaya)",
        "Sentra Industri Kerajinan Bordir & Batik Tasikmalaya",
        "Bendungan & Jaringan Irigasi Pertanian Lembah Citanduy"
      ],
      economicRiskUSD: "$7.5 Miliar USD",
      flightDisruption: "Pengalihan seluruh koridor udara internasional rute Australia-Asia Tenggara menjauhi Jawa bagian selatan",
      supplyChainImpact: "Kelumpuhan distribusi barang logistik darat lintas selatan pulau Jawa"
    },
    locations: galunggungLocations,
  },

  // 9. GUNUNG PAPANDAYAN (1772)
  {
    id: "papandayan_1772",
    name: "Gunung Papandayan",
    year: "1772 M",
    subtitle: "Runtuhnya Lereng Raksasa (Flank Collapse) yang Menelan 40 Desa",
    province: "Garut, Jawa Barat",
    coords: {
      lat: -7.3200,
      lng: 107.7300,
      name: "Kaldera Gunung Papandayan",
      elevation: 2665,
    },
    defaultVei: 4,
    megatons: 55,
    tephraKm3: 0.25,
    columnHeightKm: 16,
    primaryHazard: "Longsoran Raksasa Sektor Lereng (Debris Avalanche) & Semburan Gas Beracun",
    terrainType: "inland_mountain",
    description: "Tanggal 11–12 Agustus 1772, separuh badan puncak Gunung Papandayan runtuh dalam longsoran sektor raksasa (debris avalanche) bersuhu tinggi. Longsoran batu dan lahar menimbun 40 desa permukiman dan menewaskan 2.957 jiwa dalam semalam, menyisakan kaldera tapal kuda selebar 1,5 km.",
    modernWhatIf: {
      totalPopulationAtRisk: "2.1 Juta Jiwa di Kabupaten Garut dan Bandung Selatan (Pangalengan/Cisewu)",
      criticalAssets: [
        "Pusat Pembangkit Listrik Panas Bumi (PLTP) Kamojang & Darajat (pilar energi hijau Jawa)",
        "Sentra Pertanian Hortikultura Sayuran Dataran Tinggi Garut",
        "Kawasan Pariwisata Alam Kawah Papandayan & Hutan Mati",
        "Daerah Tangkapan Air Hulu Sungai Cimanuk (pemasok Waduk Jatigede)"
      ],
      economicRiskUSD: "$6.2 Miliar USD",
      flightDisruption: "Peringatan abu vulkanik lokal pada bandara Husein Sastranegara Bandung dan Kertajati Majalengka",
      supplyChainImpact: "Krisis pasokan sayur-mayur segar ke pasar induk DKI Jakarta dan Jawa Barat"
    },
    locations: papandayanLocations,
  },

  // 10. GUNUNG AWU (1856 / 1966)
  {
    id: "awu_1856",
    name: "Gunung Awu",
    year: "1856 M",
    subtitle: "Erupsi Mematikan Kepulauan Sangihe: Lahar & Gelombang Pasang >3.000 Korban",
    province: "Kepulauan Sangihe, Sulawesi Utara",
    coords: {
      lat: 3.6828,
      lng: 125.4560,
      name: "Kawah Gunung Awu",
      elevation: 1320,
    },
    defaultVei: 4,
    megatons: 45,
    tephraKm3: 0.45,
    columnHeightKm: 22,
    primaryHazard: "Lahar Letusan Danau Kawah & Tsunami Lokal Kepulauan Terpencil",
    terrainType: "island_sea",
    description: "Salah satu letusan paling mematikan dalam sejarah kepulauan nusantara. Danau kawah Awu meledak dan memuntahkan air panas bercampur batu serta lumpur ke segala arah lereng pulau, menghancurkan ibu kota Tahuna dan menewaskan 3.100 jiwa.",
    modernWhatIf: {
      totalPopulationAtRisk: "140.000 Jiwa di seluruh Pulau Sangihe (terisolasi di perbatasan Filipina)",
      criticalAssets: [
        "Pelabuhan Nusantara Tahuna (pintu logistik utama kepulauan)",
        "Bandara Naha Sangihe (akses udara satu-satunya pulau)",
        "Pusat Pemerintahan Kabupaten Kepulauan Sangihe",
        "Pangkalan Angkatan Laut TNI AL Tahuna (pengamanan perbatasan perairan utara)"
      ],
      economicRiskUSD: "$3.5 Miliar USD",
      flightDisruption: "Isolasi total akses transportasi udara dan laut kepulauan perbatasan",
      supplyChainImpact: "Ancaman kelaparan dan krisis logistik pulau terluar NKRI"
    },
    locations: awuLocations,
  },

  ...EXTRA_VOLCANOES,
  ...FUTURE_VOLCANOES
];

export { FUTURE_VOLCANOES };

