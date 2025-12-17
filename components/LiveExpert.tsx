
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

// Utility functions for audio processing
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveExpert: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = () => {
    // 1. Close the session if it exists
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {
        console.debug('Error closing session:', e);
      }
      sessionRef.current = null;
    }

    // 2. Stop microphone tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 3. Close audio contexts safely
    if (audioContextsRef.current) {
      const { input, output } = audioContextsRef.current;
      if (input && input.state !== 'closed') {
        try { input.close(); } catch (e) { console.debug(e); }
      }
      if (output && output.state !== 'closed') {
        try { output.close(); } catch (e) { console.debug(e); }
      }
      audioContextsRef.current = null;
    }

    // 4. Stop all scheduled audio sources
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    setIsActive(false);
    setIsConnecting(false);
  };

  const startSession = async () => {
    if (isConnecting || isActive) return;
    
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: `You are the AGRILERT AI Agri-Expert. Your role is to interpret real-time Commercial Microwave Link (CML) signal data for farmers. 
          When a farmer speaks to you, explain that you are analyzing signal attenuation between local telecom towers to detect rainfall intensity. 
          Provide weather advisories, irrigation timing, and crop protection tips based on these 'live' CML readings. 
          Be professional, encouraging, and clear. Current CML readings in the Ibadan/Oyo region show a 15dB signal drop, indicating heavy localized rain is approaching in 45 minutes.`,
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              // Only send if session is still active
              sessionPromise.then((session) => {
                if (!session) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBase64 = encode(new Uint8Array(int16.buffer));
                try {
                  session.sendRealtimeInput({
                    media: { data: pcmBase64, mimeType: 'audio/pcm;rate=16000' }
                  });
                } catch (err) {
                  console.debug('Failed to send audio input:', err);
                }
              }).catch(() => {});
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const contexts = audioContextsRef.current;
              if (contexts && contexts.output && contexts.output.state !== 'closed') {
                const outputCtx = contexts.output;
                try {
                  nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                  const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
                  const source = outputCtx.createBufferSource();
                  source.buffer = buffer;
                  source.connect(outputCtx.destination);
                  source.start(nextStartTimeRef.current);
                  nextStartTimeRef.current += buffer.duration;
                  sourcesRef.current.add(source);
                  source.onended = () => sourcesRef.current.delete(source);
                } catch (e) {
                  console.error('Audio playback error:', e);
                }
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            console.debug('Session closed by server');
            stopSession();
          },
          onerror: (e) => {
            console.error('Live session error:', e);
            stopSession();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start live expert session:', err);
      stopSession();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isActive && (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-emerald-100 w-72 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <i className="fa-solid fa-microphone-lines animate-pulse"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Live Agri-Expert</p>
              <p className="text-sm font-black text-emerald-600">Listening to CML & You</p>
            </div>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-emerald-500 w-1/3 animate-[shimmer_2s_infinite]"></div>
          </div>
          <p className="text-xs text-slate-500 italic leading-relaxed">
            "I'm analyzing the 15dB signal attenuation from the Ibadan MNO node. It looks like heavy rain is coming..."
          </p>
        </div>
      )}

      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={`
          flex items-center gap-3 px-6 py-4 rounded-full font-bold shadow-2xl transition-all active:scale-95
          ${isActive 
            ? 'bg-rose-500 text-white hover:bg-rose-600' 
            : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 shadow-emerald-600/30'}
          ${isConnecting ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        {isConnecting ? (
          <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
        ) : isActive ? (
          <i className="fa-solid fa-stop text-xl"></i>
        ) : (
          <i className="fa-solid fa-tower-broadcast text-xl"></i>
        )}
        <span>{isConnecting ? 'Syncing...' : isActive ? 'Stop Expert Session' : 'Go Live with Agri-Expert'}</span>
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
};

export default LiveExpert;
