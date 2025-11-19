import { useState, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setError(error);
      console.error('Error Boundary caught an error:', error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-red-900/20 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          {/* Error Icon */}
          <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-400 w-8 sm:w-10 h-8 sm:h-10" />
          </div>

          {/* Error Text */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Maaf, terjadi error saat memuat halaman.
          </p>

          {/* Reload Button */}
          <button
            onClick={() => window.location.reload()}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-2 mx-auto font-semibold text-sm sm:text-base"
          >
            <RefreshCw size={16} className="sm:w-4 sm:h-4" />
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;