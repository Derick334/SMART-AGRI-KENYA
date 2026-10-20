import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Filter, 
  Wrench, 
  CheckCircle2, 
  Truck 
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';

interface FarmInputsPageProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const FarmInputsPage: React.FC<FarmInputsPageProps> = ({
  products,
  onViewProduct,
  onAddToCart,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'seeds' | 'fertilizer' | 'feeds' | 'machinery'>('all');

  const inputProducts = useMemo(() => {
    return products.filter(p => p.category === 'inputs' || p.category === 'equipment' || p.category === 'fodder');
  }, [products]);

  const filtered = useMemo(() => {
    return inputProducts.filter((p) => {
      if (activeCategory === 'seeds' && !p.subcategory.toLowerCase().includes('seed')) return false;
      if (activeCategory === 'fertilizer' && !p.subcategory.toLowerCase().includes('fertilizer')) return false;
      if (activeCategory === 'feeds' && !p.subcategory.toLowerCase().includes('feed') && !p.subcategory.toLowerCase().includes('fodder')) return false;
      if (activeCategory === 'machinery' && p.category !== 'equipment') return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) ||
               p.description.toLowerCase().includes(q) ||
               p.subcategory.toLowerCase().includes(q) ||
               p.sellerCounty.toLowerCase().includes(q);
      }
      return true;
    });
  }, [inputProducts, activeCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider mb-2">
          <Package className="w-4 h-4 text-[#367C46]" />
          <span>KEPHIS & KEBS Certified Farm Inputs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
          Certified Seeds, Fertilizers, Feeds & Irrigation Equipment
        </h1>
        <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
          Order authentic hybrid maize seed, certified DAP/CAN fertilizers, balanced animal feeds, Boma Rhodes hay bales, and complete drip irrigation sets delivered direct to your farm gate.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-[#EBF3ED] px-2.5 py-1 rounded text-[#214E34] border border-[#CFD7CA] font-medium">
            KEPHIS Certified Seed Maize (H614D)
          </span>
          <span className="bg-[#EBF3ED] px-2.5 py-1 rounded text-[#214E34] border border-[#CFD7CA] font-medium">
            DAP & CAN Top-Dressing Fertilizers
          </span>
          <span className="bg-[#EBF3ED] px-2.5 py-1 rounded text-[#214E34] border border-[#CFD7CA] font-medium">
            Complete Drip Irrigation Kits
          </span>
          <span className="bg-[#EBF3ED] px-2.5 py-1 rounded text-[#214E34] border border-[#CFD7CA] font-medium">
            Sweet Boma Rhodes Baled Hay
          </span>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7DE] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-96 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-[#68756A] shrink-0" />
            <input
              type="text"
              placeholder="Search DAP, certified seed, drip kit, sprayers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[#252D27] placeholder:text-[#68756A] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer border ${
                activeCategory === 'all' 
                  ? 'bg-[#367C46] text-white border-[#367C46]' 
                  : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
              }`}
            >
              All Inputs ({inputProducts.length})
            </button>
            <button
              onClick={() => setActiveCategory('seeds')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer border ${
                activeCategory === 'seeds' 
                  ? 'bg-[#367C46] text-white border-[#367C46]' 
                  : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
              }`}
            >
              Certified Seeds
            </button>
            <button
              onClick={() => setActiveCategory('fertilizer')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer border ${
                activeCategory === 'fertilizer' 
                  ? 'bg-[#367C46] text-white border-[#367C46]' 
                  : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
              }`}
            >
              Fertilizers & Soil Nutrition
            </button>
            <button
              onClick={() => setActiveCategory('feeds')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer border ${
                activeCategory === 'feeds' 
                  ? 'bg-[#367C46] text-white border-[#367C46]' 
                  : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
              }`}
            >
              Animal Feeds & Fodder
            </button>
            <button
              onClick={() => setActiveCategory('machinery')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer border ${
                activeCategory === 'machinery' 
                  ? 'bg-[#367C46] text-white border-[#367C46]' 
                  : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
              }`}
            >
              Machinery & Irrigation
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            onViewDetails={onViewProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};
