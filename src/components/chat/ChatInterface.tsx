import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Trash2, Sparkles, Terminal, Code2, AlertCircle } from 'lucide-react';
import { ChatMessage, AppSettings } from '../../types';
import { ChatMessageItem } from './ChatMessageItem';
import { PromptSuggestions } from './PromptSuggestions';

interface ChatInterfaceProps {
  settings: AppSettings;
  onSendToStudio: (code: string, language: string) => void;
  onSendToSandbox: (code: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  settings,
  onSendToStudio,
  onSendToSandbox,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('nexora_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // default
      }
    }
    return [
      {
        id: 'welcome-1',
        role: 'model',
        content: `**Greetings! I am Nexora AI.** ⚡\n\n*Intelligence Without Limits.* I am your advanced coding and mobile engineering assistant powered by **Gemini 3.8 Flash**.\n\nHere is how I can assist you:\n- 🤖 **Android & Kotlin**: Generate production Jetpack Compose apps & APK structures\n- 💻 **Full-Stack & Code Gen**: Python, Java, TypeScript, C++, React, SQL, Rust, Go\n- 🐞 **Debug & Auto-Fix**: Hunt down memory leaks, race conditions, and runtime bugs\n- 🧠 **Algorithm & DSA**: Step-by-step interview solutions with complexity analysis\n- 🌐 **Web Sandbox**: Live code preview directly in your browser\n\nHow can I accelerate your development today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexora_messages', JSON.stringify(messages));
    } catch (e) {
      // Storage quota or private browsing
    }
  }, [messages]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = settings.language === 'es' ? 'es-ES' : settings.language === 'fr' ? 'fr-FR' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
        setVoiceError('Microphone input error. Please check browser permissions.');
        setTimeout(() => setVoiceError(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [settings.language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setVoiceError('Voice input is not supported in this browser. Try Chrome/Edge.');
      setTimeout(() => setVoiceError(null), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setVoiceError(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isStreaming) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Create placeholder for streaming response
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'model',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages([...newMessages, assistantMessage]);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: settings.model,
          temperature: settings.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataPayload = line.slice(6).trim();
              if (dataPayload === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(dataPayload);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: accumulatedText }
                        : msg
                    )
                  );
                } else if (parsed.error) {
                  accumulatedText += `\n\n⚠️ *Notice: ${parsed.error}*`;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: accumulatedText }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Ignore partial JSON
              }
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, isStreaming: false } : msg
        )
      );

      // Auto speak if enabled in settings
      if (settings.autoSpeakResponse && 'speechSynthesis' in window) {
        const cleanText = accumulatedText.replace(/```[\s\S]*?```/g, 'Code omitted.');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = settings.speechRate || 1.0;
        utterance.pitch = settings.speechPitch || 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  '⚡ Connection to Nexora Engine disrupted. Please verify your connection or try again.',
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleClearChat = () => {
    if (window.confirm('Clear current chat history?')) {
      const resetMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        content: 'Chat cleared. How can Nexora AI assist you now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([resetMsg]);
      localStorage.removeItem('nexora_messages');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] relative overflow-hidden">
      {/* Background ambient neon glow */}
      <div className="absolute top-10 right-0 w-80 h-80 rounded-full bg-cyan-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-purple-600/5 blur-3xl pointer-events-none" />

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 z-10">
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onSendToStudio={onSendToStudio}
            onSendToSandbox={onSendToSandbox}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Error Banner */}
      {voiceError && (
        <div className="px-4 py-2 mx-4 mb-2 rounded-xl bg-red-950/80 border border-red-500/30 text-xs text-red-200 flex items-center gap-2 z-20 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="p-3 border-t border-indigo-950/70 bg-slate-950/95 backdrop-blur-xl z-20 shrink-0">
        {/* Prompt Suggestions chips */}
        <PromptSuggestions onSelectPrompt={(p) => handleSendMessage(p)} />

        {/* Input Bar */}
        <div className="flex items-end gap-2 bg-[#090d16] border border-slate-800 focus-within:border-cyan-500/50 rounded-2xl p-2 transition-all shadow-inner">
          {/* Clear history button */}
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening... Speak now...' : 'Ask Nexora (code, Android APK, debug, DSA)...'}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 resize-none outline-none max-h-32 py-1.5 px-1 font-sans"
          />

          {/* Voice-to-Text Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/40 ring-2 ring-rose-400'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
            }`}
            title={isListening ? 'Stop Listening' : 'Voice Input (Speech-to-Text)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isStreaming}
            className={`p-2 rounded-xl font-medium transition-all ${
              input.trim() && !isStreaming
                ? 'bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-cyan-500/30 hover:opacity-95 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            {isStreaming ? (
              <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Status subline */}
        <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-slate-500 select-none">
          <span className="flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Engine: {settings.model}
          </span>
          <span>Shift+Enter for newline</span>
        </div>
      </div>
    </div>
  );
};
