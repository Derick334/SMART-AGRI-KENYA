import React from 'react';
import { Sprout, Phone, Mail, MapPin, ShieldCheck, HeartHandshake, ExternalLink } from 'lucide-react';
import { SmartAgriLogo } from '../common/SmartAgriLogo';

interface FooterProps {
  onSelectTab: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 text-xs border-t-4 border-emerald-600 mt-16">
      {/* Top Banner: Verification and Partner Ecosystem */}
      <div className="bg-stone-950 border-b border-stone-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                Grounded in Verified Kenyan Agricultural Standards
              </p>
              <p className="text-stone-400 text-xs">
                In alignment with KALRO, KEPHIS certified seeds, and PCPB approved crop protection protocols.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400 text-[11px]">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 rounded-full border border-stone-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              M-Pesa Daraja STK Escrow
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 rounded-full border border-stone-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              KeNHA Road Freight Matrix
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 rounded-full border border-stone-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              KVB Registered Veterinarians
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-2">
            <div className="mb-3">
              <SmartAgriLogo size="md" isDark={true} />
            </div>
            <p className="text-stone-400 text-xs leading-relaxed mb-4 pr-6">
              The national digital agricultural ecosystem empowering smallholders, commercial growers, livestock keepers, input suppliers, and logistics partners across all 47 counties of Kenya. Buy, sell, test soil, diagnose pests, and arrange deliveries without leaving your farm.
            </p>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Agricultural Information Resource Center, Waiyaki Way, Nairobi</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Farmer Support Hotline: +254 700 000 000 / 0800 721 000 (Toll-Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>support@smart-agri.ke | info@smart-agri.ke</span>
              </div>
            </div>
          </div>

          {/* Quick Ecosystem Services */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 border-b border-stone-800 pb-1">
              Farming Solutions
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectTab('marketplace')} className="hover:text-emerald-400 transition cursor-pointer">
                  Agricultural Produce Market
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('livestock')} className="hover:text-emerald-400 transition cursor-pointer">
                  Livestock & Pedigree Cattle
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('inputs')} className="hover:text-emerald-400 transition cursor-pointer">
                  Certified Seeds & Fertilizers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('soil-testing')} className="hover:text-emerald-400 transition cursor-pointer">
                  KALRO Soil Testing Service
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('pest-diagnosis')} className="hover:text-emerald-400 transition cursor-pointer">
                  Pest & Crop Disease Diagnosis
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('irrigation')} className="hover:text-emerald-400 transition cursor-pointer">
                  Smart Drip Irrigation Scheduling
                </button>
              </li>
            </ul>
          </div>

          {/* Market & Intelligence */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 border-b border-stone-800 pb-1">
              Market Intelligence
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectTab('market-prices')} className="hover:text-emerald-400 transition cursor-pointer">
                  National Wholesale Price Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('weather')} className="hover:text-emerald-400 transition cursor-pointer">
                  County Weather & Rain Forecast
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('ai-assistant')} className="hover:text-emerald-400 transition cursor-pointer">
                  AI Farming Specialist (Gemini)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('community')} className="hover:text-emerald-400 transition cursor-pointer">
                  Kenya Farmer Community Forum
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('experts')} className="hover:text-emerald-400 transition cursor-pointer">
                  Book Agronomist or Vet
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('orders')} className="hover:text-emerald-400 transition cursor-pointer">
                  Track Deliveries & Shipments
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Administration */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 border-b border-stone-800 pb-1">
              Portals & Governance
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-emerald-400 transition cursor-pointer">
                  Farmer Seller Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('admin')} className="text-amber-400 hover:text-amber-300 font-semibold transition cursor-pointer">
                  🛡️ Administrator Portal
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-emerald-400 transition cursor-pointer">
                  About Smart-Agri Kenya
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('contact')} className="hover:text-emerald-400 transition cursor-pointer">
                  Help Desk & Sub-County Hubs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('auth')} className="hover:text-emerald-400 transition cursor-pointer">
                  Register Farm / Log In
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Agricultural Advisory Disclaimer (Crucial for safety & compliance) */}
        <div className="mt-10 p-4 bg-stone-950 rounded-xl border border-stone-800 text-[11px] leading-relaxed text-stone-400">
          <p className="font-semibold text-stone-300 mb-1">
            ⚠️ Official Notice & Agricultural Advisory Disclaimer:
          </p>
          <p>
            Information provided by SMART-AGRI KENYA, including AI-assisted pest diagnoses, soil estimates, and indicative commodity market prices, serves as decision support and educational guidance. Chemical pesticides must only be applied strictly according to the Pest Control Products Board (PCPB) registered container label with required Personal Protective Equipment (PPE) and strict adherence to Pre-Harvest Intervals (PHI). For severe livestock conditions or large-scale crop epidemics, farmers must consult a registered veterinary surgeon (KVB) or local agricultural extension officer.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-2">
          <p>
            © {new Date().getFullYear()} SMART-AGRI KENYA. All rights reserved across Kenya's 47 Counties.
          </p>
          <div className="flex gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 cursor-pointer">Seller Guidelines</span>
            <span className="hover:text-stone-300 cursor-pointer">PCPB Safety Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
