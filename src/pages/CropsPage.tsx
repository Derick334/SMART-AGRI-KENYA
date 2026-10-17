import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Search, 
  MapPin, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface CropsPageProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CropsPage: React.FC<CropsPageProps> = ({
  products,
  onViewProduct,
  onAddToCart,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');

  const cropProducts = useMemo(() => {
    return products.filter(p => p.category === 'crops');
  }, [products]);

  const subcategories = [
    'all',
    'Cereals & Grains',
    'Pulses & Legumes',
    'Roots & Tubers',
    'Fruits & Nuts',
    'Horticulture & Vegetables',
  ];

  const filtered = useMemo(() => {
    return cropProducts.filter((p) => {
      if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) return false;
      if (selectedCounty !== 'all' && p.sellerCounty.toLowerCase() !== selectedCounty.toLowerCase()) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) ||
               p.description.toLowerCase().includes(q) ||
               p.variety?.toLowerCase().includes(q) ||
               p.sellerCounty.toLowerCase().includes(q);
      }
      return true;
    });
  }, [cropProducts, selectedSubcategory, selectedCounty, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Crops Hero Banner */}
      <div className="bg-linear-to-r from-emerald-900 to-green-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-md">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sprout className="w-4 h-4" />
          <span>Kenyan Crops & Fresh Farm Produce</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Crops, Cereals, Fruits & Vegetables Marketplace
        </h1>
        <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
          Source Grade 1 dry maize from Uasin Gishu, fresh Shangi potatoes from Nyandarua, aromatic Mwea Pishori rice, export Hass avocados, and ripe greenhouse tomatoes directly from farm gates.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-emerald-800/80 px-3 py-1 rounded-full text-emerald-200 border border-emerald-700">
            🌽 Maize, Beans & Wheat
          </span>
          <span className="bg-emerald-800/80 px-3 py-1 rounded-full text-emerald-200 border border-emerald-700">
            🥔 Nyandarua Shangi Potatoes
          </span>
          <span className="bg-emerald-800/80 px-3 py-1 rounded-full text-emerald-200 border border-emerald-700">
            🥑 Certified Hass Avocados
          </span>
          <span className="bg-emerald-800/80 px-3 py-1 rounded-full text-emerald-200 border border-emerald-700">
            🍚 Pure Mwea Pishori Rice
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search maize, potatoes, avocados, rice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-stone-800 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-6 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Producer Counties</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} County
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-xs">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer capitalize ${
                selectedSubcategory === sub
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {sub === 'all' ? 'All Crop Categories' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((crop) => (
          <ProductCard
            key={crop.id}
            product={crop}
            onViewDetails={onViewProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};
