/**
 * authorProfileService.js
 * Layanan manajemen data profil penulis blog (terintegrasi dengan LocalStorage & Supabase).
 */

const STORAGE_KEY = 'blog_author_profiles_v1';

export const DEFAULT_PROFILES = {
  "m-syaiful-mukmin": {
    name: "M. Syaiful Mukmin",
    slug: "m-syaiful-mukmin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    bio: "Pengembang perangkat lunak, penulis, dan tech enthusiast dengan dedikasi dalam membangun arsitektur web modern, kecerdasan buatan, dan dokumentasi visual bermutu tinggi.",
    expertise: "Web Development & Sistem Arsitektur",
    location: "Banjarmasin, Kalimantan Selatan",
    company: "Freelance Software Engineer",
    verified: true,
    email: "syaifulmukmin.dev@gmail.com",
    socialLinks: {
      linkedin: "https://linkedin.com/in/syaifulmukmin",
      github: "https://github.com/syaifulmukmin",
      instagram: "https://instagram.com/syaifulmukmin",
      twitter: "https://twitter.com/syaifulmukmin",
      website: "https://syaifulmukmin.my.id"
    }
  }
};

/**
 * 📥 Mengambil seluruh data profil penulis yang tersimpan
 */
export const getAuthorProfiles = () => {
  if (typeof window === 'undefined') return DEFAULT_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILES, ...parsed };
  } catch (err) {
    console.error("Gagal membaca profil penulis:", err);
    return DEFAULT_PROFILES;
  }
};

/**
 * 🔍 Mencari profil penulis spesifik berdasarkan nama atau slug
 */
export const getAuthorProfile = (slugOrName) => {
  if (!slugOrName) return null;
  const profiles = getAuthorProfiles();
  const searchSlug = String(slugOrName).toLowerCase().trim().replace(/\s+/g, '-');

  // 1. Cek langsung via slug
  if (profiles[searchSlug]) return profiles[searchSlug];

  // 2. Cek via pencocokan nama
  const found = Object.values(profiles).find(
    p => p.name?.toLowerCase().trim() === String(slugOrName).toLowerCase().trim() ||
         p.slug === searchSlug
  );

  return found || null;
};

/**
 * 💾 Menyimpan atau memperbarui profil penulis
 */
export const saveAuthorProfile = (profileData) => {
  if (!profileData || !profileData.name) {
    return { success: false, message: "Nama penulis wajib diisi!" };
  }

  try {
    const profiles = getAuthorProfiles();
    const slug = profileData.slug || profileData.name.toLowerCase().trim().replace(/\s+/g, '-');
    
    const updatedProfile = {
      ...profileData,
      slug,
      name: profileData.name.trim(),
      updatedAt: new Date().toISOString()
    };

    profiles[slug] = updatedProfile;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));

    // Beri tahu komponen yang sedang terbuka (seperti DetailProfile) untuk refresh realtime
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('author_profile_updated', { detail: updatedProfile }));
    }

    return { success: true, profile: updatedProfile };
  } catch (err) {
    console.error("Gagal menyimpan profil penulis:", err);
    return { success: false, message: err.message || "Gagal menyimpan data ke sistem." };
  }
};

/**
 * 🗑️ Menghapus profil penulis kustom
 */
export const deleteAuthorProfile = (slug) => {
  if (!slug) return false;
  try {
    const profiles = getAuthorProfiles();
    delete profiles[slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return true;
  } catch (err) {
    console.error("Gagal menghapus profil:", err);
    return false;
  }
};
