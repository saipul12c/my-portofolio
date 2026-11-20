import { motion } from "framer-motion";
import { useState, useRef, useEffect, memo } from "react";
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

const ContactForm = memo(({ formAnim }) => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [emailValidation, setEmailValidation] = useState(null);
  const [rateLimitStatus, setRateLimitStatus] = useState(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaVerifying, setRecaptchaVerifying] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const validationTimeoutRef = useRef(null);
  const { showRecaptcha, hideRecaptcha } = useRecaptcha();

  const charCount = formData.message.length;

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
            recaptcha_token: recaptchaToken || '',
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error menyimpan data:', error);
      return false;
    }
  };

  // Check rate limit status on mount and periodically
  useEffect(() => {
    setRateLimitStatus(getRateLimitStatus());
    showRecaptcha();
    
    // Load reCAPTCHA script on component mount
    const loadRecaptcha = async () => {
      if (!RECAPTCHA_SITE_KEY) {
        setRecaptchaLoaded(true);
        return;
      }

      try {
        await loadRecaptchaScript(RECAPTCHA_SITE_KEY);
        setRecaptchaLoaded(true);
      } catch {
        setRecaptchaLoaded(true);
      }
    };
    
    loadRecaptcha();
    
    // Update rate limit status every 30 seconds
    const interval = setInterval(() => {
      setRateLimitStatus(getRateLimitStatus());
    }, 30000);
    
    return () => {
      clearInterval(interval);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
      hideRecaptcha();
    };
  }, [showRecaptcha, hideRecaptcha, RECAPTCHA_SITE_KEY]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'message') {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 800);
    }
    
    // Validate email with slight debounce to avoid heavy regex on every keystroke
    if (name === 'email') {
      if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
      
      if (value) {
        validationTimeoutRef.current = setTimeout(() => {
          setEmailValidation(verifyEmail(value));
        }, 300);
      } else {
        setEmailValidation(null);
      }
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
          token = await executeRecaptcha('submit_contact_form');
          if (validateRecaptchaTokenFormat(token)) {
            recaptchaSuccess = true;
            setRecaptchaToken(token);
          }
        } catch {
          // Continue without token if recaptcha fails
        } finally {
          setRecaptchaVerifying(false);
        }
      }

      // 🚀 Performance optimization: Dynamically import emailjs only when submitting
      const emailjsModule = await import("emailjs-com");
      const emailjs = emailjsModule.default || emailjsModule;

      // Send email
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
          <CheckCircle2 className="text-green-500" size={18} />
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
        recaptcha_success: recaptchaSuccess,
        timestamp: Date.now()
      });
      
      setRateLimitStatus(getRateLimitStatus());

      // Reset form
      setFormData({ name: "", email: "", message: "" });
      setEmailValidation(null);
      setRecaptchaToken(null);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="text-red-500" size={18} />
          <span>Ups 😢, gagal mengirim pesan! Silakan coba lagi.</span>
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
      {...formAnim}
      onSubmit={handleSubmit}
      className="relative bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 w-full max-w-full mx-auto space-y-4 sm:space-y-6 hover:border-cyan-500/40 transition-colors duration-300"
      style={{
        isolation: 'isolate',
        transform: 'translateZ(0)',
      }}
    >
      {[
        { 
          label: "Nama Lengkap", 
          name: "name", 
          type: "text", 
          icon: <User size={18} />, 
          placeholder: "Masukkan nama Anda", 
          autoComplete: "name" 
        },
        { 
          label: "Alamat Email", 
          name: "email", 
          type: "email", 
          icon: <Mail size={18} />, 
          placeholder: "contoh@domain.com", 
          autoComplete: "email", 
          inputMode: "email" 
        }
      ].map((field) => (
        <div key={field.name} className="relative group">
          <label className="absolute -top-2.5 left-3 sm:left-4 bg-slate-800 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-cyan-300 rounded-full border border-cyan-500/30 shadow-sm z-10">
            {field.label}
          </label>
          <div className="flex items-center border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all duration-200 group-hover:border-cyan-500/30 bg-white/5">
            <span className="text-cyan-400 mr-2.5 flex-shrink-0">{field.icon}</span>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              autoComplete={field.autoComplete}
              inputMode={field.inputMode}
              required
              className="w-full bg-transparent outline-none text-sm sm:text-base text-white placeholder-gray-500 font-medium"
            />
          </div>
          
          {/* Email validation indicator */}
          {field.name === 'email' && emailValidation && formData.email && (
            <div className={`mt-1.5 text-xs flex items-center gap-1.5 ${
              emailValidation.isSpam ? 'text-red-400' :
              emailValidation.isTrusted ? 'text-green-400' :
              emailValidation.isCorporate ? 'text-blue-400' :
              'text-orange-400'
            }`}>
              {emailValidation.isSpam ? (
                <>
                  <ShieldAlert size={13} className="shrink-0" />
                  <span>Email disposable/spam tidak diperbolehkan</span>
                </>
              ) : emailValidation.isTrusted ? (
                <>
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>Email terverifikasi & aman</span>
                </>
              ) : emailValidation.isCorporate ? (
                <>
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>Email korporat valid</span>
                </>
              ) : (
                <>
                  <AlertCircle size={13} className="shrink-0" />
                  <span>Email valid tapi belum terverifikasi</span>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Message Field */}
      <div className="relative group">
        <label className="absolute -top-2.5 left-3 sm:left-4 bg-slate-800 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-cyan-300 rounded-full border border-cyan-500/30 shadow-sm z-10">
          Pesan Anda
        </label>
        <div className="flex items-start border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all duration-200 group-hover:border-cyan-500/30 bg-white/5">
          <MessageSquare className="text-cyan-400 mt-1 mr-2.5 flex-shrink-0" size={18} />
          <div className="flex-1">
            <textarea
              name="message"
              placeholder="Ceritakan tentang proyek, ide, atau pertanyaan Anda..."
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              maxLength={500}
              className="w-full bg-transparent outline-none resize-none text-sm sm:text-base text-white placeholder-gray-500 font-medium"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-xs">
              <div className="text-cyan-400 text-[11px]">
                {isTyping && <span>Sedang mengetik...</span>}
              </div>
              <div className={`text-[11px] font-medium ${charCount >= 480 ? 'text-orange-400' : 'text-gray-400'}`}>
                {charCount}/500 karakter
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Rate Limit Status */}
      {(rateLimitStatus || RECAPTCHA_SITE_KEY) && (
        <div 
          className={`p-2.5 sm:p-3 rounded-xl border transition-colors ${
            rateLimitStatus?.blocked 
              ? 'bg-red-950/30 border-red-800/50' 
              : 'bg-slate-800/40 border-white/5'
          }`}
        >
          <div className="space-y-1.5">
            {rateLimitStatus && (
              <div className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-medium ${rateLimitStatus.blocked ? 'text-red-400' : 'text-gray-300'}`}>
                {rateLimitStatus.blocked ? <ShieldAlert size={13} /> : <Clock size={13} className="text-cyan-400" />}
                <span>{rateLimitStatus.message || `Sisa kirim: ${rateLimitStatus.remaining.minute}/mnt, ${rateLimitStatus.remaining.hour}/jam`}</span>
              </div>
            )}

            {RECAPTCHA_SITE_KEY && (
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium border-t border-white/5 pt-1.5">
                {recaptchaVerifying ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-cyan-400" />
                    <span className="text-cyan-300">Verifikasi keamanan...</span>
                  </>
                ) : recaptchaToken ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">✓ Keamanan terverifikasi</span>
                  </>
                ) : (
                  <>
                    <Shield size={13} className="text-cyan-400" />
                    <span className="text-gray-300">{recaptchaLoaded ? '✓ Dilindungi anti-spam reCAPTCHA' : 'Memuat proteksi...'}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Button - Fast CSS hover animation, zero JS animation loop overhead */}
      <button
        type="submit"
        disabled={loading || (rateLimitStatus && rateLimitStatus.blocked) || (RECAPTCHA_SITE_KEY && !recaptchaLoaded)}
        className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 flex justify-center items-center gap-2 relative overflow-hidden group text-sm sm:text-base active:scale-[0.99] touch-manipulation ${
          loading || (rateLimitStatus && rateLimitStatus.blocked) || (RECAPTCHA_SITE_KEY && !recaptchaLoaded) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {/* Hardware-accelerated CSS shimmer on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
        
        {loading ? (
          <>
            <Loader2 className="animate-spin relative z-10" size={18} /> 
            <span className="relative z-10">Mengirim...</span>
          </>
        ) : (
          <>
            <Send size={18} className="relative z-10 group-hover:translate-x-0.5 transition-transform" /> 
            <span className="relative z-10">Kirim Pesan</span>
          </>
        )}
      </button>

      {/* Badges / Guarantees */}
      <div className="pt-3 sm:pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-amber-400 shrink-0" />
            <span>Respon &lt; 24 jam</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-emerald-400 shrink-0" />
            <span>Privasi terjaga</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-blue-400 shrink-0" />
            <span>Konsultasi gratis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-rose-400 shrink-0" />
            <span>Tersedia remote</span>
          </div>
        </div>
      </div>
    </motion.form>
  );
});

ContactForm.displayName = "ContactForm";

export default ContactForm;
