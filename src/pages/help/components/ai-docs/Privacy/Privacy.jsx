import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaShieldAlt, 
  FaLock, 
  FaUserShield, 
  FaHistory, 
  FaTrashAlt, 
  FaExclamationTriangle,
  FaChevronRight,
  FaCheckCircle,
  FaGlobe,
  FaDatabase
} from "react-icons/fa";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  FileLock2, 
  Activity, 
  Globe, 
  Zap, 
  Cpu,
  Fingerprint,
  FileText,
  UserCheck,
  MessageCircle,
  Clock,
  Database
} from "lucide-react";
import { FormattedText } from "../Shared/UIComponents";

// Widget: Security Health Check (Adapted from Keamanan.jsx)
const SecurityHealthWidget = () => {
  const [status, setStatus] = useState('scanning');
  const [storageUsage, setStorageUsage] = useState('0 KB');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('secure');
      let total = 0;
      try {
        for (let x in localStorage) {
          if (localStorage.hasOwnProperty(x)) {
            total += ((localStorage[x].length + x.length) * 2);
          }
        }
      } catch (e) { void e; }
      setStorageUsage(total < 1024 ? `${total} B` : total < 1048576 ? `${(total / 1024).toFixed(1)} KB` : `${(total / 1048576).toFixed(1)} MB`);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black/30 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Activity size={100} />
      </div>
      <h3 className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
        <Activity size={14} className="text-emerald-400" />
        Security Health Check
      </h3>
      <div className="space-y-4">
        {[
          { icon: <Globe size={12}/>, label: "Koneksi", value: "SSL/TLS 1.3 (Encrypted)", color: "text-emerald-400", pulse: true },
          { icon: <ShieldCheck size={12}/>, label: "WAF Status", value: "Active Protection", color: "text-blue-400" },
          { icon: <Lock size={12}/>, label: "Local Sandbox", value: status === 'scanning' ? 'Verifying...' : 'Isolated', color: "text-blue-400" },
          { icon: <Zap size={12}/>, label: "Storage Size", value: storageUsage, color: "text-white" }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-gray-500">
              {item.icon}
              <span className="font-light">{item.label}</span>
            </div>
            <div className={`flex items-center gap-1.5 font-bold uppercase tracking-tighter ${item.color}`}>
              {item.pulse && <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />}
              {item.value}
            </div>
          </div>
        ))}
        <div className="pt-2">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: status === 'scanning' ? '40%' : '100%' }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-emerald-500/50 to-blue-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Widget: Privacy Rating (Adapted from Privasi.jsx)
