import React from 'react';
import {
  X,
  Cpu,
  Sliders,
  Volume2,
  Palette,
  ShieldCheck,
  Sparkles,
  Check,
} from 'lucide-react';
import { AppSettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const models = [
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 3.8 Flash',
      badge: 'Recommended',
      speed: 'Super Fast (~150ms)',
      desc: 'State-of-the-art coding and reasoning with instant streaming.',
    },
    {
      id: 'gemini-3.1-pro-preview',
      name: 'Gemini 3.1 Pro Preview',
      badge: 'Deep Reasoning',
      speed: 'High Precision',
      desc: 'Advanced architectural reasoning, math, and deep code refactoring.',
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash Lite',
      badge: 'Ultra Fast',
      speed: 'Sub-100ms',
      desc: 'Lightweight and ultra-low latency for quick snippets.',
    },
  ];

  const personas = [
    { id: 'architect', label: 'Senior System Architect' },
    { id: 'android', label: 'Android Jetpack & Kotlin Master' },
    { id: 'dsa', label: 'FAANG Interview & DSA Coach' },
    { id: 'fullstack', label: 'Full-Stack Web & Cloud Dev' },
    { id: 'debugger', label: 'Relentless Bug Hunter' },
  ];

  const themes = [
    { id: 'futuristic-dark', label: 'Futuristic Indigo & Cyan' },
    { id: 'deep-oled', label: 'Deep OLED (Pure Midnight)' },
    { id: 'cyber-neon', label: 'Cyber Neon Purple' },
  ];

  const languages = [
    { code: 'en', name: 'English (US)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'zh', name: '中文 (Chinese)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#070b14] border border-indigo-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nexora AI Engine Settings</h3>
              <p className="text-[11px] text-slate-400">Intelligence Without Limits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: AI Model Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Active Gemini AI Model
            </label>

            <div className="space-y-2">
              {models.map((m) => {
                const isSelected = settings.model === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => onUpdateSettings({ model: m.id })}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/60 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{m.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                          {m.badge}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{m.desc}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">Speed: {m.speed}</span>
                  </div>
                );
              })}
            </div>

            {/* Cloud Security Indicator */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Backend Server Engine is active. API key is securely managed on the server.
              </span>
            </div>
          </div>

          {/* Section 2: Temperature & Creativity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Temperature (Creativity)
              </label>
              <span className="font-mono text-cyan-400 font-bold">{settings.temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.1 (Precise Code)</span>
              <span>0.7 (Balanced)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Section 3: AI Persona Preset */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Specialization Persona
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {personas.map((p) => {
                const isSelected = settings.persona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onUpdateSettings({ persona: p.id as any })}
                    className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-indigo-900/60 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Voice & Speech Synthesis */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              Voice-to-Text & Speech Responses
            </label>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">Auto-read Responses (TTS)</span>
                <span className="text-[11px] text-slate-400">Speak AI responses aloud automatically</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSpeakResponse}
                onChange={(e) => onUpdateSettings({ autoSpeakResponse: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Speech Speed ({settings.speechRate}x)</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={settings.speechRate}
                  onChange={(e) => onUpdateSettings({ speechRate: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Pitch ({settings.speechPitch}x)</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={settings.speechPitch}
                  onChange={(e) => onUpdateSettings({ speechPitch: parseFloat(e.target.value) })}
                  className="w-full accent-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Language & UI Theme */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              Language & Aesthetics
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => onUpdateSettings({ language: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl p-2 outline-none"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Dark Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => onUpdateSettings({ theme: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl p-2 outline-none"
                >
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-md hover:opacity-95"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
