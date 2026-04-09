import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
	ShieldCheck, Clock, Database, EyeOff, FileText, 
	UserCheck, MessageCircle, ChevronRight, Zap, Fingerprint 
} from 'lucide-react';

const ACCENTS = {
	cyan: {
		text: 'text-cyan-400',
		bg: 'bg-cyan-500/10',
		border: 'border-cyan-500/20',
		glow: 'shadow-[0_0_15px_rgba(6,182,212,0.1)]'
	},
	blue: {
		text: 'text-blue-400',
		bg: 'bg-blue-500/10',
		border: 'border-blue-500/20',
		glow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]'
	},
	violet: {
		text: 'text-violet-400',
		bg: 'bg-violet-500/10',
		border: 'border-violet-500/20',
		glow: 'shadow-[0_0_15px_rgba(139,92,246,0.1)]'
	},
	amber: {
		text: 'text-amber-400',
		bg: 'bg-amber-500/10',
		border: 'border-amber-500/20',
		glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]'
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
	hidden: { opacity: 0, y: 15 },
	visible: { opacity: 1, y: 0 }
};

function InfoCard({ icon, title, children, accent = 'cyan' }) {
	const styles = ACCENTS[accent] || ACCENTS.cyan;
	return (
		<motion.div 
			variants={itemVariants}
			whileHover={{ scale: 1.01 }}
			className={`bg-white/[0.03] backdrop-blur-md border ${styles.border} ${styles.glow} rounded-2xl p-6 transition-all duration-300`}
		>
			<div className="flex items-start gap-4">
				<div className={`${styles.text} p-3 ${styles.bg} rounded-xl`}>{icon}</div>
				<div className="flex-1">
					<h3 className="font-semibold text-white/90 text-lg tracking-tight">{title}</h3>
					<div className="mt-2 text-sm text-gray-400 leading-relaxed font-light">{children}</div>
				</div>
			</div>
		</motion.div>
	);
}

function SettingsChip({ to, icon, label }) {
	return (
		<Link 
			to={to} 
			className="group flex items-center gap-3 p-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
		>
			<div className="text-gray-500 group-hover:text-cyan-400 transition-colors">{icon}</div>
			<span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{label}</span>
		</Link>
	);
}

