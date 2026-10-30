/**
 * DERIV-AGRI KENYA - Shared Agricultural Knowledge System & Verified Grounding Layer
 * Authoritative agronomic reference database grounded in:
 * - Kenya Agricultural and Livestock Research Organization (KALRO)
 * - Pest Control Products Board (PCPB) Kenya Registered Products Registry
 * - Kenya Plant Health Inspectorate Service (KEPHIS)
 * - Kenya Meteorological Department (KMD) Synoptic Agro-Meteorology
 * - National Agricultural Research Laboratories (NARL) Soil Fertility Index
 */

export interface CropAgronomyProfile {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'cereal' | 'legume' | 'tuber' | 'vegetable' | 'fruit' | 'fodder';
  suitableCounties: string[];
  optimalPhRange: { min: number; max: number; ideal: number };
  criticalNutrients: {
    nitrogenPercentMin: number;
    phosphorusPpmMin: number;
    potassiumPpmMin: number;
    organicCarbonPercentMin: number;
    maxSalinityEc: number; // dS/m
  };
  growthStages: {
    stage: 'initial' | 'vegetative' | 'flowering' | 'fruiting' | 'maturity';
    name: string;
    durationDays: number;
    kcFactor: number; // Crop coefficient for irrigation (FAO-56)
    rootDepthMeters: number;
    criticalWaterPeriod: boolean;
  }[];
  waterRequirementMmPerSeason: { min: number; max: number };
  nutrientDeficiencySymptoms: {
    nutrient: 'N' | 'P' | 'K' | 'Ca' | 'Mg' | 'S' | 'Zn' | 'B';
    symptom: string;
    cause: string;
    remedy: string;
  }[];
  standardFertilizerProgramPerAcre: {
    plantingBasal: {
      product: string;
      rateKgPerAcre: number;
      timing: string;
      notes: string;
    };
    topDressing: {
      product: string;
      rateKgPerAcre: number;
      timing: string;
      notes: string;
    };
    foliarOrBooster?: {
      product: string;
      ratePerAcre: string;
      timing: string;
    };
  };
  sources: {
    organization: string;
    title: string;
    year: number;
  }[];
}

export interface SoilTypeProfile {
  id: string;
  name: string;
  description: string;
  drainageRate: 'excessive' | 'good' | 'moderate' | 'poor' | 'impeded';
  infiltrationRateMmPerHour: number;
  availableWaterCapacityMmPerMeter: number; // AWC
  bufferFactorLime: number; // multiplier for lime requirement
  typicalKenyanCounties: string[];
  managementTips: string[];
}

export interface PcpbChemicalActive {
  activeIngredient: string;
  tradeExamples: string[];
  targetPestOrDisease: string;
  targetCrops: string[];
  whoToxicityClass: 'Class II (Moderately hazardous)' | 'Class III (Slightly hazardous)' | 'Class U (Unlikely hazardous)';
  phiDays: number; // Pre-harvest withholding interval in days
  ppeRequirements: string;
  environmentalHazards: string;
  applicationNotes: string;
}

export interface KnowledgeDocument {
  id: string;
  topic: string;
  category: 'soil_fertility' | 'irrigation_management' | 'crop_protection' | 'livestock_health' | 'market_intelligence';
  title: string;
  content: string;
  keywords: string[];
  sourceOrganization: 'KALRO' | 'PCPB' | 'KEPHIS' | 'KMD' | 'FAO_KENYA' | 'NARL';
  organization?: string;
  citationCode?: string;
  summaryExcerpt?: string;
  cropOrDomain?: string;
  publicationYear: number;
  lastReviewed: string;
}

export interface AccreditedSoilLab {
  id: string;
  name: string;
  location: string;
  county: string;
  accreditation: string;
  turnaroundDays: number;
  contactPhone: string;
  packages: { name: string; priceKsh: number }[];
}

export const ACCREDITED_SOIL_LABS_KENYA: AccreditedSoilLab[] = [
  {
    id: 'lab-kalro-narl',
    name: 'KALRO National Agricultural Laboratories (NARL)',
    location: 'Waiyaki Way, Kabete, Nairobi',
    county: 'Nairobi',
    accreditation: 'Ministry of Agriculture & KENAS ISO/IEC 17025',
    turnaroundDays: 3,
    contactPhone: '+254 722 206 986',
    packages: [
      { name: 'Standard Fertility (pH, N, P, K, Organic Carbon, Lime Rec)', priceKsh: 1500 },
      { name: 'Full Chemistry & Micronutrients (Fe, Zn, Cu, Mn, B)', priceKsh: 2800 },
      { name: 'Heavy Metals & Salinity Profile', priceKsh: 3500 },
    ],
  },
  {
    id: 'lab-cropnuts-limuru',
    name: 'Crop Nutrition Laboratory Services (CropNuts)',
    location: 'Limuru Road, Tigoni, Kiambu',
    county: 'Kiambu',
    accreditation: 'KENAS ISO/IEC 17025 Accredited Laboratory',
    turnaroundDays: 2,
    contactPhone: '+254 711 094 444',
    packages: [
      { name: 'Opti-Soil Routine Fertility Package', priceKsh: 2500 },
      { name: 'Precision GPS Grid Soil Chemistry & Nematodes', priceKsh: 4200 },
    ],
  },
  {
    id: 'lab-kephis-muguga',
    name: 'KEPHIS Plant Health & Soil Analytical Laboratory',
    location: 'Muguga Complex, Kikuyu',
    county: 'Kiambu',
    accreditation: 'Official Statutory Authority (Act 2012)',
    turnaroundDays: 4,
    contactPhone: '+254 709 840 000',
    packages: [
      { name: 'Soil Pathogen Screening & Texture Class', priceKsh: 2000 },
      { name: 'Full Agronomic Fertility Index', priceKsh: 2600 },
    ],
  },
  {
    id: 'lab-mea-nakuru',
    name: 'MEA Soil & Plant Analytical Lab (Nakuru)',
    location: 'George Morara Road, Industrial Area, Nakuru',
    county: 'Nakuru',
    accreditation: 'Fertilizer Association of Kenya Certified',
    turnaroundDays: 3,
    contactPhone: '+254 722 205 848',
    packages: [
      { name: 'Rift Valley Maize & Cereal Lime Requirement Test', priceKsh: 1800 },
      { name: 'Horticultural Drip Irrigation Water & Soil Panel', priceKsh: 3000 },
    ],
  },
];

