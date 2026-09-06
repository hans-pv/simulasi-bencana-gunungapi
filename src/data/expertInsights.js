/**
 * Basis Pengetahuan 7 Pilar Ahli Lintas Disiplin
 * Erupsi Paroksismal & Mitigasi Cepat Bencana Vulkanik Indonesia
 * 1. Ahli Geologi & Vulkanologi
 * 2. Ahli Geodesi & Deformasi Kerak
 * 3. Ahli Seismologi & Geofisika
 * 4. Ahli Kimia Atmosfer & Toksikologi
 * 5. Ahli Klimatologi & Meteorologi
 * 6. Ahli Manajemen Evakuasi & BPBD
 * 7. Ahli Survival & Tanggap Medis Darurat
 */

export const EXPERT_CATEGORIES = [
  {
    id: "geology",
    name: "Ahli Geologi & Vulkanologi",
    shortTitle: "Geologi",
    roleTag: "Vulkanologi",
    icon: "Flame",
    color: "#ff3b30",
    badge: "Geologi Vulkanik & Magma",
    title: "Dinamika Dapur Magma, Aliran Piroklastik, & Kolaps Kaldera",
    summary: "Analisis mekanisme letusan freatomagmatik paroksismal, indeks letusan VEI, volume magma, dan pembentukan aliran piroklastik berkecepatan tinggi (PDCs).",
    keyPoints: [
      {
        heading: "Interaksi Freatomagmatik & Ledakan Paroksismal",
        desc: "Pemicu ledakan dahsyat adalah kontak mendadak antara air laut atau air danau kawah bervolume jutaan meter kubik dengan dapur magma silisik bersuhu >950°C. Hal ini menciptakan ekspansi uap instan dengan rasio 1:1.600 yang meledakkan badan gunung dan meruntuhkan kaldera.",
      },
      {
        heading: "Aliran Piroklastik Mengapung di Atas Air (PDCs)",
        desc: "Awan panas tidak tenggelam begitu membentur laut. Lapisan bawah awan panas menguapkan permukaan air laut seketika, membentuk bantalan uap (steam hover cushion) yang memungkinkan awan batu apung dan gas bersuhu 500°C meluncur melintasi laut hingga puluhan kilometer.",
      },
      {
        heading: "Indeks Letusan Vulkanik (VEI 4 hingga VEI 8)",
        desc: "Skala logaritmik volume tephra yang disemburkan: VEI 6 (Krakatau: 25 km³), VEI 7 (Tambora: 160 km³, Samalas: 40 km³), hingga super-erupsi VEI 8 (Toba: 2.800 km³) yang mampu mengubah bentang alam benua.",
      }
    ],
    recommendations: [
      "Pemantauan batimetri berkala pada dasar kaldera untuk mendeteksi inflasi dapur magma baru.",
      "Penetapan zona larangan total KRB III minimal radius 5-20 km tergantung skala indeks letusan VEI.",
      "Identifikasi komposisi kimia abu vulkanik untuk mengantisipasi potensi abrasi turbin pesawat terbang dan kerusakan tanaman pangan."
    ]
  },
  {
    id: "geodesy",
    name: "Ahli Geodesi & Deformasi Kerak",
    shortTitle: "Geodesi",
    roleTag: "InSAR & Kerak",
    icon: "Layers",
    color: "#af52de",
    badge: "Geodesi & Radar InSAR",
    title: "Deformasi Kerak Bumi, Pemantauan GNSS, & Subsidensi Kaldera",
    summary: "Pemantauan perubahan bentuk fisik gunung dan pergeseran lempeng kerak bumi menggunakan stasiun GNSS kontinu, satelit radar InSAR, dan sensor tiltmeter presisi.",
    keyPoints: [
      {
        heading: "Inflasi & Deflasi Tubuh Gunung Berapi",
        desc: "Sebelum letusan besar, desakan magma memicu pembengkakan (inflasi) lereng gunung yang dapat diukur hingga skala milimeter oleh tiltmeter dan stasiun GNSS. Pasca-letusan, deflasi dan kolaps kaldera memicu penurunan tanah (subsidence) masif.",
      },
      {
        heading: "Interferometri Radar Satelit (InSAR)",
        desc: "Citra radar satelit (Sentinel-1 / ALOS-2) memetakan perubahan elevasi permukaan tanah secara spasial, mengungkap rekahan cincin (ring fractures) dan bidang gelincir yang berpotensi memicu longsoran sektor tubuh gunung (flank collapse).",
      },
      {
        heading: "Pergeseran Garis Pantai & Pengangkatan Terumbu Karang",
        desc: "Erupsi kaldera laut memicu perubahan batimetri dan pergeseran garis pantai secara drastis, baik pengangkatan terumbu karang (uplift) maupun penenggelaman daratan pesisir.",
      }
    ],
    recommendations: [
      "Pemasangan stasiun GNSS kontinu multi-konstelasi di lereng kritis dan pulau-pulau vulkanik.",
      "Analisis time-series InSAR mingguan untuk mendeteksi akselerasi deformasi tubuh gunung menjelang letusan.",
      "Pemetaan batimetri resolusi tinggi pasca-erupsi untuk memperbarui peta keselamatan pelayaran navigasi laut."
    ]
  },
  {
    id: "seismology",
    name: "Ahli Seismologi & Geofisika",
    shortTitle: "Seismologi",
    roleTag: "Geofisika & MMI",
    icon: "Activity",
    color: "#ff9500",
    badge: "Seismologi & Akustik Infrasonik",
    title: "Gempa Vulkanik, Tremor Menerus, & Gelombang Kejut Infrasonik",
    summary: "Dampak getaran litosfer, swarm gempa vulkanik dalam/dangkal, serta propagasi gelombang kejut akustik-infrasonik yang mampu mengelilingi atmosfer bumi.",
    keyPoints: [
      {
        heading: "Dentuman Akustik Supersonik & Gelombang Tekanan Barometrik",
        desc: "Ledakan paroksismal menghasilkan tingkat tekanan suara >300 dB pada sumbernya. Gelombang infrasonik frekuensi rendah mampu merambat ribuan kilometer dan mengitari atmosfer bumi hingga berulang kali sebelum energinya terdisipasi.",
      },
      {
        heading: "Swarm Gempa Vulkanik (VA & VB) & Tremor Harmonik",
        desc: "Migrasi fluida magma dan gas membuka retakan batuan kerak bumi, menghasilkan gempa frekuensi tinggi (VA) disusul gempa frekuensi rendah dan tremor harmonik yang menandakan magma telah mencapai leher kawah.",
      },
      {
        heading: "Skala Intensitas Kerusakan Seismik (MMI V hingga X)",
        desc: "Meskipun bukan gempa tektonik megathrust, keruntuhan kaldera dan ledakan magma dangkal dapat membangkitkan getaran setara magnitudo M 6.5–7.5 yang meruntuhkan bangunan dalam radius puluhan kilometer.",
      }
    ],
    recommendations: [
      "Integrasi seismometer broadband 3-komponen dengan sensor mikrobarometer infrasonik (CTBTO).",
      "Penerapan algoritma deteksi otomatis tremor vulkanik kontinu sebagai pemicu sirine peringatan dini.",
      "Protokol mitigasi barotrauma telinga bagi warga yang berada dalam radius 100 km dari pusat letusan."
    ]
  },
  {
    id: "chemistry",
    name: "Ahli Kimia Atmosfer & Toksikologi",
    shortTitle: "Kimia Gas",
    roleTag: "Toksikologi",
    icon: "Zap",
    color: "#30d158",
    badge: "Kimia Gas & Toksikologi",
    title: "Gas Beracun (SO2, H2S, HF), Pecahan Abu Silika, & Hujan Asam",
    summary: "Komposisi kimiawi magma dan gas vulkanik, toksisitas aerosol asam, kristal kaca mikroskopis tajam, serta dampaknya terhadap kontaminasi sumber air minum.",
    keyPoints: [
      {
        heading: "Gas Vulkanik Mematikan (SO2, H2S, CO2, & HF)",
        desc: "Sulfur dioksida (SO2) dan asam fluorida (HF) bersifat sangat korosif terhadap saluran pernapasan. Gas karbon dioksida (CO2) yang lebih berat dari udara mengendap di cekungan lembah dan dapat mencekik manusia seketika tanpa peringatan visual.",
      },
      {
        heading: "Abu Silika Kaca Bersudut Runcing (Glass-Shard Tephra)",
        desc: "Abu vulkanik bukanlah abu kayu lembut, melainkan pecahan mikroskopis kaca silika (SiO2) bersudut sangat tajam. Menghirup partikel ini dapat merobek dinding alveolus paru-paru dan menyebabkan silikosis akut.",
      },
      {
        heading: "Hujan Asam Korosif & Kontaminasi Air",
        desc: "Gas belerang dan halogen bereaksi dengan uap air membentuk asam sulfat (H2SO4) dan asam klorida (HCl). Air sumur dan tandon terbuka akan terkontaminasi asam pekat serta logam berat terlarut.",
      }
    ],
    recommendations: [
      "Wajib menggunakan masker partikulat berspesifikasi N95 atau respirator P100 (bukan masker kain biasa).",
      "Penyegelan seluruh tandon penampungan air minum sebelum partikel abu vulkanik turun.",
      "Larangan mengonsumsi hasil panen tanaman dan air permukaan yang terpapar hujan abu tanpa dicuci bersih."
    ]
  },
  {
    id: "climatology",
    name: "Ahli Klimatologi & Meteorologi",
    shortTitle: "Klimatologi",
    roleTag: "Aerosol & Iklim",
    icon: "CloudRain",
    color: "#007aff",
    badge: "Iklim Global & Pola Angin",
    title: "Aerosol Stratosfer, Musim Dingin Vulkanik, & Pola Angin Monsun",
    summary: "Injeksi gas belerang ke stratosfer, pembentukan kabut aerosol pendingin bumi (volcanic winter), serta simulasi trajektori arah sebaran abu mengikuti angin Muson Barat dan Timur.",
    keyPoints: [
      {
        heading: "Pendinginan Global & Fenomena 'Volcanic Winter'",
        desc: "Letusan VEI 6+ menginjeksikan puluhan juta ton SO2 ke lapisan stratosfer (>20 km). Aerosol asam sulfat yang terbentuk memantulkan radiasi sinar matahari kembali ke luar angkasa, memicu penurunan temperatur bumi 0.5°C hingga 3°C selama 1–3 tahun.",
      },
      {
        heading: "Pengaruh Pola Angin Muson Barat vs Muson Timur",
        desc: "Pada Muson Barat (November–Maret), abu vulkanik terbawa ke arah Timur/Tenggara melintasi pulau-pulau padat penduduk. Pada Muson Timur (Mei–September), trajektori abu berbelok ke arah Barat/Barat Laut menuju Samudra Hindia.",
      },
      {
        heading: "Kegelapan Siang Hari (Solar Blackout)",
        desc: "Konsentrasi partikel abu tebal di atmosfer memblokir 90-100% sinar matahari langsung, memicu kegelapan total seperti tengah malam di siang bolong dan penurunan suhu mikro lokal hingga 5°C.",
      }
    ],
    recommendations: [
      "Simulasi lintasan trajektori abu harian menggunakan model dispersi atmosfer (HYSPLIT / VAAC).",
      "Rencana kontinjensi ketahanan cadangan beras nasional menghadapi ancaman anomali iklim gagal panen 3 tahun.",
      "Proteksi jaringan transmisi listrik dan panel surya dari tutupan debu korosif."
    ]
  },
  {
    id: "evacuation",
    name: "Ahli Manajemen Evakuasi & BPBD",
    shortTitle: "Evakuasi",
    roleTag: "SOP BPBD",
    icon: "AlertTriangle",
    color: "#ff453a",
    badge: "SOP BPBD & Evakuasi",
    title: "Golden Time, Koridor Evakuasi, & Tempat Evakuasi Sementara (TES)",
    summary: "Kalkulasi batas waktu emas penyelamatan nyawa (Golden Time), zonasi KRB I-III, pemilihan rute darurat memotong punggung bukit, serta elevasi aman dari gelombang tsunami dan awan panas.",
    keyPoints: [
      {
        heading: "Batas Waktu Emas (Golden Time) Pesisir & Lereng",
        desc: "Untuk tsunami vulkanik, jendela evakuasi hanya 15 hingga 45 menit sejak terdengar dentuman kolosal. Untuk awan panas (PDC), evakuasi wajib preventif saat status Siaga/Awas; mustahil lari dari awan panas 150 km/jam saat letusan berlangsung.",
      },
      {
        heading: "Elevasi Minimum Aman Tsunami (>35–50 mdpl)",
        desc: "Run-up tsunami vulkanik dapat melompat setinggi 30–42 meter di perairan sempit (efek corong). Menyelamatkan diri ke lantai 2 atau 3 bangunan pesisir terbukti fatal; wajib naik ke perbukitan dengan elevasi >40 mdpl.",
      },
      {
        heading: "Larangan Keras Mengungsi Menyusuri Alur Sungai",
        desc: "Lembah dan alur sungai bertindak sebagai jalan tol bagi luncuran awan panas, lahar letusan, dan gelombang tsunami. Jalur evakuasi wajib tegak lurus garis pantai dan memotong punggung bukit.",
      }
    ],
    recommendations: [
      "Pemasangan rambu rute evakuasi mandiri berpendar fosfor di setiap permukiman pesisir dan lereng gunung.",
      "Penetapan Tempat Evakuasi Sementara (TES) di perbukitan aman yang dilengkapi suplai logistik darurat 14 hari.",
      "Latihan simulasi evakuasi mandiri (tsunami & lahar drill) berkala untuk seluruh komunitas desa rawan."
    ]
  },
  {
    id: "survival",
    name: "Ahli Survival & Tanggap Medis",
    shortTitle: "Survival",
    roleTag: "72 Jam & Medis",
    icon: "ShieldAlert",
    color: "#ffd60a",
    badge: "Survival 72 Jam & Medis",
    title: "Tas Siaga Bencana 72 Jam, Teknik Barotrauma, & Proteksi Paru-Paru",
    summary: "Protokol bertahan hidup mandiri 72 jam pertama saat bantuan eksternal belum tiba: teknik mencegah pecah gendang telinga, dekontaminasi mata, perlindungan napas, dan purifikasi air.",
    keyPoints: [
      {
        heading: "Teknik Menghindari Barotrauma Ledakan Akustik",
        desc: "Saat gelombang kejut dentuman supersonik mendekat: segera buka mulut selebar-lebarnya, tundukkan kepala, dan tutup kedua telinga dengan telapak tangan rapat-rapat. Hal ini menyeimbangkan tekanan udara di dalam rongga telinga tengah melalui tuba eustachius.",
      },
      {
        heading: "Tas Siaga Bencana (Bug-Out Bag) 72 Jam",
        desc: "Tas ransel tahan air berisi: masker N95/respirator P100, kacamata goggle kedap udara, senter bertenaga baterai, radio darurat, peluit nyaring, tablet pemurni air, makanan siap santap kaleng tinggi kalori, dan salinan dokumen penting.",
      },
      {
        heading: "Pertolongan Pertama Paparan Abu & Dekontaminasi Mata",
        desc: "Jangan pernah mengucek mata yang terkena abu vulkanik! Partikel silika tajam akan menggores kornea permanen. Bilas mata dengan air bersih mengalir atau larutan saline secara perlahan.",
      }
    ],
    recommendations: [
      "Simpan tas siaga bencana 72 jam di dekat pintu keluar rumah yang mudah dijangkau saat panik.",
      "Jika terjebak tanpa masker medis, basahi kain katun tebal dengan air bersih untuk menyaring gas asam dan abu.",
      "Tutup seluruh celah ventilasi rumah dengan kain basah dan lakban tebal saat hujan abu lebat turun."
    ]
  }
];
