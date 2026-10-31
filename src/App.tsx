import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/checkout/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { LivestockDetailModal } from './components/livestock/LivestockDetailModal';
import { FloatingChatbotWidget } from './components/common/FloatingChatbotWidget';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { NotificationDrawer } from './components/layout/NotificationDrawer';

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
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ServicesOverviewPage } from './pages/ServicesOverviewPage';
import { MembershipPublicPage } from './pages/MembershipPublicPage';
import { PublicVerificationPage } from './pages/PublicVerificationPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { FaqPage } from './pages/FaqPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { RoleDashboardRouter } from './pages/RoleDashboardRouter';

import { Product, CartItem, Order } from './types';
import { agriStore } from './services/store';

export default function App() {
  // Sync initial tab from URL hash if provided (e.g. #marketplace, #weather)
  const getInitialTab = (): string => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash === 'admin/login' || hash === 'admin-login' || path === '/admin/login') {
        return 'admin-login';
      }
      if (hash === 'admin' || path === '/admin') {
        return 'admin';
      }
      if (hash.startsWith('verify')) {
        return 'verify';
      }

      const validTabs = [
        'home', 'marketplace', 'crops', 'livestock', 'inputs', 
        'soil-testing', 'pest-diagnosis', 'market-prices', 'weather', 
        'ai-assistant', 'irrigation', 'community', 'experts', 
        'orders', 'dashboard', 'about', 'contact', 'services', 
        'membership', 'verify', 'news', 'faq', 'admin-login', 'admin'
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSelectTab = (rawTabId: string) => {
    let tabId = rawTabId;
    if (tabId === 'admin/login') tabId = 'admin-login';
    if (tabId === 'login') {
      handleOpenAuth('login');
      return;
    }
    if (tabId === 'register') {
      handleOpenAuth('register');
      return;
    }
    if (tabId.startsWith('verify')) {
      tabId = 'verify';
    }

    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      window.location.hash = tabId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keep activeTab in sync with browser hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash && hash !== activeTab) {
        handleSelectTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  // Sync state with agriStore
  useEffect(() => {
    const syncState = () => {
      setProducts(agriStore.getProducts());
      setCart(agriStore.getCart());
    };
    return agriStore.subscribe(syncState);
  }, []);

  // Public Cart open handler
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  // Public View Product handler (allows browsing & variety comparison)
  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  // Public Add to cart handler
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
        onOpenCart={handleOpenCart}
        selectedCounty={selectedCounty}
        onSelectCounty={setSelectedCounty}
        onOpenAuth={handleOpenAuth}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
      />

      {/* Tab Pages Router */}
      <main className="flex-1">
        {/* Public Homepage */}
        {activeTab === 'home' && (
          <HomePage
            products={products}
            onSelectTab={handleSelectTab}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            selectedCounty={selectedCounty}
            onSelectCounty={setSelectedCounty}
            onSearchMarketplace={handleHomeSearch}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* 1. Main Marketplace Page */}
        {activeTab === 'marketplace' && (
          <MarketplacePage
            products={products}
            onNavigateTab={handleSelectTab}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            userCounty={selectedCounty}
            initialSearchQuery={marketplaceSearch}
          />
        )}

        {/* 2. Crops & Produce Catalog */}
        {activeTab === 'crops' && (
          <CropsPage
            products={products}
            onNavigateTab={handleSelectTab}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            userCounty={selectedCounty}
          />
        )}

        {/* 3. Livestock & Cattle */}
        {activeTab === 'livestock' && (
          <LivestockPage
            products={products}
            onNavigateTab={handleSelectTab}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            userCounty={selectedCounty}
          />
        )}

        {/* 4. Farm Inputs & Supplies */}
        {activeTab === 'inputs' && (
          <FarmInputsPage
            products={products}
            onNavigateTab={handleSelectTab}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            userCounty={selectedCounty}
          />
        )}

        {/* 5. Soil Health Testing Page */}
        {activeTab === 'soil-testing' && (
          <SoilTestingPage />
        )}

        {/* 6. Pest & Disease Diagnosis Page */}
        {activeTab === 'pest-diagnosis' && (
          <PestDiagnosisPage />
        )}

        {/* 7. Market Prices Page */}
        {activeTab === 'market-prices' && (
          <MarketPricesPage
            onSelectMarketplaceTab={handleSelectTab}
          />
        )}

        {/* 8. Live Weather & Agro-Meteorology Page */}
        {activeTab === 'weather' && (
          <WeatherPage
            selectedCounty={selectedCounty}
            onSelectCounty={setSelectedCounty}
          />
        )}

        {/* 9. Gemini AI Multi-Turn Farming Assistant */}
        {activeTab === 'ai-assistant' && (
          <AiAssistantPage
            selectedCounty={selectedCounty}
            onSelectCounty={setSelectedCounty}
          />
        )}

        {/* 10. Smart Irrigation & Soil Water Scheduling */}
        {activeTab === 'irrigation' && (
          <IrrigationPage />
        )}

        {/* 11. Community Forum */}
        {activeTab === 'community' && (
          <CommunityPage />
        )}

        {/* 12. Agronomist & Vet Consultation Hub */}
        {activeTab === 'experts' && (
          <ExpertConsultationPage />
        )}

        {/* 13. Orders & Escrow Tracking */}
        {activeTab === 'orders' && (
          <OrdersPage />
        )}

        {/* 14. Farmer Portal & Role Dashboard */}
        {activeTab === 'dashboard' && (
          <RoleDashboardRouter
            onSelectTab={handleSelectTab}
          />
        )}

        {/* 15. Comprehensive Services Page */}
        {activeTab === 'services' && (
          <ServicesOverviewPage
            onSelectTab={handleSelectTab}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* 16. Digital Membership & ID Cards */}
        {activeTab === 'membership' && (
          <MembershipPublicPage
            onSelectTab={handleSelectTab}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* 17. Public QR Code Member Verification */}
        {activeTab === 'verify' && (
          <PublicVerificationPage
            onBack={() => handleSelectTab('home')}
          />
        )}

        {/* 18. News & Training Calendar */}
        {activeTab === 'news' && (
          <NewsEventsPage
            onSelectTab={handleSelectTab}
          />
        )}

        {/* 19. Frequently Asked Questions */}
        {activeTab === 'faq' && (
          <FaqPage
            onSelectTab={handleSelectTab}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}

        {activeTab === 'contact' && (
          <ContactPage />
        )}

        {/* Private Administrator Login Route (/admin/login or #admin-login) */}
        {activeTab === 'admin-login' && (
          <AdminLoginPage
            onSuccess={() => handleSelectTab('admin')}
            onBackToSite={() => handleSelectTab('home')}
          />
        )}

        {/* Owner-Only Admin Control Centre (/admin or #admin) */}
        {activeTab === 'admin' && (
          <AdminPortalPage
            onNavigateToSite={(tab) => handleSelectTab(tab || 'home')}
            onRequireAdminLogin={() => handleSelectTab('admin-login')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />

      {/* Auth Modal (Multi-Category Registration & Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          showToast('Welcome to SMART-AGRI Kenya! Digital Member Card is active.');
          handleSelectTab('dashboard');
        }}
      />

      {/* In-App Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onSelectNotification={(notif) => {
          if (notif.linkTab) {
            handleSelectTab(notif.linkTab);
          }
        }}
      />

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

      {/* Global Floating Multi-Turn Gemini Agricultural Chatbot */}
      {activeTab !== 'ai-assistant' && activeTab !== 'admin' && activeTab !== 'admin-login' && (
        <FloatingChatbotWidget
          currentCounty={selectedCounty}
          onNavigateToFullChat={() => handleSelectTab('ai-assistant')}
        />
      )}
    </div>
  );
}
