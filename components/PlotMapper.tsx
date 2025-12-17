
import React, { useState, useRef, useEffect } from 'react';
import { PlotCoordinate, FarmPlot } from '../types.ts';

const PlotMapper: React.FC = () => {
  const [viewMode, setViewMode] = useState<'manual' | 'satellite'>('satellite');
  const [vertices, setVertices] = useState<PlotCoordinate[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoverPos, setHoverPos] = useState<PlotCoordinate | null>(null);
  const [activePlot, setActivePlot] = useState<FarmPlot | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setVertices([...vertices, { x, y }]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPos({ x, y });
  };

  const completePlot = () => {
    if (vertices.length < 3) return;
    
    // Simple area calculation for UI (shoelace formula approximation)
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      let j = (i + 1) % vertices.length;
      area += vertices[i].x * vertices[j].y;
      area -= vertices[j].x * vertices[i].y;
    }
    const finalArea = Math.abs(area) / 20; // Scalar for demo
    
    const centerX = vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
    const centerY = vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;

    const newPlot: FarmPlot = {
      id: Date.now().toString(),
      name: `Farm Plot ${Date.now().toString().slice(-4)}`,
      boundary: vertices,
      areaHectares: parseFloat(finalArea.toFixed(2)),
      center: { x: centerX, y: centerY }
    };

    setActivePlot(newPlot);
    setIsDrawing(false);
    // In a real app, we'd save this to localStorage or a database
    localStorage.setItem('agrilert_saved_plot', JSON.stringify(newPlot));
  };

  const resetPlot = () => {
    setVertices([]);
    setActivePlot(null);
    setIsDrawing(false);
    localStorage.removeItem('agrilert_saved_plot');
  };

  // SVG path for the polygon
  const polyPath = vertices.length > 0 
    ? `M ${vertices.map(v => `${v.x},${v.y}`).join(' L ')} ${isDrawing && hoverPos ? `L ${hoverPos.x},${hoverPos.y}` : 'Z'}`
    : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Farm Plot Mapping</h2>
          <p className="text-slate-500">Define your precise farm boundaries for targeted climate alerts.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setViewMode('manual')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${viewMode === 'manual' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Manual
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
        {/* Main Map Canvas */}
        <div className="lg:col-span-3 relative group">
          <div 
            ref={containerRef}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            className={`relative w-full aspect-video rounded-[3rem] overflow-hidden border-8 border-slate-900 shadow-2xl cursor-crosshair transition-all duration-700
              ${viewMode === 'satellite' ? 'bg-[url("https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=2000")] bg-cover' : 'bg-slate-950'}
            `}
          >
            {/* View Layer Overlay */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${viewMode === 'satellite' ? 'bg-black/20' : 'bg-transparent'}`}></div>
            
            {/* Grid for Manual Mode */}
            {viewMode === 'manual' && (
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            )}

            {/* Drawing Layer */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none preserve-3d">
              {vertices.length > 0 && (
                <>
                  <path 
                    d={polyPath} 
                    fill="rgba(16, 185, 129, 0.2)" 
                    stroke="#10b981" 
                    strokeWidth="0.5" 
                    strokeDasharray={isDrawing ? "1 1" : "0"}
                  />
                  {vertices.map((v, i) => (
                    <circle key={i} cx={v.x} cy={v.y} r="1" fill="#10b981" className="animate-pulse shadow-lg" />
                  ))}
                </>
              )}
            </svg>

            {/* Interactive HUD Elements */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">
                   {isDrawing ? 'Plotting Boundary...' : (activePlot ? 'Boundary Verified' : 'Awaiting Inputs')}
                 </span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 right-8 flex gap-3">
               {vertices.length > 0 && (
                 <button 
                  onClick={(e) => { e.stopPropagation(); resetPlot(); }}
                  className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-xs tracking-widest shadow-xl hover:bg-rose-700 transition-colors"
                 >
                   RESET
                 </button>
               )}
               {vertices.length >= 3 && !activePlot && (
                 <button 
                  onClick={(e) => { e.stopPropagation(); completePlot(); }}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs tracking-widest shadow-xl hover:bg-emerald-600 transition-colors animate-bounce"
                 >
                   COMPLETE PLOT
                 </button>
               )}
            </div>
          </div>
        </div>

        {/* Side Info / Instructions */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-emerald-600"></i>
              Mapping Guide
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Toggle Satellite view to locate your field on the regional map.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Click on the map to place vertices along the perimeter of your farm.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Once closed, the system will calculate the total area and sync alerts.</p>
              </li>
            </ul>
          </div>

          {activePlot && (
            <div className="bg-emerald-900 p-6 rounded-[2.5rem] text-white shadow-xl animate-in zoom-in-95 duration-500">
               <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-4">Plot Diagnostics</p>
               <div className="space-y-4">
                  <div>
                    <p className="text-xs text-emerald-300 font-bold">Calculated Area</p>
                    <p className="text-3xl font-black">{activePlot.areaHectares} <span className="text-sm font-normal opacity-60 uppercase">Ha</span></p>
                  </div>
                  <div className="pt-4 border-t border-emerald-800 flex justify-between">
                     <div>
                       <p className="text-[10px] text-emerald-300 font-bold">Center X</p>
                       <p className="font-mono text-sm">{activePlot.center.x.toFixed(2)}%</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-emerald-300 font-bold">Center Y</p>
                       <p className="font-mono text-sm">{activePlot.center.y.toFixed(2)}%</p>
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
