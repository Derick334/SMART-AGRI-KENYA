import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/checkout/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { LivestockDetailModal } from './components/livestock/LivestockDetailModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CropsPage } from './pages/CropsPage';
import { LivestockPage } from './pages/LivestockPage';
import { FarmInputsPage } from './pages/FarmInputsPage';
import { SoilTestingPage } from './pages/SoilTestingPage';
import { PestDiagnosisPage } from './pages/PestDiagnosisPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { WeatherPage } from './pages/WeatherPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { CommunityPage } from './pages/CommunityPage';
import { ExpertConsultationPage } from './pages/ExpertConsultationPage';
import { OrdersPage } from './pages/OrdersPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

import { Product, CartItem, Order } from './types';
import { agriStore } from './services/store';

export default function App() {
  // Sync initial tab from URL hash if provided (e.g. #marketplace)
  const getInitialTab = (): string => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validTabs = [
        'home', 'marketplace', 'crops', 'livestock', 'inputs', 
        'soil-testing', 'pest-diagnosis', 'market-prices', 'weather', 
        'ai-assistant', 'irrigation', 'community', 'experts', 
        'orders', 'dashboard', 'about', 'contact', 'auth', 'admin'
      ];
      if (hash && validTabs.includes(hash)) return hash;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && validTabs.includes(tabParam.toLowerCase())) return tabParam.toLowerCase();
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [selectedCounty, setSelectedCounty] = useState('Nakuru');
  const [products, setProducts] = useState<Product[]>(agriStore.getProducts());
  const [cart, setCart] = useState<CartItem[]>(agriStore.getCart());
  const [marketplaceSearch, setMarketplaceSearch] = useState<string>('');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keep activeTab in sync with browser hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      window.location.hash = tabId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const syncState = () => {
      setProducts(agriStore.getProducts());
      setCart(agriStore.getCart());
    };
    return agriStore.subscribe(syncState);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add to cart handler
  const handleAddToCart = (product: Product, quantity: number = 1, deliveryPreference: 'pickup' | 'delivery' = 'delivery') => {
    agriStore.addToCart(product, quantity, deliveryPreference);
    showToast(`Added ${quantity} ${product.unit}(s) of "${product.title}" to cart!`);
  };

  // Handle Order Success
  const handleOrderSuccess = (order: Order) => {
    showToast(`Order #${order.orderNumber} placed successfully with M-Pesa escrow protection!`);
    handleSelectTab('orders');
  };

  const handleHomeSearch = (query: string) => {
    setMarketplaceSearch(query);
    handleSelectTab('marketplace');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#252D27] flex flex-col font-sans selection:bg-[#367C46] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#214E34] text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl border border-[#367C46] flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-[#D6A545] shrink-0"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCounty={selectedCounty}
        onSelectCounty={setSelectedCounty}
      />

      {/* Tab Pages Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            products={products}
            onSelectTab={handleSelectTab}
            onViewProduct={setViewingProduct}
            onAddToCart={handleAddToCart}
            selectedCounty={selectedCounty}
            onSelectCounty={setSelectedCounty}
            onSearchMarketplace={handleHomeSearch}
          />
        )}

        {/* Kenya Agricultural Marketplace Route */}
        {activeTab === 'marketplace' && (
          <MarketplacePage
            products={products}
            onViewProduct={setViewingProduct}
            onAddToCart={handleAddToCart}
            initialSearchQuery={marketplaceSearch}
            userCounty={selectedCounty}
          />
        )}

        {/* Crops & Produce Page */}
        {activeTab === 'crops' && (
          <CropsPage
            products={products}
            onViewProduct={setViewingProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Livestock & Cattle Page */}
        {activeTab === 'livestock' && (
          <LivestockPage
            products={products}
            onViewProduct={setViewingProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Farm Inputs Page */}
        {activeTab === 'inputs' && (
          <FarmInputsPage
            products={products}
            onViewProduct={setViewingProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'soil-testing' && (
          <SoilTestingPage />
        )}

        {activeTab === 'pest-diagnosis' && (
          <PestDiagnosisPage />
        )}

        {activeTab === 'market-prices' && (
          <MarketPricesPage />
        )}

        {activeTab === 'weather' && (
          <WeatherPage
            selectedCounty={selectedCounty}
            onSelectCounty={setSelectedCounty}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <AiAssistantPage
            selectedCounty={selectedCounty}
            onSelectCounty={setSelectedCounty}
          />
        )}

        {activeTab === 'irrigation' && (
          <IrrigationPage />
        )}

        {activeTab === 'community' && (
          <CommunityPage />
        )}

        {activeTab === 'experts' && (
          <ExpertConsultationPage />
        )}

        {activeTab === 'orders' && (
          <OrdersPage />
        )}

        {activeTab === 'dashboard' && (
          <FarmerDashboardPage />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}

        {activeTab === 'contact' && (
          <ContactPage />
        )}

        {activeTab === 'auth' && (
          <AuthPage
            onSuccess={(role) => {
              if (role === 'admin') setActiveTab('admin');
              else if (role === 'farmer') setActiveTab('dashboard');
              else setActiveTab('marketplace');
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortalPage />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={(id, qty) => agriStore.updateCartQuantity(id, qty)}
        onRemoveItem={(id) => agriStore.removeFromCart(id)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        userCounty={selectedCounty}
      />

      {/* Checkout & M-Pesa Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        userCounty={selectedCounty}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Product Detail Modal */}
      {viewingProduct && !viewingProduct.livestockDetails && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          onAddToCart={handleAddToCart}
          userCounty={selectedCounty}
        />
      )}

      {/* Livestock Detail Modal */}
      {viewingProduct && viewingProduct.livestockDetails && (
        <LivestockDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          onAddToCart={handleAddToCart}
          userCounty={selectedCounty}
        />
      )}
    </div>
  );
}
