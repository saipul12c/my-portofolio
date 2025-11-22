import { motion } from "framer-motion";
import { Share2, Copy, Check, Link as LinkIcon, Download, Info } from "lucide-react";
import { useState } from "react";

export default function GalleryShareBar({ media }) {
  const [copied, setCopied] = useState(false);

  const mediaUrl = `${window.location.origin}/gallery?media=${media?.id || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mediaUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!media?.src) return;
    const link = document.createElement("a");
    link.href = media.src;
    link.download = `${media.title || "media"}`;
    link.click();
  };

  const shareToTwitter = () => {
    const text = `Lihat "${media?.title}" di Gallery saya! 🎨\n`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(mediaUrl)}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mediaUrl)}`,
      "_blank"
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
