import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, UploadCloud, AlertCircle, FileLock2, ChevronRight, Settings } from 'lucide-react';

const ACCENTS = {
	indigo: { 
		text: 'text-indigo-400', 
		bg: 'bg-indigo-500/10', 
		border: 'border-indigo-500/20',
		glow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)]'
	},
	green: { 
		text: 'text-emerald-400', 
		bg: 'bg-emerald-500/10', 
		border: 'border-emerald-500/20',
		glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]'
	},
	red: { 
		text: 'text-rose-400', 
		bg: 'bg-rose-500/10', 
		border: 'border-rose-500/20',
		glow: 'shadow-[0_0_15px_rgba(244,63,94,0.1)]'
	},
	purple: { 
		text: 'text-fuchsia-400', 
		bg: 'bg-fuchsia-500/10', 
		border: 'border-fuchsia-500/20',
		glow: 'shadow-[0_0_15px_rgba(192,38,211,0.1)]'
	}
};

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1 }
	}
};

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0 }
};

function SectionCard({ icon, title, children, accent = 'indigo' }) {
	const styles = ACCENTS[accent] || ACCENTS.indigo;
	return (
		<motion.div 
			variants={itemVariants}
			whileHover={{ y: -2 }}
			className={`bg-white/[0.03] backdrop-blur-sm border ${styles.border} ${styles.glow} rounded-2xl p-5 transition-all duration-300`}
		>
			<div className="flex items-start gap-4">
				<div className={`${styles.text} p-2.5 ${styles.bg} rounded-xl`}>{icon}</div>
				<div className="flex-1">
					<h3 className="font-semibold text-white/90 tracking-tight">{title}</h3>
					<div className="mt-2 text-sm text-gray-400 leading-relaxed font-light">{children}</div>
				</div>
			</div>
		</motion.div>
	);
}

function SettingsLink({ to, label, accent = 'indigo' }) {
	return (
		<Link 
			to={to} 
			className="group flex items-center justify-between p-2.5 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
		>
			<span className="text-xs font-medium text-gray-400 group-hover:text-indigo-300 transition-colors">{label}</span>
			<ChevronRight size={14} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
		</Link>
	);
}

export default function Keamanan() {
	return (
		<motion.div 
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="p-6 md:p-12 max-w-5xl mx-auto min-h-screen"
		>
			<motion.header variants={itemVariants} className="mb-12 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
				<div className="relative">
					<div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
					<div className="relative bg-gradient-to-br from-indigo-600 to-fuchsia-500 p-4 rounded-2xl shadow-xl shadow-indigo-500/10 border border-white/10">
						<ShieldCheck color="white" size={32} strokeWidth={2.5} />
					</div>
				</div>
				<div className="flex-1">
					<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
						Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Framework</span>
					</h1>
					<p className="text-gray-400 max-w-2xl text-sm md:text-base font-light italic">
						"Keamanan bukanlah tujuan akhir, melainkan fondasi dari setiap percakapan."
					</p>
				</div>
			</motion.header>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
				<div className="lg:col-span-8 space-y-6">
					<SectionCard icon={<Lock size={22} />} title="Enkripsi & Sanitasi" accent="red">
						Setiap pesan yang Anda kirim disanitasi dari input berbahaya dan terlindungi oleh protokol HTTPS standar industri. Kami memastikan data Anda tidak pernah terlihat oleh pihak yang tidak berkepentingan.
					</SectionCard>

					<SectionCard icon={<ShieldCheck size={22} />} title="Kontrol Sensitifitas" accent="green">
						Sistem secara otomatis mendeteksi dan mencegah pengiriman data sensitif seperti NIK, nomor kartu, atau password. Mode Privasi tersedia untuk memastikan tidak ada riwayat yang tertinggal.
					</SectionCard>

					<SectionCard icon={<FileLock2 size={22} />} title="Manajemen Berkas" accent="purple">
						File yang diunggah diproses dalam lingkungan terisolasi. Hanya metadata dan ringkasan konten yang dipertahankan untuk kebutuhan pencarian, dengan batas ukuran dan jenis yang ketat.
					</SectionCard>
				</div>

				<motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6">
					<div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden group">
						<div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
							<AlertCircle size={64} className="text-amber-500" />
						</div>
						<div className="relative flex items-start gap-3">
							<AlertCircle className="text-amber-400 shrink-0" size={20} />
							<div>
								<div className="text-sm font-bold text-amber-200 uppercase tracking-wider mb-1">Peringatan</div>
								<div className="text-xs text-amber-100/70 leading-relaxed font-light">
									Hindari berbagi data pribadi seperti KTP, nomor rekening, atau kredensial login. Tim kami tidak akan pernah meminta informasi ini melalui chat.
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
						<h3 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
							<Settings size={16} className="text-indigo-400" />
							Konfigurasi Cepat
						</h3>
						<div className="space-y-2">
							<SettingsLink to="/help/chatbot/settings/privacy" label="Privasi & Mode Samaran" />
							<SettingsLink to="/help/chatbot/settings" label="Global Settings" />
						</div>
						<div className="mt-4 pt-4 border-t border-white/[0.04]">
							<p className="text-[10px] text-gray-500 leading-tight">
								Gunakan Mode Privasi jika Anda ingin percakapan tidak disimpan sama sekali di perangkat lokal.
							</p>
						</div>
					</div>
				</motion.aside>
			</div>

			<motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 border-t border-white/[0.06] pt-12">
				{[
					{ title: "Koneksi Aman", desc: "Komunikasi dua arah selalu menggunakan enkripsi SSL/TLS tingkat tinggi." },
					{ title: "Penyimpanan Lokal", desc: "Data riwayat disimpan di sandbox browser Anda dan dapat dihapus kapan saja." },
					{ title: "Penanganan Data", desc: "Data hanya diproses untuk memberikan respons yang relevan bagi Anda." },
					{ title: "Audit & Transparansi", desc: "Semua interaksi dicatat secara anonim untuk peningkatan kualitas sistem." }
				].map((item, idx) => (
					<div key={idx} className="group">
						<h4 className="text-sm font-bold text-white/80 group-hover:text-indigo-400 transition-colors mb-2 uppercase tracking-widest text-[11px]">{item.title}</h4>
						<p className="text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
					</div>
				))}
			</motion.section>

			<motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6">
				<div className="flex gap-4">
					<Link to="/live-cs/privacy" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors border-b border-transparent hover:border-indigo-500/50 pb-0.5">Kebijakan Privasi</Link>
					<span className="text-gray-700">|</span>
					<Link to="/help/docs" className="text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors border-b border-transparent hover:border-gray-500/50 pb-0.5">Dokumentasi</Link>
				</div>
				<p className="text-[10px] text-gray-600 font-mono tracking-tighter">
					VER 2.4.0 — SECURITY_GUIDELINE
				</p>
			</motion.div>
		</motion.div>
	);
}
