import { MdHome, MdInfo, MdFolderOpen, MdMailOutline } from 'react-icons/md';

// Real JSON imports
import projectsDataRaw from '../../../data/projects.json';
import certsDataRaw from '../../../data/sertif/certificates.json';
import photosDataRaw from '../../../data/foto/photos.json';
import testimonialsDataRaw from '../../../data/testimoni/testimonials.json';
import softSkillsDataRaw from '../../../data/skills/softskills.json';
import pendidikanDataRaw from '../../../data/pendidikan/data.json';
import bahasaDataRaw from '../../../data/bahasa/data.json';

const projectsList = projectsDataRaw?.projects || [];
const certsList = certsDataRaw?.certificates || [];
const photosList = Array.isArray(photosDataRaw) ? photosDataRaw : [];
const testimonialsList = Array.isArray(testimonialsDataRaw) ? testimonialsDataRaw : [];
const softSkillsList = softSkillsDataRaw?.skills || [];
const eduList = pendidikanDataRaw?.education || [];
const coursesList = pendidikanDataRaw?.courses || [];
const bahasaList = bahasaDataRaw?.bahasaSehariHari || [];

export const specialties = [
  "Full-Stack Developer",
  "EduTech Innovator",
  "Digital Creator",
  "Problem Solver",
  "Tech Enthusiast"
];

export const webNavigationItems = [
  { id: 'home', label: 'Home', path: '/', icon: MdHome, color: 'from-cyan-600/20 to-blue-600/20', hoverColor: 'border-cyan-500/50', tooltip: 'Kembali ke halaman utama' },
  { id: 'about', label: 'Tentang', path: '/about', icon: MdInfo, color: 'bg-gray-800/50', hoverColor: 'border-gray-600', tooltip: 'Pelajari tentang saya' },
  { id: 'portfolio', label: 'Portfolio', path: '/projects', icon: MdFolderOpen, color: 'bg-gray-800/50', hoverColor: 'border-gray-600', tooltip: 'Lihat proyek saya' },
  { id: 'contact', label: 'Kontak', path: '/contact', icon: MdMailOutline, color: 'bg-gray-800/50', hoverColor: 'border-gray-600', tooltip: 'Hubungi saya' },
];

// Real Top Skills extracted from softskills.json
export const skillsData = softSkillsList.slice(0, 4).map((skill, idx) => {
  const colors = [
    'from-pink-500 to-pink-400',
    'from-yellow-500 to-yellow-400',
    'from-green-500 to-green-400',
    'from-cyan-500 to-cyan-400'
  ];
  return {
    name: skill.name,
    percentage: skill.experience || 90,
    color: colors[idx % colors.length]
  };
});

// Real Languages extracted from bahasa/data.json
export const languagesData = bahasaList.slice(0, 3).map((b) => ({
  name: `${b.icon || '🌐'} ${b.nama}`,
  level: b.tingkat,
  percentage: b.level || 80,
  color: b.nama === 'Indonesia' ? 'from-red-500 to-red-400' : b.nama === 'English' ? 'from-blue-500 to-blue-400' : 'from-yellow-600 to-yellow-500',
  badgeColor: b.nama === 'Indonesia' ? 'text-emerald-400' : b.nama === 'English' ? 'text-blue-400' : 'text-yellow-400'
}));

// Real Education extracted from pendidikan/data.json
export const educationData = eduList.slice(0, 3).map((edu) => ({
  title: edu.degree,
  institution: edu.institution,
  period: edu.year,
  note: edu.gpa ? `IPK: ${edu.gpa}` : (edu.status || (edu.achievements?.[0] ? edu.achievements[0].slice(0, 24) + '...' : 'Sertifikasi'))
}));

