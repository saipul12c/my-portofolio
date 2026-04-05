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
						Kami hanya menyimpan metadata esensial: kapan Anda chat, preferensi bahasa, dan transkrip sesi untuk menjaga kontinuitas layanan.
					</InfoCard>

					<InfoCard icon={<Database size={22} />} title="Tujuan & Manfaat" accent="violet">
						Data digunakan untuk melatih kecerdasan bot lokal, optimasi kecepatan respons, dan penyediaan fitur kustomisasi antarmuka.
					</InfoCard>

					<InfoCard icon={<EyeOff size={22} />} title="Kedaulatan Kontrol" accent="amber">
						Kendali penuh ada di tangan Anda. Hapus riwayat secara instan, nonaktifkan pelacakan, atau gunakan Mode Incognito kapan saja.
					</InfoCard>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
				<div className="lg:col-span-8 space-y-8">
					<motion.section variants={itemVariants} className="space-y-6">
						<div className="flex items-center gap-3">
							<div className="h-px flex-1 bg-white/10"></div>
							<h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Prinsip Privasi</h2>
							<div className="h-px flex-1 bg-white/10"></div>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.03]">
								<h3 className="text-white/80 font-semibold mb-2 flex items-center gap-2">
									<Clock size={16} className="text-cyan-400" />
									Retensi Data
								</h3>
								<p className="text-xs text-gray-500 leading-relaxed">
									Data bersifat sementara. Sesi lama akan diarsipkan secara otomatis dan akan dihapus permanen dalam siklus tertentu kecuali Anda memilih untuk mengekspornya.
								</p>
							</div>
							<div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.03]">
								<h3 className="text-white/80 font-semibold mb-2 flex items-center gap-2">
									<MessageCircle size={16} className="text-blue-400" />
									Live Support
								</h3>
								<p className="text-xs text-gray-500 leading-relaxed">
									Saat meminta bantuan Live CS, transkrip percakapan akan dibagikan hanya kepada agen yang bertugas sesuai jadwal operasional.
								</p>
							</div>
						</div>
					</motion.section>
				</div>

				<motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6">
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

					<div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
						<UserCheck size={28} className="mx-auto text-emerald-400 mb-3 opacity-60" />
						<h4 className="text-xs font-bold text-white/80 mb-1">Status Kepercayaan</h4>
						<p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Verified Security v2</p>
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

