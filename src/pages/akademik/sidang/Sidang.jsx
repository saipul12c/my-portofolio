import React from 'react';

const Sidang = () => {
  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 10px rgba(168,85,247,0.5); }
            50% { box-shadow: 0 0 30px rgba(168,85,247,0.9); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-fade-up {
            animation: fadeInUp 1s ease-out forwards;
          }
          .delay-200 {
            animation-delay: 0.2s;
          }
          .delay-400 {
            animation-delay: 0.4s;
          }
          .delay-600 {
            animation-delay: 0.6s;
          }
          .glow-on-hover:hover {
            animation: glow 1.5s infinite;
          }
          .card-hover {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          .card-hover:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 30px -10px rgba(0,0,0,0.3);
          }
        `}
      </style>

      <div className="relative min-h-screen bg-gray-900 text-white overflow-x-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-abstract-colored-waves-148/1080p.mp4"
            type="video/mp4"
          />
          Browser kamu tidak mendukung video tag.
        </video>

        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

        {/* Floating shapes */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-overlay filter blur-2xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-600 rounded-full mix-blend-overlay filter blur-2xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-red-500 rounded-full mix-blend-overlay filter blur-xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Sidang Skripsi
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-200 animate-fade-up delay-200">
            Puncak perjuangan akademik. Pertahankan hasil penelitianmu di hadapan tim penguji.
          </p>
          <div className="flex gap-4 animate-fade-up delay-400">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform glow-on-hover">
              Daftar Sidang
            </button>
            <button className="px-8 py-3 border-2 border-white rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all">
              Informasi
            </button>
          </div>
        </div>

        {/* Fitur Section */}
        <div className="relative z-20 py-20 px-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm">
          <h2 className="text-4xl font-bold text-center mb-16 animate-fade-up">Persiapan Sidang</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="card-hover bg-gray-800 rounded-2xl p-8 text-center shadow-xl animate-fade-up delay-200">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-600 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Dokumen Skripsi</h3>
              <p className="text-gray-400">Unggah naskah skripsi final dan kelengkapan administrasi.</p>
            </div>

            {/* Card 2 */}
            <div className="card-hover bg-gray-800 rounded-2xl p-8 text-center shadow-xl animate-fade-up delay-400">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-600 rounded-full flex items-center justify-center animate-spin-slow">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 14H3V8h18v12z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Jadwal Sidang</h3>
              <p className="text-gray-400">Cek jadwal sidang dan ruangan, serta susunan tim penguji.</p>
            </div>

            {/* Card 3 */}
            <div className="card-hover bg-gray-800 rounded-2xl p-8 text-center shadow-xl animate-fade-up delay-600">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm1-17.93c3.94.49 7 3.85 7 7.93s-3.06 7.44-7 7.93V4.07z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pengumuman Kelulusan</h3>
              <p className="text-gray-400">Hasil sidang akan diumumkan langsung setelah presentasi dan tanya jawab.</p>
            </div>
          </div>
        </div>

        <footer className="relative z-20 bg-gray-900 bg-opacity-90 py-6 text-center text-gray-400 border-t border-gray-800">
          <p>© 2026 Fakultas Ilmu Komputer. Sidang Skripsi, akhir dari perjalanan.</p>
        </footer>
      </div>
    </>
  );
};

export default Sidang;