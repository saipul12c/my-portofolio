import generateResponse from './src/components/helpbutton/chat/logic/utils/responseGenerator.js';

const testCases = [
  {
    input: 'Apa itu kecerdasan buatan?',
    expected: 'Kecerdasan buatan adalah teknologi yang membuat sistem komputer mampu melakukan tugas seperti manusia dengan kemampuan belajar, berpikir, dan beradaptasi.'
  },
  {
    input: '2 + 2',
    expected: '4'
  },
  {
    input: 'Pertanyaan yang tidak ada di database',
    expected: 'Maaf, saya belum punya jawaban spesifik untuk pertanyaan itu. Silakan tanyakan hal lain atau cek pengaturan chatbot.'
  }
];

testCases.forEach(({ input, expected }, index) => {
  const result = generateResponse(input, { allowMath: true });
  console.log(`Test Case ${index + 1}:`, result === expected ? 'Passed' : `Failed (Expected: ${expected}, Got: ${result})`);
});