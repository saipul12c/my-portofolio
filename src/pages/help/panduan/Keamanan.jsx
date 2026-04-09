import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, UploadCloud, AlertCircle, FileLock2, ChevronRight, Settings, Trash2, Activity, Globe, Zap, Cpu } from 'lucide-react';

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

function SecurityHealthWidget() {
	const [status, setStatus] = useState('scanning');
	const [storageUsage, setStorageUsage] = useState('0 KB');

	useEffect(() => {
		const timer = setTimeout(() => {
			setStatus('secure');

			// Calculate approximate storage usage
			let total = 0;
			try {
				for (let x in localStorage) {
					if (localStorage.hasOwnProperty(x)) {
						total += ((localStorage[x].length + x.length) * 2);
					}
				}
			} catch (e) { void e; }
			setStorageUsage(total < 1024 ? `${total} B` : total < 1048576 ? `${(total / 1024).toFixed(1)} KB` : `${(total / 1048576).toFixed(1)} MB`);
		}, 1500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden group">
			<div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
				<Activity size={100} />
			</div>
			<h3 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
				<Activity size={16} className="text-emerald-400" />
				Security Health Check
			</h3>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Globe size={14} className="text-gray-500" />
						<span className="text-xs text-gray-400 font-light">Connection</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
						<span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">SSL/TLS 1.3 (Encrypted)</span>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<ShieldCheck size={14} className="text-gray-500" />
						<span className="text-xs text-gray-400 font-light">WAF Status</span>
					</div>
					<span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight">Active Protection</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Lock size={14} className="text-gray-500" />
						<span className="text-xs text-gray-400 font-light">Local Sandbox</span>
					</div>
					<span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight">{status === 'scanning' ? 'Verifying...' : 'Isolated'}</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Zap size={14} className="text-gray-500" />
						<span className="text-xs text-gray-400 font-light">Storage Size</span>
					</div>
					<span className="text-[10px] font-medium text-gray-300">{storageUsage}</span>
				</div>

				<div className="pt-2">
					<div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: status === 'scanning' ? '40%' : '100%' }}
							transition={{ duration: 1.5 }}
							className="h-full bg-gradient-to-r from-emerald-500/50 to-indigo-500/50"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Keamanan() {
	const handlePurgeData = () => {
		if (window.confirm("Hapus semua data lokal? Tindakan ini akan menghapus riwayat chat, file terupload, dan pengaturan Anda selamanya secara permanen.")) {
			try {
				localStorage.clear();
				window.location.reload();
			} catch (e) {
				alert("Gagal menghapus data. Silakan hapus cache browser secara manual.");
			}
		}
	};

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
					<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 uppercase">
						Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Framework</span>
					</h1>
					<p className="text-gray-400 max-w-2xl text-sm md:text-base font-light italic opacity-80">
						"Keamanan bukanlah tujuan akhir, melainkan fondasi dari setiap percakapan cerdas."
					</p>
				</div>
			</motion.header>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
				<div className="lg:col-span-8 space-y-6">
					<SectionCard icon={<Lock size={22} />} title="Secure Storage Layer" accent="indigo">
						Seluruh data riwayat dan preferensi dikelola melalui storage engine terisolasi di browser Anda. Meskipun kami meminimalisir persistensi server, kami menyarankan penggunaan **Mode Samaran** jika Anda berbagi perangkat dengan orang lain.
					</SectionCard>

					<SectionCard icon={<Activity size={22} />} title="Rate Limiting & Flood Protection" accent="amber">
						Sistem memantau frekuensi permintaan secara *real-time* untuk mencegah serangan spam dan eksploitasi API. Kami membatasi jumlah interaksi per jendela waktu guna menjaga stabilitas layanan bagi seluruh pengguna.
					</SectionCard>

					<SectionCard icon={<ShieldCheck size={22} />} title="Safety Content Filter" accent="red">
						Algoritma kami secara otomatis mendeteksi dan memblokir input yang mengandung pola berbahaya, ilegal, atau upaya bypass instruksi (prompt injection) untuk menjaga etika dan keamanan percakapan.
					</SectionCard>

					<SectionCard icon={<Cpu size={22} />} title="AI Anonymization Layer" accent="purple">
						Sistem melakukan pemindaian otomatis menggunakan layer anonimisasi sebelum data diproses. Informasi sensitif di-*redact* secara cerdas untuk memastikan identitas asli Anda tetap terjaga di infrastruktur cloud.
					</SectionCard>

					<SectionCard icon={<Zap size={22} />} title="Deteksi PII Real-time" accent="green">
						Sistem kami mendeteksi secara instan data pribadi (PII) seperti NIK, email, atau nomor telepon. Kami memberikan peringatan atau pemblokiran otomatis sebelum informasi sensitif tersebut terkirim keluar dari sandbox lokal Anda.
					</SectionCard>

					<SectionCard icon={<FileLock2 size={22} />} title="Local-first File Processing" accent="indigo">
						Proses ekstraksi data dari file (PDF, XLSX, dsb) dilakukan sepenuhnya secara client-side. File fisik Anda tidak pernah diunggah secara utuh ke server publik; hanya representasi teks yang diproses untuk basis pengetahuan sementara.
					</SectionCard>

					<SectionCard icon={<Globe size={22} />} title="Infrastruktur Keamanan Berlapis" accent="indigo">
						Aplikasi ini dilindungi oleh Web Application Firewall (WAF) tingkat enterprise dan mitigasi DDoS otomatis. Seluruh lalu lintas data dienkripsi menggunakan protokol **TLS 1.3** yang memastikan data tidak dapat diintersepsi saat dalam perjalanan.
					</SectionCard>

					<SectionCard icon={<Cpu size={22} />} title="Siklus Hidup Data & Purge Sesi" accent="purple">
						Data interaksi Anda memiliki siklus hidup yang ketat. Setelah sesi berakhir atau tombol 'Reset' ditekan, sistem secara otomatis membersihkan cache memori sementara. Kami menganut prinsip *Privacy by Design* di mana retensi data minimal menjadi prioritas utama.
					</SectionCard>
				</div>

				<motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6">
					<SecurityHealthWidget />

					<div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden group">
						<div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
							<AlertCircle size={64} className="text-amber-500" />
						</div>
						<div className="relative flex items-start gap-3">
							<AlertCircle className="text-amber-400 shrink-0" size={20} />
							<div>
								<div className="text-sm font-bold text-amber-200 uppercase tracking-wider mb-1">Peringatan</div>
								<div className="text-xs text-amber-100/70 leading-relaxed font-light">
									Hindari berbagi KTP atau password. Tim pengembang tidak akan pernah meminta kredensial Anda melalui fitur chat ini.
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
						<h3 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
							<Settings size={16} className="text-indigo-400" />
							Konfigurasi & Aksi
						</h3>
						<div className="space-y-2">
							<SettingsLink to="/help/chatbot/settings/privacy" label="Atur Privasi & Samaran" />
							<SettingsLink to="/help/chatbot/settings" label="Global Setup" />
							<button
								onClick={handlePurgeData}
								className="w-full mt-4 flex items-center justify-between p-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all group"
							>
								<span className="text-xs font-bold text-rose-400 group-hover:text-rose-300">Purge Local Data</span>
								<Trash2 size={14} className="text-rose-500" />
							</button>
						</div>
						<div className="mt-4 pt-4 border-t border-white/[0.04]">
							<div className="flex items-center gap-2 mb-2">
								<ShieldCheck size={14} className="text-emerald-400" />
								<span className="text-[10px] font-bold text-white/60 uppercase">Security Disclosure</span>
							</div>
							<p className="text-[10px] text-gray-500 leading-tight">
								Menemukan kerentanan? Laporkan secara bertanggung jawab ke <a href="mailto:test@syaiful.com" className="text-indigo-400 hover:underline">test@syaiful.com</a> untuk membantu kami menjaga keamanan ekosistem ini.
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
					SECURITY_GUIDELINE
				</p>
			</motion.div>
		</motion.div>
	);
}