// 1. CROPS AGRONOMY DATABASE
export const CROPS_AGRONOMY_DATABASE: CropAgronomyProfile[] = [
  {
    id: 'crop-maize',
    commonName: 'Maize (Dry Grain & Silage)',
    scientificName: 'Zea mays',
    category: 'cereal',
    suitableCounties: ['Trans Nzoia', 'Uasin Gishu', 'Nakuru', 'Nandi', 'Bungoma', 'Kakamega', 'Narok', 'Bomet', 'Kericho', 'Embu', 'Meru', 'Machakos'],
    optimalPhRange: { min: 5.5, max: 6.8, ideal: 6.2 },
    criticalNutrients: {
      nitrogenPercentMin: 0.15,
      phosphorusPpmMin: 15.0, // Mehlich 3
      potassiumPpmMin: 150.0,
      organicCarbonPercentMin: 2.0,
      maxSalinityEc: 1.7,
    },
    growthStages: [
      { stage: 'initial', name: 'Germination & Emergence (VE-V2)', durationDays: 15, kcFactor: 0.40, rootDepthMeters: 0.3, criticalWaterPeriod: false },
      { stage: 'vegetative', name: 'Rapid Vegetative & Knee High (V3-V10)', durationDays: 35, kcFactor: 0.80, rootDepthMeters: 0.7, criticalWaterPeriod: false },
      { stage: 'flowering', name: 'Tasseling & Silking (VT-R1)', durationDays: 25, kcFactor: 1.20, rootDepthMeters: 1.0, criticalWaterPeriod: true },
      { stage: 'fruiting', name: 'Grain Filling & Milking (R2-R4)', durationDays: 35, kcFactor: 1.05, rootDepthMeters: 1.0, criticalWaterPeriod: true },
      { stage: 'maturity', name: 'Physiological Maturity & Drydown (R5-R6)', durationDays: 20, kcFactor: 0.60, rootDepthMeters: 1.0, criticalWaterPeriod: false },
    ],
    waterRequirementMmPerSeason: { min: 500, max: 800 },
    nutrientDeficiencySymptoms: [
      {
        nutrient: 'N',
        symptom: 'V-shaped yellowing starting at leaf tips and progressing along the midrib of older lower leaves.',
        cause: 'Low soil nitrogen, severe leaching from heavy rains, or waterlogged anaerobic roots.',
        remedy: 'Top-dress with CAN (Calcium Ammonium Nitrate) or Urea at 50-75 kg/acre when soil is moist.',
      },
      {
        nutrient: 'P',
        symptom: 'Purpling or dark reddish discoloration along margins of young leaves; stunted plants and thin stalks.',
        cause: 'Soil acidity (pH < 5.5) fixing phosphate ions with toxic soluble aluminum/iron; dry topsoil.',
        remedy: 'Apply agricultural lime (CaCO3) 4 weeks prior to planting, or use Mavuno/NPK 23:23:0 basal fertilizer.',
      },
      {
        nutrient: 'K',
        symptom: 'Yellowing and scorching/necrosis along outer margins of lower leaves; weak stalks prone to lodging.',
        cause: 'Depleted soil potassium reserves due to continuous cereal harvesting without potash replenishment.',
        remedy: 'Incorporate MOP (Muriate of Potash) or balanced NPK 17:17:17 at planting.',
      },
    ],
    standardFertilizerProgramPerAcre: {
      plantingBasal: {
        product: 'NPK 23:23:0 or DAP (if soil pH > 6.0)',
        rateKgPerAcre: 50,
        timing: 'At planting, placed 5cm to the side and 5cm below seed (never in direct contact)',
        notes: 'If soil pH is below 5.5, substitute DAP with non-acidifying planting fertilizer (e.g. Mavuno or NPK 23:23:0).',
      },
      topDressing: {
        product: 'CAN (Calcium Ammonium Nitrate 26% N)',
        rateKgPerAcre: 75,
        timing: 'Split application: 35 kg at knee-high (V6 stage), 40 kg at early tasseling (V10 stage)',
        notes: 'Apply when soil is moist, 10-15cm away from plant stem; incorporate into soil to prevent volatilization.',
      },
    },
    sources: [
      { organization: 'KALRO', title: 'National Maize Production Advisory & Varieties Guide', year: 2024 },
      { organization: 'NARL', title: 'Soil Fertility and Crop Nutrition Guidelines for Kenya', year: 2023 },
    ],
  },
  {
    id: 'crop-beans',
    commonName: 'Common Dry Beans (Rosecoco, Nyayo, Chelalang, Yellow)',
    scientificName: 'Phaseolus vulgaris',
    category: 'legume',
    suitableCounties: ['Nakuru', 'Nyeri', 'Kiambu', 'Kakamega', 'Bungoma', 'Machakos', 'Makueni', 'Embu', 'Murang\'a', 'Bomet'],
    optimalPhRange: { min: 6.0, max: 7.2, ideal: 6.5 },
    criticalNutrients: {
      nitrogenPercentMin: 0.12,
      phosphorusPpmMin: 20.0, // High phosphorus requirement for root nodules
      potassiumPpmMin: 120.0,
      organicCarbonPercentMin: 1.8,
      maxSalinityEc: 1.0, // Highly salt-sensitive
    },
    growthStages: [
      { stage: 'initial', name: 'Emergence & Seedling (VE-V2)', durationDays: 14, kcFactor: 0.40, rootDepthMeters: 0.25, criticalWaterPeriod: false },
      { stage: 'vegetative', name: 'Branching & Pre-Flowering (V3-V4)', durationDays: 21, kcFactor: 0.75, rootDepthMeters: 0.5, criticalWaterPeriod: false },
      { stage: 'flowering', name: 'Full Bloom & Pod Setting (R1-R2)', durationDays: 18, kcFactor: 1.15, rootDepthMeters: 0.7, criticalWaterPeriod: true },
      { stage: 'fruiting', name: 'Pod Filling & Elongation (R3-R4)', durationDays: 20, kcFactor: 1.00, rootDepthMeters: 0.7, criticalWaterPeriod: true },
      { stage: 'maturity', name: 'Pod Ripening & Drying (R5)', durationDays: 15, kcFactor: 0.50, rootDepthMeters: 0.7, criticalWaterPeriod: false },
    ],
    waterRequirementMmPerSeason: { min: 350, max: 500 },
    nutrientDeficiencySymptoms: [
      {
        nutrient: 'P',
        symptom: 'Stunted plant growth, dark green foliage, delayed flowering, poor nodulation, and purpling on leaf undersides.',
        cause: 'Acidic soils locking phosphate; low biological nitrogen fixation due to lack of rhizobia energy.',
        remedy: 'Apply Triple Superphosphate (TSP) or Single Superphosphate (SSP) at 50 kg/acre, or inoculate seed with Biofix rhizobium.',
      },
      {
        nutrient: 'N',
        symptom: 'Pale green to yellow lower leaves; poor pod formation.',
        cause: 'Ineffective root nodulation or waterlogged anaerobic soil killing Rhizobium bacteria.',
        remedy: 'Starter basal dose of NPK 17:17:17 at 30 kg/acre.',
      },
    ],
    standardFertilizerProgramPerAcre: {
      plantingBasal: {
        product: 'DAP or TSP (or NPK 23:23:0)',
        rateKgPerAcre: 50,
        timing: 'At planting in the furrow, covered with soil before seed placement',
        notes: 'Inoculation with KALRO BIOFIX Rhizobium inoculant is highly recommended at planting.',
      },
      topDressing: {
        product: 'Usually not needed if nodulation is active; apply foliar booster if pale',
        rateKgPerAcre: 0,
        timing: 'Pre-flowering if nodulation failed',
        notes: 'Excess nitrogen fertilizer suppresses natural nodulation and promotes excessive foliage over pod setting.',
      },
    },
    sources: [
      { organization: 'KALRO', title: 'Grain Legumes Production and Seed Inoculation Manual', year: 2024 },
      { organization: 'KEPHIS', title: 'Certified Bean Varieties Bulletin', year: 2024 },
    ],
  },
  {
    id: 'crop-potatoes',
    commonName: 'Irish Potatoes (Shangi, Tigoni, Dutch Robijn)',
    scientificName: 'Solanum tuberosum',
    category: 'tuber',
    suitableCounties: ['Nyandarua', 'Nakuru', 'Elgeyo Marakwet', 'Meru', 'Bomet', 'Kiambu', 'Nyeri', 'Uasin Gishu'],
    optimalPhRange: { min: 5.0, max: 6.5, ideal: 5.8 }, // Tolerates moderate acidity; high pH (>6.5) promotes potato scab
    criticalNutrients: {
      nitrogenPercentMin: 0.18,
      phosphorusPpmMin: 25.0, // Critical for tuber initiation
      potassiumPpmMin: 200.0, // Very high potassium consumer
      organicCarbonPercentMin: 2.2,
      maxSalinityEc: 1.7,
    },
    growthStages: [
      { stage: 'initial', name: 'Sprout Emergence & Canopy (Stage I)', durationDays: 20, kcFactor: 0.50, rootDepthMeters: 0.3, criticalWaterPeriod: false },
      { stage: 'vegetative', name: 'Vegetative Growth & Tuber Initiation (Stage II)', durationDays: 25, kcFactor: 0.85, rootDepthMeters: 0.5, criticalWaterPeriod: true },
      { stage: 'fruiting', name: 'Tuber Bulking (Stage III)', durationDays: 35, kcFactor: 1.15, rootDepthMeters: 0.6, criticalWaterPeriod: true },
      { stage: 'maturity', name: 'Canopy Senescence & Skin Hardening (Stage IV)', durationDays: 20, kcFactor: 0.70, rootDepthMeters: 0.6, criticalWaterPeriod: false },
    ],
    waterRequirementMmPerSeason: { min: 500, max: 700 },
    nutrientDeficiencySymptoms: [
      {
        nutrient: 'K',
        symptom: 'Dark green leaves turning bronze with marginal curling and necrotic spotting; small tubers that bruise easily during storage.',
        cause: 'High potato potassium demand unfulfilled by basic cereal fertilizers.',
        remedy: 'Apply Sulfate of Potash (SOP) or NPK 17:17:17 at hilling/earthing up.',
      },
      {
        nutrient: 'P',
        symptom: 'Reduced tuber count per hill, thin spindly stems, leaves curled inward with dark pigmentation.',
        cause: 'Inadequate phosphate during the critical tuber initiation stage (2-4 weeks after emergence).',
        remedy: 'Apply DAP or NPK 17:17:17 at 100 kg/acre at planting.',
      },
    ],
    standardFertilizerProgramPerAcre: {
      plantingBasal: {
        product: 'NPK 17:17:17 or DAP',
        rateKgPerAcre: 100,
        timing: 'In furrows at planting, thoroughly mixed with soil before seed tuber placement',
        notes: 'Avoid placing seed tubers directly onto chemical fertilizer granules.',
      },
      topDressing: {
        product: 'CAN (Calcium Ammonium Nitrate)',
        rateKgPerAcre: 50,
        timing: 'During first earthing up (ridging) when plants are 15-20cm tall',
        notes: 'Earthing up covers the tubers to prevent greening (solanine toxicity) and tuber moth attack.',
      },
    },
    sources: [
      { organization: 'KALRO', title: 'National Potato Strategy & Good Agronomic Practices', year: 2023 },
      { organization: 'PCPB', title: 'Crop Protection Compendium for Horticultural Crops', year: 2025 },
    ],
  },
  {
    id: 'crop-tomatoes',
    commonName: 'Fresh Market Tomatoes (Anna F1, Kilele F1, Rambo F1)',
    scientificName: 'Solanum lycopersicum',
    category: 'vegetable',
    suitableCounties: ['Kirinyaga', 'Kajiado', 'Nakuru', 'Machakos', 'Kiambu', 'Makueni', 'Meru', 'Uasin Gishu', 'Kisumu'],
    optimalPhRange: { min: 6.0, max: 6.8, ideal: 6.5 },
    criticalNutrients: {
      nitrogenPercentMin: 0.20,
      phosphorusPpmMin: 30.0,
      potassiumPpmMin: 220.0,
      organicCarbonPercentMin: 2.5,
      maxSalinityEc: 2.5,
    },
    growthStages: [
      { stage: 'initial', name: 'Transplant Establishment', durationDays: 15, kcFactor: 0.45, rootDepthMeters: 0.3, criticalWaterPeriod: false },
      { stage: 'vegetative', name: 'Rapid Vegetative & First Truss', durationDays: 25, kcFactor: 0.80, rootDepthMeters: 0.6, criticalWaterPeriod: false },
      { stage: 'flowering', name: 'Flowering & Fruit Setting', durationDays: 30, kcFactor: 1.15, rootDepthMeters: 0.9, criticalWaterPeriod: true },
      { stage: 'fruiting', name: 'Continuous Fruit Bulking & Harvest', durationDays: 50, kcFactor: 1.10, rootDepthMeters: 1.0, criticalWaterPeriod: true },
      { stage: 'maturity', name: 'Final Trusses & Clearing', durationDays: 15, kcFactor: 0.80, rootDepthMeters: 1.0, criticalWaterPeriod: false },
    ],
    waterRequirementMmPerSeason: { min: 400, max: 600 },
    nutrientDeficiencySymptoms: [
      {
        nutrient: 'Ca',
        symptom: 'Blossom End Rot (BER) — sunken, black leathery water-soaked lesions on the bottom of developing fruits.',
        cause: 'Irregular watering or low calcium mobility; soil moisture fluctuations prevent calcium uptake.',
        remedy: 'Maintain consistent soil moisture via drip irrigation; spray calcium nitrate foliar feed weekly during fruit set.',
      },
      {
        nutrient: 'Mg',
        symptom: 'Interveinal chlorosis (yellowing between leaf veins while veins stay green) on older mature leaves.',
        cause: 'Excessive potassium application blocking magnesium absorption; acidic light sandy soils.',
        remedy: 'Apply Epsom salt (Magnesium sulfate) at 10-15 kg/acre or foliar spray at 5g/liter.',
      },
    ],
    standardFertilizerProgramPerAcre: {
      plantingBasal: {
        product: 'Well-cured cattle manure (5-10 tonnes/acre) + NPK 23:23:0 or DAP',
        rateKgPerAcre: 50,
        timing: 'Incorporated into planting holes 1 week before seedling transplanting',
        notes: 'Wet holes thoroughly before transplanting in late afternoon.',
      },
      topDressing: {
        product: 'CAN (35 kg/acre at 3 weeks) followed by NPK 17:17:17 (50 kg/acre at first flowering)',
        rateKgPerAcre: 85,
        timing: 'Split applications through drip fertigation or banding under mulch',
        notes: 'Foliar sprays containing Calcium + Boron are crucial to prevent fruit cracking and blossom end rot.',
      },
    },
    sources: [
      { organization: 'KALRO', title: 'Commercial Tomato Production under Drip and Greenhouse', year: 2024 },
      { organization: 'PCPB', title: 'Pest and Fungicide Directory for Tomato Cultivation', year: 2025 },
    ],
  },
];

