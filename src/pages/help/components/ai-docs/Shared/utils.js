// Helper: parse numeric values from mixed strings
export const parseNumber = (val) => {
  if (!val || typeof val !== 'string') return null;
  const cleaned = val.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
};
