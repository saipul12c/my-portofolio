import React, { useState, useEffect, useMemo } from 'react';
import { 
  Image as ImageIcon, 
  Camera, 
  Film, 
  Smartphone, 
  Search, 
  Upload, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Maximize2, 
  X, 
  Trash2,
  FileText,
  Sliders,
  Download,
  CheckCircle2
} from 'lucide-react';

import { 
  getPhotographyMedia, 
  getGalleryImages, 
  getGalleryVideos, 
  getGalleryShorts, 
  getCustomUploadedMedia, 
  saveCustomUpload, 
  deleteCustomUpload, 
  searchUnsplashPhotos, 
  compressImageFile,
  UNSPLASH_PRESETS
} from '../../services/blogMediaService';

export default function MediaLibraryTab({ 
  onSelectMedia = null, // Callback jika digunakan sebagai picker modal
  isPickerModal = false,
  onCloseModal = null
}) {
  // Active Source: 'photos' | 'gallery' | 'videos' | 'shorts' | 'unsplash' | 'uploads'
  const [activeSource, setActiveSource] = useState('photos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data lists
  const [photographyList, setPhotographyList] = useState([]);
  const [galleryImagesList, setGalleryImagesList] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [shortsList, setShortsList] = useState([]);
  const [customUploads, setCustomUploads] = useState([]);
  const [unsplashPhotos, setUnsplashPhotos] = useState([]);

  // Unsplash search state
  const [unsplashQuery, setUnsplashQuery] = useState('coding');
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);

  // Upload & Compress state
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState(null);

  // Lightbox preview state
  const [previewMedia, setPreviewMedia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Load all local data on mount
  useEffect(() => {
    setPhotographyList(getPhotographyMedia());
    setGalleryImagesList(getGalleryImages());
    setVideosList(getGalleryVideos());
    setShortsList(getGalleryShorts());
    setCustomUploads(getCustomUploadedMedia());

    // Inisialisasi foto Unsplash
    handleSearchUnsplash('coding');
  }, []);

  const handleSearchUnsplash = async (q) => {
    setIsSearchingUnsplash(true);
    try {
      const results = await searchUnsplashPhotos(q || 'technology');
      setUnsplashPhotos(results);
    } catch {
      // fallback
    } finally {
      setIsSearchingUnsplash(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setCompressionResult(null);

    try {
      const result = await compressImageFile(file, { maxWidth: 1400, quality: 0.82 });
      setCompressionResult(result);

      // Simpan ke custom uploads list
      const newItem = {
        id: 'upload_' + Date.now(),
        type: 'upload',
        title: result.originalName,
        url: result.dataUrl,
        thumbnail: result.dataUrl,
        category: 'Unggahan Lokal',
        source: 'Upload & Compress',
        date: new Date().toISOString().split('T')[0],
        originalSize: (result.originalSize / 1024).toFixed(1) + ' KB',
        compressedSize: (result.compressedSize / 1024).toFixed(1) + ' KB',
        savings: result.savingsPercent + '%'
      };

      saveCustomUpload(newItem);
      setCustomUploads(getCustomUploadedMedia());
    } catch (err) {
      alert(err.message || 'Gagal mengompresi gambar');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleDeleteUpload = (id) => {
    deleteCustomUpload(id);
    setCustomUploads(getCustomUploadedMedia());
  };

  // Salin teks ke clipboard
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter items berdasarkan activeSource dan searchTerm
  const currentList = useMemo(() => {
    let base = [];
    switch (activeSource) {
      case 'photos': base = photographyList; break;
      case 'gallery': base = galleryImagesList; break;
      case 'videos': base = videosList; break;
      case 'shorts': base = shortsList; break;
      case 'unsplash': base = unsplashPhotos; break;
      case 'uploads': base = customUploads; break;
      default: base = photographyList;
    }

    if (!searchTerm.trim()) return base;
    const q = searchTerm.toLowerCase();
    return base.filter(item => 
      item.title?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [activeSource, photographyList, galleryImagesList, videosList, shortsList, unsplashPhotos, customUploads, searchTerm]);

  return (
    <div className={`space-y-6 ${isPickerModal ? 'p-1' : ''}`}>
      
      {/* 🧭 Source Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-slate-900/80 border border-white/10">
        
        {/* Pills Navigasi Sumber Media */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveSource('photos')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeSource === 'photos'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Fotografi ({photographyList.length})</span>
          </button>

          <button
            onClick={() => setActiveSource('gallery')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeSource === 'gallery'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galeri ({galleryImagesList.length})</span>
          </button>

          <button
            onClick={() => setActiveSource('videos')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeSource === 'videos'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video ({videosList.length})</span>
          </button>

          <button
            onClick={() => setActiveSource('shorts')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeSource === 'shorts'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Shorts ({shortsList.length})</span>
          </button>

          <button
            onClick={() => setActiveSource('unsplash')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeSource === 'unsplash'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unsplash Stock</span>
          </button>

          <button
            onClick={() => setActiveSource('uploads')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeSource === 'uploads'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload ({customUploads.length})</span>
          </button>
        </div>

        {/* Input Pencarian Media */}
        <div className="relative min-w-[200px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari media..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* 🌐 Sub-header Khusus Unsplash */}
      {activeSource === 'unsplash' && (
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Pencarian Foto Bebas Royalti Unsplash
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Pilih langsung foto resolusi tinggi untuk dijadikan cover atau ilustrasi artikel Anda
              </p>
            </div>

            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearchUnsplash(unsplashQuery); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={unsplashQuery}
                onChange={(e) => setUnsplashQuery(e.target.value)}
                placeholder="Kata kunci (misal: react, ai, coffee)..."
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={isSearchingUnsplash}
                className="py-1.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                {isSearchingUnsplash ? 'Mencari...' : 'Cari'}
              </button>
            </form>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {UNSPLASH_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setUnsplashQuery(p.keyword); handleSearchUnsplash(p.keyword); }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-[11px] text-gray-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                #{p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 📤 Sub-header Khusus Upload & Kompresi */}
      {activeSource === 'uploads' && (
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Kompresor Gambar Cerdas (Client-Side Optimizer)
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Unggah gambar lokal apa saja; sistem otomatis mengompresi ke format WebP ringan agar blog memuat super cepat.
              </p>
            </div>

            <label className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all shrink-0">
              <Upload className="w-4 h-4" />
              <span>{isCompressing ? 'Mengompresi Gambar...' : 'Pilih File Gambar'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isCompressing}
                className="hidden"
              />
            </label>
          </div>

          {/* Banner Hasil Kompresi */}
          {compressionResult && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-emerald-300 block">{compressionResult.originalName} berhasil dioptimasi!</strong>
                  <span className="text-gray-300">
                    Ukuran asli: { (compressionResult.originalSize / 1024).toFixed(1) } KB → Terkompresi: { (compressionResult.compressedSize / 1024).toFixed(1) } KB
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                Hemat {compressionResult.savingsPercent}%!
              </span>
            </div>
          )}
        </div>
      )}

      {/* 🖼️ Grid Media Galeri Terpadu */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {currentList.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-500 text-xs">
            Tidak ada media yang ditemukan pada kategori ini.
          </div>
        ) : (
          currentList.map((item) => {
            const isVideo = item.type === 'video' || item.type === 'short';
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-slate-900 border border-white/5 hover:border-cyan-500/40 overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-cyan-950/40"
              >
                {/* Media Preview Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Badge Tipe / Durasi */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    {isVideo && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-mono text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                        {item.type === 'short' ? <Smartphone className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                        {item.duration || 'Video'}
                      </span>
                    )}
                  </div>

                  {/* Overlay Tombol Aksi saat Hover */}
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    {/* Tombol Pilih (Jika Mode Picker) */}
                    {onSelectMedia && (
                      <button
                        onClick={() => {
                          onSelectMedia(item);
                          if (onCloseModal) onCloseModal();
                        }}
                        className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs shadow-lg"
                        title="Pilih Media Ini"
                      >
                        Pilih
                      </button>
                    )}

                    {/* Tombol Pratinjau Modal */}
                    <button
                      onClick={() => setPreviewMedia(item)}
                      className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                      title="Lihat Pratinjau"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Tombol Salin URL */}
                    <button
                      onClick={() => handleCopy(item.url, item.id)}
                      className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                      title="Salin URL"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {item.type === 'upload' && (
                      <button
                        onClick={() => handleDeleteUpload(item.id)}
                        className="p-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Info Singkat Media */}
                <div className="p-2.5 space-y-1">
                  <h4 className="text-[11px] font-semibold text-white truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span className="truncate">{item.category || item.source}</span>
                    {onSelectMedia && (
                      <button
                        onClick={() => {
                          onSelectMedia(item);
                          if (onCloseModal) onCloseModal();
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-sans font-medium"
                      >
                        Pilih →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🔍 Modal Pratinjau Resolusi Penuh */}
      {previewMedia && (
        <div 
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header Modal */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-sm font-bold text-white">{previewMedia.title}</h3>
                <p className="text-[11px] text-gray-400">{previewMedia.source} • {previewMedia.category}</p>
              </div>
              <button 
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Body */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-slate-950">
              {previewMedia.type === 'video' || previewMedia.type === 'short' ? (
                <video 
                  src={previewMedia.url} 
                  controls 
                  autoPlay 
                  className={`rounded-2xl max-h-[60vh] ${previewMedia.type === 'short' ? 'max-w-xs' : 'w-full'}`}
                />
              ) : (
                <img 
                  src={previewMedia.url} 
                  alt={previewMedia.title} 
                  className="rounded-2xl max-h-[60vh] object-contain w-auto mx-auto"
                />
              )}
            </div>

            {/* Footer Aksi */}
            <div className="p-4 border-t border-white/10 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-mono text-gray-400 text-[11px] truncate max-w-md">
                {previewMedia.url}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(`![${previewMedia.title}](${previewMedia.url})`, 'md')}
                  className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Salin Markdown</span>
                </button>

                <button
                  onClick={() => handleCopy(previewMedia.url, 'url')}
                  className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin URL</span>
                </button>

                {onSelectMedia && (
                  <button
                    onClick={() => {
                      onSelectMedia(previewMedia);
                      setPreviewMedia(null);
                      if (onCloseModal) onCloseModal();
                    }}
                    className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-md cursor-pointer"
                  >
                    Jadikan Cover / Sisipkan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
