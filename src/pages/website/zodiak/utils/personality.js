export const analisisKepribadian = (zodiakData, numerology) => {
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

    switch (zodiakData.elemen) {
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

    switch (zodiakData.kualitas) {
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

    analisis.intelektual += (numerology.angkaHidup || 5);
    analisis.spiritual += (numerology.angkaTakdir || 5);
    analisis.emosional += (numerology.energiNama || 50) / 10;

    Object.keys(analisis).forEach((key) => {
        analisis[key] = Math.max(1, Math.min(100, Math.round(analisis[key])));
    });

    const deskripsi = `Sebagai ${zodiakData.nama} (${zodiakData.elemen}), kepribadianmu didominasi oleh ${analisis.intelektual >= 70 ? "kecerdasan dan logika" :
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