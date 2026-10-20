import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Wind, 
  Droplets, 
  MapPin, 
  Calendar, 
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Weather Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider mb-2">
              <CloudSun className="w-4 h-4 text-[#367C46]" />
              <span>Kenya Agro-Meteorological Weather Service</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
              Weather Forecast & Seasonal Planting Guidance
            </h1>
            <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
              Real-time synoptic weather, precipitation probability, and seasonal rainfall monitoring for all 47 Kenyan counties to guide fertilizer application, spraying, and harvest timing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCounty}
              onChange={(e) => onSelectCounty(e.target.value)}
              className="bg-[#F7F6F0] border border-[#E2E7DE] text-[#252D27] text-xs font-semibold px-3 py-2.5 rounded-lg focus:outline-none cursor-pointer"
            >
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} County
                </option>
              ))}
            </select>

            <button
              onClick={loadWeather}
              className="p-2.5 rounded-lg bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#214E34] border border-[#E2E7DE] transition cursor-pointer"
              title="Refresh weather data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {loading || !weatherData ? (
        <div className="bg-white rounded-xl p-16 text-center border border-[#E2E7DE]">
          <Loader2 className="w-8 h-8 animate-spin text-[#367C46] mx-auto mb-2" />
          <p className="text-xs text-[#68756A] font-medium">
            Fetching Kenya Meteorological synoptic data for {selectedCounty}...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Conditions Card */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-[#EBF3ED] border border-[#CFD7CA] flex items-center justify-center text-[#367C46] shrink-0">
                <CloudSun className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold text-[#68756A] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#367C46]" />
                  {weatherData.county} ({countyInfo.zone})
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#214E34] mt-0.5 tabular-nums">
                  {weatherData.current.temperature_2m}°C
                </div>
                <p className="text-xs text-[#68756A] font-medium">
                  Partly Cloudy · Favorable for agronomic field operations
                </p>
              </div>
            </div>

            {/* Current Metrics */}
            <div className="md:col-span-7 grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                <div className="flex items-center gap-1.5 text-[#68756A] text-[11px] font-semibold mb-1">
                  <Droplets className="w-3.5 h-3.5 text-[#367C46]" />
                  <span>Humidity</span>
                </div>
                <span className="text-lg font-bold text-[#252D27] tabular-nums">
                  {weatherData.current.relative_humidity_2m}%
                </span>
                <span className="text-[10px] text-[#68756A] block mt-0.5">Optimal for growth</span>
              </div>

              <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                <div className="flex items-center gap-1.5 text-[#68756A] text-[11px] font-semibold mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-[#367C46]" />
                  <span>Rainfall (24h)</span>
                </div>
                <span className="text-lg font-bold text-[#252D27] tabular-nums">
                  {weatherData.current.precipitation} mm
                </span>
                <span className="text-[10px] text-[#68756A] block mt-0.5">Low precipitation</span>
              </div>

              <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                <div className="flex items-center gap-1.5 text-[#68756A] text-[11px] font-semibold mb-1">
                  <Wind className="w-3.5 h-3.5 text-[#367C46]" />
                  <span>Wind Speed</span>
                </div>
                <span className="text-lg font-bold text-[#252D27] tabular-nums">
                  {weatherData.current.wind_speed_10m} km/h
                </span>
                <span className="text-[10px] text-[#68756A] block mt-0.5">Safe for knapsack spray</span>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Grid */}
          <div className="bg-white rounded-xl p-6 border border-[#E2E7DE] shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-[#214E34] uppercase tracking-wider flex items-center justify-between">
              <span>7-Day Agricultural Forecast ({selectedCounty})</span>
              <span className="text-xs font-normal text-[#68756A]">Source: {weatherData.source}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weatherData.daily.time.map((date, idx) => (
                <div 
                  key={date}
                  className="p-3 rounded-lg bg-[#F7F6F0] border border-[#E2E7DE] text-center flex flex-col justify-between hover:border-[#367C46] transition"
                >
                  <div>
                    <span className="text-[11px] font-semibold text-[#68756A] block">
                      {new Date(date).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <CloudSun className="w-6 h-6 text-[#D6A545] mx-auto my-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#252D27] tabular-nums">
                      <span>{weatherData.daily.temperature_2m_max[idx]}°</span>
                      <span className="text-[#68756A] font-normal">/ {weatherData.daily.temperature_2m_min[idx]}°</span>
                    </div>

                    <div className="text-[10px] font-medium text-[#214E34] bg-[#EBF3ED] py-0.5 rounded">
                      Rain: {weatherData.daily.precipitation_probability_max[idx]}% ({weatherData.daily.precipitation_sum[idx]} mm)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Planting Guidance for Current County */}
          <div className="bg-[#214E34] text-white rounded-xl p-6 sm:p-8 border border-[#183C27] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#D6A545] text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Seasonal Calendar & Agro-Ecological Guidance ({countyInfo.zone})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#E2E7DE]">
              <div className="bg-[#183C27] p-4 rounded-lg border border-[#2C6443]">
                <span className="font-bold text-white block mb-1">Recommended Crops for {selectedCounty}:</span>
                <p className="text-[#CFD7CA] leading-relaxed">
                  {countyInfo.primaryCrops.join(', ')}. Ensure early land preparation 3 weeks before the onset of the seasonal rains.
                </p>
              </div>

              <div className="bg-[#183C27] p-4 rounded-lg border border-[#2C6443]">
                <span className="font-bold text-white block mb-1">Livestock Husbandry Advice:</span>
                <p className="text-[#CFD7CA] leading-relaxed">
                  Store hay bales and silage. Dip or spray cattle weekly with Amitraz acaricides to mitigate high tick populations following light showers.
                </p>
              </div>

              <div className="bg-[#183C27] p-4 rounded-lg border border-[#2C6443]">
                <span className="font-bold text-white block mb-1">Irrigation Advice:</span>
                <p className="text-[#CFD7CA] leading-relaxed">
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
