/**
 * Browser/Vite JSON dataset loader for the Universal Knowledge Base.
 * Uses standard Vite static JSON imports without import attributes so Rollup
 * sees consistent module attributes across the entire frontend bundle.
 */

import projectsData from '../../data/projects.json';
import softskillsData from '../../data/skills/softskills.json';
import specializationsData from '../../data/skills/specializations.json';
import experiencesData from '../../data/pengalaman/experiences.json';
import docsSectionsData from '../../data/helpbutton/docs/docsSections.json';
import plannedVersionsData from '../../data/helpbutton/docs/plannedVersions.json';
import commitmentsData from '../../data/helpbutton/komit/commitments.json';
import faqsData from '../../data/helpbutton/faq/faqs.json';
import profileData from '../../data/about/profile.json';
import cardsData from '../../data/about/cards.json';
import certificatesData from '../../data/sertif/certificates.json';
import collaborationsData from '../../data/about/collaborations.json';
import hobbiesData from '../../data/hub/hobbiesData.json';
import chatHobbiesData from '../../data/helpbutton/chat/hobbies.json';
import interestsData from '../../data/about/interests.json';
import aiBaseData from '../../data/helpbutton/chat/AI-base.json';
import testimonialsData from '../../data/testimoni/testimonials.json';
import languagesData from '../../data/bahasa/data.json';
import educationData from '../../data/pendidikan/data.json';
import blogsData from '../../data/blog/data.json';
import photosData from '../../data/foto/photos.json';
import aiDocData from '../../data/AIDoc/data.json';
import riwayatData from '../../data/AIDoc/riwayat/riwayat.json';
import galleryData from '../../data/galleryData.json';
import galleryAlbumsData from '../../data/gallery/albums.json';
import galleryImagesData from '../../data/gallery/images.json';
import galleryShortsData from '../../data/gallery/shorts.json';
import galleryVideosData from '../../data/gallery/videos.json';
import streamingVideosData from '../../data/streming/videosData.json';
import streamingShortsData from '../../data/streming/shortsData.json';
import comingSoonData from '../../data/comingsoon/data.json';
import maintenanceData from '../../data/maintenance/maintenanceData.json';
import qodamData from '../../data/qodam/data.json';
import zodiacData from '../../data/zodiak/data.json';
import visiData from '../../data/visi/data.json';
import streamingUserData from '../../data/streming/userData.json';

export {
  projectsData,
  softskillsData,
  specializationsData,
  experiencesData,
  docsSectionsData,
  plannedVersionsData,
  commitmentsData,
  faqsData,
  profileData,
  cardsData,
  certificatesData,
  collaborationsData,
  hobbiesData,
  chatHobbiesData,
  interestsData,
  aiBaseData,
  testimonialsData,
  languagesData,
  educationData,
  blogsData,
  photosData,
  aiDocData,
  riwayatData,
  galleryData,
  galleryAlbumsData,
  galleryImagesData,
  galleryShortsData,
  galleryVideosData,
  streamingVideosData,
  streamingShortsData,
  comingSoonData,
  maintenanceData,
  qodamData,
  zodiacData,
  visiData,
  streamingUserData,
};
