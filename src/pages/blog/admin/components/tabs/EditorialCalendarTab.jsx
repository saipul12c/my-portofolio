import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  CalendarDays,
  AlertCircle
} from 'lucide-react';

export default function EditorialCalendarTab({ 
  posts = [], 
  onEditPost, 
  openCreateModal 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Navigasi bulan
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Kalkulasi sel kalender bulan aktif
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Hari dari bulan sebelumnya
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const dateStr = prevDate.toISOString().split('T')[0];
      cells.push({
        day: d,
        dateStr,
        isCurrentMonth: false
      });
    }

    // Hari dalam bulan aktif
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      // Format YYYY-MM-DD lokal
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      cells.push({
        day: d,
        dateStr,
        isCurrentMonth: true
      });
    }

    // Hari dari bulan berikutnya untuk melengkapi baris 35/42 sel
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dateStr = nextDate.toISOString().split('T')[0];
      cells.push({
        day: d,
        dateStr,
        isCurrentMonth: false
      });
    }

    return cells;
  }, [year, month]);

  // Map artikel ke tanggal
  const postsByDate = useMemo(() => {
    const map = {};
    posts.forEach(p => {
      // Prioritaskan tanggal terjadwal (scheduledAt) jika ada, atau tanggal terbit (date)
      let targetDate = p.date;
      if (p.status === 'scheduled' && p.scheduledAt) {
        targetDate = p.scheduledAt.split('T')[0];
      } else if (p.date) {
        targetDate = p.date.split('T')[0];
      }

      if (targetDate) {
        if (!map[targetDate]) map[targetDate] = [];
        map[targetDate].push(p);
      }
    });
    return map;
  }, [posts]);

  // Artikel untuk tanggal yang dipilih user
  const selectedDayPosts = postsByDate[selectedDateStr] || [];

  // Statistik bulan ini
  const monthStats = useMemo(() => {
    const mStr = String(month + 1).padStart(2, '0');
    const prefix = `${year}-${mStr}`;
    const thisMonthPosts = posts.filter(p => {
      const d = (p.status === 'scheduled' && p.scheduledAt) ? p.scheduledAt : p.date;
      return d && d.startsWith(prefix);
    });

    const published = thisMonthPosts.filter(p => p.status === 'published').length;
    const scheduled = thisMonthPosts.filter(p => p.status === 'scheduled').length;
    const drafts = thisMonthPosts.filter(p => p.status === 'draft').length;

    return { total: thisMonthPosts.length, published, scheduled, drafts };
  }, [posts, year, month]);

  return (
    <div className="space-y-6">
      
      {/* 📅 Top Bar Kontrol Kalender & Navigasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Kalender Editorial & Jadwal Konten
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-normal bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {monthNames[month]} {year}
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Rencanakan, tinjau artikel rilis, dan kelola penerbitan terjadwal otomatis
              </p>
            </div>
          </div>
        </div>

        {/* Kontrol Navigasi Bulan */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleToday}
            className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Bulan Ini
          </button>
          <div className="flex items-center rounded-xl bg-slate-950 border border-white/10 overflow-hidden">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-white font-mono min-w-[120px] text-center select-none">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Kalender Utama & Panel Detail Samping */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Kolom Kalender (3/4 lebar layar) */}
        <div className="lg:col-span-3 rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl p-4 sm:p-5">
          
          {/* Header Hari dalam Seminggu */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {daysOfWeek.map((day, idx) => (
              <div 
                key={idx} 
                className={`py-2 text-[11px] font-semibold uppercase tracking-wider ${
                  idx === 0 || idx === 6 ? 'text-cyan-400/80' : 'text-gray-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarCells.map((cell, idx) => {
              const dayPosts = postsByDate[cell.dateStr] || [];
              const isSelected = cell.dateStr === selectedDateStr;
              const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`
                    min-h-[90px] sm:min-h-[105px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between
                    ${!cell.isCurrentMonth ? 'opacity-30 bg-white/[0.01] border-transparent' : 'bg-slate-950/60'}
                    ${isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/20 bg-cyan-950/30' : 'border-white/5 hover:border-white/20'}
                    ${isToday ? 'bg-gradient-to-br from-cyan-950/40 to-slate-950' : ''}
                  `}
                >
                  {/* Angka Tanggal & Indikator Hari Ini */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-semibold ${
                      isToday ? 'w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-[11px]' : 
                      (isSelected ? 'text-cyan-300' : 'text-gray-400')
                    }`}>
                      {cell.day}
                    </span>

                    {dayPosts.length > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300">
                        {dayPosts.length}
                      </span>
                    )}
                  </div>

                  {/* Chips Artikel pada Sel Tanggal */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayPosts.slice(0, 2).map((post, pIdx) => {
                      const isScheduled = post.status === 'scheduled';
                      const isPublished = post.status === 'published';

                      return (
                        <div
                          key={post.id || pIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditPost(post);
                          }}
                          className={`
                            px-1.5 py-0.5 rounded-lg text-[10px] font-medium truncate flex items-center gap-1 transition-all hover:scale-[1.02]
                            ${isScheduled 
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                              : (isPublished ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30')}
                          `}
                          title={`${post.title} (${post.status})`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isScheduled ? 'bg-blue-400 animate-pulse' : (isPublished ? 'bg-emerald-400' : 'bg-amber-400')
                          }`} />
                          <span className="truncate">{post.title}</span>
                        </div>
                      );
                    })}

                    {dayPosts.length > 2 && (
                      <span className="text-[9px] text-gray-500 block text-right font-mono">
                        +{dayPosts.length - 2} lagi
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legenda Status Warna */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Terbit ({monthStats.published})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                Terjadwal ({monthStats.scheduled})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Draf ({monthStats.drafts})
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">
              Total Konten Bulan Ini: {monthStats.total}
            </span>
          </div>

        </div>

        {/* Kolom Kanan: Detail Tanggal Terpilih & Aksi Cepat */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 block uppercase tracking-wider">
                Tanggal Terpilih
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {new Date(selectedDateStr).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
            </div>

            <button
              onClick={() => openCreateModal({ date: selectedDateStr, status: 'scheduled' })}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan di Tanggal Ini</span>
            </button>

            {/* List Artikel di Tanggal Terpilih */}
            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <h4 className="text-xs font-semibold text-gray-300">
                Konten ({selectedDayPosts.length}):
              </h4>

              {selectedDayPosts.length === 0 ? (
                <div className="py-6 text-center text-gray-500 text-xs italic">
                  Tidak ada artikel yang dijadwalkan atau diterbitkan pada tanggal ini.
                </div>
              ) : (
                selectedDayPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {post.title}
                      </h5>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                        post.status === 'scheduled' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 
                        (post.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30')
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {post.status === 'scheduled' && post.scheduledAt 
                          ? new Date(post.scheduledAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                          : post.readTime}
                      </span>

                      <button
                        onClick={() => onEditPost(post)}
                        className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
