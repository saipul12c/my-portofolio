import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  CheckCircle2, 
  ExternalLink, 
  Save, 
  Plus, 
  MapPin, 
  Briefcase, 
  Globe, 
  Linkedin, 
  Github, 
  Instagram, 
  Twitter, 
  Mail, 
  Sparkles,
  BookOpen,
  Eye,
  Heart,
  Star,
  Award
} from 'lucide-react';
import { 
  getAuthorProfiles, 
  saveAuthorProfile 
} from '../../../services/authorProfileService';

export default function AuthorsTab({ posts = [], setToast }) {
  const [profiles, setProfiles] = useState({});
  const [selectedSlug, setSelectedSlug] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(true);
  
  // Social links
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');

  // 1. Ekstrak seluruh penulis unik dari artikel + profil tersimpan
  const authorList = useMemo(() => {
    const list = {};

    // Ambil dari profil tersimpan
    Object.values(profiles).forEach(p => {
      list[p.slug] = {
        slug: p.slug,
        name: p.name,
        avatar: p.avatar,
        postCount: 0,
        views: 0,
        likes: 0,
        isCustom: true
      };
    });

    // Kumpulkan statistik dari artikel yang ada
    if (Array.isArray(posts)) {
      posts.forEach(post => {
        if (!post.author) return;
        const slug = post.author.toLowerCase().trim().replace(/\s+/g, '-');
        if (!list[slug]) {
          list[slug] = {
            slug,
            name: post.author,
            avatar: post.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${slug}`,
            postCount: 0,
            views: 0,
            likes: 0,
            isCustom: false
          };
        }
        list[slug].postCount += 1;
        list[slug].views += (post.views || 0);
        list[slug].likes += (post.likes || 0);
      });
    }

    return Object.values(list);
  }, [profiles, posts]);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const data = getAuthorProfiles();
    setProfiles(data);
    
    // Pilih penulis pertama jika belum ada yang terpilih
    const keys = Object.keys(data);
    if (keys.length > 0 && !selectedSlug) {
      handleSelectAuthor(keys[0], data);
    }
  };

  const handleSelectAuthor = (slug, dataMap = profiles) => {
    setSelectedSlug(slug);
    const author = dataMap[slug];

    if (author) {
      setName(author.name || '');
      setAvatar(author.avatar || '');
      setBio(author.bio || '');
      setExpertise(author.expertise || '');
      setLocation(author.location || '');
      setCompany(author.company || '');
      setEmail(author.email || '');
      setVerified(author.verified !== false);
      
      const socials = author.socialLinks || {};
      setLinkedin(socials.linkedin || '');
      setGithub(socials.github || '');
      setInstagram(socials.instagram || '');
      setTwitter(socials.twitter || '');
      setWebsite(socials.website || '');
    } else {
      // Jika penulis dari artikel belum punya profil tersimpan, generate default
      const foundInList = authorList.find(a => a.slug === slug);
      const authorName = foundInList ? foundInList.name : slug.replace(/-/g, ' ');
      
      setName(authorName);
      setAvatar(foundInList?.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`);
      setBio(`Penulis dan kontributor artikel blog seputar teknologi, web development, dan pengalaman digital.`);
      setExpertise('Teknologi & Desain');
      setLocation('Indonesia');
      setCompany('Penulis Blog');
      setEmail('');
      setVerified(true);
      setLinkedin(`https://linkedin.com/in/${slug}`);
      setGithub(`https://github.com/${slug}`);
      setInstagram(`https://instagram.com/${slug}`);
      setTwitter(`https://twitter.com/${slug}`);
      setWebsite(`https://${slug}.com`);
    }
  };

  const handleNewAuthor = () => {
    setSelectedSlug('new-author');
    setName('');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
    setBio('');
    setExpertise('General Topic');
    setLocation('Indonesia');
    setCompany('Kontributor Lepas');
    setEmail('');
    setVerified(true);
    setLinkedin('');
    setGithub('');
    setInstagram('');
    setTwitter('');
    setWebsite('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      if (typeof setToast === 'function') setToast('error', 'Nama Penulis tidak boleh kosong!');
      return;
    }

    const newProfile = {
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
      avatar: avatar.trim(),
      bio: bio.trim(),
      expertise: expertise.trim(),
      location: location.trim(),
      company: company.trim(),
      email: email.trim(),
      verified,
      socialLinks: {
        linkedin: linkedin.trim(),
        github: github.trim(),
        instagram: instagram.trim(),
        twitter: twitter.trim(),
        website: website.trim()
      }
    };

    const res = saveAuthorProfile(newProfile);
    if (res.success) {
      if (typeof setToast === 'function') {
        setToast('success', `Profil "${newProfile.name}" berhasil disimpan dan aktif di seluruh blog!`);
      }
      loadProfiles();
      setSelectedSlug(newProfile.slug);
    } else {
      if (typeof setToast === 'function') {
        setToast('error', res.message || 'Gagal menyimpan profil penulis');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 🌟 Header Tab */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <User className="w-6 h-6 text-cyan-400" />
            Manajemen Profil Penulis Blog
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Atur identitas, bio, foto avatar resmi, bidang keahlian, dan tautan sosial media untuk setiap penulis blog.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewAuthor}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Tambah Penulis Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 📋 Sidebar Daftar Penulis (Col 4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Daftar Penulis Terdaftar ({authorList.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {authorList.map((author) => {
              const isSelected = selectedSlug === author.slug;
              return (
                <div
                  key={author.slug}
                  onClick={() => handleSelectAuthor(author.slug)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-400/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-white/5 hover:border-white/20 hover:bg-slate-900'
                  }`}
                >
                  <img
                    src={author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${author.slug}`}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover border border-cyan-400/40 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">
                        {author.name}
                      </h4>
                      <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {author.postCount} artikel • {author.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✍️ Form Editor Profil Penulis (Col 8) */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Live Preview Card Mini */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/30 border border-cyan-500/20 flex flex-col sm:flex-row items-center gap-4">
              <img
                src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                alt="Preview Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-lg"
              />
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <h3 className="text-base font-bold text-white truncate">{name || "Nama Penulis"}</h3>
                  {verified && <CheckCircle2 size={15} className="text-green-400" />}
                </div>
                <p className="text-xs text-cyan-300 font-medium mt-0.5">{company || "Profesi / Role"} • {location || "Lokasi"}</p>
                <p className="text-xs text-gray-400 line-clamp-1 mt-1">{bio || "Biografi ringkas penulis..."}</p>
              </div>

              {selectedSlug && selectedSlug !== 'new-author' && (
                <a
                  href={`/blog/authors/${selectedSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0"
                >
                  <span>Lihat Publik</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Input Identitas Dasar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Nama Lengkap Penulis <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: M. Syaiful Mukmin"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  URL Foto Profil (Avatar)
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Bio Penulis */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Biografi Penulis Lengkap
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ceritakan latar belakang, fokus bidang, dan pengalaman penulis..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-400 transition leading-relaxed"
              />
            </div>

            {/* Keahlian, Lokasi & Perusahaan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-cyan-400" />
                  Bidang Keahlian
                </label>
                <input
                  type="text"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  placeholder="Contoh: Web Dev & AI"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-purple-400" />
                  Perusahaan / Profesi
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Contoh: Freelance Developer"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin size={13} className="text-rose-400" />
                  Domisili / Lokasi
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Banjarmasin, Indonesia"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Email Publik & Status Verifikasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail size={13} className="text-amber-400" />
                  Email Kontak Publik
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="penulis@domain.com"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-white/10 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-white block">Status Verifikasi</span>
                  <span className="text-[11px] text-gray-400">Tampilkan lencana centang hijau resmi</span>
                </div>
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* 🌐 Tautan Sosial Media Resmi */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Tautan Media Sosial Resmi
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-center gap-2.5 bg-slate-950 border border-white/10 rounded-xl px-3 py-2">
                  <Linkedin size={15} className="text-cyan-400 flex-shrink-0" />
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2.5 bg-slate-950 border border-white/10 rounded-xl px-3 py-2">
                  <Github size={15} className="text-gray-300 flex-shrink-0" />
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2.5 bg-slate-950 border border-white/10 rounded-xl px-3 py-2">
                  <Instagram size={15} className="text-pink-400 flex-shrink-0" />
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2.5 bg-slate-950 border border-white/10 rounded-xl px-3 py-2">
                  <Twitter size={15} className="text-blue-400 flex-shrink-0" />
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2.5 bg-slate-950 border border-white/10 rounded-xl px-3 py-2">
                  <Globe size={15} className="text-emerald-400 flex-shrink-0" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://website-pribadi.com"
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-102 cursor-pointer"
              >
                <Save size={16} />
                Simpan Profil Penulis
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
