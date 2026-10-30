import { 
  Product, 
  CartItem, 
  Order, 
  UserProfile, 
  SoilTestRequest, 
  ForumPost, 
  MarketPriceRecord, 
  UserRole,
  AdminStats,
  AuditLogEntry,
  MembershipVerificationResult,
  ProductInquiry,
  ProductReport,
  PlatformBranding,
  DeliverySettings,
  PlatformGovernanceSettings,
  SoilAnalysisReport,
  IrrigationScheduleReport,
  PestDiagnosisReport,
  AiTelemetryMetric,
  AiFeedbackReport
} from '../types';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { SAMPLE_LIVESTOCK } from '../data/sampleLivestock';
import { SAMPLE_MARKET_PRICES } from '../data/sampleMarketPrices';
import { apiService } from './api';

const LOCAL_STORAGE_KEY_PRODUCTS = 'smart_agri_products_v6';
const LOCAL_STORAGE_KEY_ORDERS = 'smart_agri_orders_v1';
const LOCAL_STORAGE_KEY_CART = 'smart_agri_cart_v1';
const LOCAL_STORAGE_KEY_USER = 'smart_agri_user_v1';
const LOCAL_STORAGE_KEY_AUTH = 'smart_agri_is_auth_v3';
const LOCAL_STORAGE_KEY_SOIL = 'smart_agri_soil_v1';
const LOCAL_STORAGE_KEY_FORUM = 'smart_agri_forum_v1';
const LOCAL_STORAGE_KEY_USERS = 'smart_agri_users_v2';
const LOCAL_STORAGE_KEY_AUDIT = 'smart_agri_audit_v1';
const LOCAL_STORAGE_KEY_INQUIRIES = 'smart_agri_inquiries_v1';
const LOCAL_STORAGE_KEY_REPORTS = 'smart_agri_reports_v1';
const LOCAL_STORAGE_KEY_PRICES = 'smart_agri_prices_v2';
const LOCAL_STORAGE_KEY_CONSULTATIONS = 'smart_agri_consultations_v2';
const LOCAL_STORAGE_KEY_BRANDING = 'deriv_agri_branding_v1';
const LOCAL_STORAGE_KEY_DELIVERY = 'deriv_agri_delivery_v1';
const LOCAL_STORAGE_KEY_GOVERNANCE = 'deriv_agri_governance_v1';
const LOCAL_STORAGE_KEY_SOIL_REPORTS = 'deriv_agri_soil_reports_v1';
const LOCAL_STORAGE_KEY_IRRIGATION = 'deriv_agri_irrigation_v1';
const LOCAL_STORAGE_KEY_PEST_DIAGNOSES = 'deriv_agri_pest_diagnoses_v1';
const LOCAL_STORAGE_KEY_AI_TELEMETRY = 'deriv_agri_ai_telemetry_v1';
const LOCAL_STORAGE_KEY_AI_FEEDBACK = 'deriv_agri_ai_feedback_v1';

export function getCountyAbbr(countyName: string): string {
  const map: Record<string, string> = {
    'Nakuru': 'NKR', 'Nairobi': 'NBI', 'Mombasa': 'MSA', 'Kiambu': 'KBU',
    'Uasin Gishu': 'UG', 'Kisumu': 'KSM', 'Machakos': 'MCK', 'Meru': 'MRU',
    'Nyeri': 'NYR', 'Kakamega': 'KKM', 'Kericho': 'KRC', 'Kilifi': 'KLF',
    'Bungoma': 'BGM', 'Trans Nzoia': 'TNZ', 'Narok': 'NRK', 'Kajiado': 'KJD',
    'Murang\'a': 'MRG', 'Kirinyaga': 'KRN', 'Embu': 'EBU', 'Kitui': 'KTU',
    'Makueni': 'MKN', 'Nyandarua': 'NDR', 'Laikipia': 'LKP', 'Baringo': 'BRG',
    'Nandi': 'NND', 'Bomet': 'BMT', 'Vihiga': 'VHG', 'Busia': 'BSA',
    'Siaya': 'SYA', 'Homa Bay': 'HMB', 'Migori': 'MGR', 'Kisii': 'KSI',
    'Nyamira': 'NMR', 'Garissa': 'GRS', 'Wajir': 'WJR', 'Mandera': 'MND',
    'Marsabit': 'MBT', 'Isiolo': 'ISL', 'Turkana': 'TRK', 'West Pokot': 'WPK',
    'Samburu': 'SBR', 'Elgeyo Marakwet': 'EMK', 'Lamu': 'LMU', 'Taita Taveta': 'TTA',
    'Tana River': 'TNR', 'Kwale': 'KWL'
  };
  return map[countyName] || (countyName.length >= 3 ? countyName.slice(0, 3).toUpperCase() : 'NKR');
}

export function generateMembershipCode(county: string, role: UserRole): string {
  const cCode = getCountyAbbr(county);
  const roleCodeMap: Record<string, string> = {
    farmer: 'F',
    buyer: 'B',
    seller: 'S',
    consultant: 'C',
    expert: 'C',
    veterinarian: 'V',
    transporter: 'T',
    lab: 'L',
    admin: 'A'
  };
  const rCode = roleCodeMap[role] || 'F';
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `SAK-${cCode}-2026-${rCode}${randNum}`;
}

// 8 Complete Demo Personas for Kenyan Agriculture Platform
export const DEMO_FARMER: UserProfile = {
  id: 'usr-farmer-01',
  name: 'Samuel Kiprop Kimani',
  email: 'farmer@smart-agri.ke',
  phone: '0722123456',
  role: 'farmer',
  county: 'Nakuru',
  subCounty: 'Njoro',
  town: 'Njoro',
  ward: 'Nessuit',
  farmName: 'Rongai Valley Mixed Farm',
  farmSizeAcres: 12.5,
  nationalIdNumber: '28475921',
  membershipCode: 'SAK-NKR-2024-F4829',
  membershipTier: 'Gold',
  cooperativeAffiliation: 'Rongai Dairy & Cereal SACCO',
  status: 'active',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2024-03-12',
};

export const DEMO_BUYER: UserProfile = {
  id: 'usr-buyer-01',
  name: 'Grace Njeri Mwangi',
  email: 'buyer@smart-agri.ke',
  phone: '0711987654',
  role: 'buyer',
  county: 'Mombasa',
  subCounty: 'Mvita',
  town: 'Mombasa',
  organizationName: 'Coastal Fresh Produce Wholesalers',
  businessType: 'Bulk Food Broker & Supermarket Distributor',
  nationalIdNumber: '24910283',
  membershipCode: 'SAK-MSA-2024-B1092',
  membershipTier: 'Platinum',
  cooperativeAffiliation: 'Coast Horticultural Traders Association',
  status: 'active',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2024-05-18',
};

export const DEMO_SELLER: UserProfile = {
  id: 'usr-seller-01',
  name: 'James Mworia Githinji',
  email: 'seller@smart-agri.ke',
  phone: '0722334455',
  role: 'seller',
  county: 'Uasin Gishu',
  subCounty: 'Eldoret East',
  town: 'Eldoret',
  organizationName: 'Rift Valley Agrovet Wholesalers',
  businessType: 'Certified Farm Inputs & Machinery',
  licenseNumber: 'KEPHIS-AGR-8821',
  nationalIdNumber: '21094832',
  membershipCode: 'SAK-UG-2023-S7714',
  membershipTier: 'Platinum',
  cooperativeAffiliation: 'Kenya Agro-Dealers Association (KADA)',
  status: 'active',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2023-11-04',
};

export const DEMO_CONSULTANT: UserProfile = {
  id: 'usr-consultant-01',
  name: 'Dr. Evans Mwangi, PhD',
  email: 'consultant@smart-agri.ke',
  phone: '0722889900',
  role: 'consultant',
  county: 'Kiambu',
  subCounty: 'Kikuyu',
  town: 'Kikuyu',
  organizationName: 'Kenya Precision Agronomy & Extension Ltd',
  businessType: 'Senior Agronomist & Soil Chemist',
  licenseNumber: 'KASP-AGR-4920',
  nationalIdNumber: '19842109',
  membershipCode: 'SAK-KBU-2023-C3910',
  membershipTier: 'Platinum',
  cooperativeAffiliation: 'Kenya Society of Agricultural Professionals (KSAP)',
  status: 'active',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2023-08-15',
};

export const DEMO_VETERINARIAN: UserProfile = {
  id: 'usr-vet-01',
  name: 'Dr. Faith Cherono, BVM',
  email: 'vet@smart-agri.ke',
  phone: '0712554433',
  role: 'veterinarian',
  county: 'Nakuru',
  subCounty: 'Naivasha',
  town: 'Naivasha',
  organizationName: 'Great Rift Mobile Livestock & Dairy Clinic',
  businessType: 'Licensed Veterinary Surgeon (KVB Registered)',
  licenseNumber: 'KVB-VS-2940',
  nationalIdNumber: '27194028',
  membershipCode: 'SAK-NKR-2024-V8201',
  membershipTier: 'Platinum',
  cooperativeAffiliation: 'Kenya Veterinary Association (KVA)',
  status: 'active',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2023-09-01',
};

