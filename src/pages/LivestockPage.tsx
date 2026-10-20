import React, { useState, useMemo } from 'react';
import { 
  Beef, 
  Search, 
  MapPin, 
  Scale, 
  ShieldCheck 
} from 'lucide-react';
import { Product } from '../types';
import { LivestockCard } from '../components/livestock/LivestockCard';
import { LivestockComparisonModal } from '../components/livestock/LivestockComparisonModal';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface LivestockPageProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const LivestockPage: React.FC<LivestockPageProps> = ({
  products,
  onViewProduct,
  onAddToCart,
}) => {
  const [search, setSearch] = useState('');
  const [animalTypeFilter, setAnimalTypeFilter] = useState<string>('all');
  const [breedFilter, setBreedFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [minMilkYield, setMinMilkYield] = useState<number>(0);

  // Comparison State
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);

  const livestockProducts = useMemo(() => {
    return products.filter(p => p.category === 'livestock');
  }, [products]);

  // Breeds list
  const availableBreeds = useMemo(() => {
    const breeds = new Set<string>();
    livestockProducts.forEach((p) => {
      if (p.livestockDetails?.breed) breeds.add(p.livestockDetails.breed);
    });
    return Array.from(breeds);
  }, [livestockProducts]);

  const animalCategories = [
    { id: 'all', label: 'All Livestock' },
    { id: 'cattle', label: 'Dairy & Beef Cattle' },
    { id: 'chicken', label: 'Poultry & Chickens' },
    { id: 'goat', label: 'Dairy & Meat Goats' },
    { id: 'sheep', label: 'Dorper Sheep' },
    { id: 'pig', label: 'Breeding Pigs' },
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

      if (animalTypeFilter !== 'all' && details?.animalType !== animalTypeFilter) {
        if (animalTypeFilter === 'cattle') {
          const cattleTypes = ['dairy_cow', 'beef_cattle', 'bull', 'heifer', 'calf'];
          if (!cattleTypes.includes(details?.animalType || '')) return false;
        } else {
          return false;
        }
      }

      if (breedFilter !== 'all' && details?.breed !== breedFilter) return false;
      if (purposeFilter !== 'all' && details?.purpose !== purposeFilter) return false;
      if (selectedCounty !== 'all' && p.sellerCounty.toLowerCase() !== selectedCounty.toLowerCase()) return false;

      if (minMilkYield > 0 && (details?.milkYieldLitersPerDay || 0) < minMilkYield) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) ||
               p.description.toLowerCase().includes(q) ||
               details?.breed.toLowerCase().includes(q) ||
               details?.animalType.toLowerCase().includes(q) ||
               details?.earTagNumber?.toLowerCase().includes(q);
      }

      return true;
    });
  }, [livestockProducts, animalTypeFilter, breedFilter, purposeFilter, selectedCounty, minMilkYield, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {compareNotice && (
        <div className="p-3 bg-[#FCF8EE] border border-[#D6A545]/40 text-[#79543A] text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs">
          <span>{compareNotice}</span>
          <button onClick={() => setCompareNotice(null)} className="text-[#79543A] p-0.5 cursor-pointer">✕</button>
        </div>
      )}

      {/* Livestock Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider">
            <Beef className="w-4 h-4 text-[#79543A]" />
            <span>Kenyan Livestock & Pedigree Breeding</span>
          </div>

          {comparedProducts.length > 0 && (
            <button
              onClick={() => setShowComparisonModal(true)}
              className="bg-[#214E34] hover:bg-[#183C27] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-[#D6A545]" />
              <span>Compare ({comparedProducts.length})</span>
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
          Dairy Cattle, Beef Bulls, Poultry & Small Ruminants
        </h1>
        <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
          Certified Friesians, Ayrshires, Jerseys, Boran bulls, improved Kienyeji chickens, and Toggenburg goats with verified KVB veterinary vaccinations, milk production records, and specialized livestock transport.
        </p>

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

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7DE] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#68756A] shrink-0" />
            <input
              type="text"
              placeholder="Search breed, ear tag, farm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[#252D27] placeholder:text-[#68756A] focus:outline-none"
            />
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
              <option value="milk">Milk Production</option>
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
              <option value="all">All Counties</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>{c.name} County</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dairy Yield Filter */}
        <div className="pt-2 border-t border-[#E2E7DE] flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#68756A]">Minimum Milk Yield:</span>
            <div className="flex items-center gap-1.5">
              {[0, 15, 20, 25, 30].map((liters) => (
                <button
                  key={liters}
                  onClick={() => setMinMilkYield(liters)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                    minMilkYield === liters
                      ? 'bg-[#367C46] text-white border-[#367C46]'
                      : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
                  }`}
                >
                  {liters === 0 ? 'Any' : `${liters}+ L/day`}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[#68756A] text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#367C46]" />
            <span>All cattle accompanied by official KVB vaccination records</span>
          </div>
        </div>
      </div>

      {/* Livestock Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-[#68756A] font-medium">
            Showing <strong className="text-[#214E34] tabular-nums">{filtered.length}</strong> livestock listings
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((animal) => (
              <LivestockCard
                key={animal.id}
                product={animal}
                onViewDetails={onViewProduct}
                onAddToCart={onAddToCart}
                onToggleCompare={toggleCompare}
                isCompared={comparedProducts.some(p => p.id === animal.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E7DE] p-8 text-center max-w-md mx-auto">
            <p className="text-xs sm:text-sm text-[#68756A]">
              No livestock records found matching your filters. Try clearing the breed or county filter.
            </p>
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
    </div>
  );
};
