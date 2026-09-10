'use client';

import * as React from 'react';
import { Send, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { matchConceptsToText } from '@/app/anatomy';
import type { Concept } from '@/app/anatomy';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp?: number;
  highlightedConcepts?: string[];
}

const SUGGESTIONS = [
  'What does the heart do?',
  'Describe the liver.',
  'Cranial nerves?',
  'Skeletal system?',
];

function Md({ text }: { text: string }) {
  const blocks = text.split('\n\n');
  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith('```')) {
          const code = block.replace(/```\w*\n?/, '').replace(/```$/, '');
          return (
            <pre key={i} className="my-1 p-2 rounded-lg text-[11px] font-mono overflow-x-auto" style={{ background: '#f5f0eb', color: '#4a3a2a', border: '1px solid #e8ddd4' }}>
              <code>{code}</code>
            </pre>
          );
        }
        if (block.startsWith('## ')) {
          return <div key={i} className="font-bold text-xs mt-2 mb-1" style={{ color: '#8b6f5a' }}>{block.replace('## ', '')}</div>;
        }
        if (block.startsWith('### ')) {
          return <div key={i} className="font-semibold text-xs mt-1 mb-0.5" style={{ color: '#5a4a3a' }}>{block.replace('### ', '')}</div>;
        }
        if (block.startsWith('- ') || block.startsWith('* ')) {
          const items = block.split('\n').filter(l => l.trim());
          return (
            <ul key={i} className="my-0.5 pl-2">
              {items.map((item, j) => (
                <li key={j} className="text-xs leading-relaxed list-disc list-inside" style={{ color: '#6a5a4a' }}>{item.replace(/^[-*]\s*/, '')}</li>
              ))}
            </ul>
          );
        }
        if (block.startsWith('[') && block.includes(']')) {
          return <div key={i} className="text-[10px] mt-1 pl-2 border-l-2" style={{ color: '#9a8a7a', borderColor: '#d4af9b' }}>{block}</div>;
        }
        return <p key={i} className="text-xs leading-relaxed my-0.5" style={{ color: '#5a4a3a' }}>{block}</p>;
      })}
    </>
  );
}

interface Props {
  onOpenChange?: (open: boolean) => void;
  initialOpen?: boolean;
  concepts?: Concept[];
  onHighlightConcepts?: (conceptIds: string[]) => void;
}

export function ChatBar({ onOpenChange, initialOpen = false, concepts = [], onHighlightConcepts }: Props) {
  const [isOpen, setIsOpen] = React.useState(initialOpen);
  const [collapsed, setCollapsed] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  // Sync with parent state
  React.useEffect(() => {
    setIsOpen(initialOpen);
  }, [initialOpen]);

  React.useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen]);

  React.useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: trimmed, timestamp: Date.now() }]);

    try {
      const resp = await fetch('https://grea-anatomy-bot.superiorchemco.workers.dev/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await resp.json() as { response?: string; text?: string; error?: string };
      const responseText = data.response || data.text || 'No response generated.';
      
      // Extract highlighted concepts from response
      const highlightedIds = matchConceptsToText(responseText, concepts);
      if (highlightedIds.length > 0 && onHighlightConcepts) {
        onHighlightConcepts(highlightedIds);
      }
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: responseText,
        timestamp: Date.now(),
        highlightedConcepts: highlightedIds
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `Connection error: ${err instanceof Error ? err.message : 'Unknown error'}.`,
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const fmtTime = (ts?: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    return `[${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}]`;
  };

  return (
    <>
      {/* Chat panel - glassmorphia with rose gold border */}
      {isOpen && (
        <div 
          className="chat-side-panel flex flex-col h-full"
          style={{ 
            background: '#ffffffeb',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid #25384a17',
            boxShadow: '-10px 0 40px #2433440a'
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{
              background: 'linear-gradient(90deg, #f8f6f4 0%, #ffffff 50%, #f8f6f4 100%)',
              borderBottom: '1px solid #18253612'
            }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  background: '#8b6f5a',
                  boxShadow: '0 0 8px rgba(139,111,90,0.4)'
                }}
              />
              <span className="text-sm font-semibold" style={{ color: '#26313c' }}>Expert</span>
              <span className="text-[10px]" style={{ color: '#78828c' }}>OpenAlex · Europe PMC</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: '#78828c' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#18253608'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {collapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: '#78828c' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#18253608'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          {!collapsed && (
            <div className="flex-1 min-h-0 px-4 py-3 overflow-y-auto" ref={scrollerRef}>
              {messages.length === 0 && (
                <div className="flex flex-col gap-3 py-3">
                  <div className="text-[11px] leading-relaxed" style={{ color: '#6a5a4a' }}>
                    This expert writes in the style of classical anatomical texts, sourcing exclusively from modern peer-reviewed research.
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => send(s)}
                        className="px-2.5 py-1.5 text-[10px] rounded-full transition-all hover:scale-105"
                        style={{
                          background: '#f5f0eb',
                          border: '1px solid #e8ddd4',
                          color: '#5a4a3a'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col mb-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.timestamp && (
                    <div className="text-[9px] px-1 mb-0.5" style={{ color: '#9a8a7a' }}>
                      {fmtTime(msg.timestamp)}
                    </div>
                  )}
                  <div
                    className={`max-w-[90%] px-3 py-2 text-xs leading-relaxed rounded-2xl ${
                      msg.role === 'user' 
                        ? 'rounded-br-md' 
                        : 'rounded-bl-md'
                    }`}
                    style={msg.role === 'user' ? {
                      background: '#8b6f5a',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(139,111,90,0.2)'
                    } : {
                      background: '#f5f0eb',
                      border: '1px solid #e8ddd4',
                      color: '#4a3a2a'
                    }}
                  >
                    {msg.role === 'ai' ? <Md text={msg.text} /> : <span>{msg.text}</span>}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-2 text-[11px] px-1" style={{ color: '#78828c' }}>
                  <Sparkles size={10} className="animate-pulse" />
                  Consulting…
                </div>
              )}
            </div>
          )}

          {/* Input area */}
          <form onSubmit={handleSubmit} className="flex gap-2 p-3 shrink-0" style={{ borderTop: '1px solid #18253612' }}>
            <input
              className="flex-1 h-9 px-3 text-xs rounded-lg outline-none transition-colors"
              style={{
                background: '#f5f0eb',
                border: '1px solid #e8ddd4',
                color: '#4a3a2a'
              }}
              placeholder="Ask anatomy..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#8b6f5a'}
              onBlur={(e) => e.target.style.borderColor = '#e8ddd4'}
            />
            <button 
              type="submit" 
              className="h-9 w-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30"
              disabled={loading || !input.trim()}
              style={{
                background: '#8b6f5a',
                boxShadow: '0 4px 12px rgba(139,111,90,0.2)'
              }}
            >
              <Send size={14} color="#fff" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBar;
