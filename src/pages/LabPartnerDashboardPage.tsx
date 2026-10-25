import React, { useState } from 'react';
import { 
  FlaskConical, 
  FileText, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Send, 
  PlusCircle, 
  Award,
  AlertCircle
} from 'lucide-react';
import { agriStore } from '../services/store';
import { SoilTestRequest } from '../types';

export const LabPartnerDashboardPage: React.FC = () => {
  const currentUser = agriStore.getCurrentUser();
  const [requests, setRequests] = useState<SoilTestRequest[]>(agriStore.getSoilRequests());
  const [activeTab, setActiveTab] = useState<'queue' | 'entry' | 'completed'>('queue');
  const [selectedSample, setSelectedSample] = useState<SoilTestRequest | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Lab analysis entry form
  const [ph, setPh] = useState(5.4);
  const [nitrogen, setNitrogen] = useState(0.18);
  const [phosphorus, setPhosphorus] = useState(14.2);
  const [potassium, setPotassium] = useState(210);
  const [organicMatter, setOrganicMatter] = useState(2.4);
  const [soilTexture, setSoilTexture] = useState<'Red Volcanic Clay' | 'Clay Loam' | 'Sandy Loam' | 'Silt Loam'>('Red Volcanic Clay');
  const [limeRequirement, setLimeRequirement] = useState(550);
  const [basalRec, setBasalRec] = useState('Apply NPK 23:23:0 at 75kg/acre at planting (Avoid DAP due to soil acidification).');
  const [topDressRec, setTopDressRec] = useState('CAN (Calcium Ammonium Nitrate) at 75kg/acre when maize is knee-high.');
  const [agronomistNotes, setAgronomistNotes] = useState('Moderate soil acidity detected. Liming recommended 4 weeks prior to next planting rain season.');

  const handleOpenSample = (sample: SoilTestRequest) => {
    setSelectedSample(sample);
    setActiveTab('entry');
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSample) return;

    const updatedRequests = requests.map(r => {
      if (r.id === selectedSample.id) {
        return {
          ...r,
          status: 'completed' as const,
          result: {
            ph: Number(ph),
            phClassification: ph < 5.5 ? 'Moderately Acidic' as const : (ph > 7.5 ? 'Alkaline' as const : 'Optimal (Neutral)' as const),
            nitrogenPercent: Number(nitrogen),
            phosphorusPpm: Number(phosphorus),
            potassiumPpm: Number(potassium),
            organicMatterPercent: Number(organicMatter),
            soilTexture,
            salinityEc: 0.25,
            suitabilityScore: 78,
            limeRequirementKgPerAcre: Number(limeRequirement),
            recommendedBasalFertilizer: basalRec,
            recommendedTopDressing: topDressRec,
            organicRemedies: [
              'Apply 5 tonnes/acre of well-composted farmyard manure',
              'Incorporate agricultural lime before planting',
              'Intercrop with legumes to fix atmospheric nitrogen',
            ],
            agronomistNotes,
            labOfficerName: currentUser.name,
            reportPdfUrl: '#',
          }
        };
      }
      return r;
    });

    setRequests(updatedRequests);
    setSelectedSample(null);
    setActiveTab('queue');
    setNotice(`Official Soil Certificate issued for Sample ${selectedSample.sampleCode}! Notification sent to farmer.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const pendingSamples = requests.filter(r => r.status !== 'completed');
  const completedSamples = requests.filter(r => r.status === 'completed');

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

      {/* Lab Profile Header */}
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
                <FlaskConical className="w-3.5 h-3.5 text-[#367C46]" /> ISO 17025 Accredited Laboratory
              </span>
              <span className="text-[11px] font-medium text-[#68756A] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {currentUser.county} County
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#214E34] mt-1">
              {currentUser.organizationName || 'KALRO National Agricultural Research Laboratories (NARL)'}
            </h1>
            <p className="text-xs text-[#68756A]">
              Director: {currentUser.name} · KENAS ISO Code: <span className="font-mono font-bold text-[#252D27]">{currentUser.licenseNumber || 'KENAS-ISO-17025-TL-014'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#FCF8EE] text-[#79543A] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E2E7DE] flex items-center gap-1">
            <Award className="w-4 h-4 text-[#D6A545]" /> National Soil Health Reference Lab
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Samples In Queue</span>
            <Clock className="w-4 h-4 text-[#D6A545]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{pendingSamples.length}</div>
          <div className="text-[11px] text-[#D6A545] font-semibold mt-1">Spectrometer testing pending</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Completed Certificates</span>
            <CheckCircle2 className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">{completedSamples.length + 380}</div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">Published to farmer portals</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Turnaround Average</span>
            <FlaskConical className="w-4 h-4 text-[#214E34]" />
          </div>
          <div className="text-2xl font-extrabold text-[#252D27]">3.5 Days</div>
          <div className="text-[11px] text-[#68756A] mt-1">Standard full chemical profile</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E7DE] shadow-xs">
          <div className="flex items-center justify-between text-[#68756A] mb-1">
            <span className="text-xs font-medium">Diagnostic Fee Revenue</span>
            <DollarSign className="w-4 h-4 text-[#367C46]" />
          </div>
          <div className="text-2xl font-extrabold text-[#214E34]">KSh 570,000</div>
          <div className="text-[11px] text-[#367C46] font-semibold mt-1">KALRO Treasury Account</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E7DE] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'queue' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Sample Intake Queue ({pendingSamples.length})
        </button>
        {selectedSample && (
          <button
            onClick={() => setActiveTab('entry')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'entry' 
                ? 'bg-[#214E34] text-white shadow-xs' 
                : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
            }`}
          >
            Entering Data: {selectedSample.sampleCode}
          </button>
        )}
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer ${
            activeTab === 'completed' 
              ? 'bg-[#214E34] text-white shadow-xs' 
              : 'text-[#68756A] hover:bg-white hover:text-[#252D27]'
          }`}
        >
          Completed Certificates ({completedSamples.length})
        </button>
      </div>

      {/* Queue Tab */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl p-5 border border-[#E2E7DE] shadow-xs space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E2E7DE] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#214E34]">{req.sampleCode}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      req.status === 'completed' ? 'bg-[#EBF3ED] text-[#214E34]' : 'bg-[#FCF8EE] text-[#79543A]'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-[10px] bg-[#F7F6F0] text-[#68756A] px-2 py-0.5 rounded border border-[#E2E7DE]">
                      Via {req.submissionMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#68756A] mt-0.5">
                    Farmer: <strong>{req.farmerName}</strong> ({req.farmerPhone}) · {req.county} County ({req.subCounty})
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[#252D27]">Target: {req.intendedCrop}</div>
                  <div className="text-[11px] text-[#68756A]">Field: {req.fieldName} ({req.farmSizeAcres} Acres)</div>
                </div>
              </div>

              {req.result ? (
                <div className="p-3 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA] text-[#214E34]">
                  <div className="font-bold">Official Lab Findings:</div>
                  <div className="mt-1 space-x-3 text-[11px]">
                    <span>pH: <strong>{req.result.ph} ({req.result.phClassification})</strong></span>
                    <span>P: <strong>{req.result.phosphorusPpm} ppm</strong></span>
                    <span>K: <strong>{req.result.potassiumPpm} ppm</strong></span>
                    <span>Lime Needed: <strong>{req.result.limeRequirementKgPerAcre} kg/acre</strong></span>
                  </div>
                  <div className="mt-1 text-[11px]">
                    Recommendation: {req.result.recommendedBasalFertilizer}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#68756A]">
                    Sample Received in laboratory. Ready for pH and ICP Spectrometry analysis.
                  </span>
                  <button
                    onClick={() => handleOpenSample(req)}
                    className="inline-flex items-center gap-1.5 bg-[#367C46] hover:bg-[#2B6437] text-white px-4 py-2 rounded-lg font-bold shadow-xs transition cursor-pointer"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Enter Spectrometer Data</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Entry Form Tab */}
      {activeTab === 'entry' && selectedSample && (
        <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs space-y-4 text-xs">
          <div className="pb-3 border-b border-[#E2E7DE]">
            <h2 className="text-base font-bold text-[#214E34]">
              Sample Chemical & Physical Analysis Form: {selectedSample.sampleCode}
            </h2>
            <p className="text-[#68756A]">
              Farmer: {selectedSample.farmerName} · Field: {selectedSample.fieldName} · Intended Crop: {selectedSample.intendedCrop}
            </p>
          </div>

          <form onSubmit={handleSaveResult} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Soil pH (H2O 1:2.5)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={ph}
                  onChange={(e) => setPh(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Available Phosphorus (ppm)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Potassium (ppm)</label>
                <input
                  type="number"
                  required
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Total Nitrogen (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Organic Carbon / Matter (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={organicMatter}
                  onChange={(e) => setOrganicMatter(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Soil Texture Classification</label>
                <select
                  value={soilTexture}
                  onChange={(e) => setSoilTexture(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                >
                  <option value="Red Volcanic Clay">Red Volcanic Clay (Kikuyu Loam)</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Silt Loam">Silt Loam</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Lime Requirement (kg / Acre)</label>
                <input
                  type="number"
                  required
                  value={limeRequirement}
                  onChange={(e) => setLimeRequirement(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#252D27] mb-1">Recommended Basal Fertilizer Formulation</label>
              <input
                type="text"
                required
                value={basalRec}
                onChange={(e) => setBasalRec(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#252D27] mb-1">Recommended Top-Dressing Formulation</label>
              <input
                type="text"
                required
                value={topDressRec}
                onChange={(e) => setTopDressRec(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#252D27] mb-1">Senior Analyst Interpretation Notes</label>
              <textarea
                rows={3}
                value={agronomistNotes}
                onChange={(e) => setAgronomistNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('queue')}
                className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold cursor-pointer"
              >
                Back to Queue
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-[#D6A545]" />
                <span>Issue & Sign Official Certificate</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Completed Tab */}
      {activeTab === 'completed' && (
        <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-[#E2E7DE] flex items-center justify-between">
            <span className="font-bold text-[#214E34]">Archived Soil Health Certifications</span>
            <span className="text-[#68756A]">{completedSamples.length} Active Records</span>
          </div>

          <table className="w-full text-left">
            <thead className="bg-[#F7F6F0] text-[#68756A] font-semibold border-b border-[#E2E7DE]">
              <tr>
                <th className="p-3">Sample Code</th>
                <th className="p-3">Farmer & County</th>
                <th className="p-3">Field & Crop</th>
                <th className="p-3">pH Status</th>
                <th className="p-3">Basal Recommendation</th>
                <th className="p-3">Date Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E7DE]">
              {completedSamples.map((cs) => (
                <tr key={cs.id} className="hover:bg-[#FDFCF7]">
                  <td className="p-3 font-mono font-bold text-[#214E34]">{cs.sampleCode}</td>
                  <td className="p-3">
                    <div className="font-bold text-[#252D27]">{cs.farmerName}</div>
                    <div className="text-[11px] text-[#68756A]">{cs.county} County</div>
                  </td>
                  <td className="p-3">
                    <div>{cs.fieldName}</div>
                    <div className="text-[10px] text-[#68756A] font-semibold">{cs.intendedCrop}</div>
                  </td>
                  <td className="p-3">
                    <span className="bg-[#EBF3ED] text-[#214E34] text-[10px] font-bold px-2 py-0.5 rounded">
                      pH {cs.result?.ph} ({cs.result?.phClassification})
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-[#252D27] max-w-xs truncate">
                    {cs.result?.recommendedBasalFertilizer}
                  </td>
                  <td className="p-3 text-[11px] text-[#68756A]">
                    {new Date(cs.requestedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
