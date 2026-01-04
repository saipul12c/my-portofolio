import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import {
  Loader2,
  Mail,
  User,
  MessageSquare,
  Send,
  Zap,
  Shield,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { verifyEmail } from "../utils/emailValidator";
import { checkRateLimit, recordSubmission, getRateLimitStatus } from "../utils/rateLimit";

const ContactForm = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [emailValidation, setEmailValidation] = useState(null);
  const [rateLimitStatus, setRateLimitStatus] = useState(null);
  const messageRef = useRef(null);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Check rate limit status on mount and periodically
  useEffect(() => {
    const status = getRateLimitStatus();
    setRateLimitStatus(status);
    
    // Update status every 30 seconds
    const interval = setInterval(() => {
      const newStatus = getRateLimitStatus();
      setRateLimitStatus(newStatus);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (e.target.name === 'message') {
      setCharCount(e.target.value.length);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
    
    // Validate email on change
    if (e.target.name === 'email' && e.target.value) {
      const validation = verifyEmail(e.target.value);
      setEmailValidation(validation);
    } else if (e.target.name === 'email') {
      setEmailValidation(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check rate limit first
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      toast.error(rateLimitCheck.message, {
        position: "bottom-center",
        autoClose: 5000,
        icon: <ShieldAlert />
      });
      return;
    }
    
    // Validate email thoroughly
    if (!emailValidation || !emailValidation.isValid) {
      toast.error("Email tidak valid! Silakan periksa kembali alamat email Anda.", {
        position: "bottom-center"
      });
      return;
    }
    
    if (emailValidation.isSpam) {
      toast.error("Email disposable/temporary tidak diperbolehkan!", {
        position: "bottom-center"
      });
      return;
    }
    
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

      // Record submission for rate limiting
      recordSubmission({
        email: formData.email,
        name: formData.name,
        timestamp: Date.now()
      });
      
      // Update rate limit status
      const newStatus = getRateLimitStatus();
      setRateLimitStatus(newStatus);

      setFormData({ name: "", email: "", message: "" });
      setCharCount(0);
      setEmailValidation(null);
      
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

  return (
    <motion.form
      onSubmit={handleSubmit}
      ref={messageRef}
      className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 backdrop-blur-2xl border-2 border-white/40 dark:border-gray-700/50 shadow-3xl rounded-3xl p-8 w-full max-w-lg mx-auto space-y-8 hover:shadow-4xl transition-all duration-700"
      style={{
        backgroundImage: 'radial-gradient(circle at top right, rgba(120, 119, 198, 0.1), transparent 50%), radial-gradient(circle at bottom left, rgba(255, 119, 198, 0.1), transparent 50%)'
      }}
    >
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
          
          {/* Email validation indicator */}
          {field.name === 'email' && emailValidation && formData.email && (
            <div className={`mt-2 text-xs flex items-center gap-2 ${
              emailValidation.isSpam ? 'text-red-500' :
              emailValidation.isTrusted ? 'text-green-500' :
              emailValidation.isCorporate ? 'text-blue-500' :
              'text-orange-500'
            }`}>
              {emailValidation.isSpam ? (
                <>
                  <ShieldAlert size={14} />
                  Email disposable tidak diperbolehkan
                </>
              ) : emailValidation.isTrusted ? (
                <>
                  <CheckCircle2 size={14} />
                  Email terverifikasi dan terpercaya
                </>
              ) : emailValidation.isCorporate ? (
                <>
                  <CheckCircle2 size={14} />
                  Email korporat valid
                </>
              ) : (
                <>
                  <AlertCircle size={14} />
                  Email valid tapi belum terverifikasi
                </>
              )}
            </div>
          )}
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

      {/* Rate Limit Status Indicator */}
      {rateLimitStatus && !rateLimitStatus.blocked && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
            <Clock size={14} />
            <span>
              Sisa: {rateLimitStatus.remaining.minute}/menit, {rateLimitStatus.remaining.hour}/jam, {rateLimitStatus.remaining.day}/hari
            </span>
          </div>
        </div>
      )}
      
      {rateLimitStatus && rateLimitStatus.blocked && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <ShieldAlert size={14} />
            <span>{rateLimitStatus.message}</span>
          </div>
        </div>
      )}

      {/* Enhanced Submit Button */}
      <motion.button
        type="submit"
        disabled={loading || (rateLimitStatus && rateLimitStatus.blocked)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-5 rounded-2xl font-bold text-white shadow-2xl transition-all duration-500 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex justify-center items-center gap-3 relative overflow-hidden ${
          loading || (rateLimitStatus && rateLimitStatus.blocked) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl'
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
  );
};

export default ContactForm;