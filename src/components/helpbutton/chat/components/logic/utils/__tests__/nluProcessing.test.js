import { processNLU, quickNLU } from '../nluProcessing';
import { buildVocabularyFromKB } from '../spellChecker';

describe('NLU Processing enhancements', () => {
  test('PII redaction hides email and phone', () => {
    const input = 'Halo, email saya test.user@example.com dan no 08123456789';
    const res = processNLU(input, {});
    expect(res.processing.pii.length).toBeGreaterThanOrEqual(1);
    const piiTypes = res.processing.pii.map(d => d.type);
    expect(piiTypes).toEqual(expect.arrayContaining(['email','phone']));
    expect(res.normalized).not.toContain('test.user@example.com');
    expect(res.normalized).not.toContain('08123456789');
  });

  test('Spell correction applied when vocab provided', () => {
    const kb = { cards: ['belajar javascript', 'react components'] };
    const vocab = buildVocabularyFromKB(kb);
    const input = 'belajar javasript';
    const res = processNLU(input, { vocab });
    expect(res.processing.spellCorrections.length).toBeGreaterThanOrEqual(1);
    expect(res.normalized).toContain('javascript');
  });
});
