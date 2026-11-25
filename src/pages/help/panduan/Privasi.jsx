import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
	ShieldCheck,
	Database,
	EyeOff,
	FileText,
	UserCheck,
	MessageCircle,
	ChevronRight,
	Zap,
	Fingerprint,
	KeyRound,
	Mail,
	Sparkles,
	CheckCircle2,
	Globe,
	Lock,
	Cpu,
	Trash2,
	RefreshCw,
	ArrowRight,
	FileLock2,
	BookOpen,
	Settings,
	AlertTriangle,
	Layers
} from 'lucide-react';
import { useAuth } from '../../../context/useAuth';
import { DEFAULT_SETTINGS } from '../../../components/helpbutton/chat/config';
import { SETTINGS_KEY } from '../../../components/helpbutton/chat/components/logic/utils/fileProcessor';

const ACCENTS = {
	cyan: {
		text: 'text-cyan-400',
		bg: 'bg-cyan-500/10',
		border: 'border-cyan-500/20',
		glow: 'shadow-[0_0_20px_rgba(6,182,212,0.08)]'
	},
	blue: {
		text: 'text-blue-400',
		bg: 'bg-blue-500/10',
		border: 'border-blue-500/20',
		glow: 'shadow-[0_0_20px_rgba(59,130,246,0.08)]'
	},
	violet: {
		text: 'text-violet-400',
		bg: 'bg-violet-500/10',
		border: 'border-violet-500/20',
		glow: 'shadow-[0_0_20px_rgba(139,92,246,0.08)]'
	},
	amber: {
		text: 'text-amber-400',
		bg: 'bg-amber-500/10',
		border: 'border-amber-500/20',
		glow: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]'
	},
	emerald: {
		text: 'text-emerald-400',
		bg: 'bg-emerald-500/10',
		border: 'border-emerald-500/20',
		glow: 'shadow-[0_0_20px_rgba(16,185,129,0.08)]'
	},
	rose: {
		text: 'text-rose-400',
		bg: 'bg-rose-500/10',
		border: 'border-rose-500/20',
		glow: 'shadow-[0_0_20px_rgba(244,63,94,0.08)]'
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
	'Akun & Komunitas',
	'Kontak & Formulir',
	'SaipulAI & Dokumen',
	'Blog & Mini-Apps',
	'Penyimpanan & Pihak Ketiga'
];

const CORE_PRINCIPLES = [
	{
		id: 'data_minimization',
		icon: <FileText size={20} />,
		category: 'Prinsip Utama',
		accent: 'cyan',
		title: 'Data Minimization & Local-First',
		desc: 'Website meminimalkan pengumpulan data di server. Preferensi antarmuka, memori percakapan AI, serta fitur hiburan diproses dan disimpan secara lokal di sandbox browser tanpa pelacak iklan lintas-situs.'
	},
	{
		id: 'pdp_compliance',
		icon: <ShieldCheck size={20} />,
		category: 'Regulasi Nasional',
		accent: 'violet',
		title: 'Kepatuhan UU PDP No. 27/2022',
		desc: 'Tata kelola data diselaraskan dengan Undang-Undang Pelindungan Data Pribadi Indonesia. Anda berhak meminta akses, pembaruan, pencabutan persetujuan, serta penghapusan data pribadi kapan saja.'
	},
	{
		id: 'independent_ai',
		icon: <Cpu size={20} />,
		category: 'Arsitektur Mandiri',
		accent: 'emerald',
		title: 'SaipulAI On-Device (Tanpa Cloud LLM)',
		desc: 'SaipulAI v8.0.0 berjalan menggunakan mesin NLP lokal di browser Anda tanpa mengirim prompt ke penyedia LLM eksternal (OpenAI/Gemini/Anthropic), sehingga data tidak pernah dipakai melatih model publik pihak ketiga.'
	}
];

