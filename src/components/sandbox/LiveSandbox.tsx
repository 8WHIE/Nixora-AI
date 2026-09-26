import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Smartphone,
  Monitor,
  Sparkles,
  Code,
  Layers,
  Check,
  Copy,
  Eye,
} from 'lucide-react';

interface LiveSandboxProps {
  initialCode?: string;
  onExportToAndroidProject?: (code: string) => void;
}

export const LiveSandbox: React.FC<LiveSandboxProps> = ({
  initialCode,
  onExportToAndroidProject,
}) => {
  const [activeMode, setActiveMode] = useState<'web' | 'android'>('web');
  const [previewViewport, setPreviewViewport] = useState<'mobile' | 'desktop'>('mobile');

  // Web sandbox code
  const [webCode, setWebCode] = useState<string>(() => {
    return (
      initialCode ||
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #030712; color: #f8fafc; font-family: system-ui, sans-serif; }
  </style>
</head>
<body class="p-6 flex flex-col items-center justify-center min-h-screen">
  <div class="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-2xl text-center">
    <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg mb-4">
      <span class="text-xl">⚡</span>
    </div>
    <h1 class="text-2xl font-bold text-white mb-1">Nixora Cyber Node</h1>
    <p class="text-xs text-cyan-400 font-mono mb-4">ONLINE · LATENCY 12ms · PROTOCOL V2</p>
    <p class="text-xs text-slate-400 mb-6">Interactive live web sandbox powered by Nixora AI. Modify HTML/CSS or generate fresh designs from prompts.</p>
    
    <div class="space-y-3">
      <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <span class="text-slate-400">Security Shield</span>
        <span class="text-emerald-400 font-semibold font-mono">ACTIVE</span>
      </div>
      <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <span class="text-slate-400">Throughput</span>
        <span class="text-cyan-400 font-semibold font-mono">1.42 GB/s</span>
      </div>
    </div>

    <button onclick="triggerImpulse()" class="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all">
      Trigger Synaptic Pulse
    </button>
  </div>

  <script>
    function triggerImpulse() {
      alert('Synaptic impulse dispatched across the Nixora edge grid!');
    }
  </script>
</body>
</html>`
    );
  });

  // Android Compose simulated state
  const [androidCounter, setAndroidCounter] = useState(42);
  const [androidDarkMode, setAndroidDarkMode] = useState(true);
  const [androidNotification, setAndroidNotification] = useState<string | null>(null);

  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate web design from prompt
  const handleGenerateWebsite = async (overridePrompt?: string) => {
    const p = overridePrompt || promptInput;
    if (!p.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Create a complete, single-file HTML/CSS/Tailwind website for: "${p}".
Include full styling, responsive layout, modern dark theme, and interactive JavaScript.
Return ONLY valid HTML inside \`\`\`html without extra conversational fluff so it can render directly.`,
            },
          ],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let htmlOutput = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const payload = line.slice(6).trim();
              if (payload === '[DONE]') break;
              try {
                const parsed = JSON.parse(payload);
                if (parsed.text) htmlOutput += parsed.text;
              } catch (e) {}
            }
          }
        }
      }

      // Extract code block
      const cleanHtml = htmlOutput
        .replace(/```html\n?/g, '')
        .replace(/```/g, '')
        .trim();

      if (cleanHtml) {
        setWebCode(cleanHtml);
      }
    } catch (err) {
      console.error('Website gen error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] overflow-hidden text-slate-100">
      {/* Top Bar Switcher: Web Sandbox vs Android UI Simulator */}
      <div className="px-4 py-2 border-b border-indigo-950/70 bg-slate-950/80 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveMode('web')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeMode === 'web'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GlobeIcon className="w-3.5 h-3.5" />
            <span>Live Web Sandbox</span>
          </button>
          <button
            onClick={() => setActiveMode('android')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeMode === 'android'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android Jetpack Compose UI</span>
          </button>
        </div>

        {/* Viewport switch for web */}
        {activeMode === 'web' && (
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setPreviewViewport('mobile')}
              className={`p-1 rounded-md text-xs transition-colors ${
                previewViewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
              title="Mobile Device (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewViewport('desktop')}
              className={`p-1 rounded-md text-xs transition-colors ${
                previewViewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
              title="Desktop Full Screen"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Sandbox Content */}
      {activeMode === 'web' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Prompt Generator Bar */}
          <div className="p-3 border-b border-indigo-950/40 bg-slate-950/60 flex flex-col sm:flex-row gap-2 shrink-0">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateWebsite()}
                placeholder="Describe website to build (e.g. Modern crypto portfolio with live charts & neon cards)"
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none"
              />
              <button
                onClick={() => handleGenerateWebsite()}
                disabled={isGenerating || !promptInput.trim()}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Synthesizing...' : 'Build Website'}</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleGenerateWebsite('Futuristic AI Developer SaaS Landing Page with pricing cards')}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 whitespace-nowrap border border-slate-800"
              >
                SaaS Landing
              </button>
              <button
                onClick={() => handleGenerateWebsite('Cyberpunk audio synthesizer control panel with sliders & dials')}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 whitespace-nowrap border border-slate-800"
              >
                Audio Deck
              </button>
            </div>
          </div>

          {/* Dual Panel: Code View (collapsible/toggleable) & Live IFrame Preview */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-hidden">
            {/* HTML Source Code Editor */}
            <div className="flex flex-col h-full bg-[#030712] overflow-hidden">
              <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono flex items-center gap-1.5 text-cyan-400">
                  <Code className="w-3.5 h-3.5" /> index.html (Live Editable)
                </span>
                <button
                  onClick={() => handleCopy(webCode)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  title="Copy HTML"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <textarea
                value={webCode}
                onChange={(e) => setWebCode(e.target.value)}
                spellCheck={false}
                className="flex-1 p-3 bg-transparent text-slate-200 font-mono text-xs leading-relaxed outline-none resize-none overflow-auto"
              />
            </div>

            {/* Live Interactive IFrame Preview */}
            <div className="flex flex-col h-full bg-slate-950 items-center justify-center p-2 sm:p-4 overflow-hidden relative">
              <div className="w-full flex items-center justify-between pb-2 text-xs text-slate-400 shrink-0">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Eye className="w-3.5 h-3.5 text-purple-400" /> Sandboxed Execution Preview
                </span>
                <button
                  onClick={() => setWebCode((prev) => prev + ' ')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  title="Refresh Sandbox"
                >
                  <RotateCcw className="w-3 h-3" /> Reload
                </button>
              </div>

              <div
                className={`transition-all duration-300 h-full flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${
                  previewViewport === 'mobile'
                    ? 'w-[360px] max-w-full rounded-[32px] ring-8 ring-slate-900'
                    : 'w-full'
                }`}
              >
                <iframe
                  title="Nixora Web Sandbox"
                  srcDoc={webCode}
                  sandbox="allow-scripts allow-modals"
                  className="w-full h-full bg-[#030712] border-0"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Android Jetpack Compose UI Simulator */
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          <div className="w-full max-w-md p-4 rounded-3xl bg-slate-900/90 border border-indigo-950 shadow-2xl">
            {/* Simulated Android Screen Frame */}
            <div className="rounded-[28px] overflow-hidden bg-[#030712] border border-slate-800 shadow-inner p-4 space-y-4">
              {/* Android Top App Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    N
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Nixora Native</h3>
                    <p className="text-[10px] text-cyan-400 font-mono">Jetpack Compose M3</p>
                  </div>
                </div>
                <button
                  onClick={() => setAndroidDarkMode(!androidDarkMode)}
                  className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 font-mono"
                >
                  {androidDarkMode ? '🌙 Dark' : '☀️ Light'}
                </button>
              </div>

              {/* Metric Card Component */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/20">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  Reactive StateFlow Counter
                </span>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 my-2">
                  {androidCounter}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setAndroidCounter((c) => c + 1);
                      setAndroidNotification('State updated: Recomposition triggered!');
                      setTimeout(() => setAndroidNotification(null), 2500);
                    }}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-semibold active:scale-95 shadow-md shadow-cyan-500/20"
                  >
                    Increment (State)
                  </button>
                  <button
                    onClick={() => setAndroidCounter(0)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Notification Toast */}
              {androidNotification && (
                <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>{androidNotification}</span>
                </div>
              )}

              {/* Live Kotlin Jetpack Compose Code Snippet */}
              <div className="p-3 rounded-xl bg-[#090d16] border border-slate-800 text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Kotlin Source:
                </span>
                <pre className="text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`@Composable
fun CounterCard(count: Int, onIncrement: () -> Unit) {
    Card(shape = RoundedCornerShape(16.dp)) {
        Text("Count: $count", style = MaterialTheme.typography.headlineMedium)
        Button(onClick = onIncrement) { Text("Increment") }
    }
}`}
                </pre>
              </div>
            </div>

            {/* Export button */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">Ready for APK Build</span>
              <button
                onClick={() => onExportToAndroidProject?.('counter')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Export to Android Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
