import React, { useState } from 'react';
import { 
  TestTube, 
  MapPin, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Download, 
  AlertCircle,
  HelpCircle,
  BarChart3,
  Building2,
  Send
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Soil Header Banner */}
      <div className="bg-linear-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <TestTube className="w-4 h-4" />
              <span>National Soil Health & Fertility Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Professional Soil Testing & Crop Fertilization Advisory
            </h1>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Stop guessing your fertilizer requirements. Partnered with official KALRO National Agricultural Laboratories (NARL) and CropNuts to provide accurate pH, N-P-K, organic carbon, and lime recommendations.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-black text-xs px-5 py-3 rounded-2xl transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <TestTube className="w-4 h-4" />
            <span>{showForm ? 'View Test History' : 'Request Soil Analysis'}</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium rounded-2xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice('')} className="text-emerald-700 font-bold">×</button>
        </div>
      )}

      {/* Main Grid: Request Form OR Test Result Details */}
      {showForm ? (
        /* 1. Request Soil Analysis Form */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm animate-in fade-in">
          <div className="border-b border-stone-200 pb-4 mb-6">
            <h2 className="text-lg font-bold text-stone-900">
              Submit Farm Soil Sample for Laboratory Analysis
            </h2>
            <p className="text-xs text-stone-500">
              Fill in your field location and history. A courier will collect your soil sample or you can drop it at the nearest laboratory depot.
            </p>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Field Name / Block</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upper Shamba, Plot B"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Farm Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.25"
                  required
                  value={farmSizeAcres}
                  onChange={(e) => setFarmSizeAcres(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Intended Crop to Plant</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maize, Potatoes, Hass Avocados"
                  value={intendedCrop}
                  onChange={(e) => setIntendedCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Farm County</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden cursor-pointer"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.name} County</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Sub-County / Ward</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Njoro, Moiben, Kandara"
                  value={subCounty}
                  onChange={(e) => setSubCounty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Previous Crop & Fertilizer History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Previous Crop in this Field</label>
                <input
                  type="text"
                  placeholder="e.g. Maize (continuous for 2 seasons)"
                  value={previousCrop}
                  onChange={(e) => setPreviousCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Previous Fertilizers & Manure Applied</label>
                <input
                  type="text"
                  placeholder="e.g. 50kg DAP at planting, no manure"
                  value={previousFertilizer}
                  onChange={(e) => setPreviousFertilizer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Select Partner Laboratory */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Select Accredited Soil Testing Laboratory
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SOIL_LAB_PARTNERS.map((lab) => (
                  <div
                    key={lab.id}
                    onClick={() => setPreferredLabId(lab.id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition flex flex-col justify-between ${
                      preferredLabId === lab.id
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 block">{lab.name}</span>
                        <span className="font-black text-emerald-800">
                          KSh {lab.standardFeeKsh.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{lab.accreditation}</p>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-2">
                      ⚡ Turnaround: {lab.turnaroundDays} business days
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Method */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Sample Collection & Dispatch Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSubmissionMethod('courier_dispatch')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    submissionMethod === 'courier_dispatch'
                      ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block">📦 Courier Farm Pickup</span>
                  <span className="text-[10px] font-normal text-stone-500">Transporter collects sample</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmissionMethod('drop_at_lab')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    submissionMethod === 'drop_at_lab'
                      ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block">🏢 Self Drop-Off at Lab</span>
                  <span className="text-[10px] font-normal text-stone-500">Drop at nearest sub-county station</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmissionMethod('field_agent_sampling')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    submissionMethod === 'field_agent_sampling'
                      ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block">🧑‍🌾 Field Officer Visit</span>
                  <span className="text-[10px] font-normal text-stone-500">Agronomist takes zigzag samples</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition"
              >
                <Send className="w-4 h-4 text-emerald-300" />
                <span>{submitting ? 'Registering Sample...' : 'Submit Soil Test Request'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* 2. Soil Tests Overview & Selected Report View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Requests History List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center justify-between">
              <span>Your Soil Test Requests</span>
              <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                {requests.length}
              </span>
            </h3>

            {requests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedRequest?.id === req.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-bold text-emerald-800">
                    {req.sampleCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    req.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status === 'completed' ? 'Report Ready' : 'In Progress'}
                  </span>
                </div>

                <h4 className="font-bold text-stone-900 text-xs">{req.fieldName}</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Target Crop: {req.intendedCrop} • {req.farmSizeAcres} Acres
                </p>
                <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {req.labName}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Detailed Laboratory Report */}
          <div className="lg:col-span-8">
            {selectedRequest && selectedRequest.result ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                {/* Report Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                      Official Certified Soil Chemistry Analysis
                    </span>
                    <h2 className="text-xl font-black text-stone-950 mt-0.5">
                      {selectedRequest.fieldName} ({selectedRequest.intendedCrop})
                    </h2>
                    <p className="text-xs text-stone-500">
                      Sample Code: <span className="font-mono font-bold text-stone-800">{selectedRequest.sampleCode}</span> • Lab: {selectedRequest.labName}
                    </p>
                  </div>

                  <button
                    onClick={() => alert(`Downloading official PDF soil report for ${selectedRequest.sampleCode}...`)}
                    className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download PDF Report</span>
                  </button>
                </div>

                {/* Score & pH Overview Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Soil pH (H₂O)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-emerald-950">
                        {selectedRequest.result.ph}
                      </span>
                      <span className="text-[10px] font-bold text-amber-700">
                        {selectedRequest.result.phClassification}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Available Phosphorus</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-stone-900">
                        {selectedRequest.result.phosphorusPpm}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-600">ppm (Low)</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Potassium (K)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-stone-900">
                        {selectedRequest.result.potassiumPpm}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600">ppm (Optimal)</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Organic Matter</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-stone-900">
                        {selectedRequest.result.organicMatterPercent}%
                      </span>
                      <span className="text-[10px] font-semibold text-stone-600">{selectedRequest.result.soilTexture}</span>
                    </div>
                  </div>
                </div>

                {/* Specific Agronomic Recommendations */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Targeted Nutrient & Lime Plan for {selectedRequest.intendedCrop}</span>
                  </h3>

                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-emerald-950 block">Recommended Basal Planting Fertilizer:</span>
                      <p className="text-emerald-900 mt-0.5">{selectedRequest.result.recommendedBasalFertilizer}</p>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/50">
                      <span className="font-bold text-emerald-950 block">Top Dressing Fertilizer Schedule:</span>
                      <p className="text-emerald-900 mt-0.5">{selectedRequest.result.recommendedTopDressing}</p>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/50">
                      <span className="font-bold text-emerald-950 block">
                        Lime Requirement: {selectedRequest.result.limeRequirementKgPerAcre} kg / Acre
                      </span>
                      <p className="text-emerald-900 mt-0.5">
                        Broadcast agricultural lime 4 weeks before the next planting season to neutralize acidity and unlock bound soil phosphorus.
                      </p>
                    </div>
                  </div>

                  {/* Organic Remedies */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                    <span className="font-bold text-stone-900 block mb-2">
                      Soil Conditioning & Organic Matter Recommendations:
                    </span>
                    <ul className="space-y-1.5 list-disc list-inside text-stone-700">
                      {selectedRequest.result.organicRemedies.map((rem, i) => (
                        <li key={i}>{rem}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Agronomist Notes & Officer */}
                  <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-[11px] text-stone-600">
                    <p className="italic">"{selectedRequest.result.agronomistNotes}"</p>
                    <p className="font-bold text-stone-800 text-right mt-1">
                      — {selectedRequest.result.labOfficerName}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <Clock className="w-12 h-12 text-amber-500 mx-auto mb-3 animate-pulse" />
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Sample Analysis In Progress
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Your soil sample is currently undergoing spectrometer & pH testing at {selectedRequest?.labName}. Results will appear here upon completion.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
