import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Share2,
  MoreVertical,
  Edit3,
  User,
  Menu,
  UserPlus,
  Bookmark,
  Video,
  Heart,
  Folder,
  Pin,
  Play,
  MapPin,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("videos");

  const videos = [
    { id: 1, src: "/videos/video1.jpg", views: "59,2 MB", pinned: true, draft: false },
    { id: 2, src: "/videos/video2.jpg", views: "15,2 rb", pinned: false, draft: false },
    { id: 3, src: "/videos/video3.jpg", views: "302", pinned: false, draft: false },
    { id: 4, src: "/videos/video4.jpg", views: "116", pinned: false, draft: false },
    { id: 5, src: "/videos/video5.jpg", views: "178", pinned: false, draft: false },
    { id: 6, src: "/videos/video6.jpg", views: "416", pinned: false, draft: false },
    { id: 7, src: "/videos/video7.jpg", views: "178", pinned: false, draft: true },
  ];

  return (
    <div className="bg-gray-50 font-sans text-sm text-gray-800 min-h-screen flex flex-col">
      {/* Header sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                <User size={14} />
              </div>
              <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-yellow-300 text-[10px] flex items-center justify-center font-semibold">
                P
              </div>
            </div>
            <div className="hidden sm:flex items-center bg-gray-100 px-3 py-1 rounded-full text-xs">
              Ayo cerita
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Share2 size={18} className="cursor-pointer" />
            <MoreVertical size={18} className="cursor-pointer" />
            <Menu size={20} className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Konten scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 pt-4 pb-20">
          {/* Foto profil */}
          <div className="relative flex flex-col items-center">
            <div className="relative">
              <img
                src="/profile.jpg"
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border border-gray-200"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px]">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">
                  ✓
                </div>
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs border border-gray-100 shadow-sm">
                Ayo cerita
              </div>
            </div>

            <div className="mt-3 w-full flex items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">Muhamamd Syaiful ...</h2>
                <div className="bg-pink-600 text-white text-[11px] px-2 py-[2px] rounded-full font-semibold">
                  9+
                </div>
              </div>

              <button
                onClick={() => navigate("/edit-profile")}
                className="ml-2 bg-white border border-gray-200 px-2 py-1 rounded-md text-xs shadow-sm flex items-center gap-1"
              >
                <Edit3 size={14} /> Edit
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-1">@saipul12c</p>
          </div>

          {/* Statistik */}
          <div className="mt-4 flex justify-center gap-8 text-center">
            <div>
              <p className="font-semibold text-base">120</p>
              <p className="text-xs text-gray-500">Mengikuti</p>
            </div>
            <div>
              <p className="font-semibold text-base">67</p>
              <p className="text-xs text-gray-500">Pengikut</p>
            </div>
            <div>
              <p className="font-semibold text-base">558</p>
              <p className="text-xs text-gray-500">Suka</p>
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={() => navigate("/edit-profile")}
              className="flex-1 max-w-[170px] flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white shadow-sm"
            >
              <Edit3 size={14} /> Edit profil
            </button>
            <button className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center bg-white">
              <UserPlus size={16} />
            </button>
            <button className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center bg-white">
              <Bookmark size={16} />
            </button>
          </div>

          {/* Bio */}
          <div className="mt-3 text-center px-4">
            <p className="text-sm text-gray-700 leading-tight">
              saya seorang calon guru dan ahli IT yang piawai dalam memimpin berbagai kegiatan
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <MapPin size={14} className="text-pink-600" />
              <span className="text-pink-600 text-xs font-medium">Alamat email</span>
            </div>
          </div>

          {/* Link kecil */}
          <div className="mt-2 flex items-center justify-center gap-3 text-xs text-gray-600">
            <span>🎵 TikTok Studio</span>
            <span className="text-gray-300">|</span>
            <span>Pesanan Shop</span>
            <span className="text-gray-300">|</span>
            <span>Tokopedia</span>
          </div>

          {/* Tab bar */}
          <div className="mt-4 border-b border-gray-200">
            <div className="flex justify-around max-w-md mx-auto">
              {[
                { key: "videos", icon: <Video size={18} />, label: "Video" },
                { key: "liked", icon: <Heart size={18} />, label: "Suka" },
                { key: "collections", icon: <Folder size={18} />, label: "Koleksi" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 flex flex-col items-center w-1/3 ${
                    activeTab === tab.key ? "text-black font-semibold" : "text-gray-400"
                  }`}
                >
                  {tab.icon}
                  <span className="text-[12px] mt-1">{tab.label}</span>
                  {activeTab === tab.key && (
                    <div className="h-0.5 w-6 bg-black rounded-full mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Draft info */}
          <div className="mt-2 max-w-md mx-auto flex items-center justify-start px-1 text-xs text-gray-500">
            <span className="px-2 py-1">Draft: 2</span>
          </div>

          {/* Grid video */}
          <div className="mt-1 max-w-md mx-auto bg-black">
            <div className="grid grid-cols-3 gap-[1px] bg-black">
              {videos.map((v) => (
                <div key={v.id} className="relative bg-black group">
                  <img
                    src={v.src}
                    alt={`video-${v.id}`}
                    className="w-full aspect-[9/12] object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {v.pinned && (
                    <div className="absolute top-1 left-1 bg-red-600 text-white text-[11px] px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <Pin size={12} /> Disematkan
                    </div>
                  )}
                  {v.draft && (
                    <div className="absolute top-1 left-1 bg-gray-800 text-white text-[11px] px-2 py-0.5 rounded-sm">
                      Draft
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <Play size={11} /> <span>{v.views}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
