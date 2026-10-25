/**
 * DERIV-AGRI KENYA - Content Management System (CMS) Service
 * Manages dynamic, no-code website content, drafts, publications, and version rollbacks.
 * Public pages consume published content; Admin dashboard edits and publishes drafts.
 */

export interface CmsHeroContent {
  title: string;
  subtitle: string;
  badgeText: string;
  primaryCtaText: string;
  primaryCtaTab: string;
  secondaryCtaText: string;
  secondaryCtaTab: string;
  heroNotice?: string;
}

export interface CmsServiceCard {
  id: string;
  title: string;
  subtitle: string;
  tabId: string;
  image: string;
  alt: string;
  actionText: string;
  isActive: boolean;
  order: number;
}

export interface CmsSeasonalBanner {
  isEnabled: boolean;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
  ctaText?: string;
  ctaTab?: string;
}

export interface CmsNavFooterContent {
  brandName: string;
  brandTagline: string;
  helplinePhone: string;
  supportEmail: string;
  headquartersAddress: string;
  operationalHours: string;
  copyrightText: string;
}

export interface CmsGeneralSettings {
  platformName: string;
  currencySymbol: string;
  maintenanceMode: boolean;
  maintenanceNotice?: string;
  allowPublicRegistrations: boolean;
  escrowFeePercent: number;
  defaultMonitoringCounty: string;
}

export interface CmsAiSettings {
  modelName: string;
  temperature: number;
  enableGrounding: boolean;
  systemInstructionCustom: string;
}

export interface CmsDataPayload {
  hero: CmsHeroContent;
  seasonalBanner: CmsSeasonalBanner;
  services: CmsServiceCard[];
  navFooter: CmsNavFooterContent;
  general: CmsGeneralSettings;
  ai: CmsAiSettings;
  version: number;
  publishedAt: string;
  publishedBy: string;
}

