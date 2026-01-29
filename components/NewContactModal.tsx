
import React, { useState } from 'react';

interface NewContactModalProps {
  onClose: () => void;
  onAdd: (name: string, username: string) => void;
}

const NewContactModal: React.FC<NewContactModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const finalUsername = username.trim() || name.trim().toLowerCase().replace(/\s/g, '_');
      onAdd(name.trim(), finalUsername);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[110] flex items-center justify-center p-4 font-mono">
      <div className="bg-black border border-[#00ff41] shadow-[0_0_30px_rgba(0,255,65,0.2)] w-full max-w-md overflow-hidden relative">
        {/* Scanner Effect Corner */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]"></div>

        <div className="border-b border-[#00ff41]/30 p-4 flex items-center justify-between bg-[#00ff41]/5">
          <h3 className="text-[#00ff41] font-bold text-sm tracking-[0.2em] uppercase">INIT_NEW_CONNECTION</h3>
          <button onClick={onClose} className="text-[#00ff41] hover:scale-125 transition-transform p-1">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#00ff41]/60">
              TARGET_NAME
            </label>
            <div className="relative group">
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="INPUT IDENTIFIER..."
                className="w-full bg-black border border-[#00ff41]/30 focus:border-[#00ff41] outline-none py-3 px-4 text-[#00ff41] placeholder-[#00ff41]/20 transition-all text-sm uppercase"
              />
              <div className="absolute inset-0 bg-[#00ff41]/5 opacity-0 group-focus-within:opacity-100 pointer-events-none"></div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#00ff41]/60">
              NODE_ID_OVERRIDE (OPTIONAL)
            </label>
            <div className="flex items-center bg-black border border-[#00ff41]/30 focus-within:border-[#00ff41] transition-all">
              <span className="text-[#00ff41]/40 px-3 font-bold">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                placeholder="system_handle"
                className="w-full bg-transparent outline-none py-3 text-[#00ff41] placeholder-[#00ff41]/20 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-4 bg-[#00ff41] text-black font-bold uppercase tracking-[0.3em] text-xs hover:bg-[#00ff41]/90 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all active:scale-95"
            >
              ESTABLISH_LINK
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-[#00ff41]/40 text-[10px] uppercase tracking-widest hover:text-[#00ff41] transition-colors"
            >
              ABORT_OPERATION
            </button>
          </div>
        </form>
        
        {/* Decorative log lines */}
        <div className="px-8 pb-4">
           <p className="text-[7px] text-gray-800 font-mono overflow-hidden whitespace-nowrap">
             0x45 0x21 0x78 ERR_NONE STATUS_READY PKT_SIZE_4096_BYTES ENCR_AES_256
           </p>
        </div>
      </div>
    </div>
  );
};

export default NewContactModal;
