/**
 * Universal Knowledge Base Hub
 * Menggabungkan seluruh data JSON mentah proyek ke dalam 1 Single Source of Truth
 * untuk digunakan oleh seluruh agen AI (SaipulAI, Blog AI, Project AI, SoftSkills AI, FAQ AI).
 */

import projectsData from '../../data/projects.json';
import softskillsData from '../../data/skills/softskills.json';
import docsSectionsData from '../../data/helpbutton/docs/docsSections.json';
import plannedVersionsData from '../../data/helpbutton/docs/plannedVersions.json';
import commitmentsData from '../../data/helpbutton/komit/commitments.json';
import faqsData from '../../data/helpbutton/faq/faqs.json';
import profileData from '../../data/about/profile.json';
import cardsData from '../../data/about/cards.json';
import certificatesData from '../../data/sertif/certificates.json';
import collaborationsData from '../../data/about/collaborations.json';
import hobbiesData from '../../data/hub/hobbiesData.json';
import interestsData from '../../data/about/interests.json';
import aiBaseData from '../../data/helpbutton/chat/AI-base.json';
import testimonialsData from '../../data/testimoni/testimonials.json';
import languagesData from '../../data/bahasa/data.json';
import educationData from '../../data/pendidikan/data.json';
import blogsData from '../../data/blog/data.json';
import photosData from '../../data/foto/photos.json';
import aiDocData from '../../data/AIDoc/data.json';
import riwayatData from '../../data/AIDoc/riwayat/riwayat.json';

// Cache blogs dinamis dari Supabase
let runtimeBlogs = [];
export const setKnowledgeBaseBlogs = (blogs = []) => {
  if (Array.isArray(blogs)) {
    runtimeBlogs = blogs;
  }
};

// Normalisasi ekstrak array aman
const extractArray = (data, fallbackKey = null) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (fallbackKey && Array.isArray(data[fallbackKey])) return data[fallbackKey];
    const firstArray = Object.values(data).find(v => Array.isArray(v));
    if (firstArray) return firstArray;
  }
  return [];
};

/**
 * Mengambil seluruh database mentah yang telah dinormalisasi
 */
export const getUnifiedKnowledgeBase = () => {
  return {
    profile: profileData || {},
    cards: extractArray(cardsData, 'cards'),
    projects: extractArray(projectsData, 'projects'),
    skills: extractArray(softskillsData, 'skills'),
    documents: extractArray(docsSectionsData, 'sections'),
    plannedVersions: extractArray(plannedVersionsData, 'versions'),
    commitments: extractArray(commitmentsData, 'commitments'),
    faq: extractArray(faqsData, 'faqs'),
    hobbies: extractArray(hobbiesData, 'hobbies'),
    certificates: extractArray(certificatesData, 'certificates'),
    collaborations: extractArray(collaborationsData, 'collaborations'),
    interests: interestsData || {},
    aiBase: aiBaseData || {},
    testimonials: extractArray(testimonialsData, 'testimonials'),
    languages: extractArray(languagesData, 'bahasa'),
    education: extractArray(educationData, 'courses'),
    blogs: runtimeBlogs.length > 0 ? runtimeBlogs : extractArray(blogsData, 'blogs'),
    photos: extractArray(photosData, 'photos'),
    aiDoc: aiDocData || {},
    riwayat: extractArray(riwayatData, 'riwayat')
  };
};

/**
 * Statistik ringkas ukuran knowledge base
 */
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

/**
 * Multi-Entity Cross Linker
 * Menghubungkan satu topik/keyword ke seluruh domain data yang relevan:
 * Projects, Blogs, Skills, Certificates, Testimonials, Education, dll.
 */
export const findRelatedEntities = (keyword = '') => {
  if (!keyword || typeof keyword !== 'string') {
    return {
      keyword: '',
      hasMatches: false,
      projects: [],
      blogs: [],
      skills: [],
      certificates: [],
      testimonials: [],
      education: [],
      faq: []
    };
  }

  const k = keyword.toLowerCase().trim();
  const kb = getUnifiedKnowledgeBase();

  const matchText = (text) => typeof text === 'string' && text.toLowerCase().includes(k);
  const matchArray = (arr) => Array.isArray(arr) && arr.some(item => matchText(typeof item === 'string' ? item : item?.name || item?.title || ''));

  // 1. Projects
  const matchedProjects = kb.projects.filter(p => 
    matchText(p.title) || matchText(p.description) || matchText(p.desc) || matchArray(p.tech) || matchArray(p.tags)
  );

  // 2. Blogs
  const matchedBlogs = kb.blogs.filter(b => 
    matchText(b.title) || matchText(b.excerpt) || matchArray(b.tags) || matchText(b.author)
  );

  // 3. Skills
  const matchedSkills = kb.skills.filter(s => 
    matchText(s.name) || matchText(s.description) || matchText(s.category) || matchArray(s.tags)
  );

  // 4. Certificates
  const matchedCertificates = kb.certificates.filter(c => 
    matchText(c.title) || matchText(c.name) || matchText(c.issuer) || matchArray(c.skills) || matchArray(c.tags)
  );

  // 5. Testimonials
  const matchedTestimonials = kb.testimonials.filter(t => 
    matchText(t.name) || matchText(t.role) || matchText(t.quote) || matchText(t.message) || matchText(t.company)
  );

  // 6. Education
  const matchedEducation = kb.education.filter(e => 
    matchText(e.title) || matchText(e.institution) || matchText(e.platform) || matchArray(e.skills)
  );

  // 7. FAQ
  const matchedFAQ = kb.faq.filter(f => 
    matchText(f.question) || matchText(f.answer)
  );

  const totalMatches = matchedProjects.length + matchedBlogs.length + matchedSkills.length + 
                       matchedCertificates.length + matchedTestimonials.length + matchedEducation.length;

  return {
    keyword: k,
    hasMatches: totalMatches > 0,
    totalMatches,
    projects: matchedProjects,
    blogs: matchedBlogs,
    skills: matchedSkills,
    certificates: matchedCertificates,
    testimonials: matchedTestimonials,
    education: matchedEducation,
    faq: matchedFAQ
  };
};

export default getUnifiedKnowledgeBase;

