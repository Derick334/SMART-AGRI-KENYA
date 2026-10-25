import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'compact' | 'hero' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar'
}) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [installing, setInstalling] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInstall = async () => {
    setInstalling(true);
    const accepted = await promptInstall();
    setInstalling(false);
    if (accepted) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  // If already installed as standalone app
  if (isInstalled) {
    if (variant === 'hero' || variant === 'drawer') {
      return (
        <div className="inline-flex items-center gap-1.5 text-xs text-[#214E34] font-semibold bg-[#EBF3ED] px-2.5 py-1.5 rounded-lg border border-[#CFD7CA]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#367C46]" />
          <span>SMART-AGRI Installed</span>
        </div>
      );
    }
    return null;
  }

  // If browser hasn't fired beforeinstallprompt or not installable yet, don't show or show gentle button
  if (!isInstallable) {
    return null;
  }

  if (variant === 'hero') {
    return (
      <button
        onClick={handleInstall}
        disabled={installing}
        className={`inline-flex items-center gap-2 bg-[#214E34] hover:bg-[#183C27] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer border border-[#367C46]/30 ${className}`}
        title="Install SMART-AGRI Kenya app for fast offline access to crops, livestock & weather"
      >
        <Download className="w-4 h-4 text-[#D6A545]" />
        <span>{installing ? 'Installing...' : 'Install App (Offline Ready)'}</span>
      </button>
    );
  }

  if (variant === 'drawer') {
    return (
      <button
        onClick={handleInstall}
        disabled={installing}
        className={`w-full flex items-center justify-between p-2.5 rounded-lg bg-[#EBF3ED] hover:bg-[#DCECE0] text-[#214E34] text-xs font-bold border border-[#CFD7CA] transition cursor-pointer ${className}`}
      >
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-[#367C46]" />
          <span>Install SMART-AGRI Kenya</span>
        </div>
        <span className="text-[10px] bg-[#214E34] text-white px-2 py-0.5 rounded font-semibold">
          Offline App
        </span>
      </button>
    );
  }

  // Default navbar button
  return (
    <button
      onClick={handleInstall}
      disabled={installing}
      className={`inline-flex items-center gap-1.5 bg-[#F7F6F0] hover:bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${className}`}
      title="Install SMART-AGRI Kenya for offline farm access"
      aria-label="Install App for offline use"
    >
      <Download className="w-3.5 h-3.5 text-[#367C46]" />
      <span className="hidden sm:inline">Install App</span>
      <span className="sm:hidden">Install</span>
    </button>
  );
};
