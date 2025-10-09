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
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Maintenance from "./errors/Maintenance";

export default function Contact() {
  const isMaintenance = false;

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const saveToSpreadsheet = async (data) => {
    try {
      const res = await fetch(SHEETDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([data]),
      });
      if (!res.ok) throw new Error("Gagal menyimpan ke sheet");
    } catch (err) {
      console.error("❌ Error simpan ke Sheet:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        PUBLIC_KEY
      )
      .then(async () => {
        toast.success("Pesan berhasil dikirim 🎉", {
          position: "bottom-center",
          autoClose: 3000,
        });
        await saveToSpreadsheet(formData);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        toast.error("Ups 😢, gagal mengirim pesan!", {
          position: "bottom-center",
        });
      })
      .finally(() => setLoading(false));
  };

  if (isMaintenance) return <Maintenance />;

  // 🎬 Scroll Animation Helper
  const useScrollReveal = (delay = 0) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

    useEffect(() => {
      if (inView) controls.start("visible");
    }, [controls, inView]);

    return {
      ref,
      animate: controls,
      initial: "hidden",
      variants: {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
      },
    };
  };

  const titleAnim = useScrollReveal(0);
  const descAnim = useScrollReveal(0.2);
  const formAnim = useScrollReveal(0.4);
  const contactAnim = useScrollReveal(0.6);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-6 sm:px-10 md:px-20 py-16 bg-gradient-to-b from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <ToastContainer theme="colored" />

      {/* 🌟 Judul */}
      <motion.h1
        {...titleAnim}
        className="text-5xl sm:text-6xl font-extrabold text-purple-700 dark:text-purple-400 mb-4 text-center"
      >
        Hubungi Syaiful Mukmin 📬
      </motion.h1>

      {/* ✨ Deskripsi */}
      <motion.p
        {...descAnim}
        className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 text-center max-w-2xl"
      >
        Yuk ngobrol, kolaborasi, atau sekadar menyapa — isi form di bawah ini 👇
      </motion.p>

      {/* 📮 Form */}
      <motion.form
        {...formAnim}
        onSubmit={handleSubmit}
        className="relative bg-white/90 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-lg space-y-6 hover:shadow-purple-200 dark:hover:shadow-purple-900/40 transition-all duration-300"
      >
        {[{ label: "Nama", name: "name", type: "text", icon: <User /> },
          { label: "Email", name: "email", type: "email", icon: <Mail /> }]
          .map((field) => (
            <div key={field.name} className="relative group">
              <label className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                {field.label}
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-300 group-hover:border-purple-400 dark:group-hover:border-purple-500">
                <span className="text-gray-400 mr-3">{field.icon}</span>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={`${field.label} kamu`}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>
          ))}

        <div className="relative group">
          <label className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
            Pesan
          </label>
          <div className="flex items-start border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-300 group-hover:border-purple-400 dark:group-hover:border-purple-500">
            <MessageSquare className="text-gray-400 mt-2 mr-3" />
            <textarea
              name="message"
              placeholder="Tulis pesan kamu di sini..."
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full h-32 bg-transparent outline-none resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            ></textarea>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.96 }}
          className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex justify-center items-center ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Mengirim...
            </>
          ) : (
            <>
              <Send className="mr-2" /> Kirim Pesan
            </>
          )}
        </motion.button>
      </motion.form>

      {/* 🌐 Kontak Alternatif */}
      <motion.div
        {...contactAnim}
        className="mt-14 text-gray-700 dark:text-gray-300 text-center"
      >
        <p className="text-base sm:text-lg mb-5 font-medium">
          Atau hubungi saya lewat:
        </p>

        <div className="flex flex-wrap justify-center gap-5 mt-3 text-sm sm:text-base font-medium">
          {[
            { icon: <Mail />, label: "Email", href: "mailto:syaiful@example.com" },
            { icon: <Github />, label: "GitHub", href: "https://github.com/" },
            { icon: <Linkedin />, label: "LinkedIn", href: "https://linkedin.com/" },
            { icon: <Instagram />, label: "Instagram", href: "https://instagram.com/" },
            { icon: <Phone />, label: "WhatsApp", href: "https://wa.me/6281234567890" },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex items-center gap-2 px-4 py-2 border border-purple-300 dark:border-purple-800 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              {item.icon} {item.label}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
