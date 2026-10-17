import React, { useMemo } from 'react';
import { 
  Store, 
  Sprout, 
  Beef, 
  Package, 
  Wrench, 
  RotateCcw, 
  X, 
  ChevronRight,
  Filter,
  Check,
  Tag,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Product } from '../../types';

export type MainCategory = 'all' | 'crops' | 'livestock' | 'inputs' | 'equipment';

export interface FilterState {
  category: MainCategory;
  // Crops filters
  cropProductType: string;
  cropVariety: string;
  // Livestock filters
  livestockAnimalType: string;
  livestockBreed: string;
  livestockCattlePurpose: string;
  // Inputs filters
  inputProductType: string;
  inputFormulation: string;
  inputPackageSize: string;
  inputCertification: string;
  // Equipment filters
  equipmentProductType: string;
  equipmentPowerSource: string;
  equipmentCondition: string;
  // General filters
  searchQuery: string;
  selectedCounty: string;
  maxPrice: number;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'rating';
}

interface MarketplaceFilterBarProps {
  products: Product[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

// Preset definitions conforming to the project prompt specifications
export const CROPS_PRODUCT_TYPES = [
  'Cereals',
  'Legumes',
  'Fruits',
  'Vegetables',
  'Root and tuber crops',
  'Other agricultural produce',
];

export const LIVESTOCK_ANIMAL_TYPES = [
  'Cattle',
  'Goats',
  'Sheep',
  'Poultry',
  'Pigs',
  'Rabbits',
  'Fish',
  'Other livestock',
];

export const CATTLE_BREEDS = [
  'Friesian',
  'Ayrshire',
  'Jersey',
  'Guernsey',
  'Sahiwal',
  'Boran',
  'Indigenous cattle',
];

export const GOAT_BREEDS = [
  'Galla',
  'Small East African',
  'Toggenburg',
  'Boer',
];

export const SHEEP_BREEDS = [
  'Dorper',
  'Merino',
  'Red Maasai',
];

export const POULTRY_BREEDS = [
  'Kienyeji',
  'Layers',
  'Broilers',
  'Kenbro',
  'Kuroiler',
  'Sasso',
];

export const PIG_BREEDS = [
  'Large White',
  'Landrace',
  'Duroc',
];

export const RABBIT_BREEDS = [
  'New Zealand White',
  'California White',
  'Chinchilla',
];

export const FISH_BREEDS = [
  'Tilapia',
  'Catfish',
];

export const INPUTS_PRODUCT_TYPES = [
  'Certified crop seeds',
  'Vegetable seeds',
  'Pasture seeds',
  'Organic fertilizers',
  'Inorganic fertilizers',
  'Soil conditioners',
  'Other available agricultural inputs',
];

export const EQUIPMENT_PRODUCT_TYPES = [
  'Irrigation systems',
  'Water pumps',
  'Drip irrigation kits',
  'Sprayers',
  'Tractors',
  'Ploughs / Tillers',
  'Planters',
  'Harvesters',
  'Milking machines',
  'Incubation and brooding equipment',
  'Animal feed processing equipment',
  'Greenhouses and shade nets',
  'Solar equipment',
  'Hand tools and farm implements',
  'Other equipment',
];

export const EQUIPMENT_POWER_SOURCES = [
  'Manual',
  'Petrol',
  'Diesel',
  'Solar',
  'Electric',
  'PTO / Tractor Driven',
];

export const EQUIPMENT_CONDITIONS = [
  'New',
  'Used / Refurbished',
];

export const MarketplaceFilterBar: React.FC<MarketplaceFilterBarProps> = ({
  products,
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
}) => {
  // Live published listings calculation for the five main categories
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.status === 'active' || !p.status);
  }, [products]);

  const categoryCounts = useMemo(() => {
    return {
      all: activeProducts.length,
      crops: activeProducts.filter((p) => p.category === 'crops').length,
      livestock: activeProducts.filter((p) => p.category === 'livestock').length,
      inputs: activeProducts.filter((p) => p.category === 'inputs').length,
      equipment: activeProducts.filter((p) => p.category === 'equipment').length,
    };
  }, [activeProducts]);

  // Extract dynamically available varieties from products for crops
  const availableCropVarieties = useMemo(() => {
    const varieties = new Set<string>();
    activeProducts.forEach((p) => {
      if (p.category === 'crops' && p.variety) {
        if (!filters.cropProductType || filters.cropProductType === 'all' || p.productType === filters.cropProductType) {
          varieties.add(p.variety);
        }
      }
    });
    return Array.from(varieties).sort();
  }, [activeProducts, filters.cropProductType]);

  // Count items for each crop product type
  const cropTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeProducts
      .filter((p) => p.category === 'crops')
      .forEach((p) => {
        if (p.productType) {
          counts[p.productType] = (counts[p.productType] || 0) + 1;
        }
      });
    return counts;
  }, [activeProducts]);

  // Count items for each livestock animal type
  const animalTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeProducts
      .filter((p) => p.category === 'livestock')
      .forEach((p) => {
        const type = p.animalType || (p.productType as string);
        if (type) {
          counts[type] = (counts[type] || 0) + 1;
        }
      });
    return counts;
  }, [activeProducts]);

  // Count items for inputs product types
  const inputTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeProducts
      .filter((p) => p.category === 'inputs')
      .forEach((p) => {
        if (p.productType) {
          counts[p.productType] = (counts[p.productType] || 0) + 1;
        }
      });
    return counts;
  }, [activeProducts]);

  // Count items for equipment product types
  const equipmentTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeProducts
      .filter((p) => p.category === 'equipment')
      .forEach((p) => {
        if (p.productType) {
          counts[p.productType] = (counts[p.productType] || 0) + 1;
        }
      });
    return counts;
  }, [activeProducts]);

  // Dynamic breeds based strictly on selected animal type
  const currentBreedsList = useMemo(() => {
    switch (filters.livestockAnimalType) {
      case 'Cattle':
        return CATTLE_BREEDS;
      case 'Goats':
        return GOAT_BREEDS;
      case 'Sheep':
        return SHEEP_BREEDS;
      case 'Poultry':
        return POULTRY_BREEDS;
      case 'Pigs':
        return PIG_BREEDS;
      case 'Rabbits':
        return RABBIT_BREEDS;
      case 'Fish':
        return FISH_BREEDS;
      default:
        return [];
    }
  }, [filters.livestockAnimalType]);

  // Count active non-default filters
  const activeFiltersList = useMemo(() => {
    const list: { key: keyof FilterState; label: string; value: string; display: string }[] = [];

    if (filters.category !== 'all') {
      const names: Record<MainCategory, string> = {
        all: 'All',
        crops: 'Crops & Produce',
        livestock: 'Livestock & Cattle',
        inputs: 'Certified Seeds & Fertilizers',
        equipment: 'Farm Equipment & Irrigation',
      };
      list.push({ key: 'category', label: 'Category', value: 'all', display: names[filters.category] });
    }

    if (filters.cropProductType && filters.cropProductType !== 'all') {
      list.push({ key: 'cropProductType', label: 'Crop Type', value: 'all', display: filters.cropProductType });
    }
    if (filters.cropVariety && filters.cropVariety !== 'all') {
      list.push({ key: 'cropVariety', label: 'Variety', value: 'all', display: filters.cropVariety });
    }

    if (filters.livestockAnimalType && filters.livestockAnimalType !== 'all') {
      list.push({ key: 'livestockAnimalType', label: 'Animal', value: 'all', display: filters.livestockAnimalType });
    }
    if (filters.livestockCattlePurpose && filters.livestockCattlePurpose !== 'all') {
      list.push({ key: 'livestockCattlePurpose', label: 'Purpose', value: 'all', display: filters.livestockCattlePurpose });
    }
    if (filters.livestockBreed && filters.livestockBreed !== 'all') {
      list.push({ key: 'livestockBreed', label: 'Breed', value: 'all', display: filters.livestockBreed });
    }

    if (filters.inputProductType && filters.inputProductType !== 'all') {
      list.push({ key: 'inputProductType', label: 'Input Type', value: 'all', display: filters.inputProductType });
    }
    if (filters.inputFormulation && filters.inputFormulation !== 'all') {
      list.push({ key: 'inputFormulation', label: 'Formulation', value: 'all', display: filters.inputFormulation });
    }

    if (filters.equipmentProductType && filters.equipmentProductType !== 'all') {
      list.push({ key: 'equipmentProductType', label: 'Equipment Type', value: 'all', display: filters.equipmentProductType });
    }
    if (filters.equipmentPowerSource && filters.equipmentPowerSource !== 'all') {
      list.push({ key: 'equipmentPowerSource', label: 'Power', value: 'all', display: filters.equipmentPowerSource });
    }
    if (filters.equipmentCondition && filters.equipmentCondition !== 'all') {
      list.push({ key: 'equipmentCondition', label: 'Condition', value: 'all', display: filters.equipmentCondition });
    }

    if (filters.selectedCounty && filters.selectedCounty !== 'all') {
      list.push({ key: 'selectedCounty', label: 'County', value: 'all', display: `${filters.selectedCounty} County` });
    }
    if (filters.searchQuery) {
      list.push({ key: 'searchQuery', label: 'Search', value: '', display: `"${filters.searchQuery}"` });
    }

    return list;
  }, [filters]);

  const handleCategorySelect = (category: MainCategory) => {
    onFilterChange({
      category,
      // Reset sub-filters when switching category to keep experience clean
      cropProductType: 'all',
      cropVariety: 'all',
      livestockAnimalType: 'all',
      livestockBreed: 'all',
      livestockCattlePurpose: 'all',
      inputProductType: 'all',
      inputFormulation: 'all',
      equipmentProductType: 'all',
      equipmentPowerSource: 'all',
      equipmentCondition: 'all',
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Main Category Tabs / Responsive Cards with Live Listing Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* All Products */}
        <button
          type="button"
          onClick={() => handleCategorySelect('all')}
          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group shadow-xs ${
            filters.category === 'all'
              ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                filters.category === 'all'
                  ? 'bg-emerald-700 text-emerald-100'
                  : 'bg-stone-100 text-stone-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
              }`}
            >
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold truncate">All Products</span>
              <span
                className={`text-[10px] block ${
                  filters.category === 'all' ? 'text-emerald-300' : 'text-stone-400'
                }`}
              >
                Entire Catalog
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ${
              filters.category === 'all'
                ? 'bg-emerald-800 text-emerald-200'
                : 'bg-stone-100 text-stone-700 group-hover:bg-emerald-100 group-hover:text-emerald-800'
            }`}
          >
            {categoryCounts.all}
          </span>
        </button>

        {/* Crops & Produce */}
        <button
          type="button"
          onClick={() => handleCategorySelect('crops')}
          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group shadow-xs ${
            filters.category === 'crops'
              ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                filters.category === 'crops'
                  ? 'bg-emerald-700 text-emerald-100'
                  : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
              }`}
            >
              <Sprout className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold truncate">Crops & Produce</span>
              <span
                className={`text-[10px] block ${
                  filters.category === 'crops' ? 'text-emerald-300' : 'text-stone-400'
                }`}
              >
                Cereals, Fruits, Veg
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ${
              filters.category === 'crops'
                ? 'bg-emerald-800 text-emerald-200'
                : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            {categoryCounts.crops}
          </span>
        </button>

        {/* Livestock & Cattle */}
        <button
          type="button"
          onClick={() => handleCategorySelect('livestock')}
          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group shadow-xs ${
            filters.category === 'livestock'
              ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                filters.category === 'livestock'
                  ? 'bg-emerald-700 text-emerald-100'
                  : 'bg-amber-50 text-amber-700 group-hover:bg-amber-100'
              }`}
            >
              <Beef className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold truncate">Livestock & Cattle</span>
              <span
                className={`text-[10px] block ${
                  filters.category === 'livestock' ? 'text-emerald-300' : 'text-stone-400'
                }`}
              >
                Cows, Goats, Poultry
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ${
              filters.category === 'livestock'
                ? 'bg-emerald-800 text-emerald-200'
                : 'bg-amber-50 text-amber-900'
            }`}
          >
            {categoryCounts.livestock}
          </span>
        </button>

        {/* Certified Seeds & Fertilizers */}
        <button
          type="button"
          onClick={() => handleCategorySelect('inputs')}
          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group shadow-xs ${
            filters.category === 'inputs'
              ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                filters.category === 'inputs'
                  ? 'bg-emerald-700 text-emerald-100'
                  : 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'
              }`}
            >
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold truncate">Certified Seeds & Fertilizers</span>
              <span
                className={`text-[10px] block ${
                  filters.category === 'inputs' ? 'text-emerald-300' : 'text-stone-400'
                }`}
              >
                Seeds & Fertilizers
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ${
              filters.category === 'inputs'
                ? 'bg-emerald-800 text-emerald-200'
                : 'bg-blue-50 text-blue-900'
            }`}
          >
            {categoryCounts.inputs}
          </span>
        </button>

        {/* Farm Equipment & Irrigation */}
        <button
          type="button"
          onClick={() => handleCategorySelect('equipment')}
          className={`col-span-2 sm:col-span-1 flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group shadow-xs ${
            filters.category === 'equipment'
              ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                filters.category === 'equipment'
                  ? 'bg-emerald-700 text-emerald-100'
                  : 'bg-purple-50 text-purple-700 group-hover:bg-purple-100'
              }`}
            >
              <Wrench className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold truncate">Farm Equipment & Irrigation</span>
              <span
                className={`text-[10px] block ${
                  filters.category === 'equipment' ? 'text-emerald-300' : 'text-stone-400'
                }`}
              >
                Pumps, Kits, Tractors
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ${
              filters.category === 'equipment'
                ? 'bg-emerald-800 text-emerald-200'
                : 'bg-purple-50 text-purple-900'
            }`}
          >
            {categoryCounts.equipment}
          </span>
        </button>
      </div>

      {/* 2. Dynamic Product-Type, Variety, Breed, and Model Selectors */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* ======================================================== */}
        {/* CROPS & PRODUCE DYNAMIC FILTERS                         */}
        {/* ======================================================== */}
        {filters.category === 'crops' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Sprout className="w-4 h-4 text-emerald-700" />
                <span>1. Select Crop Product Type</span>
              </span>
              <span className="text-[11px] text-stone-500">Filter by agricultural produce class</span>
            </div>

            {/* Product Type Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onFilterChange({ cropProductType: 'all', cropVariety: 'all' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  !filters.cropProductType || filters.cropProductType === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Crop Types ({categoryCounts.crops})
              </button>
              {CROPS_PRODUCT_TYPES.map((type) => {
                const count = cropTypeCounts[type] || 0;
                const isSelected = filters.cropProductType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onFilterChange({ cropProductType: type, cropVariety: 'all' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{type}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Variety Selector */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>2. Select Variety (Supplied by Kenyan Farmers)</span>
                </span>
                {filters.cropVariety && filters.cropVariety !== 'all' && (
                  <button
                    type="button"
                    onClick={() => onFilterChange({ cropVariety: 'all' })}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Clear variety selection</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Dynamic Variety Quick Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onFilterChange({ cropVariety: 'all' })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                    !filters.cropVariety || filters.cropVariety === 'all'
                      ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  All Varieties
                </button>

                {availableCropVarieties.map((variety) => (
                  <button
                    key={variety}
                    type="button"
                    onClick={() => onFilterChange({ cropVariety: variety })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1 ${
                      filters.cropVariety === variety
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {filters.cropVariety === variety && <Check className="w-3 h-3 shrink-0" />}
                    <span>{variety}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LIVESTOCK & CATTLE DYNAMIC FILTERS                      */}
        {/* ======================================================== */}
        {filters.category === 'livestock' && (
          <div className="space-y-4">
            {/* Step 1: Animal Type Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Beef className="w-4 h-4 text-emerald-700" />
                  <span>1. Choose Animal Type</span>
                </span>
                <span className="text-[11px] text-stone-500">Pick species to reveal verified breeds</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onFilterChange({
                      livestockAnimalType: 'all',
                      livestockBreed: 'all',
                      livestockCattlePurpose: 'all',
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    !filters.livestockAnimalType || filters.livestockAnimalType === 'all'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All Animals ({categoryCounts.livestock})
                </button>
                {LIVESTOCK_ANIMAL_TYPES.map((animal) => {
                  const count = animalTypeCounts[animal] || 0;
                  const isSelected = filters.livestockAnimalType === animal;
                  return (
                    <button
                      key={animal}
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          livestockAnimalType: animal,
                          livestockBreed: 'all',
                          livestockCattlePurpose: 'all',
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <span>{animal}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Contextual Sub-filters depending on selected animal */}
            {filters.livestockAnimalType && filters.livestockAnimalType !== 'all' && (
              <div className="pt-3 border-t border-stone-100 space-y-3 bg-stone-50/70 p-3.5 rounded-xl border border-stone-200">
                {/* Specific for Cattle: Production-Purpose Filter */}
                {filters.livestockAnimalType === 'Cattle' && (
                  <div className="space-y-1.5 pb-2 border-b border-stone-200">
                    <span className="text-xs font-bold text-stone-800 block">
                      Production Purpose (Cattle):
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {['all', 'Dairy', 'Beef', 'Dual-purpose'].map((purpose) => {
                        const isSelected =
                          (!filters.livestockCattlePurpose && purpose === 'all') ||
                          filters.livestockCattlePurpose === purpose;
                        return (
                          <button
                            key={purpose}
                            type="button"
                            onClick={() => onFilterChange({ livestockCattlePurpose: purpose })}
                            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                              isSelected
                                ? 'bg-amber-700 text-white shadow-xs'
                                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                            }`}
                          >
                            {purpose === 'all' ? 'All Purposes' : purpose}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Relevant Breed Selector (Strictly dependent on selected animal type) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>
                        2. Select {filters.livestockAnimalType} Breed / Strain (Strict Filtering)
                      </span>
                    </span>
                    {filters.livestockBreed && filters.livestockBreed !== 'all' && (
                      <button
                        type="button"
                        onClick={() => onFilterChange({ livestockBreed: 'all' })}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Clear breed</span>
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onFilterChange({ livestockBreed: 'all' })}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                        !filters.livestockBreed || filters.livestockBreed === 'all'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      All {filters.livestockAnimalType} Breeds
                    </button>
                    {currentBreedsList.map((breed) => {
                      const isSelected = filters.livestockBreed === breed;
                      return (
                        <button
                          key={breed}
                          type="button"
                          onClick={() => onFilterChange({ livestockBreed: breed })}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1 ${
                            isSelected
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 shrink-0" />}
                          <span>{breed}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* CERTIFIED SEEDS & FERTILIZERS DYNAMIC FILTERS            */}
        {/* ======================================================== */}
        {filters.category === 'inputs' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>1. Select Agricultural Input Type</span>
              </span>
              <span className="text-[11px] text-stone-500">KEPHIS certified seeds & fertilizers</span>
            </div>

            {/* Product Type Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onFilterChange({ inputProductType: 'all', inputFormulation: 'all' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  !filters.inputProductType || filters.inputProductType === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Inputs ({categoryCounts.inputs})
              </button>
              {INPUTS_PRODUCT_TYPES.map((type) => {
                const count = inputTypeCounts[type] || 0;
                const isSelected = filters.inputProductType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onFilterChange({ inputProductType: type })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{type}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Formulation Filters */}
            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-700">Formulation & Type:</span>
              {[
                { label: 'All', value: 'all' },
                { label: 'DAP (18:46:0)', value: 'DAP' },
                { label: 'CAN (26% N)', value: 'CAN' },
                { label: 'Organic Compost', value: 'Compost' },
                { label: 'Agricultural Lime', value: 'Lime' },
                { label: 'Dairy Meal 16%', value: 'Dairy Meal' },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => onFilterChange({ inputFormulation: f.value })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                    (!filters.inputFormulation && f.value === 'all') || filters.inputFormulation === f.value
                      ? 'bg-blue-700 text-white font-bold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* FARM EQUIPMENT & IRRIGATION DYNAMIC FILTERS              */}
        {/* ======================================================== */}
        {filters.category === 'equipment' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Wrench className="w-4 h-4 text-emerald-700" />
                <span>1. Select Machinery & Equipment Type</span>
              </span>
              <span className="text-[11px] text-stone-500">Irrigation, pumps, tractors & implements</span>
            </div>

            {/* Product Type Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onFilterChange({
                    equipmentProductType: 'all',
                    equipmentPowerSource: 'all',
                    equipmentCondition: 'all',
                  })
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  !filters.equipmentProductType || filters.equipmentProductType === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Equipment ({categoryCounts.equipment})
              </button>
              {EQUIPMENT_PRODUCT_TYPES.map((type) => {
                const count = equipmentTypeCounts[type] || 0;
                const isSelected = filters.equipmentProductType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onFilterChange({ equipmentProductType: type })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{type}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Secondary Equipment Filters: Power Source & Condition */}
            <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-stone-700 flex items-center gap-1 mr-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Power Source:</span>
                </span>
                {['all', ...EQUIPMENT_POWER_SOURCES].map((src) => {
                  const isSelected =
                    (!filters.equipmentPowerSource && src === 'all') ||
                    filters.equipmentPowerSource === src;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => onFilterChange({ equipmentPowerSource: src })}
                      className={`px-2 py-0.8 rounded-lg cursor-pointer transition ${
                        isSelected
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {src === 'all' ? 'Any' : src}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                <span className="font-bold text-stone-700 flex items-center gap-1 mr-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Condition:</span>
                </span>
                {['all', 'new', 'used'].map((cond) => {
                  const isSelected =
                    (!filters.equipmentCondition && cond === 'all') ||
                    filters.equipmentCondition === cond;
                  const label = cond === 'all' ? 'Any' : cond === 'new' ? 'Brand New' : 'Used / Refurbished';
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => onFilterChange({ equipmentCondition: cond })}
                      className={`px-2.5 py-0.8 rounded-lg cursor-pointer transition ${
                        isSelected
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ALL PRODUCTS OVERVIEW (Prompt category 1)                */}
        {/* ======================================================== */}
        {filters.category === 'all' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>
                Viewing all published agricultural categories across Kenya. Select a category card above to unlock deep variety, breed, and equipment filters.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCategorySelect('crops')}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
              >
                Browse Crops
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleCategorySelect('livestock')}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
              >
                Browse Livestock
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Active Filter Badges Bar & Instant Reset Button */}
      {activeFiltersList.length > 0 && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-emerald-900 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>Active Criteria:</span>
            </span>

            {activeFiltersList.map((item, idx) => (
              <span
                key={`${item.key}-${idx}`}
                className="inline-flex items-center gap-1.5 bg-white border border-emerald-300 text-emerald-950 font-semibold px-2.5 py-1 rounded-xl shadow-2xs"
              >
                <span className="text-[10px] text-emerald-700 uppercase">{item.label}:</span>
                <span>{item.display}</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ [item.key]: item.value })}
                  className="hover:bg-emerald-100 rounded-full p-0.5 text-emerald-700 cursor-pointer"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-auto shrink-0">
            <span className="text-stone-600 font-bold">
              {totalFilteredCount} matching listings
            </span>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/60 px-2.5 py-1 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
