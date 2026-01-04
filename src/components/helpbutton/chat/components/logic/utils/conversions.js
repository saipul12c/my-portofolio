export function handleConversion(query = '') {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim();

  // Helper: normalize number strings like "1.000,50" or "1,000.50"
  const parseNumber = (s) => {
    if (typeof s !== 'string') return Number(s);
    const cleaned = s.replace(/\s+/g, '').replace(/,/g, '.');
    const n = parseFloat(cleaned);
    return isNaN(n) ? null : n;
  };

  // Temperature conversions
  const tempPattern = /(-?\d+(?:[.,]\d+)?)\s*(°?\s*(?:celsius|celcius|c|fahrenheit|f|kelvin|k|°c|°f|°k|°r|rankine))/i;
  const tempMatch = q.match(tempPattern);
  if (tempMatch) {
    const rawValue = tempMatch[1];
    const unitRaw = tempMatch[2];
    const value = parseNumber(rawValue);
    if (value === null) return null;
    const unit = unitRaw.toLowerCase();

    const out = {};
    if (/c|°c|celsius|celcius/.test(unit)) {
      out.C = value;
      out.F = Number((value * 9 / 5 + 32).toFixed(2));
      out.K = Number((value + 273.15).toFixed(3));
      out.R = Number(((value + 273.15) * 9 / 5).toFixed(3));
    } else if (/f|°f|fahrenheit/.test(unit)) {
      out.F = value;
      out.C = Number(((value - 32) * 5 / 9).toFixed(2));
      out.K = Number((((value - 32) * 5 / 9) + 273.15).toFixed(3));
      out.R = Number((value + 459.67).toFixed(3));
    } else if (/k|°k|kelvin/.test(unit)) {
      out.K = value;
      out.C = Number((value - 273.15).toFixed(2));
      out.F = Number(((value - 273.15) * 9 / 5 + 32).toFixed(2));
      out.R = Number((value * 9 / 5).toFixed(3));
    } else if (/r|rankine|°r/.test(unit)) {
      out.R = value;
      out.K = Number((value * 5 / 9).toFixed(3));
      out.C = Number((out.K - 273.15).toFixed(2));
      out.F = Number(((out.K - 273.15) * 9 / 5 + 32).toFixed(2));
    }

    return `🌡️ Konversi suhu: **${value} ${unitRaw.trim()}** → **${out.C}°C**, **${out.F}°F**, **${out.K}K**, **${out.R}°R**`;
  }

  // Currency conversions (offline rates, approximate). Keys normalized to lower-case.
  const currencyPattern = /([\d.,]+)\s*(usd|dolar|usd\$|idr|rupiah|eur|euro|sgd|sgd\$|sgd|sgd\s?\$)/i;
  const curMatch = q.match(currencyPattern);
  if (curMatch) {
    const raw = curMatch[1];
    const unit = curMatch[2].toLowerCase();
    const value = parseNumber(raw);
    if (value === null) return null;

    // Basic offline rates; for live rates, integrate an API.
    const rates = {
      usd: { idr: 15600, eur: 0.92, sgd: 1.35 },
      eur: { idr: 16800, usd: 1.09, sgd: 1.47 },
      sgd: { idr: 11500, usd: 0.74, eur: 0.68 },
      idr: { usd: 0.000064, eur: 0.000059, sgd: 0.000087 }
    };

    const key = unit.includes('usd') || unit.includes('dolar') ? 'usd' : (unit.includes('eur') || unit.includes('euro') ? 'eur' : (unit.includes('sgd') ? 'sgd' : 'idr'));
    const r = rates[key];
    if (!r) return null;

    const nf = new Intl.NumberFormat('id-ID');
    const parts = [];
    Object.keys(r).forEach(k => {
      const v = key === 'idr' ? Number((value * r[k]).toFixed(2)) : Number((value * r[k]).toFixed(2));
      parts.push(`• **${k.toUpperCase()}**: ${k === 'idr' ? `Rp ${nf.format(v)}` : `${v} ${k.toUpperCase()}`}`);
    });

    return `💱 Konversi mata uang: **${value} ${key.toUpperCase()}** →\n${parts.join('\n')}`;
  }

  return null;
}