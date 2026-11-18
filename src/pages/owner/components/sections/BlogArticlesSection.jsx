import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * BlogArticlesSection component - displays recent articles with link to /blog/:slug and /blog
 */
export const BlogArticlesSection = ({ blogs = [] }) => {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 text-center">
        <BookOpen className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
        <h4 className="text-base font-bold text-white mb-1">Artikel EduTech & Wawasan</h4>
        <p className="text-xs text-slate-400 mb-4">
          Kumpulan tulisan terbaru mengenai inovasi media pembelajaran dan teknologi pendidikan.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-all"
        >
          <span>Kunjungi Halaman Blog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Artikel & Publikasi Terbaru"
        description="Gagasan, panduan teknis, dan refleksi pedagogi di era modern"
        icon={<BookOpen className="w-5 h-5 text-cyan-400" />}
        to="/blog"
        linkText="Katalog Artikel Lengkap"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map((blog) => (
          <Link
            key={blog.id || blog.slug}
            to={`/blog/${blog.slug || blog.id}`}
            className="group bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {blog.category || "EduTech"}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {blog.readTime || "5 mnt baca"}
                </span>
              </div>

              <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                {blog.title}
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                {blog.excerpt || blog.metaDescription || "Pelajari ulasan lengkap mengenai artikel ini..."}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {blog.date ? new Date(blog.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Terbaru"}
              </span>
              <span className="text-cyan-400 font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Baca Artikel <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
