/**
 * SMART-AGRI KENYA - Core Data Types & Interfaces
 */

export type UserRole = 
  | 'farmer' 
  | 'expert'
  | 'agribusiness'
  | 'student'
  | 'cooperative'
  | 'extension'
  | 'buyer' 
  | 'seller' 
  | 'consultant' 
  | 'veterinarian' 
  | 'transporter' 
  | 'lab' 
  | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  county: string;
  subCounty?: string;
  ward?: string;
  town?: string;
  farmName?: string;
  farmSizeAcres?: number;
  farmingActivities?: string[];
  cropsGrown?: string[];
  livestockKept?: string[];
  farmLocation?: string;
  qualifications?: string;
  areasOfExpertise?: string[];
  yearsOfExperience?: number;
  professionalBio?: string;
  supportingDocuments?: string[];
  businessName?: string;
  businessType?: string;
  businessLocation?: string;
  productsAndServices?: string[];
  institution?: string;
  researchFocus?: string;
  academicProgram?: string;
  studentId?: string;
  organizationName?: string;
  organizationCategory?: string;
  registrationNumber?: string;
  numberOfMembers?: number;
  representativeName?: string;
  extensionStation?: string;
  employerMinistry?: string;
  specialization?: string;
  designation?: string;
  licenseNumber?: string;
  nationalIdNumber?: string;
  kraPin?: string;
  verifiedBadges?: string[];
  status?: 'active' | 'pending_verification' | 'suspended' | 'pending' | 'rejected';
  lastLogin?: string;
  isVerified: boolean;
  avatarUrl?: string;
  joinedDate: string;
  membershipCode?: string;
  memberId?: string;
  membershipTier?: 'Standard' | 'Silver' | 'Gold' | 'Platinum' | 'Cooperative';
  cooperativeAffiliation?: string;
  qrCodeData?: string;
  isMainSuperAdmin?: boolean;
  adminPermissions?: AdminPermissions;
}

export interface AdminPermissions {
  manageUsers: boolean;
  manageAdmins: boolean;
  manageMarketplace: boolean;
  manageOrders: boolean;
  managePayments: boolean;
  manageContent: boolean;
  manageBranding: boolean;
  manageDelivery: boolean;
  manageSettings: boolean;
  viewReports: boolean;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin';
  isMainSuperAdmin: boolean;
  permissions: AdminPermissions;
  status: 'active' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  appointedBy?: string;
}

export interface PlatformBranding {
  platformName: string;
  logoUrl: string;
  emblemUrl: string;
  heroBannerUrl: string;
  primaryColor: string;
  secondaryColor: string;
  supportPhone: string;
  supportEmail: string;
  headquartersAddress: string;
}

export interface DeliverySettings {
  baseFeeKsh: number;
  perKmRateKsh: number;
  expressSurchargeKsh: number;
  freeDeliveryThresholdKsh: number;
  countyRates: Record<string, number>;
  activeCarriers: string[];
}

export interface PlatformGovernanceSettings {
  allowPublicRegistrations: boolean;
  requireKycForSellers: boolean;
  maintenanceMode: boolean;
  maintenanceNotice: string;
  lowStockAlertThreshold: number;
  orderEscrowAutoReleaseDays: number;
  enableDisputeArbitration: boolean;
}

