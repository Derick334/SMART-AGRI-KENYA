import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight,
  Home,
  CloudSun,
  Info,
  PhoneCall,
  Store,
  Sprout,
  Beef,
  Package,
  TrendingUp,
  Bell,
  User,
  ShieldCheck,
  IdCard,
  LogOut,
  HelpCircle,
  FileText,
  Award,
  Layers,
  ChevronDown
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
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onOpenNotifications?: () => void;
}

export const NAV_TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'services', label: 'Services', icon: Layers },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'crops', label: 'Crops', icon: Sprout },
  { id: 'livestock', label: 'Livestock', icon: Beef },
  { id: 'inputs', label: 'Inputs', icon: Package },
  { id: 'market-prices', label: 'Prices', icon: TrendingUp },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'membership', label: 'Membership', icon: Award },
  { id: 'verify', label: 'Verify ID', icon: ShieldCheck },
  { id: 'news', label: 'News & Events', icon: FileText },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'contact', label: 'Contact', icon: PhoneCall },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCart,
  selectedCounty,
  onSelectCounty,
  onOpenAuth,
  onOpenNotifications,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isAuth, setIsAuth] = useState(agriStore.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(agriStore.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const items = agriStore.getCart();
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
      setUnreadNotifications(agriStore.getUnreadNotificationCount());
      setIsAuth(agriStore.isAuthenticated());
      setCurrentUser(agriStore.getCurrentUser());
    };
    update();
    return agriStore.subscribe(update);
  }, []);

  const handleLogout = () => {
    agriStore.logout();
    setProfileDropdownOpen(false);
    onSelectTab('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E7DE] shadow-xs">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center cursor-pointer select-none py-1"
          >
            <SmartAgriLogo size="md" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Assistant Button */}
            <button
              onClick={() => onSelectTab('ai-assistant')}
              className="inline-flex items-center gap-1.5 bg-[#EBF3ED] hover:bg-[#DCECE0] border border-[#CFD7CA] text-[#214E34] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#367C46]" />
              <span className="hidden sm:inline">AI Specialist</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => onOpenNotifications && onOpenNotifications()}
              className="relative p-2 rounded-lg text-gray-600 hover:text-[#214E34] hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
              title="Notifications"
              aria-label="In-App Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
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

            {/* Member Profile / Auth Buttons */}
            {isAuth ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold text-[#214E34] transition"
                >
                  <div className="w-6 h-6 rounded-full bg-[#214E34] text-white font-bold flex items-center justify-center text-[10px]">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-[#214E34]" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="font-bold text-gray-900 text-xs truncate">{currentUser.name}</div>
                      <div className="text-[10px] font-mono text-emerald-800 font-semibold">{currentUser.membershipCode}</div>
                      <div className="text-[10px] text-gray-500 capitalize">{currentUser.role} Member</div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTab('dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>My Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectTab('dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                    >
                      <IdCard className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Digital Member Card</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          onSelectTab('admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-amber-800 hover:bg-amber-50 flex items-center gap-2 font-semibold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin Control Center</span>
                      </button>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="px-2.5 py-1.5 text-xs font-semibold text-[#214E34] hover:bg-[#EBF3ED] rounded-lg transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth && onOpenAuth('register')}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#214E34] hover:bg-[#1a3e29] text-white rounded-lg transition shadow-xs hidden sm:inline-flex"
                >
                  Join / Register
                </button>
              </div>
            )}

            {/* Menu Button */}
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

      {/* Main Navigation Bar */}
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
                    className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-colors duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-xs font-semibold ${
                      isActive
                        ? 'bg-[#367C46] text-white shadow-xs font-bold'
                        : 'text-[#506153] hover:text-[#214E34] hover:bg-[#EBF3ED]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#367C46]'}`} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Navigation Drawer Menu */}
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

          {/* Quick Member Status / Auth CTA in Drawer */}
          {!isAuth ? (
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-950">Join SMART-AGRI Kenya</div>
                <div className="text-[11px] text-emerald-800">Get your verified digital membership ID card</div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth && onOpenAuth('register');
                }}
                className="px-3 py-1.5 bg-[#214E34] text-white rounded-lg text-xs font-bold hover:bg-[#1a3e29]"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-950">{currentUser.name}</div>
                <div className="text-[11px] font-mono text-emerald-800 font-bold">{currentUser.membershipCode}</div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSelectTab('dashboard');
                }}
                className="px-3 py-1.5 bg-[#214E34] text-white rounded-lg text-xs font-bold"
              >
                Dashboard
              </button>
            </div>
          )}

          {/* Main Navigation Links */}
          <div>
            <div className="text-[11px] font-bold text-[#68756A] uppercase tracking-wider mb-2 px-1">
              Agricultural Services & Navigation
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
