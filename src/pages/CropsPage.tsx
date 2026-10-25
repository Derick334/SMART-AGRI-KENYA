import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Search, 
  MapPin, 
  RotateCcw, 
  Plus, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  ChevronLeft,
  PackageOpen, 
  ShieldCheck, 
  MessageSquare, 
  Flag,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { ProductDetailModal } from '../components/marketplace/ProductDetailModal';
import { MarketplacePostModal } from '../components/marketplace/MarketplacePostModal';
import { ProductInquiryModal } from '../components/marketplace/ProductInquiryModal';
import { ProductReportModal } from '../components/marketplace/ProductReportModal';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface CropsPageProps {
  products: Product[];
  onViewProduct?: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number, delivery?: 'pickup' | 'delivery') => void;
  userCounty?: string;
  onNavigateTab?: (tab: string) => void;
}

// Canonical Crop Sections defined in the master prompt
interface CropGroupConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  targetProductTypes: string[];
}

const CROP_GROUPS: CropGroupConfig[] = [
  {
    id: 'beans',
    name: 'Beans & Pulses',
    icon: '🌱',
    description: 'Rosecoco, Nyayo, Wairimu, Red Kidney, Mwezi Moja, Chelalang & Green Grams varieties',
    targetProductTypes: ['beans', 'pulses & legumes', 'green grams'],
  },
  {
    id: 'maize',
    name: 'Maize & Corn',
    icon: '🌽',
    description: 'Dry White Maize H614, H6213, Yellow Flint Maize & SC Duma 43 varieties',
    targetProductTypes: ['maize', 'corn', 'cereals & grains'],
  },
  {
    id: 'potatoes',
    name: 'Irish Potatoes',
    icon: '🥔',
    description: 'Shangi, Tigoni, Dutch Robijn & processing tuber varieties',
    targetProductTypes: ['potatoes', 'roots & tubers', 'potato'],
  },
  {
    id: 'tomatoes',
    name: 'Fresh Tomatoes',
    icon: '🍅',
    description: 'Greenhouse Anna F1, Open-Field Kilele F1 & Rambo F1 varieties',
    targetProductTypes: ['tomatoes', 'tomato'],
  },
  {
    id: 'rice',
    name: 'Rice Varieties',
    icon: '🌾',
    description: 'Pure Mwea Aromatic Pishori (Basmati 370) & Komboka high-yield rice',
    targetProductTypes: ['rice'],
  },
  {
    id: 'wheat',
    name: 'Bread Milling Wheat',
    icon: '🌾',
    description: 'Grade 1 Narok Eagle 10 hard red spring bread milling wheat',
    targetProductTypes: ['wheat'],
  },
  {
    id: 'onions',
    name: 'Bulb Onions',
    icon: '🧅',
    description: 'Pungent cured Red Bombay & Red Creole storage onions',
    targetProductTypes: ['onions', 'onion'],
  },
  {
    id: 'vegetables',
    name: 'Vegetables & Greens',
    icon: '🥬',
    description: 'Highland Sukuma Wiki (collard greens), Gloria F1 cabbages & spinach',
    targetProductTypes: ['vegetables & greens', 'vegetables', 'cabbage', 'sukuma wiki', 'horticulture & vegetables'],
  },
  {
    id: 'fruits',
    name: 'Fruits & Orchard Produce',
    icon: '🥑',
    description: 'Export Grade Hass avocados, sweet Machakos Apple mangoes & bananas',
    targetProductTypes: ['fruits', 'fruits & nuts', 'avocado', 'mango'],
  },
  {
    id: 'other',
    name: 'Fodder & Other Crops',
    icon: '🌿',
    description: 'Boma Rhodes baled hay, silage, sorghum & alternative crops',
    targetProductTypes: ['other crops', 'livestock fodder & silage', 'hay', 'fodder'],
  },
];