// 2. SOIL TYPES DATABASE
export const SOIL_TYPES_DATABASE: SoilTypeProfile[] = [
  {
    id: 'soil-red-volcanic-clay',
    name: 'Red Volcanic Clay (Kikuyu Red Loam)',
    description: 'Deep, well-weathered red highland volcanic soil with good physical structure and high clay content. Prone to severe phosphorus fixation and acidification from heavy rainfall and continuous DAP usage.',
    drainageRate: 'good',
    infiltrationRateMmPerHour: 20,
    availableWaterCapacityMmPerMeter: 180, // mm of water per meter of soil depth
    bufferFactorLime: 1.4, // Higher lime needed to shift pH due to high cation exchange capacity
    typicalKenyanCounties: ['Kiambu', 'Nyeri', 'Murang\'a', 'Kirinyaga', 'Embu', 'Meru', 'Nakuru (highlands)', 'Kericho'],
    managementTips: [
      'Apply agricultural lime (CaCO3) periodically if pH falls below 5.5 to unlock bound phosphorus.',
      'Incorporate organic manure regularly to enhance biological phosphate availability.',
      'Avoid unbuffered continuous DAP application; rotate with NPK 23:23:0 or CAN.',
    ],
  },
  {
    id: 'soil-clay-loam',
    name: 'Clay Loam (Alluvial / Mixed Highland)',
    description: 'Balanced mix of clay, silt, and sand particles. Excellent water holding capacity and nutrient retention. Ideal for general cereal, legume, and horticulture production.',
    drainageRate: 'good',
    infiltrationRateMmPerHour: 15,
    availableWaterCapacityMmPerMeter: 160,
    bufferFactorLime: 1.1,
    typicalKenyanCounties: ['Uasin Gishu', 'Trans Nzoia', 'Nandi', 'Bungoma', 'Kakamega', 'Nakuru'],
    managementTips: [
      'Maintain surface mulch to prevent crusting and conserve topsoil moisture.',
      'Practice minimum tillage or crop rotation with deep-rooting cover crops.',
    ],
  },
  {
    id: 'soil-sandy-loam',
    name: 'Sandy Loam (Semi-Arid & Eastern Light Soil)',
    description: 'High proportion of sand with sufficient silt and clay. Warms quickly and easy to till, but has low organic matter, rapid water percolation, and high leaching of soluble nitrogen.',
    drainageRate: 'excessive',
    infiltrationRateMmPerHour: 40,
    availableWaterCapacityMmPerMeter: 110,
    bufferFactorLime: 0.7, // Low buffer capacity, pH changes easily
    typicalKenyanCounties: ['Machakos', 'Makueni', 'Kitui', 'Kilifi', 'Kwale', 'Garissa', 'Isiolo'],
    managementTips: [
      'Split fertilizer applications into 3-4 smaller doses to prevent leaching below the root zone.',
      'Apply heavy organic compost or farmyard manure (5-8 tonnes/acre) to increase moisture holding capacity.',
      'Adopt drip irrigation instead of furrow to avoid catastrophic percolation water loss.',
    ],
  },
  {
    id: 'soil-black-cotton',
    name: 'Black Cotton Soil (Vertisol / Swelling Clay)',
    description: 'Heavy, dark clay soil with high montmorillonite content. Expands when wet, becoming sticky and waterlogged with very poor internal drainage; forms deep cracks when dry.',
    drainageRate: 'poor',
    infiltrationRateMmPerHour: 5,
    availableWaterCapacityMmPerMeter: 200,
    bufferFactorLime: 1.8,
    typicalKenyanCounties: ['Kajiado', 'Athi River / Machakos', 'Kisumu (Kano Plains)', 'Homa Bay', 'Bomet (lowlands)'],
    managementTips: [
      'Construct raised planting beds or broadbeds and furrows (BBF) to prevent root waterlogging and root rot.',
      'Avoid working the field when saturated to prevent severe soil compaction.',
      'High natural fertility and potassium, but requires careful drainage planning.',
    ],
  },
];

