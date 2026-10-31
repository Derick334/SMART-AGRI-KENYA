import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Plus, 
  Search, 
  CheckCircle2, 
  FileText, 
  Download,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { agriStore } from '../services/store';
import { DigitalMembershipCard } from '../components/membership/DigitalMembershipCard';

import { UserProfile } from '../types';

interface CooperativeDashboardPageProps {
  user?: UserProfile;
}

export const CooperativeDashboardPage: React.FC<CooperativeDashboardPageProps> = ({ user }) => {
  const [currentUser] = useState(user || agriStore.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'collective' | 'finance' | 'card'>('overview');
  const [searchMember, setSearchMember] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberAcreage, setNewMemberAcreage] = useState<number | ''>(4.5);
  const [notice, setNotice] = useState<string | null>(null);

  const [members, setMembers] = useState([
    { id: 'mem-01', name: 'Kiprop Kimani', phone: '0722123456', acreage: 6.5, crop: 'Maize H614D', status: 'Active', deliveriesKsh: 420000 },
    { id: 'mem-02', name: 'Mary Wanjiku', phone: '0711987654', acreage: 4.0, crop: 'French Beans', status: 'Active', deliveriesKsh: 280000 },
    { id: 'mem-03', name: 'David Kiprono', phone: '0723887766', acreage: 12.0, crop: 'Wheat & Barley', status: 'Active', deliveriesKsh: 850000 },
    { id: 'mem-04', name: 'Grace Cherotich', phone: '0714556677', acreage: 3.5, crop: 'Irish Potatoes', status: 'Active', deliveriesKsh: 195000 },
  ]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `mem-${Date.now()}`,
      name: newMemberName,
      phone: newMemberPhone,
      acreage: Number(newMemberAcreage) || 2.0,
      crop: 'Mixed Staples',
      status: 'Active',
      deliveriesKsh: 0
    };
    setMembers([newEntry, ...members]);
    setNotice(`Member ${newMemberName} added to ${currentUser.organizationName || 'Cooperative'} roster.`);
    setShowAddMember(false);
    setNewMemberName('');
    setNewMemberPhone('');
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchMember.toLowerCase()) || 
    m.phone.includes(searchMember)
  );

  const totalAcreage = members.reduce((sum, m) => sum + m.acreage, 0);
  const totalVolumeKsh = members.reduce((sum, m) => sum + m.deliveriesKsh, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#367C46] tracking-wider uppercase mb-1.5">
            <Users className="w-4 h-4 text-[#367C46]" />
            <span>Producer Cooperative & Aggregation Union</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#214E34]">
            {currentUser.organizationName || 'Rongai Valley Agricultural Cooperative SACCO'}
          </h1>
          <p className="text-xs sm:text-sm text-[#68756A] mt-1 max-w-xl">
            Managing {members.length} registered farmers, collective crop aggregation, warehouse receipts, and bulk farm input procurement.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddMember(true)}
            className="inline-flex items-center gap-1.5 bg-[#214E34] hover:bg-[#183C27] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6A545]" />
            <span>Enlist Farmer Member</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] rounded-xl flex items-center justify-between text-xs text-[#214E34] font-semibold">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#68756A] hover:text-[#252D27]">Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E7DE] pb-2 text-xs font-bold overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Aggregation', icon: Layers },
          { id: 'members', label: 'Farmer Roster', icon: Users },
          { id: 'collective', label: 'Collective Farming', icon: Package },
          { id: 'finance', label: 'Financial Summaries', icon: DollarSign },
          { id: 'card', label: 'Cooperative Digital ID', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                isActive 
                  ? 'bg-[#214E34] text-white shadow-xs' 
                  : 'bg-white text-[#68756A] border border-[#E2E7DE] hover:bg-[#F7F6F0]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D6A545]' : 'text-[#68756A]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#E2E7DE]">
              <span className="text-[11px] text-[#68756A] font-bold block uppercase">Enlisted Farmers</span>
              <span className="text-2xl font-black text-[#214E34] mt-1 block">{members.length}</span>
              <span className="text-[10px] text-[#367C46]">Active Producers</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E7DE]">
              <span className="text-[11px] text-[#68756A] font-bold block uppercase">Aggregated Land</span>
              <span className="text-2xl font-black text-[#214E34] mt-1 block">{totalAcreage.toFixed(1)} Acres</span>
              <span className="text-[10px] text-[#367C46]">Arable Acreage</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E7DE]">
              <span className="text-[11px] text-[#68756A] font-bold block uppercase">Seasonal Payouts</span>
              <span className="text-2xl font-black text-[#214E34] mt-1 block">Ksh {(totalVolumeKsh / 1000).toFixed(0)}k</span>
              <span className="text-[10px] text-[#367C46]">M-Pesa Disbursed</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E7DE]">
              <span className="text-[11px] text-[#68756A] font-bold block uppercase">SACCO Reg Number</span>
              <span className="text-base font-extrabold text-[#214E34] mt-1 block">
                {currentUser.registrationNumber || 'CS/2026/8412'}
              </span>
              <span className="text-[10px] text-[#68756A]">Ministry of Co-operatives</span>
            </div>
          </div>

          {/* Collective Grain / Produce Pool */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E7DE] shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-[#214E34]">Current Aggregated Silo Stocks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2">
                <span className="text-[10px] font-bold text-[#367C46] uppercase">White Maize (H614D)</span>
                <div className="text-xl font-black text-[#252D27]">1,450 Bags (90kg)</div>
                <p className="text-[11px] text-[#68756A]">Moisture Content: 12.8% (NCPB grade standard). Contract price: Ksh 3,600/bag.</p>
              </div>
              <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2">
                <span className="text-[10px] font-bold text-[#367C46] uppercase">Raw Whole Milk (Chilled)</span>
                <div className="text-xl font-black text-[#252D27]">3,200 Litres/day</div>
                <p className="text-[11px] text-[#68756A]">Cold-chain bulk tank in Njoro. Brookside & New KCC off-take contracts.</p>
              </div>
              <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2">
                <span className="text-[10px] font-bold text-[#367C46] uppercase">Potatoes (Shangi Variety)</span>
                <div className="text-xl font-black text-[#252D27]">850 Bags (50kg)</div>
                <p className="text-[11px] text-[#68756A]">Aggregated for wholesale dispatch to Wakulima Market Nairobi.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Roster Tab */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-extrabold text-base text-[#214E34]">Enrolled Farmer Member Registry</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#68756A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Search member by name..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F0] text-[#214E34] font-bold border-b border-[#E2E7DE]">
                <tr>
                  <th className="py-2.5 px-3">Farmer Name</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Acreage</th>
                  <th className="py-2.5 px-3">Primary Crop</th>
                  <th className="py-2.5 px-3">Season Volume</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7DE]">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-[#F7F6F0]">
                    <td className="py-2.5 px-3 font-bold text-[#252D27]">{m.name}</td>
                    <td className="py-2.5 px-3 font-mono text-[#68756A]">{m.phone}</td>
                    <td className="py-2.5 px-3">{m.acreage} Acres</td>
                    <td className="py-2.5 px-3 text-[#214E34]">{m.crop}</td>
                    <td className="py-2.5 px-3 font-bold text-[#252D27]">Ksh {m.deliveriesKsh.toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-[#EBF3ED] text-[#367C46] px-2 py-0.5 rounded font-bold text-[10px]">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collective Farming Tab */}
      {activeTab === 'collective' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] space-y-4">
          <h3 className="font-extrabold text-base text-[#214E34]">Bulk Input Procurement & Subsidy Distribution</h3>
          <p className="text-xs text-[#68756A]">Consolidated purchasing enables farmers to save up to 28% on certified seeds and fertilizers.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2 text-xs">
              <span className="font-bold text-[#214E34] block">E-Voucher Subsidized Fertilizer Order</span>
              <p className="text-[#68756A]">Consolidated allocation for 400x 50kg bags of NPK 23:23:0 through NCPB Nakuru Depot.</p>
              <span className="inline-block bg-[#EBF3ED] text-[#367C46] px-2 py-0.5 rounded text-[10px] font-bold">Dispatched</span>
            </div>
            <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2 text-xs">
              <span className="font-bold text-[#214E34] block">Certified Seed Bulk Booking (Kenya Seed Co.)</span>
              <p className="text-[#68756A]">Pre-ordered 150x 25kg bags of hybrid maize H614D for upcoming long rains planting.</p>
              <span className="inline-block bg-[#FCF8EE] text-[#79543A] px-2 py-0.5 rounded text-[10px] font-bold">Scheduled Delivery</span>
            </div>
          </div>
        </div>
      )}

      {/* Finance Tab */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] space-y-4">
          <h3 className="font-extrabold text-base text-[#214E34]">Cooperative Escrow & M-Pesa B2C Payouts</h3>
          <p className="text-xs text-[#68756A]">Direct bulk disbursement to farmer phone numbers via Safaricom Daraja B2C API.</p>
          <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#252D27] block">Total Season Reconciliation</span>
              <span className="text-xl font-black text-[#214E34] mt-1 block">Ksh 1,745,000</span>
              <span className="text-[10px] text-[#367C46]">All 4 member batches reconciled without dispute</span>
            </div>
            <button className="px-4 py-2 bg-[#214E34] text-white rounded-xl font-bold hover:bg-[#183C27] cursor-pointer">
              Download Full SACCO Audit Report
            </button>
          </div>
        </div>
      )}

      {/* Digital Card Tab */}
      {activeTab === 'card' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-lg font-extrabold text-[#214E34]">Cooperative Society Digital Certificate & ID</h3>
            <p className="text-xs text-[#68756A] mt-1">Official verified credentials under the Ministry of Co-operatives & Micro, Small and Medium Enterprises Development.</p>
          </div>
          <DigitalMembershipCard user={currentUser} />
        </div>
      )}

      {/* Enlist Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <h3 className="font-black text-base text-[#214E34]">Enlist New Farmer Member</h3>
              <button onClick={() => setShowAddMember(false)} className="text-[#68756A] hover:text-[#252D27]">✕</button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block font-bold text-[#252D27] mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. John Kiprotich"
                  className="w-full p-2.5 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-[#252D27] mb-1">M-Pesa Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full p-2.5 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-[#252D27] mb-1">Land Size (Acres)</label>
                <input
                  type="number"
                  required
                  value={newMemberAcreage}
                  onChange={(e) => setNewMemberAcreage(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2.5 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#214E34] text-white rounded-xl font-bold hover:bg-[#183C27]"
                >
                  Enlist Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
