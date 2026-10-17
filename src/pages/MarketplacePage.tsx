import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowUpDown, 
  Store, 
  X,
  SlidersHorizontal,
  RotateCcw,
  Tag,
  Plus
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { LivestockCard } from '../components/livestock/LivestockCard';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { 
  MarketplaceFilterBar, 
  FilterState, 
  MainCategory 
} from '../components/marketplace/MarketplaceFilterBar';
import { ProductListingModal } from '../components/marketplace/ProductListingModal';

interface MarketplacePageProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  comparedIds?: string[];
  initialCategory?: ProductCategory | 'all';
}

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  cropProductType: 'all',
  cropVariety: 'all',
  livestockAnimalType: 'all',
  livestockBreed: 'all',
  livestockCattlePurpose: 'all',
  inputProductType: 'all',
  inputFormulation: 'all',
  inputPackageSize: 'all',
  inputCertification: 'all',
  equipmentProductType: 'all',
  equipmentPowerSource: 'all',
  equipmentCondition: 'all',
  searchQuery: '',
  selectedCounty: 'all',
  maxPrice: 2000000,
  sortBy: 'newest',
};

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  products,
  onViewProduct,
  onAddToCart,
  onToggleCompare,
  comparedIds = [],
  initialCategory = 'all',
}) => {
  // Map incoming initialCategory to MainCategory
  const mapInitialCategory = (cat: ProductCategory | 'all'): MainCategory => {
    if (cat === 'crops' || cat === 'fodder' || cat === 'seedlings') return 'crops';
    if (cat === 'livestock') return 'livestock';
    if (cat === 'inputs') return 'inputs';
    if (cat === 'equipment') return 'equipment';
    return 'all';
  };

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: mapInitialCategory(initialCategory),
  });

  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      category: 'all',
    });
  };

  // Filter products dynamically according to all criteria
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Status: must be active (or default undefined status)
      if (p.status && p.status !== 'active') return false;

      // 2. Main Category Filter
      if (filters.category !== 'all') {
        if (filters.category === 'crops') {
          if (p.category !== 'crops' && p.category !== 'fodder' && p.category !== 'seedlings') {
            return false;
          }
        } else if (p.category !== filters.category) {
          return false;
        }
      }

      // 3. Crops Dynamic Filters
      if (filters.category === 'crops') {
        if (filters.cropProductType && filters.cropProductType !== 'all') {
          if (p.productType !== filters.cropProductType) return false;
        }
        if (filters.cropVariety && filters.cropVariety !== 'all') {
          const matchVariety = p.variety?.toLowerCase() === filters.cropVariety.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(filters.cropVariety.toLowerCase());
          if (!matchVariety && !matchTitle) return false;
        }
      }

      // 4. Livestock Dynamic Filters
      if (filters.category === 'livestock') {
        // Animal Type Filter
        if (filters.livestockAnimalType && filters.livestockAnimalType !== 'all') {
          const expectedAnimal = filters.livestockAnimalType.toLowerCase();
          const pAnimalType = p.animalType?.toLowerCase() || '';
          const pProdType = (p.productType as string)?.toLowerCase() || '';
          const pLiveType = p.livestockDetails?.animalType?.toLowerCase() || '';

          // Cattle matching
          if (expectedAnimal === 'cattle') {
            const isCattle = 
              pAnimalType === 'cattle' ||
              pProdType === 'cattle' ||
              ['dairy_cow', 'beef_cattle', 'bull', 'heifer', 'calf'].includes(pLiveType) ||
              p.subcategory.toLowerCase().includes('cattle');
            if (!isCattle) return false;

            // Purpose filter (Dairy / Beef / Dual-purpose)
            if (filters.livestockCattlePurpose && filters.livestockCattlePurpose !== 'all') {
              const reqPurpose = filters.livestockCattlePurpose.toLowerCase();
              const pCattlePurpose = p.cattlePurpose?.toLowerCase() || '';
              const pDetailsPurpose = p.livestockDetails?.purpose?.toLowerCase() || '';
              const matchPurpose = 
                pCattlePurpose === reqPurpose ||
                pDetailsPurpose === reqPurpose ||
                (reqPurpose === 'dairy' && pDetailsPurpose === 'milk') ||
                (reqPurpose === 'beef' && pDetailsPurpose === 'beef') ||
                (reqPurpose === 'dual-purpose' && (pDetailsPurpose === 'dual_purpose' || pDetailsPurpose === 'breeding'));
              if (!matchPurpose) return false;
            }
          } else if (expectedAnimal === 'poultry') {
            const isPoultry =
              pAnimalType === 'poultry' ||
              pProdType === 'poultry' ||
              ['chicken', 'duck', 'turkey'].includes(pLiveType) ||
              p.subcategory.toLowerCase().includes('poultry');
            if (!isPoultry) return false;
          } else if (expectedAnimal === 'goats') {
            const isGoat =
              pAnimalType === 'goats' ||
              pProdType === 'goats' ||
              pLiveType === 'goat' ||
              p.subcategory.toLowerCase().includes('goat');
            if (!isGoat) return false;
          } else if (expectedAnimal === 'sheep') {
            const isSheep =
              pAnimalType === 'sheep' ||
              pProdType === 'sheep' ||
              pLiveType === 'sheep' ||
              p.subcategory.toLowerCase().includes('sheep');
            if (!isSheep) return false;
          } else if (expectedAnimal === 'pigs') {
            const isPig =
              pAnimalType === 'pigs' ||
              pProdType === 'pigs' ||
              pLiveType === 'pig' ||
              p.subcategory.toLowerCase().includes('pig');
            if (!isPig) return false;
          } else if (expectedAnimal === 'rabbits') {
            const isRabbit =
              pAnimalType === 'rabbits' ||
              pProdType === 'rabbits' ||
              pLiveType === 'rabbit' ||
              p.subcategory.toLowerCase().includes('rabbit');
            if (!isRabbit) return false;
          } else if (expectedAnimal === 'fish') {
            const isFish =
              pAnimalType === 'fish' ||
              pProdType === 'fish' ||
              pLiveType === 'fish' ||
              p.subcategory.toLowerCase().includes('fish') ||
              p.subcategory.toLowerCase().includes('aquaculture');
            if (!isFish) return false;
          } else if (expectedAnimal === 'other livestock') {
            const isOther =
              pAnimalType === 'other livestock' ||
              pLiveType === 'bees' ||
              p.subcategory.toLowerCase().includes('honey') ||
              p.subcategory.toLowerCase().includes('apiculture');
            if (!isOther) return false;
          }
        }

        // Breed Filter (strictly relevant to selected animal)
        if (filters.livestockBreed && filters.livestockBreed !== 'all') {
          const reqBreed = filters.livestockBreed.toLowerCase();
          const pBreed = (p.breed || p.livestockDetails?.breed || '').toLowerCase();
          const pTitle = p.title.toLowerCase();
          if (!pBreed.includes(reqBreed) && !pTitle.includes(reqBreed)) {
            return false;
          }
        }
      }

      // 5. Inputs Dynamic Filters
      if (filters.category === 'inputs') {
        if (filters.inputProductType && filters.inputProductType !== 'all') {
          if (p.productType !== filters.inputProductType) return false;
        }
        if (filters.inputFormulation && filters.inputFormulation !== 'all') {
          const reqForm = filters.inputFormulation.toLowerCase();
          const pForm = (p.formulation || '').toLowerCase();
          const pTitle = p.title.toLowerCase();
          if (!pForm.includes(reqForm) && !pTitle.includes(reqForm)) return false;
        }
      }

      // 6. Equipment Dynamic Filters
      if (filters.category === 'equipment') {
        if (filters.equipmentProductType && filters.equipmentProductType !== 'all') {
          if (p.productType !== filters.equipmentProductType) return false;
        }
        if (filters.equipmentPowerSource && filters.equipmentPowerSource !== 'all') {
          if (p.powerSource !== filters.equipmentPowerSource) return false;
        }
        if (filters.equipmentCondition && filters.equipmentCondition !== 'all') {
          if (p.condition !== filters.equipmentCondition) return false;
        }
      }

      // 7. County Filter
      if (filters.selectedCounty !== 'all') {
        if (p.sellerCounty.toLowerCase() !== filters.selectedCounty.toLowerCase()) {
          return false;
        }
      }

      // 8. Max Price Filter
      if (p.priceKsh > filters.maxPrice) return false;

      // 9. Full Text Search
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesVariety = p.variety?.toLowerCase().includes(query);
        const matchesBreed = (p.breed || p.livestockDetails?.breed || '').toLowerCase().includes(query);
        const matchesSeller = p.sellerName.toLowerCase().includes(query);
        const matchesCounty = p.sellerCounty.toLowerCase().includes(query);
        const matchesSubcat = p.subcategory.toLowerCase().includes(query);
        const matchesType = (p.productType || '').toLowerCase().includes(query);
        const matchesModel = (p.model || '').toLowerCase().includes(query);
        const matchesBrand = (p.brand || '').toLowerCase().includes(query);

        if (
          !matchesTitle &&
          !matchesDesc &&
          !matchesVariety &&
          !matchesBreed &&
          !matchesSeller &&
          !matchesCounty &&
          !matchesSubcat &&
          !matchesType &&
          !matchesModel &&
          !matchesBrand
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.priceKsh - b.priceKsh;
      if (filters.sortBy === 'price_desc') return b.priceKsh - a.priceKsh;
      if (filters.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-stone-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>National Agricultural Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Buy & Sell Crops, Livestock & Farm Inputs
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-xl">
            Browse verified listings from Kenyan farmers and suppliers with dynamic product-type, variety, and livestock breed filters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsListingModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-black text-xs px-4 py-2.5 rounded-2xl transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Listing</span>
          </button>

          <div className="bg-stone-800/80 px-4 py-2.5 rounded-2xl border border-stone-700 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Catalog Volume</span>
            <span className="text-xl font-black text-emerald-400">
              {filteredProducts.length} Listings Available
            </span>
          </div>
        </div>
      </div>

      {/* Top Search & Fast County Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-5 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search maize variety, Friesian cow, seed brand, seller..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
              className="w-full text-stone-800 focus:outline-hidden"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => handleFilterChange({ searchQuery: '' })}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* County Selector */}
          <div className="sm:col-span-4 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              value={filters.selectedCounty}
              onChange={(e) => handleFilterChange({ selectedCounty: e.target.value })}
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

          {/* Sort By & Advanced Toggle */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-4 h-4 text-stone-500 shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="w-full bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Newly Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated Sellers</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedControls(!showAdvancedControls)}
              className={`p-2 rounded-xl border text-xs cursor-pointer transition flex items-center justify-center shrink-0 ${
                showAdvancedControls
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100'
              }`}
              title="Price Range & Advanced Options"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Price Slider */}
        {showAdvancedControls && (
          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-stone-50/70 p-3 rounded-xl border border-stone-200">
            <div className="w-full sm:w-80 space-y-1">
              <div className="flex justify-between font-semibold text-stone-700">
                <span>Maximum Price:</span>
                <span className="font-bold text-emerald-800">
                  {filters.maxPrice >= 2000000
                    ? 'No Limit'
                    : `KSh ${filters.maxPrice.toLocaleString()}`}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="2000000"
                step="5000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFilterChange({ maxPrice: 2000000 })}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-medium cursor-pointer"
              >
                Reset Price
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Filter Bar (Category Tabs, Product Types, Varieties, Breeds & Active Filter Badges) */}
      <MarketplaceFilterBar
        products={products}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredProducts.length}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 px-1">
        <span>
          Showing <strong className="text-stone-900">{filteredProducts.length}</strong> matching agricultural produce & livestock listings
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-3">
          <Store className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No products match your selected criteria</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try adjusting your variety or breed filters, selecting another Kenyan county, or resetting filters to view all listings.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-800 transition cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
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

      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Product Listing Modal */}
      <ProductListingModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        onProductCreated={(newProd) => {
          setToastNotice(`Listing "${newProd.title}" successfully published to Marketplace!`);
          setTimeout(() => setToastNotice(null), 4000);
        }}
      />
    </div>
  );
};
