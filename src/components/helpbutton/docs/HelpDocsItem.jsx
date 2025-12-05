import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import docsData from "./data/docsSections.json";

// Virtualized list component untuk render performa tinggi
const VirtualizedList = ({ items, renderItem, itemHeight, containerHeight, overscan = 5 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => setScrollTop(container.scrollTop);
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push(renderItem(i));
    }
    return items;
  }, [startIndex, endIndex, renderItem]);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      className="virtualized-container hide-scrollbar"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleItems}
        </div>
      </div>
    </div>
  );
};

// Optimized section component dengan memo
const SectionItem = memo(({ 
  section, 
  index, 
  isOpen, 
  onToggle,
  getStatusColor,
  getVersionTypeColor,
  getTagColor 
}) => {
  const IconComponent = Icons[section.icon] || Icons.BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group${isOpen ? ' z-20' : ''}`}
      style={{ marginBottom: isOpen ? '16px' : '8px', position: 'relative' }}
    >
      <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl hover:shadow-3xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:border-blue-400/40 dark:hover:border-blue-500/40 overflow-hidden relative">
        <button
          onClick={() => onToggle(index)}
          className="w-full flex justify-between items-start p-6 md:p-8 text-left group focus:outline-none focus:ring-2 focus:ring-blue-400/50"
        >
          <div className="flex items-start gap-4 md:gap-6 flex-1">
            <div className="flex-shrink-0 mt-1">
              <div
                className="p-4 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300 border-2 border-white dark:border-gray-900"
                style={{
                  background: `linear-gradient(135deg, ${section.visual?.color || '#3b82f6'} 0%, ${section.visual?.color ? `${section.visual.color}80` : '#8b5cf6'} 100%)`
                }}
              >
                <IconComponent className="text-white" size={28} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {section.title}
                </h2>
                {section.visual?.badge && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-current shadow-sm"
                    style={{ color: section.visual.color }}
                  >
                    {section.visual.badge}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getVersionTypeColor(section.versionType)}`}>
                  v{section.version}
                </span>
                {section.releaseChannel && (
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold border border-gray-300 dark:border-gray-600">
                    {section.releaseChannel}
                  </span>
                )}
              </div>
              {section.visual?.summary && (
                <p className="text-gray-500 dark:text-gray-400 text-base italic mb-2">
                  {section.visual.summary}
                </p>
              )}
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-3 text-base">
                {section.content}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Icons.User size={14} />
                  <span>{section.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icons.Calendar size={14} />
                  <span>{section.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icons.Clock size={14} />
                  <span>{section.estimatedReadTime}</span>
                </div>
                {section.versionCode && (
                  <div className="flex items-center gap-1">
                    <Icons.Code size={14} />
                    <span className="font-mono text-xs">{section.versionCode}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {section.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex-shrink-0 ml-4 mt-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors"
          >
            <Icons.ChevronDown size={22} className="text-gray-600 dark:text-gray-400" />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <SectionContent section={section} getStatusColor={getStatusColor} getVersionTypeColor={getVersionTypeColor} />
          )}
        </AnimatePresence>
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-blue-400/40 via-purple-400/30 to-pink-400/40" />
      </div>
    </motion.div>
  );
});

// Memisahkan konten section untuk optimasi
const SectionContent = memo(({ section, getStatusColor, getVersionTypeColor }) => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className="border-t border-gray-200 dark:border-gray-700"
  >
    <div className="p-6 space-y-8">
      {/* Version History & Compatibility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.versionHistory?.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icons.History size={18} />
              Version History
            </h3>
            <div className="space-y-3">
              {section.versionHistory?.map((version, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">v{version.version}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(version.status)}`}>
                      {version.status}
                    </span>
                    {version.breakingChanges && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                        Breaking
                      </span>
                    )}
                    {version.migrationRequired && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-xs">
                        Migration
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{version.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section.compatibility && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icons.Settings size={18} />
              Compatibility
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Min Required:</span>
                <span className="font-mono">v{section.compatibility.minRequired}</span>
              </div>
              <div className="flex justify-between">
                <span>Tested Up To:</span>
                <span className="font-mono">v{section.compatibility.testedUpTo}</span>
              </div>
              <div className="flex justify-between">
                <span>API Version:</span>
                <span className="font-mono">{section.compatibility.apiCompatibility}</span>
              </div>
              {section.compatibility.browserSupport && (
                <div>
                  <span className="block mb-2">Browser Support:</span>
                  <div className="flex flex-wrap gap-2">
                    {section.compatibility.browserSupport.map((browser, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                        {browser}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subsections dengan lazy loading */}
      {section.subsections?.length > 0 && (
        <LazySubsections subsections={section.subsections} />
      )}

      {section.changelog?.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icons.GitPullRequest size={18} />
            Changelog
          </h3>
          <div className="space-y-3">
            {section.changelog.map((log, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                  log.type === 'major' ? 'bg-red-500' :
                  log.type === 'feature' ? 'bg-green-500' :
                  log.type === 'improvement' ? 'bg-blue-500' :
                  log.type === 'security' ? 'bg-red-500' :
                  log.type === 'performance' ? 'bg-teal-500' :
                  log.type === 'deprecated' ? 'bg-yellow-500' :
                  log.type === 'enhancement' ? 'bg-purple-500' :
                  log.type === 'documentation' ? 'bg-indigo-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium">v{log.version}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getVersionTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                    {log.date && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{log.date}</span>
                    )}
                  </div>
                  {log.changes && (
                    <p className="text-gray-700 dark:text-gray-300">{log.changes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.relatedDocs?.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icons.Link size={18} />
              Related Documentation
            </h3>
            <div className="flex flex-wrap gap-2">
              {section.relatedDocs.map((doc, i) => (
                <span
                  key={i}
                  className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                >
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}

        {section.resources?.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icons.Download size={18} />
              Resources
            </h3>
            <div className="space-y-2">
              {section.resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors group"
                >
                  <Icons.ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {res.label || 'Resource Link'}
                    </p>
                    {res.type && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{res.type}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </motion.div>
));

// Lazy loaded subsections untuk performa
const LazySubsections = memo(({ subsections }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 5, subsections.length));
  }, [subsections.length]);

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Icons.ListTodo size={18} />
        Contents
      </h3>
      <div className="grid gap-4">
        {subsections.slice(0, visibleCount).map((sub, subIndex) => (
          <div key={subIndex} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            {sub.subtitle ? (
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                <Icons.ChevronRight size={16} className="flex-shrink-0" />
                {sub.subtitle}
              </h4>
            ) : sub.tips ? (
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                <Icons.ChevronRight size={16} className="flex-shrink-0" />
                Tips & Information
              </h4>
            ) : null}
            
            {sub.details && (
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {sub.details}
              </p>
            )}
            
            {sub.tips && (
              <div className="flex items-start gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg border border-blue-200 dark:border-blue-700 mb-3">
                <Icons.Lightbulb size={16} className="flex-shrink-0 mt-0.5" />
                <span>{sub.tips}</span>
              </div>
            )}

            {sub.warning && (
              <div className="flex items-start gap-2 text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700 mb-3">
                <Icons.AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{sub.warning}</span>
              </div>
            )}

            {sub.examples && (
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Example:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{sub.examples}</p>
              </div>
            )}

            {sub.codeSnippet && (
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 mb-3">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-xs font-medium text-gray-300">Code Snippet</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(sub.codeSnippet)}
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    <Icons.Copy size={14} />
                  </button>
                </div>
                <pre className="p-4 text-sm text-green-400 overflow-x-auto">
                  <code>{sub.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {visibleCount < subsections.length && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Load More ({subsections.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
});

// Main component dengan optimasi
// Hide scrollbar utility (inject global style)
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(style);
}

export default function HelpDocsItem() {
  const [openIndex, setOpenIndex] = useState(null);
  const [docsSections, setDocsSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [displayMode, setDisplayMode] = useState('virtualized');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load data
  useEffect(() => {
    setDocsSections(Array.isArray(docsData) ? docsData : []);
  }, []);

  // Optimized search dan sort dengan useMemo
  const filteredSections = useMemo(() => {
    let result = [...docsSections];

    // Filter berdasarkan search query
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(section => {
        const title = (section.title || '').toLowerCase();
        const content = (section.content || '').toLowerCase();
        const tagsMatch = (section.tags || []).some(tag => (tag || '').toLowerCase().includes(query));
        const subsectionsMatch = (section.subsections || []).some(sub => (
          (sub.subtitle || '').toLowerCase().includes(query) ||
          (sub.details || '').toLowerCase().includes(query) ||
          (sub.tips || '').toLowerCase().includes(query) ||
          (sub.warning || '').toLowerCase().includes(query) ||
          (sub.examples || '').toLowerCase().includes(query)
        ));
        const visualSummary = ((section.visual && section.visual.summary) || '').toLowerCase();
        const author = (section.author || '').toLowerCase();

        return (
          title.includes(query) ||
          content.includes(query) ||
          tagsMatch ||
          subsectionsMatch ||
          visualSummary.includes(query) ||
          author.includes(query)
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case 'version':
          aValue = parseFloat(a.version);
          bValue = parseFloat(b.version);
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [debouncedSearch, docsSections, sortBy, sortOrder]);

  // Paginated data
  const paginatedSections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSections.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSections, currentPage]);

  const totalPages = Math.ceil(filteredSections.length / itemsPerPage);

  const toggleSection = useCallback((index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  // Color functions dengan useCallback
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'CURRENT': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'SUPPORTED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'DEPRECATED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }, []);

  const getVersionTypeColor = useCallback((type) => {
    switch (type) {
      case 'major': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'stable': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'feature': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'security': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'documentation': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'enhancement': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }, []);

  const getTagColor = useCallback((tag) => {
    const colors = [
      "bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-700",
      "bg-purple-100/80 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-700",
      "bg-pink-100/80 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300 border border-pink-200 dark:border-pink-700",
      "bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-700",
      "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700",
      "bg-orange-100/80 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-200 dark:border-orange-700",
      "bg-teal-100/80 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 border border-teal-200 dark:border-teal-700",
      "bg-red-100/80 text-red-700 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-700",
    ];
    const index = tag
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }, []);

  // Virtualized list render item
  const renderVirtualizedItem = useCallback((index) => {
    const section = filteredSections[index];
    if (!section) return null;

    return (
      <div
        key={section.id ?? `virtual-${index}`}
        style={{
          width: '100%',
          height: 400,
          boxSizing: 'border-box'
        }}
      >
        <SectionItem
          section={section}
          index={index}
          isOpen={openIndex === index}
          onToggle={toggleSection}
          getStatusColor={getStatusColor}
          getVersionTypeColor={getVersionTypeColor}
          getTagColor={getTagColor}
        />
      </div>
    );
  }, [filteredSections, openIndex, toggleSection, getStatusColor, getVersionTypeColor, getTagColor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900/10 text-gray-800 dark:text-gray-100 flex flex-col items-center py-12 px-4 sm:px-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-4xl mb-16"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            <Icons.BookText className="text-blue-500 relative z-10" size={48} />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
          Documentation Hub
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
          Comprehensive guides, API references, and best practices to help you master our platform
        </p>

        {/* Enhanced Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search documentation, APIs, features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Controls Section */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* Display Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setDisplayMode('virtualized')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                displayMode === 'virtualized' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Virtualized List
            </button>
            <button
              onClick={() => setDisplayMode('paginated')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                displayMode === 'paginated' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Paginated View
            </button>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <option value="id">Sort by ID</option>
              <option value="title">Sort by Title</option>
              <option value="lastUpdated">Sort by Date</option>
              <option value="version">Sort by Version</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Icons.BookOpen size={16} />
            <span>{filteredSections.length} Sections</span>
          </div>
          <div className="flex items-center gap-2">
            <Icons.Clock size={16} />
            <span>Updated Daily</span>
          </div>
          <div className="flex items-center gap-2">
            <Icons.Code size={16} />
            <span>API v4 Ready</span>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      {debouncedSearch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-4xl mb-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Found {filteredSections.length} results for "<span className="font-semibold">{debouncedSearch}</span>"
          </p>
        </motion.div>
      )}

      {/* Docs Display */}
      {displayMode === 'virtualized' ? (
        <div className="w-full max-w-4xl">
          <VirtualizedList
            items={filteredSections}
            renderItem={renderVirtualizedItem}
            itemHeight={400}
            containerHeight={600}
            overscan={3}
          />
        </div>
      ) : (
        <>
          {/* Paginated View */}
          <div className="w-full max-w-4xl grid gap-6">
            {paginatedSections.map((section, index) => {
              const actualIndex = (currentPage - 1) * itemsPerPage + index;
              return (
                <SectionItem
                  key={section.id || actualIndex}
                  section={section}
                  index={actualIndex}
                  isOpen={openIndex === actualIndex}
                  onToggle={toggleSection}
                  getStatusColor={getStatusColor}
                  getVersionTypeColor={getVersionTypeColor}
                  getTagColor={getTagColor}
                />
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              
              <span className="text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {filteredSections.length === 0 && debouncedSearch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Icons.SearchX size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or browse all documentation sections.
          </p>
        </motion.div>
      )}
    </div>
  );
}