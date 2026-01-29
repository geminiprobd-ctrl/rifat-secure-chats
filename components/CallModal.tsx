
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Contact, CallStatus } from '../types';
import { decode, encode, decodeAudioData, floatTo16BitPCM } from '../utils/audio';

interface CallModalProps {
  contact: Contact;
  onClose: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ contact, onClose }) => {
  const [status, setStatus] = useState<CallStatus>(CallStatus.CONNECTING);
  const [duration, setDuration] = useState(0);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<{
    input: AudioContext;
    output: AudioContext;
  } | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    let interval: any;
    if (status === CallStatus.ACTIVE) {
      interval = setInterval(() => setDuration(d => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startCall = async () => {
    try {
      // Always use process.env.API_KEY directly as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      audioContextRef.current = { input: inputCtx, output: outputCtx };
      let nextStartTime = 0;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus(CallStatus.ACTIVE);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = floatTo16BitPCM(inputData);
              // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`.
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ 
                  media: { 
                    data: encode(pcmData), 
                    mimeType: 'audio/pcm;rate=16000' 
                  } 
                });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputCtx) {
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sourcesRef.current.add(source);
            }
            
            // Check for interruption and stop playback if needed
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTime = 0;
            }
          },
          onerror: (e) => console.error("Call error", e),
          onclose: () => setStatus(CallStatus.ENDED),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: `You are ${contact.name} on a voice call. Sound natural, warm, and speak naturally as if you are catching up with a friend. Keep responses reasonably brief.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start call", err);
      onClose();
    }
  };

  useEffect(() => {
    startCall();
    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) {
        audioContextRef.current.input.close();
        audioContextRef.current.output.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-[#075E54] z-50 flex flex-col items-center justify-between py-16 text-white">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <img src={contact.avatar} className="w-32 h-32 rounded-full border-4 border-white/20" alt={contact.name} />
          {status === CallStatus.ACTIVE && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 rounded-full p-1 animate-pulse">
              <i className="fas fa-microphone text-xs"></i>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold mb-1">{contact.name}</h2>
        <p className="text-white/70">
          {status === CallStatus.CONNECTING ? 'Connecting...' : 
           status === CallStatus.ACTIVE ? formatTime(duration) : 'Call ended'}
        </p>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <div className="flex items-center space-x-12">
          <button className="bg-white/20 p-4 rounded-full hover:bg-white/30 transition-colors">
            <i className="fas fa-volume-up text-xl"></i>
          </button>
          <button className="bg-white/20 p-4 rounded-full hover:bg-white/30 transition-colors">
            <i className="fas fa-video text-xl"></i>
          </button>
          <button className="bg-white/20 p-4 rounded-full hover:bg-white/30 transition-colors">
            <i className="fas fa-microphone-slash text-xl"></i>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
        >
          <i className="fas fa-phone-slash text-2xl rotate-[135deg]"></i>
        </button>
      </div>
    </div>
  );
};

export default CallModal;
