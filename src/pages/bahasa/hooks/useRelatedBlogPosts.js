import { useMemo, useState, useEffect } from "react";
import { fetchAllPosts } from "../../blog/services/blogSupabase";

/**
 * Hook untuk menemukan blog posts yang terkait dengan bahasa/teknologi
 * @param {string} skillName - Nama bahasa atau teknologi
 * @returns {Array} - Array blog posts yang relevan
 */
export const useRelatedBlogPosts = (skillName) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetchAllPosts().then((posts) => {
      if (isMounted && Array.isArray(posts) && posts.length > 0) {
        setBlogs(posts);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(() => {
    if (!skillName || !Array.isArray(blogs)) return [];

    const relatedPosts = blogs.filter(post => {
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