const PRIVACY_SCOPE_CARDS = [
	{
		id: 'live_discussion_accounts',
		category: 'Akun & Komunitas',
		accent: 'cyan',
		icon: <KeyRound size={20} />,
		title: 'Akun & Profil Live Discussion',
		desc: 'Pendaftaran dan login aktif dilakukan di rute /Live-Discussion/login dan /Live-Discussion/daftar melalui Supabase Auth (PKCE & JWT). Tabel users menyimpan nama tampilan, email, role, bio, status moderasi, dan tanggal daftar. Email dilindungi melalui SQL view public.profiles sehingga tersembunyi dari anggota reguler lain, sementara rute /login dan /register umum saat ini diarahkan ke /coming-soon.'
	},
	{
		id: 'live_discussion_realtime',
		category: 'Akun & Komunitas',
		accent: 'violet',
		icon: <MessageCircle size={20} />,
		title: 'Ruang Diskusi Real-Time & Media',
		desc: 'Fitur /Live-Discussion menggunakan Supabase Realtime (bukan Socket.io yang masih berstatus coming-soon pada /discord) untuk sinkronisasi pesan, indikator mengetik, dan status online. Pesan, reaksi, polling, dan mention disimpan persisten di PostgreSQL, gambar yang diunggah dikompresi ke WebP dan disimpan di bucket publik live_discussion_media, serta 40 pesan terakhir per channel di-cache di localStorage. Hindari membagikan info rahasia di room publik.'
	},
	{
		id: 'contact_form_transparency',
		category: 'Kontak & Formulir',
		accent: 'amber',
		icon: <Mail size={20} />,
		title: 'Formulir Kontak, SheetDB & Tampilan Publik',
		desc: 'Formulir di halaman /contact memproses Nama, Alamat Email, dan Isi Pesan Anda. Pesan diteruskan ke email pemilik via EmailJS, disimpan ke SheetDB bersama stempel waktu dan token Google reCAPTCHA v3, serta dibatasi oleh rate-limit lokal. Harap diperhatikan bahwa panel "Pesan Terbaru" di /contact menampilkan 5 pesan masuk terakhir (termasuk nama, email, dan isi pesan) secara publik—jangan sertakan data sensitif di formulir ini.'
	},
	{
		id: 'saipul_ai_pii_and_modes',
		category: 'SaipulAI & Dokumen',
		accent: 'emerald',
		icon: <EyeOff size={20} />,
		title: 'Filter PII, Mode Samaran & REST API',
		desc: 'Sebelum pesan diproses oleh SaipulAI, detektor PII lokal (piiDetector.js) menyaring dan menolak email, nomor telepon, NIK 16 digit, nomor kartu, rekening, dan CVV. Jika Mode Privasi (Incognito) aktif, chatbot tidak menyimpan riwayat chat, cadangan, arsip, analitik lokal, maupun auto-training, serta menyamarkan info kontak pada laporan. Jika endpoint /api/saipul dipanggil, pemrosesan bersifat stateless di memori (maks 30 req/menit per IP, payload 64 KB) tanpa log basis data.'
	},
	{
		id: 'saipul_ai_ner_and_files',
		category: 'SaipulAI & Dokumen',
		accent: 'blue',
		icon: <FileLock2 size={20} />,
		title: 'Personalisasi, Sentimen & Dokumen Lokal',
		desc: 'SaipulAI memakai analisis emosi/sentimen lokal selama sesi, pengenalan entitas ringan (saipul_profile) untuk mengingat nama atau lokasi yang Anda sebut, serta memori topik lintas halaman (sessionStorage, TTL 4 jam). Dokumen teks (.txt, .md, .csv, .json) yang diunggah di Pengaturan Chatbot diekstrak dan disimpan terkompresi di localStorage browser Anda—sedangkan format biner (.pdf, Office, gambar) hanya dicatat metadatanya tanpa diunggah ke server.'
	},
	{
		id: 'blog_and_interactions',
		category: 'Blog & Mini-Apps',
		accent: 'cyan',
		icon: <BookOpen size={20} />,
		title: 'Blog, Komentar & ID Perangkat Lokal',
		desc: 'Interaksi pada halaman /blog (komentar, suka, bookmark, rating, dan jumlah tayangan) menggunakan ID perangkat acak lokal (blog_device_id) di localStorage untuk mencegah duplikasi suara, sekaligus menyimpan cache lokal (blog_comments_*, blog_liked_*, blog_bookmarked_*) dan menyinkronkannya ke Supabase apabila terhubung. Nama serta komentar yang Anda kirim akan tampil publik pada artikel terkait.'
	},
	{
		id: 'mini_apps_client_side',
		category: 'Blog & Mini-Apps',
		accent: 'violet',
		icon: <Sparkles size={20} />,
		title: 'Mini-Apps Hiburan Client-Side',
		desc: 'Seluruh input pada fitur hiburan seperti Cek Khodam (/qodam), Ramalan Zodiak (/zodiak), dan Kartu Ucapan (/buat-kamu) diproses 100% di sisi klien tanpa dikirim ke server. Untuk kenyamanan Anda, /qodam menyimpan maksimal 5 riwayat di sessionStorage (hilang saat tab ditutup), sementara /zodiak menyimpan maksimal 8 profil di localStorage yang dapat Anda hapus langsung dari antarmuka aplikasi.'
	},
	{
		id: 'browser_storage_cookies',
		category: 'Penyimpanan & Pihak Ketiga',
		accent: 'blue',
		icon: <Database size={20} />,
		title: 'LocalStorage, SessionStorage & Cookies',
		desc: 'Situs ini tidak membuat cookie pelacak atau periklanan sendiri. Preferensi tema, rute terakhir (lastVisitedPage), token sesi login Supabase (sb-*-auth-token), pengaturan & riwayat SaipulAI, cache diskusi, dan penanda pembaruan versi disimpan di localStorage dan sessionStorage. Cookie pihak ketiga hanya dapat disetel oleh Google reCAPTCHA v3 saat Anda mengunjungi halaman /contact.'
	},
	{
		id: 'third_party_processors',
		category: 'Penyimpanan & Pihak Ketiga',
		accent: 'rose',
		icon: <Globe size={20} />,
		title: 'Layanan Pihak Ketiga Terintegrasi',
		desc: 'Untuk menjalankan fitur inti secara andal, aplikasi terhubung dengan: (1) Supabase untuk autentikasi, PostgreSQL dengan Row Level Security (RLS), Realtime, dan Storage media diskusi; (2) EmailJS untuk penerusan pesan formulir kontak; (3) SheetDB untuk penyimpanan & pembacaan pesan kontak; (4) Google reCAPTCHA v3 khusus di /contact; serta (5) Netlify sebagai hosting statis dan runtime serverless /api/saipul.'
	}
];

