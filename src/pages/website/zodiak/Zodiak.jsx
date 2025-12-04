import React, { useState, useEffect, useRef } from "react";
// ...existing code...
import zodiakData from "./data/data.json";

export default function Zodiak() {
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState("");
  const [zodiak, setZodiak] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedZodiak, setSelectedZodiak] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [numerologyData, setNumerologyData] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const inputRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);

  // Generate session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem('zodiakSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      setSessionId(newSessionId);
      localStorage.setItem('zodiakSessionId', newSessionId);
    }
  }, []);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem(`zodiakUserData_${sessionId}`);
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData && parsedData.nama && parsedData.zodiak) {
          setUserData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, [sessionId]);

  // Fokus ke input saat kembali ke grid
  useEffect(() => {
    if (viewMode === "grid" && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [viewMode]);

  // 🧩 Ambil tanggal dari teks — lebih toleran
  const extractDate = (text) => {
    const months = {
      januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
      juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12
    };
    
    // Format: DD/MM/YYYY atau DD-MM-YYYY
    const dateFormat = text.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
    if (dateFormat) {
      const day = parseInt(dateFormat[1]);
      const month = parseInt(dateFormat[2]);
      const year = parseInt(dateFormat[3]);
      return new Date(year, month - 1, day);
    }
    
    // Format: "17 Mei 2001" atau "17 Mei"
    const match = text.match(/(\d{1,2})\s+([A-Za-z]+)\s*(\d{2,4})?/i);
    if (match) {
      const day = parseInt(match[1]);
      const monthName = match[2].toLowerCase();
      const month = months[monthName];
      if (month) {
        const year = match[3] ? parseInt(match[3]) : 2000;
        return new Date(year, month - 1, day);
      }
    }
    
    return null;
  };

  // 🔮 Tentukan zodiak dari tanggal lahir
  const getZodiakByDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    // Mapping untuk zodiak (tanggal Gregorian)
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
    
    return null;
  };

  // 💡 Analisis huruf pertama (Numerologi sederhana)
  const karakterNama = {
    A: { sifat: "Ambisius dan visioner", angka: 1, elemen: "Api", simbol: "💼", deskripsi: "Pemimpin alami dengan visi yang jelas" },
    B: { sifat: "Bijaksana dan penyayang", angka: 2, elemen: "Air", simbol: "💖", deskripsi: "Menyukai harmoni dan kedamaian" },
    C: { sifat: "Kreatif dan penuh ide", angka: 3, elemen: "Udara", simbol: "🎨", deskripsi: "Pemikir kreatif dengan banyak solusi" },
    D: { sifat: "Disiplin dan tegas", angka: 4, elemen: "Tanah", simbol: "⚔️", deskripsi: "Berfokus pada tujuan dan praktis" },
    E: { sifat: "Ekspresif dan ramah", angka: 5, elemen: "Api", simbol: "😄", deskripsi: "Sosial dan penuh energi positif" },
    F: { sifat: "Friendly dan lembut", angka: 6, elemen: "Air", simbol: "💫", deskripsi: "Mudah bergaul dan memahami orang lain" },
    G: { sifat: "Gigih dan pekerja keras", angka: 7, elemen: "Tanah", simbol: "🔥", deskripsi: "Pantang menyerah dan berdedikasi" },
    H: { sifat: "Humble tapi kuat", angka: 8, elemen: "Api", simbol: "💪", deskripsi: "Sederhana namun memiliki kekuatan dalam" },
    I: { sifat: "Intuitif dan imajinatif", angka: 9, elemen: "Air", simbol: "🌙", deskripsi: "Memiliki indra keenam yang tajam" },
    J: { sifat: "Jujur dan berjiwa pemimpin", angka: 1, elemen: "Api", simbol: "🦁", deskripsi: "Integritas tinggi dengan jiwa kepemimpinan" },
    K: { sifat: "Kharismatik dan misterius", angka: 2, elemen: "Udara", simbol: "🕶️", deskripsi: "Memiliki daya tarik yang unik" },
    L: { sifat: "Loyal dan elegan", angka: 3, elemen: "Air", simbol: "👑", deskripsi: "Setia dan memiliki selera tinggi" },
    M: { sifat: "Mandiri dan fokus", angka: 4, elemen: "Tanah", simbol: "🎯", deskripsi: "Tidak tergantung pada orang lain" },
    N: { sifat: "Natural dan penyayang", angka: 5, elemen: "Air", simbol: "🌿", deskripsi: "Mencintai alam dan makhluk hidup" },
    O: { sifat: "Optimis dan suka petualangan", angka: 6, elemen: "Api", simbol: "🏹", deskripsi: "Selalu melihat sisi positif" },
    P: { sifat: "Perfeksionis tapi romantis", angka: 7, elemen: "Air", simbol: "💞", deskripsi: "Mencari kesempurnaan dalam hubungan" },
    Q: { sifat: "Quiet tapi tajam", angka: 8, elemen: "Udara", simbol: "🧠", deskripsi: "Diam-diam tetapi observatif" },
    R: { sifat: "Ramah dan dapat dipercaya", angka: 9, elemen: "Tanah", simbol: "🤝", deskripsi: "Tempat curhat yang terpercaya" },
    S: { sifat: "Sensitif tapi tangguh", angka: 1, elemen: "Air", simbol: "💎", deskripsi: "Perasa namun tidak mudah patah" },
    T: { sifat: "Tegas dan berpikiran maju", angka: 2, elemen: "Api", simbol: "🚀", deskripsi: "Memiliki prinsip yang kuat" },
    U: { sifat: "Unik dan suka kebebasan", angka: 3, elemen: "Udara", simbol: "🦋", deskripsi: "Menghargai kebebasan berekspresi" },
    V: { sifat: "Visioner dan percaya diri", angka: 4, elemen: "Api", simbol: "💫", deskripsi: "Mampu melihat masa depan" },
    W: { sifat: "Wise dan berwawasan luas", angka: 5, elemen: "Udara", simbol: "🌍", deskripsi: "Bijaksana dan berpengetahuan" },
    X: { sifat: "Xtra kreatif dan energik", angka: 6, elemen: "Api", simbol: "⚡", deskripsi: "Kreativitas luar biasa dengan energi tinggi" },
    Y: { sifat: "Young at heart", angka: 7, elemen: "Air", simbol: "❤️", deskripsi: "Selalu bersemangat seperti anak muda" },
    Z: { sifat: "Zesty dan spontan", angka: 8, elemen: "Api", simbol: "🔥", deskripsi: "Penuh semangat dan tindakan tak terduga" }
  };

  const moodHarian = [
    { mood: "Penuh semangat memulai minggu", energi: "Tinggi", simbol: "💪", warna: "from-red-400 to-orange-400" },
    { mood: "Cocok buat refleksi diri", energi: "Rendah", simbol: "💭", warna: "from-blue-400 to-indigo-400" },
    { mood: "Energi sosialmu tinggi", energi: "Sedang", simbol: "🤝", warna: "from-green-400 to-teal-400" },
    { mood: "Waktu tenang buat recharge", energi: "Rendah", simbol: "🔋", warna: "from-purple-400 to-pink-400" },
    { mood: "Kreativitasmu lagi deras", energi: "Tinggi", simbol: "🎨", warna: "from-yellow-400 to-orange-400" },
    { mood: "Healing mode on", energi: "Sedang", simbol: "😌", warna: "from-emerald-400 to-cyan-400" },
    { mood: "Nikmati hasil kerja kerasmu", energi: "Tinggi", simbol: "🌟", warna: "from-amber-400 to-yellow-400" }
  ];

  // 🔢 Hitung numerologi lengkap
  const hitungNumerologi = (nama, tanggalLahir) => {
    if (!nama || !tanggalLahir) {
      return {
        angkaHidup: 5,
        angkaTakdir: 5,
        deskripsiAngkaHidup: "Belum dihitung",
        deskripsiAngkaTakdir: "Belum dihitung",
        elemenNama: "Netral",
        energiNama: 50
      };
    }

    // Hitung dari nama
    const namaAngka = nama.toUpperCase().split('').reduce((acc, char) => {
      const angka = karakterNama[char]?.angka || 0;
      return acc + angka;
    }, 0);
    
    const angkaHidup = (namaAngka % 9) || 9;
    
    // Hitung dari tanggal lahir
    const tgl = tanggalLahir.getDate();
    const bln = tanggalLahir.getMonth() + 1;
    const thn = tanggalLahir.getFullYear();
    
    const tglAngka = String(tgl).split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const blnAngka = String(bln).split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const thnAngka = String(thn).split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const angkaTakdir = (tglAngka + blnAngka + thnAngka) % 9 || 9;
    
    // Deskripsi angka
    const deskripsiAngka = {
      1: { 
        judul: "Pemimpin Alami", 
        deskripsi: "Karismatik, mandiri, berani mengambil inisiatif, dan memiliki jiwa kepemimpinan yang kuat."
      },
      2: { 
        judul: "Diplomat Ulung", 
        deskripsi: "Sensitif, kooperatif, penyayang, dan mampu menjadi penengah dalam berbagai situasi."
      },
      3: { 
        judul: "Kreator Ekspresif", 
        deskripsi: "Kreatif, komunikatif, optimis, dan penuh dengan ide-ide inovatif."
      },
      4: { 
        judul: "Pembangun Stabil", 
        deskripsi: "Praktis, disiplin, pekerja keras, dan memiliki fondasi yang kuat dalam segala hal."
      },
      5: { 
        judul: "Petualang Bebas", 
        deskripsi: "Adaptif, penuh rasa ingin tahu, suka kebebasan, dan selalu mencari pengalaman baru."
      },
      6: { 
        judul: "Perawat Harmoni", 
        deskripsi: "Bertanggung jawab, harmonis, penyayang, dan selalu mengutamakan keseimbangan."
      },
      7: { 
        judul: "Pencari Kebenaran", 
        deskripsi: "Analitis, spiritual, intelektual, dan selalu mencari makna di balik segala sesuatu."
      },
      8: { 
        judul: "Penguasa Sukses", 
        deskripsi: "Ambisius, berwibawa, fokus pada pencapaian, dan memiliki kemampuan manajerial yang baik."
      },
      9: { 
        judul: "Humanis Ideal", 
        deskripsi: "Berjiwa sosial, idealis, penuh welas asih, dan peduli pada kemanusiaan."
      }
    };
    
    // Energi nama (1-100)
    const energiNama = Math.min((namaAngka * 2) % 100, 100);
    
    return {
      angkaHidup,
      angkaTakdir,
      deskripsiAngkaHidup: deskripsiAngka[angkaHidup]?.deskripsi || "Tidak tersedia",
      deskripsiAngkaTakdir: deskripsiAngka[angkaTakdir]?.deskripsi || "Tidak tersedia",
      judulAngkaHidup: deskripsiAngka[angkaHidup]?.judul || "Tidak tersedia",
      judulAngkaTakdir: deskripsiAngka[angkaTakdir]?.judul || "Tidak tersedia",
      elemenNama: karakterNama[nama[0]?.toUpperCase()]?.elemen || "Netral",
      energiNama,
      tglLahir: `${tgl}/${bln}/${thn}`,
      analisisLengkap: `Nama "${nama}" memiliki angka hidup ${angkaHidup} (${deskripsiAngka[angkaHidup]?.judul}) dan angka takdir ${angkaTakdir} (${deskripsiAngka[angkaTakdir]?.judul}) berdasarkan tanggal lahir ${tgl}/${bln}/${thn}.`
    };
  };

  // 💫 Analisis kompatibilitas detail
  const analisisKompatibilitas = (zodiakUser, zodiakLain) => {
    const dataUser = zodiakData.find(z => z.nama === zodiakUser);
    const dataLain = zodiakData.find(z => z.nama === zodiakLain);
    
    if (!dataUser || !dataLain) return null;
    
    // Cek kecocokan
    const kecocokanTerbaik = dataUser.kecocokan_terbaik.includes(zodiakLain);
    const kecocokanMenengah = dataUser.kecocokan_menengah.includes(zodiakLain);
    
    // Analisis elemen
    const elemenKompatibel = {
      Api: ["Api", "Udara"],
      Air: ["Air", "Tanah"],
      Tanah: ["Tanah", "Air", "Api"],
      Udara: ["Udara", "Api", "Air"]
    };
    
    const elemenMatch = elemenKompatibel[dataUser.elemen]?.includes(dataLain.elemen);
    
    // Skor kompatibilitas (0-100)
    let skor = 50; // Base score
    
    if (kecocokanTerbaik) skor += 30;
    else if (kecocokanMenengah) skor += 15;
    
    if (elemenMatch) skor += 20;
    if (dataUser.elemen === dataLain.elemen) skor += 15;
    
    // Tambahkan bonus/penalti berdasarkan kualitas
    if (dataUser.kualitas === dataLain.kualitas) skor += 10;
    
    // Pastikan skor antara 0-100
    skor = Math.max(0, Math.min(100, skor));
    
    // Kekuatan dan kelemahan hubungan
    const kekuatan = [];
    const kelemahan = [];
    const tips = [];
    
    if (kecocokanTerbaik) {
      kekuatan.push("Pasangan yang sangat cocok secara astrologi");
      kekuatan.push("Kemungkinan hubungan yang harmonis dan saling memahami");
      tips.push("Jaga komunikasi yang terbuka untuk memperkuat hubungan ini");
    }
    
    if (elemenMatch) {
      kekuatan.push("Elemen saling mendukung dan melengkapi");
      tips.push("Manfaatkan energi elemen yang kompatibel untuk proyek bersama");
    }
    
    if (dataUser.elemen === dataLain.elemen) {
      kekuatan.push("Memahami karakter satu sama lain dengan baik");
      tips.push("Gunakan kesamaan elemen untuk membangun kedekatan yang lebih dalam");
    }
    
    if (!kecocokanTerbaik && !kecocokanMenengah) {
      kelemahan.push("Membutuhkan penyesuaian dan kompromi lebih banyak");
      tips.push("Fokus pada kesamaan nilai dan tujuan untuk membangun hubungan");
    }
    
    if (dataUser.elemen !== dataLain.elemen && !elemenMatch) {
      kelemahan.push("Perbedaan karakter yang mungkin menantang");
      tips.push("Hargai perbedaan sebagai kekuatan dan peluang belajar");
    }
    
    // Level kompatibilitas
    let level = "";
    let levelColor = "";
    
    if (skor >= 80) {
      level = "Sangat Cocok";
      levelColor = "text-green-400";
    } else if (skor >= 60) {
      level = "Cukup Cocok";
      levelColor = "text-yellow-400";
    } else if (skor >= 40) {
      level = "Netral";
      levelColor = "text-blue-400";
    } else {
      level = "Perlu Penyesuaian";
      levelColor = "text-red-400";
    }
    
    return {
      skor,
      level,
      levelColor,
      elemenMatch,
      kekuatan,
      kelemahan,
      tips,
      deskripsi: `Hubungan antara ${zodiakUser} (${dataUser.elemen}) dan ${zodiakLain} (${dataLain.elemen})`,
      elemenUser: dataUser.elemen,
      elemenLain: dataLain.elemen
    };
  };

  // 🌟 Skor kosmis berdasarkan karakteristik zodiak
  const hitungSkorKosmis = (zodiakData, numerology, tanggalLahir) => {
    let skor = 50; // Skor dasar
    
    if (!zodiakData || !numerology) return skor;
    
    // Bonus berdasarkan elemen zodiak
    const bonusElemen = {
      Api: { min: 10, max: 25, nama: "Energi Api" },
      Air: { min: 5, max: 20, nama: "Kedalaman Air" },
      Tanah: { min: 8, max: 22, nama: "Stabilitas Tanah" },
      Udara: { min: 7, max: 18, nama: "Kecerdasan Udara" }
    };
    
    const bonus = bonusElemen[zodiakData.elemen];
    if (bonus) {
      const bonusValue = Math.floor(Math.random() * (bonus.max - bonus.min + 1)) + bonus.min;
      skor += bonusValue;
    }
    
    // Bonus berdasarkan kualitas
    const bonusKualitas = {
      Cardinal: { value: 15, nama: "Inisiatif Cardinal" },
      Fixed: { value: 10, nama: "Keteguhan Fixed" },
      Mutable: { value: 5, nama: "Fleksibilitas Mutable" }
    };
    
    const kualitasBonus = bonusKualitas[zodiakData.kualitas];
    if (kualitasBonus) {
      skor += kualitasBonus.value;
    }
    
    // Bonus berdasarkan angka hidup numerologi
    skor += (numerology.angkaHidup || 5) * 2;
    
    // Bonus berdasarkan hari keberuntungan
    const hariSekarang = new Date().toLocaleString('id-ID', { weekday: 'long' }).toLowerCase();
    const hariKeberuntungan = zodiakData.hari_keberuntungan?.toLowerCase() || "";
    if (hariSekarang.includes(hariKeberuntungan)) {
      skor += 20;
    }
    
    // Bonus berdasarkan fase bulan
    const faseBulanBonus = {
      "Bulan Baru": { value: 10, nama: "Awal Baru" },
      "Bulan Sabit": { value: 5, nama: "Pertumbuhan" },
      "Bulan Separuh": { value: 8, nama: "Keseimbangan" },
      "Bulan Purnama": { value: 15, nama: "Puncak Energi" }
    };
    
    const faseBonus = faseBulanBonus[zodiakData.fase_bulan];
    if (faseBonus) {
      skor += faseBonus.value;
    }
    
    // Bonus berdasarkan musim
    const musimBonus = {
      "Musim Semi": 5,
      "Musim Panas": 8,
      "Musim Gugur": 7,
      "Musim Dingin": 6
    };
    
    skor += musimBonus[zodiakData.musim] || 0;
    
    // Normalisasi ke 1-100
    skor = Math.max(1, Math.min(100, skor));
    
    // Deskripsi skor
    let deskripsiSkor = "";
    let emojiSkor = "";
    
    if (skor >= 90) {
      deskripsiSkor = "Energi kosmismu sedang di puncak! Hari ini adalah waktu terbaik untuk mengambil tindakan besar.";
      emojiSkor = "⚡🔥";
    } else if (skor >= 75) {
      deskripsiSkor = "Energi optimal untuk produktivitas dan kreativitas. Manfaatkan dengan baik!";
      emojiSkor = "✨🌟";
    } else if (skor >= 60) {
      deskripsiSkor = "Hari yang seimbang dan stabil. Cocok untuk aktivitas rutin dan perencanaan.";
      emojiSkor = "🌿🌈";
    } else if (skor >= 40) {
      deskripsiSkor = "Energi sedang dalam fase istirahat. Waktu yang tepat untuk refleksi dan perenungan.";
      emojiSkor = "🌙💭";
    } else {
      deskripsiSkor = "Waktunya merawat diri dan mengumpulkan energi baru. Istirahat yang cukup.";
      emojiSkor = "🛌💫";
    }
    
    return {
      nilai: skor,
      deskripsi: deskripsiSkor,
      emoji: emojiSkor,
      warna: skor >= 80 ? "from-green-500 to-emerald-500" :
             skor >= 60 ? "from-yellow-500 to-amber-500" :
             skor >= 40 ? "from-blue-500 to-cyan-500" :
             "from-purple-500 to-pink-500"
    };
  };

  // 📊 Analisis kepribadian mendalam
  const analisisKepribadian = (zodiakData, numerology) => {
    if (!zodiakData || !numerology) {
      return {
        intelektual: 50,
        emosional: 50,
        sosial: 50,
        spiritual: 50,
        fisik: 50,
        deskripsi: "Analisis kepribadian belum tersedia"
      };
    }
    
    const analisis = {
      intelektual: 50,
      emosional: 50,
      sosial: 50,
      spiritual: 50,
      fisik: 50
    };
    
    // Berdasarkan elemen zodiak
    switch(zodiakData.elemen) {
      case "Api":
        analisis.intelektual += 15;
        analisis.sosial += 25;
        analisis.fisik += 20;
        analisis.emosional += 10;
        break;
      case "Air":
        analisis.emosional += 25;
        analisis.spiritual += 20;
        analisis.intelektual += 15;
        analisis.sosial += 10;
        break;
      case "Tanah":
        analisis.intelektual += 20;
        analisis.fisik += 15;
        analisis.emosional += 10;
        analisis.spiritual += 5;
        break;
      case "Udara":
        analisis.intelektual += 25;
        analisis.sosial += 20;
        analisis.spiritual += 15;
        analisis.fisik += 10;
        break;
    }
    
    // Berdasarkan kualitas
    switch(zodiakData.kualitas) {
      case "Cardinal":
        analisis.intelektual += 10;
        analisis.sosial += 8;
        analisis.fisik += 5;
        break;
      case "Fixed":
        analisis.emosional += 12;
        analisis.spiritual += 8;
        analisis.intelektual += 5;
        break;
      case "Mutable":
        analisis.sosial += 10;
        analisis.intelektual += 8;
        analisis.emosional += 5;
        break;
    }
    
    // Berdasarkan numerologi
    analisis.intelektual += (numerology.angkaHidup || 5);
    analisis.spiritual += (numerology.angkaTakdir || 5);
    analisis.emosional += (numerology.energiNama || 50) / 10;
    
    // Normalisasi ke 1-100
    Object.keys(analisis).forEach(key => {
      analisis[key] = Math.max(1, Math.min(100, Math.round(analisis[key])));
    });
    
    // Deskripsi umum
    const deskripsi = `Sebagai ${zodiakData.nama} (${zodiakData.elemen}), kepribadianmu didominasi oleh ${
      analisis.intelektual >= 70 ? "kecerdasan dan logika" :
      analisis.emosional >= 70 ? "emosi dan empati" :
      analisis.sosial >= 70 ? "keterampilan sosial" :
      analisis.spiritual >= 70 ? "spiritualitas dan intuisi" :
      "keseimbangan dalam berbagai aspek"
    }.`;
    
    return {
      ...analisis,
      deskripsi,
      warna: {
        intelektual: "from-blue-500 to-cyan-500",
        emosional: "from-purple-500 to-pink-500",
        sosial: "from-green-500 to-emerald-500",
        spiritual: "from-indigo-500 to-violet-500",
        fisik: "from-red-500 to-orange-500"
      }
    };
  };

  // 🎯 Analisis hubungan elemen
  const analisisHubunganElemen = (elemenUser, elemenLain) => {
    const hubungan = {
      Api: {
        Api: "Api bertemu Api: Energi yang membara dan penuh semangat. Hubungan yang intens namun perlu kontrol emosi.",
        Air: "Api bertemu Air: Hubungan yang menantang. Api bisa memanaskan Air, Air bisa memadamkan Api. Butuh keseimbangan.",
        Tanah: "Api bertemu Tanah: Api membakar Tanah menjadi lebih subur. Hubungan yang produktif dan saling melengkapi.",
        Udara: "Api bertemu Udara: Udara meniup Api menjadi lebih besar. Hubungan yang dinamis dan saling mendukung."
      },
      Air: {
        Api: "Air bertemu Api: Lihat 'Api bertemu Air'",
        Air: "Air bertemu Air: Kedalaman emosi yang sama. Hubungan yang penuh pengertian namun berisiko tenggelam dalam perasaan.",
        Tanah: "Air bertemu Tanah: Air menyuburkan Tanah. Hubungan yang stabil dan saling menguatkan.",
        Udara: "Air bertemu Udara: Udara menggerakkan Air. Hubungan yang penuh inspirasi dan ide-ide segar."
      },
      Tanah: {
        Api: "Tanah bertemu Api: Lihat 'Api bertemu Tanah'",
        Air: "Tanah bertemu Air: Lihat 'Air bertemu Tanah'",
        Tanah: "Tanah bertemu Tanah: Fondasi yang kokoh dan stabil. Hubungan yang dapat diandalkan namun perlu variasi.",
        Udara: "Tanah bertemu Udara: Udara mengeringkan Tanah. Butuh usaha ekstra untuk memahami perbedaan karakter."
      },
      Udara: {
        Api: "Udara bertemu Api: Lihat 'Api bertemu Udara'",
        Air: "Udara bertemu Air: Lihat 'Air bertemu Udara'",
        Tanah: "Udara bertemu Tanah: Lihat 'Tanah bertemu Udara'",
        Udara: "Udara bertemu Udara: Bebas dan penuh ide. Hubungan yang intelektual namun perlu grounding."
      }
    };
    
    return hubungan[elemenUser]?.[elemenLain] || "Analisis hubungan elemen tidak tersedia";
  };

  const handleCek = () => {
    if (!input.trim()) {
      alert("Silakan masukkan nama dan tanggal lahir Anda!");
      return;
    }
    
    setLoading(true);
    setZodiak(null);
    setViewMode("detail");
    setActiveTab("profile");

    setTimeout(() => {
      try {
        const words = input.trim().split(" ");
        const fillerWords = ["namaku", "nama", "saya", "aku", "lahir", "lahirnya", "tanggal", "tgl", "born", "birth"];
        
        // Cari nama (kata pertama yang bukan filler word dan bukan angka/tanggal)
        let nama = "";
        for (let word of words) {
          const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
          if (cleanWord && !fillerWords.includes(cleanWord) && !/\d/.test(word)) {
            nama = word;
            break;
          }
        }
        
        // Jika tidak ditemukan nama, ambil kata pertama
        if (!nama && words.length > 0) {
          nama = words[0];
        }
        
        const tanggalLahir = extractDate(input);

        if (!tanggalLahir) {
          setZodiak({
            error: true,
            message: "⚠️ Tidak dapat mengenali tanggal lahir. Contoh format: 'Namaku Rina lahir 17 Mei 2001' atau '17/05/2001'"
          });
          setLoading(false);
          return;
        }

        const namaZodiak = getZodiakByDate(tanggalLahir);
        const data = zodiakData.find((z) => z.nama === namaZodiak);
        
        if (!data) {
          setZodiak({
            error: true,
            message: "⚠️ Tidak dapat menemukan zodiak untuk tanggal tersebut. Pastikan tanggal lahir valid."
          });
          setLoading(false);
          return;
        }

        const hurufAwal = nama.trim().charAt(0).toUpperCase();
        const namaAnalisis = karakterNama[hurufAwal] || { 
          sifat: "Unik dan penuh misteri", 
          angka: 5, 
          elemen: "Netral", 
          simbol: "🌌",
          deskripsi: "Kepribadian yang menarik dan penuh kejutan"
        };
        
        const mood = moodHarian[new Date().getDay()];
        
        // Hitung numerologi
        const numerology = hitungNumerologi(nama, tanggalLahir);
        setNumerologyData(numerology);
        
        // Hitung skor kosmis berbasis zodiak
        const skorKosmis = hitungSkorKosmis(data, numerology, tanggalLahir);
        
        // Analisis kepribadian
        const kepribadian = analisisKepribadian(data, numerology);
        
        // Analisis kompatibilitas dengan zodiak lain
        const kompatibilitasList = zodiakData
          .filter(z => z.nama !== namaZodiak)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(z => ({
            zodiak: z.nama,
            simbol: z.simbol,
            elemen: z.elemen,
            ...analisisKompatibilitas(namaZodiak, z.nama)
          }));
        
        setCompatibility(kompatibilitasList);

        // Simpan data user untuk sinkronisasi
        const userDataObj = {
          nama,
          tanggalLahir: tanggalLahir.toISOString(),
          zodiak: namaZodiak,
          dataLengkap: data,
          sessionId,
          lastUpdated: new Date().toISOString()
        };
        
        setUserData(userDataObj);
        localStorage.setItem(`zodiakUserData_${sessionId}`, JSON.stringify(userDataObj));

        setZodiak({
          ...data,
          namaUser: nama,
          hurufAwal,
          sifatNama: `${namaAnalisis.sifat} ${namaAnalisis.simbol}`,
          deskripsiNama: namaAnalisis.deskripsi,
          mood: `${mood.mood} ${mood.simbol}`,
          moodEnergi: mood.energi,
          moodWarna: mood.warna,
          numerology,
          skorKosmis,
          kepribadian,
          kompatibilitasList,
          tanggalAnalisis: new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          isUserZodiak: true, // Karena ini dari input user
          userZodiak: namaZodiak,
          inputMethod: "text"
        });

      } catch (error) {
        console.error("Error in handleCek:", error);
        setZodiak({
          error: true,
          message: "⚠️ Terjadi kesalahan dalam menganalisis data. Silakan coba lagi."
        });
      }
      
      setLoading(false);
    }, 1500);
  };

  const handleSelectZodiak = (data) => {
    if (!data) return;
    // Prevent analysis if input is empty
    if (!input.trim()) {
      setWarning("Masukkan data Anda terlebih dahulu sebelum memilih zodiak.");
      setTimeout(() => setWarning(""), 3000);
      return;
    }
    setSelectedZodiak(data);
    setLoading(true);
    setViewMode("detail");
    setActiveTab("profile");
    setTimeout(() => {
      try {
        const mood = moodHarian[new Date().getDay()];
        // ...existing code...
        let nama = "Pengunjung";
        let tanggalLahir = new Date();
        let numerology = hitungNumerologi("", new Date());
        if (userData) {
          nama = userData.nama;
          try {
            tanggalLahir = new Date(userData.tanggalLahir);
            if (isNaN(tanggalLahir.getTime())) {
              tanggalLahir = new Date();
            }
          } catch (e) {
            tanggalLahir = new Date();
          }
          numerology = hitungNumerologi(nama, tanggalLahir);
        }
        setNumerologyData(numerology);
        const isUserZodiak = userData && userData.zodiak === data.nama;
        const skorKosmis = hitungSkorKosmis(data, numerology, tanggalLahir);
        const kepribadian = analisisKepribadian(data, numerology);
        const kompatibilitasList = zodiakData
          .filter(z => z.nama !== data.nama)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(z => ({
            zodiak: z.nama,
            simbol: z.simbol,
            elemen: z.elemen,
            ...analisisKompatibilitas(data.nama, z.nama)
          }));
        setCompatibility(kompatibilitasList);
        let analisisHubungan = "";
        if (userData && userData.dataLengkap) {
          analisisHubungan = analisisHubunganElemen(
            userData.dataLengkap.elemen,
            data.elemen
          );
        }
        const hurufAwal = nama.charAt(0).toUpperCase();
        const namaAnalisis = karakterNama[hurufAwal] || { 
          sifat: "Unik dan penuh misteri", 
          simbol: "🌌",
          deskripsi: "Kepribadian yang menarik"
        };
        setZodiak({
          ...data,
          namaUser: nama,
          hurufAwal,
          sifatNama: userData ? 
            `${namaAnalisis.sifat} ${namaAnalisis.simbol}` : 
            "Pilih zodiak untuk analisis lengkap",
          deskripsiNama: namaAnalisis.deskripsi,
          mood: `${mood.mood} ${mood.simbol}`,
          moodEnergi: mood.energi,
          moodWarna: mood.warna,
          numerology,
          skorKosmis,
          kepribadian,
          kompatibilitasList,
          analisisHubungan,
          tanggalAnalisis: new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          isUserZodiak, // Ini yang akan diperiksa
          userZodiak: userData?.zodiak || "Belum diatur",
          inputMethod: "grid",
          perbandinganDenganUser: userData ? {
            zodiakUser: userData.zodiak,
            zodiakDipilih: data.nama,
            sama: isUserZodiak,
            deskripsi: isUserZodiak ? 
              `Ini adalah zodiak Anda (${data.nama}) berdasarkan tanggal lahir.` :
              `Anda sedang menganalisis zodiak ${data.nama}, sementara zodiak Anda berdasarkan tanggal lahir adalah ${userData.zodiak}.`
          } : null
        });
      } catch (error) {
        console.error("Error in handleSelectZodiak:", error);
        setZodiak({
          error: true,
          message: "⚠️ Terjadi kesalahan dalam memuat data zodiak."
        });
      }
      setLoading(false);
    }, 700);
  };

  const handleBackToGrid = () => {
    setViewMode("grid");
    setZodiak(null);
    setSelectedZodiak(null);
    setInput("");
  };

  const handleClearUserData = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pribadi Anda?")) {
      setUserData(null);
      localStorage.removeItem(`zodiakUserData_${sessionId}`);
      setInput("");
      alert("Data pribadi telah dihapus.");
    }
  };

  const getElementColor = (elemen) => {
    switch(elemen) {
      case "Api": return "bg-gradient-to-r from-red-500 to-orange-500";
      case "Air": return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "Tanah": return "bg-gradient-to-r from-yellow-600 to-amber-700";
      case "Udara": return "bg-gradient-to-r from-indigo-400 to-purple-400";
      default: return "bg-gradient-to-r from-gray-600 to-gray-800";
    }
  };

  const getElementColorLight = (elemen) => {
    switch(elemen) {
      case "Api": return "bg-gradient-to-r from-red-500/20 to-orange-500/20";
      case "Air": return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20";
      case "Tanah": return "bg-gradient-to-r from-yellow-600/20 to-amber-700/20";
      case "Udara": return "bg-gradient-to-r from-indigo-400/20 to-purple-400/20";
      default: return "bg-gradient-to-r from-gray-600/20 to-gray-800/20";
    }
  };

  // Komponen untuk Progress Bar
  const ProgressBar = ({ value, label, color, showValue = true }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        {showValue && <span className="text-sm font-bold">{value}%</span>}
      </div>
      <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  // Komponen untuk Kartu Zodiak di Grid
  const ZodiakCard = ({ item }) => {
    const isUserZodiak = userData && userData.zodiak === item.nama;
    const isTodayHighlight = new Date().getDate() % 12 === item.id;
    
    return (
      <div
        key={item.id}
        onClick={() => handleSelectZodiak(item)}
        className={`${getElementColor(item.elemen)} p-4 rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 border-2 ${
          isUserZodiak ? 'border-yellow-400 border-opacity-80 shadow-lg shadow-yellow-500/30' : 
          isTodayHighlight ? 'border-white/40 border-opacity-60' : 'border-white/20'
        } backdrop-blur-sm relative overflow-hidden group`}
      >
        {isUserZodiak && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold z-10 animate-pulse">
            ✨ Zodiakmu
          </div>
        )}
        
        {isTodayHighlight && !isUserZodiak && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-white/30 to-transparent text-white text-xs px-2 py-1 rounded-full font-medium z-10">
            Hari Ini
          </div>
        )}
        
        <div className="text-center">
          <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
            {item.simbol}
          </div>
          <h3 className="font-bold text-white text-lg mb-1">{item.nama}</h3>
          <p className="text-xs text-white/80 mb-2">{item.tanggal.split(" - ")[0]}</p>
          <div className="mt-2 text-xs bg-black/40 px-3 py-1.5 rounded-full inline-block font-medium">
            {item.elemen}
          </div>
          
          {isUserZodiak && userData && (
            <p className="text-xs text-yellow-200/90 mt-2 italic">
              Cocok dengan: {userData.nama}
            </p>
          )}
        </div>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  };

  // Komponen Grid Zodiak
  const GridView = () => (
    <div className="mt-8 animate-fadeIn w-full">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white drop-shadow-md">
        {userData ? `🔮 Hai ${userData.nama}, eksplor zodiak lainnya!` : "🔮 Pilih Zodiak atau Cek dengan Tanggal Lahir"}
      </h2>
      
      {userData && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-300/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-bold text-yellow-300 text-lg">
                Zodiak Anda: <span className="text-white">{userData.zodiak}</span>
              </p>
              <p className="text-sm text-gray-300 mt-1">
                Berdasarkan tanggal lahir: {new Date(userData.tanggalLahir).toLocaleDateString('id-ID')}
              </p>
            </div>
            <button
              onClick={handleClearUserData}
              className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/30 hover:from-red-600/30 hover:to-red-700/40 rounded-lg font-medium text-sm border border-red-400/30 transition-all hover:scale-105"
            >
              Hapus Data Saya
            </button>
          </div>
        </div>
      )}
      
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'} gap-4`}>
        {zodiakData.map((item) => (
          <ZodiakCard key={item.id} item={item} />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-300 mb-2">
          Atau ketik seperti ngobrol: 
        </p>
        <p className="text-pink-300 font-medium">
          "Namaku Rina lahir 17 Mei 2001"
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Kartu dengan border kuning adalah zodiak Anda berdasarkan input
        </p>
      </div>
    </div>
  );

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="flex flex-wrap border-b border-white/20 mb-6 overflow-x-auto">
      {[
        { id: "profile", label: "📊 Profil", icon: "📊" },
        { id: "numerology", label: "🔢 Numerologi", icon: "🔢" },
        { id: "compatibility", label: "❤️ Kecocokan", icon: "❤️" },
        { id: "personality", label: "🧠 Kepribadian", icon: "🧠" },
        { id: "insights", label: "💡 Insights", icon: "💡" }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 min-w-[120px] py-3 text-center font-medium transition-all ${
            activeTab === tab.id
              ? "text-pink-300 border-b-2 border-pink-400 bg-gradient-to-t from-pink-500/10 to-transparent"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="hidden md:inline">{tab.icon} </span>
          {tab.label}
        </button>
      ))}
    </div>
  );

  // Komponen untuk menampilkan statistik
  const StatCard = ({ title, value, subtitle, color, icon }) => (
    <div className={`${color} p-4 rounded-xl border border-white/10`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <h4 className="font-semibold text-white">{title}</h4>
      {subtitle && <p className="text-xs text-white/80 mt-1">{subtitle}</p>}
    </div>
  );

  // Komponen Detail Zodiak
  const DetailView = () => {
    if (!zodiak) return null;
    
    if (zodiak.error) {
      return (
        <div className="z-10 mt-8 p-6 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-300/30 rounded-2xl shadow-xl max-w-md mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-200 mb-2">Oops!</h3>
            <p className="text-red-200 mb-4">{zodiak.message}</p>
            <button
              onClick={handleBackToGrid}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Kembali ke Daftar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="z-10 mt-8 w-full max-w-6xl mx-auto animate-fadeIn">
        {/* Tombol Kembali */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackToGrid}
            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 hover:scale-105"
          >
            ← Kembali ke Daftar Zodiak
          </button>
          
          {userData && (
            <div className="text-sm text-gray-300">
              Sesi: <span className="text-pink-300">{sessionId?.substring(0, 8)}...</span>
            </div>
          )}
        </div>

        {/* Indikator Sinkronisasi - PERBAIKAN DI SINI */}
        {userData && (
          <div className={`mb-6 p-4 rounded-xl ${
            zodiak.isUserZodiak 
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-300/30' 
              : 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-300/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`text-2xl ${zodiak.isUserZodiak ? 'text-green-400' : 'text-yellow-400'}`}>
                {zodiak.isUserZodiak ? '✅' : '🔍'}
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {zodiak.isUserZodiak 
                    ? `Ini adalah zodiak Anda (${zodiak.nama})`
                    : `Anda sedang melihat zodiak ${zodiak.nama}`
                  }
                </p>
                <p className="text-sm mt-1 opacity-90">
                  {zodiak.isUserZodiak 
                    ? `Sesuai dengan data input: ${userData.nama} (lahir ${new Date(userData.tanggalLahir).toLocaleDateString('id-ID')})`
                    : `Zodiak Anda berdasarkan tanggal lahir adalah ${userData.zodiak}. Ini adalah analisis komparatif.`
                  }
                </p>
                {!zodiak.isUserZodiak && zodiak.analisisHubungan && (
                  <p className="text-sm mt-2 italic border-t border-white/10 pt-2">
                    💡 {zodiak.analisisHubungan}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Kartu Utama */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`${getElementColor(zodiak.elemen)} p-6 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="text-7xl mb-2 animate-pulse">{zodiak.simbol}</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">{zodiak.nama}</h2>
              <p className="text-lg text-white/90 mb-1">{zodiak.nama_latin}</p>
              <p className="text-sm text-white/80 mb-4">{zodiak.tanggal}</p>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="bg-black/30 p-3 rounded-xl">
                  <div className="text-xl font-bold">{zodiak.skorKosmis?.nilai || 0}/100</div>
                  <div className="text-xs">Skor Kosmis</div>
                </div>
                <div className="bg-black/30 p-3 rounded-xl">
                  <div className="text-xl font-bold">{zodiak.elemen}</div>
                  <div className="text-xs">Elemen</div>
                </div>
                <div className="bg-black/30 p-3 rounded-xl">
                  <div className="text-xl font-bold">{zodiak.kualitas}</div>
                  <div className="text-xs">Kualitas</div>
                </div>
                <div className="bg-black/30 p-3 rounded-xl">
                  <div className="text-xl font-bold">{zodiak.moodEnergi}</div>
                  <div className="text-xs">Energi Hari Ini</div>
                </div>
              </div>
              
              <div className={`mt-4 inline-block px-4 py-2 rounded-full ${zodiak.skorKosmis?.warna || 'from-gray-500 to-gray-700'} bg-gradient-to-r`}>
                <div className="text-sm">{zodiak.skorKosmis?.deskripsi}</div>
                <div className="text-xs mt-1">{zodiak.skorKosmis?.emoji}</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation & Content */}
          <div className="p-4 md:p-6">
            <TabNavigation />
            
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Kolom 1 */}
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-xl">
                      <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
                        <span>📊</span> Profil Zodiak
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-300">Element:</span>
                          <span className="ml-2 text-white">{zodiak.elemen}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Kualitas:</span>
                          <span className="ml-2 text-white">{zodiak.kualitas}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Planet Penguasa:</span>
                          <span className="ml-2 text-white">
                            {Array.isArray(zodiak.planet_penguasa) ? zodiak.planet_penguasa.join(", ") : zodiak.planet_penguasa}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Musim:</span>
                          <span className="ml-2 text-white">{zodiak.musim}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Fase Bulan:</span>
                          <span className="ml-2 text-white">{zodiak.fase_bulan}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Bagian Tubuh:</span>
                          <span className="ml-2 text-white">{zodiak.bagian_tubuh}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 p-4 rounded-xl">
                      <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
                        <span>💎</span> Keberuntungan
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-300">Warna:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {zodiak.warna_keberuntungan.map((warna, idx) => (
                              <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full">
                                {warna}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Batu:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {zodiak.batu_keberuntungan.map((batu, idx) => (
                              <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full">
                                {batu}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Angka:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {zodiak.angka_keberuntungan.map((angka, idx) => (
                              <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full font-bold">
                                {angka}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Hari:</span>
                          <span className="ml-2 text-white">{zodiak.hari_keberuntungan}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kolom 2 */}
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-xl">
                      <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
                        <span>🌟</span> Karakteristik
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-green-300 mb-2">Kekuatan:</p>
                          <div className="flex flex-wrap gap-2">
                            {zodiak.kekuatan.map((k, idx) => (
                              <span key={idx} className="text-xs bg-green-500/20 px-3 py-1.5 rounded-full">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-red-300 mb-2">Kelemahan:</p>
                          <div className="flex flex-wrap gap-2">
                            {zodiak.kelemahan.map((k, idx) => (
                              <span key={idx} className="text-xs bg-red-500/20 px-3 py-1.5 rounded-full">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 p-4 rounded-xl">
                      <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
                        <span>❤️</span> Kecocokan
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-300">Terbaik:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {zodiak.kecocokan_terbaik.map((k, idx) => (
                              <span key={idx} className="text-xs bg-purple-500/20 px-3 py-1 rounded-full">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Menengah:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {zodiak.kecocokan_menengah.map((k, idx) => (
                              <span key={idx} className="text-xs bg-blue-500/20 px-3 py-1 rounded-full">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Karir:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {zodiak.karir_terbaik.slice(0, 4).map((k, idx) => (
                              <span key={idx} className="text-xs bg-yellow-500/20 px-3 py-1 rounded-full">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kolom 3 */}
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-xl">
                      <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
                        <span>📖</span> Mitologi & Fakta
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold mb-2">Mitologi:</p>
                          <p className="text-sm">{zodiak.mitologi}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Quote:</p>
                          <p className="text-sm italic text-gray-300">"{zodiak.quote}"</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Karakter Fiktif:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {zodiak.karakter_fiktif_terkenal.map((k, idx) => (
                              <span key={idx} className="text-xs bg-pink-500/20 px-3 py-1 rounded-full">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Makanan Favorit:</p>
                          <p className="text-sm">{zodiak.makanan_favorit}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Numerology Tab */}
            {activeTab === "numerology" && numerologyData && (
              <div className="bg-white/10 p-6 rounded-xl animate-fadeIn">
                <h3 className="text-xl font-bold text-pink-300 mb-6">
                  🔢 Analisis Numerologi untuk {zodiak.namaUser || "Anda"}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Angka Hidup */}
                  <div className={`bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-5 rounded-xl border border-blue-300/20`}>
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold mb-2">{numerologyData.angkaHidup}</div>
                      <p className="text-lg font-semibold">Angka Hidup</p>
                      <p className="text-sm text-gray-300 mt-1">{numerologyData.judulAngkaHidup}</p>
                    </div>
                    <p className="text-sm">{numerologyData.deskripsiAngkaHidup}</p>
                    <div className="mt-4 text-xs text-gray-400">
                      Berdasarkan nama: {zodiak.namaUser || "Tidak tersedia"}
                    </div>
                  </div>
                  
                  {/* Angka Takdir */}
                  <div className={`bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-5 rounded-xl border border-purple-300/20`}>
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold mb-2">{numerologyData.angkaTakdir}</div>
                      <p className="text-lg font-semibold">Angka Takdir</p>
                      <p className="text-sm text-gray-300 mt-1">{numerologyData.judulAngkaTakdir}</p>
                    </div>
                    <p className="text-sm">{numerologyData.deskripsiAngkaTakdir}</p>
                    <div className="mt-4 text-xs text-gray-400">
                      Berdasarkan tanggal lahir: {numerologyData.tglLahir || "Tidak tersedia"}
                    </div>
                  </div>
                </div>
                
                {/* Analisis Tambahan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className={`bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl`}>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <span>🔤</span> Analisis Huruf Pertama
                    </h4>
                    <p className="text-lg font-semibold mb-2">{zodiak.sifatNama}</p>
                    <p className="text-sm mb-3">{zodiak.deskripsiNama}</p>
                    <div className="text-xs text-gray-300">
                      Elemen Nama: <span className="font-semibold">{numerologyData.elemenNama}</span>
                      {zodiak.hurufAwal && (
                        <span className="ml-4">Huruf: <span className="font-semibold">{zodiak.hurufAwal}</span></span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl`}>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <span>✨</span> Harmoni dengan Zodiak
                    </h4>
                    <p className="text-lg font-semibold mb-2">
                      {numerologyData.elemenNama === zodiak.elemen 
                        ? "Harmoni Sempurna ✨" 
                        : numerologyData.elemenNama === "Netral"
                        ? "Kombinasi Netral ⚖️"
                        : "Kombinasi yang Menarik 💫"}
                    </p>
                    <p className="text-sm">
                      Elemen Nama ({numerologyData.elemenNama}) + Elemen Zodiak ({zodiak.elemen})
                    </p>
                    <div className="mt-3 text-xs text-gray-300">
                      Energi Nama: <span className="font-semibold">{numerologyData.energiNama}/100</span>
                    </div>
                  </div>
                </div>
                
                {/* Analisis Lengkap */}
                {numerologyData.analisisLengkap && (
                  <div className="mt-6 p-4 bg-black/20 rounded-xl">
                    <h4 className="font-bold mb-2">📝 Analisis Numerologi Lengkap</h4>
                    <p className="text-sm">{numerologyData.analisisLengkap}</p>
                  </div>
                )}
              </div>
            )}

            {/* Compatibility Tab */}
            {activeTab === "compatibility" && compatibility && (
              <div className="bg-white/10 p-6 rounded-xl animate-fadeIn">
                <h3 className="text-xl font-bold text-pink-300 mb-6">
                  ❤️ Analisis Kecocokan {zodiak.nama}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {compatibility.map((comp, idx) => (
                    <div key={idx} className={`${getElementColorLight(comp.elemen)} p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300`}>
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">{comp.simbol}</div>
                        <h4 className="font-bold text-lg mb-1">{comp.zodiak}</h4>
                        <div className="text-xs text-gray-300">Elemen: {comp.elemen}</div>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold mb-1">{comp.skor}/100</div>
                        <div className={`text-sm font-semibold ${comp.levelColor}`}>
                          {comp.level}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {comp.kekuatan.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-green-300 mb-1">Kekuatan:</p>
                            <ul className="text-xs space-y-1">
                              {comp.kekuatan.slice(0, 2).map((k, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span>✓</span> {k}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {comp.kelemahan.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-red-300 mb-1">Perhatian:</p>
                            <ul className="text-xs space-y-1">
                              {comp.kelemahan.slice(0, 2).map((k, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span>!</span> {k}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {comp.tips.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-blue-300 mb-1">Tips:</p>
                            <p className="text-xs">{comp.tips[0]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Catatan Kecocokan */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-300/20">
                  <h4 className="font-bold mb-2">💡 Catatan tentang Kecocokan Zodiak</h4>
                  <p className="text-sm">
                    Kecocokan zodiak didasarkan pada kombinasi elemen ({zodiak.elemen}), kualitas ({zodiak.kualitas}), 
                    dan karakteristik unik setiap zodiak. Hasil ini sebagai panduan umum, hubungan yang sesungguhnya 
                    dibangun melalui komunikasi dan saling pengertian.
                  </p>
                </div>
              </div>
            )}

            {/* Personality Tab */}
            {activeTab === "personality" && zodiak.kepribadian && (
              <div className="bg-white/10 p-6 rounded-xl animate-fadeIn">
                <h3 className="text-xl font-bold text-pink-300 mb-6">
                  🧠 Analisis Kepribadian {zodiak.nama}
                </h3>
                
                <div className="mb-8">
                  <h4 className="font-bold mb-4 text-lg">Profil Psikologis</h4>
                  <p className="text-sm mb-6 text-gray-300">{zodiak.kepribadian.deskripsi}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ProgressBar 
                        value={zodiak.kepribadian.intelektual} 
                        label="Kecerdasan & Logika" 
                        color="bg-gradient-to-r from-blue-500 to-cyan-500" 
                      />
                      <ProgressBar 
                        value={zodiak.kepribadian.emosional} 
                        label="Kestabilan Emosional" 
                        color="bg-gradient-to-r from-purple-500 to-pink-500" 
                      />
                      <ProgressBar 
                        value={zodiak.kepribadian.spiritual} 
                        label="Spiritualitas & Intuisi" 
                        color="bg-gradient-to-r from-indigo-500 to-violet-500" 
                      />
                    </div>
                    <div>
                      <ProgressBar 
                        value={zodiak.kepribadian.sosial} 
                        label="Keterampilan Sosial" 
                        color="bg-gradient-to-r from-green-500 to-emerald-500" 
                      />
                      <ProgressBar 
                        value={zodiak.kepribadian.fisik} 
                        label="Energi & Vitalitas Fisik" 
                        color="bg-gradient-to-r from-red-500 to-orange-500" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-xl`}>
                    <h4 className="font-bold mb-3">🎯 Kecenderungan Karir</h4>
                    <ul className="text-sm space-y-2">
                      {zodiak.karir_terbaik.slice(0, 5).map((karir, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-blue-400">•</span> {karir}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={`bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl`}>
                    <h4 className="font-bold mb-3">💡 Tips Pengembangan Diri</h4>
                    <ul className="text-sm space-y-2">
                      {zodiak.kelemahan.slice(0, 3).map((kelemahan, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-pink-400 mt-1">💡</span> 
                          <span>Kurangi: <span className="font-medium">{kelemahan}</span></span>
                        </li>
                      ))}
                      <li className="flex items-start gap-2 mt-4">
                        <span className="text-green-400 mt-1">🌟</span> 
                        <span>Fokus pada: <span className="font-medium">{zodiak.kekuatan[0]}</span></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === "insights" && (
              <div className="bg-white/10 p-6 rounded-xl animate-fadeIn">
                <h3 className="text-xl font-bold text-pink-300 mb-6">
                  💡 Insights & Rekomendasi
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className={`${getElementColorLight(zodiak.elemen)} p-4 rounded-xl`}>
                      <h4 className="font-bold mb-2">🌙 Mood Hari Ini</h4>
                      <div className={`${zodiak.moodWarna} p-3 rounded-lg mb-2`}>
                        <p className="text-lg font-semibold">{zodiak.mood}</p>
                      </div>
                      <p className="text-sm">
                        Energi hari ini: <span className="font-semibold">{zodiak.moodEnergi}</span>
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-4 rounded-xl">
                      <h4 className="font-bold mb-2">⭐ Aktivitas yang Direkomendasikan</h4>
                      <ul className="text-sm space-y-2">
                        {zodiak.skorKosmis?.nilai >= 80 && (
                          <>
                            <li>• Ambil risiko dan inisiatif baru</li>
                            <li>• Mulai proyek besar yang ditunda</li>
                            <li>• Networking dan presentasi</li>
                          </>
                        )}
                        {zodiak.skorKosmis?.nilai >= 60 && zodiak.skorKosmis?.nilai < 80 && (
                          <>
                            <li>• Fokus pada pekerjaan rutin</li>
                            <li>• Evaluasi dan perencanaan</li>
                            <li>• Kolaborasi dengan tim</li>
                          </>
                        )}
                        {zodiak.skorKosmis?.nilai < 60 && (
                          <>
                            <li>• Istirahat dan refleksi diri</li>
                            <li>• Aktivitas kreatif ringan</li>
                            <li>• Meditasi atau yoga</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-xl">
                      <h4 className="font-bold mb-2">📈 Waktu Terbaik</h4>
                      <ul className="text-sm space-y-2">
                        <li>
                          <span className="font-semibold">Hari:</span> {zodiak.hari_keberuntungan}
                        </li>
                        <li>
                          <span className="font-semibold">Musim:</span> {zodiak.musim}
                        </li>
                        <li>
                          <span className="font-semibold">Fase Bulan:</span> {zodiak.fase_bulan}
                        </li>
                        {zodiak.angka_keberuntungan.length > 0 && (
                          <li>
                            <span className="font-semibold">Angka Keberuntungan:</span> {zodiak.angka_keberuntungan.join(", ")}
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl">
                      <h4 className="font-bold mb-2">🎭 Sifat Dominan</h4>
                      <div className="flex flex-wrap gap-2">
                        {zodiak.kekuatan.slice(0, 4).map((k, idx) => (
                          <span key={idx} className="text-xs bg-purple-500/20 px-3 py-1 rounded-full">
                            {k}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs mt-3 text-gray-300">
                        Fokus pada pengembangan: <span className="font-semibold">{zodiak.kekuatan[0]}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Catatan Akhir */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl border border-white/10">
                  <h4 className="font-bold mb-2">📝 Catatan</h4>
                  <p className="text-sm">
                    Analisis ini berdasarkan kombinasi astrologi, numerologi, dan karakteristik zodiak. 
                    Gunakan sebagai panduan untuk pengembangan diri, bukan sebagai keputusan mutlak. 
                    Setiap individu unik dan memiliki potensi tak terbatas.
                  </p>
                </div>
              </div>
            )}

            {/* Info Tambahan */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-300">
              <p>
                💡 Analisis untuk: <span className="font-semibold text-white">
                  {zodiak.namaUser ? `${zodiak.namaUser} (${zodiak.nama})` : `Profil ${zodiak.nama}`}
                </span>
              </p>
              <p className="mt-2">
                Tanggal analisis: <span className="font-semibold">{zodiak.tanggalAnalisis}</span>
              </p>
              {zodiak.isUserZodiak !== undefined && (
                <p className="mt-2">
                  Status: <span className={`font-semibold ${zodiak.isUserZodiak ? 'text-green-400' : 'text-yellow-400'}`}>
                    {zodiak.isUserZodiak ? '✅ Zodiak Anda' : '🔍 Analisis Komparatif'}
                  </span>
                </p>
              )}
              <p className="mt-4 text-xs text-gray-400">
                Data disimpan secara lokal di browser Anda • Sesi: {sessionId?.substring(0, 12)}...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d051f] via-[#2a0b43] to-[#4a1b6a] flex flex-col items-center justify-start text-white p-4 md:p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffffff15,_transparent_50%)] opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-transparent via-purple-900/5 to-transparent"></div>

      {/* Header */}
      <div className="z-10 text-center w-full max-w-5xl mx-auto mt-4 md:mt-8">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
          ✨ Zodiak Intelligence Pro
        </h1>
        <p className="text-sm md:text-base text-gray-300 mb-6 px-4">
          Analisis zodiak lengkap dengan sinkronisasi data, numerologi, dan insights personal
        </p>
      </div>

      {/* Search Box */}
      <div className="z-10 w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Contoh: 'Namaku Rina lahir 17 Mei 2001' atau '17/05/2001'..."
                className="w-full p-4 rounded-xl text-center md:text-left bg-white/15 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm md:text-base border border-white/10 focus:border-pink-400/50 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCek()}
              />
              {userData && (
                <div className="absolute -bottom-6 left-0 right-0 text-xs text-gray-400 text-center">
                  Data tersimpan untuk: {userData.nama} ({userData.zodiak})
                </div>
              )}
              {warning && (
                <div className="absolute -bottom-12 left-0 right-0 text-xs text-red-400 text-center animate-pulse">
                  {warning}
                </div>
              )}
            </div>
            <button
              onClick={handleCek}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-600 hover:to-pink-600 px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span> Menganalisis...
                </span>
              ) : (
                "🔮 Cek Zodiak Saya"
              )}
            </button>
          </div>
          <p className="text-xs text-gray-300 mt-4 text-center">
            Atau pilih langsung dari daftar zodiak di bawah ↓
          </p>
          <div className="mt-2 text-xs text-gray-400 text-center">
            <span className="font-bold text-pink-300">Petunjuk Penggunaan:</span> Masukkan nama dan tanggal lahir Anda pada kolom di atas, lalu klik tombol cek atau pilih zodiak. Data Anda akan dianalisis dan disimpan secara lokal, hanya untuk Anda.
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && viewMode === "detail" && (
        <div className="z-10 mt-8 flex flex-col items-center gap-4 animate-pulse">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-t-transparent border-pink-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl animate-pulse">✨</span>
            </div>
          </div>
          <p className="text-sm italic text-gray-200">
            Menganalisis data zodiak, numerologi, dan kepribadian...
          </p>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="z-10 w-full max-w-7xl mx-auto mt-8">
        {viewMode === "grid" ? <GridView /> : <DetailView />}
      </div>

      {/* Footer */}
      <div className="z-10 mt-8 md:mt-12 text-center text-xs text-gray-400 pb-6 px-4">
        <p className="mb-2">
          Sistem sinkronisasi data • Analisis numerologi lengkap • Skor kosmis berbasis zodiak • Insights personal
        </p>
        <p>
          ✨ Data disimpan secara lokal di browser Anda • Hanya untuk tujuan hiburan dan pengembangan diri
        </p>
      </div>
    </div>
  );
}