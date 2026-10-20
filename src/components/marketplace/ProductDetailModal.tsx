import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Truck, 
  ShoppingBag, 
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-xl border border-[#E2E7DE] relative animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center transition cursor-pointer border border-[#E2E7DE]"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Side */}
          <div className="p-5 sm:p-6 bg-[#F7F6F0] border-r border-[#E2E7DE] flex flex-col gap-3">
            <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-white border border-[#E2E7DE] shadow-xs relative">
              <img
                src={selectedImage || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#214E34]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
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
                    className={`w-14 h-14 rounded-lg overflow-hidden border transition cursor-pointer ${
                      selectedImage === img ? 'border-[#367C46] ring-1 ring-[#367C46]' : 'border-[#E2E7DE] opacity-75'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Seller Verification Card */}
            <div className="mt-auto bg-white p-3.5 rounded-lg border border-[#E2E7DE] shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-[#68756A] uppercase tracking-wider">Verified Producer</span>
                {product.isVerifiedSeller && (
                  <span className="text-[11px] font-bold text-[#214E34] bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#CFD7CA] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#367C46]" /> ID Verified
                  </span>
                )}
              </div>
              <p className="font-bold text-[#252D27] text-xs sm:text-sm">{product.sellerName}</p>
              <p className="text-xs text-[#68756A] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#367C46] shrink-0" />
                {product.sellerSubCounty ? `${product.sellerSubCounty}, ` : ''}{product.sellerCounty} County
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#E2E7DE] flex items-center gap-2">
                {showPhone ? (
                  <a
                    href={`tel:${product.sellerPhone}`}
                    className="flex-1 bg-[#EBF3ED] hover:bg-[#DCECE0] text-[#214E34] font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition border border-[#CFD7CA]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#367C46]" />
                    <span>{product.sellerPhone}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="flex-1 bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer border border-[#E2E7DE]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#68756A]" />
                    <span>Show Farmer Phone</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details & Purchase Side */}
          <div className="p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#68756A] mb-2">
                <span className="bg-[#EBF3ED] text-[#214E34] px-2 py-0.5 rounded font-semibold border border-[#CFD7CA]">
                  {product.category.toUpperCase()}
                </span>
                {product.variety && (
                  <span className="text-[#68756A]">
                    Variety: <strong className="text-[#252D27]">{product.variety}</strong>
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-[#214E34] mb-2 leading-tight">
                {product.title}
              </h2>

              {/* Price Banner */}
              <div className="p-3 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA] mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#214E34] tracking-wide block">
                    Escrow Protected Price
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-[#214E34] tabular-nums">
                      KSh {product.priceKsh.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#68756A] font-semibold">
                      per {product.unit}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="block text-[#68756A] font-medium text-[11px]">Available Stock</span>
                  <span className="font-bold text-[#214E34]">
                    {product.quantityAvailable.toLocaleString()} {product.unit}s
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-[#252D27] uppercase tracking-wider mb-1">
                  Product Details & Quality
                </h4>
                <p className="text-xs text-[#68756A] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Delivery Options Selection */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-[#252D27] uppercase tracking-wider mb-2">
                  Fulfillment & Delivery
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'border-[#367C46] bg-[#EBF3ED] text-[#214E34] font-semibold shadow-xs'
                        : 'border-[#E2E7DE] text-[#68756A] hover:bg-[#F7F6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[#214E34]">
                      <Truck className="w-3.5 h-3.5 text-[#367C46]" />
                      <span>KeNHA Courier</span>
                    </div>
                    <span className="text-[10px] text-[#68756A]">
                      Direct to {userCounty}
                    </span>
                  </button>

                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'border-[#367C46] bg-[#EBF3ED] text-[#214E34] font-semibold shadow-xs'
                        : 'border-[#E2E7DE] text-[#68756A] hover:bg-[#F7F6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[#214E34]">
                      <PackageCheck className="w-3.5 h-3.5 text-[#367C46]" />
                      <span>Farm Gate Pickup</span>
                    </div>
                    <span className="text-[10px] text-[#68756A]">
                      At {product.sellerCounty} farm
                    </span>
                  </button>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="mb-4 flex items-center justify-between p-2.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                <div>
                  <span className="text-xs font-bold text-[#252D27] block">Quantity to Order</span>
                  <span className="text-[10px] text-[#68756A]">Min: {product.minimumOrder} {product.unit}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(product.minimumOrder || 1, quantity - 1))}
                    className="w-7 h-7 rounded bg-white border border-[#E2E7DE] font-bold text-[#252D27] hover:bg-[#EBF3ED] flex items-center justify-center transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-[#252D27] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantityAvailable, quantity + 1))}
                    className="w-7 h-7 rounded bg-white border border-[#E2E7DE] font-bold text-[#252D27] hover:bg-[#EBF3ED] flex items-center justify-center transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#68756A] block">Subtotal</span>
                <span className="text-base sm:text-lg font-black text-[#214E34] tabular-nums">
                  KSh {subtotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, quantity, deliveryType);
                  onClose();
                }}
                className="flex-1 bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
