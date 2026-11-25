import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  X, 
  Save, 
  Sparkles, 
  Eye, 
  Columns, 
  Edit3, 
  Image as ImageIcon, 
  Tag, 
  User, 
  Calendar, 
  Link as LinkIcon, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Quote, 
  Code, 
  List, 
  Check, 
  Lock, 
  Unlock,
  AlertCircle,
  History,
  RotateCcw,
  Clock,
  Film,
  Table,
  Minus,
  CheckSquare,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { generateSlug, calculateReadTime } from '../../services/blogAdminService';
import MediaLibraryTab from './MediaLibraryTab';

const AUTOSAVE_STORAGE_KEY = 'blog_post_editor_autosave';

export default function PostEditorModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialPost = null, 
  categories = [] 
}) {
  const isEditing = Boolean(initialPost?.id);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [category, setCategory] = useState('Teknologi');
  const [status, setStatus] = useState('published'); // 'published' | 'draft' | 'scheduled'
  const [scheduledAt, setScheduledAt] = useState('');
  const [featured, setFeatured] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [imageFull, setImageFull] = useState('');
  const [coverVideo, setCoverVideo] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState('M. Syaiful Mukmin');
  const [authorAvatar, setAuthorAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [readingLevel, setReadingLevel] = useState('mudah');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Revisions history
  const [revisions, setRevisions] = useState([]);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  // Media picker modal state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState('cover'); // 'cover' | 'insert'

  // Editor View Mode: 'write' | 'preview' | 'split'
  const [viewMode, setViewMode] = useState('split');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Autosave states
  const [lastAutosaved, setLastAutosaved] = useState(null);
  const [hasAutosaveAvailable, setHasAutosaveAvailable] = useState(false);
  const autosaveTimerRef = useRef(null);
  const handleSubmitRef = useRef(null);

  // Inisialisasi data form saat modal dibuka
  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || '');
      setSlug(initialPost.slug || '');
      setAutoSlug(false);
      setCategory(initialPost.category || 'Teknologi');
      setStatus(initialPost.status || 'published');
      setScheduledAt(initialPost.scheduledAt ? initialPost.scheduledAt.slice(0, 16) : (initialPost.date ? `${initialPost.date}T09:00` : ''));
      setFeatured(Boolean(initialPost.featured));
      setExcerpt(initialPost.excerpt || '');
      setContent(initialPost.content || '');
      setThumbnail(initialPost.thumbnail || '');
      setImageFull(initialPost.imageFull || initialPost.thumbnail || '');
      setCoverVideo(initialPost.coverVideo || initialPost.cover_video || '');
      setGalleryInput(Array.isArray(initialPost.gallery) ? initialPost.gallery.join(', ') : (initialPost.gallery || ''));
      setTags(Array.isArray(initialPost.tags) ? initialPost.tags : []);
      setAuthor(initialPost.author || 'M. Syaiful Mukmin');
      setAuthorAvatar(initialPost.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
      setReadingLevel(initialPost.readingLevel || 'mudah');
      setMetaTitle(initialPost.metaTitle || initialPost.title || '');
      setMetaDescription(initialPost.metaDescription || initialPost.excerpt || '');
      setRevisions(Array.isArray(initialPost.revisions) ? initialPost.revisions : []);
      setHasAutosaveAvailable(false);
    } else {
      // Form baru: periksa apakah ada autosave dari sesi sebelumnya
      try {
        const raw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.title || parsed.content)) {
            setHasAutosaveAvailable(true);
          }
        }
      } catch {
        // ignore
      }

      setTitle('');
      setSlug('');
      setAutoSlug(true);
      setCategory(categories[0]?.name || 'Teknologi');
      setStatus('published');
      setScheduledAt('');
      setFeatured(false);
      setExcerpt('');
      setContent('');
      setThumbnail('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80');
      setImageFull('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80');
      setCoverVideo('');
      setGalleryInput('');
      setTags(['blog', 'artikel']);
      setAuthor('M. Syaiful Mukmin');
      setAuthorAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
      setReadingLevel('mudah');
      setMetaTitle('');
      setMetaDescription('');
      setRevisions([]);
    }
    setFormError(null);
    setShowRevisionModal(false);
    setShowMediaPicker(false);
  }, [initialPost, isOpen, categories]);

  // Handle Autosave interval
  useEffect(() => {
    if (!isOpen) return;

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      if (title.trim() || content.trim()) {
        const draftSnapshot = {
          title,
          slug,
          category,
          status,
          excerpt,
          content,
          thumbnail,
          tags,
          metaTitle,
          metaDescription,
          savedAt: new Date().toISOString()
        };
        try {
          localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(draftSnapshot));
          setLastAutosaved(new Date().toLocaleTimeString('id-ID'));
        } catch {
          // ignore
        }
      }
    }, 4000);

    return () => clearTimeout(autosaveTimerRef.current);
  }, [title, slug, content, excerpt, category, status, thumbnail, tags, metaTitle, metaDescription, isOpen]);

  // Restore autosaved draft
  const handleRestoreAutosave = () => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.title) setTitle(draft.title);
        if (draft.slug) setSlug(draft.slug);
        if (draft.content) setContent(draft.content);
        if (draft.excerpt) setExcerpt(draft.excerpt);
        if (draft.category) setCategory(draft.category);
        if (draft.thumbnail) setThumbnail(draft.thumbnail);
        if (Array.isArray(draft.tags)) setTags(draft.tags);
        if (draft.metaTitle) setMetaTitle(draft.metaTitle);
        if (draft.metaDescription) setMetaDescription(draft.metaDescription);
        setHasAutosaveAvailable(false);
        setNotification('Draf autosave berhasil dipulihkan!');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      // ignore
    }
  };

  const handleDiscardAutosave = () => {
    localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    setHasAutosaveAvailable(false);
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmitRef.current?.(null, status);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, status]);

  // Otomatis sinkronkan slug dengan judul jika autoSlug aktif
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  // Tag handler
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Toolbar formatting markdown insertion
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('post-markdown-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'teks';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  // Callback saat media dipilih dari MediaLibraryTab
  const handleMediaPicked = (mediaItem) => {
    if (mediaPickerTarget === 'cover') {
      setThumbnail(mediaItem.url);
      setImageFull(mediaItem.url);
      setNotification(`Cover artikel diatur ke: ${mediaItem.title}`);
    } else if (mediaPickerTarget === 'insert') {
      const isVid = mediaItem.type === 'video' || mediaItem.type === 'short';
      const markdownCode = isVid 
        ? `\n\n<video controls src="${mediaItem.url}" poster="${mediaItem.thumbnail}" style="width: 100%; border-radius: 16px; margin: 16px 0;"></video>\n\n`
        : `\n\n![${mediaItem.title}](${mediaItem.url})\n*${mediaItem.description || mediaItem.title}*\n\n`;

      setContent(prev => prev + markdownCode);
      setNotification(`Media "${mediaItem.title}" berhasil disisipkan ke editor markdown!`);
    }
    setShowMediaPicker(false);
    setTimeout(() => setNotification(null), 3500);
  };

  // Pulihkan versi sebelumnya (Restore revision)
  const handleRestoreRevision = (rev) => {
    setTitle(rev.title || title);
    setContent(rev.content || content);
    if (rev.excerpt) setExcerpt(rev.excerpt);
    setShowRevisionModal(false);
    setNotification(`Versi (${new Date(rev.savedAt).toLocaleTimeString('id-ID')}) berhasil dipulihkan ke editor!`);
    setTimeout(() => setNotification(null), 3500);
  };

  // SEO Score live evaluation
  const seoAudit = (() => {
    let score = 0;
    const titleLen = title.trim().length;
    const metaLen = (metaDescription || excerpt).trim().length;
    const wordsCount = content.trim().split(/\s+/).filter(Boolean).length;

    // 1. Title (30-65 chars)
    if (titleLen >= 30 && titleLen <= 65) score += 25;
    else if (titleLen > 10) score += 15;

    // 2. Meta description (80-160 chars)
    if (metaLen >= 80 && metaLen <= 160) score += 25;
    else if (metaLen > 30) score += 15;

    // 3. Cover image
    if (thumbnail && thumbnail.startsWith('http')) score += 20;

    // 4. Tags >= 2
    if (tags.length >= 2) score += 15;

    // 5. Length >= 300 words
    if (wordsCount >= 300) score += 15;
    else if (wordsCount >= 100) score += 8;

    return {
      score: Math.min(100, score),
      titleLen,
      metaLen,
      wordsCount
    };
  })();

  // Submit Handler
  const handleSubmit = async (e, forcedStatus = null) => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Judul artikel wajib diisi.');
      return;
    }
    if (!slug.trim()) {
      setFormError('Slug URL wajib diisi.');
      return;
    }
    if (!content.trim()) {
      setFormError('Konten artikel wajib diisi.');
      return;
    }

    const finalStatus = forcedStatus || status;

    if (finalStatus === 'scheduled' && !scheduledAt) {
      setFormError('Pilih tanggal dan jam penerbitan otomatis untuk artikel terjadwal.');
      return;
    }

    setIsSubmitting(true);

    const postPayload = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      status: finalStatus,
      scheduledAt: finalStatus === 'scheduled' ? scheduledAt : null,
      featured,
      excerpt: excerpt.trim() || title.trim(),
      content,
      thumbnail: thumbnail.trim(),
      imageFull: (imageFull.trim() || thumbnail.trim()),
      coverVideo: coverVideo.trim(),
      gallery: galleryInput ? galleryInput.split(',').map(s => s.trim()).filter(Boolean) : [],
      tags,
      author: author.trim(),
      authorAvatar: authorAvatar.trim(),
      readingLevel,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim()
    };

    try {
      await onSave(postPayload, initialPost?.id);
      // Bersihkan autosave jika berhasil
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
      onClose();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan artikel.');
    } finally {
      setIsSubmitting(false);
    }
  };
  handleSubmitRef.current = handleSubmit;

  if (!isOpen) return null;

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readTimeEstimate = calculateReadTime(content);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden relative">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {isEditing ? 'Perbarui Artikel Blog' : 'Tulis Artikel Blog Baru'}
                {status === 'scheduled' && (
                  <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Jadwal Rilis
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                <span>{isEditing ? `/blog/${slug}` : 'Editor Markdown & SEO Cerdas'}</span>
                {lastAutosaved && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-mono text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Autosave {lastAutosaved}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Riwayat Versi */}
            {revisions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowRevisionModal(true)}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Buka Riwayat Versi Tulisan"
              >
                <History className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Revisi ({revisions.length})</span>
              </button>
            )}

            <button
              onClick={() => handleSubmit(null, 'draft')}
              disabled={isSubmitting}
              className="hidden sm:inline-flex py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Simpan Draf
            </button>

            <button
              onClick={() => handleSubmit(null, status)}
              disabled={isSubmitting}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Shortcut: Ctrl+S"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {isSubmitting 
                  ? 'Menyimpan...' 
                  : (status === 'scheduled' ? 'Jadwalkan Rilis' : 'Terbitkan Sekarang')}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Tutup Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prompt Pulihkan Autosave jika ditemukan */}
        {hasAutosaveAvailable && !isEditing && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Ditemukan draf otomatis yang tersimpan dari sesi sebelumnya. Ingin memulihkannya?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRestoreAutosave}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 cursor-pointer"
              >
                Pulihkan
              </button>
              <button
                type="button"
                onClick={handleDiscardAutosave}
                className="px-2.5 py-1 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 cursor-pointer"
              >
                Abaikan
              </button>
            </div>
          </div>
        )}

        {/* Notifikasi Pop-up Kecil */}
        {notification && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Bagian Atas: Judul, Slug, Kategori, Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Judul Artikel <span className="text-red-400">*</span></span>
                  <span className={`text-[10px] font-mono ${title.length > 65 ? 'text-amber-400' : 'text-gray-500'}`}>
                    {title.length} / 65 karakter (SEO)
                  </span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Contoh: Tips Membangun Arsitektur Web Modern..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                  required
                />
              </div>

              {/* Slug URL Generator */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>URL Slug <span className="text-red-400">*</span></span>
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {autoSlug ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{autoSlug ? 'Auto-Generate Aktif' : 'Manual Edit'}</span>
                  </button>
                </label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-white/10 overflow-hidden text-sm">
                  <span className="px-3 text-xs text-gray-500 font-mono bg-white/[0.02] border-r border-white/10 select-none">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(generateSlug(e.target.value));
                      setAutoSlug(false);
                    }}
                    placeholder="slug-artikel-anda"
                    className="flex-1 px-3 py-2 bg-transparent text-cyan-300 font-mono text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Excerpt / Ringkasan Singkat */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Ringkasan Singkat (Excerpt)</span>
                  <span className="text-[10px] font-mono text-gray-500">{excerpt.length} karakter</span>
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Tulis ringkasan 1-2 kalimat pengantar menarik tentang isi artikel ini..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 resize-none"
                />
              </div>
            </div>

            {/* Kolom Kanan: Status Rilis & Penjadwalan & SEO Meter */}
            <div className="space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Kategori Artikel
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  {categories.map((c, i) => (
                    <option key={i} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Status Rilis: Terbit, Jadwalkan, Draf */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Status Penerbitan & Jadwal
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-all cursor-pointer ${
                      status === 'published' 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' 
                        : 'bg-slate-950 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Terbit
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('scheduled')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-all cursor-pointer ${
                      status === 'scheduled' 
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 font-bold' 
                        : 'bg-slate-950 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Jadwalkan
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-all cursor-pointer ${
                      status === 'draft' 
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold' 
                        : 'bg-slate-950 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Draf
                  </button>
                </div>
              </div>

              {/* Form Input Tanggal & Jam Terjadwal */}
              {status === 'scheduled' && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                  <label className="block text-[11px] font-medium text-blue-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Waktu Otomatis Terbit</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-blue-400/30 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
                    required
                  />
                  <p className="text-[10px] text-gray-400">
                    Sistem akan mempublikasikan artikel secara otomatis saat jam tersebut tiba.
                  </p>
                </div>
              )}

              {/* Live SEO Score Gauge Meter */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Skor Kesiapan SEO
                  </span>
                  <span className={`font-mono font-bold ${
                    seoAudit.score >= 80 ? 'text-emerald-400' : (seoAudit.score >= 50 ? 'text-amber-400' : 'text-red-400')
                  }`}>
                    {seoAudit.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      seoAudit.score >= 80 ? 'bg-emerald-400' : (seoAudit.score >= 50 ? 'bg-amber-400' : 'bg-red-400')
                    }`}
                    style={{ width: `${seoAudit.score}%` }}
                  />
                </div>
              </div>

              {/* Cover Thumbnail Image Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    Cover / Thumbnail
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget('cover');
                      setShowMediaPicker(true);
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Galeri / Unsplash</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  {thumbnail && (
                    <button
                      type="button"
                      onClick={() => setThumbnail('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400"
                      title="Hapus Cover"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {thumbnail && (
                  <div className="mt-2 h-24 w-full rounded-xl overflow-hidden border border-white/10 relative group">
                    <img src={thumbnail} alt="Preview Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerTarget('cover');
                        setShowMediaPicker(true);
                      }}
                      className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white font-medium gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Ganti dari Galeri
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded bg-slate-950 border-white/20 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-xs font-medium text-gray-200">Tandai Artikel Unggulan (Featured)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tagar (Tags) Chips Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
              <span>Tagar / Topik (Tekan Enter atau Koma untuk menambahkan)</span>
              <span className="text-[10px] text-gray-500 font-mono">{tags.length} tagar aktif</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-950 border border-white/10 min-h-[42px]">
              {tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono"
                >
                  #{tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400 transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "Ketik tag lalu tekan enter (cth: react, coding)" : "Tambah lagi..."}
                className="flex-1 min-w-[120px] bg-transparent text-white text-xs px-2 py-1 focus:outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* ✍️ Editor Konten Utama (Markdown) */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-white/10">
              <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Tebal (Bold) - Ctrl+B"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Miring (Italic) - Ctrl+I"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('## ')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Heading 2"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('### ')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Heading 3"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Kutipan (Blockquote)"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('```javascript\n', '\n```')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Daftar Bullet"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- [ ] ')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Task Checklist"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('| Kolom 1 | Kolom 2 |\n|---|---|\n| Data 1 | Data 2 |\n')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Sisipkan Tabel"
                >
                  <Table className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n---\n')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Garis Pembatas (Divider)"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('[Teks Tautan](', ')')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="Sisipkan Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>

                {/* Tombol Sisipkan Media dari Galeri/Unsplash */}
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('insert');
                    setShowMediaPicker(true);
                  }}
                  className="p-1.5 px-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 text-xs cursor-pointer ml-1"
                  title="Sisipkan Foto/Video dari Galeri atau Unsplash"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>+Media</span>
                </button>
              </div>

              {/* View Mode Toggle: Write / Preview / Split */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('write')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'write' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Tulis
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'preview' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Pratinjau
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`hidden sm:inline-flex px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Split
                </button>
              </div>
            </div>

            {/* Editor Textarea vs Markdown Preview */}
            <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              
              {/* Write Mode Input */}
              {(viewMode === 'write' || viewMode === 'split') && (
                <div className="flex flex-col">
                  <textarea
                    id="post-markdown-editor"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Mulai menulis konten artikel Anda dengan format Markdown lengkap..."
                    rows={16}
                    className="w-full h-96 p-4 rounded-2xl bg-slate-950 border border-white/10 text-gray-200 text-sm font-mono leading-relaxed focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 resize-y"
                    required
                  />
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 px-1">
                    <span>Markdown (GFM) Didukung</span>
                    <span className="font-mono text-cyan-400">{words} kata • {content.length} karakter • {readTimeEstimate}</span>
                  </div>
                </div>
              )}

              {/* Preview Mode Display */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className="h-96 p-5 rounded-2xl bg-slate-950/70 border border-white/10 overflow-y-auto prose prose-invert prose-cyan max-w-none text-xs sm:text-sm">
                  {content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-xs italic">
                      Ketik konten di sebelah kiri untuk melihat pratinjau langsung di sini...
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Bagian Metadata SEO Tambahan */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Optimalisasi SEO & Metadata Mesin Pencari
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1 flex items-center justify-between">
                  <span>Meta Title (Judul Tab & Google)</span>
                  <span className="font-mono text-[10px] text-gray-500">{(metaTitle || title).length} karkater</span>
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || "Judul SEO untuk Google"}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1 flex items-center justify-between">
                  <span>Meta Description (Snippet Pratinjau)</span>
                  <span className="font-mono text-[10px] text-gray-500">{(metaDescription || excerpt).length} karakter</span>
                </label>
                <input
                  type="text"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || "Deskripsi SEO untuk Google/Twitter/WhatsApp"}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Status: <strong className={status === 'published' ? 'text-emerald-400' : (status === 'scheduled' ? 'text-blue-400' : 'text-amber-400')}>{status.toUpperCase()}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-gray-400 hover:text-white text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(null, status)}
              disabled={isSubmitting}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Menyimpan...' : (status === 'scheduled' ? 'Jadwalkan Rilis' : 'Simpan Perubahan')}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 📜 Drawer/Modal Riwayat Revisi (Version History) */}
      {showRevisionModal && (
        <div 
          onClick={() => setShowRevisionModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Riwayat Versi Artikel ({revisions.length})</h3>
              </div>
              <button onClick={() => setShowRevisionModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Setiap kali Anda menyimpan tulisan, salinan revisi otomatis disimpan. Anda dapat memulihkan (*restore*) tulisan dari snapshot terdahulu.
            </p>

            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {revisions.map((rev, idx) => (
                <div 
                  key={rev.id || idx}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] text-cyan-400 font-mono block">
                      {new Date(rev.savedAt).toLocaleString('id-ID')}
                    </span>
                    <h5 className="text-xs font-semibold text-white truncate mt-0.5">
                      {rev.title || 'Tanpa Judul'}
                    </h5>
                    <p className="text-[11px] text-gray-400 line-clamp-1 italic mt-0.5">
                      {rev.summary || 'Snapshot perubahan'} • {rev.wordCount || 0} kata
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestoreRevision(rev)}
                    className="py-1.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Pulihkan</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ Modal Media Picker (Galeri & Unsplash) */}
      {showMediaPicker && (
        <div 
          onClick={() => setShowMediaPicker(false)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Pilih Media ({mediaPickerTarget === 'cover' ? 'Untuk Cover Artikel' : 'Untuk Disisipkan ke Markdown'})</span>
                </h3>
                <p className="text-[11px] text-gray-400">
                  Terintegrasi dengan Photography, Galeri Kenangan, Video, Shorts, dan Unsplash
                </p>
              </div>
              <button onClick={() => setShowMediaPicker(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <MediaLibraryTab 
                onSelectMedia={handleMediaPicked}
                isPickerModal={true}
                onCloseModal={() => setShowMediaPicker(false)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}