export const DEMO_TRANSPORTER: UserProfile = {
  id: 'usr-transporter-01',
  name: 'Joseph Waweru Kinyua',
  email: 'transporter@smart-agri.ke',
  phone: '0722883311',
  role: 'transporter',
  county: 'Nakuru',
  subCounty: 'Nakuru West',
  town: 'Nakuru',
  organizationName: 'Rift Transporters SACCO & Agricultural Logistics',
  businessType: 'Inter-County Agricultural Freight Fleet',
  licenseNumber: 'NTSA-COM-7712',
  nationalIdNumber: '23091845',
  membershipCode: 'SAK-NKR-2024-T5193',
  membershipTier: 'Silver',
  cooperativeAffiliation: 'Agricultural Transporters SACCO',
  status: 'active',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2024-01-10',
};

export const DEMO_LAB: UserProfile = {
  id: 'usr-lab-01',
  name: 'Dr. Anne Mwende',
  email: 'lab@smart-agri.ke',
  phone: '0722206986',
  role: 'lab',
  county: 'Nairobi',
  subCounty: 'Westlands',
  town: 'Kabete',
  organizationName: 'KALRO National Agricultural Research Laboratories (NARL)',
  businessType: 'National Soil, Plant Tissue & Water Testing Lab',
  licenseNumber: 'KENAS-ISO-17025-TL-014',
  nationalIdNumber: '20194821',
  membershipCode: 'SAK-NBI-2023-L6402',
  membershipTier: 'Platinum',
  cooperativeAffiliation: 'Kenya National Laboratory Accreditation Service',
  status: 'active',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2023-04-20',
};

export const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  name: 'Admin Derick Onyango',
  email: 'admin@smart-agri.ke',
  phone: '0700000001',
  role: 'admin',
  county: 'Nairobi',
  subCounty: 'Westlands',
  town: 'Nairobi CBD',
  organizationName: 'SMART-AGRI KENYA Headquarters',
  businessType: 'Central Operations, KYC & Governance',
  nationalIdNumber: '29104821',
  membershipCode: 'SAK-HQ-2023-A0001',
  membershipTier: 'Platinum',
  cooperativeAffiliation: 'Ministry of Agriculture Operations',
  status: 'active',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2023-01-01',
  adminPermissions: {
    manageUsers: true,
    manageAdmins: false,
    manageMarketplace: true,
    manageOrders: true,
    managePayments: false,
    manageContent: true,
    manageBranding: false,
    manageDelivery: true,
    manageSettings: false,
    viewReports: true,
  }
};

export const DEMO_MAIN_SUPER_ADMIN: UserProfile = {
  id: 'usr-owner-01',
  name: 'Derick Onyango (Main Super Admin)',
  email: 'onyangoderick37@gmail.com',
  phone: '0700000000',
  role: 'admin',
  isMainSuperAdmin: true,
  county: 'Nairobi',
  subCounty: 'Westlands',
  town: 'Nairobi HQ',
  organizationName: 'DERIV-AGRI KENYA Executive Office',
  businessType: 'Central Governance & Exclusive Main Super Admin',
  nationalIdNumber: '29104821',
  membershipCode: 'SAK-HQ-2026-OWNER',
  membershipTier: 'Platinum',
  status: 'active',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2023-01-01',
  adminPermissions: {
    manageUsers: true,
    manageAdmins: true,
    manageMarketplace: true,
    manageOrders: true,
    managePayments: true,
    manageContent: true,
    manageBranding: true,
    manageDelivery: true,
    manageSettings: true,
    viewReports: true,
  }
};

export const DEFAULT_BRANDING: PlatformBranding = {
  platformName: 'DERIV-AGRI KENYA',
  logoUrl: '/images/smart_agri_logo.png',
  emblemUrl: '/images/smart_agri_emblem.png',
  heroBannerUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80',
  primaryColor: '#214E34',
  secondaryColor: '#D6A545',
  supportPhone: '+254 700 000 000',
  supportEmail: 'support@deriv-agri.ke',
  headquartersAddress: 'SMART-AGRI Tower, Waiyaki Way, Westlands, Nairobi, Kenya',
};

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  baseFeeKsh: 350,
  perKmRateKsh: 35,
  expressSurchargeKsh: 500,
  freeDeliveryThresholdKsh: 25000,
  countyRates: {
    'Nairobi': 300,
    'Kiambu': 450,
    'Nakuru': 500,
    'Uasin Gishu': 750,
    'Mombasa': 900,
    'Kisumu': 800,
    'Machakos': 550,
    'Meru': 700,
    'Nyeri': 600,
  },
  activeCarriers: ['Safaricom Boda Parcel', 'Fargo Courier', 'Speedaf Express', 'Local Cooperative Transport SACCO'],
};

export const DEFAULT_GOVERNANCE_SETTINGS: PlatformGovernanceSettings = {
  allowPublicRegistrations: true,
  requireKycForSellers: true,
  maintenanceMode: false,
  maintenanceNotice: 'Scheduled routine agricultural database optimization. We will be back online shortly.',
  lowStockAlertThreshold: 5,
  orderEscrowAutoReleaseDays: 3,
  enableDisputeArbitration: true,
};

export const ALL_DEMO_USERS: UserProfile[] = [
  DEMO_MAIN_SUPER_ADMIN,
  DEMO_ADMIN,
  DEMO_FARMER,
  DEMO_BUYER,
  DEMO_SELLER,
  DEMO_CONSULTANT,
  DEMO_VETERINARIAN,
  DEMO_TRANSPORTER,
  DEMO_LAB,
];

export const DEFAULT_USER: UserProfile = DEMO_FARMER;
export const ADMIN_USER: UserProfile = DEMO_MAIN_SUPER_ADMIN;

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-001',
    timestamp: '2026-10-21 07:15 AM',
    actorEmail: 'admin@smart-agri.ke',
    actorRole: 'admin' as const,
    action: 'SYSTEM_BOOTSTRAP',
    target: 'SMART-AGRI KENYA Security Engine',
    status: 'SUCCESS' as const,
    ipAddress: '197.237.112.44 (Nairobi, Kenya)',
  },
  {
    id: 'log-002',
    timestamp: '2026-10-21 07:42 AM',
    actorEmail: 'admin@smart-agri.ke',
    actorRole: 'admin' as const,
    action: 'KYC_SELLER_APPROVAL',
    target: 'James Mworia (Rift Valley Agrovet)',
    status: 'SUCCESS' as const,
    ipAddress: '197.237.112.44 (Nairobi, Kenya)',
  },
  {
    id: 'log-003',
    timestamp: '2026-10-21 08:05 AM',
    actorEmail: 'farmer@smart-agri.ke',
    actorRole: 'farmer' as const,
    action: 'MEMBER_LOGIN',
    target: 'Samuel Kiprop Kimani Session',
    status: 'SUCCESS' as const,
    ipAddress: '102.68.22.18 (Nakuru, Kenya)',
  },
];

// Initial Seed Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SA-KE-2026-9041',
    buyerId: 'usr-farmer-01',
    buyerName: 'Samuel Kiprop Kimani',
    buyerPhone: '0722123456',
    deliveryCounty: 'Nakuru',
    deliveryTown: 'Njoro',
    deliveryAddress: 'Plot 42, Nessuit Road near Dairy Co-op',
    items: [
      {
        productId: 'prod-input-1',
        productTitle: 'Certified Seed Maize - Kenya Seed H614D',
        category: 'inputs',
        unit: '2kg packet',
        quantity: 10,
        unitPriceKsh: 580,
        totalPriceKsh: 5800,
        sellerId: 'user-agro-1',
        sellerName: 'Rift Valley Agrovet Wholesalers',
        sellerPhone: '0722334455',
        selectedDelivery: 'delivery',
        shippingCostKsh: 850,
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
      }
    ],
    subtotalKsh: 5800,
    shippingTotalKsh: 850,
    grandTotalKsh: 6650,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    mpesaReceiptNumber: 'SK72910M4',
    orderStatus: 'in_transit',
    transporterDetails: {
      name: 'Joseph Waweru',
      phone: '0722883311',
      vehiclePlate: 'KDG 492X',
      vehicleType: 'Probox / Small Van',
    },
    trackingSteps: [
      { status: 'placed', label: 'Order Confirmed', description: 'Paid via M-Pesa STK Push (SK72910M4)', timestamp: '2026-10-16 08:30 AM', completed: true },
      { status: 'confirmed', label: 'Dispatched by Seller', description: 'Packed at Kitale Central Agrovet', timestamp: '2026-10-16 11:15 AM', completed: true },
      { status: 'in_transit', label: 'On Route via A104 Highway', description: 'Driver reached Timboroa, heading towards Nakuru', timestamp: '2026-10-17 07:45 AM', completed: true },
      { status: 'delivered', label: 'Delivered', description: 'Recipient to sign pickup code', timestamp: 'Estimated Today 02:00 PM', completed: false },
    ],
    createdAt: '2026-10-16T08:30:00Z',
  }
];

