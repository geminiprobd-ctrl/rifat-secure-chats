
import React, { useState } from 'react';
import { Contact } from '../types';

interface ChatSidebarProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
  onNewChatClick: () => void;
  onAddByUsername: (name: string, username: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ contacts, selectedContactId, onSelectContact, onNewChatClick, onAddByUsername }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-black/60 backdrop-blur-md w-full border-r border-[#00ff41]/20">
      {/* User Status Header */}
      <div className="p-6 flex justify-between items-center border-b border-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-[#00f3ff] p-0.5">
            <img src="https://picsum.photos/40/40?random=admin" className="w-full h-full object-cover grayscale" alt="Admin" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-[#00f3ff] tracking-widest uppercase">Operator_01</h1>
            <span className="text-[8px] text-green-500 font-mono tracking-widest">STATUS: CONNECTED</span>
          </div>
        </div>
        <div className="flex gap-4 text-[#00f3ff]/60 items-center">
           <button 
             onClick={onNewChatClick}
             className="w-8 h-8 border border-[#00ff41] flex items-center justify-center hover:bg-[#00ff41]/20 transition-all text-[#00ff41]"
             title="Initialize New Connection"
           >
             <i className="fas fa-plus text-xs"></i>
           </button>
           <i className="fas fa-cog hover:text-[#00f3ff] cursor-pointer"></i>
        </div>
      </div>

      {/* Cyber Search Bar */}
      <div className="p-4">
        <div className="relative flex items-center bg-black/80 border border-gray-800 focus-within:border-[#00ff41]/50 px-3 py-2 transition-all">
          <span className="text-[#00ff41] text-xs mr-2 font-bold">&gt;</span>
          <input 
            type="text" 
            placeholder="FILTER NODES..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-xs text-[#00ff41] placeholder-[#00ff41]/20 uppercase tracking-widest"
          />
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-2">
            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-4">Available_Channels</p>
            <div className="space-y-2">
                {filteredContacts.map((contact) => (
                    <div 
                        key={contact.id}
                        onClick={() => onSelectContact(contact.id)}
                        className={`group relative p-3 border cursor-pointer transition-all ${
                            selectedContactId === contact.id 
                            ? 'bg-[#00ff41]/10 border-[#00ff41] shadow-[inset_0_0_10px_rgba(0,255,65,0.1)]' 
                            : 'bg-black/40 border-gray-900 hover:border-gray-700'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <img src={contact.avatar} className="w-10 h-10 grayscale border border-gray-800" alt="Avatar" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className={`text-xs font-bold uppercase ${selectedContactId === contact.id ? 'text-[#00ff41]' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                        {contact.name}
                                    </h3>
                                    <span className="text-[8px] text-gray-700 font-mono">200 OK</span>
                                </div>
                                <p className="text-[9px] text-gray-600 truncate mt-1 font-mono uppercase">
                                    {contact.lastMessage}
                                </p>
                            </div>
                        </div>
                        {/* Selector indicator */}
                        {selectedContactId === contact.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00ff41]"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {searchQuery.length > 2 && !contacts.find(c => c.username === searchQuery.toLowerCase()) && (
          <div 
            onClick={() => onAddByUsername(searchQuery, searchQuery.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            className="mx-4 mt-6 p-3 border border-dashed border-[#00ff41]/40 hover:bg-[#00ff41]/5 cursor-pointer text-center group"
          >
            <p className="text-[9px] text-[#00ff41]/60 uppercase tracking-widest mb-1">Create New Node</p>
            <p className="text-xs text-[#00ff41] font-bold">@_{searchQuery.toUpperCase()}</p>
          </div>
        )}
      </div>
      
      {/* Bottom Footer */}
      <div className="p-4 border-t border-gray-900 text-[8px] text-gray-700 flex justify-between font-mono">
         <span>CRYPTO_v4.2.1</span>
         <span>SECURE_SESSION_ACTIVE</span>
      </div>
    </div>
  );
};

export default ChatSidebar;
