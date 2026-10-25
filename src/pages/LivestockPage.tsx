import React, { useState, useMemo } from 'react';
import { 
  Beef, 
  Search, 
  MapPin, 
  Scale, 
  ShieldCheck,
  Plus,
  RotateCcw,
  CheckCircle2,
  X,
  ChevronRight,
  MessageSquare,
  Flag,
  PackageOpen
} from 'lucide-react';
import { Product } from '../types';
import { LivestockCard } from '../components/livestock/LivestockCard';
import { LivestockComparisonModal } from '../components/livestock/LivestockComparisonModal';
import { LivestockDetailModal } from '../components/livestock/LivestockDetailModal';
import { MarketplacePostModal } from '../components/marketplace/MarketplacePostModal';
import { ProductInquiryModal } from '../components/marketplace/ProductInquiryModal';
import { ProductReportModal } from '../components/marketplace/ProductReportModal';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface LivestockPageProps {
  products: Product[];
  onViewProduct?: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number, delivery?: 'pickup' | 'delivery') => void;
  userCounty?: string;
  onNavigateTab?: (tab: string) => void;
}

export const LivestockPage: React.FC<LivestockPageProps> = ({
  products,
  onViewProduct: propOnViewProduct,
  onAddToCart,
  userCounty = 'Nakuru',
  onNavigateTab,
}) => {
  const [search, setSearch] = useState('');
  const [animalTypeFilter, setAnimalTypeFilter] = useState<string>('all');
  const [breedFilter, setBreedFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [sexFilter, setSexFilter] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [minMilkYield, setMinMilkYield] = useState<number>(0);
  const [maxAgeMonths, setMaxAgeMonths] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Comparison State
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);

  // Modals state
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [reportProduct, setReportProduct] = useState<Product | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // STRICT FILTER: Only livestock listings!
  const livestockProducts = useMemo(() => {
    return products.filter(p => p.category === 'livestock');
  }, [products]);

  // Breeds list
  const availableBreeds = useMemo(() => {
    const breeds = new Set<string>();
    livestockProducts.forEach((p) => {
      if (p.livestockDetails?.breed) breeds.add(p.livestockDetails.breed);
      if (p.breed) breeds.add(p.breed);
    });
    return Array.from(breeds).sort();
  }, [livestockProducts]);

  const animalCategories = [
    { id: 'all', label: 'All Livestock' },
    { id: 'chicken', label: 'Poultry & Chickens' },
    { id: 'cattle', label: 'Dairy & Beef Cattle' },
    { id: 'goat', label: 'Dairy & Meat Goats' },
    { id: 'sheep', label: 'Dorper Sheep' },
    { id: 'pig', label: 'Breeding Pigs' },
    { id: 'rabbit', label: 'Pedigree Rabbits' },
    { id: 'fish', label: 'Fingerlings & Aquaculture' },
  ];

  const toggleCompare = (product: Product) => {
    if (comparedProducts.some(p => p.id === product.id)) {
      setComparedProducts(comparedProducts.filter(p => p.id !== product.id));
      setCompareNotice(null);
    } else {
      if (comparedProducts.length >= 3) {
        setCompareNotice('You can compare a maximum of 3 animals simultaneously.');
        setTimeout(() => setCompareNotice(null), 4000);
        return;
      }
      setComparedProducts([...comparedProducts, product]);
      setCompareNotice(null);
    }
  };

  const removeCompared = (id: string) => {
    setComparedProducts(comparedProducts.filter(p => p.id !== id));
  };

  const filtered = useMemo(() => {
    return livestockProducts.filter((p) => {
      const details = p.livestockDetails;

      if (animalTypeFilter !== 'all') {
        if (animalTypeFilter === 'cattle') {
          const cattleTypes = ['dairy_cow', 'beef_cattle', 'bull', 'heifer', 'calf', 'cattle'];
          if (!cattleTypes.includes(details?.animalType || '')) return false;
        } else if (animalTypeFilter === 'chicken') {
          const isChicken = details?.animalType === 'chicken' || 
                            p.productType?.toLowerCase().includes('chicken') || 
                            p.subcategory?.toLowerCase().includes('poultry');
          if (!isChicken) return false;
        } else if (details?.animalType !== animalTypeFilter) {
          return false;
        }
      }

      if (breedFilter !== 'all') {
        const matchesBreed = (details?.breed || p.breed || '').toLowerCase().includes(breedFilter.toLowerCase());
        if (!matchesBreed) return false;
      }

      if (purposeFilter !== 'all') {
        const matchesPurpose = (details?.purpose || p.cattlePurpose || '').toLowerCase().includes(purposeFilter.toLowerCase());
        if (!matchesPurpose) return false;
      }

      if (sexFilter !== 'all' && details?.sex !== sexFilter) {
        return false;
      }

      if (selectedCounty !== 'all' && p.sellerCounty.toLowerCase() !== selectedCounty.toLowerCase()) {
        return false;
      }

      if (minMilkYield > 0 && (details?.milkYieldLitersPerDay || 0) < minMilkYield) {
        return false;
      }

      // Max age filter in months (Formula: ageValue converted to months)
      if (maxAgeMonths !== undefined && details?.ageValue !== undefined) {
        let ageInMonths = details.ageValue;
        if (details.ageUnit === 'days') ageInMonths = details.ageValue / 30;
        else if (details.ageUnit === 'years') ageInMonths = details.ageValue * 12;

        if (ageInMonths > maxAgeMonths) return false;
      }

      if (minPrice && p.priceKsh < Number(minPrice)) return false;
      if (maxPrice && p.priceKsh > Number(maxPrice)) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (details?.breed && details.breed.toLowerCase().includes(q)) ||
          (details?.animalType && details.animalType.toLowerCase().includes(q)) ||
          (details?.earTagNumber && details.earTagNumber.toLowerCase().includes(q)) ||
          p.sellerCounty.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [livestockProducts, animalTypeFilter, breedFilter, purposeFilter, sexFilter, selectedCounty, minMilkYield, maxAgeMonths, minPrice, maxPrice, search]);

  const resetAllFilters = () => {
    setSearch('');
    setAnimalTypeFilter('all');
    setBreedFilter('all');
    setPurposeFilter('all');
    setSexFilter('all');
    setSelectedCounty('all');
    setMinMilkYield(0);
    setMaxAgeMonths(undefined);
    setMinPrice('');
    setMaxPrice('');
  };

  const isAnyFilterActive = 
    search !== '' ||
    animalTypeFilter !== 'all' ||
    breedFilter !== 'all' ||
    purposeFilter !== 'all' ||
    sexFilter !== 'all' ||
    selectedCounty !== 'all' ||
    minMilkYield > 0 ||
    maxAgeMonths !== undefined ||
    minPrice !== '' ||
    maxPrice !== '';

  const handleViewDetails = (animal: Product) => {
    if (propOnViewProduct) {
      propOnViewProduct(animal);
    } else {
      setModalProduct(animal);
    }
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

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#68756A]">
        <button
          onClick={() => onNavigateTab ? onNavigateTab('marketplace') : (window.location.hash = 'marketplace')}
          className="hover:text-[#214E34] font-medium transition cursor-pointer"
        >
          Marketplace
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#CFD7CA]" />
        <span className="text-[#214E34] font-bold">Livestock & Cattle</span>
      </div>

      {compareNotice && (
        <div className="p-3 bg-[#FCF8EE] border border-[#D6A545]/40 text-[#79543A] text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs">
          <span>{compareNotice}</span>
          <button onClick={() => setCompareNotice(null)} className="text-[#79543A] p-0.5 cursor-pointer">✕</button>
        </div>
      )}

      {/* Livestock Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EBF3ED] text-[#214E34] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#CFD7CA]">
              <Beef className="w-3.5 h-3.5 text-[#367C46]" />
              <span>Dedicated Pedigree Livestock Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
              Livestock, Cattle & Poultry Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
              Discover certified Friesians, Ayrshires, Jerseys, Boran bulls, improved KALRO Kienyeji chickens, Dorper sheep, Boer goats, breeding pigs, rabbits & fingerlings with verified KVB veterinary vaccinations and health records.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {comparedProducts.length > 0 && (
              <button
                onClick={() => setShowComparisonModal(true)}
                className="bg-[#214E34] hover:bg-[#183C27] text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Scale className="w-3.5 h-3.5 text-[#D6A545]" />
                <span>Compare ({comparedProducts.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSellModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List Livestock</span>
            </button>
          </div>
        </div>

        {/* Animal Type Segmented Controls */}
        <div className="mt-5 pt-4 border-t border-[#E2E7DE] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {animalCategories.map((cat) => {
            const isSelected = animalTypeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setAnimalTypeFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#367C46] text-white border-[#367C46] shadow-xs'
                    : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7DE] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#68756A] shrink-0" />
            <input
              type="text"
              placeholder="Search Kienyeji, Friesian, breed, county..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[#252D27] placeholder:text-[#68756A] focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#68756A]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Breed */}
          <div className="flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <span className="text-[#68756A] font-semibold">Breed:</span>
            <select
              value={breedFilter}
              onChange={(e) => setBreedFilter(e.target.value)}
              className="w-full bg-transparent text-[#252D27] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Breeds</option>
              {availableBreeds.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div className="flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <span className="text-[#68756A] font-semibold">Purpose:</span>
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="w-full bg-transparent text-[#252D27] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">Any Purpose</option>
              <option value="milk">Dairy / Milk</option>
              <option value="beef">Beef Production</option>
              <option value="breeding">Breeding & Sire</option>
              <option value="eggs">Egg Laying</option>
              <option value="meat">Meat / Table</option>
              <option value="dual_purpose">Dual-Purpose</option>
            </select>
          </div>

          {/* County */}
          <div className="flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
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
        </div>

        {/* Age & Dairy Yield Filters */}
        <div className="pt-2 border-t border-[#E2E7DE] flex flex-wrap items-center justify-between text-xs gap-3">
          {/* Max Age selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#68756A]">Maximum Age:</span>
            <div className="flex items-center gap-1.5">
              {[
                { label: 'Any Age', value: undefined },
                { label: '≤ 3 Mo', value: 3 },
                { label: '≤ 6 Mo', value: 6 },
                { label: '≤ 1 Yr', value: 12 },
                { label: '≤ 2 Yrs', value: 24 },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setMaxAgeMonths(item.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                    maxAgeMonths === item.value
                      ? 'bg-[#367C46] text-white border-[#367C46]'
                      : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#68756A]">Min Milk:</span>
            <div className="flex items-center gap-1.5">
              {[0, 15, 20, 25].map((liters) => (
                <button
                  key={liters}
                  type="button"
                  onClick={() => setMinMilkYield(liters)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                    minMilkYield === liters
                      ? 'bg-[#367C46] text-white border-[#367C46]'
                      : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
                  }`}
                >
                  {liters === 0 ? 'Any' : `${liters}+ L/d`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#68756A]">Sex:</span>
            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
              className="bg-[#F7F6F0] border border-[#E2E7DE] rounded px-2 py-1 text-xs"
            >
              <option value="all">Any Sex</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="mixed_batch">Mixed Batch / Flock</option>
            </select>
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

      {/* Livestock Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-[#68756A] font-medium">
            Showing <strong className="text-[#214E34] tabular-nums">{filtered.length}</strong> livestock records
          </span>
          <span className="text-xs text-[#68756A]">
            Official KVB veterinary vaccination certificates checked
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((animal) => (
              <div key={animal.id} className="flex flex-col justify-between">
                <LivestockCard
                  product={animal}
                  onViewDetails={handleViewDetails}
                  onAddToCart={(p) => onAddToCart(p, 1, 'delivery')}
                  onToggleCompare={toggleCompare}
                  isCompared={comparedProducts.some(p => p.id === animal.id)}
                />

                {/* Quick Inquire & Report action row */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#68756A] px-1">
                  <button
                    type="button"
                    onClick={() => setInquiryProduct(animal)}
                    className="hover:text-[#367C46] flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 text-[#367C46]" />
                    <span>Send Inquiry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportProduct(animal)}
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
          <div className="bg-white rounded-xl border border-[#E2E7DE] p-8 sm:p-10 text-center max-w-xl mx-auto shadow-xs my-6">
            <div className="w-12 h-12 rounded-lg bg-[#FCF8EE] text-[#D6A545] mx-auto flex items-center justify-center mb-3 border border-[#E2E7DE]">
              <PackageOpen className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-bold text-[#214E34] mb-1.5">
              No livestock found matching your filters
            </h3>
            <p className="text-[#68756A] text-xs sm:text-sm mb-5 max-w-md mx-auto">
              We couldn't find any livestock listings matching your specific criteria. Try broadening the maximum age or clearing breed and county filters.
            </p>
            <div className="flex justify-center gap-2.5">
              <button
                type="button"
                onClick={resetAllFilters}
                className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Livestock Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {showComparisonModal && (
        <LivestockComparisonModal
          products={comparedProducts}
          onClose={() => setShowComparisonModal(false)}
          onRemove={removeCompared}
          onAddToCart={onAddToCart}
        />
      )}

      {/* Detail Modal */}
      {modalProduct && (
        <LivestockDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={(p, qty, delivery) => {
            onAddToCart(p, qty, delivery);
            setModalProduct(null);
          }}
          userCounty={userCounty}
        />
      )}

      {/* Multi-step Posting Modal */}
      <MarketplacePostModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        defaultCounty={userCounty}
        onSuccess={(product) => {
          setSuccessNotice(`"${product.title}" listed successfully in Livestock!`);
          setTimeout(() => setSuccessNotice(null), 5000);
        }}
      />

      {/* Inquiry Modal */}
      <ProductInquiryModal
        product={inquiryProduct}
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        onSuccess={() => {
          setSuccessNotice('Inquiry submitted to breeder.');
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
