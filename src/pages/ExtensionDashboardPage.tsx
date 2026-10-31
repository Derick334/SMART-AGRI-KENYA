import React, { useState } from 'react';
import {
  FileText,
  MapPin,
  Calendar,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  IdCard,
  Building2,
  Share2
} from 'lucide-react';
import { UserProfile, FieldInspectionRecord } from '../types';
import { DigitalMembershipCard } from '../components/membership/DigitalMembershipCard';

interface ExtensionDashboardPageProps {
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const ExtensionDashboardPage: React.FC<ExtensionDashboardPageProps> = ({
  user,
}) => {
  const [activeTab, setActiveTab] = useState<'inspections' | 'visits' | 'advisories' | 'idcard'>('inspections');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewInspectionModal, setShowNewInspectionModal] = useState(false);

  // Initial inspections
  const [inspections, setInspections] = useState<FieldInspectionRecord[]>([
    {
      id: 'insp-1',
      farmerId: 'farmer-101',
      farmerName: 'John Kamau',
      farmLocation: 'Kipkelion West, Kericho County',
      cropOrLivestock: 'Maize & Dairy Cows',
      findings: 'Fall armyworm early instar larvae detected on 1.5 acres of young maize crop. Soil nitrogen deficiency symptoms also noted on lower leaves.',
      recommendations: 'Apply certified bio-pesticide (Bacillus thuringiensis) or Emamectin benzoate at dusk. Top-dress with CAN fertilizer (50kg/acre) immediately following weed clearing.',
      status: 'pending_followup',
      inspectionDate: '2026-03-24',
      officerName: user.name,
      severity: 'moderate'
    },
    {
      id: 'insp-2',
      farmerId: 'farmer-102',
      farmerName: 'Mary Chebet',
      farmLocation: 'Bomet Central, Bomet County',
      cropOrLivestock: 'Hass Avocados (200 trees)',
      findings: 'Anthracnose fruit rot fungal infection identified during flowering stage. Pruning practices need improvement to enhance canopy airflow.',
      recommendations: 'Apply copper-based fungicide spray. Prune internal criss-crossing branches to open up canopy. Clear fallen mulch containing fungal spores.',
      status: 'completed',
      inspectionDate: '2026-03-20',
      officerName: user.name,
      severity: 'mild'
    },
    {
      id: 'insp-3',
      farmerId: 'farmer-103',
      farmerName: 'Peter Kiprono',
      farmLocation: 'Rongai, Nakuru County',
      cropOrLivestock: 'French Beans & Tomatoes',
      findings: 'Severe Tuta absoluta (tomato leaf miner) and bacterial wilt infestation threatening entire 0.8 acre greenhouse crop.',
      recommendations: 'Install pheromone delta sticky traps. Destroy severely infected wilted vines. Rotate next cycle with non-solanaceous crops (e.g. Rhodes grass or beans).',
      status: 'urgent',
      inspectionDate: '2026-03-27',
      officerName: user.name,
      severity: 'severe'
    }
  ]);