function PrivacyScoreWidget() {
	return (
		<div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative overflow-hidden group">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-sm font-bold text-white uppercase tracking-wider">Privacy Rating</h3>
				<span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">EXCELLENT</span>
			</div>
			
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-500">Encryption Layer</span>
					<span className="text-[10px] text-emerald-400 font-mono">TLS 1.3</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-500">Data Minimization</span>
					<span className="text-[10px] text-emerald-400 font-mono">ENABLED</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-500">PDP Compliance</span>
					<span className="text-[10px] text-cyan-400 font-mono">VERIFIED</span>
				</div>
				
				<div className="pt-2">
					<div className="flex justify-between items-end mb-1.5">
						<span className="text-[10px] text-gray-500 font-bold uppercase">Security Score</span>
						<span className="text-xs font-bold text-white">98%</span>
					</div>
					<div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
						<motion.div 
							initial={{ width: 0 }}
							animate={{ width: '98%' }}
							transition={{ duration: 2, ease: "easeOut" }}
							className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" 
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Privasi() {
	return (
		<motion.div 
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="p-6 md:p-12 max-w-5xl mx-auto min-h-screen"
		>
			<motion.header variants={itemVariants} className="mb-12 flex flex-col md:flex-row items-center md:items-start gap-6">
				<div className="relative group">
					<div className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
					<div className="relative bg-gradient-to-br from-cyan-600 to-blue-500 p-4 rounded-2xl shadow-2xl border border-white/10">
						<Fingerprint color="white" size={32} />
					</div>
				</div>
				<div className="text-center md:text-left">
					<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
						Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Policy</span>
					</h1>
					<p className="text-gray-400 max-w-xl text-sm md:text-base font-light">
						Komitmen kami untuk melindungi identitas digital dan setiap kata yang Anda percayakan kepada sistem kami.
					</p>
				</div>
			</motion.header>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
				<div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<InfoCard icon={<FileText size={22} />} title="Pengumpulan Data" accent="cyan">
						Kami menganut prinsip *Data Minimization*. Hanya metadata esensial dan preferensi sesi yang disimpan secara lokal. Tidak ada pelacakan lintas-situs atau profil iklan yang dibuat dari percakapan Anda.
					</InfoCard>

					<InfoCard icon={<Database size={22} />} title="Kepatuhan UU PDP" accent="violet">
						Seluruh tata kelola data kami selaras dengan **UU Pelindungan Data Pribadi (PDP) Indonesia 2022**. Anda memiliki hak penuh atas akses, koreksi, dan penghapusan informasi pribadi Anda kapan pun.
					</InfoCard>

					<InfoCard icon={<EyeOff size={22} />} title="Zero-Knowledge AI" accent="amber">
						Interaksi dengan mesin AI diproses melalui kanal terisolasi. Data tidak digunakan untuk melatih model publik provider LLM, menjaga integritas rahasia dagang atau informasi pribadi yang Anda bagikan.
					</InfoCard>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
				<div className="lg:col-span-8 space-y-8">
					<motion.section variants={itemVariants} className="space-y-6">
						<div className="flex items-center gap-3">
							<div className="h-px flex-1 bg-white/10"></div>
							<h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Hak Anda (UU PDP)</h2>
							<div className="h-px flex-1 bg-white/10"></div>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[
								{ h: "Akses & Informasi", d: "Hak mengetahui jenis data dan tujuan pemrosesan." },
								{ h: "Koreksi & Pembaruan", d: "Hak memperbaiki kesalahan data pribadi Anda." },
								{ h: "Penghapusan (Erasure)", d: "Hak untuk menghapus data Anda dari sistem kami." },
								{ h: "Keberatan & Penarikan", d: "Hak menarik persetujuan pemrosesan data." }
							].map((item, i) => (
								<div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.01] border border-white/[0.03]">
									<div className="mt-1 w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
									<div>
										<div className="text-[11px] font-bold text-white/70 uppercase tracking-tighter mb-1">{item.h}</div>
										<p className="text-[10px] text-gray-500 leading-relaxed font-light">{item.d}</p>
									</div>
								</div>
							))}
						</div>
					</motion.section>

					<motion.section variants={itemVariants} className="space-y-6">
						<div className="flex items-center gap-3">
							<div className="h-px flex-1 bg-white/10"></div>
							<h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Transparansi Layanan</h2>
							<div className="h-px flex-1 bg-white/10"></div>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.03]">
								<h3 className="text-white/80 font-semibold mb-2 flex items-center gap-2">
									<Zap size={16} className="text-cyan-400" />
									Layanan Pihak Ketiga
								</h3>
								<p className="text-xs text-gray-500 leading-relaxed">
									Kami menggunakan **Supabase** (Auth & Real-time), **EmailJS** (Form kontak), **reCAPTCHA** (Keamanan), dan **Socket.io** untuk fungsionalitas aplikasi. Data yang dikirimkan terbatas pada kebutuhan teknis masing-masing layanan.
								</p>
							</div>
							<div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.03]">
								<h3 className="text-white/80 font-semibold mb-2 flex items-center gap-2">
									<Fingerprint size={16} className="text-blue-400" />
									Personalisasi Profil
								</h3>
								<p className="text-xs text-gray-500 leading-relaxed">
									Sistem menggunakan Entity Recognition untuk mengenali detail seperti nama atau lokasi yang Anda bagikan guna membangun profil lokal yang meningkatkan relevansi percakapan di masa depan.
								</p>
							</div>
							<div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.03]">
								<h3 className="text-white/80 font-semibold mb-2 flex items-center gap-2">
									<Clock size={16} className="text-amber-400" />
									Retensi & Anomali
								</h3>
								<p className="text-xs text-gray-500 leading-relaxed">
									Sesi lama diarsipkan otomatis. Kami mencatat anomali teknis dan laporan chat secara anonim untuk memantau kesehatan sistem dan mencegah penyalahgunaan fitur AI.
								</p>
							</div>
							<div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.03]">
								<h3 className="text-white/80 font-semibold mb-2 flex items-center gap-2">
									<MessageCircle size={16} className="text-violet-400" />
									Emotional Layer
								</h3>
								<p className="text-xs text-gray-500 leading-relaxed">
									Analisis sentimen dilakukan secara real-time untuk menyesuaikan karakter bot. Metadata emosi ini bersifat sementara dan hanya digunakan untuk memperkaya interaksi selama sesi aktif.
								</p>
							</div>
						</div>
					</motion.section>
				</div>

				<motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6">
					<div className="space-y-6">
						<div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 p-6 rounded-2xl">
							<div className="flex items-center gap-2 mb-4">
								<Zap size={18} className="text-cyan-400 fill-cyan-400/20" />
								<h3 className="text-sm font-bold text-white uppercase tracking-wider">Akses Cepat</h3>
							</div>
							<div className="grid grid-cols-1 gap-2">
								<SettingsChip to="/help/chatbot/settings/privacy" icon={<EyeOff size={14}/>} label="Privacy Controls" />
								<SettingsChip to="/help/chatbot/settings/data" icon={<Database size={14}/>} label="Data Management" />
								<SettingsChip to="/live-cs/security" icon={<ShieldCheck size={14}/>} label="Security Guide" />
							</div>
						</div>

						<PrivacyScoreWidget />

						<div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
							<UserCheck size={28} className="mx-auto text-emerald-400 mb-3 opacity-60" />
							<h4 className="text-xs font-bold text-white/80 mb-1">Status Kepercayaan</h4>
							<p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">PDP COMPLIANT v1.2</p>
						</div>
					</div>
				</motion.aside>
			</div>

			<motion.div variants={itemVariants} className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity">
				<div className="flex items-center gap-6">
					<Link to="/help/docs" className="text-[11px] font-bold text-gray-400 hover:text-cyan-400 transition-colors uppercase tracking-widest">Documentation</Link>
					<Link to="/contact" className="text-[11px] font-bold text-gray-400 hover:text-cyan-400 transition-colors uppercase tracking-widest">Contact Admin</Link>
				</div>
				<p className="text-[10px] text-gray-600 font-medium">
					Terakhir diperbarui: April 2024
				</p>
			</motion.div>
		</motion.div>
	);
}

