// Kalkulator Shio & Elemen Wu Xing (Astrologi Tionghoa)

const SHIO_DATA = [
  { nama: "Tikus", simbol: "🐀", sifat: "Cerdas, cerdik, berjiwa wirausaha, dan sangat adaptif.", elemenTetap: "Air" },
  { nama: "Kerbau", simbol: "🐂", sifat: "Tekun, dapat diandalkan, kuat, dan penuh integritas.", elemenTetap: "Tanah" },
  { nama: "Macan", simbol: "🐅", sifat: "Berani, kompetitif, karismatik, dan penuh wibawa.", elemenTetap: "Kayu" },
  { nama: "Kelinci", simbol: "🐇", sifat: "Lembut, elegan, waspada, dan pecinta kedamaian.", elemenTetap: "Kayu" },
  { nama: "Naga", simbol: "🐉", sifat: "Ambisius, percaya diri, berenergi besar, dan visioner.", elemenTetap: "Tanah" },
  { nama: "Ular", simbol: "🐍", sifat: "Bijaksana, misterius, filosofis, dan intuitif.", elemenTetap: "Api" },
  { nama: "Kuda", simbol: "🐎", sifat: "Bebas, energik, independen, dan berjiwa petualang.", elemenTetap: "Api" },
  { nama: "Kambing", simbol: "🐐", sifat: "Penyayang, artistik, tenang, dan memiliki hati lembut.", elemenTetap: "Tanah" },
  { nama: "Monyet", simbol: "🐒", sifat: "Lincah, cerdas, humoris, dan pandai menyelesaikan masalah.", elemenTetap: "Logam" },
  { nama: "Ayam", simbol: "🐓", sifat: "Jujur, teliti, terorganisir, dan berani bersuara.", elemenTetap: "Logam" },
  { nama: "Anjing", simbol: "🐕", sifat: "Setia, jujur, protektif, dan memiliki rasa keadilan tinggi.", elemenTetap: "Tanah" },
  { nama: "Babi", simbol: "🐖", sifat: "Tulus, murah hati, toleran, dan pekerja keras.", elemenTetap: "Air" }
];

const ELEMEN_WU_XING = [
  { elemen: "Logam", simbol: "⚔️", sifat: "Tegas, gigih, berprinsip, dan berwibawa." }, // 0
  { elemen: "Logam", simbol: "⚔️", sifat: "Tegas, gigih, berprinsip, dan berwibawa." }, // 1
  { elemen: "Air", simbol: "💧", sifat: "Fleksibel, intuitif, komunikatif, dan diplomatis." }, // 2
  { elemen: "Air", simbol: "💧", sifat: "Fleksibel, intuitif, komunikatif, dan diplomatis." }, // 3
  { elemen: "Kayu", simbol: "🌳", sifat: "Tumbuh, ekspansif, berjiwa sosial, dan kreatif." }, // 4
  { elemen: "Kayu", simbol: "🌳", sifat: "Tumbuh, ekspansif, berjiwa sosial, dan kreatif." }, // 5
  { elemen: "Api", simbol: "🔥", sifat: "Bersemangat tinggi, dinamis, eksplosif, dan inspiratif." }, // 6
  { elemen: "Api", simbol: "🔥", sifat: "Bersemangat tinggi, dinamis, eksplosif, dan inspiratif." }, // 7
  { elemen: "Tanah", simbol: "⛰️", sifat: "Stabil, realistis, sabar, dan membumi." }, // 8
  { elemen: "Tanah", simbol: "⛰️", sifat: "Stabil, realistis, sabar, dan membumi." }  // 9
];

export const getChineseZodiac = (birthDate) => {
  if (!birthDate) return null;
  const dateObj = new Date(birthDate);
  const year = isNaN(dateObj.getFullYear()) ? new Date().getFullYear() : dateObj.getFullYear();

  // Dasar siklus Shio (Tikus = tahun kelipatan 12 bersisa 4 dari 0 AD, e.g. 1984, 1996, 2008)
  const shioIndex = (year - 4) % 12;
  const normalizedShioIndex = (shioIndex + 12) % 12;
  const shio = SHIO_DATA[normalizedShioIndex];

  // Elemen Wu Xing berdasarkan digit terakhir tahun kelahiran
  const lastDigit = Math.abs(year) % 10;
  const wuXing = ELEMEN_WU_XING[lastDigit];

  // Polaritas Yin/Yang
  const polaritas = year % 2 === 0 ? "Yang (Aktif & Dinamis)" : "Yin (Intuitif & Tenang)";

  return {
    tahun: year,
    shio: shio.nama,
    simbol: shio.simbol,
    sifatShio: shio.sifat,
    elemenTetap: shio.elemenTetap,
    elemenKelahiran: wuXing.elemen,
    simbolElemen: wuXing.simbol,
    sifatElemen: wuXing.sifat,
    polaritas,
    kombinasi: `${shio.nama} ${wuXing.elemen}`
  };
};