// Initial Seed Soil Test
const INITIAL_SOIL_REQUESTS: SoilTestRequest[] = [
  {
    id: 'soil-req-01',
    sampleCode: 'NARL-2026-8812',
    farmerId: 'usr-farmer-01',
    farmerName: 'Samuel Kiprop Kimani',
    farmerPhone: '0722123456',
    county: 'Nakuru',
    subCounty: 'Njoro',
    fieldName: 'Upper Boma Maize Field (Block A)',
    farmSizeAcres: 5,
    intendedCrop: 'Maize (Hybrid 614D) & Beans',
    previousCrop: 'Maize (continuous 3 seasons)',
    previousFertilizer: 'DAP only at planting (50kg/acre)',
    submissionMethod: 'courier_dispatch',
    labId: 'lab-kalro-narl',
    labName: 'KALRO National Agricultural Research Laboratories (NARL)',
    status: 'completed',
    requestedAt: '2026-10-05T09:00:00Z',
    result: {
      ph: 5.2,
      phClassification: 'Moderately Acidic',
      nitrogenPercent: 0.16,
      phosphorusPpm: 12.4, // Low
      potassiumPpm: 210, // Adequate
      organicMatterPercent: 2.1,
      soilTexture: 'Red Volcanic Clay',
      salinityEc: 0.28,
      suitabilityScore: 74,
      limeRequirementKgPerAcre: 600,
      recommendedBasalFertilizer: 'Apply NPK 23:23:0 or Mavuno Planting Fertilizer instead of DAP to avoid further soil acidification.',
      recommendedTopDressing: 'CAN (Calcium Ammonium Nitrate) at 75kg/acre when maize is knee-high (V6 stage).',
      organicRemedies: [
        'Apply 5 tonnes/acre of well-composted farmyard cattle manure to boost organic carbon.',
        'Incorporate agricultural lime (CaCO3) 4 weeks prior to onset of next planting rains.',
        'Rotate with cowpeas or lablab legume cover crop to fix biological atmospheric nitrogen.'
      ],
      agronomistNotes: 'Significant soil acidification observed due to repeated continuous DAP application without liming. Phosphorus availability is currently locked by exchangeable aluminum ions. Liming will unlock natural soil phosphate.',
      labOfficerName: 'Dr. Anne Mwende, Senior Soil Analyst (NARL)',
      reportPdfUrl: '#',
    }
  }
];

// Initial Seed Forum Posts
const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-farmer-01',
    authorName: 'Samuel Kiprop Kimani',
    authorRole: 'farmer',
    authorCounty: 'Nakuru',
    title: 'How we increased dairy milk yield from 18L to 31L per cow in Rongai',
    content: 'Fellow farmers, we recently shifted our feeding protocol from ordinary Napier to wilted silage combined with Desmodium legume fodder and a balanced 16% dairy concentrate. Making sure cows have clean ad-libitum water 24/7 made a dramatic difference! Don\'t overlook water intake.',
    category: 'Dairy & Livestock',
    likes: 47,
    repliesCount: 16,
    isVerifiedFarmer: true,
    createdAt: '2026-10-15T14:20:00Z',
  },
  {
    id: 'post-2',
    authorId: 'user-agro-1',
    authorName: 'Rift Valley Agrovet',
    authorRole: 'expert',
    authorCounty: 'Uasin Gishu',
    title: 'Alert: Early scouting for Fall Armyworm in late-season maize',
    content: 'Farmers in Uasin Gishu and Trans-Nzoia should scout fields twice a week. Check the central funnel for fresh sawdust frass. Spray early morning before caterpillars bury deep into the whorl. Recommended actives include Chlorantraniliprole and Emamectin Benzoate.',
    category: 'Crop Protection',
    likes: 35,
    repliesCount: 9,
    isVerifiedFarmer: true,
    createdAt: '2026-10-14T09:10:00Z',
  },
  {
    id: 'post-3',
    authorId: 'usr-buyer-02',
    authorName: 'Grace Njeri (Mombasa Grocers)',
    authorRole: 'buyer',
    authorCounty: 'Mombasa',
    title: 'Looking for reliable suppliers of 50 tonnes of Shangi potatoes weekly',
    content: 'We supply hotel chains in Mombasa and Diani. Looking for Nyandarua or Molo farmers who can guarantee consistent grade 1 Shangi potatoes delivered to Kongowea Market. Direct payments via M-Pesa or bank guarantee on delivery.',
    category: 'Market & Pricing',
    likes: 62,
    repliesCount: 28,
    isVerifiedFarmer: true,
    createdAt: '2026-10-13T16:00:00Z',
  }
];

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
  followUpDate?: string;
  contactPhone: string;
  savedOffline: boolean;
}

const INITIAL_CONSULTATION_NOTES: ConsultationNoteRecord[] = [
  {
    id: 'note-001',
    expertName: 'Dr. Evans Kiprotich',
    expertTitle: 'Principal Agronomist & Cereal Specialist',
    institution: 'KALRO Njoro Centre',
    county: 'Nakuru',
    date: '2026-10-18',
    cropOrLivestock: 'French Beans & Hybrid Maize (H614D)',
    farmChallenge: 'Interveinal leaf chlorosis and severe soil acidification (pH 5.2) due to continuous DAP fertilization.',
    prescriptionOrAdvice: 'Broadcast 1.2 metric tonnes/acre of agricultural lime (CaCO3) minimum 3 weeks before planting rain onset. For basal fertilization, transition to NPK 23:23:0 or Mavuno planting fertilizer. Top-dress with CAN (26% N) at knee-height (V6) at 75kg/acre.',
    actionItems: [
      'Incorporate agricultural lime before October short rains.',
      'Scout for fall armyworm at early seedling stage twice weekly.',
      'Avoid unbuffered DAP on plots with pH below 5.5.'
    ],
    followUpDate: '2026-11-15',
    contactPhone: '+254 722 456 789',
    savedOffline: true,
  },
  {
    id: 'note-002',
    expertName: 'Dr. Mary Wambui',
    expertTitle: 'Senior Veterinary Surgeon (KVB Reg. #2184)',
    institution: 'Kabete Veterinary Diagnostic Services',
    county: 'Kiambu',
    date: '2026-10-15',
    cropOrLivestock: 'Holstein Friesian Dairy Cattle',
    farmChallenge: 'Tick-borne disease management and dairy mastitis prevention in zero-grazing stall.',
    prescriptionOrAdvice: 'Dip or knapsack spray with Amitraz 12.5% EC every 7 days without skipping. For clinical East Coast Fever cases with swollen prescapular lymph nodes, treat immediately with Buparvaquone (2.5 mg/kg IM) and Oxytetracycline 20% LA. Perform post-milking teat dipping using 0.5% iodophor solution.',
    actionItems: [
      'Weekly Thursday acaricide spray routine for entire herd.',
      'Check cow udder quarters before each morning milking.',
      'Store veterinary antibiotics in cool insulated cooler box.'
    ],
    followUpDate: '2026-10-30',
    contactPhone: '+254 711 987 654',
    savedOffline: true,
  },
  {
    id: 'note-003',
    expertName: 'Eng. Peter Ochieng',
    expertTitle: 'Agricultural Engineer & Water Harvesting Specialist',
    institution: 'National Irrigation Authority (NIA)',
    county: 'Machakos',
    date: '2026-10-10',
    cropOrLivestock: 'Greenhouse Tomatoes & Capsicum',
    farmChallenge: 'Drip line emitter clogging from high calcium carbonates in borehole water.',
    prescriptionOrAdvice: 'Perform periodic acid flushing using food-grade nitric acid (HNO3) diluted to pH 2.0 through Venturi injector for 15 minutes, followed by 30-minute clean water flushing. Install a 120-mesh dual disk filter downstream of borehole pump.',
    actionItems: [
      'Flush drip lines end-caps every 2 weeks.',
      'Clean disk filter elements weekly with soft brush.',
      'Monitor lateral line operating pressure at 1.0 - 1.2 bar.'
    ],
    followUpDate: '2026-11-01',
    contactPhone: '+254 733 221 100',
    savedOffline: true,
  }
];

