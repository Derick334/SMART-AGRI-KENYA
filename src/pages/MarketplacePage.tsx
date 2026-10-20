import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Store, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  ShoppingBag,
  SlidersHorizontal,
  PackageOpen,
  CheckCircle2,
  Phone,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { agriStore } from '../services/store';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { 
  MarketplaceCategory, 
  CATEGORY_PRODUCT_TYPES, 
  VARIETIES_BY_PRODUCT_TYPE 
} from '../data/marketplaceTaxonomy';
import { useMarketplaceFilters } from '../hooks/useMarketplaceFilters';
import { MarketplaceFilterBar } from '../components/marketplace/MarketplaceFilterBar';
import { ProductCard } from '../components/marketplace/ProductCard';
import { ProductDetailModal } from '../components/marketplace/ProductDetailModal';

interface MarketplacePageProps {
  products?: Product[];
  onViewProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number, delivery?: 'pickup' | 'delivery') => void;
  initialSearchQuery?: string;
  initialCategory?: MarketplaceCategory;
  userCounty?: string;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  products: propProducts,
  onViewProduct: propOnViewProduct,
  onAddToCart: propOnAddToCart,
  initialSearchQuery = '',
  initialCategory = 'all',
  userCounty = 'Nakuru',
}) => {
  // Store products fallback if not provided via props
  const [storeProducts, setStoreProducts] = useState<Product[]>(() => agriStore.getProducts());

  useEffect(() => {
    if (!propProducts) {
      const unsubscribe = agriStore.subscribe(() => {
        setStoreProducts(agriStore.getProducts());
      });
      return unsubscribe;
    }
  }, [propProducts]);

  const allProducts = propProducts || storeProducts;

  // useMarketplaceFilters hook managing all filter, category, variety, location & price states
  const {
    category,
    productType,
    varietyOrBreed,
    location,
    minPrice,
    maxPrice,
    searchQuery,
    sortBy,
    setCategory,
    setProductType,
    setVarietyOrBreed,
    setLocation,
    setMinPrice,
    setMaxPrice,
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
    filteredProducts,
    totalCount,
  } = useMarketplaceFilters(allProducts, initialCategory, initialSearchQuery);

  // Modal states
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellSuccessNotice, setSellSuccessNotice] = useState<string | null>(null);

  // New product form state for "Sell Your Products" modal
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('crops');
  const [newProductType, setNewProductType] = useState('Maize');
  const [newVariety, setNewVariety] = useState('');
  const [newCounty, setNewCounty] = useState(userCounty || 'Nakuru');
  const [newPrice, setNewPrice] = useState('');
  const [newUnit, setNewUnit] = useState('90kg bag');
  const [newQuantity, setNewQuantity] = useState('20');
  const [newDescription, setNewDescription] = useState('');
  const [newSellerName, setNewSellerName] = useState('Rongai Valley Mixed Farm');
  const [newSellerPhone, setNewSellerPhone] = useState('0722123456');

  // Handle viewing product
  const handleViewProduct = (product: Product) => {
    if (propOnViewProduct) {
      propOnViewProduct(product);
    } else {
      setModalProduct(product);
    }
  };

  // Handle add to cart
  const handleAddToCart = (product: Product, quantity = 1, delivery: 'pickup' | 'delivery' = 'delivery') => {
    if (propOnAddToCart) {
      propOnAddToCart(product, quantity, delivery);
    } else {
      agriStore.addToCart(product, quantity, delivery);
    }
  };

  // Handle product listing submission
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    const created = agriStore.addProduct({
      title: newTitle.trim(),
      description: newDescription.trim() || `High quality ${newVariety || newProductType} from verified farm in ${newCounty}. Ready for immediate dispatch.`,
      category: newCategory,
      subcategory: newCategory === 'crops' ? 'Cereals & Produce' : newCategory === 'livestock' ? 'Livestock' : 'Farm Inputs',
      productType: newProductType,
      variety: newVariety.trim() || undefined,
      priceKsh: Number(newPrice),
      unit: newUnit,
      quantityAvailable: Number(newQuantity) || 1,
      minimumOrder: 1,
      sellerId: 'usr-farmer-01',
      sellerName: newSellerName.trim() || 'Verified Kenyan Farmer',
      sellerPhone: newSellerPhone.trim() || '0722123456',
      sellerCounty: newCounty,
      sellerSubCounty: 'Central',
      images: [
        newCategory === 'crops' 
          ? 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80'
          : newCategory === 'livestock'
          ? 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
      ],
      isVerifiedSeller: true,
      rating: 5.0,
      reviewsCount: 1,
      deliveryOptions: ['pickup', 'carrier_dispatch'],
      status: 'active',
    });

    setIsSellModalOpen(false);
    setSellSuccessNotice(`"${created.title}" successfully listed on SMART-AGRI Kenya Marketplace!`);
    setTimeout(() => setSellSuccessNotice(null), 5000);

    // Reset form fields
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setNewVariety('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]">
      {/* Listing success alert */}
      {sellSuccessNotice && (
        <div className="mb-6 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] rounded-lg p-3.5 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{sellSuccessNotice}</p>
          </div>
          <button 
            onClick={() => setSellSuccessNotice(null)}
            className="text-[#214E34] hover:bg-[#DCECE0] rounded p-1 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EBF3ED] text-[#214E34] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#CFD7CA]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#367C46]" />
            <span>Verified Agri-Trading Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#214E34] tracking-tight">
            Kenya Agricultural Marketplace
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#68756A] max-w-2xl leading-relaxed">
            Discover quality farm produce, livestock, seeds, fertilizers and equipment from farmers and agricultural suppliers across Kenya.
          </p>
        </div>

        {/* Sell Button CTA */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setIsSellModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Sell Your Products</span>
          </button>
        </div>
      </div>

      {/* Prominent Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#68756A]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop, livestock breed, seeds, equipment or county (e.g. H614 Maize, Friesian, Shangi, Drip Kit)..."
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

      {/* Dedicated Filter Panel immediately below heading & search bar and above product listings */}
      <MarketplaceFilterBar
        category={category}
        productType={productType}
        varietyOrBreed={varietyOrBreed}
        location={location}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sortBy={sortBy}
        availableProductTypes={availableProductTypes}
        availableVarieties={availableVarieties}
        isVarietyEnabled={isVarietyEnabled}
        activeFilterCount={activeFilterCount}
        activeFilterTags={activeFilterTags}
        totalCount={totalCount}
        onSelectCategory={setCategory}
        onSelectProductType={setProductType}
        onSelectVarietyOrBreed={setVarietyOrBreed}
        onSelectLocation={setLocation}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onSortChange={setSortBy}
        onResetFilters={resetFilters}
        onClearFilter={clearFilter}
      />

      {/* Products Display Section */}
      <div className="mt-6">
        {totalCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewProduct}
                onAddToCart={(p) => handleAddToCart(p, 1, 'delivery')}
                onContactSeller={(p) => {
                  window.location.href = `tel:${p.sellerPhone}`;
                }}
              />
            ))}
          </div>
        ) : (
          /* Clean Empty Results State */
          <div className="bg-white rounded-xl border border-[#E2E7DE] p-8 sm:p-10 text-center max-w-xl mx-auto shadow-xs my-6">
            <div className="w-12 h-12 rounded-lg bg-[#FCF8EE] text-[#D6A545] mx-auto flex items-center justify-center mb-3 border border-[#E2E7DE]">
              <PackageOpen className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-bold text-[#214E34] mb-1.5">
              No matching agricultural products found
            </h3>
            <p className="text-[#68756A] text-xs sm:text-sm mb-5 max-w-md mx-auto">
              We couldn't find any listings matching your active filters. Try adjusting your search query, broadening the price range, or clearing filters.
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

      {/* Internal Product Detail Modal if not opened in global App state */}
      {modalProduct && !propOnViewProduct && (
        <ProductDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={(p, qty, delivery) => {
            handleAddToCart(p, qty, delivery);
            setModalProduct(null);
          }}
          userCounty={userCounty}
        />
      )}

      {/* Sell Your Products Modal */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#E2E7DE] relative animate-in fade-in duration-200">
            <button
              onClick={() => setIsSellModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center transition cursor-pointer border border-[#E2E7DE]"
              aria-label="Close modal"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#EBF3ED] text-[#214E34] flex items-center justify-center border border-[#CFD7CA]">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#214E34]">List Your Agricultural Product</h3>
                <p className="text-xs text-[#68756A]">Direct trade with verified buyers across Kenya</p>
              </div>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#252D27] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified Seed Maize H614 or Grade 1 Rosecoco Beans"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252D27] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      setNewCategory(cat);
                      if (cat === 'crops') setNewProductType('Maize');
                      else if (cat === 'livestock') setNewProductType('Dairy cattle');
                      else setNewProductType('Certified seeds');
                    }}
                    className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  >
                    <option value="crops">Crops & Produce</option>
                    <option value="livestock">Livestock & Cattle</option>
                    <option value="inputs">Seeds & Fertilizers</option>
                    <option value="equipment">Farm Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252D27] mb-1">Product Type</label>
                  <input
                    type="text"
                    required
                    value={newProductType}
                    onChange={(e) => setNewProductType(e.target.value)}
                    placeholder="e.g. Maize, Beans, Dairy cow"
                    className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252D27] mb-1">Variety or Breed</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    placeholder="e.g. H614, Friesian, Shangi"
                    className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252D27] mb-1">County Location</label>
                  <select
                    value={newCounty}
                    onChange={(e) => setNewCounty(e.target.value)}
                    className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  >
                    {KENYA_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>{c.name} County</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252D27] mb-1">Price (KSh)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 3600"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252D27] mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="90kg bag, kg, head"
                    className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252D27] mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252D27] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details on quality, grade, moisture content, packaging or health status..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252D27] mb-1">Seller Name</label>
                  <input
                    type="text"
                    required
                    value={newSellerName}
                    onChange={(e) => setNewSellerName(e.target.value)}
                    className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252D27] mb-1">Seller Phone</label>
                  <input
                    type="tel"
                    required
                    value={newSellerPhone}
                    onChange={(e) => setNewSellerPhone(e.target.value)}
                    className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSellModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm font-semibold hover:bg-[#F7F6F0] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
