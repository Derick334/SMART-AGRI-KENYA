import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  ShieldCheck,
  Sprout,
  DollarSign,
  Sparkles,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

interface FaqPageProps {
  onSelectTab: (tabId: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

interface FaqItem {
  q: string;
  a: string;
  category: 'membership' | 'soil' | 'marketplace' | 'ai' | 'cooperative';
}

export const FaqPage: React.FC<FaqPageProps> = ({ onSelectTab, onOpenAuth }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'membership',
      q: 'How do I obtain my official SMART-AGRI Kenya Digital Membership Card?',
      a: 'Registration is free and instantaneous. When you register on the portal by providing your county, name, contact details, and role (Farmer, Agronomist, Agribusiness, Cooperative, or Student), our backend automatically generates a guaranteed unique membership number formatted as SA-2026-XXXXXX with an integrated cryptographic QR code. You can download, print, or save this card directly from your dashboard.'
    },
    {
      category: 'membership',
      q: 'How does the public QR code verification work without exposing my private personal data?',
      a: 'In strict compliance with the Kenya Data Protection Act 2019, scanning a member’s QR code or querying their ID at /verify returns only non-PII verification data: the abbreviated name (e.g., J. K.), membership category, county jurisdiction, active verification seal, and registration year. Sensitive national ID numbers, phone numbers, and exact farm coordinates remain private and encrypted.'
    },
    {
      category: 'soil',
      q: 'How does the Soil Health Testing module connect to KALRO laboratories?',
      a: 'Our Soil Health portal accepts physical soil parameters (pH, moisture, soil texture, organic matter) measured via field test kits or official lab results from KALRO (Kenya Agricultural & Livestock Research Organization) or certified private testing labs. The system processes these measurements through evidence-based agronomic algorithms to recommend precise agricultural lime tonnage, basal fertilizer (e.g. DAP, NPK), and micro-nutrient corrections.'
    },
    {
      category: 'soil',
      q: 'What should I do if my soil pH is acidic (below 5.5)?',
      a: 'In western highlands and Rift Valley tea/maize zones, soil acidification is frequent due to continuous DAP usage. The platform provides localized agricultural lime application formulas (typically 1.0 to 2.5 tonnes of agricultural lime per acre worked into the top 15cm of soil 30 days prior to planting), accompanied by organic manure enrichment.'
    },
    {
      category: 'marketplace',
      q: 'How does M-Pesa Daraja STK Push Escrow protect farmers and buyers?',
      a: 'When a buyer places an order for crops, livestock, or inputs, their payment is secured in a platform escrow vault via Safaricom M-Pesa STK push. The funds are held safely until the buyer receives and inspects the goods at their farm or depot. Once delivery is confirmed via a one-time dispatch PIN, the payment is immediately released to the seller or transporter.'
    },
    {
      category: 'marketplace',
      q: 'Who arranges transport and logistics for heavy agricultural commodities?',
      a: 'SMART-AGRI Kenya features an integrated logistics fleet of certified agricultural transporters registered across KeNHA transit corridors. Transporters provide real-time truck capacity (pickups, 3-tonne canters, and 10-tonne lorries) with standardized county-to-county distance rates.'
    },
    {
      category: 'ai',
      q: 'How accurate is the AI Farming Assistant and Pest Diagnosis?',
      a: 'The AI assistant is powered by Google Gemini 2.5 Flash, grounded in verified Kenyan agronomy manuals, KALRO pest management protocols, and Kenya Meteorological Department forecasts. When you upload crop leaf photographs, the model analyzes lesions, discoloration, and insect damage to suggest high-probability diagnoses. For critical or severe infestations, the platform automatically links you to a human agronomist.'
    },
    {
      category: 'cooperative',
      q: 'Can our cooperative society manage member grain silos and bulk inputs together?',
      a: 'Yes. Cooperatives have access to a dedicated Cooperative Dashboard. This allows society managers to register member farmers, record collective grain inventory in silos (with moisture content compliance checks), negotiate bulk discount purchases for fertilizers directly with agrovets, and disburse bulk sales proceeds directly to members’ M-Pesa numbers.'
    }
  ];

  const filteredFaqs = faqs.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1b432a] via-[#214E34] to-[#2b6443] p-8 md:p-12 text-white shadow-xl text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 border border-white/20">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Support & Documentation Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Everything you need to know about digital membership cards, verified agricultural credentials, soil health testing, and M-Pesa escrow protection.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search questions (e.g. M-Pesa escrow, soil lime, membership ID)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#214E34] outline-none shadow-xs"
        />
      </div>

      {/* Categories Bar */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'all', label: 'All Questions' },
          { id: 'membership', label: 'Digital IDs & Cards' },
          { id: 'soil', label: 'Soil & Lab Testing' },
          { id: 'marketplace', label: 'Marketplace & M-Pesa' },
          { id: 'ai', label: 'AI Farming Assistant' },
          { id: 'cooperative', label: 'Cooperatives & Societies' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-[#214E34] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-gray-900 text-sm hover:bg-gray-50 transition"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#214E34] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-gray-700 leading-relaxed border-t border-gray-100 bg-[#FBFBFA]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#214E34] text-white flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Need direct extension officer support?</h4>
            <p className="text-xs text-gray-600">Our agronomy and support team is available across all 47 counties.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('contact')}
            className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-50"
          >
            Contact Helpdesk
          </button>
          <button
            onClick={() => onOpenAuth ? onOpenAuth('register') : onSelectTab('membership')}
            className="px-4 py-2 bg-[#214E34] text-white rounded-xl text-xs font-bold hover:bg-[#1a3e29]"
          >
            Join SMART-AGRI
          </button>
        </div>
      </div>
    </div>
  );
};
