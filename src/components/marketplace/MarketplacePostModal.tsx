import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Sprout, 
  Beef, 
  Package, 
  CheckCircle2, 
  Upload, 
  Eye, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Product, ProductCategory, LivestockDetails } from '../../types';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { agriStore } from '../../services/store';

interface MarketplacePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product) => void;
  defaultCounty?: string;
}

export const MarketplacePostModal: React.FC<MarketplacePostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultCounty = 'Nakuru',
}) => {
  if (!isOpen) return null;

  // Step state: 1 = Category Select, 2 = Fill Details, 3 = Live Preview
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const currentUser = agriStore.getCurrentUser();

  // Common Fields
  const [category, setCategory] = useState<ProductCategory>('crops');
  const [title, setTitle] = useState('');
  const [productType, setProductType] = useState('Maize');
  const [varietyOrBreed, setVarietyOrBreed] = useState('');
  const [priceKsh, setPriceKsh] = useState<string>('');
  const [unit, setUnit] = useState('90kg bag');
  const [quantity, setQuantity] = useState('20');
  const [county, setCounty] = useState(defaultCounty);
  const [subCounty, setSubCounty] = useState('Sub-County Centre');
  const [description, setDescription] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>(['pickup', 'delivery']);
  const [imageUrl, setImageUrl] = useState('');

  // Crops Specific
  const [cropGrade, setCropGrade] = useState<'Grade 1' | 'Grade 2' | 'Standard' | 'Export' | 'Organic'>('Grade 1');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [packagingType, setPackagingType] = useState('Sisal 90kg Gunny Bag');

  // Livestock Specific
  const [animalType, setAnimalType] = useState<'cattle' | 'goat' | 'sheep' | 'pig' | 'chicken' | 'rabbit' | 'fish' | 'other'>('chicken');
  const [livestockBreed, setLivestockBreed] = useState('KALRO Improved Kienyeji');
  const [ageValue, setAgeValue] = useState('5.5');
  const [ageUnit, setAgeUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('months');
  const [livestockSex, setLivestockSex] = useState<'male' | 'female' | 'mixed'>('female');
  const [livestockPurpose, setLivestockPurpose] = useState<'dairy' | 'beef' | 'dual' | 'breeding' | 'eggs' | 'broiler' | 'meat' | 'pets'>('eggs');
  const [vaccinationStatus, setVaccinationStatus] = useState('Fully vaccinated against Newcastle, Gumboro and Fowl Typhoid');
  const [currentWeightKg, setCurrentWeightKg] = useState('');
  const [dailyMilkYieldLiters, setDailyMilkYieldLiters] = useState('');

  // Farm Inputs Specific
  const [inputCategory, setInputCategory] = useState<'seed' | 'fertilizer' | 'agrochem' | 'feed' | 'irrigation' | 'equipment'>('seed');
  const [brand, setBrand] = useState('Kenya Seed Company');
  const [packageSize, setPackageSize] = useState('2kg sealed packet');
  const [regulatoryApproval, setRegulatoryApproval] = useState('KEPHIS Certified Seed Lot #2026-NKR');
  const [directions, setDirections] = useState('Plant at onset of rains, 75cm x 25cm spacing with DAP or NPK fertilizer.');

  // Form error
  const [error, setError] = useState<string | null>(null);

  // Set preset default image if blank
  const getDisplayImage = () => {
    if (imageUrl.trim()) return imageUrl.trim();
    if (category === 'crops') {
      if (productType.toLowerCase().includes('potato')) {
        return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80';
      }
      if (productType.toLowerCase().includes('bean')) {
        return 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80';
      }
      return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80';
    }
    if (category === 'livestock') {
      if (animalType === 'chicken') {
        return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80';
      }
      if (animalType === 'cattle') {
        return 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80';
      }
      if (animalType === 'goat' || animalType === 'sheep') {
        return 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80';
      }
      return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80';
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setCategory(cat);
    if (cat === 'crops') {
      setProductType('Maize');
      setVarietyOrBreed('H614D');
      setUnit('90kg bag');
      setPackagingType('90kg gunny bag');
    } else if (cat === 'livestock') {
      setProductType('Chicken');
      setVarietyOrBreed('KALRO Improved Kienyeji');
      setAnimalType('chicken');
      setUnit('bird');
      setQuantity('50');
    } else {
      setProductType('Certified seeds');
      setVarietyOrBreed('Seed Maize H614D');
      setUnit('2kg packet');
      setBrand('Kenya Seed Company');
    }
    setStep(2);
  };

  const handleValidateAndProceedToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Product title is required.');
      return;
    }
    if (!priceKsh || Number(priceKsh) <= 0) {
      setError('Please provide a valid price in Kenyan Shillings (KSh).');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Please specify available stock quantity.');
      return;
    }
    setError(null);
    setStep(3);
  };

  const handlePublishListing = () => {
    const finalImage = getDisplayImage();

    let livestockObj: LivestockDetails | undefined = undefined;
    if (category === 'livestock') {
      const mappedAnimalType: any = 
        animalType === 'cattle' ? (livestockPurpose === 'dairy' ? 'dairy_cow' : 'beef_cattle') :
        animalType;

      const mappedAgeUnit = ageUnit === 'weeks' ? 'days' : ageUnit;
      const mappedAgeValue = ageUnit === 'weeks' ? (Number(ageValue) || 1) * 7 : (Number(ageValue) || 1);
      const mappedSex = livestockSex === 'mixed' ? 'mixed_batch' : livestockSex;
      const mappedPurpose: any = 
        livestockPurpose === 'dairy' ? 'milk' :
        livestockPurpose === 'dual' ? 'dual_purpose' :
        livestockPurpose === 'broiler' ? 'meat' :
        livestockPurpose === 'pets' ? 'breeding' :
        livestockPurpose;

      livestockObj = {
        animalType: mappedAnimalType,
        breed: livestockBreed || varietyOrBreed || 'Improved Breed',
        ageValue: mappedAgeValue,
        ageUnit: mappedAgeUnit,
        sex: mappedSex,
        purpose: mappedPurpose,
        healthStatus: 'Excellent - Certified Healthy',
        vaccinations: [
          {
            vaccineName: vaccinationStatus || 'Standard Vet Vaccination Protocol',
            dateAdministered: '2026-10-01',
            verifiedByVet: true,
            vetName: 'Dr. Kiprono, Registered Veterinary Officer (KVB)'
          }
        ],
        weightKg: currentWeightKg ? Number(currentWeightKg) : undefined,
        milkYieldLitersPerDay: dailyMilkYieldLiters ? Number(dailyMilkYieldLiters) : undefined,
      };
    }

    const newProduct = agriStore.addProduct({
      title: title.trim(),
      description: description.trim() || `${varietyOrBreed || productType} produced by verified farmer in ${county} County. Quality inspected and ready for delivery or farmgate pickup.`,
      category,
      subcategory: category === 'crops' ? 'Cereals & Produce' : category === 'livestock' ? 'Livestock' : 'Farm Inputs',
      productType,
      variety: varietyOrBreed.trim() || undefined,
      priceKsh: Number(priceKsh),
      unit,
      quantityAvailable: Number(quantity),
      minimumOrder: 1,
      sellerId: currentUser?.id || 'usr-farmer-01',
      sellerName: currentUser?.name || 'Verified Kenyan Producer',
      sellerPhone: currentUser?.phone || '0722123456',
      sellerCounty: county,
      sellerSubCounty: subCounty,
      images: [finalImage],
      isVerifiedSeller: true,
      rating: 5.0,
      reviewsCount: 1,
      deliveryOptions: ['pickup', 'carrier_dispatch'],
      status: 'active',
      livestockDetails: livestockObj,
    });

    // Also attempt server sync in background
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    }).catch(err => console.warn('Product server sync fallback to local storage:', err));

    onSuccess(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E2E7DE] relative animate-in fade-in duration-200">
        
        {/* Header & Step Tracker */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E7DE] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3ED] text-[#214E34] flex items-center justify-center border border-[#CFD7CA] shadow-2xs">
              <Store className="w-5 h-5 text-[#367C46]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#214E34]">
                Sell on SMART-AGRI Kenya Marketplace
              </h2>
              <p className="text-xs text-[#68756A]">
                Step {step} of 3: {step === 1 ? 'Select Category' : step === 2 ? 'Listing Specifications' : 'Live Preview & Publish'}
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

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Select Category */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#252D27] font-semibold">
              What agricultural product would you like to list for sale?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectCategory('crops')}
                className={`p-4 rounded-xl border text-left flex flex-col items-start gap-2.5 transition cursor-pointer hover:border-[#367C46] hover:bg-[#F7F6F0] ${
                  category === 'crops' ? 'border-[#367C46] bg-[#EBF3ED] ring-1 ring-[#367C46]' : 'border-[#E2E7DE] bg-white'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#EBF3ED] text-[#214E34] flex items-center justify-center border border-[#CFD7CA]">
                  <Sprout className="w-5 h-5 text-[#367C46]" />
                </div>
                <div>
                  <span className="block font-bold text-xs text-[#214E34]">Crops & Produce</span>
                  <span className="text-[11px] text-[#68756A] leading-tight">
                    Maize, beans, potatoes, wheat, rice, vegetables, avocados, fruits
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectCategory('livestock')}
                className={`p-4 rounded-xl border text-left flex flex-col items-start gap-2.5 transition cursor-pointer hover:border-[#367C46] hover:bg-[#F7F6F0] ${
                  category === 'livestock' ? 'border-[#367C46] bg-[#EBF3ED] ring-1 ring-[#367C46]' : 'border-[#E2E7DE] bg-white'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#EBF3ED] text-[#214E34] flex items-center justify-center border border-[#CFD7CA]">
                  <Beef className="w-5 h-5 text-[#367C46]" />
                </div>
                <div>
                  <span className="block font-bold text-xs text-[#214E34]">Livestock & Dairy</span>
                  <span className="text-[11px] text-[#68756A] leading-tight">
                    Cattle, dairy cows, Kienyeji chickens, goats, sheep, pigs, eggs, milk
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectCategory('inputs')}
                className={`p-4 rounded-xl border text-left flex flex-col items-start gap-2.5 transition cursor-pointer hover:border-[#367C46] hover:bg-[#F7F6F0] ${
                  category === 'inputs' ? 'border-[#367C46] bg-[#EBF3ED] ring-1 ring-[#367C46]' : 'border-[#E2E7DE] bg-white'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#EBF3ED] text-[#214E34] flex items-center justify-center border border-[#CFD7CA]">
                  <Package className="w-5 h-5 text-[#367C46]" />
                </div>
                <div>
                  <span className="block font-bold text-xs text-[#214E34]">Farm Inputs & Tools</span>
                  <span className="text-[11px] text-[#68756A] leading-tight">
                    Certified seeds, fertilizers, feeds, agrochemicals, irrigation kits
                  </span>
                </div>
              </button>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#367C46] hover:bg-[#2B6437] text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Continue to Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Category-Specific Details Form */}
        {step === 2 && (
          <form onSubmit={handleValidateAndProceedToPreview} className="space-y-4 max-h-[68vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between bg-[#F7F6F0] p-2.5 rounded-lg border border-[#E2E7DE]">
              <span className="text-xs font-semibold text-[#252D27]">
                Listing in Category: <strong className="text-[#214E34] uppercase">{category}</strong>
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#367C46] hover:underline font-semibold"
              >
                Change Category
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-[#252D27] mb-1">
                Listing Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  category === 'crops'
                    ? 'e.g. Dry Seed Maize H614 - Ready for Milling or Seed'
                    : category === 'livestock'
                    ? 'e.g. Vaccinated KALRO Improved Kienyeji Growers (5.5 Months)'
                    : 'e.g. Certified Seed Maize H614D - 2kg Sealed Packets'
                }
                className="w-full bg-white border border-[#E2E7DE] text-[#252D27] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
              />
            </div>

            {/* Category-Specific Form Fields */}
            {category === 'crops' && (
              <div className="space-y-3 bg-[#F7F6F0] p-3.5 rounded-xl border border-[#E2E7DE]">
                <h4 className="text-xs font-bold text-[#214E34] uppercase tracking-wide">
                  Crop & Produce Specifics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Crop Type</label>
                    <input
                      type="text"
                      required
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      placeholder="Maize, Beans, Wheat, Potato"
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Variety</label>
                    <input
                      type="text"
                      value={varietyOrBreed}
                      onChange={(e) => setVarietyOrBreed(e.target.value)}
                      placeholder="H614, Nyayo, Shangi, Cavendish"
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Quality Grade</label>
                    <select
                      value={cropGrade}
                      onChange={(e: any) => setCropGrade(e.target.value)}
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="Grade 1">Grade 1 (Premium)</option>
                      <option value="Grade 2">Grade 2 (Commercial)</option>
                      <option value="Standard">Standard Farmgate</option>
                      <option value="Export">Export Quality</option>
                      <option value="Organic">Organic Certified</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Harvest / Availability Date</label>
                    <input
                      type="date"
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Packaging / Container</label>
                    <input
                      type="text"
                      value={packagingType}
                      onChange={(e) => setPackagingType(e.target.value)}
                      placeholder="90kg Gunny Bag, Wooden Crate, Net Bag"
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {category === 'livestock' && (
              <div className="space-y-3 bg-[#F7F6F0] p-3.5 rounded-xl border border-[#E2E7DE]">
                <h4 className="text-xs font-bold text-[#214E34] uppercase tracking-wide">
                  Livestock & Animal Specifics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Animal Type</label>
                    <select
                      value={animalType}
                      onChange={(e: any) => {
                        setAnimalType(e.target.value);
                        setProductType(e.target.value);
                      }}
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                    >
                      <option value="chicken">Chicken / Poultry</option>
                      <option value="cattle">Cattle / Dairy Cows</option>
                      <option value="goat">Goat</option>
                      <option value="sheep">Sheep</option>
                      <option value="pig">Pig</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="fish">Fish / Fingerlings</option>
                      <option value="other">Eggs / Milk / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Breed</label>
                    <input
                      type="text"
                      required
                      value={livestockBreed}
                      onChange={(e) => setLivestockBreed(e.target.value)}
                      placeholder="e.g. Kienyeji, Friesian, Boer"
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Age Value & Unit</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={ageValue}
                        onChange={(e) => setAgeValue(e.target.value)}
                        placeholder="5.5"
                        className="w-16 bg-white border border-[#E2E7DE] text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                      />
                      <select
                        value={ageUnit}
                        onChange={(e: any) => setAgeUnit(e.target.value)}
                        className="flex-1 bg-white border border-[#E2E7DE] text-[11px] rounded-lg px-1 py-1.5 focus:outline-none"
                      >
                        <option value="days">days</option>
                        <option value="weeks">weeks</option>
                        <option value="months">months</option>
                        <option value="years">years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Sex</label>
                    <select
                      value={livestockSex}
                      onChange={(e: any) => setLivestockSex(e.target.value)}
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="mixed">Mixed / Flock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Primary Purpose</label>
                    <select
                      value={livestockPurpose}
                      onChange={(e: any) => setLivestockPurpose(e.target.value)}
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                    >
                      <option value="dairy">Dairy / Milk</option>
                      <option value="beef">Beef / Meat</option>
                      <option value="eggs">Egg Production</option>
                      <option value="breeding">Breeding & Genetics</option>
                      <option value="broiler">Broiler Table Birds</option>
                      <option value="dual">Dual Purpose</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Vaccination & Health Status</label>
                    <input
                      type="text"
                      value={vaccinationStatus}
                      onChange={(e) => setVaccinationStatus(e.target.value)}
                      placeholder="e.g. Vaccinated for Newcastle & Gumboro; Dewormed"
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {category === 'inputs' && (
              <div className="space-y-3 bg-[#F7F6F0] p-3.5 rounded-xl border border-[#E2E7DE]">
                <h4 className="text-xs font-bold text-[#214E34] uppercase tracking-wide">
                  Farm Inputs & Technical Specs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Input Subcategory</label>
                    <select
                      value={inputCategory}
                      onChange={(e: any) => setInputCategory(e.target.value)}
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                    >
                      <option value="seed">Certified Seeds</option>
                      <option value="fertilizer">Fertilizers & Soil Conditioners</option>
                      <option value="agrochem">Agrochemicals & Crop Protection</option>
                      <option value="feed">Animal Feed & Mineral Supplements</option>
                      <option value="irrigation">Irrigation Kits & Pipes</option>
                      <option value="equipment">Farm Tools & Equipment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Brand / Manufacturer</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Kenya Seed, Yara, Unga Feeds"
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Package Size / Model</label>
                    <input
                      type="text"
                      value={packageSize}
                      onChange={(e) => setPackageSize(e.target.value)}
                      placeholder="e.g. 2kg pack, 50kg bag, 1 Liter"
                      className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#252D27] mb-1">Regulatory Approval / Batch</label>
                  <input
                    type="text"
                    value={regulatoryApproval}
                    onChange={(e) => setRegulatoryApproval(e.target.value)}
                    placeholder="e.g. KEPHIS Certified / PCPB Registration # / KEBS standard"
                    className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Price, Units, Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">
                  Price (KSh) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={priceKsh}
                  onChange={(e) => setPriceKsh(e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full bg-white border border-[#E2E7DE] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">
                  Pricing Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. 90kg bag, bird, head, packet"
                  className="w-full bg-white border border-[#E2E7DE] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">
                  Available Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-white border border-[#E2E7DE] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">County Location</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full bg-white border border-[#E2E7DE] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.name} County</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252D27] mb-1">Sub-County / Area</label>
                <input
                  type="text"
                  value={subCounty}
                  onChange={(e) => setSubCounty(e.target.value)}
                  placeholder="e.g. Rongai, Njoro, Kikuyu, Eldoret West"
                  className="w-full bg-white border border-[#E2E7DE] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />
              </div>
            </div>

            {/* Image Upload or URL */}
            <div>
              <label className="block text-xs font-bold text-[#252D27] mb-1">
                Product Image (Upload Photo or Paste URL)
              </label>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EBF3ED] hover:bg-[#DCECE0] text-[#214E34] text-xs font-semibold border border-[#CFD7CA] cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 text-[#367C46]" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setImageUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[11px] text-[#68756A]">or enter URL:</span>
                </div>

                <input
                  type="url"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (Leave blank for verified category photography)"
                  className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46]"
                />

                {imageUrl && (
                  <div className="relative inline-block mt-1">
                    <img
                      src={imageUrl}
                      alt="Uploaded preview"
                      className="w-20 h-20 object-cover rounded-lg border border-[#CFD7CA]"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 cursor-pointer shadow-xs"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#252D27] mb-1">
                Description & Farm Notes
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details on origin, moisture content, health condition, or feeding regimen..."
                className="w-full bg-white border border-[#E2E7DE] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#367C46] resize-none"
              />
            </div>

            {/* Step 2 Actions */}
            <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-xs font-semibold hover:bg-[#F7F6F0] flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Live Preview Before Publishing</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Live Preview Before Publishing */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] p-3 rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#367C46] shrink-0" />
              <p className="text-xs font-semibold">
                Please review your agricultural listing exactly as buyers will see it across SMART-AGRI Kenya.
              </p>
            </div>

            {/* Mock Card Preview */}
            <div className="bg-white rounded-xl border border-[#E2E7DE] overflow-hidden shadow-sm max-w-sm mx-auto">
              <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                <img
                  src={getDisplayImage()}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-[#214E34]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {category}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-white/95 text-[#214E34] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#367C46]" /> Verified Farmer
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#68756A]">
                  <MapPin className="w-3 h-3 text-[#367C46]" />
                  <span>{subCounty}, {county} County</span>
                </div>

                <h3 className="font-bold text-[#214E34] text-sm leading-snug line-clamp-2">
                  {title}
                </h3>

                {category === 'livestock' && (
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="bg-[#EBF3ED] text-[#214E34] px-1.5 py-0.5 rounded font-semibold">
                      {ageValue} {ageUnit}
                    </span>
                    <span className="bg-[#F7F6F0] text-[#68756A] px-1.5 py-0.5 rounded capitalize">
                      {livestockSex}
                    </span>
                    <span className="bg-[#F7F6F0] text-[#68756A] px-1.5 py-0.5 rounded capitalize">
                      {livestockPurpose}
                    </span>
                  </div>
                )}

                {category === 'crops' && (
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="bg-[#EBF3ED] text-[#214E34] px-1.5 py-0.5 rounded font-semibold">
                      {cropGrade}
                    </span>
                    <span className="bg-[#F7F6F0] text-[#68756A] px-1.5 py-0.5 rounded">
                      {packagingType}
                    </span>
                  </div>
                )}

                {category === 'inputs' && brand && (
                  <div className="text-[11px] text-[#68756A]">
                    Brand: <strong className="text-[#252D27]">{brand}</strong> ({packageSize})
                  </div>
                )}

                <div className="pt-2 border-t border-[#E2E7DE] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#68756A] block">Asking Price</span>
                    <span className="text-base font-black text-[#214E34]">
                      KSh {Number(priceKsh).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#68756A] ml-1">/{unit}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#68756A]">
                    {quantity} {unit}s in stock
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="pt-3 border-t border-[#E2E7DE] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg border border-[#E2E7DE] text-xs font-semibold hover:bg-[#F7F6F0] flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={handlePublishListing}
                className="px-6 py-2.5 rounded-lg bg-[#367C46] hover:bg-[#2B6437] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Listing to Marketplace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