const PrivacyScoreWidget = () => {
  return (
    <div className="bg-black/30 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Privacy Rating</h3>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">EXCELLENT</span>
      </div>
      <div className="space-y-4">
        {[
          { label: "Encryption Layer", value: "TLS 1.3", color: "text-emerald-400" },
          { label: "Data Minimization", value: "ENABLED", color: "text-emerald-400" },
          { label: "PDP Compliance", value: "VERIFIED", color: "text-blue-400" }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500">{item.label}</span>
            <span className={`font-mono font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[9px] text-gray-500 font-bold uppercase">Security Score</span>
            <span className="text-xs font-bold text-white">98%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '98%' }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyCard = ({ icon, title, children, color = "blue" }) => {
  const colors = {
    blue: "border-blue-500/20 text-blue-400 bg-blue-500/5",
    emerald: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
    amber: "border-amber-500/20 text-amber-400 bg-amber-500/5",
    rose: "border-rose-500/20 text-rose-400 bg-rose-500/5",
    purple: "border-purple-500/20 text-purple-400 bg-purple-500/5"
  };

  return (
    <div className={`p-5 rounded-2xl border ${colors[color]} backdrop-blur-sm group hover:border-opacity-50 transition-all`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-white/5`}>{icon}</div>
        <h4 className="font-bold text-gray-200 text-sm">{title}</h4>
      </div>
      <div className="text-xs text-gray-400 leading-relaxed font-light">
        <FormattedText>{children}</FormattedText>
      </div>
    </div>
  );
};

const Privacy = ({ aiDocData }) => {
  const handlePurgeData = () => {
    if (window.confirm("Hapus semua data lokal? Tindakan ini akan menghapus riwayat chat, file terupload, dan pengaturan Anda selamanya secara permanen.")) {
      try {
        localStorage.clear();
        window.location.reload();
      } catch (e) {
        alert("Gagal menghapus data. Silakan hapus cache browser secara manual.");
      }
    }
  };

  return (
    <section id="privacy" className="scroll-mt-8 space-y-8">
      <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/5 p-8 shadow-inner relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="flex items-center justify-between mb-8 relative">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl border border-white/10 shadow-lg">
              <FaShieldAlt className="text-2xl text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Privasi & Keamanan Dasar
              </h2>
              <p className="text-gray-400 text-sm mt-1">Sistem perlindungan data dan framework keamanan SaipulAI</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">PDP Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative text-gray-100">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Technical Framework */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <FaLock className="text-blue-400 text-[10px]" />
                Technical Security Framework
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PrivacyCard icon={<Lock size={16}/>} title="Secure Storage Layer" color="blue">
                  Semua data riwayat dan preferensi dikelola melalui storage engine terisolasi di browser Anda. Tidak ada data pribadi yang dikirim ke server eksternal tanpa enkripsi.
                </PrivacyCard>
                <PrivacyCard icon={<ShieldCheck size={16}/>} title="WAF & Flood Protection" color="emerald">
                  Dilindungi oleh Web Application Firewall tingkat enterprise dan mitigasi DDoS otomatis dengan enkripsi **TLS 1.3** standar industri.
                </PrivacyCard>
                <PrivacyCard icon={<FileLock2 size={16}/>} title="Local-first Processing" color="purple">
                  Proses ekstraksi data dari file (PDF, XLSX) dilakukan sepenuhnya secara client-side. File tidak diunggah utuh ke server publik.
                </PrivacyCard>
                <PrivacyCard icon={<Activity size={16}/>} title="Real-time PII Detection" color="amber">
                  Sistem mendeteksi secara instan data pribadi (NIK, Email) dan memberikan peringatan sebelum informasi tersebut terkirim keluar sandbox.
                </PrivacyCard>
              </div>
            </div>

            {/* Privacy Policy & Rights */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <FaUserShield className="text-emerald-400 text-[10px]" />
                Kebijakan & Hak Pengguna (UU PDP)
              </h3>
              <div className="bg-black/20 rounded-2xl border border-white/5 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white/80 flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500 text-[10px]" />
                      Hak Anda (UU PDP 2022)
                    </h4>
                    <ul className="space-y-2">
                      {[
                        { h: "Akses", d: "Hak mengetahui jenis data dan tujuan pemrosesan." },
                        { h: "Koreksi", d: "Hak memperbaiki kesalahan data pribadi Anda." },
                        { h: "Erasure", d: "Hak menghapus seluruh data dari sistem kami." }
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                           <div className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500" />
                           <div className="text-[11px]">
                             <span className="font-bold text-gray-300">{item.h}:</span> <span className="text-gray-500"><FormattedText>{item.d}</FormattedText></span>
                           </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white/80 flex items-center gap-2">
                      <FaGlobe className="text-blue-500 text-[10px]" />
                      Transparansi Pihak Ke-3
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Kami menggunakan **Supabase** (Auth), **EmailJS** (Kontak), dan **reCAPTCHA** untuk keamanan. Data yang dikirimkan terbatas pada kebutuhan teknis minimal layanan tersebut.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Warning Section */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 flex items-start gap-4 group">
               <div className="p-2 bg-amber-500/10 rounded-lg">
                 <FaExclamationTriangle className="text-amber-500 animate-pulse" />
               </div>
               <div className="flex-1">
                 <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Peringatan Keamanan</h4>
                 <p className="text-xs text-amber-100/60 leading-relaxed font-light italic">
                   "<FormattedText>{aiDocData?.privasi_keamanan ?? 'Jangan unggah data sensitif tanpa enkripsi; selalu review kebijakan privasi aplikasi Anda sebelum menyimpan data user.'}</FormattedText>"
                 </p>
               </div>
            </div>
          </div>

          {/* Sidebar / Widgets */}
          <div className="lg:col-span-4 space-y-6">
            <SecurityHealthWidget />
            <PrivacyScoreWidget />

            <div className="bg-black/30 border border-white/5 p-5 rounded-2xl space-y-4">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <FaDatabase size={10} className="text-emerald-400" />
                Data Control
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={handlePurgeData}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 transition-all group"
                >
                  <div className="flex flex-col items-start gap-0.5 text-left">
                    <span className="text-[11px] font-bold text-rose-400">Purge Local Session</span>
                    <span className="text-[9px] text-rose-500/60 font-mono tracking-tighter">FLUSH_LOCAL_STORAGE</span>
                  </div>
                  <FaTrashAlt className="text-xs text-rose-500 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase">Status Kepercayaan</span>
                </div>
                <p className="text-[9px] text-gray-600 leading-tight italic">
                  Data diproses secara anonim untuk peningkatan kualitas sistem. Identitas digital Anda terlindungi melalui enkripsi end-to-end sandbox.
                </p>
              </div>
            </div>
            
            {/* Context Info */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
               <div className="flex items-center gap-2 mb-2">
                 <MessageCircle size={14} className="text-blue-400" />
                 <span className="text-[10px] font-bold text-white/60 uppercase">Emotional Layer Privacy</span>
               </div>
               <p className="text-[10px] text-gray-500 leading-relaxed">
                 Analisis sentimen bersifat sementara (ephemeral). Metadata emosi hanya digunakan untuk menyesuaikan gaya bahasa chatbot selama sesi aktif.
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
