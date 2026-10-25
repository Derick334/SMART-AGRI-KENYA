import React from 'react';
import { 
  RotateCcw, 
  MapPin, 
  Tag, 
  Layers, 
  DollarSign, 
  ArrowUpDown, 
  X, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { 
  MarketplaceCategory, 
  MARKETPLACE_CATEGORIES 
} from '../../data/marketplaceTaxonomy';
import { 
  SortOption, 
  ActiveFilterTag,
  MarketplaceFilterState 
} from '../../hooks/useMarketplaceFilters';

interface MarketplaceFilterBarProps {
  category: MarketplaceCategory;
  productType: string;
  varietyOrBreed: string;
  location: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: SortOption;
  availableProductTypes: string[];
  availableVarieties: string[];
  isVarietyEnabled: boolean;
  activeFilterCount: number;
  activeFilterTags: ActiveFilterTag[];
  totalCount: number;

  maxAgeMonths?: number | undefined;
  livestockPurpose?: string;
  livestockSex?: string;
  deliveryOption?: string;
  qualityGrade?: string;

  onSelectCategory: (category: MarketplaceCategory) => void;
  onSelectProductType: (productType: string) => void;
  onSelectVarietyOrBreed: (varietyOrBreed: string) => void;
  onSelectLocation: (location: string) => void;
  onMinPriceChange: (minPrice: number | undefined) => void;
  onMaxPriceChange: (maxPrice: number | undefined) => void;
  onSortChange: (sortBy: SortOption) => void;
  onResetFilters: () => void;
  onClearFilter?: (key: keyof MarketplaceFilterState | 'price') => void;
  onMaxAgeMonthsChange?: (maxAge: number | undefined) => void;
  onLivestockPurposeChange?: (purpose: string) => void;
  onLivestockSexChange?: (sex: string) => void;
  onDeliveryOptionChange?: (delivery: string) => void;
  onQualityGradeChange?: (grade: string) => void;
}

export const MarketplaceFilterBar: React.FC<MarketplaceFilterBarProps> = ({
  category,
  productType,
  varietyOrBreed,
  location,
  minPrice,
  maxPrice,
  sortBy,
  availableProductTypes,
  availableVarieties,
  isVarietyEnabled,
  activeFilterCount,
  activeFilterTags,
  totalCount,

  maxAgeMonths,
  livestockPurpose = 'all',
  livestockSex = 'all',
  deliveryOption = 'all',
  qualityGrade = 'all',

  onSelectCategory,
  onSelectProductType,
  onSelectVarietyOrBreed,
  onSelectLocation,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onResetFilters,
  onMaxAgeMonthsChange,
  onLivestockPurposeChange,
  onLivestockSexChange,
  onDeliveryOptionChange,
  onQualityGradeChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs p-4 sm:p-5 mb-6 space-y-4">
      {/* 1. Category Selector Navigation Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#68756A] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#367C46]" />
            <span>Product Category</span>
          </label>
          <span className="text-xs text-[#68756A] font-medium hidden sm:inline">
            Filter by sector to see specific varieties
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {MARKETPLACE_CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#367C46] text-white border-[#367C46] font-semibold shadow-xs'
                    : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white hover:border-[#CFD7CA]'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Advanced Dependent Filters Row (Desktop: 4 columns, Mobile: stack) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#E2E7DE]">
        {/* Product Type Dropdown */}
        <div className="space-y-1">
          <label htmlFor="filter-product-type" className="text-xs font-semibold text-[#252D27] flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#367C46]" />
            <span>Product Type</span>
          </label>
          <div className="relative">
            <select
              id="filter-product-type"
              value={productType}
              onChange={(e) => onSelectProductType(e.target.value)}
              className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#367C46] transition cursor-pointer font-medium appearance-none"
            >
              <option value="all">
                {category === 'all' ? 'All Product Types' : `All ${category} types`}
              </option>
              {availableProductTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#68756A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Variety / Breed Dropdown (Dependent on product type) */}
        <div className="space-y-1">
          <label htmlFor="filter-variety" className="text-xs font-semibold text-[#252D27] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#367C46]" />
              <span>Variety or Breed</span>
            </span>
            {!isVarietyEnabled && (
              <span className="text-[10px] text-[#68756A] font-normal">Select type first</span>
            )}
          </label>
          <div className="relative">
            <select
              id="filter-variety"
              value={varietyOrBreed}
              onChange={(e) => onSelectVarietyOrBreed(e.target.value)}
              disabled={!isVarietyEnabled}
              className={`w-full border text-xs sm:text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#367C46] transition cursor-pointer font-medium appearance-none ${
                isVarietyEnabled
                  ? 'bg-white border-[#E2E7DE] text-[#252D27]'
                  : 'bg-[#F7F6F0] border-[#E2E7DE] text-[#68756A] cursor-not-allowed'
              }`}
            >
              <option value="all">
                {isVarietyEnabled ? 'All Varieties / Breeds' : 'Select product type first'}
              </option>
              {availableVarieties.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#68756A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Kenyan County / Location Dropdown */}
        <div className="space-y-1">
          <label htmlFor="filter-county" className="text-xs font-semibold text-[#252D27] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#367C46]" />
            <span>County Location</span>
          </label>
          <div className="relative">
            <select
              id="filter-county"
              value={location}
              onChange={(e) => onSelectLocation(e.target.value)}
              className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#367C46] transition cursor-pointer font-medium appearance-none"
            >
              <option value="all">All 47 Counties in Kenya</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} County ({c.majorMarket})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#68756A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sorting Dropdown */}
        <div className="space-y-1">
          <label htmlFor="filter-sort" className="text-xs font-semibold text-[#252D27] flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#367C46]" />
            <span>Sort By</span>
          </label>
          <div className="relative">
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#367C46] transition cursor-pointer font-medium appearance-none"
            >
              <option value="featured">Featured & Verified First</option>
              <option value="newest">Newest Listings</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#68756A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2B. Category-Specific Filters (Livestock Age/Breed/Purpose, Crop Grade, Input Certification) */}
      {category === 'livestock' && (
        <div className="pt-3 border-t border-[#E2E7DE] grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FCF8EE]/60 p-3 rounded-lg border border-[#D6A545]/20">
          {/* Max Age Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#79543A] flex items-center justify-between">
              <span>Maximum Animal Age</span>
              {maxAgeMonths !== undefined && (
                <span className="text-[10px] text-[#367C46] font-semibold">{maxAgeMonths} months max</span>
              )}
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { label: 'Any Age', value: undefined },
                { label: '≤ 3 Mo', value: 3 },
                { label: '≤ 6 Mo (Chickens)', value: 6 },
                { label: '≤ 12 Mo', value: 12 },
                { label: '≤ 24 Mo', value: 24 },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => onMaxAgeMonthsChange && onMaxAgeMonthsChange(opt.value)}
                  className={`text-xs px-2.5 py-1 rounded border transition font-medium cursor-pointer ${
                    maxAgeMonths === opt.value
                      ? 'bg-[#214E34] text-white border-[#214E34] font-bold shadow-xs'
                      : 'bg-white text-[#252D27] border-[#E2E7DE] hover:bg-[#F7F6F0]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Livestock Purpose */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#79543A]">Animal Purpose</label>
            <select
              value={livestockPurpose}
              onChange={(e) => onLivestockPurposeChange && onLivestockPurposeChange(e.target.value)}
              className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#367C46]"
            >
              <option value="all">All Purposes (Dairy, Beef, Eggs, Breeding)</option>
              <option value="dairy">Dairy & Milk Production</option>
              <option value="beef">Beef & Meat Slaughter</option>
              <option value="breeding">Purebred Breeding Stock</option>
              <option value="eggs">Egg Production / Layers</option>
              <option value="dual_purpose">Dual-Purpose (Meat & Eggs/Milk)</option>
            </select>
          </div>

          {/* Livestock Sex */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#79543A]">Animal Sex</label>
            <select
              value={livestockSex}
              onChange={(e) => onLivestockSexChange && onLivestockSexChange(e.target.value)}
              className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#367C46]"
            >
              <option value="all">All (Female, Male, Mixed Flock)</option>
              <option value="female">Female (Cows, Hens, Does, Gilts)</option>
              <option value="male">Male (Bulls, Cocks, Bucks, Boars)</option>
              <option value="mixed_batch">Mixed Batch / Flock</option>
            </select>
          </div>
        </div>
      )}

      {category === 'crops' && (
        <div className="pt-3 border-t border-[#E2E7DE] grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#EBF3ED]/60 p-3 rounded-lg border border-[#CFD7CA]">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#214E34]">Produce Quality & Grade</label>
            <select
              value={qualityGrade}
              onChange={(e) => onQualityGradeChange && onQualityGradeChange(e.target.value)}
              className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#367C46]"
            >
              <option value="all">All Grades & Certifications</option>
              <option value="grade1">Grade 1 Export / Premium Clean</option>
              <option value="certified">Certified Seed & Tested Produce</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#214E34]">Delivery Options</label>
            <select
              value={deliveryOption}
              onChange={(e) => onDeliveryOptionChange && onDeliveryOptionChange(e.target.value)}
              className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#367C46]"
            >
              <option value="all">All Delivery Modes</option>
              <option value="pickup">Farmgate Collection / Pickup</option>
              <option value="carrier_dispatch">Transporter Dispatch</option>
              <option value="direct_delivery">Direct Farmer Delivery</option>
            </select>
          </div>
        </div>
      )}

      {/* 3. Price Filter (KSh) & Summary Row */}
      <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-t border-[#E2E7DE]">
        {/* Min & Max Price Inputs in KSh */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <span className="text-xs font-semibold text-[#252D27] flex items-center gap-1 shrink-0">
            <DollarSign className="w-3.5 h-3.5 text-[#367C46]" />
            <span>Price Range (KSh):</span>
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-32">
              <input
                type="number"
                placeholder="Min KSh"
                value={minPrice !== undefined ? minPrice : ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  onMinPriceChange(val);
                }}
                className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#367C46] transition"
                min="0"
              />
            </div>
            <span className="text-[#68756A] text-xs">—</span>
            <div className="relative flex-1 sm:w-32">
              <input
                type="number"
                placeholder="Max KSh"
                value={maxPrice !== undefined ? maxPrice : ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  onMaxPriceChange(val);
                }}
                className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#367C46] transition"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Results Count & Clear Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="text-xs text-[#68756A] font-medium">
            <span className="font-bold text-[#214E34] tabular-nums">{totalCount}</span> {totalCount === 1 ? 'product listed' : 'products listed'}
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-[#214E34] hover:bg-[#EBF3ED] px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition border border-[#CFD7CA] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Active Filter Tags */}
      {activeFilterTags.length > 0 && (
        <div className="pt-2 flex items-center gap-2 flex-wrap border-t border-[#E2E7DE]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#68756A] shrink-0">
            Active Filters:
          </span>
          {activeFilterTags.map((tag) => (
            <span
              key={tag.key}
              className="inline-flex items-center gap-1.5 text-xs bg-[#EBF3ED] text-[#214E34] border border-[#CFD7CA] px-2.5 py-0.5 rounded font-medium"
            >
              <span className="text-[#68756A] text-[10px] font-semibold">{tag.label}:</span>
              <span>{tag.displayValue}</span>
              <button
                type="button"
                onClick={tag.onRemove}
                className="hover:bg-[#DCECE0] rounded p-0.5 text-[#214E34] transition cursor-pointer"
                aria-label={`Remove filter for ${tag.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
