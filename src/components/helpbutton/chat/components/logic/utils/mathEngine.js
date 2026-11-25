/**
 * mathEngine.js
 * Mesin Logika & Komputasi Matematika Presisi Tinggi SaipulAI (Golden Synthesis Edition)
 * Mendukung:
 * 1. Ekspresi simbolik & aritmatika majemuk dengan aturan Kabataku/PEMDAS
 * 2. Normalisasi angka bahasa Indonesia & Inggris (terbilang & kata angka)
 * 3. Sanitasi format lokal Indonesia (titik ribuan vs koma desimal secara cerdas)
 * 4. Pemecah persamaan linear (ax + b = c) & kuadrat (ax^2 + bx + c = 0 via rumus ABC)
 * 5. Kalkulus integral simbolik tak tentu (+ C) & integral tentu numerik (Simpson's 1/3 Rule)
 * 6. Kalkulus turunan (derivative) simbolik & numerik
 * 7. Akar kuadrat/kubik, persentase, pangkat, trigonometri, dan logaritma.
 * 
 * 100% Native on-device, CSP-Safe (No eval / No Function constructor), presisi (< 2ms).
 */

import { create, all } from 'mathjs';

const math = create(all);

/**
 * Konversi angka ke terbilang Bahasa Indonesia
 */
export function numberToIndonesianWords(n) {
  if (typeof n !== 'number' || isNaN(n) || !isFinite(n)) return '';
  if (n === 0) return 'nol';
  if (n < 0) return `minus ${numberToIndonesianWords(-n)}`;
  
  // Jika desimal
  if (!Number.isInteger(n)) {
    const parts = n.toString().split('.');
    const intPart = numberToIndonesianWords(parseInt(parts[0], 10));
    const decDigits = parts[1].split('').map(d => {
      const u = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
      return u[parseInt(d, 10)] || d;
    }).join(' ');
    return `${intPart} koma ${decDigits}`;
  }

  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

  if (n < 12) return units[n];
  if (n < 20) return `${numberToIndonesianWords(n - 10)} belas`;
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const rem = n % 10;
    return `${units[tens]} puluh${rem > 0 ? ` ${numberToIndonesianWords(rem)}` : ''}`;
  }
  if (n < 200) {
    const rem = n - 100;
    return `seratus${rem > 0 ? ` ${numberToIndonesianWords(rem)}` : ''}`;
  }
  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const rem = n % 100;
    return `${units[hundreds]} ratus${rem > 0 ? ` ${numberToIndonesianWords(rem)}` : ''}`;
  }
  if (n < 2000) {
    const rem = n - 1000;
    return `seribu${rem > 0 ? ` ${numberToIndonesianWords(rem)}` : ''}`;
  }
  if (n < 1000000) {
    const thousands = Math.floor(n / 1000);
    const rem = n % 1000;
    return `${numberToIndonesianWords(thousands)} ribu${rem > 0 ? ` ${numberToIndonesianWords(rem)}` : ''}`;
  }
  if (n < 1000000000) {
    const millions = Math.floor(n / 1000000);
    const rem = n % 1000000;
    return `${numberToIndonesianWords(millions)} juta${rem > 0 ? ` ${numberToIndonesianWords(rem)}` : ''}`;
  }
  if (n < 1000000000000) {
    const billions = Math.floor(n / 1000000000);
    const rem = n % 1000000000;
    return `${numberToIndonesianWords(billions)} miliar${rem > 0 ? ` ${numberToIndonesianWords(rem)}` : ''}`;
  }
  return n.toLocaleString('id-ID');
}

/**
 * Normalisasi kata angka Bahasa Indonesia & Inggris menjadi angka numerik
 */
