import { useState, useEffect } from "react";
import { Volume2, Palette, User } from "lucide-react";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { THEMES, ACCENTS, LANGUAGES, VOICE_DEFAULTS } from '../settingsConfig';

export function GeneralSettings({ settings, handleSave }) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined" || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices() || [];
        setVoices(v.map(voice => ({ name: voice.name, lang: voice.lang })));
      } catch (e) {
        void e;
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      try {
        window.speechSynthesis.onvoiceschanged = null;
      } catch (_e) {
        void _e;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Profil Singkat Pengguna */}
      <div className="p-3 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg">
        <h4 className="text-sm font-medium text-[var(--saipul-text-primary)] mb-2 flex items-center gap-1.5">
          <User size={15} className="text-[var(--saipul-accent)]" /> Profil Pengguna
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            aria-label="Nama pengguna"
            placeholder="Nama Panggilan (opsional)"
            value={settings.profile?.name || ''}
            onChange={(e) => {
              const v = e.target.value;
              handleSave("profile", { ...settings.profile, name: v });
            }}
            className="w-full bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg px-3 py-2 text-[var(--saipul-text-primary)] text-sm focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
          />
          <input
            aria-label="Kota / Lokasi"
            placeholder="Kota / Lokasi (opsional)"
            value={settings.profile?.location || ''}
            onChange={(e) => {
              const v = e.target.value;
              try { 
                window.dispatchEvent(new CustomEvent('saipul_profile_updated', { detail: { location: v } })); 
              } catch (_e) { 
                void _e; 
              }
            }}
            className="w-full bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg px-3 py-2 text-[var(--saipul-text-primary)] text-sm focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
          />
        </div>
      </div>

      {/* Tema & Warna Tampilan */}
      <div className="p-3 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-[var(--saipul-text-primary)] flex items-center gap-1.5">
          <Palette size={15} className="text-[var(--saipul-accent)]" /> Tema & Tampilan
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[var(--saipul-text-secondary)] mb-1">Tema Warna</label>
            <select 
              value={settings.theme}
              onChange={(e) => handleSave("theme", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
              style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
            >
              {THEMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--saipul-text-secondary)] mb-1">Warna Aksen</label>
            <select 
              value={settings.accent}
              onChange={(e) => handleSave("accent", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
              style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
            >
              {ACCENTS.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--saipul-text-secondary)] mb-1">Bahasa Respons</label>
          <select 
            value={settings.language}
            onChange={(e) => handleSave("language", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
            style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
          >
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
      </div>

      {/* Output Suara / Text-to-Speech */}
      <div className="p-3 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-[var(--saipul-accent)]" />
            <div>
              <span className="text-sm font-medium text-[var(--saipul-text-primary)]">Respon Suara (Text-to-Speech)</span>
              <p className="text-xs text-[var(--saipul-text-secondary)]">Bacakan pesan bot dengan suara browser</p>
            </div>
          </div>
          <ToggleSwitch 
            checked={settings.voiceResponse}
            onChange={(value) => handleSave("voiceResponse", value)}
            id="voiceResponse"
          />
        </div>

        {settings.voiceResponse && (
          <div className="pt-3 border-t border-[var(--saipul-border)] space-y-3">
            <div>
              <label className="block text-xs text-[var(--saipul-text-secondary)] mb-1">Bahasa Suara</label>
              <select
                value={settings.voiceLanguage || VOICE_DEFAULTS.language}
                onChange={(e) => handleSave('voiceLanguage', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
              >
                <option value="auto">Auto (Deteksi Otomatis)</option>
                <option value="id">Bahasa Indonesia (id-ID)</option>
                <option value="en">English (en-US)</option>
              </select>
            </div>

            {voices.length > 0 && (
              <div>
                <label className="block text-xs text-[var(--saipul-text-secondary)] mb-1">Pilihan Suara Browser</label>
                <select
                  value={settings.voiceName || ''}
                  onChange={(e) => handleSave('voiceName', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
                >
                  <option value="">Default Suara Browser</option>
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs text-[var(--saipul-text-secondary)] mb-1">
                  <span>Kecepatan</span>
                  <span className="font-mono">{settings.voiceRate ?? VOICE_DEFAULTS.rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={settings.voiceRate ?? VOICE_DEFAULTS.rate}
                  onChange={(e) => handleSave('voiceRate', parseFloat(e.target.value))}
                  className="w-full accent-[var(--saipul-accent)]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--saipul-text-secondary)] mb-1">
                  <span>Nada (Pitch)</span>
                  <span className="font-mono">{settings.voicePitch ?? VOICE_DEFAULTS.pitch}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={settings.voicePitch ?? VOICE_DEFAULTS.pitch}
                  onChange={(e) => handleSave('voicePitch', parseFloat(e.target.value))}
                  className="w-full accent-[var(--saipul-accent)]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
