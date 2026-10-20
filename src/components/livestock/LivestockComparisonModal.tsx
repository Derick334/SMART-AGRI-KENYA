import React from 'react';
import { X, Check, Scale, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface LivestockComparisonModalProps {
  products: Product[];
  onClose: () => void;
  onRemove: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const LivestockComparisonModal: React.FC<LivestockComparisonModalProps> = ({
  products,
  onClose,
  onRemove,
  onAddToCart,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#E2E7DE] relative animate-in fade-in duration-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E7DE] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#FCF8EE] text-[#D6A545] flex items-center justify-center border border-[#E2E7DE]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#214E34]">
                Livestock Side-by-Side Comparison
              </h2>
              <p className="text-xs text-[#68756A]">
                Compare breed genetics, milk yield, age, veterinary vaccines, and pricing before purchasing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center transition cursor-pointer border border-[#E2E7DE]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E7DE]">
                <th className="p-3 text-[#68756A] font-bold uppercase tracking-wider w-40 bg-[#F7F6F0]">
                  Feature / Metric
                </th>
                {products.map((p) => (
                  <th key={p.id} className="p-3 min-w-60 align-top">
                    <div className="relative">
                      <button
                        onClick={() => onRemove(p.id)}
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center text-xs transition cursor-pointer border border-[#E2E7DE]"
                        title="Remove from comparison"
                      >
                        ×
                      </button>
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-32 object-cover rounded-lg border border-[#E2E7DE] mb-2"
                      />
                      <h4 className="font-bold text-[#252D27] text-sm line-clamp-1">{p.title}</h4>
                      <p className="font-black text-[#214E34] text-base mt-1 tabular-nums">
                        KSh {p.priceKsh.toLocaleString()}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E7DE]">
              <tr>
                <td className="p-3 font-semibold text-[#68756A] bg-[#F7F6F0]">Breed</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-bold text-[#214E34]">
                    {p.livestockDetails?.breed || p.variety || 'Not specified'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-[#68756A] bg-[#F7F6F0]">Animal Type</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 capitalize text-[#252D27] font-medium">
                    {p.livestockDetails?.animalType.replace('_', ' ')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-[#68756A] bg-[#F7F6F0]">Age</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-[#252D27]">
                    {p.livestockDetails?.ageValue} {p.livestockDetails?.ageUnit}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-[#68756A] bg-[#F7F6F0]">Yield / Output</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-bold text-[#252D27]">
                    {p.livestockDetails?.milkYieldLitersPerDay ? (
                      <span className="text-[#214E34] font-bold bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#CFD7CA]">
                        {p.livestockDetails.milkYieldLitersPerDay} Litres/day
                      </span>
                    ) : p.livestockDetails?.eggYieldPerWeek ? (
                      <span className="text-[#79543A] font-bold bg-[#FCF8EE] px-2 py-0.5 rounded border border-[#E2E7DE]">
                        {p.livestockDetails.eggYieldPerWeek} eggs/week
                      </span>
                    ) : p.livestockDetails?.weightKg ? (
                      `${p.livestockDetails.weightKg} kg live weight`
                    ) : 'Standard'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-[#68756A] bg-[#F7F6F0]">Purpose</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 capitalize text-[#252D27]">
                    {p.livestockDetails?.purpose}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-[#68756A] bg-[#F7F6F0]">Farm Location</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-[#252D27]">
                    {p.sellerCounty} County {p.sellerSubCounty ? `(${p.sellerSubCounty})` : ''}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-[#68756A] bg-[#F7F6F0]">Health & Vet Status</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#214E34] text-[11px] bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#CFD7CA]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#367C46]" />
                      {p.livestockDetails?.healthStatus || 'Healthy'}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-[#68756A] bg-[#F7F6F0]">Vaccination Records</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <div className="space-y-1">
                      {p.livestockDetails?.vaccinations && p.livestockDetails.vaccinations.length > 0 ? (
                        p.livestockDetails.vaccinations.map((v, i) => (
                          <div key={i} className="text-[10px] text-[#68756A] flex items-center gap-1">
                            <Check className="w-3 h-3 text-[#367C46] shrink-0" />
                            <span>{v.vaccineName} ({v.dateAdministered})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-[#68756A]">None registered</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-[#68756A] bg-[#F7F6F0]">Actions</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <button
                      onClick={() => onAddToCart(p)}
                      className="w-full bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
