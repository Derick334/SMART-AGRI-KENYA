import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  Trash2, 
  PauseCircle, 
  PlayCircle,
  Eye,
  ShieldCheck,
  MapPin,
  Upload,
  X
} from 'lucide-react';
import { Product, ProductCategory, LivestockType } from '../types';
import { agriStore } from '../services/store';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

export const FarmerDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(agriStore.getProducts());
  const [currentUser] = useState(agriStore.getCurrentUser());
  const [showAddModal, setShowAddModal] = useState(false);

  // New Listing Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('crops');
  const [subcategory, setSubcategory] = useState('Cereals & Grains');
  const [variety, setVariety] = useState('');
  const [priceKsh, setPriceKsh] = useState(3500);
  const [unit, setUnit] = useState('90kg bag');
  const [quantityAvailable, setQuantityAvailable] = useState(50);
  const [minimumOrder, setMinimumOrder] = useState(1);
  const [county, setCounty] = useState(currentUser.county || 'Nakuru');
  const [subCounty, setSubCounty] = useState(currentUser.subCounty || 'Njoro');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80');

  // Livestock specific fields
  const [animalType, setAnimalType] = useState<LivestockType>('dairy_cow');
  const [breed, setBreed] = useState('Friesian');
  const [ageValue, setAgeValue] = useState(3);
  const [ageUnit, setAgeUnit] = useState<'days' | 'months' | 'years'>('years');
  const [sex, setSex] = useState<'female' | 'male' | 'mixed_batch'>('female');
  const [purpose, setPurpose] = useState<'milk' | 'beef' | 'breeding' | 'eggs' | 'meat'>('milk');
  const [milkYield, setMilkYield] = useState(25);

  const myProducts = products.filter(p => p.sellerId === currentUser.id || p.sellerName.includes('Kiprono') || p.sellerName.includes('Rongai'));

  const totalSalesEstimate = myProducts.reduce((sum, p) => sum + (p.priceKsh * 4), 0);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();

    const newProd = agriStore.addProduct({
      title,
      description,
      category,
      subcategory,
      variety,
      priceKsh: Number(priceKsh),
      unit,
      quantityAvailable: Number(quantityAvailable),
      minimumOrder: Number(minimumOrder),
      sellerId: currentUser.id,
      sellerName: currentUser.farmName || currentUser.name,
      sellerPhone: currentUser.phone,
      sellerCounty: county,
      sellerSubCounty: subCounty,
      images: [imageUrl],
      isVerifiedSeller: true,
      rating: 5.0,
      reviewsCount: 1,
      deliveryOptions: ['pickup', 'carrier_dispatch'],
      status: 'active',
      livestockDetails: category === 'livestock' ? {
        animalType,
        breed,
        ageValue: Number(ageValue),
        ageUnit,
        sex,
        purpose,
        milkYieldLitersPerDay: purpose === 'milk' ? Number(milkYield) : undefined,
        healthStatus: 'Excellent - Certified Healthy',
        vaccinations: [
          { vaccineName: 'FMD & Anthrax Routine Vaccination', dateAdministered: '2026-08-01', verifiedByVet: true }
        ],
      } : undefined,
    });

    setProducts(agriStore.getProducts());
    setShowAddModal(false);
    alert(`Listing "${newProd.title}" successfully published to SMART-AGRI KENYA Marketplace!`);
  };

  const handleToggleStatus = (id: string, currentStatus: Product['status']) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    agriStore.updateProductStatus(id, newStatus);
    setProducts(agriStore.getProducts());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      agriStore.deleteProduct(id);
      setProducts(agriStore.getProducts());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>Farmer Seller Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentUser.farmName || `${currentUser.name}'s Farm`}
          </h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            Manage your agricultural stock, create produce listings, view incoming orders, and track payouts via Safaricom M-Pesa.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-black text-xs px-5 py-3 rounded-2xl transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Listing</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Active Listings</span>
          <span className="text-2xl font-black text-stone-900 mt-1 block">{myProducts.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Published & Live</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Est. Revenue This Season</span>
          <span className="text-2xl font-black text-emerald-950 mt-1 block">
            KSh {totalSalesEstimate.toLocaleString()}
          </span>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Direct to M-Pesa {currentUser.phone}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Farm Verification</span>
          <div className="flex items-center gap-1.5 mt-1 text-emerald-700 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>ID & Location Verified</span>
          </div>
          <span className="text-[10px] text-stone-400 mt-0.5 block">{currentUser.county} County</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Buyer Satisfaction</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">4.9 / 5.0</span>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Over 48 verified customer reviews</span>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
            Your Farm Catalogue & Inventory
          </h3>
          <span className="text-xs text-stone-500">{myProducts.length} Products registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                <th className="p-3">Product / Livestock</th>
                <th className="p-3">Category</th>
                <th className="p-3">Asking Price</th>
                <th className="p-3">Available Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {myProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70 transition">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block line-clamp-1">{p.title}</span>
                      <span className="text-[11px] text-stone-500">
                        {p.variety || p.livestockDetails?.breed || p.subcategory}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 capitalize font-medium text-stone-700">
                    {p.category}
                  </td>

                  <td className="p-3 font-black text-stone-900 text-sm">
                    KSh {p.priceKsh.toLocaleString()} <span className="text-xs font-normal text-stone-500">/ {p.unit}</span>
                  </td>

                  <td className="p-3 font-semibold text-stone-800">
                    {p.quantityAvailable} {p.unit}s
                  </td>

                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status)}
                        className="text-stone-500 hover:text-stone-800 p-1"
                        title={p.status === 'active' ? 'Pause listing' : 'Activate listing'}
                      >
                        {p.status === 'active' ? (
                          <PauseCircle className="w-4 h-4 text-amber-600" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publish Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                Publish Produce or Livestock Listing
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Catalog Section</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold"
                  >
                    <option value="crops">Crops & Plant Produce</option>
                    <option value="livestock">Livestock & Cattle</option>
                    <option value="inputs">Farm Inputs & Seeds</option>
                    <option value="equipment">Machinery & Irrigation</option>
                    <option value="fodder">Fodder & Hay</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Subcategory</label>
                  <input
                    type="text"
                    required
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Dairy Cattle, Cereals, Roots"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Listing Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pedigree Friesian Cow (28L/day) or Grade 1 Clean Maize"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              {/* Livestock specific fields */}
              {category === 'livestock' && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                  <span className="font-bold text-amber-950 block">Animal Specifications</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Animal Type</label>
                      <select
                        value={animalType}
                        onChange={(e) => setAnimalType(e.target.value as any)}
                        className="w-full p-2 rounded-lg border border-stone-300"
                      >
                        <option value="dairy_cow">Dairy Cow</option>
                        <option value="beef_cattle">Beef Cattle</option>
                        <option value="bull">Breeding Bull</option>
                        <option value="heifer">Heifer</option>
                        <option value="chicken">Poultry / Chicken</option>
                        <option value="goat">Goat</option>
                        <option value="sheep">Sheep</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Breed</label>
                      <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        placeholder="e.g. Friesian, Ayrshire, Kienyeji"
                        className="w-full p-2 rounded-lg border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Milk Yield (L/day)</label>
                      <input
                        type="number"
                        value={milkYield}
                        onChange={(e) => setMilkYield(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-stone-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price in KSh</label>
                  <input
                    type="number"
                    required
                    value={priceKsh}
                    onChange={(e) => setPriceKsh(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unit of Measurement</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 90kg bag, head, kg, crate"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Quantity Available</label>
                  <input
                    type="number"
                    required
                    value={quantityAvailable}
                    onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description & Quality Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail moisture content, feeding regime, vaccinations, minimum order requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Photograph URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  Publish Listing to Kenya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