export interface MembershipVerificationResult {
  code: string;
  isValid: boolean;
  status?: 'active' | 'pending_verification' | 'suspended' | 'pending' | 'rejected';
  role?: UserRole;
  county?: string;
  membershipTier?: string;
  verifiedAt: string;
  notes?: string;
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
  regulatoryApproval?: string; // e.g. KEPHIS Certified, PCPB Registration #, KEBS Standard
  qualityGrade?: string; // e.g. Grade 1, Grade 2, Organic, Export
  packagingType?: string; // e.g. 90kg gunny bag, net bag, wooden crate
  harvestDate?: string; // e.g. 2026-10-15
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

export type MarketPriceType = 
  | 'verified_observation' 
  | 'seller_asking_price' 
  | 'historical_price' 
  | 'estimated_price';

export interface MarketPriceRecord {
  id: string;
  commodityName: string;
  category: 'Cereals' | 'Legumes' | 'Vegetables' | 'Fruits' | 'Roots & Tubers' | 'Livestock & Meat' | 'Dairy & Poultry' | 'Farm Inputs';
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
  priceType?: MarketPriceType;
  previousPriceKsh?: number;
  observationDate?: string;
  notes?: string;
}

export interface ProductInquiry {
  id: string;
  productId: string;
  productTitle: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  message: string;
  requestedQuantity?: number;
  deliveryPreference?: 'pickup' | 'delivery';
  status: 'pending' | 'replied' | 'closed';
  createdAt: string;
}

export interface ProductReport {
  id: string;
  productId: string;
  productTitle: string;
  reporterId: string;
  reporterName: string;
  reason: 'counterfeit' | 'wrong_price' | 'unverified_claims' | 'unresponsive_seller' | 'offensive_content' | 'other';
  details: string;
  status: 'pending_review' | 'resolved' | 'dismissed';
  createdAt: string;
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

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  target: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ipAddress?: string;
}

export interface ConsultationBooking {
  id: string;
  expertId: string;
  expertName: string;
  expertType: 'Agronomist' | 'Veterinarian';
  clientName: string;
  clientPhone: string;
  clientCounty: string;
  topic: string;
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  feeKsh: number;
  notes?: string;
  prescriptionOrAdvice?: string;
}

export interface ConsultationNoteRecord {
  id: string;
  expertName: string;
  expertTitle: string;
  institution: string;
  county: string;
  date: string;
  cropOrLivestock: string;
  farmChallenge: string;
  prescriptionOrAdvice: string;
  actionItems: string[];
  followUpDate: string;
  contactPhone: string;
  savedOffline?: boolean;
}

// ==========================================
// UPGRADED AGRICULTURAL INTELLIGENCE TYPES
// ==========================================

export interface SoilAnalysisInput {
  county: string;
  subCounty?: string;
  farmLocation?: string;
  crop: string;
  soilType?: string;
  soilPh?: number;
  moisturePercent?: number;
  nitrogenPercent?: number;
  phosphorusPpm?: number;
  potassiumPpm?: number;
  organicCarbonPercent?: number;
  salinityEc?: number;
  fertilizerHistory?: string;
  recentAmendments?: string;
  observedSymptoms?: string[];
  photoUrl?: string;
  fieldSizeAcres?: number;
  farmerId?: string;
  labResults?: {
    nitrogenPercent?: number;
    phosphorusPpm?: number;
    potassiumCmolKg?: number;
    organicCarbonPercent?: number;
    salinityECdsPerM?: number;
  };
}

export interface SoilAnalysisReport {
  id: string;
  createdAt: string;
  farmerId?: string;
  input: SoilAnalysisInput;
  cropName: string;
  phAnalysis: {
    value?: number;
    rating: 'Extremely Acidic' | 'Moderately Acidic' | 'Optimal' | 'Alkaline' | 'Unmeasured';
    optimalRange: string;
    impactExplanation: string;
    limeRequiredKgPerAcre: number;
  };
  nutrientStatuses: {
    nutrient: 'N' | 'P' | 'K' | 'Organic Carbon' | 'Salinity';
    measuredValue?: string;
    status: 'Deficient' | 'Low' | 'Optimal' | 'Excessive' | 'Unmeasured (Visual Estimate)';
    explanation: string;
  }[];
  fertilizerPlan: {
    areaTreated: string;
    assumptions: string;
    basalFertilizer: {
      product: string;
      rateKgPerAcre: number;
      applicationTiming: string;
      notes: string;
    };
    topDressing: {
      product: string;
      rateKgPerAcre: number;
      applicationTiming: string;
      notes: string;
    };
    organicRemedies: string[];
  };
  laboratoryVerificationRequired: boolean;
  confidenceScore: 'Verified Measurements' | 'Symptom-Based Estimate';
  recommendedNextSteps: string[];
}

export interface IrrigationInput {
  county: string;
  crop: string;
  growthStage: 'initial' | 'vegetative' | 'flowering' | 'fruiting' | 'maturity';
  soilType: string;
  fieldAreaAcres: number;
  irrigationMethod: 'drip' | 'sprinkler' | 'furrow';
  waterSource: string;
  flowRateLitersPerHour?: number;
  measuredSoilMoisturePercent?: number;
  soilTensiometerCbar?: number;
}

export interface IrrigationScheduleReport {
  id: string;
  createdAt: string;
  input: IrrigationInput;
  referenceEt0MmPerDay: number;
  cropCoefficientKc: number;
  netCropWaterDemandMmPerDay: number;
  effectiveRainfallMmPerDay: number;
  irrigationNeeded: boolean;
  systemEfficiencyPercent: number;
  grossWaterRequirementMm: number;
  waterVolumeTotalLiters: number;
  waterVolumeM3: number;
  recommendedDurationHours: number;
  recommendedDurationMinutes: number;
  irrigationTimingAdvice: string;
  weatherAlert?: {
    type: 'rain_hold' | 'heat_warning' | 'waterlogging_risk' | 'favorable';
    message: string;
  };
  waterConservationTips: string[];
  drainageAdvice: string;
  isEstimate: boolean;
  calculationMethod: string;
}

export interface PestDiagnosisSubmission {
  targetType: 'crop' | 'livestock';
  cropOrAnimal: string;
  county: string;
  farmLocation?: string;
  growthStageOrAge?: string;
  symptoms: string;
  onsetDaysAgo?: number;
  isSpreading?: boolean;
  recentSpraysOrTreatments?: string;
  photoBase64?: string;
  imageBase64?: string;
  photoUrl?: string;
}

export interface PestDiagnosisReport {
  id: string;
  createdAt: string;
  farmerId?: string;
  targetType: 'crop' | 'livestock';
  targetHost: string;
  symptomsSubmitted: string;
  imageProvided: boolean;
  isImageClear: boolean;
  preliminaryAssessmentNote: string;
  primaryDiagnosis: {
    name: string;
    scientificName?: string;
    confidence: 'High' | 'Moderate' | 'Low';
    confidencePercent: number;
    category: 'pest' | 'fungal' | 'bacterial' | 'viral' | 'deficiency' | 'unclear';
    visualEvidence: string[];
  };
  differentialDiagnoses: {
    name: string;
    confidencePercent: number;
    distinguishingFeatures: string;
  }[];
  integratedPestManagement: {
    culturalPhysicalControls: string[];
    biologicalControls: string[];
    pcpbAuthorizedChemicals: {
      activeIngredient: string;
      tradeExamples: string;
      targetStage: string;
      phiDays: number;
      ppeRequirement: string;
      environmentalPrecautions: string;
    }[];
  };
  professionalReferralRequired: boolean;
  followUpPhotos?: {
    id: string;
    photoUrl: string;
    date: string;
    notes: string;
    status: 'improving' | 'unchanged' | 'worsened';
  }[];
}

export interface AiTelemetryMetric {
  id: string;
  timestamp: string;
  queryType: 'farming_advisory' | 'pest_diagnosis' | 'soil_analysis' | 'irrigation';
  modelUsed: string;
  latencyMs: number;
  wasCacheHit: boolean;
  tokensUsed?: number;
  status: 'SUCCESS' | 'FALLBACK_OFFLINE' | 'ERROR';
}

export interface AiFeedbackReport {
  id: string;
  timestamp: string;
  farmerEmail: string;
  farmerQuery: string;
  aiResponseText: string;
  feedbackType: 'inaccurate_advice' | 'helpful' | 'missing_kenya_context' | 'chemical_safety_concern';
  notes: string;
  status: 'pending_review' | 'resolved';
}

export type ChatModelTier = 'gemini-3.1-flash-lite' | 'gemini-3.8-flash' | 'gemini-4-argon';

export type ChatbotRole = 'agronomist' | 'veterinarian' | 'soil_scientist' | 'market_analyst';

export type GroundingMode = 'auto' | 'search' | 'maps' | 'none';

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunkMap {
  uri: string;
  title: string;
  snippets?: string[];
}

export interface MultiTurnChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: ChatModelTier | string;
  roleId?: ChatbotRole;
  groundingType?: 'search' | 'maps' | 'none' | 'rag';
  searchSources?: GroundingChunkWeb[];
  mapSources?: GroundingChunkMap[];
  searchQueries?: string[];
  citations?: Array<{ title: string; organization: string; citationCode: string; year: number }>;
  latencyMs?: number;
  isStreaming?: boolean;
  error?: string;
}

