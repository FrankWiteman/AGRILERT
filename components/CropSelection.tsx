
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

interface Props {
  location: any;
  onComplete: (crop: any) => void;
}

const CropSelection: React.FC<Props> = ({ location, onComplete }) => {
  const [step, setStep] = useState<'ranking' | 'variety'>('ranking');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedBase, setSelectedBase] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on coordinates ${location.lat}, ${location.lng}, suggest 4 agricultural crops. 
        Rank them by "yieldPercentage" (higher is better for current weather/soil). 
        Include a "justification" and 2 "varieties" (one GMO, one Natural) with their specific advantages.`;

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
                        type: { type: Type.STRING },
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
        setRecommendations(JSON.parse(response.text));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCrops();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 border-8 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(16,185,129,0.5)]"></div>
        <p className="text-emerald-400 font-black uppercase tracking-widest text-sm">Predicting optimal yields...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
            {step === 'ranking' ? 'Recommended Crops' : 'Select Variety'}
          </h2>
          <p className="text-slate-400 font-medium">Ranked by yield potential for your specific coordinates.</p>
        </div>

        {step === 'ranking' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((crop, idx) => (
              <button 
                key={crop.name}
                onClick={() => { setSelectedBase(crop); setStep('variety'); }}
                className="bg-white/5 border border-white/10 p-8 rounded-[3rem] text-left hover:border-emerald-500 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <span className="text-8xl font-black">#{idx+1}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black text-white">{crop.name}</h3>
                  <div className="bg-emerald-500 text-emerald-950 font-black px-4 py-1 rounded-full text-lg">
                    {crop.yieldPercentage}%
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{crop.justification}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {selectedBase.varieties.map((v: any) => (
              <div key={v.name} className="bg-white/5 border-2 border-white/10 p-8 rounded-[3rem] flex flex-col justify-between hover:border-emerald-500 transition-all">
                <div className="space-y-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${v.type === 'GMO' ? 'bg-amber-500 text-amber-950' : 'bg-emerald-500 text-emerald-950'}`}>
                      <i className={`fa-solid ${v.type === 'GMO' ? 'fa-dna' : 'fa-seedling'}`}></i>
                   </div>
                   <h3 className="text-3xl font-black text-white">{v.name}</h3>
                   <span className="inline-block px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase text-slate-400">{v.type} TECHNOLOGY</span>
                   <p className="text-slate-300 font-medium leading-relaxed">{v.advantage}</p>
                </div>
                <button 
                  onClick={() => onComplete({ ...selectedBase, selectedVariety: v })}
                  className="mt-8 w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:scale-105 transition-transform shadow-xl"
                >
                  START CULTIVATION
                </button>
              </div>
            ))}
            <button onClick={() => setStep('ranking')} className="md:col-span-2 text-slate-500 font-bold hover:text-white transition-colors">
              <i className="fa-solid fa-arrow-left mr-2"></i> Choose different crop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropSelection;
