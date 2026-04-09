import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Bot, X, Sparkles, History, CheckCircle2, 
  ChevronDown, ExternalLink, Lightbulb, Target, 
  Zap, Clock, MessageSquare, Users, Settings, Plus, LayoutGrid, Cpu, Trophy, BarChart3, HelpCircle, Award, BookOpen, GraduationCap, RotateCcw,
  Languages, Fingerprint, ShieldCheck
} from "lucide-react";
import { useProjectAI } from "./hooks/useProjectAI";

const suggestions = [
  { text: "Tampilkan blog Syaiful", icon: "📚" },
  { text: "Tampilkan kursus & pelatihan", icon: "🎓" },
  { text: "Sebutkan soft skill Syaiful", icon: "🧠" },
  { text: "Apa komitmen Syaiful?", icon: "🤝" }
];

const thinkingLabels = {
  1: { text: "Menganalisis Konteks & Intent...", icon: Search },
  2: { text: "Menelusuri Jalur Pengetahuan...", icon: Cpu },
  3: { text: "Menelaah Nuansa Kalimat...", icon: Languages }
};

// Unified Sentiment/Confidence Config
const sentimentStyles = {
  positive: { border: "border-emerald-500/30", glow: "shadow-emerald-500/20", icon: Trophy, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Keyakinan Tinggi", emoji: "🎯" },
  puzzled: { border: "border-amber-500/30", glow: "shadow-amber-500/20", icon: HelpCircle, color: "text-amber-400", bg: "bg-amber-500/10", label: "Perlu Konfirmasi", emoji: "🤔" },
  neutral: { border: "border-cyan-500/30", glow: "shadow-cyan-500/20", icon: Bot, color: "text-cyan-400", bg: "bg-cyan-500/10", label: "Cukup Yakin", emoji: "💡" }
};

const CourseCard = ({ course }) => {
  if (!course) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-6 rounded-[2rem] bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 shadow-xl relative"
    >
      <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-[8px] font-black px-3 py-1.5 rounded-lg shadow-lg rotate-12 flex items-center gap-1.5">
         <Award className="w-3 h-3" /> VERIFIED_CERT
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-3xl shadow-xl flex-shrink-0">
           {course.logo || "📜"}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
             <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[9px] font-black uppercase rounded border border-purple-500/30">{course.provider}</span>
             <span className="text-slate-500 text-[10px] font-bold">{course.year}</span>
          </div>
          <h4 className="text-white font-bold text-lg tracking-tight leading-tight">{course.title}</h4>
          <p className="text-slate-400 text-xs italic line-clamp-2">"{course.description}"</p>
        </div>
      </div>
    </motion.div>
  );
};

const BlogCard = ({ blog }) => {
  if (!blog) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-5 rounded-[2rem] bg-slate-900 border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer"
    >
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
          <img src={blog.thumbnail || "/api/placeholder/80/80"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{blog.category}</span>
            <span className="text-[8px] font-bold text-slate-500">{blog.date}</span>
          </div>
          <h4 className="text-white font-bold text-sm group-hover:text-cyan-400 transition-colors line-clamp-1">{blog.title}</h4>
          <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 md:line-clamp-1 italic">"{blog.excerpt}"</p>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-all" />
      </div>
    </motion.div>
  );
};

const TimelineVisualizer = ({ timeline }) => {
  if (!timeline) return null;
  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
      <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-black uppercase tracking-widest">
        <Clock className="w-3 h-3" /> Project Lifecycle
      </div>
      <div className="flex justify-between items-start gap-2 relative">
        <div className="absolute top-1.5 left-0 w-full h-[1px] bg-white/10 -z-10" />
        {timeline.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
            <div className="text-center">
              <div className="text-[7px] text-white font-bold line-clamp-1">{step.phase}</div>
              <div className="text-[6px] text-slate-500 font-medium uppercase">{step.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EntityGallery = ({ children, title, icon: Icon }) => (
  <div className="space-y-4 pt-4">
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
        <Icon className="w-3.5 h-3.5 text-cyan-500" /> {title}
      </div>
      <div className="text-[8px] text-slate-600 font-medium uppercase tracking-widest">
        Scroll untuk lihat lainnya →
      </div>
    </div>
    <div className="flex gap-5 overflow-x-auto pb-4 px-2 no-scrollbar snap-x snap-mandatory">
      {React.Children.map(children, (child, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: i * 0.15 }}
          className="min-w-[280px] sm:min-w-[320px] snap-center first:pl-0 last:pr-4"
        >
          {child}
        </motion.div>
      ))}
    </div>
  </div>
);

const Typewriter = ({ text }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => { setCurrentText(""); setCurrentIndex(0); }, [text]);
  useEffect(() => {
    if (currentIndex < text.length) {
      const t = setTimeout(() => { setCurrentText(p => p + text[currentIndex]); setCurrentIndex(p => p + 1); }, 8);
      return () => clearTimeout(t);
    }
  }, [currentIndex, text]);
  return <div className="whitespace-pre-wrap">{currentText.split("**").map((p, i) => i % 2 === 1 ? <strong key={i} className="text-cyan-400 font-bold">{p}</strong> : p)}</div>;
};

