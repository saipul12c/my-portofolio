import { ExternalLink, Star, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function DetailActions({ hobby, onStartActivity, onSaveForLater }) {
  return (
    <div className="bg-gradient-to-br from-[#0f1724]/50 to-[#071025]/40 rounded-2xl p-6 border border-white/8 backdrop-blur-md shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-cyan-300">🔗 Tautan & Aksi</h3>
      <div className="space-y-3">
        <ExternalLinkButton href={hobby.link} label={hobby.linkLabel} />
        <FavoriteButton />
        <StatusIndicator isActive={hobby.metadata.isActive} />
      </div>
      
      <ActionButtons 
        onStartActivity={onStartActivity}
        onSaveForLater={onSaveForLater}
      />
    </div>
  );
}

function ExternalLinkButton({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 rounded-xl bg-white/4 hover:bg-white/8 transition-all duration-300 group border border-white/6"
    >
      <div className="flex items-center gap-3">
        <Target size={20} className="text-cyan-400" />
        <span className="text-sm">{label}</span>
      </div>
      <ExternalLink size={16} className="text-gray-300 group-hover:text-cyan-300" />
    </a>
  );
}

function FavoriteButton() {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-600/10 to-blue-600/10 hover:from-cyan-600/15 hover:to-blue-600/15 transition-all duration-300 group border border-cyan-500/10 shadow-sm">
      <div className="flex items-center gap-3">
        <Star size={20} className="text-yellow-400" />
        <span className="text-sm">Tambahkan ke Favorit</span>
      </div>
    </button>
  );
}

function StatusIndicator({ isActive }) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-white/8">
      <span className="text-gray-400">Status Aktivitas</span>
      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        isActive 
          ? 'bg-green-500/20 text-green-300' 
          : 'bg-red-500/20 text-red-300'
      }`}>
        <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`} />
        {isActive ? 'Aktif' : 'Tidak Aktif'}
      </span>
    </div>
  );
}

function ActionButtons({ onStartActivity, onSaveForLater }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 pt-6 border-t border-white/8">
      <button 
        onClick={onStartActivity}
        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        Mulai Aktivitas
      </button>
      <button 
        onClick={onSaveForLater}
        className="px-6 py-3 bg-white/6 rounded-xl font-semibold hover:bg-white/12 transition-all duration-300 border border-white/8"
      >
        Simpan untuk Nanti
      </button>
      <Link
        to="/hobbies"
        className="px-6 py-3 text-center text-gray-300 hover:text-white transition-colors"
      >
        Lihat Hobi Lainnya
      </Link>
    </div>
  );
}