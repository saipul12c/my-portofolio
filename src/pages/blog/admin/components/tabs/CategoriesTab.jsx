import React, { useState } from 'react';
import { 
  FolderTree, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Tag, 
  Folder,
  Layers
} from 'lucide-react';

export default function CategoriesTab({ 
  categories = [], 
  posts = [], 
  onSaveCategories 
}) {
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#06b6d4');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#06b6d4');

  // Hitung jumlah post per kategori
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    count: posts.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length
  }));

  // Ekstrak seluruh tag unik beserta jumlahnya
  const tagFrequency = {};
  posts.forEach(p => {
    if (Array.isArray(p.tags)) {
      p.tags.forEach(t => {
        const clean = t.trim().toLowerCase();
        if (clean) tagFrequency[clean] = (tagFrequency[clean] || 0) + 1;
      });
    }
  });

  const sortedTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCategory = {
      id: 'cat_' + Date.now(),
      name: newCatName.trim(),
      color: newCatColor || '#06b6d4',
      description: newCatDesc.trim() || 'Koleksi artikel terkait topik ini'
    };

    onSaveCategories([...categories, newCategory]);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleDeleteCategory = (catId) => {
    const filtered = categories.filter(c => c.id !== catId);
    onSaveCategories(filtered);
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color || '#06b6d4');
  };

  const handleSaveEdit = (catId) => {
    const updated = categories.map(c => 
      c.id === catId ? { ...c, name: editName.trim() || c.name, color: editColor } : c
    );
    onSaveCategories(updated);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form Tambah Kategori */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tambah Kategori Baru</h3>
              <p className="text-[11px] text-gray-400">Kelompokkan artikel blog ke dalam tema terstruktur</p>
            </div>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Nama Kategori</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Contoh: AI & Robotika"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Warna Aksen Tema</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-10 h-9 rounded-xl bg-slate-950 border border-white/10 p-1 cursor-pointer"
                />
                <input
                  type="text"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Deskripsi Singkat</label>
              <textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Penjelasan singkat mengenai isi kategori ini..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              + Simpan Kategori
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Daftar Kategori Aktif */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              Daftar Kategori Aktif ({categories.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoriesWithCount.map((cat) => {
              const isEditing = editingId === cat.id;

              return (
                <div 
                  key={cat.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between space-y-2 group"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value)}
                          className="w-8 h-8 rounded-lg bg-slate-950 border border-white/10 p-0.5 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 rounded bg-white/10 text-gray-300 hover:bg-white/20"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: cat.color || '#06b6d4' }}
                          />
                          <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {cat.name}
                          </h4>
                        </div>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                          {cat.count} artikel
                        </span>
                      </div>

                      {cat.description && (
                        <p className="text-[11px] text-gray-400 line-clamp-1 italic">
                          {cat.description}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-1 pt-1 border-t border-white/5">
                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="p-1 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                          title="Edit Kategori"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 🏷️ Ringkasan Tagar Populer */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-cyan-400" />
          Koleksi Tagar & Label Aktif ({sortedTags.length})
        </h3>
        <p className="text-xs text-gray-400">Tagar yang otomatis terindeks dari seluruh artikel yang ada di blog.</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {sortedTags.map(([tag, count], i) => (
            <span 
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 text-xs text-gray-300 hover:text-cyan-300 font-mono transition-all"
            >
              #{tag}
              <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-400">
                {count}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
