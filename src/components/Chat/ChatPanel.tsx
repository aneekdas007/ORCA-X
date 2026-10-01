import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isUnknownQuery?: boolean;
  scenarioId?: string;
}

interface ChatPanelProps {
  messages: ChatMessageItem[];
  onSendMessage: (query: string) => void;
  isProcessing: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isProcessing,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] rounded-xl border border-[#D9E2E8] shadow-sm overflow-hidden text-[#18303F]">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-[#F7F9FA] border-b border-[#D9E2E8] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#21618C] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4 text-[#DCEAF2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#12304A] tracking-wide flex items-center gap-1.5">
              <span>ORCA-X Intelligence Assistant</span>
              <span className="w-2 h-2 rounded-full bg-[#1E824C]"></span>
            </h3>
            <p className="text-[10px] text-[#61717D]">
              Natural Language Marine Surveillance & Risk Engine
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#21618C] px-2 py-0.5 rounded bg-[#EBF3F7] border border-[#DCEAF2]">
          Multi-Agent Mode
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAFBFD]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-md bg-[#12304A] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-3.5 h-3.5 text-[#DCEAF2]" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed transition-all ${
                  isUser
                    ? 'bg-[#21618C] text-white rounded-tr-none shadow-sm'
                    : 'bg-[#FFFFFF] border border-[#D9E2E8] text-[#18303F] rounded-tl-none shadow-sm'
                }`}
              >
                {/* Unknown query polite state */}
                {msg.isUnknownQuery ? (
                  <div className="space-y-1.5 text-[#61717D]">
                    <div className="flex items-start gap-2 text-[#C58A2B] font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Surveillance Advisory</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#18303F]">
                      {msg.text}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className={`text-[9px] text-right font-mono ${isUser ? 'text-[#DCEAF2]' : 'text-[#7A93A6]'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-md bg-[#3B82A0] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-md bg-[#12304A] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
              <Bot className="w-3.5 h-3.5 text-[#DCEAF2]" />
            </div>
            <div className="rounded-xl p-3 bg-[#FFFFFF] border border-[#D9E2E8] text-xs text-[#21618C] rounded-tl-none flex items-center gap-2.5 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-[#21618C]" />
              <span className="text-[#18303F] font-medium">
                Decomposing marine query & analyzing observation feeds...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box — Clean & focused without prompt chips */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#FFFFFF] border-t border-[#D9E2E8]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder="Ask ORCA-X about coastal conditions, vessel routes, or marine hazards..."
            className="w-full pl-3.5 pr-11 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9E2E8] focus:border-[#21618C] focus:ring-1 focus:ring-[#21618C] text-xs text-[#18303F] placeholder-[#7A93A6] outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="absolute right-1.5 p-1.5 rounded-md bg-[#21618C] hover:bg-[#1b5074] text-white disabled:opacity-40 transition-colors cursor-pointer shadow-sm"
            title="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
