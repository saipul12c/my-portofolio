/**
 * mathCalculator.js
 * Façade & Backward-Compatibility Bridge for SaipulAI Math Engine
 * Mendelegasikan seluruh komputasi matematika ke mathEngine.js (Unified Engine).
 * 100% CSP Safe (Bebas dari Function constructor & eval).
 */

import { calculateMathUnified, solveMathQuery } from './mathEngine.js';

/**
 * Kalkulasi matematika terpadu dengan backward compatibility
 * @param {string} expression - ekspresi atau soal matematika
 * @param {string} calculationPrecision - presisi desimal ('low' | 'medium' | 'high')
 * @returns {string|null} jawaban terformat atau null jika bukan matematika
 */
export function calculateMath(expression, calculationPrecision = 'high') {
  return calculateMathUnified(expression, calculationPrecision);
}

export { solveMathQuery };
