import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, X, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, isThinking: boolean) => void;
  isProcessing: boolean;
}

export const AIPanel: React.FC<AIPanelProps> = ({ 
  isOpen, 
  onClose, 
  messages, 
  onSendMessage, 
  isProcessing 
}) => {
  const [input, setInput] = useState('');
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input, isThinkingMode);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="w-96 bg-editor-panel border-l border-editor-border flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-10 border-b border-editor-border flex items-center justify-between px-3 bg-editor-bg select-none">
        <div className="flex items-center gap-2 text-editor-fg font-semibold text-sm">
          <Sparkles size={16} className="text-editor-accent" />
          <span>Gemini Intelligence</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {/* Settings / Mode */}
      <div className="p-3 border-b border-editor-border bg-editor-panel/50">
        <label className={`flex items-center gap-2 cursor-pointer text-xs p-2 rounded border transition-all ${isThinkingMode ? 'border-purple-500 bg-purple-900/20 text-purple-200' : 'border-editor-border text-gray-400 hover:border-gray-500'}`}>
          <input 
            type="checkbox" 
            className="hidden"
            checked={isThinkingMode}
            onChange={e => setIsThinkingMode(e.target.checked)}
          />
          <BrainCircuit size={14} />
          <div className="flex-1">
            <div className="font-bold">Deep Thinking Mode</div>
            <div className="text-[10px] opacity-80">Enables gemini-3-pro with high thinking budget</div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isThinkingMode ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-gray-600'}`}></div>
        </label>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-10">
            <Bot size={48} className="mx-auto mb-4 opacity-20" />
            <p>How can I help you edit this file today?</p>
            <p className="text-xs mt-2 opacity-60">I have read access to your current file context.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-editor-accent text-white' : 'bg-green-600 text-white'}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-editor-selection text-white' : 'bg-editor-border text-editor-fg'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 animate-pulse">
               <Bot size={14} className="text-white" />
             </div>
             <div className="bg-editor-border rounded-lg p-3 text-sm text-gray-400 flex items-center gap-2">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-editor-border bg-editor-bg">
        <div className="relative">
          <input
            className="w-full bg-editor-panel border border-editor-border rounded-md pl-3 pr-10 py-2 text-sm focus:border-editor-accent outline-none text-editor-fg placeholder-gray-600"
            placeholder={isThinkingMode ? "Ask a complex question..." : "Ask Gemini..."}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-editor-accent disabled:opacity-30 hover:text-white transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-[10px] text-gray-600 mt-2 text-center">
          Context: Current File & Selection included automatically.
        </div>
      </form>
    </div>
  );
};
