import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Sprout, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { agriStore, ADMIN_USER, DEFAULT_USER } from '../services/store';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';

interface AuthPageProps {
  onSuccess: (role: UserRole) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('farmer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('0722123456');
  const [password, setPassword] = useState('Password123');
  const [county, setCounty] = useState('Nakuru');
  const [farmName, setFarmName] = useState('Rongai Valley Mixed Farm');
  const [farmSize, setFarmSize] = useState(5);

  const currentUser = agriStore.getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (email.includes('admin') || password === 'admin') {
        agriStore.setCurrentUser(ADMIN_USER);
        onSuccess('admin');
        alert('Welcome back, System Administrator!');
      } else {
        agriStore.switchRole(role);
        onSuccess(role);
        alert(`Signed in successfully as ${role.toUpperCase()}!`);
      }
    } else {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: fullName,
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
      alert(`Welcome to SMART-AGRI KENYA, ${fullName}! Your account has been registered.`);
    }
  };

  const handleQuickDemoSwitch = (selectedRole: UserRole) => {
    agriStore.switchRole(selectedRole);
    onSuccess(selectedRole);
    alert(`Switched active profile to ${selectedRole.toUpperCase()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Current User Pill */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-stone-900 block">{currentUser.name}</span>
            <span className="text-[11px] text-emerald-800 capitalize">
              Role: <strong>{currentUser.role}</strong> ({currentUser.county} County)
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full">
          Active Session
        </span>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <SmartAgriLogo variant="full" size="lg" />
          </div>
          <h2 className="text-xl font-black text-stone-950">
            {isLogin ? 'Sign In to Your Account' : 'Create Farmer / Trader Account'}
          </h2>
          <p className="text-xs text-stone-500">
            Access certified agricultural inputs, livestock auctions, and national market prices
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-stone-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              isLogin ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              !isLogin ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Register Farm / Buyer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role Selection */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Select Your Platform Persona
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-center">
              {(['farmer', 'buyer', 'transporter', 'expert', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-2 rounded-xl border text-[11px] font-bold capitalize transition cursor-pointer ${
                    role === r
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {r === 'admin' ? '🛡️ Admin' : r}
                </button>
              ))}
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block font-bold text-stone-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Kiprop Kimani"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="farmer@smart-agri.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Safaricom Phone Number</label>
              <input
                type="tel"
                required
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Home County</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 cursor-pointer"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.name} County</option>
                  ))}
                </select>
              </div>

              {role === 'farmer' && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Farm Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Highlands Dairy & Produce Farm"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLogin ? 'Sign In' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </form>

        {/* Instant Role Testing Switcher */}
        <div className="pt-4 border-t border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block text-center mb-2">
            Instant Test Persona Switcher (Single Click)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
            <button
              onClick={() => handleQuickDemoSwitch('farmer')}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-semibold border border-stone-200"
            >
              🧑‍🌾 Farmer Persona
            </button>
            <button
              onClick={() => handleQuickDemoSwitch('buyer')}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-semibold border border-stone-200"
            >
              🛒 Wholesale Buyer
            </button>
            <button
              onClick={() => handleQuickDemoSwitch('transporter')}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-semibold border border-stone-200"
            >
              🚚 Transporter SACCO
            </button>
            <button
              onClick={() => handleQuickDemoSwitch('admin')}
              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300"
            >
              🛡️ Super Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
