
import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { FarmPlot } from '../types.ts';

interface PlotMapperProps {
  location: any;
}

const PlotMapper: React.FC<PlotMapperProps> = ({ location }) => {
  const [viewMode, setViewMode] = useState<'schematic' | 'satellite' | 'walk'>('satellite');
  const [vertices, setVertices] = useState<L.LatLng[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activePlot, setActivePlot] = useState<FarmPlot | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialPos: [number, number] = location ? [location.lat, location.lng] : [7.3775, 3.9470];
    const map = L.map(containerRef.current, {
      center: initialPos,
      zoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (viewMode !== 'walk') {
        setVertices(prev => [...prev, e.latlng]);
        setIsDrawing(true);
      }
    });

    mapRef.current = map;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setGpsAccuracy(pos.coords.accuracy),
      null,
      { enableHighAccuracy: true }
    );

    return () => {
      map.remove();
      mapRef.current = null;
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (viewMode === 'walk') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        });
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [viewMode]);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    vertices.forEach((latlng) => {
      const marker = L.circleMarker(latlng, {
        radius: 6, fillColor: "#10b981", color: "#fff", weight: 2, opacity: 1, fillOpacity: 1
      }).addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    if (polygonRef.current) {
      polygonRef.current.setLatLngs(vertices);
    } else if (vertices.length > 0) {
      polygonRef.current = L.polygon(vertices, {
        color: '#10b981', fillColor: '#10b981', fillOpacity: 0.3, weight: 3
      }).addTo(mapRef.current);
    }

    // Calculate Perimeter Distance
    let dist = 0;
    for (let i = 0; i < vertices.length - 1; i++) {
      dist += vertices[i].distanceTo(vertices[i+1]);
    }
    setTotalDistance(dist);
  }, [vertices]);

  const markCurrentPoint = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const newPoint = L.latLng(pos.coords.latitude, pos.coords.longitude);
      setVertices(prev => [...prev, newPoint]);
      setIsDrawing(true);
      if ('vibrate' in navigator) navigator.vibrate(50);
    }, null, { enableHighAccuracy: true });
  };

  const resetMapping = () => {
    setVertices([]);
    setActivePlot(null);
    setIsDrawing(false);
    if (polygonRef.current) {
      polygonRef.current.remove();
      polygonRef.current = null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Plot Calibration</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Map your farm perimeter to match satellite data.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {['satellite', 'walk'].map((mode) => (
            <button 
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === mode ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              {mode === 'walk' ? 'AR Walk Mode' : mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative h-[60vh] lg:h-[550px] rounded-[3.5rem] overflow-hidden border-8 border-slate-900 shadow-2xl z-10">
          <div ref={containerRef} className={`w-full h-full ${viewMode === 'walk' ? 'opacity-30' : 'opacity-100'}`} />
          
          {viewMode === 'walk' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                 <div className="w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981] animate-pulse"></div>
                 </div>
                 <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10"></div>
                 <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10"></div>
              </div>
              
              <div className="absolute top-8 left-8 space-y-3">
                 <div className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">GPS Status</p>
                    <p className="text-lg font-black font-mono">±{gpsAccuracy?.toFixed(1) || '0.0'}m</p>
                 </div>
                 <div className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Locked Nodes</p>
                    <p className="text-lg font-black font-mono">{vertices.length}</p>
                 </div>
              </div>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <button 
                  onClick={markCurrentPoint}
                  className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center border-8 border-white/20 shadow-2xl active:scale-90 transition-all group"
                >
                   <i className="fa-solid fa-crosshairs text-3xl text-white group-hover:scale-110"></i>
                </button>
              </div>
            </div>
          )}

          <div className="absolute bottom-8 right-8 z-30 flex gap-2">
             {vertices.length > 0 && (
               <button onClick={resetMapping} className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Reset</button>
             )}
             {vertices.length >= 3 && (
               <button className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl animate-bounce">Verify Boundary</button>
             )}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">Calibration Stats</h3>
              <div className="space-y-4">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Perimeter Walked</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{totalDistance.toFixed(1)} <span className="text-xs font-normal opacity-40">m</span></p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mapped Area</p>
                    <p className="text-2xl font-black text-emerald-600">{(totalDistance / 200).toFixed(2)} <span className="text-xs font-normal opacity-40 text-slate-500">Ha</span></p>
                 </div>
              </div>
           </div>

           <div className="bg-emerald-900 p-8 rounded-[3rem] text-white shadow-xl">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Sync Status</p>
              <h4 className="text-lg font-bold leading-tight">Matching boundary nodes to satellite infrared imagery...</h4>
              <div className="mt-6 flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Active Geocache</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PlotMapper;
