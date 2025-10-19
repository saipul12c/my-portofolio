import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  searchPosts,
  addPost,
  deletePost
} from "./api.js";
import { renderPostList, renderPostDetail } from "./ui.js";

// SPA-like navigation
document.addEventListener("click", e => {
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    window.history.pushState({}, "", link.href);
    route();
  }
});

window.addEventListener("popstate", route);
route();

async function route() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  const app = document.getElementById("app");

  if (page === "" || page === "index.html") {
    const data = await getAllPosts();
    renderPostList(document.getElementById("posts-container"), data);
  }

  if (page === "post.html") {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const post = await getPostBySlug(slug);
    renderPostDetail(document.getElementById("post-detail"), post);
  }

  if (page === "category.html") {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    document.getElementById("category-title").textContent = `Kategori: ${category}`;
    const posts = await getPostsByCategory(category);
    renderPostList(document.getElementById("category-posts"), posts);
  }

  if (page === "search.html") {
    const btn = document.getElementById("search-btn");
    btn.onclick = async () => {
      const q = document.getElementById("search-input").value;
      const results = await searchPosts(q);
      renderPostList(document.getElementById("search-results"), results);
    };
  }

  if (page === "admin.html") {
    const form = document.getElementById("add-form");
    const list = document.getElementById("admin-list");
    const posts = await getAllPosts();
    list.innerHTML = posts.map(p => `
      <li>${p.title} <button data-id="${p.id}" class="del-btn">🗑️</button></li>
    `).join("");

    form.onsubmit = async e => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(form).entries());
      await addPost(formData);
      alert("Post ditambahkan!");
      location.reload();
    };

    list.addEventListener("click", async e => {
      if (e.target.classList.contains("del-btn")) {
        const id = e.target.dataset.id;
        await deletePost(id);
        alert("Post dihapus");
        location.reload();
      }
    });
  }
}
