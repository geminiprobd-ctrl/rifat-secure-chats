
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>(['INITIALIZING_KERNEL...']);

  useEffect(() => {
    const logs = [
      'LOADING_ENCRYPTION_MODULES...',
      'ESTABLISHING_VPN_TUNNEL...',
      'DECRYPTING_PACKETS...',
      'READY_FOR_HANDSHAKE.'
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setLog(prev => [...prev, logs[i]]);
        setProgress(p => Math.min(p + 25, 100));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center p-6 font-mono overflow-hidden">
      {/* Digital Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative w-full max-w-sm space-y-8 z-10">
        <div className="flex flex-col items-center gap-4">
           <div className="w-20 h-20 border-2 border-[#00ff41] flex items-center justify-center relative shadow-[0_0_20px_rgba(0,255,65,0.4)]">
              <i className="fas fa-shield-alt text-[#00ff41] text-4xl"></i>
              <div className="absolute inset-0 border border-[#00ff41] animate-ping opacity-20"></div>
           </div>
           <h1 className="text-xl font-bold text-[#00ff41] tracking-[0.4em] uppercase">CYBER-CHAT</h1>
        </div>

        <div className="bg-black border border-gray-900 p-4 space-y-3">
          <div className="space-y-1">
            {log.map((line, idx) => (
              <p key={idx} className="text-[10px] text-[#00ff41]/70 tracking-widest">
                <span className="text-gray-700 mr-2">[{new Date().toLocaleTimeString()}]</span>
                {line}
              </p>
            ))}
          </div>
          
          <div className="space-y-2 pt-2 border-t border-gray-900">
             <div className="flex justify-between text-[8px] text-gray-500 uppercase tracking-widest">
                <span>System_Sync</span>
                <span>{progress}%</span>
             </div>
             <div className="h-1 bg-gray-900 w-full overflow-hidden">
                <div className="h-full bg-[#00ff41] shadow-[0_0_10px_#00ff41] transition-all duration-500" style={{ width: `${progress}%` }}></div>
             </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 text-[8px] text-gray-700 tracking-[0.5em] uppercase animate-pulse">
        Secure Handshake Protocol Active
      </div>
    </div>
  );
};

export default SplashScreen;
