import { useState, useMemo, useCallback } from 'react';
import { Product } from '../types';
import { 
  MarketplaceCategory, 
  CATEGORY_PRODUCT_TYPES, 
  VARIETIES_BY_PRODUCT_TYPE 
} from '../data/marketplaceTaxonomy';

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc';

export interface MarketplaceFilterState {
  category: MarketplaceCategory;
  productType: string;
  varietyOrBreed: string;
  location: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  searchQuery: string;
  sortBy: SortOption;
}

export const DEFAULT_FILTER_STATE: MarketplaceFilterState = {
  category: 'all',
  productType: 'all',
  varietyOrBreed: 'all',
  location: 'all',
  minPrice: undefined,
  maxPrice: undefined,
  searchQuery: '',
  sortBy: 'featured',
};

export interface ActiveFilterTag {
  key: string;
  label: string;
  displayValue: string;
  onRemove: () => void;
}

export interface UseMarketplaceFiltersReturn {
  // State
  filters: MarketplaceFilterState;
  category: MarketplaceCategory;
  productType: string;
  varietyOrBreed: string;
  location: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  searchQuery: string;
  sortBy: SortOption;

  // Setters
  setCategory: (category: MarketplaceCategory) => void;
  setProductType: (productType: string) => void;
  setVarietyOrBreed: (varietyOrBreed: string) => void;
  setLocation: (location: string) => void;
  setMinPrice: (min: number | undefined) => void;
  setMaxPrice: (max: number | undefined) => void;
  setPriceRange: (min: number | undefined, max: number | undefined) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;

  // Actions
  resetFilters: () => void;
  clearFilter: (filterKey: keyof MarketplaceFilterState | 'price') => void;

  // Derived options
  availableProductTypes: string[];
  availableVarieties: string[];
  isVarietyEnabled: boolean;
  activeFilterCount: number;
  isAnyFilterActive: boolean;
  activeFilterTags: ActiveFilterTag[];

  // Filter application
  filterAndSortProducts: (products: Product[]) => Product[];
}

