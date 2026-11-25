/**
 * Media Embed Utilities
 * Supports: Local/offline files, YouTube, YouTube Shorts, TikTok, Instagram (Reels & Posts),
 * Twitter/X, Facebook Video, Vimeo, Dailymotion, Twitch, Pinterest, and direct MP4/WebM.
 */

/**
 * Parse any media source URL and return embed info
 * @param {string} url - Input URL or local relative path
 * @param {boolean} isShortHint - Hint whether this is expected to be a short/vertical video
 * @returns {object} - Parsed media source metadata
 */
export function parseMediaSource(url, isShortHint = false) {
  if (!url || typeof url !== "string") {
    return {
      type: "empty",
      isEmbed: false,
      isLocal: false,
      embedUrl: null,
      directUrl: null,
      platform: "None",
      isVertical: isShortHint,
    };
  }

  const trimmed = url.trim();

  // 1. Check if Local / Offline Path (starts with / or relative or window.location.origin)
  const isLocal =
    trimmed.startsWith("/") ||
    trimmed.startsWith("./") ||
    trimmed.startsWith("../") ||
    (!trimmed.startsWith("http://") && !trimmed.startsWith("https://"));

  if (isLocal) {
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(trimmed);
    const isImage = /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(trimmed);

    return {
      type: isVideo ? "local_video" : isImage ? "local_image" : "local_file",
      isEmbed: false,
      isLocal: true,
      embedUrl: null,
      directUrl: trimmed,
      platform: "Local File",
      isVertical: isShortHint,
    };
  }

  // 2. YouTube & YouTube Shorts
  const ytShortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (ytShortsMatch) {
    const videoId = ytShortsMatch[1];
    return {
      type: "youtube_short",
      isEmbed: true,
      isLocal: false,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`,
      directUrl: trimmed,
      platform: "YouTube Shorts",
      isVertical: true,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  const ytMatch =
    trimmed.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
  if (ytMatch) {
    const videoId = ytMatch[1];
    return {
      type: "youtube",
      isEmbed: true,
      isLocal: false,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`,
      directUrl: trimmed,
      platform: "YouTube",
      isVertical: isShortHint,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 3. TikTok
  const tiktokMatch = trimmed.match(/tiktok\.com\/@?[^/]+\/video\/(\d+)/i);
  if (tiktokMatch) {
    const videoId = tiktokMatch[1];
    return {
      type: "tiktok",
      isEmbed: true,
      isLocal: false,
      videoId,
      embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
      directUrl: trimmed,
      platform: "TikTok",
      isVertical: true,
    };
  }
  if (/tiktok\.com/i.test(trimmed)) {
    return {
      type: "tiktok",
      isEmbed: true,
      isLocal: false,
      embedUrl: trimmed.includes("/embed") ? trimmed : `https://www.tiktok.com/embed?url=${encodeURIComponent(trimmed)}`,
      directUrl: trimmed,
      platform: "TikTok",
      isVertical: true,
    };
  }

  // 4. Instagram (Reels & Feed Posts)
  const igMatch = trimmed.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch) {
    const code = igMatch[1];
    const isReel = trimmed.includes("/reel/");
    return {
      type: "instagram",
      isEmbed: true,
      isLocal: false,
      videoId: code,
      embedUrl: `https://www.instagram.com/p/${code}/embed/captioned/`,
      directUrl: trimmed,
      platform: isReel ? "Instagram Reels" : "Instagram",
      isVertical: isReel || isShortHint,
    };
  }

  // 5. Twitter / X
  const xMatch = trimmed.match(/(?:twitter|x)\.com\/[^/]+\/status\/(\d+)/i);
  if (xMatch) {
    const tweetId = xMatch[1];
    return {
      type: "twitter",
      isEmbed: true,
      isLocal: false,
      videoId: tweetId,
      embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=dark`,
      directUrl: trimmed,
      platform: "X (Twitter)",
      isVertical: isShortHint,
    };
  }

  // 6. Facebook Video & Reels
  if (/facebook\.com|fb\.watch/i.test(trimmed)) {
    const isFbReel = trimmed.includes("/reel/");
    return {
      type: "facebook",
      isEmbed: true,
      isLocal: false,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false`,
      directUrl: trimmed,
      platform: isFbReel ? "Facebook Reels" : "Facebook Video",
      isVertical: isFbReel || isShortHint,
    };
  }

  // 7. Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch) {
    const videoId = vimeoMatch[3];
    return {
      type: "vimeo",
      isEmbed: true,
      isLocal: false,
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0`,
      directUrl: trimmed,
      platform: "Vimeo",
      isVertical: isShortHint,
    };
  }

  // 8. Dailymotion
  const dmMatch = trimmed.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/i);
  if (dmMatch) {
    const videoId = dmMatch[1];
    return {
      type: "dailymotion",
      isEmbed: true,
      isLocal: false,
      videoId,
      embedUrl: `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`,
      directUrl: trimmed,
      platform: "Dailymotion",
      isVertical: isShortHint,
    };
  }

  // 9. Twitch
  const twitchMatch = trimmed.match(/twitch\.tv\/videos\/(\d+)/i);
  if (twitchMatch) {
    const videoId = twitchMatch[1];
    const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return {
      type: "twitch",
      isEmbed: true,
      isLocal: false,
      videoId,
      embedUrl: `https://player.twitch.tv/?video=${videoId}&parent=${hostname}&autoplay=true`,
      directUrl: trimmed,
      platform: "Twitch",
      isVertical: false,
    };
  }

  // 10. Pinterest
  const pinMatch = trimmed.match(/pinterest\.com\/pin\/(\d+)/i);
  if (pinMatch) {
    const pinId = pinMatch[1];
    return {
      type: "pinterest",
      isEmbed: true,
      isLocal: false,
      videoId: pinId,
      embedUrl: `https://assets.pinterest.com/ext/embed.html?id=${pinId}`,
      directUrl: trimmed,
      platform: "Pinterest",
      isVertical: true,
    };
  }

  // 11. Direct Streaming / Video File (.mp4, .webm, .ogg)
  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed);
  if (isDirectVideo) {
    return {
      type: "direct_video",
      isEmbed: false,
      isLocal: false,
      embedUrl: null,
      directUrl: trimmed,
      platform: "Direct Video (MP4)",
      isVertical: isShortHint,
    };
  }

  // 12. Default Fallback
  return {
    type: "unknown",
    isEmbed: false,
    isLocal: false,
    embedUrl: null,
    directUrl: trimmed,
    platform: "Web Video",
    isVertical: isShortHint,
  };
}

/**
 * Get the best poster / thumbnail for a media item
 * If no thumbnail is provided and it's a YouTube link, automatically extract YouTube thumbnail
 * @param {object} item - Media item
 * @returns {string} - Poster URL
 */
export function getMediaPoster(item) {
  if (!item) return "/placeholder.jpg";
  if (item.thumbnail) return item.thumbnail;
  if (item.poster) return item.poster;

  const src = Array.isArray(item.src) ? item.src[0] : item.src;
  const parsed = parseMediaSource(src);

  if (parsed.thumbnail) {
    return parsed.thumbnail;
  }

  return src || "/placeholder.jpg";
}
