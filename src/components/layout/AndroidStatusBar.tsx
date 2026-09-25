import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Sparkles } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-8 px-6 flex items-center justify-between text-xs font-semibold text-slate-300 select-none z-30 shrink-0 bg-transparent">
      {/* Left side: Time & Notification Icon */}
      <div className="flex items-center gap-2">
        <span className="tracking-tight text-white">{time}</span>
        <div className="flex items-center gap-1 text-[10px] text-cyan-400">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400/80">Nexora 5G</span>
        </div>
      </div>

      {/* Center: Punch Hole Camera cutout */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/90 ring-1 ring-slate-800/80 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-950/70" />
      </div>

      {/* Right side: Wi-Fi, Signal & Battery */}
      <div className="flex items-center gap-2 text-slate-400">
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-0.5 text-[10px] text-slate-300">
          <span className="font-mono font-medium">98%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
