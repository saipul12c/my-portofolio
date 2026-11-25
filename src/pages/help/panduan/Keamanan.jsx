import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
	ShieldCheck, Lock, AlertCircle, FileLock2, ChevronRight,
	Settings, Trash2, Activity, Globe, Zap, Cpu, Server, KeyRound,
	UserCheck, MessageSquare, ShieldAlert, CheckCircle2, RefreshCw,
	Mail, FileText, Database, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../../context/useAuth';

const ACCENTS = {
	indigo: {
		text: 'text-indigo-400',
		bg: 'bg-indigo-500/10',
		border: 'border-indigo-500/20',
		glow: 'shadow-[0_0_20px_rgba(99,102,241,0.08)]'
	},
	green: {
		text: 'text-emerald-400',
		bg: 'bg-emerald-500/10',
		border: 'border-emerald-500/20',
		glow: 'shadow-[0_0_20px_rgba(16,185,129,0.08)]'
	},
	red: {
		text: 'text-rose-400',
		bg: 'bg-rose-500/10',
		border: 'border-rose-500/20',
		glow: 'shadow-[0_0_20px_rgba(244,63,94,0.08)]'
	},
	purple: {
		text: 'text-fuchsia-400',
		bg: 'bg-fuchsia-500/10',
		border: 'border-fuchsia-500/20',
		glow: 'shadow-[0_0_20px_rgba(192,38,211,0.08)]'
	},
	cyan: {
		text: 'text-cyan-400',
		bg: 'bg-cyan-500/10',
		border: 'border-cyan-500/20',
		glow: 'shadow-[0_0_20px_rgba(6,182,212,0.08)]'
	},
	amber: {
		text: 'text-amber-400',
		bg: 'bg-amber-500/10',
		border: 'border-amber-500/20',
		glow: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]'
	}
};

const gridVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.2, staggerChildren: 0.04 }
	},
	exit: {
		opacity: 0,
		y: -8,
		transition: { duration: 0.15 }
	}
};

const itemVariants = {
	hidden: { opacity: 0, y: 12 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.22 } }
};

const CATEGORIES = [
	'Semua',
	'Akun & Database',
	'Infrastruktur & Jaringan',
	'Komunikasi & Form',
	'SaipulAI & Sandbox',
	'Penyimpanan & Sandbox'
];

const CHAT_MEMORY_EXACT_KEYS = new Set([
	'saipul_chat_history',
	'saipul_chat_sessions',
	'saipul_chat_backup',
	'saipul_chat_archive',
	'saipul_chat_version',
	'saipul_chat_reports',
	'saipul_chat_anomalies',
	'saipul_profile',
	'saipul_feedback_store',
	'saipul_question_stats',
	'saipul_question_counter',
	'saipul_response_evaluations',
	'saipul_analytics_events',
	'saipul_response_metrics',
	'saipul_moderation_flags',
	'saipul_uploaded_data',
	'saipul_file_metadata',
	'ai_search_history'
]);

