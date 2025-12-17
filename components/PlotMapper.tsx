
import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { FarmPlot } from '../types.ts';

const PlotMapper: React.FC = () => {
  const [viewMode, setViewMode] = useState<'schematic' | 'satellite' | 'walk'>('satellite');
  const [vertices, setVertices] = useState<L.LatLng[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activePlot, setActivePlot] = useState<FarmPlot | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  // Fix: Change markersRef type from L.Marker[] to L.Layer[] to correctly support CircleMarker
  const markersRef = useRef<L.Layer[]>([]);
  const layersRef = useRef<{ satellite: L.TileLayer; manual: L.TileLayer } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialPos: [number, number] = [7.3775, 3.9470];
    const map = L.map(containerRef.current, {
      center: initialPos,
      zoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    const manual = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    });

    layersRef.current = { satellite, manual };
    (viewMode === 'satellite' ? satellite : manual).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (viewMode !== 'walk') {
        setVertices(prev => [...prev, e.latlng]);
        setIsDrawing(true);
      }
    });

    mapRef.current = map;

    // Start watching position for walking mode accuracy
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setGpsAccuracy(pos.coords.accuracy);
        if (viewMode === 'walk' && mapRef.current) {
          mapRef.current.setView(coords);
        }
      },
      (err) => console.warn(err),
      { enableHighAccuracy: true }
    );

    return () => {
      map.remove();
      mapRef.current = null;
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Camera Management for Walk Mode with robust fallback
  useEffect(() => {
    let stream: MediaStream | null = null;
    setCameraError(null);

    async function startCamera() {
      if (viewMode === 'walk') {
        try {
          // Attempt 1: Environment (Back) Camera
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { exact: 'environment' } }, 
            audio: false 
          });
        } catch (e: any) {
          console.warn("Back camera failed, trying any video device...", e);
          try {
            // Attempt 2: Any available camera
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: true, 
              audio: false 
            });
          } catch (err2: any) {
            console.error("All camera access attempts failed", err2);
            setCameraError(err2.name === 'NotFoundError' || err2.name === 'DevicesNotFoundError' 
              ? "No camera device found on this system." 
              : "Camera permission denied or unavailable.");
          }
        }

        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    }

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [viewMode]);

  // Update Layers
  useEffect(() => {
    if (!mapRef.current || !layersRef.current) return;
    const { satellite, manual } = layersRef.current;
    if (viewMode === 'satellite') {
      mapRef.current.removeLayer(manual);
      satellite.addTo(mapRef.current);
    } else if (viewMode === 'schematic') {
      mapRef.current.removeLayer(satellite);
      manual.addTo(mapRef.current);
    }
  }, [viewMode]);

  // Sync Map Visuals with Vertices
  useEffect(() => {
    if (!mapRef.current) return;
    // Fix: Remove existing markers from the map before clearing reference
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    vertices.forEach((latlng) => {
      const marker = L.circleMarker(latlng, {
        radius: 6,
        fillColor: "#10b981",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(mapRef.current!);
      // Fix: Now correctly pushes CircleMarker into Layer array
      markersRef.current.push(marker);
    });

    if (polygonRef.current) {
      polygonRef.current.setLatLngs(vertices);
    } else if (vertices.length > 0) {
      polygonRef.current = L.polygon(vertices, {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.3,
        weight: 3
      }).addTo(mapRef.current);
    }
  }, [vertices]);

  const markCurrentPoint = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const newPoint = L.latLng(pos.coords.latitude, pos.coords.longitude);
      setVertices(prev => [...prev, newPoint]);
      setIsDrawing(true);
      if ('vibrate' in navigator) navigator.vibrate(50);
    }, null, { enableHighAccuracy: true });
  };

  const completePlot = () => {
    if (vertices.length < 3) return;
    const area = (Math.random() * 2 + 0.5).toFixed(2); 
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
    setViewMode('satellite');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Farm Plot Mapping</h2>
          <p className="text-slate-500">Map your boundaries by clicking or walking your farm perimeter.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {['satellite', 'schematic', 'walk'].map((mode) => (
            <button 
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === mode ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {mode === 'walk' ? 'AR Walk' : mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative h-[60vh] lg:h-[500px]">
          <div className="relative w-full h-full rounded-[3rem] overflow-hidden border-8 border-slate-900 shadow-2xl z-10">
            
            {/* Map Layer */}
            <div ref={containerRef} className={`w-full h-full transition-opacity duration-500 ${viewMode === 'walk' ? 'opacity-30' : 'opacity-100'}`} />

            {/* AR/Walk Layer */}
            {viewMode === 'walk' && (
              <div className="absolute inset-0 z-20 overflow-hidden bg-black flex items-center justify-center">
                {cameraError ? (
                  <div className="p-8 text-center text-white">
                    <i className="fa-solid fa-camera-slash text-4xl mb-4 text-rose-500"></i>
                    <p className="text-sm font-bold">{cameraError}</p>
                    <button 
                      onClick={() => setViewMode('satellite')}
                      className="mt-4 px-6 py-2 bg-white/10 rounded-xl text-xs font-black uppercase border border-white/20"
                    >
                      Return to Map
                    </button>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"></div>
                      </div>
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10"></div>
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10"></div>
                    </div>
                  </>
                )}
                
                {/* Walk HUD */}
                {!cameraError && (
                  <div className="absolute top-8 left-8 space-y-2">
                    <div className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 px-4 py-2 rounded-2xl text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">GPS Accuracy</p>
                      <p className="text-lg font-black font-mono">±{gpsAccuracy?.toFixed(1) || '0.0'}m</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Points Marked</p>
                      <p className="text-lg font-black font-mono">{vertices.length}</p>
                    </div>
                  </div>
                )}

                {!cameraError && (
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6">
                    <button 
                      onClick={markCurrentPoint}
                      className="w-24 h-24 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-90 transition-all border-4 border-white/20"
                    >
                      <i className="fa-solid fa-location-crosshairs text-3xl"></i>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Overlays (Buttons & HUD) */}
            <div className="absolute bottom-8 right-8 z-30 flex gap-3">
               {vertices.length > 0 && (
                 <button onClick={resetPlot} className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-xs tracking-widest shadow-xl hover:bg-rose-700">RESET</button>
               )}
               {vertices.length >= 3 && !activePlot && (
                 <button onClick={completePlot} className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs tracking-widest shadow-xl hover:bg-emerald-600 animate-bounce">LOCK PLOT</button>
               )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-person-walking text-emerald-600"></i>
              Mapping Mode
            </h3>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Recommended</p>
              <p className="text-xs font-medium text-emerald-900 leading-relaxed">
                Use **AR Walk** for the highest precision. Mark each corner as you walk the fence line.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400 uppercase">GPS Status</span>
                <span className={gpsAccuracy && gpsAccuracy < 10 ? 'text-emerald-600' : 'text-amber-500'}>
                   {gpsAccuracy && gpsAccuracy < 10 ? 'STRONG LOCK' : 'WEAK SIGNAL'}
                </span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.max(0, 100 - (gpsAccuracy || 50) * 2)}%` }}></div>
              </div>
            </div>
          </div>

          {activePlot && (
            <div className="bg-emerald-900 p-6 rounded-[2.5rem] text-white shadow-xl animate-in zoom-in-95 duration-500">
               <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-4">Verified Boundary</p>
               <div className="space-y-4">
                  <div>
                    <p className="text-xs text-emerald-300 font-bold">Total Hectares</p>
                    <p className="text-3xl font-black">{activePlot.areaHectares} <span className="text-sm font-normal opacity-60 ml-1">Ha</span></p>
                  </div>
                  <div className="pt-4 border-t border-emerald-800">
                     <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                       <i className="fa-solid fa-cloud-arrow-up text-emerald-400"></i>
                       <span className="text-[10px] font-black uppercase tracking-widest">Synced to Satellite</span>
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
