/**
 * authorUtils.js
 * Utility to extract and compile unique author profiles from the blog dataset.
 */

import { normalizeAuthorSlug } from '../services/authorProfileService.js';

export const compileAuthorProfiles = (blogData) => {
  if (!blogData || !Array.isArray(blogData)) return {};

  const profiles = {};
  const slugToKey = {};

  blogData.forEach((post) => {
    const name = post.author?.trim();
    if (!name) return;
    const slug = normalizeAuthorSlug(name);
    const key = slugToKey[slug] || name;

    if (!profiles[key]) {
      slugToKey[slug] = key;
      profiles[key] = {
        name: name,
        avatar: post.authorAvatar,
        bio: post.authorBio || `Penulis spesialis ${post.category}.`,
        expertise: post.category ? [post.category] : [],
        totalPosts: 1,
        totalViews: post.views || 0,
        avgRating: post.rating || 0,
        slug,
        latestPostDate: post.date
      };
    } else {
      profiles[key].totalPosts += 1;
      profiles[key].totalViews += (post.views || 0);
      profiles[key].avgRating = (profiles[key].avgRating + (post.rating || 0)) / 2;
      
      if (post.category && !profiles[key].expertise.includes(post.category)) {
        profiles[key].expertise.push(post.category);
      }
      
      if (new Date(post.date) > new Date(profiles[key].latestPostDate)) {
        profiles[key].latestPostDate = post.date;
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
  const lowerSearch = searchName.toLowerCase().trim();
  const normalizedSearch = normalizeAuthorSlug(searchName);
  
  // Try exact match first
  if (profiles[searchName]) return profiles[searchName];
  
  // Try partial or normalized slug match
  const match = Object.values(profiles).find(p => 
    (normalizedSearch && p.slug === normalizedSearch) ||
    p.name.toLowerCase().includes(lowerSearch) || 
    lowerSearch.includes(p.name.toLowerCase())
  );
  
  return match || null;
};
