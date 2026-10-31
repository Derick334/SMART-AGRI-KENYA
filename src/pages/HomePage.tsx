import React, { useState } from 'react';
import {
  Sprout,
  Beef,
  Package,
  TrendingUp,
  Search,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  CloudSun,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { agriStore } from '../services/store';

interface HomePageProps {
  products?: Product[];
  onSelectTab: (tabId: string) => void;
  onViewProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  selectedCounty?: string;
  onSelectCounty?: (county: string) => void;
  onSearchMarketplace?: (query: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTab,
  selectedCounty = 'Nakuru',
  onSearchMarketplace,
  onOpenAuth
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [verifyCodeInput, setVerifyCodeInput] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    if (onSearchMarketplace) {
      onSearchMarketplace(heroSearch.trim());
    }
    onSelectTab('marketplace');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCodeInput.trim()) return;
    onSelectTab(`verify?code=${encodeURIComponent(verifyCodeInput.trim())}`);
  };

  // 4 Main Marketplace Categories with dedicated views
  const MARKETPLACE_CATEGORIES = [
    {
      id: 'crops',
      tabId: 'crops',
      title: 'Crops & Produce',
      tagline: 'Maize, Irish Potatoes, Avocados, French Beans, Onions & Tomatoes',
      count: '420+ Listings',
      image: '/assets/services/wholesale_market_prices.jpg',
      badge: 'Escrow Protected'
    },
    {
      id: 'livestock',
      tabId: 'livestock',
      title: 'Livestock & Cattle',
      tagline: 'Pedigree Friesian, Ayrshire, Dorper Sheep, Boer Goats & Dairy stock',
      count: '180+ Livestock',
      image: '/assets/services/pedigree_livestock_cow.jpg',
      badge: 'Vet Health Certified'
    },
    {
      id: 'inputs',
      tabId: 'inputs',
      title: 'Farm Inputs & Tools',
      tagline: 'KEPHIS-certified seeds, authorized fertilizers, sprayers & drip irrigation',
      count: '310+ Products',
      image: '/assets/services/certified_farm_inputs.jpg',
      badge: 'KEPHIS & PCPB Verified'
    },
    {
      id: 'market-prices',
      tabId: 'market-prices',
      title: 'Market Prices',
      tagline: 'Daily wholesale market commodity prices across Wakulima, Kongowea & 47 counties',
      count: 'Updated Today',
      image: '/assets/services/wholesale_market_prices.jpg',
      badge: 'Live Commodity Ticker'
    }
  ];

  const SERVICE_CARDS = [
    {
      id: 'soil-testing',
      title: 'Soil Health Testing',
      subtitle: 'KALRO accredited soil fertility, lime requirements & pH correction',
      tabId: 'soil-testing',
      image: '/assets/services/soil_health_testing.jpg',
      actionText: 'Request Soil Test',
    },
    {
      id: 'pest-diagnosis',
      title: 'Pest & Disease Checker',
      subtitle: 'AI-assisted diagnosis & PCPB-approved clinical crop protection',
      tabId: 'pest-diagnosis',
      image: '/assets/services/pest_disease_checker.jpg',
      actionText: 'Diagnose Symptoms',
    },
    {
      id: 'irrigation',
      title: 'Smart Irrigation & Soil',
      subtitle: 'Calculated evapotranspiration, drip schedules & soil moisture curves',
      tabId: 'irrigation',
      image: '/assets/services/farmer_digital_portal.jpg',
      actionText: 'Calculate Water Needs',
    },
    {
      id: 'experts',
      title: 'Agronomist Consultations',
      subtitle: 'Direct private appointments with certified plant & veterinary specialists',
      tabId: 'experts',
      image: '/assets/services/farmer_digital_portal.jpg',
      actionText: 'Book Agronomist',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#173A25] via-[#214E34] to-[#2B6243] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>National Agricultural Ecosystem · All 47 Kenya Counties</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Empowering Kenyan Agriculture with Precision, Data & Trade
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal">
              Unified digital marketplace for verified crops, pedigree livestock, and certified inputs. Featuring automated digital membership cards, KALRO soil health testing, and M-Pesa escrow trade protection.
            </p>

            {/* Prominent Search Bar */}
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl pt-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search maize varieties, dairy cattle, fertilizers, or prices..."
                  value={heroSearch}
                  onChange={e => setHeroSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#D6A545] shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#48A366] hover:bg-[#3d8c56] text-white rounded-xl text-sm font-bold shadow-lg shadow-black/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Search Market</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-emerald-100">
              <span className="font-semibold text-white">Popular:</span>
              <button
                onClick={() => onSelectTab('crops')}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition"
              >
                Dry Maize (90kg bags)
              </button>
              <button
                onClick={() => onSelectTab('livestock')}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition"
              >
                In-Calf Friesian Heifers
              </button>
              <button
                onClick={() => onSelectTab('inputs')}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition"
              >
                Planting DAP Fertilizer
              </button>
              <button
                onClick={() => onSelectTab('weather')}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition flex items-center gap-1"
              >
                <CloudSun className="w-3.5 h-3.5 text-amber-300" />
                <span>{selectedCounty} Weather</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Counter Ribbon */}
        <div className="bg-[#122e1e] border-t border-white/10 py-4 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">47</div>
              <div className="text-[11px] text-emerald-300 font-medium">Counties Connected</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">18,500+</div>
              <div className="text-[11px] text-emerald-300 font-medium">Registered Farmers</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">240+</div>
              <div className="text-[11px] text-emerald-300 font-medium">Verified Agronomists</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">KES 85M+</div>
              <div className="text-[11px] text-emerald-300 font-medium">Escrow Trade Settled</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR MAIN MARKETPLACE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#367C46]">
              <Sprout className="w-4 h-4" />
              <span>National Marketplace Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Explore Agricultural Categories
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Find every variety of produce, certified inputs, livestock, and market prices in one dedicated portal.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('marketplace')}
            className="text-xs sm:text-sm font-bold text-[#214E34] hover:text-[#183926] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Marketplace Listings</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectTab(cat.tabId)}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#367C46] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#214E34]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {cat.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {cat.count}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-[#214E34] transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#214E34] group-hover:text-[#183926]">
                <span>Open {cat.title}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DIGITAL MEMBERSHIP SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-[#F7F6F0] border border-emerald-200 p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>Universal Digital Identification</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                Automated Digital Membership Cards for Every Kenyan Farmer & Partner
              </h2>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Join SMART-AGRI Kenya and instantly receive your official identification card formatted as <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">SA-2026-XXXXXX</span>. Includes dynamic QR verification, tamper-evident seals, and printable wallet PDF formatting.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2 text-xs text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Permanent registry number valid across 47 counties</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Public QR verification protects privacy (Non-PII)</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Access subsidized certified seeds and soil testing</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>M-Pesa Daraja payment escrow guarantee</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('register') : onSelectTab('membership')}
                  className="px-5 py-2.5 bg-[#214E34] hover:bg-[#183C27] text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs"
                >
                  Register for Membership Card
                </button>
                <button
                  onClick={() => onSelectTab('membership')}
                  className="px-4 py-2.5 bg-white text-gray-800 hover:bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  View Membership Tiers
                </button>
              </div>
            </div>

            {/* Instant Verification Search Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-emerald-200 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#214E34]" />
                <h3 className="font-bold text-gray-900 text-sm">Verify Member Authenticity</h3>
              </div>
              <p className="text-xs text-gray-500">
                Buyers, agrovet dealers, and cooperatives can instantly verify credentials and active status.
              </p>

              <form onSubmit={handleVerifySubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Enter Member Code (e.g. SA-2026-F94812)"
                  value={verifyCodeInput}
                  onChange={e => setVerifyCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 text-xs font-mono border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#214E34]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#48A366] hover:bg-[#3d8c56] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Status</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ESSENTIAL SERVICES & AGRICULTURAL INTELLIGENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#367C46]">
              <Sparkles className="w-4 h-4" />
              <span>Diagnostic & Advisory Tools</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Field Advisory & Farm Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              KALRO-aligned soil health, AI pest diagnosis, and agronomist network.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('services')}
            className="text-xs sm:text-sm font-bold text-[#214E34] hover:text-[#183926] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Browse All Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_CARDS.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectTab(service.tabId)}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#367C46] transition duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 space-y-1.5">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-[#214E34]">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {service.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#214E34]">
                <span>{service.actionText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS & TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF9F5] border border-gray-200 rounded-3xl p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <h2 className="text-2xl font-black text-gray-900">Trusted Across 47 Counties</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Hear from Kenyan farmers, cooperative leaders, and agronomists growing with SMART-AGRI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "Testing my Kericho farm soil through SMART-AGRI revealed heavy acidification (pH 4.8). Applying lime and switching to CAN increased my maize yield from 14 to 28 bags per acre."
              </p>
              <div className="pt-2 border-t border-gray-100 text-xs">
                <div className="font-bold text-gray-900">Kiprono Langat</div>
                <div className="text-gray-500 text-[11px]">Maize & Dairy Farmer, Kericho County · SA-2026-F10482</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "The M-Pesa escrow system gives our potato buyer in Mombasa total peace of mind. He deposits payments upfront, KeNHA transporters deliver, and funds clear straight away."
              </p>
              <div className="pt-2 border-t border-gray-100 text-xs">
                <div className="font-bold text-gray-900">Mary Wambui</div>
                <div className="text-gray-500 text-[11px]">Commercial Potato Grower, Nyandarua County · SA-2026-F29104</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "Managing 420 smallholder grain records through the Cooperative Hub cut our reconciliation time by 80%. Our members love their digital membership cards and automated SMS payouts."
              </p>
              <div className="pt-2 border-t border-gray-100 text-xs">
                <div className="font-bold text-gray-900">Francis Odhiambo</div>
                <div className="text-gray-500 text-[11px]">Secretary Manager, Ahero Grain Cooperative · SA-2026-C88319</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
