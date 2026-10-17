import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  MapPin, 
  DollarSign, 
  Tag, 
  CheckCircle2, 
  Sparkles,
  Sprout,
  Beef,
  Package,
  Wrench,
  Camera
} from 'lucide-react';
import { Product, ProductCategory, LivestockType } from '../../types';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { agriStore } from '../../services/store';

interface ProductListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (newProduct: Product) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Maize / Cereals', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80' },
  { label: 'Beans / Legumes', url: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { label: 'Potatoes', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80' },
  { label: 'Avocados', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dairy Cattle', url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80' },
  { label: 'Poultry', url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Seeds / Inputs', url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Farm Equipment', url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80' },
];

export const ProductListingModal: React.FC<ProductListingModalProps> = ({
  isOpen,
  onClose,
  onProductCreated,
}) => {
  const currentUser = agriStore.getCurrentUser();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('crops');
  const [productType, setProductType] = useState('Cereals');
  const [varietyOrBreed, setVarietyOrBreed] = useState('H614');
  const [priceKsh, setPriceKsh] = useState<number>(3500);
  const [unit, setUnit] = useState('90kg bag');
  const [quantityAvailable, setQuantityAvailable] = useState<number>(50);
  const [minimumOrder, setMinimumOrder] = useState<number>(1);
  const [county, setCounty] = useState(currentUser.county || 'Nakuru');
  const [subCounty, setSubCounty] = useState(currentUser.subCounty || 'Njoro');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTO_PRESETS[0].url);

  // Livestock details
  const [animalGroup, setAnimalGroup] = useState<'Cattle' | 'Goats' | 'Sheep' | 'Poultry' | 'Pigs' | 'Rabbits' | 'Fish' | 'Other livestock'>('Cattle');
  const [cattlePurpose, setCattlePurpose] = useState<'Dairy' | 'Beef' | 'Dual-purpose'>('Dairy');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    if (newCat === 'crops') {
      setProductType('Cereals');
      setVarietyOrBreed('H614');
      setUnit('90kg bag');
      setPriceKsh(3600);
      setImageUrl(SAMPLE_PHOTO_PRESETS[0].url);
    } else if (newCat === 'livestock') {
      setProductType('Cattle');
      setAnimalGroup('Cattle');
      setVarietyOrBreed('Friesian');
      setUnit('head');
      setPriceKsh(145000);
      setImageUrl(SAMPLE_PHOTO_PRESETS[5].url);
    } else if (newCat === 'inputs') {
      setProductType('Certified crop seeds');
      setVarietyOrBreed('H614D');
      setUnit('2kg packet');
      setPriceKsh(600);
      setImageUrl(SAMPLE_PHOTO_PRESETS[7].url);
    } else if (newCat === 'equipment') {
      setProductType('Irrigation systems');
      setVarietyOrBreed('Rain Gun System');
      setUnit('unit');
      setPriceKsh(35000);
      setImageUrl(SAMPLE_PHOTO_PRESETS[8].url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isLivestock = category === 'livestock';
      const created = agriStore.addProduct({
        title,
        description,
        category,
        subcategory: productType,
        productType,
        variety: !isLivestock ? varietyOrBreed : undefined,
        breed: isLivestock ? varietyOrBreed : undefined,
        animalType: isLivestock ? animalGroup : undefined,
        cattlePurpose: isLivestock && animalGroup === 'Cattle' ? cattlePurpose : undefined,
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
        isDemo: false, // Explicitly separate persistent production user data from demo data
        livestockDetails: isLivestock ? {
          animalType: animalGroup === 'Cattle' ? 'dairy_cow' : animalGroup === 'Goats' ? 'goat' : animalGroup === 'Sheep' ? 'sheep' : 'chicken',
          breed: varietyOrBreed,
          ageValue: 2,
          ageUnit: 'years',
          sex: 'female',
          purpose: cattlePurpose === 'Dairy' ? 'milk' : 'beef',
          milkYieldLitersPerDay: cattlePurpose === 'Dairy' ? 24 : undefined,
          healthStatus: 'Excellent - Certified Healthy',
          vaccinations: [
            { vaccineName: 'Routine Veterinary Certification', dateAdministered: '2026-10-01', verifiedByVet: true }
          ]
        } : undefined,
      });

      onProductCreated(created);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900">
                Post New Agricultural Listing
              </h3>
              <p className="text-[11px] text-stone-500">
                Published directly to the SMART-AGRI KENYA Marketplace with live dynamic filters
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category Selector */}
          <div>
            <label className="block font-bold text-stone-800 mb-1.5 uppercase tracking-wider text-[11px]">
              1. Marketplace Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'crops', label: 'Crops & Produce', icon: Sprout },
                { id: 'livestock', label: 'Livestock & Cattle', icon: Beef },
                { id: 'inputs', label: 'Seeds & Inputs', icon: Package },
                { id: 'equipment', label: 'Equipment & Irrigation', icon: Wrench },
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategoryChange(c.id as ProductCategory)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-center gap-2 ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-800 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="font-bold text-[11px] truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Type & Variety / Breed */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">Specific Product Type</label>
              {category === 'crops' && (
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Cereals">Cereals</option>
                  <option value="Legumes">Legumes</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Root and tuber crops">Root and tuber crops</option>
                  <option value="Other agricultural produce">Other agricultural produce</option>
                </select>
              )}
              {category === 'livestock' && (
                <select
                  value={animalGroup}
                  onChange={(e) => {
                    const grp = e.target.value as any;
                    setAnimalGroup(grp);
                    setProductType(grp);
                    if (grp === 'Cattle') setVarietyOrBreed('Friesian');
                    else if (grp === 'Goats') setVarietyOrBreed('Galla');
                    else if (grp === 'Sheep') setVarietyOrBreed('Dorper');
                    else if (grp === 'Poultry') setVarietyOrBreed('Kienyeji');
                    else if (grp === 'Pigs') setVarietyOrBreed('Large White');
                    else setVarietyOrBreed('Indigenous');
                  }}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
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
              )}
              {category === 'inputs' && (
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Certified crop seeds">Certified crop seeds</option>
                  <option value="Vegetable seeds">Vegetable seeds</option>
                  <option value="Pasture seeds">Pasture seeds</option>
                  <option value="Organic fertilizers">Organic fertilizers</option>
                  <option value="Inorganic fertilizers">Inorganic fertilizers</option>
                  <option value="Soil conditioners">Soil conditioners</option>
                  <option value="Other available agricultural inputs">Other inputs</option>
                </select>
              )}
              {category === 'equipment' && (
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Irrigation systems">Irrigation systems</option>
                  <option value="Water pumps">Water pumps</option>
                  <option value="Drip irrigation kits">Drip irrigation kits</option>
                  <option value="Sprayers">Sprayers</option>
                  <option value="Tractors">Tractors</option>
                  <option value="Ploughs / Tillers">Ploughs / Tillers</option>
                  <option value="Milking machines">Milking machines</option>
                  <option value="Incubation and brooding equipment">Incubation & brooding</option>
                  <option value="Animal feed processing equipment">Feed processing equipment</option>
                  <option value="Greenhouses and shade nets">Greenhouses & shade nets</option>
                  <option value="Solar equipment">Solar equipment</option>
                  <option value="Hand tools and farm implements">Hand tools & implements</option>
                  <option value="Other equipment">Other equipment</option>
                </select>
              )}
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                {category === 'livestock' ? 'Breed / Strain' : 'Variety / Formulation / Model'}
              </label>
              <input
                type="text"
                required
                value={varietyOrBreed}
                onChange={(e) => setVarietyOrBreed(e.target.value)}
                placeholder={
                  category === 'livestock'
                    ? 'e.g. Friesian, Ayrshire, Galla, Dorper, Kienyeji'
                    : 'e.g. H614, Rosecoco, Anna F1, Shangi, Hass, DAP'
                }
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
              />
            </div>

            {category === 'livestock' && animalGroup === 'Cattle' && (
              <div className="sm:col-span-2 pt-2 border-t border-stone-200 flex items-center gap-3">
                <span className="font-bold text-stone-700">Cattle Purpose:</span>
                {(['Dairy', 'Beef', 'Dual-purpose'] as const).map((purp) => (
                  <label key={purp} className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="cattlePurpose"
                      value={purp}
                      checked={cattlePurpose === purp}
                      onChange={() => setCattlePurpose(purp)}
                      className="accent-emerald-700"
                    />
                    <span>{purp}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">Product Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Grade 1 Dry Maize (H614) or Pedigree In-Calf Friesian Heifer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">Product Description</label>
            <textarea
              rows={2}
              required
              placeholder="Details about quality, harvest conditions, vaccinations, moisture, or packaging..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300"
            />
          </div>

          {/* Price, Unit & Quantities */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">Price in KSh</label>
              <input
                type="number"
                required
                min="1"
                value={priceKsh}
                onChange={(e) => setPriceKsh(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1">Unit</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. 90kg bag, head, kg"
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1">Stock Available</label>
              <input
                type="number"
                required
                min="1"
                value={quantityAvailable}
                onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">Seller County</label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} County
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1">Sub-County / Town</label>
              <input
                type="text"
                required
                value={subCounty}
                onChange={(e) => setSubCounty(e.target.value)}
                placeholder="e.g. Moiben, Eldoret, Naivasha"
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Image Presets & URL */}
          <div className="space-y-2">
            <label className="block font-bold text-stone-800 text-[11px] uppercase tracking-wider">
              Product Image
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 p-2 rounded-xl border border-stone-300"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-10 h-10 rounded-lg object-cover border border-stone-300 shrink-0"
                />
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[10px]">
              <span className="text-stone-400 shrink-0 flex items-center gap-1">
                <Camera className="w-3 h-3" /> Presets:
              </span>
              {SAMPLE_PHOTO_PRESETS.slice(0, 5).map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 whitespace-nowrap cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish to Marketplace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
