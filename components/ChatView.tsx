
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile } from '../types';
import { getChatResponse } from '../services/geminiService';

interface ChatViewProps {
  profile: UserProfile;
}

const ChatView: React.FC<ChatViewProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: `Hi ${profile.name.split(' ')[0]}! I'm your Smart Bite advisor. Got a food question or feeling unsure about a snack? Just ask!`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await getChatResponse(profile, input, history);
      
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FBF9]">
      <div className="glass px-8 py-5 border-b border-emerald-100 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">AI Advisor</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Active Insight</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 10.1"/><path d="M12 12l9.1 1.9"/><path d="M12 12l-1.9 9.9"/><path d="M12 12l-9.9-1.9"/></svg>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none shadow-emerald-200' 
                : 'bg-white text-gray-800 border border-emerald-50 rounded-tl-none'
            }`}>
              {msg.text}
              <div className={`text-[9px] mt-2 font-black uppercase tracking-tighter opacity-50 ${msg.role === 'user' ? 'text-white' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-emerald-50 px-6 py-4 rounded-[1.8rem] rounded-tl-none flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 pb-32 bg-transparent">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="What's on your mind?"
            className="w-full pl-6 pr-16 py-5 bg-white border border-emerald-100 rounded-[2rem] outline-none focus:border-emerald-500 shadow-xl shadow-emerald-900/5 font-semibold text-sm transition-all"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 w-12 h-12 bg-emerald-600 text-white rounded-[1.2rem] flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-200 active:scale-90 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
