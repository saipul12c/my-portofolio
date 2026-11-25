/**
 * Node.js ESM JSON dataset loader for the Universal Knowledge Base.
 * Used automatically in Node runtimes (Vite config API middleware, CLI, API server)
 * via package.json subpath imports so Node never needs JSON import attributes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data');

/**
 * Reads and parses a JSON file relative to src/data.
 */
const loadJson = (relativePath) =>
  JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, relativePath), 'utf8').replace(/^\uFEFF/, '')
  );

export const projectsData = loadJson('projects.json');
export const softskillsData = loadJson('skills/softskills.json');
export const specializationsData = loadJson('skills/specializations.json');
export const experiencesData = loadJson('pengalaman/experiences.json');
export const docsSectionsData = loadJson('helpbutton/docs/docsSections.json');
export const plannedVersionsData = loadJson('helpbutton/docs/plannedVersions.json');
export const commitmentsData = loadJson('helpbutton/komit/commitments.json');
export const faqsData = loadJson('helpbutton/faq/faqs.json');
export const profileData = loadJson('about/profile.json');
export const cardsData = loadJson('about/cards.json');
export const certificatesData = loadJson('sertif/certificates.json');
export const collaborationsData = loadJson('about/collaborations.json');
export const hobbiesData = loadJson('hub/hobbiesData.json');
export const chatHobbiesData = loadJson('helpbutton/chat/hobbies.json');
export const interestsData = loadJson('about/interests.json');
export const aiBaseData = loadJson('helpbutton/chat/AI-base.json');
export const testimonialsData = loadJson('testimoni/testimonials.json');
export const languagesData = loadJson('bahasa/data.json');
export const educationData = loadJson('pendidikan/data.json');
export const blogsData = loadJson('blog/data.json');
export const photosData = loadJson('foto/photos.json');
export const aiDocData = loadJson('AIDoc/data.json');
export const riwayatData = loadJson('AIDoc/riwayat/riwayat.json');
export const galleryData = loadJson('galleryData.json');
export const galleryAlbumsData = loadJson('gallery/albums.json');
export const galleryImagesData = loadJson('gallery/images.json');
export const galleryShortsData = loadJson('gallery/shorts.json');
export const galleryVideosData = loadJson('gallery/videos.json');
export const streamingVideosData = loadJson('streming/videosData.json');
export const streamingShortsData = loadJson('streming/shortsData.json');
export const comingSoonData = loadJson('comingsoon/data.json');
export const maintenanceData = loadJson('maintenance/maintenanceData.json');
export const qodamData = loadJson('qodam/data.json');
export const zodiacData = loadJson('zodiak/data.json');
export const visiData = loadJson('visi/data.json');
export const streamingUserData = loadJson('streming/userData.json');
