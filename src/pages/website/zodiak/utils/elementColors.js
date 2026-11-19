export const getElementColor = (elemen) => {
    switch (elemen) {
        case "Api": return "bg-gradient-to-r from-red-500 to-orange-500";
        case "Air": return "bg-gradient-to-r from-blue-500 to-cyan-500";
        case "Tanah": return "bg-gradient-to-r from-yellow-600 to-amber-700";
        case "Udara": return "bg-gradient-to-r from-indigo-400 to-purple-400";
        default: return "bg-gradient-to-r from-gray-600 to-gray-800";
    }
};

export const getElementColorLight = (elemen) => {
    switch (elemen) {
        case "Api": return "bg-gradient-to-r from-red-500/20 to-orange-500/20";
        case "Air": return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20";
        case "Tanah": return "bg-gradient-to-r from-yellow-600/20 to-amber-700/20";
        case "Udara": return "bg-gradient-to-r from-indigo-400/20 to-purple-400/20";
        default: return "bg-gradient-to-r from-gray-600/20 to-gray-800/20";
    }
};