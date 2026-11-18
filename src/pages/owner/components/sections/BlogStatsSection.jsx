import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, BookOpen, Users, Heart, Star, Share2 } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * BlogStatsSection component - displays blog writing statistics with dark glassmorphism
 */
export const BlogStatsSection = ({ blogStats = {} }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dampak Publikasi & Statistik Blog"
        description="Penyebaran wawasan EduTech, artikel teknologi pembelajaran, dan respon pembaca"
        icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
        to="/blog"
        linkText="Buka Halaman Blog"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 text-center hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Artikel</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{blogStats.totalArticles || 0}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Artikel Ditulis</div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 text-center hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Pembaca</span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {(blogStats.totalViews || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Total Views</div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 text-center hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">Apresiasi</span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {(blogStats.totalLikes || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Total Likes</div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 text-center hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Rating</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{blogStats.averageRating || "5.0"}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Skor Pembaca</div>
        </div>
      </div>
    </div>
  );
};
