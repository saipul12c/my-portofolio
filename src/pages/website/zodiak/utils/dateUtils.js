const months = {
    januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
    juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12
};

export const extractDate = (text) => {
    const dateFormat = text.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
    if (dateFormat) {
        const day = parseInt(dateFormat[1]);
        const month = parseInt(dateFormat[2]);
        const year = parseInt(dateFormat[3]);
        return new Date(year, month - 1, day);
    }

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

export const getZodiakByDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;

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