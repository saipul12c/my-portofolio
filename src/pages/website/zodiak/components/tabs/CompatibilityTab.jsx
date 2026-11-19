import React from "react";
import { getElementColorLight } from "../../utils/elementColors";

export const CompatibilityTab = ({ zodiak }) => {
    const compatibility = zodiak.kompatibilitasList;
    if (!compatibility) return null;

    return (
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
                            <div className={`text-sm font-semibold ${comp.levelColor}`}>{comp.level}</div>
                        </div>

                        <div className="space-y-3">
                            {comp.kekuatan.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-green-300 mb-1">Kekuatan:</p>
                                    <ul className="text-xs space-y-1">
                                        {comp.kekuatan.slice(0, 2).map((k, i) => (
                                            <li key={i} className="flex items-start gap-1"><span>✓</span> {k}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {comp.kelemahan.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-red-300 mb-1">Perhatian:</p>
                                    <ul className="text-xs space-y-1">
                                        {comp.kelemahan.slice(0, 2).map((k, i) => (
                                            <li key={i} className="flex items-start gap-1"><span>!</span> {k}</li>
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

            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-300/20">
                <h4 className="font-bold mb-2">💡 Catatan tentang Kecocokan Zodiak</h4>
                <p className="text-sm">
                    Kecocokan zodiak didasarkan pada kombinasi elemen ({zodiak.elemen}), kualitas ({zodiak.kualitas}),
                    dan karakteristik unik setiap zodiak. Hasil ini sebagai panduan umum, hubungan yang sesungguhnya
                    dibangun melalui komunikasi dan saling pengertian.
                </p>
            </div>
        </div>
    );
};