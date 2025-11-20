import { useMemo } from "react";
import softskillsData from "../../../data/skills/softskills.json";

/**
 * Hook untuk menemukan soft skills yang terkait dengan bahasa/teknologi tertentu
 * @param {string} skillName - Nama bahasa atau teknologi
 * @param {boolean} isProgramming - Apakah ini adalah bahasa pemrograman
 * @returns {Array} - Array soft skills yang terkait
 */
export const useRelatedSkills = (skillName, isProgramming = false) => {
  return useMemo(() => {
    if (!skillName || !softskillsData.skills) return [];

    const relatedSkills = [];
    
    // Mapping skills berdasarkan tipe bahasa
    const skillMapping = {
      // Bahasa sehari-hari
      "Indonesia": ["Komunikasi Efektif", "Presentasi", "Menulis", "Negosiasi"],
      "English": ["Komunikasi Efektif", "Presentasi", "Public Speaking", "Negosiasi Lintas Budaya"],
      "Jawa": ["Komunikasi Efektif", "Pemahaman Budaya", "Kreativitas"],
      "Japan": ["Pembelajaran Berkelanjutan", "Disiplin", "Dedikasi"],
      
      // Bahasa pemrograman
      "JavaScript": ["Problem Solving", "Logika Berpikir", "Kolaborasi", "Adaptabilitas"],
      "Python": ["Analytical Thinking", "Problem Solving", "Scripting", "Data Analysis"],
      "React": ["Kreativitas", "Problem Solving", "Kolaborasi", "Attention to Detail"],
      "Java": ["Logika Berpikir", "Disiplin", "Architecture Thinking", "Problem Solving"],
      "PHP": ["Backend Development", "Problem Solving", "Kolaborasi"],
      "SQL": ["Analytical Thinking", "Attention to Detail", "Problem Solving"],
    };

    const relatedNames = skillMapping[skillName] || [];

    if (relatedNames.length > 0) {
      softskillsData.skills.forEach(skill => {
        if (relatedNames.includes(skill.name)) {
          relatedSkills.push({
            ...skill,
            link: `/SoftSkills/${skill.id}`,
            relevance: "tinggi"
          });
        }
      });
    }

    return relatedSkills.slice(0, 3); // Ambil max 3 skills
  }, [skillName, isProgramming]);
};
