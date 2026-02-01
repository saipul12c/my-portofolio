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
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { verifyEmail } from "../utils/emailValidator";
import { checkRateLimit, recordSubmission, getRateLimitStatus } from "../utils/rateLimit";
import { formatDateForSheetDB } from "../utils/formatDate";
import { executeRecaptcha, loadRecaptchaScript, validateRecaptchaTokenFormat } from "../utils/recaptcha";
import { useRecaptcha } from "../../../context/useRecaptcha";

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
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaVerifying, setRecaptchaVerifying] = useState(false);
  const messageRef = useRef(null);
  const { showRecaptcha, hideRecaptcha } = useRecaptcha();

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL;
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Function to save contact to SheetDB
  const saveToSheetDB = async (contactData) => {
    try {
      if (!SHEETDB_URL) {
        console.warn("⚠️ SHEETDB_URL tidak dikonfigurasi");
        return false;
      }

      const response = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: contactData.name,
            email: contactData.email,
            message: contactData.message,
            date: formatDateForSheetDB(),
            timestamp: new Date().toISOString(),
            recaptcha_token: recaptchaToken || '', // Simpan token untuk tracking
          }
        })
      });

      if (!response.ok) {
        console.error('❌ Gagal menyimpan :', response.status);
        return false;
      }

      console.log('✅ Data berhasil disimpan ');
      return true;
    } catch (error) {
      console.error('❌ Error menyimpan data:', error);
      return false;
    }
  };

  // Check rate limit status on mount and periodically
  useEffect(() => {
    const status = getRateLimitStatus();
    setRateLimitStatus(status);
    
    // Tandai bahwa reCAPTCHA akan ditampilkan di Contact page
    showRecaptcha();
    
    // Load reCAPTCHA script on component mount
    const loadRecaptcha = async () => {
      if (!RECAPTCHA_SITE_KEY) {
        console.warn('⚠️ VITE_RECAPTCHA_SITE_KEY tidak dikonfigurasi - reCAPTCHA disabled');
        setRecaptchaLoaded(true); // Allow form without reCAPTCHA
        return;
      }

      try {
        await loadRecaptchaScript(RECAPTCHA_SITE_KEY);
        console.log('✅ reCAPTCHA script loaded successfully');
        setRecaptchaLoaded(true);
      } catch (error) {
        console.error('❌ Failed to load reCAPTCHA:', error);
        // Tetap izinkan form submit tanpa reCAPTCHA
        setRecaptchaLoaded(true);
        toast.warn('Verifikasi keamanan tidak tersedia. Silakan coba lagi nanti.', {
          position: "bottom-center",
          autoClose: 3000
        });
      }
    };
    
    loadRecaptcha();
    
    // Update rate limit status every 30 seconds
    const interval = setInterval(() => {
      const newStatus = getRateLimitStatus();
      setRateLimitStatus(newStatus);
    }, 30000);
    
    return () => {
      clearInterval(interval);
      hideRecaptcha();
    };
  }, [showRecaptcha, hideRecaptcha, RECAPTCHA_SITE_KEY]);

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
      let token = null;
      let recaptchaSuccess = false;

      // Execute reCAPTCHA v3 if site key is configured and script is loaded
      if (RECAPTCHA_SITE_KEY && recaptchaLoaded) {
        setRecaptchaVerifying(true);
        try {
          console.log('🔄 Starting reCAPTCHA verification...');
          token = await executeRecaptcha('submit_contact_form');
          
          // Basic validation di frontend (hanya cek format)
          if (validateRecaptchaTokenFormat(token)) {
            recaptchaSuccess = true;
            setRecaptchaToken(token);
            console.log('✅ reCAPTCHA token obtained and format validated');
          } else {
            console.warn('⚠️ reCAPTCHA token format invalid');
            // Tetap lanjut, tapi tampilkan warning
            toast.warn('Verifikasi keamanan tidak optimal. Silakan coba lagi.', {
              position: "bottom-center",
              autoClose: 3000
            });
          }
        } catch (error) {
          console.error('❌ reCAPTCHA Error:', error.message);
          // Jangan blokir form submission jika reCAPTCHA gagal
          // Hanya tampilkan warning dan lanjutkan tanpa token
          toast.warn('Verifikasi keamanan gagal. Mengirim tanpa proteksi tambahan.', {
            position: "bottom-center",
            autoClose: 3000
          });
          // Lanjutkan tanpa token
        } finally {
          setRecaptchaVerifying(false);
        }
      } else if (RECAPTCHA_SITE_KEY && !recaptchaLoaded) {
        toast.warn('Sedang memuat verifikasi keamanan. Silakan tunggu...', {
          position: "bottom-center",
          autoClose: 2000
        });
        setLoading(false);
        return;
      }

      // Send email with or without token
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          recaptcha_token: token || '',
          recaptcha_success: recaptchaSuccess,
          timestamp: new Date().toISOString(),
        },
        PUBLIC_KEY
      );

      // Save data to SheetDB
      await saveToSheetDB(formData);

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-500" size={20} />
          <span>Pesan berhasil dikirim! 🎉</span>
          {recaptchaSuccess && (
            <span className="text-xs text-green-600">✓ Dilindungi reCAPTCHA</span>
          )}
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
        recaptcha_success: recaptchaSuccess,
        timestamp: Date.now()
      });
      
      // Update rate limit status
      const newStatus = getRateLimitStatus();
      setRateLimitStatus(newStatus);

      // Reset form
      setFormData({ name: "", email: "", message: "" });
      setCharCount(0);
      setEmailValidation(null);
      setRecaptchaToken(null);
      
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
      console.error("Form submission error:", error);
      
      let errorMessage = "Ups 😢, gagal mengirim pesan!";
      if (error.text && error.text.includes("reCAPTCHA")) {
        errorMessage = "Verifikasi keamanan gagal. Silakan refresh halaman dan coba lagi.";
      }
      
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="text-red-500" size={20} />
          <span>{errorMessage}</span>
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
      className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 backdrop-blur-2xl border-2 border-white/40 dark:border-gray-700/50 shadow-3xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-lg md:max-w-xl mx-auto space-y-5 sm:space-y-6 md:space-y-8 hover:shadow-4xl transition-all duration-700"
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
          <label className="absolute -top-2 sm:-top-3 left-3 sm:left-4 bg-white dark:bg-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-bold text-purple-600 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-800 shadow-sm z-10">
            {field.label}
          </label>
          <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20 transition-all duration-300 group-hover:border-purple-400 dark:group-hover:border-purple-500 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
            <span className="text-purple-500 mr-2 sm:mr-4 flex-shrink-0">{field.icon}</span>
            <input
              type={field.type}
              name={field.name}
              placeholder={`Masukkan ${field.label.toLowerCase()}`}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-medium"
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
        <label className="absolute -top-2 sm:-top-3 left-3 sm:left-4 bg-white dark:bg-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-bold text-purple-600 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-800 shadow-sm z-10">
          Pesan Anda
        </label>
        <div className="flex items-start border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20 transition-all duration-300 group-hover:border-purple-400 dark:group-hover:border-purple-500 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
          <MessageSquare className="text-purple-500 mt-1 mr-2 sm:mr-4 flex-shrink-0" size={20} />
          <div className="flex-1">
            <textarea
              name="message"
              placeholder="Ceritakan tentang project, ide, atau pertanyaan Anda... Saya sangat antusias mendengarnya! 🚀"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-transparent outline-none resize-none text-sm sm:text-base text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-medium"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600 gap-2 sm:gap-0">
              <div className="flex items-center gap-2 text-xs">
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
        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
            <Clock size={14} className="flex-shrink-0" />
            <span className="break-words">
              Sisa: {rateLimitStatus.remaining.minute}/menit, {rateLimitStatus.remaining.hour}/jam, {rateLimitStatus.remaining.day}/hari
            </span>
          </div>
        </div>
      )}
      
      {rateLimitStatus && rateLimitStatus.blocked && (
        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span className="break-words">{rateLimitStatus.message}</span>
          </div>
        </div>
      )}

      {/* reCAPTCHA Status Indicator with Animation */}
      {RECAPTCHA_SITE_KEY && (
        <motion.div 
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 sm:mt-3 p-3 sm:p-4 rounded-lg border transition-all duration-300 ${
            recaptchaVerifying 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
              : recaptchaToken
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            {recaptchaVerifying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                >
                  <Shield size={14} />
                </motion.div>
                <span className="text-yellow-700 dark:text-yellow-300">
                  Sedang memverifikasi keamanan Anda...
                </span>
              </>
            ) : recaptchaToken ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-green-600 dark:text-green-400 flex-shrink-0"
                >
                  <CheckCircle2 size={14} />
                </motion.div>
                <span className="text-green-700 dark:text-green-300">
                  ✓ Verifikasi berhasil! Form siap dikirim
                </span>
              </>
            ) : recaptchaLoaded ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                >
                  <Shield size={14} />
                </motion.div>
                <span className="text-blue-700 dark:text-blue-300">
                  ✓ Form dilindungi dan terhindar dari spam
                </span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                >
                  <Shield size={14} />
                </motion.div>
                <span className="text-blue-700 dark:text-blue-300">
                  ⏳ Memuat verifikasi keamanan...
                </span>
              </>
            )}
          </div>

          {/* Progress Bar untuk Verifikasi */}
          {recaptchaVerifying && (
            <motion.div
              className="mt-2 sm:mt-3 h-1 bg-yellow-200 dark:bg-yellow-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}

          {/* Additional Info */}
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            <small>
              {recaptchaVerifying 
                ? 'Jangan refresh atau menutup halaman selama proses berlangsung...'
                : recaptchaToken
                ? 'Token Berhasil Diperoleh. Silahkan kirim pesan dan tunggu admin merespon.'
                : 'Keamanan data Anda adalah prioritas kami'}
            </small>
          </div>
        </motion.div>
      )}

      {/* Enhanced Submit Button */}
      <motion.button
        type="submit"
        disabled={loading || (rateLimitStatus && rateLimitStatus.blocked) || (RECAPTCHA_SITE_KEY && !recaptchaLoaded)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-white shadow-2xl transition-all duration-500 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex justify-center items-center gap-2 sm:gap-3 relative overflow-hidden text-sm sm:text-base ${
          loading || (rateLimitStatus && rateLimitStatus.blocked) || (RECAPTCHA_SITE_KEY && !recaptchaLoaded) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl'
        }`}
        title={RECAPTCHA_SITE_KEY && !recaptchaLoaded ? 'Menunggu verifikasi keamanan...' : recaptchaVerifying ? 'Sedang memverifikasi keamanan...' : ''}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-100, 100] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
        
        {recaptchaVerifying ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="relative z-10"
            >
              <Shield size={20} />
            </motion.div>
            <span className="relative z-10">Memverifikasi...</span>
          </>
        ) : loading ? (
          <>
            <Loader2 className="animate-spin relative z-10" size={20} /> 
            <span className="relative z-10">Mengirim...</span>
          </>
        ) : (
          <>
            <Send size={20} className="relative z-10" /> 
            <span className="relative z-10">Kirim Pesan</span>
          </>
        )}
      </motion.button>

      {/* Enhanced Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700"
      >
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-500 dark:text-gray-400 p-2 sm:p-0">
            <Zap size={14} className="text-yellow-500 flex-shrink-0" />
            <span>Respon 24 jam</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-500 dark:text-gray-400 p-2 sm:p-0">
            <Shield size={14} className="text-green-500 flex-shrink-0" />
            <span>Privasi aman</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-500 dark:text-gray-400 p-2 sm:p-0">
            <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
            <span>Gratis konsultasi</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-500 dark:text-gray-400 p-2 sm:p-0">
            <MapPin size={14} className="text-red-500 flex-shrink-0" />
            <span>Remote work</span>
          </div>
        </div>
        
        {/* Disclaimer untuk reCAPTCHA frontend-only */}
        {RECAPTCHA_SITE_KEY && (
          <div className="mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-400 border-t pt-3 px-2 sm:px-0">
            <small>
              <strong>Note:</strong> Tunggulah Balasan Admin, Admin akan segera membalas Email Anda Secepatnya.
            </small>
          </div>
        )}
      </motion.div>
    </motion.form>
  );
};

export default ContactForm;