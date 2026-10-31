import React, { useState } from 'react';
import {
  Sprout,
  Users,
  Building2,
  GraduationCap,
  ClipboardList,
  Store,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Calendar,
  FileText
} from 'lucide-react';

interface ServicesOverviewPageProps {
  onSelectTab: (tabId: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const ServicesOverviewPage: React.FC<ServicesOverviewPageProps> = ({
  onSelectTab,
  onOpenAuth
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const services = [
    {
      id: 'farmer',
      category: 'farmer',
      title: 'Farmer Support & Field Advisory',
      tagline: 'Highland & dryland agronomic precision for Kenyan smallholders',
      icon: Sprout,
      color: 'emerald',
      features: [
        'Certified Soil Health Testing with KALRO laboratory validation',
        'Real-time pest and fungal diagnosis with AI and expert agronomist review',
        'Seasonal crop calendar aligned with Kenya Meteorological Department (KMD)',
        'Farm recordkeeping: crop yields, livestock health, expenses and sales',
        'Direct connection to wholesale buyers with M-Pesa escrow protection'
      ],
      ctaText: 'Access Farmer Tools',
      action: () => onSelectTab('soil-testing')
    },
    {
      id: 'expert',
      category: 'expert',
      title: 'Agricultural Experts & Agronomist Network',
      tagline: 'Connect with verified soil scientists, plant pathologists & veterinarians',
      icon: Users,
      color: 'teal',
      features: [
        'Private 1-on-1 farmer consultations via in-app booking',
        'Certified laboratory soil test analysis and amendment recommendations',
        'Plant pathology and pest outbreak clinical diagnoses',
        'Digital credential verification with Kenya Veterinary Board (KVB) seal',
        'Earn consulting fees through secure platform disbursements'
      ],
      ctaText: 'Book Agronomist Consultation',
      action: () => onSelectTab('experts')
    },
    {
      id: 'agribusiness',
      category: 'agribusiness',
      title: 'Agribusiness & Agrovet Commercial Hub',
      tagline: 'Supply certified inputs, machinery hire & cold-chain distribution',
      icon: Store,
      color: 'amber',
      features: [
        'Direct marketplace storefront for certified seeds, fertilizers & machinery',
        'Bulk grain and produce procurement directly from farmer cooperatives',
        'Escrow-secured B2B payments preventing default and delivery disputes',
        'Integrated KeNHA corridor logistics and transporter fleet dispatch',
        'Real-time price intelligence across 47 county commodity markets'
      ],
      ctaText: 'Browse Agrovet Marketplace',
      action: () => onSelectTab('marketplace')
    },
    {
      id: 'cooperative',
      category: 'cooperative',
      title: 'Cooperative Union & Aggregation Hubs',
      tagline: 'Empowering smallholder farmer societies and SACCOs',
      icon: Building2,
      color: 'blue',
      features: [
        'Digital membership roster management with unique SA-2026-XXXXXX IDs',
        'Bulk grain silo inventory tracking and moisture level compliance',
        'Collective inputs procurement for bulk discounts on DAP, CAN and lime',
        'Automated M-Pesa batch disbursement to member farmers upon sales',
        'Credit scoring and crop collateral records for agricultural finance'
      ],
      ctaText: 'Explore Cooperative Features',
      action: () => onSelectTab('dashboard')
    },
    {
      id: 'extension',
      category: 'extension',
      title: 'Government & Community Extension Services',
      tagline: 'Ward-level agricultural outreach, surveillance & field schools',
      icon: ClipboardList,
      color: 'green',
      features: [
        'Standardized digital field inspection reporting with geo-stamping',
        'Early pest and disease surveillance outbreak alerts',
        'Farmer Field School (FFS) demonstration scheduling and attendance logs',
        'Sub-county climate-smart agricultural advisory broadcasting via SMS',
        'Direct linkage between county agricultural offices and rural growers'
      ],
      ctaText: 'Extension Officer Logs',
      action: () => onSelectTab('dashboard')
    },
    {
      id: 'research',
      category: 'research',
      title: 'Agricultural Research & Academic Innovation',
      tagline: 'Connecting universities, KALRO trials, and young agronomists',
      icon: GraduationCap,
      color: 'indigo',
      features: [
        'Access to KALRO certified crop variety databases and drought trial results',
        'Field trial protocol management and student internship tracking',
        'Agronomic data synthesis across 47 counties for academic papers',
        'Student digital research credentials with KEPHIS-aligned frameworks',
        'Grants, training webinars, and peer-reviewed extension bulletins'
      ],
      ctaText: 'Access Research Portal',
      action: () => onSelectTab('dashboard')
    }
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#173A25] via-[#214E34] to-[#2C6343] text-white p-8 md:p-14 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>National Agricultural Technology Platform · Kenya 47 Counties</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Comprehensive Digital Agricultural Ecosystem
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            From precision soil testing and AI-driven disease diagnosis to certified seed sourcing, cooperative grain silo aggregation, and M-Pesa secured trade, SMART-AGRI Kenya unifies the agricultural value chain.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth ? onOpenAuth('register') : onSelectTab('membership')}
              className="px-5 py-2.5 bg-[#48A366] hover:bg-[#3d8c56] text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-black/20 transition flex items-center gap-2"
            >
              <span>Register for Digital Membership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('verify')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Verify Member ID</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'all', label: 'All Platform Services' },
          { id: 'farmer', label: 'Smallholder Farmers' },
          { id: 'expert', label: 'Agronomists & Experts' },
          { id: 'agribusiness', label: 'Agribusiness & Agrovets' },
          { id: 'cooperative', label: 'Farmer Cooperatives' },
          { id: 'extension', label: 'Extension Officers' },
          { id: 'research', label: 'Research & Academics' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-[#214E34] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#214E34] flex items-center justify-center border border-emerald-100">
                  <Icon className="w-6 h-6 text-[#214E34]" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{service.tagline}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={service.action}
                  className="w-full py-2.5 px-4 bg-[#214E34] hover:bg-[#1a3e29] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Compliance Banner */}
      <div className="bg-[#FAF9F5] border border-amber-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
            <ShieldCheck className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm md:text-base">
              National Standards Compliance & Partner Integration
            </h4>
            <p className="text-xs text-gray-600 mt-0.5 max-w-xl">
              SMART-AGRI Kenya integrates with Kenya Agricultural & Livestock Research Organization (KALRO), KEPHIS seed certification, Kenya Veterinary Board (KVB), Pest Control Products Board (PCPB), and Safaricom M-Pesa.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('contact')}
            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold"
          >
            Contact Extension Desk
          </button>
          <button
            onClick={() => onSelectTab('faq')}
            className="px-4 py-2 bg-[#214E34] text-white hover:bg-[#1a3e29] rounded-xl text-xs font-bold"
          >
            Read FAQs
          </button>
        </div>
      </div>
    </div>
  );
};
