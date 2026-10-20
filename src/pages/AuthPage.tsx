import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { agriStore, ADMIN_USER } from '../services/store';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';

interface AuthPageProps {
  onSuccess: (role: UserRole) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('farmer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('farmer@smart-agri.ke');
  const [phone, setPhone] = useState('0712345678');
  const [password, setPassword] = useState('agri2026');
  const [county, setCounty] = useState('Nakuru');
  const [farmName, setFarmName] = useState('Rongai Valley Mixed Farm');
  const [farmSize, setFarmSize] = useState(5);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  const currentUser = agriStore.getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (email.includes('admin') || password === 'admin') {
        agriStore.setCurrentUser(ADMIN_USER);
        onSuccess('admin');
        setAuthFeedback('Welcome back, System Administrator!');
      } else {
        agriStore.switchRole(role);
        onSuccess(role);
        setAuthFeedback(`Signed in successfully as ${role.toUpperCase()}!`);
      }
    } else {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: fullName || 'Kenyan Farmer',
        email,
        phone,
        role,
        county,
        farmName: role === 'farmer' ? farmName : undefined,
        farmSizeAcres: role === 'farmer' ? farmSize : undefined,
        isVerified: true,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      agriStore.setCurrentUser(newUser);
      onSuccess(role);
      setAuthFeedback(`Welcome to SMART-AGRI KENYA, ${fullName || 'Farmer'}! Your account has been registered.`);
    }
  };

  const handleQuickDemoSwitch = (selectedRole: UserRole) => {
    agriStore.switchRole(selectedRole);
    onSuccess(selectedRole);
    setAuthFeedback(`Switched active profile to ${selectedRole.toUpperCase()}`);
    setTimeout(() => setAuthFeedback(null), 4000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-5">
      {/* Feedback banner */}
      {authFeedback && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{authFeedback}</span>
          </div>
          <button onClick={() => setAuthFeedback(null)} className="text-[#214E34] p-0.5 cursor-pointer">✕</button>
        </div>
      )}

      {/* Current User Pill */}
      <div className="p-3.5 bg-white rounded-xl border border-[#E2E7DE] shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EBF3ED] text-[#214E34] font-bold flex items-center justify-center border border-[#CFD7CA]">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-[#252D27] block">{currentUser.name}</span>
            <span className="text-[11px] text-[#68756A] capitalize">
              Role: <strong className="text-[#214E34]">{currentUser.role}</strong> ({currentUser.county} County)
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-[#EBF3ED] text-[#214E34] px-2 py-0.5 rounded border border-[#CFD7CA]">
          Active Session
        </span>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs space-y-5">
        <div className="text-center space-y-1.5">
          <div className="flex justify-center mb-1">
            <SmartAgriLogo variant="full" size="md" />
          </div>
          <h2 className="text-xl font-extrabold text-[#214E34]">
            {isLogin ? 'Sign In to Your Account' : 'Create Farmer / Trader Account'}
          </h2>
          <p className="text-xs text-[#68756A]">
            Access certified agricultural inputs, livestock auctions, and national market prices
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#F7F6F0] p-1 rounded-lg text-xs font-semibold border border-[#E2E7DE]">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
              isLogin ? 'bg-white text-[#214E34] font-bold shadow-xs border border-[#E2E7DE]' : 'text-[#68756A] hover:text-[#252D27]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
              !isLogin ? 'bg-white text-[#214E34] font-bold shadow-xs border border-[#E2E7DE]' : 'text-[#68756A] hover:text-[#252D27]'
            }`}
          >
            Register Farm / Buyer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role Selection */}
          <div>
            <label className="block font-semibold text-[#252D27] mb-1">
              Select Your Platform Persona
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-center">
              {(['farmer', 'buyer', 'transporter', 'expert', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-2 rounded-lg border text-[11px] font-semibold capitalize transition cursor-pointer ${
                    role === r
                      ? 'border-[#367C46] bg-[#EBF3ED] text-[#214E34] shadow-xs'
                      : 'border-[#E2E7DE] text-[#252D27] hover:bg-[#F7F6F0]'
                  }`}
                >
                  {r === 'admin' ? '🛡️ Admin' : r}
                </button>
              ))}
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block font-semibold text-[#252D27] mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Kiprop Kimani"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#252D27] mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="farmer@smart-agri.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#252D27] mb-1">Safaricom Phone Number</label>
              <input
                type="tel"
                required
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none font-mono"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Home County</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] cursor-pointer"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.name} County</option>
                  ))}
                </select>
              </div>

              {role === 'farmer' && (
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Farm Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Highlands Dairy & Produce Farm"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#252D27] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs py-3 rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLogin ? 'Sign In' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Role Testing Switcher */}
        <div className="pt-3 border-t border-[#E2E7DE]">
          <span className="text-[10px] font-bold text-[#68756A] uppercase tracking-wider block text-center mb-2">
            Instant Test Persona Switcher (Single Click)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
            <button
              onClick={() => handleQuickDemoSwitch('farmer')}
              className="px-2.5 py-1 rounded-md bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] hover:text-[#214E34] font-medium border border-[#E2E7DE] transition cursor-pointer"
            >
              🧑‍🌾 Farmer Persona
            </button>
            <button
              onClick={() => handleQuickDemoSwitch('buyer')}
              className="px-2.5 py-1 rounded-md bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] hover:text-[#214E34] font-medium border border-[#E2E7DE] transition cursor-pointer"
            >
              🛒 Wholesale Buyer
            </button>
            <button
              onClick={() => handleQuickDemoSwitch('transporter')}
              className="px-2.5 py-1 rounded-md bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] hover:text-[#214E34] font-medium border border-[#E2E7DE] transition cursor-pointer"
            >
              🚚 Transporter SACCO
            </button>
            <button
              onClick={() => handleQuickDemoSwitch('admin')}
              className="px-2.5 py-1 rounded-md bg-[#FCF8EE] hover:bg-[#F3E7C9] text-[#79543A] font-bold border border-[#D6A545]/40 transition cursor-pointer"
            >
              🛡️ Super Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
