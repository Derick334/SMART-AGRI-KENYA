import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowUpDown, 
  Store, 
  Sprout, 
  Beef, 
  Package, 
  Wrench,
  Sparkles,
  X
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { LivestockCard } from '../components/livestock/LivestockCard';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface MarketplacePageProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  comparedIds?: string[];
  initialCategory?: ProductCategory | 'all';
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  products,
  onViewProduct,
  onAddToCart,
  onToggleCompare,
  comparedIds = [],
  initialCategory = 'all',
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(200000);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // County filter
      if (selectedCounty !== 'all' && p.sellerCounty.toLowerCase() !== selectedCounty.toLowerCase()) {
        return false;
      }

      // Max price
      if (p.priceKsh > maxPrice) return false;

      // Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesVariety = p.variety?.toLowerCase().includes(query);
        const matchesBreed = p.livestockDetails?.breed.toLowerCase().includes(query);
        const matchesSeller = p.sellerName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesVariety && !matchesBreed && !matchesSeller) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceKsh - b.priceKsh;
      if (sortBy === 'price_desc') return b.priceKsh - a.priceKsh;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, search, selectedCategory, selectedCounty, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>National Agricultural Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Buy & Sell Crops, Livestock & Farm Inputs
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-xl">
            Direct farmer transactions without broker margins. Real-time pricing in Kenyan Shillings (KSh) with secure county delivery.
          </p>
        </div>

        <div className="bg-stone-800/80 px-4 py-3 rounded-2xl border border-stone-700 text-right">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Catalog Volume</span>
          <span className="text-xl font-black text-emerald-400">
            {filteredProducts.length} Listings Available
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        {/* Top Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-5 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search produce, cow breed, seed brand, seller..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-stone-800 focus:outline-hidden"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-stone-400 hover:text-stone-700">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* County Selector */}
          <div className="sm:col-span-4 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All 47 Kenyan Counties</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} County
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Sort: Newly Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated Sellers</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setSelectedCategory('crops')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'crops'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Crops & Produce ({products.filter(p => p.category === 'crops').length})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('livestock')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'livestock'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Beef className="w-3.5 h-3.5" />
            <span>Livestock & Cattle ({products.filter(p => p.category === 'livestock').length})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('inputs')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'inputs'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Certified Seeds & Fertilizers ({products.filter(p => p.category === 'inputs').length})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('equipment')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'equipment'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Farm Equipment & Irrigation ({products.filter(p => p.category === 'equipment').length})</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Store className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">No products match your filters</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            Try adjusting your search query, selecting another Kenyan county, or clearing filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedCounty('all');
              setMaxPrice(200000);
            }}
            className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-800 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            if (p.category === 'livestock') {
              return (
                <LivestockCard
                  key={p.id}
                  product={p}
                  onViewDetails={onViewProduct}
                  onAddToCart={onAddToCart}
                  onToggleCompare={onToggleCompare}
                  isCompared={comparedIds.includes(p.id)}
                />
              );
            }
            return (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={onViewProduct}
                onAddToCart={onAddToCart}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
