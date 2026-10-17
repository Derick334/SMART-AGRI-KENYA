import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  Sprout, 
  Beef, 
  TestTube, 
  Bug, 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  CloudSun,
  Droplets,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { LivestockCard } from '../components/livestock/LivestockCard';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';

interface HomePageProps {
  products: Product[];
  onSelectTab: (tabId: string) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectTab,
  onViewProduct,
  onAddToCart,
  selectedCounty,
  onSelectCounty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredCrops = products.filter(p => p.category === 'crops').slice(0, 4);
  const featuredLivestock = products.filter(p => p.category === 'livestock').slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-radial from-emerald-900 via-emerald-950 to-stone-950 text-white py-14 px-4 sm:px-6 lg:px-8 rounded-3xl mx-2 sm:mx-4 mt-2 shadow-xl border border-emerald-800/40">
        <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <SmartAgriLogo variant="full" size="md" isDark={true} className="bg-emerald-950/70 px-4 py-2 rounded-2xl border border-emerald-600/40 shadow-inner" />
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Serving All 47 Counties of Kenya</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Kenya's Premier Digital <br />
            <span className="text-emerald-400 bg-linear-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              Agricultural & Livestock Hub
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Direct farmer-to-buyer marketplace, certified seed inputs, pedigree cattle auctions, KALRO soil analysis, and farm-to-door logistics powered by M-Pesa.
          </p>

          {/* Quick Search & County Filter Bar */}
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 shadow-2xl">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 text-stone-900">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="Search maize, Shangi potatoes, Friesian dairy, seeds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectTab('marketplace');
                }}
                className="w-full text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCounty}
                onChange={(e) => onSelectCounty(e.target.value)}
                className="bg-emerald-800 text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-emerald-600 focus:outline-hidden cursor-pointer"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c.code} value={c.name} className="text-stone-900 bg-white">
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => onSelectTab('marketplace')}
                className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Category Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <button 
              onClick={() => onSelectTab('crops')}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Crops & Produce</span>
            </button>
            <button 
              onClick={() => onSelectTab('livestock')}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <Beef className="w-3.5 h-3.5 text-amber-300" />
              <span>Livestock & Cattle</span>
            </button>
            <button 
              onClick={() => onSelectTab('inputs')}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <span>🌱 Certified Seeds & Feeds</span>
            </button>
            <button 
              onClick={() => onSelectTab('soil-testing')}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <TestTube className="w-3.5 h-3.5 text-sky-300" />
              <span>KALRO Soil Testing</span>
            </button>
            <button 
              onClick={() => onSelectTab('pest-diagnosis')}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <Bug className="w-3.5 h-3.5 text-rose-300" />
              <span>Pest Diagnosis</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Live Agricultural Services Hub (Interactive 6 Feature Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-stone-950">
              Essential Farmer Services
            </h2>
            <p className="text-xs text-stone-500">
              Everything required to plant, test, protect, sell, and ship agricultural produce
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div 
            onClick={() => onSelectTab('soil-testing')}
            className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <TestTube className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-xs text-stone-900 group-hover:text-emerald-700">Soil Health Testing</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">KALRO & CropNuts labs</p>
            </div>
          </div>

          <div 
            onClick={() => onSelectTab('pest-diagnosis')}
            className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition">
              <Bug className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-xs text-stone-900 group-hover:text-emerald-700">Pest & Disease Checker</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">PCPB approved solutions</p>
            </div>
          </div>

          <div 
            onClick={() => onSelectTab('market-prices')}
            className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-xs text-stone-900 group-hover:text-emerald-700">Market Prices</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">Wakulima & Kongowea</p>
            </div>
          </div>

          <div 
            onClick={() => onSelectTab('weather')}
            className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition">
              <CloudSun className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-xs text-stone-900 group-hover:text-emerald-700">Weather & Rains</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">County planting forecast</p>
            </div>
          </div>

          <div 
            onClick={() => onSelectTab('irrigation')}
            className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-xs text-stone-900 group-hover:text-emerald-700">Smart Irrigation</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">Drip kits & schedules</p>
            </div>
          </div>

          <div 
            onClick={() => onSelectTab('ai-assistant')}
            className="p-4 bg-emerald-900 text-white rounded-2xl border border-emerald-800 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-xs text-white">AI Farming Assistant</h3>
              <p className="text-[11px] text-emerald-200 mt-0.5">Powered by Gemini</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Fresh Produce & Crops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-stone-950">
              Fresh Harvest & Crops
            </h2>
            <p className="text-xs text-stone-500">
              Direct from verified Kenyan farms with door delivery across counties
            </p>
          </div>

          <button
            onClick={() => onSelectTab('crops')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Crops ({products.filter(p => p.category === 'crops').length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCrops.map((crop) => (
            <ProductCard
              key={crop.id}
              product={crop}
              onViewDetails={onViewProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* 4. Pedigree Livestock & Poultry Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-stone-950">
              Livestock & Breeding Stock
            </h2>
            <p className="text-xs text-stone-500">
              Pedigree Friesians, Ayrshires, improved Kienyeji chickens, and dairy goats
            </p>
          </div>

          <button
            onClick={() => onSelectTab('livestock')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Livestock ({products.filter(p => p.category === 'livestock').length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredLivestock.map((animal) => (
            <LivestockCard
              key={animal.id}
              product={animal}
              onViewDetails={onViewProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* 5. Trust & Escrow Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">Verified Kenyan Farmers</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Every seller undergoes National ID and farm location verification before publishing produce or livestock.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">KeNHA Road Transport Matrix</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Transparent freight quotes based on actual paved road distances and certified livestock carriers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">M-Pesa Daraja Escrow</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Payment is held securely until you inspect your produce or animals upon delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
