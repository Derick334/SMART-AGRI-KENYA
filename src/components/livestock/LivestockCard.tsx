import React from 'react';
import { MapPin, ShieldCheck, ShoppingCart, Eye, Sparkles, Check, Scale } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Livestock Image */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Breed Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
          <span className="bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            {details?.breed || product.subcategory}
          </span>
          {details?.purpose && (
            <span className="bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {details.purpose}
            </span>
          )}
        </div>

        {/* Vet Health Cleared */}
        {details?.healthStatus && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3 h-3" />
            <span>Vet Cleared</span>
          </div>
        )}

        {/* Quick View Overlay */}
        <button
          onClick={() => onViewDetails(product)}
          className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          aria-label="View livestock details"
        >
          <span className="bg-white text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            View Pedigree & Records
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Ear tag */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="flex items-center gap-1 font-medium text-stone-700">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              {product.sellerCounty} County
            </span>
            {details?.earTagNumber && (
              <span className="font-mono text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                Tag: {details.earTagNumber}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-stone-950 text-sm line-clamp-1 hover:text-emerald-700 transition cursor-pointer mb-2"
          >
            {product.title}
          </h3>

          {/* Key Livestock Metric Pills */}
          <div className="grid grid-cols-2 gap-1.5 mb-3 text-[11px]">
            {/* Age & Sex */}
            <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-medium">Age & Sex</span>
              <span className="font-semibold text-stone-800">
                {details?.ageValue} {details?.ageUnit} • {details?.sex}
              </span>
            </div>

            {/* Production Yield / Weight */}
            <div className="bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-emerald-700 block font-medium">
                {details?.animalType === 'chicken' ? 'Egg Yield' : 'Yield / Weight'}
              </span>
              <span className="font-bold text-emerald-900">
                {details?.milkYieldLitersPerDay ? `${details.milkYieldLitersPerDay} L/day` : 
                 details?.eggYieldPerWeek ? `${details.eggYieldPerWeek} eggs/wk` : 
                 details?.weightKg ? `${details.weightKg} kg` : 'Prime Quality'}
              </span>
            </div>
          </div>

          {/* Vaccinations summary */}
          {details?.vaccinations && details.vaccinations.length > 0 && (
            <div className="text-[10px] text-stone-500 mb-2 flex items-center gap-1 bg-stone-50 py-1 px-2 rounded-md">
              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{details.vaccinations.length} verified veterinary vaccines on record</span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
          <div>
            <span className="text-[10px] text-stone-400 block font-medium">Asking Price</span>
            <div className="flex items-baseline gap-1">
              <span className="font-black text-base text-emerald-950">
                KSh {product.priceKsh.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                / {product.unit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(product)}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                  isCompared 
                    ? 'bg-amber-100 border-amber-300 text-amber-900' 
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                }`}
                title="Compare with other livestock"
              >
                <Scale className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isCompared ? 'Added' : 'Compare'}</span>
              </button>
            )}

            <button
              onClick={() => onAddToCart(product)}
              className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white p-2.5 rounded-xl font-bold transition shadow-xs flex items-center justify-center cursor-pointer"
              title="Add livestock to cart"
              aria-label="Add livestock to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