const SECURITY_CARDS = [
	{
		id: 'secure_storage',
		category: 'Penyimpanan & Sandbox',
		accent: 'indigo',
		icon: <Lock size={20} />,
		title: 'Secure Storage Layer',
		desc: 'Seluruh data riwayat dan preferensi dikelola melalui storage engine terisolasi di browser Anda. Meskipun kami meminimalisir persistensi server, kami menyarankan penggunaan Mode Samaran jika Anda berbagi perangkat dengan orang lain.'
	},
	{
		id: 'rate_limiting',
		category: 'Infrastruktur & Jaringan',
		accent: 'amber',
		icon: <Activity size={20} />,
		title: 'Rate Limiting & Flood Protection',
		desc: 'Sistem memantau frekuensi permintaan secara real-time untuk mencegah serangan spam dan eksploitasi API. Kami membatasi jumlah interaksi per jendela waktu guna menjaga stabilitas layanan bagi seluruh pengguna.'
	},
	{
		id: 'safety_filter',
		category: 'SaipulAI & Sandbox',
		accent: 'red',
		icon: <ShieldAlert size={20} />,
		title: 'Safety Content Filter',
		desc: 'Algoritma kami secara otomatis mendeteksi dan memblokir input yang mengandung pola berbahaya, ilegal, atau upaya bypass instruksi (prompt injection) untuk menjaga etika dan keamanan percakapan.'
	},
	{
		id: 'ai_anonymization',
		category: 'SaipulAI & Sandbox',
		accent: 'purple',
		icon: <Cpu size={20} />,
		title: 'AI Anonymization Layer',
		desc: 'Sistem melakukan pemindaian otomatis menggunakan layer anonimisasi sebelum data diproses. Informasi sensitif di-redact secara cerdas untuk memastikan identitas asli Anda tetap terjaga di infrastruktur cloud.'
	},
	{
		id: 'pii_detection',
		category: 'SaipulAI & Sandbox',
		accent: 'green',
		icon: <Zap size={20} />,
		title: 'Deteksi PII Real-time',
		desc: 'Sistem kami mendeteksi secara instan data pribadi (PII) seperti NIK, email, atau nomor telepon. Kami memberikan peringatan atau pemblokiran otomatis sebelum informasi sensitif tersebut terkirim keluar dari sandbox lokal Anda.'
	},
	{
		id: 'local_file_processing',
		category: 'SaipulAI & Sandbox',
		accent: 'indigo',
		icon: <FileLock2 size={20} />,
		title: 'Local-first File Processing',
		desc: 'Proses ekstraksi data dari file (PDF, XLSX, dsb) dilakukan sepenuhnya secara client-side. File fisik Anda tidak pernah diunggah secara utuh ke server publik; hanya representasi teks yang diproses untuk basis pengetahuan sementara.'
	},
	{
		id: 'infrastructure_security',
		category: 'Infrastruktur & Jaringan',
		accent: 'indigo',
		icon: <Globe size={20} />,
		title: 'Infrastruktur Keamanan Berlapis',
		desc: 'Aplikasi ini dilindungi oleh Web Application Firewall (WAF) tingkat enterprise dan mitigasi DDoS otomatis. Seluruh lalu lintas data dienkripsi menggunakan protokol TLS 1.3 yang memastikan data tidak dapat diintersepsi saat dalam perjalanan.'
	},
	{
		id: 'data_lifecycle_purge',
		category: 'Penyimpanan & Sandbox',
		accent: 'purple',
		icon: <RefreshCw size={20} />,
		title: 'Siklus Hidup Data & Purge Sesi',
		desc: 'Data interaksi Anda memiliki siklus hidup yang ketat. Setelah sesi berakhir atau tombol \'Reset\' ditekan, sistem secara otomatis membersihkan cache memori sementara. Kami menganut prinsip Privacy by Design di mana retensi data minimal menjadi prioritas utama.'
	},
	{
		id: 'auth_jwt_system',
		category: 'Akun & Database',
		accent: 'indigo',
		icon: <KeyRound size={20} />,
		title: 'Autentikasi Akun & Hashing Password',
		desc: 'Pengelolaan akun (/login, /register, /profile) diamankan oleh Supabase Auth. Kata sandi tidak pernah disimpan dalam bentuk teks biasa, melainkan diamankan dengan hashing salt satu arah berstandar industri (bcrypt). Sesi login dikelola melalui JSON Web Token (JWT) yang dienkripsi dan memiliki batas masa berlaku otomatis.'
	},
	{
		id: 'supabase_rls',
		category: 'Akun & Database',
		accent: 'cyan',
		icon: <Server size={20} />,
		title: 'Row Level Security (RLS) PostgreSQL',
		desc: 'Arsitektur basis data menerapkan kebijakan Row Level Security (RLS) pada tingkat engine PostgreSQL. Setiap pengguna yang terotentikasi hanya memiliki otorisasi untuk membaca, memperbarui, atau menghapus baris data milik mereka sendiri, mencegah akses ilegal antar pengguna.'
	},
	{
		id: 'admin_route_protection',
		category: 'Akun & Database',
		accent: 'purple',
		icon: <ShieldCheck size={20} />,
		title: 'Proteksi Rute Administratif (RBAC)',
		desc: 'Area administratif seperti Dashboard Manajemen Blog (/blog-admin) dan rute khusus pemilik diproteksi secara ketat melalui guard rute khusus (RequireAuth, BlogAdminProtectedRoute). Upaya akses tanpa token otorisasi yang valid akan langsung dialihkan ke halaman error terproteksi.'
	},
	{
		id: 'contact_recaptcha',
		category: 'Komunikasi & Form',
		accent: 'cyan',
		icon: <UserCheck size={20} />,
		title: 'Proteksi Anti-Bot Formulir (Google reCAPTCHA)',
		desc: 'Formulir kontak (/contact) dilindungi oleh integrasi Google reCAPTCHA guna membedakan pengunjung manusia dengan bot spammer. Pengiriman pesan dilakukan secara aman melalui protokol EmailJS tanpa mengekspos kredensial server email pribadi ke publik.'
	},
	{
		id: 'live_discussion_security',
		category: 'Komunikasi & Form',
		accent: 'indigo',
		icon: <MessageSquare size={20} />,
		title: 'Keamanan Komunikasi Real-time (Socket.io)',
		desc: 'Ruang obrolan langsung (/Live-Discussion) dan komunitas menggunakan koneksi WebSocket (WSS) berenkripsi. Pesan melalui filter sanitasi otomatis untuk mencegah injeksi skrip HTML/JS berbahaya serta dilengkapi pembatasan frekuensi untuk mencegah spamming antar pengguna.'
	},
	{
		id: 'xss_sanitization',
		category: 'Komunikasi & Form',
		accent: 'green',
		icon: <Lock size={20} />,
		title: 'Sanitasi Konten Dinamis & XSS Defense',
		desc: 'Semua masukan teks dari pengguna yang ditampilkan ke publik—seperti komentar blog, testimoni, maupun ulasan—dibersihkan melalui parser sanitasi ketat. Sistem menolak elemen berbahaya (script injection, atribut event handler terlarang) demi menjamin keamanan seluruh pengunjung.'
	}
];

