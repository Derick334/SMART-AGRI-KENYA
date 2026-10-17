import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Package, 
  Truck, 
  CreditCard, 
  TestTube, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Settings, 
  DollarSign, 
  TrendingUp, 
  Lock,
  Search,
  Activity
} from 'lucide-react';
import { agriStore } from '../services/store';
import { KENYA_VEHICLES } from '../services/distanceCalculator';

export const AdminPortalPage: React.FC = () => {
  const currentUser = agriStore.getCurrentUser();
  const stats = agriStore.getAdminStats();
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'verifications' | 'listings' | 'transactions' | 'shipping_rates' | 'logs'>('overview');

  // Pending Verifications Mock
  const [pendingFarmers, setPendingFarmers] = useState([
    { id: 'kyc-1', name: 'Kiprotich Koech', farmName: 'Molo High Potato Ranch', idNumber: '29841029', county: 'Nakuru', crops: 'Shangi Potatoes, Pyrethrum', appliedAt: '2026-10-16' },
    { id: 'kyc-2', name: 'Agnes Mutheu', farmName: 'Yatta Mango Orchards', idNumber: '24910283', county: 'Machakos', crops: 'Apple Mangoes, Citrus', appliedAt: '2026-10-15' },
    { id: 'kyc-3', name: 'Hussein Hassan', farmName: 'Garissa Boran Feedlot', idNumber: '31092841', county: 'Garissa', crops: 'Boran Beef Bulls', appliedAt: '2026-10-14' },
  ]);

  // Shipping Rates Configuration State
  const [vehicleRates, setVehicleRates] = useState(KENYA_VEHICLES);

  const handleApproveFarmer = (id: string) => {
    setPendingFarmers(pendingFarmers.filter(f => f.id !== id));
    alert('Farmer profile and KYC credentials verified! Approved seller badge issued.');
  };

  const handleRejectFarmer = (id: string) => {
    setPendingFarmers(pendingFarmers.filter(f => f.id !== id));
    alert('Farmer application flagged for resubmission of clear ID documents.');
  };

  // If not logged in as admin, show security authentication prompt
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-stone-900">
          Administrator Security Checkpoint
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Access to <strong>/admin</strong> requires authorized administrative security credentials. You are currently logged in as <strong>{currentUser.name}</strong> ({currentUser.role}).
        </p>

        <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-xs text-stone-700">
          <p className="font-semibold text-stone-900 mb-1">Administrative Privileges Include:</p>
          <ul className="text-[11px] space-y-1 text-stone-500">
            <li>• National seller KYC identity approvals</li>
            <li>• M-Pesa Daraja payment reconciliation</li>
            <li>• KeNHA highway freight fee configurations</li>
          </ul>
        </div>

        <button
          onClick={() => agriStore.switchRole('admin')}
          className="w-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Switch to Administrator Persona</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Header */}
      <div className="bg-linear-to-r from-stone-950 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-800/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Central Operations & Governance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            SMART-AGRI KENYA Administration Dashboard
          </h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            Logged in as Super Administrator: <strong>{currentUser.email}</strong>. Manage KYC approvals, payment transactions, shipping rates, and system audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-900/80 p-2 rounded-2xl border border-stone-700">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-stone-200">System Status: All Services Normal</span>
        </div>
      </div>

      {/* Admin KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Registered Users</span>
          <span className="text-2xl font-black text-stone-950 mt-1 block">
            {stats.totalUsers.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
            {stats.verifiedFarmers.toLocaleString()} Verified Farmers
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Marketplace Volume</span>
          <span className="text-2xl font-black text-emerald-950 mt-1 block">
            KSh {stats.totalVolumeKsh.toLocaleString()}
          </span>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Total M-Pesa throughput</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Pending KYC Approvals</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {pendingFarmers.length}
          </span>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Awaiting ID verification</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Soil Tests Processed</span>
          <span className="text-2xl font-black text-sky-600 mt-1 block">
            {stats.soilTestsCompleted}
          </span>
          <span className="text-[10px] text-stone-400 mt-0.5 block">KALRO / CropNuts network</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-bold border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeAdminTab === 'overview' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Operations Overview
        </button>
        <button
          onClick={() => setActiveAdminTab('verifications')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'verifications' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <span>Farmer KYC Approvals</span>
          <span className="bg-amber-500 text-stone-950 text-[10px] px-1.5 rounded-full">{pendingFarmers.length}</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('shipping_rates')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeAdminTab === 'shipping_rates' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Freight & Road Rates Config
        </button>
        <button
          onClick={() => setActiveAdminTab('transactions')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeAdminTab === 'transactions' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          M-Pesa Escrow Ledger
        </button>
      </div>

      {/* Tab Panels */}
      {activeAdminTab === 'verifications' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
            Pending Farmer Identity & Farm Ownership Reviews
          </h3>

          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
            {pendingFarmers.map((farmer) => (
              <div key={farmer.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-white">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{farmer.name}</span>
                    <span className="bg-stone-100 text-stone-600 font-mono text-[10px] px-2 py-0.5 rounded">
                      ID: {farmer.idNumber}
                    </span>
                  </div>
                  <p className="text-stone-600 font-semibold mt-0.5">{farmer.farmName} • {farmer.county} County</p>
                  <p className="text-[11px] text-stone-400">Produce: {farmer.crops} • Applied: {farmer.appliedAt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveFarmer(farmer.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Verify</span>
                  </button>

                  <button
                    onClick={() => handleRejectFarmer(farmer.id)}
                    className="bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 font-semibold text-xs px-3 py-2 rounded-xl transition cursor-pointer"
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
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
              KeNHA Highway Logistics Rates Configuration
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Adjust base charges and per-kilometer tariffs used by the delivery calculator across Kenya
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Vehicle / Carrier Type</th>
                  <th className="p-3">Base Fare (KSh)</th>
                  <th className="p-3">Rate per KM (KSh)</th>
                  <th className="p-3">Max Capacity (kg)</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {vehicleRates.map((v) => (
                  <tr key={v.type}>
                    <td className="p-3 font-bold text-stone-900">
                      <span>{v.label}</span>
                      <p className="text-[10px] text-stone-400 font-normal">{v.description}</p>
                    </td>
                    <td className="p-3 font-semibold text-stone-800">
                      KSh {v.baseFareKsh.toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-emerald-800">
                      KSh {v.ratePerKmKsh}/km
                    </td>
                    <td className="p-3 font-mono text-stone-600">
                      {v.maxWeightKg.toLocaleString()} kg
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => alert(`Configured rates for ${v.label} updated across platform calculators.`)}
                        className="bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-stone-200 cursor-pointer"
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
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
            Live M-Pesa Daraja STK Escrow Settlements
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Checkout ws_CO_20261017_94012 (Lipa na M-Pesa)</span>
                <span className="text-[11px] text-stone-500">Phone: 254722104523 • Order #SA-KE-2026-9041</span>
              </div>
              <div className="text-right">
                <span className="font-black text-sm text-emerald-950 block">KSh 6,650</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">SETTLED (SK72910M4)</span>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">Checkout ws_CO_20261017_81920 (Cattle Escrow)</span>
                <span className="text-[11px] text-stone-500">Phone: 254714982301 • Friesian Dairy Cow</span>
              </div>
              <div className="text-right">
                <span className="font-black text-sm text-emerald-950 block">KSh 165,000</span>
                <span className="text-[10px] font-mono text-blue-700 font-bold">HELD IN ESCROW (SK88910Q1)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
