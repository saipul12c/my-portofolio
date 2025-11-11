export function getKnowledgeResponse(userInput, safeKnowledgeBase, settings) {
  const input = userInput.toLowerCase();
  
  if (safeKnowledgeBase.AI && typeof safeKnowledgeBase.AI === 'object') {
    for (const [question, answer] of Object.entries(safeKnowledgeBase.AI)) {
      const cleanQuestion = question.toLowerCase().replace(/[?]/g, '').replace("apa itu", "").trim();
      const questionWords = cleanQuestion.split(/\s+/).filter(w => w.length > 3);
      
      const matchScore = questionWords.filter(word => 
        input.includes(word) || input.split(/\s+/).some(inputWord => 
          word.includes(inputWord) || inputWord.includes(word)
        )
      ).length;

      if (matchScore >= Math.max(1, questionWords.length * 0.6)) {
        let response = answer;
        if (settings.creativeMode) {
          const insights = [
            "Konsep ini terus berkembang dengan penelitian terbaru.",
            "Teknologi ini sangat relevan dalam pengembangan AI modern.",
            "Pemahaman mendalam tentang ini essential untuk AI engineer.",
            "Ini adalah fondasi dari banyak aplikasi AI kontemporer."
          ];
          response += `\n\n💡 **Insight**: ${insights[Math.floor(Math.random() * insights.length)]}`;
        }
        return response;
      }
    }
  }

  if (settings.useUploadedData && Array.isArray(safeKnowledgeBase.uploadedData)) {
    for (const fileData of safeKnowledgeBase.uploadedData) {
      if (Array.isArray(fileData.sentences)) {
        for (const sentence of fileData.sentences) {
          const cleanSentence = sentence.toLowerCase();
          const inputWords = input.split(/\s+/).filter(w => w.length > 3);
          const sentenceWords = cleanSentence.split(/\s+/).filter(w => w.length > 3);
          
          const matchWords = inputWords.filter(inputWord =>
            sentenceWords.some(sentenceWord =>
              sentenceWord.includes(inputWord) || inputWord.includes(sentenceWord)
            )
          );

          if (matchWords.length >= Math.max(1, inputWords.length * 0.5)) {
            return `📄 **Dari file "${fileData.fileName}"**:\n${sentence}\n\n*Informasi ini berasal dari file yang Anda upload.*`;
          }
        }
      }
    }
  }

  const knowledgeSources = [
    { data: safeKnowledgeBase.hobbies, type: 'hobi', emoji: '🎯' },
    { data: safeKnowledgeBase.softskills, type: 'skill', emoji: '🌟' },
    { data: safeKnowledgeBase.certificates, type: 'sertifikat', emoji: '🏆' },
    { data: safeKnowledgeBase.cards, type: 'keahlian', emoji: '💼' }
  ];

  for (const source of knowledgeSources) {
    if (Array.isArray(source.data)) {
      for (const item of source.data) {
        if (item.name && input.includes(item.name.toLowerCase()) || 
            item.title && input.includes(item.title.toLowerCase())) {
          let response = `${source.emoji} **${item.name || item.title}**`;
          if (item.category) response += ` (${item.category})`;
          if (item.description) response += `\n\n${item.description}`;
          if (item.level) response += `\n\n**Level**: ${item.level}`;
          return response;
        }
      }
    }
  }

  if (safeKnowledgeBase.profile && safeKnowledgeBase.profile.name && 
      (input.includes('syaiful') || input.includes('profil') || input.includes('tentang'))) {
    return `👨‍💼 **${safeKnowledgeBase.profile.name}**\n\n${safeKnowledgeBase.profile.description}`;
  }

  return null;
}