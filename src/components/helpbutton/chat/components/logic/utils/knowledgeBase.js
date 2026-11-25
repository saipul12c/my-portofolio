import { smartKBQuery } from './smartKBQuery.js';
import { processDeepNeuralQuery, formatNeuralAnswer } from '../../../../../../utils/ai/neural/deepNeuralPipeline.js';

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
    const targetLang = (settings?.language === 'en') ? 'en' : (settings?.language === 'id' ? 'id' : 'auto');

    // Gunakan Smart KB Query (Advanced Fuzzy Search) sebagai prioritas utama
    const smartResults = smartKBQuery(userInput, safeKnowledgeBase, {
      searchDepth: settings?.creativeMode ? 'comprehensive' : 'standard',
      threshold: 0.4, // Threshold lebih rendah untuk fuzzy matching
      maxResults: 1,
      targetLanguage: targetLang,
      language: settings?.language || 'auto'
    });

    if (smartResults && smartResults.length > 0) {
      const bestMatch = smartResults[0];
      
      // Jika match sangat kuat, langsung kembalikan
      if (bestMatch.relevanceScore > 0.6) {
        let responseText = bestMatch.answer;
        
        // Tambahkan context jika dari file upload
        if (bestMatch.source === 'uploaded_file') {
          responseText = `📄 **Dari file "${bestMatch.fileName || 'Unknown'}"**:\n\n${responseText}\n\n*Informasi ini berasal dari file yang Anda upload.*`;
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

        let actionChips = bestMatch.actionChips || [];
        if (!actionChips.length && bestMatch.url) {
          const isEn = targetLang === 'en';
          const label = bestMatch.category === 'projects' ? (isEn ? 'Explore Projects' : 'Jelajahi Proyek') :
                        bestMatch.category === 'blogs' ? (isEn ? 'Read Articles' : 'Baca Artikel') :
                        bestMatch.category === 'certificates' ? (isEn ? 'View Certificates' : 'Lihat Sertifikat') :
                        bestMatch.category === 'languages' ? (isEn ? 'Tech Stack Details' : 'Detail Teknologi') :
                        bestMatch.category === 'academic_kkn' ? (isEn ? 'Fieldwork Report' : 'Laporan KKN') :
                        bestMatch.category === 'galleryAlbums' ? (isEn ? 'Open Gallery' : 'Buka Galeri') :
                        (bestMatch.category === 'coreValues' || bestMatch.category === 'visi') ? (isEn ? 'Vision & Mission' : 'Buka Visi Misi') :
                        (isEn ? 'Open Page' : 'Buka Halaman');
          actionChips.push({ label, path: bestMatch.url, icon: '🔗' });
        }

        return {
          text: responseText,
          language: bestMatch.language || targetLang,
          alternatives: bestMatch.alternatives || {},
          source: { 
            type: bestMatch.source, 
            id: bestMatch.question || bestMatch.fileName,
            matchType: bestMatch.matchType,
            score: bestMatch.relevanceScore,
            category: bestMatch.category || null
          },
          confidence: Math.min(0.99, bestMatch.relevanceScore + 0.1),
          actionChips
        };
      }
    }

    // Fallback ke pencarian kategori spesifik (hobbies, skills, dll) jika smartKBQuery belum mencakupnya
    // Query 3: Other Knowledge Sources (hobbies, skills, certificates, etc)
    const knowledgeSources = [
      { data: safeKnowledgeBase?.languages, type: 'bahasa', emoji: '🌐' },
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
              // Check by name or title or slug
              const itemName = String(item?.nama || item?.name || item?.title || '').toLowerCase();
              const itemTitle = String(item?.title || item?.nama || item?.name || '').toLowerCase();
              
              if ((itemName && input.includes(itemName)) || 
                  (itemTitle && input.includes(itemTitle))) {
                
                let responseText = `${source.emoji} **${item.nama || item.name || item.title}**`;
                if (item?.tingkat || item?.categoryLabel) {
                  responseText += ` (${item.categoryLabel || item.tingkat})`;
                } else if (item?.category) {
                  responseText += ` (${item.category})`;
                }

                if (item?.level) responseText += `\n\n• **Tingkat Kemahiran**: ${item.level}% (${item.tingkat || 'Aktif'})`;
                if (item?.deskripsi) responseText += `\n\n${item.deskripsi}`;
                if (item?.penjelasan && item.penjelasan !== item.deskripsi) responseText += `\n\n${item.penjelasan}`;
                if (item?.description && !item?.deskripsi) responseText += `\n\n${item.description}`;
                if (item?.desc && !item?.deskripsi && !item?.description) responseText += `\n\n${item.desc}`;

                if (source.type === 'hobi') {
                  if (item?.metadata?.difficulty) responseText += `\n\n• **Tingkat Kesulitan**: ${item.metadata.difficulty}`;
                  if (item?.metadata?.timeRequired) responseText += `\n• **Waktu yang Dibutuhkan**: ${item.metadata.timeRequired}`;
                  if (Array.isArray(item?.metadata?.tools) && item.metadata.tools.length > 0) {
                    responseText += `\n• **Alat & Tools**: ${item.metadata.tools.join(', ')}`;
                  }
                  if (item?.stats?.rating) responseText += `\n• **Rating**: ⭐ ${item.stats.rating}/5.0`;
                  const targetSlug = item.slug || (item.title || item.nama || '').toString().toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
                  responseText += `\n\n🔗 *Lihat detail hobi ini di*: \`/hobbies/${targetSlug}\``;
                }

                if (Array.isArray(item?.kemampuan) && item.kemampuan.length > 0) {
                  responseText += `\n\n• **Kemampuan Utama**: ${item.kemampuan.join(', ')}`;
                }
                if (Array.isArray(item?.framework) && item.framework.length > 0) {
                  responseText += `\n• **Framework & Ekosistem**: ${item.framework.join(', ')}`;
                }
                if (Array.isArray(item?.tools) && item.tools.length > 0) {
                  responseText += `\n• **Tools**: ${item.tools.join(', ')}`;
                }
                if (item?.projectContoh) {
                  responseText += `\n• **Contoh Projek**: ${item.projectContoh}`;
                }

                if (source.type === 'bahasa') {
                  const targetSlug = item.slug || (item.nama || item.name || '').toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
                  responseText += `\n\n🔗 *Lihat detail lengkap di halaman*: \`/bahasa/detail/${targetSlug}\``;
                }
                
                return {
                  text: responseText,
                  source: { type: `kb_${source.type}`, id: item.nama || item.name || item.title },
                  confidence: 0.92
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

    // Fallback: Direct Deep Neural Pipeline Query (Level 1 + Level 2)
    try {
      const neuralResult = processDeepNeuralQuery(userInput, safeKnowledgeBase);
      if (neuralResult && neuralResult.isHighConfidenceSemantic) {
        const neuralAnswer = formatNeuralAnswer(neuralResult);
        if (neuralAnswer) {
          return {
            text: neuralAnswer,
            source: {
              type: 'deep_neural_fallback',
              id: neuralResult.topClass,
              score: neuralResult.bestMatch.score
            },
            confidence: Math.min(0.95, 0.70 + (neuralResult.bestMatch.score * 0.25))
          };
        }
      }
    } catch (e) {
      console.warn('Direct neural query fallback failed:', e);
    }

    // No match found
    return null;
  } catch (error) {
    console.error('Error in getKnowledgeResponse:', error);
    return null;
  }
}