import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX, Share2, Terminal, Play, Sparkles } from 'lucide-react';
import { ChatMessage } from '../../types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSendToStudio?: (code: string, language: string) => void;
  onSendToSandbox?: (code: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSendToStudio,
  onSendToSandbox,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      // Strip markdown code fences for cleaner speech
      const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted.');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = async () => {
    const textToShare = `Nixora AI [Intelligence Without Limits]:\n\n${message.content}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nixora AI Response',
          text: textToShare,
        });
      } catch (err) {
        // Fallback to copy
        handleCopyText(textToShare);
      }
    } else {
      handleCopyText(textToShare);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2000);
    }
  };

  return (
    <div className={`flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 relative transition-all shadow-md ${
          isUser
            ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-tr-xs'
            : 'bg-slate-900/90 border border-indigo-950 text-slate-100 rounded-tl-xs shadow-slate-950/40'
        }`}
      >
        {/* Model Header with Avatar Badge */}
        {!isUser && (
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">Nixora AI</span>
              <span className="text-[10px] text-cyan-400 font-mono">Response</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => handleSpeak(message.content)}
                className={`p-1 rounded hover:bg-slate-800 transition-colors ${speaking ? 'text-cyan-400 animate-pulse' : 'text-slate-400 hover:text-white'}`}
                title={speaking ? 'Stop Speech' : 'Read Out Loud (TTS)'}
              >
                {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleCopyText(message.content)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy entire response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleShare}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Share Response"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-sm max-w-none break-words">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { children, className, node, ref, ...rest } = props as any;
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                const codeString = String(children).replace(/\n$/, '');

                if (!match) {
                  return (
                    <code /* removed rest */ className={className}>
                      {children}
                    </code>
                  );
                }

                const isWebCode = ['html', 'css', 'javascript', 'jsx', 'tsx', 'react'].includes(language.toLowerCase());

                return (
                  <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#070b14] shadow-lg">
                    {/* Code Header Bar */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/80" />
                        <span className="font-mono text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
                          {language}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {onSendToStudio && (
                          <button
                            onClick={() => onSendToStudio(codeString, language)}
                            className="px-2 py-0.5 rounded text-[11px] bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-white border border-indigo-500/20 flex items-center gap-1 transition-colors"
                            title="Open in Code Studio"
                          >
                            <Terminal className="w-3 h-3 text-cyan-400" />
                            <span>Studio</span>
                          </button>
                        )}

                        {isWebCode && onSendToSandbox && (
                          <button
                            onClick={() => onSendToSandbox(codeString)}
                            className="px-2 py-0.5 rounded text-[11px] bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 hover:text-white border border-purple-500/20 flex items-center gap-1 transition-colors"
                            title="Preview in Live Web Sandbox"
                          >
                            <Play className="w-3 h-3 text-purple-400" />
                            <span>Preview</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleCopyText(codeString)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Copy Code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Code Body */}
                    <div className="font-mono text-xs max-h-96 w-full">
                      <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        children={codeString}
                        language={language}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '0.75rem',
                          background: '#030712',
                          maxHeight: '24rem',
                          overflowX: 'auto'
                        }}
                      />
                    </div>
                  </div>
                );
              }
            }}
          >
            {message.content}
          </Markdown>
        </div>

        {/* Streaming cursor */}
        {message.isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
        )}

        {/* Timestamp */}
        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 select-none">
          <span>{message.timestamp}</span>
          {sharedToast && <span className="text-emerald-400 font-mono">Copied link to share!</span>}
        </div>
      </div>
    </div>
  );
};