// ==========================================
// Agricultural Management Models (Part F)
// ==========================================

export interface CropRecord {
  id: string;
  farmerId: string;
  name: string;
  variety: string;
  acreage: number;
  plantingDate: string;
  expectedHarvestDate: string;
  currentStage: 'Land Prep' | 'Germination' | 'Vegetative' | 'Flowering' | 'Maturity' | 'Harvested';
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Under Pest Treatment';
  estimatedYieldBags: number;
  soilPh?: number;
  notes?: string;
}

export interface LivestockRecord {
  id: string;
  farmerId: string;
  category: 'Cattle' | 'Goat' | 'Sheep' | 'Poultry' | 'Pig' | 'Beekeeping';
  breed: string;
  count: number;
  tagNumbers?: string[];
  purpose: 'Dairy' | 'Beef' | 'Egg Production' | 'Broiler Meat' | 'Breeding Stock';
  healthStatus: 'Vaccinated & Healthy' | 'Under Observation' | 'Treatment Required';
  lastVaccinationDate?: string;
  dailyProduction?: string; // e.g. "28 Litres/day" or "180 Eggs/day"
  notes?: string;
}

export interface PlantingScheduleRecord {
  id: string;
  farmerId: string;
  seasonName: string; // e.g. "2026 Long Rains"
  cropName: string;
  targetAcreage: number;
  landPrepDate: string;
  plantingWindow: string;
  basalFertilizer: string;
  topDressingWindow: string;
  projectedHarvest: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface HarvestRecord {
  id: string;
  farmerId: string;
  cropName: string;
  harvestDate: string;
  harvestedAcreage: number;
  quantity: number;
  unit: string; // 'Bags (90kg)', 'Kgs', 'Tonnes', 'Crates'
  qualityGrade: 'Grade 1 (Export/Premium)' | 'Grade 2 (Commercial)' | 'Grade 3 (Feed/Process)';
  storageLocation: string;
  marketDestination: 'NCPB Silo' | 'Wholesale Market' | 'Direct Buyer' | 'Farm Storage';
  revenueKsh?: number;
}

export interface FarmExpenseRecord {
  id: string;
  farmerId: string;
  date: string;
  category: 'Certified Seeds' | 'Fertilizer & Lime' | 'Agrochemicals' | 'Veterinary Care' | 'Labor & Tillage' | 'Irrigation & Fuel' | 'Transport & Logistics';
  description: string;
  amountKsh: number;
  vendorName?: string;
  receiptNumber?: string;
}

export interface FarmProductionRecord {
  id: string;
  farmerId: string;
  date: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPriceKsh: number;
  totalRevenueKsh: number;
  buyerName?: string;
}

export interface ConsultationRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerCounty: string;
  expertId: string;
  expertName: string;
  expertRole: 'Agronomist' | 'Veterinarian' | 'Soil Scientist' | 'Extension Officer';
  scheduledDate: string;
  scheduledTime: string;
  subject: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  advisoryReport?: string;
  prescribedInputs?: string[];
  createdAt: string;
}