// 3. PCPB REGISTERED CHEMICAL ACTIVES REGISTRY
export const KENYA_PCPB_REGISTRY: PcpbChemicalActive[] = [
  {
    activeIngredient: 'Chlorantraniliprole 200 g/L',
    tradeExamples: ['Coragen 20 SC', 'Voliam Targo 063 SC'],
    targetPestOrDisease: 'Fall Armyworm (Spodoptera frugiperda), Tuta Absoluta, Diamondback Moth',
    targetCrops: ['Maize', 'Tomatoes', 'Cabbage', 'French Beans'],
    whoToxicityClass: 'Class U (Unlikely hazardous)',
    phiDays: 14,
    ppeRequirements: 'Long-sleeved shirt, long pants, chemical-resistant nitrile gloves, gumboots, safety spectacles',
    environmentalHazards: 'Very toxic to aquatic life. Do not spray within 10 meters of rivers, dams, or water pans.',
    applicationNotes: 'Direct spray funnel into the central whorl of maize early in the morning before caterpillars burrow deep.',
  },
  {
    activeIngredient: 'Emamectin Benzoate 50 g/kg',
    tradeExamples: ['Prove 1.92 EC', 'Proclaim 05 SG', 'Escort 1.9 EC'],
    targetPestOrDisease: 'Fall Armyworm, Tomato Leafminer (Tuta), Thrips, Bollworms',
    targetCrops: ['Maize', 'Tomato', 'French Beans', 'Onions'],
    whoToxicityClass: 'Class II (Moderately hazardous)',
    phiDays: 7,
    ppeRequirements: 'Full overalls, chemical-resistant gloves, cartridge respirator mask, eye protection',
    environmentalHazards: 'Toxic to bees. Do not apply during peak crop flowering or active pollinator foraging.',
    applicationNotes: 'Rotate with different chemical mode of action groups to prevent rapid insect resistance development.',
  },
  {
    activeIngredient: 'Mancozeb 800 g/kg',
    tradeExamples: ['Dithane M-45', 'Oshothane 80 WP', 'Milthane Super'],
    targetPestOrDisease: 'Early Blight (Alternaria), Late Blight (Phytophthora infestans), Rust, Downy Mildew',
    targetCrops: ['Irish Potatoes', 'Tomatoes', 'Beans', 'Cabbage', 'Onions'],
    whoToxicityClass: 'Class III (Slightly hazardous)',
    phiDays: 7,
    ppeRequirements: 'Dust respirator, chemical gloves, protective eyewear, cotton overalls',
    environmentalHazards: 'Harmful to aquatic organisms. Prevent wash-off into irrigation furrows.',
    applicationNotes: 'Strictly preventative multi-site contact fungicide. Must be applied prior to visual disease onset or at first signs of humid cloudy weather.',
  },
  {
    activeIngredient: 'Metalaxyl-M 40 g/kg + Mancozeb 640 g/kg',
    tradeExamples: ['Ridomil Gold MZ 68 WG', 'Milraz WP', 'Tatuzeb 68 WG'],
    targetPestOrDisease: 'Late Blight (Phytophthora infestans), Downy Mildew, Damping Off',
    targetCrops: ['Potatoes', 'Tomatoes', 'Horticulture'],
    whoToxicityClass: 'Class II (Moderately hazardous)',
    phiDays: 14,
    ppeRequirements: 'Full PPE including chemical apron, nitrile gloves, respirator, eye goggles, gumboots',
    environmentalHazards: 'Avoid contamination of domestic water sources and honeybee apiaries.',
    applicationNotes: 'Systemic curative + contact protective action. Apply when lesions first appear in the region; limit to maximum 2-3 sprays per season to avoid resistance.',
  },
  {
    activeIngredient: 'Azadirachtin 0.03% (Neem Extract - Biological)',
    tradeExamples: ['Nimbecidine EC', 'Achook 0.15% EC'],
    targetPestOrDisease: 'Aphids, Whiteflies, Spider Mites, Thrips, Early Instar Caterpillars',
    targetCrops: ['Vegetables', 'Tomatoes', 'Beans', 'Fruits'],
    whoToxicityClass: 'Class U (Unlikely hazardous)',
    phiDays: 1,
    ppeRequirements: 'Standard protective clothing, rubber gloves, dust mask',
    environmentalHazards: 'Biodegradable, safe for beneficial insects, predatory mites, and earthworms.',
    applicationNotes: 'Approved for organic farming. Antifeedant, insect growth regulator, and oviposition deterrent.',
  },
];

