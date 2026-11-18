import React, { useState, useEffect } from 'react';

const Wisuda = () => {
  // Set target tanggal wisuda (contoh: 30 hari dari sekarang)
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.getTime();
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 200,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

          .font-serif-academic {
            font-family: 'Cinzel', serif;
          }
          .font-sans-modern {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }

          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-25px) scale(1.05); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }

          .animate-float-slow {
            animation: floatSlow 8s ease-in-out infinite;
          }
          .animate-fade-up {
            opacity: 0;
            animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }

          .text-gold-shimmer {
            background: linear-gradient(
              90deg,
              #fde68a 0%,
              #f59e0b 25%,
              #fffbeb 50%,
              #d97706 75%,
              #fde68a 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 5s linear infinite;
          }

          .glass-card {
            background: rgba(17, 24, 39, 0.45);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(251, 191, 36, 0.15);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .glass-card:hover {
            transform: translateY(-8px);
            border-color: rgba(251, 191, 36, 0.45);
            box-shadow: 0 20px 40px -15px rgba(245, 158, 11, 0.18);
          }
        `}
      </style>

      <div className="relative min-h-screen bg-[#090d16] text-white overflow-x-hidden font-sans-modern selection:bg-amber-500/30 selection:text-amber-200">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-40 scale-105"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-abstract-colored-waves-148/1080p.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradient & Vignette Overlay */}
        <div className="fixed inset-0 bg-gradient-to-b from-[#090d16]/80 via-[#090d16]/75 to-[#090d16] z-10 pointer-events-none" />

        {/* Ambient Light Orbs */}
        <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full filter blur-[120px] animate-float-slow" />
          <div
            className="absolute top-1/2 -right-24 w-80 h-80 bg-yellow-600/15 rounded-full filter blur-[100px] animate-float-slow"
            style={{ animationDelay: '3s' }}
          />
          <div
            className="absolute bottom-10 left-1/3 w-72 h-72 bg-orange-500/10 rounded-full filter blur-[110px] animate-float-slow"
            style={{ animationDelay: '5s' }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center max-w-5xl mx-auto">
          {/* Coming Soon Pill Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-amber-300">
              Coming Soon • Periode 2026
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-up delay-100 font-serif-academic text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="block text-white/95 text-2xl sm:text-3xl md:text-4xl font-normal tracking-[0.25em] uppercase mb-2 font-sans-modern">
              Perayaan Kelulusan
            </span>
            <span className="text-gold-shimmer">WISUDA AKBAR</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-200 text-base sm:text-lg md:text-xl max-w-2xl mb-12 text-gray-300/90 leading-relaxed font-light">
            Setiap malam tanpa tidur dan setiap langkah perjuangan segera bermuara pada satu titik kebanggaan. Bersiaplah mengukir sejarah baru.
          </p>

          {/* Countdown Timer */}
          <div className="animate-fade-up delay-300 grid grid-cols-4 gap-3 sm:gap-6 max-w-xl w-full mb-12">
            {[
              { label: 'Hari', value: timeLeft.days },
              { label: 'Jam', value: timeLeft.hours },
              { label: 'Menit', value: timeLeft.minutes },
              { label: 'Detik', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl py-4 px-2 sm:py-6 sm:px-4 flex flex-col items-center justify-center"
              >
                <span className="font-serif-academic text-2xl sm:text-4xl md:text-5xl font-bold text-amber-300">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-widest text-gray-400 mt-1.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Notify Me Form */}
          <div className="animate-fade-up delay-400 w-full max-w-md mb-10">
            {isSubscribed ? (
              <div className="py-3.5 px-6 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-sm font-medium backdrop-blur-md">
                ✨ Terima kasih! Jadwal & info pendaftaran akan kami kirim ke emailmu.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl sm:rounded-full bg-white/5 border border-white/15 backdrop-blur-md focus-within:border-amber-400/50 transition-colors"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email mahasiswa..."
                  className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-950 font-semibold text-sm hover:from-amber-400 hover:to-yellow-500 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Ingatkan Saya
                </button>
              </form>
            )}
          </div>

          {/* Action Links */}
          <div className="animate-fade-up delay-500 flex flex-wrap justify-center gap-4">
            <a
              href="#tahapan"
              className="px-7 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-medium tracking-wide transition-all"
            >
              Lihat Tahapan Wisuda
            </a>
            <button className="px-7 py-3 rounded-full border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 text-sm font-medium tracking-wide transition-all cursor-pointer">
              Panduan & Dokumentasi
            </button>
          </div>
        </section>

        {/* Timeline / Tahapan Section */}
        <section id="tahapan" className="relative z-20 py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400">
              Rangkaian Acara
            </span>
            <h2 className="font-serif-academic text-3xl sm:text-4xl font-bold mt-2 text-white">
              Menuju Hari Bersejarah
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Registrasi */}
            <div className="glass-card rounded-3xl p-8 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity font-serif-academic text-6xl font-bold text-amber-400">
                01
              </div>
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Registrasi & Yudisium</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Verifikasi berkas kelulusan, ukuran toga, serta konfirmasi kehadiran secara daring melalui portal akademik mahasiswa.
              </p>
            </div>

            {/* Card 2: Prosesi Wisuda */}
            <div className="glass-card rounded-3xl p-8 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity font-serif-academic text-6xl font-bold text-amber-400">
                02
              </div>
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Prosesi Senat Terbuka</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Momen sakral pemindahan tali toga, pengukuhan gelar akademik, serta sesi foto resmi bersama pimpinan universitas.
              </p>
            </div>

            {/* Card 3: Ijazah & Transkrip */}
            <div className="glass-card rounded-3xl p-8 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity font-serif-academic text-6xl font-bold text-amber-400">
                03
              </div>
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Ijazah & Transkrip</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pengambilan dokumen asli ijazah, transkrip nilai, dan Surat Keterangan Pendamping Ijazah (SKPI) setelah prosesi selesai.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Wisuda;