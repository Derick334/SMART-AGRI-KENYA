import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  MapPin, 
  Search, 
  ShieldCheck, 
  User, 
  ChevronDown, 
  Sprout, 
  Sparkles,
  PhoneCall,
  LayoutDashboard,
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
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'marketplace', label: 'Marketplace', icon: 'Store' },
  { id: 'crops', label: 'Crops & Produce', icon: 'Sprout' },
  { id: 'livestock', label: 'Livestock', icon: 'Beef' },
  { id: 'inputs', label: 'Farm Inputs', icon: 'Package' },
  { id: 'soil-testing', label: 'Soil Testing', icon: 'TestTube' },
  { id: 'pest-diagnosis', label: 'Pest Diagnosis', icon: 'Bug' },
  { id: 'market-prices', label: 'Market Prices', icon: 'TrendingUp' },
  { id: 'weather', label: 'Weather', icon: 'CloudSun' },
  { id: 'ai-assistant', label: 'AI Farming Assistant', icon: 'Bot' },
  { id: 'irrigation', label: 'Irrigation & Soil', icon: 'Droplets' },
  { id: 'community', label: 'Farmer Community', icon: 'Users' },
  { id: 'experts', label: 'Expert Consultation', icon: 'Stethoscope' },
  { id: 'orders', label: 'Orders & Tracking', icon: 'Truck' },
  { id: 'dashboard', label: 'Farmer Dashboard', icon: 'LayoutDashboard' },
  { id: 'about', label: 'About Us', icon: 'Info' },
  { id: 'contact', label: 'Contact & Support', icon: 'Phone' },
  { id: 'auth', label: 'Login / Register', icon: 'User' },
  { id: 'admin', label: 'Admin Portal', icon: 'ShieldAlert', adminOnly: true },
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
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false);

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
    setRoleDropdownOpen(false);
    if (newRole === 'admin') {
      onSelectTab('admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Top Agricultural Broadcast & Hotline */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-emerald-700 text-white font-semibold px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">
              Kenya National Hub
            </span>
            <span className="hidden sm:inline">
              Verified Agricultural Marketplace • Direct M-Pesa Escrow • KALRO Soil Lab Network
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Pest & Vet Hotline: <strong>0800 721 000</strong> (Toll Free)</span>
            </span>

            {/* Quick Role Tester Switcher */}
            <div className="relative">
              <button 
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded font-medium transition cursor-pointer"
              >
                <span>Role: <strong className="capitalize text-amber-300">{user.role}</strong></span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white text-stone-800 rounded-lg shadow-xl border border-stone-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                    Switch Test Persona
                  </div>
                  {(['farmer', 'buyer', 'transporter', 'expert', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSwitch(r)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 ${user.role === r ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-stone-700'}`}
                    >
                      <span className="capitalize">{r === 'admin' ? '🛡️ Administrator' : r}</span>
                      {user.role === r && <span className="text-emerald-600">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center cursor-pointer select-none group py-1"
          >
            <SmartAgriLogo size="md" className="group-hover:scale-102 transition" />
          </div>

          {/* County Location Selector */}
          <div className="hidden lg:flex items-center relative">
            <button
              onClick={() => setCountyDropdownOpen(!countyDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-emerald-600 bg-stone-50 hover:bg-white text-xs font-medium text-stone-800 transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] text-stone-600 uppercase font-semibold">Your Location</span>
                <span className="font-bold text-emerald-900">{selectedCounty} County</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 ml-1" />
            </button>

            {countyDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-2xl border border-stone-200 p-2 z-50">
                <div className="text-xs font-bold text-stone-700 px-2 py-1 mb-1 border-b border-stone-100 flex items-center justify-between">
                  <span>Select from 47 Counties</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Auto-adjusts rates</span>
                </div>
                {KENYA_COUNTIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      onSelectCounty(c.name);
                      setCountyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md transition flex items-center justify-between ${
                      selectedCounty === c.name 
                        ? 'bg-emerald-600 text-white font-semibold' 
                        : 'text-stone-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-75">{c.capital}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick AI & Cart Actions */}
          <div className="flex items-center gap-2.5">
            {/* AI Assistant Quick Pill */}
            <button
              onClick={() => onSelectTab('ai-assistant')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Ask AI Specialist</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-stone-950 font-black text-[11px] px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => onSelectTab(user.role === 'admin' ? 'admin' : 'dashboard')}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 text-stone-700 transition cursor-pointer"
              title={`${user.name} (${user.role})`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Desktop Navigation Tabs Bar (Scrollable for all 19 tabs) */}
      <nav className="hidden lg:block bg-stone-100/70 border-t border-stone-200 px-4">
        <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar py-1">
          <ul className="flex items-center gap-1 min-w-max text-xs font-medium">
            {NAV_TABS.map((tab) => {
              if (tab.adminOnly && user.role !== 'admin') return null;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => onSelectTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : tab.adminOnly
                        ? 'bg-amber-100 text-amber-900 font-semibold hover:bg-amber-200'
                        : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/70'
                    }`}
                  >
                    {tab.adminOnly && <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 shadow-2xl max-h-[85vh] overflow-y-auto px-4 py-3 space-y-3">
          {/* Mobile Drawer Brand Header */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <SmartAgriLogo size="sm" />
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              Kenya Hub
            </span>
          </div>

          {/* County Selector for Mobile */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Select Your Current County (Kenya)
            </label>
            <select
              value={selectedCounty}
              onChange={(e) => onSelectCounty(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white font-medium"
            >
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.capital})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                    isActive
                      ? 'bg-emerald-700 text-white font-bold'
                      : tab.adminOnly
                      ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                      : 'text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {tab.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
