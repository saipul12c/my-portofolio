import { useMemo } from "react";

export const useBlogData = (blogs) => {
  const processedBlogs = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const withLabels = blogs.map((post) => {
      const postDate = new Date(post.date);
      const labels = [];
      if (post.featured) labels.push("Rekomendasi");
      if (postDate >= sixMonthsAgo) labels.push("Baru");
      if (post.views > 2000) labels.push("Hot");
      if (post.rating > 4.5) labels.push("Premium");
      return { ...post, labels };
    });

    return withLabels;
  }, [blogs]);

  return processedBlogs;
};