/**
 * DEMO PAGE - Multi Loading Animations
 * Komponen ini menampilkan semua tipe loading animation
 * 
 * Gunakan untuk preview dan testing
 */

import React, { useState } from 'react';
import {
  Thinking,
  WaveAnimation,
  PhotoProcessingAnimation,
  VideoProcessingAnimation,
  PulseAnimation,
  ShimmerAnimation,
  OrbitAnimation,
  BouncingAnimation,
  SpotlightAnimation,
  DNAAnimation,
} from './LoadingAnimations';

export function LoadingAnimationsDemo() {
  const [selectedAnimation, setSelectedAnimation] = useState('thinking');

  const animations = [
    { name: 'thinking', label: 'Thinking', component: Thinking },
    { name: 'wave', label: 'Wave', component: WaveAnimation },
    { name: 'photo', label: 'Photo Processing', component: PhotoProcessingAnimation },
    { name: 'video', label: 'Video Processing', component: VideoProcessingAnimation },
    { name: 'pulse', label: 'Pulse', component: PulseAnimation },
    { name: 'shimmer', label: 'Shimmer', component: ShimmerAnimation },
    { name: 'orbit', label: 'Orbit', component: OrbitAnimation },
    { name: 'bouncing', label: 'Bouncing', component: BouncingAnimation },
    { name: 'spotlight', label: 'Spotlight', component: SpotlightAnimation },
    { name: 'dna', label: 'DNA', component: DNAAnimation },
  ];

  const selectedAnim = animations.find(a => a.name === selectedAnimation);
  const Component = selectedAnim?.component;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Multi Loading Animations Demo</h1>
          <p className="text-gray-400">Klik pada animasi untuk preview</p>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8 flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            {Component && <Component />}
            <p className="text-gray-400 text-sm mt-4">{selectedAnim?.label}</p>
          </div>
        </div>

        {/* Animation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {animations.map((anim) => (
            <button
              key={anim.name}
              onClick={() => setSelectedAnimation(anim.name)}
              className={`p-4 rounded-lg transition-all ${
                selectedAnimation === anim.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center mb-2 h-8">
                <anim.component />
              </div>
              <p className="text-sm">{anim.label}</p>
            </button>
          ))}
        </div>

        {/* Documentation */}
        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Dokumentasi</h2>
          
          <div className="space-y-6 text-gray-300">
            <div>
              <h3 className="font-bold text-white mb-2">Cara Menggunakan</h3>
              <p className="text-sm">
                Animasi loading dapat digunakan dengan mengimpor komponen dari <code className="bg-gray-900 px-2 py-1 rounded text-yellow-400">LoadingAnimations.jsx</code> dan menggunakannya dalam message metadata:
              </p>
              <pre className="bg-gray-900 p-4 rounded mt-2 text-sm overflow-x-auto">
{`const message = {
  type: 'typing',
  _meta: {
    expectedText: 'Response sedang diproses...',
    loadingAnimation: 'photo',
    loadingVariants: ['Menganalisis...', 'Memproses...']
  }
};`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">Tipe Animasi</h3>
              <ul className="text-sm space-y-2">
                <li><strong>thinking</strong> - Default, tiga dot yang bergerak</li>
                <li><strong>wave</strong> - Lima bar seperti audio waveform</li>
                <li><strong>photo</strong> - Untuk proses gambar/foto</li>
                <li><strong>video</strong> - Untuk proses video</li>
                <li><strong>pulse</strong> - Smooth breathing effect</li>
                <li><strong>shimmer</strong> - Gradient shimmer loading</li>
                <li><strong>orbit</strong> - Circular motion</li>
                <li><strong>bouncing</strong> - Bars yang melompat</li>
                <li><strong>spotlight</strong> - Scanning effect</li>
                <li><strong>dna</strong> - DNA helix style</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">Mode Random</h3>
              <p className="text-sm">
                Untuk menggunakan animasi random, set <code className="bg-gray-900 px-2 py-1 rounded text-yellow-400">loadingAnimation: 'random'</code>. 
                Animasi akan dipilih secara random setiap kali ada pesan baru.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">Customization</h3>
              <p className="text-sm">
                Ubah warna animasi dengan CSS variable <code className="bg-gray-900 px-2 py-1 rounded text-yellow-400">--saipul-accent</code>. 
                Ubah durasi dengan mengubah nilai <code className="bg-gray-900 px-2 py-1 rounded text-yellow-400">duration</code> di LoadingAnimations.jsx.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-900 rounded-lg p-4">
            <h3 className="font-bold mb-2">✅ Fitur</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 10 animasi berbeda</li>
              <li>• Mode random otomatis</li>
              <li>• Context-aware selection</li>
              <li>• Fully customizable</li>
            </ul>
          </div>
          <div className="bg-green-900 rounded-lg p-4">
            <h3 className="font-bold mb-2">🚀 Performance</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 60fps smooth animation</li>
              <li>• Lightweight CSS-based</li>
              <li>• Mobile optimized</li>
              <li>• No external dependencies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingAnimationsDemo;
