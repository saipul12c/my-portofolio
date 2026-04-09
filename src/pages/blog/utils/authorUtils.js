/**
 * authorUtils.js
 * Utility to extract and compile unique author profiles from the blog dataset.
 */

export const compileAuthorProfiles = (blogData) => {
  if (!blogData || !Array.isArray(blogData)) return {};

  const profiles = {};

  blogData.forEach((post) => {
    const name = post.author;
    if (!name) return;

    if (!profiles[name]) {
      profiles[name] = {
        name: name,
        avatar: post.authorAvatar,
        bio: post.authorBio || `Penulis spesialis ${post.category}.`,
        expertise: [post.category],
        totalPosts: 1,
        totalViews: post.views || 0,
        avgRating: post.rating || 0,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        latestPostDate: post.date
      };
    } else {
      profiles[name].totalPosts += 1;
      profiles[name].totalViews += (post.views || 0);
      profiles[name].avgRating = (profiles[name].avgRating + (post.rating || 0)) / 2;
      
      if (!profiles[name].expertise.includes(post.category)) {
        profiles[name].expertise.push(post.category);
      }
      
      if (new Date(post.date) > new Date(profiles[name].latestPostDate)) {
        profiles[name].latestPostDate = post.date;
      }
    }
  });

  return profiles;
};

/**
 * Find a specific author profile by name (loose match)
 */
export const findAuthorByName = (profiles, searchName) => {
  if (!profiles || !searchName) return null;
  const lowerSearch = searchName.toLowerCase();
  
  // Try exact match first
  if (profiles[searchName]) return profiles[searchName];
  
  // Try partial match
  const match = Object.values(profiles).find(p => 
    p.name.toLowerCase().includes(lowerSearch) || 
    lowerSearch.includes(p.name.toLowerCase())
  );
  
  return match || null;
};