const DATA_TRANSPARENCY_MATRIX = [
	{
		feature: 'Asisten SaipulAI & Unggah File',
		data: 'Prompt chat, profil entitas lokal, contoh latihan lokal, dan isi file teks (.txt/.md/.csv/.json)',
		storage: 'localStorage & sessionStorage browser (maks 50 pesan aktif, TTL memori sesi 4 jam)',
		visibility: 'Privat di perangkat Anda (tidak dikirim ke cloud LLM; endpoint /api/saipul stateless)',
		control: 'Aktifkan Mode Privasi atau klik "Bersihkan Memori AI"'
	},
	{
		feature: 'Formulir Kontak (/contact)',
		data: 'Nama lengkap, alamat email, isi pesan, stempel waktu, dan token reCAPTCHA v3',
		storage: 'Email pemilik (EmailJS), SheetDB, serta cache sementara sessionStorage & rate-limit lokal',
		visibility: '5 pesan terbaru (nama, email, pesan) ditampilkan publik di panel Pesan Terbaru /contact',
		control: 'Hindari data rahasia; ajukan penghapusan via uju355@gmail.com'
	},
	{
		feature: 'Live Discussion (/Live-Discussion)',
		data: 'Email akun, nama tampilan, bio, pesan obrolan, reaksi, polling, mention, & gambar WebP',
		storage: 'Supabase PostgreSQL (persisten), Storage bucket live_discussion_media, & cache 40 pesan lokal',
		visibility: 'Pesan & media tampil di room; email disembunyikan oleh view public.profiles (kecuali pemilik/mod)',
		control: 'Hapus pesan sendiri di room, edit profil, atau ajukan hapus akun via email'
	},
	{
		feature: 'Blog & Interaksi (/blog)',
		data: 'Nama, email opsional, isi komentar, rating, like, bookmark, dan blog_device_id acak',
		storage: 'Supabase (blog_posts, blog_comments) & localStorage browser',
		visibility: 'Komentar & nama tampil publik di halaman artikel terkait',
		control: 'Bersihkan storage browser atau hubungi pengelola untuk moderasi komentar'
	},
	{
		feature: 'Mini-Apps (/qodam, /zodiak, /buat-kamu)',
		data: 'Nama, tanggal lahir, atau status permainan interaktif',
		storage: 'sessionStorage (/qodam maks 5 item) & localStorage (/zodiak maks 8 profil)',
		visibility: '100% privat di browser lokal (tidak pernah dikirim ke server)',
		control: 'Hapus profil di halaman /zodiak atau bersihkan data lokal di bawah'
	}
];

const PDP_RIGHTS = [
	{
		title: 'Hak Akses & Transparansi',
		desc: 'Mengetahui jenis data yang diproses, dasar pemrosesan, serta layanan pihak ketiga yang terlibat di setiap fitur.'
	},
	{
		title: 'Hak Koreksi & Pembaruan',
		desc: 'Memperbarui nama tampilan atau bio akun secara mandiri melalui /Live-Discussion/profile atau mengajukan koreksi ke pengelola.'
	},
	{
		title: 'Hak Penghapusan (Erasure)',
		desc: 'Menghapus pesan Anda di room diskusi, membersihkan data lokal browser seketika, atau meminta penghapusan akun Supabase permanen.'
	},
	{
		title: 'Hak Penarikan Persetujuan',
		desc: 'Mengaktifkan Mode Privasi SaipulAI atau menonaktifkan telemetri lokal kapan saja tanpa membatasi akses dasar portofolio.'
	}
];

const AI_MEMORY_EXACT_KEYS = new Set([
	'saipul_chat_history',
	'saipul_chat_sessions',
	'saipul_chat_backup',
	'saipul_chat_archive',
	'saipul_chat_version',
	'saipul_chat_reports',
	'saipul_chat_anomalies',
	'saipul_chat_summaries_v1',
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
	'saipul_input_training_v1',
	'saipul_benchmark_insights_v1',
	'saipul_benchmark_last_run',
	'saipul_pref_count',
	'saipul_rate',
	'saipul_ai_last_topic',
	'ai_search_history'
]);

function readSaipulSettings() {
	try {
		if (typeof localStorage === 'undefined') return { ...DEFAULT_SETTINGS };
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return { ...DEFAULT_SETTINGS };
		const parsed = JSON.parse(raw);
		return { ...DEFAULT_SETTINGS, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}

function formatBytes(totalBytes) {
	if (totalBytes < 1024) return `${totalBytes} B`;
	if (totalBytes < 1048576) return `${(totalBytes / 1024).toFixed(1)} KB`;
	return `${(totalBytes / 1048576).toFixed(1)} MB`;
}

function computeBrowserStorageStats() {
	let totalBytes = 0;
	let totalKeys = 0;

	try {
		if (typeof localStorage !== 'undefined') {
			totalKeys += localStorage.length;
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key) {
					const val = localStorage.getItem(key) || '';
					totalBytes += (val.length + key.length) * 2;
				}
			}
		}
		if (typeof sessionStorage !== 'undefined') {
			totalKeys += sessionStorage.length;
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key) {
					const val = sessionStorage.getItem(key) || '';
					totalBytes += (val.length + key.length) * 2;
				}
			}
		}
	} catch {
		return { sizeLabel: 'Unavailable', keyCount: 0 };
	}

	return {
		sizeLabel: formatBytes(totalBytes),
		keyCount: totalKeys
	};
}

