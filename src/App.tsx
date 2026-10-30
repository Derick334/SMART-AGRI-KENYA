import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/checkout/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { LivestockDetailModal } from './components/livestock/LivestockDetailModal';
import { FloatingChatbotWidget } from './components/common/FloatingChatbotWidget';

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
import { AuthPage } from './pages/AuthPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { RoleDashboardRouter } from './pages/RoleDashboardRouter';

import { Product, CartItem, Order, UserRole } from './types';
import { agriStore } from './services/store';
import { apiService } from './services/api';
import { authService } from './services/auth';

// Publicly accessible browsing pages including the four marketplace categories and informational tabs
const PUBLIC_TABS = [
  'home', 
  'marketplace', 
  'crops', 
  'livestock', 
  'inputs', 
  'market-prices', 
  'weather', 
  'about', 
  'contact', 
  'auth', 
  'admin-login'
];

const FEATURE_NAMES: Record<string, string> = {
  'home': 'Home',
  'marketplace': 'Kenya Agricultural Marketplace',
  'crops': 'Crops & Produce Catalog',
  'livestock': 'Pedigree Livestock Listings',
  'inputs': 'Certified Farm Inputs & Supplies',
  'soil-testing': 'Soil Health Testing Services',
  'pest-diagnosis': 'Pest & Disease Checker',
  'market-prices': 'Wholesale Commodity Prices',
  'weather': 'Agro-Meteorological Advisory',
  'ai-assistant': 'AI Farming Specialist',
  'irrigation': 'Smart Irrigation Systems',
  'community': 'Farmer Community Forum',
  'experts': 'Agronomist & Vet Consultation',
  'orders': 'Orders & Escrow Tracking',
  'dashboard': 'Role Dashboard & Farmer Portal',
  'admin-login': 'Private Administrator Login',
  'admin': 'Owner-Only Admin Control Centre',
  'about': 'About SMART-AGRI Kenya',
  'contact': 'Support & Contact',
};

