import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Search,
  Sparkles,
  IdCard,
  Building2,
  Sprout,
  Users,
  GraduationCap,
  Store,
  Printer,
  Lock
} from 'lucide-react';
import { agriStore } from '../services/store';
import { DigitalMembershipCard } from '../components/membership/DigitalMembershipCard';

interface MembershipPublicPageProps {
  onSelectTab: (tabId: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const MembershipPublicPage: React.FC<MembershipPublicPageProps> = ({
  onSelectTab,
  onOpenAuth
}) => {
  const [searchCode, setSearchCode] = useState('');
  const currentUser = agriStore.getCurrentUser();
  const isAuth = agriStore.isAuthenticated();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    onSelectTab(`verify?code=${encodeURIComponent(searchCode.trim())}`);
  };

  const categories = [
    {
      role: 'farmer',
      title: 'Farmer & Grower',
      icon: Sprout,
      color: 'emerald',
      price: 'Free / Subsidized',
      tagline: 'For smallholder, horticultural, and commercial farmers across Kenya.',
      benefits: [
        'Permanent National Agricultural Registry ID (SA-2026-FXXXXX)',
        'Free automated soil health testing guidance with KALRO recommendations',
        'Direct produce listing on national marketplace without broker deductions',
        'M-Pesa Daraja escrow buyer payment protection',
        'Real-time agro-weather alerts for your specific county'
      ]
    },
    {
      role: 'expert',
      title: 'Agricultural Expert / Agronomist',
      icon: Users,
      color: 'teal',
      price: 'Certified Professional',
      tagline: 'For certified agronomists, veterinarians, and plant pathologists.',
      benefits: [
        'Official Expert Credential with verified credentials badge',
        'Farmer consultation booking and direct calendar management',
        'Soil laboratory test analysis and certified amendment sign-off',
        'Direct fee settlement via M-Pesa upon consultation completion',
        'Inclusion in the National Certified Agronomist Directory'
      ]
    },
    {
      role: 'agribusiness',
      title: 'Agribusiness & Agrovet Supplier',
      icon: Store,
      color: 'amber',
      price: 'Commercial Vendor',
      tagline: 'For agrochemical dealers, seed companies, and machinery providers.',
      benefits: [
        'Official Agrovet Vendor verification and KEPHIS/PCPB license display',
        'Unlimited product catalog listings with bulk inventory management',
        'B2B order fulfillment with escrow protection against default',
        'Integrated KeNHA transport dispatch for countrywide deliveries',
        'Market intelligence analytics across all 47 counties'
      ]
    },
    {
      role: 'cooperative',
      title: 'Cooperative Union / Society',
      icon: Building2,
      color: 'blue',
      price: 'Cooperative Tier',
      tagline: 'For smallholder societies, SACCOs, and community producer groups.',
      benefits: [
        'Multi-member roster management with batch member card issuance',
        'Collective grain silo aggregation and warehouse receipt recording',
        'Bulk farm inputs procurement for high-volume agrovet discounts',
        'Automated batch M-Pesa payout to member farmers upon grain sale',
        'Official partnership linkage with county agricultural departments'
      ]
    },
    {
      role: 'student',
      title: 'Academic & Researcher',
      icon: GraduationCap,
      color: 'indigo',
      price: 'Academic Free Tier',
      tagline: 'For university students, researchers, and agtech innovators.',
      benefits: [
        'Access to anonymized national crop yield and soil pH datasets',
        'Field trial protocol publishing and research project tracking',
        'Verified academic digital research badge for fieldwork',
        'Direct connection to KALRO field trials and extension workshops',
        'KEPHIS & MoALD agricultural document library downloads'
      ]
    },
    {
      role: 'extension',
      title: 'Extension Field Officer',
      icon: Award,
      color: 'green',
      price: 'Authorized Service',
      tagline: 'For county agricultural officers and certified field agents.',
      benefits: [
        'Government extension officer digital credential with QR seal',
        'Standardized digital field inspection recording with severity flags',
        'Pest & disease outbreak surveillance report submissions',
        'Farmer Field School (FFS) demonstration calendar management',
        'Sub-county farmer SMS broadcast advisory distribution'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1b432a] via-[#214E34] to-[#2c6543] p-8 md:p-14 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Official SMART-AGRI Kenya Membership System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Universal Digital Agricultural ID & Membership Cards
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Every registered farmer, expert, agribusiness, cooperative, and researcher receives a cryptographically verifiable Digital Membership Card formatted as <span className="font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded">SA-2026-XXXXXX</span> with a tamper-evident QR code.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth ? onOpenAuth('register') : null}
              className="px-5 py-3 bg-[#48A366] hover:bg-[#3d8c56] text-white rounded-xl text-sm font-bold shadow-lg shadow-black/20 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Get Your Digital Member Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('verify')}
              className="px-4 py-3 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-300" />
              <span>Verify Existing ID Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Lookup Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm max-w-2xl mx-auto -mt-6 relative z-20">
        <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#214E34]" />
          Instant Member ID Verification
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Enter any member code (e.g. <span className="font-mono font-medium text-gray-700">SA-2026-F94812</span>) to verify its authentic status and official credentials.
        </p>

        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g. SA-2026-F48291"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2.5 text-sm font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#214E34] outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#214E34] hover:bg-[#1a3e29] text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0"
          >
            <span>Verify ID</span>
            <ShieldCheck className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* If Authenticated: Preview User's Own Card */}
      {isAuth && (
        <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Your Active Credential</span>
              <h3 className="text-lg font-bold text-gray-900">Your Official Digital Membership Card</h3>
            </div>
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-xs font-bold text-[#214E34] hover:underline flex items-center gap-1"
            >
              <span>Manage in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="max-w-md mx-auto">
            <DigitalMembershipCard user={currentUser} showQrCode={true} />
          </div>
        </div>
      )}

      {/* 6 Membership Categories Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Tailored Membership Categories
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Select your exact role in Kenya’s agricultural ecosystem to unlock specialized dashboards, credentials, and verification privileges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.role}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:border-gray-300 transition"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#214E34] flex items-center justify-center border border-emerald-100">
                      <Icon className="w-5 h-5 text-[#214E34]" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {cat.price}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{cat.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cat.tagline}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    {cat.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onOpenAuth ? onOpenAuth('register') : null}
                    className="w-full py-2.5 px-4 bg-[#214E34] hover:bg-[#1a3e29] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>Register as {cat.title.split('/')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Verification Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#214E34] flex items-center justify-center">
            <Lock className="w-4 h-4 text-[#214E34]" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Non-PII Public Verification</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Public QR scans reveal only official verification status, county, and abbreviated initials (e.g. J. K.), never exposing sensitive phone numbers or national IDs.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#214E34] flex items-center justify-center">
            <Printer className="w-4 h-4 text-[#214E34]" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Offline Print & PDF Export</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Farmers in remote areas can download or print their high-resolution plastic-size card for display at agricultural shows, market stalls, and bank credit reviews.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#214E34] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#214E34]" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Super Admin Moderation</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            All professional credentials (agronomists, agrovet dealers, lab partners) undergo administrative review with audit trails before being marked Active.
          </p>
        </div>
      </div>
    </div>
  );
};
