import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Lock,
  Activity
} from 'lucide-react';
import { agriStore } from '../services/store';
import { KENYA_VEHICLES } from '../services/distanceCalculator';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';

export const AdminPortalPage: React.FC = () => {
  const currentUser = agriStore.getCurrentUser();
  const stats = agriStore.getAdminStats();
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'verifications' | 'listings' | 'transactions' | 'shipping_rates' | 'logs'>('overview');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Pending Verifications Mock
  const [pendingFarmers, setPendingFarmers] = useState([
    { id: 'kyc-1', name: 'Kiprotich Koech', farmName: 'Molo High Potato Ranch', idNumber: '29841029', county: 'Nakuru', crops: 'Shangi Potatoes, Pyrethrum', appliedAt: '2026-10-16' },
    { id: 'kyc-2', name: 'Agnes Mutheu', farmName: 'Yatta Mango Orchards', idNumber: '24910283', county: 'Machakos', crops: 'Apple Mangoes, Citrus', appliedAt: '2026-10-15' },
    { id: 'kyc-3', name: 'Hussein Hassan', farmName: 'Garissa Boran Feedlot', idNumber: '31092841', county: 'Garissa', crops: 'Boran Beef Bulls', appliedAt: '2026-10-14' },
  ]);

  // Shipping Rates Configuration State
  const [vehicleRates] = useState(KENYA_VEHICLES);

  const handleApproveFarmer = (id: string) => {
    setPendingFarmers(pendingFarmers.filter(f => f.id !== id));
    setAdminNotice('Farmer profile and KYC credentials verified! Approved seller badge issued.');
    setTimeout(() => setAdminNotice(null), 5000);
  };

  const handleRejectFarmer = (id: string) => {
    setPendingFarmers(pendingFarmers.filter(f => f.id !== id));
    setAdminNotice('Farmer application flagged for resubmission of clear ID documents.');
    setTimeout(() => setAdminNotice(null), 5000);
  };

  // If not logged in as admin, show security authentication prompt
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="flex justify-center mb-1">
          <SmartAgriLogo variant="full" size="md" />
        </div>
        <div className="w-14 h-14 rounded-xl bg-[#FCF8EE] border border-[#E2E7DE] text-[#D6A545] flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold text-[#214E34]">
          Administrator Security Checkpoint
        </h2>
        <p className="text-xs text-[#68756A] leading-relaxed">
          Access to <strong>/admin</strong> requires authorized administrative security credentials. You are currently logged in as <strong>{currentUser.name}</strong> ({currentUser.role}).
        </p>

        <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] text-xs text-[#252D27]">
          <p className="font-semibold text-[#214E34] mb-1">Administrative Operations Include:</p>
          <ul className="text-[11px] space-y-1 text-[#68756A]">
            <li>· National seller KYC identity approvals</li>
            <li>· M-Pesa Daraja payment reconciliation</li>
            <li>· KeNHA highway freight fee configurations</li>
          </ul>
        </div>

        <button
          onClick={() => agriStore.switchRole('admin')}
          className="w-full bg-[#214E34] hover:bg-[#183C27] text-white font-semibold text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Lock className="w-4 h-4 text-[#D6A545]" />
          <span>Switch to Administrator Persona</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {adminNotice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{adminNotice}</span>
          </div>
          <button onClick={() => setAdminNotice(null)} className="text-[#214E34] p-1 cursor-pointer">✕</button>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4 text-[#D6A545]" />
            <span>Central Operations & Governance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
            SMART-AGRI KENYA Administration Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#68756A] mt-1 max-w-xl">
            Logged in as Super Administrator: <strong>{currentUser.email}</strong>. Manage KYC approvals, payment transactions, shipping rates, and system audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F7F6F0] px-3.5 py-2 rounded-lg border border-[#E2E7DE]">
          <Activity className="w-4 h-4 text-[#367C46]" />
          <span className="text-xs font-mono font-semibold text-[#252D27]">System Status: All Services Operational</span>
        </div>
      </div>

      {/* Admin KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#68756A] block">Registered Users</span>
          <span className="text-2xl font-extrabold text-[#252D27] mt-1 block tabular-nums">
            {stats.totalUsers.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#367C46] font-semibold mt-0.5 block">
            {stats.verifiedFarmers.toLocaleString()} Verified Farmers
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#68756A] block">Marketplace Volume</span>
          <span className="text-2xl font-extrabold text-[#214E34] mt-1 block tabular-nums">
            KSh {stats.totalVolumeKsh.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#68756A] mt-0.5 block">Total M-Pesa Throughput</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#68756A] block">Pending KYC Approvals</span>
          <span className="text-2xl font-extrabold text-[#79543A] mt-1 block tabular-nums">
            {pendingFarmers.length}
          </span>
          <span className="text-[11px] text-[#68756A] mt-0.5 block">Awaiting ID Verification</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#68756A] block">Soil Tests Processed</span>
          <span className="text-2xl font-extrabold text-[#367C46] mt-1 block tabular-nums">
            {stats.soilTestsCompleted}
          </span>
          <span className="text-[11px] text-[#68756A] mt-0.5 block">KALRO / CropNuts Network</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold border-b border-[#E2E7DE] pb-2">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeAdminTab === 'overview' ? 'bg-[#214E34] text-white' : 'bg-white text-[#252D27] border border-[#E2E7DE] hover:bg-[#F7F6F0]'
          }`}
        >
          Operations Overview
        </button>
        <button
          onClick={() => setActiveAdminTab('verifications')}
          className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'verifications' ? 'bg-[#214E34] text-white' : 'bg-white text-[#252D27] border border-[#E2E7DE] hover:bg-[#F7F6F0]'
          }`}
        >
          <span>Farmer KYC Approvals</span>
          <span className="bg-[#D6A545] text-[#252D27] text-[10px] font-bold px-1.5 rounded">{pendingFarmers.length}</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('shipping_rates')}
          className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeAdminTab === 'shipping_rates' ? 'bg-[#214E34] text-white' : 'bg-white text-[#252D27] border border-[#E2E7DE] hover:bg-[#F7F6F0]'
          }`}
        >
          Freight & Road Rates Config
        </button>
        <button
          onClick={() => setActiveAdminTab('transactions')}
          className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
            activeAdminTab === 'transactions' ? 'bg-[#214E34] text-white' : 'bg-white text-[#252D27] border border-[#E2E7DE] hover:bg-[#F7F6F0]'
          }`}
        >
          M-Pesa Escrow Ledger
        </button>
      </div>

      {/* Tab Panels */}
      {activeAdminTab === 'verifications' && (
        <div className="bg-white rounded-xl border border-[#E2E7DE] p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-xs text-[#214E34] uppercase tracking-wider">
            Pending Farmer Identity & Farm Ownership Reviews
          </h3>

          <div className="divide-y divide-[#E2E7DE] border border-[#E2E7DE] rounded-lg overflow-hidden">
            {pendingFarmers.map((farmer) => (
              <div key={farmer.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-white">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#252D27] text-sm">{farmer.name}</span>
                    <span className="bg-[#F7F6F0] text-[#252D27] font-mono text-[10px] px-2 py-0.5 rounded border border-[#E2E7DE]">
                      ID: {farmer.idNumber}
                    </span>
                  </div>
                  <p className="text-[#252D27] font-medium mt-0.5">{farmer.farmName} · {farmer.county} County</p>
                  <p className="text-[11px] text-[#68756A]">Produce: {farmer.crops} · Applied: {farmer.appliedAt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveFarmer(farmer.id)}
                    className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Verify</span>
                  </button>

                  <button
                    onClick={() => handleRejectFarmer(farmer.id)}
                    className="bg-[#F7F6F0] hover:bg-white text-[#79543A] border border-[#E2E7DE] font-semibold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Flag Docs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'shipping_rates' && (
        <div className="bg-white rounded-xl border border-[#E2E7DE] p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-xs text-[#214E34] uppercase tracking-wider">
              KeNHA Highway Logistics Rates Configuration
            </h3>
            <p className="text-xs text-[#68756A] mt-0.5">
              Adjust base charges and per-kilometer tariffs used by the delivery calculator across Kenya
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E7DE] bg-[#F7F6F0] text-[#68756A] font-bold uppercase tracking-wider">
                  <th className="p-3">Vehicle / Carrier Type</th>
                  <th className="p-3">Base Fare (KSh)</th>
                  <th className="p-3">Rate per KM (KSh)</th>
                  <th className="p-3">Max Capacity (kg)</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7DE]">
                {vehicleRates.map((v) => (
                  <tr key={v.type}>
                    <td className="p-3 font-bold text-[#252D27]">
                      <span>{v.label}</span>
                      <p className="text-[10px] text-[#68756A] font-normal">{v.description}</p>
                    </td>
                    <td className="p-3 font-semibold text-[#252D27] tabular-nums">
                      KSh {v.baseFareKsh.toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-[#214E34] tabular-nums">
                      KSh {v.ratePerKmKsh}/km
                    </td>
                    <td className="p-3 font-mono text-[#68756A] tabular-nums">
                      {v.maxWeightKg.toLocaleString()} kg
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setAdminNotice(`Configured road freight rate for ${v.label} updated across platform calculators.`);
                          setTimeout(() => setAdminNotice(null), 4000);
                        }}
                        className="bg-[#F7F6F0] hover:bg-white text-[#252D27] font-semibold px-3 py-1.5 rounded-lg border border-[#E2E7DE] cursor-pointer"
                      >
                        Edit Tariff
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeAdminTab === 'overview' || activeAdminTab === 'transactions') && (
        <div className="bg-white rounded-xl border border-[#E2E7DE] p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-xs text-[#214E34] uppercase tracking-wider">
            Live M-Pesa Daraja STK Escrow Settlements
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#252D27] block">Checkout ws_CO_20261017_94012 (Lipa na M-Pesa)</span>
                <span className="text-[11px] text-[#68756A]">Phone: 254722104523 · Order #SA-KE-2026-9041</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-sm text-[#214E34] block tabular-nums">KSh 6,650</span>
                <span className="text-[10px] font-mono text-[#367C46] font-bold">SETTLED (SK72910M4)</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#252D27] block">Checkout ws_CO_20261017_81920 (Cattle Escrow)</span>
                <span className="text-[11px] text-[#68756A]">Phone: 254714982301 · Friesian Dairy Cow</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-sm text-[#214E34] block tabular-nums">KSh 165,000</span>
                <span className="text-[10px] font-mono text-[#79543A] font-bold">HELD IN ESCROW (SK88910Q1)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