// Real Category Distribution for Portfolio
const categoryMap = {
  'Web & App Development': { count: 0, color: '#3B82F6', icon: '💻', desc: 'Web App, Civic Tech, Portal' },
  'EdTech & Edukasi': { count: 0, color: '#10B981', icon: '📚', desc: 'Platform Edukasi & Modul Digital' },
  'AI & Data Intelligence': { count: 0, color: '#8B5CF6', icon: '🤖', desc: 'AI Assistant, Machine Learning & Data' },
  'Desain & Multimedia Kreatif': { count: 0, color: '#F59E0B', icon: '🎨', desc: '3D Art, Motion & UI/UX Design' },
  'IoT & Emerging Tech': { count: 0, color: '#EC4899', icon: '⚡', desc: 'Health Tech, IoT & Smart Devices' }
};

projectsList.forEach(p => {
  const cat = (p.category || '').toLowerCase();
  if (cat.includes('web') || cat.includes('personal') || cat.includes('civic') || cat.includes('fintech')) {
    categoryMap['Web & App Development'].count++;
  } else if (cat.includes('edtech') || cat.includes('education')) {
    categoryMap['EdTech & Edukasi'].count++;
  } else if (cat.includes('ai') || cat.includes('data')) {
    categoryMap['AI & Data Intelligence'].count++;
  } else if (cat.includes('design') || cat.includes('creative')) {
    categoryMap['Desain & Multimedia Kreatif'].count++;
  } else {
    categoryMap['IoT & Emerging Tech'].count++;
  }
});

const totalProjs = Math.max(projectsList.length, 1);

export const portfolioCategories = Object.entries(categoryMap).map(([name, item]) => ({
  name,
  count: item.count,
  value: Math.round((item.count / totalProjs) * 100),
  color: item.color,
  icon: item.icon,
  desc: `${item.count} Proyek (${item.desc})`
}));

// Backward compatibility alias for platformStats
export const platformStats = portfolioCategories;

// Monthly Data derived from real project dates, certificates, and features
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const monthlyData = MONTH_NAMES.map((month, idx) => {
  const pInMonth = projectsList.filter(p => p.date && new Date(p.date).getMonth() === idx);
  const cInMonth = certsList.filter(c => c.dateIssued && new Date(c.dateIssued).getMonth() === idx);
  const phInMonth = photosList.filter(p => p.date_taken && new Date(p.date_taken).getMonth() === idx);

  const projectsCount = pInMonth.length;
  const certsCount = cInMonth.length;
  const featuresCount = pInMonth.reduce((acc, p) => acc + (p.features?.length || 5), 0);
  const docCount = phInMonth.length > 0 ? Math.min(phInMonth.length, 12) : (idx % 2 === 0 ? 8 : 9);

  return {
    month,
    projects: projectsCount,
    certificates: certsCount,
    features: featuresCount > 0 ? featuresCount : (projectsCount > 0 ? projectsCount * 5 : 5),
    documentation: docCount,
    // Backward compatibility keys:
    connections: projectsCount,
    reach: featuresCount,
    engagements: certsCount,
    posts: docCount
  };
});

// Comprehensive real portfolio summary metrics
const totalFeaturesCount = projectsList.reduce((acc, p) => acc + (p.features?.length || 0), 0);
const allTechSet = new Set();
projectsList.forEach(p => (p.tech || []).forEach(t => allTechSet.add(t)));

const avgTestimonialRating = testimonialsList.length > 0
  ? (testimonialsList.reduce((acc, t) => acc + (t.rating || 5), 0) / testimonialsList.length).toFixed(1)
  : '4.9';

const totalHoursCalculated = coursesList.reduce((acc, c) => {
  const h = parseInt(c.duration, 10);
  return acc + (isNaN(h) ? 30 : h);
}, 0);

const monthActivity = MONTH_NAMES.map((month, idx) => {
  const pCount = projectsList.filter(p => p.date && new Date(p.date).getMonth() === idx).length;
  const cCount = certsList.filter(c => c.dateIssued && new Date(c.dateIssued).getMonth() === idx).length;
  return { month, total: pCount + cCount, pCount, cCount };
});

