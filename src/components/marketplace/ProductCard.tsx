import React from 'react';
import { MapPin, ShieldCheck, ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onContactSeller?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
}) => {
  const varietyOrBreed = product.variety || product.breed || product.livestockDetails?.breed;
  const isAvailable = product.quantityAvailable > 0;

  return (
    <div className="bg-white rounded-xl border border-[#E2E7DE] hover:border-[#CFD7CA] overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col group h-full">
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-[#F7F6F0] overflow-hidden shrink-0">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Quiet Category & Type Tag (Not oversized pills) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {product.productType && (
            <span className="bg-[#252D27]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
              {product.productType}
            </span>
          )}
        </div>

        {/* Verified Seller Tag */}
        {product.isVerifiedSeller && (
          <div className="absolute top-2.5 right-2.5 bg-[#214E34] text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-[#D6A545]" />
            <span>Verified</span>
          </div>
        )}

        {/* Stock Status Bar */}
        <div className="absolute bottom-2 left-2.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
            isAvailable 
              ? 'bg-[#214E34]/90 text-white' 
              : 'bg-stone-800/90 text-stone-300'
          }`}>
            {isAvailable ? `In Stock (${product.quantityAvailable} ${product.unit})` : 'Sold Out'}
          </span>
        </div>

        {/* Quick View Button */}
        <button
          type="button"
          onClick={() => onViewDetails(product)}
          className="absolute inset-0 bg-[#252D27]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          aria-label="View product details"
        >
          <span className="bg-white text-[#252D27] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#367C46]" />
            View Specifications
          </span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-[#68756A] mb-1.5">
            <div className="flex items-center gap-1 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-[#367C46] shrink-0" />
              <span className="truncate">
                {product.sellerSubCounty ? `${product.sellerSubCounty}, ` : ''}{product.sellerCounty} County
              </span>
            </div>

            {product.rating && (
              <div className="flex items-center gap-1 text-[#D6A545] shrink-0 font-semibold text-[11px]">
                <Star className="w-3 h-3 fill-[#D6A545]" />
                <span className="text-[#252D27] tabular-nums">{product.rating}</span>
              </div>
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

          {/* Variety & Seller Metadata */}
          <div className="space-y-1 mb-3 text-[11px]">
            {varietyOrBreed && (
              <div className="text-[#68756A] flex items-center gap-1">
                <span className="font-semibold text-[#214E34]">Variety:</span>
                <span className="text-[#252D27] truncate">{varietyOrBreed}</span>
              </div>
            )}

            <div className="text-[#68756A] truncate flex items-center gap-1">
              <span>Producer:</span>
              <span className="font-semibold text-[#252D27] truncate">{product.sellerName}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[10px] text-[#68756A] block font-medium">Price</span>
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
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E2E7DE] hover:border-[#CFD7CA] bg-[#F7F6F0] hover:bg-white text-[#252D27] text-xs font-semibold transition cursor-pointer"
              title="View full specifications"
            >
              Details
            </button>

            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="bg-[#367C46] hover:bg-[#2B6437] text-white p-2 sm:px-3 sm:py-1.5 rounded-lg font-semibold text-xs transition shadow-xs flex items-center gap-1.5 justify-center cursor-pointer"
              title="Add to cart / Buy now"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