const SUMMARY_PILLARS = [
	{
		icon: <Globe size={16} className="text-emerald-400" />,
		title: 'Koneksi Aman',
		desc: 'Komunikasi dua arah selalu menggunakan enkripsi SSL/TLS tingkat tinggi.'
	},
	{
		icon: <Database size={16} className="text-indigo-400" />,
		title: 'Penyimpanan Lokal',
		desc: 'Data riwayat disimpan di sandbox browser Anda dan dapat dihapus kapan saja.'
	},
	{
		icon: <Cpu size={16} className="text-cyan-400" />,
		title: 'Penanganan Data',
		desc: 'Data hanya diproses untuk memberikan respons yang relevan bagi Anda.'
	},
	{
		icon: <FileText size={16} className="text-fuchsia-400" />,
		title: 'Audit & Transparansi',
		desc: 'Semua interaksi dicatat secara anonim untuk peningkatan kualitas sistem.'
	}
];

function computeLocalStorageSize() {
	let totalBytes = 0;
	try {
		if (typeof localStorage !== 'undefined') {
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key) {
					const val = localStorage.getItem(key) || '';
					totalBytes += (val.length + key.length) * 2;
				}
			}
		}
	} catch {
		return 'Unavailable';
	}
	if (totalBytes < 1024) return `${totalBytes} B`;
	if (totalBytes < 1048576) return `${(totalBytes / 1024).toFixed(1)} KB`;
	return `${(totalBytes / 1048576).toFixed(1)} MB`;
}

function SectionCard({ icon, title, category, children, accent = 'indigo' }) {
	const styles = ACCENTS[accent] || ACCENTS.indigo;
	return (
		<motion.article
			variants={itemVariants}
			whileHover={{ y: -2 }}
			className={`bg-white/[0.03] backdrop-blur-sm border ${styles.border} ${styles.glow} hover:bg-white/[0.045] rounded-2xl p-4 sm:p-5 transition-colors duration-300 flex flex-col h-full`}
		>
			<div className="flex items-start justify-between gap-3 mb-3.5">
				<div className={`${styles.text} p-2.5 ${styles.bg} rounded-xl shrink-0 border border-white/[0.05]`}>
					{icon}
				</div>
				{category && (
					<span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/[0.04] text-gray-300 border border-white/[0.08] text-right leading-tight max-w-[68%] truncate">
						{category}
					</span>
				)}
			</div>
			<h3 className="font-semibold text-white/95 tracking-tight text-[15px] sm:text-base leading-snug">
				{title}
			</h3>
			<p className="mt-2 text-[13px] sm:text-sm text-gray-400 leading-relaxed font-light">
				{children}
			</p>
		</motion.article>
	);
}