export const CropsPage: React.FC<CropsPageProps> = ({
  products,
  onViewProduct: propOnViewProduct,
  onAddToCart,
  userCounty = 'Nakuru',
  onNavigateTab,
}) => {
  // Global Filters
  const [search, setSearch] = useState('');
  const [selectedCropGroup, setSelectedCropGroup] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedVariety, setSelectedVariety] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'quantity'>('newest');

  // In-Section Variety Filter override: { [cropGroupId]: selectedVariety }
  const [sectionVarietyFilter, setSectionVarietyFilter] = useState<Record<string, string>>({});

  // Section comparison strip toggles: { [cropGroupId]: boolean }
  const [showComparisonTable, setShowComparisonTable] = useState<Record<string, boolean>>({});

  // Modals state
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [reportProduct, setReportProduct] = useState<Product | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // STRICT FILTER: Only crops & produce listings!
  const allCropProducts = useMemo(() => {
    return products.filter(p => p.category === 'crops');
  }, [products]);

  // Extract all unique crop varieties across the dataset
  const allAvailableVarieties = useMemo(() => {
    const set = new Set<string>();
    allCropProducts.forEach(p => {
      if (p.variety) set.add(p.variety);
    });
    return Array.from(set).sort();
  }, [allCropProducts]);

  // Determine which crop group a product belongs to
  const matchCropGroup = (product: Product): string => {
    const pType = (product.productType || '').toLowerCase();
    const pSub = (product.subcategory || '').toLowerCase();
    const pTitle = product.title.toLowerCase();

    for (const group of CROP_GROUPS) {
      if (group.id === 'other') continue;
      for (const target of group.targetProductTypes) {
        if (pType.includes(target) || pSub.includes(target) || pTitle.includes(target)) {
          return group.id;
        }
      }
    }
    return 'other';
  };

  // Grouped Crop Products with filtering applied
  const groupedCrops = useMemo(() => {
    // 1. Filter products by search, county, grade, global variety, and price
    const filtered = allCropProducts.filter((p) => {
      if (selectedCounty !== 'all' && p.sellerCounty.toLowerCase() !== selectedCounty.toLowerCase()) {
        return false;
      }
      if (selectedGrade !== 'all' && (p.qualityGrade || 'Grade 1') !== selectedGrade) {
        return false;
      }
      if (selectedVariety !== 'all' && p.variety !== selectedVariety) {
        return false;
      }
      if (minPrice && p.priceKsh < Number(minPrice)) {
        return false;
      }
      if (maxPrice && p.priceKsh > Number(maxPrice)) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = 
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.variety && p.variety.toLowerCase().includes(q)) ||
          (p.productType && p.productType.toLowerCase().includes(q)) ||
          p.sellerCounty.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    // 2. Sort results
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.priceKsh - b.priceKsh);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.priceKsh - a.priceKsh);
    } else if (sortBy === 'quantity') {
      filtered.sort((a, b) => b.quantityAvailable - a.quantityAvailable);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    // 3. Partition into crop groups
    const groups: {
      config: CropGroupConfig;
      products: Product[];
      varieties: string[];
      minPrice: number;
      maxPrice: number;
      unit: string;
    }[] = [];

    CROP_GROUPS.forEach((config) => {
      if (selectedCropGroup !== 'all' && selectedCropGroup !== config.id) {
        return;
      }

      let cropListings = filtered.filter(p => matchCropGroup(p) === config.id);

      // Section-level variety filter if set by user within this section
      const activeVariety = sectionVarietyFilter[config.id];
      if (activeVariety && activeVariety !== 'all') {
        cropListings = cropListings.filter(p => p.variety === activeVariety);
      }

      // Collect all distinct varieties in this crop group
      const varietiesSet = new Set<string>();
      allCropProducts
        .filter(p => matchCropGroup(p) === config.id)
        .forEach(p => {
          if (p.variety) varietiesSet.add(p.variety);
        });

      if (cropListings.length > 0 || (selectedCropGroup === config.id && search === '')) {
        const prices = cropListings.map(p => p.priceKsh);
        const minP = prices.length > 0 ? Math.min(...prices) : 0;
        const maxP = prices.length > 0 ? Math.max(...prices) : 0;
        const unit = cropListings[0]?.unit || 'unit';

        groups.push({
          config,
          products: cropListings,
          varieties: Array.from(varietiesSet).sort(),
          minPrice: minP,
          maxPrice: maxP,
          unit,
        });
      }
    });

    return groups;
  }, [
    allCropProducts,
    selectedCropGroup,
    selectedCounty,
    selectedGrade,
    selectedVariety,
    minPrice,
    maxPrice,
    search,
    sortBy,
    sectionVarietyFilter,
  ]);

  const totalFilteredCount = useMemo(() => {
    return groupedCrops.reduce((acc, g) => acc + g.products.length, 0);
  }, [groupedCrops]);

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCropGroup('all');
    setSelectedCounty('all');
    setSelectedGrade('all');
    setSelectedVariety('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSectionVarietyFilter({});
  };

  const isAnyFilterActive = 
    search !== '' || 
    selectedCropGroup !== 'all' || 
    selectedCounty !== 'all' || 
    selectedGrade !== 'all' || 
    selectedVariety !== 'all' || 
    minPrice !== '' || 
    maxPrice !== '' ||
    Object.values(sectionVarietyFilter).some(v => v !== 'all');

  const handleViewProductDetails = (product: Product) => {
    if (propOnViewProduct) {
      propOnViewProduct(product);
    } else {
      setModalProduct(product);
    }
  };

  const handleSetSectionVariety = (cropGroupId: string, variety: string) => {
    setSectionVarietyFilter(prev => ({
      ...prev,
      [cropGroupId]: variety,
    }));
  };

  const toggleComparison = (cropGroupId: string) => {
    setShowComparisonTable(prev => ({
      ...prev,
      [cropGroupId]: !prev[cropGroupId],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[75vh] space-y-6">
      
      {/* Success notification banner */}
      {successNotice && (
        <div className="bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] rounded-lg p-3.5 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#367C46]" />
            <p className="text-xs sm:text-sm font-semibold">{successNotice}</p>
          </div>
          <button 
            onClick={() => setSuccessNotice(null)}
            className="text-[#214E34] hover:bg-[#DCECE0] rounded p-1 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation & Hub Switcher */}
      <div className="flex items-center justify-between text-xs text-[#68756A]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab ? onNavigateTab('marketplace') : (window.location.hash = 'marketplace')}
            className="hover:text-[#214E34] font-medium transition cursor-pointer"
          >
            Marketplace Hub
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#CFD7CA]" />
          <span className="text-[#214E34] font-bold">Crops & Produce Varieties</span>
        </div>

        {/* Quick jump to other dedicated marketplaces */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="text-[#68756A]">Switch Marketplace:</span>
          <button
            onClick={() => onNavigateTab ? onNavigateTab('livestock') : (window.location.hash = 'livestock')}
            className="text-[#367C46] hover:underline font-semibold cursor-pointer"
          >
            Livestock & Cattle →
          </button>
          <button
            onClick={() => onNavigateTab ? onNavigateTab('inputs') : (window.location.hash = 'inputs')}
            className="text-[#367C46] hover:underline font-semibold cursor-pointer"
          >
            Farm Inputs & Tools →
          </button>
          <button
            onClick={() => onNavigateTab ? onNavigateTab('market-prices') : (window.location.hash = 'market-prices')}
            className="text-[#367C46] hover:underline font-semibold cursor-pointer"
          >
            Market Prices →
          </button>
        </div>
      </div>

      {/* Dedicated Crops Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EBF3ED] text-[#214E34] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#CFD7CA]">
              <Sprout className="w-3.5 h-3.5 text-[#367C46]" />
              <span>Dedicated Agricultural Produce Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
              Crops & Produce Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
              All varieties of the same crop grouped together in dedicated sections. Browse Rosecoco, Nyayo, and Wairimu beans; H614 and H6213 maize; Shangi and Tigoni potatoes; Anna F1 and Kilele F1 tomatoes side-by-side with price comparisons.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsSellModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List Crop for Sale</span>
            </button>
          </div>
        </div>

        {/* Quick Crop Jump Pills */}
        <div className="mt-5 pt-4 border-t border-[#E2E7DE] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCropGroup('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCropGroup === 'all'
                ? 'bg-[#367C46] text-white border-[#367C46] shadow-xs'
                : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
            }`}
          >
            All Crops ({allCropProducts.length})
          </button>
          {CROP_GROUPS.map((grp) => {
            const count = allCropProducts.filter(p => matchCropGroup(p) === grp.id).length;
            const isSelected = selectedCropGroup === grp.id;
            return (
              <button
                key={grp.id}
                onClick={() => setSelectedCropGroup(grp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#367C46] text-white border-[#367C46] shadow-xs'
                    : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
                }`}
              >
                <span>{grp.icon}</span>
                <span>{grp.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#E2E7DE] text-[#214E34]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Crop Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7DE] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search */}
          <div className="sm:col-span-4 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#68756A] shrink-0" />
            <input
              type="text"
              placeholder="Search variety (Rosecoco, Shangi, Anna F1, H614), seller, county..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[#252D27] placeholder:text-[#68756A] focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#68756A] hover:text-[#252D27]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* County Location */}
          <div className="sm:col-span-3 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <MapPin className="w-4 h-4 text-[#367C46] shrink-0" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full bg-transparent text-[#252D27] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All 47 Counties</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>{c.name} County</option>
              ))}
            </select>
          </div>

          {/* Global Variety Filter */}
          <div className="sm:col-span-3 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <span className="text-[#68756A] font-semibold">Variety:</span>
            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="w-full bg-transparent text-[#252D27] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Available Varieties</option>
              {allAvailableVarieties.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="sm:col-span-2 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-transparent text-[#252D27] focus:outline-none cursor-pointer font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="quantity">Stock Available</option>
            </select>
          </div>
        </div>

        {/* Secondary Row: Quality Grade & Price Range */}
        <div className="pt-2 border-t border-[#E2E7DE] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#68756A] font-semibold">Quality Grade:</span>
              {['all', 'Grade 1', 'Grade 2', 'Organic', 'Export'].map((gr) => (
                <button
                  key={gr}
                  type="button"
                  onClick={() => setSelectedGrade(gr)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                    selectedGrade === gr
                      ? 'bg-[#367C46] text-white border-[#367C46]'
                      : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
                  }`}
                >
                  {gr === 'all' ? 'All Grades' : gr}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#68756A] font-semibold">Price (KSh):</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-16 bg-[#F7F6F0] border border-[#E2E7DE] rounded px-2 py-1 text-xs"
              />
              <span className="text-[#68756A]">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-16 bg-[#F7F6F0] border border-[#E2E7DE] rounded px-2 py-1 text-xs"
              />
            </div>
          </div>

          {isAnyFilterActive && (
            <button
              onClick={resetAllFilters}
              className="text-[#367C46] hover:underline flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* GROUPED CROP SECTIONS — All varieties of the same crop grouped together */}
      <div className="space-y-10">
        {groupedCrops.length > 0 ? (
          groupedCrops.map(({ config, products: groupProducts, varieties, minPrice: gMinPrice, maxPrice: gMaxPrice, unit: gUnit }) => {
            const activeSectionVariety = sectionVarietyFilter[config.id] || 'all';
            const isComparing = showComparisonTable[config.id] || false;

            return (
              <section 
                key={config.id} 
                id={`crop-section-${config.id}`}
                className="bg-white rounded-2xl border border-[#E2E7DE] shadow-xs overflow-hidden"
              >
                {/* Section Header */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-white via-[#F7F6F0] to-[#EBF3ED] border-b border-[#E2E7DE]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{config.icon}</span>
                        <h2 className="text-lg sm:text-xl font-bold text-[#214E34]">
                          {config.name}
                        </h2>
                        <span className="text-xs bg-[#367C46] text-white font-bold px-2 py-0.5 rounded-full">
                          {varieties.length} {varieties.length === 1 ? 'Variety' : 'Varieties'} ({groupProducts.length} listings)
                        </span>
                      </div>
                      <p className="text-xs text-[#68756A] mt-1">
                        {config.description}
                      </p>
                    </div>

                    {/* Price Range & Quick Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      {groupProducts.length > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider text-[#68756A] font-bold block">
                            Price Range
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-[#214E34] tabular-nums">
                            KSh {gMinPrice.toLocaleString()} {gMinPrice !== gMaxPrice && `– ${gMaxPrice.toLocaleString()}`} <span className="text-xs font-normal text-[#68756A]">/ {gUnit}</span>
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleComparison(config.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                          isComparing 
                            ? 'bg-[#214E34] text-white border-[#214E34]' 
                            : 'bg-white hover:bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE]'
                        }`}
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-[#D6A545]" />
                        <span>{isComparing ? 'Close Variety Comparison' : 'Compare Varieties'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Variety Pills within this crop section */}
                  {varieties.length > 1 && (
                    <div className="mt-4 pt-3 border-t border-[#E2E7DE] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      <span className="text-[11px] font-bold text-[#68756A] uppercase tracking-wider mr-1 shrink-0">
                        Select Variety:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSetSectionVariety(config.id, 'all')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                          activeSectionVariety === 'all'
                            ? 'bg-[#367C46] text-white border-[#367C46] shadow-xs'
                            : 'bg-white text-[#252D27] border-[#E2E7DE] hover:bg-[#F7F6F0]'
                        }`}
                      >
                        All Varieties ({varieties.length})
                      </button>
                      {varieties.map((v) => {
                        const countForVariety = allCropProducts.filter(p => matchCropGroup(p) === config.id && p.variety === v).length;
                        const isVActive = activeSectionVariety === v;
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => handleSetSectionVariety(config.id, v)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                              isVActive
                                ? 'bg-[#367C46] text-white border-[#367C46] shadow-xs'
                                : 'bg-white text-[#252D27] border-[#E2E7DE] hover:bg-[#F7F6F0]'
                            }`}
                          >
                            <span>{v}</span>
                            <span className={`ml-1 text-[10px] ${isVActive ? 'text-white/80' : 'text-[#68756A]'}`}>
                              ({countForVariety})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Inline Comparison Table (when toggled) */}
                {isComparing && (
                  <div className="bg-[#FAF9F5] p-4 border-b border-[#E2E7DE] overflow-x-auto">
                    <h3 className="text-xs font-bold text-[#214E34] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#367C46]" />
                      <span>{config.name} Variety Price & Specifications Comparison</span>
                    </h3>
                    <table className="w-full text-left text-xs bg-white rounded-lg border border-[#E2E7DE] overflow-hidden">
                      <thead className="bg-[#F7F6F0] text-[#68756A] border-b border-[#E2E7DE] font-semibold">
                        <tr>
                          <th className="p-2.5">Variety</th>
                          <th className="p-2.5">Listing Title</th>
                          <th className="p-2.5">Asking Price</th>
                          <th className="p-2.5">Quality Grade</th>
                          <th className="p-2.5">Available Stock</th>
                          <th className="p-2.5">County Location</th>
                          <th className="p-2.5">Producer</th>
                          <th className="p-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E7DE]">
                        {groupProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#F7F6F0] transition-colors">
                            <td className="p-2.5 font-bold text-[#214E34] whitespace-nowrap">
                              {p.variety || 'Standard'}
                            </td>
                            <td className="p-2.5 text-[#252D27] font-medium max-w-[200px] truncate">
                              {p.title}
                            </td>
                            <td className="p-2.5 font-extrabold text-[#367C46] tabular-nums whitespace-nowrap">
                              KSh {p.priceKsh.toLocaleString()} <span className="text-[10px] font-normal text-[#68756A]">/{p.unit}</span>
                            </td>
                            <td className="p-2.5 whitespace-nowrap">
                              <span className="bg-[#EBF3ED] text-[#214E34] text-[10px] font-semibold px-2 py-0.5 rounded">
                                {p.qualityGrade || 'Grade 1'}
                              </span>
                            </td>
                            <td className="p-2.5 tabular-nums text-[#252D27]">
                              {p.quantityAvailable} {p.unit}
                            </td>
                            <td className="p-2.5 text-[#68756A] whitespace-nowrap">
                              {p.sellerCounty}
                            </td>
                            <td className="p-2.5 text-[#252D27] font-medium whitespace-nowrap">
                              {p.sellerName}
                            </td>
                            <td className="p-2.5 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleViewProductDetails(p)}
                                className="text-xs text-[#367C46] hover:underline font-bold cursor-pointer"
                              >
                                View →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Varieties Responsive Grid / Horizontal Scroll */}
                <div className="p-5 sm:p-6">
                  {groupProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {groupProducts.map((product) => (
                        <div key={product.id} className="flex flex-col justify-between">
                          <ProductCard
                            product={product}
                            onViewDetails={handleViewProductDetails}
                            onAddToCart={(p) => onAddToCart(p, 1, 'delivery')}
                            onContactSeller={(p) => setInquiryProduct(p)}
                          />

                          {/* Quick Inquire & Report action row */}
                          <div className="mt-2 flex items-center justify-between text-[11px] text-[#68756A] px-1">
                            <button
                              type="button"
                              onClick={() => setInquiryProduct(product)}
                              className="hover:text-[#367C46] flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3 text-[#367C46]" />
                              <span>Inquire with Seller</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setReportProduct(product)}
                              className="hover:text-red-600 flex items-center gap-1 text-[10px] cursor-pointer"
                            >
                              <Flag className="w-2.5 h-2.5" />
                              <span>Report</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-[#68756A] bg-[#F7F6F0] rounded-xl border border-dashed border-[#CFD7CA]">
                      <p className="font-semibold text-[#214E34]">
                        No listings currently available for {activeSectionVariety !== 'all' ? activeSectionVariety : config.name} matching your active filters.
                      </p>
                      <p className="mt-1">
                        Are you a producer of {config.name}? List your harvest on the SMART-AGRI Kenya marketplace.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSellModalOpen(true)}
                        className="mt-3 inline-flex items-center gap-1.5 bg-[#367C46] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#2B6437] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>List {config.name} for Sale</span>
                      </button>
                    </div>
                  )}
                </div>
              </section>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E7DE] p-8 sm:p-10 text-center max-w-xl mx-auto shadow-xs my-6">
            <div className="w-12 h-12 rounded-lg bg-[#FCF8EE] text-[#D6A545] mx-auto flex items-center justify-center mb-3 border border-[#E2E7DE]">
              <PackageOpen className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-bold text-[#214E34] mb-1.5">
              No crop produce found matching your filters
            </h3>
            <p className="text-[#68756A] text-xs sm:text-sm mb-5 max-w-md mx-auto">
              We couldn't find any crop varieties matching your search or filters. Try adjusting your county or resetting filters.
            </p>
            <div className="flex justify-center gap-2.5">
              <button
                type="button"
                onClick={resetAllFilters}
                className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Crop Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Internal Product Detail Modal */}
      {modalProduct && !propOnViewProduct && (
        <ProductDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={(p, qty, delivery) => {
            onAddToCart(p, qty, delivery);
            setModalProduct(null);
          }}
          userCounty={userCounty}
          onInquire={(p) => {
            setModalProduct(null);
            setInquiryProduct(p);
          }}
          onReport={(p) => {
            setModalProduct(null);
            setReportProduct(p);
          }}
        />
      )}

      {/* Multi-step Crop Posting Modal */}
      <MarketplacePostModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        defaultCounty={userCounty}
        onSuccess={(product) => {
          setSuccessNotice(`"${product.title}" listed successfully in Crops & Produce!`);
          setTimeout(() => setSuccessNotice(null), 5000);
        }}
      />

      {/* Inquiry Modal */}
      <ProductInquiryModal
        product={inquiryProduct}
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        onSuccess={() => {
          setSuccessNotice('Inquiry submitted to producer.');
          setTimeout(() => setSuccessNotice(null), 4000);
        }}
      />

      {/* Report Modal */}
      <ProductReportModal
        product={reportProduct}
        isOpen={!!reportProduct}
        onClose={() => setReportProduct(null)}
      />
    </div>
  );
};
