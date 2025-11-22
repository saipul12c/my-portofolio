import { motion } from 'framer-motion';

const Modal = ({ children, onClose, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-120',
    xl: 'w-160'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-[#36393f] rounded-lg p-6 ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;