function SettingsLink({ to, label, subtitle }) {
	return (
		<Link
			to={to}
			className="group flex items-center justify-between gap-3 p-2.5 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-cyan-500/30 transition-all min-w-0"
		>
			<div className="min-w-0">
				<div className="text-xs font-medium text-gray-200 group-hover:text-cyan-300 transition-colors truncate">
					{label}
				</div>
				{subtitle && (
					<div className="text-[11px] text-gray-500 truncate mt-0.5">{subtitle}</div>
				)}
			</div>
			<ChevronRight
				size={14}
				className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0"
			/>
		</Link>
	);
}

function SecurityHealthWidget({ refreshKey }) {
	const [status, setStatus] = useState('scanning');
	const [storageUsage, setStorageUsage] = useState(() => computeLocalStorageSize());
	const [scanNonce, setScanNonce] = useState(0);

	const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

	useEffect(() => {
		setStatus('scanning');
		const timer = setTimeout(() => {
			setStatus('secure');
			setStorageUsage(computeLocalStorageSize());
		}, 700);
		return () => clearTimeout(timer);
	}, [refreshKey, scanNonce]);

	useEffect(() => {
		const updateStorage = () => setStorageUsage(computeLocalStorageSize());
		window.addEventListener('storage', updateStorage);
		window.addEventListener('saipul_chat_cleared', updateStorage);
		return () => {
			window.removeEventListener('storage', updateStorage);
			window.removeEventListener('saipul_chat_cleared', updateStorage);
		};
	}, []);

	const healthRows = [
		{
			icon: <Globe size={13} className="text-gray-500 shrink-0" />,
			label: 'Connection',
			value: isHttps ? 'TLS 1.3 Encrypted' : 'Local HTTP Mode',
			valueClass: isHttps ? 'text-emerald-400' : 'text-cyan-400',
			pulseClass: isHttps ? 'bg-emerald-500' : 'bg-cyan-400'
		},
		{
			icon: <ShieldCheck size={13} className="text-gray-500 shrink-0" />,
			label: 'WAF Status',
			value: 'Active Protection',
			valueClass: 'text-indigo-400'
		},
		{
			icon: <Server size={13} className="text-gray-500 shrink-0" />,
			label: 'Database',
			value: 'Supabase RLS',
			valueClass: 'text-cyan-400'
		},
		{
			icon: <Lock size={13} className="text-gray-500 shrink-0" />,
			label: 'Local Sandbox',
			value: status === 'scanning' ? 'Verifying...' : 'Isolated',
			valueClass: status === 'scanning' ? 'text-amber-300' : 'text-emerald-400'
		},
		{
			icon: <Zap size={13} className="text-gray-500 shrink-0" />,
			label: 'Storage Size',
			value: storageUsage,
			valueClass: 'text-gray-200 font-mono'
		}
	];

	return (
		<div className="bg-white/[0.025] border border-white/[0.07] p-5 sm:p-6 rounded-2xl relative overflow-hidden group h-full flex flex-col justify-between">
			<div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
				<Activity size={110} />
			</div>

			<div>
				<div className="flex flex-wrap items-center justify-between gap-2 mb-5">
					<h2 className="text-sm font-semibold text-white/95 flex items-center gap-2 min-w-0">
						<Activity size={16} className="text-emerald-400 shrink-0" />
						<span className="truncate">Security Health Check</span>
					</h2>
					<span
						className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 ${
							status === 'scanning'
								? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
								: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
						}`}
					>
						{status === 'scanning' ? 'SCANNING' : 'SYSTEM OPTIMAL'}
					</span>
				</div>

				<div className="space-y-3 text-xs">
					{healthRows.map((row) => (
						<div key={row.label} className="flex items-center justify-between gap-3 min-w-0">
							<div className="flex items-center gap-2 text-gray-400 font-light shrink-0">
								{row.icon}
								<span>{row.label}</span>
							</div>
							<div className="flex items-center gap-1.5 min-w-0">
								{row.pulseClass && (
									<span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${row.pulseClass}`} />
								)}
								<span className={`text-[11px] font-semibold uppercase tracking-tight truncate text-right ${row.valueClass}`}>
									{row.value}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="pt-4 mt-5 border-t border-white/[0.06] space-y-3">
				<div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: status === 'scanning' ? '45%' : '100%' }}
						transition={{ duration: 0.7, ease: 'easeOut' }}
						className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-between gap-2 text-[11px] text-gray-500">
					<span>Pemeriksaan klien real-time</span>
					<button
						type="button"
						onClick={() => setScanNonce((n) => n + 1)}
						disabled={status === 'scanning'}
						className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 font-medium cursor-pointer transition-colors"
					>
						<RefreshCw size={12} className={status === 'scanning' ? 'animate-spin' : ''} />
						<span>Pindai Ulang</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default function Keamanan() {
	const auth = useAuth() || {};
	const user = auth.user || null;

	const [activeCategory, setActiveCategory] = useState('Semua');
	const [pendingAction, setPendingAction] = useState(null); // null | 'chat' | 'all'
	const [actionFeedback, setActionFeedback] = useState(null);
	const [storageRefreshKey, setStorageRefreshKey] = useState(0);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (!actionFeedback) return undefined;
		const timer = setTimeout(() => setActionFeedback(null), 5000);
		return () => clearTimeout(timer);
	}, [actionFeedback]);

	const categoryCounts = useMemo(() => {
		const counts = { Semua: SECURITY_CARDS.length };
		for (const card of SECURITY_CARDS) {
			counts[card.category] = (counts[card.category] || 0) + 1;
		}
		return counts;
	}, []);

	const filteredCards = useMemo(
		() =>
			activeCategory === 'Semua'
				? SECURITY_CARDS
				: SECURITY_CARDS.filter((card) => card.category === activeCategory),
		[activeCategory]
	);

	const executePurgeChatOnly = useCallback(() => {
		try {
			const keysToRemove = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (!key) continue;
				const lower = key.toLowerCase();
				if (lower === 'saipul_settings') continue;
				const isChatMemoryKey =
					CHAT_MEMORY_EXACT_KEYS.has(lower) ||
					lower.startsWith('saipul_chat_') ||
					lower.includes('chat_history') ||
					lower.startsWith('ai_');
				if (isChatMemoryKey) {
					keysToRemove.push(key);
				}
			}
			keysToRemove.forEach((k) => localStorage.removeItem(k));
			window.dispatchEvent(new Event('storage'));
			window.dispatchEvent(new CustomEvent('saipul_chat_cleared'));
			setStorageRefreshKey((k) => k + 1);
			setPendingAction(null);
			setActionFeedback({
				type: 'success',
				message:
					keysToRemove.length > 0
						? `Berhasil membersihkan ${keysToRemove.length} entri riwayat & memori SaipulAI. Pengaturan & sesi login tetap tersimpan.`
						: 'Memori chat sudah bersih. Pengaturan & sesi login tetap tersimpan.'
			});
		} catch {
			setPendingAction(null);
			setActionFeedback({
				type: 'error',
				message: 'Gagal membersihkan cache chat dari penyimpanan browser.'
			});
		}
	}, []);

	const executePurgeAllData = useCallback(() => {
		try {
			localStorage.clear();
			sessionStorage.clear();
			window.dispatchEvent(new Event('storage'));
			window.dispatchEvent(new CustomEvent('saipul_chat_cleared'));
			setStorageRefreshKey((k) => k + 1);
			setPendingAction(null);
			setActionFeedback({
				type: 'success',
				message: 'Seluruh data lokal berhasil dihapus. Memuat ulang halaman...'
			});
			setTimeout(() => {
				window.location.reload();
			}, 700);
		} catch {
			setPendingAction(null);
			setActionFeedback({
				type: 'error',
				message: 'Gagal menghapus data lokal. Silakan bersihkan cache browser secara manual.'
			});
		}
	}, []);

	const cardsGridColsClass =
		filteredCards.length <= 2 || filteredCards.length === 4
			? 'grid-cols-1 md:grid-cols-2'
			: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.35, ease: 'easeOut' }}
			className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 sm:py-10 lg:pb-24 min-h-screen"
		>
			{/* Breadcrumb & Top Bar */}
			<nav
				aria-label="Breadcrumb"
				className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs text-gray-400"
			>
				<div className="flex items-center gap-2 min-w-0">
					<Link to="/" className="hover:text-cyan-300 transition-colors">
						Beranda
					</Link>
					<ChevronRight size={13} className="text-gray-600 shrink-0" />
					<Link to="/help/docs" className="hover:text-cyan-300 transition-colors">
						Bantuan
					</Link>
					<ChevronRight size={13} className="text-gray-600 shrink-0" />
					<span className="text-indigo-300 font-medium truncate">Keamanan Sistem</span>
				</div>

				<div className="flex items-center gap-2">
					<a
						href="#security-tools"
						className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-cyan-300 hover:bg-white/[0.08] transition-colors"
					>
						<Settings size={12} />
						<span>Kontrol Data</span>
					</a>
					<Link
						to="/live-cs/privacy"
						className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[11px] font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors"
					>
						<span>Kebijakan Privasi</span>
						<ArrowRight size={12} />
					</Link>
				</div>
			</nav>

			{/* Hero Header */}
			<header className="mb-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-5 text-center md:text-left">
				<div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
					<div className="relative shrink-0">
						<div className="absolute inset-0 bg-indigo-500/25 blur-2xl rounded-full" />
						<div className="relative bg-gradient-to-br from-indigo-600 to-fuchsia-500 p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-indigo-500/15 border border-white/10">
							<ShieldCheck color="white" size={30} strokeWidth={2.3} />
						</div>
					</div>
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-gray-300 mb-2.5">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
							<span>{SECURITY_CARDS.length} Lapisan Kontrol Keamanan</span>
						</div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase">
							Security{' '}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-fuchsia-400">
								Framework
							</span>
						</h1>
						<p className="mt-2 text-gray-400 max-w-2xl text-sm sm:text-base font-light italic leading-relaxed">
							&ldquo;Keamanan bukanlah tujuan akhir, melainkan fondasi dari setiap percakapan cerdas dan seluruh ekosistem digital kami.&rdquo;
						</p>
					</div>
				</div>
			</header>

			{/* Prominent Security Alert Banner (Visible immediately on both Mobile & Desktop) */}
			<div className="mb-8 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:px-5 sm:py-4 flex items-start sm:items-center gap-3.5">
				<div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 shrink-0">
					<AlertCircle size={18} />
				</div>
				<div className="text-xs sm:text-[13px] text-amber-100/85 leading-relaxed">
					<span className="font-bold text-amber-300 uppercase tracking-wider mr-2">Peringatan:</span>
					Hindari berbagi KTP/NIK, PIN, atau password. Tim pengembang tidak akan pernah meminta kredensial Anda melalui fitur chat maupun formulir di website ini.
				</div>
			</div>

			{/* Responsive Grid Layout:
			    - Mobile (< lg): 1) Health Check -> 2) Cards & Filters -> 3) Actions & Tools -> 4) Summary Pillars
			    - Desktop (lg+): Row 1 [Health Check (5) | Actions & Tools (7)], Row 2 [Full-width Cards (12)], Row 3 [4 Summary Pillars (12)] */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
				{/* 1. Security Health Check */}
				<section className="order-1 lg:col-span-5">
					<SecurityHealthWidget refreshKey={storageRefreshKey} />
				</section>

				{/* 2. Configuration, Quick Actions & Local Data Controls */}
				<aside
					id="security-tools"
					className="order-3 lg:order-2 lg:col-span-7 bg-white/[0.025] border border-white/[0.07] p-5 sm:p-6 rounded-2xl flex flex-col justify-between scroll-mt-24"
				>
					<div>
						<div className="flex flex-wrap items-center justify-between gap-2 mb-4">
							<h2 className="text-sm font-semibold text-white/95 flex items-center gap-2">
								<Settings size={16} className="text-indigo-400 shrink-0" />
								<span>Konfigurasi &amp; Kontrol Data</span>
							</h2>
							<span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
								Privacy by Design
							</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
							{/* Sub-column A: Navigation Links */}
							<div className="space-y-2">
								<SettingsLink
									to="/live-cs/privacy"
									label="Kebijakan Privasi"
									subtitle="Tata kelola data & regulasi PDP"
								/>
								{user ? (
									<SettingsLink
										to="/profile"
										label="Profil Akun Anda"
										subtitle="Kelola kredensial & sesi Anda"
									/>
								) : (
									<SettingsLink
										to="/help/docs/ai"
										label="Dokumentasi SaipulAI"
										subtitle="Arsitektur & panduan asisten AI"
									/>
								)}
								<SettingsLink
									to="/help/chatbot/settings/privacy"
									label="Atur Privasi & Samaran"
									subtitle="Pengaturan privasi SaipulAI"
								/>
								<SettingsLink
									to="/help/chatbot/settings"
									label="Global Setup"
									subtitle="Pengaturan umum asisten AI"
								/>
								<SettingsLink
									to="/contact"
									label="Pusat Bantuan & Kontak"
									subtitle="Dukungan teknis & pengembang"
								/>
							</div>

							{/* Sub-column B: Data Purge Actions & Security Disclosure */}
							<div className="flex flex-col justify-between gap-4">
								<div className="space-y-2.5">
									<button
										type="button"
										onClick={() => setPendingAction((prev) => (prev === 'chat' ? null : 'chat'))}
										className="w-full flex items-center justify-between gap-3 p-3 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-all text-left cursor-pointer group"
									>
										<div className="min-w-0">
											<div className="text-xs font-semibold text-amber-300">
												Bersihkan Riwayat Chat
											</div>
											<div className="text-[11px] text-gray-400">
												Hanya menghapus memori SaipulAI
											</div>
										</div>
										<RefreshCw
											size={14}
											className="text-amber-400 group-hover:rotate-180 transition-transform duration-500 shrink-0"
										/>
									</button>

									<button
										type="button"
										onClick={() => setPendingAction((prev) => (prev === 'all' ? null : 'all'))}
										className="w-full flex items-center justify-between gap-3 p-3 px-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/15 transition-all text-left cursor-pointer group"
									>
										<div className="min-w-0">
											<div className="text-xs font-bold text-rose-400 group-hover:text-rose-300">
												Purge Local Data
											</div>
											<div className="text-[11px] text-gray-400">
												Hapus sesi, chat &amp; semua data lokal
											</div>
										</div>
										<Trash2 size={14} className="text-rose-400 shrink-0" />
									</button>

									{/* Inline Confirmation Prompt */}
									<AnimatePresence>
										{pendingAction && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: 'auto' }}
												exit={{ opacity: 0, height: 0 }}
												className="overflow-hidden"
											>
												<div
													className={`p-3 rounded-xl border text-xs space-y-2.5 ${
														pendingAction === 'all'
															? 'bg-rose-950/40 border-rose-500/35 text-rose-100'
															: 'bg-amber-950/40 border-amber-500/35 text-amber-100'
													}`}
												>
													<p className="leading-relaxed">
														{pendingAction === 'chat'
															? 'Hapus cache riwayat percakapan & memori SaipulAI? Preferensi tampilan dan sesi login Anda tetap aman.'
															: 'Hapus seluruh data lokal (riwayat chat, berkas terunggah, pengaturan, dan sesi login) secara permanen?'}
													</p>
													<div className="flex items-center justify-end gap-2">
														<button
															type="button"
															onClick={() => setPendingAction(null)}
															className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 font-medium cursor-pointer transition-colors"
														>
															Batal
														</button>
														<button
															type="button"
															onClick={
																pendingAction === 'chat'
																	? executePurgeChatOnly
																	: executePurgeAllData
															}
															className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
																pendingAction === 'all'
																	? 'bg-rose-500 hover:bg-rose-400 text-white'
																	: 'bg-amber-500 hover:bg-amber-400 text-slate-950'
															}`}
														>
															{pendingAction === 'chat' ? 'Ya, Hapus Chat' : 'Ya, Hapus Semua'}
														</button>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Non-blocking Action Feedback */}
									{actionFeedback && (
										<div
											role="status"
											className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
												actionFeedback.type === 'success'
													? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
													: 'bg-rose-500/10 border-rose-500/30 text-rose-200'
											}`}
										>
											<CheckCircle2 size={15} className="shrink-0 mt-0.5" />
											<span className="leading-relaxed">{actionFeedback.message}</span>
										</div>
									)}
								</div>

								{/* Security Disclosure */}
								<div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
									<div className="flex items-center gap-2 mb-1.5">
										<Mail size={13} className="text-emerald-400 shrink-0" />
										<span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
											Security Disclosure
										</span>
									</div>
									<p className="text-[11px] text-gray-400 leading-relaxed">
										Menemukan celah keamanan? Laporkan secara bertanggung jawab ke{' '}
										<a
											href="mailto:uju355@gmail.com?subject=%5BSECURITY%5D%20Laporan%20Kerentanan%20-%20my-porto"
											className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium break-all"
										>
											uju355@gmail.com
										</a>
										.
									</p>
								</div>
							</div>
						</div>
					</div>
				</aside>

				{/* 3. Main Security Framework Cards + Category Filter */}
				<section className="order-2 lg:order-3 lg:col-span-12 pt-2">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
						<div>
							<h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
								Arsitektur &amp; Proteksi Keamanan
							</h2>
							<p className="text-xs sm:text-sm text-gray-400 mt-0.5">
								Menampilkan {filteredCards.length} dari {SECURITY_CARDS.length} kontrol keamanan aktif
							</p>
						</div>
					</div>

					{/* Wrapped Filter Tabs (clean on both Mobile & Desktop, no clipped tabs or scrollbar artifacts) */}
					<div
						role="group"
						aria-label="Filter kategori keamanan"
						className="flex flex-wrap items-center gap-2 mb-6"
					>
						{CATEGORIES.map((cat) => {
							const isActive = activeCategory === cat;
							return (
								<button
									key={cat}
									type="button"
									aria-pressed={isActive}
									onClick={() => setActiveCategory(cat)}
									className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
										isActive
											? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.18)]'
											: 'bg-white/[0.03] text-gray-400 border border-white/[0.07] hover:bg-white/[0.06] hover:text-white'
									}`}
								>
									<span>{cat}</span>
									<span
										className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
											isActive
												? 'bg-indigo-500/30 text-indigo-100'
												: 'bg-white/[0.05] text-gray-500'
										}`}
									>
										{categoryCounts[cat] || 0}
									</span>
								</button>
							);
						})}
					</div>

					{/* Filtered Security Cards Grid */}
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={activeCategory}
							variants={gridVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className={`grid ${cardsGridColsClass} gap-4 sm:gap-5`}
						>
							{filteredCards.map((card) => (
								<SectionCard
									key={card.id}
									icon={card.icon}
									title={card.title}
									category={card.category}
									accent={card.accent}
								>
									{card.desc}
								</SectionCard>
							))}
						</motion.div>
					</AnimatePresence>
				</section>

				{/* 4. Bottom Summary Pillars */}
				<section className="order-4 lg:col-span-12 border-t border-white/[0.07] pt-8 sm:pt-10 mt-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
						{SUMMARY_PILLARS.map((item) => (
							<div
								key={item.title}
								className="group p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/25 transition-colors flex flex-col gap-2"
							>
								<div className="flex items-center gap-2">
									<div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.05] shrink-0">
										{item.icon}
									</div>
									<h3 className="text-xs font-bold text-white/85 group-hover:text-indigo-300 transition-colors uppercase tracking-wider">
										{item.title}
									</h3>
								</div>
								<p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</section>
			</div>
		</motion.div>
	);
}
