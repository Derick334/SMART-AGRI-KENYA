import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  MapPin,
  CheckCircle2,
  Award,
  QrCode,
  Copy,
  Check,
  X
} from 'lucide-react';
import { agriStore } from '../services/store';
import { UserRole } from '../types';

// Role Dashboards
import { FarmerDashboardPage } from './FarmerDashboardPage';
import { BuyerDashboardPage } from './BuyerDashboardPage';
import { SellerDashboardPage } from './SellerDashboardPage';
import { ConsultantDashboardPage } from './ConsultantDashboardPage';
import { VeterinarianDashboardPage } from './VeterinarianDashboardPage';
import { TransporterDashboardPage } from './TransporterDashboardPage';
import { LabPartnerDashboardPage } from './LabPartnerDashboardPage';
import { AdminPortalPage } from './AdminPortalPage';

interface RoleDashboardRouterProps {
  onLogout?: () => void;
  onSelectTab?: (tab: string) => void;
}

export const RoleDashboardRouter: React.FC<RoleDashboardRouterProps> = ({ onLogout, onSelectTab }) => {
  const [currentUser, setCurrentUser] = useState(agriStore.getCurrentUser());
  const [showMemberCardModal, setShowMemberCardModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const update = () => setCurrentUser(agriStore.getCurrentUser());
    return agriStore.subscribe(update);
  }, []);

  const handleSignOut = () => {
    agriStore.logout();
    if (onLogout) onLogout();
    else if (onSelectTab) onSelectTab('auth');
  };

  const roleLabels: Record<string, { label: string; icon: string; color: string }> = {
    farmer: { label: 'Farmer Dashboard', icon: '🧑‍🌾', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    buyer: { label: 'Commercial Buyer Portal', icon: '🛒', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    seller: { label: 'Supplier & Agrovet Center', icon: '🏬', color: 'bg-[#FCF8EE] text-[#79543A] border-[#E2E7DE]' },
    consultant: { label: 'Senior Agronomist Portal', icon: '🔬', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    expert: { label: 'Senior Agronomist Portal', icon: '🔬', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    veterinarian: { label: 'Veterinary Surgeon Clinic', icon: '🩺', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    transporter: { label: 'Logistics & Fleet Dispatch', icon: '🚚', color: 'bg-[#FCF8EE] text-[#79543A] border-[#E2E7DE]' },
    lab: { label: 'Soil Health Laboratory', icon: '🧪', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    admin: { label: 'Central Admin Control Center', icon: '🛡️', color: 'bg-[#FCF8EE] text-[#79543A] border-[#D6A545]/40' },
  };

  const currentRoleInfo = roleLabels[currentUser.role] || roleLabels.farmer;

  return (
    <div className="space-y-4">
      {/* Top Floating Session Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E7DE] shadow-xs px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EBF3ED] text-[#214E34] font-black flex items-center justify-center shrink-0 border border-[#CFD7CA]">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-[#252D27]">{currentUser.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded border ${currentRoleInfo.color}`}>
                  {currentRoleInfo.icon} {currentRoleInfo.label}
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#EBF3ED] text-[#214E34] px-2 py-0.2 rounded border border-[#CFD7CA]">
                  ID: {currentUser.membershipCode || 'SAK-NKR-2024-F4829'}
                </span>
                <span className="text-[10px] text-[#367C46] font-bold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Active Session
                </span>
              </div>
              <div className="text-[11px] text-[#68756A] flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-[#367C46]" /> {currentUser.county} County</span>
                <span>·</span>
                <span>Tel: {currentUser.phone}</span>
                {currentUser.cooperativeAffiliation && (
                  <>
                    <span>·</span>
                    <span className="text-[#214E34] font-medium">{currentUser.cooperativeAffiliation}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Digital ID Card Preview Button */}
            <button
              onClick={() => setShowMemberCardModal(true)}
              className="bg-[#EBF3ED] hover:bg-[#DCECE0] text-[#214E34] px-2.5 py-1.5 rounded-lg font-bold border border-[#CFD7CA] flex items-center gap-1.5 transition cursor-pointer text-xs"
              title="View your official digital identification card"
            >
              <Award className="w-3.5 h-3.5 text-[#367C46]" />
              <span className="hidden sm:inline">Member Card</span>
            </button>



            <button
              onClick={handleSignOut}
              className="bg-[#FCF8EE] hover:bg-[#F3E7C9] text-[#79543A] px-3 py-1.5 rounded-lg font-bold border border-[#E2E7DE] flex items-center gap-1 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>



      {/* Dynamic Role Dashboard View */}
      {currentUser.role === 'farmer' && <FarmerDashboardPage />}
      {currentUser.role === 'buyer' && <BuyerDashboardPage />}
      {currentUser.role === 'seller' && <SellerDashboardPage />}
      {(currentUser.role === 'consultant' || currentUser.role === 'expert') && <ConsultantDashboardPage />}
      {currentUser.role === 'veterinarian' && <VeterinarianDashboardPage />}
      {currentUser.role === 'transporter' && <TransporterDashboardPage />}
      {currentUser.role === 'lab' && <LabPartnerDashboardPage />}
      {currentUser.role === 'admin' && <AdminPortalPage />}

      {/* Digital Member ID Card Modal */}
      {showMemberCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#367C46]" />
                <h3 className="text-base font-black text-[#214E34]">Digital Member Card</h3>
              </div>
              <button 
                onClick={() => setShowMemberCardModal(false)} 
                className="text-[#68756A] hover:text-[#252D27] p-1 rounded-lg hover:bg-[#F7F6F0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Card Graphic */}
            <div className="p-5 bg-gradient-to-br from-[#214E34] via-[#183926] to-[#0D2418] rounded-2xl text-white shadow-xl border border-[#367C46] space-y-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-[#D6A545]/15 pointer-events-none blur-lg" />

              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-black text-sm text-[#D6A545]">
                    SAK
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs tracking-wider uppercase text-white">SMART-AGRI KENYA</h4>
                    <span className="text-[9px] text-[#D6A545] font-semibold">National Agricultural Registry</span>
                  </div>
                </div>
                <span className="bg-[#367C46] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20">
                  {currentUser.membershipTier || 'Verified'} Member
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white/15 overflow-hidden shrink-0 border border-white/20 flex items-center justify-center">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-black text-white">{currentUser.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white leading-tight">{currentUser.name}</h4>
                  <div className="text-[11px] text-[#D6A545] font-semibold capitalize mt-0.5">
                    {currentUser.role} · {currentUser.county} County
                  </div>
                  {currentUser.farmName && (
                    <div className="text-[10px] text-white/70">{currentUser.farmName}</div>
                  )}
                  {currentUser.organizationName && (
                    <div className="text-[10px] text-white/70">{currentUser.organizationName}</div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#D6A545] block font-mono font-bold uppercase tracking-wider">Permanent Membership Code</span>
                  <span className="font-mono text-sm sm:text-base font-black text-white tracking-wider">
                    {currentUser.membershipCode || 'SAK-NKR-2024-F4829'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const code = currentUser.membershipCode || 'SAK-NKR-2024-F4829';
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(code);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }
                  }}
                  className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[9px] text-white/60 pt-1">
                <span>Valid: 2026 Growing Season</span>
                <span>Ministry of Agriculture ID: #2026-SAK</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowMemberCardModal(false)}
                className="w-full py-2.5 bg-[#214E34] hover:bg-[#183C27] text-white font-bold rounded-lg cursor-pointer transition text-xs"
              >
                Close Member Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
