import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Database, EyeOff, FileText, UserCheck, MessageCircle } from 'lucide-react';

const ACCENTS = {
	cyan: ['text-cyan-400', 'bg-cyan-900/10'],
	blue: ['text-blue-400', 'bg-blue-900/10'],
	violet: ['text-purple-400', 'bg-purple-900/10'],
	amber: ['text-amber-400', 'bg-amber-900/10']
};

function InfoCard({ icon, title, children, accent = 'cyan' }) {
	const [txt, bg] = ACCENTS[accent] || ACCENTS.cyan;
	return (
		<div className="bg-white/5 border border-white/6 rounded-lg p-4 shadow-sm">
			<div className="flex items-start gap-3">
				<div className={`${txt} p-2 ${bg} rounded-md`}>{icon}</div>
				<div>
					<h3 className="font-semibold text-lg">{title}</h3>
					<div className="mt-2 text-sm text-gray-300">{children}</div>
				</div>
			</div>
		</div>
	);
}

export default function Privasi() {
	return (
		<div className="p-6 max-w-4xl mx-auto">
			<header className="mb-6 flex items-start gap-4">
				<div className="flex-shrink-0 bg-gradient-to-br from-cyan-600 to-blue-500 p-3 rounded-lg shadow-md">
					<ShieldCheck color="white" size={28} />
				</div>
				<div>
					<h1 className="text-2xl font-bold">Kebijakan Privasi — Live CS SaipulAI</h1>
					<p className="mt-1 text-sm text-gray-400">Ringkasan bagaimana data Anda diproses, opsi kontrol privasi, dan integrasi dengan Live CS SaipulAI.</p>
				</div>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
				<div className="lg:col-span-2 space-y-4">
					<InfoCard icon={<FileText size={22} />} title="Data yang Dikumpulkan">
						<ul className="list-disc list-inside">
							<li>Pesan percakapan (user & bot) dan metadata waktu.</li>
							<li>File yang Anda unggah (metadata & konten jika diproses).</li>
							<li>Preferensi pengguna seperti tema, bahasa, dan gaya respons.</li>
						</ul>
					</InfoCard>

					<InfoCard icon={<Database size={22} />} title="Tujuan Penggunaan" accent="violet">
						Pengolahan data bertujuan meningkatkan kualitas jawaban, menyimpan sesi bila diminta, dan mendukung fitur seperti TTS, analitik, serta pelaporan insiden.
					</InfoCard>

					<InfoCard icon={<EyeOff size={22} />} title="Opsi Privasi Anda" accent="amber">
						<ul className="list-disc list-inside">
							<li><strong>Privacy Mode</strong> — non-persisten; percakapan tidak disimpan.</li>
							<li>Hapus riwayat atau hapus sesi tertentu dari menu Riwayat.</li>
							<li>Kontrol unggah file melalui pengaturan File.</li>
						</ul>
					</InfoCard>
				</div>

				<aside className="space-y-4">
					<div className="bg-gradient-to-r from-slate-900/50 to-slate-800/40 border border-white/6 p-4 rounded-lg">
						<div className="flex items-center gap-3">
							<Clock className="text-cyan-300" />
							<div>
								<div className="text-xs text-gray-300">Penyimpanan Lokal</div>
								<div className="text-sm text-gray-200">Sesi, laporan, dan metadata disimpan pada browser kecuali Anda mengekspor atau meng-uploadnya ke layanan backend.</div>
							</div>
						</div>
					</div>

					<div className="bg-white/3 border border-white/6 p-4 rounded-lg">
						<div className="flex items-start gap-2">
							<UserCheck size={20} className="text-green-300" />
							<div>
								<div className="text-sm font-medium">Kontrol Cepat</div>
								<div className="text-xs text-gray-300">Aktifkan Privacy Mode di Pengaturan untuk mencegah penyimpanan otomatis.</div>
							</div>
						</div>
					</div>

					<div className="bg-white/3 border border-white/6 p-3 rounded-lg text-sm text-gray-300">
						<div className="font-semibold">Butuh Bantuan?</div>
						<div className="mt-2">Laporkan masalah privasi melalui tombol Report pada pesan atau hubungi admin.</div>
						<div className="mt-3"><Link to="/live-cs/security" className="text-cyan-400 underline">Lihat Panduan Keamanan</Link></div>
					</div>

					<div className="bg-gradient-to-r from-cyan-900/10 to-cyan-800/10 border border-white/6 p-3 rounded-lg">
						<div className="flex items-start gap-3">
							<div className="text-cyan-400 p-2 bg-cyan-900/10 rounded-md"><MessageCircle size={20} /></div>
							<div>
								<div className="text-sm font-semibold">Live CS SaipulAI</div>
								<div className="text-xs text-gray-300 mt-1">Butuh bantuan langsung? Gunakan fitur "Minta Bantuan" di chat untuk menyerahkan percakapan ke tim Live CS SaipulAI.</div>
								<div className="text-xs text-gray-300 mt-2">Ketersediaan: Senin–Jumat 09:00–17:00. Transkrip percakapan dapat dibagikan ke Live CS jika Anda memilih bantuan.</div>
							</div>
						</div>
					</div>
				</aside>
			</div>

			<div className="mt-4 flex gap-2">
				<Link to="/help/chatbot/settings" className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium" style={{ background: 'linear-gradient(90deg,#06b6d4,#0ea5e9)', color: 'white' }}>
					<ShieldCheck size={16} /> Buka Pengaturan Live CS
				</Link>
				<Link to="/help/chatbot/settings/privacy" className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-white/10" style={{ background: 'transparent', color: 'white' }}>
					Lihat Kebijakan Privasi
				</Link>
			</div>

			<section className="text-sm text-gray-300 space-y-3">
				<div>
					<h3 className="font-semibold">Penyimpanan & Penghapusan</h3>
					<p className="mt-1">Gunakan tombol <em>Hapus Riwayat</em> di chat untuk menghapus percakapan. Untuk penghapusan menyeluruh, hapus data aplikasi melalui pengaturan browser.</p>
				</div>

				<div>
					<h3 className="font-semibold">Laporan & Kontrol</h3>
					<p className="mt-1">Laporan disimpan lokal dan dapat disinkronkan jika backend diaktifkan oleh administrator.</p>
				</div>

				<div>
					<h3 className="font-semibold">Kontak</h3>
					<p className="mt-1">Untuk pertanyaan privasi lebih lanjut, hubungi administrator situs atau lihat dokumentasi proyek.</p>
				</div>
			</section>

			<section className="mt-6">
				<h3 className="font-semibold text-white">Buka Pengaturan Live CS</h3>
				<div className="mt-2 text-sm text-gray-300 space-y-2">
					<p>Gunakan tautan berikut untuk membuka pengaturan Live CS secara langsung. Setiap tautan membuka popup dan langsung berpindah ke tab terkait.</p>
					<ul className="list-disc list-inside">
						<li><Link to="/help/chatbot/settings/general" className="text-cyan-400 underline">General</Link></li>
						<li><Link to="/help/chatbot/settings/ai" className="text-cyan-400 underline">AI</Link></li>
						<li><Link to="/help/chatbot/settings/data" className="text-cyan-400 underline">Data</Link></li>
						<li><Link to="/help/chatbot/settings/file" className="text-cyan-400 underline">File</Link></li>
						<li><Link to="/help/chatbot/settings/performance" className="text-cyan-400 underline">Performance</Link></li>
						<li><Link to="/help/chatbot/settings/privacy" className="text-cyan-400 underline">Privacy</Link></li>
						<li><Link to="/help/chatbot/settings/storage" className="text-cyan-400 underline">Storage</Link></li>
						<li><Link to="/help/chatbot/settings/advanced" className="text-cyan-400 underline">Advanced</Link></li>
					</ul>
				</div>
			</section>
		</div>
	);
}

