import { create, all } from 'mathjs';

const math = create(all);

export function calculateMath(expression, calculationPrecision) {
  try {
    const expr = String(expression || '').trim();
    if (!expr) return null;

    const lower = expr.toLowerCase();

    // Helper: format numeric result
    const fmt = (num) => {
      const precision = calculationPrecision === 'low' ? 2 : 
                       calculationPrecision === 'medium' ? 4 : 
                       calculationPrecision === 'high' ? 6 : 6;
      if (typeof num === 'number' && !isNaN(num)) return Number(num.toFixed(precision));
      return num;
    };

    // Helper to map math tokens to JS Math equivalents
    const mapMathTokens = (expr) => {
      return expr
        .replace(/√/g, 'Math.sqrt')
        .replace(/π/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/\^/g, '**')
        .replace(/²/g, '**2')
        .replace(/³/g, '**3');
    };

    // Process math tokens for older code path
    const advancedOps = {
      sin: 'Math.sin',
      cos: 'Math.cos',
      tan: 'Math.tan',
      log: 'Math.log10',
      ln: 'Math.log',
      exp: 'Math.exp',
      abs: 'Math.abs'
    };

    // --- INTEGRAL CALCULATION ---
    if (lower.includes('integral')) {
      try {
        // Try to use mathjs approach first
        const m = lower.match(/integral\s+(.+?)\s+(?:d(?:x|x?)\s*)?(?:dari\s*([-0-9.]+)\s*sampai\s*([-0-9.]+))/i) || 
                  lower.match(/integral\s+(.+?)\s+dari\s*([-0-9.]+)\s*sampai\s*([-0-9.]+)/i);
        
        if (m) {
          const integrandRaw = m[1];
          const a = parseFloat(m[2]);
          const b = parseFloat(m[3]);
          
          if (isNaN(a) || isNaN(b)) {
            return '📐 Berikan batas integrasi yang valid, contoh: dari 0 sampai 1.';
          }

          try {
            // Try to use mathjs for parsing
            const node = math.parse(integrandRaw);
            const code = node.compile();
            const f = (x) => code.evaluate({ x });

            // Composite Simpson's rule
            const simpson = (func, aa, bb, n = 1000) => {
              if (n % 2 === 1) n++;
              const h = (bb - aa) / n;
              let s = func(aa) + func(bb);
              for (let i = 1; i < n; i++) {
                const x = aa + i * h;
                s += (i % 2 === 0) ? 2 * func(x) : 4 * func(x);
              }
              return (s * h) / 3;
            };

            const val = simpson(f, a, b, 1000);
            return `🧮 **Hasil Perhitungan Integral**: \`${integrandRaw}\` dari ${a} sampai ${b} = **${fmt(val)}**\n📐 *Perhitungan integral numerik*`;
          } catch (_) { void _;
            // Fallback to original method
            const integralMatch = lower.match(/integral\s+(.+?)\s+d[a-z]?\s*(?:dari\s*([-0-9.]+)\s*sampai\s*([-0-9.]+))?/i);
            if (integralMatch) {
              const integrandRaw = integralMatch[1];
              const a = integralMatch[2] !== undefined ? parseFloat(integralMatch[2]) : null;
              const b = integralMatch[3] !== undefined ? parseFloat(integralMatch[3]) : null;
              
              if (a === null || b === null) {
                return '📐 Untuk menghitung integral numerik, berikan batas integrasi, contoh: "Hitung integral x^3 dari 0 sampai 1".';
              }

              const integrand = mapMathTokens(integrandRaw).replace(/[^0-9+\-*/().,%\s^*xXMathPIEa-zA-Z]/g, '');

              const f = Function('x', `return (${integrand})`);
              const integrate = (func, aa, bb, n = 1000) => {
                if (n % 2 === 1) n++;
                const h = (bb - aa) / n;
                let s = func(aa) + func(bb);
                for (let i = 1; i < n; i++) {
                  const x = aa + i * h;
                  s += (i % 2 === 0) ? 2 * func(x) : 4 * func(x);
                }
                return (s * h) / 3;
              };

              const integralValue = integrate(f, a, b, 1000);
              return `🧮 **Hasil Perhitungan Integral**: \`${integrandRaw}\` dari ${a} sampai ${b} = **${Number(integralValue.toFixed(6))}**\n📐 *Perhitungan integral numerik*`;
            }
          }
        } else {
          return '📐 Untuk integral, gunakan format: "Hitung integral x^3 dari 0 sampai 1".';
        }
      } catch (err) {
        console.error('Integral error:', err);
        return '❌ Terjadi kesalahan saat menghitung integral. Periksa format ekspresi dan batas integrasi.';
      }
    }

    // --- DERIVATIVE CALCULATION ---
    if (lower.includes('turunan') || lower.includes('derivative') || lower.includes('deriv')) {
      try {
        const derivMatch = lower.match(/(?:turunan|derivative|deriv)\s+(.+?)\s+(?:pada|di|at)\s*([-0-9.]+)/i);
        
        if (derivMatch) {
          const funcRaw = derivMatch[1];
          const point = parseFloat(derivMatch[2]);
          
          if (isNaN(point)) {
            return '📐 Titik evaluasi tidak valid.';
          }

          try {
            // Try using mathjs symbolic derivative
            const d = math.derivative(funcRaw, 'x');
            const val = d.evaluate({ x: point });
            return `🧮 **Hasil Turunan**: \`${funcRaw}\` pada x=${point} = **${fmt(val)}**\n📐 *Perhitungan turunan numerik/simbolik*`;
          } catch (_) { void _;
            // Fallback to numeric method
            try {
              // Try with mathjs first
              const node = math.parse(funcRaw);
              const code = node.compile();
              const f = (x) => code.evaluate({ x });
              const h = 1e-6;
              const deriv = (f(point + h) - f(point - h)) / (2 * h);
              return `🧮 **Hasil Turunan (numerik)**: \`${funcRaw}\` pada x=${point} = **${fmt(deriv)}**`;
            } catch (_) { void _;
              // Fallback to original method
              const funcExpr = mapMathTokens(funcRaw).replace(/[^0-9+\-*/().,%\s^*xXMathPIEa-zA-Z]/g, '');
              const f = Function('x', `return (${funcExpr})`);
              const h = 1e-6;
              const deriv = (f(point + h) - f(point - h)) / (2 * h);
              return `🧮 **Hasil Turunan Numerik**: \`${funcRaw}\` pada x=${point} = **${Number(deriv.toFixed(6))}**\n📐 *Perhitungan turunan numerik*`;
            }
          }
        } else {
          return '📐 Untuk menghitung turunan, berikan titik evaluasi, contoh: "Turunan x^2 pada 2".';
        }
      } catch (err) {
        console.error('Derivative error:', err);
        return '❌ Terjadi kesalahan saat menghitung turunan. Periksa format ekspresi dan titik evaluasi.';
      }
    }

    // --- GENERAL MATH EXPRESSION ---
    // STRICT CHECK: Must contain actual math operators or functions
    const hasMathOperators = /[\d+\-*/()^=<>]+/.test(expr);
    const hasMathFunctions = /\b(sin|cos|tan|log|ln|sqrt|abs|exp|ceil|floor|round|min|max|pow)\b/i.test(expr);
    const hasNumbers = /\d/.test(expr);
    
    // REJECT if no math indicators at all
    if (!hasNumbers && !hasMathOperators && !hasMathFunctions) {
      return null;
    }
    
    // REJECT if it's just a single number or variable without operators
    if (/^[a-zA-Z0-9]+$/.test(expr) && !hasMathFunctions) {
      return null;
    }
    
    try {
      // First try with mathjs
      const result = math.evaluate(expr);
      
      if (typeof result === 'number') {
        const precision = calculationPrecision === 'low' ? 2 : 
                         calculationPrecision === 'medium' ? 4 : 
                         calculationPrecision === 'high' ? 6 : 6;
        return `🧮 **Hasil Perhitungan**: \`${expression}\` = **${Number(result.toFixed(precision))}**`;
      }
      
      // For non-numeric results (matrices, etc.) stringify only if it's actually a valid result
      if (result && typeof result === 'object') {
        return `🧮 **Hasil**: \`${expression}\` = **${JSON.stringify(result)}**`;
      }
      
      return null;
    } catch (_) { void _;
      // Fallback to original method if mathjs fails
      try {
        // Allow letters (variables) in the expression; remove only clearly unsafe characters
        let cleanExpr = expr.replace(/[^0-9+\-*/().,%\s√πe^²³a-zA-Z[\]]/g, '');
        cleanExpr = mapMathTokens(cleanExpr);

        let finalExpr = cleanExpr;
        Object.entries(advancedOps).forEach(([key, value]) => {
          finalExpr = finalExpr.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
        });

        // Check if contains variable (for expressions like "x^2" without context)
        const containsVariable = /[a-zA-Z]/.test(finalExpr) && /[xX]/.test(finalExpr);
        if (containsVariable) {
          // Ask for a numeric value to evaluate expressions with variable
          return null;
        }

        const result = Function(`"use strict"; return (${finalExpr})`)();

        if (typeof result === 'number' && !isNaN(result)) {
          const precision = calculationPrecision === 'low' ? 2 : 
                           calculationPrecision === 'medium' ? 4 : 
                           calculationPrecision === 'high' ? 6 : 10;
          
          return `🧮 **Hasil Perhitungan**: \`${expression}\` = **${result.toFixed(precision)}**`;
        }
        return null;
      } catch (fallbackError) {
        // Jika error karena ekspresi bukan matematika, tampilkan pesan ramah
        if (fallbackError instanceof ReferenceError || fallbackError instanceof SyntaxError) {
          return null;  // Return null instead of error message - let other handlers deal with it
        }
        console.error('Error in calculateMath:', fallbackError);
        return null;
      }
    }
  } catch (error) {
    console.error('Error in calculateMath:', error);
    return null;
  }
}