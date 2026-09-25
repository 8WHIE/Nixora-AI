import React from 'react';
import { QUICK_PROMPTS } from '../../data/tutorialsAndPresets';

interface PromptSuggestionsProps {
  onSelectPrompt: (promptText: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="w-full py-2">
      <div className="flex items-center gap-1.5 mb-2 px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <span>Suggested Prompts</span>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {QUICK_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-white transition-all text-left group active:scale-95"
          >
            <span className="text-sm">{item.icon}</span>
            <span className="truncate max-w-[200px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
