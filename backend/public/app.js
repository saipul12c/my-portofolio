// ========================================================
// 🌐 Konfigurasi API Endpoint
// ========================================================
const API_BASE = "http://localhost:3000/api/posts";

// ========================================================
// 📦 Elemen DOM
// ========================================================
const table = document.getElementById("dataTable");
const form = document.getElementById("postForm");
const resetBtn = document.getElementById("resetBtn");
const messageBox = document.getElementById("message");

// ========================================================
// 🧰 Fungsi Utilitas
// ========================================================
function showMessage(text, type = "success") {
  messageBox.textContent = text;
  messageBox.style.display = "block";
  messageBox.style.backgroundColor = type === "success" ? "#c8e6c9" : "#ffcdd2";
  setTimeout(() => (messageBox.style.display = "none"), 3000);
}

function getFormData() {
  return {
    id: document.getElementById("postId").value,
    title: document.getElementById("title").value.trim(),
    author: document.getElementById("author").value.trim(),
    excerpt: document.getElementById("excerpt").value.trim(),
    category: document.getElementById("category").value.trim(),
    metaTitle: document.getElementById("metaTitle").value.trim(),
    metaDescription: document.getElementById("metaDescription").value.trim(),
    content: document.getElementById("content").value.trim(),
  };
}

function clearForm() {
  form.reset();
  document.getElementById("postId").value = "";
}

// ========================================================
// 📘 ROUTE: GET Semua Data
// ========================================================
async function loadPosts() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    table.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      table.innerHTML = `<tr><td colspan="6">Tidak ada data.</td></tr>`;
      return;
    }

    data.forEach(post => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${post.id}</td>
        <td>${post.title || "-"}</td>
        <td>${post.author || "-"}</td>
        <td>${post.date || "-"}</td>
        <td>${post.category || "-"}</td>
        <td>
          <button onclick="editPost(${post.id})">✏️ Edit</button>
          <button onclick="deletePost(${post.id})">🗑️ Hapus</button>
          <button onclick="likePost(${post.id})">❤️ Like</button>
          <button onclick="viewPost(${post.id})">👁️ View</button>
        </td>
      `;
      table.appendChild(row);
    });
  } catch (error) {
    console.error("Gagal memuat data:", error);
    showMessage("Gagal memuat data dari server", "error");
  }
}

// ========================================================
// 📗 ROUTE: GET Berdasarkan ID (Edit Data)
// ========================================================
async function editPost(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const post = await res.json();

    if (!post || !post.id) {
      showMessage("Data tidak ditemukan", "error");
      return;
    }

    document.getElementById("postId").value = post.id || "";
    document.getElementById("title").value = post.title || "";
    document.getElementById("author").value = post.author || "";
    document.getElementById("excerpt").value = post.excerpt || "";
    document.getElementById("category").value = post.category || "";
    document.getElementById("metaTitle").value = post.metaTitle || "";
    document.getElementById("metaDescription").value = post.metaDescription || "";
    document.getElementById("content").value = post.content || "";

    showMessage("✏️ Mode edit diaktifkan");
  } catch (error) {
    console.error(error);
    showMessage("Gagal mengambil data", "error");
  }
}

// ========================================================
// 🟩 ROUTE: POST / PUT — Simpan Data
// ========================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = getFormData();

  if (!data.title || !data.author) {
    showMessage("Judul dan penulis wajib diisi", "error");
    return;
  }

  try {
    const isEdit = !!data.id;
    const res = await fetch(isEdit ? `${API_BASE}/${data.id}` : API_BASE, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    showMessage(result.message || "Berhasil disimpan");
    clearForm();
    loadPosts();
  } catch (error) {
    console.error(error);
    showMessage("Gagal menyimpan data", "error");
  }
});

// ========================================================
// 🟥 ROUTE: DELETE Berdasarkan ID
// ========================================================
async function deletePost(id) {
  if (!confirm("Yakin ingin menghapus data ini?")) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    const result = await res.json();
    showMessage(result.message || "Data dihapus");
    loadPosts();
  } catch (error) {
    console.error(error);
    showMessage("Gagal menghapus data", "error");
  }
}

// ========================================================
// ⚠️ ROUTE: DELETE Semua Data
// ========================================================
async function deleteAll() {
  if (!confirm("⚠️ Yakin ingin menghapus SEMUA data?")) return;
  try {
    const res = await fetch(API_BASE, { method: "DELETE" });
    const result = await res.json();
    showMessage(result.message);
    loadPosts();
  } catch (error) {
    console.error(error);
    showMessage("Gagal menghapus semua data", "error");
  }
}

// ========================================================
// 💬 ROUTE: Tambah Komentar
// ========================================================
async function addComment(id, name, message) {
  try {
    const res = await fetch(`${API_BASE}/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    const result = await res.json();
    showMessage(result.message || "Komentar ditambahkan");
  } catch (error) {
    console.error(error);
    showMessage("Gagal menambah komentar", "error");
  }
}

// ========================================================
// ❤️ ROUTE: Tambah Like
// ========================================================
async function likePost(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}/like`, { method: "PATCH" });
    const result = await res.json();
    showMessage(`❤️ ${result.message} (${result.likes} likes)`);
    loadPosts();
  } catch (error) {
    console.error(error);
    showMessage("Gagal menambah like", "error");
  }
}

// ========================================================
// 👁️ ROUTE: Tambah View
// ========================================================
async function viewPost(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}/view`, { method: "PATCH" });
    const result = await res.json();
    showMessage(`👁️ ${result.message} (${result.views} views)`);
    loadPosts();
  } catch (error) {
    console.error(error);
    showMessage("Gagal menambah view", "error");
  }
}

// ========================================================
// 🏷️ ROUTE: Tambah Tag Baru
// ========================================================
async function addTag(id, tag) {
  if (!tag) return showMessage("Tag tidak boleh kosong", "error");
  try {
    const res = await fetch(`${API_BASE}/${id}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag }),
    });
    const result = await res.json();
    showMessage(result.message || "Tag ditambahkan");
  } catch (error) {
    console.error(error);
    showMessage("Gagal menambah tag", "error");
  }
}

// ========================================================
// 🧹 RESET FORM
// ========================================================
resetBtn.addEventListener("click", () => {
  clearForm();
  showMessage("Form direset");
});

// ========================================================
// 🚀 INIT — Jalankan saat halaman dimuat
// ========================================================
document.addEventListener("DOMContentLoaded", loadPosts);
