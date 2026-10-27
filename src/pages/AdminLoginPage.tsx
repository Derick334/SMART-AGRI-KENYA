import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Smartphone,
  Copy,
  Check,
  Crown,
  Key,
  UserCheck
} from 'lucide-react';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';
import { agriStore } from '../services/store';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToSite }) => {
  // Mode: 'login' | 'setup'
  const [authMode, setAuthMode] = useState<'login' | 'setup'>('login');

  // Login steps: 'credentials' | 'mfa' | 'forgot'
  const [step, setStep] = useState<'credentials' | 'mfa' | 'forgot'>('credentials');

  // Credentials fields
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // MFA fields
  const [tempToken, setTempToken] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Setup / Claim Main Super Admin fields
  const [setupStep, setSetupStep] = useState<'request' | 'verify'>('request');
  const [setupEmail, setSetupEmail] = useState('onyangoderick37@gmail.com');
  const [setupToken, setSetupToken] = useState('');
  const [challengeCode, setChallengeCode] = useState('');
  const [challengeCodeHint, setChallengeCodeHint] = useState<string | null>(null);
  const [newAdminName, setNewAdminName] = useState('Derick Onyango (Main Super Admin)');
  const [newAdminPhone, setNewAdminPhone] = useState('0700000000');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState<string | null>(null);

  // Status feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // 1. Submit Credentials (Login Step 1)
  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFeedbackNotice(null);

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (!cleanEmail || !adminPassword) {
      setErrorMessage('Please enter your authorized email address and administrator password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: adminPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrative credentials or unauthorized account.');
      }

      if (data.mfaRequired && data.tempToken) {
        setTempToken(data.tempToken);
        setTotpSecret(data.totpSecret || null);
        setStep('mfa');
        setFeedbackNotice('Password accepted. Please provide your 6-digit Authenticator code.');
      } else {
        throw new Error('Authentication sequence interrupted: MFA verification is mandatory.');
      }
    } catch (err: any) {
      setAdminPassword('');
      setErrorMessage(err.message || 'Invalid administrative credentials or unauthorized account.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit MFA TOTP Verification (Login Step 2)
  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCode = mfaCode.trim().replace(/[-\s]/g, '');
    if (!cleanCode) {
      setErrorMessage('Please enter the 6-digit PIN code from your Authenticator app.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/mfa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken,
          code: cleanCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid 6-digit Authenticator PIN or backup code.');
      }

      if (data.token && data.user) {
        // Persist admin session token
        if (typeof window !== 'undefined') {
          localStorage.setItem('deriv_agri_admin_token', data.token);
          localStorage.setItem('deriv_agri_session_token', data.token);
        }

        // Set authoritative administrator role in AgriStore
        agriStore.setCurrentUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '0700000000',
          role: 'admin',
          isMainSuperAdmin: Boolean(data.user.isMainSuperAdmin),
          adminPermissions: data.user.permissions || {
            manageUsers: true,
            manageAdmins: Boolean(data.user.isMainSuperAdmin),
            manageMarketplace: true,
            manageOrders: true,
            managePayments: true,
            manageContent: true,
            manageBranding: true,
            manageDelivery: true,
            manageSettings: true,
            viewReports: true,
          },
          county: 'Nairobi',
          town: 'Nairobi HQ',
          isVerified: true,
          status: 'active',
          membershipTier: 'Platinum',
          membershipCode: data.user.memberId || 'SAK-HQ-2026-OWNER',
          joinedDate: '2023-01-01',
        });
        agriStore.setAuthenticated(true);

        setFeedbackNotice('Authentication and MFA verified. Entering Owner Control Centre...');
        setTimeout(() => {
          onSuccess();
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'MFA verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Request Main Super Admin Setup Code
  const handleRequestSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFeedbackNotice(null);

    const cleanEmail = setupEmail.trim().toLowerCase();
    if (cleanEmail !== 'onyangoderick37@gmail.com') {
      setErrorMessage('The initial ownership activation is exclusively restricted to onyangoderick37@gmail.com.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/setup-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate setup verification challenge.');
      }

      setSetupToken(data.setupToken);
      if (data.challengeCode) {
        setChallengeCodeHint(data.challengeCode);
        setChallengeCode(data.challengeCode);
      }
      setSetupStep('verify');
      setFeedbackNotice('Server challenge issued. Verify ownership and establish your authoritative password.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Setup request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Complete Main Super Admin Setup & Verification
  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!challengeCode || challengeCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification challenge code.');
      return;
    }

    if (newAdminPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long with letters and numbers.');
      return;
    }

    if (newAdminPassword !== confirmAdminPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/setup-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupToken,
          code: challengeCode.trim(),
          password: newAdminPassword,
          name: newAdminName.trim(),
          phone: newAdminPhone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please check the code.');
      }

      if (data.token && data.user) {
        // Persist admin session token
        if (typeof window !== 'undefined') {
          localStorage.setItem('deriv_agri_admin_token', data.token);
          localStorage.setItem('deriv_agri_session_token', data.token);
        }

        // Set Main Super Admin in AgriStore
        agriStore.setCurrentUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '0700000000',
          role: 'admin',
          isMainSuperAdmin: true,
          adminPermissions: {
            manageUsers: true,
            manageAdmins: true,
            manageMarketplace: true,
            manageOrders: true,
            managePayments: true,
            manageContent: true,
            manageBranding: true,
            manageDelivery: true,
            manageSettings: true,
            viewReports: true,
          },
          county: 'Nairobi',
          town: 'Nairobi HQ',
          isVerified: true,
          status: 'active',
          membershipTier: 'Platinum',
          membershipCode: data.user.memberId || 'SAK-HQ-2026-OWNER',
          joinedDate: '2023-01-01',
        });
        agriStore.setAuthenticated(true);

        setFeedbackNotice('🎉 Main Super Admin verified and activated! Entering Control Centre...');
        setTimeout(() => {
          onSuccess();
        }, 700);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Setup completion failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Password Recovery Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setIsLoading(true);
    setForgotFeedback(null);

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotEmail.trim().toLowerCase() }),
      });
      setForgotFeedback('If this email is an authorized administrative account, recovery instructions have been dispatched.');
    } catch {
      setForgotFeedback('If this email is an authorized administrative account, recovery instructions have been dispatched.');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    if (totpSecret && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(totpSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <SmartAgriLogo variant="full" size="md" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCF8EE] border border-[#D6A545]/40 text-[#79543A] text-[11px] font-black uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-[#D6A545]" />
            <span>Private Administration Zone</span>
          </div>
          <h1 className="text-2xl font-black text-[#214E34]">
            {authMode === 'setup' ? 'Main Super Admin Activation' : (
              step === 'credentials' ? 'Administrator Login' :
              step === 'mfa' ? 'Multi-Factor Verification' :
              'Administrative Recovery'
            )}
          </h1>
          <p className="text-xs text-[#68756A] max-w-sm mx-auto">
            {authMode === 'setup' ? 'Ownership verification for designated platform authority: onyangoderick37@gmail.com' : (
              step === 'credentials' ? 'Restricted to verified administrators. Public registration is prohibited.' :
              step === 'mfa' ? 'Two-factor protection enforced via standard TOTP Authenticator app.' :
              'Enter your authorized email to receive single-use credentials.'
            )}
          </p>
        </div>

        {/* Mode Selector Tabs: Standard Login vs Main Super Admin Setup */}
        <div className="bg-[#EBF3ED] p-1 rounded-xl flex gap-1 border border-[#CFD7CA] text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setStep('credentials');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white text-[#214E34] shadow-xs'
                : 'text-[#68756A] hover:text-[#214E34]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Administrator Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('setup');
              setSetupStep('request');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'setup'
                ? 'bg-[#214E34] text-white shadow-xs'
                : 'text-[#68756A] hover:text-[#214E34]'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#D6A545]" />
            <span>Activate Super Admin</span>
          </button>
        </div>

        {/* Feedback Banners */}
        {feedbackNotice && (
          <div className="p-3 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs animate-in shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xl space-y-5">
          {/* MODE 1: STANDARD ADMIN LOGIN */}
          {authMode === 'login' && (
            <>
              {/* STEP 1: CREDENTIALS */}
              {step === 'credentials' && (
                <form onSubmit={handleSubmitCredentials} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#252D27] mb-1">
                      Authorized Administrator Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        autoFocus
                        placeholder="e.g. onyangoderick37@gmail.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none font-medium"
                      />
                    </div>
                    <span className="text-[10px] text-[#68756A] block mt-1">
                      Accepts only addresses verified in server-side authorization table.
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#252D27]">Password</label>
                      <button
                        type="button"
                        onClick={() => { setStep('forgot'); setForgotFeedback(null); }}
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
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter administrator password"
                        className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[#68756A] hover:text-[#252D27] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FCF8EE] rounded-xl border border-[#D6A545]/30 flex items-start gap-2.5 text-[11px] text-[#79543A]">
                    <ShieldCheck className="w-4 h-4 text-[#D6A545] shrink-0 mt-0.5" />
                    <span>
                      All administrative operations are cryptographically audited and rate-limited. Multi-factor authentication is required for access.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#214E34] hover:bg-[#183C27] text-white font-bold text-xs py-3 rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify Credentials & Proceed to MFA</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: MULTI-FACTOR AUTHENTICATION (MFA) */}
              {step === 'mfa' && (
                <form onSubmit={handleVerifyMfa} className="space-y-4 text-xs animate-in zoom-in-95 duration-150">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#214E34] flex items-center justify-center mx-auto mb-2">
                      <Smartphone className="w-6 h-6 text-[#367C46]" />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#214E34]">Enter 6-Digit Authenticator PIN</h3>
                    <p className="text-[11px] text-[#68756A]">
                      Open Google Authenticator, Microsoft Authenticator, or enter a backup code for <strong>{adminEmail}</strong>
                    </p>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={9}
                      placeholder="e.g. 123456 or 8492-1029"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-64 mx-auto block text-center p-3 text-xl font-mono font-black tracking-widest rounded-xl border-2 border-[#367C46] bg-white text-[#214E34] focus:outline-none shadow-xs"
                    />
                  </div>

                  {/* Discreet Manual Setup Key Helper for Authenticator App Enrollment */}
                  {totpSecret && (
                    <details className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] text-[11px] group">
                      <summary className="font-semibold text-[#214E34] cursor-pointer list-none flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-[#367C46]" />
                          Need to enter setup key manually in Authenticator?
                        </span>
                        <span className="text-[10px] text-[#68756A] group-open:hidden">Show</span>
                        <span className="text-[10px] text-[#68756A] hidden group-open:inline">Hide</span>
                      </summary>
                      <div className="mt-2.5 pt-2 border-t border-[#E2E7DE] space-y-2">
                        <p className="text-[10px] text-[#68756A]">
                          In Google Authenticator or Microsoft Authenticator, select <em>&ldquo;Enter a setup key&rdquo;</em>, set Account to <strong>DERIV-AGRI KENYA</strong>, and paste the key below:
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-mono text-[10px] break-all bg-white p-2 rounded border border-[#E2E7DE] text-[#252D27] flex-1 select-all">
                            {totpSecret}
                          </div>
                          <button
                            type="button"
                            onClick={copySecret}
                            className="px-2.5 py-1.5 bg-[#214E34] text-white rounded text-[10px] font-semibold hover:bg-[#183C27] flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {copiedSecret ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </details>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setStep('credentials'); setMfaCode(''); setErrorMessage(null); }}
                      className="flex-1 py-2.5 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold hover:bg-[#F7F6F0] cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2.5 rounded-lg bg-[#214E34] hover:bg-[#183C27] text-white font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Authorize Session'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: FORGOT PASSWORD */}
              {step === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4 text-xs animate-in zoom-in-95 duration-150">
                  <p className="text-[#68756A] leading-relaxed">
                    Enter your authorized administrator email address. A single-use recovery token will be generated if the account is verified in the server allowlist.
                  </p>

                  <div>
                    <label className="block font-bold text-[#252D27] mb-1">Registered Administrator Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. onyangoderick37@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                    />
                  </div>

                  {forgotFeedback && (
                    <div className="p-3 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] rounded-lg">
                      <CheckCircle2 className="w-4 h-4 inline mr-1 text-[#367C46]" />
                      <span>{forgotFeedback}</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('credentials')}
                      className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg bg-[#214E34] text-white font-bold cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Send Recovery Token'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* MODE 2: MAIN SUPER ADMIN SETUP & VERIFICATION */}
          {authMode === 'setup' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#FCF8EE] rounded-xl border border-[#D6A545]/40 flex items-start gap-2.5 text-[11px] text-[#79543A]">
                <Crown className="w-4 h-4 text-[#D6A545] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-[#252D27]">Exclusive Platform Authority Identity</strong>
                  <span>
                    Only <strong>onyangoderick37@gmail.com</strong> is authorized as the Main Super Admin. To prevent unauthorized takeovers, a cryptographic challenge must be completed before privileges are unlocked.
                  </span>
                </div>
              </div>

              {setupStep === 'request' && (
                <form onSubmit={handleRequestSetup} className="space-y-4">
                  <div>
                    <label className="block font-bold text-[#252D27] mb-1">
                      Main Super Admin Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                      <input
                        type="email"
                        readOnly
                        value={setupEmail}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E7DE] bg-gray-50 text-[#252D27] font-semibold cursor-not-allowed select-all"
                      />
                    </div>
                    <span className="text-[10px] text-[#68756A] block mt-1">
                      Permanently linked to the authoritative platform creator account.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#214E34] hover:bg-[#183C27] text-white font-bold py-3 rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Key className="w-4 h-4 text-[#D6A545]" />
                        <span>Issue Ownership Verification Challenge</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {setupStep === 'verify' && (
                <form onSubmit={handleCompleteSetup} className="space-y-4 animate-in fade-in">
                  {challengeCodeHint && (
                    <div className="p-3 bg-[#EBF3ED] rounded-xl border border-[#367C46]/30 text-[#214E34] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#367C46]" />
                          Server Verification Challenge Code:
                        </span>
                        <span className="font-mono font-black text-sm px-2 py-0.5 bg-white rounded border border-[#367C46]/40 text-[#214E34]">
                          {challengeCodeHint}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#68756A]">
                        Enter this 6-digit challenge code below to establish server-side verification.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-[#252D27] mb-1">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 582910"
                      value={challengeCode}
                      onChange={(e) => setChallengeCode(e.target.value)}
                      className="w-full p-2.5 text-center font-mono font-black text-lg tracking-widest rounded-lg border-2 border-[#367C46] bg-white text-[#214E34] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#252D27] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#252D27] mb-1">Direct Phone</label>
                      <input
                        type="tel"
                        required
                        value={newAdminPhone}
                        onChange={(e) => setNewAdminPhone(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#252D27] mb-1">
                      Set Authoritative Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#68756A] absolute left-3 top-3" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 8 characters (letters + numbers)"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-[#68756A] hover:text-[#252D27] cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#252D27] mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-type password to confirm"
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] font-mono"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSetupStep('request')}
                      className="flex-1 py-2.5 rounded-lg border border-[#E2E7DE] text-[#68756A] font-semibold hover:bg-[#F7F6F0] cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-2 py-2.5 rounded-lg bg-[#214E34] hover:bg-[#183C27] text-white font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4 text-[#D6A545]" />
                      <span>{isLoading ? 'Activating...' : 'Verify & Enter Control Centre'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Back to Public Site link */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 text-xs text-[#68756A] hover:text-[#214E34] font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
