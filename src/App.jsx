import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";

// 🌐 Komponen global
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedErrorPage from "./components/ProtectedErrorPage";
import { ErrorProvider } from "./context/ErrorContext";

// 🎬 Loader animasi
import Loader from "./pages/loader/loader";

// tombol bantuan
import HelpButton from "./components/HelpButton";
import Doct from "./components/helpbutton/docs/HelpDocsItem";
import FAQ from "./components/helpbutton/faq/HelpFAQItem";
import Info from "./components/helpbutton/versiWeb/HelpVersionInfo";
import InfoDetail from "./components/helpbutton/versiWeb/detail/HelpVersionDetail";
import Komit from "./components/helpbutton/komit/HelpCommitmentItem";
import DetailCommitment from "./components/helpbutton/komit/detail/DetailCommitment";

// 🛡️ Tambahan: Launch guard dan halaman launching
import LaunchGuard from "./components/LaunchGuard";
import LaunchingPage from "./pages/LaunchingPage";

// website tambahan
const Qodam = lazy(() => import("./pages/website/qodam/Qodam.jsx"));
const Zodiak = lazy(() => import("./pages/website/zodiak/Zodiak.jsx"));

// 📄 Semua halaman utama
import Home from "./pages/Home";
import About from "./pages/tentang/About";
const Contact = lazy(() => import("./pages/admin/Contact"));
import Photography from "./pages/foto/Photography";
import Projects from "./pages/projek/Projects";
const ProjectDetail = lazy(() => import("./pages/projek/detail/ProjectDetail"));
const Gallery = lazy(() => import("./pages/kenangan/Gallery"));
const ShortDetail = lazy(() => import("./pages/kenangan/ShortDetail"));
const ImageDetail = lazy(() => import("./pages/kenangan/ImageDetail"));
const VideoDetail = lazy(() => import("./pages/kenangan/VideoDetail"));
const AlbumDetail = lazy(() => import("./pages/kenangan/AlbumDetail"));
const TahunBaru = lazy(() => import("./pages/website/tahunbaru/happynewyears"));

const Testimoni = lazy(() => import("./pages/pengalaman/Testimoni"));
const DetailPenggunaPage = lazy(() => import("./pages/pengalaman/users/DetailPenggunaPage"));
const DetailPerusahaanPage = lazy(() => import("./pages/pengalaman/company/DetailPerusahaanPage"));

// 📄 Halaman tambahan
const Certificates = lazy(() => import("./pages/sertif/Certificates"));
const SoftSkills = lazy(() => import("./pages/skills/SoftSkills"));
const Education = lazy(() => import("./pages/sekolah/education"));
const Visi = lazy(() => import("./pages/visi/visi"));
const CVsaya = lazy(() => import("./pages/cv/CVsaya"));
const Streming = lazy(() => import("./pages/streming/Tubs"));

const Live = lazy(() => import("./pages/live/Live"));
const LiveDaftar = lazy(() => import("./pages/live/auth/Daftar"));
const LiveLogin = lazy(() => import("./pages/live/auth/Login"));
const DashboardLive = lazy(() => import("./pages/live/dash/dashboard"));
const ProfileLive = lazy(() => import("./pages/live/users/Profile"));

const AI_Docs = lazy(() => import("./pages/help/AI_Docs"));
const AI_DocDetail = lazy(() => import("./pages/help/ai/AI_DocDetail"));
const Keamanan = lazy(() => import("./pages/help/panduan/Keamanan"));
const Privasi = lazy(() => import("./pages/help/panduan/Privasi"));
const ChatbotSettingsRoute = lazy(() => import("./pages/help/ChatbotSettingsRoute"));
const Owner = lazy(() => import("./pages/owner/Profile_admin"));
const HelpFAQriwayat = lazy(() => import("./components/helpbutton/faq/riwayat/HelpFAQriwayat"));
const Portal = lazy(() => import("./pages/portal/Portal"));

const Hobbies = lazy(() => import("./pages/hub/Hobbies"));
const HobbiesDetail = lazy(() => import("./pages/hub/HobbyDetail.jsx"));
const S1PGMI = lazy(() => import("./pages/akademik/S1"));
const Sidang = lazy(() => import("./pages/akademik/sidang/Sidang"));
const Sempro = lazy(() => import("./pages/akademik/sempro/Sempro"));
const Wisuda = lazy(() => import("./pages/akademik/wisuda/Wisuda"));

