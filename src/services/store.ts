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
  PlatformGovernanceSettings
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
    this.currentUser = getLocal<UserProfile>(LOCAL_STORAGE_KEY_USER, DEFAULT_USER);
    this.users = getLocal<UserProfile[]>(LOCAL_STORAGE_KEY_USERS, ALL_DEMO_USERS);
    this.isAuth = getLocal<boolean>(LOCAL_STORAGE_KEY_AUTH, false);
    this.auditLogs = getLocal<AuditLogEntry[]>(LOCAL_STORAGE_KEY_AUDIT, INITIAL_AUDIT_LOGS);
    this.soilRequests = getLocal<SoilTestRequest[]>(LOCAL_STORAGE_KEY_SOIL, INITIAL_SOIL_REQUESTS);
    this.forumPosts = getLocal<ForumPost[]>(LOCAL_STORAGE_KEY_FORUM, INITIAL_FORUM_POSTS);
    this.branding = getLocal<PlatformBranding>(LOCAL_STORAGE_KEY_BRANDING, DEFAULT_BRANDING);
    this.deliverySettings = getLocal<DeliverySettings>(LOCAL_STORAGE_KEY_DELIVERY, DEFAULT_DELIVERY_SETTINGS);
    this.governanceSettings = getLocal<PlatformGovernanceSettings>(LOCAL_STORAGE_KEY_GOVERNANCE, DEFAULT_GOVERNANCE_SETTINGS);

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
