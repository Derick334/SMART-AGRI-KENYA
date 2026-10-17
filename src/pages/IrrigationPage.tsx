import React, { useState } from 'react';
import { 
  Droplets, 
  Sun, 
  Wind, 
  Gauge, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  crop: string;
  soilMoisture: number; // percentage
  status: 'optimal' | 'dry' | 'irrigating';
  areaAcres: number;
  dripperCount: number;
  litersPerDay: number;
  nextSchedule: string;
}

export const IrrigationPage: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([
    {
      id: 'z1',
      name: 'Zone A - Greenhouse Anna F1 Tomatoes',
      crop: 'Indeterminate Tomatoes',
      soilMoisture: 38,
      status: 'dry',
      areaAcres: 0.5,
      dripperCount: 2400,
      litersPerDay: 4800,
      nextSchedule: '06:00 AM & 05:30 PM',
    },
    {
      id: 'z2',
      name: 'Zone B - Open Field French Beans',
      crop: 'Export French Beans (Samantha)',
      soilMoisture: 62,
      status: 'optimal',
      areaAcres: 1.0,
      dripperCount: 4800,
      litersPerDay: 7200,
      nextSchedule: 'Tomorrow 06:30 AM',
    },
    {
      id: 'z3',
      name: 'Zone C - Lucerne Fodder Plot',
      crop: 'High-Protein Lucerne Fodder',
      soilMoisture: 45,
      status: 'optimal',
      areaAcres: 1.5,
      dripperCount: 6000,
      litersPerDay: 9000,
      nextSchedule: 'Tomorrow 05:00 PM',
    }
  ]);

  // Water calculator state
  const [calcCrop, setCalcCrop] = useState('Tomatoes');
  const [calcAcres, setCalcAcres] = useState(1);
  const [calcSoil, setCalcSoil] = useState('Clay Loam');

  const calculateWaterRequirement = () => {
    let baseLitersPerAcre = 6000;
    if (calcCrop === 'Tomatoes') baseLitersPerAcre = 7500;
    if (calcCrop === 'Cabbage') baseLitersPerAcre = 5500;
    if (calcCrop === 'Maize') baseLitersPerAcre = 4500;
    if (calcCrop === 'Onions') baseLitersPerAcre = 6500;

    const totalLiters = baseLitersPerAcre * calcAcres;
    const tankSizeM3 = Math.round((totalLiters / 1000) * 10) / 10;
    const dripLinesMeters = calcAcres * 4000;

    return { totalLiters, tankSizeM3, dripLinesMeters };
  };

  const calcResults = calculateWaterRequirement();

  const toggleIrrigation = (zoneId: string) => {
    setZones(zones.map(z => {
      if (z.id === zoneId) {
        if (z.status === 'irrigating') {
          return { ...z, status: 'optimal', soilMoisture: 72 };
        } else {
          return { ...z, status: 'irrigating' };
        }
      }
      return z;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-blue-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-blue-900/40 shadow-lg">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Droplets className="w-4 h-4" />
          <span>Precision Water & Soil Moisture Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Smart Irrigation & Soil Moisture Monitoring
        </h1>
        <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
          Optimize crop yields while saving up to 45% water through sensor-based drip scheduling, evapotranspiration monitoring, and customized water requirement calculators.
        </p>
      </div>

      {/* Live Monitoring Zones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">
            Active Farm Irrigation Zones
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            3 Telemetry Nodes Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`p-5 rounded-3xl border transition shadow-xs flex flex-col justify-between ${
                zone.status === 'irrigating'
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-400'
                  : zone.status === 'dry'
                  ? 'border-amber-300 bg-amber-50/40'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    {zone.areaAcres} Acres • {zone.crop}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    zone.status === 'irrigating'
                      ? 'bg-blue-600 text-white animate-pulse'
                      : zone.status === 'dry'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {zone.status === 'irrigating' ? '💧 Solenoid Open' : zone.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-stone-900 mb-3">
                  {zone.name}
                </h3>

                {/* Soil Moisture Gauge */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-stone-600">Volumetric Soil Moisture:</span>
                    <span className={`font-black ${zone.soilMoisture < 40 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {zone.soilMoisture}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        zone.soilMoisture < 40 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${zone.soilMoisture}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-stone-600 border-t border-stone-200/60 pt-3">
                  <p>• Dripper Emitters: <strong>{zone.dripperCount.toLocaleString()}</strong> (16mm UV)</p>
                  <p>• Daily Water Demand: <strong>{zone.litersPerDay.toLocaleString()} Liters</strong></p>
                  <p>• Schedule: <strong>{zone.nextSchedule}</strong></p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-200/60 flex items-center justify-between">
                <button
                  onClick={() => toggleIrrigation(zone.id)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    zone.status === 'irrigating'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {zone.status === 'irrigating' ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Stop Irrigation</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Drip Cycle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drip Sizing & Water Requirement Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-600" />
            <span>Farm Water Requirement & Drip Sizing Calculator</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Calculate water volume and storage tank dimensions for your crop acreage in Kenya
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Target Crop</label>
            <select
              value={calcCrop}
              onChange={(e) => setCalcCrop(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden cursor-pointer"
            >
              <option value="Tomatoes">Greenhouse / Field Tomatoes</option>
              <option value="Cabbage">Cabbage & Sukuma Wiki</option>
              <option value="Maize">Green Maize</option>
              <option value="Onions">Bulb Onions</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Land Size (Acres)</label>
            <input
              type="number"
              step="0.5"
              min="0.25"
              value={calcAcres}
              onChange={(e) => setCalcAcres(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Soil Texture</label>
            <select
              value={calcSoil}
              onChange={(e) => setCalcSoil(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden cursor-pointer"
            >
              <option value="Clay Loam">Red Volcanic Clay Loam (High Retention)</option>
              <option value="Sandy Loam">Sandy Loam (Fast Drainage)</option>
              <option value="Black Cotton">Black Cotton Clay (Slow Drainage)</option>
            </select>
          </div>
        </div>

        {/* Calculation Output Box */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Daily Water Demand</span>
            <span className="text-xl font-black text-emerald-950">
              {calcResults.totalLiters.toLocaleString()} Litres / Day
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Based on peak evapotranspiration</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Recommended Storage Tank</span>
            <span className="text-xl font-black text-emerald-950">
              {calcResults.tankSizeM3} m³ (10,000L Tank)
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">For 2-day buffer storage</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Drip Lateral Piping Needed</span>
            <span className="text-xl font-black text-emerald-950">
              {calcResults.dripLinesMeters.toLocaleString()} Meters
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Standard 16mm button / inline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
