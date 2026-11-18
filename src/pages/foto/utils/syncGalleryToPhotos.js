import galleryImages from "../../../data/gallery/images.json";
import galleryAlbums from "../../../data/gallery/albums.json";
import basePhotos from "../../../data/foto/photos.json";

/**
 * 🔄 Adapter untuk menyinkronkan foto tunggal dari /gallery (images.json)
 * ke dalam skema data Photography secara otomatis.
 */
export const adaptGalleryImageToPhoto = (img) => {
  const loc = typeof img.details?.location === 'object'
    ? `${img.details.location.city || img.details.location.name || 'Indonesia'}, Indonesia`
    : (img.details?.location || "Indonesia");

  const mood = Array.isArray(img.details?.mood)
    ? img.details.mood.join(", ")
    : (img.details?.mood || "Aesthetic, Inspiring");

  return {
    id: `gallery-img-${img.id}`,
    originalGalleryId: img.id,
    source: "gallery-image",
    title: img.title || "Foto Galeri",
    description: img.desc || "Dokumentasi visual dari galeri kenangan.",
    img: img.src,
    category: img.category || "General",
    location: loc,
    date_taken: img.uploaded_at ? img.uploaded_at.split("T")[0] : "2024-03-15",
    camera: img.details?.camera || "Canon EOS R6",
    lens: img.details?.lens || "24-70mm f/2.8",
    focal_length: img.details?.focal_length || "35mm",
    aperture: img.details?.aperture || "f/2.8",
    shutter_speed: img.details?.shutter_speed || "1/160s",
    iso: img.details?.iso || 100,
    color_palette: img.details?.color_palette || ["#0F172A", "#06B6D4", "#3B82F6"],
    mood: mood,
    featured: Boolean(img.engagement?.likes > 500),
    isFromGallery: true,
  };
};

/**
 * 🔄 Adapter untuk menyinkronkan koleksi album dari /gallery (albums.json)
 * ke dalam skema data Photography secara otomatis.
 */
export const adaptGalleryAlbumToPhoto = (alb) => {
  const coverSrc = Array.isArray(alb.src) ? alb.src[0] : alb.src;
  const photoCount = Array.isArray(alb.src) ? alb.src.length : 1;
  const loc = typeof alb.details?.location === 'object'
    ? `${alb.details.location.city || alb.details.location.name || 'Indonesia'}, Indonesia`
    : (alb.details?.location || "Indonesia");

  const mood = Array.isArray(alb.details?.mood)
    ? alb.details.mood.join(", ")
    : (alb.details?.mood || "Harmonious, Inspiring");

  return {
    id: `gallery-alb-${alb.id}`,
    originalGalleryId: alb.id,
    source: "gallery-album",
    title: alb.title || "Album Foto",
    description: alb.desc || `Koleksi seri album dengan ${photoCount} foto kenangan.`,
    img: coverSrc,
    category: alb.category || "Portrait",
    location: loc,
    date_taken: alb.uploaded_at ? alb.uploaded_at.split("T")[0] : "2024-05-10",
    camera: alb.details?.camera || "Sony A7 III",
    lens: alb.details?.lens || "FE 24-70mm f/2.8 GM",
    focal_length: alb.details?.focal_length || "50mm",
    aperture: alb.details?.aperture || "f/2.0",
    shutter_speed: alb.details?.shutter_speed || "1/200s",
    iso: alb.details?.iso || 200,
    color_palette: alb.details?.color_palette || ["#1E293B", "#EC4899", "#8B5CF6"],
    mood: mood,
    featured: Boolean(alb.engagement?.views > 10000),
    isFromGallery: true,
    isAlbum: true,
    albumCount: photoCount,
    albumPhotos: Array.isArray(alb.src) ? alb.src : [alb.src]
  };
};

/**
 * ⚡ Mengambil seluruh koleksi foto yang tersinkronisasi 2 arah
 * (karya fotografi asli + foto tunggal galeri + album galeri)
 */
export const getSynchronizedPhotos = () => {
  const adaptedImages = (galleryImages || []).map(adaptGalleryImageToPhoto);
  const adaptedAlbums = (galleryAlbums || []).map(adaptGalleryAlbumToPhoto);
  const combined = [...basePhotos, ...adaptedImages, ...adaptedAlbums];
  const seen = new Set();
  const result = [];
  for (const item of combined) {
    const key = item.isAlbum ? `album-${item.id}` : (item.img || item.id);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
};
