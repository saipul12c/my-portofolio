import { useState, useEffect, useMemo, useCallback } from "react";
import { getMediaRoute } from "../utils/routeHelpers";

/**
 * 🔄 Adapter untuk menyinkronkan data dari Photography (/data/foto/photos.json)
 * ke dalam skema media Gallery secara otomatis.
 */
export const adaptPhotoToGalleryItem = (photo) => {
  const tags = [
    ...(photo.category ? [photo.category.toLowerCase()] : []),
    ...(photo.mood ? photo.mood.toLowerCase().split(/[,\s]+/).filter(Boolean) : []),
    "photography",
    ...(photo.location ? photo.location.toLowerCase().split(/[,\s]+/).filter(Boolean) : [])
  ].filter(Boolean);

  return {
    id: `photo-${photo.id}`,
    originalPhotoId: photo.id,
    type: "image",
    title: photo.title || "Karya Fotografi",
    desc: photo.description || "",
    src: photo.img,
    category: photo.category || "Photography",
    tags: [...new Set(tags)],
    uploaded_at: photo.date_taken ? `${photo.date_taken}T00:00:00Z` : "2023-01-01T00:00:00Z",
    creator: {
      username: "syaiful_m",
      display_name: "Muhammad Syaiful Mukmin",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      verified: true,
      followers: 8720,
      bio: "Fotografer & Full Stack Developer 📸",
      social_links: {
        instagram: "https://instagram.com/saipul16_",
      }
    },
    details: {
      camera: photo.camera || "Professional Camera",
      lens: photo.lens || "High Performance Lens",
      aperture: photo.aperture,
      shutter_speed: photo.shutter_speed,
      iso: photo.iso,
      focal_length: photo.focal_length,
      location: {
        name: photo.location || "Indonesia",
        city: photo.location?.split(",")[0]?.trim() || "Indonesia",
        country: "Indonesia",
      },
      color_palette: photo.color_palette || [],
      mood: photo.mood ? photo.mood.split(",").map(m => m.trim().toLowerCase()) : ["aesthetic"]
    },
    engagement: {
      views: 850 + (Number(photo.id) * 125),
      likes: 120 + (Number(photo.id) * 18),
      shares: 15 + (Number(photo.id) * 3),
      comments: 6 + (Number(photo.id) * 2)
    },
    isFromPhotography: true
  };
};

export function useGalleryData() {
  const [dataState, setDataState] = useState({
    shorts: [],
    images: [],
    videos: [],
    albums: [],
    allMedia: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadAllMedia = async () => {
      try {
        const [shortsRes, imagesRes, videosRes, albumsRes, photosRes] = await Promise.all([
          import("../../../data/gallery/shorts.json"),
          import("../../../data/gallery/images.json"),
          import("../../../data/gallery/videos.json"),
          import("../../../data/gallery/albums.json"),
          import("../../../data/foto/photos.json"),
        ]);

        if (!isMounted) return;

        const shorts = (shortsRes.default || []).map((item) => ({
          ...item,
          type: "short",
        }));
        const rawImages = (imagesRes.default || []).map((item) => ({
          ...item,
          type: "image",
        }));
        
        // 🔗 Sinkronisasi data otomatis dari halaman Photography dengan deduplikasi dan sortir tanggal
        const adaptedPhotos = (photosRes.default || []).map(adaptPhotoToGalleryItem);
        const combinedImages = [...adaptedPhotos, ...rawImages];
        const seenSrc = new Set();
        const images = [];
        for (const img of combinedImages) {
          const key = img.src || img.id;
          if (!seenSrc.has(key)) {
            seenSrc.add(key);
            images.push(img);
          }
        }
        images.sort((a, b) => new Date(b.uploaded_at || 0) - new Date(a.uploaded_at || 0));

        const videos = (videosRes.default || []).map((item) => ({
          ...item,
          type: "video",
        }));
        const albums = (albumsRes.default || []).map((item) => ({
          ...item,
          type: "album",
        }));

        setDataState({
          shorts,
          images,
          videos,
          albums,
          allMedia: [...shorts, ...images, ...videos, ...albums]
        });
      } catch (err) {
        if (!isMounted) return;
        console.error("Error loading gallery data:", err);
        setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllMedia();
    return () => { isMounted = false; };
  }, []);

  const allTags = useMemo(() => {
    return [
      ...new Set(
        dataState.allMedia
          .flatMap((item) => item.tags || [])
          .filter(Boolean)
      ),
    ];
  }, [dataState.allMedia]);

  // Provide internal suggestion helper for other components
  const getInternalSuggestions = useCallback((searchTerm = "") => {
    const term = (searchTerm || "").toLowerCase().trim();
    if (!term) return [];
    return dataState.allMedia
      .filter((item) => {
        return (
          item.title?.toLowerCase().includes(term) ||
          item.desc?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term) ||
          (item.tags || []).some((t) => t.toLowerCase().includes(term))
        );
      })
      .slice(0, 12)
      .map((item) => ({
        type: "internal",
        id: item.id,
        title: item.title || item.desc || `${item.type} ${item.id}`,
        mediaType: item.type,
        url: getMediaRoute(item.type, item.id),
      }));
  }, [dataState.allMedia]);

  const filterMedia = useCallback((items, searchTerm = "", tags = []) => {
    let filtered = items;

    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(term) ||
          item.desc?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(term)
          )
      );
    }

    if (tags && tags.length > 0) {
      filtered = filtered.filter((item) =>
        tags.some((tag) => item.tags?.includes(tag))
      );
    }

    return filtered;
  }, []);

  return {
    shorts: dataState.shorts,
    images: dataState.images,
    videos: dataState.videos,
    albums: dataState.albums,
    allMedia: dataState.allMedia,
    loading,
    error,
    allTags,
    filterMedia,
    getInternalSuggestions,
  };
}
