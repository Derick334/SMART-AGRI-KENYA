import React from 'react';
import { MapPin, ShieldCheck, ShoppingCart, Eye, Check, Scale } from 'lucide-react';
import { Product } from '../../types';

interface LivestockCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  isCompared?: boolean;
}

export const LivestockCard: React.FC<LivestockCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
  onToggleCompare,
  isCompared = false,
}) => {
  const details = product.livestockDetails;

  return (
    <div className="bg-white rounded-xl border border-[#E2E7DE] hover:border-[#CFD7CA] overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col group h-full">
      {/* Livestock Image */}
      <div className="relative aspect-4/3 w-full bg-[#F7F6F0] overflow-hidden shrink-0">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Breed Tag */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-[#214E34] text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
            {details?.breed || product.subcategory}
          </span>
          {details?.purpose && (
            <span className="bg-[#252D27]/90 text-[#D6A545] text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
              {details.purpose}
            </span>
          )}
        </div>

        {/* Veterinary Health Clearance */}
        {details?.healthStatus && (
          <div className="absolute top-2.5 right-2.5 bg-[#367C46] text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-[#D6A545]" />
            <span>Vet Cleared</span>
          </div>
        )}

        {/* Quick View Overlay */}
        <button
          type="button"
          onClick={() => onViewDetails(product)}
          className="absolute inset-0 bg-[#252D27]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          aria-label="View livestock details"
        >
          <span className="bg-white text-[#252D27] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#367C46]" />
            Pedigree & Records
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Ear Tag */}
          <div className="flex items-center justify-between text-[11px] text-[#68756A] mb-1.5">
            <span className="flex items-center gap-1 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-[#367C46] shrink-0" />
              {product.sellerCounty} County
            </span>
            {details?.earTagNumber && (
              <span className="font-mono text-[10px] bg-[#F7F6F0] px-1.5 py-0.5 rounded text-[#252D27] border border-[#E2E7DE]">
                Tag: {details.earTagNumber}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-[#252D27] text-sm line-clamp-2 hover:text-[#367C46] transition cursor-pointer mb-2 leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-1.5 mb-3 text-[11px]">
            {/* Age & Sex */}
            <div className="bg-[#F7F6F0] p-2 rounded-lg border border-[#E2E7DE]">
              <span className="text-[10px] text-[#68756A] block font-medium">Age & Sex</span>
              <span className="font-semibold text-[#252D27]">
                {details?.ageValue} {details?.ageUnit} · {details?.sex}
              </span>
            </div>

            {/* Yield or Weight */}
            <div className="bg-[#EBF3ED] p-2 rounded-lg border border-[#CFD7CA]">
              <span className="text-[10px] text-[#367C46] block font-medium">
                {details?.animalType === 'chicken' ? 'Egg Yield' : 'Yield / Weight'}
              </span>
              <span className="font-bold text-[#214E34]">
                {details?.milkYieldLitersPerDay ? `${details.milkYieldLitersPerDay} L/day` : 
                 details?.eggYieldPerWeek ? `${details.eggYieldPerWeek} eggs/wk` : 
                 details?.weightKg ? `${details.weightKg} kg` : 'Prime Quality'}
              </span>
            </div>
          </div>

          {/* Vaccinations */}
          {details?.vaccinations && details.vaccinations.length > 0 && (
            <div className="text-[10px] text-[#68756A] mb-2 flex items-center gap-1.5 bg-[#F7F6F0] py-1 px-2 rounded border border-[#E2E7DE]">
              <Check className="w-3 h-3 text-[#367C46] shrink-0" />
              <span>{details.vaccinations.length} verified veterinary vaccines on record</span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[10px] text-[#68756A] block font-medium">Asking Price</span>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-sm sm:text-base text-[#214E34] tabular-nums">
                KSh {product.priceKsh.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#68756A]">
                / {product.unit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(product)}
                className={`p-2 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                  isCompared 
                    ? 'bg-[#FCF8EE] border-[#D6A545] text-[#79543A]' 
                    : 'bg-[#F7F6F0] hover:bg-white border-[#E2E7DE] text-[#252D27]'
                }`}
                title="Compare with other livestock"
              >
                <Scale className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isCompared ? 'Added' : 'Compare'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="bg-[#367C46] hover:bg-[#2B6437] text-white p-2 sm:px-3 sm:py-1.5 rounded-lg font-semibold text-xs transition shadow-xs flex items-center justify-center cursor-pointer"
              title="Add livestock to cart"
              aria-label="Add livestock to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
