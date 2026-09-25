import React from 'react';
import { MessageSquareCode, Terminal, Layout, Package, Settings2 } from 'lucide-react';
import { NavigationTab } from '../../types';

interface BottomNavProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = [
    {
      id: 'chat',
      label: 'AI Chat',
      icon: MessageSquareCode,
      accentColor: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'codestudio',
      label: 'Code Studio',
      icon: Terminal,
      accentColor: 'from-indigo-500 to-purple-600',
    },
    {
      id: 'sandbox',
      label: 'Sandbox UI',
      icon: Layout,
      accentColor: 'from-purple-500 to-pink-600',
    },
    {
      id: 'apkhub',
      label: 'APK Hub',
      icon: Package,
      accentColor: 'from-cyan-400 to-indigo-500',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings2,
      accentColor: 'from-slate-400 to-slate-200',
    },
  ];

  return (
    <nav className="w-full px-2 py-1.5 border-t border-indigo-950/70 bg-slate-950/90 backdrop-blur-xl z-20 shrink-0">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active glow pill */}
              {isActive && (
                <div className="absolute inset-0 bg-indigo-950/60 border border-indigo-500/30 rounded-xl -z-10 shadow-sm shadow-indigo-500/20" />
              )}

              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'
                  }`}
                />
                {tab.id === 'apkhub' && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? 'text-cyan-300 font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
