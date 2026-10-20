import React, { useState } from 'react';
import { 
  Bug, 
  Upload, 
  Camera, 
  AlertTriangle, 
  FileCheck, 
  Loader2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { PEST_AND_DISEASE_DATABASE } from '../data/pestDatabase';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { api, DiagnoseResponse } from '../services/api';

export const PestDiagnosisPage: React.FC = () => {
  const [targetType, setTargetType] = useState<'crop' | 'livestock'>('crop');
  const [targetHost, setTargetHost] = useState('Maize');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('Uasin Gishu');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnoseResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Pre-selected verified match from knowledge base
  const matchedReference = PEST_AND_DISEASE_DATABASE.find(
    (item) => item.targetType === targetType && (
      item.targetHost.toLowerCase().includes(targetHost.toLowerCase()) ||
      item.commonName.toLowerCase().includes(symptomsInput.toLowerCase())
    )
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim() && !imagePreview) {
      setFormError('Please describe symptoms or upload a photograph to proceed.');
      return;
    }
    setFormError(null);

    setIsDiagnosing(true);
    setDiagnosisResult(null);

    try {
      const res = await api.diagnosePest({
        targetType,
        targetName: targetHost,
        symptoms: symptomsInput,
        county: selectedCounty,
        imageBase64: imagePreview || undefined,
      });

      setDiagnosisResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider mb-2">
          <Bug className="w-4 h-4 text-[#367C46]" />
          <span>Crop & Livestock Health Diagnostic Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
          Pest & Disease Diagnosis with PCPB Registered Protocols
        </h1>
        <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
          Upload plant or livestock symptoms for structured diagnosis, backed by Kenya Pest Control Products Board (PCPB) registered active ingredients, pre-harvest withholding intervals (PHI), and safety precautions.
        </p>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E2E7DE] shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-[#214E34] uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#367C46]" />
            <span>Describe Problem or Upload Photo</span>
          </h2>

          <form onSubmit={handleRunDiagnosis} className="space-y-4">
            {formError && (
              <div className="p-3 bg-[#FCF8EE] border border-[#D6A545]/40 text-[#79543A] rounded-lg text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D6A545] shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {/* Target Type Toggle */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setTargetType('crop');
                  setTargetHost('Maize');
                }}
                className={`p-2.5 rounded-lg border text-center font-semibold transition cursor-pointer ${
                  targetType === 'crop'
                    ? 'border-[#367C46] bg-[#EBF3ED] text-[#214E34]'
                    : 'border-[#E2E7DE] text-[#252D27] hover:bg-[#F7F6F0]'
                }`}
              >
                Crop / Plant Problem
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetType('livestock');
                  setTargetHost('Dairy Cattle');
                }}
                className={`p-2.5 rounded-lg border text-center font-semibold transition cursor-pointer ${
                  targetType === 'livestock'
                    ? 'border-[#367C46] bg-[#EBF3ED] text-[#214E34]'
                    : 'border-[#E2E7DE] text-[#252D27] hover:bg-[#F7F6F0]'
                }`}
              >
                Livestock / Animal Health
              </button>
            </div>

            {/* Target Species / Host */}
            <div className="text-xs">
              <label className="block font-semibold text-[#252D27] mb-1">
                {targetType === 'crop' ? 'Affected Crop / Plant Species' : 'Affected Livestock Species / Breed'}
              </label>
              <select
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none cursor-pointer font-medium"
              >
                {targetType === 'crop' ? (
                  <>
                    <option value="Maize">Maize (Mahindi)</option>
                    <option value="Tomato">Tomato (Nyanya)</option>
                    <option value="Potato">Irish Potato (Warux)</option>
                    <option value="Beans">Beans (Maharage)</option>
                    <option value="Avocado">Avocado (Hass / Fuerte)</option>
                    <option value="Banana">Banana (Matoke / Ndizi)</option>
                    <option value="Cabbage">Cabbage & Sukuma Wiki</option>
                  </>
                ) : (
                  <>
                    <option value="Dairy Cattle">Dairy Cattle / Cows</option>
                    <option value="Beef Cattle">Beef Cattle (Boran / Zebu)</option>
                    <option value="Poultry">Indigenous & Broiler Chickens</option>
                    <option value="Dairy Goats">Dairy & Meat Goats</option>
                    <option value="Sheep">Dorper / Red Maasai Sheep</option>
                    <option value="Pigs">Pigs & Swine</option>
                  </>
                )}
              </select>
            </div>

            {/* County Location */}
            <div className="text-xs">
              <label className="block font-semibold text-[#252D27] mb-1">Your County</label>
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none cursor-pointer"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name} County</option>
                ))}
              </select>
            </div>

            {/* Photo Upload Zone */}
            <div className="text-xs">
              <label className="block font-semibold text-[#252D27] mb-1">
                Upload Affected Leaf, Stem, or Animal Photo (Optional)
              </label>
              <div className="relative border-2 border-dashed border-[#E2E7DE] hover:border-[#367C46] rounded-lg p-4 text-center bg-[#F7F6F0] transition cursor-pointer">
                {imagePreview ? (
                  <div className="relative aspect-16/9 rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Uploaded sample" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-[#252D27]/80 text-white px-2 py-0.5 rounded text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-6 h-6 text-[#68756A] mx-auto mb-1" />
                    <p className="text-[#252D27] font-semibold text-xs">Click to upload photo</p>
                    <p className="text-[10px] text-[#68756A]">JPG, PNG up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Symptoms Description */}
            <div className="text-xs">
              <label className="block font-semibold text-[#252D27] mb-1">
                Observed Symptoms & Progression
              </label>
              <textarea
                rows={3}
                required
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="e.g. Caterpillars feeding inside maize whorl with frass droppings; or swollen lymph nodes behind cow ears..."
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isDiagnosing}
              className="w-full bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              {isDiagnosing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with Pathology AI...</span>
                </>
              ) : (
                <>
                  <span>Run Disease & Pest Diagnosis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Diagnosis & Recommendations Column */}
        <div className="lg:col-span-7 space-y-4">
          {diagnosisResult ? (
            /* Diagnosis Output */
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#214E34] bg-[#EBF3ED] px-2.5 py-0.5 rounded">
                  Diagnostic Result & Action Plan
                </span>
                <span className="text-xs text-[#68756A] font-medium">
                  {selectedCounty} County
                </span>
              </div>

              {diagnosisResult.rawText ? (
                <div className="prose prose-xs max-w-none text-[#252D27] text-xs leading-relaxed whitespace-pre-line">
                  {diagnosisResult.rawText}
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                    <h3 className="font-bold text-sm text-[#252D27]">
                      {diagnosisResult.diagnosis?.diseaseOrPest}
                    </h3>
                    <p className="text-[#68756A] text-xs mt-1">
                      Confidence Level: <strong className="text-[#214E34]">{diagnosisResult.diagnosis?.confidence}</strong>
                    </p>
                  </div>

                  {diagnosisResult.diagnosis?.activeIngredients && (
                    <div className="p-3.5 bg-white rounded-lg border border-[#E2E7DE]">
                      <span className="font-bold text-[#252D27] block mb-1">
                        PCPB Approved Active Ingredients:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[#68756A]">
                        {diagnosisResult.diagnosis.activeIngredients.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3 bg-[#FCF8EE] rounded-lg border border-[#E2E7DE] text-[#79543A]">
                    <span className="font-bold block">Safety Precautions & PPE:</span>
                    <p className="mt-0.5 text-xs text-[#252D27]">{diagnosisResult.diagnosis?.safetyPrecautions}</p>
                  </div>
                </div>
              )}

              {/* Warning & Referral */}
              <div className="p-3.5 bg-[#FCF8EE] rounded-lg border border-[#E2E7DE] text-[#79543A] text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#D6A545] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Official Disclaimer & Referral:</p>
                  <p className="text-[11px] text-[#68756A] mt-0.5 leading-relaxed">
                    This automated identification provides educational guidance. For notifiable livestock conditions (ECF, Newcastle, FMD) or severe crop infestations, please notify your Sub-County Agricultural Officer or call Toll-Free <strong>0800 721 000</strong>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Reference Knowledge Base Display */
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs">
                <h3 className="font-bold text-xs text-[#214E34] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#367C46]" />
                  <span>Kenya Verified Problem Index ({targetHost})</span>
                </h3>

                {matchedReference ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-[#252D27]">
                          {matchedReference.commonName}
                        </span>
                        <span className="text-[10px] bg-[#EBF3ED] text-[#214E34] font-semibold px-2 py-0.5 rounded">
                          {matchedReference.severity}
                        </span>
                      </div>
                      <p className="text-[#68756A] italic text-[11px] mt-0.5">
                        {matchedReference.scientificName}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-[#252D27] block mb-1">Distinguishing Symptoms:</span>
                      <ul className="list-disc list-inside space-y-1 text-[#68756A] bg-[#F7F6F0] p-3 rounded-lg border border-[#E2E7DE]">
                        {matchedReference.symptoms.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-semibold text-[#252D27] block mb-1">
                        PCPB Registered Active Ingredients & Pre-Harvest Intervals (PHI):
                      </span>
                      <div className="space-y-2">
                        {matchedReference.pcpbApprovedActives.map((act, i) => (
                          <div key={i} className="p-3 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA]">
                            <div className="flex items-center justify-between font-bold text-[#214E34]">
                              <span>{act.activeIngredient}</span>
                              <span className="text-[10px] bg-white text-[#214E34] border border-[#CFD7CA] px-2 py-0.5 rounded">
                                PHI: {act.phiDays} Days
                              </span>
                            </div>
                            <p className="text-[11px] text-[#68756A] mt-1">Examples: {act.tradeExamples}</p>
                            <p className="text-[10px] text-[#68756A] mt-0.5">PPE: {act.ppeRequirement}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {matchedReference.vetAlertNote && (
                      <div className="p-3 bg-[#FCF8EE] border border-[#E2E7DE] rounded-lg text-[#79543A] text-xs font-semibold">
                        {matchedReference.vetAlertNote}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#68756A]">
                    Select a host crop or livestock species to view verified PCPB treatments.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
