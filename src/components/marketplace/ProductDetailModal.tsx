import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Truck, 
  ShoppingBag, 
  Star, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, delivery: 'pickup' | 'delivery') => void;
  userCounty?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  userCounty = 'Nairobi',
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(product.minimumOrder || 1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [showPhone, setShowPhone] = useState(false);

  const subtotal = product.priceKsh * quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/10 hover:bg-stone-900/20 text-stone-700 flex items-center justify-center transition cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Side */}
          <div className="p-6 bg-stone-50 border-r border-stone-200 flex flex-col gap-3">
            <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-xs relative">
              <img
                src={selectedImage || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-stone-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.subcategory || product.category}
              </span>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === img ? 'border-emerald-600 scale-105' : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Seller Verification Card */}
            <div className="mt-auto bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-500 uppercase">Farm / Seller</span>
                {product.isVerifiedSeller && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
                  </span>
                )}
              </div>
              <p className="font-bold text-stone-900 text-sm">{product.sellerName}</p>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {product.sellerSubCounty ? `${product.sellerSubCounty}, ` : ''}{product.sellerCounty} County
              </p>

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2">
                {showPhone ? (
                  <a
                    href={`tel:${product.sellerPhone}`}
                    className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{product.sellerPhone}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-600" />
                    <span>Show Farmer Phone</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details & Purchase Side */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                  {product.category.toUpperCase()}
                </span>
                {product.variety && (
                  <span className="text-stone-600">
                    Variety: <strong>{product.variety}</strong>
                  </span>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-stone-950 mb-2 leading-tight">
                {product.title}
              </h2>

              {/* Price Banner */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wide block">
                    Asking Price (Escrow Protected)
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-emerald-950">
                      KSh {product.priceKsh.toLocaleString()}
                    </span>
                    <span className="text-xs text-emerald-800 font-semibold">
                      per {product.unit}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="block text-stone-500 font-medium">Stock</span>
                  <span className="font-bold text-emerald-900">
                    {product.quantityAvailable.toLocaleString()} {product.unit}s
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                  Product Details & Quality
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Delivery Options Selection */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Fulfillment & Delivery
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <span>Farm-to-Door Courier</span>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Calculated via KeNHA road distance to {userCounty}
                    </span>
                  </button>

                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <PackageCheck className="w-4 h-4 text-emerald-700" />
                      <span>Self-Pickup at Farm</span>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Free pickup at {product.sellerCounty} farm gate
                    </span>
                  </button>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="mb-4 flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-xs font-bold text-stone-800 block">Quantity to Order</span>
                  <span className="text-[10px] text-stone-500">Min: {product.minimumOrder} {product.unit}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(product.minimumOrder || 1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-800 hover:bg-stone-100 flex items-center justify-center transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantityAvailable, quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-800 hover:bg-stone-100 flex items-center justify-center transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-500 block">Subtotal</span>
                <span className="text-lg font-black text-emerald-950">
                  KSh {subtotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, quantity, deliveryType);
                  onClose();
                }}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-300" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
