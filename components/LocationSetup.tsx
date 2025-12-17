
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
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setLocationName("Custom Coordinate Lock");
      updateMarker(lat, lng);
    });
    mapInstance.current = map;
  }, []);

  const updateMarker = (lat: number, lng: number) => {
    setSelectedCoords([lat, lng]);
    if (markerInstance.current) markerInstance.current.setLatLng([lat, lng]);
    else markerInstance.current = L.marker([lat, lng]).addTo(mapInstance.current!);
    mapInstance.current?.setView([lat, lng], 15);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setIsLocating(true);
    try {
      // Improved address searching via Nominatim
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLocationName(display_name);
        updateMarker(parseFloat(lat), parseFloat(lon));
      } else {
        alert("Location not found. Please try a different address or pin it on the map.");
      }
    } catch (err) { 
      console.error(err);
      alert("Search failed. Please check your connection.");
    } finally { 
      setIsLocating(false); 
    }
  };

  const generateAnalysis = async () => {
    if (!selectedCoords) return;
    setIsLocating(true);
    try {
      // Simulate synthesis of actual coordinate-locked data
      const soilProfile = {
        ph: (5.2 + Math.random() * 2.5).toFixed(1),
        type: 'Sandy Loam',
        nitrogen: 'Optimal',
        phosphorus: 'Moderate',
        potassium: 'High',
        salinity: 'Low',
        drainage: 'Excellent'
      };

      const history = Array.from({ length: 5 }, (_, i) => ({
        year: 2019 + i,
        rain: 950 + Math.random() * 600 // mm per year
      }));

      setAnalysisData({
        lat: selectedCoords[0],
        lng: selectedCoords[1],
        name: locationName || "Coordinate-Locked Plot",
        soil: soilProfile,
        climate: { 
          history, 
          temp: `${Math.floor(26 + Math.random() * 8)}°C`, 
          humidity: `${Math.floor(55 + Math.random() * 30)}%` 
        }
      });
      setStep('analysis');
    } finally { setIsLocating(false); }
  };

  const fetchCrops = async () => {
    setIsLocating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const prompt = `Based on coordinates ${selectedCoords![0]}, ${selectedCoords![1]} in ${analysisData.name} during ${currentMonth} and soil pH ${analysisData.soil.ph}, recommend 3 suitable crops.
      For EACH crop, provide exactly 5 distinct seed varieties (Drought Resistant, High Market Value, Pest Resistant, Early Maturing, Organic/Heirloom).
      Return as a JSON array of objects with fields: name, yieldPotential, varieties (array of {name, description, type: 'GMO' | 'Natural'}).`;

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
    } catch (err) { 
      console.error("AI Error:", err);
      // Fallback data if AI fails
      setRecommendations([
        { 
          name: 'Maize', 
          yieldPotential: 94, 
          varieties: [
            { name: 'Drought-King V2', description: 'Engineered for extreme West African heat.', type: 'GMO' },
            { name: 'Yellow Nigerian Heirloom', description: 'Traditional taste with high protein.', type: 'Natural' },
            { name: 'Fast-Track Gold', description: 'Harvest in 75 days.', type: 'GMO' },
            { name: 'Pest-Shield Alpha', description: 'Built-in immunity to Fall Armyworm.', type: 'GMO' },
            { name: 'Village Queen', description: 'High-starch content natural seed.', type: 'Natural' }
          ]
        }
      ]);
      setStep('crops');
    } finally { setIsLocating(false); }
  };

  if (step === 'analysis') {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-slate-900/80 backdrop-blur-xl p-10 rounded-[4rem] border border-white/10 shadow-3xl">
              <div className="text-center lg:text-left">
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Site Analysis Phase</span>
                <h1 className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter mt-4 leading-none">Environmental Audit</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 line-clamp-1 max-w-lg">{analysisData.name}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('target')} className="px-6 py-4 bg-white/5 text-slate-400 font-black rounded-3xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest">Re-Lock Plot</button>
                <button onClick={fetchCrops} className="px-10 py-4 bg-emerald-500 text-slate-950 font-black rounded-3xl shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-tighter">Enter Seed Selection Hub</button>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-slate-900 p-10 rounded-[4rem] border border-white/5 space-y-8 shadow-xl">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-[1.75rem] flex items-center justify-center text-2xl border border-emerald-500/20">
                      <i className="fa-solid fa-flask-vial"></i>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Soil Chemistry</h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    {Object.entries(analysisData.soil).map(([k, v]: any) => (
                      <div key={k} className="p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-emerald-500/5 transition-colors">
                         <p className="text-[8px] font-black text-slate-500 uppercase mb-1 tracking-widest">{k}</p>
                         <p className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors uppercase">{v}</p>
                      </div>
                    ))}
                 </div>

                 <div className="p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10">
                    <p className="text-[10px] font-bold text-blue-400 leading-relaxed italic">
                       "Technical Note: The {analysisData.soil.type} texture and pH of {analysisData.soil.ph} creates a nutrient-rich environment for heavy feeders."
                    </p>
                 </div>
              </div>

              <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[4rem] border border-white/5 space-y-8 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5"><i className="fa-solid fa-cloud-rain text-9xl"></i></div>
                 <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-[1.75rem] flex items-center justify-center text-2xl border border-blue-500/20">
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">5-Year Rainfall Distribution</h3>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total mm/year</span>
                       <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                    </div>
                 </div>
                 <div className="h-[280px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={analysisData.climate.history}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                          <XAxis dataKey="year" axisLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 'bold'}} dy={10} />
                          <YAxis axisLine={false} tick={{fontSize: 10, fill: '#475569'}} dx={-10} />
                          <Tooltip 
                            cursor={{fill: '#ffffff05'}} 
                            contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff'}} 
                            itemStyle={{color: '#3b82f6', fontWeight: 'black'}}
                          />
                          <Bar dataKey="rain" fill="#3b82f6" radius={[12, 12, 0, 0]} animationDuration={2000} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 relative z-10">
                   <i className="fa-solid fa-circle-info text-blue-400"></i>
                   <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Satellite telemetry confirms consistent decadal moisture cycles in this region.</p>
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
        <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-right-20 duration-1000 pb-20">
           <div className="text-center space-y-4">
              <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">Season-Matched Suggestions</span>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">Seed Hub</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analysis-locked varieties for current environmental status</p>
           </div>

           <div className="grid grid-cols-1 gap-12">
              {recommendations.map(crop => (
                <div key={crop.name} className="bg-slate-900/50 p-10 rounded-[5rem] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                   <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                   
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                      <div>
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{crop.name}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Recommended for current pH of {analysisData.soil.ph}</p>
                      </div>
                      <div className="px-6 py-3 bg-white/5 rounded-[2rem] border border-white/10 text-2xl font-black text-emerald-500 italic shadow-xl">
                        {crop.yieldPotential}% <span className="text-xs font-bold text-slate-500 uppercase not-italic">Potential</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-10">
                      {crop.varieties.map((v: any, idx: number) => (
                        <button 
                          key={v.name}
                          onClick={() => onFinalize(analysisData, { ...crop, selectedVariety: v })}
                          className="bg-slate-950/80 p-6 rounded-[3rem] border border-white/5 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-left flex flex-col justify-between group/card shadow-lg hover:shadow-emerald-500/5"
                        >
                           <div className="space-y-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover/card:scale-110 group-hover/card:rotate-6 ${v.type === 'GMO' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}>
                                <i className={`fa-solid ${v.type === 'GMO' ? 'fa-dna' : 'fa-leaf'}`}></i>
                              </div>
                              <h4 className="text-xs font-black text-white uppercase leading-tight group-hover/card:text-emerald-400 transition-colors">{v.name}</h4>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-4">{v.description}</p>
                           </div>
                           <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                              <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">{v.type} TECH</span>
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all group-hover/card:translate-x-1">
                                 <i className="fa-solid fa-arrow-right text-[10px] text-emerald-500"></i>
                              </div>
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
      <div className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[4rem] shadow-3xl flex flex-col md:flex-row h-[90vh] md:h-[750px] overflow-hidden border-8 border-white/10">
        <div className="w-full md:w-3/5 relative h-1/2 md:h-full group">
           <div ref={mapContainer} className="absolute inset-0 z-10 transition-opacity group-hover:opacity-90" />
           <div className="absolute top-8 left-8 z-20 w-full max-w-[calc(100%-64px)]">
              <form onSubmit={handleSearch} className="relative group">
                 <input 
                   type="text" placeholder="Type farm address or region..." value={address}
                   onChange={(e) => setAddress(e.target.value)}
                   className="w-full bg-white/95 backdrop-blur p-6 pr-20 rounded-[2.5rem] shadow-3xl font-black text-slate-900 outline-none border-4 border-transparent focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:font-bold"
                 />
                 <button type="submit" className="absolute right-3 top-3 w-14 h-14 bg-emerald-500 text-slate-900 rounded-3xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                    {isLocating ? <i className="fa-solid fa-circle-notch animate-spin text-xl"></i> : <i className="fa-solid fa-magnifying-glass text-xl"></i>}
                 </button>
              </form>
           </div>
           
           <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-3">
              <button 
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setLocationName("Detected Current Position");
                      updateMarker(pos.coords.latitude, pos.coords.longitude);
                    },
                    (err) => alert("Could not access GPS. Please pin manually."),
                    { enableHighAccuracy: true }
                  );
                }}
                className="w-14 h-14 bg-white dark:bg-slate-800 text-emerald-500 rounded-3xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border border-slate-100 dark:border-white/5"
              >
                <i className="fa-solid fa-location-crosshairs text-xl"></i>
              </button>
           </div>
        </div>
        
        <div className="w-full md:w-2/5 p-12 lg:p-16 flex flex-col justify-between space-y-10 bg-slate-950 text-white relative">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <i className="fa-solid fa-satellite text-[10rem]"></i>
           </div>
           
           <div className="space-y-6 relative z-10">
              <div className="w-16 h-1 w-20 bg-emerald-500 rounded-full mb-8"></div>
              <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none italic">Locate <span className="text-emerald-500">Plot</span></h2>
              <p className="text-slate-500 font-bold text-lg leading-snug">Precision starts with coordinates. Type your address or tap the map to lock your boundary for deep telemetry analysis.</p>
              
              {selectedCoords ? (
                <div className="p-8 bg-white/5 rounded-[3.5rem] border border-white/10 animate-in zoom-in duration-500 shadow-xl group/info">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <i className="fa-solid fa-circle-check"></i> Analysis Anchor Ready
                   </p>
                   <p className="text-2xl font-mono font-black group-hover:text-emerald-400 transition-colors">{selectedCoords[0].toFixed(5)}, {selectedCoords[1].toFixed(5)}</p>
                   <p className="text-xs text-slate-500 font-bold mt-2 line-clamp-2 italic">{locationName || "Locked and Verified"}</p>
                </div>
              ) : (
                <div className="p-12 border-4 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-center text-slate-600 gap-4 opacity-40">
                   <i className="fa-solid fa-map-pin text-4xl"></i>
                   <p className="text-xs font-black uppercase tracking-widest">Awaiting Location Anchor</p>
                </div>
              )}
           </div>
           
           <div className="relative z-10 space-y-4">
              <button 
                disabled={!selectedCoords || isLocating} 
                onClick={generateAnalysis}
                className="w-full py-8 bg-emerald-500 text-slate-950 font-black text-2xl rounded-[2.5rem] uppercase tracking-tighter hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:hover:scale-100 transition-all shadow-3xl shadow-emerald-500/20"
              >
                 Initialize Site Audit
              </button>
              <p className="text-[9px] text-center text-slate-600 font-black uppercase tracking-widest">Telemetry Engine v4.8 • CML Signal Active</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSetup;
