import { useMemo } from "react";
import blogData from "../../../data/blog/data.json";

/**
 * Hook untuk menemukan blog posts yang terkait dengan bahasa/teknologi
 * @param {string} skillName - Nama bahasa atau teknologi
 * @returns {Array} - Array blog posts yang relevan
 */
export const useRelatedBlogPosts = (skillName) => {
  return useMemo(() => {
    if (!skillName || !Array.isArray(blogData)) return [];

    const relatedPosts = blogData.filter(post => {
      // Cek di tags
      if (post.tags && post.tags.some(tag => 
        tag.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(tag.toLowerCase())
      )) {
        return true;
      }
      
      // Cek di keywords
      if (post.keywords && post.keywords.some(keyword =>
        keyword.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(keyword.toLowerCase())
      )) {
        return true;
      }

      // Cek di content dan title
      const contentLower = (post.content || "").toLowerCase();
      const titleLower = (post.title || "").toLowerCase();
      const skillLower = skillName.toLowerCase();

      if (contentLower.includes(skillLower) || titleLower.includes(skillLower)) {
        return true;
      }

      return false;
    });

    return relatedPosts.slice(0, 3).map(post => ({
      ...post,
      link: `/blog/${post.slug}`,
      relevance: "sedang"
    }));
  }, [skillName]);
};
