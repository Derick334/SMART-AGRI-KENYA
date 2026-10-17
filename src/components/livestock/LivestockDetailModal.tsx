import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Truck, 
  ShoppingBag, 
  Calendar, 
  HeartHandshake, 
  FileText, 
  CheckCircle, 
  Activity, 
  Scale
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
  userCounty = 'Nairobi',
}) => {
  if (!product || !product.livestockDetails) return null;

  const details = product.livestockDetails;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/10 hover:bg-stone-900/20 text-stone-700 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Visual Column */}
          <div className="md:col-span-5 p-6 bg-stone-50 border-r border-stone-200 flex flex-col gap-3">
            <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-xs relative">
              <img
                src={selectedImage || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
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
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === img ? 'border-emerald-600 scale-105' : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Seller Farm Card */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mt-auto">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Breeder & Rancher
              </span>
              <p className="font-bold text-stone-900 text-sm">{product.sellerName}</p>
              <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {product.sellerCounty} County {product.sellerSubCounty ? `(${product.sellerSubCounty})` : ''}
              </p>

              <div className="mt-3 pt-3 border-t border-stone-100">
                {showPhone ? (
                  <a
                    href={`tel:${product.sellerPhone}`}
                    className="w-full bg-emerald-100 text-emerald-900 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{product.sellerPhone}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Breeder / Farm</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  {details.animalType.replace('_', ' ').toUpperCase()}
                </span>
                <span className="bg-stone-100 text-stone-700 font-semibold px-2.5 py-0.5 rounded-full">
                  Breed: {details.breed}
                </span>
                {details.earTagNumber && (
                  <span className="bg-stone-100 text-stone-600 font-mono text-[11px] px-2 py-0.5 rounded-full">
                    Tag: {details.earTagNumber}
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
                      / {product.unit}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="block text-stone-500 font-medium">Available</span>
                  <span className="font-bold text-emerald-900">
                    {product.quantityAvailable} {product.unit}(s)
                  </span>
                </div>
              </div>

              {/* Pedigree & Biological Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-4">
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Age & Stage</span>
                  <span className="font-bold text-stone-800">
                    {details.ageValue} {details.ageUnit}
                  </span>
                  {details.lactationStage && (
                    <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
                      {details.lactationStage}
                    </span>
                  )}
                </div>

                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Sex & Purpose</span>
                  <span className="font-bold text-stone-800 capitalize">
                    {details.sex} • {details.purpose}
                  </span>
                </div>

                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 block">Yield / Output</span>
                  <span className="font-black text-emerald-950">
                    {details.milkYieldLitersPerDay ? `${details.milkYieldLitersPerDay} Litres/day` :
                     details.eggYieldPerWeek ? `${details.eggYieldPerWeek} eggs/week` :
                     details.weightKg ? `${details.weightKg} kg weight` : 'Prime Genetics'}
                  </span>
                </div>
              </div>

              {/* Feed & Management Notes */}
              {details.feedRegime && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 mb-4">
                  <span className="font-bold text-stone-900 block mb-1">
                    Feed Regime & Management:
                  </span>
                  <span>{details.feedRegime}</span>
                </div>
              )}

              {/* Vaccination & Veterinary History */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Veterinary Health & Vaccination Records</span>
                  <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {details.healthStatus}
                  </span>
                </h4>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {details.vaccinations.map((vac, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-semibold text-emerald-950 block">{vac.vaccineName}</span>
                          {vac.vetName && <span className="text-[10px] text-stone-500">Certified by: {vac.vetName}</span>}
                        </div>
                      </div>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {vac.dateAdministered}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport Compliance Note */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 mb-4">
                <p className="font-bold flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-700" />
                  Specialized Livestock Transport Available
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  We provide specialized animal transport trucks with dividers, straw bedding, and Kenya Veterinary Movement Permits between counties.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-500 block">Total Payable</span>
                <span className="text-lg font-black text-emerald-950">
                  KSh {(product.priceKsh * quantity).toLocaleString()}
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
                <span>Add Livestock to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
