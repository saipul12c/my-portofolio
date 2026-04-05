import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import docsData from "./data/docsSections.json";

// --- HELPER COMPONENTS ---

const SectionItem = memo(({ 
  section, 
  index, 
  isOpen, 
  onToggle,
  getStatusColor,
  getVersionTypeColor
}) => {
  const IconComponent = Icons[section.icon] || Icons.BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
      className={`relative group ${isOpen ? 'z-20 mb-6' : 'mb-3'}`}
    >
      <div className={`glass-card rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 ${
        isOpen ? 'ring-2 ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] bg-slate-900/90' : 'hover:bg-white/5'
      }`}>
        <button
          onClick={() => onToggle(index)}
          className="w-full flex flex-col sm:flex-row items-center p-6 sm:p-7 text-left outline-none group"
        >
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <div className="relative">
              <div className="absolute inset-0 blur-xl opacity-20 bg-cyan-500"></div>
              <div className="relative p-4 rounded-2xl border border-white/10 flex items-center justify-center text-white bg-gradient-to-br from-cyan-500 to-blue-600">
                <IconComponent size={24} />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                {section.title || "Untitled Section"}
              </h2>
              {section.visual?.badge && (
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[9px] uppercase font-bold tracking-widest text-cyan-400">
                  {section.visual.badge}
                </span>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base italic font-light line-clamp-1 opacity-80">
              {section.visual?.summary || section.content?.substring(0, 100) + "..." || "No description available."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Icons.Layers size={14} className="text-cyan-500" />
                <span>v{section.version || '1.0'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.Clock size={14} className="text-blue-500" />
                <span>{section.estimatedReadTime || '5 min'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(section.tags || []).slice(0, 2).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] text-gray-400 uppercase tracking-tighter">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4 hidden sm:block">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              className={`p-3 rounded-xl border border-white/10 transition-all ${
                isOpen ? 'bg-cyan-500 text-white shadow-lg' : 'bg-white/5 text-gray-500 group-hover:text-white'
              }`}
            >
              <Icons.ChevronDown size={20} />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <SectionContent 
              section={section} 
              getStatusColor={getStatusColor} 
              getVersionTypeColor={getVersionTypeColor} 
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

const SectionContent = memo(({ section, getStatusColor, getVersionTypeColor }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const allTabs = [
    { id: 'overview', label: 'Overview', icon: Icons.LayoutGrid, hasData: true },
    { id: 'system', label: 'System', icon: Icons.Cpu, hasData: !!(section.compatibility || section.performanceMetrics) },
    { id: 'dev', label: 'Technical', icon: Icons.Code2, hasData: !!(section.saipulaiUpgrade || section.technicalDetails) },
    { id: 'history', label: 'Changelog', icon: Icons.History, hasData: !!(section.changelog?.length > 0 || section.versionHistory?.length > 0) },
  ];

  const tabs = allTabs.filter(t => t.hasData);

  // Fallback to first available tab if activeTab is not in filtered list
  useEffect(() => {
    if (!tabs.find(t => t.id === activeTab) && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="border-t border-white/5 bg-black/50"
    >
      <div className="flex border-b border-white/5 px-6 pt-4 bg-white/[0.02] overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-shrink-0 items-center gap-2 px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab.id ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <Icons.FileText className="text-cyan-400" size={18} />
                    Core Documentation
                  </h3>
                  <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed text-sm sm:text-base font-light">
                    {section.content || "No detailed content available."}
                  </div>
                </div>

                {section.subsections?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.subsections.map((sub, i) => {
                      const hasContent = sub.subtitle || sub.details || sub.tips || sub.codeSnippet;
                      if (!hasContent) return null;
                      
                      return (
                        <div key={i} className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all">
                          {sub.subtitle && <h4 className="font-black text-cyan-400 mb-2 uppercase tracking-widest text-[10px]">{sub.subtitle}</h4>}
                          {sub.details && <p className="text-xs text-gray-400 leading-relaxed mb-3">{sub.details}</p>}
                          {sub.tips && (
                            <div className="flex items-start gap-2 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl mb-3">
                               <Icons.Info size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                               <p className="text-[11px] italic text-cyan-200/70 leading-snug">{sub.tips}</p>
                            </div>
                          )}
                          {sub.codeSnippet && (
                            <div className="relative group/code">
                              <pre className="p-3 bg-black/60 rounded-lg text-[9px] font-mono text-cyan-400 border border-white/5 overflow-x-auto">
                                {sub.codeSnippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'system' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.compatibility ? (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="text-xs font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                       <Icons.Cpu className="text-blue-500" size={18} />
                       Environment
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Min Version', val: `v${section.compatibility.minRequired}`, icon: Icons.Minimize2 },
                        { label: 'Safe Deploy', val: `v${section.compatibility.testedUpTo}`, icon: Icons.ShieldCheck },
                        { label: 'API Schema', val: section.compatibility.apiCompatibility, icon: Icons.Route },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="flex items-center gap-2 text-[10px] text-gray-500 font-medium lowercase">
                            <item.icon size={14} className="text-blue-400" />
                            {item.label}
                          </span>
                          <span className="text-[10px] font-black text-white font-mono">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="col-span-2 p-10 text-center border border-dashed border-white/10 rounded-2xl">
                     <Icons.ShieldX className="mx-auto text-gray-700 mb-3" size={32} />
                     <p className="text-gray-500 text-xs italic">System compatibility parameters not specified for this module.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'dev' && (
              <div className="space-y-6">
                {section.saipulaiUpgrade ? (
                  <div className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-transparent border border-purple-500/20 relative overflow-hidden group">
                     <Icons.Bot size={60} className="absolute -bottom-2 -right-2 text-purple-500/10 group-hover:text-purple-500/20 transition-all rotate-12" />
                     <h3 className="text-xl font-black text-white mb-6 tracking-tighter uppercase">Intelligence Core</h3>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <p className="text-gray-400 text-sm leading-relaxed">{section.saipulaiUpgrade.summary}</p>
                           <div className="flex flex-wrap gap-2">
                              {section.saipulaiUpgrade.userBenefits?.map((b, i) => (
                                <span key={i} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[9px] text-purple-300 font-bold uppercase">
                                  ✓ {b}
                                </span>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
                           <h4 className="text-[8px] font-black text-white uppercase tracking-[0.2em] mb-2 opacity-50">Architecture Status</h4>
                           {Object.entries(section.saipulaiUpgrade.technicalUpdates || {}).map(([k, v], i) => (
                             <div key={i} className="flex justify-between text-[10px] border-b border-white/5 pb-2">
                                <span className="text-gray-600 capitalize">{k}</span>
                                <span className="text-blue-400 font-mono">{String(v)}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl">
                     <Icons.Code size={40} className="mx-auto text-gray-800 mb-4 opacity-50" />
                     <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">Technical Engine: Standard</h4>
                     <p className="text-gray-500 text-[10px] max-w-sm mx-auto leading-relaxed">Advanced AI technical specifications are only available for Intelligence-enabled modules. This section uses standard protocol architecture.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-8">
                {section.versionHistory?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {section.versionHistory.map((v, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center transition-all hover:bg-white/[0.04]">
                         <div className="text-lg font-black text-white mb-1 tracking-tighter">v{v.version}</div>
                         <div className="text-[8px] font-bold text-gray-500 mb-3 uppercase tracking-widest">{v.date}</div>
                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                           v.status === 'CURRENT' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-600'
                         }`}>
                           {v.status}
                         </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {section.changelog?.length > 0 ? (
                  <div className="relative pl-8 border-l border-white/10 space-y-8 mt-8">
                     {section.changelog.map((log, i) => (
                       <div key={i} className="relative">
                          <div className="absolute -left-[calc(2rem+0.5px)] top-1.5 w-3 h-3 rounded-full bg-cyan-500 border-2 border-[#020617] shadow-lg" />
                          <div className="flex items-center gap-3 mb-2">
                             <span className="text-sm font-black text-cyan-400">v{log.version}</span>
                             <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{log.date}</span>
                          </div>
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 text-xs leading-relaxed">
                             {log.changes}
                          </div>
                       </div>
                     ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-gray-600 text-xs italic">
                     No secondary changelog records found for this release cycle.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

// --- MAIN COMPONENT ---

export default function Doct() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemsPerPage = 6;

  const categories = useMemo(() => {
    const cats = new Set(["All"]);
    docsData.forEach(section => {
      if (section.tags) {
        section.tags.forEach(tag => {
          const t = tag.toLowerCase();
          if (["ai", "chatbot", "nlp"].includes(t)) cats.add("AI");
          if (["integrasi", "api", "plugin", "webhook"].includes(t)) cats.add("Technical");
          if (["keamanan", "security"].includes(t)) cats.add("Security");
          if (["dashboard", "fitur", "projek"].includes(t)) cats.add("Features");
          if (["dasar", "panduan-awal"].includes(t)) cats.add("Basics");
        });
      }
    });
    return Array.from(cats);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory]);

  const filteredSections = useMemo(() => {
    let result = [...docsData];

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(section => 
        section.title?.toLowerCase().includes(query) || 
        section.content?.toLowerCase().includes(query) ||
        section.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(section => {
        const tags = (section.tags || []).map(t => t.toLowerCase());
        if (selectedCategory === "AI") return tags.some(t => ["ai", "chatbot", "nlp"].includes(t));
        if (selectedCategory === "Technical") return tags.some(t => ["integrasi", "api", "plugin", "webhook"].includes(t));
        if (selectedCategory === "Security") return tags.some(t => ["keamanan", "security"].includes(t));
        if (selectedCategory === "Features") return tags.some(t => ["dashboard", "fitur", "projek"].includes(t));
        if (selectedCategory === "Basics") return tags.some(t => ["dasar", "panduan-awal"].includes(t));
        return true;
      });
    }

    return result;
  }, [debouncedSearch, selectedCategory]);

  const paginatedSections = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSections.slice(start, start + itemsPerPage);
  }, [filteredSections, currentPage]);

  const totalPages = Math.ceil(filteredSections.length / itemsPerPage);

  const toggleSection = useCallback((index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'CURRENT': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
      default: return 'bg-white/5 text-gray-500 border border-white/10';
    }
  }, []);

  const getVersionTypeColor = useCallback((type) => {
    switch (type) {
      case 'major': return 'border-red-500/50 text-red-400';
      default: return 'border-white/10 text-gray-400';
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 flex flex-col items-center py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Hero Section - Scaled Down */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center max-w-5xl mb-20 relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="flex justify-center mb-8"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500/30 blur-[60px] rounded-full group-hover:bg-cyan-500/50 transition-all duration-700"></div>
            <div className="relative glass-effect p-6 rounded-3xl border border-white/20 shadow-xl">
              <Icons.LayoutDashboard className="text-cyan-400" size={32} />
            </div>
          </div>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tighter">
          <span className="bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            System
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-fast">
            Documentation
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12 font-light">
          Master the system with 
          <span className="text-white font-bold italic"> precision guides</span>, 
          <span className="text-white font-bold italic"> real-time insights</span>, and 
          <span className="text-white font-bold italic"> intelligence hubs</span>.
        </p>

        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="relative group/search">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-2xl blur-lg opacity-20 group-hover/search:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center">
              <Icons.Search className="absolute left-6 text-gray-500 group-focus-within/search:text-cyan-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search resources... (CMD + K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl text-lg text-white placeholder-gray-700 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500/40 outline-none transition-all shadow-xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
             {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-white border-cyan-400 shadow-[0_5px_20px_rgba(6,182,212,0.3)] -translate-y-1"
                      : "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
          </div>
        </div>
      </motion.div>

      {/* Main Results Grid */}
      <div className="w-full max-w-5xl relative z-10">
        <AnimatePresence mode="wait">
           {filteredSections.length > 0 ? (
             <motion.div 
               key={`grid-${selectedCategory}-${debouncedSearch}`}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="grid grid-cols-1 gap-6"
             >
               {paginatedSections.map((section, index) => {
                 const actualIndex = (currentPage - 1) * itemsPerPage + index;
                 return (
                   <SectionItem
                     key={`section-${section.id}-${actualIndex}`}
                     section={section}
                     index={actualIndex}
                     isOpen={openIndex === actualIndex}
                     onToggle={toggleSection}
                     getStatusColor={getStatusColor}
                     getVersionTypeColor={getVersionTypeColor}
                   />
                 );
               })}
             </motion.div>
           ) : (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-24 text-center glass-card rounded-[2rem] border-white/10 shadow-xl"
             >
                <Icons.SearchX size={64} className="text-gray-800 mx-auto mb-6 opacity-50" />
                <h2 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">No Results Found</h2>
                <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">We couldn't find any documentation matching your current filters. Try resetting or adjusting your search.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} 
                  className="mt-8 px-6 py-3 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400 font-bold uppercase text-[10px] tracking-widest hover:bg-cyan-500 hover:text-white transition-all"
                >
                  Reset Filters
                </button>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Scaled Down Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-6">
             <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-5"
            >
              <Icons.ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
               {[...Array(totalPages)].map((_, i) => (
                 <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    currentPage === i + 1 
                      ? "bg-gradient-to-br from-cyan-400 to-blue-600 text-white border-white/30 shadow-lg scale-110" 
                      : "bg-white/5 border-white/5 text-gray-600 hover:text-white hover:border-white/20"
                  }`}
                 >
                   {i + 1}
                 </button>
               ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-5"
            >
              <Icons.ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Aesthetic Footer - Scaled Down */}
      <footer className="mt-40 w-full max-w-6xl py-20 border-t border-white/5 text-center relative">
         <div className="mb-8 flex justify-center gap-10">
            {[Icons.Github, Icons.Twitter, Icons.Linkedin, Icons.TerminalSquare, Icons.Globe].map((Icon, i) => (
              <div key={i} className="relative group cursor-pointer">
                 <Icon size={24} className="text-gray-700 hover:text-white relative z-10 transition-all duration-500 hover:scale-125" />
              </div>
            ))}
         </div>
         <p className="text-gray-700 text-[9px] font-black uppercase tracking-[0.8em] mb-4">Autonomous System &bull; Portfolio 2.0</p>
         <div className="flex justify-center items-center gap-3 text-gray-800 text-[7px] font-bold uppercase tracking-widest">
            <span>System Status: Online</span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
         </div>
      </footer>
    </div>
  );
}