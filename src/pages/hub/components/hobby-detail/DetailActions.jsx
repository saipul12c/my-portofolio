import { ExternalLink, Star, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function DetailActions({ hobby, onStartActivity, onSaveForLater }) {
  return (
    <div className="bg-[#141a28]/60 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
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
      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3">
        <Target size={20} className="text-cyan-400" />
        <span>{label}</span>
      </div>
      <ExternalLink size={16} className="text-gray-400 group-hover:text-cyan-400" />
    </a>
  );
}

function FavoriteButton() {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 group border border-cyan-400/20">
      <div className="flex items-center gap-3">
        <Star size={20} className="text-yellow-400" />
        <span>Tambahkan ke Favorit</span>
      </div>
    </button>
  );
}

function StatusIndicator({ isActive }) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-white/10">
      <span className="text-gray-400">Status Aktivitas</span>
      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        isActive 
          ? 'bg-green-500/20 text-green-300' 
          : 'bg-red-500/20 text-red-300'
      }`}>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`} />
        {isActive ? 'Aktif' : 'Tidak Aktif'}
      </span>
    </div>
  );
}

function ActionButtons({ onStartActivity, onSaveForLater }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 pt-6 border-t border-white/10">
      <button 
        onClick={onStartActivity}
        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
      >
        Mulai Aktivitas
      </button>
      <button 
        onClick={onSaveForLater}
        className="px-6 py-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/10"
      >
        Simpan untuk Nanti
      </button>
      <Link
        to="/hobbies"
        className="px-6 py-3 text-center text-gray-400 hover:text-white transition-colors"
      >
        Lihat Hobi Lainnya
      </Link>
    </div>
  );
}