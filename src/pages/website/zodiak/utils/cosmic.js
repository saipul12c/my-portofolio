export const hitungSkorKosmis = (zodiakData, numerology) => {
    let skor = 50;
    if (!zodiakData || !numerology) return skor;

    const bonusElemen = {
        Api: { min: 10, max: 25 },
        Air: { min: 5, max: 20 },
        Tanah: { min: 8, max: 22 },
        Udara: { min: 7, max: 18 }
    };
    const bonus = bonusElemen[zodiakData.elemen];
    if (bonus) {
        skor += Math.floor(Math.random() * (bonus.max - bonus.min + 1)) + bonus.min;
    }

    const bonusKualitas = {
        Cardinal: 15,
        Fixed: 10,
        Mutable: 5
    };
    skor += bonusKualitas[zodiakData.kualitas] || 0;
    skor += (numerology.angkaHidup || 5) * 2;

    const hariSekarang = new Date().toLocaleString("id-ID", { weekday: "long" }).toLowerCase();
    const hariKeberuntungan = zodiakData.hari_keberuntungan?.toLowerCase() || "";
    if (hariSekarang.includes(hariKeberuntungan)) skor += 20;

    const faseBulanBonus = {
        "Bulan Baru": 10,
        "Bulan Sabit": 5,
        "Bulan Separuh": 8,
        "Bulan Purnama": 15
    };
    skor += faseBulanBonus[zodiakData.fase_bulan] || 0;

    const musimBonus = {
        "Musim Semi": 5,
        "Musim Panas": 8,
        "Musim Gugur": 7,
        "Musim Dingin": 6
    };
    skor += musimBonus[zodiakData.musim] || 0;

    skor = Math.max(1, Math.min(100, skor));

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
        warna:
            skor >= 80 ? "from-green-500 to-emerald-500" :
                skor >= 60 ? "from-yellow-500 to-amber-500" :
                    skor >= 40 ? "from-blue-500 to-cyan-500" :
                        "from-purple-500 to-pink-500"
    };
};