import { MessageSquare, Sparkles, Brain, Calculator } from "lucide-react";
import { ToggleSwitch } from "../components/ToggleSwitch";

export function AISettings({ settings, handleSave }) {
  const RESPONSE_STYLES = [
    { value: '', label: 'Otomatis (Adaptif)' },
    { value: 'friendly', label: 'Santai & Ramah (Friendly)' },
    { value: 'formal', label: 'Resmi & Profesional (Formal)' },
    { value: 'concise', label: 'Ringkas & Padat (Concise)' },
    { value: 'technical', label: 'Teknis & Mendalam (Technical)' },
    { value: 'humorous', label: 'Humoris & Ceria (Humorous)' },
    { value: 'empathetic', label: 'Empatik & Solutif (Empathetic)' },
    { value: 'step-by-step', label: 'Langkah Demi Langkah (Step-by-Step)' }
  ];

  return (
    <div className="space-y-4">
      {/* Gaya Bahasa & Respon */}
      <div className="p-3 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-[var(--saipul-text-primary)] flex items-center gap-1.5">
          <MessageSquare size={15} className="text-[var(--saipul-accent)]" /> Karakter & Gaya Bahasa
        </h4>
        
        <div>
          <label className="block text-xs text-[var(--saipul-text-secondary)] mb-1">Gaya Respons Bot</label>
          <select
            value={settings.responseStyle || ''}
            onChange={(e) => handleSave('responseStyle', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
            style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
          >
            {RESPONSE_STYLES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <p className="text-xs text-[var(--saipul-text-muted)] mt-1">
            Mengatur nada bicara dan panjang penjelasan SaipulAI saat berdialog.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs text-[var(--saipul-text-secondary)] mb-1">Kecepatan Respons</label>
            <select 
              value={settings.responseSpeed || 'balanced'}
              onChange={(e) => handleSave("responseSpeed", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
              style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
            >
              <option value="fast">Cepat (Respons Instan)</option>
              <option value="balanced">Seimbang (Rekomendasi)</option>
              <option value="thorough">Mendalam (Animasi Lengkap)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--saipul-text-secondary)] mb-1 flex items-center gap-1">
              <Calculator size={12} className="text-[var(--saipul-accent)]" /> Presisi Matematika
            </label>
            <select 
              value={settings.calculationPrecision || 'high'}
              onChange={(e) => handleSave("calculationPrecision", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
              style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
            >
              <option value="low">Cepat (2 desimal)</option>
              <option value="medium">Standar (4 desimal)</option>
              <option value="high">Presisi Tinggi (6 desimal)</option>
              <option value="max">Maksimal (10 desimal)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interaktivitas Percakapan */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-[var(--saipul-accent)]" />
            <div>
              <span className="text-sm font-medium text-[var(--saipul-text-primary)]">Ingat Konteks Obrolan</span>
              <p className="text-xs text-[var(--saipul-text-secondary)]">Mengingat topik sebelumnya untuk pertanyaan lanjutan (follow-up)</p>
            </div>
          </div>
          <ToggleSwitch 
            checked={settings.memoryContext}
            onChange={(value) => handleSave("memoryContext", value)}
            id="memoryContext"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--saipul-accent)]" />
            <div>
              <span className="text-sm font-medium text-[var(--saipul-text-primary)]">Saran Pertanyaan Cepat</span>
              <p className="text-xs text-[var(--saipul-text-secondary)]">Menampilkan tombol rekomendasi topik di bawah obrolan</p>
            </div>
          </div>
          <ToggleSwitch 
            checked={settings.autoSuggestions}
            onChange={(value) => handleSave("autoSuggestions", value)}
            id="autoSuggestions"
          />
        </div>
      </div>
    </div>
  );
}
