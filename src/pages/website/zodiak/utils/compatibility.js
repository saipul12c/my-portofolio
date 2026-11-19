import zodiakData from "../data/zodiakData";

const elemenKompatibel = {
    Api: ["Api", "Udara"],
    Air: ["Air", "Tanah"],
    Tanah: ["Tanah", "Air", "Api"],
    Udara: ["Udara", "Api", "Air"]
};

export const analisisKompatibilitas = (zodiakUser, zodiakLain) => {
    const dataUser = zodiakData.find((z) => z.nama === zodiakUser);
    const dataLain = zodiakData.find((z) => z.nama === zodiakLain);

    if (!dataUser || !dataLain) return null;

    const kecocokanTerbaik = dataUser.kecocokan_terbaik.includes(zodiakLain);
    const kecocokanMenengah = dataUser.kecocokan_menengah.includes(zodiakLain);
    const elemenMatch = elemenKompatibel[dataUser.elemen]?.includes(dataLain.elemen);

    let skor = 50;
    if (kecocokanTerbaik) skor += 30;
    else if (kecocokanMenengah) skor += 15;
    if (elemenMatch) skor += 20;
    if (dataUser.elemen === dataLain.elemen) skor += 15;
    if (dataUser.kualitas === dataLain.kualitas) skor += 10;
    skor = Math.max(0, Math.min(100, skor));

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

    let level = "";
    let levelColor = "";
    if (skor >= 80) { level = "Sangat Cocok"; levelColor = "text-green-400"; }
    else if (skor >= 60) { level = "Cukup Cocok"; levelColor = "text-yellow-400"; }
    else if (skor >= 40) { level = "Netral"; levelColor = "text-blue-400"; }
    else { level = "Perlu Penyesuaian"; levelColor = "text-red-400"; }

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

const hubunganElemen = {
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

export const analisisHubunganElemen = (elemenUser, elemenLain) => {
    return hubunganElemen[elemenUser]?.[elemenLain] || "Analisis hubungan elemen tidak tersedia";
};