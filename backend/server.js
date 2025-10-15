import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3000;
const __dirname = path.resolve();

// 🔹 Lokasi file data.json
const dataPath = path.join(__dirname, "../src/data/blog/data.json");

// 🔹 Pastikan file JSON ada
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
  console.log("🆕 File data.json dibuat di:", dataPath);
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ========================================================
// 🔧 Helper Functions
// ========================================================
function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}
function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// ========================================================
// 📘 GET - Ambil semua data
// ========================================================
app.get("/api/posts", (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal membaca data", error });
  }
});

// ========================================================
// 📗 GET - Ambil data berdasarkan ID
// ========================================================
app.get("/api/posts/:id", (req, res) => {
  try {
    const data = readData();
    const id = parseInt(req.params.id);
    const post = data.find(p => p.id === id);
    if (!post) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Gagal membaca data", error });
  }
});

// ========================================================
// 🆕 GET - Ambil berdasarkan SLUG
// ========================================================
app.get("/api/posts/slug/:slug", (req, res) => {
  try {
    const data = readData();
    const post = data.find(p => p.slug === req.params.slug);
    if (!post) return res.status(404).json({ message: "Slug tidak ditemukan" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Gagal membaca data berdasarkan slug", error });
  }
});

// ========================================================
// 🆕 GET - Ambil semua post berdasarkan kategori
// ========================================================
app.get("/api/posts/category/:category", (req, res) => {
  try {
    const data = readData();
    const category = req.params.category.toLowerCase();
    const filtered = data.filter(p => p.category?.toLowerCase() === category);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data kategori", error });
  }
});

// ========================================================
// 🆕 GET - Pencarian (search by title / description)
// ========================================================
app.get("/api/posts/search", (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || "";
    const data = readData();
    const results = data.filter(p =>
      p.title?.toLowerCase().includes(query) ||
      p.shortDescription?.toLowerCase().includes(query)
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Gagal melakukan pencarian", error });
  }
});

// ========================================================
// 🟩 POST - Tambah data baru
// ========================================================
app.post("/api/posts", (req, res) => {
  try {
    const data = readData();
    const newPost = {
      id: Date.now(),
      ...req.body,
      date: req.body.date || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0]
    };
    data.push(newPost);
    writeData(data);
    res.status(201).json({ message: "✅ Data berhasil ditambahkan", data: newPost });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah data", error });
  }
});

// ========================================================
// 🆕 POST - Duplikasi post berdasarkan ID
// ========================================================
app.post("/api/posts/duplicate/:id", (req, res) => {
  try {
    const data = readData();
    const post = data.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const duplicate = {
      ...post,
      id: Date.now(),
      title: post.title + " (Copy)",
      slug: post.slug + "-copy",
      date: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0]
    };

    data.push(duplicate);
    writeData(data);
    res.json({ message: "📄 Post berhasil diduplikasi", data: duplicate });
  } catch (error) {
    res.status(500).json({ message: "Gagal menduplikasi post", error });
  }
});

// ========================================================
// 🆕 DELETE - Hapus duplikat berdasarkan slug
// ========================================================
app.delete("/api/posts/clean/duplicates", (req, res) => {
  try {
    const data = readData();
    const unique = [];
    const seen = new Set();

    data.forEach(post => {
      if (!seen.has(post.slug)) {
        seen.add(post.slug);
        unique.push(post);
      }
    });

    const removedCount = data.length - unique.length;
    writeData(unique);

    res.json({
      message: `🧹 Duplikat slug dibersihkan (${removedCount} post dihapus)`,
      total: unique.length
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal membersihkan duplikat", error });
  }
});

// ========================================================
// 🟨 PUT - Perbarui seluruh data post
// ========================================================
app.put("/api/posts/:id", (req, res) => {
  try {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ message: "Data tidak ditemukan" });

    data[index] = {
      ...data[index],
      ...req.body,
      updatedAt: new Date().toISOString().split("T")[0]
    };
    writeData(data);
    res.json({ message: "✅ Data berhasil diperbarui", data: data[index] });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui data", error });
  }
});

