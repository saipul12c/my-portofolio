import React, { useState, useMemo, forwardRef } from "react";
import { parseMediaSource } from "../utils/mediaEmbed";
import { sanitizeUrl, sanitizeVideoUrl } from "../utils/sanitizers";
import { Play, AlertCircle, ExternalLink, Globe, Sparkles } from "lucide-react";

/**
 * Universal Media Player
 * Intelligently switches between:
 * - Native HTML5 <video> for local offline files (/videos/...) and direct MP4/WebM files
 * - Privacy-enhanced Official Embed <iframe> for YouTube, YouTube Shorts, TikTok, Instagram, Twitter/X, Facebook, Vimeo, Twitch, etc.
 */
const UniversalMediaPlayer = forwardRef(function UniversalMediaPlayer(
  {
    src,
    poster,
    title = "Video Player",
    isShort = false,
    autoPlay = false,
    muted = false,
    controls = true,
    loop = true,
    className = "",
    onLoadStart,
    onLoadedData,
    onError,
  },
  ref
) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Parse media URL
  const mediaInfo = useMemo(() => {
    return parseMediaSource(src, isShort);
  }, [src, isShort]);

  const isVertical = isShort || mediaInfo.isVertical;

  const handleIframeLoad = () => {
    setLoading(false);
    onLoadedData?.();
  };

  const handleVideoError = (e) => {
    setLoading(false);
    setLoadError(true);
    onError?.(e);
  };

  const handleVideoLoadedData = (e) => {
    setLoading(false);
    setLoadError(false);
    onLoadedData?.(e);
  };

  // Badge icon/text helper
  const getBadgeColor = (platform) => {
    switch (platform) {
      case "YouTube":
      case "YouTube Shorts":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "TikTok":
        return "bg-pink-500/20 text-pink-300 border-pink-500/30";
      case "Instagram":
      case "Instagram Reels":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "X (Twitter)":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Facebook Video":
      case "Facebook Reels":
        return "bg-blue-600/20 text-blue-300 border-blue-500/30";
      case "Vimeo":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-400/30";
      case "Twitch":
        return "bg-purple-600/20 text-purple-200 border-purple-400/30";
      case "Local File":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-cyan-500/20 text-cyan-300 border-cyan-400/30";
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black flex items-center justify-center ${
        isVertical ? "aspect-[9/16] max-w-[420px] w-full mx-auto" : "aspect-video w-full"
      } ${className}`}
    >
      {/* Platform Badge Overlay */}
      {mediaInfo.platform && mediaInfo.platform !== "None" && (
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border backdrop-blur-md shadow-md ${getBadgeColor(
              mediaInfo.platform
            )}`}
          >
            {mediaInfo.isLocal ? (
              <Sparkles size={12} className="text-emerald-400" />
            ) : (
              <Globe size={12} />
            )}
            {mediaInfo.platform}
          </span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !loadError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-cyan-400 border-t-transparent mb-2" />
          <span className="text-xs text-gray-400 font-medium">Memuat player...</span>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-2" />
          <p className="text-red-300 font-semibold text-sm">Media gagal dimuat</p>
          <p className="text-gray-400 text-xs mt-1 max-w-xs">
            Periksa tautan atau koneksi internet Anda.
          </p>
          {src && (
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 transition"
            >
              Buka di tab baru <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {/* Case 1: Social Media Embed Player (Iframe) */}
      {mediaInfo.isEmbed && mediaInfo.embedUrl ? (
        <iframe
          src={mediaInfo.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleVideoError}
          className="w-full h-full border-0 rounded-xl"
        />
      ) : (
        /* Case 2: Native HTML5 Video Player for Local / Direct MP4 */
        <video
          ref={ref}
          src={mediaInfo.isLocal ? src : sanitizeVideoUrl(src)}
          poster={sanitizeUrl(poster, "")}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          preload="metadata"
          onLoadStart={onLoadStart}
          onLoadedData={handleVideoLoadedData}
          onError={handleVideoError}
          aria-label={title}
          className="w-full h-full object-contain rounded-xl"
        />
      )}
    </div>
  );
});

export default UniversalMediaPlayer;
