import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { SmartAgriLogo } from '../common/SmartAgriLogo';

interface FooterProps {
  onSelectTab: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#183C27] text-[#E2E7DE] text-xs border-t border-[#2C6443] mt-16">
      {/* Top Banner: Verification & National Standards */}
      <div className="bg-[#214E34] border-b border-[#2C6443] py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#183C27] border border-[#2C6443] flex items-center justify-center text-[#D6A545] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                Kenyan Agricultural Standards & Verification
              </p>
              <p className="text-[#CFD7CA] text-xs">
                In technical alignment with KALRO research labs, KEPHIS certified seeds, and PCPB crop protection advisories.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[#E2E7DE] text-xs">
            <span className="px-3 py-1 bg-[#183C27] rounded border border-[#2C6443]">
              M-Pesa Daraja STK Escrow
            </span>
            <span className="px-3 py-1 bg-[#183C27] rounded border border-[#2C6443]">
              KeNHA Distance Logistics
            </span>
            <span className="px-3 py-1 bg-[#183C27] rounded border border-[#2C6443]">
              KVB Registered Veterinarians
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-2">
            <div className="mb-3">
              <SmartAgriLogo size="md" isDark={true} />
            </div>
            <p className="text-[#CFD7CA] text-xs leading-relaxed mb-4 pr-6">
              SMART-AGRI KENYA is the national digital agribusiness and farming platform empowering growers, pastoralists, seed breeders, soil laboratories, and logistics providers across all 47 counties of Kenya.
            </p>
            <div className="space-y-2 text-[#CFD7CA] text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#78A65A] shrink-0" />
                <span>Agricultural Information Resource Center, Waiyaki Way, Nairobi</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#78A65A] shrink-0" />
                <span>Farmer Hotline: 0800 721 000 (Toll-Free) · +254 700 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#78A65A] shrink-0" />
                <span>support@smart-agri.ke · info@smart-agri.ke</span>
              </div>
            </div>
          </div>

          {/* Farming Solutions */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 border-b border-[#2C6443] pb-1">
              Farming Solutions
            </h4>
            <ul className="space-y-2 text-[#CFD7CA]">
              <li>
                <button onClick={() => onSelectTab('marketplace')} className="hover:text-white transition cursor-pointer">
                  Agricultural Produce Market
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('livestock')} className="hover:text-white transition cursor-pointer">
                  Livestock & Dairy Cattle
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('inputs')} className="hover:text-white transition cursor-pointer">
                  Certified Seeds & Fertilizers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('soil-testing')} className="hover:text-white transition cursor-pointer">
                  KALRO Soil Testing Service
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('pest-diagnosis')} className="hover:text-white transition cursor-pointer">
                  Pest & Disease Checker
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('irrigation')} className="hover:text-white transition cursor-pointer">
                  Smart Irrigation Solutions
                </button>
              </li>
            </ul>
          </div>

          {/* Market Intelligence */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 border-b border-[#2C6443] pb-1">
              Market Intelligence
            </h4>
            <ul className="space-y-2 text-[#CFD7CA]">
              <li>
                <button onClick={() => onSelectTab('market-prices')} className="hover:text-white transition cursor-pointer">
                  National Commodity Prices
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('weather')} className="hover:text-white transition cursor-pointer">
                  Agro-Weather Forecasts
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('community')} className="hover:text-white transition cursor-pointer">
                  Farmer Discussion Forum
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('experts')} className="hover:text-white transition cursor-pointer">
                  Verified Agronomist Network
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-white transition cursor-pointer">
                  Farmer Sales Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('orders')} className="hover:text-white transition cursor-pointer">
                  Track Delivery & Escrow
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Institutional */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 border-b border-[#2C6443] pb-1">
              Platform & Trust
            </h4>
            <ul className="space-y-2 text-[#CFD7CA]">
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-white transition cursor-pointer">
                  About SMART-AGRI KENYA
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('contact')} className="hover:text-white transition cursor-pointer">
                  Contact & County Depots
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('auth')} className="hover:text-white transition cursor-pointer">
                  Register as Farmer / Buyer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('admin')} className="hover:text-white transition cursor-pointer text-[#D6A545]">
                  Administrator Portal
                </button>
              </li>
              <li>
                <span className="text-[#8FA395] text-[11px] block pt-2">
                  Compliant with Kenya Data Protection Act 2019
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2C6443] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8FA395]">
          <p>© {new Date().getFullYear()} SMART-AGRI KENYA. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer" onClick={() => onSelectTab('about')}>Terms of Service</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer" onClick={() => onSelectTab('about')}>Escrow Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer" onClick={() => onSelectTab('about')}>Privacy Notice</span>
            <span>·</span>
            <span className="text-[#D6A545]">Kenya 47 Counties Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