export const DEFAULT_CMS_CONTENT: CmsDataPayload = {
  hero: {
    title: 'SMART-AGRI KENYA',
    subtitle: 'Kenya\'s unified agricultural technology ecosystem connecting smallholder & commercial farmers, bulk produce buyers, certified agrovet input suppliers, accredited veterinarians, agronomists, transporters, and laboratories across all 47 counties.',
    badgeText: 'National Agricultural Digital Exchange 2026',
    primaryCtaText: 'Browse Produce & Inputs',
    primaryCtaTab: 'marketplace',
    secondaryCtaText: 'Role Dashboards',
    secondaryCtaTab: 'dashboard',
    heroNotice: 'Live Escrow Payments Active via Safaricom M-Pesa Daraja Integration',
  },
  seasonalBanner: {
    isEnabled: true,
    title: '2026 Planting Season Advisory',
    message: 'Long Rains planting window is open. Ensure KEPHIS-certified seeds, conduct soil pH analysis, and verify PCPB-registered agrochemicals before field application.',
    severity: 'info',
    ctaText: 'View Soil Lab Testing',
    ctaTab: 'soil-testing',
  },
  services: [
    {
      id: 'soil-testing',
      title: 'Soil Health Testing',
      subtitle: 'KALRO & CropNuts accredited soil fertility and pH analysis',
      tabId: 'soil-testing',
      image: '/assets/services/soil_health_testing.jpg',
      alt: 'Agricultural expert performing professional soil testing and laboratory analysis',
      actionText: 'Request Soil Test',
      isActive: true,
      order: 1,
    },
    {
      id: 'pest-diagnosis',
      title: 'Pest & Disease Checker',
      subtitle: 'PCPB-approved diagnosis, treatment, and crop protection',
      tabId: 'pest-diagnosis',
      image: '/assets/services/pest_disease_checker.jpg',
      alt: 'Close-up of crop plant leaf showing pest damage and disease inspection',
      actionText: 'Diagnose Plant',
      isActive: true,
      order: 2,
    },
    {
      id: 'wholesale-prices',
      title: 'Wholesale Prices',
      subtitle: 'Live commodity prices across Wakulima, Kongowea & 47 counties',
      tabId: 'market-prices',
      image: '/assets/services/wholesale_market_prices.jpg',
      alt: 'Bustling wholesale agricultural market with fresh produce crates and sacks',
      actionText: 'Check Wholesale Rates',
      isActive: true,
      order: 3,
    },
    {
      id: 'certified-inputs',
      title: 'Certified Inputs',
      subtitle: 'KEPHIS-certified seeds, authorized fertilizers & agrovet supplies',
      tabId: 'inputs',
      image: '/assets/services/certified_farm_inputs.jpg',
      alt: 'Agrovet supply store displaying certified seeds, fertilizers, and crop inputs',
      actionText: 'Browse Certified Inputs',
      isActive: true,
      order: 4,
    },
    {
      id: 'pedigree-livestock',
      title: 'Pedigree Livestock',
      subtitle: 'Verified Friesian, Ayrshire & Dorper stock with vet health certs',
      tabId: 'livestock',
      image: '/assets/services/pedigree_livestock_cow.jpg',
      alt: 'High-yielding pedigree dairy cattle in lush green pasture',
      actionText: 'Explore Livestock',
      isActive: true,
      order: 5,
    },
    {
      id: 'farmer-portal',
      title: 'Farmer Portal',
      subtitle: 'Farm records, harvest planning, weather advisory & sales tracking',
      tabId: 'dashboard',
      image: '/assets/services/farmer_digital_portal.jpg',
      alt: 'Modern Kenyan farmer using digital device in agricultural setting',
      actionText: 'Open Farmer Portal',
      isActive: true,
      order: 6,
    },
  ],
  navFooter: {
    brandName: 'DERIV-AGRI KENYA',
    brandTagline: 'Empowering Kenyan Agribusiness with Digital Certainty',
    helplinePhone: '+254 700 000 001 / +254 722 123 456',
    supportEmail: 'support@deriv-agri.ke',
    headquartersAddress: 'Kilimo House, Cathedral Road, Nairobi & Nakuru Agribusiness Hub, Kenya',
    operationalHours: 'Mon - Fri: 7:00 AM - 6:00 PM | Sat: 8:00 AM - 1:00 PM',
    copyrightText: '© 2026 DERIV-AGRI KENYA. Ministry of Agriculture & Livestock Development Compliance Reg #2026-SAK. All Rights Reserved.',
  },
  general: {
    platformName: 'DERIV-AGRI KENYA',
    currencySymbol: 'KSh',
    maintenanceMode: false,
    maintenanceNotice: 'The platform is undergoing scheduled security updates. Regular operations resume shortly.',
    allowPublicRegistrations: true,
    escrowFeePercent: 1.5,
    defaultMonitoringCounty: 'Nakuru',
  },
  ai: {
    modelName: 'gemini-3.8-flash',
    temperature: 0.7,
    enableGrounding: true,
    systemInstructionCustom: 'You are SMART-AGRI / DERIV-AGRI KENYA Senior Specialist advising Kenyan farmers on crop management, livestock diseases, and wholesale prices.',
  },
  version: 1,
  publishedAt: new Date().toISOString(),
  publishedBy: 'System Bootstrap',
};

const LOCAL_STORAGE_CMS_PUBLISHED = 'deriv_agri_cms_published_v1';
const LOCAL_STORAGE_CMS_DRAFT = 'deriv_agri_cms_draft_v1';
const LOCAL_STORAGE_CMS_HISTORY = 'deriv_agri_cms_history_v1';

class CmsService {
  private publishedContent: CmsDataPayload;
  private draftContent: CmsDataPayload;
  private history: Array<{ version: number; publishedAt: string; publishedBy: string; content: CmsDataPayload }>;
  private listeners: Array<() => void> = [];

  constructor() {
    this.publishedContent = this.loadPublished();
    this.draftContent = this.loadDraft();
    this.history = this.loadHistory();
    this.fetchRemotePublished();
  }

