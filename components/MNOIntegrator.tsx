
import React, { useState, useEffect } from 'react';
import { MNOConfig, RawTelemetry } from '../types.ts';

const MNOIntegrator: React.FC = () => {
  const [isLive, setIsLive] = useState(() => localStorage.getItem('agrilert_use_live_mno') === 'true');
  const [config, setConfig] = useState<MNOConfig>({
    provider: 'MTN',
    endpoint: 'https://api.mno-gateway.ng/v2/telemetry',
    status: 'Connected',
    lastSync: 'Just now'
  });

  const [stream, setStream] = useState<RawTelemetry[]>([]);

  // Sync with global MNO state changes
  useEffect(() => {
    const handleSync = () => {
      setIsLive(localStorage.getItem('agrilert_use_live_mno') === 'true');
    };
    window.addEventListener('mno_state_changed', handleSync);
    return () => window.removeEventListener('mno_state_changed', handleSync);
  }, []);

  // Simulate receiving real MNO packets
  useEffect(() => {
    const interval = setInterval(() => {
      const newPacket: RawTelemetry = {
        linkId: `LINK-${Math.floor(Math.random() * 900) + 100}`,
        tsl: 14.5,
        rsl: -45 - (isLive ? Math.random() * 10 : Math.random() * 20),
        frequency: 23.5,
        distance: 4.2
      };
      setStream(prev => [newPacket, ...prev.slice(0, 14)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6">
      <div className={`rounded-[2rem] p-8 text-white border transition-all duration-500 shadow-2xl overflow-hidden relative ${isLive ? 'bg-slate-900 border-emerald-500/30' : 'bg-emerald-950 border-white/5'}`}>
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <i className="fa-solid fa-network-wired text-[10rem]"></i>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isLive ? 'bg-emerald-500 text-slate-900' : 'bg-yellow-400 text-slate-900'}`}>
                <i className={`fa-solid ${isLive ? 'fa-bolt' : 'fa-satellite-dish'} text-xl`}></i>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">MNO API Gateway</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  {isLive ? 'MTN Enterprise Feed Active' : 'Simulated Gateway Link'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full animate-pulse ${isLive ? 'bg-emerald-500' : 'bg-yellow-400'}`}></span>
                  <span className="font-bold text-lg">{isLive ? 'Synchronized' : 'Standalone'}</span>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">MNO Endpoint</p>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-link text-xs text-slate-500"></i>
                  <span className="font-mono text-sm opacity-60">api.mno-gateway.ng</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button 
                onClick={() => {
                  const newState = !isLive;
                  localStorage.setItem('agrilert_use_live_mno', newState.toString());
                  window.dispatchEvent(new Event('mno_state_changed'));
                }}
                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${isLive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
              >
                {isLive ? 'Disconnect Live Feed' : 'Force Live Sync'}
              </button>
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                View Raw Packets
              </button>
            </div>
          </div>

          <div className="lg:w-96 bg-black/40 rounded-3xl p-6 border border-white/5 font-mono text-[11px] overflow-hidden flex flex-col h-64 shadow-inner">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <span className="text-emerald-400">TELEMETRY_LOG</span>
              <span className="text-slate-500">V2.4</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide text-slate-400">
              {stream.map((p, i) => (
                <div key={i} className="hover:text-white transition-colors">
                  <span className="text-emerald-500/50">[{new Date().toLocaleTimeString()}]</span>
                  {` PKT_ID:${p.linkId} RSL:${p.rsl.toFixed(2)}dBm`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Signal Loss (dB)', value: (14.5 - (stream[0]?.rsl || -45)).toFixed(2), icon: 'fa-arrow-down-wide-short', color: 'rose' },
          { label: 'Rain Estimate', value: `${((14.5 - (stream[0]?.rsl || -45)) > 15 ? 12.4 : 0.5).toFixed(1)} mm/h`, icon: 'fa-cloud-showers-heavy', color: 'blue' },
          { label: 'Link Frequency', value: '23.5 GHz', icon: 'fa-wave-square', color: 'emerald' },
          { label: 'Hop Distance', value: '4.2 km', icon: 'fa-ruler-horizontal', color: 'amber' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-4`}>
              <i className={`fa-solid ${stat.icon} text-xl`}></i>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MNOIntegrator;
