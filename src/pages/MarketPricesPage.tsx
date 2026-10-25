import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  MapPin, 
  Building2, 
  Info, 
  Bell, 
  CheckCircle2,
  Plus,
  ShieldCheck,
  Tag,
  Filter,
  BarChart3,
  Calendar,
  Layers,
  ShoppingBag,
  ExternalLink,
  X,
  ChevronRight
} from 'lucide-react';
import { MarketPriceRecord, MarketPriceType, Product } from '../types';
import { agriStore } from '../services/store';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface MarketPricesPageProps {
  onSelectMarketplaceTab?: (tab: string) => void;
  activeCategoryTab?: string;
}

export const MarketPricesPage: React.FC<MarketPricesPageProps> = ({
  onSelectMarketplaceTab,
  activeCategoryTab = 'market-prices'
}) => {
  const [marketPrices, setMarketPrices] = useState<MarketPriceRecord[]>(() => agriStore.getMarketPrices());
  const [products, setProducts] = useState<Product[]>(() => agriStore.getProducts());

  useEffect(() => {
    const unsub = agriStore.subscribe(() => {
      setMarketPrices(agriStore.getMarketPrices());
      setProducts(agriStore.getProducts());
    });
    return unsub;
  }, []);

  // Filter States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [countyFilter, setCountyFilter] = useState<string>('all');
  const [priceTypeFilter, setPriceTypeFilter] = useState<string>('all');
  const [activeViewMode, setActiveViewMode] = useState<'all' | 'verified' | 'seller_asking'>('all');
  const [subscribedAlert, setSubscribedAlert] = useState(false);

  // New Observation Modal
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [newCommodity, setNewCommodity] = useState('Dry White Maize');
  const [newCategory, setNewCategory] = useState('Cereals');
  const [newVariety, setNewVariety] = useState('H614D');
  const [newMarket, setNewMarket] = useState('Nakuru Top Market');
  const [newCounty, setNewCounty] = useState('Nakuru');
  const [newWholesalePrice, setNewWholesalePrice] = useState('3400');
  const [newRetailPrice, setNewRetailPrice] = useState('3900');
  const [newUnit, setNewUnit] = useState('90kg bag');
  const [newTrend, setNewTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [newSource, setNewSource] = useState('County Agricultural Extension Officer');
  const [newNotes, setNewNotes] = useState('Early morning wholesale gate clearing price.');
  const [observationSuccess, setObservationSuccess] = useState<string | null>(null);

  const categories = ['all', 'Cereals', 'Legumes', 'Roots & Tubers', 'Vegetables', 'Dairy & Poultry', 'Livestock & Meat'];
  const markets = [
    'all', 
    'Wakulima (Marikiti) Wholesale', 
    'Eldoret Municipal Market', 
    'Kibuye Market', 
    'Kongowea Market', 
    'Nakuru Top Market', 
    'Garissa Livestock Auction',
    'Kitale Central Market',
    'Nyeri Municipal Market'
  ];

  // Aggregated Seller Asking Prices from live marketplace products
  const sellerAskingPrices = useMemo(() => {
    const summaryMap: Record<string, {
      commodity: string;
      category: string;
      count: number;
      minPrice: number;
      maxPrice: number;
      avgPrice: number;
      unit: string;
      counties: Set<string>;
    }> = {};

    products.forEach((p) => {
      const key = `${p.productType || p.title}_${p.unit}`;
      if (!summaryMap[key]) {
        summaryMap[key] = {
          commodity: p.productType || p.title,
          category: p.category === 'crops' ? 'Crops & Produce' : p.category === 'livestock' ? 'Livestock' : 'Farm Inputs',
          count: 0,
          minPrice: p.priceKsh,
          maxPrice: p.priceKsh,
          avgPrice: 0,
          unit: p.unit,
          counties: new Set([p.sellerCounty]),
        };
      }
      const item = summaryMap[key];
      item.count += 1;
      item.minPrice = Math.min(item.minPrice, p.priceKsh);
      item.maxPrice = Math.max(item.maxPrice, p.priceKsh);
      item.avgPrice += p.priceKsh;
      item.counties.add(p.sellerCounty);
    });

    return Object.values(summaryMap).map(item => ({
      ...item,
      avgPrice: Math.round(item.avgPrice / item.count),
      countyList: Array.from(item.counties).join(', '),
    }));
  }, [products]);

  // Filtered Verified Market Price Records
  const filteredPrices = useMemo(() => {
    return marketPrices.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (marketFilter !== 'all' && p.marketName !== marketFilter) return false;
      if (countyFilter !== 'all' && p.county !== countyFilter) return false;
      if (priceTypeFilter !== 'all') {
        const pType = p.priceType || 'verified_observation';
        if (pType !== priceTypeFilter) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.commodityName.toLowerCase().includes(q) ||
               p.marketName.toLowerCase().includes(q) ||
               p.county.toLowerCase().includes(q) ||
               (p.variety && p.variety.toLowerCase().includes(q));
      }
      return true;
    });
  }, [marketPrices, categoryFilter, marketFilter, countyFilter, priceTypeFilter, search]);

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommodity || !newWholesalePrice) return;

    const record = agriStore.addMarketPrice({
      commodityName: newCommodity.trim(),
      category: newCategory as any,
      variety: newVariety.trim() || 'Standard Variety',
      marketName: newMarket,
      county: newCounty,
      wholesalePriceKsh: Number(newWholesalePrice),
      retailPriceKsh: newRetailPrice ? Number(newRetailPrice) : Math.round(Number(newWholesalePrice) * 1.15),
      unit: newUnit,
      trend: newTrend,
      changePercent: newTrend === 'up' ? 2.5 : newTrend === 'down' ? -2.5 : 0.0,
      source: newSource.trim() || 'County Market Extension Officer',
      priceType: 'verified_observation',
      observationDate: new Date().toISOString().split('T')[0],
      notes: newNotes.trim() || undefined,
      isIndicative: false,
    });

    // Also attempt server sync
    fetch('/api/market-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).catch(err => console.warn('Market price observation server sync fallback:', err));

    setIsObservationModalOpen(false);
    setObservationSuccess(`Verified price observation for "${record.commodityName}" at ${record.marketName} submitted.`);
    setTimeout(() => setObservationSuccess(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Observation success banner */}
      {observationSuccess && (
        <div className="bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] rounded-lg p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{observationSuccess}</p>
          </div>
          <button onClick={() => setObservationSuccess(null)} className="text-[#214E34] hover:bg-[#DCECE0] rounded p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#68756A]">
        <button
          onClick={() => onSelectMarketplaceTab ? onSelectMarketplaceTab('marketplace') : (window.location.hash = 'marketplace')}
          className="hover:text-[#214E34] font-medium transition cursor-pointer"
        >
          Marketplace
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#CFD7CA]" />
        <span className="text-[#214E34] font-bold">National Commodity Market Prices</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EBF3ED] text-[#214E34] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#CFD7CA]">
              <TrendingUp className="w-3.5 h-3.5 text-[#367C46]" />
              <span>National Commodity Market Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
              Kenyan Agricultural Market Prices
            </h1>
            <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
              Real-time intelligence tracking verified clearing rates at terminal markets (Wakulima, Kibuye, Kongowea, Nakuru Top Market, Eldoret Municipal) contrasted with live seller asking prices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsObservationModalOpen(true)}
              className="bg-[#214E34] hover:bg-[#183C27] text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Price Observation</span>
            </button>

            <button
              onClick={() => setSubscribedAlert(!subscribedAlert)}
              className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer shrink-0"
            >
              <Bell className="w-4 h-4" />
              <span>{subscribedAlert ? 'Subscribed to SMS' : 'SMS Alerts'}</span>
            </button>
          </div>
        </div>

        {subscribedAlert && (
          <div className="mt-4 p-3 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-medium rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>You are subscribed to 6:00 AM wholesale price SMS broadcasts for terminal markets in your county.</span>
          </div>
        )}

        {/* Intelligence Type Legend */}
        <div className="mt-5 pt-4 border-t border-[#E2E7DE] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#F7F6F0] border border-[#E2E7DE]">
            <div className="flex items-center gap-1.5 font-bold text-[#214E34]">
              <span className="w-2 h-2 rounded-full bg-[#367C46]"></span>
              <span>Verified Market Observation</span>
            </div>
            <p className="text-[11px] text-[#68756A] mt-0.5">Recorded on-site by extension officers & market clerks</p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F6F0] border border-[#E2E7DE]">
            <div className="flex items-center gap-1.5 font-bold text-[#214E34]">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Seller Asking Prices</span>
            </div>
            <p className="text-[11px] text-[#68756A] mt-0.5">Aggregated live from active listings across 47 counties</p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F6F0] border border-[#E2E7DE]">
            <div className="flex items-center gap-1.5 font-bold text-[#214E34]">
              <span className="w-2 h-2 rounded-full bg-[#D6A545]"></span>
              <span>Historical Trends</span>
            </div>
            <p className="text-[11px] text-[#68756A] mt-0.5">24-hour and weekly price velocity shifts</p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F6F0] border border-[#E2E7DE]">
            <div className="flex items-center gap-1.5 font-bold text-[#214E34]">
              <span className="w-2 h-2 rounded-full bg-stone-500"></span>
              <span>Estimated Indicative Price</span>
            </div>
            <p className="text-[11px] text-[#68756A] mt-0.5">Benchmark calculated with freight and handling margins</p>
          </div>
        </div>
      </div>

      {/* View Switcher: All vs Verified vs Seller Asking */}
      <div className="flex border-b border-[#E2E7DE] gap-2">
        <button
          onClick={() => setActiveViewMode('all')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition cursor-pointer border-b-2 ${
            activeViewMode === 'all'
              ? 'border-[#367C46] text-[#214E34]'
              : 'border-transparent text-[#68756A] hover:text-[#252D27]'
          }`}
        >
          All Market Intelligence ({filteredPrices.length})
        </button>
        <button
          onClick={() => setActiveViewMode('verified')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition cursor-pointer border-b-2 ${
            activeViewMode === 'verified'
              ? 'border-[#367C46] text-[#214E34]'
              : 'border-transparent text-[#68756A] hover:text-[#252D27]'
          }`}
        >
          Verified Terminal Market Clearing ({filteredPrices.filter(p => !p.priceType || p.priceType === 'verified_observation').length})
        </button>
        <button
          onClick={() => setActiveViewMode('seller_asking')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition cursor-pointer border-b-2 ${
            activeViewMode === 'seller_asking'
              ? 'border-[#367C46] text-[#214E34]'
              : 'border-transparent text-[#68756A] hover:text-[#252D27]'
          }`}
        >
          Seller Asking Prices from Marketplace ({sellerAskingPrices.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7DE] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-4 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#68756A] shrink-0" />
            <input
              type="text"
              placeholder="Search commodity (e.g. Maize, Kienyeji, Potatoes, Wheat)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[#252D27] placeholder:text-[#68756A] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <Building2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <select
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="w-full bg-transparent text-[#252D27] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Wholesale Markets</option>
              {markets.filter(m => m !== 'all').map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <MapPin className="w-4 h-4 text-[#367C46] shrink-0" />
            <select
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
              className="w-full bg-transparent text-[#252D27] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All 47 Counties</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>{c.name} County</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-transparent text-[#252D27] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 1: Verified Market Observations Table */}
      {(activeViewMode === 'all' || activeViewMode === 'verified') && (
        <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#F7F6F0] border-b border-[#E2E7DE] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#367C46]" />
              <h3 className="font-bold text-xs sm:text-sm text-[#214E34]">
                Verified Terminal Market Observations ({filteredPrices.length})
              </h3>
            </div>
            <span className="text-[11px] text-[#68756A]">Updated Daily at 06:00 EAT</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E2E7DE] text-[#68756A] font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Commodity & Variety</th>
                  <th className="p-3.5">Market & County</th>
                  <th className="p-3.5">Price Classification</th>
                  <th className="p-3.5">Wholesale Clearing</th>
                  <th className="p-3.5">Retail Price</th>
                  <th className="p-3.5">Trend & Velocity</th>
                  <th className="p-3.5">Observation Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7DE]">
                {filteredPrices.map((record) => {
                  const pType = record.priceType || 'verified_observation';
                  return (
                    <tr key={record.id} className="hover:bg-[#F7F6F0]/60 transition">
                      <td className="p-3.5 font-bold text-[#252D27]">
                        <span className="block text-sm text-[#214E34]">{record.commodityName}</span>
                        <span className="text-[11px] font-normal text-[#68756A]">{record.variety || record.category}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-[#252D27] block">{record.marketName}</span>
                        <span className="text-[11px] text-[#68756A] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#367C46]" />
                          {record.county} County
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          pType === 'verified_observation'
                            ? 'bg-[#EBF3ED] text-[#214E34] border border-[#CFD7CA]'
                            : pType === 'seller_asking_price'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : pType === 'historical_price'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}>
                          {pType.replace(/_/g, ' ')}
                        </span>
                        <span className="block text-[10px] text-[#68756A] mt-0.5 font-mono">
                          {record.observationDate || record.verifiedAt?.split('T')[0] || '2026-10-24'}
                        </span>
                      </td>

                      <td className="p-3.5 font-extrabold text-[#214E34] text-sm tabular-nums">
                        KSh {record.wholesalePriceKsh.toLocaleString()}
                        <span className="text-[10px] text-[#68756A] font-normal block">
                          per {record.unit}
                        </span>
                      </td>

                      <td className="p-3.5 font-semibold text-[#252D27] tabular-nums">
                        {record.retailPriceKsh ? (
                          <>
                            KSh {record.retailPriceKsh.toLocaleString()}
                            <span className="text-[10px] text-[#68756A] font-normal block">
                              per {record.unit}
                            </span>
                          </>
                        ) : (
                          <span className="text-[#68756A] italic">Wholesale only</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1">
                          {record.trend === 'up' && (
                            <span className="flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <TrendingUp className="w-3 h-3" />
                              +{record.changePercent || 2.5}%
                            </span>
                          )}
                          {record.trend === 'down' && (
                            <span className="flex items-center gap-0.5 text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                              <TrendingDown className="w-3 h-3" />
                              {record.changePercent || -2.5}%
                            </span>
                          )}
                          {record.trend === 'stable' && (
                            <span className="flex items-center gap-0.5 text-[#68756A] font-semibold bg-[#F7F6F0] px-1.5 py-0.5 rounded border border-[#E2E7DE]">
                              <Minus className="w-3 h-3" />
                              Stable
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-[11px] text-[#68756A] max-w-xs">
                        <span className="line-clamp-2">{record.source}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: Seller Asking Prices Live From Marketplace */}
      {(activeViewMode === 'all' || activeViewMode === 'seller_asking') && (
        <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs overflow-hidden">
          <div className="p-4 bg-blue-50/50 border-b border-[#E2E7DE] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-xs sm:text-sm text-[#214E34]">
                Seller Asking Prices — Aggregated Live From SMART-AGRI Marketplace ({sellerAskingPrices.length})
              </h3>
            </div>
            <span className="text-[11px] text-[#68756A]">Direct Farmer Listings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E2E7DE] text-[#68756A] font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Commodity / Produce</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Average Asking Price</th>
                  <th className="p-3.5">Price Range (Min - Max)</th>
                  <th className="p-3.5">Unit</th>
                  <th className="p-3.5">Active Listings</th>
                  <th className="p-3.5">Supplying Counties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7DE]">
                {sellerAskingPrices.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F6F0]/60 transition">
                    <td className="p-3.5 font-bold text-[#214E34] text-sm">
                      {item.commodity}
                    </td>
                    <td className="p-3.5 font-medium text-[#68756A]">
                      {item.category}
                    </td>
                    <td className="p-3.5 font-extrabold text-[#367C46] text-sm tabular-nums">
                      KSh {item.avgPrice.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-semibold text-[#252D27] tabular-nums">
                      KSh {item.minPrice.toLocaleString()} - {item.maxPrice.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-medium text-[#68756A]">
                      {item.unit}
                    </td>
                    <td className="p-3.5 font-bold text-[#214E34]">
                      {item.count} listings
                    </td>
                    <td className="p-3.5 text-[11px] text-[#68756A] max-w-xs truncate">
                      {item.countyList}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Observation Submission Modal */}
      {isObservationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E7DE] relative animate-in fade-in duration-200">
            <button
              onClick={() => setIsObservationModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center transition cursor-pointer border border-[#E2E7DE]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3ED] text-[#214E34] flex items-center justify-center border border-[#CFD7CA]">
                <TrendingUp className="w-5 h-5 text-[#367C46]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#214E34]">Submit Market Price Observation</h3>
                <p className="text-xs text-[#68756A]">Authorized Agricultural Field Officer & Terminal Monitor</p>
              </div>
            </div>

            <form onSubmit={handleAddObservation} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Commodity Name</label>
                  <input
                    type="text"
                    required
                    value={newCommodity}
                    onChange={(e) => setNewCommodity(e.target.value)}
                    placeholder="e.g. Dry Maize, Rosecoco Beans"
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Variety / Grade</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    placeholder="e.g. H614D, Shangi, GLP 2"
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Market Name</label>
                  <select
                    value={newMarket}
                    onChange={(e) => setNewMarket(e.target.value)}
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  >
                    {markets.filter(m => m !== 'all').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">County</label>
                  <select
                    value={newCounty}
                    onChange={(e) => setNewCounty(e.target.value)}
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  >
                    {KENYA_COUNTIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name} County</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Wholesale (KSh)</label>
                  <input
                    type="number"
                    required
                    value={newWholesalePrice}
                    onChange={(e) => setNewWholesalePrice(e.target.value)}
                    placeholder="3400"
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Retail (KSh)</label>
                  <input
                    type="number"
                    value={newRetailPrice}
                    onChange={(e) => setNewRetailPrice(e.target.value)}
                    placeholder="3900"
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="90kg bag, kg, bird"
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Observed Trend</label>
                  <select
                    value={newTrend}
                    onChange={(e: any) => setNewTrend(e.target.value)}
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  >
                    <option value="stable">Stable Clearing Rate</option>
                    <option value="up">Rising Price / Influx Demand</option>
                    <option value="down">Falling Price / Harvest Oversupply</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Source / Extension Agency</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="e.g. County Agricultural Office / NCPB"
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Field Observation Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes on truck queues, moisture conditions, or supply from neighboring sub-counties..."
                  className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsObservationModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-xs font-semibold hover:bg-[#F7F6F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Publish Observation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
