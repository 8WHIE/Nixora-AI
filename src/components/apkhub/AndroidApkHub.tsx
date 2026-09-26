import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  FolderTree,
  FileCode,
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../../data/androidProjectTemplate';
import { ProjectFile } from '../../types';

export const AndroidApkHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipSuccessToast, setZipSuccessToast] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();

      // Add all project files into zip archive
      ANDROID_PROJECT_FILES.forEach((f) => {
        zip.file(f.path, f.content);
      });

      // Generate blob
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'NixoraAI-Android-Project.zip';
      link.click();
      URL.revokeObjectURL(url);

      setZipSuccessToast(true);
      setTimeout(() => setZipSuccessToast(false), 4000);
    } catch (err) {
      console.error('ZIP export error:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] overflow-hidden text-slate-100">
      {/* Header Banner */}
      <div className="p-4 border-b border-indigo-950/70 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-5xl mx-auto">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Android APK Build Hub
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Ready to Compile
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Complete native Kotlin Jetpack Compose & Gradle project structure configured for immediate APK compilation.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              {downloadingZip ? (
                <Sparkles className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{downloadingZip ? 'Packaging Zip...' : 'Download Project (.ZIP)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Zip Toast */}
      {zipSuccessToast && (
        <div className="mx-4 mt-2 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between z-30 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>NixoraAI-Android-Project.zip</strong> exported successfully! Extract and open in Android Studio to build APK.
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">./gradlew assembleDebug</span>
        </div>
      )}

      {/* Main Dual-Column: File Tree Explorer & File Viewer */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
        {/* Left: Project File Tree (4 cols) */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col bg-slate-950/70 overflow-hidden">
          <div className="px-3 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5 text-slate-200">
              <FolderTree className="w-3.5 h-3.5 text-cyan-400" /> Project Structure
            </span>
            <span className="text-[10px] font-mono text-slate-500">{ANDROID_PROJECT_FILES.length} Files</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-indigo-950/80 text-cyan-300 font-semibold border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <FileCode
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  />
                  <div className="truncate flex-1">
                    <div className="truncate font-mono text-[11px]">{file.path}</div>
                    <div className="text-[9px] text-slate-500 truncate">{file.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick APK Terminal Build Reference */}
          <div className="p-3 border-t border-slate-800 bg-[#070b14] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 font-mono">
              <Terminal className="w-3 h-3 text-cyan-400" /> CLI Command to Build APK:
            </span>
            <div className="p-2 rounded-lg bg-black border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
              <code>./gradlew assembleDebug</code>
              <button
                onClick={() => handleCopy('./gradlew assembleDebug')}
                className="text-slate-500 hover:text-white"
                title="Copy Command"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500">
              Outputs APK at: <code className="text-slate-400">app/build/outputs/apk/debug/app-debug.apk</code>
            </p>
          </div>
        </div>

        {/* Right: File Content Viewer (8 cols) */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col bg-[#030712] overflow-hidden">
          {/* File Header */}
          <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-200">{selectedFile.path}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                {selectedFile.language}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(selectedFile.content)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-colors"
                title="Copy File Content"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Description banner */}
          <div className="px-4 py-1.5 bg-slate-950/60 border-b border-slate-800/60 text-[11px] text-slate-400">
            ℹ️ {selectedFile.description}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 overflow-auto p-4 bg-[#030712] font-mono text-xs text-slate-200 leading-relaxed">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
