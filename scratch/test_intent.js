const nlp = require('compromise');

const VIBE_MAP = {
  futuristik: ["Digital Islamic Gallery", "MyPortfolio Website"],
};

const classifyIntentAdvanced = (text, doc, context) => {
  const norm = text.toLowerCase();
  
  if (/(soft skill|kecakapan|interpersonal|adaptasi|komunikasi)/.test(norm)) return { type: 'SKILL_INQUIRY', slots: {} };
  if (/(siapa|profil|tentang|keahlian|skill|kompetensi|kapasitas)/.test(norm)) return { type: 'PROFILE_INQUIRY', slots: {} };
  if (/(proyek|project|portfolio|karya|aplikasi|buat)/.test(norm)) return { type: 'PROJECT_INQUIRY', slots: { specific: null } };
  if (/(kursus|pelatihan|sertifikat|belajar|kelas|pendidikan|sekolah)/.test(norm)) return { type: 'COURSE_INQUIRY', slots: { specific: null } };
  
  return { type: 'GENERAL_INQUIRY', slots: {} };
};

const query = "Sebutkan soft skill Syaiful";
const doc = nlp(query.toLowerCase());
const context = { history: [] };
const intent = classifyIntentAdvanced(query, doc, context);

console.log("Query:", query);
console.log("Detected Intent:", intent);
