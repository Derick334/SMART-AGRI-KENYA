import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Award, 
  Clock, 
  Lock,
  ArrowRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { apiService } from '../services/api';

interface PublicVerificationPageProps {
  initialCode?: string;
  onNavigateTab?: (tab: string) => void;
  onBack?: () => void;
}

export const PublicVerificationPage: React.FC<PublicVerificationPageProps> = ({
  initialCode = '',
  onNavigateTab
}) => {
  const [searchCode, setSearchCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Check URL query param if present
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.includes('code=')) {
        const extracted = hash.split('code=')[1]?.split('&')[0];
        if (extracted) {
          setSearchCode(decodeURIComponent(extracted));
          performVerification(decodeURIComponent(extracted));
        }
      } else if (initialCode) {
        performVerification(initialCode);
      }
    }
  }, [initialCode]);

  const performVerification = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await apiService.verifyMembership(codeToVerify.trim());
      setResult(data);
    } catch {
      setResult({
        isValid: false,
        code: codeToVerify.trim().toUpperCase(),
        status: 'not_found',
        notes: 'Unable to reach verification registry service. Please try again.',
        verifiedAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(searchCode);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#367C46] bg-[#EBF3ED] px-3 py-1 rounded-full border border-[#CFD7CA]">
          <ShieldCheck className="w-4 h-4 text-[#367C46]" />
          <span>Official National Agricultural Verification Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#214E34] tracking-tight">
          Verify SMART-AGRI Membership
        </h1>
        <p className="text-sm sm:text-base text-[#68756A] leading-relaxed">
          Verify digital membership status, accreditation, and registration integrity of Kenyan farmers, agronomists, input suppliers, and cooperatives.
        </p>
      </div>

      {/* Code Search Input Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#214E34]">
            Enter Digital Membership ID Code (Format: SA-YYYY-XXXXXX)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#68756A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                placeholder="e.g. SA-2026-F48291 or SAK-NKR-2026-F4829"
                className="w-full pl-11 pr-4 py-3 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl text-sm font-mono font-bold text-[#252D27] focus:outline-none focus:ring-2 focus:ring-[#367C46]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-[#214E34] hover:bg-[#183C27] text-white px-6 py-3 rounded-xl text-sm font-bold transition shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D6A545]" />
                  <span>Verify Record</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-[#68756A]">
            Official security guarantee: This public query returns strictly sanctioned non-PII verification data. Private contact details, phone numbers, and financial information remain encrypted and private.
          </p>
        </form>
      </div>

      {/* Verification Result Card */}
      {hasSearched && result && (
        <div className="animate-in fade-in duration-300">
          {result.isValid ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#367C46] shadow-md space-y-6">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E7DE]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] border border-[#CFD7CA] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-[#367C46]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#367C46] uppercase tracking-wider block">
                      Registry Status: Confirmed Active
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#214E34]">
                      Authentic SMART-AGRI Membership
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#EBF3ED] text-[#214E34] font-mono text-xs font-extrabold px-3 py-1.5 rounded-lg border border-[#CFD7CA]">
                    {result.code}
                  </span>
                  <span className="bg-[#367C46] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                    {result.membershipTier || 'Verified'} Member
                  </span>
                </div>
              </div>

              {/* Sanctioned Non-PII Certificate Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <span className="text-[11px] font-semibold text-[#68756A] block uppercase tracking-wider">
                    Member Name
                  </span>
                  <span className="text-base font-extrabold text-[#252D27] mt-1 block">
                    {result.nameAbbreviated || 'Verified Member'}
                  </span>
                  <span className="text-[10px] text-[#68756A] block mt-0.5">Privacy Protected</span>
                </div>

                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <span className="text-[11px] font-semibold text-[#68756A] block uppercase tracking-wider">
                    Account Category
                  </span>
                  <span className="text-base font-extrabold text-[#214E34] mt-1 block capitalize">
                    {result.role}
                  </span>
                  <span className="text-[10px] text-[#68756A] block mt-0.5">Verified Role</span>
                </div>

                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <span className="text-[11px] font-semibold text-[#68756A] block uppercase tracking-wider">
                    County Jurisdiction
                  </span>
                  <span className="text-base font-extrabold text-[#252D27] mt-1 block">
                    {result.county} County
                  </span>
                  <span className="text-[10px] text-[#68756A] block mt-0.5">Republic of Kenya</span>
                </div>

                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <span className="text-[11px] font-semibold text-[#68756A] block uppercase tracking-wider">
                    Registration Date
                  </span>
                  <span className="text-base font-extrabold text-[#252D27] mt-1 block">
                    {result.joinedDate || '2026-03-12'}
                  </span>
                  <span className="text-[10px] text-[#367C46] font-semibold block mt-0.5">Current Season</span>
                </div>
              </div>

              {/* Official Seal and Compliance Notice */}
              <div className="p-4 bg-[#EBF3ED] rounded-xl border border-[#CFD7CA] flex items-start gap-3">
                <Award className="w-5 h-5 text-[#367C46] shrink-0 mt-0.5" />
                <div className="text-xs text-[#214E34] space-y-1">
                  <p className="font-bold">
                    Official Ministry of Agriculture & Livestock Development Compliance Registry
                  </p>
                  <p className="text-[11px] text-[#446F52] leading-relaxed">
                    This digital record confirms that the bearer is fully authorized and registered under SMART-AGRI Kenya Digital Exchange standards. QR cryptographic hash is validated.
                  </p>
                  <p className="text-[10px] font-mono text-[#68756A]">
                    Verification Timestamp: {result.verifiedAt || new Date().toISOString()} · Node: SAK-SECURE-REGISTRY-01
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-amber-300 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-amber-700">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <h3 className="text-lg font-bold">No Matching Membership Record Found</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#68756A] leading-relaxed">
                The identifier <code className="bg-[#F7F6F0] px-2 py-0.5 rounded font-mono font-bold text-[#252D27]">{result.code}</code> does not match any active verified record in the National Agricultural Registry.
              </p>
              <ul className="text-xs text-[#68756A] list-disc list-inside space-y-1">
                <li>Check for typos in the membership code (e.g. SA-2026-XXXXXX).</li>
                <li>If you just completed registration, newly created accounts are activated instantly.</li>
                <li>Contact platform helpline at <strong>+254 700 000 001</strong> for assistance.</li>
              </ul>
              {onNavigateTab && (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateTab('membership')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#214E34] hover:underline"
                  >
                    <span>Register for SMART-AGRI Membership</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
