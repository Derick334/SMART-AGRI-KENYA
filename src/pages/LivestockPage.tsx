import React, { useState, useMemo } from 'react';
import { 
  Beef, 
  Search, 
  MapPin, 
  Filter, 
  Scale, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Product, LivestockType } from '../types';
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

  const toggleCompare = (product: Product) => {
    if (comparedProducts.some(p => p.id === product.id)) {
      setComparedProducts(comparedProducts.filter(p => p.id !== product.id));
    } else {
      if (comparedProducts.length >= 3) {
        alert('You can compare a maximum of 3 animals simultaneously.');
        return;
      }
      setComparedProducts([...comparedProducts, product]);
    }
  };

  const removeCompared = (id: string) => {
    setComparedProducts(comparedProducts.filter(p => p.id !== id));
  };

  const filtered = useMemo(() => {
    return livestockProducts.filter((p) => {
      const details = p.livestockDetails;

      if (animalTypeFilter !== 'all' && details?.animalType !== animalTypeFilter) {
        // Handle group categories e.g. 'cattle'
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

      // Milk yield filter for dairy
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Livestock Hero Banner */}
      <div className="bg-linear-to-r from-amber-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-800/40 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Beef className="w-4 h-4" />
            <span>Dedicated Kenya Livestock & Breeding Marketplace</span>
          </div>

          {comparedProducts.length > 0 && (
            <button
              onClick={() => setShowComparisonModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>Compare {comparedProducts.length} Animals</span>
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Dairy Cattle, Beef Bulls, Poultry & Ruminants
        </h1>
        <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
          Search certified pedigree Friesians, Ayrshires, Jerseys, Boran bulls, improved Kienyeji chickens, and Toggenburg dairy goats with verifiable vaccination records, milk records, and specialized livestock transport.
        </p>

        {/* Animal Type Pills */}
        <div className="flex flex-wrap gap-2 mt-4 text-xs">
          <button
            onClick={() => setAnimalTypeFilter('all')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              animalTypeFilter === 'all'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            All Livestock ({livestockProducts.length})
          </button>
          <button
            onClick={() => setAnimalTypeFilter('cattle')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              animalTypeFilter === 'cattle'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            🐄 Cattle (Dairy & Beef)
          </button>
          <button
            onClick={() => setAnimalTypeFilter('chicken')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              animalTypeFilter === 'chicken'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            🐔 Poultry & Chickens
          </button>
          <button
            onClick={() => setAnimalTypeFilter('goat')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              animalTypeFilter === 'goat'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            🐐 Dairy & Meat Goats
          </button>
          <button
            onClick={() => setAnimalTypeFilter('sheep')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              animalTypeFilter === 'sheep'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            🐑 Dorper Sheep
          </button>
          <button
            onClick={() => setAnimalTypeFilter('pig')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              animalTypeFilter === 'pig'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            🐖 Breeding Pigs
          </button>
        </div>
      </div>

      {/* Advanced Livestock Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search text */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search breed, ear tag, farm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-stone-800 focus:outline-hidden"
            />
          </div>

          {/* Breed selection */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2">
            <span className="text-stone-400 font-semibold">Breed:</span>
            <select
              value={breedFilter}
              onChange={(e) => setBreedFilter(e.target.value)}
              className="w-full bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Breeds</option>
              {availableBreeds.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Purpose selection */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2">
            <span className="text-stone-400 font-semibold">Purpose:</span>
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="w-full bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
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

          {/* County selection */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full bg-transparent text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Counties</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dairy Yield Filter Slider */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-600">Minimum Daily Milk Yield:</span>
            <div className="flex items-center gap-2">
              {[0, 15, 20, 25, 30].map((liters) => (
                <button
                  key={liters}
                  onClick={() => setMinMilkYield(liters)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    minMilkYield === liters
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {liters === 0 ? 'Any' : `${liters}+ L/day`}
                </button>
              ))}
            </div>
          </div>

          <div className="text-stone-500 text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>All cattle accompanied by official KVB vaccination records</span>
          </div>
        </div>
      </div>

      {/* Livestock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
