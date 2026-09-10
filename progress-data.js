/*
  ============================================================
  DATA PROGRESS KURAGETL
  Ganti angka "value" dengan nilai 0 sampai 100.
  Semua kartu, bar, dan rata-rata akan berubah otomatis.
  ============================================================
*/

window.KURAGE_PROGRESS = {
  updated: "11 September 2026",

  projects: [
    {
      id: "subahibi",
      title: "Subarashiki Hibi",
      jpTitle: "素晴らしき日々",
      engine: "BGI / Ethornell",
      platform: "Windows",
      phase: "Dalam pengerjaan",
      accent: "#ff6f7e",
      art: "sky",
      summary: "Terjemahan naskah, penyuntingan UI, dan penyesuaian engine untuk menjaga keterbacaan versi Windows.",
      milestone: "Rute utama dan sistem teks",
      categories: [
        { label: "Terjemahan", value: 72 },
        { label: "Editing", value: 46 },
        { label: "UI & Gambar", value: 70 },
        { label: "Engine", value: 88 },
        { label: "Quality Check", value: 28 }
      ]
    },
    {
      id: "teori-hampa",
      title: "Teori Hampa di Kastil yang Terisolasi",
      jpTitle: "孤城の空論",
      engine: "TyranoScript",
      platform: "Windows",
      phase: "Tahap penyuntingan",
      accent: "#7ee6cd",
      art: "castle",
      summary: "Lokalisasi naskah dan antarmuka dengan dialog natural, narasi rapi, serta struktur script yang tetap aman.",
      milestone: "Penyuntingan dan pemeriksaan dalam game",
      categories: [
        { label: "Terjemahan", value: 100 },
        { label: "Editing", value: 82 },
        { label: "UI & Gambar", value: 78 },
        { label: "Engine", value: 90 },
        { label: "Quality Check", value: 58 }
      ]
    }
  ],

  updates: [
    {
      date: "07 SEP 2026",
      title: "Subarashiki Hibi — sistem teks",
      text: "Word wrap, tanda baca, warna teks, dan posisi nama kembali diperiksa untuk edisi Anniversary."
    },
    {
      date: "01 SEP 2026",
      title: "Subarashiki Hibi — UI & engine",
      text: "Ukuran font, log, dan keterbacaan dialog disesuaikan agar mendekati tampilan edisi FHD."
    },
    {
      date: "23 AGU 2026",
      title: "Teori Hampa — penyuntingan naskah",
      text: "Dialog, narasi, menu, dan struktur tag TyranoScript masuk tahap pemeriksaan lanjutan."
    }
  ]
};
