import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  MapPin, 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  CheckCircle2, 
  X, 
  ChevronRight,
  PackageOpen,
  MessageSquare,
  Flag,
  Wrench,
  Check,
  ArrowRight
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { ProductDetailModal } from '../components/marketplace/ProductDetailModal';
import { MarketplacePostModal } from '../components/marketplace/MarketplacePostModal';
import { ProductInquiryModal } from '../components/marketplace/ProductInquiryModal';
import { ProductReportModal } from '../components/marketplace/ProductReportModal';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface FarmInputsPageProps {
  products: Product[];
  onViewProduct?: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number, delivery?: 'pickup' | 'delivery') => void;
  userCounty?: string;
  onNavigateTab?: (tab: string) => void;
}

export const FarmInputsPage: React.FC<FarmInputsPageProps> = ({
  products,
  onViewProduct: propOnViewProduct,
  onAddToCart,
  userCounty = 'Nakuru',
  onNavigateTab,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'stock'>('newest');

  // Modals state
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [reportProduct, setReportProduct] = useState<Product | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // STRICT FILTER: Only inputs, equipment & fodder!
  const inputProducts = useMemo(() => {
    return products.filter(p => p.category === 'inputs' || p.category === 'equipment' || p.category === 'fodder');
  }, [products]);

  // Extract available brands
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    inputProducts.forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [inputProducts]);

  const subcategories = [
    { id: 'all', label: 'All Inputs & Supplies' },
    { id: 'seeds', label: 'Certified Seeds' },
    { id: 'fertilizer', label: 'Fertilizers & Nutrients' },
    { id: 'chemicals', label: 'Crop Protection & PCPB' },
    { id: 'feeds', label: 'Animal Feeds & Fodder' },
    { id: 'irrigation', label: 'Irrigation & Solar Pumps' },
    { id: 'tools', label: 'Machinery & Tools' },
  ];

  const filtered = useMemo(() => {
    let result = inputProducts.filter((p) => {
      // Subcategory filtering
      if (selectedSubcategory === 'seeds') {
        const isSeed = p.subcategory.toLowerCase().includes('seed') || (p.productType && p.productType.toLowerCase().includes('seed'));
        if (!isSeed) return false;
      } else if (selectedSubcategory === 'fertilizer') {
        const isFert = p.subcategory.toLowerCase().includes('fertilizer') || (p.productType && p.productType.toLowerCase().includes('fertilizer'));
        if (!isFert) return false;
      } else if (selectedSubcategory === 'chemicals') {
        const isChem = p.subcategory.toLowerCase().includes('chem') || p.subcategory.toLowerCase().includes('protection') || p.subcategory.toLowerCase().includes('pesticide');
        if (!isChem) return false;
      } else if (selectedSubcategory === 'feeds') {
        const isFeed = p.subcategory.toLowerCase().includes('feed') || p.category === 'fodder' || p.subcategory.toLowerCase().includes('fodder');
        if (!isFeed) return false;
      } else if (selectedSubcategory === 'irrigation') {
        const isIrrig = p.subcategory.toLowerCase().includes('irrigation') || p.subcategory.toLowerCase().includes('water') || p.title.toLowerCase().includes('drip') || p.title.toLowerCase().includes('pump');
        if (!isIrrig) return false;
      } else if (selectedSubcategory === 'tools') {
        const isTool = p.category === 'equipment' && !p.subcategory.toLowerCase().includes('irrigation');
        if (!isTool) return false;
      }

      if (selectedBrand !== 'all') {
        const matchesBrand = (p.brand || '').toLowerCase().includes(selectedBrand.toLowerCase());
        if (!matchesBrand) return false;
      }

      if (selectedCounty !== 'all' && p.sellerCounty.toLowerCase() !== selectedCounty.toLowerCase()) {
        return false;
      }

      if (selectedApproval !== 'all') {
        const reg = (p.regulatoryApproval || p.certificationInfo || '').toLowerCase();
        if (!reg.includes(selectedApproval.toLowerCase())) return false;
      }

      if (minPrice && p.priceKsh < Number(minPrice)) return false;
      if (maxPrice && p.priceKsh > Number(maxPrice)) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.productType && p.productType.toLowerCase().includes(q)) ||
          (p.formulation && p.formulation.toLowerCase().includes(q)) ||
          p.sellerCounty.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q)
        );
      }

      return true;
    });

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.priceKsh - b.priceKsh);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.priceKsh - a.priceKsh);
    } else if (sortBy === 'stock') {
      result.sort((a, b) => b.quantityAvailable - a.quantityAvailable);
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [inputProducts, selectedSubcategory, selectedBrand, selectedCounty, selectedApproval, minPrice, maxPrice, search, sortBy]);

  const resetAllFilters = () => {
    setSearch('');
    setSelectedSubcategory('all');
    setSelectedBrand('all');
    setSelectedCounty('all');
    setSelectedApproval('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const isAnyFilterActive = 
    search !== '' ||
    selectedSubcategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedCounty !== 'all' ||
    selectedApproval !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '';

  const handleViewDetails = (item: Product) => {
    if (propOnViewProduct) {
      propOnViewProduct(item);
    } else {
      setModalProduct(item);
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
        <span className="text-[#214E34] font-bold">Farm Inputs & Tools</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EBF3ED] text-[#214E34] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#CFD7CA]">
              <Package className="w-3.5 h-3.5 text-[#367C46]" />
              <span>Dedicated Agricultural Supplies & Inputs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
              Certified Farm Inputs, Tools & Equipment
            </h1>
            <p className="text-xs sm:text-sm text-[#68756A] mt-1.5 max-w-2xl leading-relaxed">
              Order KEPHIS-certified seeds (H614D, Simlaw), authorized DAP and CAN fertilizers, PCPB crop protection, balanced animal feeds, solar borehole pumps, knapsack sprayers, and drip irrigation kits delivered directly to your farm.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsSellModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List Inputs & Tools</span>
            </button>
          </div>
        </div>

        {/* Subcategories */}
        <div className="mt-5 pt-4 border-t border-[#E2E7DE] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {subcategories.map((cat) => {
            const isSelected = selectedSubcategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedSubcategory(cat.id)}
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

      {/* Advanced Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7DE] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search */}
          <div className="sm:col-span-4 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#68756A] shrink-0" />
            <input
              type="text"
              placeholder="Search DAP, seed maize, sprayers, solar pump..."
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

          {/* Brand */}
          <div className="sm:col-span-3 flex items-center gap-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg px-3 py-2">
            <span className="text-[#68756A] font-semibold">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-transparent text-[#252D27] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* County */}
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
              <option value="stock">Stock Available</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters: Regulatory Approval & Price Range */}
        <div className="pt-2 border-t border-[#E2E7DE] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#68756A] font-semibold">Approval:</span>
              {[
                { label: 'All Regulatory', value: 'all' },
                { label: 'KEPHIS Certified', value: 'KEPHIS' },
                { label: 'PCPB Registered', value: 'PCPB' },
                { label: 'KEBS Standard', value: 'KEBS' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedApproval(item.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                    selectedApproval === item.value
                      ? 'bg-[#367C46] text-white border-[#367C46]'
                      : 'bg-[#F7F6F0] text-[#252D27] border-[#E2E7DE] hover:bg-white'
                  }`}
                >
                  {item.label}
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

      {/* Inputs Organized by Product Type Sections */}
      <div className="space-y-10">
        {selectedSubcategory === 'all' && search === '' && selectedBrand === 'all' && selectedCounty === 'all' && selectedApproval === 'all' && !minPrice && !maxPrice ? (
          // Grouped sections view
          [
            { id: 'seeds', title: 'Certified Seeds & Seedlings', icon: '🌱', desc: 'KEPHIS certified hybrid maize seeds (H614D, Simlaw), sorghum, vegetable seeds & seedlings', filter: (p: Product) => p.subcategory?.toLowerCase().includes('seed') || p.productType?.toLowerCase().includes('seed') },
            { id: 'fertilizer', title: 'Fertilizers & Soil Amendments', icon: '🧪', desc: 'KEBS approved DAP (18:46:0), CAN, enriched organic compost, and foliar feeds', filter: (p: Product) => p.subcategory?.toLowerCase().includes('fertilizer') || p.productType?.toLowerCase().includes('fertilizer') },
            { id: 'chemicals', title: 'Crop Protection & Bio-Pesticides', icon: '🛡️', desc: 'PCPB registered bio-pesticides, fungicides, herbicides and organic pest sprays', filter: (p: Product) => p.subcategory?.toLowerCase().includes('chem') || p.subcategory?.toLowerCase().includes('protection') || p.productType?.toLowerCase().includes('protection') || p.subcategory?.toLowerCase().includes('pesticide') },
            { id: 'feeds', title: 'Animal Feeds & Fodder Nutrition', icon: '🌾', desc: 'High-yield 16% dairy meal, layers mash, chick starter, and baled protein hay', filter: (p: Product) => p.subcategory?.toLowerCase().includes('feed') || p.category === 'fodder' || p.productType?.toLowerCase().includes('feed') || p.subcategory?.toLowerCase().includes('fodder') },
            { id: 'irrigation', title: 'Irrigation Kits & Solar Water Pumps', icon: '💧', desc: 'Complete 1-acre gravity drip irrigation kits and Dayliff solar submersible borehole pumps', filter: (p: Product) => p.subcategory?.toLowerCase().includes('irrigation') || p.productType?.toLowerCase().includes('pump') || p.title.toLowerCase().includes('pump') || p.title.toLowerCase().includes('drip') },
            { id: 'tools', title: 'Farm Equipment, Tools & Greenhouse Materials', icon: '🚜', desc: 'Automatic poultry bell drinkers, 200-micron greenhouse film, sprayers and hand tools', filter: (p: Product) => p.category === 'equipment' || p.productType?.toLowerCase().includes('poultry') || p.productType?.toLowerCase().includes('greenhouse') || p.subcategory?.toLowerCase().includes('greenhouse') },
          ].map((sec) => {
            const secItems = filtered.filter(sec.filter);
            if (secItems.length === 0) return null;

            return (
              <section key={sec.id} className="bg-white rounded-2xl border border-[#E2E7DE] shadow-xs overflow-hidden">
                <div className="p-5 sm:p-6 bg-gradient-to-r from-white via-[#F7F6F0] to-[#EBF3ED] border-b border-[#E2E7DE] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sec.icon}</span>
                      <h2 className="text-base sm:text-lg font-bold text-[#214E34]">
                        {sec.title}
                      </h2>
                      <span className="text-xs bg-[#367C46] text-white font-bold px-2 py-0.5 rounded-full">
                        {secItems.length} products
                      </span>
                    </div>
                    <p className="text-xs text-[#68756A] mt-1">
                      {sec.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory(sec.id)}
                    className="text-xs text-[#367C46] hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <span>View Section Only</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {secItems.map((item) => (
                    <div key={item.id} className="flex flex-col justify-between">
                      <ProductCard
                        product={item}
                        onViewDetails={handleViewDetails}
                        onAddToCart={(p) => onAddToCart(p, 1, 'delivery')}
                        onContactSeller={(p) => setInquiryProduct(p)}
                      />
                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#68756A] px-1">
                        <button
                          type="button"
                          onClick={() => setInquiryProduct(item)}
                          className="hover:text-[#367C46] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3 text-[#367C46]" />
                          <span>Send Inquiry</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setReportProduct(item)}
                          className="hover:text-red-600 flex items-center gap-1 text-[10px] cursor-pointer"
                        >
                          <Flag className="w-2.5 h-2.5" />
                          <span>Report</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          // Filtered flat grid
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#68756A] font-medium">
                Showing <strong className="text-[#214E34] tabular-nums">{filtered.length}</strong> farm supplies & tools
              </span>
              <span className="text-xs text-[#68756A]">
                Direct delivery or collection from registered agrovets
              </span>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((item) => (
                  <div key={item.id} className="flex flex-col justify-between">
                    <ProductCard
                      product={item}
                      onViewDetails={handleViewDetails}
                      onAddToCart={(p) => onAddToCart(p, 1, 'delivery')}
                      onContactSeller={(p) => setInquiryProduct(p)}
                    />

                    {/* Quick Inquire & Report action row */}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#68756A] px-1">
                      <button
                        type="button"
                        onClick={() => setInquiryProduct(item)}
                        className="hover:text-[#367C46] flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 text-[#367C46]" />
                        <span>Send Inquiry</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportProduct(item)}
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
                  No farm inputs or tools found matching your filters
                </h3>
                <p className="text-[#68756A] text-xs sm:text-sm mb-5 max-w-md mx-auto">
                  We couldn't find any inputs or equipment matching your criteria. Try adjusting your brand or county filter.
                </p>
                <div className="flex justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Input Filters</span>
                  </button>
                </div>
              </div>
            )}
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

      {/* Multi-step Posting Modal */}
      <MarketplacePostModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        defaultCounty={userCounty}
        onSuccess={(product) => {
          setSuccessNotice(`"${product.title}" listed successfully in Farm Inputs & Tools!`);
          setTimeout(() => setSuccessNotice(null), 5000);
        }}
      />

      {/* Inquiry Modal */}
      <ProductInquiryModal
        product={inquiryProduct}
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        onSuccess={() => {
          setSuccessNotice('Inquiry submitted to agrovet/supplier.');
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
