import React, { useState } from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  FileCheck, 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  PlusCircle, 
  Clock, 
  DollarSign, 
  Send,
  AlertTriangle,
  Award
} from 'lucide-react';
import { agriStore } from '../services/store';

export const VeterinarianDashboardPage: React.FC = () => {
  const currentUser = agriStore.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'clinical' | 'vaccines' | 'permits'>('clinical');
  const [notice, setNotice] = useState<string | null>(null);

  const [clinicalCases, setClinicalCases] = useState([
    {
      id: 'vet-case-1',
      farmer: 'Samuel Kiprop Kimani',
      location: 'Njoro, Nakuru County',
      phone: '0722123456',
      animal: 'Pedigree Friesian Cow (Ear Tag: KE-NK-8921)',
      symptoms: 'Swollen right rear quarter, fever (40.2°C), flakes in foremilk. Suspected acute environmental mastitis.',
      reportedAt: 'Today, 08:30 AM',
      urgency: 'High',
      status: 'pending',
    },
    {
      id: 'vet-case-2',
      farmer: 'Geoffrey Rotich',
      location: 'Moiben, Uasin Gishu',
      phone: '0721884422',
      animal: 'Ayrshire Heifer batch (5 head)',
      symptoms: 'Enlarged parotid lymph nodes, corneal opacity, high tick burden. Suspected East Coast Fever (ECF).',
      reportedAt: 'Yesterday, 04:00 PM',
      urgency: 'Severe',
      status: 'attended',
      treatment: 'Administered Buparvaquone (Bupanor) at 2.5mg/kg deep IM. Recommended Amitraz 12.5% plunge dip.',
    }
  ]);

  const [vaccineCertificates, setVaccineCertificates] = useState([
    {
      id: 'vax-cert-881',
      herdOwner: 'Rongai Valley Mixed Farm',
      animalType: 'Dairy Cattle (12 Cows)',
      vaccine: 'Foot & Mouth Disease (FMD Quadrivalent) + Anthrax & Blackquarter',
      batchNumber: 'KEVEVAPI-FMD-2026-90',
      dateAdministered: '2026-10-12',
      validUntil: '2027-10-12',
      vetLicense: 'KVB-VS-2940',
      status: 'Certified Valid',
    },
    {
      id: 'vax-cert-882',
      herdOwner: 'Naivasha Boer Goat Stud',
      animalType: 'Breeding Goats (25 head)',
      vaccine: 'Contagious Caprine Pleuropneumonia (CCPP)',
      batchNumber: 'KEVEVAPI-CCPP-104',
      dateAdministered: '2026-09-28',
      validUntil: '2027-09-28',
      vetLicense: 'KVB-VS-2940',
      status: 'Certified Valid',
    }
  ]);

  const [movementPermits, setMovementPermits] = useState([
    {
      id: 'permit-2026-441',
      consignor: 'Samuel Kiprop (Nakuru)',
      consignee: 'Josephine Akinyi (Kisumu Dairy)',
      animal: '1 In-Calf Pedigree Friesian Cow',
      route: 'Nakuru (A104) -> Kericho -> Kisumu',
      quarantineClearance: 'Notifiable Disease Free Zone',
      issuedDate: '2026-10-19',
      status: 'Authorized & KeNHA Cleared',
    }
  ]);

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [rxNotes, setRxNotes] = useState('');
  const [withdrawalPeriod, setWithdrawalPeriod] = useState('72 hours for milk; 14 days for meat');

  const handleIssueRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    setClinicalCases(clinicalCases.map(c => 
      c.id === selectedCase.id 
        ? { ...c, status: 'attended', treatment: `${rxNotes} (Withdrawal: ${withdrawalPeriod})` }
        : c
    ));

    setSelectedCase(null);
    setShowPrescriptionModal(false);
    setNotice(`Official KVB veterinary treatment protocol issued to ${selectedCase.farmer}!`);
    setTimeout(() => setNotice(null), 5000);
  };

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

      {/* Header Profile */}
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
                <Stethoscope className="w-3.5 h-3.5 text-[#367C46]" /> Kenya Veterinary Board (KVB) Licensed Surgeon
              </span>
              <span className="text-[11px] font-medium text-[#68756A] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {currentUser.county} County
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#214E34] mt-1">{currentUser.name}</h1>
            <p className="text-xs text-[#68756A]">
              {currentUser.organizationName || 'Great Rift Mobile Livestock & Dairy Clinic'} · KVB License: <span className="font-mono font-bold text-[#252D27]">{currentUser.licenseNumber || 'KVB-VS-2940'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#FCF8EE] text-[#79543A] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E2E7DE]">
            Official Livestock Health Authority
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Pending Urgent Cases</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">
            {clinicalCases.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Dairy herds requiring attention</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Vaccine Sign-Offs</span>
            <FileCheck className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{vaccineCertificates.length + 38}</div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">KEVEVAPI certified batches</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Movement Permits</span>
            <ShieldCheck className="w-4 h-4 text-[#214E34]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{movementPermits.length + 14}</div>
          <div className="text-[11px] text-[#68756A] mt-1">Inter-county transit compliant</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Clinical Services Ledger</span>
            <DollarSign className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#214E34]">KSh 38,400</div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">M-Pesa escrow settlements</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E7DE] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('clinical')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'clinical' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Clinical Cases & Triage ({clinicalCases.length})
        </button>
        <button
          onClick={() => setActiveTab('vaccines')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'vaccines' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Vaccination Certificates (KEVEVAPI)
        </button>
        <button
          onClick={() => setActiveTab('permits')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'permits' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Livestock Movement Permits
        </button>
      </div>

      {/* Clinical Tab */}
      {activeTab === 'clinical' && (
        <div className="space-y-4">
          {clinicalCases.map((cs) => (
            <div key={cs.id} className="bg-white rounded-xl p-5 border border-[#E2E7DE] shadow-xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E2E7DE] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#252D27]">{cs.animal}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      cs.status === 'attended' ? 'bg-[#EBF3ED] text-[#214E34]' : 'bg-[#FCF8EE] text-amber-700'
                    }`}>
                      {cs.status}
                    </span>
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      Urgency: {cs.urgency}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#68756A] mt-0.5">
                    Farmer: <strong>{cs.farmer}</strong> · {cs.location} · Tel: {cs.phone}
                  </div>
                </div>

                <div className="text-right text-[11px] text-[#68756A]">
                  Reported: {cs.reportedAt}
                </div>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                <strong className="text-[#214E34]">Clinical Symptoms:</strong> {cs.symptoms}
              </div>

              {cs.treatment && (
                <div className="p-3 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA] text-[#214E34]">
                  <strong>Official Prescription & Treatment:</strong> {cs.treatment}
                </div>
              )}

              {cs.status === 'pending' && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setSelectedCase(cs);
                      setRxNotes('Administer Intramammary Infusion (Cloxacillin/Ampicillin) following complete aseptic milk stripping. Anti-inflammatory Flunixin Meglumine 2.2mg/kg IV.');
                      setShowPrescriptionModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#367C46] hover:bg-[#2B6437] text-white px-4 py-2 rounded-lg font-bold shadow-xs transition cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Issue Veterinary Rx & Regimen</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Vaccine Certificates Tab */}
      {activeTab === 'vaccines' && (
        <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-[#E2E7DE] flex items-center justify-between">
            <span className="font-bold text-[#214E34]">Officially Certified Vaccination Log</span>
            <button className="bg-[#367C46] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Issue New Certificate</span>
            </button>
          </div>

          <table className="w-full text-left">
            <thead className="bg-[#F7F6F0] text-[#68756A] font-semibold border-b border-[#E2E7DE]">
              <tr>
                <th className="p-3">Certificate ID</th>
                <th className="p-3">Herd Owner</th>
                <th className="p-3">Animal Group</th>
                <th className="p-3">Vaccine & KEVEVAPI Batch</th>
                <th className="p-3">Validity</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E7DE]">
              {vaccineCertificates.map((vc) => (
                <tr key={vc.id} className="hover:bg-[#FDFCF7]">
                  <td className="p-3 font-mono font-bold text-[#214E34]">{vc.id}</td>
                  <td className="p-3 font-semibold text-[#252D27]">{vc.herdOwner}</td>
                  <td className="p-3 text-[#68756A]">{vc.animalType}</td>
                  <td className="p-3">
                    <div className="font-medium text-[#252D27]">{vc.vaccine}</div>
                    <div className="text-[10px] text-[#68756A] font-mono">Lot: {vc.batchNumber}</div>
                  </td>
                  <td className="p-3 text-[#252D27]">Valid until {vc.validUntil}</td>
                  <td className="p-3">
                    <span className="bg-[#EBF3ED] text-[#214E34] text-[10px] font-bold px-2 py-0.5 rounded">
                      {vc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Movement Permits Tab */}
      {activeTab === 'permits' && (
        <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
            <div>
              <h2 className="text-base font-bold text-[#214E34]">Livestock Interstate Movement Clearances</h2>
              <p className="text-[#68756A]">Ensures disease-free herd transit across KeNHA weighbridges and veterinary barriers</p>
            </div>
          </div>

          <div className="divide-y divide-[#E2E7DE]">
            {movementPermits.map((mp) => (
              <div key={mp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#214E34]">{mp.id}</span>
                    <span className="font-bold text-[#252D27]">{mp.animal}</span>
                    <span className="bg-[#EBF3ED] text-[#214E34] text-[10px] font-bold px-2 py-0.5 rounded">
                      {mp.status}
                    </span>
                  </div>
                  <div className="text-[#68756A]">
                    From: {mp.consignor} · To: {mp.consignee}
                  </div>
                  <div className="text-[11px] text-[#252D27]">
                    <strong>Permitted Corridor:</strong> {mp.route} · {mp.quarantineClearance}
                  </div>
                </div>

                <div className="text-right">
                  <button className="bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#214E34] font-bold px-3 py-1.5 rounded-lg border border-[#E2E7DE] transition cursor-pointer">
                    Download KVB Slip (PDF)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <h3 className="text-base font-bold text-[#214E34]">Issue Licensed Veterinary Prescription</h3>
              <button onClick={() => setShowPrescriptionModal(false)} className="text-[#68756A] hover:text-[#252D27] cursor-pointer">✕</button>
            </div>

            <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
              <div className="font-bold text-[#252D27]">{selectedCase.animal}</div>
              <div className="text-[#68756A]">Farmer: {selectedCase.farmer} ({selectedCase.location})</div>
            </div>

            <form onSubmit={handleIssueRx} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">
                  Active Drug Formulation, Dose & Route
                </label>
                <textarea
                  rows={4}
                  required
                  value={rxNotes}
                  onChange={(e) => setRxNotes(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">
                  Mandatory Consumer Withdrawal Period (Milk & Meat)
                </label>
                <input
                  type="text"
                  required
                  value={withdrawalPeriod}
                  onChange={(e) => setWithdrawalPeriod(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Sign & Issue with KVB Seal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
