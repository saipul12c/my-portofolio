/**
 * Query knowledge base dengan improved error handling dan data validation
 * @param {string} userInput - User input
 * @param {Object} safeKnowledgeBase - Knowledge base dengan struktur terjamin
 * @param {Object} settings - Settings untuk response customization
 * @returns {Object|null} Response atau null jika tidak ada match
 */
export function getKnowledgeResponse(userInput, safeKnowledgeBase, settings) {
  const input = userInput.toLowerCase();
  
  try {
    // Query 1: AI Knowledge Base
    if (safeKnowledgeBase?.AI && typeof safeKnowledgeBase.AI === 'object' && Object.keys(safeKnowledgeBase.AI).length > 0) {
      for (const [question, answer] of Object.entries(safeKnowledgeBase.AI)) {
        try {
          const cleanQuestion = question.toLowerCase().replace(/[?]/g, '').replace("apa itu", "").trim();
          const questionWords = cleanQuestion.split(/\s+/).filter(w => w.length > 3);
          
          const matchScore = questionWords.filter(word => 
            input.includes(word) || input.split(/\s+/).some(inputWord => 
              word.includes(inputWord) || inputWord.includes(word)
            )
          ).length;

          if (matchScore >= Math.max(1, questionWords.length * 0.6)) {
            let responseText = String(answer);
            if (settings?.creativeMode) {
              const insights = [
                "Konsep ini terus berkembang dengan penelitian terbaru.",
                "Teknologi ini sangat relevan dalam pengembangan AI modern.",
                "Pemahaman mendalam tentang ini essential untuk AI engineer.",
                "Ini adalah fondasi dari banyak aplikasi AI kontemporer."
              ];
              responseText += `\n\n💡 **Insight**: ${insights[Math.floor(Math.random() * insights.length)]}`;
            }
            return {
              text: responseText,
              source: { type: 'kb_ai', id: question },
              confidence: 0.95
            };
          }
        } catch (e) {
          console.warn('Error processing AI KB entry:', e);
          continue;
        }
      }
    }

    // Query 2: Uploaded Files
    if (settings?.useUploadedData && Array.isArray(safeKnowledgeBase?.uploadedData) && safeKnowledgeBase.uploadedData.length > 0) {
      for (const fileData of safeKnowledgeBase.uploadedData) {
        try {
          if (Array.isArray(fileData?.sentences)) {
            for (const sentence of fileData.sentences) {
              const cleanSentence = String(sentence).toLowerCase();
              const inputWords = input.split(/\s+/).filter(w => w.length > 3);
              const sentenceWords = cleanSentence.split(/\s+/).filter(w => w.length > 3);
              
              const matchWords = inputWords.filter(inputWord =>
                sentenceWords.some(sentenceWord =>
                  sentenceWord.includes(inputWord) || inputWord.includes(sentenceWord)
                )
              );

              if (matchWords.length >= Math.max(1, inputWords.length * 0.5)) {
                return {
                  text: `📄 **Dari file "${fileData.fileName || 'Unknown'}"**:\n${cleanSentence}\n\n*Informasi ini berasal dari file yang Anda upload.*`,
                  source: { type: 'uploaded_file', fileName: fileData.fileName },
                  confidence: 0.9
                };
              }
            }
          }
        } catch (e) {
          console.warn('Error processing uploaded file:', e);
          continue;
        }
      }
    }

    // Query 3: Other Knowledge Sources (hobbies, skills, certificates, etc)
    const knowledgeSources = [
      { data: safeKnowledgeBase?.hobbies, type: 'hobi', emoji: '🎯' },
      { data: safeKnowledgeBase?.softskills, type: 'skill', emoji: '🌟' },
      { data: safeKnowledgeBase?.certificates, type: 'sertifikat', emoji: '🏆' },
      { data: safeKnowledgeBase?.cards, type: 'keahlian', emoji: '💼' }
    ];

    for (const source of knowledgeSources) {
      try {
        if (Array.isArray(source.data) && source.data.length > 0) {
          for (const item of source.data) {
            try {
              // Check by name or title
              const itemName = String(item?.name || item?.title || '').toLowerCase();
              const itemTitle = String(item?.title || item?.name || '').toLowerCase();
              
              if ((item?.name && input.includes(itemName)) || 
                  (item?.title && input.includes(itemTitle))) {
                
                let responseText = `${source.emoji} **${item.name || item.title}**`;
                if (item?.category) responseText += ` (${item.category})`;
                if (item?.description) responseText += `\n\n${item.description}`;
                if (item?.level) responseText += `\n\n**Level**: ${item.level}`;
                
                return {
                  text: responseText,
                  source: { type: `kb_${source.type}`, id: item.name || item.title },
                  confidence: 0.88
                };
              }
            } catch (e) {
              console.warn('Error processing item:', e);
              continue;
            }
          }
        }
      } catch (e) {
        console.warn(`Error querying ${source.type}:`, e);
        continue;
      }
    }

    // Query 4: Profile Information
    if (safeKnowledgeBase?.profile && 
        typeof safeKnowledgeBase.profile === 'object' &&
        safeKnowledgeBase.profile.name) {
      
      const profileKeywords = ['syaiful', 'profil', 'tentang', 'about', 'siapa'];
      if (profileKeywords.some(keyword => input.includes(keyword))) {
        const profileName = String(safeKnowledgeBase.profile.name);
        const profileDesc = String(safeKnowledgeBase.profile.description || 'Profile tidak tersedia');
        
        return {
          text: `👨‍💼 **${profileName}**\n\n${profileDesc}`,
          source: { type: 'kb_profile', id: profileName },
          confidence: 0.9
        };
      }
    }

    // No match found
    return null;
  } catch (error) {
    console.error('Error in getKnowledgeResponse:', error);
    return null;
  }
}