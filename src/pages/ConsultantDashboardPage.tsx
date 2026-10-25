import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Star, 
  DollarSign, 
  MapPin, 
  Clock, 
  Send, 
  User, 
  Sparkles,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { agriStore } from '../services/store';

export const ConsultantDashboardPage: React.FC = () => {
  const currentUser = agriStore.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'requests' | 'soil_reviews' | 'visits' | 'earnings'>('requests');
  const [notice, setNotice] = useState<string | null>(null);

  // Advisory reply modal state
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [advisoryNote, setAdvisoryNote] = useState('');

  const [consultations, setConsultations] = useState([
    {
      id: 'cons-01',
      farmerName: 'Samuel Kiprop Kimani',
      farm: 'Rongai Valley Mixed Farm, Nakuru',
      phone: '0722123456',
      crop: 'Hybrid Maize & French Beans',
      issue: 'Interveinal chlorosis on young maize leaves and low soil pH (5.2). Requesting liming and top-dressing program.',
      requestedAt: '2026-10-20 09:30 AM',
      feeKsh: 800,
      status: 'pending',
    },
    {
      id: 'cons-02',
      farmerName: 'Wanjiru Karimi',
      farm: 'Ol-Kalou Dairy & Potato Plot, Nyandarua',
      phone: '0711445566',
      crop: 'Shangi Potatoes',
      issue: 'Early blight lesion scouting. Needs PCPB registered fungicide schedule before flowering.',
      requestedAt: '2026-10-19 02:15 PM',
      feeKsh: 800,
      status: 'completed',
      prescription: 'Apply Azoxystrobin + Difenoconazole at 20ml/20L knapsack. Alternate with Mancozeb 800g/kg to manage fungal resistance. 14-day PHI.',
    },
    {
      id: 'cons-03',
      farmerName: 'Kiplangat Cheruiyot',
      farm: 'Bomet Tea & Avocado Farm',
      phone: '0729331122',
      crop: 'Hass Avocados (Export Grade)',
      issue: 'Flower drop during dry spell. Irrigation scheduling and boron foliar application guidance needed.',
      requestedAt: '2026-10-18 11:00 AM',
      feeKsh: 800,
      status: 'pending',
    }
  ]);

  const [fieldVisits, setFieldVisits] = useState([
    {
      id: 'visit-1',
      farmName: 'Rongai Valley Mixed Farm',
      location: 'Njoro, Nakuru County',
      date: 'Tomorrow, 10:00 AM',
      purpose: 'Field soil sampling and lime incorporation inspection',
      status: 'Confirmed',
    },
    {
      id: 'visit-2',
      farmName: 'Limuru Floriculture Greenhouses',
      location: 'Limuru, Kiambu County',
      date: 'Thursday, 02:00 PM',
      purpose: 'Hydroponic nutrient balance audit (EC & pH meters calibration)',
      status: 'Confirmed',
    }
  ]);

  const handleSendAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    setConsultations(consultations.map(c => 
      c.id === selectedCase.id 
        ? { ...c, status: 'completed', prescription: advisoryNote }
        : c
    ));

    setSelectedCase(null);
    setAdvisoryNote('');
    setNotice(`Agronomy advisory and certified prescription dispatched to ${selectedCase.farmerName} via SMS & Portal!`);
    setTimeout(() => setNotice(null), 5000);
  };

  const completedCount = consultations.filter(c => c.status === 'completed').length;
  const pendingCount = consultations.filter(c => c.status === 'pending').length;
  const totalEarnings = completedCount * 800 + 12800;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {notice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-[#214E34] p-1 cursor-pointer">✕</button>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] font-extrabold text-2xl flex items-center justify-center overflow-hidden shrink-0">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#EBF3ED] text-[#214E34] px-2.5 py-0.5 rounded border border-[#CFD7CA] flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#367C46]" /> Licensed Senior Agronomist
              </span>
              <span className="text-[11px] font-medium text-[#68756A] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {currentUser.county} County
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#214E34] mt-1">{currentUser.name}</h1>
            <p className="text-xs text-[#68756A]">
              {currentUser.organizationName || 'Kenya Precision Agronomy & Extension Ltd'} · KASP Reg: <span className="font-mono font-bold text-[#252D27]">{currentUser.licenseNumber || 'KASP-AGR-4920'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#FCF8EE] p-3 rounded-lg border border-[#E2E7DE] text-right">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs justify-end">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.96 / 5.0</span>
            </div>
            <div className="text-[10px] text-[#68756A]">142 Verified Farmer Reviews</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Pending Consultations</span>
            <Clock className="w-4 h-4 text-[#D6A545]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{pendingCount}</div>
          <div className="text-[11px] text-[#D6A545] font-semibold mt-1">Requires agronomy advisory</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Completed Advisories</span>
            <CheckCircle2 className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{completedCount + 42}</div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">Dispatched to Kenyan farmers</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Scheduled Field Visits</span>
            <Calendar className="w-4 h-4 text-[#214E34]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{fieldVisits.length}</div>
          <div className="text-[11px] text-[#68756A] mt-1">Nakuru & Kiambu counties</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Consultation Earnings</span>
            <DollarSign className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#214E34]">
            KSh {totalEarnings.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">Direct to M-Pesa account</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E7DE] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'requests' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Farmer Advisories Queue ({consultations.length})
        </button>
        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'visits' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Farm Field Visits Schedule
        </button>
      </div>

      {/* Consultations Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {consultations.map((c) => (
            <div key={c.id} className="bg-white rounded-xl p-5 border border-[#E2E7DE] shadow-xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E2E7DE] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#252D27]">{c.farmerName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      c.status === 'completed' ? 'bg-[#EBF3ED] text-[#214E34]' : 'bg-[#FCF8EE] text-[#79543A]'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#68756A]">
                    {c.farm} · Focus: <strong className="text-[#214E34]">{c.crop}</strong> · Tel: {c.phone}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-[#367C46]">Fee Paid: KSh {c.feeKsh}</div>
                  <div className="text-[10px] text-[#68756A]">{c.requestedAt}</div>
                </div>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] text-[#252D27]">
                <strong className="text-[#214E34]">Farmer Query:</strong> {c.issue}
              </div>

              {c.prescription && (
                <div className="p-3 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA] text-[#214E34]">
                  <strong>Official Agronomist Advice & Prescription:</strong> {c.prescription}
                </div>
              )}

              {c.status === 'pending' && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setSelectedCase(c);
                      setAdvisoryNote(`Based on soil characteristics in ${c.farm}, apply CAN topdressing at 75kg/acre during knee-height stage. Incorporate agricultural lime 4 weeks before next planting to raise pH.`);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#367C46] hover:bg-[#2B6437] text-white px-4 py-2 rounded-lg font-bold shadow-xs transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Issue Agronomy Advisory</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Field Visits Tab */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
            <div>
              <h2 className="text-base font-bold text-[#214E34]">Scheduled On-Site Farm Consultations</h2>
              <p className="text-[#68756A]">GPS-tagged field audits, soil auger sampling and greenhouse inspections</p>
            </div>
          </div>

          <div className="divide-y divide-[#E2E7DE]">
            {fieldVisits.map((v) => (
              <div key={v.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-[#252D27]">{v.farmName}</div>
                  <div className="text-[#68756A] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#367C46]" /> {v.location}
                  </div>
                  <div className="text-[11px] text-[#252D27] mt-1">
                    <strong>Objective:</strong> {v.purpose}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#367C46] bg-[#EBF3ED] px-2.5 py-1 rounded">
                    {v.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advisory Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <h3 className="text-base font-bold text-[#214E34]">Issue Certified Agronomy Advice</h3>
              <button onClick={() => setSelectedCase(null)} className="text-[#68756A] hover:text-[#252D27] cursor-pointer">✕</button>
            </div>

            <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
              <div className="font-bold text-[#252D27]">{selectedCase.farmerName}</div>
              <div className="text-[#68756A]">{selectedCase.farm} · {selectedCase.crop}</div>
              <div className="text-[#252D27] mt-1">{selectedCase.issue}</div>
            </div>

            <form onSubmit={handleSendAdvisory} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">
                  Agronomic Diagnosis, Fertilizer Protocol & PCPB Active Ingredients
                </label>
                <textarea
                  rows={5}
                  required
                  value={advisoryNote}
                  onChange={(e) => setAdvisoryNote(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Official Prescription</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