// 4. SHARED KNOWLEDGE DOCUMENTS REGISTRY (For RAG & Assistant)
export const SHARED_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-soil-ph-01',
    topic: 'Soil Acidity and Agricultural Liming in Kenyan Highlands',
    category: 'soil_fertility',
    title: 'Managing Acidic Soils (pH < 5.5) with Agricultural Lime (CaCO3) in Western Kenya and Rift Valley',
    citationCode: 'KALRO-NARL-2024-LIME',
    organization: 'KALRO National Agricultural Research Laboratories',
    cropOrDomain: 'Maize, Beans, Wheat & Acid Soils',
    summaryExcerpt: 'Managing acidic soils (pH < 5.5) using agricultural limestone (CaCO3, >=80% CCE) broadcast 3-4 weeks before planting rains to unlock bound phosphates and overcome Aluminum toxicity.',
    content: `According to KALRO National Agricultural Research Laboratories (NARL), over 13% of Kenya's cultivated highland soils in Uasin Gishu, Trans Nzoia, Nakuru, Kakamega, and Kericho suffer from severe soil acidity with pH values below 5.2.
When soil pH falls below 5.5:
1. Phosphorus fixation occurs: Plant-available orthophosphate ions react with soluble aluminum (Al3+) and iron (Fe3+) to form insoluble, precipitate compounds that plant roots cannot absorb, causing false phosphorus deficiency.
2. Aluminum toxicity sets in, severely pruning and stunting root hairs, making maize and bean crops drought-sensitive even in wet seasons.
3. Beneficial soil Rhizobium bacteria (responsible for biological nitrogen fixation in beans, cowpeas, and lucerne) are paralyzed, dropping nodulation rates by up to 80%.

Remediation Protocol:
- Test soil pH using an accredited laboratory (e.g., KALRO NARL or CropNuts).
- If pH is 4.5 - 5.0: Apply 1,000 to 1,500 kg/acre of finely ground agricultural lime (Calcium Carbonate - CaCO3, minimum 80% neutralizing value).
- If pH is 5.1 - 5.5: Apply 500 to 800 kg/acre.
- Application method: Broadcast uniformly and incorporate into the top 15cm of soil at least 3-4 weeks prior to the onset of planting rains. Lime requires soil moisture and time to dissolve and neutralize exchangeable acidity.
- Fertilizer substitution: Cease using continuous DAP (18:46:0) which carries an acid-forming physiological reaction; substitute with non-acidifying blends such as NPK 23:23:0, Mavuno Planting Fertilizer, or Single Superphosphate (SSP).`,
    keywords: ['soil ph', 'acidity', 'lime', 'agricultural lime', 'caco3', 'dap', 'phosphorus fixation', 'aluminum toxicity', 'kalro'],
    sourceOrganization: 'KALRO',
    publicationYear: 2024,
    lastReviewed: '2026-04-15',
  },
  {
    id: 'doc-irrigation-calc-02',
    topic: 'FAO-56 Irrigation Water Calculation and Water Conservation in Kenya',
    category: 'irrigation_management',
    title: 'Precision Water Budgeting: Evapotranspiration, Crop Coefficients (Kc), and System Efficiency',
    citationCode: 'FAO-KE-2023-IRRIG',
    organization: 'FAO Kenya & National Irrigation Authority',
    cropOrDomain: 'Horticulture, Drip Irrigation & Water Budgeting',
    summaryExcerpt: 'Standard crop water requirements calculation where 1 mm depth on 1 ha = 10,000 L and 1 mm depth on 1 acre = 4,047 L; net water ETc = ETo x Kc, adjusted for drip (90%) and sprinkler (75%) efficiency.',
    content: `Water requirement calculations for Kenyan farming follow the standard FAO-56 Penman-Monteith crop water methodology:
1. Fundamental Volume Benchmark:
   - 1 millimeter (mm) of irrigation water depth over 1 hectare (10,000 m²) = 10 cubic meters (m³) = 10,000 liters.
   - 1 millimeter (mm) of irrigation water depth over 1 acre (4,046.86 m²) = 4.047 cubic meters (m³) = 4,047 liters.
2. Daily Crop Water Need (ETc):
   - ETc = ETo × Kc (where ETo is Reference Evapotranspiration in mm/day from local weather stations, and Kc is the crop coefficient for the specific growth stage).
   - In Kenyan Rift Valley & Central Highlands, typical ETo averages 3.8 to 5.2 mm/day; in Eastern semi-arid (Machakos, Garissa, Kitui) ETo averages 5.5 to 7.0 mm/day.
3. System Application Efficiency:
   - Drip Irrigation: 85% to 92% efficiency (use 90% in calculations).
   - Micro-sprinklers: 70% to 80% efficiency (use 75%).
   - Overhead Sprinklers: 65% to 75% efficiency.
   - Furrow/Basin Flooding: 50% to 60% efficiency (significant deep percolation and evaporation loss).
   - Gross Irrigation Need = Net Crop Need (ETc - Effective Rainfall) ÷ System Efficiency.
4. Run Time Calculation:
   - Run Time (Hours) = Gross Water Volume Required (Liters) ÷ Total Irrigation Flow Rate (Liters/Hour).
5. Weather Interlock:
   - If rainfall exceeding 10mm is forecast within the next 24 hours, postpone irrigation to prevent waterlogging, nutrient leaching, and root hypoxia.`,
    keywords: ['irrigation', 'water requirement', 'calculation', 'liters per acre', 'drip irrigation', 'kc factor', 'evapotranspiration', 'efficiency'],
    sourceOrganization: 'FAO_KENYA',
    publicationYear: 2023,
    lastReviewed: '2026-06-10',
  },
  {
    id: 'doc-pest-faw-03',
    topic: 'Integrated Pest Management (IPM) for Fall Armyworm (FAW) in Kenya',
    category: 'crop_protection',
    title: 'Kenya PCPB Approved Scouting, Cultural Prevention, and Chemical Control for Spodoptera frugiperda',
    citationCode: 'PCPB-REG-2024-FAW',
    organization: 'Pest Control Products Board (PCPB) Kenya',
    cropOrDomain: 'Maize & Sorghum Pest Management',
    summaryExcerpt: 'Integrated Pest Management guidelines for Fall Armyworm (Spodoptera frugiperda), distinguishing head inverted Y marks, push-pull trap crops, and registered actives (Chlorantraniliprole, Emamectin Benzoate).',
    content: `Fall Armyworm (Spodoptera frugiperda) is an invasive noctuid pest in all 47 counties of Kenya.
1. Identification:
   - Larvae have 4 dark spots arranged in an inverted trapezoid/square on the second-last abdominal segment and an inverted white 'Y' mark on the dark head capsule.
   - Damage: Window-paning of young leaves, moist yellowish-brown sawdust frass inside the central funnel.
2. Threshold for Action:
   - Early whorl stage: Spray when 10% to 20% of plants show active damage and live caterpillars.
   - Late whorl/tasseling: Spray when 5% to 10% of plants show infestation.
3. Cultural & Biological Controls (IPM):
   - Push-Pull Technology: Intercrop maize with Silverleaf or Greenleaf Desmodium (push) and plant Brachiaria or Napier grass borders (pull).
   - Early planting at the onset of rains to outpace peak adult moth flight cycles.
   - Application of dry clean sand or fine wood ash mixed with chili powder into whorls of young plants suffocates caterpillars physically.
   - Hand-picking of egg masses and larvae in plots under 1 acre.
4. PCPB Authorized Chemical Controls:
   - Chlorantraniliprole 200 g/L (Coragen 20 SC / Belt) at 5ml per 20L knapsack. PHI: 14 days.
   - Emamectin Benzoate 50 g/kg (Prove 1.92 EC / Escort) at 10-15g per 20L knapsack. PHI: 7 days.
   - Spinetoram 120 g/L (Radiant 120 SC). PHI: 7 days.
   - Biological: Bacillus thuringiensis (Bt) - Dipel 2X. PHI: 1 day.
5. Application Technique:
   - Spray early morning (6:00 AM - 8:30 AM) or late evening (5:30 PM - 7:00 PM) when larvae feed openly. Direct spray nozzle directly into the funnel.
   - Always wear full PPE (nitrile gloves, face mask, gumboots, overalls).`,
    keywords: ['fall armyworm', 'faw', 'maize pest', 'pcpb', 'coragen', 'emamectin', 'chlorantraniliprole', 'push pull', 'scouting'],
    sourceOrganization: 'PCPB',
    publicationYear: 2024,
    lastReviewed: '2026-08-20',
  },
  {
    id: 'doc-livestock-dairy-04',
    topic: 'Dairy Cattle Nutrition and Milk Yield Optimization in Kenya',
    category: 'livestock_health',
    title: 'Transition from 15L to 30L/day: Rations, Total Mixed Ration (TMR), and Desmodium/Silage Protocols',
    citationCode: 'KALRO-DRI-2024-DAIRY',
    organization: 'KALRO Dairy Research Institute Naivasha',
    cropOrDomain: 'Dairy Cattle & Forage Management',
    summaryExcerpt: 'Feeding protocol and dry matter balancing for Kenyan smallholders moving from 15L to 30L per cow, emphasizing wilted silage, Desmodium/Lucerne protein, and ad-libitum clean water.',
    content: `According to KALRO Dairy Research Institute (Naivasha):
1. Limiting Factors in Smallholder Dairy Yields:
   - Low dry matter intake, high reliance on un-wilted low-protein Napier grass, and restricted clean drinking water.
2. The 30L Production Formula:
   - A 500kg Friesian or Ayrshire cow producing 30 liters of milk requires 16-18 kg of dry matter daily containing 16% Crude Protein (CP) and 10.5 MJ/kg of Metabolizable Energy (ME).
   - High-quality wilted maize silage (28-32% dry matter, well fermented) provides high energy.
   - Legume forage: Lucerne (Alfalfa) or Greenleaf Desmodium hay provides 18-22% crude protein, drastically reducing expensive commercial dairy meal costs.
3. Feeding Rule:
   - Provide 3 kg of standard commercial dairy meal (16% CP) for maintenance, then 1 kg of dairy meal for every 2 liters of milk produced beyond 10 liters.
4. Water Requirement:
   - A dairy cow requires 4 to 5 liters of clean water for every 1 liter of milk produced, plus 40-50 liters for maintenance (totaling 120-160 liters daily per cow). Ad-libitum water access increases yield by 15-20% immediately.
5. Mastitis & Hygiene:
   - California Mastitis Test (CMT) weekly.
   - Post-milking teat dipping in 0.5% iodine or chlorhexidine to seal teat canals.`,
    keywords: ['dairy cow', 'milk yield', 'silage', 'desmodium', 'lucerne', 'friesian', 'ayrshire', 'kalro', 'feed ratio'],
    sourceOrganization: 'KALRO',
    publicationYear: 2024,
    lastReviewed: '2026-05-18',
  },
];
