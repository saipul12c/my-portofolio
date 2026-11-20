import dataBahasa from "../data/bahasa/data.json";
import projectsData from "../data/projects.json";
import { APPS_DATA } from "../pages/daftarlistApp/data/appsData";

/**
 * Normalisasi string menjadi slug URL yang aman
 */
export const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

// Index seluruh skill bahasa sehari-hari dan bahasa pemrograman
const allSkills = [
  ...(dataBahasa.bahasaPemrograman || []).map((item) => ({ ...item, isProgramming: true })),
  ...(dataBahasa.bahasaSehariHari || []).map((item) => ({ ...item, isProgramming: false })),
];

const skillSlugMap = new Map();
allSkills.forEach((skill) => {
  const slug = slugify(skill.nama);
  skillSlugMap.set(slug, { ...skill, slug });
  skillSlugMap.set(skill.nama.toLowerCase(), { ...skill, slug });
});

// Pemetaan sinonim atau variasi nama teknologi ke slug detail bahasa
const TECH_ALIASES = {
  react: "react",
  "react.js": "react",
  reactjs: "react",
  "react native": "react-native",
  "react-native": "react-native",
  vue: "vuejs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  "node.js": "javascript",
  nodejs: "javascript",
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  python: "python",
  "python fastapi": "python",
  "python flask": "python",
  fastapi: "python",
  flask: "python",
  django: "python",
  mongodb: "mongodb",
  mongo: "mongodb",
  postgres: "sql",
  postgresql: "sql",
  mysql: "sql",
  sql: "sql",
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  aws: "aws",
  "amazon web services": "aws",
  git: "git",
  github: "git",
  figma: "figma",
  tensorflow: "tensorflow",
  "tensorflow.js": "tensorflow",
  graphql: "graphql",
  java: "java",
  php: "php",
  go: "go",
  golang: "go",
  rust: "rust",
  kotlin: "kotlin",
  dart: "dart",
  swift: "swift",
  "c#": "c",
  csharp: "c",
  ruby: "ruby",
  elixir: "elixir",
  redis: "redis",
  jest: "jest",
  webpack: "webpack",
  cybersecurity: "cybersecurity",
  security: "cybersecurity",
  "cloud architecture": "cloud-architecture",
  indonesia: "indonesia",
  english: "english",
  jawa: "jawa",
  japan: "japan",
};

/**
 * Mengambil informasi route detail bahasa/teknologi berdasarkan nama teknologi.
 * Mengembalikan objek dengan url spesifik ke `/bahasa/detail/:slug` atau fallback `/bahasa?q=:tech`
 */
export const getTechLanguageInfo = (techName = "") => {
  if (!techName) {
    return { found: false, name: "", slug: "", url: "/bahasa" };
  }

  const clean = techName.trim().toLowerCase();

  // 1. Cek alias mapping
  if (TECH_ALIASES[clean]) {
    const targetSlug = TECH_ALIASES[clean];
    const skill = skillSlugMap.get(targetSlug);
    if (skill) {
      return {
        found: true,
        name: skill.nama,
        slug: skill.slug,
        url: `/bahasa/detail/${skill.slug}`,
      };
    }
  }

  // 2. Cek slug langsung
  const slug = slugify(techName);
  if (skillSlugMap.has(slug)) {
    const skill = skillSlugMap.get(slug);
    return {
      found: true,
      name: skill.nama,
      slug: skill.slug,
      url: `/bahasa/detail/${skill.slug}`,
    };
  }

  // 3. Cek apakah ada nama skill yang mengandung keyword atau sebaliknya
  for (const skill of allSkills) {
    const sName = skill.nama.toLowerCase();
    if (clean.includes(sName) || sName.includes(clean)) {
      return {
        found: true,
        name: skill.nama,
        slug: slugify(skill.nama),
        url: `/bahasa/detail/${slugify(skill.nama)}`,
      };
    }
  }

  // 4. Fallback jika teknologi tidak memiliki halaman detail tersendiri:
  // Arahkan ke halaman /bahasa dengan query pencarian
  return {
    found: false,
    name: techName,
    slug: "",
    url: `/bahasa?q=${encodeURIComponent(techName)}`,
  };
};

/**
 * Mencari proyek dan aplikasi yang menggunakan skill/teknologi tertentu
 */
export const getRelatedProjectsAndApps = (skillName = "") => {
  if (!skillName) return { projects: [], apps: [] };

  const sLower = skillName.trim().toLowerCase();

  // 1. Filter proyek dari projects.json
  const matchedProjects = (projectsData.projects || []).filter((p) => {
    const inTech = (p.tech || []).some((t) => {
      const tLower = t.toLowerCase();
      return (
        tLower === sLower ||
        tLower.includes(sLower) ||
        sLower.includes(tLower) ||
        TECH_ALIASES[tLower] === slugify(skillName)
      );
    });
    const inDesc = (p.description || "").toLowerCase().includes(sLower);
    const inTitle = (p.title || "").toLowerCase().includes(sLower);
    return inTech || inDesc || inTitle;
  });

  // 2. Filter aplikasi dari appsData.js
  const matchedApps = (APPS_DATA || []).filter((app) => {
    // Jangan sertakan aplikasi bahasa explorer itu sendiri
    if (app.id === "bahasa-explorer") return false;

    const inTech = (app.techStack || []).some((t) => {
      const tLower = t.toLowerCase();
      return (
        tLower === sLower ||
        tLower.includes(sLower) ||
        sLower.includes(tLower) ||
        TECH_ALIASES[tLower] === slugify(skillName)
      );
    });
    const inDesc = (app.description || "").toLowerCase().includes(sLower);
    const inTitle = (app.title || "").toLowerCase().includes(sLower);
    const inFeatures = (app.keyFeatures || []).some((f) => f.toLowerCase().includes(sLower));
    return inTech || inDesc || inTitle || inFeatures;
  });

  return {
    projects: matchedProjects,
    apps: matchedApps,
  };
};
