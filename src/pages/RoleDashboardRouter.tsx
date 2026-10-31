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
import { StudentDashboardPage } from './StudentDashboardPage';
import { CooperativeDashboardPage } from './CooperativeDashboardPage';
import { ExtensionDashboardPage } from './ExtensionDashboardPage';
import { DigitalMembershipCard } from '../components/membership/DigitalMembershipCard';

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

  const roleLabels: Record<string, { label: string; icon: string; color: string }> = {
    farmer: { label: 'Farmer Dashboard', icon: '🧑‍🌾', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    buyer: { label: 'Commercial Buyer Portal', icon: '🛒', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    seller: { label: 'Supplier & Agrovet Center', icon: '🏬', color: 'bg-[#FCF8EE] text-[#79543A] border-[#E2E7DE]' },
    consultant: { label: 'Senior Agronomist Portal', icon: '🔬', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    expert: { label: 'Senior Agronomist Portal', icon: '🔬', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    veterinarian: { label: 'Veterinary Surgeon Clinic', icon: '🩺', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    transporter: { label: 'Logistics & Fleet Dispatch', icon: '🚚', color: 'bg-[#FCF8EE] text-[#79543A] border-[#E2E7DE]' },
    lab: { label: 'Soil Health Laboratory', icon: '🧪', color: 'bg-[#EBF3ED] text-[#214E34] border-[#CFD7CA]' },
    student: { label: 'Academic & Researcher Portal', icon: '🎓', color: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
    cooperative: { label: 'Cooperative Union Hub', icon: '🏛️', color: 'bg-amber-50 text-amber-900 border-amber-200' },
    extension: { label: 'Extension Field Officer Portal', icon: '📋', color: 'bg-teal-50 text-teal-900 border-teal-200' },
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
              onClick={() => onSelectTab ? onSelectTab('home') : null}
              className="bg-[#FCF8EE] hover:bg-[#F3E7C9] text-[#79543A] px-3 py-1.5 rounded-lg font-bold border border-[#E2E7DE] flex items-center gap-1 transition cursor-pointer"
            >
              <span>Back to Home</span>
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
      {(currentUser.role === 'student' || (currentUser.role as any) === 'researcher') && <StudentDashboardPage user={currentUser} />}
      {currentUser.role === 'cooperative' && <CooperativeDashboardPage user={currentUser} />}
      {currentUser.role === 'extension' && <ExtensionDashboardPage user={currentUser} />}
      {currentUser.role === 'admin' && <AdminPortalPage />}

      {/* Digital Member ID Card Modal */}
      {showMemberCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E2E7DE] shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#367C46]" />
                <h3 className="text-base font-black text-[#214E34]">Official Digital Membership Card</h3>
              </div>
              <button 
                onClick={() => setShowMemberCardModal(false)} 
                className="text-[#68756A] hover:text-[#252D27] p-1 rounded-lg hover:bg-[#F7F6F0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DigitalMembershipCard user={currentUser} showQrCode={true} />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowMemberCardModal(false)}
                className="w-full py-2.5 bg-[#214E34] hover:bg-[#183C27] text-white font-bold rounded-lg cursor-pointer transition text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
