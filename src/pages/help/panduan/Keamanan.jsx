import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck, UploadCloud, AlertCircle, FileLock2 } from 'lucide-react';

const ACCENTS = {
	indigo: ['text-indigo-400', 'bg-indigo-900/10'],
	green: ['text-green-400', 'bg-green-900/10'],
	red: ['text-rose-400', 'bg-rose-900/10'],
	purple: ['text-purple-400', 'bg-purple-900/10']
};

function SectionCard({ icon, title, children, accent = 'indigo' }) {
	const [txt, bg] = ACCENTS[accent] || ACCENTS.indigo;
	return (
		<div className="bg-white/5 border border-white/6 rounded-lg p-4">
			<div className="flex items-start gap-3">
				<div className={`${txt} p-2 ${bg} rounded-md`}>{icon}</div>
				<div>
					<h3 className="font-semibold">{title}</h3>
					<div className="mt-2 text-sm text-gray-300">{children}</div>
				</div>
			</div>
		</div>
	);
}

export default function Keamanan() {
	return (
		<div className="p-6 max-w-4xl mx-auto">
			<header className="mb-6 flex items-center gap-4">
				<div className="bg-gradient-to-br from-indigo-600 to-purple-500 p-3 rounded-lg shadow-md">
					<ShieldCheck color="white" size={28} />
				</div>
				<div>
					<h1 className="text-2xl font-bold">Panduan Keamanan — SaipulAI</h1>
					<p className="mt-1 text-sm text-gray-400">Langkah keamanan dan praktik terbaik untuk penggunaan Live Chat yang aman.</p>
				</div>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
				<div className="lg:col-span-2 space-y-4">
					<SectionCard icon={<Lock size={20} />} title="Ringkasan Keamanan" accent="red">
						Kami menjaga percakapan Anda dengan prinsip sederhana: simpan sesedikit mungkin, lindungi saat bergerak, dan beri kontrol penuh kepada Anda. Jika ada istilah teknis nanti, cukup tahu: tujuan kami adalah menjaga data Anda tetap aman.
					</SectionCard>

					<SectionCard icon={<ShieldCheck size={20} />} title="Yang Penting untuk Anda" accent="green">
						Kami menolak otomatis permintaan yang berisi data sensitif (mis. nomor kartu, password), membatasi jenis/ukuran file yang boleh diunggah, dan menyediakan Mode Privasi agar riwayat tidak tersimpan.
					</SectionCard>

					<SectionCard icon={<FileLock2 size={20} />} title="Apa yang Sistem Lakukan (Singkat)" accent="purple">
						Chat akan disanitasi dari input berbahaya, file diproses lalu disimpan ringkasannya, dan bila Anda melapor, laporan dicatat lokal dulu sebelum tim menindaklanjuti.
					</SectionCard>
				</div>

				<aside className="space-y-4">
					<div className="bg-white/3 border border-white/6 p-4 rounded-lg">
						<div className="flex items-start gap-3">
							<AlertCircle className="text-yellow-300" />
							<div>
								<div className="text-sm font-medium">Perhatian</div>
								<div className="text-xs text-gray-300 mt-1">Jangan mengirim data pribadi sensitif (KTP/NIK, nomor kartu, password, CVV, nomor rekening) melalui chat.</div>
							</div>
						</div>
					</div>

					<div className="bg-white/3 border border-white/6 p-4 rounded-lg text-sm text-gray-300">
						<div className="font-semibold">Mode Privasi</div>
						<div className="mt-2">Jika aktif: riwayat obrolan dan snapshot berkurang atau tidak dipersisten; laporan disimpan dengan redaksi; unggahan tidak disinkronkan otomatis ke backend.</div>
						<div className="mt-3 flex gap-2">
							<Link to="/help/chatbot/settings/privacy" className="px-3 py-1 rounded-md text-sm font-medium" style={{ background: 'linear-gradient(90deg,#fb7185,#f43f5e)', color: 'white' }}>Atur Privacy</Link>
							<Link to="/help/chatbot/settings" className="px-3 py-1 rounded-md text-sm font-medium border border-white/10" style={{ color: 'white' }}>Buka Pengaturan Live CS</Link>
						</div>
					</div>
				</aside>
			</div>

			<section className="space-y-4 text-sm text-gray-300">
				<div>
					<h3 className="font-semibold">Koneksi Aman (HTTPS)</h3>
					<p className="mt-1">Semua komunikasi menggunakan koneksi aman (lihat ikon gembok di browser). Anda tidak perlu mengubah apa pun — cukup jangan gunakan alamat yang dimulai dengan "http://" pada halaman layanan.</p>
				</div>

				<div>
					<h3 className="font-semibold">Simpan di Perangkat Anda (Local)</h3>
					<p className="mt-1">Obrolan disimpan di browser Anda supaya bisa dilanjutkan nanti. Jika Anda aktifkan <em>Privacy Mode</em>, hanya ringkasan kecil yang disimpan (mis. id & waktu). Untuk menghapus, buka Riwayat dan hapus sesi yang tidak Anda inginkan.</p>
				</div>

				<div>
					<h3 className="font-semibold">Jika Anda Mengetik Data Sensitif</h3>
					<p className="mt-1">Jangan masukkan informasi seperti nomor kartu, password, KTP/NIK, atau rekening. Sistem akan menolak pesan yang terdeteksi mengandung data sensitif dan memberi tahu Anda untuk menghapus informasi tersebut.</p>
				</div>

				<div>
					<h3 className="font-semibold">Unggah File dengan Aman</h3>
					<p className="mt-1">Anda bisa mengunggah dokumen dan gambar untuk dianalisis. Periksa ukuran dan jenis file (lihat Pengaturan). Hindari mengunggah dokumen yang berisi data sensitif. Di sisi server, file hanya diproses lalu ringkasannya yang disimpan untuk mencari konten.</p>
				</div>

				<div>
					<h3 className="font-semibold">Aman di Belakang Layar</h3>
					<p className="mt-1">Server dan API dilindungi dengan kunci dan batas akses. Ini hal teknis—yang penting bagi Anda: hanya orang/layanan yang berizin yang bisa melihat data tersimpan.</p>
				</div>

				<div>
					<h3 className="font-semibold">Catatan & Audit</h3>
					<p className="mt-1">Sistem mencatat kejadian penting untuk membantu perbaikan dan investigasi. Data sensitif disunting sebelum tercatat, dan log disimpan hanya selama yang dibutuhkan.</p>
				</div>

				<div>
					<h3 className="font-semibold">Melaporkan Masalah</h3>
					<p className="mt-1">Jika ada jawaban yang salah, berbahaya, atau tidak pantas, tekan tombol <em>Report</em>. Laporan akan direkam dan tim akan meninjau. Anda bisa memilih untuk memberikan kontak jika ingin dihubungi.</p>
				</div>

				<div>
					<h3 className="font-semibold">Layanan Eksternal</h3>
					<p className="mt-1">Beberapa fitur mungkin menggunakan layanan pihak ketiga (mis. model bahasa atau penyimpanan). Kami akan mencoba untuk merahasiakan data sensitif, dan akan memberi tahu bila data perlu dikirim ke layanan eksternal.</p>
				</div>

				<div>
					<h3 className="font-semibold">Tips Cepat untuk Pengguna</h3>
					<ul className="list-disc list-inside mt-1">
						<li>Hindari mengirim data sensitif (nomor kartu, password, NIK, rekening).</li>
						<li>Gunakan <em>Privacy Mode</em> untuk percakapan pribadi.</li>
						<li>Ingin menghapus? Buka Riwayat dan hapus sesi yang tidak perlu.</li>
						<li>Periksa link sebelum mengklik dan jangan bagikan informasi pribadi di publik.</li>
					</ul>
				</div>

				<div>
					<h3 className="font-semibold">Untuk Tim Produk (Singkat)</h3>
					<ul className="list-disc list-inside mt-1">
						<li>Pastikan file diproses di lingkungan terisolasi dan dipindai dari malware.</li>
						<li>Gunakan header keamanan (CSP, HSTS) dan batasi akses API.</li>
						<li>Enkripsi backup dan tetapkan kebijakan penghapusan data.</li>
						<li>Uji skenario input berbahaya secara berkala.</li>
					</ul>
				</div>
			</section>

			<section className="mt-6">
				<h3 className="font-semibold text-white">Buka Pengaturan Live CS</h3>
				<div className="mt-2 text-sm text-gray-300 space-y-2">
					<p>Langsung buka popup pengaturan Live CS untuk menyesuaikan perilaku chat dan privasi:</p>
					<ul className="list-disc list-inside">
						<li><Link to="/help/chatbot/settings/general" className="text-indigo-300 underline">General</Link></li>
						<li><Link to="/help/chatbot/settings/ai" className="text-indigo-300 underline">AI</Link></li>
						<li><Link to="/help/chatbot/settings/data" className="text-indigo-300 underline">Data</Link></li>
						<li><Link to="/help/chatbot/settings/file" className="text-indigo-300 underline">File</Link></li>
						<li><Link to="/help/chatbot/settings/performance" className="text-indigo-300 underline">Performance</Link></li>
						<li><Link to="/help/chatbot/settings/privacy" className="text-indigo-300 underline">Privacy</Link></li>
						<li><Link to="/help/chatbot/settings/storage" className="text-indigo-300 underline">Storage</Link></li>
						<li><Link to="/help/chatbot/settings/advanced" className="text-indigo-300 underline">Advanced</Link></li>
					</ul>
				</div>
			</section>

			<div className="mt-6 text-sm text-gray-400">Kembali ke <Link to="/live-cs/privacy" className="text-indigo-300 underline">Privasi</Link>.</div>
		</div>
	);
}
