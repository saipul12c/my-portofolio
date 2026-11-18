import React from 'react';

const Sempro = () => {
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
            0%, 100% { box-shadow: 0 0 10px rgba(6,182,212,0.5); }
            50% { box-shadow: 0 0 30px rgba(6,182,212,0.9); }
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

      <div className="relative min-h-screen bg-[var(--color-gray-900)] text-white overflow-x-hidden">
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

        <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-[2px]"></div>

        {/* Floating shapes */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-24 h-24 bg-cyan-500 rounded-full mix-blend-overlay filter blur-2xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-600 rounded-full mix-blend-overlay filter blur-2xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-teal-500 rounded-full mix-blend-overlay filter blur-xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500">
              Seminar Proposal
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-200 animate-fade-up delay-200">
            Langkah krusial memvalidasi gagasan penelitian. Uji kelayakan metode, ruang lingkup, dan kesiapan proposal skripsi.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up delay-400">
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform glow-on-hover shadow-lg shadow-cyan-500/25">
              Daftar Sempro
            </button>
            <button className="px-8 py-3 border-2 border-white/80 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm">
              Panduan Penyusunan
            </button>
          </div>
        </div>

        {/* Tahapan & Fitur Section */}
        <div className="relative z-20 py-20 px-4 bg-slate-900/80 backdrop-blur-md border-t border-white/10">
          <h2 className="text-4xl font-bold text-center mb-4 animate-fade-up">Tahapan Seminar Proposal</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Persiapkan setiap detail sebelum melangkah ke hadapan dosen penguji dan pembimbing.</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="card-hover bg-slate-800/60 border border-white/10 rounded-2xl p-8 text-center shadow-xl backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-2xl font-bold">
                01
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Validasi Judul & Bab 1-3</h3>
              <p className="text-gray-400 leading-relaxed">Penyusunan latar belakang yang kuat, rumusan masalah, metodologi penelitian, serta tinjauan pustaka yang relevan.</p>
            </div>

            {/* Card 2 */}
            <div className="card-hover bg-slate-800/60 border border-white/10 rounded-2xl p-8 text-center shadow-xl backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center text-2xl font-bold">
                02
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Presentasi & Tanya Jawab</h3>
              <p className="text-gray-400 leading-relaxed">Pemaparan slide deck dalam 15-20 menit diikuti sesi diskusi kritis bersama dewan penguji terkait kebaruan dan kelayakan.</p>
            </div>

            {/* Card 3 */}
            <div className="card-hover bg-slate-800/60 border border-white/10 rounded-2xl p-8 text-center shadow-xl backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-2xl flex items-center justify-center text-2xl font-bold">
                03
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Revisi & Izin Penelitian</h3>
              <p className="text-gray-400 leading-relaxed">Penyempurnaan catatan masukan penguji, pengesahan berita acara, dan penerbitan izin pengambilan data lapangan.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sempro;
