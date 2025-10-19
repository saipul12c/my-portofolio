const BASE_URL = "/api/posts";

export async function getAllPosts() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function getPostBySlug(slug) {
  const res = await fetch(`${BASE_URL}/slug/${slug}`);
  return res.json();
}

export async function getPostsByCategory(category) {
  const res = await fetch(`${BASE_URL}/category/${category}`);
  return res.json();
}

export async function searchPosts(query) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function addPost(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res.json();
}
