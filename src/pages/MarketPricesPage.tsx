import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  MapPin, 
  Building2, 
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 text-[#D6A545]" />
              <span>National Commodity Price Bulletin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
              Kenyan Wholesale & Retail Agricultural Market Prices
            </h1>
            <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
              Monitored wholesale clearing rates from terminal markets: Wakulima (Nairobi), Kongowea (Mombasa), Kibuye (Kisumu), Nakuru Top Market, and Eldoret Municipal.
            </p>
          </div>

          <button
            onClick={() => setSubscribedAlert(!subscribedAlert)}
            className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4" />
            <span>{subscribedAlert ? 'Subscribed to Daily SMS' : 'Subscribe to Price SMS'}</span>
          </button>
        </div>
      </div>

      {subscribedAlert && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-medium rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
          <span>You are subscribed to daily 6:00 AM agricultural wholesale market price SMS broadcasts for your county!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7DE] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-5 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#68756A] shrink-0" />
            <input
              type="text"
              placeholder="Search commodity (e.g. Maize, Potatoes, Milk)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[#252D27] placeholder:text-[#68756A] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
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
            <span className="text-[#68756A] font-semibold">Category:</span>
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

      {/* Prices Table */}
      <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F6F0] border-b border-[#E2E7DE] text-[#68756A] font-bold uppercase tracking-wider">
                <th className="p-3.5">Commodity & Variety</th>
                <th className="p-3.5">Market & County</th>
                <th className="p-3.5">Unit</th>
                <th className="p-3.5">Wholesale Price (KSh)</th>
                <th className="p-3.5">Retail Price (KSh)</th>
                <th className="p-3.5">24h Trend</th>
                <th className="p-3.5">Official Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E7DE]">
              {filteredPrices.map((record) => (
                <tr key={record.id} className="hover:bg-[#F7F6F0]/60 transition">
                  <td className="p-3.5 font-bold text-[#252D27]">
                    <span className="block text-sm">{record.commodityName}</span>
                    <span className="text-[11px] font-normal text-[#68756A]">{record.variety}</span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-semibold text-[#252D27] block">{record.marketName}</span>
                    <span className="text-[11px] text-[#68756A] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#367C46]" />
                      {record.county} County
                    </span>
                  </td>

                  <td className="p-3.5 font-medium text-[#68756A]">
                    {record.unit}
                  </td>

                  <td className="p-3.5 font-extrabold text-sm text-[#214E34] tabular-nums">
                    KSh {record.wholesalePriceKsh.toLocaleString()}
                  </td>

                  <td className="p-3.5 font-semibold text-[#252D27] tabular-nums">
                    KSh {record.retailPriceKsh.toLocaleString()}
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1 font-bold">
                      {record.trend === 'up' && (
                        <span className="flex items-center gap-1 text-[#367C46] bg-[#EBF3ED] px-2 py-0.5 rounded text-[11px]">
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{record.changePercent}%
                        </span>
                      )}
                      {record.trend === 'down' && (
                        <span className="flex items-center gap-1 text-[#79543A] bg-[#F7F2EE] px-2 py-0.5 rounded text-[11px]">
                          <TrendingDown className="w-3.5 h-3.5" />
                          {record.changePercent}%
                        </span>
                      )}
                      {record.trend === 'stable' && (
                        <span className="flex items-center gap-1 text-[#68756A] bg-[#F7F6F0] px-2 py-0.5 rounded text-[11px]">
                          <Minus className="w-3 h-3" />
                          Stable
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3.5 text-[11px] text-[#68756A] max-w-xs">
                    <p className="line-clamp-2">{record.source}</p>
                    <span className="text-[10px] text-[#68756A] block mt-0.5">
                      Updated: {new Date(record.verifiedAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice on Indicative Prices */}
      <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] text-[#68756A] text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-[#367C46] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#252D27] block">Indicative Market Price Notice:</span>
          <p className="text-[11px] mt-0.5 leading-relaxed">
            Market prices shown above represent monitored wholesale clearing rates at regional municipal exchanges and are collected from the Ministry of Agriculture, NCPB, and Kenya Dairy Board. A seller's actual asking price on the Marketplace may vary depending on grading, packaging, freshness, and delivery terms.
          </p>
        </div>
      </div>
    </div>
  );
};
