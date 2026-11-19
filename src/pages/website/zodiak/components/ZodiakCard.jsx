import React from "react";
import { getElementColor } from "../utils/elementColors";

export const ZodiakCard = ({ item, userData, onSelect }) => {
    const isUserZodiak = userData && userData.zodiak === item.nama;
    const isTodayHighlight = new Date().getDate() % 12 === item.id;

    return (
        <div
            onClick={() => onSelect(item)}
            className={`${getElementColor(item.elemen)} p-4 rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 border-2 ${isUserZodiak
                    ? "border-yellow-400 border-opacity-80 shadow-lg shadow-yellow-500/30"
                    : isTodayHighlight
                        ? "border-white/40 border-opacity-60"
                        : "border-white/20"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
};