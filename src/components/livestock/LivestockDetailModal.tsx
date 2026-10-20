import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Truck, 
  ShoppingBag, 
  CheckCircle
} from 'lucide-react';
import { Product } from '../../types';

interface LivestockDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, delivery: 'pickup' | 'delivery') => void;
  userCounty?: string;
}

export const LivestockDetailModal: React.FC<LivestockDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product || !product.livestockDetails) return null;

  const details = product.livestockDetails;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-xl border border-[#E2E7DE] relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center transition cursor-pointer border border-[#E2E7DE]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Visual Column */}
          <div className="md:col-span-5 p-5 sm:p-6 bg-[#F7F6F0] border-r border-[#E2E7DE] flex flex-col gap-3">
            <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-white border border-[#E2E7DE] shadow-xs relative">
              <img
                src={selectedImage || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#214E34]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {details.breed}
              </span>
            </div>

            {/* Thumbnail preview */}
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

            {/* Seller Farm Card */}
            <div className="bg-white p-3.5 rounded-lg border border-[#E2E7DE] shadow-xs mt-auto">
              <span className="text-[10px] font-bold text-[#68756A] uppercase tracking-wider block mb-1">
                Breeder & Rancher
              </span>
              <p className="font-bold text-[#252D27] text-sm">{product.sellerName}</p>
              <p className="text-xs text-[#68756A] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#367C46] shrink-0" />
                {product.sellerCounty} County {product.sellerSubCounty ? `(${product.sellerSubCounty})` : ''}
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#E2E7DE]">
                {showPhone ? (
                  <a
                    href={`tel:${product.sellerPhone}`}
                    className="w-full bg-[#EBF3ED] text-[#214E34] border border-[#CFD7CA] font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#367C46]" />
                    <span>{product.sellerPhone}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition border border-[#E2E7DE]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#68756A]" />
                    <span>Contact Breeder / Farm</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                <span className="bg-[#EBF3ED] text-[#214E34] font-bold px-2 py-0.5 rounded border border-[#CFD7CA]">
                  {details.animalType.replace('_', ' ').toUpperCase()}
                </span>
                <span className="bg-[#F7F6F0] text-[#252D27] font-semibold px-2 py-0.5 rounded border border-[#E2E7DE]">
                  Breed: {details.breed}
                </span>
                {details.earTagNumber && (
                  <span className="bg-[#F7F6F0] text-[#68756A] font-mono text-[11px] px-2 py-0.5 rounded border border-[#E2E7DE]">
                    Tag: {details.earTagNumber}
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
                      / {product.unit}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="block text-[#68756A] font-medium text-[11px]">Available</span>
                  <span className="font-bold text-[#214E34]">
                    {product.quantityAvailable} {product.unit}(s)
                  </span>
                </div>
              </div>

              {/* Pedigree & Biological Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-4">
                <div className="p-2.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                  <span className="text-[10px] text-[#68756A] block">Age & Stage</span>
                  <span className="font-bold text-[#252D27]">
                    {details.ageValue} {details.ageUnit}
                  </span>
                  {details.lactationStage && (
                    <span className="text-[10px] text-[#367C46] block mt-0.5 font-medium">
                      {details.lactationStage}
                    </span>
                  )}
                </div>

                <div className="p-2.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE]">
                  <span className="text-[10px] text-[#68756A] block">Sex & Purpose</span>
                  <span className="font-bold text-[#252D27] capitalize">
                    {details.sex} • {details.purpose}
                  </span>
                </div>

                <div className="p-2.5 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA]">
                  <span className="text-[10px] text-[#214E34] font-semibold block">Yield / Output</span>
                  <span className="font-black text-[#214E34]">
                    {details.milkYieldLitersPerDay ? `${details.milkYieldLitersPerDay} Litres/day` :
                     details.eggYieldPerWeek ? `${details.eggYieldPerWeek} eggs/week` :
                     details.weightKg ? `${details.weightKg} kg weight` : 'Prime Genetics'}
                  </span>
                </div>
              </div>

              {/* Feed & Management Notes */}
              {details.feedRegime && (
                <div className="p-3 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] text-xs text-[#252D27] mb-4">
                  <span className="font-bold text-[#214E34] block mb-1">
                    Feed Regime & Management:
                  </span>
                  <span className="text-[#68756A]">{details.feedRegime}</span>
                </div>
              )}

              {/* Vaccination & Veterinary History */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-[#252D27] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Veterinary Health & Vaccination Records</span>
                  <span className="text-[#214E34] text-[11px] font-semibold flex items-center gap-1 bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#CFD7CA]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#367C46]" /> {details.healthStatus}
                  </span>
                </h4>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {details.vaccinations.map((vac, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 rounded-lg bg-[#EBF3ED]/60 border border-[#CFD7CA] text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#367C46] shrink-0" />
                        <div>
                          <span className="font-semibold text-[#214E34] block">{vac.vaccineName}</span>
                          {vac.vetName && <span className="text-[10px] text-[#68756A]">Certified by: {vac.vetName}</span>}
                        </div>
                      </div>
                      <span className="text-[11px] text-[#68756A] font-mono">
                        {vac.dateAdministered}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport Compliance Note */}
              <div className="p-3 bg-[#FCF8EE] rounded-lg border border-[#D6A545]/40 text-xs text-[#79543A] mb-4">
                <p className="font-bold flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#79543A]" />
                  Specialized Livestock Transport Available
                </p>
                <p className="text-[11px] text-[#68756A] mt-0.5">
                  We provide specialized animal transport trucks with dividers, straw bedding, and Kenya Veterinary Movement Permits between counties.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#68756A] block">Total Payable</span>
                <span className="text-base sm:text-lg font-black text-[#214E34] tabular-nums">
                  KSh {(product.priceKsh * quantity).toLocaleString()}
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
                <span>Add Livestock to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