  // New inspection form state
  const [newInspection, setNewInspection] = useState({
    farmerName: '',
    farmLocation: `${user.subCounty || 'Sub-County'}, ${user.county || 'County'}`,
    cropOrLivestock: '',
    findings: '',
    recommendations: '',
    severity: 'moderate' as 'mild' | 'moderate' | 'severe',
    status: 'pending_followup' as 'completed' | 'pending_followup' | 'urgent'
  });

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspection.farmerName || !newInspection.findings) return;

    const record: FieldInspectionRecord = {
      id: `insp-${Date.now()}`,
      farmerId: `farmer-${Date.now()}`,
      farmerName: newInspection.farmerName,
      farmLocation: newInspection.farmLocation,
      cropOrLivestock: newInspection.cropOrLivestock || 'Mixed Farm',
      findings: newInspection.findings,
      recommendations: newInspection.recommendations,
      status: newInspection.status,
      inspectionDate: new Date().toISOString().split('T')[0],
      officerName: user.name,
      severity: newInspection.severity
    };

    setInspections([record, ...inspections]);
    setShowNewInspectionModal(false);
    setNewInspection({
      farmerName: '',
      farmLocation: `${user.subCounty || 'Sub-County'}, ${user.county || 'County'}`,
      cropOrLivestock: '',
      findings: '',
      recommendations: '',
      severity: 'moderate',
      status: 'pending_followup'
    });
  };

  const filteredInspections = inspections.filter(insp => {
    const matchesSearch =
      insp.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insp.farmLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insp.findings.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || insp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Officer Header Banner */}
      <div className="bg-gradient-to-r from-[#173a25] via-[#214E34] to-[#2c6343] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-emerald-200 border border-white/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>Government Agricultural Extension Service · {user.county || 'National'} Jurisdiction</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Officer {user.name}
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-2xl">
              Extension Station: <span className="text-white font-medium">{user.extensionStation || 'County Agricultural Office'}</span> · Official ID: <span className="font-mono text-white font-bold">{user.membershipCode}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('idcard')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-sm font-medium transition"
            >
              <IdCard className="w-4 h-4" />
              Digital Badge
            </button>
            <button
              onClick={() => setShowNewInspectionModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#48A366] hover:bg-[#3d8c56] text-white rounded-xl text-sm font-semibold shadow-lg shadow-black/20 transition"
            >
              <Plus className="w-4 h-4" />
              Record Field Visit
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-emerald-200">Total Visits (Q1)</div>
            <div className="text-2xl font-bold mt-1">42 Farms</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-emerald-200">Pest Alerts Filed</div>
            <div className="text-2xl font-bold mt-1 text-amber-300">7 Active</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-emerald-200">Follow-Ups Pending</div>
            <div className="text-2xl font-bold mt-1 text-emerald-300">
              {inspections.filter(i => i.status === 'pending_followup').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-emerald-200">Extension Status</div>
            <div className="text-2xl font-bold mt-1 text-green-300">Verified</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('inspections')}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg transition whitespace-nowrap ${
            activeTab === 'inspections'
              ? 'bg-[#214E34] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Field Inspection Logs ({inspections.length})
        </button>
        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg transition whitespace-nowrap ${
            activeTab === 'visits'
              ? 'bg-[#214E34] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Scheduled Farmer Visits (5)
        </button>
        <button
          onClick={() => setActiveTab('advisories')}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg transition whitespace-nowrap ${
            activeTab === 'advisories'
              ? 'bg-[#214E34] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Regional Agricultural Advisories
        </button>
        <button
          onClick={() => setActiveTab('idcard')}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg transition whitespace-nowrap ${
            activeTab === 'idcard'
              ? 'bg-[#214E34] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Digital Officer Credential
        </button>
      </div>

      {/* TAB CONTENT: Inspections */}
      {activeTab === 'inspections' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search farmers, wards, or findings..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#214E34] focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 outline-none"
              >
                <option value="all">All Inspection Statuses</option>
                <option value="pending_followup">Pending Follow-up</option>
                <option value="urgent">Urgent / Alert</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => setShowNewInspectionModal(true)}
                className="px-3.5 py-2 bg-[#214E34] hover:bg-[#1a3e29] text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Record
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredInspections.map(insp => (
              <div
                key={insp.id}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-gray-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">{insp.farmerName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        insp.severity === 'severe'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : insp.severity === 'moderate'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {(insp.severity || 'moderate').toUpperCase()} SEVERITY
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        insp.status === 'urgent'
                          ? 'bg-red-50 text-red-700'
                          : insp.status === 'pending_followup'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {insp.status === 'pending_followup' ? 'Follow-Up Needed' : insp.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {insp.farmLocation}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Visited: {insp.inspectionDate}
                      </span>
                      <span>·</span>
                      <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {insp.cropOrLivestock}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-amber-50/60 rounded-lg p-3.5 border border-amber-200/50">
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Field Observations & Diagnosis
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      {insp.findings}
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 rounded-lg p-3.5 border border-emerald-200/50">
                    <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Official Extension Recommendations
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      {insp.recommendations}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Visits */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">Upcoming Field Extension Visits</h3>
            <span className="text-xs font-medium text-gray-500">Ward Cluster: Kericho Central & Kipkelion</span>
          </div>

          <div className="divide-y divide-gray-100">
            {[
              {
                date: 'Tomorrow, 09:30 AM',
                farmer: 'David Langat',
                ward: 'Kedowa / Kimugul',
                purpose: 'Verify soil test pH response after lime application on 4-acre maize parcel.',
                status: 'Confirmed'
              },
              {
                date: 'Thursday, 02:00 PM',
                farmer: 'Amani Dairy Smallholder Group',
                ward: 'Kipchimchim Ward',
                purpose: 'Demonstrate Napier grass silage bag fermentation techniques & mastitis prevention.',
                status: 'Scheduled'
              },
              {
                date: 'Friday, 10:00 AM',
                farmer: 'Grace Muthoni',
                ward: 'Kapsoit Ward',
                purpose: 'Follow-up inspection on avocado thrips control and drip line filtration setup.',
                status: 'Scheduled'
              }
            ].map((v, i) => (
              <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{v.farmer}</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                      {v.ward}
                    </span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                      {v.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{v.purpose}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  {v.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Advisories */}
      {activeTab === 'advisories' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">National & Regional Agricultural Advisories</h3>
                <p className="text-xs text-gray-500">Validated bulletins issued by KALRO, KMD, and MoALD</p>
              </div>
              <button className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" />
                Broadcast to Sub-County SMS List
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Long Rains 2026 Planting Window
                </span>
                <h4 className="font-semibold text-gray-900 text-sm">Optimal Maize & Soya Sowing Guidelines</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  With soil moisture currently at 72% field capacity in western highland zones, farmers are advised to plant certified highland hybrids (H6213, H629) with 50kg/acre DAP or bio-fertilizers within the next 10 days.
                </p>
              </div>

              <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Pest Surveillance Alert
                </span>
                <h4 className="font-semibold text-gray-900 text-sm">Fall Armyworm & Rust Outbreak Advisory</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Higher evening relative humidity (84%) has elevated risk for rust in legumes and early FAW oviposition. Instruct ward groups to scout heart leaves in mornings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ID Card */}
      {activeTab === 'idcard' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-gray-900">Official Extension Officer Credential</h2>
              <p className="text-xs text-gray-500">
                Authorized government and community agricultural extension credential. Valid across all 47 counties.
              </p>
            </div>

            <DigitalMembershipCard user={user} showQrCode={true} />
          </div>
        </div>
      )}

      {/* Modal: New Inspection Record */}
      {showNewInspectionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Record Field Inspection</h3>
                  <p className="text-xs text-gray-500">Official extension field record</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewInspectionModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Farmer / Farm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kiprono Korir Farm"
                  value={newInspection.farmerName}
                  onChange={e => setNewInspection({ ...newInspection, farmerName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#214E34] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location / Ward</label>
                  <input
                    type="text"
                    required
                    value={newInspection.farmLocation}
                    onChange={e => setNewInspection({ ...newInspection, farmLocation: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#214E34] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Crops / Livestock</label>
                  <input
                    type="text"
                    placeholder="e.g. Maize, Potatoes, Dairy"
                    value={newInspection.cropOrLivestock}
                    onChange={e => setNewInspection({ ...newInspection, cropOrLivestock: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#214E34] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Severity Assessment</label>
                  <select
                    value={newInspection.severity}
                    onChange={e => setNewInspection({ ...newInspection, severity: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none"
                  >
                    <option value="mild">Mild (Low impact)</option>
                    <option value="moderate">Moderate (Intervention needed)</option>
                    <option value="severe">Severe (Urgent risk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Action Status</label>
                  <select
                    value={newInspection.status}
                    onChange={e => setNewInspection({ ...newInspection, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none"
                  >
                    <option value="pending_followup">Pending Follow-up</option>
                    <option value="urgent">Urgent Follow-up</option>
                    <option value="completed">Resolved / Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Observations & Clinical Diagnosis</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe crop symptoms, pest species, soil condition, or livestock health..."
                  value={newInspection.findings}
                  onChange={e => setNewInspection({ ...newInspection, findings: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#214E34] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Official Recommendations</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Prescribed organic/chemical treatments, dosage, hygiene, or soil amendments..."
                  value={newInspection.recommendations}
                  onChange={e => setNewInspection({ ...newInspection, recommendations: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#214E34] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewInspectionModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#214E34] hover:bg-[#1a3e29] text-white rounded-lg text-sm font-semibold transition"
                >
                  Save & Certify Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
