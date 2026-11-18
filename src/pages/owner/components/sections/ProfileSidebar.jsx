import React from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  MapPin, 
  Download, 
  Compass, 
  Send, 
  ShieldCheck, 
  GraduationCap, 
  ExternalLink,
  MessageCircle,
  Sparkles
} from "lucide-react";
import { FaGithub, FaInstagram, FaTiktok, FaThreads } from "react-icons/fa6";
import { Avatar } from "../ui/Avatar";
import { OWNER_FACTS } from "../../utils/constants";

/**
 * ProfileSidebar component - sleek executive card displaying owner identity, verified credentials & contact
 */
export const ProfileSidebar = ({ profile = {}, initials = "SM", counts = {} }) => {
  return (
    <div className="bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800/90 rounded-2xl p-6 lg:p-7 text-white shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Avatar & Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar initials={initials} />

          <div className="flex items-center gap-1.5 mt-4">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {profile.name || OWNER_FACTS.name}
            </h2>
            <ShieldCheck className="w-5 h-5 text-cyan-400 fill-cyan-400/20" title="Terverifikasi" />
          </div>

          <p className="text-xs font-semibold text-cyan-400 mt-1 uppercase tracking-wider">
            {OWNER_FACTS.role}
          </p>

          <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
            {OWNER_FACTS.academicStatus}
          </p>

          {/* Availability Status */}
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{OWNER_FACTS.statusAvailability}</span>
          </div>
        </div>

        {/* Quick Counters */}
        <div className="grid grid-cols-2 gap-2.5 my-5">
          <Link
            to="/projects"
            className="p-2.5 bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl text-center transition-all group"
          >
            <div className="text-lg font-bold text-white group-hover:text-cyan-300">
              {counts.projects || 0}+
            </div>
            <div className="text-[11px] text-slate-400">Proyek Web</div>
          </Link>
          <Link
            to="/testimoni"
            className="p-2.5 bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 rounded-xl text-center transition-all group"
          >
            <div className="text-lg font-bold text-white group-hover:text-emerald-300">
              {counts.testimonials || 0}+
            </div>
            <div className="text-[11px] text-slate-400">Testimoni</div>
          </Link>
          <Link
            to="/blog"
            className="p-2.5 bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 rounded-xl text-center transition-all group"
          >
            <div className="text-lg font-bold text-white group-hover:text-blue-300">
              {counts.blogs || 0}+
            </div>
            <div className="text-[11px] text-slate-400">Artikel Blog</div>
          </Link>
          <Link
            to="/certificates"
            className="p-2.5 bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 rounded-xl text-center transition-all group"
          >
            <div className="text-lg font-bold text-white group-hover:text-amber-300">
              {counts.certificates || 0}+
            </div>
            <div className="text-[11px] text-slate-400">Sertifikasi</div>
          </Link>
        </div>

        {/* Contact Info Chips */}
        <div className="space-y-2 text-xs">
          <a
            href={`mailto:${OWNER_FACTS.email}`}
            className="flex items-center gap-2.5 p-2.5 bg-slate-950/40 border border-slate-800/60 hover:border-cyan-500/40 rounded-xl text-slate-300 hover:text-white transition-all group"
          >
            <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">{OWNER_FACTS.email}</span>
          </a>

          <a
            href={OWNER_FACTS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2.5 bg-slate-950/40 border border-slate-800/60 hover:border-emerald-500/40 rounded-xl text-slate-300 hover:text-white transition-all group"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>{OWNER_FACTS.phone}</span>
          </a>

          <div className="flex items-center gap-2.5 p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl text-slate-300">
            <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{OWNER_FACTS.location}</span>
          </div>
        </div>

        {/* Social Icons Bar */}
        <div className="flex items-center justify-center gap-3 my-5 pt-3 border-t border-slate-800/80">
          <a
            href={OWNER_FACTS.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded-lg transition-all hover:scale-110"
          >
            <FaGithub className="w-4 h-4" />
          </a>
          <a
            href={OWNER_FACTS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-pink-400 rounded-lg transition-all hover:scale-110"
          >
            <FaInstagram className="w-4 h-4" />
          </a>
          <a
            href={OWNER_FACTS.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded-lg transition-all hover:scale-110"
          >
            <FaTiktok className="w-4 h-4" />
          </a>
          <a
            href={OWNER_FACTS.threadsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Threads"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-400 rounded-lg transition-all hover:scale-110"
          >
            <FaThreads className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Primary CTA Buttons */}
      <div className="space-y-2.5 mt-2">
        <Link
          to="/contact"
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Hubungi Langsung</span>
        </Link>
        <Link
          to="/cv-saya"
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-semibold text-xs py-3 px-4 rounded-xl border border-slate-700/80 hover:border-cyan-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Lihat & Unduh CV Digital</span>
        </Link>
        <Link
          to="/portal"
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-900/60 hover:bg-slate-800/60 text-slate-400 hover:text-cyan-300 text-xs py-2 px-3 rounded-lg border border-slate-800 transition-all"
        >
          <Compass className="w-3 h-3" />
          <span>Buka Portal Akses Terpadu</span>
        </Link>
      </div>
    </div>
  );
};
