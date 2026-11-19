import React from "react";
import zodiakData from "../data/zodiakData";
import { ZodiakCard } from "./ZodiakCard";

export const GridView = ({ userData, isMobile, onSelectZodiak, onClearUserData }) => (
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
                            Berdasarkan tanggal lahir: {new Date(userData.tanggalLahir).toLocaleDateString("id-ID")}
                        </p>
                    </div>
                    <button
                        onClick={onClearUserData}
                        className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/30 hover:from-red-600/30 hover:to-red-700/40 rounded-lg font-medium text-sm border border-red-400/30 transition-all hover:scale-105"
                    >
                        Hapus Data Saya
                    </button>
                </div>
            </div>
        )}

        <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"} gap-4`}>
            {zodiakData.map((item) => (
                <ZodiakCard key={item.id} item={item} userData={userData} onSelect={onSelectZodiak} />
            ))}
        </div>

        <div className="mt-8 text-center">
            <p className="text-sm text-gray-300 mb-2">Atau ketik seperti ngobrol:</p>
            <p className="text-pink-300 font-medium">"Namaku Rina lahir 17 Mei 2001"</p>
            <p className="text-xs text-gray-400 mt-4">
                Kartu dengan border kuning adalah zodiak Anda berdasarkan input
            </p>
        </div>
    </div>
);