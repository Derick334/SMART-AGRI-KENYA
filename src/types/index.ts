/**
 * SMART-AGRI KENYA - Core Data Types & Interfaces
 */

export type UserRole = 'farmer' | 'buyer' | 'transporter' | 'expert' | 'lab' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  county: string;
  subCounty?: string;
  ward?: string;
  farmName?: string;
  farmSizeAcres?: number;
  idNumber?: string;
  isVerified: boolean;
  avatarUrl?: string;
  joinedDate: string;
}

export type ProductCategory = 
  | 'crops' 
  | 'livestock' 
  | 'inputs' 
  | 'equipment' 
  | 'fodder' 
  | 'seedlings';

export type ProductCondition = 'new' | 'used' | 'certified' | 'reconditioned';

export type MarketplaceCategoryFilter = 'all' | 'crops' | 'livestock' | 'inputs' | 'equipment';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  subcategory: string;
  productType?: string; // e.g. Cereals, Legumes, Cattle, Poultry, Inorganic Fertilizers, Sprayers, etc.
  variety?: string; // e.g. H614, Rosecoco, Shangi, Anna F1, Hass
  breed?: string; // e.g. Friesian, Ayrshire, Kienyeji, Kenbro, Galla, Dorper
  model?: string; // for equipment e.g. 20L 2-Stroke, 16mm UV Button
  brand?: string; // e.g. Kenya Seed Company, Simlaw, Unganex, Stihl
  condition?: ProductCondition;
  formulation?: string; // e.g. DAP 18:46:0, CAN 26% N, 16% Crude Protein
  packageSize?: string; // e.g. 2kg packet, 50kg bag, 70kg bag
  certificationInfo?: string; // e.g. KEPHIS Certified, KEBS Standard
  priceKsh: number;
  unit: string; // 'kg', '90kg bag', 'crate', 'litre', 'bunch', 'piece', 'head'
  quantityAvailable: number;
  minimumOrder: number;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerCounty: string;
  sellerSubCounty: string;
  images: string[];
  isVerifiedSeller: boolean;
  rating: number;
  reviewsCount: number;
  deliveryOptions: ('pickup' | 'direct_delivery' | 'carrier_dispatch')[];
  status: 'active' | 'sold_out' | 'paused' | 'pending_approval';
  isDemo?: boolean;
  createdAt: string;
  powerSource?: 'Manual' | 'Petrol' | 'Diesel' | 'Solar' | 'Electric' | 'PTO / Tractor Driven';
  capacity?: string;
  animalType?: 'Cattle' | 'Goats' | 'Sheep' | 'Poultry' | 'Pigs' | 'Rabbits' | 'Fish' | 'Other livestock';
  cattlePurpose?: 'Dairy' | 'Beef' | 'Dual-purpose';
  // Specific for livestock
  livestockDetails?: LivestockDetails;
}

export type LivestockType = 
  | 'dairy_cow' 
  | 'beef_cattle' 
  | 'bull' 
  | 'heifer' 
  | 'calf' 
  | 'chicken' 
  | 'goat' 
  | 'sheep' 
  | 'pig' 
  | 'rabbit' 
  | 'duck' 
  | 'turkey' 
  | 'fish' 
  | 'bees';

export interface VaccinationRecord {
  vaccineName: string;
  dateAdministered: string;
  verifiedByVet: boolean;
  vetName?: string;
}

export interface LivestockDetails {
  animalType: LivestockType;
  breed: string; // e.g. Friesian, Ayrshire, Jersey, Boran, Sahiwal, Kienyeji, Kuroiler, Kenbro, Boer, Dorper
  ageValue: number;
  ageUnit: 'days' | 'months' | 'years';
  sex: 'female' | 'male' | 'mixed_batch';
  purpose: 'milk' | 'beef' | 'breeding' | 'eggs' | 'meat' | 'honey' | 'dual_purpose';
  milkYieldLitersPerDay?: number;
  eggYieldPerWeek?: number;
  weightKg?: number;
  lactationStage?: string; // '1st lactation', '2nd lactation', 'in calf', 'open'
  healthStatus: 'Excellent - Certified Healthy' | 'Good' | 'Veterinary Cleared';
  vaccinations: VaccinationRecord[];
  earTagNumber?: string;
  batchSize?: number;
  feedRegime?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedDelivery: 'pickup' | 'delivery';
  shippingCostKsh: number;
  carrierType?: string;
}

export interface DeliveryQuote {
  originCounty: string;
  destinationCounty: string;
  distanceKm: number;
  estimatedTransitHours: number;
  vehicleType: string;
  baseFareKsh: number;
  weightSurchargeKsh: number;
  totalFreightKsh: number;
  notes: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  category: ProductCategory;
  unit: string;
  quantity: number;
  unitPriceKsh: number;
  totalPriceKsh: number;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  selectedDelivery: 'pickup' | 'delivery';
  shippingCostKsh: number;
  image: string;
}

