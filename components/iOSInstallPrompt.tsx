import React, { useState, useEffect } from 'react';

// Renamed to IOSInstallPrompt so it's recognized as a React component in JSX
const IOSInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect if device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    // Check if app is already in standalone mode (installed)
    const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;

    // Check if the user has dismissed the prompt in this session
    const isDismissed = sessionStorage.getItem('ios_install_prompt_dismissed');

    if (isIOS && !isStandalone && !isDismissed) {
      // Small delay to ensure the page is loaded
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('ios_install_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[60] animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-5 rounded-[2.5rem] shadow-2xl flex items-center gap-4 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
        
        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-600">
          <i className="fa-solid fa-square-plus text-xl"></i>
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-black text-slate-900 leading-tight">Install AGRILERT Hub</p>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Tap <i className="fa-solid fa-arrow-up-from-bracket text-emerald-600 mx-0.5"></i> then <span className="font-bold text-slate-800">"Add to Home Screen"</span> to bookmark this app on your iPhone.
          </p>
        </div>

        <button 
          onClick={handleDismiss}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default IOSInstallPrompt;