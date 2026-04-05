import { smartKBQuery } from './smartKBQuery';

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
    // Gunakan Smart KB Query (Advanced Fuzzy Search) sebagai prioritas utama
    const smartResults = smartKBQuery(userInput, safeKnowledgeBase, {
      searchDepth: settings?.creativeMode ? 'comprehensive' : 'standard',
      threshold: 0.4, // Threshold lebih rendah untuk fuzzy matching
      maxResults: 1
    });

    if (smartResults && smartResults.length > 0) {
      const bestMatch = smartResults[0];
      
      // Jika match sangat kuat, langsung kembalikan
      if (bestMatch.relevanceScore > 0.6) {
        let responseText = bestMatch.answer;
        
        // Tambahkan context jika dari file upload
        if (bestMatch.source === 'uploaded_file') {
          responseText = `📄 **Dari file "${bestMatch.fileName || 'Unknown'}"**:\n${responseText}\n\n*Informasi ini berasal dari file yang Anda upload.*`;
        }

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
          source: { 
            type: bestMatch.source, 
            id: bestMatch.question || bestMatch.fileName,
            matchType: bestMatch.matchType,
            score: bestMatch.relevanceScore
          },
          confidence: Math.min(0.99, bestMatch.relevanceScore + 0.1)
        };
      }
    }

    // Fallback ke pencarian kategori spesifik (hobbies, skills, dll) jika smartKBQuery belum mencakupnya
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