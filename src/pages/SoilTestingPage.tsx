import React, { useState } from 'react';
import { 
  TestTube, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2,
  Leaf,
  Scale,
  Sparkles,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Phone,
  Check,
  ChevronRight,
  TrendingUp,
  BookmarkPlus
} from 'lucide-react';
import { SoilAnalysisInput, SoilAnalysisReport, SoilTestRequest } from '../types';
import { SOIL_LAB_PARTNERS } from '../data/sampleSoilLabs';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { 
  CROPS_AGRONOMY_DATABASE, 
  SOIL_TYPES_DATABASE, 
  ACCREDITED_SOIL_LABS_KENYA 
} from '../data/agriculturalKnowledge';
import { agriStore } from '../services/store';
import { apiService } from '../services/api';

export const SoilTestingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'instant_analysis' | 'lab_directory' | 'saved_records'>('instant_analysis');

  // Instant Diagnostic Form State
  const [farmCounty, setFarmCounty] = useState('Nakuru');
  const [selectedCrop, setSelectedCrop] = useState('Maize (Zea mays)');
  const [selectedSoilType, setSelectedSoilType] = useState('Red Volcanic Clay (Nitisol)');
  const [fieldAreaAcres, setFieldAreaAcres] = useState<number>(2.5);
  const [soilPhInput, setSoilPhInput] = useState<string>('5.2');
  const [soilMoistureInput, setSoilMoistureInput] = useState<string>('35');
  const [fertilizerHistory, setFertilizerHistory] = useState('Continuous DAP application (50kg/acre) for 3 seasons without agricultural lime.');
  const [recentAmendments, setRecentAmendments] = useState('');
  
  // Visual Symptoms selection
  const [observedSymptoms, setObservedSymptoms] = useState<string[]>([
    'Stunted vegetative growth',
    'Purple tinting on lower leaf midribs (Phosphorus lock)'
  ]);

  // Optional Lab results toggle
  const [showAdvancedLabInputs, setShowAdvancedLabInputs] = useState(false);
  const [labNitrogen, setLabNitrogen] = useState<string>('');
  const [labPhosphorus, setLabPhosphorus] = useState<string>('');
  const [labPotassium, setLabPotassium] = useState<string>('');
  const [labOrganicCarbon, setLabOrganicCarbon] = useState<string>('');
  const [labSalinity, setLabSalinity] = useState<string>('');

  // Diagnostic Report State
  const [currentReport, setCurrentReport] = useState<SoilAnalysisReport | null>(agriStore.getSoilAnalysisReports()[0] || null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisNotice, setAnalysisNotice] = useState('');

  // Lab Booking Request State
  const [requests, setRequests] = useState<SoilTestRequest[]>(agriStore.getSoilRequests());
  const [selectedRequest, setSelectedRequest] = useState<SoilTestRequest | null>(requests[0] || null);
  const [showLabBookingModal, setShowLabBookingModal] = useState(false);
  const [bookingLabId, setBookingLabId] = useState('lab-kalro-narl');
  const [bookingFieldName, setBookingFieldName] = useState('Field 1 (Main Plot)');
  const [bookingSubmissionMethod, setBookingSubmissionMethod] = useState<'courier_dispatch' | 'drop_at_lab' | 'field_agent_sampling'>('courier_dispatch');
  const [bookingNotice, setBookingNotice] = useState('');

  // Saved reports
  const [savedReports, setSavedReports] = useState<SoilAnalysisReport[]>(agriStore.getSoilAnalysisReports());

  const availableSymptoms = [
    'Stunted vegetative growth',
    'Purple tinting on lower leaf midribs (Phosphorus lock)',
    'Yellowing of older lower leaves (Nitrogen chlorosis)',
    'Marginal leaf edge scorching (Potassium deficiency)',
    'Poor root nodulation or shallow rooting',
    'Soil surface crusted / slow water infiltration',
    'Interveinal leaf yellowing (Iron / Magnesium deficiency)'
  ];

  const handleToggleSymptom = (sym: string) => {
    if (observedSymptoms.includes(sym)) {
      setObservedSymptoms(observedSymptoms.filter(s => s !== sym));
    } else {
      setObservedSymptoms([...observedSymptoms, sym]);
    }
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setAnalysisNotice('');

    const parsedPh = soilPhInput.trim() !== '' ? parseFloat(soilPhInput) : undefined;
    const parsedMoisture = soilMoistureInput.trim() !== '' ? parseFloat(soilMoistureInput) : undefined;

    const inputPayload: SoilAnalysisInput = {
      county: farmCounty,
      crop: selectedCrop,
      soilType: selectedSoilType,
      soilPh: !isNaN(Number(parsedPh)) ? parsedPh : undefined,
      moisturePercent: !isNaN(Number(parsedMoisture)) ? parsedMoisture : undefined,
      fertilizerHistory,
      recentAmendments,
      observedSymptoms,
      fieldSizeAcres: fieldAreaAcres,
      labResults: showAdvancedLabInputs ? {
        nitrogenPercent: labNitrogen ? parseFloat(labNitrogen) : undefined,
        phosphorusPpm: labPhosphorus ? parseFloat(labPhosphorus) : undefined,
        potassiumCmolKg: labPotassium ? parseFloat(labPotassium) : undefined,
        organicCarbonPercent: labOrganicCarbon ? parseFloat(labOrganicCarbon) : undefined,
        salinityECdsPerM: labSalinity ? parseFloat(labSalinity) : undefined,
      } : undefined,
    };

    try {
      const response = await apiService.analyzeSoil(inputPayload);
      if (response && response.report) {
        setCurrentReport(response.report);
        agriStore.saveSoilAnalysisReport(response.report);
        setSavedReports(agriStore.getSoilAnalysisReports());
        setAnalysisNotice(`Soil analysis generated in ${response.latencyMs}ms using KALRO agronomic benchmarks.`);
      }
    } catch {
      // Local fallback calculation if offline
      const mockReport: SoilAnalysisReport = {
        id: `soil-rep-${Date.now()}`,
        createdAt: new Date().toISOString(),
        cropName: selectedCrop,
        input: inputPayload,
        phAnalysis: {
          value: parsedPh,
          rating: (parsedPh && parsedPh < 5.5) ? 'Moderately Acidic' : (parsedPh && parsedPh > 7.5) ? 'Alkaline' : 'Optimal',
          optimalRange: '5.8 - 7.0',
          impactExplanation: (parsedPh && parsedPh < 5.5)
            ? `At pH ${parsedPh}, soluble Aluminum (Al3+) locks up available soil phosphate. Liming is essential prior to planting.`
            : `Soil pH is suitable for nutrient absorption in ${selectedCrop}.`,
          limeRequiredKgPerAcre: (parsedPh && parsedPh < 5.8) ? Math.round((5.8 - parsedPh) * 1.5 * 1000) : 0,
        },
        nutrientStatuses: [
          { nutrient: 'N', status: 'Low', explanation: 'Nitrogen mineralizes slowly in acidic soils; split application recommended.' },
          { nutrient: 'P', status: (parsedPh && parsedPh < 5.5) ? 'Deficient' : 'Optimal', explanation: 'Phosphorus uptake is constrained under acidic conditions.' },
          { nutrient: 'K', status: 'Optimal', explanation: 'Adequate potassium levels for stalk rigidity.' },
          { nutrient: 'Organic Carbon', status: 'Low', explanation: 'Boost with 4-5 tonnes/acre well-decomposed cattle manure.' },
          { nutrient: 'Salinity', status: 'Optimal', explanation: 'Safe electrical conductivity.' },
        ],
        fertilizerPlan: {
          areaTreated: `${fieldAreaAcres} Acre(s)`,
          assumptions: 'Assumes agricultural limestone (CaCO3) broadcast 3-4 weeks prior to planting rains.',
          basalFertilizer: {
            product: 'NPK 23:23:0 or Mavuno Planting',
            rateKgPerAcre: 75,
            applicationTiming: 'At planting in furrow 5cm away from seed.',
            notes: 'Avoid pure DAP on soils below pH 5.5.',
          },
          topDressing: {
            product: 'CAN (26% N)',
            rateKgPerAcre: 75,
            applicationTiming: 'At knee-height (V6 stage).',
            notes: 'Apply when soil is moist.',
          },
          organicRemedies: ['Broadcast 4 tonnes/acre farmyard manure to rebuild soil organic carbon.'],
        },
        laboratoryVerificationRequired: !showAdvancedLabInputs,
        confidenceScore: parsedPh ? 'Verified Measurements' : 'Symptom-Based Estimate',
        recommendedNextSteps: [
          'Incorporate agricultural lime before planting season.',
          'Use certified seed varieties approved by KEPHIS.',
          'Consider sending a confirmation sample to KALRO NARL.'
        ],
      };
      setCurrentReport(mockReport);
      agriStore.saveSoilAnalysisReport(mockReport);
      setSavedReports(agriStore.getSoilAnalysisReports());
      setAnalysisNotice('Soil analysis completed using local agronomic reference engine.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBookLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = agriStore.getCurrentUser();
    const lab = SOIL_LAB_PARTNERS.find(l => l.id === bookingLabId);

    const newReq = agriStore.submitSoilRequest({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      county: farmCounty,
      subCounty: 'Central',
      fieldName: bookingFieldName,
      farmSizeAcres: Number(fieldAreaAcres),
      intendedCrop: selectedCrop,
      previousCrop: 'Fallow / Prior Season',
      previousFertilizer: fertilizerHistory,
      submissionMethod: bookingSubmissionMethod,
      labId: bookingLabId,
      labName: lab?.name || 'KALRO National Agricultural Laboratories',
    });

    setRequests(agriStore.getSoilRequests());
    setSelectedRequest(newReq);
    setShowLabBookingModal(false);
    setBookingNotice(`Soil test request booked successfully! Sample tracking code: ${newReq.sampleCode}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#79543A] text-xs font-bold uppercase tracking-wider mb-2">
              <TestTube className="w-4 h-4 text-[#79543A]" />
              <span>DERIV-AGRI National Soil Health & Fertility Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
              Soil Health Testing & Crop Fertilization Advisory
            </h1>
            <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
              Fast, evidence-based soil diagnostics and lime requirement calculations grounded in KALRO National Agricultural Laboratories (NARL) benchmarks and Kenyan agronomic science.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F7F6F0] p-1.5 rounded-xl border border-[#E2E7DE]">
            <button
              onClick={() => setActiveTab('instant_analysis')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'instant_analysis' 
                  ? 'bg-[#367C46] text-white shadow-xs' 
                  : 'text-[#68756A] hover:text-[#214E34]'
              }`}
            >
              Instant Soil Diagnostic
            </button>
            <button
              onClick={() => setActiveTab('lab_directory')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'lab_directory' 
                  ? 'bg-[#367C46] text-white shadow-xs' 
                  : 'text-[#68756A] hover:text-[#214E34]'
              }`}
            >
              Accredited Labs Directory
            </button>
            <button
              onClick={() => setActiveTab('saved_records')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'saved_records' 
                  ? 'bg-[#367C46] text-white shadow-xs' 
                  : 'text-[#68756A] hover:text-[#214E34]'
              }`}
            >
              Saved Records ({savedReports.length})
            </button>
          </div>
        </div>
      </div>

      {analysisNotice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-medium rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{analysisNotice}</span>
          </div>
          <button onClick={() => setAnalysisNotice('')} className="text-[#68756A] hover:text-[#214E34] text-xs font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {bookingNotice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-medium rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{bookingNotice}</span>
          </div>
          <button onClick={() => setBookingNotice('')} className="text-[#68756A] hover:text-[#214E34] text-xs font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: INSTANT SOIL DIAGNOSTIC & LIME CALCULATOR */}
      {activeTab === 'instant_analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs space-y-5">
            <div className="border-b border-[#E2E7DE] pb-4">
              <h2 className="text-base font-bold text-[#214E34] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#367C46]" />
                <span>Farm Soil Diagnostic Input Form</span>
              </h2>
              <p className="text-xs text-[#68756A] mt-1">
                Provide what you know. Laboratory numbers are optional — basic symptoms and soil type can generate initial guidance.
              </p>
            </div>

            <form onSubmit={handleRunAnalysis} className="space-y-4">
              {/* County & Crop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Kenyan County</label>
                  <select
                    value={farmCounty}
                    onChange={(e) => setFarmCounty(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg focus:ring-1 focus:ring-[#367C46] outline-none"
                  >
                    {KENYA_COUNTIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Target Crop</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg focus:ring-1 focus:ring-[#367C46] outline-none font-semibold text-[#214E34]"
                  >
                    {Object.values(CROPS_AGRONOMY_DATABASE).map(c => (
                      <option key={c.id} value={c.commonName}>{c.commonName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Soil Type & Farm Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Soil Type / Texture</label>
                  <select
                    value={selectedSoilType}
                    onChange={(e) => setSelectedSoilType(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg focus:ring-1 focus:ring-[#367C46] outline-none"
                  >
                    {Object.values(SOIL_TYPES_DATABASE).map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Treated Field Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.25"
                    max="1000"
                    value={fieldAreaAcres}
                    onChange={(e) => setFieldAreaAcres(parseFloat(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg focus:ring-1 focus:ring-[#367C46] outline-none font-bold text-[#214E34]"
                  />
                </div>
              </div>

              {/* Soil pH & Moisture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#EBF3ED]/50 p-3 rounded-lg border border-[#CFD7CA]">
                <div>
                  <label className="block text-xs font-bold text-[#214E34] mb-1">
                    Soil pH (if measured)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="3.5"
                    max="9.5"
                    placeholder="e.g. 5.2 (leave blank if unmeasured)"
                    value={soilPhInput}
                    onChange={(e) => setSoilPhInput(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-[#CFD7CA] rounded-md focus:ring-1 focus:ring-[#367C46] outline-none font-black text-[#214E34]"
                  />
                  <span className="text-[10px] text-[#68756A] block mt-0.5">Optimal for {selectedCrop}: 5.8 - 7.0</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#214E34] mb-1">
                    Soil Moisture % (optional)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    placeholder="e.g. 35%"
                    value={soilMoistureInput}
                    onChange={(e) => setSoilMoistureInput(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-[#CFD7CA] rounded-md focus:ring-1 focus:ring-[#367C46] outline-none font-semibold text-[#252D27]"
                  />
                  <span className="text-[10px] text-[#68756A] block mt-0.5">Gravimetric or tensiometer reading</span>
                </div>
              </div>

              {/* Fertilizer History */}
              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Recent Fertilizer History & Amendments</label>
                <textarea
                  rows={2}
                  value={fertilizerHistory}
                  onChange={(e) => setFertilizerHistory(e.target.value)}
                  placeholder="e.g. Continuous DAP application for 3 seasons, applied 2 bags of CAN last year..."
                  className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg focus:ring-1 focus:ring-[#367C46] outline-none"
                />
              </div>

              {/* Observed Symptoms */}
              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1.5">
                  Observed Crop & Soil Symptoms (Check all that apply)
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {availableSymptoms.map((sym) => {
                    const checked = observedSymptoms.includes(sym);
                    return (
                      <div
                        key={sym}
                        onClick={() => handleToggleSymptom(sym)}
                        className={`flex items-start gap-2 p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                          checked 
                            ? 'bg-[#EBF3ED] border-[#367C46] text-[#214E34] font-medium' 
                            : 'bg-[#F7F6F0] border-[#E2E7DE] text-[#68756A] hover:border-[#CFD7CA]'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                          checked ? 'bg-[#367C46] border-[#367C46] text-white' : 'border-[#A3B19B] bg-white'
                        }`}>
                          {checked && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="leading-tight">{sym}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Lab Results Collapsible */}
              <div className="border-t border-[#E2E7DE] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedLabInputs(!showAdvancedLabInputs)}
                  className="text-xs font-bold text-[#367C46] hover:text-[#214E34] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{showAdvancedLabInputs ? 'Hide Laboratory Soil Chemistry Inputs' : '+ Enter Laboratory Test Values (N, P, K, Carbon, Salinity)'}</span>
                </button>

                {showAdvancedLabInputs && (
                  <div className="mt-3 p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] space-y-2.5">
                    <p className="text-[11px] text-[#68756A]">
                      Enter exact numbers from your official laboratory certificate (e.g. KALRO, CropNuts, or SoilCares):
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-[#68756A]">Total Nitrogen (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 0.18"
                          value={labNitrogen}
                          onChange={(e) => setLabNitrogen(e.target.value)}
                          className="w-full p-1.5 bg-white border border-[#E2E7DE] rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#68756A]">Available P (ppm Mehlich-3)</label>
                        <input
                          type="number"
                          step="1"
                          placeholder="e.g. 14"
                          value={labPhosphorus}
                          onChange={(e) => setLabPhosphorus(e.target.value)}
                          className="w-full p-1.5 bg-white border border-[#E2E7DE] rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#68756A]">Potassium K (cmol/kg)</label>
                        <input
                          type="number"
                          step="0.05"
                          placeholder="e.g. 0.45"
                          value={labPotassium}
                          onChange={(e) => setLabPotassium(e.target.value)}
                          className="w-full p-1.5 bg-white border border-[#E2E7DE] rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#68756A]">Organic Carbon (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 1.2"
                          value={labOrganicCarbon}
                          onChange={(e) => setLabOrganicCarbon(e.target.value)}
                          className="w-full p-1.5 bg-white border border-[#E2E7DE] rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full bg-[#367C46] hover:bg-[#2B6437] text-white font-bold text-xs py-3 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Analyzing Soil Chemistry & Nutrient Dynamics...</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4" />
                    <span>Run Soil Health Analysis & Calculate Lime</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {currentReport ? (
              <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs space-y-6">
                {/* Header with Verified Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#367C46] uppercase tracking-wider block">
                      Evidence-Based Soil Advisory Report
                    </span>
                    <h3 className="text-xl font-extrabold text-[#214E34]">
                      {currentReport.cropName} — {currentReport.input.county} County
                    </h3>
                    <p className="text-xs text-[#68756A] mt-0.5">
                      Target Area: {currentReport.fertilizerPlan.areaTreated} | Soil: {currentReport.input.soilType}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      currentReport.confidenceScore === 'Verified Measurements' 
                        ? 'bg-[#EBF3ED] text-[#214E34] border border-[#CFD7CA]'
                        : 'bg-[#F7F6F0] text-[#79543A] border border-[#E2E7DE]'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{currentReport.confidenceScore}</span>
                    </span>
                  </div>
                </div>

                {/* pH Analysis Card with Visual Suitability Gauge */}
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#68756A] uppercase block">Soil Acidity / pH Status</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-black text-[#214E34] tabular-nums">
                          {currentReport.phAnalysis.value !== undefined ? `pH ${currentReport.phAnalysis.value}` : 'Unmeasured'}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          currentReport.phAnalysis.rating === 'Optimal' 
                            ? 'bg-[#EBF3ED] text-[#214E34]' 
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {currentReport.phAnalysis.rating}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#68756A] uppercase block">Optimal Crop Range</span>
                      <span className="text-xs font-bold text-[#214E34]">{currentReport.phAnalysis.optimalRange}</span>
                    </div>
                  </div>

                  {/* Visual pH Spectrum Indicator */}
                  <div className="space-y-1">
                    <div className="h-2.5 w-full bg-gradient-to-r from-red-400 via-amber-300 via-emerald-400 to-blue-400 rounded-full relative">
                      {currentReport.phAnalysis.value !== undefined && (
                        <div 
                          className="absolute -top-1 w-4 h-4 bg-white border-2 border-[#214E34] rounded-full shadow-xs transform -translate-x-1/2"
                          style={{ 
                            left: `${Math.min(100, Math.max(0, ((currentReport.phAnalysis.value - 4) / 4.5) * 100))}%` 
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-[#68756A]">
                      <span>pH 4.0 (Severe Acid)</span>
                      <span>pH 6.5 (Optimal Neutral)</span>
                      <span>pH 8.5 (Alkaline)</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#252D27] leading-relaxed pt-1">
                    {currentReport.phAnalysis.impactExplanation}
                  </p>

                  {/* Lime Calculation Highlight */}
                  {currentReport.phAnalysis.limeRequiredKgPerAcre > 0 ? (
                    <div className="p-3 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA] flex items-start gap-3">
                      <Scale className="w-5 h-5 text-[#367C46] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-[#214E34] block">
                          Agricultural Lime Requirement: {currentReport.phAnalysis.limeRequiredKgPerAcre} kg / Acre
                        </span>
                        <p className="text-[11px] text-[#252D27] mt-0.5">
                          Total for your {currentReport.fertilizerPlan.areaTreated}: <strong>{Math.round(currentReport.phAnalysis.limeRequiredKgPerAcre * (currentReport.input.fieldSizeAcres || 1))} kg</strong> of agricultural limestone (CaCO3). Broadcast and incorporate into the top 15cm minimum 3-4 weeks prior to planting rains.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[#EBF3ED] rounded-lg text-xs text-[#214E34] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
                      <span>Soil pH is in the safe agronomic zone. No agricultural liming is required at this time.</span>
                    </div>
                  )}
                </div>

                {/* Nutrient Statuses Grid */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-[#214E34] uppercase tracking-wider">
                    Macronutrient & Soil Chemistry Balance
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {currentReport.nutrientStatuses.map((nst) => (
                      <div key={nst.nutrient} className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-[#68756A] uppercase">{nst.nutrient}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            nst.status === 'Optimal' 
                              ? 'bg-[#EBF3ED] text-[#214E34]' 
                              : nst.status === 'Deficient' || nst.status === 'Low'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {nst.status}
                          </span>
                        </div>
                        {nst.measuredValue && (
                          <div className="text-xs font-bold text-[#214E34] mb-1">{nst.measuredValue}</div>
                        )}
                        <p className="text-[10px] text-[#68756A] leading-snug">{nst.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crop-Specific Fertilizer Plan with Clear Units & Stated Assumptions */}
                <div className="space-y-3 border-t border-[#E2E7DE] pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#214E34] uppercase tracking-wider flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-[#367C46]" />
                      <span>Crop-Specific Fertilization Schedule</span>
                    </h4>
                    <span className="text-[11px] text-[#68756A] font-semibold">{currentReport.fertilizerPlan.areaTreated}</span>
                  </div>

                  {/* Stated Assumptions Disclaimer Box */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg text-xs text-amber-950 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      <strong>Agronomic Assumptions:</strong> {currentReport.fertilizerPlan.assumptions}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Basal Fertilizer */}
                    <div className="p-4 bg-[#EBF3ED] rounded-xl border border-[#CFD7CA] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#367C46] uppercase">Basal Planting Fertilizer</span>
                        <span className="text-xs font-black text-[#214E34]">
                          {currentReport.fertilizerPlan.basalFertilizer.rateKgPerAcre} kg / Acre
                        </span>
                      </div>
                      <p className="font-extrabold text-xs text-[#214E34]">
                        {currentReport.fertilizerPlan.basalFertilizer.product}
                      </p>
                      <p className="text-[11px] text-[#252D27]">
                        <strong>Timing:</strong> {currentReport.fertilizerPlan.basalFertilizer.applicationTiming}
                      </p>
                      <p className="text-[10px] text-[#68756A] italic">
                        {currentReport.fertilizerPlan.basalFertilizer.notes}
                      </p>
                    </div>

                    {/* Top Dressing */}
                    <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#68756A] uppercase">Top-Dressing Fertilizer</span>
                        <span className="text-xs font-black text-[#214E34]">
                          {currentReport.fertilizerPlan.topDressing.rateKgPerAcre} kg / Acre
                        </span>
                      </div>
                      <p className="font-extrabold text-xs text-[#214E34]">
                        {currentReport.fertilizerPlan.topDressing.product}
                      </p>
                      <p className="text-[11px] text-[#252D27]">
                        <strong>Timing:</strong> {currentReport.fertilizerPlan.topDressing.applicationTiming}
                      </p>
                      <p className="text-[10px] text-[#68756A] italic">
                        {currentReport.fertilizerPlan.topDressing.notes}
                      </p>
                    </div>
                  </div>

                  {/* Organic Conditioning */}
                  <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] text-xs">
                    <span className="font-bold text-[#214E34] block mb-1.5">Organic Amendments & Soil Conditioning:</span>
                    <ul className="space-y-1 text-[#68756A] list-disc list-inside text-[11px]">
                      {currentReport.fertilizerPlan.organicRemedies.map((rem, i) => (
                        <li key={i}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Next Steps */}
                <div className="border-t border-[#E2E7DE] pt-4 space-y-2">
                  <span className="text-xs font-bold text-[#214E34] uppercase tracking-wider block">Recommended Next Steps</span>
                  <div className="space-y-1.5">
                    {currentReport.recommendedNextSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#252D27]">
                        <div className="w-4 h-4 rounded-full bg-[#EBF3ED] text-[#367C46] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Laboratory confirmation warning if visual */}
                {currentReport.laboratoryVerificationRequired && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Laboratory Confirmation Recommended:</span> This diagnostic was calculated using visual symptom inputs and regional soil averages. Before applying large lime quantities on commercial acreage, consider sending a verification soil sample to an accredited lab below.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-[#E2E7DE]">
                <TestTube className="w-12 h-12 text-[#A3B19B] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#214E34]">Ready to Analyze Your Soil</h3>
                <p className="text-xs text-[#68756A] max-w-sm mx-auto mt-1">
                  Fill in your farm county, crop, and observed symptoms in the form on the left to receive immediate evidence-based fertilization and liming guidance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACCREDITED SOIL LAB DIRECTORY & SAMPLE BOOKING */}
      {activeTab === 'lab_directory' && (
        <div className="space-y-6">
          <div className="bg-[#EBF3ED] p-4 rounded-xl border border-[#CFD7CA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#214E34] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#367C46]" />
                <span>Accredited Soil Health Laboratories in Kenya</span>
              </h3>
              <p className="text-xs text-[#68756A] mt-0.5">
                Official institutions certified by the Ministry of Agriculture and KENAS for full chemical, physical, and micronutrient analysis.
              </p>
            </div>
            <button
              onClick={() => setShowLabBookingModal(true)}
              className="bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              + Dispatch Sample to Lab
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACCREDITED_SOIL_LABS_KENYA.map((lab) => (
              <div key={lab.id} className="bg-white rounded-xl p-5 border border-[#E2E7DE] shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#367C46] uppercase tracking-wider block">
                      {lab.accreditation}
                    </span>
                    <h4 className="text-base font-extrabold text-[#214E34]">{lab.name}</h4>
                    <p className="text-xs text-[#68756A] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#79543A]" />
                      <span>{lab.location} ({lab.county} County)</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#214E34] block">Ksh {lab.packages[0]?.priceKsh.toLocaleString()}</span>
                    <span className="text-[10px] text-[#68756A]">{lab.turnaroundDays} Days</span>
                  </div>
                </div>

                <div className="border-t border-[#E2E7DE] pt-2 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-[#252D27] uppercase block">Analysis Packages:</span>
                  {lab.packages.map((pkg, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-[#F7F6F0] p-2 rounded border border-[#E2E7DE]">
                      <span className="font-medium text-[#252D27]">{pkg.name}</span>
                      <span className="font-bold text-[#367C46]">Ksh {pkg.priceKsh.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs flex items-center justify-between text-[#68756A]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#367C46]" />
                    <span>{lab.contactPhone}</span>
                  </span>
                  <button
                    onClick={() => {
                      setBookingLabId(lab.id);
                      setShowLabBookingModal(true);
                    }}
                    className="text-xs font-bold text-[#367C46] hover:text-[#214E34] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Sampling Kit</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Proper Sampling Guide */}
          <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] space-y-3">
            <h4 className="text-sm font-bold text-[#214E34] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#367C46]" />
              <span>Standard KALRO Composite Soil Sampling Guidelines</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#252D27]">
              <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                <strong className="block text-[#214E34] mb-1">1. Zig-Zag Sampling Pattern</strong>
                Walk across the field in a 'W' or 'Z' shape. Collect 10 to 15 sub-samples across the target plot from topsoil (0-20 cm depth).
              </div>
              <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                <strong className="block text-[#214E34] mb-1">2. Mix & Quarter</strong>
                Mix all sub-samples thoroughly in a clean plastic bucket. Discard stones and roots. Retain approximately 500g of composite soil.
              </div>
              <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                <strong className="block text-[#214E34] mb-1">3. Label & Dispatch</strong>
                Pack in a sealed polythene bag. Label with your Member Code, County, Field Name, and intended crop, then dispatch via courier.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAVED SOIL RECORDS & TIME COMPARISON */}
      {activeTab === 'saved_records' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs">
            <h3 className="text-base font-bold text-[#214E34] flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#367C46]" />
              <span>Soil Health Progression Over Time</span>
            </h3>
            <p className="text-xs text-[#68756A]">
              Compare your field soil test reports season-by-season to track pH correction, organic matter accumulation, and fertilizer efficiency.
            </p>
          </div>

          <div className="space-y-3">
            {savedReports.map((rep) => (
              <div key={rep.id} className="bg-white rounded-xl p-5 border border-[#E2E7DE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#214E34]">{rep.cropName}</span>
                    <span className="text-[10px] text-[#68756A] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#367C46]" />
                      <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#EBF3ED] text-[#214E34] font-bold">
                      {rep.confidenceScore}
                    </span>
                  </div>
                  <p className="text-xs text-[#68756A]">
                    Location: {rep.input.county} | Field Area: {rep.fertilizerPlan.areaTreated} | Soil: {rep.input.soilType}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-[#68756A] block">Soil pH</span>
                    <span className="text-base font-black text-[#214E34]">
                      {rep.phAnalysis.value !== undefined ? `pH ${rep.phAnalysis.value}` : 'N/A'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#68756A] block">Lime Required</span>
                    <span className="text-xs font-black text-[#79543A]">
                      {rep.phAnalysis.limeRequiredKgPerAcre} kg/acre
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentReport(rep);
                      setActiveTab('instant_analysis');
                    }}
                    className="bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    View Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lab Booking Modal */}
      {showLabBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#E2E7DE] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
              <h3 className="text-base font-bold text-[#214E34] flex items-center gap-2">
                <TestTube className="w-4 h-4 text-[#367C46]" />
                <span>Book Laboratory Soil Analysis Dispatch</span>
              </h3>
              <button
                onClick={() => setShowLabBookingModal(false)}
                className="text-[#68756A] hover:text-[#252D27] text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleBookLabTest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Select Accredited Laboratory</label>
                <select
                  value={bookingLabId}
                  onChange={(e) => setBookingLabId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg outline-none font-medium"
                >
                  {SOIL_LAB_PARTNERS.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.county})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Field / Plot Identifier</label>
                <input
                  type="text"
                  required
                  value={bookingFieldName}
                  onChange={(e) => setBookingFieldName(e.target.value)}
                  placeholder="e.g. Lower Valley Maize Plot (3 Acres)"
                  className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Sample Delivery Method</label>
                <select
                  value={bookingSubmissionMethod}
                  onChange={(e) => setBookingSubmissionMethod(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg outline-none"
                >
                  <option value="courier_dispatch">Courier Dispatch via SMART-AGRI Freight</option>
                  <option value="drop_at_lab">Direct Drop-Off at Laboratory Reception</option>
                  <option value="field_agent_sampling">Request Sub-County Extension Officer Sampling</option>
                </select>
              </div>

              <div className="p-3 bg-[#EBF3ED] rounded-lg text-xs text-[#214E34]">
                <strong>Sampling Kit Dispatch:</strong> You will receive an SMS with your sample tracking code and instructions on packaging your composite sample.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLabBookingModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#68756A] hover:text-[#252D27] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Confirm Lab Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
