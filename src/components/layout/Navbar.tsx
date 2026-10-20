import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { agriStore } from '../../services/store';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { UserRole } from '../../types';
import { SmartAgriLogo } from '../common/SmartAgriLogo';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenCart: () => void;
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
}

export const NAV_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'crops', label: 'Crops & Produce' },
  { id: 'livestock', label: 'Livestock' },
  { id: 'inputs', label: 'Farm Inputs' },
  { id: 'soil-testing', label: 'Soil Testing' },
  { id: 'pest-diagnosis', label: 'Pest Diagnosis' },
  { id: 'market-prices', label: 'Market Prices' },
  { id: 'weather', label: 'Weather' },
  { id: 'ai-assistant', label: 'AI Farming Assistant' },
  { id: 'irrigation', label: 'Irrigation & Soil' },
  { id: 'community', label: 'Farmer Community' },
  { id: 'experts', label: 'Expert Consultation' },
  { id: 'orders', label: 'Orders & Tracking' },
  { id: 'dashboard', label: 'Farmer Dashboard' },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
  { id: 'auth', label: 'Account' },
  { id: 'admin', label: 'Admin Portal', adminOnly: true },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCart,
  selectedCounty,
  onSelectCounty,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(agriStore.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const items = agriStore.getCart();
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
      setUser(agriStore.getCurrentUser());
    };
    update();
    return agriStore.subscribe(update);
  }, []);

  const handleRoleSwitch = (newRole: UserRole) => {
    agriStore.switchRole(newRole);
    if (newRole === 'admin') {
      onSelectTab('admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E7DE] shadow-xs">
      {/* Main Header Bar (Pure White) - starts directly without top announcement bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center cursor-pointer select-none py-1"
          >
            <SmartAgriLogo size="md" />
          </div>

          {/* Actions: AI Assistant, Cart, User Profile, Menu (matching visual reference) */}
          <div className="flex items-center gap-2.5">
            {/* AI Assistant Button */}
            <button
              onClick={() => onSelectTab('ai-assistant')}
              className="inline-flex items-center gap-1.5 bg-[#EBF3ED] hover:bg-[#DCECE0] border border-[#CFD7CA] text-[#214E34] px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#367C46]" />
              <span>AI Specialist</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-[#214E34] hover:bg-[#183C27] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#D6A545]" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#D6A545] text-[#252D27] font-bold text-[10px] px-1.5 py-0.2 rounded">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => onSelectTab(user.role === 'admin' ? 'admin' : 'dashboard')}
              className="flex items-center gap-2 p-0.5 rounded-lg hover:bg-[#F7F6F0] text-[#252D27] transition cursor-pointer border border-[#E2E7DE]"
              title={`${user.name} (${user.role})`}
            >
              <div className="w-8 h-8 rounded-md bg-[#EBF3ED] text-[#214E34] font-bold text-xs flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
            </button>

            {/* Menu Button - visible on all screens as in reference screenshot */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#252D27] hover:bg-[#F7F6F0] transition cursor-pointer border border-[#E2E7DE]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#252D27]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Navigation Bar on non-home pages */}
      {activeTab !== 'home' && (
        <nav className="hidden lg:block bg-[#F7F6F0] border-t border-[#E2E7DE] px-4">
          <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar py-1">
            <ul className="flex items-center gap-1 min-w-max text-xs font-medium">
              {NAV_TABS.map((tab) => {
                if (tab.adminOnly && user.role !== 'admin') return null;
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => onSelectTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg transition-colors duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#367C46] text-white font-bold shadow-xs'
                          : tab.adminOnly
                          ? 'bg-[#FCF8EE] text-[#79543A] font-semibold border border-[#E2E7DE] hover:bg-[#FAF5EB]'
                          : 'text-[#68756A] hover:text-[#214E34] hover:bg-[#EBF3ED]'
                      }`}
                    >
                      {tab.adminOnly && <ShieldAlert className="w-3.5 h-3.5 text-[#D6A545]" />}
                      <span>{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}

      {/* Navigation Drawer Menu (Toggled via Menu button on all screen sizes) */}
      {mobileMenuOpen && (
        <div className="bg-white border-t border-[#E2E7DE] shadow-xl max-h-[85vh] overflow-y-auto px-4 py-4 space-y-4 animate-in fade-in duration-150">
          {/* County Selector */}
          <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
            <label className="block text-xs font-bold text-[#252D27] mb-1">
              Select Your Current County (Kenya)
            </label>
            <select
              value={selectedCounty}
              onChange={(e) => onSelectCounty(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-medium cursor-pointer"
            >
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.capital})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Role Tester Switcher in Drawer */}
          <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
            <div className="text-[11px] font-bold text-[#68756A] uppercase tracking-wider mb-2">
              Current Persona: <strong className="capitalize text-[#214E34]">{user.role}</strong>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['farmer', 'buyer', 'transporter', 'expert', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition font-medium cursor-pointer ${
                    user.role === r 
                      ? 'bg-[#214E34] text-white font-bold' 
                      : 'bg-white text-[#252D27] border border-[#E2E7DE] hover:bg-[#EBF3ED]'
                  }`}
                >
                  <span className="capitalize">{r === 'admin' ? 'Administrator' : r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div>
            <div className="text-[11px] font-bold text-[#68756A] uppercase tracking-wider mb-2 px-1">
              Explore Platform
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
              {NAV_TABS.map((tab) => {
                if (tab.adminOnly && user.role !== 'admin') return null;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                      isActive
                        ? 'bg-[#367C46] text-white font-bold'
                        : tab.adminOnly
                        ? 'bg-[#FCF8EE] text-[#79543A] font-semibold border border-[#E2E7DE]'
                        : 'text-[#252D27] hover:bg-[#F7F6F0]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