const ProjectAI = ({ onSearch, onSelectProject }) => {
  const [inputValue, setInputValue] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isThinking, thinkingStep, aiResponse, resetContext } = useProjectAI(activeSearch);

  const handleSearchSubmit = (e) => { e?.preventDefault(); if (inputValue.trim()) { setActiveSearch(inputValue); setIsOpen(true); } };
  const currentStyle = sentimentStyles[aiResponse?.sentiment || 'neutral'];

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 px-4 space-y-6">
      {/* Search Input Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 group h-14">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            placeholder="Cari Proyek, Blog, Skill, atau FAQ Syaiful..."
            className="w-full h-full bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl pl-14 pr-12 text-white text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-lg"
          />
        </form>
        <button
          onClick={handleSearchSubmit} disabled={isThinking || !inputValue.trim()}
          className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold h-14 px-8 rounded-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-widest disabled:opacity-50"
        >
          <Bot className="w-5 h-5" /> MASTER SEARCH
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => { setInputValue(s.text); setActiveSearch(s.text); setIsOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-[9px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-wider"
          >
            <span>{s.icon}</span> <span>{s.text}</span>
          </button>
        ))}
        {(aiResponse || activeSearch) && (
          <button onClick={() => { resetContext(); setInputValue(""); setActiveSearch(""); setIsOpen(false); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-[9px] font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (activeSearch || isThinking) && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`relative bg-slate-950/95 backdrop-blur-3xl border ${currentStyle.border} rounded-[2.5rem] shadow-2xl overflow-hidden`}
          >
            {/* Context Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                   {React.createElement(currentStyle.icon, { className: "w-6 h-6" })}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Jawaban AI</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Unified Intelligence v8.5</p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${currentStyle.bg} ${currentStyle.color} text-[10px] font-bold border ${currentStyle.border}`}>
                <span>{currentStyle.emoji}</span> {currentStyle.label}
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-10">
               {isThinking ? (
                 <div className="h-48 flex flex-col items-center justify-center gap-6">
                    <div className="flex gap-4">
                       {[1, 2, 3].map(i => <motion.div key={i} animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.2 }} className="w-3 h-3 bg-cyan-500 rounded-full" />)}
                    </div>
                    <span className="text-[10px] font-black text-cyan-400 tracking-[0.4em] uppercase animate-pulse">{thinkingLabels[thinkingStep]?.text}</span>
                 </div>
               ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    {/* User Question Bar */}
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <MessageSquare className="w-3 h-3 text-cyan-500" /> Pertanyaan Anda:
                       </div>
                       <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300 text-sm italic">
                          "{activeSearch}"
                       </div>
                    </div>

                    {/* AI Answer Card */}
                    <div className="space-y-3">
                       <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <Sparkles className="w-3 h-3 text-cyan-500" /> Analisis Cerdas:
                       </div>
                       <div className="bg-slate-900/50 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 text-slate-200 text-base sm:text-lg leading-relaxed shadow-inner">
                          <Typewriter text={aiResponse?.answer || ""} />
                          
                          {/* Options if clarification */}
                          {aiResponse?.isClarification && aiResponse?.answer.includes('\n-') && (
                            <div className="mt-6 flex flex-wrap gap-3">
                               {aiResponse.answer.split('\n- ').slice(1).map((opt, i) => (
                                 <button key={i} onClick={() => { setInputValue(opt.trim()); setActiveSearch(opt.trim()); }}
                                   className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-md"
                                 >
                                   {opt.trim()}
                                 </button>
                               ))}
                            </div>
                          )}
                       </div>
                    </div>

                     {/* Related Entities (Project/Course/Blog) */}
                     <div className="space-y-12">
                        {/* Single Matches (Priority) */}
                        {aiResponse?.matchedCourse && (
                          <div className="space-y-3">
                             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">
                                <GraduationCap className="w-3.5 h-3.5 text-cyan-500" /> Sertifikasi Relevan:
                             </div>
                             <CourseCard course={aiResponse.matchedCourse} />
                          </div>
                        )}
                        
                        {aiResponse?.matchedBlog && (
                          <div className="space-y-3">
                             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">
                                <BookOpen className="w-3.5 h-3.5 text-cyan-500" /> Artikel Blog Terkait:
                             </div>
                             <BlogCard blog={aiResponse.matchedBlog} />
                          </div>
                        )}

                        {/* Collections / Galleries */}
                        {aiResponse?.relatedBlogs && (
                          <EntityGallery title="Daftar Artikel Blog" icon={BookOpen}>
                            {aiResponse.relatedBlogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
                          </EntityGallery>
                        )}

                        {aiResponse?.relatedCourses && (
                          <EntityGallery title="Explore Sertifikasi" icon={GraduationCap}>
                            {aiResponse.relatedCourses.map(course => <CourseCard key={course.id} course={course} />)}
                          </EntityGallery>
                        )}

                        {aiResponse?.relatedProjects && (
                          <EntityGallery title="Mahakarya Terbaru" icon={LayoutGrid}>
                            {/* Update: In a real scenario, we'd have a ProjectCard specifically for AI view */}
                            {aiResponse.relatedProjects.map(proj => (
                              <div key={proj.id} className="p-6 rounded-[2rem] bg-slate-900 border border-white/5 hover:border-cyan-500/30 transition-all group">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-start">
                                    <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                      <LayoutGrid className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] font-black px-2 py-1 bg-white/5 rounded-lg text-slate-500">{proj.year}</span>
                                  </div>
                                  <div>
                                    <h4 className="text-white font-bold group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{proj.title}</h4>
                                    <p className="text-slate-400 text-xs mt-1 line-clamp-2 md:line-clamp-1 italic">"{proj.overview}"</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {proj.tech.slice(0, 3).map((t, i) => <span key={i} className="text-[8px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase">{t}</span>)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </EntityGallery>
                        )}
                       </div>
                        
                       {aiResponse?.matchedProject && (
                         <div className="space-y-3 pt-8">
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">
                               <LayoutGrid className="w-3.5 h-3.5 text-cyan-500" /> Karya Terkait:
                            </div>
                            <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] transition-all">
                               <div className="flex flex-col md:flex-row items-center gap-10">
                                  <img src={aiResponse.matchedProject.image} className="w-full md:w-56 h-40 rounded-3xl object-cover border-2 border-white/10 shadow-lg" alt="" />
                                  <div className="flex-1 space-y-4">
                                     <div>
                                        <h4 className="text-white font-bold text-2xl leading-tight">{aiResponse.matchedProject.title}</h4>
                                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">{aiResponse.matchedProject.category} • ⭐ {aiResponse.matchedProject.rating}</p>
                                     </div>
                                     <TimelineVisualizer timeline={aiResponse.matchedProject.timeline} />
                                     <div className="pt-4 border-t border-white/5">
                                        <button onClick={() => onSelectProject(aiResponse.matchedProject)} 
                                          className="w-full sm:w-auto px-8 py-3 bg-white text-slate-950 hover:bg-cyan-500 hover:text-white font-bold text-xs rounded-xl transition-all shadow-lg active:scale-95"
                                        >
                                          LIHAT DETAIL KARYA
                                        </button>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                       )}
                     </motion.div>
                   )}
                </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex flex-wrap justify-center items-center gap-6 text-[9px] font-bold tracking-widest text-slate-600">
               <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-500" /> MASTER_DATA_SYNCED</span>
               <span className="flex items-center gap-1.5"><Fingerprint className="w-3 h-3 text-blue-500" /> CROSS_DOMAIN_READY</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectAI;