  private loadPublished(): CmsDataPayload {
    if (typeof window === 'undefined') return DEFAULT_CMS_CONTENT;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CMS_PUBLISHED);
      return stored ? JSON.parse(stored) : DEFAULT_CMS_CONTENT;
    } catch {
      return DEFAULT_CMS_CONTENT;
    }
  }

  private loadDraft(): CmsDataPayload {
    if (typeof window === 'undefined') return DEFAULT_CMS_CONTENT;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CMS_DRAFT);
      return stored ? JSON.parse(stored) : this.publishedContent;
    } catch {
      return this.publishedContent;
    }
  }

  private loadHistory() {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CMS_HISTORY);
      return stored ? JSON.parse(stored) : [
        {
          version: 1,
          publishedAt: '2026-10-21T00:00:00.000Z',
          publishedBy: 'System Bootstrap',
          content: DEFAULT_CMS_CONTENT,
        }
      ];
    } catch {
      return [];
    }
  }

  private async fetchRemotePublished() {
    try {
      const res = await fetch('/api/cms/content');
      if (res.ok) {
        const remote = await res.json();
        if (remote && remote.publishedContent) {
          this.publishedContent = remote.publishedContent;
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_CMS_PUBLISHED, JSON.stringify(this.publishedContent));
          }
          this.notify();
        }
      }
    } catch {
      // offline resilience fallback
    }
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try { listener(); } catch {}
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getPublished(): CmsDataPayload {
    return this.publishedContent;
  }

  public getDraft(): CmsDataPayload {
    return this.draftContent;
  }

  public getHistory() {
    return this.history;
  }

  public hasUnpublishedChanges(): boolean {
    return JSON.stringify(this.draftContent) !== JSON.stringify(this.publishedContent);
  }

  public updateDraft(updates: Partial<CmsDataPayload>) {
    this.draftContent = {
      ...this.draftContent,
      ...updates,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_CMS_DRAFT, JSON.stringify(this.draftContent));
    }
    this.notify();
  }

  public updateDraftSection<K extends keyof CmsDataPayload>(section: K, value: CmsDataPayload[K]) {
    this.draftContent = {
      ...this.draftContent,
      [section]: value,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_CMS_DRAFT, JSON.stringify(this.draftContent));
    }
    this.notify();
  }

  public resetDraftToPublished() {
    this.draftContent = JSON.parse(JSON.stringify(this.publishedContent));
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_CMS_DRAFT, JSON.stringify(this.draftContent));
    }
    this.notify();
  }

  public async publishLive(publishedBy: string = 'Authorized Admin'): Promise<{ success: boolean; version: number }> {
    const nextVersion = (this.publishedContent.version || 1) + 1;
    const nowIso = new Date().toISOString();

    const finalized: CmsDataPayload = {
      ...this.draftContent,
      version: nextVersion,
      publishedAt: nowIso,
      publishedBy,
    };

    // 1. Update local states
    this.publishedContent = JSON.parse(JSON.stringify(finalized));
    this.draftContent = JSON.parse(JSON.stringify(finalized));
    this.history = [
      {
        version: nextVersion,
        publishedAt: nowIso,
        publishedBy,
        content: JSON.parse(JSON.stringify(finalized)),
      },
      ...this.history.slice(0, 15),
    ];

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_CMS_PUBLISHED, JSON.stringify(this.publishedContent));
      localStorage.setItem(LOCAL_STORAGE_CMS_DRAFT, JSON.stringify(this.draftContent));
      localStorage.setItem(LOCAL_STORAGE_CMS_HISTORY, JSON.stringify(this.history));
    }

    // 2. Synchronize with server endpoint
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
    if (adminToken) {
      try {
        await fetch('/api/admin/cms/publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            content: finalized,
            publishedBy,
          }),
        });
      } catch (err) {
        console.warn('Server CMS publish sync note (offline/local fallback):', err);
      }
    }

    this.notify();
    return { success: true, version: nextVersion };
  }

  public async restoreVersion(targetVersion: number, restoredBy: string = 'Authorized Admin'): Promise<boolean> {
    const found = this.history.find((h) => h.version === targetVersion);
    if (!found) return false;

    this.draftContent = JSON.parse(JSON.stringify(found.content));
    await this.publishLive(`${restoredBy} (Restored from v${targetVersion})`);
    return true;
  }
}

export const cmsService = new CmsService();
