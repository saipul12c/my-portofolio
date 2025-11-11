export function handleConversion(query) {
  const conversions = {
    suhu: {
      pattern: /(\d+(?:\.\d+)?)\s*(celcius|celsius|c|fahrenheit|f|kelvin|k)/i,
      convert: (value, from) => {
        from = from.toLowerCase();
        if (from.includes('c')) {
          return { 
            f: (value * 9/5 + 32).toFixed(1), 
            k: (value + 273.15).toFixed(2),
            r: ((value + 273.15) * 9/5).toFixed(2)
          };
        } else if (from.includes('f')) {
          return { 
            c: ((value - 32) * 5/9).toFixed(1), 
            k: ((value - 32) * 5/9 + 273.15).toFixed(2),
            r: (value + 459.67).toFixed(2)
          };
        } else {
          return {
            c: (value - 273.15).toFixed(1),
            f: ((value - 273.15) * 9/5 + 32).toFixed(1),
            r: (value * 9/5).toFixed(2)
          };
        }
      }
    },
    matauang: {
      pattern: /(\d+(?:\.\d+)?)\s*(usd|dolar|idr|rupiah|eur|euro|sgd)/i,
      rates: { 
        usd: 15600, idr: 0.000064, eur: 16800, sgd: 11500,
        dolar: 15600, rupiah: 0.000064, euro: 16800
      }
    }
  };

  for (const [type, conv] of Object.entries(conversions)) {
    const match = query.match(conv.pattern);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2];
      
      if (type === 'suhu') {
        const result = conv.convert(value, unit);
        const fromSymbol = unit.toLowerCase().includes('c') ? '°C' : 
                         unit.toLowerCase().includes('f') ? '°F' : 'K';
        return `🌡️ **Konversi Suhu**: ${value}${fromSymbol} =\n• **${result.f}°F** (Fahrenheit)\n• **${result.k}K** (Kelvin)\n• **${result.r}°R** (Rankine)`;
      }
      
      if (type === 'matauang') {
        if (unit.toLowerCase() === 'usd' || unit.toLowerCase() === 'dolar') {
          const idr = (value * conv.rates.usd).toLocaleString();
          const eur = (value * conv.rates.eur / conv.rates.usd).toFixed(2);
          const sgd = (value * conv.rates.sgd / conv.rates.usd).toFixed(2);
          return `💱 **Konversi Mata Uang**: $${value} =\n• **Rp ${idr}** (Rupiah)\n• **€${eur}** (Euro)\n• **S$${sgd}** (Dolar Singapura)`;
        } else if (unit.toLowerCase() === 'idr' || unit.toLowerCase() === 'rupiah') {
          const usd = (value * conv.rates.idr).toFixed(2);
          const eur = (value * conv.rates.idr * conv.rates.eur / conv.rates.usd).toFixed(2);
          return `💱 **Konversi Mata Uang**: Rp ${value.toLocaleString()} =\n• **$${usd}** (Dolar AS)\n• **€${eur}** (Euro)`;
        }
      }
    }
  }
  return null;
}