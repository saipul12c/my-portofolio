import { getSmartReply } from '../responseGenerator';

describe('Response generator basic behaviors', () => {
  const settings = { calculationPrecision: 4, debugMode: false, responseStyle: null, memoryContext: false, enableFileUpload: true };
  const emptyContext = [];
  const safeKB = { uploadedData: [], fileMetadata: [] };

  test('Greeting returns expected greeting', () => {
    const r = getSmartReply('halo', settings, emptyContext, safeKB, {});
    expect(r.text).toMatch(/Hai juga|SaipulAI/);
    expect(r.confidence).toBeGreaterThan(0.5);
  });

  test('Math intent returns calculation', () => {
    const r = getSmartReply('berapa 2 + 2', settings, emptyContext, safeKB, {});
    expect(r.text).toMatch(/4|empat/);
    expect(r.confidence).toBeGreaterThan(0.5);
  });

  test('Inline numeric expression like "1+1 berapa" is calculated', () => {
    const r = getSmartReply('1+1 berapa', settings, emptyContext, safeKB, {});
    expect(r.text).toMatch(/2|dua/);
    expect(r.confidence).toBeGreaterThan(0.5);
  });

  test('Word-number expression "dua tambah tiga" is calculated', () => {
    const r = getSmartReply('dua tambah tiga', settings, emptyContext, safeKB, {});
    expect(r.text).toMatch(/5|lima/);
    expect(r.confidence).toBeGreaterThan(0.5);
  });
});
