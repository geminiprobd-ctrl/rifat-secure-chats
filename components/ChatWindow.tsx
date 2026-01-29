
import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message } from '../types';

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  roomCode: string;
  onRoomCodeChange: (code: string) => void;
  myUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  contact, 
  messages, 
  onSendMessage, 
  onBack, 
  roomCode, 
  onRoomCodeChange,
  myUserId
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
      {/* Cyber Header - Auth & Room Info */}
      <div className="bg-black/80 backdrop-blur-md border-b border-[#00ff41]/30 p-4 z-40 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center w-full md:w-auto">
          <button onClick={onBack} className="md:hidden mr-4 text-[#00ff41]">
            <i className="fas fa-terminal"></i>
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 border border-[#00ff41] p-0.5">
                <img src={contact.avatar} className="w-full h-full object-cover grayscale brightness-125" alt="Avatar" />
             </div>
             <div>
                <h2 className="text-[#00ff41] font-bold text-sm tracking-tighter uppercase">NODE_{roomCode}</h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_5px_#00ff41]"></span>
                  <span className="text-[10px] text-gray-500 uppercase">Secure Link Established</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-end w-full">
           <div className="bg-black border border-[#00ff41]/50 px-3 py-1 flex items-center gap-3 w-full max-w-sm">
             <span className="text-[10px] text-[#00ff41] whitespace-nowrap">ACCESS_KEY:</span>
             <input 
               type="text"
               value={roomCode}
               onChange={(e) => onRoomCodeChange(e.target.value)}
               className="bg-transparent border-none outline-none text-[#00ff41] text-xs w-full font-mono uppercase"
             />
             <i className="fas fa-lock text-[#00ff41] text-xs"></i>
           </div>
        </div>
      </div>

      {/* Message Feed - Digital Terminals */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar mb-20">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-[#00ff41]/40 space-y-2 opacity-50">
             <i className="fas fa-shield-alt text-4xl mb-4"></i>
             <p className="text-xs uppercase tracking-widest">E2E Encrypted Channel</p>
             <p className="text-[10px] font-mono">Waiting for packet transfer in node: {roomCode}</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === myUserId;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`relative px-4 py-2 max-w-[85%] md:max-w-[70%] bg-black/90 ${isMe ? 'neon-border-green' : 'neon-border-blue'}`}>
                {/* Visual Glitch Header for bubbles */}
                <div className="flex justify-between items-center mb-1 border-b border-gray-800 pb-1">
                  <span className={`text-[8px] uppercase font-bold tracking-widest ${isMe ? 'text-[#00ff41]' : 'text-[#00f3ff]'}`}>
                    {isMe ? '>>> LOGGED_USER' : `>>> SRC_${msg.senderName.toUpperCase()}`}
                  </span>
                  <span className="text-[8px] text-gray-600">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <p className={`text-sm leading-relaxed ${isMe ? 'text-[#00ff41]' : 'text-[#00f3ff]'}`}>
                  {msg.text}
                </p>

                {/* Corner Accents */}
                <div className={`absolute -top-1 -right-1 w-2 h-2 border-t border-r ${isMe ? 'border-[#00ff41]' : 'border-[#00f3ff]'}`}></div>
                <div className={`absolute -bottom-1 -left-1 w-2 h-2 border-b border-l ${isMe ? 'border-[#00ff41]' : 'border-[#00f3ff]'}`}></div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Floating Glowing Input */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1 bg-black/90 backdrop-blur-xl border border-[#00ff41]/50 rounded-none h-14 flex items-center px-4 shadow-[0_0_20px_rgba(0,255,65,0.15)] group focus-within:shadow-[0_0_25px_rgba(0,255,65,0.25)] transition-all">
            <span className="text-[#00ff41] mr-3 font-bold">$</span>
            <form onSubmit={handleSubmit} className="flex-1">
              <input 
                ref={inputRef}
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="EXECUTE MESSAGE_SEND..." 
                className="w-full bg-transparent border-none outline-none text-[#00ff41] placeholder-[#00ff41]/30 text-sm font-mono tracking-wider"
              />
            </form>
            <div className="flex items-center gap-4 text-[#00ff41]/50 text-sm">
              <i className="fas fa-file-code cursor-pointer hover:text-[#00ff41]"></i>
              <i className="fas fa-terminal cursor-pointer hover:text-[#00ff41]"></i>
            </div>
          </div>
          
          <button 
            onClick={handleSubmit}
            className={`h-14 w-14 border border-[#00ff41] flex items-center justify-center transition-all ${
              inputText.trim() ? 'bg-[#00ff41] text-black shadow-[0_0_20px_#00ff41]' : 'bg-transparent text-[#00ff41]/40 border-[#00ff41]/20'
            }`}
          >
            <i className="fas fa-paper-plane text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
