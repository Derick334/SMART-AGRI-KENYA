import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  AlertCircle,
  KeyRound,
  ShieldAlert,
  Copy,
  Check,
  Search,
  Award,
  ExternalLink,
  X,
  HelpCircle
} from 'lucide-react';
import { UserRole, UserProfile, MembershipVerificationResult } from '../types';
import { agriStore, getCountyAbbr } from '../services/store';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';
import { apiService } from '../services/api';
import { authService, isSupabaseConfigured } from '../services/auth';

interface AuthPageProps {
  onSuccess: (role: UserRole, destination?: string) => void;
  intendedDestination?: string | null;
  authNotice?: string | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  onSuccess, 
  intendedDestination, 
  authNotice 
}) => {
  // Primary Tabs: Exactly TWO primary tabs ('login' | 'register')
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');
  
  // Ordinary Kenyan Agricultural Roles (Super Admin is never allowed in public registration)
  const [role, setRole] = useState<UserRole>('farmer');
  
  // Login fields (supports Email, Safaricom Phone Number, or SAK Member ID)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Registration fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [county, setCounty] = useState('Nakuru');
  const [town, setTown] = useState('Njoro');
  const [cooperativeAffiliation, setCooperativeAffiliation] = useState('');
  
  // Role-specific fields
  const [farmName, setFarmName] = useState('');
  const [farmSize, setFarmSize] = useState<number>(5);
  const [organizationName, setOrganizationName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status & Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Modals & Sub-Flows
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Member ID Verification Inline / Modal State (Discreet link inside Sign In)
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCodeInput, setVerifyCodeInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<MembershipVerificationResult | null>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Registration Success Card
  const [registeredMemberCard, setRegisteredMemberCard] = useState<UserProfile | null>(null);

  // Handle Real Authentication: Sign In
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setAuthFeedback(null);

    const trimmedId = loginIdentifier.trim();
    if (!trimmedId) {
      setErrorMessage('Please enter your email, Safaricom phone number, or Member ID.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Authenticate with Supabase Auth or authoritative server (timing-safe, scrypt hash verified, rate-limited)
      const res = await authService.signInWithEmail(trimmedId, loginPassword);
      
      if (res && res.user) {
        // Store session in local AgriStore
        agriStore.setCurrentUser(res.user);
        agriStore.setAuthenticated(true);

        const targetRole = res.user.role as UserRole;
        setAuthFeedback(`Welcome back, ${res.user.name}! Authenticated successfully.`);

        setTimeout(() => {
          onSuccess(targetRole, intendedDestination || undefined);
        }, 600);
      } else {
        throw new Error('Authentication succeeded but profile payload was incomplete.');
      }
    } catch (err: any) {
      // Clear password field on failed attempt for security
      setLoginPassword('');
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Real Authentication: Continue with Google OAuth
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);

    try {
      const { error } = await authService.signInWithGoogle();
      if (error) {
        setErrorMessage(error.message);
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in encountered an error. Please try standard sign-in.');
      setIsGoogleLoading(false);
    }
  };

  // Handle Registration: Public roles only, server generates Member ID
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Strict validation
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter both password fields.');
      return;
    }
    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (!/[0-9]/.test(regPassword) || !/[a-zA-Z]/.test(regPassword)) {
      setErrorMessage('Password must contain both letters and numbers for account security.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must accept the platform Terms of Service and Privacy Policy to proceed.');
      return;
    }

    // Role security check: Never allow admin via public registration
    if (role === 'admin') {
      setErrorMessage('Privilege escalation rejected: Administrator accounts cannot be self-assigned.');
      return;
    }

    // Clean phone number
    let cleanedPhone = regPhone.replace(/\D/g, '');
    if (cleanedPhone.startsWith('254')) cleanedPhone = '0' + cleanedPhone.slice(3);

    setIsLoading(true);

    try {
      const payload = {
        name: fullName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone: cleanedPhone || regPhone.trim(),
        password: regPassword,
        role,
        county,
        subCounty: town.trim(),
        town: town.trim(),
        farmName: role === 'farmer' ? (farmName.trim() || `${fullName}'s Farm`) : undefined,
        farmSizeAcres: role === 'farmer' ? Number(farmSize) : undefined,
        organizationName: role !== 'farmer' ? (organizationName.trim() || `${fullName} Agricultural Services`) : undefined,
        licenseNumber: (role === 'consultant' || role === 'veterinarian' || role === 'seller' || role === 'transporter' || role === 'lab') ? licenseNumber.trim() : undefined,
        cooperativeAffiliation: cooperativeAffiliation.trim() || undefined,
      };

      // Register securely via Supabase Auth & Profiles
      const res = await authService.signUpWithEmail(payload);

      if (res && res.user) {
        // Sync local store
        agriStore.setCurrentUser(res.user);
        agriStore.setAuthenticated(true);
        setRegisteredMemberCard(res.user);
        setAuthFeedback(`Registration approved! Your official Member ID is: ${res.user.memberId || res.user.membershipCode}`);
      } else {
        throw new Error('Registration response was invalid.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. An account may already exist with this email or phone.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedFromCard = () => {
    if (registeredMemberCard) {
      onSuccess(registeredMemberCard.role, intendedDestination || undefined);
    }
  };

  // Handle Member ID Verification via trusted server-side record
  const handleVerifyMemberIdSearch = async (codeToTest?: string) => {
    const code = (codeToTest || verifyCodeInput).trim().toUpperCase();
    if (!code) {
      setVerifyError('Please enter a Member ID code to verify.');
      return;
    }

    setVerifyError(null);
    setIsVerifyingCode(true);

    try {
      const res = await authService.verifyMemberId(code);
      setVerificationResult(res);
    } catch (err: any) {
      // Fallback to local store verification
      const fallbackRes = agriStore.verifyMembershipCode(code);
      setVerificationResult(fallbackRes);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Handle Forgot Password Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput) return;

    setIsLoading(true);
    setForgotFeedback(null);

    try {
      const res = await authService.requestPasswordReset(forgotInput);
      setForgotFeedback(res.message || 'Recovery instructions dispatched. If an account matches, you will receive reset instructions.');
      setForgotStep('reset');
    } catch (err: any) {
      setForgotFeedback(err.message || 'If an account exists with this identifier, recovery instructions have been sent.');
      setForgotStep('reset');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset with Token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken || !newPassword) return;

    if (newPassword.length < 8) {
      setForgotFeedback('New password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.resetPassword(newPassword, resetToken);
      setForgotFeedback(res.message || 'Password reset successfully! You may now sign in.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep('request');
        setForgotInput('');
        setResetToken('');
        setNewPassword('');
        setAuthFeedback('Password reset successful. Please sign in with your new password.');
      }, 1500);
    } catch (err: any) {
      setForgotFeedback(err.message || 'Reset token is invalid or has expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* ACCESS RESTRICTION NOTICE BANNER */}
      {authNotice && (
        <div className="p-4 bg-[#FCF8EE] border-2 border-[#D6A545] text-[#252D27] rounded-2xl flex items-start gap-3 shadow-md animate-in slide-in-from-top-2">
          <div className="w-8 h-8 rounded-lg bg-[#D6A545]/20 text-[#79543A] flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-[#79543A]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D6A545] text-white px-2 py-0.5 rounded">
                Protected Service
              </span>
              <h3 className="text-xs font-black text-[#214E34]">Restricted Access</h3>
            </div>
            <p className="text-xs font-semibold text-[#252D27] mt-1">
              {authNotice}
            </p>
            <p className="text-[11px] text-[#68756A] mt-0.5">
              Please sign in with your verified credentials or register an agricultural account. You will be redirected to your requested service automatically.
            </p>
          </div>
        </div>
      )}

      {/* General Feedback Banners */}
      {authFeedback && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{authFeedback}</span>
          </div>
          <button onClick={() => setAuthFeedback(null)} className="text-[#214E34] p-0.5 cursor-pointer">✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-lg flex items-center justify-between shadow-xs animate-in shake">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-800 p-0.5 cursor-pointer">✕</button>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <SmartAgriLogo variant="full" size="md" />
          </div>
          <h1 className="text-2xl font-black text-[#214E34]">
            {activeMode === 'login' ? 'Sign In to DERIV-AGRI KENYA' : 'Register Agricultural Account'}
          </h1>
          <p className="text-xs text-[#68756A] max-w-md mx-auto">
            Kenya's national unified platform connecting verified farmers, wholesale produce buyers, certified agrovet suppliers, licensed agronomists, veterinarians, transporters, and testing laboratories.
          </p>
        </div>

        {/* PRIMARY 2-TAB TOGGLE: Sign In vs Register (Verify Member ID removed as top-level tab) */}
        <div className="grid grid-cols-2 bg-[#F7F6F0] p-1 rounded-xl text-xs font-bold border border-[#E2E7DE] gap-1">
          <button
            type="button"
            onClick={() => { setActiveMode('login'); setErrorMessage(null); setRegisteredMemberCard(null); }}
            className={`py-2.5 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === 'login' ? 'bg-white text-[#214E34] shadow-xs border border-[#E2E7DE]' : 'text-[#68756A] hover:text-[#252D27]'
            }`}
          >
            <Lock className="w-4 h-4 text-[#367C46]" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveMode('register'); setErrorMessage(null); setRegisteredMemberCard(null); }}
            className={`py-2.5 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === 'register' ? 'bg-white text-[#214E34] shadow-xs border border-[#E2E7DE]' : 'text-[#68756A] hover:text-[#252D27]'
            }`}
          >
            <User className="w-4 h-4 text-[#367C46]" />
            <span>Create Account</span>
          </button>
        </div>

        {/* 1. SIGN IN TAB */}
        {activeMode === 'login' && (
          <div className="space-y-4">
            {/* Google OAuth Option */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#F7F6F0] border border-[#E2E7DE] text-[#252D27] font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <div className="w-4 h-4 border-2 border-[#214E34] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E7DE]"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
                  <span className="bg-white px-2 text-[#68756A]">Or Sign In with Credentials</span>
                </div>
              </div>
            </div>

            {/* Standard Credential Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#252D27] mb-1">
                  Email, Safaricom Phone Number, or Member ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. user@deriv-agri.ke, 0722123456, or SAK-NKR-2026-F4829"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none font-medium"
                  />
                </div>
                <span className="text-[10px] text-[#68756A] block mt-1">
                  Accepts your registered email, Safaricom number (07XX / 01XX), or national Member ID code.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#252D27]">Password</label>
                  <button
                    type="button"
                    onClick={() => { setShowForgotModal(true); setForgotFeedback(null); }}
                    className="text-[11px] font-semibold text-[#367C46] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#68756A] hover:text-[#252D27] cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-[#252D27]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#367C46] focus:ring-[#367C46] cursor-pointer"
                  />
                  <span>Remember me on this device</span>
                </label>

                <span className="text-[10px] text-[#68756A] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#367C46]" /> Rate-Limited & Encrypted
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#367C46] hover:bg-[#2B6437] text-white font-bold text-xs py-3 rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* DISCREET "Verify Member ID" link inside Sign In Tab */}
            <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between text-xs">
              <span className="text-[#68756A]">Need to check a credential?</span>
              <button
                type="button"
                onClick={() => {
                  setShowVerifyModal(true);
                  setVerifyError(null);
                  setVerificationResult(null);
                }}
                className="inline-flex items-center gap-1.5 text-[#214E34] hover:text-[#367C46] font-bold text-xs hover:underline cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#367C46]" />
                <span>Verify Member ID</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. REGISTRATION FORM (Public roles only, No Super Admin, Server generates Member ID) */}
        {activeMode === 'register' && !registeredMemberCard && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            {/* Account Role Selection: ONLY the 7 ordinary roles */}
            <div>
              <label className="block font-bold text-[#252D27] mb-1">
                Select Your Assigned Agriculture Role in Kenya
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'farmer', label: 'Farmer', icon: '🧑‍🌾', desc: 'Crop farming & livestock' },
                  { id: 'buyer', label: 'Produce Buyer', icon: '🛒', desc: 'Wholesale & bulk retail' },
                  { id: 'seller', label: 'Certified Supplier', icon: '🏬', desc: 'Seeds, fertilizer & agrovet' },
                  { id: 'consultant', label: 'Agronomist', icon: '🔬', desc: 'Crop extension & agronomy' },
                  { id: 'veterinarian', label: 'Veterinarian', icon: '🩺', desc: 'KVB licensed surgeon' },
                  { id: 'transporter', label: 'Transporter', icon: '🚚', desc: 'Haulage & cold chain' },
                  { id: 'lab', label: 'Testing Lab', icon: '🧪', desc: 'Soil & tissue analysis' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id as UserRole)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      role === item.id
                        ? 'border-[#367C46] bg-[#EBF3ED] text-[#214E34] shadow-xs'
                        : 'border-[#E2E7DE] hover:bg-[#F7F6F0] text-[#252D27]'
                    }`}
                  >
                    <div className="text-base mb-1">{item.icon}</div>
                    <div className="font-bold text-[11px] leading-tight">{item.label}</div>
                    <div className="text-[9px] text-[#68756A] leading-tight mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice: Server-Generated Unique Member IDs */}
            <div className="p-3 bg-[#EBF3ED] border border-[#CFD7CA] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#68756A] uppercase tracking-wider block">Official Agricultural Membership</span>
                <span className="font-semibold text-xs text-[#214E34]">
                  A unique, authoritative Member ID will be generated by the secure registry server upon registration.
                </span>
              </div>
              <ShieldCheck className="w-5 h-5 text-[#367C46] shrink-0" />
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#252D27] mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Kiprop Kimani"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#252D27] mb-1">Safaricom Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="07XXXXXXXX or 01XXXXXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#252D27] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. samuel@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>
            </div>

            {/* County & Town */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#252D27] mb-1">County (Kenya)</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-medium cursor-pointer"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.capital})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#252D27] mb-1">Sub-County / Market Town</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Njoro, Eldoret CBD, Kongowea"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                />
              </div>
            </div>

            {/* Cooperative / SACCO Code (Optional) */}
            <div>
              <label className="block font-bold text-[#252D27] mb-1">
                Affiliated Co-operative / SACCO / KENAFF Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. KTDA, Brookside Dairy Co-op, KENAFF, or Local SACCO"
                value={cooperativeAffiliation}
                onChange={(e) => setCooperativeAffiliation(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
              />
            </div>

            {/* Role-Specific Fields */}
            {role === 'farmer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Farm Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rongai Valley Mixed Farm"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Total Acreage</label>
                  <input
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={farmSize}
                    onChange={(e) => setFarmSize(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
              </div>
            )}

            {(role === 'buyer' || role === 'seller' || role === 'transporter' || role === 'lab' || role === 'consultant') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Business / Enterprise Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rift Valley Agrovet / Coastal Grocers"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#252D27] mb-1">License / Accreditation Code</label>
                  <input
                    type="text"
                    placeholder="e.g. KEPHIS Reg / KASP / NTSA Code"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>
              </div>
            )}

            {role === 'veterinarian' && (
              <div className="p-3.5 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                <label className="block font-bold text-[#252D27] mb-1">Kenya Veterinary Board (KVB) License Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KVB-VS-2940"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-mono"
                />
              </div>
            )}

            {/* Password and Confirmation (min 8 chars, letters and numbers) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#252D27] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 8 chars, letters & numbers"
                    className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-[#68756A]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#252D27] mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-3 text-[#68756A]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Privacy Policy acceptance */}
            <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-[#367C46] focus:ring-[#367C46] mt-0.5 cursor-pointer"
                />
                <span className="text-[#252D27] leading-relaxed">
                  I agree to the platform{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-bold text-[#367C46] underline cursor-pointer"
                  >
                    Terms of Service, Agriculture Code of Conduct, and Data Privacy Policy
                  </button>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#367C46] hover:bg-[#2B6437] text-white font-bold text-xs py-3 rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Secure Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2B. NEW MEMBER DIGITAL IDENTIFICATION CARD DISPLAY */}
        {registeredMemberCard && (
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-gradient-to-br from-[#214E34] via-[#183926] to-[#0D2418] rounded-2xl text-white shadow-xl border border-[#367C46] space-y-3 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-[#D6A545]/10 pointer-events-none blur-lg" />
              
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-sm text-[#D6A545]">
                    SAK
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs tracking-wider uppercase text-white">DERIV-AGRI KENYA</h4>
                    <span className="text-[9px] text-[#D6A545] font-semibold">Official Agricultural Member Card</span>
                  </div>
                </div>
                <span className="bg-[#367C46] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/20">
                  {registeredMemberCard.membershipTier || 'Verified'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[9px] text-white/60 block">Member Name</span>
                  <span className="font-bold text-white text-sm">{registeredMemberCard.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-white/60 block">Role & County</span>
                  <span className="font-semibold text-white capitalize">{registeredMemberCard.role} • {registeredMemberCard.county}</span>
                </div>
              </div>

              <div className="p-2.5 bg-black/30 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#D6A545] block font-mono font-bold uppercase tracking-wider">Authoritative Member ID</span>
                  <span className="font-mono text-sm sm:text-base font-black text-white tracking-wider">{registeredMemberCard.membershipCode || registeredMemberCard.memberId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(registeredMemberCard.membershipCode || registeredMemberCard.memberId || '')}
                  className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[9px] text-white/60 pt-1">
                <span>Issued: {registeredMemberCard.joinedDate}</span>
                <span>Authoritative Agricultural Database Registry</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedFromCard}
              className="w-full bg-[#367C46] hover:bg-[#2B6437] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Access Your Dashboard & Protected Features</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3. DISCREET MEMBER ID VERIFICATION MODAL / DRAWER (Zero PII leak, rate-limited against scraping) */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EBF3ED] text-[#214E34] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#367C46]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#214E34]">National Member ID Registry Verification</h3>
                  <span className="text-[10px] text-[#68756A]">Authoritative database lookup with zero PII exposure</span>
                </div>
              </div>
              <button 
                onClick={() => { setShowVerifyModal(false); setVerificationResult(null); }} 
                className="text-[#68756A] hover:text-[#252D27] cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[#68756A] text-[11px] leading-relaxed">
                Enter an official Member ID code (e.g. SAK-NKR-2026-F4829) to verify its accreditation status. For data privacy protection, personal contact details and private account records are never revealed to third parties.
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={verifyCodeInput}
                    onChange={(e) => setVerifyCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter code: e.g. SAK-NKR-2026-F4829"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-mono font-bold tracking-wider uppercase focus:border-[#367C46] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleVerifyMemberIdSearch()}
                  disabled={isVerifyingCode}
                  className="px-4 py-2.5 bg-[#214E34] hover:bg-[#183C27] text-white font-bold rounded-lg cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isVerifyingCode ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Verify</span>
                  )}
                </button>
              </div>

              {verifyError && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-[11px]">
                  {verifyError}
                </div>
              )}

              {/* Minimal Verification Result (Zero PII) */}
              {verificationResult && (
                <div className="p-4 rounded-xl border space-y-3 bg-[#F7F6F0] border-[#CFD7CA] animate-in fade-in">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        verificationResult.isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {verificationResult.isValid ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-[#252D27]">
                          {verificationResult.isValid ? 'Authentic Registration Record' : 'Record Not Found or Suspended'}
                        </h4>
                        <span className="font-mono text-[11px] font-semibold text-[#68756A]">{verificationResult.code}</span>
                      </div>
                    </div>

                    {verificationResult.isValid && (
                      <span className="bg-[#214E34] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {verificationResult.status ? verificationResult.status.toUpperCase() : 'ACTIVE'}
                      </span>
                    )}
                  </div>

                  {/* Sanitized Minimal Attributes Only */}
                  {verificationResult.isValid && (
                    <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-lg border border-[#E2E7DE] text-[11px]">
                      <div>
                        <span className="text-[10px] text-[#68756A] block">Accredited Role</span>
                        <strong className="text-[#214E34] capitalize">{verificationResult.role}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#68756A] block">County Jurisdiction</span>
                        <span className="text-[#252D27] font-semibold">{verificationResult.county} County</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#68756A] block">Membership Tier</span>
                        <span className="text-[#79543A] font-bold">{verificationResult.membershipTier || 'Silver'} Member</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#68756A] block">Verification Time</span>
                        <span className="text-[#68756A]">{verificationResult.verifiedAt}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 bg-white/70 rounded-lg text-[10px] text-[#68756A] space-y-1">
                    <div className="font-semibold text-[#214E34] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#367C46]" />
                      <span>Zero PII Protection Policy</span>
                    </div>
                    <p>
                      In compliance with Kenyan Data Protection Regulations, individual names, phone numbers, email addresses, and private transactions are strictly confidential.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => { setShowVerifyModal(false); setVerificationResult(null); }}
                className="px-4 py-2 rounded-lg bg-[#214E34] text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FORGOT PASSWORD MODAL (Opaque single-use tokens, rate-limited) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <h3 className="text-base font-bold text-[#214E34]">Account Password Recovery</h3>
              <button 
                onClick={() => { setShowForgotModal(false); setForgotFeedback(null); setForgotStep('request'); }} 
                className="text-[#68756A] hover:text-[#252D27] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-[#68756A] leading-relaxed">
                  Enter your registered Safaricom phone number, email address, or Member ID. A secure, single-use password recovery token will be dispatched.
                </p>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Registered Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0722123456 or user@domain.ke"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-[#367C46] text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Send Recovery Token'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                {forgotFeedback && (
                  <div className="p-2.5 bg-[#EBF3ED] text-[#214E34] rounded-lg text-[11px] font-semibold">
                    {forgotFeedback}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Recovery Token</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter the token received"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">New Secure Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 8 characters, letters & numbers"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-[#367C46] text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. TERMS AND CONDITIONS MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <h3 className="text-base font-bold text-[#214E34]">DERIV-AGRI KENYA Platform Terms</h3>
              <button onClick={() => setShowTermsModal(false)} className="text-[#68756A] hover:text-[#252D27] cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-[#252D27] leading-relaxed">
              <p><strong>1. Role-Based Governance:</strong> Every participant on DERIV-AGRI KENYA agrees to operate within their declared role (Farmer, Produce Buyer, Certified Supplier, Agronomist, Veterinarian, Transporter, Laboratory Partner, or Administrator).</p>
              <p><strong>2. KEPHIS & PCPB Compliance:</strong> Sellers and input distributors warrant that all seed lots possess legitimate KEPHIS certification and PCPB pesticide registration badges.</p>
              <p><strong>3. Escrow & Payment Protection:</strong> Payments made by buyers for wholesale agricultural produce remain locked in escrow until the recipient physically inspects and confirms produce quality.</p>
              <p><strong>4. Animal Welfare & Veterinary Care:</strong> All livestock listings must feature genuine veterinary vaccination records verified by Kenya Veterinary Board licensed officers.</p>
              <p><strong>5. Data Protection:</strong> Personal data is processed in compliance with the Kenya Data Protection Act 2019. Member IDs serve as public verification credentials without exposing private identity data.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => { setAgreeTerms(true); setShowTermsModal(false); }}
                className="px-4 py-2 rounded-lg bg-[#367C46] text-white font-bold cursor-pointer"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
