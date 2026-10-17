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
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCounty, setSelectedCounty] = useState('Nakuru');
  const [products, setProducts] = useState<Product[]>(agriStore.getProducts());
  const [cart, setCart] = useState<CartItem[]>(agriStore.getCart());

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCounty={selectedCounty}
        onSelectCounty={setSelectedCounty}
      />

      {/* Tab Pages Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            products={products}
            onSelectTab={setActiveTab}
            onViewProduct={setViewingProduct}
            onAddToCart={handleAddToCart}
            selectedCounty={selectedCounty}
            onSelectCounty={setSelectedCounty}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplacePage
            products={products}
            onViewProduct={setViewingProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'crops' && (
          <CropsPage
            products={products}
            onViewProduct={setViewingProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'livestock' && (
          <LivestockPage
            products={products}
            onViewProduct={setViewingProduct}
            onAddToCart={handleAddToCart}
          />
        )}

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
