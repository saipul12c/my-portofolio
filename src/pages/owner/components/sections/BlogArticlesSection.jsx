import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Heart, MessageSquare } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Eye } from "../ui/EyeIcon";

/**
 * BlogArticlesSection component - displays recent blog articles
 */
export const BlogArticlesSection = ({ blogs }) => {
  return (
    <div className="mb-10">
      <SectionHeader 
        title="Artikel Terbaru"
        description="Insight dan pengetahuan dari pengalaman menulis"
        icon={<BookOpen className="w-8 h-8" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map(blog => (
          <Link key={blog.id} to={`/blog/${blog.slug || blog.id}`} 
               className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                          rounded-xl p-5 hover:border-teal-300 transition-all duration-300 
                          hover:shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center 
                              justify-center text-teal-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-teal-700 
                               transition-colors line-clamp-1">
                    {blog.title}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{blog.author}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                blog.featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
              }`}>
                {blog.featured ? 'Featured' : blog.category}
              </span>
            </div>
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
              {blog.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">
                {new Date(blog.date).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  {blog.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-cyan-500" />
                  {blog.commentCount}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-500" />
                  {blog.views}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
