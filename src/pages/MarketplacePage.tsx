import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Store, 
  Plus, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Minus,
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
  ExternalLink,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight,
  Phone
} from 'lucide-react';
import { Product, MarketPriceRecord } from '../types';
import { agriStore } from '../services/store';
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
  initialCategory?: string;
  userCounty?: string;
  onNavigateTab?: (tab: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  products: propProducts,
  onViewProduct: propOnViewProduct,
  onAddToCart: propOnAddToCart,
  initialSearchQuery = '',
  userCounty = 'Nakuru',
  onNavigateTab,
}) => {
  // Store products & market prices
  const [storeProducts, setStoreProducts] = useState<Product[]>(() => agriStore.getProducts());
  const [marketPrices, setMarketPrices] = useState<MarketPriceRecord[]>(() => agriStore.getMarketPrices());
  const currentUser = agriStore.getCurrentUser();

  useEffect(() => {
    const unsubscribe = agriStore.subscribe(() => {
      setStoreProducts(agriStore.getProducts());
      setMarketPrices(agriStore.getMarketPrices());
    });
    return unsubscribe;
  }, []);

  const allProducts = propProducts || storeProducts;

  // Search state
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

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

  // Counts for each dedicated category
  const cropsProducts = useMemo(() => allProducts.filter(p => p.category === 'crops'), [allProducts]);
  const livestockProducts = useMemo(() => allProducts.filter(p => p.category === 'livestock'), [allProducts]);
  const inputsProducts = useMemo(() => allProducts.filter(p => p.category === 'inputs' || p.category === 'equipment' || p.category === 'fodder'), [allProducts]);

  // Handle direct navigation to dedicated category pages
  const handleOpenDedicatedPage = (tabId: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    } else if (typeof window !== 'undefined') {
      window.location.hash = tabId;
    }
  };

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

  // Seller Listings management
  const myListings = allProducts.filter(p => p.sellerId === currentUser?.id || p.sellerName === currentUser?.name);

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

  // Search Match Counts across the 4 domains
  const searchResultsCount = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    
    const cropMatches = cropsProducts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.variety && p.variety.toLowerCase().includes(q)) ||
      (p.productType && p.productType.toLowerCase().includes(q)) ||
      p.sellerCounty.toLowerCase().includes(q)
    ).length;

    const livestockMatches = livestockProducts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.livestockDetails?.breed && p.livestockDetails.breed.toLowerCase().includes(q)) ||
      (p.livestockDetails?.animalType && p.livestockDetails.animalType.toLowerCase().includes(q)) ||
      p.sellerCounty.toLowerCase().includes(q)
    ).length;

    const inputMatches = inputsProducts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.productType && p.productType.toLowerCase().includes(q)) ||
      p.sellerCounty.toLowerCase().includes(q)
    ).length;

    const priceMatches = marketPrices.filter(m =>
      (m.commodityName && m.commodityName.toLowerCase().includes(q)) ||
      (m.variety && m.variety.toLowerCase().includes(q)) ||
      (m.marketName && m.marketName.toLowerCase().includes(q)) ||
      (m.county && m.county.toLowerCase().includes(q))
    ).length;

    return { cropMatches, livestockMatches, inputMatches, priceMatches };
  }, [searchQuery, cropsProducts, livestockProducts, inputsProducts, marketPrices]);

  // Featured slices for each category showcase
  const featuredCrops = useMemo(() => cropsProducts.slice(0, 4), [cropsProducts]);
  const featuredLivestock = useMemo(() => livestockProducts.slice(0, 4), [livestockProducts]);
  const featuredInputs = useMemo(() => inputsProducts.slice(0, 4), [inputsProducts]);
  const topMarketPrices = useMemo(() => marketPrices.slice(0, 5), [marketPrices]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[75vh] space-y-8">
      
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
            <span>{showMyListingsOnly ? 'Show Marketplace Hub' : 'My Listings'} ({myListings.length})</span>
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

      {/* PROMINENT SEARCH BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E7DE] shadow-xs space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#68756A]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by variety (Rosecoco, H614, Shangi, Anna F1), animal breed (Friesian, Kienyeji, Dorper), fertilizer or county..."
            className="w-full pl-11 pr-10 py-3 bg-[#F7F6F0] border border-[#E2E7DE] text-[#252D27] placeholder:text-[#68756A] text-xs sm:text-sm rounded-xl focus:outline-none focus:border-[#367C46] focus:bg-white focus:ring-1 focus:ring-[#367C46] transition"
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

        {/* Dynamic Category Jump Suggestions when typing or searching */}
        {searchResultsCount && (
          <div className="p-3 bg-[#EBF3ED] rounded-xl border border-[#CFD7CA] flex flex-wrap items-center justify-between gap-2.5">
            <div className="text-xs text-[#214E34] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#367C46]" />
              <span>Search results for "{searchQuery}":</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenDedicatedPage('crops')}
                className="px-2.5 py-1 bg-white hover:bg-[#F7F6F0] text-[#214E34] text-xs font-bold rounded-lg border border-[#CFD7CA] flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Sprout className="w-3.5 h-3.5 text-[#367C46]" />
                <span>Crops ({searchResultsCount.cropMatches}) →</span>
              </button>
              <button
                onClick={() => handleOpenDedicatedPage('livestock')}
                className="px-2.5 py-1 bg-white hover:bg-[#F7F6F0] text-[#214E34] text-xs font-bold rounded-lg border border-[#CFD7CA] flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Beef className="w-3.5 h-3.5 text-[#367C46]" />
                <span>Livestock ({searchResultsCount.livestockMatches}) →</span>
              </button>
              <button
                onClick={() => handleOpenDedicatedPage('inputs')}
                className="px-2.5 py-1 bg-white hover:bg-[#F7F6F0] text-[#214E34] text-xs font-bold rounded-lg border border-[#CFD7CA] flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-[#367C46]" />
                <span>Inputs ({searchResultsCount.inputMatches}) →</span>
              </button>
              <button
                onClick={() => handleOpenDedicatedPage('market-prices')}
                className="px-2.5 py-1 bg-white hover:bg-[#F7F6F0] text-[#214E34] text-xs font-bold rounded-lg border border-[#CFD7CA] flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#367C46]" />
                <span>Market Prices ({searchResultsCount.priceMatches}) →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SELLER MANAGEMENT PANEL (Shown when "My Listings" is clicked) */}
      {showMyListingsOnly && (
        <div className="bg-white rounded-2xl border border-[#E2E7DE] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#214E34] flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#367C46]" />
                <span>Your Active Marketplace Listings ({myListings.length})</span>
              </h2>
              <p className="text-xs text-[#68756A] mt-0.5">
                Manage your prices, mark products as in-stock or sold out, and review listing inquiries.
              </p>
            </div>
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#367C46] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2B6437] transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Listing</span>
            </button>
          </div>

          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.map((product) => (
                <div key={product.id} className="p-3.5 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] flex flex-col justify-between gap-3">
                  <div className="flex gap-3">
                    <img 
                      src={product.images[0] || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=200&q=80'} 
                      alt={product.title} 
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#E2E7DE]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded capitalize ${
                          product.status === 'active' ? 'bg-[#EBF3ED] text-[#214E34]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {product.status === 'active' ? 'Active' : 'Sold Out'}
                        </span>
                        <span className="text-[10px] text-[#68756A] truncate">
                          {product.category.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#252D27] truncate mt-1">{product.title}</h4>
                      <p className="text-[11px] text-[#68756A]">{product.sellerCounty} County</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2E7DE] space-y-2">
                    {editingPriceId === product.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editPriceValue}
                          onChange={(e) => setEditPriceValue(e.target.value)}
                          className="w-24 bg-white border border-[#E2E7DE] px-2 py-1 rounded text-xs"
                          placeholder="New Price"
                        />
                        <button
                          onClick={() => handleUpdateListingPrice(product.id)}
                          className="bg-[#367C46] text-white p-1 rounded hover:bg-[#2B6437] cursor-pointer"
                          title="Save price"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingPriceId(null)}
                          className="text-[#68756A] p-1 cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#214E34]">KSh {product.priceKsh.toLocaleString()} / {product.unit}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingPriceId(product.id);
                              setEditPriceValue(String(product.priceKsh));
                            }}
                            className="text-[#367C46] hover:underline flex items-center gap-0.5 text-[11px] cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteListing(product.id)}
                            className="text-red-600 hover:underline flex items-center gap-0.5 text-[11px] cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleToggleListingStatus(product)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                          product.status === 'active' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {product.status === 'active' ? 'Mark Sold Out' : 'Mark Active'}
                      </button>
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-[11px] text-[#367C46] hover:underline font-semibold cursor-pointer"
                      >
                        Preview Listing →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs sm:text-sm text-[#68756A] mb-3">You have not posted any product listings yet.</p>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#367C46] text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-[#2B6437] transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Your First Product Listing</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* THE 4 PRIMARY CATEGORY GATEWAY PORTAL CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#214E34]">
              Main Agricultural Categories
            </h2>
            <p className="text-xs text-[#68756A]">
              Click any category card to open its dedicated page with deep variety grouping, breed filters, and pricing tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Crops & Produce */}
          <div
            onClick={() => handleOpenDedicatedPage('crops')}
            className="bg-white rounded-2xl border border-[#E2E7DE] hover:border-[#367C46] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-40 w-full overflow-hidden bg-[#F7F6F0]">
                <img
                  src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80"
                  alt="Harvested Kenyan Crops and Produce"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-[#214E34] flex items-center justify-center shadow-xs">
                  <Sprout className="w-4 h-4 text-[#367C46]" />
                </div>
                <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white bg-[#214E34]/90 px-2.5 py-0.5 rounded shadow-xs">
                  {cropsProducts.length} Crop Listings
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-extrabold text-base text-[#214E34] group-hover:text-[#183C27] mb-1.5 flex items-center justify-between">
                  <span>Crops & Produce</span>
                  <span className="text-xs text-[#367C46] font-semibold">Open Page →</span>
                </h3>
                <p className="text-xs text-[#68756A] leading-relaxed">
                  Organized by crop type: browse all varieties of Beans (Rosecoco, Nyayo), Maize (H614, H6213), Potatoes (Shangi, Tigoni), Tomatoes (Anna F1), and Rice side-by-side.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between text-xs font-bold text-[#367C46] group-hover:text-[#214E34]">
                <span>Browse All Crops & Varieties</span>
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
              <div className="relative h-40 w-full overflow-hidden bg-[#F7F6F0]">
                <img
                  src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80"
                  alt="Kenyan Pedigree Dairy Cattle & Livestock"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-[#214E34] flex items-center justify-center shadow-xs">
                  <Beef className="w-4 h-4 text-[#367C46]" />
                </div>
                <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white bg-[#214E34]/90 px-2.5 py-0.5 rounded shadow-xs">
                  {livestockProducts.length} Verified Animals
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-extrabold text-base text-[#214E34] group-hover:text-[#183C27] mb-1.5 flex items-center justify-between">
                  <span>Livestock & Cattle</span>
                  <span className="text-xs text-[#367C46] font-semibold">Open Page →</span>
                </h3>
                <p className="text-xs text-[#68756A] leading-relaxed">
                  Verified dairy cows (Friesian, Ayrshire), beef bulls, improved KALRO Kienyeji chickens, Dorper sheep, Boer goats, pigs, and fingerlings with veterinary cards.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between text-xs font-bold text-[#367C46] group-hover:text-[#214E34]">
                <span>Browse Livestock by Animal Type</span>
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
              <div className="relative h-40 w-full overflow-hidden bg-[#F7F6F0]">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80"
                  alt="Certified Farm Inputs and Supplies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-[#214E34] flex items-center justify-center shadow-xs">
                  <Package className="w-4 h-4 text-[#367C46]" />
                </div>
                <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white bg-[#214E34]/90 px-2.5 py-0.5 rounded shadow-xs">
                  {inputsProducts.length} Inputs & Tools
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-extrabold text-base text-[#214E34] group-hover:text-[#183C27] mb-1.5 flex items-center justify-between">
                  <span>Farm Inputs & Tools</span>
                  <span className="text-xs text-[#367C46] font-semibold">Open Page →</span>
                </h3>
                <p className="text-xs text-[#68756A] leading-relaxed">
                  KEPHIS certified seed maize, DAP and CAN fertilizers, PCPB crop protection, animal feeds, solar borehole pumps, knapsack sprayers, and drip irrigation kits.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between text-xs font-bold text-[#367C46] group-hover:text-[#214E34]">
                <span>Browse Farm Supplies & Equipment</span>
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
              <div className="relative h-40 w-full overflow-hidden bg-[#F7F6F0]">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80"
                  alt="Agricultural Wholesale Commodity Market"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-[#214E34] flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-4 h-4 text-[#367C46]" />
                </div>
                <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white bg-[#D6A545] px-2.5 py-0.5 rounded shadow-xs">
                  {marketPrices.length} Live Commodity Observations
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-extrabold text-base text-[#214E34] group-hover:text-[#183C27] mb-1.5 flex items-center justify-between">
                  <span>Market Prices Intelligence</span>
                  <span className="text-xs text-[#367C46] font-semibold">Open Page →</span>
                </h3>
                <p className="text-xs text-[#68756A] leading-relaxed">
                  Price intelligence distinguishing verified market observations, seller asking prices, and historical trends across Wakulima, Kongowea, and county markets.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between text-xs font-bold text-[#367C46] group-hover:text-[#214E34]">
                <span>View Full Market Intelligence</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* DISTINCT CATEGORY SHOWCASES (Cleanly separated — NEVER mixed into a single grid) */}

      {/* 1. Crops & Produce Spotlight */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#214E34] flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#367C46]" />
              <span>Crops & Produce Varieties Showcase</span>
            </h3>
            <p className="text-xs text-[#68756A]">
              Grouped by crop: Rosecoco & Nyayo Beans, Hybrid 614D Maize, Shangi Potatoes & Anna F1 Tomatoes.
            </p>
          </div>
          <button
            onClick={() => handleOpenDedicatedPage('crops')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#367C46] hover:text-[#214E34] transition cursor-pointer self-start sm:self-auto"
          >
            <span>View All Crops & Varieties ({cropsProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCrops.map((product) => (
            <div key={product.id} className="flex flex-col justify-between">
              <ProductCard
                product={product}
                onViewDetails={handleViewProduct}
                onAddToCart={(p) => handleAddToCart(p, 1, 'delivery')}
                onContactSeller={(p) => setInquiryProduct(p)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Livestock & Cattle Showcase */}
      <div className="space-y-4 pt-4 border-t border-[#E2E7DE]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#214E34] flex items-center gap-2">
              <Beef className="w-5 h-5 text-[#367C46]" />
              <span>Livestock & Cattle Showcase</span>
            </h3>
            <p className="text-xs text-[#68756A]">
              Inspected dairy cows, KALRO Kienyeji poultry, and breeding stock with veterinary records.
            </p>
          </div>
          <button
            onClick={() => handleOpenDedicatedPage('livestock')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#367C46] hover:text-[#214E34] transition cursor-pointer self-start sm:self-auto"
          >
            <span>View All Livestock Listings ({livestockProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredLivestock.map((product) => (
            <div key={product.id} className="flex flex-col justify-between">
              <ProductCard
                product={product}
                onViewDetails={handleViewProduct}
                onAddToCart={(p) => handleAddToCart(p, 1, 'delivery')}
                onContactSeller={(p) => setInquiryProduct(p)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Farm Inputs & Tools Essentials */}
      <div className="space-y-4 pt-4 border-t border-[#E2E7DE]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#214E34] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#367C46]" />
              <span>Certified Farm Inputs & Equipment</span>
            </h3>
            <p className="text-xs text-[#68756A]">
              Official KEPHIS seeds, PCPB agrochemicals, solar irrigation pumps & sprayers.
            </p>
          </div>
          <button
            onClick={() => handleOpenDedicatedPage('inputs')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#367C46] hover:text-[#214E34] transition cursor-pointer self-start sm:self-auto"
          >
            <span>View All Farm Inputs ({inputsProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredInputs.map((product) => (
            <div key={product.id} className="flex flex-col justify-between">
              <ProductCard
                product={product}
                onViewDetails={handleViewProduct}
                onAddToCart={(p) => handleAddToCart(p, 1, 'delivery')}
                onContactSeller={(p) => setInquiryProduct(p)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Wholesale Commodity Prices Snapshot */}
      <div className="space-y-4 pt-4 border-t border-[#E2E7DE]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#214E34] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#367C46]" />
              <span>Live Wholesale Commodity Price Benchmarks</span>
            </h3>
            <p className="text-xs text-[#68756A]">
              Observed wholesale transactions from Wakulima (Nairobi), Kongowea (Mombasa), Nakuru & Eldoret.
            </p>
          </div>
          <button
            onClick={() => handleOpenDedicatedPage('market-prices')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#367C46] hover:text-[#214E34] transition cursor-pointer self-start sm:self-auto"
          >
            <span>Open Full Price Intelligence Table →</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E7DE] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F6F0] border-b border-[#E2E7DE] text-[#68756A] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Commodity / Variety</th>
                  <th className="py-3 px-4">Market / County</th>
                  <th className="py-3 px-4">Wholesale Price</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Trend</th>
                  <th className="py-3 px-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7DE]">
                {topMarketPrices.map((record) => (
                  <tr key={record.id} className="hover:bg-[#F7F6F0]/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#252D27]">{record.commodityName}</div>
                      <div className="text-[11px] text-[#68756A]">{record.variety} · {record.unit}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#252D27]">{record.marketName}</div>
                      <div className="text-[11px] text-[#68756A] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#367C46]" />
                        <span>{record.county}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#214E34]">
                      KSh {record.wholesalePriceKsh.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[#252D27]">
                      KSh {record.retailPriceKsh.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {record.trend === 'up' && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <TrendingUp className="w-3.5 h-3.5" /> Rising
                        </span>
                      )}
                      {record.trend === 'down' && (
                        <span className="inline-flex items-center gap-1 text-red-600 font-bold text-[11px]">
                          <TrendingDown className="w-3.5 h-3.5" /> Falling
                        </span>
                      )}
                      {record.trend === 'stable' && (
                        <span className="inline-flex items-center gap-1 text-[#68756A] font-semibold text-[11px]">
                          <Minus className="w-3.5 h-3.5" /> Stable
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[#214E34] bg-[#EBF3ED] px-2 py-0.5 rounded text-[10px] font-bold border border-[#CFD7CA]">
                        <ShieldCheck className="w-3 h-3 text-[#367C46]" />
                        <span>Officer Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-[#F7F6F0] border-t border-[#E2E7DE] flex items-center justify-between text-xs text-[#68756A]">
            <span>Updated daily at morning market opening</span>
            <button
              onClick={() => handleOpenDedicatedPage('market-prices')}
              className="text-[#367C46] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all {marketPrices.length} market records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
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
