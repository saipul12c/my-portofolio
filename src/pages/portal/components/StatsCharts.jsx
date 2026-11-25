import React, { memo } from 'react';
import { FaGithub } from 'react-icons/fa';
import { MdOpenInNew } from 'react-icons/md';
import { GitHubCalendar } from 'react-github-calendar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { monthlyData, platformStats, portfolioSummaryStats } from '../modules/portalData';

const StatsCharts = memo(() => {
  const summary = portfolioSummaryStats;

  return (
    <div className="mt-8 pt-8 border-t border-gray-800">
      <h3 className="text-xl font-bold text-white mb-6">📊 Statistics & Portfolio Overview</h3>

      {/* GitHub Contribution Graph */}
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-6 hover:border-cyan-500/30 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white flex-shrink-0">
              <FaGithub className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base flex items-center gap-2">
                GitHub Contribution Graph
                <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                  @saipul12c
                </span>
              </h4>
              <p className="text-gray-400 text-xs mt-0.5">
                Grafik aktivitas komit & kontribusi kode terbuka di GitHub dalam 1 tahun terakhir
              </p>
            </div>
          </div>

          <a
            href="https://github.com/saipul12c"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-all duration-200 self-start sm:self-auto"
          >
            Buka GitHub
            <MdOpenInNew className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="w-full overflow-x-auto pb-2 flex justify-center custom-scrollbar">
          <GitHubCalendar
            username="saipul12c"
            colorScheme="dark"
            blockSize={13}
            blockMargin={4}
            fontSize={12}
            theme={{
              dark: ['#1e293b', '#065f46', '#059669', '#10b981', '#34d399'],
            }}
            labels={{
              totalCount: '{{count}} kontribusi di GitHub dalam setahun terakhir',
            }}
          />
        </div>
      </div>

      {/* Bar Chart - Real Portfolio Growth & Productivity */}
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-6 hover:border-gray-700 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-white font-semibold text-base flex items-center gap-2">
              <span>📈</span>
              Produktivitas & Tren Rilis Portofolio
            </h4>
            <p className="text-gray-400 text-xs mt-0.5">
              Distribusi penyelesaian proyek web/AI, pencapaian sertifikasi resmi, rilis fitur, dan dokumentasi visual
            </p>
          </div>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
            100% Data Riil Projek
          </span>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                padding: '12px'
              }}
              labelStyle={{ color: '#FFF', fontWeight: 'bold' }}
              formatter={(value, name) => {
                if (name === 'Projek Selesai' || name === 'projects') return [`${value} Proyek`, 'Projek Selesai'];
                if (name === 'Sertifikasi' || name === 'certificates') return [`${value} Sertifikat`, 'Sertifikasi Diraih'];
                if (name === 'Fitur Rilis' || name === 'features') return [`${value} Fitur`, 'Fitur Rilis'];
                if (name === 'Dokumentasi Visual' || name === 'documentation') return [`${value} Karya`, 'Dokumentasi Visual'];
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="projects" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Projek Selesai" />
            <Bar dataKey="certificates" fill="#A78BFA" radius={[6, 6, 0, 0]} name="Sertifikasi" />
            <Bar dataKey="features" fill="#10B981" radius={[6, 6, 0, 0]} name="Fitur Rilis" />
            <Bar dataKey="documentation" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Dokumentasi Visual" />
          </BarChart>
        </ResponsiveContainer>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Proyek</div>
            <div className="text-2xl font-bold text-white">{summary.totalProjects}</div>
            <div className="text-emerald-400 text-xs flex items-center mt-1">
              <span className="mr-1">✓</span>
              {summary.completionRate} Selesai & Teruji
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Fitur & Tech Stack</div>
            <div className="text-2xl font-bold text-white">{summary.totalFeatures}+</div>
            <div className="text-cyan-400 text-xs flex items-center mt-1">
              <span className="mr-1">⚡</span>
              {summary.totalTechStack} Teknologi Modern
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Bulan Paling Aktif</div>
            <div className="text-2xl font-bold text-white">{summary.bestPeriod}</div>
            <div className="text-purple-400 text-xs mt-1">
              {summary.bestPeriodDesc}
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Dokumentasi Foto</div>
            <div className="text-2xl font-bold text-white">{summary.totalPhotos}+</div>
            <div className="text-yellow-400 text-xs mt-1">Koleksi Visual & Pagelaran</div>
          </div>
        </div>
      </div>

      {/* Portfolio Highlight Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-all hover:scale-[1.02] cursor-pointer">
          <p className="text-3xl font-bold text-white mb-2">{summary.totalWorks}+</p>
          <p className="text-gray-400 text-sm font-medium">Total Karya & Aset</p>
          <div className="mt-3 text-xs text-purple-300 flex items-center gap-1">
            <span>✨</span> {summary.totalProjects} Proyek, {summary.totalCertificates} Sertifikat, {summary.totalPhotos}+ Foto
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 hover:border-blue-500/60 transition-all hover:scale-[1.02] cursor-pointer">
          <p className="text-3xl font-bold text-white mb-2">{summary.trainingHours} Jam</p>
          <p className="text-gray-400 text-sm font-medium">Jam Pelatihan & Sertifikasi</p>
          <div className="mt-3 text-xs text-blue-300 flex items-center gap-1">
            <span>🎓</span> Google, Harvard, Dicoding, Kemdikbud
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-600/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30 hover:border-pink-500/60 transition-all hover:scale-[1.02] cursor-pointer">
          <p className="text-3xl font-bold text-white mb-2">{summary.averageRating} ★</p>
          <p className="text-gray-400 text-sm font-medium">Kepuasan Klien & Kolaborator</p>
          <div className="mt-3 text-xs text-pink-300 flex items-center gap-1">
            <span>⭐</span> Berdasarkan {summary.totalReviews} testimoni terverifikasi
          </div>
        </div>
      </div>

      {/* Real Portfolio Categories Donut Chart */}
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-white font-semibold text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Distribusi Spesialisasi & Kategori Portofolio
              <span className="text-xs font-normal text-gray-400 ml-2">{summary.totalProjects} Proyek Riil</span>
            </h4>
            <p className="text-gray-400 text-sm mt-1">Sebaran proyek berdasarkan domain teknologi & kebutuhan solusi</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
              <span>Data Riil Projek</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="relative">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(167, 139, 250, 0.3)" />
                  </filter>
                </defs>

                <Pie
                  data={platformStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    if (value > 12) {
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          className="font-bold text-xs"
                        >
                          {value}%
                        </text>
                      );
                    }
                    return null;
                  }}
                  outerRadius={95}
                  innerRadius={60}
                  paddingAngle={3}
                  cornerRadius={8}
                  dataKey="value"
                  animationDuration={1200}
                  animationBegin={200}
                  animationEasing="ease-out"
                  filter="url(#shadow)"
                >
                  {platformStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#1F2937"
                      strokeWidth={2}
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Pie>

                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-white">
                  {summary.totalProjects}
                </text>
                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-400">
                  Total Proyek
                </text>

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: data.color }} />
                            <span className="font-bold text-white">{data.name}</span>
                            <span className="ml-auto font-bold text-lg" style={{ color: data.color }}>
                              {data.value}%
                            </span>
                          </div>
                          <div className="text-sm text-gray-300">
                            <div className="flex justify-between mb-1">
                              <span>Jumlah Proyek:</span>
                              <span className="font-semibold">{data.count} Proyek</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Cakupan:</span>
                              <span className="text-xs text-gray-400">{data.desc}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-gray-300 pl-1">{value}</span>}
                  iconType="circle"
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Real Category Breakdown List */}
          <div className="space-y-3">
            {platformStats.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-800/40 hover:bg-gray-800/70 transition-colors cursor-pointer group/item border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{cat.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm">{cat.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {cat.count} Proyek
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{cat.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{cat.value}%</div>
                    <div className="text-[10px] text-gray-400">porsi</div>
                  </div>
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-transform group-hover/item:scale-125"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Real Stats */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Tech Stack Terpakai:</span>
            <span className="text-white font-medium">{summary.totalTechStack} Teknologi Modern</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Rating Klien:</span>
            <span className="text-white font-medium">{summary.averageRating} / 5.0 ({summary.totalReviews} Ulasan)</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span>Status:</span>
            <span className="text-emerald-400 font-medium">100% Data Portofolio Riil</span>
          </div>
        </div>
      </div>
    </div>
  );
});

StatsCharts.displayName = 'StatsCharts';
export default StatsCharts;
