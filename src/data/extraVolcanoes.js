/**
 * 5 Katalog Erupsi Gunung Berapi Berdampak Besar Tambahan di Indonesia:
 * 11. Gunung Semeru (2021) - Jawa Timur
 * 12. Gunung Sinabung (2010/2014) - Sumatera Utara
 * 13. Gunung Ruang (1871/2024) - Sulawesi Utara
 * 14. Gunung Batur (1917/1926) - Bali
 * 15. Gunung Gamalama (1775) - Maluku Utara
 */

import { semeruLocations } from "./volcanoLocations/semeruLocations";
import { sinabungLocations } from "./volcanoLocations/sinabungLocations";
import { ruangLocations } from "./volcanoLocations/ruangLocations";
import { baturLocations } from "./volcanoLocations/baturLocations";
import { gamalamaLocations } from "./volcanoLocations/gamalamaLocations";

export const EXTRA_VOLCANOES = [
  // 11. GUNUNG SEMERU (2021)
  {
    id: "semeru_2021",
    name: "Gunung Semeru",
    year: "2021 M",
    subtitle: "Paroksismal Awan Panas Guguran & Kolaps Kubah Mahameru",
    province: "Lumajang & Malang, Jawa Timur",
    coords: {
      lat: -8.108,
      lng: 112.922,
      name: "Kawah Jonggring Saloko (Mahameru)",
      elevation: 3676,
    },
    defaultVei: 4,
    megatons: 35,
    tephraKm3: 0.15,
    columnHeightKm: 15,
    primaryHazard: "Awan Panas Guguran (APG) Besuk Kobokan, Lahar Hujan, & Hujan Abu Vulkanik",
    terrainType: "inland_mountain",
    description: "Runtuhnya kubah lava aktif Jonggring Saloko memicu luncuran awan panas guguran (APG) dahsyat bersuhu >800°C sejauh 15 km menyusuri Sungai Besuk Kobokan. Peristiwa 4 Desember 2021 ini menimbun pemukiman Dusun Curah Kobokan dan merobohkan jembatan nasional Gladak Perak.",
    modernWhatIf: {
      totalPopulationAtRisk: "1.2 Juta Jiwa di kawasan lereng Lumajang dan Malang Selatan",
      criticalAssets: [
        "Jembatan Nasional Gladak Perak (urat nadi lintas selatan Jawa Timur)",
        "PLTA Pikatan Lumajang & Jaringan Transmisi Jawa-Bali",
        "Jalur Rel Kereta Api Strategis Lintas Probolinggo-Jember-Banyuwangi",
        "Sentra Pertanian Hortikultura & Perkebunan Kopi Lereng Semeru"
      ],
      economicRiskUSD: "$8.5 Miliar USD",
      flightDisruption: "Peringatan abu silika tebal pada jalur aviasi Surabaya-Denpasar-Lombok",
      supplyChainImpact: "Lumpuhnya mobilitas komoditas pangan pokok dan distribusi semen Jawa Timur selatan"
    },
    locations: semeruLocations,
  },

  // 12. GUNUNG SINABUNG (2010/2014)
  {
    id: "sinabung_2010",
    name: "Gunung Sinabung",
    year: "2010 / 2014 M",
    subtitle: "Bangkitnya Raksasa Tidur 400 Tahun & Rentetan Piroklastik",
    province: "Karo, Sumatera Utara",
    coords: {
      lat: 3.170,
      lng: 98.392,
      name: "Kawah Aktif Gunung Sinabung",
      elevation: 2460,
    },
    defaultVei: 4,
    megatons: 28,
    tephraKm3: 0.12,
    columnHeightKm: 12,
    primaryHazard: "Runtuhan Kubah Lava Lava Dome, Awan Panas Beruntun, & Hujan Abu Silika Pekat",
    terrainType: "inland_mountain",
    description: "Setelah tidak aktif lebih dari 400 tahun sejak 1600-an, Gunung Sinabung meletus eksplosif pada 2010 dan memasuki periode paroksismal kubah lava aktif berulang 2013-2021. Lebih dari 16 desa di zona merah terkubur abu dan dikosongkan permanen, mengubah kawasan lereng menjadi zona mati tak berpenghuni.",
    modernWhatIf: {
      totalPopulationAtRisk: "850.000 Jiwa di Kabupaten Karo, Dairi, dan Langkat",
      criticalAssets: [
        "Sentra Hortikultura & Lumbung Jeruk/Sayuran Terbesar Sumatera Utara (Tanah Karo)",
        "Jalan Nasional Medan-Berastagi-Kabanjahe (urat nadi wisata & logistik)",
        "Kawasan Relokasi Permanen Pengungsi Siosar",
        "Kawasan Wisata Dataran Tinggi Berastagi & Danau Lau Kawar"
      ],
      economicRiskUSD: "$5.2 Miliar USD",
      flightDisruption: "Penutupan berulang Bandara Internasional Kualanamu Medan akibat sebaran abu",
      supplyChainImpact: "Krisis pasokan sayuran, buah-buahan, dan komoditas ekspor ke Malaysia dan Singapura"
    },
    locations: sinabungLocations,
  },

  // 13. GUNUNG RUANG (1871 / 2024)
  {
    id: "ruang_1871",
    name: "Gunung Ruang",
    year: "1871 / 2024 M",
    subtitle: "Kolaps Kaldera Pulau Gunung Api & Ancaman Tsunami Vulkanik",
    province: "Kepulauan Siau Tagulandang Biaro (Sitaro), Sulawesi Utara",
    coords: {
      lat: 2.300,
      lng: 125.370,
      name: "Kawah Puncak Gunung Ruang",
      elevation: 725,
    },
    defaultVei: 4,
    megatons: 40,
    tephraKm3: 0.20,
    columnHeightKm: 19,
    primaryHazard: "Tsunami Runtuhan Kaldera ke Laut, Lontaran Bom Batu Pijar, & Gelombang Kejut Udara",
    terrainType: "island_volcano",
    description: "Gunung pulau berapi aktif di Kepulauan Sitaro. Pada Maret 1871, longsoran dinding kubah ke laut memicu tsunami 25 meter yang menyapu Pulau Tagulandang dan menewaskan lebih dari 400 jiwa. Pada April 2024, letusan paroksismal kembali terjadi dengan kolom erupsi 19 km, kilatan petir vulkanik masif, dan evakuasi total 12.000 warga.",
    modernWhatIf: {
      totalPopulationAtRisk: "65.000 Jiwa di Kepulauan Tagulandang, Biaro, dan Pesisir Minahasa Utara",
      criticalAssets: [
        "Bandara Internasional Sam Ratulangi Manado (penutupan total operasi penerbangan)",
        "Pelabuhan Samudera Bitung & Armada Kapal Perang Pangkalan Utama TNI AL",
        "Kawasan Ekonomi Khusus (KEK) Pariwisata Likupang Minahasa Utara",
        "Kabel Komunikasi Bawah Laut & Jalur Ferry Antar Pulau Sitaro-Sangihe"
      ],
      economicRiskUSD: "$3.8 Miliar USD",
      flightDisruption: "Penutupan berhari-hari Bandara Manado dan pembatalan rute internasional ke Filipina, Jepang, dan Cina",
      supplyChainImpact: "Terputusnya pasokan logistik bahan pokok antarpulau di kawasan kepulauan Nusa Utara"
    },
    locations: ruangLocations,
  },

  // 14. GUNUNG BATUR (1917 / 1926)
  {
    id: "batur_1917",
    name: "Gunung Batur",
    year: "1917 / 1926 M",
    subtitle: "Gelegar Kaldera Batur & Terkuburnya Desa Batur Purba di Bawah Lava",
    province: "Bangli, Bali",
    coords: {
      lat: -8.242,
      lng: 115.375,
      name: "Kaldera Gunung Batur",
      elevation: 1717,
    },
    defaultVei: 5,
    megatons: 120,
    tephraKm3: 0.85,
    columnHeightKm: 22,
    primaryHazard: "Aliran Lava Hitam Masif, Tsunami Seiche Danau Batur, & Hujan Abu Menutupi Seluruh Bali",
    terrainType: "giant_caldera_lake",
    description: "Kaldera ganda spektakuler dengan danau kawah di dalamnya. Letusan 1917 (disebut 'Gejer Bali') menewaskan 1.373 jiwa dan merusak 65.000 rumah. Letusan berulang 1926 menumpahkan aliran lava basal hitam pekat yang menenggelamkan seluruh Desa Batur dan Pura Ulun Danu Batur asli di dasar kaldera.",
    modernWhatIf: {
      totalPopulationAtRisk: "3.5 Juta Jiwa di seluruh Pulau Bali dan kawasan pariwisata internasional",
      criticalAssets: [
        "Situs Warisan Dunia UNESCO Geopark Global Batur & Kawasan Danau Batur",
        "Kawasan Pariwisata Internasional Ubud, Gianyar, dan Kuta",
        "Bandara Internasional I Gusti Ngurah Rai (ancaman partikel silika pada mesin jet)",
        "Pura Ulun Danu Batur & Jaringan Irigasi Subak Sumber Air Utama Bali"
      ],
      economicRiskUSD: "$18.5 Miliar USD",
      flightDisruption: "Kelumpuhan total industri pariwisata Bali senilai triliunan rupiah per minggu",
      supplyChainImpact: "Terganggunya pasokan pangan, air bersih pegunungan, dan logistik internasional Bali"
    },
    locations: baturLocations,
  },

  // 15. GUNUNG GAMALAMA (1775)
  {
    id: "gamalama_1775",
    name: "Gunung Gamalama",
    year: "1775 M",
    subtitle: "Amblesan Katastropik Desa Soela Takomi & Lahirnya Danau Tolire",
    province: "Ternate, Maluku Utara",
    coords: {
      lat: 0.800,
      lng: 127.330,
      name: "Puncak Gamalama Ternate",
      elevation: 1715,
    },
    defaultVei: 4,
    megatons: 30,
    tephraKm3: 0.18,
    columnHeightKm: 14,
    primaryHazard: "Amblesan Tanah Sesar Kaldera, Letusan Freatomagmatik, & Aliran Lahar Kali Mati",
    terrainType: "island_volcano",
    description: "Pusat kesultanan rempah Ternate yang megah. Pada 5–7 September 1775, gempa vulkanik dahsyat disusul letusan freatik paroksismal memicu amblesan tanah raksasa yang menenggelamkan seluruh desa Soela Takomi beserta 141 warganya ke dalam perut bumi sedalam 50 meter, yang kini menjadi Danau Tolire Besar.",
    modernWhatIf: {
      totalPopulationAtRisk: "250.000 Jiwa di seluruh Pulau Ternate dan pesisir Pulau Tidore",
      criticalAssets: [
        "Bandara Sultan Babullah Ternate (landasan pacu persis di kaki utara lereng Gamalama)",
        "Pelabuhan Ahmad Yani & Pelabuhan Bastiong Ternate (urat nadi ferry Maluku Utara)",
        "Cagar Budaya Keraton Kesultanan Ternate & Benteng-Benteng Bersejarah Abad Ke-16",
        "Sentra Pertanian Cengkih Afo Kuno & Sumber Air Bersih Danau Tolire"
      ],
      economicRiskUSD: "$3.2 Miliar USD",
      flightDisruption: "Penutupan total Bandara Babullah dan isolasi akses penerbangan Maluku Utara",
      supplyChainImpact: "Kelumpuhan logistik rempah, perikanan tuna, dan distribusi sembako antarpulau Maluku Utara"
    },
    locations: gamalamaLocations,
  }
];
