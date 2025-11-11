export function calculateMath(expression, calculationPrecision) {
  try {
    const cleanExpr = expression
      .replace(/[^0-9+\-*/().,%\s√πe^²³&|!<>=\s]/g, '')
      .replace(/√/g, 'Math.sqrt')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/\^/g, '**')
      .replace(/²/g, '**2')
      .replace(/³/g, '**3');

    const advancedOps = {
      'sin': 'Math.sin',
      'cos': 'Math.cos', 
      'tan': 'Math.tan',
      'log': 'Math.log10',
      'ln': 'Math.log',
      'exp': 'Math.exp',
      'abs': 'Math.abs'
    };

    let finalExpr = cleanExpr;
    Object.entries(advancedOps).forEach(([key, value]) => {
      finalExpr = finalExpr.replace(new RegExp(key, 'g'), value);
    });

    const result = Function(`"use strict"; return (${finalExpr})`)();
    
    if (typeof result === 'number' && !isNaN(result)) {
      const precision = calculationPrecision === 'low' ? 2 : 
                       calculationPrecision === 'medium' ? 4 :
                       calculationPrecision === 'high' ? 6 : 10;
      
      let explanation = '';
      if (expression.includes('integral')) explanation = '\n📐 *Perhitungan integral numerik*';
      if (expression.includes('derivative')) explanation = '\n📐 *Perhitungan turunan numerik*';
      
      return `🧮 **Hasil Perhitungan**: \`${expression}\` = **${result.toFixed(precision)}**${explanation}`;
    }
    return null;
  } catch (error) {
    return null;
  }
}