export interface FieldInspectionRecord {
  id: string;
  officerId?: string;
  officerName: string;
  farmerId: string;
  farmerName: string;
  farmLocation: string;
  inspectionDate: string;
  purpose?: 'KEPHIS Seed Inspection' | 'Soil Fertility Audit' | 'Pest Outbreak Assessment' | 'Cooperative Yield Survey' | string;
  cropOrLivestock?: string;
  findings: string;
  recommendations: string;
  followUpDate?: string;
  complianceRating?: 'Compliant' | 'Action Required' | 'Critical Quarantine';
  status?: 'pending_followup' | 'urgent' | 'completed' | string;
  severity?: 'mild' | 'moderate' | 'severe';
}

export interface MemberActivityLog {
  id: string;
  userId: string;
  category: 'registration' | 'login' | 'farm' | 'crop' | 'livestock' | 'consultation' | 'inspection' | 'order' | 'membership' | 'profile';
  title: string;
  description: string;
  timestamp: string;
  recordRef?: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  category: 'system' | 'weather' | 'membership' | 'consultation' | 'marketplace' | 'training';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  folder: 'Banners' | 'Crops' | 'Livestock' | 'Experts' | 'Services' | 'Logos';
  url: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  alt: string;
}

export interface CmsVisualSection {
  id: string;
  type: 'hero' | 'features' | 'services' | 'stats' | 'testimonials' | 'cta' | 'news' | 'contact' | 'custom_text' | 'image_gallery';
  title: string;
  subtitle?: string;
  content?: string;
  badge?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  items?: Array<{
    title: string;
    description: string;
    icon?: string;
    image?: string;
    link?: string;
  }>;
}

export interface CmsPageDoc {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  seoDescription?: string;
  isPublished: boolean;
  publishedAt: string;
  sections: CmsVisualSection[];
}


