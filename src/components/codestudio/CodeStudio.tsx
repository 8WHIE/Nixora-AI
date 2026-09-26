import React, { useState } from 'react';
import {
  Code2,
  Bug,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Play,
  RotateCcw,
  Download,
  Database,
  Globe,
  Share2,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { ProgrammingLanguage, LineByLineResult, DebugResult, DsaResult } from '../../types';
import {
  SUPPORTED_LANGUAGES,
  STARTER_CODE_TEMPLATES,
  DSA_PROBLEMS_LIBRARY,
} from '../../data/tutorialsAndPresets';

interface CodeStudioProps {
  initialCode?: string;
  initialLanguage?: ProgrammingLanguage;
  onSendToSandbox?: (code: string) => void;
}

type StudioTool = 'generate' | 'explain' | 'debug' | 'dsa' | 'sql' | 'api';

export const CodeStudio: React.FC<CodeStudioProps> = ({
  initialCode,
  initialLanguage = 'kotlin',
  onSendToSandbox,
}) => {
  const [activeTool, setActiveTool] = useState<StudioTool>('generate');
  const [language, setLanguage] = useState<ProgrammingLanguage>(initialLanguage);
  const [code, setCode] = useState<string>(
    initialCode || STARTER_CODE_TEMPLATES[initialLanguage] || STARTER_CODE_TEMPLATES.kotlin
  );
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tool specific results
  const [explainResult, setExplainResult] = useState<LineByLineResult | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);
  const [dsaResult, setDsaResult] = useState<DsaResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle language switch
  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    setLanguage(newLang);
    setCode(STARTER_CODE_TEMPLATES[newLang] || `// Write ${newLang} code here`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const ext = SUPPORTED_LANGUAGES.find((l) => l.id === language)?.extension || '.txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nixora_${language}_${Date.now()}${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate Code via Gemini
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Generate pristine, production-ready ${language} code for: "${prompt}".
Please provide ONLY the code block without markdown conversational text, so it can be directly compiled.`,
            },
          ],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let generated = '';

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
                if (parsed.text) {
                  generated += parsed.text;
                }
              } catch (e) {}
            }
          }
        }
      }

      // Strip markdown code fences if model returned them
      const cleanCode = generated
        .replace(/```[a-zA-Z]*\n/g, '')
        .replace(/```/g, '')
        .trim();

      setCode(cleanCode || generated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  // Explain Line-by-Line
  const handleExplainLines = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setSelectedLine(null);

    try {
      const res = await fetch('/api/code/explain-lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      if (!res.ok) throw new Error('Explanation failed');
      const data: LineByLineResult = await res.json();
      setExplainResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to inspect lines');
    } finally {
      setLoading(false);
    }
  };

  // Debug & Fix
  const handleDebugCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/code/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          errorDescription: prompt || 'Analyze for bugs, security holes, and performance issues.',
        }),
      });

      if (!res.ok) throw new Error('Debugger error');
      const data: DebugResult = await res.json();
      setDebugResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to debug');
    } finally {
      setLoading(false);
    }
  };

  // DSA Solver
  const handleSolveDsa = async (customProblem?: string) => {
    const targetProblem = customProblem || prompt;
    if (!targetProblem.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/code/dsa-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: targetProblem,
          language,
        }),
      });

      if (!res.ok) throw new Error('DSA Solver error');
      const data: DsaResult = await res.json();
      setDsaResult(data);
      if (data.solutionCode) {
        setCode(data.solutionCode);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to solve DSA problem');
    } finally {
      setLoading(false);
    }
  };

  // Tools Tab List
  const tools: Array<{ id: StudioTool; label: string; icon: any }> = [
    { id: 'generate', label: 'Generator', icon: Sparkles },
    { id: 'explain', label: 'Line Explainer', icon: BookOpen },
    { id: 'debug', label: 'Bug Hunter', icon: Bug },
    { id: 'dsa', label: 'DSA Solver', icon: Code2 },
    { id: 'sql', label: 'SQL Query', icon: Database },
    { id: 'api', label: 'API Integrator', icon: Globe },
  ];

  return (
    <div className="flex flex-col h-full bg-[#030712] overflow-hidden text-slate-100">
      {/* Studio Tool Header Tabs */}
      <div className="px-3 py-2 border-b border-indigo-950/70 bg-slate-950/80 backdrop-blur-md flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Language selector */}
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as ProgrammingLanguage)}
          aria-label="Select Programming Language"
          className="bg-slate-900 border border-slate-800 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 outline-none font-mono cursor-pointer shrink-0"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.icon} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {/* Dynamic Action Bar based on Active Tool */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          {activeTool === 'generate' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Code Generator & Prompt
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Gemini 3.8 Flash</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder={`e.g. Write a ${language} function to encrypt payload with AES-256`}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 active:scale-95 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loading ? 'Synthesizing...' : 'Generate'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTool === 'explain' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Line-by-Line Code Inspector
                </h4>
                <p className="text-[11px] text-slate-400">
                  Inspect every logical line, time/space complexity, and edge cases.
                </p>
              </div>
              <button
                onClick={handleExplainLines}
                disabled={loading || !code.trim()}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Analyzing...' : 'Analyze Lines'}</span>
              </button>
            </div>
          )}

          {activeTool === 'debug' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-rose-400" />
                  Bug Hunter & Auto-Fixer
                </span>
                <button
                  onClick={handleDebugCode}
                  disabled={loading || !code.trim()}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loading ? 'Hunting Bugs...' : 'Fix Bugs Automatically'}</span>
                </button>
              </div>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Optional: Describe symptoms or error message (e.g. NullPointerException on line 14)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          )}

          {activeTool === 'dsa' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Coding Interview & DSA Solver
                </span>
                <button
                  onClick={() => handleSolveDsa()}
                  disabled={loading || !prompt.trim()}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loading ? 'Solving...' : 'Solve with Optimal Approach'}</span>
                </button>
              </div>

              {/* Curated DSA presets */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                {DSA_PROBLEMS_LIBRARY.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(item.problem);
                      handleSolveDsa(item.problem);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-950/70 border border-slate-800 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Or enter custom interview problem description..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          )}

          {activeTool === 'sql' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  Natural Language to SQL Architect
                </span>
                <button
                  onClick={() => {
                    setPrompt('Create an optimized PostgreSQL schema with users, orders, and telemetry partitions');
                    handleGenerate();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Generate Schema
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Find monthly active users who ordered more than $500 with window ranking"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:opacity-90"
                >
                  Build Query
                </button>
              </div>
            </div>
          )}

          {activeTool === 'api' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  REST & GraphQL API Integrator
                </span>
                <button
                  onClick={() => {
                    setPrompt('Create an API client for GitHub repository search with Bearer auth, pagination, and error types');
                    handleGenerate();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  Generate Client
                </button>
              </div>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe API integration (e.g. Stripe checkout webhook verification handler in Express)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/30 text-xs text-red-200">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Code Editor & Viewer Box */}
        <div className="rounded-2xl border border-slate-800 bg-[#070b14] overflow-hidden shadow-xl">
          {/* Editor Header */}
          <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-400">
                nixora_workspace.{SUPPORTED_LANGUAGES.find((l) => l.id === language)?.extension.replace('.', '')}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {['html', 'javascript', 'react', 'tsx'].includes(language) && onSendToSandbox && (
                <button
                  onClick={() => onSendToSandbox(code)}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-1 transition-all"
                  title="Run in Live Sandbox"
                >
                  <Play className="w-3.5 h-3.5 text-purple-400" />
                  <span>Run Preview</span>
                </button>
              )}

              <button
                onClick={() => setCode(STARTER_CODE_TEMPLATES[language] || '')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset to Template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleDownloadFile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Download Source File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCopy(code)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy to Clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Line by Line Explanation Overlay Mode */}
          {activeTool === 'explain' && explainResult && (
            <div className="p-3 bg-indigo-950/20 border-b border-indigo-950/60">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-cyan-300">Analysis Overview</span>
                <span className="font-mono text-[11px] text-slate-400">
                  Time: {explainResult.timeComplexity} · Space: {explainResult.spaceComplexity}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">{explainResult.overview}</p>
              <div className="text-[11px] text-cyan-400/90 font-mono">
                💡 Tip: Click on any numbered line below to inspect its purpose.
              </div>
            </div>
          )}

          {/* Editor Textarea with Interactive Lines */}
          <div className="relative flex min-h-[340px] max-h-[500px] overflow-auto font-mono text-xs">
            {activeTool === 'explain' && explainResult ? (
              <div className="w-full divide-y divide-slate-900 bg-[#030712]">
                {explainResult.lines.map((item) => {
                  const isSelected = selectedLine === item.lineNumber;
                  return (
                    <div
                      key={item.lineNumber}
                      onClick={() => setSelectedLine(isSelected ? null : item.lineNumber)}
                      className={`flex flex-col p-2 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-950/60 border-l-4 border-cyan-400'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 text-right text-slate-600 select-none">
                          {item.lineNumber}
                        </span>
                        <code className="text-slate-100 flex-1 overflow-x-auto">{item.code}</code>
                        {item.importance === 'high' && (
                          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                            Core
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <div className="mt-2 ml-10 p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-200">
                          <p className="leading-relaxed">💬 {item.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full p-4 bg-[#030712] text-slate-200 font-mono text-xs leading-relaxed outline-none resize-none"
              />
            )}
          </div>
        </div>

        {/* Bug Hunter Result Card */}
        {activeTool === 'debug' && debugResult && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-950/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Analysis & Bug Fix</span>
              </div>
              <span className="text-xs font-mono text-rose-400 bg-rose-950/40 border border-rose-500/20 px-2 py-0.5 rounded-full">
                {debugResult.bugType}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{debugResult.explanation}</p>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Diff & Changes Made:
              </span>
              <ul className="space-y-1">
                {debugResult.diffSummary.map((diff, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-cyan-200">
              💡 <strong>Performance Tip:</strong> {debugResult.performanceTip}
            </div>

            <button
              onClick={() => setCode(debugResult.fixedCode)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-md hover:opacity-95"
            >
              Apply Corrected Code to Workspace
            </button>
          </div>
        )}

        {/* DSA Solver Result Card */}
        {activeTool === 'dsa' && dsaResult && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-950/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="text-sm font-bold text-white">{dsaResult.title}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="font-mono text-cyan-400">Time: {dsaResult.timeComplexity}</span>
                  <span>·</span>
                  <span className="font-mono text-purple-400">Space: {dsaResult.spaceComplexity}</span>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold ${
                  dsaResult.difficulty === 'Easy'
                    ? 'text-emerald-400 bg-emerald-950/50'
                    : dsaResult.difficulty === 'Medium'
                    ? 'text-amber-400 bg-amber-950/50'
                    : 'text-rose-400 bg-rose-950/50'
                }`}
              >
                {dsaResult.difficulty}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Intuition & Strategy:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{dsaResult.intuition}</p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Test Cases:
              </span>
              <div className="space-y-1.5">
                {dsaResult.testCases.map((tc, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">Input: </span>
                    <span className="text-cyan-300">{tc.input}</span>
                    <span className="text-slate-400"> → Expected: </span>
                    <span className="text-emerald-300">{tc.expectedOutput}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
