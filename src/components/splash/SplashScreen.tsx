import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadingOut(true);
            setTimeout(onFinish, 400);
          }, 300);
          return 100;
        }
        return prev + 8;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(onFinish, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#030712] transition-opacity duration-400 select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Top Bar with Skip */}
      <div className="w-full flex justify-end z-10">
        <button
          onClick={handleSkip}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 flex items-center gap-1 transition-all active:scale-95"
        >
          <span>Enter</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Center Brand & Glowing Logo */}
      <div className="flex flex-col items-center text-center my-auto z-10">
        <div className="relative mb-6">
          {/* Outer glowing particle ring */}
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-1 shadow-neon-purple animate-pulse-slow">
            <div className="w-full h-full bg-[#030712] rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/30" />
              
              {/* Nixora Geometric Neural Hexagon */}
              <svg className="w-14 h-14 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#38bdf8" />
                <path d="M2 17l10 5 10-5" stroke="#a855f7" />
                <path d="M2 12l10 5 10-5" stroke="#818cf8" />
              </svg>
            </div>
          </div>

          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-slate-950 border border-indigo-500/40 shadow-sm shadow-cyan-500/50">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
          Nixora <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">AI</span>
        </h1>

        <p className="text-sm font-medium tracking-wide text-slate-300 uppercase">
          Intelligence Without Limits
        </p>

        <p className="text-xs text-slate-500 mt-2 max-w-xs">
          Advanced Coding, Android APK Engineering & Productivity Assistant
        </p>
      </div>

      {/* Bottom Loading Progress Indicator */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 z-10">
        <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>INITIALIZING CORE</span>
          <span className="text-cyan-400 font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