// ========================================================
// 🟥 DELETE - Hapus berdasarkan ID
// ========================================================
app.delete("/api/posts/:id", (req, res) => {
  try {
    const data = readData();
    const id = parseInt(req.params.id);
    const filtered = data.filter(p => p.id !== id);
    if (filtered.length === data.length)
      return res.status(404).json({ message: "Data tidak ditemukan" });
    writeData(filtered);
    res.json({ message: "✅ Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data", error });
  }
});

// ========================================================
// ⚠️ DELETE ALL - Hapus semua data
// ========================================================
app.delete("/api/posts", (req, res) => {
  try {
    writeData([]);
    res.json({ message: "⚠️ Semua data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus semua data", error });
  }
});

// ========================================================
// 💬 KOMENTAR, LIKE, VIEW, TAG, META
// ========================================================

// ➕ Tambah komentar
app.post("/api/posts/:id/comments", (req, res) => {
  try {
    const data = readData();
    const post = data.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const newComment = {
      name: req.body.name || "Anonim",
      date: new Date().toISOString().split("T")[0],
      message: req.body.message
    };

    post.comments = post.comments || [];
    post.comments.push(newComment);
    post.commentCount = post.comments.length;
    post.updatedAt = new Date().toISOString().split("T")[0];

    writeData(data);
    res.json({ message: "💬 Komentar berhasil ditambahkan", comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah komentar", error });
  }
});

// ❌ Hapus komentar berdasarkan index
app.delete("/api/posts/:id/comments/:index", (req, res) => {
  try {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = parseInt(req.params.index);
    const post = data.find(p => p.id === id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    if (!post.comments || !post.comments[index])
      return res.status(404).json({ message: "Komentar tidak ditemukan" });

    post.comments.splice(index, 1);
    post.commentCount = post.comments.length;
    post.updatedAt = new Date().toISOString().split("T")[0];

    writeData(data);
    res.json({ message: "🗑️ Komentar berhasil dihapus", comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus komentar", error });
  }
});

// ❤️ Update jumlah likes
app.patch("/api/posts/:id/like", (req, res) => {
  try {
    const data = readData();
    const post = data.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    post.likes = (post.likes || 0) + 1;
    post.updatedAt = new Date().toISOString().split("T")[0];
    writeData(data);

    res.json({ message: "👍 Like ditambahkan", likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah like", error });
  }
});

// 👁️ Tambah views
app.patch("/api/posts/:id/view", (req, res) => {
  try {
    const data = readData();
    const post = data.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    post.views = (post.views || 0) + 1;
    writeData(data);
    res.json({ message: "👀 View ditambahkan", views: post.views });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah view", error });
  }
});

// 🏷️ Tambah tag baru
app.post("/api/posts/:id/tags", (req, res) => {
  try {
    const data = readData();
    const post = data.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const newTag = req.body.tag;
    if (!newTag) return res.status(400).json({ message: "Tag tidak boleh kosong" });

    post.tags = post.tags || [];
    if (!post.tags.includes(newTag)) post.tags.push(newTag);

    post.updatedAt = new Date().toISOString().split("T")[0];
    writeData(data);

    res.json({ message: "🏷️ Tag berhasil ditambahkan", tags: post.tags });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah tag", error });
  }
});

// 🗑️ Hapus tag
app.delete("/api/posts/:id/tags/:tag", (req, res) => {
  try {
    const data = readData();
    const post = data.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const tagToRemove = req.params.tag;
    post.tags = post.tags.filter(t => t !== tagToRemove);

    post.updatedAt = new Date().toISOString().split("T")[0];
    writeData(data);

    res.json({ message: "🗑️ Tag berhasil dihapus", tags: post.tags });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus tag", error });
  }
});

// ✏️ Update metadata
app.patch("/api/posts/:id/meta", (req, res) => {
  try {
    const data = readData();
    const post = data.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const allowedFields = ["title", "metaTitle", "metaDescription", "category", "author", "authorBio"];
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) post[key] = req.body[key];
    });

    post.updatedAt = new Date().toISOString().split("T")[0];
    writeData(data);
    res.json({ message: "📝 Metadata berhasil diperbarui", post });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui metadata", error });
  }
});

// ========================================================
// 📊 STATS - Statistik Blog
// ========================================================
app.get("/api/posts/stats", (req, res) => {
  try {
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
      lastUpdated: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil statistik", error });
  }
});

// ========================================================
// 🚀 Jalankan server
// ========================================================
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di: http://localhost:${PORT}`);
});