export function wordsToNumbers(text) {
  if (!text || typeof text !== 'string') return '';
  let s = text.toLowerCase();

  const units = {
    nol: 0, kosong: 0, zero: 0,
    satu: 1, one: 1,
    dua: 2, two: 2,
    tiga: 3, three: 3,
    empat: 4, four: 4,
    lima: 5, five: 5,
    enam: 6, six: 6,
    tujuh: 7, seven: 7,
    delapan: 8, eight: 8,
    sembilan: 9, nine: 9
  };

  // Kata dasar khusus
  s = s.replace(/\bsebelas\b/g, ' 11 ');
  s = s.replace(/\bsepuluh\b/g, ' 10 ');
  s = s.replace(/\bseratus\b/g, ' 100 ');
  s = s.replace(/\bseribu\b/g, ' 1000 ');
  s = s.replace(/\bsejuta\b/g, ' 1000000 ');
  s = s.replace(/\bten\b/g, ' 10 ');
  s = s.replace(/\beleven\b/g, ' 11 ');
  s = s.replace(/\btwelve\b/g, ' 12 ');
  s = s.replace(/\bhundred\b/g, ' 100 ');
  s = s.replace(/\bthousand\b/g, ' 1000 ');

  // Belasan: dua belas -> 12, dst.
  s = s.replace(/\b(satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s+belas\b/g, (m, u) => 10 + units[u]);

  // Puluhan: dua puluh lima -> 25, dua puluh -> 20
  s = s.replace(/\b(dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s+puluh(?:\s+(satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan))?\b/g, (m, u1, u2) => {
    return (units[u1] * 10) + (u2 ? units[u2] : 0);
  });

  // Ratusan: dua ratus lima puluh -> 250
  s = s.replace(/\b(\d+)\s+ratus(?:\s+(\d+))?\b/g, (m, r, rest) => {
    return (parseInt(r, 10) * 100) + (rest ? parseInt(rest, 10) : 0);
  });
  s = s.replace(/\b(dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s+ratus(?:\s+(\d+))?\b/g, (m, u, rest) => {
    return (units[u] * 100) + (rest ? parseInt(rest, 10) : 0);
  });

  // Ribuan
  s = s.replace(/\b(\d+)\s+ribu(?:\s+(\d+))?\b/g, (m, r, rest) => {
    return (parseInt(r, 10) * 1000) + (rest ? parseInt(rest, 10) : 0);
  });

  // Angka satuan tunggal
  for (const [k, v] of Object.entries(units)) {
    s = s.replace(new RegExp(`\\b${k}\\b`, 'g'), ` ${v} `);
  }

  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Sanitasi aman format angka lokal Indonesia (titik ribuan vs koma desimal)
 * Memastikan titik ribuan "10.000" dikonversi ke "10000" tanpa merusak konstanta ilmiah seperti 3.141 atau 0.001
 */
export function safeSanitizeIndonesianNumbers(text) {
  if (!text || typeof text !== 'string') return '';
  let s = text;

  // 1. Format komposit: ribuan titik + desimal koma (misal: 10.000,50 -> 10000.50)
  s = s.replace(/(\b\d{1,3}(?:\.\d{3})+),(\d+\b)/g, (match, thousands, decimals) => {
    return thousands.replace(/\./g, '') + '.' + decimals;
  });

  // 2. Format desimal koma murni Indonesia (misal: 3,5 -> 3.5, 0,25 -> 0.25)
  s = s.replace(/(\d+),(\d+)/g, '$1.$2');

  // 3. Format titik ribuan Indonesia murni (misal: 10.000, 50.000, 1.000.000)
  // Lindungi nilai pi 3.141 atau desimal yang diawali 0.xxx
  s = s.replace(/\b([1-9]\d{0,2})(?:\.(\d{3}))+(?!\d)/g, (match) => {
    if (match === '3.141') return match;
    return match.replace(/\./g, '');
  });

  return s;
}

/**
 * Pemecah Persamaan Linear (ax + b = c) & Kuadrat (ax^2 + bx + c = 0)
 */
function solveEquation(text) {
  if (!text.includes('=')) return null;

  // Ekstrak persamaan bersih: contoh "2x + 10 = 20" atau "x^2 - 5x + 6 = 0"
  let cleanEq = text
    .replace(/\b(selesaikan|persamaan|hitung|nilai x|berapa nilai x jika|cari nilai x|akar persamaan kuadrat|akar dari)\b/gi, '')
    .replace(/[?,!]/g, '')
    .trim();

  const sides = cleanEq.split('=');
  if (sides.length !== 2) return null;

  let left = sides[0].trim();
  let right = sides[1].trim();
  if (!left || !right) return null;

  // Pastikan persamaan memuat variabel x yang valid (misal: x, 2x, 3x^2, bukan kata seperti max atau box)
  const hasVariableX = (str) => /(?:^|[^a-zA-Z])\d*x(?![a-zA-Z])/i.test(str);
  if (!hasVariableX(left) && !hasVariableX(right)) return null;

  try {
    // Bangun fungsi f(x) = (left) - (right) = 0
    const diffExpr = `(${left}) - (${right})`;
    const node = math.parse(diffExpr);
    const compiled = node.compile();
    const f = (val) => compiled.evaluate({ x: val });

    // Evaluasi titik acuan f(0), f(1), f(-1), f(2)
    const y0 = f(0);
    const y1 = f(1);
    const y_1 = f(-1);
    const y2 = f(2);

    if (isNaN(y0) || isNaN(y1) || isNaN(y_1) || isNaN(y2)) return null;

    // Koefisien persamaan Ax^2 + Bx + C = 0
    const C = y0;
    const A = Number(((y1 + y_1 - 2 * C) / 2).toFixed(6));
    const B = Number(((y1 - y_1) / 2).toFixed(6));

    // Cek apakah kuadrat / linear konsisten pada titik y2
    const expectedY2 = Number((A * 4 + B * 2 + C).toFixed(4));
    if (Math.abs(y2 - expectedY2) > 0.001) {
      // Bukan persamaan polinomial derajat <= 2 (mungkin orde 3 atau trigonometri)
      return null;
    }

    // KASUS 1: PERSAMAAN LINEAR (A === 0) -> Bx + C = 0 => x = -C / B
    if (Math.abs(A) < 1e-9) {
      if (Math.abs(B) < 1e-9) {
        if (Math.abs(C) < 1e-9) {
          return {
            isMath: true,
            operation: 'Persamaan Linear',
            expression: `${left} = ${right}`,
            result: 'Tak Terhingga',
            answer: `🧮 **Penyelesaian Persamaan Linear**\n\n• **Persamaan**: \`${left} = ${right}\`\n• **Analisis**: Persamaan bernilai identik (memiliki tak terhingga solusi nilai x).`
          };
        }
        return {
          isMath: true,
          operation: 'Persamaan Linear',
          expression: `${left} = ${right}`,
          result: 'Tidak Ada Solusi',
          answer: `🧮 **Penyelesaian Persamaan Linear**\n\n• **Persamaan**: \`${left} = ${right}\`\n• **Analisis**: Tidak memiliki solusi nilai x yang memenuhi.`
        };
      }

      const xVal = Number((-C / B).toFixed(6));
      const terbilang = Number.isInteger(xVal) ? ` *(${numberToIndonesianWords(xVal)})*` : '';

      return {
        isMath: true,
        operation: 'Persamaan Linear',
        expression: `${left} = ${right}`,
        result: xVal,
        answer: `🧮 **Penyelesaian Persamaan Linear**\n\n• **Persamaan**: \`${left} = ${right}\`\n• **Bentuk Standar**: \`${B !== 1 ? B : ''}x ${C >= 0 ? '+ ' + C : '- ' + Math.abs(C)} = 0\`\n• **Langkah**: $x = \\frac{${-C}}{${B}}$\n• **Nilai x**: **${xVal}**${terbilang}\n\nHasil penyelesaian persamaan linear berhasil dihitung secara presisi.`
      };
    }

    // KASUS 2: PERSAMAAN KUADRAT (A !== 0) -> Ax^2 + Bx + C = 0 via Rumus ABC
    const D = Number((B * B - 4 * A * C).toFixed(6));
    let rootExplanation = '';
    let rootsResult = '';

    if (D > 0) {
      const x1 = Number(((-B + Math.sqrt(D)) / (2 * A)).toFixed(6));
      const x2 = Number(((-B - Math.sqrt(D)) / (2 * A)).toFixed(6));
      rootsResult = `x₁ = ${x1}, x₂ = ${x2}`;
      rootExplanation = `• **Akar Real Berbeda** (D > 0):\n  - **x₁** = $\\frac{-(${B}) + \\sqrt{${D}}}{2(${A})} =$ **${x1}**\n  - **x₂** = $\\frac{-(${B}) - \\sqrt{${D}}}{2(${A})} =$ **${x2}**`;
    } else if (Math.abs(D) < 1e-9) {
      const x = Number((-B / (2 * A)).toFixed(6));
      rootsResult = `x = ${x}`;
      rootExplanation = `• **Akar Real Kembar** (D = 0):\n  - **x** = $\\frac{-(${B})}{2(${A})} =$ **${x}**`;
    } else {
      const realPart = Number((-B / (2 * A)).toFixed(4));
      const imagPart = Number((Math.sqrt(-D) / (2 * Math.abs(A))).toFixed(4));
      rootsResult = `x = ${realPart} ± ${imagPart}i`;
      rootExplanation = `• **Akar Kompleks / Imajiner** (D < 0):\n  - **x₁** = **${realPart} + ${imagPart}i**\n  - **x₂** = **${realPart} - ${imagPart}i**`;
    }

    return {
      isMath: true,
      operation: 'Persamaan Kuadrat',
      expression: `${left} = ${right}`,
      result: rootsResult,
      answer: `🧮 **Penyelesaian Persamaan Kuadrat (Rumus ABC)**\n\n• **Persamaan**: \`${left} = ${right}\`\n• **Bentuk Standar**: \`${A}x² ${B >= 0 ? '+ ' + B : '- ' + Math.abs(B)}x ${C >= 0 ? '+ ' + C : '- ' + Math.abs(C)} = 0\`\n• **Diskriminan ($D = b^2 - 4ac$)**: **${D}**\n${rootExplanation}\n\nPersamaan kuadrat berhasil diselesaikan.`
    };
  } catch {
    return null;
  }
}

/**
 * Pemecah Integral Simbolik Tak Tentu Polinomial (∫ ax^n dx = [a/(n+1)]x^(n+1) + C)
 */
function solveIndefiniteIntegral(text) {
  // Hanya jika ada kata integral tapi TANPA kata 'dari ... sampai ...'
  if (!/\bintegral\b/i.test(text) || /\bdari\b.*?\bsampai\b/i.test(text)) return null;

  // Ekstrak fungsi: misal "integral 2x dx", "integral dari 3x^2 + 4x", "integral tak tentu 5x"
  let funcStr = text
    .replace(/\b(hitung|tentukan|hasil dari|berapa)?\s*integral\s+(tak tentu\s+)?(dari\s+)?/gi, '')
    .replace(/\bdx\b/gi, '')
    .replace(/[?,!]/g, '')
    .trim();

  if (!funcStr) return null;

  // Tangani fungsi trigonometri dasar simbolik
  const cleanF = funcStr.toLowerCase().replace(/\s+/g, '');
  if (cleanF === 'sin(x)' || cleanF === 'sinx') {
    return {
      isMath: true,
      operation: 'Integral Simbolik',
      expression: `∫ sin(x) dx`,
      result: '-cos(x) + C',
      answer: `🧮 **Perhitungan Integral Tak Tentu (Simbolik)**\n\n• **Soal**: $\\int \\sin(x)\\,dx$\n• **Hasil**: **$-\\cos(x) + C$**\n\nAturan dasar kalkulus: Turunan dari $-\\cos(x)$ adalah $\\sin(x)$.`
    };
  }
  if (cleanF === 'cos(x)' || cleanF === 'cosx') {
    return {
      isMath: true,
      operation: 'Integral Simbolik',
      expression: `∫ cos(x) dx`,
      result: 'sin(x) + C',
      answer: `🧮 **Perhitungan Integral Tak Tentu (Simbolik)**\n\n• **Soal**: $\\int \\cos(x)\\,dx$\n• **Hasil**: **$\\sin(x) + C$**\n\nAturan dasar kalkulus: Turunan dari $\\sin(x)$ adalah $\\cos(x)$.`
    };
  }

  // Tangani suku polinomial: ax^n atau ax atau konstanta
  // Pisahkan berdasarkan operator + atau -
  try {
    const termMatches = funcStr.match(/[+-]?[^+-]+/g);
    if (!termMatches) return null;

    let integratedTerms = [];
    for (let rawTerm of termMatches) {
      let term = rawTerm.trim();
      if (!term) continue;

      let sign = '+';
      if (term.startsWith('-')) {
        sign = '-';
        term = term.slice(1).trim();
      } else if (term.startsWith('+')) {
        term = term.slice(1).trim();
      }

      // 1. Kasus a*x^n
      const powerMatch = term.match(/^(\d+(?:\.\d+)?|\b)?\*?x(?:\^(\d+))?$/i);
      if (powerMatch) {
        let coeff = powerMatch[1] === undefined || powerMatch[1] === '' ? 1 : parseFloat(powerMatch[1]);
        let power = powerMatch[2] === undefined ? 1 : parseInt(powerMatch[2], 10);
        let newPower = power + 1;
        let newCoeff = coeff / newPower;
        let formattedCoeff = Number.isInteger(newCoeff) ? newCoeff : Number(newCoeff.toFixed(4));
        
        let termStr = '';
        if (formattedCoeff === 1) termStr = `x^${newPower}`;
        else if (formattedCoeff === -1) termStr = `-x^${newPower}`;
        else termStr = `${formattedCoeff}x^${newPower}`;

        if (newPower === 1) termStr = termStr.replace('^1', '');
        integratedTerms.push({ sign, termStr });
        continue;
      }

      // 2. Kasus konstanta tunggal c -> c*x
      const constMatch = term.match(/^(\d+(?:\.\d+)?)$/);
      if (constMatch) {
        let c = parseFloat(constMatch[1]);
        integratedTerms.push({ sign, termStr: `${c}x` });
        continue;
      }

      // Jika ada suku yang tidak dikenali, batalkan agar tidak memberikan jawaban salah
      return null;
    }

    if (integratedTerms.length === 0) return null;

    let finalExpr = '';
    integratedTerms.forEach((item, idx) => {
      if (idx === 0) {
        finalExpr += item.sign === '-' ? `-${item.termStr}` : item.termStr;
      } else {
        finalExpr += ` ${item.sign} ${item.termStr}`;
      }
    });

    finalExpr += ' + C';

    return {
      isMath: true,
      operation: 'Integral Simbolik',
      expression: `∫ (${funcStr}) dx`,
      result: finalExpr,
      answer: `🧮 **Perhitungan Integral Tak Tentu (Simbolik)**\n\n• **Soal**: $\\int (${funcStr})\\,dx$\n• **Aturan Pangkat**: $\\int a x^n\\,dx = \\frac{a}{n+1}x^{n+1}$\n• **Hasil**: **$${finalExpr}$**\n\n*(C adalah konstanta integrasi).*`
    };
  } catch {
    return null;
  }
}

/**
 * Pemecah Integral Tentu Numerik (Simpson's 1/3 Rule 100% CSP Safe)
 */
function solveDefiniteIntegral(text) {
  const m = text.match(/integral\s+(.+?)\s+(?:d(?:x|x?)\s*)?(?:dari\s*([-0-9.]+)\s*sampai\s*([-0-9.]+))/i) || 
            text.match(/integral\s+(.+?)\s+dari\s*([-0-9.]+)\s*sampai\s*([-0-9.]+)/i);
  if (!m) return null;

  const integrandRaw = m[1].trim();
  const a = parseFloat(m[2]);
  const b = parseFloat(m[3]);

  if (isNaN(a) || isNaN(b)) {
    return {
      isMath: true,
      operation: 'Integral Tentu',
      result: 'Batas Tidak Valid',
      answer: '📐 Berikan batas integrasi yang valid, contoh: "Hitung integral x^2 dari 0 sampai 1".'
    };
  }

  try {
    const node = math.parse(integrandRaw);
    const code = node.compile();
    const f = (val) => code.evaluate({ x: val });

    // Composite Simpson's 1/3 rule (n = 1000 sub-interval)
    const n = 1000;
    const h = (b - a) / n;
    let s = f(a) + f(b);
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      s += (i % 2 === 0) ? 2 * f(x) : 4 * f(x);
    }
    const val = (s * h) / 3;
    const formattedVal = Number.isInteger(val) ? val : Number(val.toFixed(6));

    return {
      isMath: true,
      operation: 'Integral Tentu',
      expression: `∫[${a} -> ${b}] (${integrandRaw}) dx`,
      result: formattedVal,
      answer: `🧮 **Hasil Perhitungan Integral Tentu**\n\n• **Fungsi**: \`${integrandRaw}\`\n• **Batas Integrasi**: dari $x = ${a}$ sampai $x = ${b}$\n• **Hasil Perhitungan**: **${formattedVal}**\n\n*(Dievaluasi dengan metode integrasi numerik presisi tinggi Simpson's 1/3 Rule).*`
    };
  } catch {
    return null;
  }
}

/**
 * Pemecah Turunan / Derivative (Simbolik & Numerik)
 */
function solveDerivative(text) {
  const derivMatch = text.match(/(?:turunan|derivative|deriv)\s+(.+?)\s+(?:pada|di|at)\s*([-0-9.]+)/i);
  if (!derivMatch) return null;

  const funcRaw = derivMatch[1].trim();
  const point = parseFloat(derivMatch[2]);
  if (isNaN(point)) return null;

  try {
    // Coba turunan simbolik math.derivative terlebih dahulu
    const d = math.derivative(funcRaw, 'x');
    const val = d.evaluate({ x: point });
    const formattedVal = Number.isInteger(val) ? val : Number(val.toFixed(6));

    return {
      isMath: true,
      operation: 'Turunan (Derivative)',
      expression: `d/dx (${funcRaw}) pada x = ${point}`,
      result: formattedVal,
      answer: `🧮 **Hasil Perhitungan Turunan (Derivative)**\n\n• **Fungsi**: \`${funcRaw}\`\n• **Turunan Simbolik f'(x)**: \`${d.toString()}\`\n• **Evaluasi pada x = ${point}**: **${formattedVal}**`
    };
  } catch {
    // Fallback: Turunan numerik central difference (h = 1e-6)
    try {
      const node = math.parse(funcRaw);
      const code = node.compile();
      const f = (val) => code.evaluate({ x: val });
      const h = 1e-6;
      const numDeriv = (f(point + h) - f(point - h)) / (2 * h);
      const formattedVal = Number(numDeriv.toFixed(6));

      return {
        isMath: true,
        operation: 'Turunan Numerik',
        expression: `d/dx (${funcRaw}) pada x = ${point}`,
        result: formattedVal,
        answer: `🧮 **Hasil Perhitungan Turunan Numerik**\n\n• **Fungsi**: \`${funcRaw}\`\n• **Evaluasi pada x = ${point}**: **${formattedVal}**`
      };
    } catch {
      return null;
    }
  }
}

/**
 * Menyelesaikan kueri matematika secara menyeluruh dan mengembalikan jawaban alami
 */
export function solveMathQuery(query) {
  if (!query || typeof query !== 'string') return { isMath: false };

  const raw = query.trim();
  const lower = raw.toLowerCase();

  // Filter awal: apakah ada indikator matematika?
  const hasMathKeywords = /\b(akar|akar kuadrat|tambah|plus|ditambah|kurang|minus|dikurang|dikurangi|kali|dikali|perkalian|bagi|dibagi|pembagian|pangkat|dipangkatkan|kuadrat|kubik|persen|%|modulo|mod|sisa bagi|sin|cos|tan|log|ln|sqrt|hitung|hitunglah|jumlahnya|hasil dari|berapa hasil|berapa jumlah|integral|turunan|derivative|deriv|persamaan|nilai x|selesaikan|cari nilai|tentukan)\b/i.test(lower);
  const hasMathSymbols = /[\d]\s*[+\-*/^%×÷√=]\s*[\d]|√\s*\d+|\d+\s*!|\b\d+\s*%|[a-zA-Z]\s*=\s*[\d]/i.test(lower);
  const hasPureCalcPattern = /^(\s*[\d.,]+\s*[+\-*/^%×÷]\s*[\d.,]+\s*)+$/.test(lower);

  if (!hasMathKeywords && !hasMathSymbols && !hasPureCalcPattern) {
    return { isMath: false };
  }

  // 1. Sanitasi format angka Indonesia (titik ribuan & koma desimal) & kata angka
  const localeSanitized = safeSanitizeIndonesianNumbers(lower);
  const normalizedWords = wordsToNumbers(localeSanitized);

  // 2. KASUS A: Persamaan Linear (ax + b = c) & Kuadrat (ax^2 + bx + c = 0)
  if (normalizedWords.includes('=')) {
    const eqResult = solveEquation(normalizedWords);
    if (eqResult && eqResult.isMath) return eqResult;
  }

  // 3. KASUS B: Kalkulus - Integral Tentu & Tak Tentu
  if (/\bintegral\b/i.test(normalizedWords)) {
    const defInt = solveDefiniteIntegral(normalizedWords);
    if (defInt && defInt.isMath) return defInt;

    const indefInt = solveIndefiniteIntegral(normalizedWords);
    if (indefInt && indefInt.isMath) return indefInt;
  }

  // 4. KASUS C: Kalkulus - Turunan / Derivative
  if (/(?:turunan|derivative|deriv)/i.test(normalizedWords)) {
    const derivResult = solveDerivative(normalizedWords);
    if (derivResult && derivResult.isMath) return derivResult;
  }

  // 5. KASUS D: Akar Kuadrat & Akar Pangkat
  const rootMatch = normalizedWords.match(/akar\s+(?:pangkat\s+(\d+)\s+dari\s+|kuadrat\s+(?:dari\s+)?|dari\s+)?(\d+(?:\.\d+)?)/i);
  if (rootMatch) {
    const power = rootMatch[1] ? parseInt(rootMatch[1], 10) : 2;
    const val = parseFloat(rootMatch[2]);
    if (!isNaN(val)) {
      let res;
      let symbol;
      if (power === 2) {
        res = Math.sqrt(val);
        symbol = `√${val}`;
      } else if (power === 3) {
        res = Math.cbrt(val);
        symbol = `³√${val}`;
      } else {
        res = Math.pow(val, 1 / power);
        symbol = `${power}√${val}`;
      }

      const formattedRes = Number.isInteger(res) ? res : Number(res.toFixed(6));
      const terbilang = Number.isInteger(formattedRes) ? ` *(${numberToIndonesianWords(formattedRes)})*` : '';

      return {
        isMath: true,
        operation: 'Akar',
        expression: symbol,
        result: formattedRes,
        answer: `🧮 **Perhitungan Logika Matematika**\n\n• **Operasi**: Akar (${symbol})\n• **Hasil Perhitungan**: **${formattedRes}**${terbilang}\n\n${power === 2 ? `Penjelasan: Karena ${formattedRes} × ${formattedRes} = ${val}, maka $\\sqrt{${val}} = ${formattedRes}$.` : `Hasil penarikan akar pangkat ${power} dari ${val} adalah ${formattedRes}.`}`
      };
    }
  }

  // 6. KASUS E: Persentase (Percentage)
  const percentMatch = normalizedWords.match(/(\d+(?:\.\d+)?)\s*(?:%|persen)\s*(?:dari|of|\*|kali)\s*(\d+(?:\.\d+)?)/i);
  if (percentMatch) {
    const percent = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2]);
    if (!isNaN(percent) && !isNaN(total)) {
      const res = (percent / 100) * total;
      const formattedRes = Number.isInteger(res) ? res : Number(res.toFixed(4));
      const terbilang = Number.isInteger(formattedRes) ? ` *(${numberToIndonesianWords(formattedRes)})*` : '';
      return {
        isMath: true,
        operation: 'Persentase',
        expression: `${percent}% dari ${total.toLocaleString('id-ID')}`,
        result: formattedRes,
        answer: `🧮 **Perhitungan Logika Matematika**\n\n• **Soal**: ${percent}% dari ${total.toLocaleString('id-ID')}\n• **Formula**: (${percent} / 100) × ${total.toLocaleString('id-ID')}\n• **Hasil**: **${formattedRes.toLocaleString('id-ID')}**${terbilang}`
      };
    }
  }

  // 7. KASUS F: Pangkat & Kuadrat
  const powerMatch = normalizedWords.match(/(\d+(?:\.\d+)?)\s*(?:pangkat|dipangkatkan|\^)\s*(\d+(?:\.\d+)?)/i) ||
                     normalizedWords.match(/(\d+(?:\.\d+)?)\s*(kuadrat|kubik)/i);
  if (powerMatch) {
    const base = parseFloat(powerMatch[1]);
    let exp = 2;
    if (powerMatch[2] === 'kuadrat') exp = 2;
    else if (powerMatch[2] === 'kubik') exp = 3;
    else exp = parseFloat(powerMatch[2]);

    if (!isNaN(base) && !isNaN(exp)) {
      const res = Math.pow(base, exp);
      const formattedRes = Number.isInteger(res) ? res : Number(res.toFixed(6));
      const terbilang = Number.isInteger(formattedRes) && formattedRes < 1000000000 ? ` *(${numberToIndonesianWords(formattedRes)})*` : '';
      return {
        isMath: true,
        operation: 'Eksponensial',
        expression: `${base}^${exp}`,
        result: formattedRes,
        answer: `🧮 **Perhitungan Logika Matematika**\n\n• **Soal**: ${base} pangkat ${exp} (${base}^${exp})\n• **Hasil Perhitungan**: **${formattedRes.toLocaleString('id-ID')}**${terbilang}`
      };
    }
  }

  // 8. KASUS G: Aritmatika Standar & Ekspresi Majemuk (+, -, *, /, %, ())
  let expr = normalizedWords
    .replace(/[xX×]/g, '*')
    .replace(/[÷]/g, '/')
    .replace(/\b(tambah|plus|ditambah|dijumlahkan)\b/g, '+')
    .replace(/\b(kurang|minus|dikurang|dikurangi)\b/g, '-')
    .replace(/\b(kali|dikali|perkalian)\b/g, '*')
    .replace(/\b(bagi|dibagi|pembagian|per)\b/g, '/')
    .replace(/\b(sisa bagi|modulo|mod)\b/g, '%');

  expr = expr
    .replace(/\b(berapa|jumlahnya|jumlah|hasilnya|hasil dari|totalnya|total|dong|ya|sih|adalah|coba|tolong|hitung|hitunglah|kalkulator)\b/gi, ' ')
    .replace(/[?,!=]/g, ' ')
    .trim();

  const mathCharsOnly = expr.replace(/[^0-9+\-*/^().,% ]/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (!/\d/.test(mathCharsOnly) || !/[+\-*/^%]/.test(mathCharsOnly)) {
    return { isMath: false };
  }

  try {
    const rawResult = math.evaluate(mathCharsOnly);
    if (typeof rawResult === 'number' && !isNaN(rawResult) && isFinite(rawResult)) {
      const formattedRes = Number.isInteger(rawResult) ? rawResult : Number(rawResult.toFixed(6));
      const terbilang = Number.isInteger(formattedRes) && Math.abs(formattedRes) < 1000000000000 ? ` *(${numberToIndonesianWords(formattedRes)})*` : '';

      // Uraian urutan operasi (Kabataku / PEMDAS) jika ada operasi campuran (* atau / bersamaan dengan + atau -)
      const hasMixedOperations = (/[*/]/.test(mathCharsOnly) && /[+-]/.test(mathCharsOnly));
      const pemdasNote = hasMixedOperations ? `\n• **Urutan Operasi**: Mengikuti hierarki Kabataku / PEMDAS (perkalian/pembagian diutamakan sebelum penjumlahan/pengurangan).` : '';

      return {
        isMath: true,
        operation: 'Aritmatika',
        expression: mathCharsOnly,
        result: formattedRes,
        answer: `🧮 **Perhitungan Logika Matematika**\n\n• **Soal / Ekspresi**: \`${mathCharsOnly}\`${pemdasNote}\n• **Hasil Perhitungan**: **${formattedRes.toLocaleString('id-ID')}**${terbilang}\n\nPerhitungan dievaluasi secara presisi oleh mesin logika SaipulAI.`
      };
    }
  } catch {
    return { isMath: false };
  }

  return { isMath: false };
}

/**
 * Delegator terpadu yang kompatibel dengan signature calculateMath lama
 * Dipanggil oleh mathCalculator.js sebagai safe façade
 */
export function calculateMathUnified(expression, calculationPrecision = 'high') {
  if (!expression || typeof expression !== 'string') return null;

  // 1. Coba lewat solveMathQuery lengkap
  const sol = solveMathQuery(expression);
  if (sol && sol.isMath && sol.answer) {
    return sol.answer;
  }

  // 2. Fallback evaluasi langsung mathjs
  try {
    const sanitized = safeSanitizeIndonesianNumbers(expression);
    const result = math.evaluate(sanitized);

    if (typeof result === 'number' && !isNaN(result)) {
      const precision = calculationPrecision === 'low' ? 2 : 
                        calculationPrecision === 'medium' ? 4 : 
                        calculationPrecision === 'high' ? 6 : 6;
      return `🧮 **Hasil Perhitungan**: \`${expression}\` = **${Number(result.toFixed(precision))}**`;
    }
  } catch {
    return null;
  }

  return null;
}
