/* global process */
import React from 'react';

/**
 * ErrorBoundary - Menangkap errors dari child components
 * Mencegah crash keseluruhan app dengan graceful fallback
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);

    this.setState((prev) => ({
      error,
      errorInfo,
      errorCount: prev.errorCount + 1
    }));

    // Log to service (future implementation)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    try {
      const errorLog = {
        message: error?.message || 'Unknown error',
        stack: error?.stack || '',
        componentStack: errorInfo?.componentStack || '',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // In future, send to backend logging service
      console.log('[ErrorLog]', errorLog);
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            padding: '20px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <h2 style={{ color: '#856404', marginTop: 0 }}>
            ⚠️ Oops! Terjadi Kesalahan
          </h2>

          <p style={{ color: '#856404', marginBottom: '10px' }}>
            Maaf, chat mengalami masalah tak terduga. Jangan khawatir, data Anda aman.
          </p>

          {isDevelopment && this.state.error && (
            <details
              style={{
                width: '100%',
                maxHeight: '200px',
                overflow: 'auto',
                backgroundColor: '#fff',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '12px',
                fontFamily: 'monospace',
                border: '1px solid #ddd'
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                📋 Detail Error (Development Only)
              </summary>
              <pre style={{ margin: '10px 0 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffc107',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              🔄 Coba Lagi
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#fff'
              }}
            >
              🔄 Refresh Halaman
            </button>
          </div>

          {this.state.errorCount > 3 && (
            <p style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#f8d7da',
              borderRadius: '4px',
              color: '#721c24',
              fontSize: '12px'
            }}>
              ℹ️ Error terjadi {this.state.errorCount} kali. Coba refresh halaman atau hubungi support jika masalah berlanjut.
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
