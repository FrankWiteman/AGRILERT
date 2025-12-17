
import React, { useState, useEffect } from 'react';
import { MNOConfig, RawTelemetry } from '../types';

const MNOIntegrator: React.FC = () => {
  const [config, setConfig] = useState<MNOConfig>({
    provider: 'MTN',
    endpoint: 'https://api.mno-gateway.ng/v2/telemetry',
    status: 'Connected',
    lastSync: 'Just now'
  });

  const [stream, setStream] = useState<RawTelemetry[]>([]);

  // Simulate receiving real MNO packets
  useEffect(() => {
    const interval = setInterval(() => {
      const newPacket: RawTelemetry = {
        linkId: `LINK-${Math.floor(Math.random() * 900) + 100}`,
        tsl: 14.5,
        rsl: -45 - Math.random() * 20,
        frequency: 23.5,
        distance: 4.2
      };
      setStream(prev => [newPacket, ...prev.slice(0, 14)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white border border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <i className="fa-solid fa-network-wired text-[10rem]"></i>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-slate-900">
                <i className="fa-solid fa-satellite-dish text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">MNO API Gateway</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Enterprise Connection Active</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Active Provider</p>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                  <span className="font-bold text-lg">{config.provider} Nigeria</span>
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Link Sync Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="font-bold text-lg">{config.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all">
                Update API Endpoints
              </button>
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all">
                Download Raw Log (.csv)
              </button>
            </div>
          </div>

          <div className="lg:w-96 bg-black/40 rounded-3xl p-6 border border-white/5 font-mono text-[11px] overflow-hidden flex flex-col h-64 shadow-inner">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <span className="text-emerald-400">LIVE_TELEMETRY_STREAM</span>
              <span className="text-slate-500">HTTPS/2</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide text-slate-400">
              {stream.map((p, i) => (
                <div key={i} className="hover:text-white transition-colors">
                  <span className="text-emerald-500/50">[{new Date().toLocaleTimeString()}]</span>
                  {` ID:${p.linkId} RSL:${p.rsl.toFixed(2)}dBm TSL:${p.tsl}dBm`}
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
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
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