// Initial Agricultural Intelligence Seeds
const INITIAL_SOIL_REPORTS: SoilAnalysisReport[] = [
  {
    id: 'soil-rep-001',
    createdAt: '2026-10-20T10:15:00Z',
    farmerId: 'usr-farmer-01',
    cropName: 'Maize (Zea mays)',
    input: {
      county: 'Nakuru',
      crop: 'Maize (Zea mays)',
      soilType: 'Red Volcanic Clay (Nitisol)',
      soilPh: 5.2,
      moisturePercent: 38,
      fertilizerHistory: 'Continuous DAP application (50kg/acre) for 4 consecutive seasons with no liming.',
      observedSymptoms: ['Stunted early vegetative growth', 'Purple tinting on lower leaf midribs (P deficiency)', 'Poor root anchorage'],
      fieldSizeAcres: 2.5,
    },
    phAnalysis: {
      value: 5.2,
      rating: 'Moderately Acidic',
      optimalRange: '5.8 - 7.0',
      impactExplanation: 'At pH 5.2, free exchangeable Aluminum (Al3+) binds available soil phosphates, rendering up to 65% of applied phosphorus unavailable to root hairs. Nitrogen uptake efficiency is reduced by ~40%.',
      limeRequiredKgPerAcre: 1000,
    },
    nutrientStatuses: [
      {
        nutrient: 'N',
        status: 'Low',
        explanation: 'Nitrogen mineralization is slow in acidic soils; top-dressing with CAN required at knee-height.',
      },
      {
        nutrient: 'P',
        status: 'Deficient',
        explanation: 'Phosphorus availability severely locked by acid fixation. Broadcast agricultural lime before re-applying phosphate.',
      },
      {
        nutrient: 'K',
        status: 'Optimal',
        explanation: 'Volcanic clay soils in Nakuru typically retain adequate exchangeable potassium.',
      },
      {
        nutrient: 'Organic Carbon',
        status: 'Low',
        explanation: 'Organic matter depleted from repeated tillage. Cattle manure will buffer cation exchange capacity.',
      },
      {
        nutrient: 'Salinity',
        status: 'Optimal',
        explanation: 'Low electrical conductivity (<0.8 dS/m); no salinity hazard.',
      }
    ],
    fertilizerPlan: {
      areaTreated: '2.5 Acres (calculated at standard rate per acre)',
      assumptions: 'Assumes agricultural limestone (CaCO3, 85% CCE) incorporated 3-4 weeks before planting rains. Basal fertilizer applied in furrow 5cm away from seed.',
      basalFertilizer: {
        product: 'NPK 23:23:0 or Mavuno Planting Fertilizer',
        rateKgPerAcre: 75,
        applicationTiming: 'At planting, banded 5cm to the side and 5cm below the seed furrow.',
        notes: 'Avoid pure DAP on soils below pH 5.5 to prevent compounding acidification.',
      },
      topDressing: {
        product: 'Calcium Ammonium Nitrate (CAN 26% N)',
        rateKgPerAcre: 75,
        applicationTiming: 'Split application: 50% at V6 (knee-height) and 50% just prior to tasseling.',
        notes: 'Apply when soil is moist, avoid direct contact with leaf funnels.',
      },
      organicRemedies: [
        'Broadcast 4 - 5 tonnes/acre of well-composted farmyard cattle manure.',
        'Incorporate 1,000 kg/acre agricultural lime (CaCO3) minimum 3 weeks prior to rain onset.',
        'Rotate with cowpeas or lablab cover crop to regenerate soil organic nitrogen.'
      ],
    },
    laboratoryVerificationRequired: false,
    confidenceScore: 'Verified Measurements',
    recommendedNextSteps: [
      'Order agricultural lime from approved agro-dealers in Nakuru.',
      'Allow lime to react with moist soil for 3-4 weeks before planting.',
      'Schedule a follow-up pH check in 12 months after harvest.'
    ],
  }
];

const INITIAL_IRRIGATION_SCHEDULES: IrrigationScheduleReport[] = [
  {
    id: 'irrig-001',
    createdAt: '2026-10-22T08:30:00Z',
    input: {
      county: 'Machakos',
      crop: 'Tomatoes (Solanum lycopersicum)',
      growthStage: 'flowering',
      soilType: 'Sandy Loam',
      fieldAreaAcres: 1.0,
      irrigationMethod: 'drip',
      waterSource: 'Earth Dam / Borehole',
      flowRateLitersPerHour: 2400,
    },
    referenceEt0MmPerDay: 5.2,
    cropCoefficientKc: 1.15,
    netCropWaterDemandMmPerDay: 5.98,
    effectiveRainfallMmPerDay: 0,
    irrigationNeeded: true,
    systemEfficiencyPercent: 90,
    grossWaterRequirementMm: 6.64,
    waterVolumeTotalLiters: 26890,
    waterVolumeM3: 26.89,
    recommendedDurationHours: 11.2,
    recommendedDurationMinutes: 672,
    irrigationTimingAdvice: 'Split into two irrigation pulses: early morning (06:00 - 09:30 AM) and late afternoon (04:30 - 07:00 PM) to minimize evaporative losses.',
    drainageAdvice: 'Sandy loam allows rapid percolation (25-35 mm/hr); pulse irrigation prevents nutrient leaching past the 40cm root zone.',
    waterConservationTips: [
      'Apply grass or plastic mulch to suppress bare soil evaporation by up to 35%.',
      'Inspect drip line end-caps for emitter clogging caused by borehole mineral scaling.',
      'Check soil tension with a tensiometer to avoid over-irrigating during fruit set.'
    ],
    isEstimate: true,
    calculationMethod: 'FAO-56 Penman-Monteith ETc = ETo (5.2 mm/d) x Kc (1.15) with 90% Drip Efficiency on 1.0 Acre (4,047 L/mm/acre).',
  }
];

const INITIAL_PEST_DIAGNOSES: PestDiagnosisReport[] = [
  {
    id: 'diag-001',
    createdAt: '2026-10-23T14:10:00Z',
    farmerId: 'usr-farmer-01',
    targetType: 'crop',
    targetHost: 'Maize (Zea mays) - V5 Stage',
    symptomsSubmitted: 'Window-pane feeding marks on leaf whorl, coarse sawdust frass inside funnel, small caterpillars visible.',
    imageProvided: true,
    isImageClear: true,
    preliminaryAssessmentNote: 'Clear daylight photograph displaying characteristic inverted Y-mark on head capsule and four abdominal spots.',
    primaryDiagnosis: {
      name: 'Fall Armyworm (Spodoptera frugiperda)',
      scientificName: 'Spodoptera frugiperda (Smith)',
      confidence: 'High',
      confidencePercent: 94,
      category: 'pest',
      visualEvidence: [
        'Characteristic inverted white "Y" suture on head capsule.',
        'Four dark pinacula arranged in square formation on the 8th abdominal segment.',
        'Window-pane feeding lesions and coarse moist frass plugged into central whorl.'
      ],
    },
    differentialDiagnoses: [
      {
        name: 'African Maize Stalk Borer (Busseola fusca)',
        confidencePercent: 6,
        distinguishingFeatures: 'Lacks the distinct square 4-dot pattern on abdominal segment 8; boring occurs lower on stem rather than whorl surface.',
      }
    ],
    integratedPestManagement: {
      culturalPhysicalControls: [
        'Hand-pick and crush egg masses and early-instar larvae in smallholder plots.',
        'Drop a pinch of dry fine wood ash or sand mixed with lime into the funnel to suffocate larvae.',
        'Plant push-pull trap crops: Desmodium between maize rows and Napier grass on field margins.'
      ],
      biologicalControls: [
        'Apply Bacillus thuringiensis (Bt) or Beauveria bassiana bio-insecticides during early instar stages.',
        'Spray cold-pressed Neem seed oil (Azadirachtin 0.03% EC) at 3-5 ml per liter of water.'
      ],
      pcpbAuthorizedChemicals: [
        {
          activeIngredient: 'Chlorantraniliprole 200g/L SC (e.g. Coragen)',
          tradeExamples: 'Coragen 200 SC, Belt Expert',
          targetStage: 'Early larval instars (L1-L3) directed into funnel.',
          phiDays: 7,
          ppeRequirement: 'Nitrile gloves, eye goggles, particulate respirator, rubber gumboots.',
          environmentalPrecautions: 'Harmful to aquatic organisms; do not spray within 15m of rivers or open water.',
        },
        {
          activeIngredient: 'Emamectin Benzoate 50g/kg WDG',
          tradeExamples: 'Prove 1.92 EC, Kingo 50 WDG',
          targetStage: 'Whorl application at early threshold (5% infested plants).',
          phiDays: 14,
          ppeRequirement: 'Full chemical-resistant overalls, chemical respirator, gloves.',
          environmentalPrecautions: 'Extremely toxic to bees; spray exclusively at dawn (05:30 - 07:00 AM) before bee flight.',
        }
      ],
    },
    professionalReferralRequired: false,
    followUpPhotos: [
      {
        id: 'fup-101',
        photoUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=400&q=80',
        date: '2026-10-25',
        notes: 'Follow-up inspection 48 hours post Neem oil spray: active caterpillars absent from funnels, fresh whorl leaf emerging undamaged.',
        status: 'improving',
      }
    ],
  }
];

