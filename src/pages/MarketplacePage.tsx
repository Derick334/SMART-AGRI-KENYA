import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Store, 
  Plus, 
  ShieldCheck, 
  RotateCcw, 
  PackageOpen, 
  CheckCircle2, 
  TrendingUp, 
  Sprout, 
  Beef, 
  Package, 
  MessageSquare, 
  Flag, 
  UserCheck, 
  Edit2, 
  Trash2, 
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { agriStore } from '../services/store';
import { MarketplaceCategory } from '../data/marketplaceTaxonomy';
import { useMarketplaceFilters } from '../hooks/useMarketplaceFilters';
import { MarketplaceFilterBar } from '../components/marketplace/MarketplaceFilterBar';
import { ProductCard } from '../components/marketplace/ProductCard';
import { ProductDetailModal } from '../components/marketplace/ProductDetailModal';
import { MarketplacePostModal } from '../components/marketplace/MarketplacePostModal';
import { ProductInquiryModal } from '../components/marketplace/ProductInquiryModal';
import { ProductReportModal } from '../components/marketplace/ProductReportModal';

interface MarketplacePageProps {
  products?: Product[];
  onViewProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number, delivery?: 'pickup' | 'delivery') => void;
  initialSearchQuery?: string;
  initialCategory?: MarketplaceCategory;
  userCounty?: string;
  onNavigateTab?: (tab: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  products: propProducts,
  onViewProduct: propOnViewProduct,
  onAddToCart: propOnAddToCart,
  initialSearchQuery = '',
  initialCategory = 'all',
  userCounty = 'Nakuru',
  onNavigateTab,
}) => {
  // Store products fallback
  const [storeProducts, setStoreProducts] = useState<Product[]>(() => agriStore.getProducts());
  const currentUser = agriStore.getCurrentUser();

  useEffect(() => {
    if (!propProducts) {
      const unsubscribe = agriStore.subscribe(() => {
        setStoreProducts(agriStore.getProducts());
      });
      return unsubscribe;
    }
  }, [propProducts]);

  const allProducts = propProducts || storeProducts;

  // Counts for each dedicated category
  const cropsCount = allProducts.filter(p => p.category === 'crops').length;
  const livestockCount = allProducts.filter(p => p.category === 'livestock').length;
  const inputsCount = allProducts.filter(p => p.category === 'inputs' || p.category === 'equipment' || p.category === 'fodder').length;

  // useMarketplaceFilters managing search, filters, location, variety and prices
  const {
    category,
    productType,
    varietyOrBreed,
    location,
    minPrice,
    maxPrice,
    searchQuery,
    sortBy,
    maxAgeMonths,
    livestockPurpose,
    livestockSex,
    deliveryOption,
    qualityGrade,
    setCategory,
    setProductType,
    setVarietyOrBreed,
    setLocation,
    setMinPrice,
    setMaxPrice,
    setSearchQuery,
    setSortBy,
    setMaxAgeMonths,
    setLivestockPurpose,
    setLivestockSex,
    setDeliveryOption,
    setQualityGrade,
    resetFilters,
    clearFilter,
    availableProductTypes,
    availableVarieties,
    isVarietyEnabled,
    activeFilterCount,
    activeFilterTags,
    filteredProducts,
    totalCount,
  } = useMarketplaceFilters(allProducts, initialCategory, initialSearchQuery);

  // Modals state
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [reportProduct, setReportProduct] = useState<Product | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Seller Management Drawer / Tab
  const [showMyListingsOnly, setShowMyListingsOnly] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>('');

  const handleViewProduct = (product: Product) => {
    if (propOnViewProduct) {
      propOnViewProduct(product);
    } else {
      setModalProduct(product);
    }
  };

  const handleAddToCart = (product: Product, quantity = 1, delivery: 'pickup' | 'delivery' = 'delivery') => {
    if (propOnAddToCart) {
      propOnAddToCart(product, quantity, delivery);
    } else {
      agriStore.addToCart(product, quantity, delivery);
    }
  };

  // Safe navigation handler to open dedicated category pages
  const handleOpenDedicatedPage = (tabId: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    } else if (typeof window !== 'undefined') {
      window.location.hash = tabId;
    }
  };

  const myListings = allProducts.filter(p => p.sellerId === currentUser?.id || p.sellerName === currentUser?.name);
  const displayedProducts = showMyListingsOnly ? myListings : filteredProducts;

  const handleUpdateListingPrice = (productId: string) => {
    if (!editPriceValue || Number(editPriceValue) <= 0) return;
    agriStore.updateProduct(productId, { priceKsh: Number(editPriceValue) });
    setEditingPriceId(null);
    setSuccessNotice('Listing price updated successfully.');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleToggleListingStatus = (product: Product) => {
    const nextStatus = product.status === 'active' ? 'sold_out' : 'active';
    agriStore.updateProduct(product.id, { 
      status: nextStatus,
      quantityAvailable: nextStatus === 'sold_out' ? 0 : 10
    });
    setSuccessNotice(`Listing marked as ${nextStatus === 'sold_out' ? 'Sold Out' : 'Active'}.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleDeleteListing = (productId: string) => {
    if (window.confirm('Are you sure you want to remove this product listing?')) {
      agriStore.deleteProduct(productId);
      setSuccessNotice('Product listing removed.');
      setTimeout(() => setSuccessNotice(null), 4000);
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

      {/* Main Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EBF3ED] text-[#214E34] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#CFD7CA]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#367C46]" />
            <span>National Agricultural Marketplace Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#214E34] tracking-tight">
            SMART-AGRI KENYA Marketplace
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#68756A] max-w-2xl leading-relaxed">
            Direct agricultural trade connecting farmers, buyers, breeders, agrovets, and cooperatives across all 47 counties in Kenya.
          </p>
        </div>

        {/* Action Buttons: Sell on Marketplace & My Listings */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowMyListingsOnly(!showMyListingsOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              showMyListingsOnly 
                ? 'bg-[#214E34] text-white border-[#214E34]' 
                : 'bg-white hover:bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#367C46]" />
            <span>{showMyListingsOnly ? 'Show All Listings' : 'My Listings'} ({myListings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSellModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Sell on Marketplace</span>
          </button>
        </div>
      </div>

      {/* DEDICATED CATEGORY GATEWAY PORTAL CARDS */}
      {/* Enables users to open the dedicated pages for each category without a four-tab row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-bold text-[#214E34] flex items-center gap-2">
            <span>Explore Dedicated Marketplaces</span>
            <span className="text-xs font-normal text-[#68756A]">(Click to open dedicated category page)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Crops & Produce */}
          <div
            onClick={() => handleOpenDedicatedPage('crops')}
            className="bg-white rounded-2xl border border-[#E2E7DE] hover:border-[#367C46] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-36 w-full overflow-hidden bg-[#F7F6F0]">
                <img
                  src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80"
                  alt="Harvested Kenyan Crops and Produce"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs text-[#214E34] flex items-center justify-center shadow-xs">
                  <Sprout className="w-4 h-4 text-[#367C46]" />
                </div>
                <span className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-white bg-[#214E34]/90 px-2.5 py-0.5 rounded shadow-xs">
                  {cropsCount} Crop Listings
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-extrabold text-base text-[#214E34] group-hover:text-[#183C27] mb-1.5 flex items-center justify-between">
                  <span>Crops & Produce</span>
                  <span className="text-xs text-[#367C46] font-semibold">Dedicated Page →</span>
                </h3>
                <p className="text-xs text-[#68756A] leading-relaxed">
                  Organized by crop type: browse all varieties of Beans (Rosecoco, Nyayo), Maize (H614, H6213), Potatoes (Shangi, Tigoni), Tomatoes (Anna F1, Kilele F1), and Rice.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between text-xs font-bold text-[#367C46] group-hover:text-[#214E34]">
                <span>Explore Crops & Varieties</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: Livestock & Cattle */}
          <div
            onClick={() => handleOpenDedicatedPage('livestock')}
            className="bg-white rounded-2xl border border-[#E2E7DE] hover:border-[#367C46] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-36 w-full overflow-hidden bg-[#F7F6F0]">
                <img
                  src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80"
                  alt="Kenyan Pedigree Dairy Cattle & Livestock"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs text-[#214E34] flex items-center justify-center shadow-xs">
                  <Beef className="w-4 h-4 text-[#367C46]" />
                </div>
                <span className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-white bg-[#214E34]/90 px-2.5 py-0.5 rounded shadow-xs">
                  {livestockCount} Animals
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-extrabold text-base text-[#214E34] group-hover:text-[#183C27] mb-1.5 flex items-center justify-between">
                  <span>Livestock & Cattle</span>
                  <span className="text-xs text-[#367C46] font-semibold">Dedicated Page →</span>
                </h3>
                <p className="text-xs text-[#68756A] leading-relaxed">
                  Verified dairy cows (Friesian, Ayrshire), beef bulls, improved KALRO Kienyeji chickens, Dorper sheep, Boer goats, pigs, and fingerlings with veterinary cards.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between text-xs font-bold text-[#367C46] group-hover:text-[#214E34]">
                <span>Explore Livestock Marketplace</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: Farm Inputs & Tools */}
          <div
            onClick={() => handleOpenDedicatedPage('inputs')}
            className="bg-white rounded-2xl border border-[#E2E7DE] hover:border-[#367C46] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-36 w-full overflow-hidden bg-[#F7F6F0]">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80"
                  alt="Certified Farm Inputs and Supplies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs text-[#214E34] flex items-center justify-center shadow-xs">
                  <Package className="w-4 h-4 text-[#367C46]" />
                </div>
                <span className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-white bg-[#214E34]/90 px-2.5 py-0.5 rounded shadow-xs">
                  {inputsCount} Supplies
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-extrabold text-base text-[#214E34] group-hover:text-[#183C27] mb-1.5 flex items-center justify-between">
                  <span>Farm Inputs & Tools</span>
                  <span className="text-xs text-[#367C46] font-semibold">Dedicated Page →</span>
                </h3>
                <p className="text-xs text-[#68756A] leading-relaxed">
                  KEPHIS certified seed maize, DAP and CAN fertilizers, PCPB crop protection, animal feeds, solar borehole pumps, knapsack sprayers, and drip irrigation kits.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between text-xs font-bold text-[#367C46] group-hover:text-[#214E34]">
                <span>Explore Inputs & Tools</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 4: Market Prices */}
          <div
            onClick={() => handleOpenDedicatedPage('market-prices')}
            className="bg-white rounded-2xl border border-[#E2E7DE] hover:border-[#367C46] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-36 w-full overflow-hidden bg-[#F7F6F0]">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80"
                  alt="Agricultural Wholesale Commodity Market"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs text-[#214E34] flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-4 h-4 text-[#367C46]" />
                </div>
                <span className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-white bg-[#D6A545] px-2.5 py-0.5 rounded shadow-xs">
                  Live Commodity Trends
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-extrabold text-base text-[#214E34] group-hover:text-[#183C27] mb-1.5 flex items-center justify-between">
                  <span>Market Prices Intelligence</span>
                  <span className="text-xs text-[#367C46] font-semibold">Dedicated Page →</span>
                </h3>
                <p className="text-xs text-[#68756A] leading-relaxed">
                  Price intelligence distinguishing verified market observations, seller asking prices, and historical trends across Wakulima, Kongowea, and county markets.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between text-xs font-bold text-[#367C46] group-hover:text-[#214E34]">
                <span>View Price Intelligence</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ALL AGRICULTURAL LISTINGS & DISCOVERY SECTION */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-[#214E34]">
            Browse All Marketplace Listings ({displayedProducts.length})
          </h2>
          <span className="text-xs text-[#68756A]">Direct Farmer Gate & Wholesale Delivery</span>
        </div>

        {/* Search Bar */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#68756A]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all categories (e.g. Dry Maize, Kienyeji Chickens, DAP Fertilizer, Solar Pump, Nakuru)..."
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-[#E2E7DE] text-[#252D27] placeholder:text-[#68756A] text-xs sm:text-sm rounded-lg focus:outline-none focus:border-[#367C46] focus:ring-1 focus:ring-[#367C46] shadow-xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#68756A] hover:text-[#252D27] cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dedicated Filter Panel */}
        <MarketplaceFilterBar
          category={category}
          productType={productType}
          varietyOrBreed={varietyOrBreed}
          location={location}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortBy={sortBy}
          maxAgeMonths={maxAgeMonths}
          livestockPurpose={livestockPurpose}
          livestockSex={livestockSex}
          deliveryOption={deliveryOption}
          qualityGrade={qualityGrade}
          availableProductTypes={availableProductTypes}
          availableVarieties={availableVarieties}
          isVarietyEnabled={isVarietyEnabled}
          activeFilterCount={activeFilterCount}
          activeFilterTags={activeFilterTags}
          totalCount={displayedProducts.length}
          onSelectCategory={setCategory}
          onSelectProductType={setProductType}
          onSelectVarietyOrBreed={setVarietyOrBreed}
          onSelectLocation={setLocation}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onSortChange={setSortBy}
          onMaxAgeMonthsChange={setMaxAgeMonths}
          onLivestockPurposeChange={setLivestockPurpose}
          onLivestockSexChange={setLivestockSex}
          onDeliveryOptionChange={setDeliveryOption}
          onQualityGradeChange={setQualityGrade}
          onResetFilters={resetFilters}
          onClearFilter={clearFilter}
        />

        {/* Product Listings Display */}
        <div>
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className="relative group flex flex-col justify-between">
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1, 'delivery')}
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
                      <span>Send Inquiry</span>
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

                  {/* Seller Quick Management controls if viewing My Listings */}
                  {showMyListingsOnly && (
                    <div className="mt-2 p-2 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#252D27]">Manage Listing</span>
                        <button
                          onClick={() => handleToggleListingStatus(product)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                            product.status === 'active' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {product.status === 'active' ? 'Mark Sold Out' : 'Mark In Stock'}
                        </button>
                      </div>

                      {editingPriceId === product.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editPriceValue}
                            onChange={(e) => setEditPriceValue(e.target.value)}
                            className="w-20 bg-white border border-[#E2E7DE] px-1.5 py-0.5 rounded text-xs"
                          />
                          <button
                            onClick={() => handleUpdateListingPrice(product.id)}
                            className="bg-[#367C46] text-white p-1 rounded hover:bg-[#2B6437]"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="text-[#68756A] p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[#68756A]">Price: KSh {product.priceKsh}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingPriceId(product.id);
                                setEditPriceValue(String(product.priceKsh));
                              }}
                              className="text-[#367C46] hover:underline flex items-center gap-0.5 text-[11px]"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteListing(product.id)}
                              className="text-red-600 hover:underline flex items-center gap-0.5 text-[11px]"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E2E7DE] p-8 sm:p-10 text-center max-w-xl mx-auto shadow-xs my-6">
              <div className="w-12 h-12 rounded-lg bg-[#FCF8EE] text-[#D6A545] mx-auto flex items-center justify-center mb-3 border border-[#E2E7DE]">
                <PackageOpen className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-[#214E34] mb-1.5">
                No matching agricultural listings found
              </h3>
              <p className="text-[#68756A] text-xs sm:text-sm mb-5 max-w-md mx-auto">
                We couldn't find any products matching your active filters. Try broadening the price or location filter, or clearing filters.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSellModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#F7F6F0] hover:bg-white text-[#252D27] border border-[#E2E7DE] font-semibold text-xs px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-[#367C46]" />
                  <span>List Product for Sale</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Internal Product Detail Modal */}
      {modalProduct && !propOnViewProduct && (
        <ProductDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={(p, qty, delivery) => {
            handleAddToCart(p, qty, delivery);
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

      {/* Category-Specific Multi-step Product Posting Modal with Live Preview */}
      <MarketplacePostModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        defaultCounty={userCounty}
        onSuccess={(product) => {
          setSuccessNotice(`"${product.title}" has been successfully listed on SMART-AGRI Kenya!`);
          setTimeout(() => setSuccessNotice(null), 6000);
        }}
      />

      {/* Product Inquiry / Contact Seller Modal */}
      <ProductInquiryModal
        product={inquiryProduct}
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        onSuccess={() => {
          setSuccessNotice('Inquiry submitted to seller.');
          setTimeout(() => setSuccessNotice(null), 4000);
        }}
      />

      {/* Product Report Modal */}
      <ProductReportModal
        product={reportProduct}
        isOpen={!!reportProduct}
        onClose={() => setReportProduct(null)}
      />
    </div>
  );
};
