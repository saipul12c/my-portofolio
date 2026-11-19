import React from "react";

export const NumerologyTab = ({ zodiak }) => {
    const numerologyData = zodiak.numerology;
    if (!numerologyData) return null;

    return (
        <div className="bg-white/10 p-6 rounded-xl animate-fadeIn">
            <h3 className="text-xl font-bold text-pink-300 mb-6">
                🔢 Analisis Numerologi untuk {zodiak.namaUser || "Anda"}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-5 rounded-xl border border-blue-300/20">
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

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-5 rounded-xl border border-purple-300/20">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl">
                    <h4 className="font-bold mb-3 flex items-center gap-2"><span>🔤</span> Analisis Huruf Pertama</h4>
                    <p className="text-lg font-semibold mb-2">{zodiak.sifatNama}</p>
                    <p className="text-sm mb-3">{zodiak.deskripsiNama}</p>
                    <div className="text-xs text-gray-300">
                        Elemen Nama: <span className="font-semibold">{numerologyData.elemenNama}</span>
                        {zodiak.hurufAwal && (
                            <span className="ml-4">Huruf: <span className="font-semibold">{zodiak.hurufAwal}</span></span>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl">
                    <h4 className="font-bold mb-3 flex items-center gap-2"><span>✨</span> Harmoni dengan Zodiak</h4>
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

            {numerologyData.analisisLengkap && (
                <div className="mt-6 p-4 bg-black/20 rounded-xl">
                    <h4 className="font-bold mb-2">📝 Analisis Numerologi Lengkap</h4>
                    <p className="text-sm">{numerologyData.analisisLengkap}</p>
                </div>
            )}
        </div>
    );
};