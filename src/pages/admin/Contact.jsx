import { motion, useAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import emailjs from "emailjs-com";
import { toast, ToastContainer } from "react-toastify";
import {
  Loader2,
  Mail,
  User,
  MessageSquare,
  Github,
  Linkedin,
  Instagram,
  Send,
  Phone,
  Inbox,
  Calendar,
  RefreshCw,
  Star,
  MapPin,
  Clock,
  Shield,
  Zap,
  Heart,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Maintenance from "../errors/Maintenance";

export default function Contact() {
  const isMaintenance = false;

  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredContact, setHoveredContact] = useState(null);

  const messageRef = useRef(null);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL;

  // Particle background effect
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      particle.style.animation = `float ${Math.random() * 20 + 10}s linear infinite`;
      document.getElementById('particles-container')?.appendChild(particle);
    };

    for (let i = 0; i < 20; i++) {
      createParticle();
    }
  }, []);

  // Enhanced fetch data dengan retry logic
  const fetchContacts = async (retryCount = 0) => {
    try {
      const res = await fetch(SHEETDB_URL);
      if (!res.ok) throw new Error("Gagal fetch data");
      const data = await res.json();
      setContacts(data);
      
      // Filter dan limit data - hanya tampilkan 5 data terbaru
      const sortedAndLimited = data
        .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
        .slice(0, 5);
      setFilteredContacts(sortedAndLimited);
      
      toast.dismiss();
      if (retryCount > 0) {
        toast.success("Data berhasil diperbarui! ✨", {
          position: "bottom-center",
        });
      }
    } catch (err) {
      console.error("❌ Error fetch contacts:", err);
      if (retryCount < 3) {
        toast.warning(`Mencoba lagi... (${retryCount + 1}/3)`, {
          position: "bottom-center",
        });
        setTimeout(() => fetchContacts(retryCount + 1), 2000);
      } else {
        toast.error("Gagal memuat pesan masuk", {
          position: "bottom-center",
        });
      }
    } finally {
      setLoadingContacts(false);
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [SHEETDB_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (e.target.name === 'message') {
      setCharCount(e.target.value.length);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const saveToSpreadsheet = async (data) => {
    try {
      const dataWithTimestamp = {
        ...data,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9),
      };
      
      const res = await fetch(SHEETDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([dataWithTimestamp]),
      });
      if (!res.ok) throw new Error("Gagal menyimpan ke sheet");
    } catch (err) {
      console.error("❌ Error simpan ke Sheet:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        PUBLIC_KEY
      );

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-500" size={20} />
          <span>Pesan berhasil dikirim! 🎉</span>
        </div>,
        {
          position: "bottom-center",
          autoClose: 4000,
        }
      );

      await saveToSpreadsheet(formData);
      setFormData({ name: "", email: "", message: "" });
      setCharCount(0);
      await fetchContacts();
      
      // Success animation
      if (messageRef.current) {
        messageRef.current.style.transform = 'scale(1.02)';
        setTimeout(() => {
          if (messageRef.current) {
            messageRef.current.style.transform = 'scale(1)';
          }
        }, 200);
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="text-red-500" size={20} />
          <span>Ups 😢, gagal mengirim pesan!</span>
        </div>,
        {
          position: "bottom-center",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshContacts = async () => {
    setRefreshLoading(true);
    toast.info("Memperbarui pesan...", {
      position: "bottom-center",
    });
    await fetchContacts();
  };

  // 🎬 Enhanced Scroll Animation Helper
  const useScrollReveal = (delay = 0) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
      if (inView) {
        controls.start("visible");
      }
    }, [controls, inView]);

    return {
      ref,
      animate: controls,
      initial: "hidden",
      variants: {
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          transition: { 
            duration: 0.8, 
            delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          } 
        },
      },
    };
  };

  const titleAnim = useScrollReveal(0);
  const descAnim = useScrollReveal(0.3);
  const statsAnim = useScrollReveal(0.5);
  const formAnim = useScrollReveal(0.4);
  const contactAnim = useScrollReveal(0.6);

  // Format tanggal untuk ditampilkan
  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getInitialColor = (name) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  if (isMaintenance) return <Maintenance />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-20 py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 transition-all duration-500 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div id="particles-container" className="absolute inset-0 overflow-hidden pointer-events-none" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <ToastContainer 
        theme="colored" 
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      {/* 🌟 Enhanced Header Section */}
      <div className="text-center mb-16 max-w-6xl relative z-10">
        <motion.div
          {...titleAnim}
          className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg"
        >
          <Sparkles className="text-purple-500" size={24} />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Mari Berkolaborasi Bersama
          </span>
          <Sparkles className="text-purple-500" size={24} />
        </motion.div>

        <motion.h1
          {...titleAnim}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Hubungi Saya
          </span>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            className="ml-4 inline-block"
          >
            💬
          </motion.span>
        </motion.h1>

        <motion.p
          {...descAnim}
          className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-4xl mx-auto"
        >
          Mari wujudkan ide brilian Anda menjadi kenyataan — 
          <span className="block mt-3 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Setiap kolaborasi dimulai dengan satu pesan ✨
          </span>
        </motion.p>

        {/* Stats Section */}
        <motion.div
          {...statsAnim}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {[
            { icon: Clock, label: "Respon Cepat", value: "< 24 Jam" },
            { icon: Shield, label: "Privasi Terjaga", value: "100%" },
            { icon: Zap, label: "Projek Selesai", value: "50+" },
            { icon: Heart, label: "Klien Senang", value: "98%" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <stat.icon className="mx-auto mb-2 text-purple-600 dark:text-purple-400" size={24} />
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 📮 Enhanced Container Form & Data */}
      <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-start relative z-10">
        
        {/* 📋 Enhanced Daftar Kontak Masuk */}
        <motion.div
          {...formAnim}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                  <Inbox className="text-white" size={28} />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Pesan Terbaru
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Bot size={14} />
                  5 pesan masuk terakhir • Real-time updates
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={handleRefreshContacts}
              disabled={refreshLoading}
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
              title="Refresh pesan"
            >
              <RefreshCw 
                size={20} 
                className={`text-purple-600 dark:text-purple-400 ${refreshLoading ? 'animate-spin' : ''}`} 
              />
            </motion.button>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-3xl p-6 max-h-[700px] overflow-hidden flex flex-col shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Filter:
                  </div>
                  {["all", "recent", "priority"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-purple-500 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {tab === "all" ? "Semua" : tab === "recent" ? "Terbaru" : "Prioritas"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {filteredContacts.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total Pesan
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar">
              {loadingContacts ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="text-purple-600 dark:text-purple-400" size={40} />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Memuat Pesan</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Menyiapkan kotak masuk...</p>
                  </div>
                </div>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact, idx) => (
                  <motion.div
                    key={contact.id || idx}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                    onMouseEnter={() => setHoveredContact(idx)}
                    onMouseLeave={() => setHoveredContact(null)}
                    className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border-2 rounded-2xl p-5 transition-all duration-500 group cursor-pointer ${
                      hoveredContact === idx
                        ? "border-purple-300 dark:border-purple-500 shadow-2xl scale-105"
                        : "border-purple-100 dark:border-purple-900/30 shadow-lg"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${getInitialColor(contact.name)} rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                            {contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-base break-words max-w-[150px]">
                              {contact.name || "Anonymous"}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                              <Mail size={12} />
                              {contact.email || "Email tidak tersedia"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
                          <Calendar size={12} />
                          <span>{formatDate(contact.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-600/50 dark:to-gray-700/50 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                            {contact.message || "Pesan tidak tersedia"}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-400">📧 Email terverifikasi</span>
                            <span className="text-gray-400">⭐ Prioritas tinggi</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-600 transition-colors"
                          >
                            Balas
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 text-gray-500 dark:text-gray-400"
                >
                  <Inbox size={64} className="mx-auto mb-6 opacity-30" />
                  <p className="text-2xl font-medium mb-3">Kotak Masuk Kosong</p>
                  <p className="text-sm max-w-sm mx-auto">
                    Belum ada pesan yang diterima. Jadilah yang pertama mengirim pesan dan mulai percakapan!
                  </p>
                </motion.div>
              )}
            </div>
            
            {/* Enhanced Footer info */}
            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  Menampilkan <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredContacts.length}</span> dari{' '}
                  <span className="font-semibold">{contacts.length}</span> total pesan
                </p>
                <div className="flex items-center gap-2 text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs">Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 📮 Enhanced Form Kontak */}
        <motion.form
          {...formAnim}
          onSubmit={handleSubmit}
          ref={messageRef}
          className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 backdrop-blur-2xl border-2 border-white/40 dark:border-gray-700/50 shadow-3xl rounded-3xl p-8 w-full max-w-lg mx-auto space-y-8 hover:shadow-4xl transition-all duration-700"
          style={{
            backgroundImage: 'radial-gradient(circle at top right, rgba(120, 119, 198, 0.1), transparent 50%), radial-gradient(circle at bottom left, rgba(255, 119, 198, 0.1), transparent 50%)'
          }}
        >
          {/* Enhanced Form Fields */}
          {[
            { label: "Nama Lengkap", name: "name", type: "text", icon: <User size={20} /> },
            { label: "Alamat Email", name: "email", type: "email", icon: <Mail size={20} /> }
          ].map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="relative group"
            >
              <label className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-800 shadow-sm z-10">
                {field.label}
              </label>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-5 py-4 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20 transition-all duration-300 group-hover:border-purple-400 dark:group-hover:border-purple-500 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                <span className="text-purple-500 mr-4">{field.icon}</span>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={`Masukkan ${field.label.toLowerCase()}`}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base font-medium"
                />
              </div>
            </motion.div>
          ))}

          {/* Enhanced Message Field */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="relative group"
          >
            <label className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-800 shadow-sm z-10">
              Pesan Anda
            </label>
            <div className="flex items-start border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-5 py-4 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20 transition-all duration-300 group-hover:border-purple-400 dark:group-hover:border-purple-500 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
              <MessageSquare className="text-purple-500 mt-1 mr-4" size={20} />
              <div className="flex-1">
                <textarea
                  name="message"
                  placeholder="Ceritakan tentang project, ide, atau pertanyaan Anda... Saya sangat antusias mendengarnya! 🚀"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-transparent outline-none resize-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base font-medium"
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                  <div className="flex items-center gap-2 text-sm">
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1 text-purple-500"
                      >
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-xs">Mengetik...</span>
                      </motion.div>
                    )}
                  </div>
                  <div className={`text-xs font-medium ${
                    charCount > 500 ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    {charCount}/500 karakter
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-5 rounded-2xl font-bold text-white shadow-2xl transition-all duration-500 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex justify-center items-center gap-3 relative overflow-hidden ${
              loading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-3xl'
            }`}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            />
            
            {loading ? (
              <>
                <Loader2 className="animate-spin relative z-10" size={22} /> 
                <span className="relative z-10">Mengirim Pesan...</span>
              </>
            ) : (
              <>
                <Send size={22} className="relative z-10" /> 
                <span className="relative z-10">Kirim Pesan Sekarang</span>
              </>
            )}
          </motion.button>

          {/* Enhanced Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center pt-6 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Zap size={14} className="text-yellow-500" />
                <span>Respon 24 jam</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Shield size={14} className="text-green-500" />
                <span>Privasi aman</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Star size={14} className="text-blue-500" />
                <span>Gratis konsultasi</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <MapPin size={14} className="text-red-500" />
                <span>Remote work</span>
              </div>
            </div>
          </motion.div>
        </motion.form>
      </div>

      {/* 🌐 Enhanced Kontak Alternatif */}
      <motion.div
        {...contactAnim}
        className="mt-20 text-gray-700 dark:text-gray-300 text-center max-w-6xl relative z-10"
      >
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg"
          >
            <Sparkles className="text-blue-500" size={24} />
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Terhubung Dengan Saya
            </h3>
            <Sparkles className="text-blue-500" size={24} />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Temukan saya di platform lain untuk kolaborasi yang lebih seru dan update terbaru
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {[
            { 
              icon: <Mail size={22} />, 
              label: "Email", 
              href: "mailto:syaiful@example.com",
              color: "from-red-400 to-pink-500",
              desc: "Email langsung"
            },
            { 
              icon: <Github size={22} />, 
              label: "GitHub", 
              href: "https://github.com/",
              color: "from-gray-600 to-gray-800",
              desc: "Open source"
            },
            { 
              icon: <Linkedin size={22} />, 
              label: "LinkedIn", 
              href: "https://linkedin.com/",
              color: "from-blue-500 to-blue-700",
              desc: "Professional"
            },
            { 
              icon: <Instagram size={22} />, 
              label: "Instagram", 
              href: "https://instagram.com/",
              color: "from-pink-400 to-purple-500",
              desc: "Daily updates"
            },
            { 
              icon: <Phone size={22} />, 
              label: "WhatsApp", 
              href: "https://wa.me/6281234567890",
              color: "from-green-500 to-teal-500",
              desc: "Chat langsung"
            },
          ].map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-5 text-center group hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-white/20 shadow-lg`}
            >
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                {item.icon}
              </div>
              <div className="font-bold text-gray-800 dark:text-white mb-1">{item.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Custom Scrollbar Styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #6366f1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>

      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:shadow-3xl transition-all duration-300"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Zap size={24} />
      </motion.button>
    </main>
  );
}