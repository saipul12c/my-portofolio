
import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  searchPosts,
  getGalleryImages,
  getGalleryAlbums,
  getProjects,
  getProjectById,
  getProfile,
  getCertificates,
  createData,
  updateData,
  deleteData
} from "./api.js";
import {
  renderPostList,
  renderPostDetail,
  renderProjects,
  renderGalleryImages,
  renderProfile,
  renderCertificates,
} from "./ui.js";
import { createAdminPage } from "./admin.js";

const adminPages = {
  "projects-admin.html": {
    formId: "project-form",
    listId: "project-list",
    idField: "project-id",
    cancelBtnId: "cancel-edit-btn",
    endpoint: "/projects",
    itemDisplayName: "Proyek",
  },
  "gallery-images-admin.html": {
    formId: "gallery-image-form",
    listId: "gallery-image-list",
    idField: "image-id",
    cancelBtnId: "cancel-edit-btn",
    endpoint: "/gallery/images",
    itemDisplayName: "Gambar Galeri",
  },
  "sertif-certificates-admin.html": {
    formId: "certificate-form",
    listId: "certificate-list",
    idField: "certificate-id",
    cancelBtnId: "cancel-edit-btn",
    endpoint: "/sertif/certificates",
    itemDisplayName: "Sertifikat",
  },
};

const routes = {
  "/": async () => {
    const container = document.getElementById("posts-container");
    if (container) {
      const data = await getAllPosts();
      renderPostList(container, data);
    }
  },
  "/index.html": async () => {
    const container = document.getElementById("posts-container");
    if (container) {
      const data = await getAllPosts();
      renderPostList(container, data);
    }
  },
  "/pages/post.html": async () => {
    const container = document.getElementById("post-detail");
    if (container) {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("slug");
      const post = await getPostBySlug(slug);
      renderPostDetail(container, post);
    }
  },
  "/pages/category.html": async () => {
    const container = document.getElementById("category-posts");
    if (container) {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category");
      document.getElementById("category-title").textContent = `Kategori: ${category}`;
      const posts = await getPostsByCategory(category);
      renderPostList(container, posts);
    }
  },
  "/pages/search.html": async () => {
    const btn = document.getElementById("search-btn");
    if (btn) {
      btn.onclick = async () => {
        const q = document.getElementById("search-input").value;
        const results = await searchPosts(q);
        renderPostList(document.getElementById("search-results"), results);
      };
    }
  },
  "/pages/projects.html": async () => {
    const container = document.getElementById("projects-container");
    if (container) {
      const projects = await getAllData("/projects");
      renderProjects(container, projects);
    }
  },
  "/pages/gallery.html": async () => {
    const container = document.getElementById("gallery-container");
    if (container) {
      const images = await getAllData("/gallery/images");
      renderGalleryImages(container, images);
    }
  },
  "/pages/about.html": async () => {
    const profileContainer = document.getElementById("profile-container");
    if (profileContainer) {
      const profile = await getAllData("/about/profile");
      renderProfile(profileContainer, profile);
    }
    const certificatesContainer = document.getElementById("certificates-container");
    if (certificatesContainer) {
      const certificates = await getAllData("/sertif/certificates");
      renderCertificates(certificatesContainer, certificates);
    }
  },
  "/pages/admin.html": async () => {
    const form = document.getElementById("add-form");
    if(form) {
      const list = document.getElementById("admin-list");
      const editIdInput = document.getElementById("edit-id");
      const cancelBtn = document.getElementById("cancel-btn");

      let posts = [];

      const clearForm = () => {
        form.reset();
        editIdInput.value = "";
        cancelBtn.style.display = "none";
      };

      const loadPosts = async () => {
        posts = await getAllPosts();
        renderAdminList(list, posts, "post");
      };

      form.onsubmit = async e => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(form).entries());
        const id = formData.id;

        if (id) {
          await updatePost(id, formData);
          alert("Post diperbarui!");
        } else {
          await addPost(formData);
          alert("Post ditambahkan!");
        }
        
        clearForm();
        loadPosts();
      };

      list.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("del-btn")) {
          if (confirm("Yakin ingin menghapus post ini?")) {
            await deletePost(id);
            alert("Post dihapus");
            loadPosts();
          }
        } else if (e.target.classList.contains("edit-btn")) {
          const postToEdit = posts.find(p => p.id == id);
          if (postToEdit) {
            form.title.value = postToEdit.title;
            form.slug.value = postToEdit.slug;
            form.category.value = postToEdit.category;
            form.metaDescription.value = postToEdit.metaDescription;
            editIdInput.value = postToEdit.id;
            cancelBtn.style.display = "inline-block";
            form.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });

      cancelBtn.onclick = clearForm;

      loadPosts();
    }
  },
  "/pages/about-profile-admin.html": async () => {
    const form = document.getElementById("profile-form");
    if(form) {
      const editIdInput = document.getElementById("profile-id");
      const endpoint = "/about/profile";

      const loadProfile = async () => {
        const profile = await getAllData(endpoint);
        if (profile && profile.length > 0) { // Assuming profile is an array with one item
          const p = profile[0];
          for (const key in p) {
            if (form[key]) {
              form[key].value = p[key];
            }
          }
          editIdInput.value = p.id;
        }
      };

      form.onsubmit = async e => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(form).entries());
        const id = formData.id;

        if (id) {
          await updateDataItem(endpoint, id, formData);
          alert("Profil diperbarui!");
        } else {
          // For profile, if no ID, we assume it's a create operation for the first item
          await createDataItem(endpoint, formData);
          alert("Profil ditambahkan!");
        }
        loadProfile();
      };

      loadProfile();
    }
  }
};

export async function route() {
  const path = window.location.pathname;
  const page = path.split("/").pop();

  if (adminPages[page]) {
    createAdminPage(adminPages[page]);
    return;
  }

  const handler = routes[path] || routes[`/${page}`];
  if (handler) {
    await handler();
  }
}
