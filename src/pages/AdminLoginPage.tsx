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
  Check
} from 'lucide-react';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';
import { agriStore } from '../services/store';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToSite }) => {
  // Step: 'credentials' | 'mfa' | 'forgot'
  const [step, setStep] = useState<'credentials' | 'mfa' | 'forgot'>('credentials');

  // Credentials fields
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // MFA fields
  const [tempToken, setTempToken] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState<string | null>(null);

  // Status feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // 1. Submit Credentials (Step 1)
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
        setTotpUri(data.totpUri || null);
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

  // 2. Submit MFA TOTP Verification (Step 2)
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

  // 3. Password Recovery Request
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
            {step === 'credentials' && 'Owner & Admin Access'}
            {step === 'mfa' && 'Multi-Factor Verification'}
            {step === 'forgot' && 'Administrative Recovery'}
          </h1>
          <p className="text-xs text-[#68756A] max-w-sm mx-auto">
            {step === 'credentials' && 'Restricted to pre-authorized platform owners and executive administrators.'}
            {step === 'mfa' && 'Two-factor protection enforced via standard TOTP Authenticator app.'}
            {step === 'forgot' && 'Enter your authorized email to receive single-use credentials.'}
          </p>
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
                    placeholder="e.g. owner@deriv-agri.ke"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27] focus:border-[#367C46] focus:outline-none font-medium"
                  />
                </div>
                <span className="text-[10px] text-[#68756A] block mt-1">
                  Accepts only addresses listed in trusted server-side deployment configuration.
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
                  placeholder="admin@deriv-agri.ke"
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
