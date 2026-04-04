// dataAggregator.js
// Utility untuk mengumpulkan semua data JSON yang relevan di seluruh project
// agar bisa dijadikan `knowledgeBase` gabungan untuk Chatbot AI Global.

// JSON Files (using static imports if possible, or dynamic imports if needed)
import projects from '../../../data/projects.json';
import softskills from '../../../data/skills/softskills.json';
import documents from '../docs/data/docsSections.json';
import commitments from '../komit/data/commitments.json';
import faqsData from '../faq/data/faqs.json';
import profile from '../chat/data/profile.json';
import hobbies from '../../../data/hub/hobbiesData.json';
import certificates from '../../../data/sertif/certificates.json';
import testimonials from '../../../data/testimoni/testimonials.json';

// Helper function to extract all text or important strings from data
export const getUnifiedKnowledgeBase = () => {
    return {
        profile: profile || {},
        projects: projects || [],
        softskills: softskills || [],
        documents: documents || [],
        commitments: commitments || [],
        faq: faqsData || [],
        hobbies: hobbies || [],
        certificates: certificates || [],
        testimonials: testimonials || []
    };
};

export const getKnowledgeStats = () => {
    const kb = getUnifiedKnowledgeBase();
    let totalItems = 0;

    Object.values(kb).forEach(val => {
        if (Array.isArray(val)) {
            totalItems += val.length;
        } else if (typeof val === 'object' && val !== null) {
            totalItems += Object.keys(val).length;
        }
    });

    return {
        totalCategories: Object.keys(kb).length,
        totalItems: totalItems
    };
};
