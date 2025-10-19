export function renderPostList(container, posts) {
  if (!posts.length) {
    container.innerHTML = `<p>Tidak ada artikel ditemukan.</p>`;
    return;
  }

  container.innerHTML = posts.map(p => `
    <div class="card">
      <img src="${p.thumbnail}" alt="${p.title}" />
      <h3><a href="/pages/post.html?slug=${p.slug}" data-link>${p.title}</a></h3>
      <p>${p.metaDescription}</p>
      <small>${p.category} • ${p.date}</small>
    </div>
  `).join("");
}

export function renderPostDetail(container, post) {
  container.innerHTML = `
    <article>
      <h1>${post.title}</h1>
      <p><em>By ${post.author} • ${post.date}</em></p>
      <img src="${post.imageFull}" alt="${post.title}" />
      <p>${post.content}</p>
      <p>❤️ ${post.likes || 0} • 👁️ ${post.views || 0}</p>
    </article>
  `;
}
