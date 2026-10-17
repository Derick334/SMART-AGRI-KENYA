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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in duration-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-950">
                Livestock Side-by-Side Comparison
              </h2>
              <p className="text-xs text-stone-500">
                Compare breed genetics, milk yield, age, veterinary vaccines, and pricing before purchasing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="p-3 text-stone-400 font-bold uppercase tracking-wider w-40">
                  Feature / Metric
                </th>
                {products.map((p) => (
                  <th key={p.id} className="p-3 min-w-60 align-top">
                    <div className="relative">
                      <button
                        onClick={() => onRemove(p.id)}
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 flex items-center justify-center text-xs transition cursor-pointer"
                        title="Remove from comparison"
                      >
                        ×
                      </button>
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-32 object-cover rounded-xl border border-stone-200 mb-2"
                      />
                      <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{p.title}</h4>
                      <p className="font-black text-emerald-800 text-base mt-1">
                        KSh {p.priceKsh.toLocaleString()}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="p-3 font-semibold text-stone-500 bg-stone-50">Breed</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-bold text-emerald-900">
                    {p.livestockDetails?.breed || p.variety || 'Not specified'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-stone-500 bg-stone-50">Animal Type</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 capitalize text-stone-800 font-medium">
                    {p.livestockDetails?.animalType.replace('_', ' ')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-stone-500 bg-stone-50">Age</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-stone-800">
                    {p.livestockDetails?.ageValue} {p.livestockDetails?.ageUnit}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-stone-500 bg-stone-50">Yield / Output</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-black text-stone-900">
                    {p.livestockDetails?.milkYieldLitersPerDay ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        {p.livestockDetails.milkYieldLitersPerDay} Litres/day
                      </span>
                    ) : p.livestockDetails?.eggYieldPerWeek ? (
                      <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                        {p.livestockDetails.eggYieldPerWeek} eggs/week
                      </span>
                    ) : p.livestockDetails?.weightKg ? (
                      `${p.livestockDetails.weightKg} kg live weight`
                    ) : 'Standard'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-stone-500 bg-stone-50">Purpose</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 capitalize text-stone-800">
                    {p.livestockDetails?.purpose}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-stone-500 bg-stone-50">Farm Location</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-stone-800">
                    {p.sellerCounty} County {p.sellerSubCounty ? `(${p.sellerSubCounty})` : ''}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-stone-500 bg-stone-50">Health & Vet Status</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {p.livestockDetails?.healthStatus || 'Healthy'}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-stone-500 bg-stone-50">Vaccination Records</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <div className="space-y-1">
                      {p.livestockDetails?.vaccinations && p.livestockDetails.vaccinations.length > 0 ? (
                        p.livestockDetails.vaccinations.map((v, i) => (
                          <div key={i} className="text-[10px] text-stone-600 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{v.vaccineName} ({v.dateAdministered})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-stone-400">None registered</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-stone-500 bg-stone-50">Actions</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <button
                      onClick={() => onAddToCart(p)}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
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
