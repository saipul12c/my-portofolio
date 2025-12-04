import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// 🌐 Komponen global
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedErrorPage from "./components/ProtectedErrorPage";
import { ErrorProvider } from "./context/ErrorContext";

// tombol bantuan
import HelpButton from "./components/HelpButton";
import Doct from "./components/helpbutton/docs/HelpDocsItem.jsx";
import FAQ from "./components/helpbutton/faq/HelpFAQItem.jsx";
import Info from "./components/helpbutton/versiWeb/HelpVersionInfo.jsx";
import Komit from "./components/helpbutton/komit/HelpCommitmentItem.jsx";
import DetailCommitment from "./components/helpbutton/komit/detail/DetailCommitment.jsx";

// 🛡️ Tambahan: Launch guard dan halaman launching
import LaunchGuard from "./components/LaunchGuard";
import LaunchingPage from "./pages/LaunchingPage";

// website tambahan
import Qodam from "./pages/website/qodam/Qodam.jsx";
import Zodiak from "./pages/website/zodiak/Zodiak.jsx";

// 📄 Semua halaman utama
import Home from "./pages/Home";
import About from "./pages/tentang/About";
import Contact from "./pages/admin/Contact";
import Photography from "./pages/foto/Photography";
import Projects from "./pages/projek/Projects";
import ProjectDetail from "./pages/projek/detail/ProjectDetail";
import Gallery from "./pages/kenangan/Gallery";
import ShortDetail from "./pages/kenangan/ShortDetail";
import ImageDetail from "./pages/kenangan/ImageDetail";
import VideoDetail from "./pages/kenangan/VideoDetail";
import AlbumDetail from "./pages/kenangan/AlbumDetail";

import Testimoni from "./pages/pengalaman/Testimoni";
import DetailPenggunaPage from "./pages/pengalaman/users/DetailPenggunaPage";
import DetailPerusahaanPage from "./pages/pengalaman/company/DetailPerusahaanPage";

// 📄 Halaman tambahan
import Certificates from "./pages/sertif/Certificates";
import SoftSkills from "./pages/skills/SoftSkills";
import Education from "./pages/sekolah/education";
import Visi from "./pages/visi/visi";
import CVsaya from "./pages/cv/CVsaya";
import Streming from "./pages/streming/Tubs";

import Hobbies from "./pages/hub/Hobbies";
import HobbiesDetail from "./pages/hub/HobbyDetail.jsx"

import Blog from "./pages/blog/Blog";
import BlogDetail from "./pages/blog/detail/BlogDetail";
import Detailusers from "./pages/blog/users/DetailProfile";
import Bahasa from "./pages/bahasa/Bahasa";
import Komunitas from "./pages/Komunitas/Komo";
import Comingsoon from "./pages/fitur/comingsoon";

// halaman komunitias - IMPLEMENTASI BARU
import Discond from "./pages/discond/Komoniti";
import { AuthProvider } from "./pages/discond/contexts/AuthContext";
import { ChatProvider } from "./pages/discond/contexts/ChatContext";
import { CommunityProvider } from './context/CommunityContext';

// ⚠️ Halaman error kustom
import NotFound from "./pages/errors/NotFound";
import ServerError from "./pages/errors/ServerError";
import Unauthorized from "./pages/errors/Unauthorized";
import Forbidden from "./pages/errors/Forbidden";
import Timeout from "./pages/errors/Timeout";
import BadGateway from "./pages/errors/BadGateway";
import Maintenance from "./pages/errors/Maintenance";

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

  // Routes where we DON'T want the Navbar, Footer and HelpButton shown.
  const hideLayoutPaths = ["/streming", "/zodiak", "/qodam", "/discord", "/komunitas"];

  // If the pathname begins with any of these, hide header/footer
  const shouldHide = hideLayoutPaths.some((p) =>
    location.pathname === p || location.pathname.startsWith(`${p}/`)
  );

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

export default function App() {
  return (
    <Router>
      <ErrorProvider>
        <CommunityProvider>
          <div className="flex flex-col min-h-screen bg-[var(--color-gray-900)] text-white selection:bg-cyan-400/30 selection:text-cyan-200">
            <Routes>
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
                        <Route path="/help/docs" element={<Doct />} />
                        <Route path="/help/faq" element={<FAQ />} />

                        <Route path="/help/commitment" element={<Komit />} />
                        <Route path="/commitment/:id" element={<DetailCommitment />} />
                      
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

                        {/* website tambahan */}
                        <Route path="/qodam" element={<Qodam />} />
                        <Route path="/zodiak" element={<Zodiak />} />
                        <Route path="/coming-soon" element={<Comingsoon />} />
                        <Route path="/streming" element={<Streming />} />

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
                path="/discord"
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
          </div>
        </CommunityProvider>
      </ErrorProvider>
    </Router>
  );
}