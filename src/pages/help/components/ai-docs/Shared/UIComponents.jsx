import React, { useState } from "react";
import { 
  FaTerminal, 
  FaFolderOpen, 
  FaFileCode, 
  FaChevronRight,
  FaChevronDown,
  FaCode
} from "react-icons/fa";

export const FileTree = ({ items, root = "src/components/helpbutton/chat/" }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-4 bg-black/40 rounded-lg border border-gray-700/50 p-3 font-mono text-[11px]">
      <div 
        className="flex items-center gap-2 text-gray-400 mb-2 cursor-pointer hover:text-gray-300 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <FaChevronDown className="text-[10px]" /> : <FaChevronRight className="text-[10px]" />}
        <FaFolderOpen className="text-yellow-500/80" />
        <span>{root}</span>
      </div>
      
      {expanded && (
        <div className="ml-4 space-y-1.5 border-l border-gray-800 pl-3">
          {items.map((path, idx) => {
            if (typeof path === "string") {
              const parts = path.split('/');
              const fileName = parts.pop();
              const folder = parts.join('/');
              
              return (
                <div key={idx} className="group flex flex-col gap-1">
                  {folder && (
                    <div className="flex items-center gap-2 text-gray-400/60">
                      <FaFolderOpen className="text-[10px] text-yellow-600/40" />
                      <span>{folder}/</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-blue-400 pl-4 group-hover:text-blue-300 transition-colors cursor-pointer">
                    <FaFileCode className="text-[10px] text-blue-500/70" />
                    <span className="font-medium underline decoration-blue-500/30 underline-offset-4">{fileName}</span>
                  </div>
                </div>
              );
            } else if (path.type === "folder") {
              return (
                <div key={idx} className="flex items-center gap-2 text-yellow-500/60">
                  <FaFolderOpen className="text-[10px]" />
                  <span>{path.name}/ <span className="text-gray-600 text-[10px] ml-2 italic"># {path.desc}</span></span>
                </div>
              );
            } else if (path.type === "file") {
              return (
                <div key={idx} className="flex items-center gap-2 text-green-400/80 ml-4 group cursor-pointer hover:text-green-300 transition-colors">
                  <FaFileCode className="text-[10px] opacity-60" />
                  <span>{path.name} <span className="text-gray-600 text-[10px] ml-2 italic group-hover:text-gray-500 tracking-tighter transition-colors"># {path.desc}</span></span>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export const TerminalWrap = ({ title, children, type, status = "active" }) => {
  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl transition-all hover:border-blue-500/30 group w-full">
      {/* Tool Bar */}
      <div className="bg-[#2d2d2d] px-4 py-2.5 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className={`w-3 h-3 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-[#ff5f56]'}`} />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="ml-4 h-4 w-[1px] bg-gray-700 mx-2" />
          <div className="flex items-center gap-2 text-gray-400">
            <FaTerminal className="text-xs" />
            <span className="text-[11px] font-mono tracking-wider uppercase opacity-80">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {status === 'active' && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-green-500 font-mono uppercase tracking-tighter">Running</span>
            </div>
          )}
          <div className="text-[10px] font-mono text-gray-500 px-2 py-0.5 bg-black/20 rounded">
            {type}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 font-mono">
        {children}
      </div>
    </div>
  );
};

export const FormattedResponse = ({ text }) => {
  if (!text) return null;

  const steps = text.split(" → ");
  
  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        return (
          <div key={idx} className="flex items-start gap-3 group/step">
            <div className="mt-1 flex-shrink-0">
              {idx === steps.length - 1 ? (
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover/step:border-blue-500/40 transition-colors">
                  <FaChevronRight className="text-[10px] text-blue-400/70" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <span className={`text-[13px] leading-relaxed ${idx === steps.length - 1 ? 'text-green-300/90 font-medium' : 'text-gray-300/80'}`}>
                <FormattedText>
                  {step.replace(/'(.*?)'/g, '`$1`')}
                </FormattedText>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export const FormattedText = ({ children }) => {
  if (!children || typeof children !== "string") return children;

  // Split by bold (**), italics (*), strikethrough (~~), and code (`)
  const parts = children.split(/(\*\*.*?\*\*|\*[^*]+\*|~~.*?~~|`.*?`|\[.*?\]\(.*?\))/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        
        // Bold: **text**
        if (part.startsWith("**") && part.endsWith("**")) {
          return <span key={i} className="font-bold text-gray-100">{part.slice(2, -2)}</span>;
        }
        
        // Italics: *text* (but not **)
        if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
          return <span key={i} className="italic text-gray-300/90">{part.slice(1, -1)}</span>;
        }
        
        // Strikethrough: ~~text~~
        if (part.startsWith("~~") && part.endsWith("~~")) {
          return <span key={i} className="line-through text-gray-500 opacity-60">{part.slice(2, -2)}</span>;
        }
        
        // Code: `text`
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="bg-white/5 px-1.5 py-0.5 rounded text-blue-300 border border-white/10 mx-0.5 font-mono text-[10px]">{part.slice(1, -1)}</code>;
        }

        // Links: [text](url)
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <a 
              key={i} 
              href={linkMatch[2]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 underline-offset-2 transition-colors inline-flex items-center gap-1"
            >
              {linkMatch[1]}
            </a>
          );
        }
        
        return part;
      })}
    </>
  );
};

export const detectFiles = (text) => {
  if (!text || typeof text !== "string") return [];
  
  // Improved Regex:
  // 1. Files: letters/digits/underscores/dashes, then a dot, then common extensions (js/jsx/json/css/md/etc)
  // 2. Folders: paths ending with / or common directory patterns like src/, data/, components/
  const fileRegex = /\b([a-zA-Z0-9_\-./]+\.(?:js|jsx|json|css|html|md|py|sh|ts|tsx|txt|yml|yaml))\b/g;
  const folderRegex = /\b([a-zA-Z0-9_\-.]+\/([a-zA-Z0-9_\-.]+\/)*)/g;
  
  const files = text.match(fileRegex) || [];
  const folders = text.match(folderRegex) || [];
  
  // Exclude some false positives (e.g. urls, version numbers like 1.0.0)
  const isExcluded = (str) => {
    if (str.startsWith('http')) return true;
    if (/^\d+\.\d+\.\d+$/.test(str)) return true; // Version like 2.0.0
    return false;
  };

  return [...new Set([...files, ...folders])]
    .filter(item => !isExcluded(item))
    .map(item => {
      const name = item;
      const isFolder = name.endsWith('/') || !name.includes('.');
      return {
        type: isFolder ? "folder" : "file",
        name: name,
        desc: isFolder ? "Directory reference" : "Source file"
      };
    });
};

export const SmartText = ({ children, className = "" }) => {
  return (
    <div className={className}>
      <FormattedText>{children}</FormattedText>
      <FileChips text={children} className="opacity-70" />
    </div>
  );
};

export const FileChips = ({ text, className = "" }) => {
  const items = detectFiles(text);
  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 group hover:border-blue-500/30 hover:text-blue-300 transition-all cursor-default"
          title={item.desc}
        >
          {item.type === "folder" ? <FaFolderOpen className="text-yellow-600/50 group-hover:text-yellow-500" /> : <FaFileCode className="text-blue-500/50 group-hover:text-blue-400" />}
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
};