function InfoCard({ icon, title, category, children, accent = 'cyan' }) {
	const styles = ACCENTS[accent] || ACCENTS.cyan;
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

function SettingsChip({ to, icon, label, subtitle }) {
	return (
		<Link
			to={to}
			className="group flex items-center justify-between gap-3 p-2.5 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-cyan-500/35 transition-all min-w-0"
		>
			<div className="flex items-center gap-3 min-w-0">
				<div className="text-gray-400 group-hover:text-cyan-400 transition-colors shrink-0">
					{icon}
				</div>
				<div className="min-w-0">
					<div className="text-xs font-medium text-gray-200 group-hover:text-cyan-300 transition-colors truncate">
						{label}
					</div>
					{subtitle && (
						<div className="text-[11px] text-gray-500 truncate mt-0.5">{subtitle}</div>
					)}
				</div>
			</div>
			<ChevronRight
				size={14}
				className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0"
			/>
		</Link>
	);
}

function PrivacyToggleRow({ id, label, description, checked, onToggle }) {
	return (
		<div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
			<div className="min-w-0">
				<label htmlFor={id} className="block text-xs font-semibold text-gray-100 cursor-pointer">
					{label}
				</label>
				<p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{description}</p>
			</div>
			<button
				id={id}
				type="button"
				role="switch"
				aria-checked={Boolean(checked)}
				onClick={() => onToggle(!checked)}
				className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
					checked
						? 'bg-cyan-500/80 border-cyan-400/60'
						: 'bg-slate-700/80 border-white/10'
				}`}
			>
				<span
					className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 mt-[1px] ${
						checked ? 'translate-x-5' : 'translate-x-0.5'
					}`}
				/>
			</button>
		</div>
	);
}