export default function App() {
  // Sync initial tab from URL hash if provided (e.g. #marketplace, #admin/login, #admin)
  const getInitialTab = (): string => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash === 'admin/login' || hash === 'admin-login' || path === '/admin/login') {
        return 'admin-login';
      }
      if (hash === 'admin' || path === '/admin') {
        const isAuth = agriStore.isAuthenticated();
        const user = agriStore.getCurrentUser();
        return (isAuth && user.role === 'admin') ? 'admin' : 'admin-login';
      }

      const validTabs = [
        'home', 'marketplace', 'crops', 'livestock', 'inputs', 
        'soil-testing', 'pest-diagnosis', 'market-prices', 'weather', 
        'ai-assistant', 'irrigation', 'community', 'experts', 
        'orders', 'dashboard', 'about', 'contact', 'auth', 'admin-login', 'admin'
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

  // Restricted Access & Destination Preservation
  const [intendedDestination, setIntendedDestination] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Guard routing handler with destination preservation
  const handleSelectTab = (rawTabId: string) => {
    // Normalize aliases
    let tabId = rawTabId;
    if (tabId === 'admin/login') tabId = 'admin-login';

    const isAuth = agriStore.isAuthenticated();
    const currentUser = agriStore.getCurrentUser();

    // Check specific owner-only admin route
    if (tabId === 'admin') {
      if (!isAuth || currentUser.role !== 'admin') {
        showToast('🔒 Administrator authorization and MFA required. Please sign in below.');
        setActiveTab('admin-login');
        if (typeof window !== 'undefined') {
          window.location.hash = 'admin-login';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
    }

    if (tabId === 'admin-login') {
      setActiveTab('admin-login');
      if (typeof window !== 'undefined') {
        window.location.hash = 'admin-login';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    // Check if the route is protected and the user is unauthenticated
    if (!isAuth && !PUBLIC_TABS.includes(tabId)) {
      setIntendedDestination(tabId);
      const featureName = FEATURE_NAMES[tabId] || tabId;
      const notice = `Registration and authentication are required to access ${featureName}. Please sign in or register below.`;
      setAuthNotice(notice);
      showToast(`🔒 ${notice}`);
      setActiveTab('auth');
      if (typeof window !== 'undefined') {
        window.location.hash = 'auth';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (tabId !== 'auth') {
      setAuthNotice(null);
    }

    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      window.location.hash = tabId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keep activeTab in sync with browser hash changes and enforce authentication
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

  // Initial check on load: if unauthenticated visitor landed on protected tab, redirect to auth
  useEffect(() => {
    const isAuth = agriStore.isAuthenticated();
    if (!isAuth && !PUBLIC_TABS.includes(activeTab)) {
      setIntendedDestination(activeTab);
      const featureName = FEATURE_NAMES[activeTab] || activeTab;
      const notice = `Registration and authentication are required to access ${featureName}. Please sign in or register below.`;
      setAuthNotice(notice);
      setActiveTab('auth');
      if (typeof window !== 'undefined') {
        window.location.hash = 'auth';
      }
    }
  }, []);

  // Check and validate active session (Supabase or server session) on boot
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authService.handleAuthState();
        if (user) {
          agriStore.setCurrentUser(user);
          agriStore.setAuthenticated(true);
        } else if (agriStore.isAuthenticated()) {
          // If server or Supabase rejects session, clean up expired state
          agriStore.logout();
        }
      } catch {
        // Offline resilient fallback
      }
    };
    checkSession();

    // Subscribe to real-time auth state updates (e.g. Google OAuth callbacks)
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (user) {
        agriStore.setCurrentUser(user);
        agriStore.setAuthenticated(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Sync state with agriStore
  useEffect(() => {
    const syncState = () => {
      setProducts(agriStore.getProducts());
      setCart(agriStore.getCart());
    };
    return agriStore.subscribe(syncState);
  }, []);

  // Protected Cart open handler
  const handleOpenCart = () => {
    if (!agriStore.isAuthenticated()) {
      setIntendedDestination('orders');
      const notice = 'Registration and authentication are required to access your cart and orders.';
      setAuthNotice(notice);
      showToast(`🔒 ${notice}`);
      handleSelectTab('auth');
      return;
    }
    setIsCartOpen(true);
  };

  // Public View Product handler (allows browsing & variety comparison)
  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  // Protected Add to cart handler
  const handleAddToCart = (product: Product, quantity: number = 1, deliveryPreference: 'pickup' | 'delivery' = 'delivery') => {
    if (!agriStore.isAuthenticated()) {
      const target = product.livestockDetails ? 'livestock' : 'marketplace';
      setIntendedDestination(target);
      const notice = `Registration and authentication are required to purchase or add "${product.title}" to cart.`;
      setAuthNotice(notice);
      showToast(`🔒 ${notice}`);
      handleSelectTab('auth');
      return;
    }
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

  // Handle successful login or registration
  const handleAuthSuccess = (role: UserRole, destination?: string) => {
    const target = destination || intendedDestination;
    setIntendedDestination(null);
    setAuthNotice(null);

    if (target && target !== 'auth' && target !== 'home') {
      showToast(`Redirecting to requested destination: ${FEATURE_NAMES[target] || target}...`);
      handleSelectTab(target);
    } else if (role === 'admin') {
      handleSelectTab('admin');
    } else {
      handleSelectTab('dashboard');
    }
  };

  // Sign out handler
  const handleSignOut = () => {
    agriStore.logout();
    setIntendedDestination(null);
    setAuthNotice(null);
    showToast('You have been signed out successfully.');
    handleSelectTab('home');
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
        onSignOut={handleSignOut}
      />

      {/* Tab Pages Router */}
      <main className="flex-1">
        {/* Public Homepage with 6 Service Cards */}
        {activeTab === 'home' && (
          <HomePage
            products={products}
            onSelectTab={handleSelectTab}
            onViewProduct={handleViewProduct}
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
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            initialSearchQuery={marketplaceSearch}
            userCounty={selectedCounty}
            onNavigateTab={handleSelectTab}
          />
        )}

        {/* Crops & Produce Dedicated Page */}
        {activeTab === 'crops' && (
          <CropsPage
            products={products}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            userCounty={selectedCounty}
            onNavigateTab={handleSelectTab}
          />
        )}

        {/* Livestock & Cattle Dedicated Page */}
        {activeTab === 'livestock' && (
          <LivestockPage
            products={products}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            userCounty={selectedCounty}
            onNavigateTab={handleSelectTab}
          />
        )}

        {/* Farm Inputs & Equipment Dedicated Page */}
        {activeTab === 'inputs' && (
          <FarmInputsPage
            products={products}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            userCounty={selectedCounty}
            onNavigateTab={handleSelectTab}
          />
        )}

        {activeTab === 'soil-testing' && (
          <SoilTestingPage />
        )}

        {activeTab === 'pest-diagnosis' && (
          <PestDiagnosisPage />
        )}

        {/* Market Prices Intelligence Dedicated Page */}
        {activeTab === 'market-prices' && (
          <MarketPricesPage
            onSelectMarketplaceTab={handleSelectTab}
          />
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
          <RoleDashboardRouter 
            onLogout={handleSignOut} 
            onSelectTab={handleSelectTab} 
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}

        {activeTab === 'contact' && (
          <ContactPage />
        )}

        {/* Login and Registration page with destination preservation & notice */}
        {activeTab === 'auth' && (
          <AuthPage
            onSuccess={handleAuthSuccess}
            intendedDestination={intendedDestination}
            authNotice={authNotice}
          />
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
