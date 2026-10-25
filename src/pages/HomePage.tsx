import React from 'react';
import { Product } from '../types';

interface HomePageProps {
  products?: Product[];
  onSelectTab: (tabId: string) => void;
  onViewProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  selectedCounty?: string;
  onSelectCounty?: (county: string) => void;
  onSearchMarketplace?: (query: string) => void;
}

interface ServiceCardItem {
  id: string;
  title: string;
  subtitle: string;
  tabId: string;
  image: string;
  alt: string;
  actionText: string;
}

const SERVICE_CARDS: ServiceCardItem[] = [
  {
    id: 'soil-testing',
    title: 'Soil Health Testing',
    subtitle: 'KALRO & CropNuts accredited soil fertility and pH analysis',
    tabId: 'soil-testing',
    image: '/assets/services/soil_health_testing.jpg',
    alt: 'Agricultural expert performing professional soil testing and laboratory analysis',
    actionText: 'Request Soil Test',
  },
  {
    id: 'pest-diagnosis',
    title: 'Pest & Disease Checker',
    subtitle: 'PCPB-approved diagnosis, treatment, and crop protection',
    tabId: 'pest-diagnosis',
    image: '/assets/services/pest_disease_checker.jpg',
    alt: 'Close-up of crop plant leaf showing pest damage and disease inspection',
    actionText: 'Diagnose Plant',
  },
  {
    id: 'wholesale-prices',
    title: 'Wholesale Prices',
    subtitle: 'Live commodity prices across Wakulima, Kongowea & 47 counties',
    tabId: 'market-prices',
    image: '/assets/services/wholesale_market_prices.jpg',
    alt: 'Bustling wholesale agricultural market with fresh produce crates and sacks',
    actionText: 'Check Wholesale Rates',
  },
  {
    id: 'certified-inputs',
    title: 'Certified Inputs',
    subtitle: 'KEPHIS-certified seeds, authorized fertilizers & agrovet supplies',
    tabId: 'inputs',
    image: '/assets/services/certified_farm_inputs.jpg',
    alt: 'Agrovet supply store displaying certified seeds, fertilizers, and crop inputs',
    actionText: 'Browse Certified Inputs',
  },
  {
    id: 'pedigree-livestock',
    title: 'Pedigree Livestock',
    subtitle: 'Verified Friesian, Ayrshire & Dorper stock with vet health certs',
    tabId: 'livestock',
    image: '/assets/services/pedigree_livestock_cow.jpg',
    alt: 'High-yielding pedigree dairy cattle in lush green pasture',
    actionText: 'Explore Livestock',
  },
  {
    id: 'farmer-portal',
    title: 'Farmer Portal',
    subtitle: 'Farm records, harvest planning, weather advisory & sales tracking',
    tabId: 'dashboard',
    image: '/assets/services/farmer_digital_portal.jpg',
    alt: 'Modern Kenyan farmer using digital device in agricultural setting',
    actionText: 'Open Farmer Portal',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onSelectTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Heading & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#214E34] tracking-tight">
          Essential Farmer & Buyer Services
        </h1>
        <p className="text-sm sm:text-base text-[#68756A] mt-2">
          Verified tools to test soil, check wholesale market prices, protect crops, and trade safely.
        </p>
      </div>

      {/* Six Service Cards Grid: 3-col on desktop, 2-col on medium, 1-col on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
        {SERVICE_CARDS.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectTab(service.tabId)}
            className="bg-white rounded-2xl border border-[#E2E7DE] hover:border-[#367C46] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectTab(service.tabId);
              }
            }}
          >
            {/* Service Card Image */}
            <div className="relative w-full aspect-16/10 sm:aspect-4/3 bg-[#F4F6F0] overflow-hidden">
              <img
                src={service.image}
                alt={service.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Service Card Content */}
            <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
              <div>
                <h2 className="font-bold text-lg sm:text-xl text-[#252D27] group-hover:text-[#214E34] transition-colors leading-snug">
                  {service.title}
                </h2>
                <p className="text-sm text-[#68756A] mt-1.5 leading-relaxed font-normal">
                  {service.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0F3ED] flex items-center justify-between text-sm font-semibold text-[#214E34] group-hover:text-[#183926]">
                <span>{service.actionText}</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
