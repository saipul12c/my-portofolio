import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * 🛡️ GlobalErrorBoundary
 * Menangkap error runtime React di komponen halaman/fitur
 * sehingga kegagalan satu fitur atau koneksi API tidak membuat seluruh situs blank/crash.
 */
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🛡️ [GlobalErrorBoundary] Error tertangkap:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = Boolean(import.meta && import.meta.env && import.meta.env.DEV);

      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[var(--color-gray-900)] text-white">
          <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text">
                Halaman Mengalami Kendala
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Terjadi gangguan saat memuat konten atau server sedang offline. Halaman dan fitur lainnya tetap berfungsi normal.
              </p>
            </div>

            {isDev && this.state.error && (
              <div className="text-left bg-black/40 border border-white/10 p-3 rounded-xl overflow-x-auto text-xs text-rose-300 font-mono max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-medium transition-all hover:scale-105 cursor-pointer text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Muat Ulang
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all hover:scale-105 cursor-pointer text-sm"
              >
                <Home className="w-4 h-4" />
                Ke Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
