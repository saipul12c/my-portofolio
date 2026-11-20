import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';

const CodeBlock = ({ language, codeString }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] text-gray-200 shadow-lg not-prose text-xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#161b22] border-b border-white/10 text-[10px] font-mono text-gray-400">
        <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-cyan-400">
          <Terminal className="w-3 h-3" />
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Disalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="font-sans">Salin</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto font-mono text-[11px] leading-relaxed select-text">
        <code>{codeString}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer = ({ content, alignRight = false, currentUsername = '' }) => {
  if (!content) return null;

  return (
    <div className={`prose prose-sm max-w-none break-words ${alignRight ? 'text-white prose-invert' : 'text-[var(--theme-text)]'
      }`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks & inline code
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && (match || codeString.includes('\n'))) {
              return <CodeBlock language={language} codeString={codeString} />;
            }

            return (
              <code
                className={`px-1.5 py-0.5 rounded-md font-mono text-[12px] font-semibold ${alignRight
                  ? 'bg-black/30 text-cyan-200'
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Format paragraphs & mentions
          p({ children }) {
            // Process mentions within paragraph text
            const processChild = (child) => {
              if (typeof child === 'string') {
                const parts = child.split(/(@[\w\u00C0-\u017F]+)/g);
                return parts.map((part, idx) => {
                  if (part.startsWith('@')) {
                    const cleanName = part.slice(1);
                    const isSaipul = cleanName.toLowerCase() === 'saipul' || cleanName.toLowerCase() === 'ai';
                    const isSelf = currentUsername && cleanName.toLowerCase() === currentUsername.toLowerCase();

                    return (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-full text-xs font-bold transition-transform hover:scale-105 ${isSaipul
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm ring-1 ring-purple-300/30'
                          : isSelf
                            ? 'bg-amber-500/30 text-amber-200 ring-1 ring-amber-400/40'
                            : 'bg-cyan-500/20 text-cyan-300 hover:underline'
                          }`}
                      >
                        {isSaipul && <span className="text-[10px]">🤖</span>}
                        {part}
                      </span>
                    );
                  }
                  return part;
                });
              }
              return child;
            };

            const processedChildren = React.Children.map(children, processChild);
            return <p className="mb-1.5 last:mb-0 leading-relaxed">{processedChildren}</p>;
          },
          // Links (Strict Protocol Sanitization against XSS)
          a({ href, children }) {
            const isSafe = /^https?:\/\//i.test(href || '');
            if (!isSafe) {
              return <span className="font-semibold underline opacity-70">{children}</span>;
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 ${alignRight ? 'text-cyan-200 hover:text-white' : 'text-cyan-400 hover:text-cyan-300'
                  }`}
              >
                {children}
                <ExternalLink className="w-3 h-3 inline-block opacity-70" />
              </a>
            );
          },
          // Blockquote
          blockquote({ children }) {
            return (
              <blockquote className={`border-l-4 pl-3 py-1 my-2 italic rounded-r-xl ${alignRight
                ? 'border-white/40 bg-black/20 text-white/90'
                : 'border-cyan-500/50 bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)]'
                }`}>
                {children}
              </blockquote>
            );
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-1 my-1.5 pl-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-1 my-1.5 pl-1">{children}</ol>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
