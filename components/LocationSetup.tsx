
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GoogleGenAI, Type } from '@google/genai';

interface Props {
  onFinalize: (location: any, crop: any) => void;
}

const LocationSetup: React.FC<Props> = ({ onFinalize }) => {
  const [step, setStep] = useState<'target' | 'analysis' | 'crops'>('target');
  const [address, setAddress] = useState('');
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;
    const map = L.map(mapContainer.current, { center: [9.0820, 8.6753], zoom: 6, zoomControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    map.on('click', (e: L.LeafletMouseEvent) => updateMarker(e.latlng.lat, e.latlng.lng));
    mapInstance.current = map;
  }, []);

  const updateMarker = (lat: number, lng: number) => {
    setSelectedCoords([lat, lng]);
    if (markerInstance.current) markerInstance.current.setLatLng([lat, lng]);
    else markerInstance.current = L.marker([lat, lng]).addTo(mapInstance.current!);
    mapInstance.current?.setView([lat, lng], 14);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setIsLocating(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLocationName(display_name);
        updateMarker(parseFloat(lat), parseFloat(lon));
      }
    } catch (err) { console.error(err); }
    finally { setIsLocating(false); }
  };

  const generateAnalysis = async () => {
    if (!selectedCoords) return;
    setIsLocating(true);
    try {
      // Mock accurate historical data synthesis
      const soilProfile = {
        ph: (5.5 + Math.random() * 2).toFixed(1),
        type: 'Sandy Loam',
        nitrogen: 'Optimal',
        phosphorus: 'Medium',
        potassium: 'High',
        salinity: 'Low'
      };

      const history = Array.from({ length: 5 }, (_, i) => ({
        year: 2019 + i,
        rain: 1100 + Math.random() * 400
      }));

      setAnalysisData({
        lat: selectedCoords[0],
        lng: selectedCoords[1],
        name: locationName || "Custom Plot",
        soil: soilProfile,
        climate: { history, temp: '29°C', humidity: '68%' }
      });
      setStep('analysis');
    } finally { setIsLocating(false); }
  };

  const fetchCrops = async () => {
    setIsLocating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const prompt = `Based on coordinates ${selectedCoords![0]}, ${selectedCoords![1]} during ${currentMonth} and soil pH ${analysisData.soil.ph}, recommend 3 suitable crops.
      For EACH crop, provide exactly 4 distinct seed varieties (e.g. Drought Resistant, Early Maturity, Pest Resistant, High Market Value).
      JSON schema: Array<{ name: string, yieldPotential: number, varieties: Array<{ name: string, description: string, type: 'GMO' | 'Natural' }> }>`;

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
                yieldPotential: { type: Type.NUMBER },
                varieties: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      type: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      });
      setRecommendations(JSON.parse(response.text));
      setStep('crops');
    } catch (err) { console.error(err); }
    finally { setIsLocating(false); }
  };

  if (step === 'analysis') {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
              <div>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Site Analysis Dashboard</h1>
                <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">{analysisData.name}</p>
              </div>
              <button onClick={fetchCrops} className="px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-sm">REVEAL CROP SUITABILITY</button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
                 <h3 className="text-xl font-black text-white uppercase tracking-widest text-xs flex items-center gap-2"><i className="fa-solid fa-flask text-emerald-500"></i> Soil Profile</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {Object.entries(analysisData.soil).map(([k, v]: any) => (
                      <div key={k} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                         <p className="text-[8px] font-black text-slate-500 uppercase mb-1">{k}</p>
                         <p className="text-xs font-black text-white">{v}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="lg:col-span-2 bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
                 <h3 className="text-xl font-black text-white uppercase tracking-widest text-xs flex items-center gap-2"><i className="fa-solid fa-cloud-showers-heavy text-blue-500"></i> 5-Year Rainfall Distribution</h3>
                 <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={analysisData.climate.history}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                          <XAxis dataKey="year" axisLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                          <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px'}} />
                          <Bar dataKey="rain" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (step === 'crops') {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
           <div className="text-center">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Seed Selection Hub</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Personalized recommendations for current season</p>
           </div>

           <div className="grid grid-cols-1 gap-8">
              {recommendations.map(crop => (
                <div key={crop.name} className="bg-white/5 p-8 rounded-[4rem] border border-white/10">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-3xl font-black text-emerald-500 uppercase tracking-tighter">{crop.name}</h3>
                      <div className="px-4 py-2 bg-white/10 rounded-2xl text-xl font-black text-white italic">{crop.yieldPotential}% Potential</div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {crop.varieties.map((v: any) => (
                        <button 
                          key={v.name}
                          onClick={() => onFinalize(analysisData, { ...crop, selectedVariety: v })}
                          className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-left flex flex-col justify-between group"
                        >
                           <div className="space-y-2">
                              <span className="px-2 py-0.5 bg-white/10 rounded text-[8px] font-black uppercase text-slate-500">{v.type}</span>
                              <h4 className="text-sm font-black text-white uppercase leading-tight group-hover:text-emerald-400">{v.name}</h4>
                              <p className="text-[10px] text-slate-500 font-medium line-clamp-3">{v.description}</p>
                           </div>
                           <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              Select <i className="fa-solid fa-arrow-right"></i>
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[700px] overflow-hidden">
        <div className="w-full md:w-3/5 relative h-1/2 md:h-full">
           <div ref={mapContainer} className="absolute inset-0 z-10" />
           <div className="absolute top-6 left-6 z-20 w-full max-w-[calc(100%-48px)]">
              <form onSubmit={handleSearch} className="relative">
                 <input 
                   type="text" placeholder="Type farm address or area..." value={address}
                   onChange={(e) => setAddress(e.target.value)}
                   className="w-full bg-white/95 p-5 pr-16 rounded-3xl shadow-2xl font-bold outline-none border-4 border-transparent focus:border-emerald-500 transition-all"
                 />
                 <button type="submit" className="absolute right-3 top-2 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                    {isLocating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
                 </button>
              </form>
           </div>
        </div>
        <div className="w-full md:w-2/5 p-12 flex flex-col justify-between space-y-8 bg-slate-950 text-white">
           <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Find your <span className="text-emerald-500">Field</span></h2>
              <p className="text-slate-500 font-medium">Search for your plot or tap precisely on the map. This is essential for coordinate-locked soil and climate analysis.</p>
              {selectedCoords && (
                <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10 animate-in zoom-in duration-300">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Target Locked</p>
                   <p className="text-lg font-mono font-bold">{selectedCoords[0].toFixed(5)}, {selectedCoords[1].toFixed(5)}</p>
                </div>
              )}
           </div>
           <button 
             disabled={!selectedCoords || isLocating} 
             onClick={generateAnalysis}
             className="w-full py-6 bg-emerald-500 text-slate-950 font-black text-xl rounded-3xl uppercase tracking-tighter hover:scale-105 active:scale-95 disabled:opacity-20 transition-all"
           >
              Generate Site Report
           </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSetup;
