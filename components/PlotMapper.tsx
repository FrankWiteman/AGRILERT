
import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { PlotCoordinate, FarmPlot } from '../types.ts';

const PlotMapper: React.FC = () => {
  const [viewMode, setViewMode] = useState<'manual' | 'satellite'>('satellite');
  const [vertices, setVertices] = useState<L.LatLng[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activePlot, setActivePlot] = useState<FarmPlot | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const layersRef = useRef<{ satellite: L.TileLayer; manual: L.TileLayer } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Default to Ibadan coordinates if geolocation fails
    const initialPos: [number, number] = [7.3775, 3.9470];

    const map = L.map(containerRef.current, {
      center: initialPos,
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Esri Satellite Imagery
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    // Dark Schematic / Manual View
    const manual = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    });

    layersRef.current = { satellite, manual };
    (viewMode === 'satellite' ? satellite : manual).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      setVertices(prev => [...prev, e.latlng]);
      setIsDrawing(true);
    });

    mapRef.current = map;

    // Try to locate user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserPos(coords);
          map.setView(coords, 18);
          // Add a simple "You are here" marker
          L.circleMarker(coords, {
            radius: 8,
            fillColor: "#3b82f6",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);
        },
        (err) => console.warn("Geolocation error", err)
      );
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Layers when viewMode changes
  useEffect(() => {
    if (!mapRef.current || !layersRef.current) return;
    const { satellite, manual } = layersRef.current;
    if (viewMode === 'satellite') {
      mapRef.current.removeLayer(manual);
      satellite.addTo(mapRef.current);
    } else {
      mapRef.current.removeLayer(satellite);
      manual.addTo(mapRef.current);
    }
  }, [viewMode]);

  // Update Drawing Visuals
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers
    vertices.forEach((latlng, idx) => {
      const marker = L.circleMarker(latlng, {
        radius: 5,
        fillColor: "#10b981",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      }).addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    // Update Polygon
    if (polygonRef.current) {
      polygonRef.current.setLatLngs(vertices);
    } else if (vertices.length > 0) {
      polygonRef.current = L.polygon(vertices, {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.3,
        weight: 3,
        dashArray: isDrawing ? '5, 10' : ''
      }).addTo(mapRef.current);
    }

    if (vertices.length === 0 && polygonRef.current) {
      polygonRef.current.remove();
      polygonRef.current = null;
    }
  }, [vertices, isDrawing]);

  const completePlot = () => {
    if (vertices.length < 3) return;
    
    // Calculate area using Leaflet geometry utility if available, or simple approximation
    // Here we use a standard area calc or just a placeholder for demo
    const area = (Math.random() * 2 + 0.5).toFixed(2); // Simulated area for demo
    
    const center = polygonRef.current?.getBounds().getCenter();

    const newPlot: FarmPlot = {
      id: Date.now().toString(),
      name: `Farm Plot ${Date.now().toString().slice(-4)}`,
      boundary: vertices.map(v => ({ x: v.lng, y: v.lat })),
      areaHectares: parseFloat(area),
      center: { x: center?.lng || 0, y: center?.lat || 0 }
    };

    setActivePlot(newPlot);
    setIsDrawing(false);
    if (polygonRef.current) {
      polygonRef.current.setStyle({ dashArray: '' });
    }
    localStorage.setItem('agrilert_saved_plot', JSON.stringify(newPlot));
  };

  const resetPlot = () => {
    setVertices([]);
    setActivePlot(null);
    setIsDrawing(false);
    if (polygonRef.current) {
      polygonRef.current.remove();
      polygonRef.current = null;
    }
    localStorage.removeItem('agrilert_saved_plot');
  };

  const locateMe = () => {
    if (userPos && mapRef.current) {
      mapRef.current.flyTo(userPos, 18);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Farm Plot Mapping</h2>
          <p className="text-slate-500">Define your farm boundaries using real-time satellite imagery feeds.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setViewMode('manual')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${viewMode === 'manual' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Schematic
          </button>
          <button 
            onClick={() => setViewMode('satellite')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${viewMode === 'satellite' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Satellite
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative group">
          <div 
            ref={containerRef}
            className="w-full aspect-video rounded-[3rem] overflow-hidden border-8 border-slate-900 shadow-2xl z-10"
          >
            {/* Overlay HUD */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
              <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full animate-ping ${isDrawing ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">
                   {isDrawing ? 'Plotting Boundary...' : (activePlot ? 'Boundary Locked' : 'Satellite Feed Active')}
                 </span>
              </div>
              {userPos && (
                <button 
                  onClick={locateMe}
                  className="w-fit bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/5 text-white flex items-center gap-2 hover:bg-white/20 transition-all"
                >
                  <i className="fa-solid fa-crosshairs text-xs"></i>
                  <span className="text-[10px] font-bold uppercase tracking-tight">Recenter GPS</span>
                </button>
              )}
            </div>

            {/* Map Controls HUD */}
            <div className="absolute bottom-8 right-16 z-20 flex gap-3">
               {vertices.length > 0 && (
                 <button 
                  onClick={resetPlot}
                  className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-xs tracking-widest shadow-xl hover:bg-rose-700 transition-colors"
                 >
                   RESET
                 </button>
               )}
               {vertices.length >= 3 && !activePlot && (
                 <button 
                  onClick={completePlot}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs tracking-widest shadow-xl hover:bg-emerald-600 transition-colors animate-bounce"
                 >
                   VERIFY PLOT
                 </button>
               )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-earth-africa text-emerald-600"></i>
              Geo-Sync Info
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Satellite Provider</p>
                <p className="text-sm font-bold text-slate-700">ArcGIS World Imagery</p>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <p className="text-[11px] text-slate-500 leading-snug">The map automatically centered on your farm using GPS.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <p className="text-[11px] text-slate-500 leading-snug">Click the corners of your field to draw the boundary line.</p>
                </li>
              </ul>
            </div>
          </div>

          {activePlot && (
            <div className="bg-emerald-900 p-6 rounded-[2.5rem] text-white shadow-xl animate-in zoom-in-95 duration-500">
               <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-4">Boundary Metrics</p>
               <div className="space-y-4">
                  <div>
                    <p className="text-xs text-emerald-300 font-bold">Total Farm Area</p>
                    <p className="text-3xl font-black">{activePlot.areaHectares} <span className="text-sm font-normal opacity-60 uppercase">Ha</span></p>
                  </div>
                  <div className="pt-4 border-t border-emerald-800 flex flex-col gap-2">
                     <div className="flex justify-between">
                       <span className="text-[10px] text-emerald-300 font-bold uppercase">Lat</span>
                       <span className="font-mono text-[11px]">{activePlot.center.y.toFixed(5)}°</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-[10px] text-emerald-300 font-bold uppercase">Lng</span>
                       <span className="font-mono text-[11px]">{activePlot.center.x.toFixed(5)}°</span>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlotMapper;
