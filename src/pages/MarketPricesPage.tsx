import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  MapPin, 
  Building2, 
  Calendar, 
  Info, 
  Bell, 
  CheckCircle2 
} from 'lucide-react';
import { SAMPLE_MARKET_PRICES } from '../data/sampleMarketPrices';

export const MarketPricesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [subscribedAlert, setSubscribedAlert] = useState(false);

  const categories = ['all', 'Cereals', 'Legumes', 'Roots & Tubers', 'Vegetables', 'Dairy & Poultry', 'Livestock & Meat'];
  const markets = ['all', 'Wakulima (Marikiti) Wholesale', 'Eldoret Municipal Market', 'Kibuye Market', 'Kongowea Market', 'Nakuru Top Market', 'Garissa Livestock Auction'];

  const filteredPrices = useMemo(() => {
    return SAMPLE_MARKET_PRICES.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (marketFilter !== 'all' && p.marketName !== marketFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.commodityName.toLowerCase().includes(q) ||
               p.marketName.toLowerCase().includes(q) ||
               p.county.toLowerCase().includes(q);
      }
      return true;
    });
  }, [categoryFilter, marketFilter, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-800/40 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>National Agricultural Commodity Price Bulletin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kenyan Wholesale & Retail Agricultural Market Prices
            </h1>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Real-time indicative pricing observed across major terminal markets: Wakulima (Nairobi), Kongowea (Mombasa), Kibuye (Kisumu), Nakuru Top Market, and Eldoret Municipal.
            </p>
          </div>

          <button
            onClick={() => setSubscribedAlert(!subscribedAlert)}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4" />
            <span>{subscribedAlert ? 'Subscribed to Daily SMS Alert' : 'Subscribe to Price Alerts'}</span>
          </button>
        </div>
      </div>

      {subscribedAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>You are subscribed to daily 6:00 AM agricultural wholesale market price SMS broadcasts for your county!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-5 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search commodity (e.g. Maize, Potatoes, Milk)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-stone-800 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2">
            <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="w-full bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Wholesale Markets</option>
              {markets.filter(m => m !== 'all').map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2">
            <span className="text-stone-400 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prices Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <th className="p-4">Commodity & Variety</th>
                <th className="p-4">Market & County</th>
                <th className="p-4">Unit</th>
                <th className="p-4">Wholesale Price (KSh)</th>
                <th className="p-4">Retail Price (KSh)</th>
                <th className="p-4">24h Trend</th>
                <th className="p-4">Official Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPrices.map((record) => (
                <tr key={record.id} className="hover:bg-emerald-50/40 transition">
                  <td className="p-4 font-bold text-stone-900">
                    <span className="block text-sm">{record.commodityName}</span>
                    <span className="text-[11px] font-normal text-stone-500">{record.variety}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-stone-800 block">{record.marketName}</span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {record.county} County
                    </span>
                  </td>

                  <td className="p-4 font-medium text-stone-600">
                    {record.unit}
                  </td>

                  <td className="p-4 font-black text-sm text-emerald-950">
                    KSh {record.wholesalePriceKsh.toLocaleString()}
                  </td>

                  <td className="p-4 font-bold text-stone-800">
                    KSh {record.retailPriceKsh.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1 font-bold">
                      {record.trend === 'up' && (
                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{record.changePercent}%
                        </span>
                      )}
                      {record.trend === 'down' && (
                        <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          <TrendingDown className="w-3.5 h-3.5" />
                          {record.changePercent}%
                        </span>
                      )}
                      {record.trend === 'stable' && (
                        <span className="flex items-center gap-1 text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                          <Minus className="w-3 h-3" />
                          Stable
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-[10px] text-stone-500 max-w-xs">
                    <p className="line-clamp-2">{record.source}</p>
                    <span className="text-[9px] text-stone-400 block mt-0.5">
                      Updated: {new Date(record.verifiedAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice on Indicative Prices vs Seller Asking Prices */}
      <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-stone-600 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-stone-900 block">Indicative Market Price Notice:</span>
          <p className="text-[11px] mt-0.5 leading-relaxed">
            Market prices shown above represent monitored wholesale clearing rates at regional municipal exchanges and are collected from the Ministry of Agriculture, NCPB, and Kenya Dairy Board. A seller's actual asking price on the Marketplace may vary depending on grading, packaging, freshness, and delivery terms.
          </p>
        </div>
      </div>
    </div>
  );
};
