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
  const [publishedNotice, setPublishedNotice] = useState<string | null>(null);

  // New Listing Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('crops');
  const [productType, setProductType] = useState('Cereals');
  const [subcategory, setSubcategory] = useState('Cereals & Grains');
  const [variety, setVariety] = useState('H614');
  const [priceKsh, setPriceKsh] = useState(3500);
  const [unit, setUnit] = useState('90kg bag');
  const [quantityAvailable, setQuantityAvailable] = useState(50);
  const [minimumOrder, setMinimumOrder] = useState(1);
  const [county, setCounty] = useState(currentUser.county || 'Nakuru');
  const [subCounty, setSubCounty] = useState(currentUser.subCounty || 'Njoro');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80');

  // Livestock specific fields
  const [animalGroup, setAnimalGroup] = useState<'Cattle' | 'Goats' | 'Sheep' | 'Poultry' | 'Pigs' | 'Rabbits' | 'Fish' | 'Other livestock'>('Cattle');
  const [cattlePurpose, setCattlePurpose] = useState<'Dairy' | 'Beef' | 'Dual-purpose'>('Dairy');
  const [animalType, setAnimalType] = useState<LivestockType>('dairy_cow');
  const [breed, setBreed] = useState('Friesian');
  const [ageValue, setAgeValue] = useState(3);
  const [ageUnit, setAgeUnit] = useState<'days' | 'months' | 'years'>('years');
  const [sex, setSex] = useState<'female' | 'male' | 'mixed_batch'>('female');
  const [purpose, setPurpose] = useState<'milk' | 'beef' | 'breeding' | 'eggs' | 'meat'>('milk');
  const [milkYield, setMilkYield] = useState(25);

  // Equipment specific fields
  const [powerSource, setPowerSource] = useState<'Manual' | 'Petrol' | 'Diesel' | 'Solar' | 'Electric'>('Diesel');
  const [equipmentCondition, setEquipmentCondition] = useState<'new' | 'used'>('new');

  const myProducts = products.filter(p => p.sellerId === currentUser.id || p.sellerName.includes('Kiprono') || p.sellerName.includes('Rongai'));

  const totalSalesEstimate = myProducts.reduce((sum, p) => sum + (p.priceKsh * 4), 0);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();

    const newProd = agriStore.addProduct({
      title,
      description,
      category,
      subcategory,
      productType,
      variety: category === 'crops' || category === 'inputs' ? variety : undefined,
      breed: category === 'livestock' ? breed : undefined,
      animalType: category === 'livestock' ? animalGroup : undefined,
      cattlePurpose: category === 'livestock' && animalGroup === 'Cattle' ? cattlePurpose : undefined,
      powerSource: category === 'equipment' ? powerSource : undefined,
      condition: category === 'equipment' ? equipmentCondition : 'new',
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
    setPublishedNotice(`Listing "${newProd.title}" successfully published to SMART-AGRI KENYA Marketplace!`);
    setTimeout(() => setPublishedNotice(null), 6000);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Published Notice Banner */}
      {publishedNotice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] text-xs font-medium rounded-lg flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#367C46] shrink-0" />
            <span>{publishedNotice}</span>
          </div>
          <button onClick={() => setPublishedNotice(null)} className="text-[#214E34] hover:bg-[#DCECE0] rounded p-1 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutDashboard className="w-4 h-4 text-[#367C46]" />
            <span>Farmer Seller Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
            {currentUser.farmName || `${currentUser.name}'s Farm`}
          </h1>
          <p className="text-xs sm:text-sm text-[#68756A] mt-1 max-w-xl">
            Manage your agricultural stock, create produce listings, view incoming orders, and track payouts via Safaricom M-Pesa.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Listing</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#68756A] block">Total Active Listings</span>
          <span className="text-2xl font-extrabold text-[#252D27] mt-1 block tabular-nums">{myProducts.length}</span>
          <span className="text-[11px] text-[#367C46] font-semibold mt-0.5 block">Published & Live</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#68756A] block">Est. Revenue This Season</span>
          <span className="text-2xl font-extrabold text-[#214E34] mt-1 block tabular-nums">
            KSh {totalSalesEstimate.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#68756A] mt-0.5 block">Direct to M-Pesa {currentUser.phone}</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#68756A] block">Farm Verification</span>
          <div className="flex items-center gap-1.5 mt-1 text-[#214E34] font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-[#367C46]" />
            <span>ID & Location Verified</span>
          </div>
          <span className="text-[11px] text-[#68756A] mt-0.5 block">{currentUser.county} County</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#68756A] block">Buyer Satisfaction</span>
          <span className="text-2xl font-extrabold text-[#D6A545] mt-1 block tabular-nums">4.9 / 5.0</span>
          <span className="text-[11px] text-[#68756A] mt-0.5 block">Over 48 verified customer reviews</span>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
          <h3 className="font-bold text-sm text-[#214E34] uppercase tracking-wider">
            Your Farm Catalogue & Inventory
          </h3>
          <span className="text-xs text-[#68756A]">{myProducts.length} Products registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F6F0] border-b border-[#E2E7DE] text-[#68756A] font-bold uppercase tracking-wider">
                <th className="p-3">Product / Livestock</th>
                <th className="p-3">Category</th>
                <th className="p-3">Asking Price</th>
                <th className="p-3">Available Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E7DE]">
              {myProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#F7F6F0]/60 transition">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-[#E2E7DE] shrink-0"
                    />
                    <div>
                      <span className="font-bold text-[#252D27] block line-clamp-1">{p.title}</span>
                      <span className="text-[11px] text-[#68756A]">
                        {p.variety || p.livestockDetails?.breed || p.subcategory}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 capitalize font-medium text-[#252D27]">
                    {p.category}
                  </td>

                  <td className="p-3 font-extrabold text-[#214E34] text-sm tabular-nums">
                    KSh {p.priceKsh.toLocaleString()} <span className="text-xs font-normal text-[#68756A]">/ {p.unit}</span>
                  </td>

                  <td className="p-3 font-semibold text-[#252D27] tabular-nums">
                    {p.quantityAvailable} {p.unit}s
                  </td>

                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      p.status === 'active' ? 'bg-[#EBF3ED] text-[#214E34] border border-[#CFD7CA]' : 'bg-[#F7F6F0] text-[#68756A] border border-[#E2E7DE]'
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status)}
                        className="text-[#68756A] hover:text-[#252D27] p-1 cursor-pointer"
                        title={p.status === 'active' ? 'Pause listing' : 'Activate listing'}
                      >
                        {p.status === 'active' ? (
                          <PauseCircle className="w-4 h-4 text-[#D6A545]" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-[#367C46]" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-[#68756A] hover:text-[#79543A] p-1 cursor-pointer"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-[#E2E7DE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
              <h3 className="font-bold text-base text-[#214E34]">
                Publish Produce or Livestock Listing
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="w-7 h-7 rounded-lg bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#252D27] flex items-center justify-center border border-[#E2E7DE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Catalog Section</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-[#252D27] font-semibold bg-white focus:outline-none focus:border-[#367C46]"
                  >
                    <option value="crops">Crops & Plant Produce</option>
                    <option value="livestock">Livestock & Cattle</option>
                    <option value="inputs">Farm Inputs & Seeds</option>
                    <option value="equipment">Machinery & Irrigation</option>
                    <option value="fodder">Fodder & Hay</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Subcategory</label>
                  <input
                    type="text"
                    required
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Dairy Cattle, Cereals, Roots"
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-[#252D27] bg-white focus:outline-none focus:border-[#367C46]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Listing Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pedigree Friesian Cow (28L/day) or Grade 1 Clean Maize"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-[#252D27] bg-white focus:outline-none focus:border-[#367C46]"
                />
              </div>

              {/* Dynamic Product Type & Variety for Crops */}
              {category === 'crops' && (
                <div className="p-3.5 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA] grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#214E34] mb-1">Crop Product Type</label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#CFD7CA] bg-white text-[#252D27]"
                    >
                      <option value="Cereals">Cereals (Maize, Rice, Wheat)</option>
                      <option value="Legumes">Legumes (Beans, Peas, Grams)</option>
                      <option value="Fruits">Fruits (Avocados, Bananas, Mangoes)</option>
                      <option value="Vegetables">Vegetables (Tomatoes, Onions, Kales)</option>
                      <option value="Root and tuber crops">Root & Tuber Crops (Potatoes, Cassava)</option>
                      <option value="Other agricultural produce">Other Agricultural Produce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#214E34] mb-1">Crop Variety</label>
                    <input
                      type="text"
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder="e.g. H614, Rosecoco, Anna F1, Shangi, Hass"
                      className="w-full p-2.5 rounded-lg border border-[#CFD7CA] bg-white text-[#252D27]"
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Inputs Type for Certified Seeds & Fertilizers */}
              {category === 'inputs' && (
                <div className="p-3.5 bg-[#EBF3ED] rounded-lg border border-[#CFD7CA] grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#214E34] mb-1">Input Product Type</label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#CFD7CA] bg-white text-[#252D27]"
                    >
                      <option value="Certified crop seeds">Certified Crop Seeds</option>
                      <option value="Vegetable seeds">Vegetable Seeds</option>
                      <option value="Pasture seeds">Pasture Seeds</option>
                      <option value="Organic fertilizers">Organic Fertilizers</option>
                      <option value="Inorganic fertilizers">Inorganic Fertilizers</option>
                      <option value="Soil conditioners">Soil Conditioners</option>
                      <option value="Other available agricultural inputs">Other Available Inputs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#214E34] mb-1">Variety or Formulation</label>
                    <input
                      type="text"
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder="e.g. H614D, DAP 18:46:0, Lime CaCO3"
                      className="w-full p-2.5 rounded-lg border border-[#CFD7CA] bg-white text-[#252D27]"
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Equipment Type & Power Source */}
              {category === 'equipment' && (
                <div className="p-3.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#252D27] mb-1">Equipment Type</label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                    >
                      <option value="Irrigation systems">Irrigation Systems</option>
                      <option value="Water pumps">Water Pumps</option>
                      <option value="Drip irrigation kits">Drip Irrigation Kits</option>
                      <option value="Sprayers">Sprayers</option>
                      <option value="Tractors">Tractors</option>
                      <option value="Ploughs / Tillers">Ploughs / Tillers</option>
                      <option value="Milking machines">Milking Machines</option>
                      <option value="Incubation and brooding equipment">Incubation & Brooding</option>
                      <option value="Animal feed processing equipment">Feed Processing Equipment</option>
                      <option value="Greenhouses and shade nets">Greenhouses & Shade Nets</option>
                      <option value="Solar equipment">Solar Equipment</option>
                      <option value="Hand tools and farm implements">Hand Tools & Implements</option>
                      <option value="Other equipment">Other Equipment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#252D27] mb-1">Power Source</label>
                    <select
                      value={powerSource}
                      onChange={(e) => setPowerSource(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Solar">Solar</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#252D27] mb-1">Condition</label>
                    <select
                      value={equipmentCondition}
                      onChange={(e) => setEquipmentCondition(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                    >
                      <option value="new">Brand New</option>
                      <option value="used">Used / Refurbished</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Livestock specific fields */}
              {category === 'livestock' && (
                <div className="p-3.5 bg-[#FCF8EE] rounded-lg border border-[#D6A545]/40 space-y-3">
                  <span className="font-bold text-[#79543A] block">Animal Specifications & Verified Breed</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-[#252D27] mb-1">Animal Type</label>
                      <select
                        value={animalGroup}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setAnimalGroup(val);
                          if (val === 'Cattle') {
                            setBreed('Friesian');
                            setAnimalType('dairy_cow');
                          } else if (val === 'Goats') {
                            setBreed('Galla');
                            setAnimalType('goat');
                          } else if (val === 'Sheep') {
                            setBreed('Dorper');
                            setAnimalType('sheep');
                          } else if (val === 'Poultry') {
                            setBreed('Kienyeji');
                            setAnimalType('chicken');
                          } else if (val === 'Pigs') {
                            setBreed('Large White');
                            setAnimalType('pig');
                          } else if (val === 'Rabbits') {
                            setBreed('New Zealand White');
                            setAnimalType('rabbit');
                          } else if (val === 'Fish') {
                            setBreed('Tilapia');
                            setAnimalType('fish');
                          } else {
                            setBreed('African Honeybee');
                            setAnimalType('bees');
                          }
                        }}
                        className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                      >
                        <option value="Cattle">Cattle</option>
                        <option value="Goats">Goats</option>
                        <option value="Sheep">Sheep</option>
                        <option value="Poultry">Poultry</option>
                        <option value="Pigs">Pigs</option>
                        <option value="Rabbits">Rabbits</option>
                        <option value="Fish">Fish</option>
                        <option value="Other livestock">Other livestock</option>
                      </select>
                    </div>

                    {animalGroup === 'Cattle' ? (
                      <div>
                        <label className="block font-semibold text-[#252D27] mb-1">Cattle Purpose</label>
                        <select
                          value={cattlePurpose}
                          onChange={(e) => setCattlePurpose(e.target.value as any)}
                          className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                        >
                          <option value="Dairy">Dairy</option>
                          <option value="Beef">Beef</option>
                          <option value="Dual-purpose">Dual-purpose</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block font-semibold text-[#252D27] mb-1">Sex</label>
                        <select
                          value={sex}
                          onChange={(e) => setSex(e.target.value as any)}
                          className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                        >
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="mixed_batch">Mixed Batch</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block font-semibold text-[#252D27] mb-1">Breed / Strain</label>
                      <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        placeholder="e.g. Friesian, Galla, Dorper, Kienyeji"
                        className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-[#252D27]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Price in KSh</label>
                  <input
                    type="number"
                    required
                    value={priceKsh}
                    onChange={(e) => setPriceKsh(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-[#252D27] bg-white focus:outline-none focus:border-[#367C46]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Unit of Measurement</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 90kg bag, head, kg, crate"
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-[#252D27] bg-white focus:outline-none focus:border-[#367C46]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#252D27] mb-1">Quantity Available</label>
                  <input
                    type="number"
                    required
                    value={quantityAvailable}
                    onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-[#252D27] bg-white focus:outline-none focus:border-[#367C46]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Description & Quality Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail moisture content, feeding regime, vaccinations, minimum order requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-[#252D27] bg-white focus:outline-none focus:border-[#367C46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#252D27] mb-1">Product Photograph URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-[#252D27] bg-white focus:outline-none focus:border-[#367C46]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E2E7DE]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-[#252D27] text-xs font-semibold hover:bg-[#F7F6F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-xs cursor-pointer transition"
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
