/**
 * authorProfileService.js
 * Layanan manajemen data profil penulis blog (terintegrasi dengan LocalStorage & Supabase).
 */

const STORAGE_KEY = 'blog_author_profiles_v1';

/**
 * Normalisasi nama atau slug penulis agar konsisten di seluruh aplikasi
 * (mis. "M. Syaiful Mukmin" dan "m.-syaiful-mukmin" -> "m-syaiful-mukmin").
 */
export const normalizeAuthorSlug = (slugOrName) => {
  if (!slugOrName) return '';
  return String(slugOrName)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const parseUpdatedTime = (profile) => {
  const ts = Date.parse(profile?.updatedAt || '');
  return Number.isNaN(ts) ? 0 : ts;
};

const mergeAuthorRecords = (existing, incoming, canonicalSlug) => {
  if (!existing) {
    return {
      ...incoming,
      slug: canonicalSlug
    };
  }

  const existingTime = parseUpdatedTime(existing);
  const incomingTime = parseUpdatedTime(incoming);
  const incomingIsNewer = incomingTime > existingTime || (incomingTime === existingTime && Boolean(incoming?.updatedAt) && !existing?.updatedAt);

  const primary = incomingIsNewer ? incoming : existing;
  const secondary = incomingIsNewer ? existing : incoming;

  const pickText = (field) => {
    const val = primary?.[field];
    if (typeof val === 'string' && val.trim().length > 0) return val;
    return secondary?.[field] ?? val ?? '';
  };

  const primarySocials = primary?.socialLinks || {};
  const secondarySocials = secondary?.socialLinks || {};
  const socialKeys = new Set([...Object.keys(secondarySocials), ...Object.keys(primarySocials)]);
  const mergedSocials = {};
  socialKeys.forEach((key) => {
    const pVal = primarySocials[key];
    mergedSocials[key] = (typeof pVal === 'string' && pVal.trim().length > 0)
      ? pVal
      : (secondarySocials[key] ?? pVal ?? '');
  });

  return {
    ...secondary,
    ...primary,
    slug: canonicalSlug,
    name: pickText('name'),
    avatar: pickText('avatar'),
    bio: pickText('bio'),
    expertise: pickText('expertise'),
    location: pickText('location'),
    company: pickText('company'),
    email: pickText('email'),
    verified: primary?.verified !== undefined ? primary.verified : (secondary?.verified !== false),
    socialLinks: mergedSocials,
    updatedAt: primary?.updatedAt || secondary?.updatedAt
  };
};

const normalizeProfilesMap = (rawProfiles = {}) => {
  const merged = {};
  let hasChanges = false;

  const upsertProfile = (rawKey, profile, isStored) => {
    if (!profile || typeof profile !== 'object') return;
    const rawSlug = profile.slug || rawKey || profile.name;
    const canonicalSlug = normalizeAuthorSlug(rawSlug) || normalizeAuthorSlug(profile.name) || String(rawKey || '').trim();
    if (!canonicalSlug) return;

    const normalizedName = String(profile.name || '').toLowerCase().trim();
    let targetKey = canonicalSlug;

    if (!merged[targetKey] && normalizedName) {
      const sameNameKey = Object.keys(merged).find(
        (k) => merged[k]?.name?.toLowerCase().trim() === normalizedName
      );
      if (sameNameKey) {
        targetKey = sameNameKey;
      }
    }

    if (isStored && (rawKey !== targetKey || profile.slug !== targetKey)) {
      hasChanges = true;
    }

    merged[targetKey] = mergeAuthorRecords(merged[targetKey], profile, targetKey);
  };

  Object.entries(DEFAULT_PROFILES).forEach(([key, profile]) => upsertProfile(key, profile, false));
  Object.entries(rawProfiles || {}).forEach(([key, profile]) => upsertProfile(key, profile, true));

  return { profiles: merged, hasChanges };
};

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
      return { ...DEFAULT_PROFILES };
    }
    const parsed = JSON.parse(raw);
    const { profiles, hasChanges } = normalizeProfilesMap(parsed);
    if (hasChanges) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }
    return profiles;
  } catch (err) {
    console.error("Gagal membaca profil penulis:", err);
    return { ...DEFAULT_PROFILES };
  }
};

/**
 * 🔍 Mencari profil penulis spesifik berdasarkan nama atau slug
 */
export const getAuthorProfile = (slugOrName) => {
  if (!slugOrName) return null;
  const profiles = getAuthorProfiles();
  const rawSearch = String(slugOrName).toLowerCase().trim();
  const searchSlug = normalizeAuthorSlug(slugOrName);

  // 1. Cek langsung via slug ternormalisasi
  if (searchSlug && profiles[searchSlug]) return profiles[searchSlug];

  // 2. Cek via pencocokan nama atau slug ternormalisasi
  const found = Object.values(profiles).find((p) => {
    const pName = p.name?.toLowerCase().trim();
    const pSlug = normalizeAuthorSlug(p.slug || p.name);
    return pName === rawSearch || (searchSlug && (pSlug === searchSlug || normalizeAuthorSlug(p.name) === searchSlug));
  });

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
    const trimmedName = profileData.name.trim();
    const requestedSlug = normalizeAuthorSlug(profileData.slug || trimmedName);
    const nameSlug = normalizeAuthorSlug(trimmedName);

    // Cari entri yang sudah ada dengan nama atau slug yang sama agar tidak menimbulkan duplikat
    const existingSameNameKey = Object.keys(profiles).find(
      (k) => profiles[k]?.name?.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    const slug = (profiles[requestedSlug] ? requestedSlug : null) ||
      existingSameNameKey ||
      requestedSlug ||
      nameSlug;

    const updatedProfile = mergeAuthorRecords(
      profiles[slug],
      {
        ...profileData,
        slug,
        name: trimmedName,
        updatedAt: new Date().toISOString()
      },
      slug
    );

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
