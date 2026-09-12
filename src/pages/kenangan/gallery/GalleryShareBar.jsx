import { motion } from "framer-motion";
import { Share2, Copy, Check, Link as LinkIcon, Download, Info } from "lucide-react";
import { useState } from "react";
import { GALLERY_CONFIG } from "../utils/constants";
import { sanitizeFilename, sanitizeExtension, isSafeOrigin } from "../utils/sanitizers";

export default function GalleryShareBar({ media, currentIndex = 0 }) {
  const [copied, setCopied] = useState(false);

  const mediaUrl = `${window.location.origin}/gallery?media=${media?.id || ""}&type=${media?.type || ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mediaUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), GALLERY_CONFIG.COPY_FEEDBACK_MS);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = async () => {
    const targetSrc = Array.isArray(media?.src)
      ? (media.src[currentIndex] || media.src[0])
      : (media?.src || media?.thumbnail || media?.poster);

    if (!targetSrc) {
      console.error('No media source available for download');
      return;
    }
    
    try {
      // Validate URL
      const url = new URL(targetSrc, window.location.origin);
      
      // Security check: Only allow http/https
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        console.error('Invalid protocol for download:', url.protocol);
        alert('Tidak dapat mengunduh: protokol tidak didukung');
        return;
      }
      
      // Sanitize filename
      const baseFilename = media.title || 'gallery-media';
      const safeFilename = sanitizeFilename(baseFilename);
      
      // Get and validate file extension
      const urlPath = url.pathname;
      const extMatch = urlPath.match(/\.([a-z0-9]+)$/i);
      let ext = extMatch ? sanitizeExtension(extMatch[1]) : null;
      if (!ext) {
        ext = media?.type === 'video' || media?.type === 'short' ? 'mp4' : 'jpg';
      }
      
      const filename = `${safeFilename}${Array.isArray(media?.src) ? `-${currentIndex + 1}` : ''}.${ext}`;
      
      // Check origin safety
      const isSafe = isSafeOrigin(url.href);
      
      // If same origin or trusted CDN, attempt fetch + blob for seamless download
      if (isSafe) {
        try {
          const response = await fetch(url.href, { mode: 'cors' });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          return;
        } catch (fetchErr) {
          console.warn('Fetch blob download failed, falling back to direct anchor:', fetchErr);
        }
      }
      
      // Fallback: direct anchor download or open in new tab
      const link = document.createElement('a');
      link.href = url.href;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Gagal mengunduh file. Silakan coba lagi.');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: media?.title || 'Gallery Media',
          text: media?.desc || 'Check out this media from my gallery!',
          url: mediaUrl
        });
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  const shareToTwitter = () => {
    const text = `Lihat "${media?.title}" di Gallery saya! 🎨\n`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(mediaUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mediaUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <motion.div
      className="flex items-center gap-2 flex-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 text-cyan-300 px-3 py-2 rounded-lg transition text-sm"
        title="Copy link"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied!" : "Copy"}
      </button>

      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/30 text-purple-300 px-3 py-2 rounded-lg transition text-sm"
          title="Share via..."
        >
          <Share2 size={16} />
          Share
        </button>
      )}

      <button
        onClick={shareToTwitter}
        className="flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/30 text-blue-300 px-3 py-2 rounded-lg transition text-sm"
        title="Share to Twitter"
      >
        <Share2 size={16} />
        Twitter
      </button>

      <button
        onClick={shareToFacebook}
        className="flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg transition text-sm"
        title="Share to Facebook"
      >
        <Share2 size={16} />
        Facebook
      </button>

      {media?.type !== "short" && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/40 border border-green-400/30 text-green-300 px-3 py-2 rounded-lg transition text-sm"
          title="Download media"
        >
          <Download size={16} />
          Download
        </button>
      )}
    </motion.div>
  );
}
