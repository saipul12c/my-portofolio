import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Wrench, Clock, Loader2, RefreshCw, Home, Mail, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useMaintenance } from "../../context/useMaintenance";
import { normalizeMaintenanceConfig } from "../../services/maintenanceService";

export default function Maintenance({
  previewConfig = null,
  matchedPage = null,
  scope = "global",
  pageNote = "",
  pageConfig = null,
  isPreview = false,
  onExitPreview,
}) {
  const { config: liveConfig } = useMaintenance();

  const activeConfig = useMemo(
    () => normalizeMaintenanceConfig(previewConfig || liveConfig),
    [previewConfig, liveConfig]
  );

  const isGlobalScope = scope === "global" || activeConfig.globalEnabled;

  // Gabungkan info bawaan halaman + kustomisasi admin + fallback global
  const resolvedInfo = useMemo(() => {
    const pageKey = matchedPage?.key;
    const defaultPageInfo = matchedPage?.defaultMaintenance || {};
    const customPageInfo =
      pageConfig || (pageKey ? activeConfig.pageConfigs?.[pageKey] : null) || {};
    const legacyNote = pageNote || (pageKey ? activeConfig.pageNotes?.[pageKey] : "") || "";

    if (isGlobalScope) {
      return {
        badge: "Pemeliharaan Sistem Global",
        title: activeConfig.title,
        description: activeConfig.description,
        footerNote: activeConfig.footerNote,
        messages: activeConfig.messages,
        startedAt: activeConfig.startedAt,
        targetTime: activeConfig.targetTime,
      };
    }

    const customMessages = Array.isArray(customPageInfo.messages)
      ? customPageInfo.messages.filter(Boolean)
      : [];
    const defaultMessages = Array.isArray(defaultPageInfo.messages)
      ? defaultPageInfo.messages.filter(Boolean)
      : [];

    return {
      badge:
        customPageInfo.badge?.trim() ||
        defaultPageInfo.badge ||
        (matchedPage?.category ? `Pemeliharaan • ${matchedPage.category}` : "Pemeliharaan Halaman"),
      title:
        customPageInfo.title?.trim() ||
        defaultPageInfo.title ||
        (matchedPage?.label
          ? `${matchedPage.label} Sedang Dalam Perawatan`
          : activeConfig.title),
      description:
        customPageInfo.description?.trim() ||
        legacyNote ||
        defaultPageInfo.description ||
        activeConfig.description,
      footerNote:
        customPageInfo.footerNote?.trim() ||
        defaultPageInfo.footerNote ||
        activeConfig.footerNote,
      messages:
        customMessages.length > 0
          ? customMessages
          : defaultMessages.length > 0
            ? defaultMessages
            : activeConfig.messages,
      startedAt: customPageInfo.startedAt || activeConfig.startedAt,
      targetTime: customPageInfo.targetTime || activeConfig.targetTime,
    };
  }, [activeConfig, isGlobalScope, matchedPage, pageConfig, pageNote]);

  const messages = resolvedInfo.messages;

  const targetDate = useMemo(() => {
    if (!resolvedInfo.targetTime) return null;
    const parsed = new Date(resolvedInfo.targetTime);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [resolvedInfo.targetTime]);

  const startedDate = useMemo(() => {
    if (!resolvedInfo.startedAt) return null;
    const parsed = new Date(resolvedInfo.startedAt);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [resolvedInfo.startedAt]);

  const calculateCountdown = useCallback(() => {
    if (!targetDate) {
      return {
        hasTarget: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        progress: 65,
      };
    }

    const nowMs = Date.now();
    const targetMs = targetDate.getTime();
    const diffMs = Math.max(0, targetMs - nowMs);
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let progress = 100;
    if (diffMs > 0) {
      const startMs =
        startedDate && startedDate.getTime() < targetMs
          ? startedDate.getTime()
          : targetMs - 3600 * 1000;
      const totalSpan = Math.max(1, targetMs - startMs);
      const elapsed = Math.max(0, nowMs - startMs);
      progress = Math.min(99, Math.max(5, Math.round((elapsed / totalSpan) * 100)));
    }

    return {
      hasTarget: true,
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      progress,
    };
  }, [targetDate, startedDate]);

  const [countdownState, setCountdownState] = useState(calculateCountdown);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setCountdownState(calculateCountdown());

    const timer = setInterval(() => {
      setCountdownState(calculateCountdown());
    }, 1000);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (messages.length > 0 ? (prev + 1) % messages.length : 0));
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(messageInterval);
    };
  }, [calculateCountdown, messages.length]);

  useEffect(() => {
    if (messageIndex >= messages.length) {
      setMessageIndex(0);
    }
  }, [messageIndex, messages.length]);

  const isHomeOnline = !isGlobalScope && !activeConfig.pageOverrides?.["/"];
  const { hasTarget, days, hours, minutes, seconds, totalSeconds, progress } = countdownState;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center space-y-7 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white px-6 py-12 relative overflow-hidden ${
        isPreview ? "min-h-[620px] rounded-2xl border border-white/10" : "min-h-[100vh]"
      }`}
    >
      {!isPreview && (
        <Helmet>
          <title>{resolvedInfo.title}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
      )}

      {/* Efek latar */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.12),transparent_70%)] animate-pulse pointer-events-none" />

      {/* Badge status scope & kategori halaman */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/25 text-teal-300 text-xs font-medium"
      >
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
        <span>
          {resolvedInfo.badge}
          {!isGlobalScope && matchedPage?.key ? ` • ${matchedPage.key}` : ""}
        </span>
      </motion.div>

      {/* Ikon & status berputar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative flex flex-col items-center z-10"
      >
        <div className="relative">
          <Wrench className="w-16 h-16 md:w-20 md:h-20 text-teal-400 drop-shadow-[0_0_15px_#14b8a6]" />
          <div className="absolute inset-0 blur-3xl bg-teal-400/20 rounded-full animate-pulse pointer-events-none" />
        </div>
        <p className="mt-4 text-gray-300 text-sm flex items-center justify-center gap-2 max-w-md text-center min-h-[24px]">
          <Loader2 className="w-4 h-4 animate-spin text-teal-400 shrink-0" />
          <span>{messages[messageIndex] || "Menjalankan pemeliharaan sistem..."}</span>
        </p>
      </motion.div>

      {/* Judul */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent z-10 max-w-3xl leading-tight"
      >
        {resolvedInfo.title}
      </motion.h1>

      {/* Deskripsi */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed z-10 whitespace-pre-line"
      >
        {resolvedInfo.description}
      </motion.p>

      {/* Progress bar */}
      {activeConfig.showProgressBar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full max-w-md space-y-1.5 z-10"
        >
          <div className="w-full bg-gray-800/90 border border-white/10 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-3 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 transition-all duration-700 ${
                !hasTarget ? "animate-pulse" : ""
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {hasTarget && (
            <div className="flex justify-between text-[11px] text-gray-400 font-mono px-1">
              <span>Progres Pemeliharaan</span>
              <span>{progress}%</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Countdown */}
      {activeConfig.showCountdown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col items-center bg-gray-800/60 border border-white/10 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm z-10"
        >
          <div className="flex items-center space-x-2.5">
            <Clock className="w-5 h-5 text-teal-400 shrink-0" />
            {!hasTarget ? (
              <span className="text-sm text-gray-300">
                Sedang berlangsung — layanan akan segera kembali normal
              </span>
            ) : totalSeconds > 0 ? (
              <span className="text-sm text-gray-200">
                Estimasi selesai:{" "}
                <strong className="font-mono text-teal-300">
                  {days > 0 ? `${days}h ` : ""}
                  {hours.toString().padStart(2, "0")}:
                  {minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}
                </strong>
              </span>
            ) : (
              <span className="text-sm text-teal-300 font-semibold">
                ✅ Estimasi waktu tercapai — silakan muat ulang halaman
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Tombol Aksi */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="z-10 flex flex-wrap items-center justify-center gap-3"
      >
        {activeConfig.showHomeButton && isHomeOnline && !isPreview && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all rounded-xl font-bold shadow-lg shadow-teal-500/20"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        )}

        {!isPreview && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/15 transition-all rounded-xl font-semibold text-white cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Muat Ulang Status
          </button>
        )}

        {activeConfig.contactEmail && (
          <a
            href={`mailto:${activeConfig.contactEmail}`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/25 transition-all rounded-xl font-medium text-cyan-200 text-sm"
          >
            <Mail className="w-4 h-4" />
            Hubungi Admin
          </a>
        )}

        {onExitPreview && (
          <button
            type="button"
            onClick={onExitPreview}
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 transition-all rounded-xl font-semibold text-amber-200 text-sm cursor-pointer"
          >
            <EyeOff className="w-4 h-4" />
            Keluar dari Mode Preview
          </button>
        )}
      </motion.div>

      {/* Catatan bawah (tanpa link admin agar halaman login/dashboard tetap tersembunyi) */}
      {resolvedInfo.footerNote && (
        <p className="z-10 text-sm text-gray-400 italic mt-4 max-w-lg">
          {resolvedInfo.footerNote}
        </p>
      )}
    </div>
  );
}
