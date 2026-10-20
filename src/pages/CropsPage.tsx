import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Search, 
  MapPin, 
  Layers
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
    { id: 'all', label: 'All Crops' },
    { id: 'Cereals & Grains', label: 'Cereals & Grains' },
    { id: 'Pulses & Legumes', label: 'Pulses & Legumes' },
    { id: 'Roots & Tubers', label: 'Roots & Tubers' },
    { id: 'Fruits & Nuts', label: 'Fruits & Nuts' },
    { id: 'Horticulture & Vegetables', label: 'Vegetables & Greens' },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Crops Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider mb-2">
          <Sprout className="w-4 h-4" />
          <span>Kenyan Agricultural Produce</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
          Fresh Farm Produce, Grains & Horticulture
        </h1>
        <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
          Source Grade 1 dry maize from Uasin Gishu, fresh Shangi potatoes from Nyandarua, aromatic Mwea Pishori rice, export Hass avocados, and greenhouse vegetables directly from verified Kenyan producers.
        </p>

        {/* Category Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-[#E2E7DE] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {subcategories.map((cat) => {
            const isSelected = selectedSubcategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedSubcategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#367C46] text-white border-[#367C46]'
                    : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Location Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7DE] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-[#68756A] shrink-0" />
            <input
              type="text"
              placeholder="Search by crop, variety or producer (e.g. H614 Maize, Shangi, Hass Avocado)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[#252D27] placeholder:text-[#68756A] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#367C46] shrink-0" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full bg-[#F7F6F0] border border-[#E2E7DE] text-[#252D27] text-xs font-semibold rounded-lg p-2 focus:outline-none cursor-pointer"
            >
              <option value="all">All 47 Counties</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} County
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-[#68756A] font-medium">
            Showing <strong className="text-[#214E34] tabular-nums">{filtered.length}</strong> crop listings
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E7DE] p-8 text-center max-w-md mx-auto">
            <p className="text-xs sm:text-sm text-[#68756A]">
              No crop listings found matching your search. Try resetting filters or expanding your county selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
