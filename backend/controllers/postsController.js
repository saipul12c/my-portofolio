import { readData, writeData } from "../utils/fileHandler.js";

// Helper untuk format tanggal
const today = () => new Date().toISOString().split("T")[0];

// ========================================================
// 📘 GET - Ambil semua data
// ========================================================
export function getAllPosts(req, res) {
  const data = readData();
  res.json(data);
}

// ========================================================
// 📗 GET - Ambil berdasarkan ID
// ========================================================
export function getPostById(req, res) {
  const id = parseInt(req.params.id);
  const data = readData();
  const post = data.find(p => p.id === id);
  if (!post) return res.status(404).json({ message: "Data tidak ditemukan" });
  res.json(post);
}

// ========================================================
// 🆕 GET - Ambil berdasarkan SLUG
// ========================================================
export function getPostBySlug(req, res) {
  const data = readData();
  const post = data.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ message: "Slug tidak ditemukan" });
  res.json(post);
}

// ========================================================
// 🆕 GET - Berdasarkan kategori
// ========================================================
export function getPostsByCategory(req, res) {
  const category = req.params.category.toLowerCase();
  const data = readData();
  const filtered = data.filter(p => p.category?.toLowerCase() === category);
  res.json(filtered);
}

// ========================================================
// 🔍 Search
// ========================================================
export function searchPosts(req, res) {
  const query = req.query.q?.toLowerCase() || "";
  const data = readData();
  const results = data.filter(p =>
    p.title?.toLowerCase().includes(query) ||
    p.metaDescription?.toLowerCase().includes(query)
  );
  res.json(results);
}

// ========================================================
// 🟩 POST - Tambah data baru
// ========================================================
export function addPost(req, res) {
  const data = readData();
  const newPost = {
    id: Date.now(),
    ...req.body,
    date: req.body.date || today(),
    updatedAt: today()
  };
  data.push(newPost);
  writeData(data);
  res.status(201).json({ message: "✅ Data berhasil ditambahkan", data: newPost });
}

// ========================================================
// 🟨 PUT - Update post
// ========================================================
export function updatePost(req, res) {
  const id = parseInt(req.params.id);
  const data = readData();
  const index = data.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Data tidak ditemukan" });

  data[index] = { ...data[index], ...req.body, updatedAt: today() };
  writeData(data);
  res.json({ message: "✅ Data berhasil diperbarui", data: data[index] });
}

// ========================================================
// 🟥 DELETE - Hapus post by ID
// ========================================================
export function deletePost(req, res) {
  const id = parseInt(req.params.id);
  const data = readData();
  const filtered = data.filter(p => p.id !== id);
  if (filtered.length === data.length)
    return res.status(404).json({ message: "Data tidak ditemukan" });
  writeData(filtered);
  res.json({ message: "✅ Data berhasil dihapus" });
}

// ========================================================
// ⚠️ DELETE ALL - Hapus semua
// ========================================================
export function deleteAllPosts(req, res) {
  writeData([]);
  res.json({ message: "⚠️ Semua data berhasil dihapus" });
}

// ========================================================
// 📊 Statistik
// ========================================================
export function getStats(req, res) {
  const data = readData();
  const totalPosts = data.length;
  const totalViews = data.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = data.reduce((sum, p) => sum + (p.likes || 0), 0);
  const avgRating = (
    data.reduce((sum, p) => sum + (p.rating || 0), 0) / (totalPosts || 1)
  ).toFixed(2);

  res.json({
    totalPosts,
    totalViews,
    totalLikes,
    avgRating,
    lastUpdated: today()
  });
}
