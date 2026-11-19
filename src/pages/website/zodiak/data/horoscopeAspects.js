// Data Horoskop 3 Pilar: Asmara, Karir & Keuangan, Kesehatan

export const getHoroscopeAspects = (namaZodiak, elemen) => {
  const aspekByElemen = {
    Api: {
      asmara: {
        skor: 88,
        status: "Gairah Membara 🔥",
        prediksi: "Daya tarikmu sedang berada di level tertinggi. Bagi yang berpasangan, kejutan spontan akan mempererat ikatan. Bagi yang single, keberanian memulai percakapan pertama membuahkan hasil manis.",
        tips: "Hindari bersikap terlalu mendominasi dalam mengambil keputusan bersama."
      },
      karir: {
        skor: 85,
        status: "Peluang Kepemimpinan 💼",
        prediksi: "Inisiatif barumu dilirik oleh rekan atau atasan. Momentum tepat untuk mengajukan ide proyek berani atau menegosiasikan target masa depan.",
        tips: "Kelola pengeluaran impulsif hari ini, prioritaskan investasi jangka panjang."
      },
      kesehatan: {
        skor: 78,
        status: "Vitalitas Tinggi ⚡",
        prediksi: "Stamina fisik sangat prima, namun waspadai kelelahan otot akibat aktivitas berlebih atau kurang tidur.",
        tips: "Minum air mineral yang cukup dan luangkan waktu pendinginan setelah beraktivitas padat."
      }
    },
    Air: {
      asmara: {
        skor: 92,
        status: "Kedalaman Emosi 💖",
        prediksi: "Kepekaan intuisimu membantumu memahami perasaan pasangan tanpa banyak kata. Waktu yang sangat intim untuk percakapan dari hati ke hati.",
        tips: "Ekspresikan apa yang kamu rasakan, jangan biarkan asumsi membuatmu overthinking."
      },
      karir: {
        skor: 80,
        status: "Kreativitas Berlimpah 🎨",
        prediksi: "Proyek yang membutuhkan empati, desain, atau komunikasi interpersonal berjalan sangat lancar.",
        tips: "Tetapkan batasan kerja yang sehat agar energimu tidak terkuras oleh keluhan orang lain."
      },
      kesehatan: {
        skor: 84,
        status: "Ketenangan Jiwa 🌊",
        prediksi: "Kesehatan fisik bergantung pada kestabilan pikiran. Meditasi atau berada di dekat air memberi efek pemulihan luar biasa.",
        tips: "Kurangi paparan layar ponsel sebelum tidur untuk meningkatkan kualitas istirahat."
      }
    },
    Tanah: {
      asmara: {
        skor: 82,
        status: "Komitmen Stabil 💍",
        prediksi: "Hubungan terasa aman dan saling mendukung. Tindakan nyata dan perhatian sederhana lebih berharga daripada janji-janji manis hari ini.",
        tips: "Beranilah keluar sedikit dari zona nyaman untuk menciptakan kencan yang berkesan."
      },
      karir: {
        skor: 94,
        status: "Produktivitas Maksimal 📈",
        prediksi: "Ketelitian dan konsistensimu membuahkan apresiasi nyata. Arus kas stabil dan ada peluang kenaikan atau reward kerja keras.",
        tips: "Rencanakan diversifikasi tabungan atau catat ulang pos anggaran bulanan."
      },
      kesehatan: {
        skor: 80,
        status: "Fondasi Kuat 🌿",
        prediksi: "Kondisi tubuh stabil. Postur tubuh dan punggung butuh sedikit perhatian karena kebiasaan duduk lama.",
        tips: "Lakukan peregangan ringan setiap 2 jam dan konsumsi makanan berserat tinggi."
      }
    },
    Udara: {
      asmara: {
        skor: 86,
        status: "Obrolan Mengalir 💬",
        prediksi: "Humor dan obrolan cerdas menjadi magnet utama. Saling bertukar ide dan tertawa bersama membuat hubungan semakin seru dan tidak monoton.",
        tips: "Beri perhatian penuh saat mendengarkan pasangan berbicara."
      },
      karir: {
        skor: 90,
        status: "Jejaring & Ide Brilian 💡",
        prediksi: "Kemampuan diplomasimu menyelesaikan kebuntuan tim. Sangat bagus untuk pitching ide, presentasi, atau kolaborasi lintas divisi.",
        tips: "Tuliskan ide-ide yang muncul seketika agar tidak terlupakan di tengah kesibukan."
      },
      kesehatan: {
        skor: 76,
        status: "Keseimbangan Mental 🍃",
        prediksi: "Pikiran aktif bisa memicu stres jika tidak diimbangi relaksasi pernapasan. Udara segar akan sangat menyegarkan pikiranmu.",
        tips: "Jalan santai di luar ruangan atau dengarkan musik santai untuk meredakan ketegangan."
      }
    }
  };

  return aspekByElemen[elemen] || aspekByElemen["Api"];
};
