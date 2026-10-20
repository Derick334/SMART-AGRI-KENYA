import React, { useState } from 'react';
import { 
  TestTube, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Download, 
  Building2,
  Send,
  Leaf
} from 'lucide-react';
import { SoilTestRequest } from '../types';
import { SOIL_LAB_PARTNERS } from '../data/sampleSoilLabs';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { agriStore } from '../services/store';

export const SoilTestingPage: React.FC = () => {
  const [requests, setRequests] = useState<SoilTestRequest[]>(agriStore.getSoilRequests());
  const [selectedRequest, setSelectedRequest] = useState<SoilTestRequest | null>(requests[0] || null);

  // New Request Form State
  const [showForm, setShowForm] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [farmSizeAcres, setFarmSizeAcres] = useState(3);
  const [county, setCounty] = useState('Nakuru');
  const [subCounty, setSubCounty] = useState('Njoro');
  const [intendedCrop, setIntendedCrop] = useState('Maize (Hybrid)');
  const [previousCrop, setPreviousCrop] = useState('Maize');
  const [previousFertilizer, setPreviousFertilizer] = useState('DAP 50kg/acre');
  const [submissionMethod, setSubmissionMethod] = useState<'courier_dispatch' | 'drop_at_lab' | 'field_agent_sampling'>('courier_dispatch');
  const [preferredLabId, setPreferredLabId] = useState('lab-kalro-narl');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  const currentUser = agriStore.getCurrentUser();

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const lab = SOIL_LAB_PARTNERS.find(l => l.id === preferredLabId);

    setTimeout(() => {
      const newReq = agriStore.submitSoilRequest({
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        farmerPhone: currentUser.phone,
        county,
        subCounty,
        fieldName,
        farmSizeAcres: Number(farmSizeAcres),
        intendedCrop,
        previousCrop,
        previousFertilizer,
        submissionMethod,
        labId: preferredLabId,
        labName: lab?.name || 'KALRO National Agricultural Laboratories',
      });

      setRequests(agriStore.getSoilRequests());
      setSelectedRequest(newReq);
      setShowForm(false);
      setSubmitting(false);
      setSuccessNotice(`Soil test request submitted successfully! Sample code: ${newReq.sampleCode}`);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Soil Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#79543A] text-xs font-bold uppercase tracking-wider mb-2">
              <TestTube className="w-4 h-4 text-[#79543A]" />
              <span>National Soil Health & Fertility Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
              Professional Soil Testing & Crop Fertilization Advisory
            </h1>
            <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
              Stop guessing your fertilizer needs. Partnered with official KALRO National Agricultural Laboratories (NARL) and CropNuts to provide accurate pH, N-P-K, organic carbon, and lime recommendations.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <TestTube className="w-4 h-4" />
            <span>{showForm ? 'View Test History' : 'Request Soil Analysis'}</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-medium rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice('')} className="text-[#214E34] font-bold cursor-pointer">×</button>
        </div>
      )}

      {/* Main Grid: Request Form OR Test Result Details */}
      {showForm ? (
        /* Request Soil Analysis Form */
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
          <div className="border-b border-[#E2E7DE] pb-4 mb-6">
            <h2 className="text-lg font-bold text-[#214E34]">
              Submit Farm Soil Sample for Laboratory Analysis
            </h2>
            <p className="text-xs text-[#68756A] mt-0.5">
              Fill in your field location and history. A courier will collect your soil sample or you can drop it at the nearest KALRO depot.
            </p>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Field Name / Shamba Block</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upper Shamba, Plot B"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Farm Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.25"
                  required
                  value={farmSizeAcres}
                  onChange={(e) => setFarmSizeAcres(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Intended Crop to Plant</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maize, Potatoes, Hass Avocados"
                  value={intendedCrop}
                  onChange={(e) => setIntendedCrop(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Farm County</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none cursor-pointer"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.name} County</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Sub-County / Ward</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Njoro, Moiben, Kandara"
                  value={subCounty}
                  onChange={(e) => setSubCounty(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
                />
              </div>
            </div>

            {/* Previous Crop & Fertilizer History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Previous Crop in this Field</label>
                <input
                  type="text"
                  placeholder="e.g. Maize (continuous for 2 seasons)"
                  value={previousCrop}
                  onChange={(e) => setPreviousCrop(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Previous Fertilizer Used</label>
                <input
                  type="text"
                  placeholder="e.g. DAP 50kg/acre, CAN topdress"
                  value={previousFertilizer}
                  onChange={(e) => setPreviousFertilizer(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
                />
              </div>
            </div>

            {/* Accredited Soil Labs */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#252D27] uppercase tracking-wider mb-2">
                Select Certified Laboratory Partner
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SOIL_LAB_PARTNERS.map((lab) => (
                  <div
                    key={lab.id}
                    onClick={() => setPreferredLabId(lab.id)}
                    className={`p-3.5 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                      preferredLabId === lab.id
                        ? 'border-[#367C46] bg-[#EBF3ED] shadow-xs'
                        : 'border-[#E2E7DE] bg-white hover:bg-[#F7F6F0]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-[#79543A]">{lab.county}</span>
                        <span className="font-bold text-xs text-[#214E34] tabular-nums">KSh {lab.standardFeeKsh.toLocaleString()}</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#252D27]">{lab.name}</h4>
                      <p className="text-[11px] text-[#68756A] mt-1">{lab.accreditation}</p>
                    </div>
                    <span className="text-[10px] text-[#367C46] font-semibold mt-2">
                      Turnaround: {lab.turnaroundDays} business days
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Method */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#252D27] uppercase tracking-wider mb-2">
                Sample Collection & Dispatch Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSubmissionMethod('courier_dispatch')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                    submissionMethod === 'courier_dispatch'
                      ? 'border-[#367C46] bg-[#EBF3ED] font-semibold text-[#214E34]'
                      : 'border-[#E2E7DE] text-[#252D27] hover:bg-[#F7F6F0]'
                  }`}
                >
                  <span className="block font-bold">Courier Farm Pickup</span>
                  <span className="text-[10px] text-[#68756A]">Transporter collects sample</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmissionMethod('drop_at_lab')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                    submissionMethod === 'drop_at_lab'
                      ? 'border-[#367C46] bg-[#EBF3ED] font-semibold text-[#214E34]'
                      : 'border-[#E2E7DE] text-[#252D27] hover:bg-[#F7F6F0]'
                  }`}
                >
                  <span className="block font-bold">Self Drop-Off at Lab</span>
                  <span className="text-[10px] text-[#68756A]">Drop at nearest county depot</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmissionMethod('field_agent_sampling')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                    submissionMethod === 'field_agent_sampling'
                      ? 'border-[#367C46] bg-[#EBF3ED] font-semibold text-[#214E34]'
                      : 'border-[#E2E7DE] text-[#252D27] hover:bg-[#F7F6F0]'
                  }`}
                >
                  <span className="block font-bold">Field Officer Visit</span>
                  <span className="text-[10px] text-[#68756A]">Agronomist takes zigzag samples</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E7DE] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-xs font-semibold text-[#252D27] hover:bg-[#F7F6F0] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Registering Sample...' : 'Submit Soil Test Request'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Soil Tests Overview & Selected Report View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Requests History List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-[#214E34] text-sm flex items-center justify-between">
              <span>Your Soil Test Requests</span>
              <span className="text-xs bg-[#EBF3ED] text-[#214E34] px-2 py-0.5 rounded font-bold tabular-nums">
                {requests.length}
              </span>
            </h3>

            {requests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-3.5 rounded-lg border transition cursor-pointer ${
                  selectedRequest?.id === req.id
                    ? 'border-[#367C46] bg-[#EBF3ED] shadow-xs'
                    : 'border-[#E2E7DE] bg-white hover:bg-[#F7F6F0]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-bold text-[#79543A]">
                    {req.sampleCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    req.status === 'completed'
                      ? 'bg-[#EBF3ED] text-[#214E34]'
                      : 'bg-[#FCF8EE] text-[#79543A]'
                  }`}>
                    {req.status === 'completed' ? 'Report Ready' : 'In Progress'}
                  </span>
                </div>

                <h4 className="font-bold text-[#252D27] text-xs">{req.fieldName}</h4>
                <p className="text-[11px] text-[#68756A] mt-0.5">
                  Target Crop: {req.intendedCrop} · {req.farmSizeAcres} Acres
                </p>
                <p className="text-[10px] text-[#68756A] mt-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#367C46]" />
                  {req.labName}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Detailed Laboratory Report */}
          <div className="lg:col-span-8">
            {selectedRequest && selectedRequest.result ? (
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs space-y-6">
                {/* Report Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E7DE]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#79543A] tracking-wider block">
                      Certified Soil Chemistry Analysis
                    </span>
                    <h2 className="text-xl font-extrabold text-[#214E34] mt-0.5">
                      {selectedRequest.fieldName} ({selectedRequest.intendedCrop})
                    </h2>
                    <p className="text-xs text-[#68756A] mt-0.5">
                      Sample Code: <span className="font-mono font-bold text-[#252D27]">{selectedRequest.sampleCode}</span> · Lab: {selectedRequest.labName}
                    </p>
                  </div>

                  <button
                    onClick={() => setSuccessNotice(`Official laboratory PDF soil certificate for ${selectedRequest.sampleCode} generated and ready for download.`)}
                    className="bg-[#214E34] hover:bg-[#183C27] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D6A545]" />
                    <span>Download PDF</span>
                  </button>
                </div>

                {/* Score & pH Overview Cards with Earth Brown & Leaf Green */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-[#F7F2EE] rounded-lg border border-[#E2E7DE]">
                    <span className="text-[10px] font-bold text-[#79543A] uppercase block">Soil pH (H₂O)</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-[#252D27] tabular-nums">
                        {selectedRequest.result.ph}
                      </span>
                      <span className="text-[10px] font-bold text-[#79543A]">
                        {selectedRequest.result.phClassification}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                    <span className="text-[10px] font-bold text-[#68756A] uppercase block">Phosphorus (P)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-[#252D27] tabular-nums">
                        {selectedRequest.result.phosphorusPpm}
                      </span>
                      <span className="text-[10px] font-semibold text-[#79543A]">ppm (Low)</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA]">
                    <span className="text-[10px] font-bold text-[#367C46] uppercase block">Potassium (K)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-[#214E34] tabular-nums">
                        {selectedRequest.result.potassiumPpm}
                      </span>
                      <span className="text-[10px] font-semibold text-[#367C46]">ppm (Optimal)</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                    <span className="text-[10px] font-bold text-[#68756A] uppercase block">Organic Matter</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-[#252D27] tabular-nums">
                        {selectedRequest.result.organicMatterPercent}%
                      </span>
                      <span className="text-[10px] font-semibold text-[#68756A]">{selectedRequest.result.soilTexture}</span>
                    </div>
                  </div>
                </div>

                {/* Specific Agronomic Recommendations */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs text-[#214E34] uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#367C46]" />
                    <span>Targeted Nutrient & Lime Plan for {selectedRequest.intendedCrop}</span>
                  </h3>

                  <div className="p-4 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA] space-y-2.5 text-xs">
                    <div>
                      <span className="font-bold text-[#214E34] block">Recommended Basal Planting Fertilizer:</span>
                      <p className="text-[#252D27] mt-0.5">{selectedRequest.result.recommendedBasalFertilizer}</p>
                    </div>

                    <div className="pt-2 border-t border-[#CFD7CA]">
                      <span className="font-bold text-[#214E34] block">Top Dressing Fertilizer Schedule:</span>
                      <p className="text-[#252D27] mt-0.5">{selectedRequest.result.recommendedTopDressing}</p>
                    </div>

                    <div className="pt-2 border-t border-[#CFD7CA]">
                      <span className="font-bold text-[#79543A] block">
                        Agricultural Lime Requirement: {selectedRequest.result.limeRequirementKgPerAcre} kg / Acre
                      </span>
                      <p className="text-[#252D27] mt-0.5">
                        Broadcast agricultural lime 4 weeks before the next planting season to neutralize acidity and unlock bound soil phosphorus.
                      </p>
                    </div>
                  </div>

                  {/* Organic Remedies */}
                  <div className="p-4 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] text-xs">
                    <span className="font-bold text-[#252D27] block mb-2">
                      Soil Conditioning & Organic Matter Recommendations:
                    </span>
                    <ul className="space-y-1.5 list-disc list-inside text-[#68756A]">
                      {selectedRequest.result.organicRemedies.map((rem, i) => (
                        <li key={i}>{rem}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Agronomist Notes & Officer */}
                  <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] text-[11px] text-[#68756A]">
                    <p className="italic">"{selectedRequest.result.agronomistNotes}"</p>
                    <p className="font-bold text-[#252D27] text-right mt-1">
                      — {selectedRequest.result.labOfficerName}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-[#E2E7DE]">
                <Clock className="w-10 h-10 text-[#D6A545] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#214E34] mb-1">
                  Sample Analysis In Progress
                </h3>
                <p className="text-xs text-[#68756A] max-w-sm mx-auto">
                  Your soil sample is undergoing laboratory testing at {selectedRequest?.labName}. Certified results will appear here once finalized.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
