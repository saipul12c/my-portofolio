import { motion } from "framer-motion";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ErrorState = ({ message, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md w-full"
    >
      {/* Error Icon */}
      <div className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 mx-auto mb-4 sm:mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
        <XCircle className="text-red-400 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12" />
      </div>

      {/* Error Text */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
        Gagal Memuat Data
      </h2>
      <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center">
        <button
          onClick={onRetry}
          className="px-4 xs:px-6 py-2.5 xs:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg xs:rounded-xl transition-colors flex items-center justify-center xs:justify-start gap-2 font-semibold text-sm xs:text-base"
        >
          <RefreshCw size={16} className="xs:w-4 xs:h-4" />
          Coba Lagi
        </button>
        <Link
          to="/testimoni"
          className="px-4 xs:px-6 py-2.5 xs:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg xs:rounded-xl transition-colors flex items-center justify-center xs:justify-start gap-2 font-semibold text-sm xs:text-base"
        >
          <ArrowLeft size={16} className="xs:w-4 xs:h-4" />
          Kembali
        </Link>
      </div>
    </motion.div>
  </div>
);

export default ErrorState;