function PrivacyStatusWidget({ user, settings, storageStats, onRefreshStats }) {
	const [isScanning, setIsScanning] = useState(false);
	const scanTimerRef = useRef(null);

	const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
	const privacyModeActive = Boolean(settings?.privacyMode);

	useEffect(() => {
		return () => {
			if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
		};
	}, []);

	const handleRescan = () => {
		if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
		setIsScanning(true);
		scanTimerRef.current = setTimeout(() => {
			onRefreshStats();
			setIsScanning(false);
		}, 550);
	};

	const statusRows = [
		{
			icon: <Globe size={13} className="text-gray-500 shrink-0" />,
			label: 'Transport Layer',
			value: isHttps ? 'HTTPS (TLS Encrypted)' : 'Local HTTP Mode',
			valueClass: isHttps ? 'text-emerald-400' : 'text-cyan-400',
			pulseClass: isHttps ? 'bg-emerald-500' : 'bg-cyan-400'
		},
		{
			icon: <EyeOff size={13} className="text-gray-500 shrink-0" />,
			label: 'Mode Privasi AI',
			value: privacyModeActive ? 'Aktif (Incognito)' : 'Standar (Auto-Save Lokal)',
			valueClass: privacyModeActive ? 'text-emerald-400' : 'text-amber-300'
		},
		{
			icon: <UserCheck size={13} className="text-gray-500 shrink-0" />,
			label: 'Sesi Autentikasi',
			value: user ? 'Terautentikasi (JWT)' : 'Mode Tamu (Anonim)',
			valueClass: user ? 'text-cyan-400' : 'text-gray-300'
		},
		{
			icon: <ShieldCheck size={13} className="text-gray-500 shrink-0" />,
			label: 'Pelacak Iklan',
			value: '0 Third-Party Ads',
			valueClass: 'text-emerald-400'
		},
		{
			icon: <Database size={13} className="text-gray-500 shrink-0" />,
			label: 'Jejak Storage Lokal',
			value: isScanning
				? 'Memindai...'
				: `${storageStats.sizeLabel} (${storageStats.keyCount} item)`,
			valueClass: 'text-gray-200 font-mono'
		}
	];

	return (
		<div className="bg-white/[0.025] border border-white/[0.07] p-5 sm:p-6 rounded-2xl relative overflow-hidden group h-full flex flex-col justify-between">
			<div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
				<Fingerprint size={115} />
			</div>

			<div>
				<div className="flex flex-wrap items-center justify-between gap-2 mb-5">
					<h2 className="text-sm font-semibold text-white/95 flex items-center gap-2 min-w-0">
						<Fingerprint size={16} className="text-cyan-400 shrink-0" />
						<span className="truncate">Status Privasi Peramban</span>
					</h2>
					<span
						className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 ${
							isScanning
								? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
								: privacyModeActive
									? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
									: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
						}`}
					>
						{isScanning ? 'SCANNING' : privacyModeActive ? 'INCOGNITO ON' : 'LOCAL-FIRST'}
					</span>
				</div>

				<div className="space-y-3 text-xs">
					{statusRows.map((row) => (
						<div key={row.label} className="flex items-center justify-between gap-3 min-w-0">
							<div className="flex items-center gap-2 text-gray-400 font-light shrink-0">
								{row.icon}
								<span>{row.label}</span>
							</div>
							<div className="flex items-center gap-1.5 min-w-0">
								{row.pulseClass && (
									<span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${row.pulseClass}`} />
								)}
								<span className={`text-[11px] font-semibold tracking-tight truncate text-right ${row.valueClass}`}>
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
						animate={{ width: isScanning ? '45%' : '100%' }}
						transition={{ duration: 0.55, ease: 'easeOut' }}
						className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500"
					/>
				</div>

				<div className="flex items-center justify-between gap-2 text-[11px] text-gray-500">
					<span>Pemeriksaan langsung di klien</span>
					<button
						type="button"
						onClick={handleRescan}
						disabled={isScanning}
						className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 font-medium cursor-pointer transition-colors"
					>
						<RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
						<span>Pindai Ulang</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default function Privasi() {
	const auth = useAuth() || {};
	const user = auth.user || null;

	const [activeCategory, setActiveCategory] = useState('Semua');
	const [settings, setSettings] = useState(() => readSaipulSettings());
	const [pendingAction, setPendingAction] = useState(null); // null | 'ai' | 'all'
	const [actionFeedback, setActionFeedback] = useState(null);
	const [storageStats, setStorageStats] = useState(() => computeBrowserStorageStats());

	const refreshStorageStats = useCallback(() => {
		setStorageStats(computeBrowserStorageStats());
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const syncAll = () => {
			setSettings(readSaipulSettings());
			setStorageStats(computeBrowserStorageStats());
		};
		const syncStorageOnly = () => {
			setStorageStats(computeBrowserStorageStats());
		};
		window.addEventListener('storage', syncAll);
		window.addEventListener('saipul_settings_updated', syncAll);
		window.addEventListener('saipul_chat_cleared', syncStorageOnly);
		return () => {
			window.removeEventListener('storage', syncAll);
			window.removeEventListener('saipul_settings_updated', syncAll);
			window.removeEventListener('saipul_chat_cleared', syncStorageOnly);
		};
	}, []);

	useEffect(() => {
		if (!actionFeedback) return undefined;
		const timer = setTimeout(() => setActionFeedback(null), 5000);
		return () => clearTimeout(timer);
	}, [actionFeedback]);

	const updateSaipulSetting = useCallback((key, value) => {
		try {
			const current = readSaipulSettings();
			const next = { ...current, [key]: value };
			localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
			setSettings(next);
			setStorageStats(computeBrowserStorageStats());
			window.dispatchEvent(new Event('storage'));
			window.dispatchEvent(
				new CustomEvent('saipul_settings_updated', {
					detail: { key, value, settings: next }
				})
			);
			setActionFeedback({
				type: 'success',
				message:
					key === 'privacyMode'
						? value
							? 'Mode Privasi SaipulAI diaktifkan. Percakapan baru tidak akan disimpan ke penyimpanan lokal.'
							: 'Mode Privasi SaipulAI dimatikan. Auto-save lokal kembali mengikuti pengaturan Anda.'
						: value
							? 'Telemetri lokal diaktifkan (disimpan hanya di peramban Anda).'
							: 'Telemetri lokal dinonaktifkan.'
			});
		} catch {
			setActionFeedback({
				type: 'error',
				message: 'Tidak dapat memperbarui pengaturan di penyimpanan browser.'
			});
		}
	}, []);

	const executeClearAiMemory = useCallback(() => {
		try {
			const keysToRemove = [];
			if (typeof localStorage !== 'undefined') {
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					if (!key) continue;
					const lower = key.toLowerCase();
					if (lower === SETTINGS_KEY) continue;
					const isAiKey =
						AI_MEMORY_EXACT_KEYS.has(lower) ||
						lower.startsWith('saipul_chat_') ||
						lower.startsWith('ai_');
					if (isAiKey) {
						keysToRemove.push(key);
					}
				}
				keysToRemove.forEach((k) => localStorage.removeItem(k));
			}

			if (typeof sessionStorage !== 'undefined') {
				sessionStorage.removeItem('saipul_ai_session_memory');
				sessionStorage.removeItem('aiQueries');
			}

			setStorageStats(computeBrowserStorageStats());
			window.dispatchEvent(new Event('storage'));
			window.dispatchEvent(new CustomEvent('saipul_chat_cleared'));
			setPendingAction(null);
			setActionFeedback({
				type: 'success',
				message:
					keysToRemove.length > 0
						? `Berhasil menghapus ${keysToRemove.length} entri memori, riwayat, & berkas lokal SaipulAI. Pengaturan dan sesi login tetap dipertahankan.`
						: 'Memori SaipulAI di browser sudah bersih. Pengaturan dan sesi login tetap aman.'
			});
		} catch {
			setPendingAction(null);
			setActionFeedback({
				type: 'error',
				message: 'Gagal menghapus memori SaipulAI dari penyimpanan browser.'
			});
		}
	}, []);

	const executeClearAllStorage = useCallback(() => {
		try {
			if (typeof localStorage !== 'undefined') localStorage.clear();
			if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
			setSettings(readSaipulSettings());
			setStorageStats(computeBrowserStorageStats());
			window.dispatchEvent(new Event('storage'));
			window.dispatchEvent(new CustomEvent('saipul_chat_cleared'));
			setPendingAction(null);
			setActionFeedback({
				type: 'success',
				message: 'Seluruh penyimpanan lokal (localStorage & sessionStorage) berhasil dibersihkan. Memuat ulang halaman...'
			});
			setTimeout(() => {
				window.location.reload();
			}, 750);
		} catch {
			setPendingAction(null);
			setActionFeedback({
				type: 'error',
				message: 'Gagal membersihkan penyimpanan browser secara otomatis.'
			});
		}
	}, []);

	const categoryCounts = useMemo(() => {
		const counts = { Semua: PRIVACY_SCOPE_CARDS.length };
		for (const card of PRIVACY_SCOPE_CARDS) {
			counts[card.category] = (counts[card.category] || 0) + 1;
		}
		return counts;
	}, []);

	const filteredCards = useMemo(
		() =>
			activeCategory === 'Semua'
				? PRIVACY_SCOPE_CARDS
				: PRIVACY_SCOPE_CARDS.filter((card) => card.category === activeCategory),
		[activeCategory]
	);

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
			{/* Breadcrumb & Cross-Navigation Bar */}
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
					<span className="text-cyan-300 font-medium truncate">Kebijakan Privasi</span>
				</div>

				<div className="flex items-center gap-2 flex-wrap">
					<a
						href="#privacy-controls"
						className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-cyan-300 hover:bg-white/[0.08] transition-colors"
					>
						<Settings size={12} />
						<span>Kontrol Privasi</span>
					</a>
					<Link
						to="/live-cs/security"
						className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[11px] font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors"
					>
						<span>Keamanan Sistem</span>
						<ArrowRight size={12} />
					</Link>
				</div>
			</nav>

			{/* Hero Header */}
			<header className="mb-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-5 text-center md:text-left">
				<div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
					<div className="relative shrink-0">
						<div className="absolute inset-0 bg-cyan-500/25 blur-2xl rounded-full" />
						<div className="relative bg-gradient-to-br from-cyan-600 to-blue-600 p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-cyan-500/15 border border-white/10">
							<Fingerprint color="white" size={30} strokeWidth={2.2} />
						</div>
					</div>
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-gray-300 mb-2.5">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
							<span>Transparansi Data &amp; Kepatuhan UU PDP No. 27/2022</span>
						</div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase">
							Privacy{' '}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
								Policy
							</span>
						</h1>
						<p className="mt-2 text-gray-400 max-w-2xl text-sm sm:text-base font-light leading-relaxed">
							Penjelasan faktual mengenai cara data diproses, disimpan, dan dilindungi di seluruh ekosistem website — mulai dari SaipulAI, formulir kontak, blog, mini-apps, hingga ruang Live Discussion.
						</p>
					</div>
				</div>
			</header>

			{/* Public Notice Banner (Factual reminder about /contact & /Live-Discussion) */}
			<div className="mb-8 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:px-5 sm:py-4 flex items-start sm:items-center gap-3.5">
				<div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 shrink-0">
					<AlertTriangle size={18} />
				</div>
				<div className="text-xs sm:text-[13px] text-amber-100/85 leading-relaxed">
					<span className="font-bold text-amber-300 uppercase tracking-wider mr-2">Catatan Transparansi:</span>
					Pesan di ruang <span className="font-medium text-white">/Live-Discussion</span>, komentar <span className="font-medium text-white">/blog</span>, dan 5 kiriman terbaru di panel <span className="font-medium text-white">Pesan Terbaru (/contact)</span> bersifat publik. Untuk komunikasi privat, hubungi langsung via email resmi di bawah.
				</div>
			</div>

			{/* 3 Core Principles Strip */}
			<section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
				{CORE_PRINCIPLES.map((item) => (
					<InfoCard
						key={item.id}
						icon={item.icon}
						title={item.title}
						category={item.category}
						accent={item.accent}
					>
						{item.desc}
					</InfoCard>
				))}
			</section>

			{/* Main Responsive Grid Layout:
			    - Mobile (< lg): 1) Status Privasi -> 2) Kartu Cakupan & Filter -> 3) Kontrol Privasi & Hak Data -> 4) Matriks Transparansi -> 5) Hak UU PDP
			    - Desktop (lg+): Row 1 [Status (5) | Kontrol & Akses Cepat (7)], Row 2 [Kartu Cakupan (12)], Row 3 [Matriks Transparansi (12)], Row 4 [Hak UU PDP (12)] */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
				{/* 1. Live Browser Privacy Status */}
				<section className="order-1 lg:col-span-5">
					<PrivacyStatusWidget
						user={user}
						settings={settings}
						storageStats={storageStats}
						onRefreshStats={refreshStorageStats}
					/>
				</section>

				{/* 2. Interactive Privacy Controls, Quick Links & PDP Request */}
				<aside
					id="privacy-controls"
					className="order-3 lg:order-2 lg:col-span-7 bg-white/[0.025] border border-white/[0.07] p-5 sm:p-6 rounded-2xl flex flex-col justify-between scroll-mt-24"
				>
					<div>
						<div className="flex flex-wrap items-center justify-between gap-2 mb-4">
							<h2 className="text-sm font-semibold text-white/95 flex items-center gap-2">
								<Zap size={16} className="text-cyan-400 shrink-0" />
								<span>Kontrol Privasi &amp; Hak Data</span>
							</h2>
							<span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
								Kontrol Real-Time
							</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
							{/* Sub-column A: Interactive Switches + Accurate Quick Links */}
							<div className="space-y-2.5">
								<PrivacyToggleRow
									id="privacy-mode-toggle"
									label="Mode Privasi SaipulAI"
									description="Hentikan penyimpanan riwayat, arsip, & auto-training lokal"
									checked={settings.privacyMode}
									onToggle={(val) => updateSaipulSetting('privacyMode', val)}
								/>
								<PrivacyToggleRow
									id="local-analytics-toggle"
									label="Telemetri Kualitas Lokal"
									description="Catat metrik respons secara anonim di perangkat Anda"
									checked={settings.enableAnalytics}
									onToggle={(val) => updateSaipulSetting('enableAnalytics', val)}
								/>

								<div className="pt-1 space-y-2">
									<SettingsChip
										to={user ? '/Live-Discussion/profile' : '/Live-Discussion/login'}
										icon={<UserCheck size={14} />}
										label={user ? 'Profil Live Discussion' : 'Akun Live Discussion'}
										subtitle={user ? 'Kelola nama tampilan, bio & sesi' : 'Masuk atau kelola akun diskusi'}
									/>
									<SettingsChip
										to="/help/chatbot/settings/privacy"
										icon={<Settings size={14} />}
										label="Pengaturan Privasi & Berkas AI"
										subtitle="Kelola file terunggah & ekspor chat"
									/>
									<SettingsChip
										to="/live-cs/security"
										icon={<ShieldCheck size={14} />}
										label="Keamanan Sistem"
										subtitle="Arsitektur RLS, WAF & enkripsi"
									/>
								</div>
							</div>

							{/* Sub-column B: Data Erasure Tools + Official PDP Request */}
							<div className="flex flex-col justify-between gap-3.5">
								<div className="space-y-2.5">
									<button
										type="button"
										onClick={() => setPendingAction((prev) => (prev === 'ai' ? null : 'ai'))}
										className="w-full flex items-center justify-between gap-3 p-3 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-all text-left cursor-pointer group"
									>
										<div className="min-w-0">
											<div className="text-xs font-semibold text-amber-300">
												Bersihkan Memori &amp; Berkas AI
											</div>
											<div className="text-[11px] text-gray-400">
												Hapus riwayat chat, profil NER, &amp; file lokal
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
												Reset Semua Data Browser
											</div>
											<div className="text-[11px] text-gray-400">
												Hapus seluruh localStorage &amp; sessionStorage
											</div>
										</div>
										<Trash2 size={14} className="text-rose-400 shrink-0" />
									</button>

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
														{pendingAction === 'ai'
															? 'Hapus riwayat percakapan, profil entitas lokal, analitik lokal, dan dokumen SaipulAI? Pengaturan & sesi login Anda tetap tersimpan.'
															: 'Hapus seluruh data lokal (termasuk sesi login, pengaturan, cache diskusi, blog, & mini-apps) secara permanen?'}
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
																pendingAction === 'ai'
																	? executeClearAiMemory
																	: executeClearAllStorage
															}
															className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
																pendingAction === 'all'
																	? 'bg-rose-500 hover:bg-rose-400 text-white'
																	: 'bg-amber-500 hover:bg-amber-400 text-slate-950'
															}`}
														>
															{pendingAction === 'ai' ? 'Ya, Bersihkan' : 'Ya, Reset Semua'}
														</button>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>

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

								{/* Permohonan Hak Data (Official Owner Email) */}
								<div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
									<div className="flex items-center gap-2 mb-1.5">
										<Mail size={13} className="text-cyan-400 shrink-0" />
										<span className="text-[11px] font-bold text-white/85 uppercase tracking-wider">
											Permohonan Hak Data (UU PDP)
										</span>
									</div>
									<p className="text-[11px] text-gray-400 leading-relaxed mb-2">
										Untuk penghapusan akun Supabase, pesan kontak SheetDB, atau salinan data pribadi, kirim email dengan subjek{' '}
										<span className="text-cyan-300 font-mono text-[10px]">[Permohonan PDP]</span> ke:
									</p>
									<a
										href="mailto:uju355@gmail.com?subject=%5BPermohonan%20PDP%5D%20Akses%20atau%20Penghapusan%20Data"
										className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-cyan-200 hover:underline bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 break-all max-w-full"
									>
										<span>uju355@gmail.com</span>
									</a>
									<div className="mt-1.5 text-[10px] text-gray-500">
										Estimasi tanggapan maksimal 3&times;24 jam kerja.
									</div>
								</div>
							</div>
						</div>
					</div>
				</aside>

				{/* 3. Detailed Privacy Scope Cards + Wrapped Filter Tabs */}
				<section className="order-2 lg:order-3 lg:col-span-12 pt-2">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
						<div>
							<h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
								Cakupan Privasi &amp; Pengolahan Data
							</h2>
							<p className="text-xs sm:text-sm text-gray-400 mt-0.5">
								Menampilkan {filteredCards.length} dari {PRIVACY_SCOPE_CARDS.length} detail kebijakan berbasis implementasi aktual
							</p>
						</div>
					</div>

					{/* Wrapped Filter Tabs (clean on both Mobile & Desktop, no clipped horizontal scroll) */}
					<div
						role="group"
						aria-label="Filter kategori privasi"
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
											? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.18)]'
											: 'bg-white/[0.03] text-gray-400 border border-white/[0.07] hover:bg-white/[0.06] hover:text-white'
									}`}
								>
									<span>{cat}</span>
									<span
										className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
											isActive
												? 'bg-cyan-500/30 text-cyan-100'
												: 'bg-white/[0.05] text-gray-500'
										}`}
									>
										{categoryCounts[cat] || 0}
									</span>
								</button>
							);
						})}
					</div>

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
								<InfoCard
									key={card.id}
									icon={card.icon}
									title={card.title}
									category={card.category}
									accent={card.accent}
								>
									{card.desc}
								</InfoCard>
							))}
						</motion.div>
					</AnimatePresence>
				</section>

				{/* 4. Data Transparency Matrix (Stacked cards on Mobile, Clean Table on Desktop) */}
				<section className="order-4 lg:col-span-12 pt-2">
					<div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
						<div>
							<h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
								<Layers size={18} className="text-cyan-400 shrink-0" />
								<span>Peta Transparansi Data per Fitur</span>
							</h2>
							<p className="text-xs sm:text-sm text-gray-400 mt-0.5">
								Ringkasan cepat jenis data, lokasi penyimpanan, keterlihatan publik, dan cara menghapusnya.
							</p>
						</div>
					</div>

					{/* Mobile Stacked Cards */}
					<div className="grid grid-cols-1 gap-3.5 md:hidden">
						{DATA_TRANSPARENCY_MATRIX.map((row) => (
							<div
								key={row.feature}
								className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-2.5 text-xs"
							>
								<div className="font-semibold text-cyan-300 text-sm">{row.feature}</div>
								<div>
									<span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
										Data Diproses
									</span>
									<p className="text-gray-300 font-light mt-0.5 leading-relaxed">{row.data}</p>
								</div>
								<div>
									<span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
										Lokasi &amp; Retensi
									</span>
									<p className="text-gray-400 font-light mt-0.5 leading-relaxed">{row.storage}</p>
								</div>
								<div>
									<span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
										Visibilitas
									</span>
									<p className="text-gray-400 font-light mt-0.5 leading-relaxed">{row.visibility}</p>
								</div>
								<div className="pt-2 border-t border-white/[0.06]">
									<span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-semibold block">
										Kontrol Anda
									</span>
									<p className="text-gray-300 font-light mt-0.5 leading-relaxed">{row.control}</p>
								</div>
							</div>
						))}
					</div>

					{/* Desktop Structured Table */}
					<div className="hidden md:block rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-white/[0.07] bg-white/[0.03] text-[11px] uppercase tracking-wider text-gray-400">
									<th className="py-3.5 px-4 font-semibold min-w-[155px]">Fitur / Rute</th>
									<th className="py-3.5 px-4 font-semibold">Data yang Diproses</th>
									<th className="py-3.5 px-4 font-semibold">Lokasi Penyimpanan</th>
									<th className="py-3.5 px-4 font-semibold">Visibilitas</th>
									<th className="py-3.5 px-4 font-semibold">Kontrol Pengguna</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/[0.05] text-xs">
								{DATA_TRANSPARENCY_MATRIX.map((row) => (
									<tr key={row.feature} className="hover:bg-white/[0.02] transition-colors align-top">
										<td className="py-3.5 px-4 font-semibold text-cyan-300">
											{row.feature}
										</td>
										<td className="py-3.5 px-4 text-gray-300 font-light leading-relaxed">
											{row.data}
										</td>
										<td className="py-3.5 px-4 text-gray-400 font-light leading-relaxed">
											{row.storage}
										</td>
										<td className="py-3.5 px-4 text-gray-400 font-light leading-relaxed">
											{row.visibility}
										</td>
										<td className="py-3.5 px-4 text-emerald-300/90 font-light leading-relaxed">
											{row.control}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				{/* 5. Hak Anda (UU PDP) */}
				<section className="order-5 lg:col-span-12 border-t border-white/[0.07] pt-8 sm:pt-10 mt-2">
					<div className="flex items-center gap-3 mb-5">
						<div className="h-px flex-1 bg-white/10" />
						<h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 text-center">
							Hak Subjek Data (UU PDP 2022)
						</h2>
						<div className="h-px flex-1 bg-white/10" />
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
						{PDP_RIGHTS.map((item) => (
							<div
								key={item.title}
								className="group p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/25 transition-colors flex flex-col gap-2"
							>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] shrink-0" />
									<h3 className="text-xs font-bold text-white/90 group-hover:text-cyan-300 transition-colors uppercase tracking-wider">
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

				{/* 6. Footer Links & Policy Version Metadata */}
				<footer className="order-6 lg:col-span-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2">
						<Link to="/help/docs" className="hover:text-cyan-300 transition-colors uppercase tracking-wider font-semibold text-[11px]">
							Dokumentasi
						</Link>
						<Link to="/live-cs/security" className="hover:text-cyan-300 transition-colors uppercase tracking-wider font-semibold text-[11px]">
							Keamanan Sistem
						</Link>
						<Link to="/help/commitment" className="hover:text-cyan-300 transition-colors uppercase tracking-wider font-semibold text-[11px]">
							Komitmen Layanan
						</Link>
						<Link to="/contact" className="hover:text-cyan-300 transition-colors uppercase tracking-wider font-semibold text-[11px]">
							Kontak Pengelola
						</Link>
					</div>

					<div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
						<Lock size={12} className="text-emerald-400 shrink-0" />
						<span>Diperbarui: November 2026 &bull; PDP Compliant v2.0</span>
					</div>
				</footer>
			</div>
		</motion.div>
	);
}