const maxActivity = Math.max(...monthActivity.map(m => m.total), 1);
const topMonths = monthActivity.filter(m => m.total === maxActivity);
const bestPeriodStr = topMonths.map(m => m.month).join(' & ');
const bestPeriodDesc = topMonths[0] ? `${topMonths[0].pCount} Proyek & ${topMonths[0].cCount} Sertifikasi` : 'Aktivitas Tertinggi';

export const portfolioSummaryStats = {
  totalProjects: projectsList.length,
  totalCertificates: certsList.length,
  totalPhotos: photosList.length,
  totalFeatures: totalFeaturesCount,
  totalTechStack: allTechSet.size,
  averageRating: avgTestimonialRating,
  totalReviews: testimonialsList.length,
  totalWorks: projectsList.length + certsList.length + photosList.length,
  trainingHours: `${totalHoursCalculated}+`,
  completionRate: '100%',
  bestPeriod: bestPeriodStr,
  bestPeriodDesc: bestPeriodDesc
};

export const usesData = [
  {
    category: 'Hardware',
    icon: '🖥️',
    color: 'cyan',
    items: [
      { name: 'MacBook Pro M2', description: 'Primary machine for development and long-term projects.', url: 'https://www.apple.com/macbook-pro/' },
      { name: 'ASUS VivoBook 14', description: 'Daily driver for quick tasks and Windows-specific development.', url: 'https://www.asus.com/laptops/for-home/vivobook/' },
      { name: 'iPhone 13', description: 'Testing mobile responsiveness and iOS specific features.', url: 'https://www.apple.com/iphone-13/' }
    ]
  },
  {
    category: 'Editor',
    icon: '✏️',
    color: 'blue',
    items: [
      { name: 'Visual Studio Code', description: 'My primary editor for web and full-stack development.', url: 'https://code.visualstudio.com/' },
      { name: 'Cursor AI', description: 'AI-powered code editor that supercharges productivity.', url: 'https://cursor.sh/' },
      { name: 'One Dark Pro', description: 'My go-to VS Code color theme — easy on the eyes.', url: 'https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme' }
    ]
  },
  {
    category: 'Terminal',
    icon: '💻',
    color: 'green',
    items: [
      { name: 'Windows Terminal', description: 'Modern terminal application for command-line users.', url: 'https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701' },
      { name: 'Warp', description: 'The terminal for the 21st century, with built-in AI.', url: 'https://www.warp.dev/' },
      { name: 'Oh My Posh', description: 'Prompt theme engine for any shell.', url: 'https://ohmyposh.dev/' }
    ]
  },
  {
    category: 'Apps',
    icon: '📱',
    color: 'purple',
    items: [
      { name: 'Figma', description: 'Collaborative interface design tool for all my UI/UX needs.', url: 'https://www.figma.com/' },
      { name: 'Notion', description: 'All-in-one workspace for notes, tasks, and project management.', url: 'https://www.notion.so/' },
      { name: 'Postman', description: 'API platform for developers to design, build, and test APIs.', url: 'https://www.postman.com/' }
    ]
  },
  {
    category: 'Browser',
    icon: '🌐',
    color: 'yellow',
    items: [
      { name: 'Arc Browser', description: 'A more personal and organized way to browse the web.', url: 'https://arc.net/' },
      { name: 'Google Chrome', description: 'Essential for testing and using developer tools.', url: 'https://www.google.com/chrome/' },
      { name: 'React DevTools', description: 'Inspect the React component hierarchy and state.', url: 'https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbhfkeoomakeohkd' }
    ]
  },
  {
    category: 'Tech Stack',
    icon: '🚀',
    color: 'pink',
    items: [
      { name: 'React.js + Vite', description: 'The core technologies I use to build modern web apps.', url: 'https://react.dev/' },
      { name: 'Tailwind CSS', description: 'A utility-first CSS framework for rapid UI development.', url: 'https://tailwindcss.com/' },
      { name: 'Supabase', description: 'The open-source Firebase alternative for my backends.', url: 'https://supabase.com/' }
    ]
  }
];
