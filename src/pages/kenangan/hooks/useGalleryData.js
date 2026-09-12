import { useState, useEffect, useMemo, useCallback } from "react";
import { getMediaRoute } from "../utils/routeHelpers";

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
        const [shortsRes, imagesRes, videosRes, albumsRes] = await Promise.all([
          import("../../../data/gallery/shorts.json"),
          import("../../../data/gallery/images.json"),
          import("../../../data/gallery/videos.json"),
          import("../../../data/gallery/albums.json"),
        ]);

        if (!isMounted) return;

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
