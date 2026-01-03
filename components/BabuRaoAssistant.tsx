
import React, { useState, useRef, useEffect } from 'react';
import { askBabuRao } from "../services/geminiService";
import { ChatMessage, Customer, Product, Bill } from '../types';

interface BabuRaoAssistantProps {
  customers: Customer[];
  products: Product[];
  bills: Bill[];
}

const BabuRaoAssistant: React.FC<BabuRaoAssistantProps> = ({ customers, products, bills }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Namaste! Main Babu Rao. Aaj dhanda kaisa hai re baba? Kya help karoon?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await askBabuRao(textToSend);

    const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const startVoiceInput = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapka browser voice support nahi karta re baba! Chrome use karo.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Hindi/Hinglish support
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Mike ki permission chahiye re baba! Browser settings mein jaake mic allow karo.");
        } else if (event.error === 'network') {
          alert("Internet ka lafda hai re baba, mic nahi chal raha.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Recognition start error:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-t-3xl overflow-hidden shadow-inner">
      <div className="bg-gradient-to-r from-yellow-400 to-pink-500 p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">👓</div>
          <div>
            <h2 className="font-black text-xl leading-none">Babu Rao</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Smart Assistant</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-24 bg-[#fafafa]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-[28px] shadow-sm text-sm font-medium ${
              msg.role === 'user' 
              ? 'bg-pink-600 text-white rounded-tr-none' 
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-[28px] animate-pulse text-[10px] font-bold text-gray-400 uppercase">Babu Rao soch raha hai...</div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2 items-center bg-white fixed bottom-[72px] left-0 right-0 z-40 shadow-lg">
        <button 
          onClick={startVoiceInput}
          className={`p-4 rounded-full transition-all active:scale-90 ${
            isListening 
            ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
            : 'bg-pink-100 text-pink-600'
          }`}
        >
          <span className="text-xl">{isListening ? '🛑' : '🎙️'}</span>
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? "Bolo, sun raha hoon..." : "Yahan type karein..."}
          className={`flex-1 p-4 rounded-full bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm font-bold ${
            isListening ? 'placeholder-red-400' : ''
          }`}
        />
        <button 
          onClick={() => handleSend()}
          disabled={isLoading || isListening}
          className="bg-pink-600 text-white p-4 rounded-full shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          <span className="text-xl">➔</span>
        </button>
      </div>
    </div>
  );
};

export default BabuRaoAssistant;
