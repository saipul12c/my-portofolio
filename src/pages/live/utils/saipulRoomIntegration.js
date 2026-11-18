/**
 * Integrasi AI Saipul untuk Live Discussion Room
 * Mendeteksi sebutan @Saipul / @ai dan menghasilkan respon pintar langsung di room.
 */

import { getSmartReply } from '../../../components/helpbutton/chat/components/logic/utils/responseGenerator';

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
    // Panggil mesin respon NLP Saipul jika tersedia
    const replyObj = getSmartReply(
      userQuery,
      { aiEnabled: true, personality: 'friendly' },
      [],
      null,
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

  // Ekstraksi cuplikan topik
  const sampleContents = messages.slice(-15).map(m => m.content).filter(Boolean);
  const codeMentions = sampleContents.filter(c => c.includes('```') || c.includes('code') || c.includes('bug')).length;
  const questionMentions = sampleContents.filter(c => c.includes('?') || c.includes('bagaimana') || c.includes('kenapa')).length;

  const points = [];
  if (codeMentions > 0) {
    points.push(`Terdapat ${codeMentions} diskusi teknis atau potongan kode program yang dibagikan.`);
  }
  if (questionMentions > 0) {
    points.push(`Ada ${questionMentions} pertanyaan yang diajukan oleh anggota komunitas.`);
  }
  points.push(`Total ${messages.length} pesan sinyal tercatat dalam sesi riwayat ini.`);

  return {
    topic: codeMentions > 0 ? 'Diskusi Teknis & Solusi Coding' : 'Obrolan Komunitas & Kolaborasi Projek',
    points,
    activeUsers: sortedUsers,
    summary: `Diskusi saat ini dipimpin oleh interaksi aktif dari ${sortedUsers[0] || 'komunitas'} dengan fokus pada pertukaran ide dan solusi.`
  };
};
