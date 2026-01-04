import { checkClaimAgainstKB } from '../factChecker';

describe('Fact checker n-gram and scoring', () => {
  const kb = {
    AI: { concept1: 'SaipulAI adalah asisten berbasis rules dan KB lokal.' },
    uploadedData: [ { id: 'f1', text: 'SaipulAI mengumpulkan data dari file laporan.' } ]
  };

  test('Finds matching claim and returns sources', () => {
    const res = checkClaimAgainstKB('Apakah SaipulAI mengumpulkan data dari file laporan?', kb, { threshold: 0.1, sourceBoosts: { uploadedData: 1.2 } });
    expect(res.sources.length).toBeGreaterThan(0);
    expect(typeof res.confidence).toBe('number');
  });
});
