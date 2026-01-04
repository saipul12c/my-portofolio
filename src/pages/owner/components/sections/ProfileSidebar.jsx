import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Download, Target } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { CONTACT_INFO } from "../../utils/constants";

/**
 * ProfileSidebar component - displays the sidebar with profile info
 */
export const ProfileSidebar = ({ profile, initials, counts }) => {
  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 lg:p-10 text-white">
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <Avatar initials={initials} />

        {/* Info Dasar */}
        <h2 className="text-2xl font-bold text-center mb-2">{profile.name}</h2>
        <div className="flex items-center gap-2 mb-4 text-slate-300">
          <Target className="w-4 h-4" />
          <span className="font-medium">Fullstack Developer & EduTech Specialist</span>
        </div>

        {/* Statistik Singkat */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6 mb-4">
          <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold">{counts.projects}</div>
            <div className="text-xs opacity-80">Proyek</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold">{counts.testimonials}</div>
            <div className="text-xs opacity-80">Testimoni</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold">{counts.blogs}</div>
            <div className="text-xs opacity-80">Artikel</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold">{counts.certificates}</div>
            <div className="text-xs opacity-80">Sertifikat</div>
          </div>
        </div>

        {/* Kontak Info */}
        <div className="w-full space-y-4 mt-4">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Mail className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm truncate">{CONTACT_INFO.email}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Phone className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{CONTACT_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <MapPin className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{CONTACT_INFO.location}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 mt-8 w-full">
          <Link to="/contact" 
             className="flex-1 bg-white text-slate-800 hover:bg-slate-100 font-semibold 
                        py-3 px-4 rounded-xl text-center transition-all duration-300 
                        hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            Hubungi Saya
          </Link>
          <a href="/cv-saya" 
             className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 
                        text-white font-semibold py-3 px-4 rounded-xl transition-all 
                        duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            <Download className="w-4 h-4" />
            CV
          </a>
        </div>
      </div>
    </div>
  );
};
