import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline, setWasOffline } = useOnlineStatus();
  const [showRestored, setShowRestored] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
        setWasOffline(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, setWasOffline]);

  const handleCheckConnection = async () => {
    setIsChecking(true);
    try {
      await fetch('/api/weather?county=Nairobi&lat=-1.286389&lon=36.817223', {
        method: 'HEAD',
        cache: 'no-store'
      });
    } catch {}
    setTimeout(() => setIsChecking(false), 800);
  };

  if (isOnline && !showRestored) {
    return null;
  }

  if (showRestored) {
    return (
      <aside 
        aria-label="Network status banner"
        className="bg-[#214E34] text-white py-2 px-4 border-b border-[#367C46] shadow-sm transition-all animate-fadeIn"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#D6A545] shrink-0" />
            <span className="font-semibold">
              Internet Connection Restored — Synced with SMART-AGRI Kenya server.
            </span>
          </div>
          <button
            onClick={() => setShowRestored(false)}
            className="text-stone-300 hover:text-white text-[11px] font-semibold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      aria-label="Offline mode indicator"
      className="bg-[#252D27] text-white py-2.5 px-4 border-b-2 border-[#D6A545] shadow-md transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6A545] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D6A545]"></span>
          </span>
          <div className="flex items-center gap-1.5 font-bold text-[#F7F6F0]">
            <WifiOff className="w-4 h-4 text-[#D6A545] shrink-0" />
            <span>Offline Mode Active:</span>
          </div>
          <span className="text-stone-300 hidden md:inline">
            You are browsing cached crops, livestock catalog, agro-weather reports, and saved consultation notes without internet.
          </span>
          <span className="text-stone-300 md:hidden">
            Cached produce, weather & consultation notes available.
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800 text-[#86EFAC] text-[11px] font-mono font-medium border border-stone-700">
            <Database className="w-3 h-3 text-[#22C55E]" />
            Local Cache Ready
          </span>

          <button
            onClick={handleCheckConnection}
            disabled={isChecking}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold border border-stone-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-[#D6A545]' : ''}`} />
            <span>{isChecking ? 'Rechecking...' : 'Retry Connection'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