const Blog = lazy(() => import("./pages/blog/Blog"));
const BlogDetail = lazy(() => import("./pages/blog/detail/BlogDetail"));
const Detailusers = lazy(() => import("./pages/blog/users/DetailProfile"));
const Bahasa = lazy(() => import("./pages/bahasa/Bahasa"));
const DetailBahasa = lazy(() => import("./pages/bahasa/detailbahasa/detail"));
const Komunitas = lazy(() => import("./pages/Komunitas/Komo"));
const Comingsoon = lazy(() => import("./pages/Fitur/comingsoon"));

// halaman komunitias - IMPLEMENTASI BARU
const Discond = lazy(() => import("./pages/discond/Komoniti"));
import { AuthProvider } from "./pages/discond/contexts/AuthContext";
import { ChatProvider } from "./pages/discond/contexts/ChatContext";
import { CommunityProvider } from './context/CommunityContext';
import { AuthProvider as AppAuthProvider } from './context/AuthContext';
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Profile = lazy(() => import('./pages/auth/Profile'));
import RequireAuth from './components/RequireAuth';

// ⚠️ Halaman error kustom
const NotFound = lazy(() => import("./pages/errors/NotFound"));
const ServerError = lazy(() => import("./pages/errors/ServerError"));
const Unauthorized = lazy(() => import("./pages/errors/Unauthorized"));
const Forbidden = lazy(() => import("./pages/errors/Forbidden"));
const Timeout = lazy(() => import("./pages/errors/Timeout"));
const BadGateway = lazy(() => import("./pages/errors/BadGateway"));
const Maintenance = lazy(() => import("./pages/errors/Maintenance"));

// ✅ Import hook untuk manage recaptcha visibility
import { useRecaptchaVisibility } from './hooks/useRecaptchaVisibility';

// ✅ NEW: Import RecaptchaProvider
import { RecaptchaProvider } from './context/RecaptchaContext';

// ✅ NEW: Komponen wrapper untuk Komoniti
const KomonitiWrapper = () => (
  <AuthProvider>
    <ChatProvider>
      <Discond />
    </ChatProvider>
  </AuthProvider>
);

// ✅ Layout dengan Navbar & Footer (untuk halaman biasa)
const DefaultLayout = ({ children }) => {
  // useLocation is imported from react-router-dom above
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Routes where we DON'T want the Navbar, Footer and HelpButton shown.
  // Keep each path as a separate string. For profile routes we match by prefix.
  const hideLayoutPaths = [
    "/streming",
    "/zodiak",
    "/qodam",
    "/discord",
    "/komunitas",
    "/discord/profile",
    "/Live-Discussion"
  ];

  // If the pathname begins with any of these, hide header/footer
  const shouldHideAlways = hideLayoutPaths.some((p) =>
    location.pathname === p || location.pathname.startsWith(`${p}/`)
  );

  // Untuk /portal, hanya hide di mobile
  const isPortal = location.pathname === "/portal";
  const shouldHidePortal = isPortal && isMobile;

  const shouldHide = shouldHideAlways || shouldHidePortal;

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHide && <Navbar />}
      <main className="flex-grow overflow-x-hidden">{children}</main>
      {!shouldHide && <Footer />}
      {!shouldHide && <HelpButton />}
    </div>
  );
};

// ✅ Layout tanpa Navbar & Footer (untuk halaman khusus)
const PlainLayout = ({ children }) => (
  <main className="min-h-screen">
    {children}
  </main>
);

// ✅ Komponen untuk melacak lokasi halaman dan reCAPTCHA visibility
function PageTracker() {
  const location = useLocation();

  // Gunakan hook untuk manage reCAPTCHA visibility berdasarkan lokasi
  useRecaptchaVisibility();

  useEffect(() => {
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      try { console.log("Current page:", location.pathname); } catch { /* ignore */ }
    }
    // Store only the last visited path to avoid heavy storage and logs
    try { localStorage.setItem("lastVisitedPage", location.pathname); } catch { /* ignore */ }
  }, [location]);

  return null;
}

