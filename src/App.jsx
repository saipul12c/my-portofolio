import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🌐 Komponen global
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedErrorPage from "./components/ProtectedErrorPage";
import { ErrorProvider } from "./context/ErrorContext";

// 🛡️ Tambahan: Launch guard dan halaman launching
import LaunchGuard from "./components/LaunchGuard";
import LaunchingPage from "./pages/LaunchingPage";

// 📄 Semua halaman utama
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Photography from "./pages/Photography";
import Projects from "./pages/projek/Projects";
import ProjectDetail from "./pages/projek/detail/ProjectDetail";
import Gallery from "./pages/Gallery";
import Testimoni from "./pages/Testimoni";

// 📄 Halaman tambahan dari About
import Certificates from "./pages/Certificates";
import SoftSkills from "./pages/SoftSkills";
import Education from "./pages/education";
import Visi from "./pages/visi";

// ⚠️ Halaman error kustom
import NotFound from "./pages/errors/NotFound";
import ServerError from "./pages/errors/ServerError";
import Unauthorized from "./pages/errors/Unauthorized";
import Forbidden from "./pages/errors/Forbidden";
import Timeout from "./pages/errors/Timeout";
import BadGateway from "./pages/errors/BadGateway";
import Maintenance from "./pages/errors/Maintenance";

export default function App() {
  return (
    <Router>
      <ErrorProvider>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white selection:bg-cyan-400/30 selection:text-cyan-200">
          <Routes>
            {/* 🚀 Halaman Launching — berdiri sendiri, tidak dibungkus LaunchGuard */}
            <Route path="/launching" element={<LaunchingPage />} />

            {/* 🌍 Semua route utama dibungkus LaunchGuard */}
            <Route
              path="/*"
              element={
                <LaunchGuard>
                  <div className="flex flex-col min-h-screen">
                    {/* 🌟 Navbar global */}
                    <Navbar />

                    {/* 📌 Konten utama */}
                    <main className="flex-grow overflow-x-hidden">
                      <Routes>
                        {/* 🌍 Halaman utama */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/photography" element={<Photography />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/testimoni" element={<Testimoni />} />

                        {/* 💼 Halaman proyek */}
                        <Route path="/projects" element={<Projects />} />
                        <Route
                          path="/projects/:id"
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
                        <Route path="/visi" element={<Visi />} />

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
                    </main>

                    {/* 🌙 Footer global */}
                    <Footer />
                  </div>
                </LaunchGuard>
              }
            />
          </Routes>
        </div>
      </ErrorProvider>
    </Router>
  );
}
