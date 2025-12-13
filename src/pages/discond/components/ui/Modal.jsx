import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

const Modal = ({ children, onClose, size = 'md', ariaLabel = 'Dialog' }) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  const containerRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const node = containerRef.current;
    node?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose && onClose();
      }

      if (e.key === 'Tab') {
        const focusable = node.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      try { previouslyFocused.current?.focus(); } catch (e) { /* ignore */ }
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
      role="presentation"
      aria-hidden={false}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-[#36393f] rounded-lg p-6 w-full ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={0}
        ref={containerRef}
      >
        <div className="absolute right-3 top-3">
          <button aria-label="Tutup" onClick={onClose} className="p-1 rounded hover:bg-white/5 text-gray-200">
            ×
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;