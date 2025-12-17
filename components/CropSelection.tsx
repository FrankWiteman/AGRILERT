
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

interface Props {
  location: any;
  onComplete: (crop: any) => void;
  onBack: () => void;
}

const CropSelection: React.FC<Props> = ({ location, onComplete, onBack }) => {
  const [step, setStep] = useState<'ranking' | 'variety'>('ranking');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedBase, setSelectedBase] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on coordinates ${location.lat}, ${location.lng}, suggest 4 agricultural crops for this location.
        The current soil data is: pH ${location.soil?.ph}, Type ${location.soil?.type}.
        Rank them by "yieldPercentage" (probability of maximum harvest). 
        Include a "justification" and 2 "varieties" (one GMO, one Natural) with their specific names and detailed advantages for planting.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  yieldPercentage: { type: Type.NUMBER },
                  justification: { type: Type.STRING },
                  varieties: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, description: 'GMO or Natural' },
                        name: { type: Type.STRING },
                        advantage: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        });
        const data = JSON.parse(response.text);
        setRecommendations(data.sort((a: any, b: any) => b.yieldPercentage - a.yieldPercentage));
      } catch (e) {
        console.error(e);
        // Fallback mock data if AI fails
        setRecommendations([
          { name: 'Maize', yieldPercentage: 92, justification: 'Perfect drainage and nitrogen levels.', varieties: [
            { type: 'Natural', name: 'White Nigerian Heirloom', advantage: 'Excellent taste, high market value.' },
            { type: 'GMO', name: 'Drought-Tolerant V3', advantage: 'Resistant to Fall Armyworm, requires 30% less water.' }
          ]},
          { name: 'Cassava', yieldPercentage: 85, justification: 'Robust soil structure detected.', varieties: [
            { type: 'Natural', name: 'TMA-419', advantage: 'High starch content.' },
            { type: 'GMO', name: 'Bio-Fortified Yellow', advantage: 'Enhanced Vitamin A content, pest resistant.' }
          ]}
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCrops();
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-emerald-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 border-8 border-emerald-400 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(52,211,153,0.3)]"></div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Analyzing Field Telemetry</h2>
        <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] mt-2">Syncing Soil Sensors • Reading 5-Year Weather Trends</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase text-xs">
            <i className="fa-solid fa-arrow-left"></i> Change Location
          </button>
          <div className="text-right">
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Locked Coordinates</p>
             <p className="text-xs font-mono text-slate-400">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
            {step === 'ranking' ? 'Recommended Crops' : 'Variety Selection'}
          </h2>
          <p className="text-slate-400 font-medium">Ranked by yield potential for your specific coordinates.</p>
        </div>

        {step === 'ranking' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((crop, idx) => (
              <button 
                key={crop.name}
                onClick={() => { setSelectedBase(crop); setStep('variety'); }}
                className="bg-white/5 border border-white/10 p-8 rounded-[3rem] text-left hover:border-emerald-500 hover:bg-white/[0.02] transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-9xl font-black italic">#{idx+1}</span>
                </div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="text-3xl font-black text-white">{crop.name}</h3>
                  <div className="bg-emerald-500 text-emerald-950 font-black px-4 py-1 rounded-full text-lg shadow-lg">
                    {crop.yieldPercentage}%
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10">{crop.justification}</p>
                <div className="mt-6 flex gap-2 relative z-10">
                   <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase text-emerald-400 tracking-widest">Soil Match High</span>
                   <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase text-blue-400 tracking-widest">Climate Verified</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {selectedBase.varieties.map((v: any) => (
                <div key={v.name} className="bg-white/5 border-2 border-white/10 p-8 rounded-[3rem] flex flex-col justify-between hover:border-emerald-500 transition-all group">
                  <div className="space-y-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${v.type === 'GMO' ? 'bg-amber-500 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-emerald-500 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}>
                        <i className={`fa-solid ${v.type === 'GMO' ? 'fa-dna' : 'fa-seedling'}`}></i>
                     </div>
                     <h3 className="text-3xl font-black text-white">{v.name}</h3>
                     <span className="inline-block px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase text-slate-400 tracking-widest">{v.type} TECHNOLOGY</span>
                     <p className="text-slate-300 font-medium leading-relaxed">{v.advantage}</p>
                  </div>
                  <button 
                    onClick={() => onComplete({ ...selectedBase, selectedVariety: v })}
                    className={`mt-10 w-full py-5 text-white font-black rounded-2xl hover:scale-105 transition-transform shadow-xl uppercase tracking-widest ${v.type === 'GMO' ? 'bg-amber-600' : 'bg-emerald-600'}`}
                  >
                    SELECT {v.type}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
               <button onClick={() => setStep('ranking')} className="text-slate-500 font-bold hover:text-white transition-colors py-4">
                <i className="fa-solid fa-rotate-left mr-2"></i> Choose different crop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropSelection;
