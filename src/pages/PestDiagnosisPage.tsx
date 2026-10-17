import React, { useState } from 'react';
import { 
  Bug, 
  Upload, 
  Camera, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  FileCheck, 
  Sparkles, 
  Loader2,
  Stethoscope,
  Info
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim() && !imagePreview) {
      alert('Please describe symptoms or upload a photograph.');
      return;
    }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-rose-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-rose-900/40 shadow-lg">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Bug className="w-4 h-4" />
          <span>Kenya Crop & Livestock Health Diagnostic Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Pest & Disease Diagnosis with PCPB Registered Solutions
        </h1>
        <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
          Upload plant or animal symptoms for instant preliminary AI diagnosis, backed by Kenya Pest Control Products Board (PCPB) registered active ingredients, withholding periods (PHI), and safety precautions.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-stone-800 px-3 py-1 rounded-full text-rose-300 border border-stone-700">
            🌽 Fall Armyworm & Maize Lethal Necrosis (MLND)
          </span>
          <span className="bg-stone-800 px-3 py-1 rounded-full text-rose-300 border border-stone-700">
            🍅 Tomato Tuta Absoluta & Late Blight
          </span>
          <span className="bg-stone-800 px-3 py-1 rounded-full text-rose-300 border border-stone-700">
            🐄 East Coast Fever (ECF) & Mastitis
          </span>
          <span className="bg-stone-800 px-3 py-1 rounded-full text-rose-300 border border-stone-700">
            🐔 Newcastle Disease in Poultry
          </span>
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Describe Problem or Upload Photo</span>
          </h2>

          <form onSubmit={handleRunDiagnosis} className="space-y-4">
            {/* Target Type Toggle */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setTargetType('crop');
                  setTargetHost('Maize');
                }}
                className={`p-3 rounded-2xl border text-center font-bold transition cursor-pointer ${
                  targetType === 'crop'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                🌱 Crop / Plant Problem
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetType('livestock');
                  setTargetHost('Dairy Cattle');
                }}
                className={`p-3 rounded-2xl border text-center font-bold transition cursor-pointer ${
                  targetType === 'livestock'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                🐄 Livestock / Animal Health
              </button>
            </div>

            {/* Target Species / Host */}
            <div className="text-xs">
              <label className="block font-bold text-stone-700 mb-1">
                {targetType === 'crop' ? 'Affected Crop / Plant Species' : 'Affected Livestock Species / Breed'}
              </label>
              <select
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden font-medium cursor-pointer"
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
              <label className="block font-bold text-stone-700 mb-1">Your County</label>
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden cursor-pointer"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name} County</option>
                ))}
              </select>
            </div>

            {/* Photo Upload Zone */}
            <div className="text-xs">
              <label className="block font-bold text-stone-700 mb-1">
                Upload Affected Leaf, Stem, or Animal Photo (Optional)
              </label>
              <div className="relative border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-2xl p-4 text-center bg-stone-50 transition cursor-pointer">
                {imagePreview ? (
                  <div className="relative aspect-16/9 rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="Uploaded sample" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-stone-900/80 text-white p-1 rounded-full text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-1" />
                    <p className="text-stone-600 font-semibold">Click to upload photo</p>
                    <p className="text-[10px] text-stone-400">JPG, PNG up to 10MB</p>
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
              <label className="block font-bold text-stone-700 mb-1">
                Observed Symptoms & Progression
              </label>
              <textarea
                rows={3}
                required
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="e.g. Caterpillars feeding inside maize whorl with sawdust-like droppings; or swollen lymph nodes behind cow ears..."
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isDiagnosing}
              className="w-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              {isDiagnosing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with Gemini Plant Pathology AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-rose-300" />
                  <span>Run Disease & Pest Diagnosis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Diagnosis & Recommendations Column */}
        <div className="lg:col-span-7 space-y-4">
          {diagnosisResult ? (
            /* Live Diagnosis Output */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                  Diagnostic Result & Action Plan
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {selectedCounty} Agro-Zone
                </span>
              </div>

              {diagnosisResult.rawText ? (
                <div className="prose prose-xs max-w-none text-stone-800 text-xs leading-relaxed whitespace-pre-line">
                  {diagnosisResult.rawText}
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                    <h3 className="font-bold text-sm text-rose-950">
                      {diagnosisResult.diagnosis?.diseaseOrPest}
                    </h3>
                    <p className="text-rose-800 text-xs mt-1">
                      Confidence Level: <strong>{diagnosisResult.diagnosis?.confidence}</strong>
                    </p>
                  </div>

                  {diagnosisResult.diagnosis?.activeIngredients && (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                      <span className="font-bold text-stone-900 block mb-1">
                        PCPB / Approved Active Ingredients:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-stone-700">
                        {diagnosisResult.diagnosis.activeIngredients.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                    <span className="font-bold block">Safety Precautions & PPE:</span>
                    <p className="mt-0.5">{diagnosisResult.diagnosis?.safetyPrecautions}</p>
                  </div>
                </div>
              )}

              {/* Warning & Professional Referral */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Official Disclaimer & Referral:</p>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    This automated identification provides educational guidance. For notifiable livestock conditions (ECF, Newcastle, FMD) or severe crop infestations, please notify your Sub-County Agricultural/Veterinary Officer or call Toll-Free <strong>0800 721 000</strong>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Reference Knowledge Base Display */
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
                <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span>Kenya Verified Problem Index ({targetHost})</span>
                </h3>

                {matchedReference ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-stone-950">
                          {matchedReference.commonName}
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                          {matchedReference.severity}
                        </span>
                      </div>
                      <p className="text-stone-500 italic text-[11px] mt-0.5">
                        {matchedReference.scientificName}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-stone-900 block mb-1">Distinguishing Symptoms:</span>
                      <ul className="list-disc list-inside space-y-1 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                        {matchedReference.symptoms.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-stone-900 block mb-1">
                        PCPB Registered Active Ingredients & Pre-Harvest Intervals (PHI):
                      </span>
                      <div className="space-y-2">
                        {matchedReference.pcpbApprovedActives.map((act, i) => (
                          <div key={i} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                            <div className="flex items-center justify-between font-bold text-emerald-950">
                              <span>{act.activeIngredient}</span>
                              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                                PHI: {act.phiDays} Days
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600 mt-1">Examples: {act.tradeExamples}</p>
                            <p className="text-[10px] text-stone-500 mt-0.5">PPE: {act.ppeRequirement}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {matchedReference.vetAlertNote && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-semibold">
                        ⚠️ {matchedReference.vetAlertNote}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">
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
