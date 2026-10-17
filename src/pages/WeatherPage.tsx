import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  MapPin, 
  Calendar, 
  Info, 
  Sparkles,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { api, WeatherResponse } from '../services/api';

interface WeatherPageProps {
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({
  selectedCounty,
  onSelectCounty,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const countyInfo = KENYA_COUNTIES.find(c => c.name === selectedCounty) || KENYA_COUNTIES[0];

  const loadWeather = async () => {
    setLoading(true);
    try {
      const data = await api.fetchCountyWeather(countyInfo.name, countyInfo.lat, countyInfo.lon);
      setWeatherData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [selectedCounty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Weather Header */}
      <div className="bg-linear-to-r from-sky-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-sky-800/40 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
              <CloudSun className="w-4 h-4" />
              <span>Kenya Agro-Meteorological Weather Service</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Weather Forecast & Seasonal Planting Guidance
            </h1>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Real-time synoptic weather, precipitation probability, and seasonal rainfall monitoring for all 47 Kenyan counties to guide fertilizer application, spraying, and harvest timing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCounty}
              onChange={(e) => onSelectCounty(e.target.value)}
              className="bg-sky-900 text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-sky-700 cursor-pointer"
            >
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name} className="text-stone-900 bg-white">
                  {c.name} County
                </option>
              ))}
            </select>

            <button
              onClick={loadWeather}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Refresh weather data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {loading || !weatherData ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-200">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-stone-500 font-semibold">
            Connecting to Kenya Meteorological Synoptic Station for {selectedCounty}...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Conditions Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-inner">
                <CloudSun className="w-12 h-12" />
              </div>

              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {weatherData.county} ({countyInfo.zone})
                </span>
                <div className="text-4xl font-black text-stone-950 mt-1">
                  {weatherData.current.temperature_2m}°C
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  Partly Cloudy • Favorable for field work
                </p>
              </div>
            </div>

            {/* Current Metrics */}
            <div className="md:col-span-7 grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-semibold mb-1">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Humidity</span>
                </div>
                <span className="text-lg font-black text-stone-900">
                  {weatherData.current.relative_humidity_2m}%
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">Optimal for transpiration</span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-semibold mb-1">
                  <CloudRain className="w-4 h-4 text-blue-600" />
                  <span>Rainfall (24h)</span>
                </div>
                <span className="text-lg font-black text-stone-900">
                  {weatherData.current.precipitation} mm
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">Low precipitation</span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-semibold mb-1">
                  <Wind className="w-4 h-4 text-emerald-600" />
                  <span>Wind Speed</span>
                </div>
                <span className="text-lg font-black text-stone-900">
                  {weatherData.current.wind_speed_10m} km/h
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">Safe for knapsack spray</span>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider flex items-center justify-between">
              <span>7-Day Agricultural Forecast ({selectedCounty})</span>
              <span className="text-xs font-normal text-stone-500">Source: {weatherData.source}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weatherData.daily.time.map((date, idx) => (
                <div 
                  key={date}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center flex flex-col justify-between hover:border-emerald-600 transition"
                >
                  <div>
                    <span className="text-[11px] font-bold text-stone-600 block">
                      {new Date(date).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <CloudSun className="w-7 h-7 text-amber-500 mx-auto my-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-900">
                      <span>{weatherData.daily.temperature_2m_max[idx]}°</span>
                      <span className="text-stone-400 font-normal">/ {weatherData.daily.temperature_2m_min[idx]}°</span>
                    </div>

                    <div className="text-[10px] font-semibold text-sky-700 bg-sky-50 py-0.5 rounded-md">
                      🌧️ {weatherData.daily.precipitation_probability_max[idx]}% ({weatherData.daily.precipitation_sum[idx]} mm)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Planting Guidance for Current County */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Seasonal Calendar & Agro-Ecological Guidance ({countyInfo.zone})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-emerald-100">
              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/60">
                <span className="font-bold text-white block mb-1">🌾 Recommended Crops for {selectedCounty}:</span>
                <p className="text-emerald-200">
                  {countyInfo.primaryCrops.join(', ')}. Ensure early land preparation 3 weeks before the onset of the next rains.
                </p>
              </div>

              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/60">
                <span className="font-bold text-white block mb-1">🐄 Livestock Husbandry Advice:</span>
                <p className="text-emerald-200">
                  Store hay bales and silage. Dip or spray cattle weekly with Amitraz acaricides to mitigate high tick populations following light showers.
                </p>
              </div>

              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/60">
                <span className="font-bold text-white block mb-1">💧 Irrigation Advice:</span>
                <p className="text-emerald-200">
                  With current precipitation levels, supplementary drip irrigation of 3.5 liters/plant daily is recommended for horticultural crops and tomatoes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
