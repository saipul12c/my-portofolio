import { useState, useEffect, useMemo } from "react";

export function useGalleryData() {
  const [allMedia, setAllMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllMedia = async () => {
      try {
        const [shortsRes, imagesRes, videosRes, albumsRes] = await Promise.all([
          import("../../../data/gallery/shorts.json"),
          import("../../../data/gallery/images.json"),
          import("../../../data/gallery/videos.json"),
          import("../../../data/gallery/albums.json"),
        ]);

        const shorts = (shortsRes.default || []).map((item) => ({
          ...item,
          type: "short",
        }));
        const images = (imagesRes.default || []).map((item) => ({
          ...item,
          type: "image",
        }));
        const videos = (videosRes.default || []).map((item) => ({
          ...item,
          type: "video",
        }));
        const albums = (albumsRes.default || []).map((item) => ({
          ...item,
          type: "album",
        }));

        setAllMedia([...shorts, ...images, ...videos, ...albums]);
      } catch (err) {
        console.error("Error loading gallery data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadAllMedia();
  }, []);

  const allTags = useMemo(() => {
    return [
      ...new Set(
        allMedia
          .flatMap((item) => item.tags || [])
          .filter(Boolean)
      ),
    ];
  }, [allMedia]);

  // Provide internal suggestion helper for other components
  const getInternalSuggestions = (searchTerm = "") => {
    const term = (searchTerm || "").toLowerCase();
    if (!term) return [];
    return allMedia
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
        // normalize route segments to match app routes (short -> shorts, image -> images, video -> videos, album -> albums)
        url: `/gallery/${{ short: "shorts", image: "images", video: "videos", album: "albums" }[item.type] || item.type}/${item.id}`,
      }));
  };

  const filterMedia = (searchTerm = "", tags = []) => {
    let filtered = allMedia;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
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

    if (tags.length > 0) {
      filtered = filtered.filter((item) =>
        tags.some((tag) => item.tags?.includes(tag))
      );
    }

    return filtered;
  };

  return {
    allMedia,
    loading,
    error,
    allTags,
    filterMedia,
    getInternalSuggestions,
  };
}
