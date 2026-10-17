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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-md">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Package className="w-4 h-4" />
          <span>KEPHIS & KEBS Certified Farm Inputs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Certified Seeds, Fertilizers, Feeds & Irrigation Equipment
        </h1>
        <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
          Order authentic hybrid maize seed, certified DAP/CAN fertilizers, balanced animal feeds, Boma Rhodes hay bales, and complete 1-acre drip irrigation sets delivered direct to your farm gate.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-stone-800 px-3 py-1 rounded-full text-emerald-300 border border-stone-700">
            🌱 KEPHIS Certified Seed Maize (H614D)
          </span>
          <span className="bg-stone-800 px-3 py-1 rounded-full text-emerald-300 border border-stone-700">
            🧪 DAP & CAN Top-Dressing Fertilizers
          </span>
          <span className="bg-stone-800 px-3 py-1 rounded-full text-emerald-300 border border-stone-700">
            💧 Complete Drip Irrigation Kits
          </span>
          <span className="bg-stone-800 px-3 py-1 rounded-full text-emerald-300 border border-stone-700">
            🌾 Sweet Boma Rhodes Baled Hay
          </span>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-96 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search DAP, certified seed, drip kit, sprayers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-stone-800 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeCategory === 'all' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Inputs ({inputProducts.length})
            </button>
            <button
              onClick={() => setActiveCategory('seeds')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeCategory === 'seeds' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Certified Seeds
            </button>
            <button
              onClick={() => setActiveCategory('fertilizer')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeCategory === 'fertilizer' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Fertilizers & Soil Nutrition
            </button>
            <button
              onClick={() => setActiveCategory('feeds')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeCategory === 'feeds' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Animal Feeds & Fodder
            </button>
            <button
              onClick={() => setActiveCategory('machinery')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeCategory === 'machinery' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Machinery & Irrigation
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
