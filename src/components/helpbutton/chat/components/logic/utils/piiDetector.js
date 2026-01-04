/**
 * Simple PII detector and redactor
 * - Detects emails, phones, credit-card-like numbers, simple IDs
 * - Returns redacted text and list of detections
 */

const PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(?:\+62|62|0)\d{8,14}/g,
  creditcard: /(?:\b\d{13,16}\b)/g,
  ssnLike: /\b\d{3}-\d{2}-\d{4}\b/g
};

export function detectPII(text, options = {}) {
  const detections = [];
  if (!text || typeof text !== 'string') return detections;
  const whitelist = (options.whitelist || []).map(w => (w instanceof RegExp ? w : new RegExp(w)));

  for (const [type, re] of Object.entries(PATTERNS)) {
    const matches = text.match(re);
    if (matches && matches.length > 0) {
      matches.forEach(m => {
        // skip if whitelisted
        const isWhitelisted = whitelist.some(wr => wr.test(m));
        if (!isWhitelisted) detections.push({ type, match: m });
      });
    }
  }
  return detections;
}

export function redactPII(text, options = {}) {
  if (!text || typeof text !== 'string') return { text, detections: [] };
  const detections = detectPII(text, options);
  let redacted = text;
  const replaceMap = options.replaceMap || {};
  detections.forEach(d => {
    const token = replaceMap[d.type] || (d.type === 'email' ? '[REDACTED_EMAIL]' : d.type === 'phone' ? '[REDACTED_PHONE]' : '[REDACTED]');
    // replace all occurrences safely
    redacted = redacted.split(d.match).join(token);
  });
  return { text: redacted, detections };
}

export default { detectPII, redactPII };

export const DEFAULT_PII_WHITELIST = [];
