import React from 'react';

interface AndroidNavigationBarProps {
  onBack?: () => void;
  onHome?: () => void;
  onRecents?: () => void;
  mode?: 'pill' | 'three-button';
}

export const AndroidNavigationBar: React.FC<AndroidNavigationBarProps> = ({
  onBack,
  onHome,
  onRecents,
  mode = 'pill',
}) => {
  return (
    <div className="w-full h-6 flex items-center justify-center select-none z-30 shrink-0 bg-transparent py-1">
      {mode === 'pill' ? (
        <div 
          onClick={onHome}
          className="w-32 h-1 rounded-full bg-slate-500/50 hover:bg-slate-300 transition-colors cursor-pointer active:scale-95"
          title="Android Home Gesture Bar"
        />
      ) : (
        <div className="flex items-center justify-around w-48 text-slate-500">
          <button 
            onClick={onBack}
            className="p-1 hover:text-slate-300 active:scale-90 transition-transform" 
            title="Back"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button 
            onClick={onHome}
            className="p-1 hover:text-slate-300 active:scale-90 transition-transform" 
            title="Home"
          >
            <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
          </button>
          <button 
            onClick={onRecents}
            className="p-1 hover:text-slate-300 active:scale-90 transition-transform" 
            title="Recent Apps"
          >
            <div className="w-3.5 h-3.5 rounded-sm border-2 border-current" />
          </button>
        </div>
      )}
    </div>
  );
};