const INITIAL_AI_TELEMETRY: AiTelemetryMetric[] = [
  {
    id: 'tel-001',
    timestamp: '2026-10-27T08:14:22Z',
    queryType: 'farming_advisory',
    modelUsed: 'gemini-3.8-flash',
    latencyMs: 382,
    wasCacheHit: false,
    tokensUsed: 420,
    status: 'SUCCESS',
  },
  {
    id: 'tel-002',
    timestamp: '2026-10-27T08:20:05Z',
    queryType: 'pest_diagnosis',
    modelUsed: 'gemini-3.8-flash',
    latencyMs: 740,
    wasCacheHit: false,
    tokensUsed: 680,
    status: 'SUCCESS',
  },
  {
    id: 'tel-003',
    timestamp: '2026-10-27T08:35:41Z',
    queryType: 'soil_analysis',
    modelUsed: 'deterministic_agronomy_engine',
    latencyMs: 45,
    wasCacheHit: true,
    tokensUsed: 0,
    status: 'SUCCESS',
  },
  {
    id: 'tel-004',
    timestamp: '2026-10-27T08:48:19Z',
    queryType: 'irrigation',
    modelUsed: 'fao_penman_monteith_calc',
    latencyMs: 18,
    wasCacheHit: true,
    tokensUsed: 0,
    status: 'SUCCESS',
  }
];

const INITIAL_AI_FEEDBACK: AiFeedbackReport[] = [
  {
    id: 'fb-001',
    timestamp: '2026-10-26T11:20:00Z',
    farmerEmail: 'farmer@smart-agri.ke',
    farmerQuery: 'Can I mix Mancozeb and CAN fertilizer in the same knapsack spray for potatoes?',
    aiResponseText: 'Never combine foliar fertilizer CAN with fungicide Mancozeb in the same spray tank due to chemical scorching risk and spray solution precipitation.',
    feedbackType: 'helpful',
    notes: 'Very clear warning that saved my potato crop from leaf burn.',
    status: 'resolved',
  }
];

// Helper to safely load localStorage
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

class AgriStore {
  private products: Product[];
  private cart: CartItem[];
  private orders: Order[];
  private currentUser: UserProfile;
  private users: UserProfile[];
  private isAuth: boolean;
  private auditLogs: AuditLogEntry[];
  private soilRequests: SoilTestRequest[];
  private forumPosts: ForumPost[];
  private marketPrices: MarketPriceRecord[];
  private inquiries: ProductInquiry[];
  private reports: ProductReport[];
  private consultationNotes: ConsultationNoteRecord[];
  private branding: PlatformBranding;
  private deliverySettings: DeliverySettings;
  private governanceSettings: PlatformGovernanceSettings;
  private soilAnalysisReports: SoilAnalysisReport[];
  private irrigationSchedules: IrrigationScheduleReport[];
  private pestDiagnoses: PestDiagnosisReport[];
  private aiTelemetryMetrics: AiTelemetryMetric[];
  private aiFeedbackReports: AiFeedbackReport[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Combine products and livestock as base catalogue
    const allInitialProducts = [...SAMPLE_PRODUCTS, ...SAMPLE_LIVESTOCK];
    const storedProducts = getLocal<Product[]>(LOCAL_STORAGE_KEY_PRODUCTS, []);
    const productMap = new Map<string, Product>();
    // Seed initial catalogue
    allInitialProducts.forEach(p => productMap.set(p.id, p));
    // Overlay stored changes or user-added listings
    storedProducts.forEach(p => productMap.set(p.id, p));
    this.products = Array.from(productMap.values());

    this.cart = getLocal<CartItem[]>(LOCAL_STORAGE_KEY_CART, []);
    this.orders = getLocal<Order[]>(LOCAL_STORAGE_KEY_ORDERS, INITIAL_ORDERS);
    this.currentUser = getLocal<UserProfile>(LOCAL_STORAGE_KEY_USER, DEMO_FARMER);
    this.isAuth = getLocal<boolean>(LOCAL_STORAGE_KEY_AUTH, true);
    this.users = getLocal<UserProfile[]>(LOCAL_STORAGE_KEY_USERS, ALL_DEMO_USERS);
    this.auditLogs = getLocal<AuditLogEntry[]>(LOCAL_STORAGE_KEY_AUDIT, INITIAL_AUDIT_LOGS);
    this.soilRequests = getLocal<SoilTestRequest[]>(LOCAL_STORAGE_KEY_SOIL, INITIAL_SOIL_REQUESTS);
    this.forumPosts = getLocal<ForumPost[]>(LOCAL_STORAGE_KEY_FORUM, INITIAL_FORUM_POSTS);
    this.inquiries = getLocal<ProductInquiry[]>(LOCAL_STORAGE_KEY_INQUIRIES, []);
    this.reports = getLocal<ProductReport[]>(LOCAL_STORAGE_KEY_REPORTS, []);
    this.marketPrices = getLocal<MarketPriceRecord[]>(LOCAL_STORAGE_KEY_PRICES, SAMPLE_MARKET_PRICES);
    this.branding = getLocal<PlatformBranding>(LOCAL_STORAGE_KEY_BRANDING, DEFAULT_BRANDING);
    this.deliverySettings = getLocal<DeliverySettings>(LOCAL_STORAGE_KEY_DELIVERY, DEFAULT_DELIVERY_SETTINGS);
    this.governanceSettings = getLocal<PlatformGovernanceSettings>(LOCAL_STORAGE_KEY_GOVERNANCE, DEFAULT_GOVERNANCE_SETTINGS);
    this.consultationNotes = getLocal<ConsultationNoteRecord[]>(LOCAL_STORAGE_KEY_CONSULTATIONS, INITIAL_CONSULTATION_NOTES);
    const storedPrices = getLocal<MarketPriceRecord[]>(LOCAL_STORAGE_KEY_PRICES, []);
    const priceMap = new Map<string, MarketPriceRecord>();
    SAMPLE_MARKET_PRICES.forEach(p => priceMap.set(p.id, p));
    storedPrices.forEach(p => priceMap.set(p.id, p));
    this.marketPrices = Array.from(priceMap.values());

    this.inquiries = getLocal<ProductInquiry[]>(LOCAL_STORAGE_KEY_INQUIRIES, [
      {
        id: 'inq-sample-1',
        productId: 'live-chk-kienyeji-nakuru',
        productTitle: 'Vaccinated KALRO Improved Kienyeji Growers (Nakuru)',
        sellerId: 'usr-farmer-01',
        buyerId: 'usr-buyer-01',
        buyerName: 'Grace Muthoni Wanjiku',
        buyerPhone: '0711223344',
        message: 'Hello, are the 150 birds available for pickup in Rongai this weekend? Are the vaccination certificates signed by a registered vet?',
        requestedQuantity: 50,
        deliveryPreference: 'pickup',
        status: 'pending',
        createdAt: '2026-10-18T11:30:00Z',
      }
    ]);
    this.reports = getLocal<ProductReport[]>(LOCAL_STORAGE_KEY_REPORTS, []);
    this.consultationNotes = getLocal<ConsultationNoteRecord[]>(LOCAL_STORAGE_KEY_CONSULTATIONS, INITIAL_CONSULTATION_NOTES);
    this.soilAnalysisReports = getLocal<SoilAnalysisReport[]>(LOCAL_STORAGE_KEY_SOIL_REPORTS, INITIAL_SOIL_REPORTS);
    this.irrigationSchedules = getLocal<IrrigationScheduleReport[]>(LOCAL_STORAGE_KEY_IRRIGATION, INITIAL_IRRIGATION_SCHEDULES);
    this.pestDiagnoses = getLocal<PestDiagnosisReport[]>(LOCAL_STORAGE_KEY_PEST_DIAGNOSES, INITIAL_PEST_DIAGNOSES);
    this.aiTelemetryMetrics = getLocal<AiTelemetryMetric[]>(LOCAL_STORAGE_KEY_AI_TELEMETRY, INITIAL_AI_TELEMETRY);
    this.aiFeedbackReports = getLocal<AiFeedbackReport[]>(LOCAL_STORAGE_KEY_AI_FEEDBACK, INITIAL_AI_FEEDBACK);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.products;
  }

