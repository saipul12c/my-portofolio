import React from "react";
import { TrendingUp, BookOpen, Users, Heart, Star, Sparkles } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * BlogStatsSection component - displays blog statistics
 */
export const BlogStatsSection = ({ blogStats }) => {
  return (
    <div className="mb-10">
      <SectionHeader 
        title="Statistik Blog Muhammad Syaiful Mukmin"
        description="Kontribusi dan dampak melalui penulisan artikel pendidikan"
        icon={<TrendingUp className="w-8 h-8" />}
      />

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span className="text-xs text-teal-600 font-medium">Total</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{blogStats.totalArticles}</div>
          <div className="text-xs text-slate-600">Artikel Ditulis</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Views</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{blogStats.totalViews.toLocaleString()}</div>
          <div className="text-xs text-slate-600">Total Pembaca</div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <span className="text-xs text-rose-600 font-medium">Likes</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{blogStats.totalLikes.toLocaleString()}</div>
          <div className="text-xs text-slate-600">Total Apresiasi</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-amber-600" />
            <span className="text-xs text-amber-600 font-medium">Rating</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{blogStats.averageRating}</div>
          <div className="text-xs text-slate-600">Rata-rata</div>
        </div>
      </div>

      {/* Grid Statistik Sekunder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-teal-600">{blogStats.totalShares}</div>
          <div className="text-xs text-slate-600">Shares</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-teal-600">{blogStats.totalComments}</div>
          <div className="text-xs text-slate-600">Comments</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-teal-600">{blogStats.featuredCount}</div>
          <div className="text-xs text-slate-600">Featured</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-teal-600">{(blogStats.totalWordCount / 1000).toFixed(1)}k</div>
          <div className="text-xs text-slate-600">Total Kata</div>
        </div>
      </div>

      {/* Kategori Blog */}
      <div className="bg-gradient-to-br from-slate-50 to-teal-50 rounded-xl p-4 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          Kategori yang Dikuasai
        </h4>
        <div className="flex flex-wrap gap-2">
          {blogStats.categories.map((category, index) => (
            <span key={index} 
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
              {category}
            </span>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-600">
            <strong className="text-teal-700">Dampak:</strong> Artikel-artikel telah dibaca lebih dari{' '}
            <strong className="text-teal-700">{blogStats.totalViews.toLocaleString()}</strong> kali dan mendapatkan{' '}
            <strong className="text-teal-700">{blogStats.totalLikes.toLocaleString()}</strong> apresiasi dari pembaca.
          </p>
        </div>
      </div>
    </div>
  );
};