export function useMarketplaceFilters(
  initialProducts: Product[] = [],
  initialCategory: MarketplaceCategory = 'all',
  initialSearchQuery: string = ''
): UseMarketplaceFiltersReturn & { filteredProducts: Product[]; totalCount: number } {
  const [filters, setFilters] = useState<MarketplaceFilterState>({
    ...DEFAULT_FILTER_STATE,
    category: initialCategory,
    searchQuery: initialSearchQuery,
  });

  // Set category with cascading resets
  const setCategory = useCallback((newCategory: MarketplaceCategory) => {
    setFilters((prev) => {
      // Check if current productType belongs to the new category
      let newProductType = prev.productType;
      if (newCategory !== 'all') {
        const allowedTypes = CATEGORY_PRODUCT_TYPES[newCategory] || [];
        if (!allowedTypes.includes(prev.productType)) {
          newProductType = 'all';
        }
      }

      return {
        ...prev,
        category: newCategory,
        productType: newProductType,
        varietyOrBreed: 'all', // Reset variety when category changes
      };
    });
  }, []);

  // Set product type with cascading variety reset
  const setProductType = useCallback((newProductType: string) => {
    setFilters((prev) => {
      // If product type is selected, we might also auto-detect category if category is 'all'
      let updatedCategory = prev.category;
      if (updatedCategory === 'all' && newProductType !== 'all') {
        for (const [cat, types] of Object.entries(CATEGORY_PRODUCT_TYPES)) {
          if (types.includes(newProductType)) {
            updatedCategory = cat as MarketplaceCategory;
            break;
          }
        }
      }

      return {
        ...prev,
        category: updatedCategory,
        productType: newProductType,
        varietyOrBreed: 'all', // Always reset variety/breed when product type changes
      };
    });
  }, []);

  const setVarietyOrBreed = useCallback((varietyOrBreed: string) => {
    setFilters((prev) => ({ ...prev, varietyOrBreed }));
  }, []);

  const setLocation = useCallback((location: string) => {
    setFilters((prev) => ({ ...prev, location }));
  }, []);

  const setMinPrice = useCallback((minPrice: number | undefined) => {
    setFilters((prev) => ({ ...prev, minPrice }));
  }, []);

  const setMaxPrice = useCallback((maxPrice: number | undefined) => {
    setFilters((prev) => ({ ...prev, maxPrice }));
  }, []);

  const setPriceRange = useCallback((minPrice: number | undefined, maxPrice: number | undefined) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE);
  }, []);

  const clearFilter = useCallback((filterKey: keyof MarketplaceFilterState | 'price') => {
    setFilters((prev) => {
      if (filterKey === 'price') {
        return { ...prev, minPrice: undefined, maxPrice: undefined };
      }
      if (filterKey === 'category') {
        return { ...prev, category: 'all', productType: 'all', varietyOrBreed: 'all' };
      }
      if (filterKey === 'productType') {
        return { ...prev, productType: 'all', varietyOrBreed: 'all' };
      }
      return { ...prev, [filterKey]: DEFAULT_FILTER_STATE[filterKey] };
    });
  }, []);

  // Compute available product types based on current category
  const availableProductTypes = useMemo(() => {
    if (filters.category === 'all') {
      const allTypes: string[] = [];
      Object.values(CATEGORY_PRODUCT_TYPES).forEach((list) => {
        allTypes.push(...list);
      });
      return Array.from(new Set(allTypes));
    }
    return CATEGORY_PRODUCT_TYPES[filters.category] || [];
  }, [filters.category]);

  // Compute available varieties/breeds based on current product type
  const availableVarieties = useMemo(() => {
    if (!filters.productType || filters.productType === 'all') {
      return [];
    }

    // Direct lookup
    if (VARIETIES_BY_PRODUCT_TYPE[filters.productType]) {
      return VARIETIES_BY_PRODUCT_TYPE[filters.productType];
    }

    // Partial lookup (e.g. if 'Dairy cattle' -> check Cattle or Dairy)
    for (const [key, list] of Object.entries(VARIETIES_BY_PRODUCT_TYPE)) {
      if (key.toLowerCase().includes(filters.productType.toLowerCase()) || 
          filters.productType.toLowerCase().includes(key.toLowerCase())) {
        return list;
      }
    }

    return [];
  }, [filters.productType]);

  const isVarietyEnabled = filters.productType !== 'all' && availableVarieties.length > 0;

  // Active filter count (excluding defaults)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.productType !== 'all') count++;
    if (filters.varietyOrBreed !== 'all') count++;
    if (filters.location !== 'all') count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  const isAnyFilterActive = activeFilterCount > 0;

  // Active filter tags for quick removal chips in UI
  const activeFilterTags = useMemo<ActiveFilterTag[]>(() => {
    const tags: ActiveFilterTag[] = [];

    if (filters.searchQuery.trim()) {
      tags.push({
        key: 'search',
        label: 'Search',
        displayValue: `"${filters.searchQuery}"`,
        onRemove: () => setSearchQuery(''),
      });
    }

    if (filters.category !== 'all') {
      const labelMap: Record<string, string> = {
        crops: 'Crops & Produce',
        livestock: 'Livestock & Cattle',
        inputs: 'Seeds & Fertilizers',
        equipment: 'Equipment & Irrigation',
      };
      tags.push({
        key: 'category',
        label: 'Category',
        displayValue: labelMap[filters.category] || filters.category,
        onRemove: () => setCategory('all'),
      });
    }

    if (filters.productType !== 'all') {
      tags.push({
        key: 'productType',
        label: 'Product Type',
        displayValue: filters.productType,
        onRemove: () => setProductType('all'),
      });
    }

    if (filters.varietyOrBreed !== 'all') {
      tags.push({
        key: 'varietyOrBreed',
        label: 'Variety / Breed',
        displayValue: filters.varietyOrBreed,
        onRemove: () => setVarietyOrBreed('all'),
      });
    }

    if (filters.location !== 'all') {
      tags.push({
        key: 'location',
        label: 'County',
        displayValue: `${filters.location} County`,
        onRemove: () => setLocation('all'),
      });
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      let priceLabel = '';
      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        priceLabel = `KSh ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}`;
      } else if (filters.minPrice !== undefined) {
        priceLabel = `Min KSh ${filters.minPrice.toLocaleString()}`;
      } else if (filters.maxPrice !== undefined) {
        priceLabel = `Max KSh ${filters.maxPrice.toLocaleString()}`;
      }

      tags.push({
        key: 'price',
        label: 'Price Range',
        displayValue: priceLabel,
        onRemove: () => setPriceRange(undefined, undefined),
      });
    }

    return tags;
  }, [filters, setCategory, setProductType, setVarietyOrBreed, setLocation, setPriceRange, setSearchQuery]);

  // Main filtering and sorting function
  const filterAndSortProducts = useCallback((items: Product[]): Product[] => {
    let result = items.slice();

    // 1. Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      result = result.filter((p) => {
        const title = (p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const pType = (p.productType || '').toLowerCase();
        const subCat = (p.subcategory || '').toLowerCase();
        const variety = (p.variety || '').toLowerCase();
        const breed = (p.breed || p.livestockDetails?.breed || '').toLowerCase();
        const county = (p.sellerCounty || '').toLowerCase();
        const seller = (p.sellerName || '').toLowerCase();

        return (
          title.includes(q) ||
          desc.includes(q) ||
          pType.includes(q) ||
          subCat.includes(q) ||
          variety.includes(q) ||
          breed.includes(q) ||
          county.includes(q) ||
          seller.includes(q)
        );
      });
    }

    // 2. Category
    if (filters.category !== 'all') {
      result = result.filter((p) => {
        if (filters.category === 'crops') return p.category === 'crops';
        if (filters.category === 'livestock') return p.category === 'livestock';
        if (filters.category === 'inputs') return p.category === 'inputs';
        if (filters.category === 'equipment') return p.category === 'equipment';
        return true;
      });
    }

    // 3. Product Type
    if (filters.productType !== 'all') {
      const targetType = filters.productType.toLowerCase();
      result = result.filter((p) => {
        const pType = (p.productType || '').toLowerCase();
        const subcategory = (p.subcategory || '').toLowerCase();
        const animalType = (p.animalType || p.livestockDetails?.animalType || '').toLowerCase();
        const title = (p.title || '').toLowerCase();

        return (
          pType === targetType ||
          pType.includes(targetType) ||
          targetType.includes(pType) ||
          subcategory.includes(targetType) ||
          animalType.includes(targetType) ||
          title.includes(targetType)
        );
      });
    }

    // 4. Variety or Breed
    if (filters.varietyOrBreed !== 'all') {
      const targetVar = filters.varietyOrBreed.toLowerCase();
      // Extract clean keywords if variety has parenthetical note (e.g. "H614" from "H614 (Highland Maize)")
      const cleanKeyword = targetVar.split('(')[0].trim();

      result = result.filter((p) => {
        const variety = (p.variety || '').toLowerCase();
        const breed = (p.breed || p.livestockDetails?.breed || '').toLowerCase();
        const title = (p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();

        return (
          variety.includes(cleanKeyword) ||
          breed.includes(cleanKeyword) ||
          title.includes(cleanKeyword) ||
          desc.includes(cleanKeyword) ||
          targetVar.includes(variety && variety.length > 2 ? variety : '____') ||
          targetVar.includes(breed && breed.length > 2 ? breed : '____')
        );
      });
    }

    // 5. Kenyan County / Location
    if (filters.location !== 'all') {
      const targetCounty = filters.location.toLowerCase();
      result = result.filter((p) => {
        const county = (p.sellerCounty || '').toLowerCase();
        return county === targetCounty || county.includes(targetCounty) || targetCounty.includes(county);
      });
    }

    // 6. Price Range
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.priceKsh >= (filters.minPrice as number));
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.priceKsh <= (filters.maxPrice as number));
    }

    // 7. Sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.priceKsh - b.priceKsh);
        break;
      case 'price-desc':
        result.sort((a, b) => b.priceKsh - a.priceKsh);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        // Featured: Verified sellers first, high rating, stock available
        result.sort((a, b) => {
          if (a.isVerifiedSeller !== b.isVerifiedSeller) {
            return a.isVerifiedSeller ? -1 : 1;
          }
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }

    return result;
  }, [filters]);

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(initialProducts);
  }, [filterAndSortProducts, initialProducts]);

  return {
    filters,
    category: filters.category,
    productType: filters.productType,
    varietyOrBreed: filters.varietyOrBreed,
    location: filters.location,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    searchQuery: filters.searchQuery,
    sortBy: filters.sortBy,

    setCategory,
    setProductType,
    setVarietyOrBreed,
    setLocation,
    setMinPrice,
    setMaxPrice,
    setPriceRange,
    setSearchQuery,
    setSortBy,

    resetFilters,
    clearFilter,

    availableProductTypes,
    availableVarieties,
    isVarietyEnabled,
    activeFilterCount,
    isAnyFilterActive,
    activeFilterTags,

    filterAndSortProducts,
    filteredProducts,
    totalCount: filteredProducts.length,
  };
}
