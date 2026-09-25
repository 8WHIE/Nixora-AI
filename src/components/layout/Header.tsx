import React from 'react';
import { Smartphone, Monitor, Tablet, User, Plus, Cpu } from 'lucide-react';
import { ViewMode, UserProfile } from '../../types';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenProfile: () => void;
  onNewChat: () => void;
  activeModelName: string;
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenProfile,
  onNewChat,
  activeModelName,
  user,
}) => {
  return (
    <header className="px-4 py-2.5 flex items-center justify-between border-b border-indigo-950/60 bg-slate-950/80 backdrop-blur-xl z-20 shrink-0">
      {/* Brand & AI Avatar */}
      <div className="flex items-center gap-2.5">
        <div className="relative group cursor-pointer" onClick={onNewChat} title="New Chat">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-neon-cyan/40">
            <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 animate-pulse-slow" />
              {/* Futuristic hexagonal Nexora AI Core */}
              <svg className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="url(#cyan-grad)" />
                <path d="M2 17l10 5 10-5" stroke="url(#purple-grad)" />
                <path d="M2 12l10 5 10-5" stroke="#818cf8" />
                <defs>
                  <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                  <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1">
              Nexora<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">AI</span>
            </h1>
            <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/40 border border-cyan-500/20 px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 tracking-tight flex items-center gap-1 font-mono">
            <Cpu className="w-2.5 h-2.5 text-indigo-400" />
            <span className="truncate max-w-[120px]">{activeModelName}</span>
          </p>
        </div>
      </div>

      {/* Center / Right Controls: Viewport Mode Switcher & User Profile */}
      <div className="flex items-center gap-1.5">
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="p-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 text-slate-300 hover:text-white border border-indigo-500/20 transition-all text-xs flex items-center gap-1"
          title="Start fresh conversation"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline text-[11px] font-medium">New</span>
        </button>

        {/* View Mode Toggle (Phone / Full / Tablet) */}
        <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-slate-400">
          <button
            onClick={() => onViewModeChange('phone')}
            className={`p-1 rounded-md transition-all ${viewMode === 'phone' ? 'bg-indigo-600/40 text-cyan-300 shadow-sm' : 'hover:text-slate-200'}`}
            title="Android Phone Mockup View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('tablet')}
            className={`p-1 rounded-md transition-all ${viewMode === 'tablet' ? 'bg-indigo-600/40 text-cyan-300 shadow-sm' : 'hover:text-slate-200'}`}
            title="Tablet / Foldable View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('full')}
            className={`p-1 rounded-md transition-all ${viewMode === 'full' ? 'bg-indigo-600/40 text-cyan-300 shadow-sm' : 'hover:text-slate-200'}`}
            title="Full Display View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
            {user.avatar || <User className="w-3 h-3 text-white" />}
          </div>
          <span className="text-[11px] text-slate-300 font-medium hidden xs:inline max-w-[70px] truncate">
            {user.name}
          </span>
        </button>
      </div>
    </header>
  );
};
