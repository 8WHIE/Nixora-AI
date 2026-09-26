import React, { useState } from 'react';
import { X, User, Award, Zap, Code, Shield, Check } from 'lucide-react';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      role,
      isGuest: false,
    });
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onClose();
    }, 800);
  };

  const badges = [
    { name: 'Android APK Architect', icon: '🤖', desc: 'Ready for Native Android APK compile' },
    { name: 'Gemini 3.8 Flash Explorer', icon: '⚡', desc: 'High-speed neural coding active' },
    { name: 'DSA Grandmaster', icon: '🧠', desc: 'FAANG algorithm problems solved' },
    { name: 'Clean Architecture Pro', icon: '🛡️', desc: 'Adheres to production design standards' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#070b14] border border-indigo-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Developer Identity</h3>
              <p className="text-[11px] text-slate-400">Nixora Workspace Profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* User Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-xl font-black text-white shadow-lg">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                {name}
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  {user.isGuest ? 'Guest' : 'Authenticated'}
                </span>
              </h4>
              <p className="text-xs text-slate-400">{role}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Engineering Productivity Stats
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400">Queries Dispatched</span>
                <div className="text-lg font-bold text-cyan-400 font-mono">
                  {user.stats.promptsCount}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400">Code Snippets</span>
                <div className="text-lg font-bold text-purple-400 font-mono">
                  {user.stats.codeSnippetsCount}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400">APKs Exported</span>
                <div className="text-lg font-bold text-indigo-400 font-mono">
                  {user.stats.projectsExported}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400">Coding Streak</span>
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  {user.stats.streakDays} Days 🔥
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Developer Badges
            </span>
            <div className="grid grid-cols-2 gap-2">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left flex items-start gap-2"
                >
                  <span className="text-base">{b.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{b.name}</span>
                    <span className="text-[10px] text-slate-400 leading-tight block">{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Engineering Specialty</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-1.5"
            >
              {isSavedToast ? <Check className="w-4 h-4 text-emerald-300" /> : null}
              <span>{isSavedToast ? 'Profile Updated!' : 'Save Profile'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