  public addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };
    this.products = [newProduct, ...this.products];
    setLocal(LOCAL_STORAGE_KEY_PRODUCTS, this.products);
    this.notify();
    return newProduct;
  }

  public updateProductStatus(id: string, status: Product['status']) {
    this.products = this.products.map(p => p.id === id ? { ...p, status } : p);
    setLocal(LOCAL_STORAGE_KEY_PRODUCTS, this.products);
    this.notify();
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    let updatedProduct: Product | null = null;
    this.products = this.products.map(p => {
      if (p.id === id) {
        updatedProduct = { ...p, ...updates };
        return updatedProduct;
      }
      return p;
    });
    if (updatedProduct) {
      setLocal(LOCAL_STORAGE_KEY_PRODUCTS, this.products);
      this.notify();
    }
    return updatedProduct;
  }

  public deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    setLocal(LOCAL_STORAGE_KEY_PRODUCTS, this.products);
    this.notify();
  }

  // --- Cart ---
  public getCart(): CartItem[] {
    return this.cart;
  }

  public addToCart(product: Product, quantity: number = 1, deliveryPreference: 'pickup' | 'delivery' = 'delivery', shippingCostKsh: number = 500) {
    const existingIndex = this.cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
      this.cart[existingIndex].shippingCostKsh = shippingCostKsh;
    } else {
      this.cart.push({
        product,
        quantity,
        selectedDelivery: deliveryPreference,
        shippingCostKsh: deliveryPreference === 'delivery' ? shippingCostKsh : 0,
      });
    }
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  public updateCartQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cart = this.cart.map(item => item.product.id === productId ? { ...item, quantity } : item);
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  public updateCartDelivery(productId: string, selectedDelivery: 'pickup' | 'delivery', shippingCostKsh: number) {
    this.cart = this.cart.map(item => 
      item.product.id === productId 
        ? { ...item, selectedDelivery, shippingCostKsh: selectedDelivery === 'delivery' ? shippingCostKsh : 0 } 
        : item
    );
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  public removeFromCart(productId: string) {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  public clearCart() {
    this.cart = [];
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return this.orders;
  }

  public createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingSteps'>): Order {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SA-KE-${new Date().getFullYear()}-${randomDigits}`;

    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      trackingSteps: [
        { status: 'placed', label: 'Order Received', description: 'Pending confirmation from seller', timestamp: new Date().toLocaleTimeString(), completed: true },
        { status: 'confirmed', label: 'Seller Preparation', description: 'Inspection and packaging in progress', timestamp: 'Pending', completed: false },
        { status: 'in_transit', label: 'In Transit', description: 'Assigned to licensed transporter', timestamp: 'Pending', completed: false },
        { status: 'delivered', label: 'Delivered', description: 'Buyer confirmation and release', timestamp: 'Pending', completed: false },
      ],
    };

    this.orders = [newOrder, ...this.orders];
    setLocal(LOCAL_STORAGE_KEY_ORDERS, this.orders);
    this.clearCart();
    this.notify();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus'], mpesaReceipt?: string) {
    this.orders = this.orders.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, orderStatus };
        if (paymentStatus) updated.paymentStatus = paymentStatus;
        if (mpesaReceipt) updated.mpesaReceiptNumber = mpesaReceipt;
        // update tracking steps
        if (orderStatus === 'seller_confirmed') {
          updated.trackingSteps[1].completed = true;
          updated.trackingSteps[1].timestamp = new Date().toLocaleTimeString();
        } else if (orderStatus === 'in_transit') {
          updated.trackingSteps[1].completed = true;
          updated.trackingSteps[2].completed = true;
          updated.trackingSteps[2].timestamp = new Date().toLocaleTimeString();
        } else if (orderStatus === 'delivered') {
          updated.trackingSteps.forEach(s => s.completed = true);
        }
        return updated;
      }
      return o;
    });
    setLocal(LOCAL_STORAGE_KEY_ORDERS, this.orders);
    this.notify();
  }

  // --- User & Auth ---
  public isAuthenticated(): boolean {
    return this.isAuth;
  }

  public setAuthenticated(auth: boolean): void {
    this.isAuth = auth;
    setLocal(LOCAL_STORAGE_KEY_AUTH, auth);
    this.notify();
  }

  public logout(): void {
    this.isAuth = false;
    setLocal(LOCAL_STORAGE_KEY_AUTH, false);
    this.addAuditLog({
      actorEmail: this.currentUser?.email || 'user@smart-agri.ke',
      actorRole: this.currentUser?.role || 'farmer',
      action: 'MEMBER_LOGOUT',
      target: `User signed out: ${this.currentUser?.name || 'Session'}`,
      status: 'SUCCESS',
    });
    this.notify();
  }

  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    this.isAuth = true;
    setLocal(LOCAL_STORAGE_KEY_USER, user);
    setLocal(LOCAL_STORAGE_KEY_AUTH, true);
    this.addAuditLog({
      actorEmail: user.email,
      actorRole: user.role,
      action: 'SESSION_ACTIVATED',
      target: `${user.name} (${user.role}) [Code: ${user.membershipCode || 'N/A'}]`,
      status: 'SUCCESS',
    });
    this.notify();
  }

  public getUsers(): UserProfile[] {
    return this.users;
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.users.find(u => u.id === id);
  }

  public registerUser(userData: Omit<UserProfile, 'id' | 'joinedDate'>): UserProfile {
    const generatedCode = userData.membershipCode || generateMembershipCode(userData.county, userData.role);
    const newUser: UserProfile = {
      ...userData,
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      membershipCode: generatedCode,
      membershipTier: userData.membershipTier || (userData.role === 'admin' ? 'Platinum' : userData.role === 'consultant' || userData.role === 'veterinarian' ? 'Gold' : 'Silver'),
      status: userData.role === 'admin' ? 'active' : (userData.role === 'farmer' || userData.role === 'buyer' ? 'active' : 'pending_verification'),
      isVerified: userData.role === 'admin' || userData.role === 'farmer',
    };

    this.users = [newUser, ...this.users];
    setLocal(LOCAL_STORAGE_KEY_USERS, this.users);

    this.currentUser = newUser;
    this.isAuth = true;
    setLocal(LOCAL_STORAGE_KEY_USER, this.currentUser);
    setLocal(LOCAL_STORAGE_KEY_AUTH, true);

    this.addAuditLog({
      actorEmail: newUser.email,
      actorRole: newUser.role,
      action: 'USER_REGISTRATION',
      target: `New member registered: ${newUser.name} [Role: ${newUser.role}, Code: ${newUser.membershipCode}]`,
      status: 'SUCCESS',
    });

    this.notify();
    return newUser;
  }

  public authenticate(identifier: string, pass: string): UserProfile {
    const trimmed = identifier.trim().toLowerCase();
    
    // Check against all users by exact email, phone, or membershipCode
    const matchedUser = this.users.find(u => 
      u.email.toLowerCase() === trimmed || 
      u.email.toLowerCase().replace('@deriv-agri.ke', '@smart-agri.ke') === trimmed ||
      u.email.toLowerCase().replace('@smart-agri.ke', '@deriv-agri.ke') === trimmed ||
      u.phone.replace(/\D/g, '') === trimmed.replace(/\D/g, '') ||
      (u.membershipCode && u.membershipCode.toLowerCase() === trimmed)
    );

    if (matchedUser) {
      if (matchedUser.status === 'suspended') {
        this.addAuditLog({
          actorEmail: matchedUser.email,
          actorRole: matchedUser.role,
          action: 'LOGIN_BLOCKED_SUSPENDED',
          target: matchedUser.email,
          status: 'WARNING',
        });
        throw new Error('This account has been temporarily suspended by the platform administrator.');
      }

      this.currentUser = matchedUser;
      this.isAuth = true;
      setLocal(LOCAL_STORAGE_KEY_USER, this.currentUser);
      setLocal(LOCAL_STORAGE_KEY_AUTH, true);

      this.addAuditLog({
        actorEmail: matchedUser.email,
        actorRole: matchedUser.role,
        action: 'MEMBER_LOGIN',
        target: `Authenticated session: ${matchedUser.name} [${matchedUser.membershipCode || 'N/A'}]`,
        status: 'SUCCESS',
      });

      this.notify();
      return matchedUser;
    }

    // Fallback: If not found, log attempt and throw
    this.addAuditLog({
      actorEmail: identifier,
      actorRole: 'farmer',
      action: 'LOGIN_FAILURE',
      target: `Failed attempt for identifier: ${identifier}`,
      status: 'FAILED',
    });
    throw new Error('Invalid email, phone number, or member ID. Please check your credentials and try again.');
  }

  public verifyMembershipCode(code: string): MembershipVerificationResult {
    const cleanCode = code.trim().toUpperCase();
    const user = this.users.find(u => u.membershipCode?.toUpperCase() === cleanCode);
    if (user) {
      // MINIMAL NON-PII DATA ONLY: strictly no name, no email, no phone, no financial data
      return {
        code: user.membershipCode || cleanCode,
        isValid: true,
        role: user.role,
        county: user.county,
        status: user.status || 'active',
        membershipTier: user.membershipTier || 'Gold',
        verifiedAt: new Date().toLocaleTimeString('en-GB') + ' ' + new Date().toISOString().split('T')[0],
        notes: 'Official registration status confirmed in authoritative agricultural registry.',
      };
    }
    return {
      code: cleanCode,
      isValid: false,
      status: 'suspended',
      verifiedAt: new Date().toLocaleTimeString('en-GB') + ' ' + new Date().toISOString().split('T')[0],
      notes: 'No active membership record found for this identification code in the national registry.',
    };
  }

  public switchRole(role: UserRole) {
    let targetProfile: UserProfile;

    switch (role) {
      case 'admin':
        targetProfile = DEMO_ADMIN;
        break;
      case 'farmer':
        targetProfile = DEMO_FARMER;
        break;
      case 'buyer':
        targetProfile = DEMO_BUYER;
        break;
      case 'seller':
        targetProfile = DEMO_SELLER;
        break;
      case 'consultant':
      case 'expert':
        targetProfile = DEMO_CONSULTANT;
        break;
      case 'veterinarian':
        targetProfile = DEMO_VETERINARIAN;
        break;
      case 'transporter':
        targetProfile = DEMO_TRANSPORTER;
        break;
      case 'lab':
        targetProfile = DEMO_LAB;
        break;
      default:
        targetProfile = DEMO_FARMER;
    }

    // Ensure it exists in users list
    if (!this.users.some(u => u.id === targetProfile.id)) {
      this.users.push(targetProfile);
      setLocal(LOCAL_STORAGE_KEY_USERS, this.users);
    }

    this.currentUser = { ...targetProfile };
    this.isAuth = true;
    setLocal(LOCAL_STORAGE_KEY_USER, this.currentUser);
    setLocal(LOCAL_STORAGE_KEY_AUTH, true);

    this.addAuditLog({
      actorEmail: targetProfile.email,
      actorRole: targetProfile.role,
      action: 'DEMO_PERSONA_SWITCH',
      target: `Switched active role to: ${targetProfile.role.toUpperCase()} (${targetProfile.name}) [${targetProfile.membershipCode || 'N/A'}]`,
      status: 'SUCCESS',
    });

    this.notify();
  }

  public updateUserStatus(userId: string, status: 'active' | 'pending_verification' | 'suspended') {
    const targetUser = this.users.find(u => u.id === userId);
    if (targetUser && (targetUser.email.toLowerCase() === 'onyangoderick37@gmail.com' || targetUser.isMainSuperAdmin)) {
      this.addAuditLog({
        actorEmail: this.currentUser?.email || 'unknown',
        actorRole: this.currentUser?.role || 'admin',
        action: 'SECURITY_ALERT_IMMUTABLE_SUPER_ADMIN',
        target: `Blocked attempt to modify Main Super Admin status (${targetUser.email})`,
        status: 'FAILED',
      });
      throw new Error('SECURITY VIOLATION: The Main Super Admin account (onyangoderick37@gmail.com) is permanently protected and cannot be suspended, modified, or demoted.');
    }

    this.users = this.users.map(u => u.id === userId ? { ...u, status } : u);
    setLocal(LOCAL_STORAGE_KEY_USERS, this.users);

    if (this.currentUser.id === userId) {
      this.currentUser = { ...this.currentUser, status };
      setLocal(LOCAL_STORAGE_KEY_USER, this.currentUser);
    }

    this.addAuditLog({
      actorEmail: this.currentUser.email,
      actorRole: this.currentUser.role,
      action: 'USER_STATUS_CHANGE',
      target: `User ID ${userId} status changed to ${status}`,
      status: 'SUCCESS',
    });

    this.notify();
  }

  public updateUserRole(userId: string, newRole: UserRole) {
    const targetUser = this.users.find(u => u.id === userId);
    if (targetUser && (targetUser.email.toLowerCase() === 'onyangoderick37@gmail.com' || targetUser.isMainSuperAdmin)) {
      this.addAuditLog({
        actorEmail: this.currentUser?.email || 'unknown',
        actorRole: this.currentUser?.role || 'admin',
        action: 'SECURITY_ALERT_IMMUTABLE_SUPER_ADMIN',
        target: `Blocked attempt to change Main Super Admin role (${targetUser.email})`,
        status: 'FAILED',
      });
      throw new Error('SECURITY VIOLATION: The Main Super Admin role (onyangoderick37@gmail.com) is permanent and cannot be modified or demoted.');
    }

    this.users = this.users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setLocal(LOCAL_STORAGE_KEY_USERS, this.users);

    if (this.currentUser.id === userId) {
      this.currentUser = { ...this.currentUser, role: newRole };
      setLocal(LOCAL_STORAGE_KEY_USER, this.currentUser);
    }

    this.addAuditLog({
      actorEmail: this.currentUser.email,
      actorRole: this.currentUser.role,
      action: 'USER_ROLE_CHANGE',
      target: `User ID ${userId} role changed to ${newRole}`,
      status: 'SUCCESS',
    });

    this.notify();
  }

  public deleteUser(userId: string) {
    const targetUser = this.users.find(u => u.id === userId);
    if (targetUser && (targetUser.email.toLowerCase() === 'onyangoderick37@gmail.com' || targetUser.isMainSuperAdmin)) {
      this.addAuditLog({
        actorEmail: this.currentUser?.email || 'unknown',
        actorRole: this.currentUser?.role || 'admin',
        action: 'SECURITY_ALERT_IMMUTABLE_SUPER_ADMIN',
        target: `Blocked attempt to delete Main Super Admin (${targetUser.email})`,
        status: 'FAILED',
      });
      throw new Error('CRITICAL SECURITY VIOLATION: The Main Super Admin account cannot be removed or deleted.');
    }

    this.users = this.users.filter(u => u.id !== userId);
    setLocal(LOCAL_STORAGE_KEY_USERS, this.users);
    this.addAuditLog({
      actorEmail: this.currentUser.email,
      actorRole: this.currentUser.role,
      action: 'USER_DELETED',
      target: `User ID ${userId} removed`,
      status: 'SUCCESS',
    });
    this.notify();
  }

  // --- Platform Branding Assets ---
  public getBranding(): PlatformBranding {
    return this.branding;
  }

  public updateBranding(updates: Partial<PlatformBranding>): PlatformBranding {
    this.branding = { ...this.branding, ...updates };
    setLocal(LOCAL_STORAGE_KEY_BRANDING, this.branding);
    this.addAuditLog({
      actorEmail: this.currentUser.email,
      actorRole: this.currentUser.role,
      action: 'PLATFORM_BRANDING_UPDATED',
      target: 'Platform logos and branding styles updated without code change',
      status: 'SUCCESS',
    });
    this.notify();
    return this.branding;
  }

  // --- Delivery Settings ---
  public getDeliverySettings(): DeliverySettings {
    return this.deliverySettings;
  }

  public updateDeliverySettings(updates: Partial<DeliverySettings>): DeliverySettings {
    this.deliverySettings = { ...this.deliverySettings, ...updates };
    setLocal(LOCAL_STORAGE_KEY_DELIVERY, this.deliverySettings);
    this.addAuditLog({
      actorEmail: this.currentUser.email,
      actorRole: this.currentUser.role,
      action: 'DELIVERY_SETTINGS_UPDATED',
      target: 'County shipping rates and freight configuration updated',
      status: 'SUCCESS',
    });
    this.notify();
    return this.deliverySettings;
  }

  // --- Platform Governance Settings ---
  public getGovernanceSettings(): PlatformGovernanceSettings {
    return this.governanceSettings;
  }

  public updateGovernanceSettings(updates: Partial<PlatformGovernanceSettings>): PlatformGovernanceSettings {
    this.governanceSettings = { ...this.governanceSettings, ...updates };
    setLocal(LOCAL_STORAGE_KEY_GOVERNANCE, this.governanceSettings);
    this.addAuditLog({
      actorEmail: this.currentUser.email,
      actorRole: this.currentUser.role,
      action: 'PLATFORM_GOVERNANCE_UPDATED',
      target: 'Platform registration rules, KYC, and maintenance state updated',
      status: 'SUCCESS',
    });
    this.notify();
    return this.governanceSettings;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toISOString().split('T')[0],
      ipAddress: entry.ipAddress || '197.237.112.44 (Nairobi, Kenya)',
    };
    this.auditLogs = [newLog, ...this.auditLogs].slice(0, 100);
    setLocal(LOCAL_STORAGE_KEY_AUDIT, this.auditLogs);
    this.notify();
  }

  // --- Soil Tests ---
  public getSoilRequests(): SoilTestRequest[] {
    return this.soilRequests;
  }

  public submitSoilRequest(requestData: Omit<SoilTestRequest, 'id' | 'sampleCode' | 'requestedAt' | 'status'>): SoilTestRequest {
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newRequest: SoilTestRequest = {
      ...requestData,
      id: `soil-${Date.now()}`,
      sampleCode: `NARL-${new Date().getFullYear()}-${codeNum}`,
      requestedAt: new Date().toISOString(),
      status: 'submitted',
    };
    this.soilRequests = [newRequest, ...this.soilRequests];
    setLocal(LOCAL_STORAGE_KEY_SOIL, this.soilRequests);
    this.notify();
    return newRequest;
  }

  // --- Community Forum ---
  public getForumPosts(): ForumPost[] {
    return this.forumPosts;
  }

  public addForumPost(post: Omit<ForumPost, 'id' | 'likes' | 'repliesCount' | 'createdAt'>): ForumPost {
    const newPost: ForumPost = {
      ...post,
      id: `post-${Date.now()}`,
      likes: 1,
      repliesCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.forumPosts = [newPost, ...this.forumPosts];
    setLocal(LOCAL_STORAGE_KEY_FORUM, this.forumPosts);
    this.notify();
    return newPost;
  }

  public likePost(postId: string) {
    this.forumPosts = this.forumPosts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    setLocal(LOCAL_STORAGE_KEY_FORUM, this.forumPosts);
    this.notify();
  }

  // --- Market Prices ---
  public getMarketPrices(): MarketPriceRecord[] {
    return this.marketPrices;
  }

  public addMarketPrice(record: Omit<MarketPriceRecord, 'id' | 'verifiedAt'>): MarketPriceRecord {
    const newPrice: MarketPriceRecord = {
      ...record,
      id: `mp-${Date.now()}`,
      verifiedAt: new Date().toISOString(),
      isIndicative: true,
      priceType: record.priceType || 'verified_observation',
      observationDate: record.observationDate || new Date().toISOString().split('T')[0],
    };
    this.marketPrices = [newPrice, ...this.marketPrices];
    setLocal(LOCAL_STORAGE_KEY_PRICES, this.marketPrices);
    this.notify();
    return newPrice;
  }

  // --- Inquiries ---
  public getInquiries(): ProductInquiry[] {
    return this.inquiries;
  }

  public getInquiriesForSeller(sellerId: string): ProductInquiry[] {
    return this.inquiries.filter(inq => inq.sellerId === sellerId);
  }

  public addInquiry(inquiry: Omit<ProductInquiry, 'id' | 'createdAt' | 'status'>): ProductInquiry {
    const newInquiry: ProductInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    this.inquiries = [newInquiry, ...this.inquiries];
    setLocal(LOCAL_STORAGE_KEY_INQUIRIES, this.inquiries);
    this.notify();
    return newInquiry;
  }

  // --- Reports ---
  public getReports(): ProductReport[] {
    return this.reports;
  }

  public addReport(report: Omit<ProductReport, 'id' | 'createdAt' | 'status'>): ProductReport {
    const newReport: ProductReport = {
      ...report,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending_review',
    };
    this.reports = [newReport, ...this.reports];
    setLocal(LOCAL_STORAGE_KEY_REPORTS, this.reports);
    this.notify();
    return newReport;
  }

  // --- Saved Consultation Notes (PWA Offline Enabled) ---
  public getConsultationNotes(): ConsultationNoteRecord[] {
    return this.consultationNotes;
  }

  public saveConsultationNote(note: Omit<ConsultationNoteRecord, 'id' | 'savedOffline'>): ConsultationNoteRecord {
    const newNote: ConsultationNoteRecord = {
      ...note,
      id: `note-${Date.now()}`,
      savedOffline: true,
    };
    this.consultationNotes = [newNote, ...this.consultationNotes];
    setLocal(LOCAL_STORAGE_KEY_CONSULTATIONS, this.consultationNotes);
    this.notify();
    return newNote;
  }

  public deleteConsultationNote(id: string): void {
    this.consultationNotes = this.consultationNotes.filter(n => n.id !== id);
    setLocal(LOCAL_STORAGE_KEY_CONSULTATIONS, this.consultationNotes);
    this.notify();
  }

  // --- Soil Health Analysis Reports ---
  public getSoilAnalysisReports(): SoilAnalysisReport[] {
    return this.soilAnalysisReports;
  }

  public saveSoilAnalysisReport(report: SoilAnalysisReport): void {
    const existingIndex = this.soilAnalysisReports.findIndex(r => r.id === report.id);
    if (existingIndex >= 0) {
      this.soilAnalysisReports[existingIndex] = report;
    } else {
      this.soilAnalysisReports = [report, ...this.soilAnalysisReports];
    }
    setLocal(LOCAL_STORAGE_KEY_SOIL_REPORTS, this.soilAnalysisReports);
    this.notify();
  }

  public deleteSoilAnalysisReport(id: string): void {
    this.soilAnalysisReports = this.soilAnalysisReports.filter(r => r.id !== id);
    setLocal(LOCAL_STORAGE_KEY_SOIL_REPORTS, this.soilAnalysisReports);
    this.notify();
  }

  // --- Smart Irrigation Schedules ---
  public getIrrigationSchedules(): IrrigationScheduleReport[] {
    return this.irrigationSchedules;
  }

  public saveIrrigationSchedule(schedule: IrrigationScheduleReport): void {
    this.irrigationSchedules = [schedule, ...this.irrigationSchedules.filter(s => s.id !== schedule.id)];
    setLocal(LOCAL_STORAGE_KEY_IRRIGATION, this.irrigationSchedules);
    this.notify();
  }

  public deleteIrrigationSchedule(id: string): void {
    this.irrigationSchedules = this.irrigationSchedules.filter(s => s.id !== id);
    setLocal(LOCAL_STORAGE_KEY_IRRIGATION, this.irrigationSchedules);
    this.notify();
  }

  // --- AI Pest & Disease Diagnoses ---
  public getPestDiagnoses(): PestDiagnosisReport[] {
    return this.pestDiagnoses;
  }

  public savePestDiagnosis(diagnosis: PestDiagnosisReport): void {
    const existingIndex = this.pestDiagnoses.findIndex(d => d.id === diagnosis.id);
    if (existingIndex >= 0) {
      this.pestDiagnoses[existingIndex] = diagnosis;
    } else {
      this.pestDiagnoses = [diagnosis, ...this.pestDiagnoses];
    }
    setLocal(LOCAL_STORAGE_KEY_PEST_DIAGNOSES, this.pestDiagnoses);
    this.notify();
  }

  public addFollowUpPhoto(diagnosisId: string, followUp: { photoUrl: string; notes: string; status: 'improving' | 'unchanged' | 'worsened' }): void {
    this.pestDiagnoses = this.pestDiagnoses.map(diag => {
      if (diag.id === diagnosisId) {
        const followUps = diag.followUpPhotos || [];
        return {
          ...diag,
          followUpPhotos: [
            ...followUps,
            {
              id: `fup-${Date.now()}`,
              photoUrl: followUp.photoUrl,
              date: new Date().toISOString().split('T')[0],
              notes: followUp.notes,
              status: followUp.status,
            }
          ]
        };
      }
      return diag;
    });
    setLocal(LOCAL_STORAGE_KEY_PEST_DIAGNOSES, this.pestDiagnoses);
    this.notify();
  }

  // --- AI Telemetry & Observability ---
  public getAiTelemetryMetrics(): AiTelemetryMetric[] {
    return this.aiTelemetryMetrics;
  }

  public recordAiTelemetry(metric: Omit<AiTelemetryMetric, 'id' | 'timestamp'>): void {
    const newMetric: AiTelemetryMetric = {
      ...metric,
      id: `tel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.aiTelemetryMetrics = [newMetric, ...this.aiTelemetryMetrics.slice(0, 99)];
    setLocal(LOCAL_STORAGE_KEY_AI_TELEMETRY, this.aiTelemetryMetrics);
    this.notify();
  }

  // --- AI Feedback & Grounding Reports ---
  public getAiFeedbackReports(): AiFeedbackReport[] {
    return this.aiFeedbackReports;
  }

  public submitAiFeedback(feedback: Omit<AiFeedbackReport, 'id' | 'timestamp' | 'status'>): AiFeedbackReport {
    const newReport: AiFeedbackReport = {
      ...feedback,
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending_review',
    };
    this.aiFeedbackReports = [newReport, ...this.aiFeedbackReports];
    setLocal(LOCAL_STORAGE_KEY_AI_FEEDBACK, this.aiFeedbackReports);
    this.notify();
    return newReport;
  }

  public resolveAiFeedback(id: string): void {
    this.aiFeedbackReports = this.aiFeedbackReports.map(fb => fb.id === id ? { ...fb, status: 'resolved' as const } : fb);
    setLocal(LOCAL_STORAGE_KEY_AI_FEEDBACK, this.aiFeedbackReports);
    this.notify();
  }

  // --- Admin Statistics ---
  public getAdminStats(): AdminStats {
    const totalVolume = this.orders.reduce((sum, ord) => sum + ord.grandTotalKsh, 0);
    return {
      totalUsers: 14820,
      verifiedFarmers: 8940,
      activeListings: this.products.length,
      pendingApprovals: this.products.filter(p => p.status === 'pending_approval').length,
      totalOrders: this.orders.length + 1840,
      totalVolumeKsh: totalVolume + 14850000,
      openDisputes: 3,
      soilTestsCompleted: this.soilRequests.filter(s => s.status === 'completed').length + 380,
    };
  }
}

export const agriStore = new AgriStore();