export default function App() {
  // State untuk mengontrol tampilan loader
  const [isLoading, setIsLoading] = useState(true);

  // Efek untuk menyembunyikan loader setelah aplikasi siap
  useEffect(() => {
    // Simulasi loading time (bisa disesuaikan)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 detik (memberikan waktu untuk animasi loader berjalan sempurna)

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ErrorProvider>
        <AppAuthProvider>
          <RecaptchaProvider>
            <CommunityProvider>
              <div className="flex flex-col min-h-screen bg-[var(--color-gray-900)] text-white selection:bg-cyan-400/30 selection:text-cyan-200">
                {/* Animasi Loader */}
                <AnimatePresence mode="wait">
                  {isLoading && <Loader key="loader" />}
                </AnimatePresence>

                {/* Konten utama aplikasi */}
                {!isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {/* Pindahkan usePageTracker ke dalam Router */}
                    <PageTracker />
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-[var(--color-gray-900)]">
                        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                      </div>
                    }>
                      <Routes>
                        {/* Redirects: direct certain paths to /coming-soon
                  Disabled temporarily to re-enable development for these routes.
                  Previous redirect lines are kept here (commented) so nothing is deleted. */}
                        <Route path="/discord" element={<Navigate to="/coming-soon" replace />} />
                        <Route path="/discord/profile" element={<Navigate to="/coming-soon" replace />} />
                        <Route path="/komunitas" element={<Navigate to="/coming-soon" replace />} />
                        <Route path="/streming" element={<Navigate to="/coming-soon" replace />} />
                        <Route path="/login" element={<Navigate to="/coming-soon" replace />} />
                        <Route path="/register" element={<Navigate to="/coming-soon" replace />} />

                        {/* 🚀 Halaman Launching — berdiri sendiri */}
                        <Route path="/launching" element={<LaunchingPage />} />

                        {/* 🌍 Route dengan layout default (dengan navbar & footer) */}
                        <Route
                          path="/*"
                          element={
                            <LaunchGuard>
                              <DefaultLayout>
                                <Routes>
                                  {/* 🌍 Halaman utama */}
                                  <Route path="/" element={<Home />} />
                                  <Route path="/about" element={<About />} />
                                  <Route path="/contact" element={<Contact />} />
                                  <Route path="/photography" element={<Photography />} />

                                  <Route path="/gallery" element={<Gallery />} />
                                  <Route path="/gallery/shorts/:id" element={<ShortDetail />} />
                                  <Route path="/gallery/images/:id" element={<ImageDetail />} />
                                  <Route path="/gallery/videos/:id" element={<VideoDetail />} />
                                  <Route path="/gallery/albums/:id" element={<AlbumDetail />} />

                                  {/* 💬 Halaman testimoni */}
                                  <Route path="/testimoni" element={<Testimoni />} />
                                  <Route path="/testimoni/:id" element={<Testimoni />} />
                                  <Route path="/testimoni/authors/:slug" element={<DetailPenggunaPage />} />
                                  <Route path="/testimoni/perusahan/:slug" element={<DetailPerusahaanPage />} />

                                  {/* ❓ Halaman bantuan */}
                                  <Route path="/help/version" element={<Info />} />
                                  <Route path="/help/version/:slug" element={<InfoDetail />} />
                                  <Route path="/help/docs" element={<Doct />} />
                                  <Route path="/help/docs/ai" element={<AI_Docs />} />
                                  <Route path="/help/docs/ai/:slug" element={<AI_DocDetail />} />
                                  <Route path="/help/faq" element={<FAQ />} />
                                  <Route path="/help/faq/riwayat/ai" element={<HelpFAQriwayat />} />
                                  <Route path="/help/faq/riwayat/ai/:slug" element={<HelpFAQriwayat />} />
                                  <Route path="/live-cs/security" element={<Keamanan />} />
                                  <Route path="/live-cs/privacy" element={<Privasi />} />

                                  <Route path="/help/chatbot/settings/:tabId?" element={<ChatbotSettingsRoute />} />
                                  <Route path="/year-end" element={<TahunBaru />} />

                                  <Route path="/help/commitment" element={<Komit />} />
                                  <Route path="/help/commitment/:slug" element={<DetailCommitment />} />

                                  {/* 💼 Halaman proyek - DUAL ROUTE SUPPORT */}
                                  <Route path="/projects" element={<Projects />} />
                                  <Route path="/projects/:id" element={<Projects />} />
                                  <Route
                                    path="/project-detail/:id"
                                    element={<ProjectDetail />}
                                  />

                                  {/* 📘 Halaman tambahan dari About */}
                                  <Route
                                    path="/certificates"
                                    element={<Certificates />}
                                  />
                                  <Route path="/SoftSkills" element={<SoftSkills />} />
                                  {/* 🧠 Detail Soft Skill */}
                                  <Route path="/SoftSkills/:id" element={<SoftSkills />} />
                                  <Route path="/education" element={<Education />} />
                                  <Route path="/cv-saya" element={<CVsaya />} />
                                  <Route path="/visi" element={<Visi />} />

                                  <Route path="/hobbies/:slug" element={<HobbiesDetail />} />
                                  <Route path="/hobbies" element={<Hobbies />} />

                                  <Route path="/blog" element={<Blog />} />
                                  <Route path="/blog/:slug" element={<BlogDetail />} />
                                  <Route path="/blog/authors/:slug" element={<Detailusers />} />

                                  <Route path="/bahasa" element={<Bahasa />} />
                                  <Route path="/bahasa/detail/:slug" element={<DetailBahasa />} />
                                  <Route path="/owner" element={<Owner />} />

                                  <Route path="/S1-PGMI" element={<S1PGMI />} />
                                  <Route path="/sempro-skripsi" element={<Sempro />} />
                                  <Route path="/sidang-skripsi" element={<Sidang />} />
                                  <Route path="/wisuda" element={<Wisuda />} />

                                  {/* website tambahan */}
                                  <Route path="/qodam" element={<Qodam />} />
                                  <Route path="/zodiak" element={<Zodiak />} />
                                  <Route path="/coming-soon" element={<Comingsoon />} />
                                  <Route path="/streming" element={<RequireAuth><Streming /></RequireAuth>} />

                                  {/* Live rooms feature */}
                                  <Route path="/Live-Discussion" element={<Live />} />
                                  <Route path="/Live-Discussion/login" element={<LiveLogin />} />
                                  <Route path="/Live-Discussion/daftar" element={<LiveDaftar />} />
                                  <Route path="/Live-Discussion/profile" element={<ProfileLive />} />
                                  <Route path="/Live-Discussion/profile/:email" element={<ProfileLive />} />
                                  <Route path="/Live-Discussion/dashboard" element={<DashboardLive />} />

                                  <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
                                  <Route path="/login" element={<Login />} />
                                  <Route path="/register" element={<Register />} />
                                  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                                  <Route path="/portal" element={<Portal />} />

                                  {/* ⚠️ Halaman error */}
                                  <Route
                                    path="/401"
                                    element={
                                      <ProtectedErrorPage component={Unauthorized} />
                                    }
                                  />
                                  <Route
                                    path="/403"
                                    element={<ProtectedErrorPage component={Forbidden} />}
                                  />
                                  <Route
                                    path="/408"
                                    element={<ProtectedErrorPage component={Timeout} />}
                                  />
                                  <Route
                                    path="/500"
                                    element={<ProtectedErrorPage component={ServerError} />}
                                  />
                                  <Route
                                    path="/502"
                                    element={<ProtectedErrorPage component={BadGateway} />}
                                  />
                                  <Route
                                    path="/503"
                                    element={
                                      <ProtectedErrorPage component={Maintenance} />
                                    }
                                  />

                                  {/* 🕳️ Fallback 404 */}
                                  <Route path="*" element={<NotFound />} />
                                </Routes>
                              </DefaultLayout>
                            </LaunchGuard>
                          }
                        />

                        {/* ✅ Route khusus tanpa Navbar & Footer */}
                        {/* 🛡️ Discord dengan LaunchGuard tapi tanpa layout standar */}
                        <Route
                          path="/discord/*"
                          element={
                            <LaunchGuard>
                              <PlainLayout>
                                <KomonitiWrapper />
                              </PlainLayout>
                            </LaunchGuard>
                          }
                        />

                        {/* 🛡️ Komunitas dengan LaunchGuard tapi tanpa layout standar */}
                        <Route
                          path="/komunitas"
                          element={
                            <LaunchGuard>
                              <PlainLayout>
                                <Komunitas />
                              </PlainLayout>
                            </LaunchGuard>
                          }
                        />
                      </Routes>
                    </Suspense>
                  </motion.div>
                )}
              </div>
            </CommunityProvider>
          </RecaptchaProvider>
        </AppAuthProvider>
      </ErrorProvider>
    </Router>
  );
}