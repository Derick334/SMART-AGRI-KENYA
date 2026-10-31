import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sprout,
  Stethoscope,
  Building2,
  GraduationCap,
  Users,
  Compass,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { apiService } from '../../services/api';
import { agriStore } from '../../services/store';
import { UserRole, UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onAuthSuccess?: (user: UserProfile) => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form - Common
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [county, setCounty] = useState('Nakuru');
  const [subCounty, setSubCounty] = useState('');
  const [town, setTown] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');

  // Role-Specific Fields
  // 1. Farmer
  const [farmName, setFarmName] = useState('');
  const [farmSizeAcres, setFarmSizeAcres] = useState<number | ''>(5);
  const [cropsGrown, setCropsGrown] = useState('Maize, Irish Potatoes, French Beans');
  const [livestockKept, setLivestockKept] = useState('Dairy Cattle, Poultry');

  // 2. Expert
  const [qualifications, setQualifications] = useState('BSc Agronomy, Egerton University / PCPB Registered');
  const [areasOfExpertise, setAreasOfExpertise] = useState('Soil Fertility, Fall Armyworm IPM, Cereal Production');
  const [yearsOfExperience, setYearsOfExperience] = useState<number | ''>(8);
  const [professionalBio, setProfessionalBio] = useState('Certified consulting agronomist supporting high-value horticulture in the Rift Valley.');

  // 3. Agribusiness
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Certified Agrovet & Seed Stockist');
  const [businessLocation, setBusinessLocation] = useState('');
  const [productsAndServices, setProductsAndServices] = useState('KEPHIS Certified Seeds, Mavuno Fertilizer, Veterinary Drugs');

  // 4. Student / Researcher
  const [institution, setInstitution] = useState('University of Nairobi / KALRO Institute');
  const [researchFocus, setResearchFocus] = useState('Drought-Tolerant Sorghum & Soil Microbiome');
  const [studentId, setStudentId] = useState('');

  // 5. Cooperative / Organization
  const [organizationName, setOrganizationName] = useState('');
  const [organizationCategory, setOrganizationCategory] = useState('Dairy & Cereal Farmers SACCO');
  const [registrationNumber, setRegistrationNumber] = useState('CS/2026/8412');
  const [numberOfMembers, setNumberOfMembers] = useState<number | ''>(120);
  const [representativeName, setRepresentativeName] = useState('');

  // 6. Extension Officer
  const [extensionStation, setExtensionStation] = useState('Njoro Agricultural Sub-County Office');
  const [employerMinistry, setEmployerMinistry] = useState('County Government of Nakuru - Dept of Agriculture');
  const [specialization, setSpecialization] = useState('Crop Protection & Soil Water Conservation');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiService.login(loginIdentifier, loginPassword);
      agriStore.setCurrentUser(data.user);
      agriStore.setAuthenticated(true);
      if (onAuthSuccess) onAuthSuccess(data.user);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload: any = {
      name,
      email,
      phone,
      password,
      role,
      county,
      subCounty,
      town,
    };

    if (role === 'farmer') {
      payload.farmName = farmName || `${name}'s Farm`;
      payload.farmSizeAcres = Number(farmSizeAcres) || 2;
      payload.cropsGrown = cropsGrown.split(',').map(s => s.trim()).filter(Boolean);
      payload.livestockKept = livestockKept.split(',').map(s => s.trim()).filter(Boolean);
    } else if (role === 'expert') {
      payload.qualifications = qualifications;
      payload.areasOfExpertise = areasOfExpertise.split(',').map(s => s.trim()).filter(Boolean);
      payload.yearsOfExperience = Number(yearsOfExperience) || 3;
      payload.professionalBio = professionalBio;
    } else if (role === 'agribusiness') {
      payload.businessName = businessName || `${name}'s Agribusiness`;
      payload.businessType = businessType;
      payload.businessLocation = businessLocation || `${county} Town`;
      payload.productsAndServices = productsAndServices.split(',').map(s => s.trim()).filter(Boolean);
    } else if (role === 'student') {
      payload.institution = institution;
      payload.researchFocus = researchFocus;
      payload.studentId = studentId;
    } else if (role === 'cooperative') {
      payload.organizationName = organizationName || `${name} Cooperative`;
      payload.organizationCategory = organizationCategory;
      payload.registrationNumber = registrationNumber;
      payload.numberOfMembers = Number(numberOfMembers) || 50;
      payload.representativeName = representativeName || name;
    } else if (role === 'extension') {
      payload.extensionStation = extensionStation;
      payload.employerMinistry = employerMinistry;
      payload.specialization = specialization;
    }

    try {
      const data = await apiService.register(payload);
      agriStore.setCurrentUser(data.user);
      agriStore.setAuthenticated(true);
      setSuccessMsg(data.message || `Membership approved! Code: ${data.user.membershipCode}`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(data.user);
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories: Array<{ id: UserRole; title: string; subtitle: string; icon: any }> = [
    { id: 'farmer', title: 'Farmer', subtitle: 'Smallholder & commercial crop / livestock grower', icon: Sprout },
    { id: 'expert', title: 'Agricultural Expert', subtitle: 'Agronomist, Soil Scientist or Veterinarian', icon: Stethoscope },
    { id: 'agribusiness', title: 'Agribusiness Owner', subtitle: 'Input stockist, agrovet, seed distributor', icon: Building2 },
    { id: 'student', title: 'Student / Researcher', subtitle: 'Academic researcher, student fellow', icon: GraduationCap },
    { id: 'cooperative', title: 'Cooperative / SACCO', subtitle: 'Farmer group, aggregation union', icon: Users },
    { id: 'extension', title: 'Extension Officer', subtitle: 'County agricultural field officer', icon: Compass },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E2E7DE] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#214E34] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D6A545] tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4 text-[#D6A545]" />
            <span>National Agricultural Digital Registry</span>
          </div>
          <h2 className="text-2xl font-black">
            {mode === 'login' ? 'Sign In to SMART-AGRI' : 'Create Digital Membership'}
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-lg">
            {mode === 'login' 
              ? 'Access your farm records, digital ID card, weather advisory, and AI specialist tools.'
              : 'Join Kenya\'s authoritative digital agricultural ecosystem and get your unique SA-2026 membership card.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'login' ? 'bg-[#D6A545] text-[#252D27] shadow-xs' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'register' ? 'bg-[#D6A545] text-[#252D27] shadow-xs' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Register New Member
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 mb-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 mb-4 bg-[#EBF3ED] border border-[#CFD7CA] rounded-xl flex items-start gap-2.5 text-xs text-[#214E34]">
              <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0 mt-0.5" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">
                  Email, Phone Number, or Membership ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#68756A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. farmer@smart-agri.ke or 0722123456 or SA-2026-F48291"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27] focus:outline-none focus:ring-2 focus:ring-[#367C46]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#68756A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27] focus:outline-none focus:ring-2 focus:ring-[#367C46]"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-[#EBF3ED] rounded-xl text-xs text-[#214E34] border border-[#CFD7CA]">
                <p className="font-bold">Verified Demo Accounts Available:</p>
                <p className="text-[11px] text-[#446F52] mt-0.5">
                  Farmer: <code className="font-mono bg-white px-1 py-0.5 rounded">farmer@deriv-agri.ke</code> (Pass: <code className="font-mono">Agri2026Secure!</code>)
                </p>
                <p className="text-[11px] text-[#446F52] mt-0.5">
                  Agronomist: <code className="font-mono bg-white px-1 py-0.5 rounded">consultant@deriv-agri.ke</code> (Pass: <code className="font-mono">Consult2026Pass!</code>)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#214E34] hover:bg-[#183C27] text-white py-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Multi-Category Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-[#214E34] mb-2 uppercase tracking-wider">
                  Select Your Membership Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = role === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setRole(cat.id)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-[#EBF3ED] border-[#367C46] ring-2 ring-[#367C46]/20' 
                            : 'bg-[#F7F6F0] border-[#E2E7DE] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#367C46]' : 'text-[#68756A]'}`} />
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#367C46]" />}
                        </div>
                        <div className="mt-2">
                          <div className={`text-xs font-bold ${isSelected ? 'text-[#214E34]' : 'text-[#252D27]'}`}>
                            {cat.title}
                          </div>
                          <div className="text-[10px] text-[#68756A] line-clamp-1 mt-0.5">
                            {cat.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Common Personal Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Samuel Kiprop Kimani"
                    className="w-full px-3.5 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27] focus:outline-none focus:ring-2 focus:ring-[#367C46]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. samuel@gmail.com"
                    className="w-full px-3.5 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27] focus:outline-none focus:ring-2 focus:ring-[#367C46]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">M-Pesa Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0722123456"
                    className="w-full px-3.5 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27] focus:outline-none focus:ring-2 focus:ring-[#367C46]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27] focus:outline-none focus:ring-2 focus:ring-[#367C46]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">County *</label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27] focus:outline-none focus:ring-2 focus:ring-[#367C46]"
                  >
                    {KENYA_COUNTIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name} County</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252D27] mb-1">Sub-County / Town</label>
                  <input
                    type="text"
                    value={subCounty}
                    onChange={(e) => setSubCounty(e.target.value)}
                    placeholder="e.g. Njoro / Rongai"
                    className="w-full px-3.5 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27] focus:outline-none focus:ring-2 focus:ring-[#367C46]"
                  />
                </div>
              </div>

              {/* Role-Specific Form Sections */}
              <div className="pt-2 border-t border-[#E2E7DE]">
                <h4 className="text-xs font-bold text-[#214E34] uppercase tracking-wider mb-2">
                  {role === 'farmer' && '🧑‍🌾 Farm & Agricultural Details'}
                  {role === 'expert' && '🔬 Professional Qualifications & Expertise'}
                  {role === 'agribusiness' && '🏢 Agribusiness & Enterprise Details'}
                  {role === 'student' && '🎓 Academic & Research Profile'}
                  {role === 'cooperative' && '🤝 Cooperative & Organization Profile'}
                  {role === 'extension' && '🌾 County Extension Station & Mandate'}
                </h4>

                {role === 'farmer' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Farm Name</label>
                        <input
                          type="text"
                          value={farmName}
                          onChange={(e) => setFarmName(e.target.value)}
                          placeholder="e.g. Rongai Valley Mixed Farm"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Farm Size (Acres)</label>
                        <input
                          type="number"
                          value={farmSizeAcres}
                          onChange={(e) => setFarmSizeAcres(e.target.value ? Number(e.target.value) : '')}
                          placeholder="e.g. 5.0"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#252D27] mb-1">Crops Grown</label>
                      <input
                        type="text"
                        value={cropsGrown}
                        onChange={(e) => setCropsGrown(e.target.value)}
                        placeholder="e.g. Maize, Potatoes, Tomatoes, Coffee"
                        className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#252D27] mb-1">Livestock Kept</label>
                      <input
                        type="text"
                        value={livestockKept}
                        onChange={(e) => setLivestockKept(e.target.value)}
                        placeholder="e.g. Dairy Cattle, Kienyeji Chickens, Sheep"
                        className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                      />
                    </div>
                  </div>
                )}

                {role === 'expert' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#252D27] mb-1">Qualifications & Board Registration</label>
                      <input
                        type="text"
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)}
                        placeholder="e.g. BSc Agronomy / PCPB Reg #AGR-2024"
                        className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Areas of Expertise</label>
                        <input
                          type="text"
                          value={areasOfExpertise}
                          onChange={(e) => setAreasOfExpertise(e.target.value)}
                          placeholder="e.g. Soil Chemistry, Pest IPM, Dairy Nutrition"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Years of Practical Experience</label>
                        <input
                          type="number"
                          value={yearsOfExperience}
                          onChange={(e) => setYearsOfExperience(e.target.value ? Number(e.target.value) : '')}
                          placeholder="e.g. 7"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {role === 'agribusiness' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Business Name</label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Rift Valley Agrovet Supplies"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Enterprise Type</label>
                        <input
                          type="text"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          placeholder="e.g. Agro-Dealer, Seed Supplier, Milling"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {role === 'student' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">University / Research Institute</label>
                        <input
                          type="text"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="e.g. Egerton University / KALRO"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Student / Researcher ID</label>
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="e.g. AGR/2026/041"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {role === 'cooperative' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Cooperative Society Name</label>
                        <input
                          type="text"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="e.g. Rongai Dairy & Grain Cooperative"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Govt Registration Number</label>
                        <input
                          type="text"
                          value={registrationNumber}
                          onChange={(e) => setRegistrationNumber(e.target.value)}
                          placeholder="e.g. CS/2026/9102"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {role === 'extension' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Extension Ward / Station</label>
                        <input
                          type="text"
                          value={extensionStation}
                          onChange={(e) => setExtensionStation(e.target.value)}
                          placeholder="e.g. Njoro Sub-County Agricultural Office"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#252D27] mb-1">Designation & Ministry Dept</label>
                        <input
                          type="text"
                          value={employerMinistry}
                          onChange={(e) => setEmployerMinistry(e.target.value)}
                          placeholder="e.g. Agricultural Officer II"
                          className="w-full px-3 py-2 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-xs font-medium text-[#252D27]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#FCF8EE] rounded-xl border border-[#E2E7DE] text-xs text-[#79543A]">
                <p className="font-bold">Automatic Digital Membership Generation:</p>
                <p className="text-[11px] mt-0.5">
                  Upon submission, you will immediately receive an official SMART-AGRI Kenyan Agricultural Registry membership card in format <code className="font-mono font-bold bg-white px-1 py-0.5 rounded">SA-2026-XXXXXX</code> with a verifiable cryptographic QR code.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#214E34] hover:bg-[#183C27] text-white py-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Issuing Digital Membership...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D6A545]" />
                    <span>Complete Registration & Generate Card</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
