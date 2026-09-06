// Basis Data Komprehensif Panduan Keselamatan Warga, Kelompok Rentan, Komunikasi Blackout, Bahaya Sekunder, & Dampak Global

export const DISASTER_PRACTICAL_GUIDELINES = {
  // A. Panduan Praktis Tindakan Nyata Warga (Do's & Don'ts)
  dosAndDonts: {
    before: {
      phase: "PRA-ERUPSI (FASE SIAGA & WASPADA)",
      dos: [
        "Siapkan 'Tas Siaga Bencana' keluarga berisi surat berharga dalam kantong kedap air, obat pribadi 7 hari, senter, baterai cadangan, peluit, dan radio baterai.",
        "Simpan stok air bersih dalam wadah tertutup rapat minimal 15 liter per orang untuk kebutuhan 3 hari.",
        "Tentukan titik kumpul keluarga di zona aman yang berada di luar KRB (Kawasan Rawan Bencana).",
        "Tutup rapat semua sumur gali, tandon air, dan ventilasi atap rumah dengan plastik tebal/terpal.",
        "Pantau pengumuman resmi PVMBG / BPBD via radio atau kanal resmi (hindari menyebar hoaks di medsos)."
      ],
      donts: [
        "JANGAN membangun tenda atau beraktivitas wisata di dalam radius larangan sektoral (biasanya 3–8 km dari kawah).",
        "JANGAN membiarkan tangki kendaraan kosong; pastikan kendaraan selalu terisi bahan bakar untuk evakuasi darurat.",
        "JANGAN menunggu melihat awan letusan dengan mata kepala sendiri baru bersiap evakuasi."
      ]
    },
    during: {
      phase: "SAAT ERUPSI BERLANGSUNG (TANGGAP DARURAT)",
      dos: [
        "Gunakan kacamata pelindung rapat (kacamata renang / safety google) dan masker N95 atau minimal kain basah berlapis dua.",
        "Kenakan pakaian tertutup lengan panjang, celana panjang, topi lebar, dan sepatu tertutup untuk mencegah luka bakar abu panas.",
        "Segera cari perlindungan di dalam bangunan kokoh; lindungi kepala dari lontaran batu pijar dengan helm atau ransel tebal.",
        "Jika berada di luar ruangan, segera jauhi lembah, ceruk, dan bantaran sungai tempat mengalirnya awan piroklastik atau lahar.",
        "Matikan pendingin ruangan (AC) dan kipas angin, tutup rapat pintu dan jendela agar abu vulkanik tidak masuk ke paru-paru."
      ],
      donts: [
        "JANGAN PERNAH melarikan diri menyusuri lembah atau tebing sungai (itu adalah jalan tol alami awan panas dan lahar).",
        "JANGAN MENGGUNAKAN LENSA KONTAK (contact lens); debu abu vulkanik sangat tajam dan bisa menyebabkan abrasi kornea serta kebutaan permanen.",
        "JANGAN mengendarai sepeda motor jika jalan tertutup abu vulkanik tebal karena jalan menjadi sangat licin dan jarak pandang nol.",
        "JANGAN berlindung di bawah atap seng/asbes tipis yang tidak memiliki penyangga kuat saat hujan abu lebat berlangsung."
      ]
    },
    after: {
      phase: "PASCA-ERUPSI (PEMULIHAN & KEWASPADAAN LANJUTAN)",
      dos: [
        "Tetap gunakan masker dan kacamata pelindung saat membersihkan endapan abu vulkanik.",
        "Basahi endapan abu dengan sedikit percikan air sebelum disapu agar debu silika tidak kembali berterbangan ke udara.",
        "Periksa kondisi kelayakan air minum; jika air terasa asam, berbau belerang, atau keruh, jangan diminum sebelum diuji BPBD/Dinkes.",
        "Periksa sambungan kabel listrik dan gas rumah Anda dari potensi kebocoran atau korsleting akibat beban abu tebal."
      ],
      donts: [
        "JANGAN MENAIKI ATAP SENDIRIAN TANPA TALI PENGAMAN. Beban abu basah membuat struktur atap sangat rapuh; jatuh dari atap adalah penyebab cedera pasca-erupsi tertinggi.",
        "JANGAN mengonsumsi makanan terbuka atau sayur tanaman pekarangan yang tertutup abu vulkanik tanpa dicuci bersih dengan air mengalir.",
        "JANGAN mendekati endapan awan panas yang tampak sudah tenang, karena bagian dalamnya bisa tetap bersuhu 300°C–500°C selama berminggu-minggu."
      ]
    }
  },

  // C. Protokol Khusus Kelompok Rentan (Vulnerable Groups)
  vulnerableGroups: {
    title: "Protokol Penyelamatan Kelompok Rentan",
    subtitle: "Lansia, Balita, Ibu Hamil, & Penyandang Disabilitas",
    guidelines: [
      {
        group: "Lansia & Pasien Komorbid (Hipertensi, Jantung, PPOK)",
        priority: "Prioritas Evakuasi Tahap 1 (Wajib Diungsikan Saat Status SIAGA Level III)",
        actions: [
          "Wajib dievakuasi sebelum status AWAS Level IV diumumkan; jangan menunggu sirine puncak berbunyi.",
          "Bawalah 'Dompet Obat Khusus' berisi resep dan obat rutin untuk minimal 14 hari.",
          "Gunakan kursi roda atau tandu evakuasi menuju Titik Jemput Ramah Akses (Accessible Pick-up Point).",
          "Jangan gunakan rute darurat menanjak atau tangga terjal; gunakan jalur jalan aspal jemputan ambulans BPBD."
        ]
      },
      {
        group: "Balita, Anak-Anak, & Ibu Hamil",
        priority: "Prioritas Perlindungan Pernapasan & Nutrisi Higienis",
        actions: [
          "Lindungi wajah bayi dengan kain kasa basah lembut di dalam selimut pelindung khusus debu.",
          "Sediakan botol susu dan air steril dalam termos tertutup; abu vulkanik mudah mengontaminasi botol susu terbuka.",
          "Ibu hamil trimester akhir wajib segera dialihkan ke fasilitas shelter dekat Rumah Sakit Rujukan Lapangan.",
          "Semua anak wajib memakai gelang identitas tahan air berisi: Nama Anak, Nama Orang Tua, No HP, dan Alamat Asal."
        ]
      },
      {
        group: "Penyandang Disabilitas (Tunanetra, Tunarungu, Tunadaksa)",
        priority: "Aksesibilitas Sistem Peringatan & Jalur Khusus",
        actions: [
          "Sistem Peringatan Ganda: Sirine suara nyaring untuk tunanetra, dan lampu strobo/lampu berkedip visual untuk tunarungu.",
          "Tiap dusun memiliki 'Pendamping Evakuasi Khusus' (Buddy System) yang ditugaskan menjemput warga disabilitas.",
          "Truk dan minibus evakuasi pemerintah diwajibkan memiliki ramp rendah untuk kursi roda.",
          "Shelter ramah disabilitas menyediakan toilet khusus duduk dan jalur bebas undakan tangga."
        ]
      }
    ]
  },

  // D. Saluran Komunikasi Darurat Saat Pemadaman Listrik & Blackout Sinyal
  blackoutCommunication: {
    title: "Protokol Komunikasi Darurat Saat Blackout",
    subtitle: "Ketika Jaringan Seluler 4G/5G dan Listrik PLN Mati Total",
    radios: [
      {
        organization: "RAPI (Radio Antar Penduduk Indonesia)",
        band: "VHF 2 Meter Band",
        frequencies: "142.000 MHz – 143.550 MHz",
        function: "Laporan situasi warga, relawan dusun, dan pembaruan jalur jalan yang tertutup lahar/abu."
      },
      {
        organization: "ORARI (Organisasi Amatir Radio Indonesia)",
        band: "VHF & HF Band",
        frequencies: "145.000 MHz (VHF) / 7.110 MHz (HF Darurat Nasional)",
        function: "Koneksi komando antar-kabupaten, koordinasi bantuan SAR, BNPB, dan logistik helikopter."
      },
      {
        organization: "Kanal Darurat BPBD & SAR Nasional",
        band: "UHF / VHF Khusus",
        frequencies: "115 (Basarnas Darurat) / Frekuensi Lokal BPBD",
        function: "Pemberitahuan evakuasi resmi, dropping logistik, dan permintaan pertolongan korban terjebak."
      }
    ],
    analogSignals: [
      {
        signal: "Tiupan Peluit Darurat (3 Kali Tiupan Panjang)",
        meaning: "SOS / Mohon Bantuan Segera (Dengarkan arah suara oleh tim pencari)."
      },
      {
        signal: "Kentongan Desa (Ketukan Cepat Non-stop)",
        meaning: "Tanda Bahaya Lahar Dingin Datang / Awan Panas Menuju Pemukiman (Segera Lari ke Tempat Tinggi)."
      },
      {
        signal: "Cermin Pantul / Senter Morse (3 Pendek - 3 Panjang - 3 Pendek)",
        meaning: "Sinyal Visual SOS Internasional ke helikopter penyelamat di udara."
      },
      {
        signal: "Kain / Terpal Warna Oranye Mencolok di Atap",
        meaning: "Tanda visual kepada helikopter bahwa ada korban luka/kelompok rentan yang butuh evakuasi segera."
      }
    ]
  },

  // Bahaya Sekunder: Lahar Hujan/Dingin & Krisis Air Bersih
  secondaryHazards: {
    title: "Bahaya Sekunder Pasca-Erupsi (Secondary Hazards)",
    description: "Bahaya mematikan yang timbul jam-jam atau minggu-minggu setelah erupsi vertikal mereda.",
    laharDingin: {
      name: "Banjir Lahar Hujan (Lahar Dingin)",
      trigger: "Curah hujan > 50 mm/jam di puncak gunung yang menyapu jutaan meter kubik material tephra lepas.",
      characteristics: "Kecepatan 30–80 km/jam, massa jenis tinggi seperti adukan semen basah, sanggup menghancurkan jembatan beton dan mengangkut batu andesit berdiameter 3 meter.",
      mitigation: "Tinggalkan bantaran sungai radius minimal 500 meter dari bibir sungai saat hulu mulai hujan deras. Jangan pernah menonton lahar di atas jembatan!"
    },
    waterContamination: {
      name: "Krisis Air Bersih & Asidifikasi Waduk",
      trigger: "Abu vulkanik kaya fluor, sulfat, klorida, dan logam berat mengendap di danau, sungai, dan instalasi PDAM.",
      impact: "Memicu keracunan ternak (fluorosis), iritasi lambung, dan penghentian total suplai air bersih kota.",
      mitigation: "Gunakan tandon air tertutup. Jangan menyaring air berlumpur abu dengan saringan kain biasa karena senyawa kimia terlarut tidak dapat disaring mekanik."
    }
  },

  // Dampak Global & Nasional (Aviation, Supply Chain, Climate)
  globalImpacts: {
    title: "Dampak Krisis Skala Nasional & Global",
    aviation: {
      title: "Penutupan Ruang Udara & Aviation NOTAM",
      description: "Partikel silika abu vulkanik meleleh di dalam ruang bakar turbin mesin jet (suhu >1.100°C) menjadi kaca cair yang mematikan mesin pesawat (flameout).",
      affectedAirportsSample: [
        { code: "CGK / WIII", name: "Bandara Internasional Soekarno-Hatta (Jakarta)", threat: "Jalur Abu Gede/Krakatau/Slamet" },
        { code: "HLP / WIHH", name: "Bandara Halim Perdanakusuma (Jakarta)", threat: "Jalur Abu Gede-Pangrango" },
        { code: "YIA / WAHI", name: "Yogyakarta International Airport", threat: "Jalur Abu Merapi / Slamet" },
        { code: "LOP / WADL", name: "Bandara Internasional Lombok", threat: "Jalur Abu Rinjani / Tambora" },
        { code: "PDG / WIPT", name: "Bandara Internasional Minangkabau", threat: "Jalur Abu Marapi / Kerinci" }
      ]
    },
    foodSupplyChain: {
      title: "Guncangan Rantai Pasok Pangan (Supply Chain Shock)",
      description: "Gunung berapi aktif di Indonesia merupakan sentra hortikultura nasional (sayur-mayur, cabai, bawang, kentang, teh, dan beras). Erupsi skala VEI 4–6 memusnahkan ratusan ribu hektar lahan produktif.",
      examples: [
        "Erupsi Gede-Pangrango memutus 45% pasokan sayuran segar harian ke Pasar Induk Kramat Jati Jakarta.",
        "Erupsi Slamet melumpuhkan sentra sayur Guci & Bambangan dan lumbung beras Banyumas-Tegal.",
        "Erupsi Kerinci melumpuhkan perkebunan teh Kayu Aro tertua di dunia dan sentra kayu manis Sumatra."
      ]
    },
    globalClimate: {
      title: "Anomali Iklim Global (Volcanic Winter & Aerosol SO₂)",
      description: "Untuk letusan berskala VEI ≥ 5 (seperti Tambora 1815, Krakatau 1883, atau Proyeksi Rinjani/Gede), jutaan ton gas belerang dioksida terinjeksi ke stratosfer.",
      effects: [
        "Pembentukan aerosol asam sulfat yang memantulkan sinar matahari kembali ke luar angkasa.",
        "Penurunan suhu rata-rata global sebesar 0,5°C hingga 1,5°C selama 1–3 tahun berturut-turut.",
        "Potensi fenomena 'Tahun Tanpa Musim Panas' (Year Without a Summer) dan gagal panen global."
      ]
    }
  },

  // Metafora Skala Dunia Nyata (Real-World Scale Metaphors)
  realWorldMetaphors: {
    columnHeight: (km) => {
      const everestHeight = 8.848;
      const timesEverest = (km / everestHeight).toFixed(1);
      const jetAltitude = 10;
      return {
        metric: `${km} KM ke Atmosfer`,
        metaphor: `Setara ${timesEverest} kali tinggi puncak Gunung Everest (Pesawat jet komersial terbang di ketinggian ${jetAltitude} KM).`
      };
    },
    tephraVolume: (km3) => {
      return {
        metric: `${km3} KM³ Material Erupsi`,
        metaphor: `Cukup untuk menimbun seluruh wilayah perkotaan DKI Jakarta atau Surabaya dengan lapisan abu vulkanik setinggi puluhan meter.`
      };
    }
  }
};
