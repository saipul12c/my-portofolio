import React, { useState, useEffect, useCallback, memo } from 'react';
import { MdClose, MdQrCode, MdContentCopy, MdDownload, MdShare } from 'react-icons/md';
import { HiClipboardCheck } from 'react-icons/hi';

const PORTAL_URL = 'https://syaiful-mukmin.netlify.app/portal';

const QRCodeModal = memo(({ isOpen, onClose, onShare }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate QR dynamically using lazy-loaded QRCode library
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setDownloadSuccess(false);
      return;
    }

    if (qrCodeUrl) return;

    let isMounted = true;
    const generate = async () => {
      try {
        setIsGenerating(true);
        // Dynamic import so qrcode is only fetched when modal is actually opened!
        const QRCode = (await import('qrcode')).default;
        const url = await QRCode.toDataURL(PORTAL_URL, {
          width: 320,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        });
        if (isMounted) setQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate QR Code:', err);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };

    generate();

    return () => {
      isMounted = false;
    };
  }, [isOpen, qrCodeUrl]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = useCallback(() => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(PORTAL_URL).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `syaiful-mukmin-portal-qrcode-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  }, [qrCodeUrl]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Portal QR Code Dialog"
    >
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 max-w-4xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-800">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Portal Profile QR Code</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Scan untuk mengunjungi portal di perangkat mobile</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Tutup Modal"
          >
            <MdClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Responsive Content */}
        <div className="flex flex-col md:flex-row">
          {/* QR Display */}
          <div className="md:w-1/2 p-6 sm:p-8 md:border-r border-gray-800 flex flex-col items-center justify-center">
            <div className="relative bg-white p-4 rounded-xl mb-4 w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center shadow-lg">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin mb-3" />
                  <p className="text-gray-600 text-xs">Generating QR Code...</p>
                </div>
              ) : qrCodeUrl ? (
                <>
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Portal Muhammad Syaiful Mukmin"
                    className="w-full h-full object-contain"
                  />
                  {/* Center Badge */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-base font-bold text-white select-none">SM</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <MdQrCode className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600 text-xs">Memuat QR Code...</p>
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-white">SM</div>
              <div className="text-gray-400 text-xs">Portal Muhammad Syaiful Mukmin</div>
            </div>
          </div>

          {/* Controls & Details */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* URL Link Box */}
              <div className="mb-6">
                <span className="text-gray-400 text-xs font-medium block mb-2">LINK PORTAL:</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-800/60 rounded-lg p-2.5 sm:p-3 border border-gray-700 min-w-0">
                    <p className="text-white text-xs sm:text-sm font-mono truncate">{PORTAL_URL}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <HiClipboardCheck className="w-4 h-4 text-green-400" />
                        <span className="text-green-300">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <MdContentCopy className="w-4 h-4" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  disabled={!qrCodeUrl}
                  className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all ${
                    qrCodeUrl
                      ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-600/30 cursor-pointer active:scale-[0.99]'
                      : 'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${qrCodeUrl ? 'bg-emerald-500/20' : 'bg-gray-700'}`}>
                      <MdDownload className={`w-5 h-5 ${qrCodeUrl ? 'text-emerald-400' : 'text-gray-500'}`} />
                    </div>
                    <div className="text-left">
                      <div className={`text-xs sm:text-sm font-medium ${qrCodeUrl ? 'text-white' : 'text-gray-400'}`}>
                        {downloadSuccess ? 'Berhasil Diunduh!' : 'Download PNG'}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-400">High Quality 320x320px</div>
                    </div>
                  </div>
                  {qrCodeUrl && <span className="text-emerald-400 text-sm font-medium">→</span>}
                </button>

                {onShare && (
                  <button
                    onClick={onShare}
                    className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:border-purple-500/60 hover:bg-purple-600/30 transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <MdShare className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-medium text-white">Share Portal</div>
                        <div className="text-[10px] sm:text-xs text-gray-400">Bagi tautan ke media sosial</div>
                      </div>
                    </div>
                    <span className="text-purple-400 text-sm font-medium">→</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Steps */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <span className="text-gray-400 text-xs font-medium block mb-2">📱 Cara Menggunakan:</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-gray-800/40 rounded-lg">
                  <span className="text-xs font-bold text-white block mb-0.5">1</span>
                  <p className="text-gray-400 text-[10px]">Buka kamera / scanner</p>
                </div>
                <div className="p-2 bg-gray-800/40 rounded-lg">
                  <span className="text-xs font-bold text-white block mb-0.5">2</span>
                  <p className="text-gray-400 text-[10px]">Arahkan ke QR</p>
                </div>
                <div className="p-2 bg-gray-800/40 rounded-lg">
                  <span className="text-xs font-bold text-white block mb-0.5">3</span>
                  <p className="text-gray-400 text-[10px]">Buka tautan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-900/60 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-[11px]">
            QR Code resmi portal: <span className="text-emerald-400 font-mono">syaiful-mukmin.netlify.app/portal</span>
          </p>
        </div>
      </div>
    </div>
  );
});

QRCodeModal.displayName = 'QRCodeModal';
export default QRCodeModal;
