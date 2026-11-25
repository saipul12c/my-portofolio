/**
 * Integrasi AI Saipul untuk Live Discussion Room
 * Mendeteksi sebutan @Saipul / @ai dan menghasilkan respon pintar langsung di room.
 */

import { getSmartReply } from '../../../components/helpbutton/chat/components/logic/utils/responseGenerator';
import { getUnifiedKnowledgeBase, setDiscussionRoomData } from '../../../utils/ai/knowledgeBase';
import { extractKeywords } from '../../../utils/ai/nlpCore';

export const isAiMentioned = (content) => {
  if (!content) return false;
  return /@(saipul|ai|bot)\b/i.test(content);
};

export const extractAiQuery = (content) => {
  if (!content) return '';
  return content.replace(/@(saipul|ai|bot)\b/gi, '').trim();
};

export const generateAiRoomReply = async (userQuery, senderName = 'Teman') => {
  if (!userQuery) {
    return `Halo @${senderName}! Ada yang bisa Saipul bantu seputar projek, coding, atau topik diskusi hari ini? 😊`;
  }

  try {
    // Panggil mesin respon NLP Saipul dengan Knowledge Base terpadu 
    const kb = getUnifiedKnowledgeBase();
    const replyObj = getSmartReply(
      userQuery,
      { aiEnabled: true, responseStyle: 'friendly' },
      [],
      kb,
      null,
      null
    );

    let answerText = typeof replyObj === 'string' ? replyObj : (replyObj?.text || replyObj?.reply || '');

    if (!answerText || answerText.length < 5) {
      answerText = `Halo @${senderName}, terima kasih sudah bertanya tentang "${userQuery}". Pertanyaan yang sangat menarik untuk didiskusikan bersama di room ini! 🚀`;
    }

    return answerText;
  } catch (err) {
    console.warn('Fallback Saipul AI response generation:', err);
    return `Halo @${senderName}! Menanggapi pertanyaan Anda tentang "${userQuery}", mari kita diskusikan bersama rekan-rekan di room ini. 💡`;
  }
};

/**
 * Menganalisis riwayat obrolan dan membuat ringkasan cerdas
 */
export const summarizeMessages = (messages = []) => {
  if (Array.isArray(messages) && messages.length > 0) {
    // Sinkronisasi riwayat room ke Universal Knowledge Base SaipulAI
    setDiscussionRoomData(messages);
  }

  if (!messages || messages.length === 0) {
    return {
      topic: 'Belum ada percakapan',
      points: ['Ruang obrolan masih hening. Jadilah orang pertama yang mengirimkan sinyal!'],
      activeUsers: [],
      summary: 'Tidak ada data untuk dirangkum.'
    };
  }

  // Hitung user teraktif
  const userCount = {};
  messages.forEach(m => {
    if (m.username) {
      userCount[m.username] = (userCount[m.username] || 0) + 1;
    }
  });

  const sortedUsers = Object.entries(userCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => `${name} (${count} pesan)`);

  // Ekstraksi topik & kata kunci nyata menggunakan NLP Core
  const sampleContents = messages.slice(-15).map(m => m.content).filter(Boolean);
  const codeMentions = sampleContents.filter(c => c.includes('```') || /\b(code|bug|error|api|react)\b/i.test(c)).length;
  const questionMentions = sampleContents.filter(c => c.includes('?') || /\b(bagaimana|kenapa|apa|gimana)\b/i.test(c)).length;

  const keywordFreq = {};
  for (const text of sampleContents) {
    for (const kw of extractKeywords(text)) {
      keywordFreq[kw] = (keywordFreq[kw] || 0) + 1;
    }
  }
  const topKeywords = Object.entries(keywordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([kw]) => kw);

  const points = [];
  if (topKeywords.length > 0) {
    points.push(`Kata kunci utama yang sering dibahas: ${topKeywords.join(', ')}.`);
  }
  if (codeMentions > 0) {
    points.push(`Terdapat ${codeMentions} diskusi teknis atau potongan kode program yang dibagikan.`);
  }
  if (questionMentions > 0) {
    points.push(`Ada ${questionMentions} pertanyaan yang diajukan oleh anggota komunitas.`);
  }
  points.push(`Total ${messages.length} pesan sinyal tercatat dalam sesi riwayat ini.`);

  const detectedTopic = topKeywords.length >= 2
    ? `Diskusi: ${topKeywords.slice(0, 3).join(', ')}`
    : (codeMentions > 0 ? 'Diskusi Teknis & Solusi Coding' : 'Obrolan Komunitas & Kolaborasi Projek');

  return {
    topic: detectedTopic,
    points,
    activeUsers: sortedUsers,
    summary: `Diskusi dipimpin interaksi aktif dari ${sortedUsers[0] || 'komunitas'}${topKeywords.length ? ` dengan fokus topik sekitar ${topKeywords.slice(0, 3).join(', ')}` : ''}.`
  };
};