export interface OrderTrackingStep {
  status: 'placed' | 'confirmed' | 'dispatched' | 'in_transit' | 'delivered';
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryCounty: string;
  deliveryTown: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotalKsh: number;
  shippingTotalKsh: number;
  grandTotalKsh: number;
  paymentMethod: 'mpesa' | 'cash_on_delivery' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  mpesaReceiptNumber?: string;
  mpesaCheckoutRequestId?: string;
  orderStatus: 'pending' | 'seller_confirmed' | 'transporter_assigned' | 'in_transit' | 'delivered' | 'cancelled';
  transporterDetails?: {
    name: string;
    phone: string;
    vehiclePlate: string;
    vehicleType: string;
  };
  trackingSteps: OrderTrackingStep[];
  createdAt: string;
}

export interface SoilTestRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  county: string;
  subCounty: string;
  fieldName: string;
  farmSizeAcres: number;
  intendedCrop: string;
  previousCrop?: string;
  previousFertilizer?: string;
  submissionMethod: 'drop_at_lab' | 'courier_dispatch' | 'field_agent_sampling';
  labId: string;
  labName: string;
  status: 'submitted' | 'sample_received' | 'analysis_running' | 'completed';
  sampleCode: string;
  requestedAt: string;
  result?: SoilTestResult;
}

export interface SoilTestResult {
  ph: number;
  phClassification: 'Extremely Acidic' | 'Moderately Acidic' | 'Optimal (Neutral)' | 'Alkaline';
  nitrogenPercent: number; // e.g. 0.18%
  phosphorusPpm: number; // e.g. 15 ppm
  potassiumPpm: number; // e.g. 180 ppm
  organicMatterPercent: number; // e.g. 2.8%
  soilTexture: 'Clay Loam' | 'Sandy Loam' | 'Red Volcanic Clay' | 'Silt Loam';
  salinityEc: number; // dS/m
  suitabilityScore: number; // 0-100%
  limeRequirementKgPerAcre: number;
  recommendedBasalFertilizer: string;
  recommendedTopDressing: string;
  organicRemedies: string[];
  agronomistNotes: string;
  labOfficerName: string;
  reportPdfUrl?: string;
}

export interface PestProblemReference {
  id: string;
  targetType: 'crop' | 'livestock';
  targetHost: string; // e.g. 'Maize', 'Tomato', 'Dairy Cattle', 'Indigenous Chicken'
  commonName: string;
  scientificName: string;
  category: 'pest' | 'fungal' | 'bacterial' | 'viral' | 'tick_borne' | 'nutritional';
  symptoms: string[];
  severity: 'Moderate' | 'High' | 'Severe Quarantine Risk';
  pcpbApprovedActives: {
    activeIngredient: string;
    tradeExamples: string;
    targetStage: string;
    phiDays: number;
    ppeRequirement: string;
  }[];
  culturalControls: string[];
  vetAlertNote?: string;
}

export interface MarketPriceRecord {
  id: string;
  commodityName: string;
  category: 'Cereals' | 'Legumes' | 'Vegetables' | 'Fruits' | 'Roots & Tubers' | 'Livestock & Meat' | 'Dairy & Poultry';
  variety: string;
  marketName: string;
  county: string;
  wholesalePriceKsh: number;
  retailPriceKsh: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  source: string;
  verifiedAt: string;
  isIndicative: boolean;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorCounty: string;
  title: string;
  content: string;
  category: 'General Farming' | 'Dairy & Livestock' | 'Crop Protection' | 'Market & Pricing' | 'Smart Irrigation';
  likes: number;
  repliesCount: number;
  isVerifiedFarmer: boolean;
  createdAt: string;
}

export interface ExpertProfile {
  id: string;
  name: string;
  title: string;
  specialization: 'Agronomist' | 'Veterinary Surgeon' | 'Soil Scientist' | 'Post-Harvest Specialist' | 'Agribusiness Advisor';
  institution: string; // e.g., KALRO, University of Nairobi, Ministry of Agriculture
  licenseNumber: string;
  county: string;
  rating: number;
  consultationsCompleted: number;
  consultationFeeKsh: number;
  availability: 'Available Today' | 'Book in Advance';
  languages: string[];
  photoUrl: string;
}

export interface TransporterPartner {
  id: string;
  companyName: string;
  driverName: string;
  phone: string;
  countyBase: string;
  fleetType: 'Boda Boda Courier' | 'Probox / Small Van' | '3-Tonne Canter' | '10-Tonne Truck' | 'Refrigerated Cold-Chain' | 'Specialized Livestock Carrier';
  capacityKg: number;
  ratePerKmKsh: number;
  isVetted: boolean;
  liveStatus: 'Active' | 'On Delivery' | 'Off Duty';
}

export interface AdminStats {
  totalUsers: number;
  verifiedFarmers: number;
  activeListings: number;
  pendingApprovals: number;
  totalOrders: number;
  totalVolumeKsh: number;
  openDisputes: number;
  soilTestsCompleted: number;
}
