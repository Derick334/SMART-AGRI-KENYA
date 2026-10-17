import React from 'react';
import { MapPin, ShieldCheck, ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Image Thumbnail */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category & Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
          <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.subcategory || product.category}
          </span>
          {product.isDemo && (
            <span className="bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
              Demo Data
            </span>
          )}
        </div>

        {/* Verified Seller Pill */}
        {product.isVerifiedSeller && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified</span>
          </div>
        )}

        <button
          onClick={() => onViewDetails(product)}
          className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          aria-label="View product details"
        >
          <span className="bg-white text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium text-stone-700 truncate">
              {product.sellerSubCounty ? `${product.sellerSubCounty}, ` : ''}{product.sellerCounty} County
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-stone-900 text-sm line-clamp-2 hover:text-emerald-700 transition cursor-pointer mb-1 leading-snug"
          >
            {product.title}
          </h3>

          {/* Variety / Seller */}
          <div className="text-[11px] text-stone-500 mb-2 truncate">
            {product.variety && <span className="text-emerald-800 font-medium mr-2">Var: {product.variety}</span>}
            <span className="text-stone-400">By {product.sellerName}</span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
          <div>
            <span className="text-[10px] text-stone-400 block font-medium">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="font-black text-base text-emerald-950">
                KSh {product.priceKsh.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                / {product.unit}
              </span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white p-2.5 rounded-xl font-bold transition shadow-xs flex items-center justify-center cursor-pointer"
            title="Add to cart"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
