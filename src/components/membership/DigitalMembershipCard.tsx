import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  MapPin, 
  Calendar, 
  ExternalLink,
  QrCode,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../../types';

interface DigitalMembershipCardProps {
  user: UserProfile;
  onVerifyOnline?: (code: string) => void;
  showActions?: boolean;
  showQrCode?: boolean;
}

export const DigitalMembershipCard: React.FC<DigitalMembershipCardProps> = ({
  user,
  onVerifyOnline,
  showActions = true,
}) => {
  const [copied, setCopied] = useState(false);

  const memberCode = user.membershipCode || user.memberId || 'SA-2026-F48291';
  const roleName = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(memberCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Color schemes based on member category
  const roleThemes: Record<string, { bgGradient: string; badgeBg: string; textAccent: string; label: string }> = {
    farmer: {
      bgGradient: 'from-[#1B432C] via-[#214E34] to-[#122B1C]',
      badgeBg: 'bg-[#367C46]',
      textAccent: 'text-[#D6A545]',
      label: 'Registered Smallholder / Commercial Farmer'
    },
    expert: {
      bgGradient: 'from-[#183926] via-[#1F5435] to-[#0E2818]',
      badgeBg: 'bg-[#2E7D32]',
      textAccent: 'text-[#81C784]',
      label: 'Accredited Agricultural Specialist / Agronomist'
    },
    agribusiness: {
      bgGradient: 'from-[#3A2A1A] via-[#523A22] to-[#241A10]',
      badgeBg: 'bg-[#8D5B28]',
      textAccent: 'text-[#FFD54F]',
      label: 'Certified Agro-Enterprise / Input Stockist'
    },
    student: {
      bgGradient: 'from-[#103438] via-[#1A4D53] to-[#091F22]',
      badgeBg: 'bg-[#00897B]',
      textAccent: 'text-[#80CBC4]',
      label: 'Agricultural Scholar / Research Fellow'
    },
    cooperative: {
      bgGradient: 'from-[#232042] via-[#353063] to-[#141226]',
      badgeBg: 'bg-[#5C6BC0]',
      textAccent: 'text-[#9FA8DA]',
      label: 'Registered Producer Cooperative / SACCO'
    },
    extension: {
      bgGradient: 'from-[#33381B] via-[#464D23] to-[#1E210F]',
      badgeBg: 'bg-[#689F38]',
      textAccent: 'text-[#C5E1A5]',
      label: 'County Agricultural Extension Officer'
    },
    admin: {
      bgGradient: 'from-[#2A1810] via-[#3D2214] to-[#160B06]',
      badgeBg: 'bg-[#D6A545] text-[#252D27]',
      textAccent: 'text-[#FFD54F]',
      label: 'National Agricultural Registry Administrator'
    }
  };

  const theme = roleThemes[user.role] || roleThemes.farmer;
  const isStatusActive = user.status === 'active' || !user.status;

  // Build verification QR URL
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://smart-agri.ke'}#verify?code=${encodeURIComponent(memberCode)}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(verifyUrl)}&bgcolor=FFFFFF&color=214E34&margin=1`;

  return (
    <div className="space-y-4">
      {/* Printable ID Card Container */}
      <div 
        id="smart-agri-membership-card" 
        className={`w-full max-w-md mx-auto rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-[#446F52] bg-gradient-to-br ${theme.bgGradient} relative overflow-hidden select-none`}
      >
        {/* Subtle Watermark & Guilloche Graphic */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-[#D6A545]/10 pointer-events-none blur-2xl" />
        <div className="absolute left-0 bottom-0 -translate-x-8 translate-y-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-xl" />

        {/* Card Header: Emblem & National Registry Title */}
        <div className="flex items-start justify-between pb-4 border-b border-white/15 gap-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center font-black text-base text-[#D6A545] shadow-xs">
              SAK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm tracking-wider uppercase text-white">SMART-AGRI KENYA</h3>
                <ShieldCheck className="w-4 h-4 text-[#81C784]" />
              </div>
              <p className="text-[10px] text-white/80 font-medium">National Agricultural Digital Registry</p>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wider ${theme.badgeBg}`}>
              {isStatusActive ? 'Verified Member' : 'Pending Verification'}
            </span>
            <span className="block text-[9px] text-[#D6A545] font-mono mt-0.5">Republic of Kenya</span>
          </div>
        </div>

        {/* Card Body: Avatar, Name, Role & Location */}
        <div className="py-5 flex items-center gap-4 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/15 overflow-hidden shrink-0 border-2 border-[#D6A545]/60 shadow-md flex items-center justify-center">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-3xl font-black text-white">{user.name.charAt(0)}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-lg sm:text-xl font-extrabold text-white leading-tight truncate">
              {user.name}
            </h4>
            <div className={`text-xs font-bold ${theme.textAccent} mt-0.5 capitalize`}>
              {roleName} · {user.membershipTier || 'Standard'} Tier
            </div>
            <p className="text-[11px] text-white/80 mt-1 line-clamp-1">
              {theme.label}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-white/70">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D6A545]" /> {user.county} County
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#D6A545]" /> Reg: {user.joinedDate || '2026-03'}
              </span>
            </div>
          </div>
        </div>

        {/* Farm / Business Affiliation Info */}
        {(user.farmName || user.businessName || user.organizationName || user.institution) && (
          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-[11px] text-white/90 border border-white/10 mb-4 flex items-center justify-between relative z-10">
            <span className="text-white/60 text-[10px]">Affiliated Entity:</span>
            <span className="font-semibold truncate max-w-[240px]">
              {user.farmName || user.businessName || user.organizationName || user.institution}
            </span>
          </div>
        )}

        {/* Card Footer: Official Unique Code & QR Code */}
        <div className="p-3.5 bg-black/45 backdrop-blur-md rounded-xl border border-white/15 flex items-center justify-between gap-3 relative z-10">
          <div className="min-w-0">
            <span className="text-[9px] text-[#D6A545] font-mono font-bold tracking-wider uppercase block">
              Permanent Membership ID
            </span>
            <span className="font-mono text-base sm:text-lg font-black text-white tracking-widest block truncate">
              {memberCode}
            </span>
            <span className="text-[9px] text-white/60 block mt-0.5">
              Scan QR code to verify validity on National Registry
            </span>
          </div>

          <div className="shrink-0 p-1 bg-white rounded-lg shadow-sm border border-[#D6A545]">
            <img 
              src={qrSvgUrl} 
              alt={`QR verification for ${memberCode}`}
              className="w-14 h-14 object-contain rounded"
            />
          </div>
        </div>

        {/* Micro-text security notice */}
        <div className="mt-3 text-center text-[9px] text-white/50 tracking-wider uppercase font-mono">
          Ministry of Agriculture & Livestock Development Compliance Code · SAK-2026
        </div>
      </div>

      {/* Action Controls (Print, Download PDF, Copy Code, Online Verification) */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto pt-2">
          <button
            onClick={handleCopyCode}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#F7F6F0] text-[#214E34] border border-[#CFD7CA] px-3 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#367C46]" /> : <Copy className="w-3.5 h-3.5 text-[#367C46]" />}
            <span>{copied ? 'Code Copied' : 'Copy Number'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 bg-[#214E34] hover:bg-[#183C27] text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#D6A545]" />
            <span>Print / Save PDF</span>
          </button>

          {onVerifyOnline && (
            <button
              onClick={() => onVerifyOnline(memberCode)}
              className="inline-flex items-center justify-center gap-1.5 bg-[#EBF3ED] hover:bg-[#DCECE0] text-[#214E34] border border-[#CFD7CA] px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#367C46]" />
              <span>Verify Online</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
