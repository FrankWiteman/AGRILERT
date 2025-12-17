
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

interface Props {
  onComplete: (location: any) => void;
}

const LocationSetup: React.FC<Props> = ({ onComplete }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current, {
      center: [9.0820, 8.6753], // Nigeria center
      zoom: 6,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setSelectedCoords([lat, lng]);
      if (markerInstance.current) {
        markerInstance.current.setLatLng(e.latlng);
      } else {
        markerInstance.current = L.marker(e.latlng).addTo(map);
      }
    });

    mapInstance.current = map;
  }, []);

  const handleConfirm = () => {
    if (!selectedCoords) return;
    setIsLocating(true);
    // Simulate deep coordinate analysis
    setTimeout(() => {
      onComplete({
        lat: selectedCoords[0],
        lng: selectedCoords[1],
        name: "Plot Alpha",
        region: "Selected Region",
        soil: { ph: 6.5, type: 'Sandy Loam', nitrogen: 'Medium' }
      });
    }, 2000);
  };

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      setSelectedCoords(coords);
      mapInstance.current?.setView(coords, 15);
      if (markerInstance.current) {
        markerInstance.current.setLatLng(coords);
      } else {
        markerInstance.current = L.marker(coords).addTo(mapInstance.current!);
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-emerald-950 p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[600px]">
        <div className="w-full md:w-1/2 relative h-64 md:h-full bg-slate-200">
          <div ref={mapContainer} className="absolute inset-0 z-10" />
          <div className="absolute top-4 left-4 z-20">
             <button onClick={useCurrentLocation} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg text-emerald-600 hover:scale-105 transition-transform">
               <i className="fa-solid fa-location-crosshairs"></i>
             </button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Farm Anchor</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Pinpoint your farm on the map to unlock localized soil and climate data.</p>
            
            {selectedCoords ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Locked Coordinates</p>
                <p className="text-lg font-mono font-bold dark:text-emerald-400">{selectedCoords[0].toFixed(4)}, {selectedCoords[1].toFixed(4)}</p>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-center text-center text-slate-400 text-sm italic">
                Tap the map to select your cultivation area
              </div>
            )}
          </div>

          <button 
            disabled={!selectedCoords || isLocating}
            onClick={handleConfirm}
            className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3"
          >
            {isLocating ? <i className="fa-solid fa-spinner animate-spin"></i> : "SYNC LOCATION"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSetup;
