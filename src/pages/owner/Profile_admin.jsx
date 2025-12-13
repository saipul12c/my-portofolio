import React from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Download, 
  Award, 
  Target, 
  Users,
  Lightbulb,
  Calendar,
  BookOpen,
  Sparkles,
  Briefcase,
  Star,
  Heart,
  Code,
  Globe,
  MessageSquare,
  TrendingUp,
  Camera,
  Film,
  PenTool,
  PenSquare,
  Headphones,
  Compass,
  Laptop,
  Music,
  BookMarked,
  Cpu,
  Palette,
  Pen,
  Map
} from "lucide-react";
import profileData from "../../components/helpbutton/chat/data/profile.json";
import commitmentsData from "../../components/helpbutton/komit/data/commitments.json";
import projectsData from "../../data/projects.json";
import testimonialsData from "../../data/testimoni/testimonials.json";
import softSkillsData from "../../data/skills/softskills.json";
import blogData from "../../data/blog/data.json";
import certificatesData from "../../data/sertif/certificates.json";
import hobbiesData from "../../data/hub/hobbiesData.json";
import bahasaData from "../../data/bahasa/data.json";
import pendidikanData from "../../data/pendidikan/data.json";

export default function Owne() {
  const profile = profileData || {};
  const commitments = (commitmentsData && commitmentsData.commitments) || [];
  const projects = (projectsData && projectsData.projects) || [];
  const testimonials = testimonialsData || [];
  const softSkills = softSkillsData.skills || [];
  const blogs = blogData || [];
  const certificates = certificatesData.certificates || [];
  const hobbies = hobbiesData || [];

  const initials = (profile.name || "")
    .split(" ")
    .map(p => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Ambil 6 proyek terbaru
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  // Ambil 4 testimonial terbaru
  const recentTestimonials = [...testimonials]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  // Ambil 8 soft skills utama
  const topSoftSkills = softSkills
    .filter(skill => skill.experience >= 85)
    .slice(0, 8);

  // Ambil 4 artikel blog terbaru
  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  // Ambil 4 sertifikat terbaru
  const recentCertificates = [...certificates]
    .sort((a, b) => b.year - a.year)
    .slice(0, 4);

  // Ambil 6 hobi dengan prioritas tinggi
  const topHobbies = hobbies
    .filter(hobby => hobby.metadata.priority === "High")
    .slice(0, 6);

  const stats = [
    { icon: <Calendar className="w-5 h-5" />, label: "Pengalaman", value: "5+ Tahun" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Proyek Selesai", value: `${projects.length}+` },
    { icon: <Users className="w-5 h-5" />, label: "Klien & Kolaborator", value: `${testimonials.length}+` },
    { icon: <Award className="w-5 h-5" />, label: "Rating Rata-rata", value: "4.8/5" }
  ];

  // Icon mapping untuk hobi
  const iconMap = {
    Camera: Camera,
    BookOpen: BookOpen,
    Film: Film,
    PenTool: PenTool,
    PenSquare: PenSquare,
    Headphones: Headphones,
    Compass: Compass,
    Laptop: Laptop,
    Globe: Globe,
    Code: Code,
    Music: Music,
    Heart: Heart,
    BookMarked: BookMarked,
    Cpu: Cpu,
    Palette: Palette,
    Pen: Pen,
    Users: Users,
    Book: BookOpen,
    Map: Map,
    Sparkles: Sparkles
  };

  // Hitung total pengguna dari semua proyek
  const calculateTotalImpact = () => {
    const impacts = projects.map(p => {
      const impactText = p.impact || "";
      const match = impactText.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    });
    return impacts.reduce((a, b) => a + b, 0);
  };

  const humanDate = (d = new Date()) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  // Helper: generate a stable color from a string (used for pendidikan badges)
  const generateColorFromString = (str) => {
    if (!str) return "#e5e7eb";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let c = (hash & 0x00ffffff).toString(16).toUpperCase();
    c = "000000".substring(0, 6 - c.length) + c;
    return `#${c}`;
  };

  // Helper: pick readable text color (black/white) based on background hex
  const pickTextColor = (hex) => {
    try {
      if (!hex) return "#000";
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
      const r = parseInt(c.substring(0,2), 16);
      const g = parseInt(c.substring(2,4), 16);
      const b = parseInt(c.substring(4,6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.6 ? '#0f172a' : '#ffffff';
    } catch (e) {
      return '#fff';
    }
  };

  // Komponen Tag Berwarna kecil
  const ColorTag = ({ label, color, icon }) => (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: color || '#e2e8f0', color: pickTextColor(color) }}
    >
      {icon ? <span className="text-sm">{icon}</span> : null}
      <span>{label}</span>
    </span>
  );

  return (
    <div className="min-h-screen bg-[var(--color-gray-900)] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Profil Profesional</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full"></div>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
            Portofolio digital yang menunjukkan perjalanan, kompetensi, dan nilai-nilai sebagai profesional teknologi pendidikan
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Sidebar Profil */}
            <div className="bg-gradient-to-b from-teal-600 to-cyan-600 p-8 lg:p-10 text-white">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm 
                                flex items-center justify-center text-5xl font-bold text-teal-900 
                                border-4 border-white/30 shadow-2xl">
                    {initials}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-emerald-400 text-white p-2 rounded-full shadow-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                {/* Info Dasar */}
                <h2 className="text-2xl font-bold text-center mb-2">{profile.name}</h2>
                <div className="flex items-center gap-2 mb-4 text-cyan-100">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Fullstack Developer & EduTech Specialist</span>
                </div>

                {/* Statistik Singkat */}
                <div className="grid grid-cols-2 gap-3 w-full mt-6 mb-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                    <div className="text-lg font-bold">{projects.length}</div>
                    <div className="text-xs opacity-80">Proyek</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                    <div className="text-lg font-bold">{testimonials.length}</div>
                    <div className="text-xs opacity-80">Testimoni</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                    <div className="text-lg font-bold">{blogs.length}</div>
                    <div className="text-xs opacity-80">Artikel</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                    <div className="text-lg font-bold">{certificates.length}</div>
                    <div className="text-xs opacity-80">Sertifikat</div>
                  </div>
                </div>

                {/* Kontak Info */}
                <div className="w-full space-y-4 mt-4">
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm truncate">contact@pendidikdigital.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">+62 812 3456 7890</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">Jakarta, Indonesia</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 mt-8 w-full">
                  <Link to="/contact" 
                     className="flex-1 bg-white text-teal-700 hover:bg-teal-50 font-semibold 
                                py-3 px-4 rounded-xl text-center transition-all duration-300 
                                hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                    Hubungi Saya
                  </Link>
                  <a href="/cv-saya" 
                     className="flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-900 
                                text-white font-semibold py-3 px-4 rounded-xl transition-all 
                                duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                    <Download className="w-4 h-4" />
                    CV
                  </a>
                </div>
              </div>
            </div>

            {/* Konten Utama */}
            <div className="lg:col-span-2 p-8 lg:p-10">
              {/* Bagian Pengantar */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-slate-900">Profil Profesional</h3>
                </div>
                <p className="text-slate-900 leading-relaxed">
                  {profile.description || "Pendidik dengan spesialisasi dalam pengembangan media pembelajaran digital. Berpengalaman dalam menciptakan konten edukasi yang menarik dan efektif untuk berbagai jenjang pendidikan."}
                </p>
              </div>

                {/* Nilai & Komitmen (menggunakan data commitments) */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Nilai & Komitmen</h4>
                  <div className="flex flex-wrap gap-3">
                    {commitments.slice(0, 4).map(c => (
                        <div key={c.id} className="px-4 py-3 bg-white border border-slate-200 rounded-lg min-w-[220px]">
                          <div className="font-semibold text-slate-900 mb-1">{c.title}</div>
                          <div className="text-sm text-slate-700">{c.short_desc}</div>
                        </div>
                    ))}
                  </div>
                </div>

              {/* Statistik */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 
                                  bg-gradient-to-br from-teal-100 to-cyan-100 
                                  rounded-full mb-3 text-teal-600">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Proyek Terbaru */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Proyek Terbaru</h3>
                    <p className="text-slate-600">Inovasi dan implementasi teknologi pendidikan terkini</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-teal-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentProjects.map(project => (
                    <Link key={project.id}
                          to={`/project-detail/${project.id}`}
                         className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                                    rounded-xl p-4 hover:border-teal-300 transition-all duration-300 
                                    hover:shadow-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center 
                                      justify-center text-teal-600 flex-shrink-0">
                          <Code className="w-5 h-5" />
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.label === 'Rekomendasi' ? 'bg-purple-100 text-purple-800' :
                          project.label === 'Baru' ? 'bg-cyan-100 text-cyan-800' :
                          project.label === 'Hot' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {project.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2 group-hover:text-teal-700 
                                   transition-colors truncate">
                        {project.title}
                      </h4>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {project.subtitle}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500" />
                          {project.rating}
                        </span>
                        <span>{project.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Soft Skills Utama</h3>
                    <p className="text-slate-600">Keterampilan interpersonal dan profesional</p>
                  </div>
                  <Heart className="w-8 h-8 text-rose-500" />
                </div>

                <div className="flex flex-wrap gap-3">
                  {topSoftSkills.map(skill => (
                    <div key={skill.id}
                         className="group px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 
                                    border border-teal-100 rounded-xl hover:border-teal-300 
                                    transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{skill.name}</span>
                        <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blog Artikel Terbaru */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Artikel Terbaru</h3>
                    <p className="text-slate-600">Insight dan pengetahuan dari pengalaman menulis</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-teal-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentBlogs.map(blog => (
                    <Link key={blog.id} to={`/blog/${blog.slug || blog.id}`} 
                         className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                                    rounded-xl p-5 hover:border-teal-300 transition-all duration-300 
                                    hover:shadow-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center 
                                        justify-center text-teal-600">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-teal-700 
                                         transition-colors line-clamp-1">
                              {blog.title}
                            </h4>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <span>{blog.author}</span>
                              <span>•</span>
                              <span>{blog.readTime}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          blog.featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {blog.featured ? 'Featured' : blog.category}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          {new Date(blog.date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-500" />
                            {blog.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-cyan-500" />
                            {blog.commentCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-slate-500" />
                            {blog.views}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sertifikat & Prestasi */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Sertifikat & Prestasi</h3>
                    <p className="text-slate-600">Pengakuan kompetensi dan pencapaian profesional</p>
                  </div>
                  <Award className="w-8 h-8 text-amber-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentCertificates.map(cert => (
                    <a key={cert.id} 
                       href={cert.urlCertificate}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="group block">
                      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                                    rounded-xl p-5 hover:border-amber-300 transition-all duration-300 
                                    hover:shadow-lg">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center 
                                        text-white flex-shrink-0"
                               style={{ backgroundColor: cert.themeColor }}>
                            <Award className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-amber-700 
                                         transition-colors mb-1">
                              {cert.title}
                            </h4>
                            <p className="text-slate-600 text-sm mb-2">{cert.issuer}</p>
                            <div className="flex flex-wrap gap-2">
                              {cert.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} 
                                      className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-900">{cert.year}</div>
                            <div className="text-xs text-slate-500">{cert.duration}</div>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm line-clamp-2">
                          {cert.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Hobi & Minat */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Hobi & Minat</h3>
                    <p className="text-slate-600">Aktivitas di luar pekerjaan untuk pengembangan diri</p>
                  </div>
                  <Heart className="w-8 h-8 text-rose-500" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {topHobbies.map(hobby => {
                    const IconComponent = iconMap[hobby.icon] || Sparkles;
                    return (
                      <Link key={hobby.id} to={`/hobbies/${hobby.slug || hobby.id}`} 
                           className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                                      rounded-xl p-4 text-center hover:border-rose-300 transition-all duration-300 
                                      hover:shadow-lg">
                        <div className={`inline-flex items-center justify-center w-12 h-12 
                                      rounded-full mb-3 ${hobby.iconColor} 
                                      bg-gradient-to-br from-white to-slate-100`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-1">
                          {hobby.title}
                        </h4>
                        <div className="text-xs text-slate-500">
                          {hobby.category}
                        </div>
                        <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-teal-500 h-2 rounded-full" 
                               style={{ width: `${hobby.stats.completion}%` }}></div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Testimonial */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Testimonial Klien</h3>
                    <p className="text-slate-600">Umpan balik dari kolaborasi profesional</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-amber-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentTestimonials.map(testimonial => (
                    <Link key={testimonial.id} to={`/testimoni/${testimonial.id}`}
                         className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                                    rounded-xl p-5 hover:border-teal-300 transition-all duration-300 
                                    hover:shadow-lg">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center 
                                      justify-center text-teal-600 flex-shrink-0 overflow-hidden">
                          {testimonial.image ? (
                            <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold">{testimonial.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                          <p className="text-slate-600 text-sm">{testimonial.role}, {testimonial.company}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          <span className="font-bold text-slate-900">{testimonial.rating}</span>
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm italic mb-4 line-clamp-3">
                        "{testimonial.text}"
                      </p>
                      <div className="text-xs text-slate-500">
                        {new Date(testimonial.date).toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bahasa & Pendidikan */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Bahasa & Pendidikan</h3>
                    <p className="text-slate-600">Kemampuan bahasa dan latar belakang pendidikan</p>
                  </div>
                  <Globe className="w-8 h-8 text-teal-600" />
                </div>

                <div className="mb-4">
                  <h4 className="text-md font-semibold text-slate-800 mb-2">Bahasa</h4>
                  <div className="flex flex-wrap gap-3">
                    {(bahasaData.bahasaSehariHari || []).map((b, i) => (
                      <div key={i}>
                        <ColorTag label={`${b.nama} • ${b.tingkat}`} color={b.warna} icon={b.icon} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-slate-800 mb-2">Pendidikan (pilihan)</h4>
                  <div className="flex flex-wrap gap-3 items-center">
                    {(pendidikanData.education || []).slice(0, 8).map((e, i) => (
                      <div key={i}>
                        <ColorTag
                          label={`${e.degree} ${e.year ? `• ${e.year}` : ''}`}
                          color={generateColorFromString(e.institution)}
                          icon={e.logo}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ringkasan Penutup */}
              <div className="bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl p-6 border border-teal-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Visi & Misi</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Berkomitmen untuk menciptakan pengalaman belajar yang transformatif melalui integrasi 
                  teknologi, desain, dan pedagogi yang berpusat pada peserta didik. Fokus pada pengembangan 
                  media pembelajaran yang tidak hanya informatif tetapi juga inspiratif dan memotivasi.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                    Pendidikan Inklusif
                  </span>
                  <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
                    Teknologi Adaptif
                  </span>
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    Desain Berpusat Pengguna
                  </span>
                  <span className="px-4 py-2 bg-violet-100 text-violet-800 rounded-full text-sm font-medium">
                    Pembelajaran Kontekstual
                  </span>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-10 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-slate-600 text-sm">
                    Siap berkolaborasi dalam proyek pendidikan yang bermakna
                  </div>
                  <div className="flex gap-3">
                    <a href="/portfolio" 
                       className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 
                                  text-white font-semibold rounded-xl hover:shadow-lg 
                                  transition-all duration-300 hover:scale-[1.02] 
                                  active:scale-[0.98]">
                      Lihat Portofolio
                    </a>
                    <a href="/contact" 
                       className="px-6 py-3 border-2 border-teal-600 text-teal-600 
                                  font-semibold rounded-xl hover:bg-teal-50 
                                  transition-all duration-300">
                      Diskusi Proyek
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Catatan */}
        <div className="mt-8 text-center text-slate-500 text-sm">
           <p>Profil ini diperbarui terakhir pada {humanDate()} • 
             <span className="text-teal-400 font-medium"> Tersedia untuk peluang kolaborasi</span></p>
          <div className="flex justify-center items-center gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {projects.length} Proyek
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {blogs.length} Artikel
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              {certificates.length} Sertifikat
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {calculateTotalImpact().toLocaleString()}+ Pengguna Terdampak
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Eye icon component yang digunakan di bagian blog
const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);