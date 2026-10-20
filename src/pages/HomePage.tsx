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
  tabId: string;
  image: string;
  fallbackImage: string;
  alt: string;
}

const SERVICE_CARDS: ServiceCardItem[] = [
  {
    id: 'soil-testing',
    title: 'Soil Health Testing',
    tabId: 'soil-testing',
    image: '/assets/services/soil_health_testing.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1200&h=675&q=85',
    alt: 'Kenyan agricultural soil health testing and laboratory sample examination',
  },
  {
    id: 'pest-diagnosis',
    title: 'Pest & Disease Checker',
    tabId: 'pest-diagnosis',
    image: '/assets/services/pest_disease_checker.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&h=675&q=85',
    alt: 'Agricultural expert inspecting a green crop leaf with diagnostic spots for plant disease and pest identification',
  },
  {
    id: 'wholesale-prices',
    title: 'Wholesale Prices',
    tabId: 'market-prices',
    image: '/assets/services/wholesale_market_prices.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&h=675&q=85',
    alt: 'Orderly wholesale agricultural produce market with fresh tomatoes, onions, and vegetables in crates and baskets',
  },
  {
    id: 'certified-inputs',
    title: 'Certified Inputs',
    tabId: 'inputs',
    image: '/assets/services/certified_farm_inputs.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&h=675&q=85',
    alt: 'Quality certified seeds, fertilizer bags, and farm inputs arranged on a clean display table in an agrovet shop',
  },
  {
    id: 'pedigree-livestock',
    title: 'Pedigree Livestock',
    tabId: 'livestock',
    image: '/assets/services/pedigree_livestock_cow.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&h=675&q=85',
    alt: 'Healthy prime pedigree dairy cow on a well-maintained Kenyan highland livestock farm with green pasture',
  },
  {
    id: 'farmer-portal',
    title: 'Farmer Portal',
    tabId: 'dashboard',
    image: '/assets/services/farmer_digital_portal.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&h=675&q=85',
    alt: 'Kenyan farmer in a crop field using a smartphone to manage agricultural sales, orders, and produce listings',
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

      {/* Six Image-Based Service Cards Grid: 3-col on desktop, 2-col on medium, 1-col on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
        {SERVICE_CARDS.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectTab(service.tabId)}
            className="bg-white rounded-2xl border border-[#E2E7DE] hover:border-[#367C46] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col group select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectTab(service.tabId);
              }
            }}
          >
            {/* 16:9 Card Agricultural Photograph */}
            <div className="relative aspect-16/9 w-full overflow-hidden bg-[#F7F6F0]">
              <img
                src={service.image}
                alt={service.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="eager"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = service.fallbackImage;
                }}
              />
            </div>

            {/* Card Title Only - No secondary text or badges */}
            <div className="p-5 sm:p-6 flex items-center justify-between">
              <h2 className="font-bold text-base sm:text-lg text-[#252D27] group-hover:text-[#214E34] transition-colors">
                {service.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
