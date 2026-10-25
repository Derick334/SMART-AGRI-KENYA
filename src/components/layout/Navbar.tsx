import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight,
  Lock,
  LogOut,
  Copy,
  Check,
  Home,
  CloudSun,
  Info,
  PhoneCall
} from 'lucide-react';
import { agriStore } from '../../services/store';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { SmartAgriLogo } from '../common/SmartAgriLogo';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenCart: () => void;
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
  onSignOut?: () => void;
}

export const NAV_TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'about', label: 'About Us', icon: Info },
  { id: 'contact', label: 'Contact', icon: PhoneCall },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCart,
  selectedCounty,
  onSelectCounty,
  onSignOut,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(agriStore.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(agriStore.isAuthenticated());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const update = () => {
      const items = agriStore.getCart();
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
      setUser(agriStore.getCurrentUser());
      setIsAuthenticated(agriStore.isAuthenticated());
    };
    update();
    return agriStore.subscribe(update);
  }, []);



  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSignOutClick = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      agriStore.logout();
      onSelectTab('home');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E7DE] shadow-xs">
      {/* Main Header Bar (Pure White) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center cursor-pointer select-none py-1"
          >
            <SmartAgriLogo size="md" />
          </div>

          {/* Actions: AI Assistant, Cart, User Profile / Auth, Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Assistant Button */}
            <button
              onClick={() => onSelectTab('ai-assistant')}
              className="inline-flex items-center gap-1.5 bg-[#EBF3ED] hover:bg-[#DCECE0] border border-[#CFD7CA] text-[#214E34] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#367C46]" />
              <span className="hidden sm:inline">AI Specialist</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-[#214E34] hover:bg-[#183C27] text-white px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
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

            {/* Authentication Status / Profile Button */}
            {isAuthenticated ? (
              <button
                onClick={() => onSelectTab(user.role === 'admin' ? 'admin' : 'dashboard')}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F7F6F0] text-[#252D27] transition cursor-pointer border border-[#E2E7DE]"
                title={`${user.name} (${user.role.toUpperCase()}) - Code: ${user.membershipCode || 'N/A'}`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#EBF3ED] text-[#214E34] font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-left leading-tight pr-1">
                  <span className="text-[11px] font-bold truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
                  <span className="text-[9px] font-mono text-[#367C46] truncate max-w-[90px]">{user.membershipCode || user.role}</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('auth')}
                className="inline-flex items-center gap-1.5 bg-[#214E34] hover:bg-[#183C27] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                title="Sign in or register your SMART-AGRI Kenya membership"
              >
                <Lock className="w-3.5 h-3.5 text-[#D6A545]" />
                <span>Sign In</span>
              </button>
            )}

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

      {/* Main Navigation Bar below the logo row */}
      <nav aria-label="Main Navigation" className="bg-[#F7F6F0] border-t border-[#E2E7DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1 sm:gap-2 py-1.5 overflow-x-auto no-scrollbar">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      onSelectTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg transition-colors duration-150 flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap text-xs sm:text-sm font-semibold ${
                      isActive
                        ? 'bg-[#367C46] text-white shadow-xs font-bold'
                        : 'text-[#506153] hover:text-[#214E34] hover:bg-[#EBF3ED]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-[#367C46]'}`} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Navigation Drawer Menu (Toggled via Menu button on all screen sizes) */}
      {mobileMenuOpen && (
        <div className="bg-white border-t border-[#E2E7DE] shadow-xl max-h-[85vh] overflow-y-auto px-4 py-4 space-y-4 animate-in fade-in duration-150">
          {/* Member Card / Authentication Status in Drawer */}
          {isAuthenticated ? (
            <div className="p-3 bg-gradient-to-br from-[#EBF3ED] to-[#F7F6F0] rounded-xl border border-[#CFD7CA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#214E34] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#214E34]">{user.name}</span>
                    <span className="text-[10px] bg-[#367C46] text-white font-bold px-1.5 py-0.2 rounded capitalize">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#68756A] font-mono mt-0.5">
                    <span>Member Code:</span>
                    <strong className="text-[#252D27]">{user.membershipCode || 'SAK-NKR-2024-F4829'}</strong>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(user.membershipCode || 'SAK-NKR-2024-F4829')}
                      className="text-[#367C46] hover:underline p-0.5 cursor-pointer"
                      title="Copy Membership Code"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-600 inline" /> : <Copy className="w-3 h-3 inline" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    onSelectTab(user.role === 'admin' ? 'admin' : 'dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-[#214E34] text-white rounded-lg text-xs font-semibold hover:bg-[#183926] cursor-pointer"
                >
                  My Dashboard
                </button>
                <button
                  onClick={handleSignOutClick}
                  className="px-3 py-1.5 bg-white border border-red-200 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-[#FCF8EE] rounded-xl border border-[#D6A545]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[#79543A] font-bold text-xs">
                  <Lock className="w-4 h-4 text-[#D6A545]" />
                  <span>Guest Preview Mode</span>
                </div>
                <p className="text-[11px] text-[#68756A] mt-0.5">
                  Sign in or register your membership code to unlock all tools, soil testing, market prices, and dashboards.
                </p>
              </div>
              <button
                onClick={() => {
                  onSelectTab('auth');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 bg-[#214E34] text-white rounded-lg text-xs font-bold hover:bg-[#183926] cursor-pointer shrink-0"
              >
                Sign In / Register
              </button>
            </div>
          )}

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



          {/* Main Navigation Links */}
          <div>
            <div className="text-[11px] font-bold text-[#68756A] uppercase tracking-wider mb-2 px-1">
              Main Navigation
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      isActive
                        ? 'bg-[#367C46] text-white font-bold shadow-xs'
                        : 'text-[#252D27] bg-[#F7F6F0] hover:bg-[#EBF3ED]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#367C46]'}`} />
                      <span>{tab.label}</span>
                    </div>
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
