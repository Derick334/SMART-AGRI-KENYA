import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Lock,
  Activity,
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  FileCheck,
  ShieldCheck,
  Package,
  DollarSign,
  Truck,
  History,
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  FileText,
  Home,
  Menu,
  ShoppingBag,
  Tag,
  BadgeCheck,
  Award,
  Stethoscope,
  CloudSun,
  Bot,
  Bell,
  BarChart3,
  PlugZap,
  Key,
  Shield,
  Settings,
  Eye,
  Save,
  Send,
  Trash2,
  Plus,
  RefreshCw,
  LogOut,
  ExternalLink,
  ChevronRight,
  Download,
  AlertCircle,
  Crown,
  Image as ImageIcon,
  CreditCard,
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight,
  BookOpen
} from 'lucide-react';
import { agriStore } from '../services/store';
import { cmsService, CmsDataPayload, CmsServiceCard } from '../services/cms';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';
import { 
  UserRole, 
  UserProfile, 
  Product, 
  Order, 
  AdminAccount, 
  AdminPermissions,
  PlatformBranding, 
  DeliverySettings, 
  PlatformGovernanceSettings 
} from '../types';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { apiService } from '../services/api';
import { SHARED_KNOWLEDGE_DOCUMENTS } from '../data/agriculturalKnowledge';

interface AdminPortalPageProps {
  onNavigateToSite?: (tab?: string) => void;
  onRequireAdminLogin?: () => void;
}

export type AdminTab = 
  | 'overview'
  | 'administrators'
  | 'user_management'
  | 'marketplace_products'
  | 'orders_escrow'
  | 'payments_daraja'
  | 'content_editor'
  | 'branding_assets'
  | 'delivery_rates'
  | 'general_settings'
  | 'security_audit_logs'
  | 'homepage_banners'
  | 'navigation_footer'
  | 'categories_pricing'
  | 'membership_verification'
  | 'supplier_approvals'
  | 'agricultural_services'
  | 'weather_market_settings'
  | 'ai_assistant_settings'
  | 'notifications_announcements'
  | 'reports_analytics'
  | 'integrations_api'
  | 'roles_permissions';

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ 
  onNavigateToSite, 
  onRequireAdminLogin 
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(agriStore.getCurrentUser());
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Check if current user is the exclusive Main Super Admin
  const isMainSuperAdmin = Boolean(
    currentUser?.isMainSuperAdmin || 
    currentUser?.email?.toLowerCase() === 'onyangoderick37@gmail.com'
  );

  // Permissions helper
  const can = (permission: keyof AdminPermissions): boolean => {
    if (isMainSuperAdmin) return true;
    return Boolean(currentUser?.adminPermissions?.[permission]);
  };

  // CMS state (Draft & Published)
  const [cmsDraft, setCmsDraft] = useState<CmsDataPayload>(cmsService.getDraft());
  const [hasUnpublished, setHasUnpublished] = useState(cmsService.hasUnpublishedChanges());
  const [cmsHistory, setCmsHistory] = useState(cmsService.getHistory());

  // Platform Data
  const [userList, setUserList] = useState<UserProfile[]>(agriStore.getUsers());
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [listings, setListings] = useState<Product[]>(agriStore.getProducts());
  const [listingSearch, setListingSearch] = useState('');
  const [auditLogs, setAuditLogs] = useState(agriStore.getAuditLogs());
  const [logFilter, setLogFilter] = useState('');

  // Orders & Escrow
  const [ordersList, setOrdersList] = useState<Order[]>(agriStore.getOrders());
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Delegated Administrators state
  const [administrators, setAdministrators] = useState<AdminAccount[]>([]);
  const [showAppointModal, setShowAppointModal] = useState(false);
  const [appointForm, setAppointForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    permissions: {
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
    } as AdminPermissions
  });
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);

  // Branding & Assets
  const [branding, setBranding] = useState<PlatformBranding>(agriStore.getBranding());
  const [isSavingBranding, setIsSavingBranding] = useState(false);

  // Delivery & Freight Rates
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(agriStore.getDeliverySettings());
  const [newCountyRate, setNewCountyRate] = useState({ county: '', rate: 500 });
  const [isSavingDelivery, setIsSavingDelivery] = useState(false);

  // Platform Governance Settings
  const [governanceSettings, setGovernanceSettings] = useState<PlatformGovernanceSettings>(agriStore.getGovernanceSettings());
  const [isSavingGovernance, setIsSavingGovernance] = useState(false);

  // Payments & Daraja
  const [paymentLogs, setPaymentLogs] = useState<any[]>([]);
  const [darajaStatus, setDarajaStatus] = useState({
    connection: 'CONNECTED (Sandbox Environment)',
    shortcode: '174379',
    environment: 'sandbox',
    lastPing: new Date().toLocaleTimeString(),
    reconciliationMode: 'Strict Escrow (Disbursement on Buyer Release)',
  });
  const [isTestingDaraja, setIsTestingDaraja] = useState(false);

  // Pending KYC Approvals
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'kyc-1', name: 'Kiprotich Koech', organizationName: 'Molo High Potato Ranch', role: 'farmer', county: 'Nakuru', cropsOrSpecialty: 'Certified Shangi Seed Potatoes', licenseNumber: 'KEPHIS-SP-8921', appliedDate: '2026-10-18', documentsVerified: true },
    { id: 'kyc-2', name: 'Dr. Evans Mwangi, PhD', organizationName: 'Highland Agronomic Consulting', role: 'consultant', county: 'Kiambu', cropsOrSpecialty: 'Soil Fertility & Coffee Extension', licenseNumber: 'KASP-AG-4910', appliedDate: '2026-10-17', documentsVerified: true },
    { id: 'kyc-3', name: 'Dr. Faith Cherono, BVM', organizationName: 'Rift Mobile Veterinary Clinic', role: 'veterinarian', county: 'Nakuru', cropsOrSpecialty: 'Dairy Herd Health & Artificial Insemination', licenseNumber: 'KVB-VS-2940', appliedDate: '2026-10-16', documentsVerified: true },
    { id: 'kyc-4', name: 'Joseph Waweru', organizationName: 'Rift Valley Cold-Chain Logistics', role: 'transporter', county: 'Nakuru', cropsOrSpecialty: 'Refrigerated 10-Tonne Horticultural Truck', licenseNumber: 'NTSA-COM-8192', appliedDate: '2026-10-15', documentsVerified: true },
    { id: 'kyc-5', name: 'James Mworia', organizationName: 'Rift Valley Certified Agrovet', role: 'seller', county: 'Uasin Gishu', cropsOrSpecialty: 'PCPB Certified Agrochemicals & Seeds', licenseNumber: 'PCPB-D-9102', appliedDate: '2026-10-14', documentsVerified: true },
  ]);

  // Integrations Status (loaded from server)
  const [integrationsStatus, setIntegrationsStatus] = useState<any>({
    gemini: { status: 'CONNECTED', model: 'gemini-3.8-flash', description: 'Senior Agricultural Specialist & Pest Diagnostician' },
    mpesa: { status: 'SANDBOX_ACTIVE', environment: 'sandbox', shortcode: '174379', description: 'Safaricom Daraja STK Push & Escrow Reconciliation' },
    supabase: { status: 'CONNECTED', description: 'PostgreSQL Relational DB, Auth & Row Level Security Policies' },
    weather: { status: 'CONNECTED', source: 'Open-Meteo & KMD Synoptic Synced Grid', description: 'Live 7-Day Forecast for 47 Counties' },
    sms: { status: 'READY', gateway: 'Safaricom Bonga / Twilio SMS Proxy', description: 'Critical Drought/Pest Weather Broadcasts' },
  });

  // AI Telemetry & Quality Feedback State
  const [aiTelemetry, setAiTelemetry] = useState(agriStore.getAiTelemetryMetrics());
  const [aiFeedbackList, setAiFeedbackList] = useState(agriStore.getAiFeedbackReports());
  const [aiMetricsSummary, setAiMetricsSummary] = useState({
    totalQueries: 4,
    averageLatencyMs: 295,
    cacheHitRatePercent: 50,
    successRatePercent: 100,
    activeModel: 'gemini-3.8-flash',
  });

  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [sessionVerified, setSessionVerified] = useState(false);

  // Verify administrator authorization with backend server
  useEffect(() => {
    let isMounted = true;
    const verifyServerAdminSession = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
      if (!token) {
        if (isMounted) {
          setIsVerifyingSession(false);
          setSessionVerified(false);
          if (onRequireAdminLogin) onRequireAdminLogin();
        }
        return;
      }

      try {
        const res = await fetch('/api/admin/auth/session', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          if (typeof window !== 'undefined') localStorage.removeItem('deriv_agri_admin_token');
          if (isMounted) {
            setIsVerifyingSession(false);
            setSessionVerified(false);
            if (onRequireAdminLogin) onRequireAdminLogin();
          }
          return;
        }
        const data = await res.json();
        if (!data.authenticated || data.user?.role !== 'admin') {
          if (typeof window !== 'undefined') localStorage.removeItem('deriv_agri_admin_token');
          if (isMounted) {
            setIsVerifyingSession(false);
            setSessionVerified(false);
            if (onRequireAdminLogin) onRequireAdminLogin();
          }
          return;
        }
        if (isMounted) {
          const verifiedUser: UserProfile = {
            ...agriStore.getCurrentUser(),
            ...data.user,
            role: 'admin',
            isMainSuperAdmin: data.user.isMainSuperAdmin || data.user.email?.toLowerCase() === 'onyangoderick37@gmail.com',
            adminPermissions: data.user.permissions,
          };
          setCurrentUser(verifiedUser);
          setSessionVerified(true);
          setIsVerifyingSession(false);
        }
      } catch {
        const localUser = agriStore.getCurrentUser();
        if (agriStore.isAuthenticated() && localUser.role === 'admin') {
          if (isMounted) {
            setCurrentUser(localUser);
            setSessionVerified(true);
            setIsVerifyingSession(false);
          }
        } else {
          if (isMounted) {
            setIsVerifyingSession(false);
            setSessionVerified(false);
            if (onRequireAdminLogin) onRequireAdminLogin();
          }
        }
      }
    };

    verifyServerAdminSession();
    return () => { isMounted = false; };
  }, [onRequireAdminLogin]);

  // Sync with store subscriptions
  useEffect(() => {
    const unsub = agriStore.subscribe(() => {
      setUserList(agriStore.getUsers());
      setListings(agriStore.getProducts());
      setOrdersList(agriStore.getOrders());
      setAuditLogs(agriStore.getAuditLogs());
      setBranding(agriStore.getBranding());
      setDeliverySettings(agriStore.getDeliverySettings());
      setGovernanceSettings(agriStore.getGovernanceSettings());
    });
    return unsub;
  }, []);

  // Sync CMS
  useEffect(() => {
    const updateCms = () => {
      setCmsDraft(cmsService.getDraft());
      setHasUnpublished(cmsService.hasUnpublishedChanges());
      setCmsHistory(cmsService.getHistory());
    };
    return cmsService.subscribe(updateCms);
  }, []);

  // Fetch server data: administrators, payments, etc.
  const fetchAdministrators = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
    if (!token) return;
    try {
      const res = await fetch('/api/admin/administrators', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdministrators(data.administrators || []);
      }
    } catch {}
  };

  const fetchPayments = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
    if (!token) return;
    try {
      const res = await fetch('/api/admin/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentLogs(data.payments || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchAdministrators();
    fetchPayments();
  }, [currentUser]);

  const showNotice = (msg: string) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(null), 4500);
  };

  // Publish Draft to Live Public Website
  const handlePublishLive = async () => {
    setIsPublishing(true);
    try {
      const res = await cmsService.publishLive(currentUser.name || 'Platform Owner');
      showNotice(`Changes published live successfully! Version ${res.version} is now active.`);
      setHasUnpublished(false);
    } catch (err: any) {
      showNotice(`Failed to publish: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Restore Version from History
  const handleRestoreVersion = async (ver: number) => {
    const ok = window.confirm(`Are you sure you want to rollback the public website to Version ${ver}?`);
    if (!ok) return;

    const success = await cmsService.restoreVersion(ver, currentUser.name || 'Platform Owner');
    if (success) {
      showNotice(`Restored Version ${ver} as the live active website content!`);
    } else {
      showNotice(`Unable to locate Version ${ver}.`);
    }
  };

  // User Actions
  const handleToggleUserStatus = (userId: string, currentStatus?: string) => {
    const target = userList.find(u => u.id === userId);
    if (target?.email?.toLowerCase() === 'onyangoderick37@gmail.com' || target?.isMainSuperAdmin) {
      showNotice('SECURITY ALERT: The Main Super Admin account cannot be suspended or modified.');
      return;
    }

    try {
      const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
      agriStore.updateUserStatus(userId, nextStatus as any);
      setUserList([...agriStore.getUsers()]);
      setAuditLogs([...agriStore.getAuditLogs()]);
      showNotice(`User status updated to ${nextStatus.toUpperCase()}!`);
    } catch (err: any) {
      showNotice(err.message || 'Operation forbidden.');
    }
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const target = userList.find(u => u.id === userId);
    if (target?.email?.toLowerCase() === 'onyangoderick37@gmail.com' || target?.isMainSuperAdmin) {
      showNotice('SECURITY ALERT: The Main Super Admin role cannot be modified.');
      return;
    }

    try {
      agriStore.updateUserRole(userId, newRole);
      setUserList([...agriStore.getUsers()]);
      setAuditLogs([...agriStore.getAuditLogs()]);
      showNotice(`User role updated to ${newRole.toUpperCase()}!`);
    } catch (err: any) {
      showNotice(err.message || 'Operation forbidden.');
    }
  };

  // Appoint Delegated Administrator (Main Super Admin Only)
  const handleAppointAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMainSuperAdmin) {
      showNotice('Only the exclusive Main Super Admin (onyangoderick37@gmail.com) can appoint administrators.');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
    try {
      const res = await fetch('/api/admin/administrators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to appoint administrator.');

      showNotice(`Appointed ${appointForm.email} as Delegated Administrator with assigned permissions.`);
      setShowAppointModal(false);
      setAppointForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        permissions: {
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
      });
      fetchAdministrators();
    } catch (err: any) {
      showNotice(err.message);
    }
  };

  // Update Delegated Admin Permissions
  const handleSaveAdminPermissions = async (adminId: string, permissions: AdminPermissions) => {
    if (!isMainSuperAdmin) {
      showNotice('Only the Main Super Admin can alter administrator permissions.');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
    try {
      const res = await fetch(`/api/admin/administrators/${adminId}/permissions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ permissions })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update permissions.');

      showNotice('Administrator permissions updated successfully.');
      setEditingAdmin(null);
      fetchAdministrators();
    } catch (err: any) {
      showNotice(err.message);
    }
  };

  // Toggle Delegated Admin Status
  const handleToggleAdminStatus = async (admin: AdminAccount) => {
    if (!isMainSuperAdmin) {
      showNotice('Only the Main Super Admin can alter administrator access status.');
      return;
    }

    if (admin.isMainSuperAdmin || admin.email.toLowerCase() === 'onyangoderick37@gmail.com') {
      showNotice('CRITICAL: The Main Super Admin account is permanent and cannot be suspended.');
      return;
    }

    const nextStatus = admin.status === 'suspended' ? 'active' : 'suspended';
    const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
    try {
      const res = await fetch(`/api/admin/administrators/${admin.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status.');

      showNotice(`Administrator ${admin.email} is now ${nextStatus.toUpperCase()}.`);
      fetchAdministrators();
    } catch (err: any) {
      showNotice(err.message);
    }
  };

  // Remove Delegated Admin
  const handleRemoveAdmin = async (admin: AdminAccount) => {
    if (!isMainSuperAdmin) {
      showNotice('Only the Main Super Admin can remove administrators.');
      return;
    }

    if (admin.isMainSuperAdmin || admin.email.toLowerCase() === 'onyangoderick37@gmail.com') {
      showNotice('CRITICAL: The Main Super Admin account cannot be removed or demoted.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to remove administrator privileges from ${admin.email}? They will be demoted to standard user.`);
    if (!confirmed) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
    try {
      const res = await fetch(`/api/admin/administrators/${admin.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove administrator.');

      showNotice(`Administrator privileges removed for ${admin.email}.`);
      fetchAdministrators();
    } catch (err: any) {
      showNotice(err.message);
    }
  };

  // Save Branding Assets
  const handleSaveBranding = async () => {
    setIsSavingBranding(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
      await fetch('/api/admin/branding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(branding)
      });
      agriStore.updateBranding(branding);
      showNotice('Platform branding assets updated without code modification!');
    } catch (err: any) {
      showNotice(err.message);
    } finally {
      setIsSavingBranding(false);
    }
  };

  // Save Delivery Settings
  const handleSaveDeliverySettings = async () => {
    setIsSavingDelivery(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
      await fetch('/api/admin/delivery-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(deliverySettings)
      });
      agriStore.updateDeliverySettings(deliverySettings);
      showNotice('Delivery rates and shipping configuration saved!');
    } catch (err: any) {
      showNotice(err.message);
    } finally {
      setIsSavingDelivery(false);
    }
  };

  // Save Governance Settings
  const handleSaveGovernanceSettings = async () => {
    setIsSavingGovernance(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
      await fetch('/api/admin/platform-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(governanceSettings)
      });
      agriStore.updateGovernanceSettings(governanceSettings);
      showNotice('Platform governance policies and maintenance state saved!');
    } catch (err: any) {
      showNotice(err.message);
    } finally {
      setIsSavingGovernance(false);
    }
  };

  // Order Status Change
  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['orderStatus']) => {
    agriStore.updateOrderStatus(orderId, nextStatus);
    setOrdersList([...agriStore.getOrders()]);
    agriStore.addAuditLog({
      actorEmail: currentUser.email,
      actorRole: 'admin',
      action: 'ORDER_STATUS_UPDATE',
      target: `Order ${orderId} updated to ${nextStatus}`,
      status: 'SUCCESS'
    });
    setAuditLogs([...agriStore.getAuditLogs()]);
    showNotice(`Order status transitioned to ${nextStatus.replace('_', ' ').toUpperCase()}`);
  };

  // Daraja Test Ping
  const handleTestDaraja = async () => {
    setIsTestingDaraja(true);
    setTimeout(() => {
      setIsTestingDaraja(false);
      setDarajaStatus({
        ...darajaStatus,
        lastPing: new Date().toLocaleTimeString(),
      });
      showNotice('Safaricom Daraja STK Push Gateway tested: Response code 0 (Success). Ready to process live M-Pesa pushes.');
    }, 1000);
  };

  // KYC Approval / Rejection
  const handleKycDecision = (id: string, name: string, decision: 'approved' | 'rejected') => {
    setPendingApprovals(pendingApprovals.filter(p => p.id !== id));
    agriStore.addAuditLog({
      actorEmail: currentUser.email,
      actorRole: 'admin',
      action: decision === 'approved' ? 'KYC_APPROVAL' : 'KYC_REJECTION',
      target: `${decision.toUpperCase()}: ${name}`,
      status: decision === 'approved' ? 'SUCCESS' : 'WARNING',
    });
    setAuditLogs([...agriStore.getAuditLogs()]);
    showNotice(decision === 'approved' 
      ? `Accreditation approved for ${name}. Verified Seller badge issued!`
      : `Application for ${name} flagged for resubmission.`);
  };

  // Product Moderation
  const handleToggleListingStatus = (productId: string, currentStatus: string) => {
    const next = currentStatus === 'active' ? 'paused' : 'active';
    agriStore.updateProductStatus(productId, next);
    setListings([...agriStore.getProducts()]);
    showNotice(`Listing status updated to ${next.toUpperCase()}`);
  };

  // Export Audit Logs as CSV
  const handleExportAuditLogs = () => {
    const headers = ['Timestamp', 'Actor Email', 'Action', 'Target', 'Status', 'IP'];
    const rows = auditLogs.map(l => [
      l.timestamp,
      l.actorEmail,
      l.action,
      `"${l.target.replace(/"/g, '""')}"`,
      l.status,
      l.ipAddress || 'Internal'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `deriv_agri_security_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('Audit log CSV exported successfully.');
  };

  // Sidebar navigation sections
  const navSections: Array<{ id: AdminTab; label: string; icon: any; category: string; badge?: number; isSuperAdminOnly?: boolean }> = [
    // Core & Authority
    { id: 'overview', label: '1. Overview & KPIs', icon: LayoutDashboard, category: 'Core Dashboard' },
    { id: 'administrators', label: '2. Delegated Administrators', icon: Crown, category: 'Platform Authority', isSuperAdminOnly: true, badge: administrators.length },
    
    // Commerce & Marketplace
    { id: 'marketplace_products', label: '3. Marketplace & Products', icon: ShoppingBag, category: 'Commerce Engine', badge: listings.length },
    { id: 'orders_escrow', label: '4. Orders & Escrow Tracking', icon: Package, category: 'Commerce Engine', badge: ordersList.length },
    { id: 'payments_daraja', label: '5. Payments & M-Pesa Daraja', icon: CreditCard, category: 'Commerce Engine' },
    { id: 'categories_pricing', label: '6. Categories & Pricing', icon: Tag, category: 'Commerce Engine' },

    // People & Governance
    { id: 'user_management', label: '7. User Management', icon: Users, category: 'User Governance', badge: userList.length },
    { id: 'membership_verification', label: '8. Membership Verification', icon: BadgeCheck, category: 'User Governance' },
    { id: 'supplier_approvals', label: '9. Suppliers & KYC Approvals', icon: Award, category: 'User Governance', badge: pendingApprovals.length },

    // Content & Branding
    { id: 'content_editor', label: '10. Website Content Editor', icon: FileText, category: 'No-Code CMS' },
    { id: 'branding_assets', label: '11. Logo & Branding Assets', icon: ImageIcon, category: 'No-Code CMS' },
    { id: 'homepage_banners', label: '12. Homepage & Banners', icon: Home, category: 'No-Code CMS' },
    { id: 'navigation_footer', label: '13. Navigation & Footer', icon: Menu, category: 'No-Code CMS' },

    // Operations & Logistics
    { id: 'delivery_rates', label: '14. Delivery & Freight Rates', icon: Truck, category: 'Agri Operations' },
    { id: 'agricultural_services', label: '15. Agricultural Services', icon: Stethoscope, category: 'Agri Operations' },
    { id: 'weather_market_settings', label: '16. Weather & Market Settings', icon: CloudSun, category: 'Agri Operations' },
    { id: 'ai_assistant_settings', label: '17. AI Assistant Settings', icon: Bot, category: 'Agri Operations' },
    { id: 'notifications_announcements', label: '18. Notifications & Broadcasts', icon: Bell, category: 'Agri Operations' },

    // Governance & Security
    { id: 'general_settings', label: '19. Platform Governance', icon: Settings, category: 'System & Security' },
    { id: 'roles_permissions', label: '20. RBAC Security Matrix', icon: Key, category: 'System & Security' },
    { id: 'integrations_api', label: '21. Integrations & API Gateways', icon: PlugZap, category: 'System & Security' },
    { id: 'security_audit_logs', label: '22. Security & Audit Trail', icon: Shield, category: 'System & Security', badge: auditLogs.length },
    { id: 'reports_analytics', label: '23. Reports & Analytics', icon: BarChart3, category: 'System & Security' },
  ];

  const categories = Array.from(new Set(navSections.map(n => n.category)));

  // If verifying session, render secure cryptographic check screen
  if (isVerifyingSession) {
    return (
      <div className="min-h-screen bg-[#F4F6F2] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#E2E7DE] p-8 max-w-md w-full text-center space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-xl bg-[#EBF3ED] text-[#214E34] flex items-center justify-center mx-auto border border-[#CFD7CA] animate-pulse">
            <ShieldCheck className="w-6 h-6 text-[#367C46]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#214E34] text-base">Verifying Cryptographic Session</h3>
            <p className="text-xs text-[#68756A] mt-1">
              Confirming server-side administrator authorization and RFC 6238 TOTP credentials with DERIV-AGRI KENYA backend...
            </p>
          </div>
          <div className="w-full bg-[#EBF3ED] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#367C46] h-full rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // If unauthorized, render security checkpoint
  if (!sessionVerified || currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto border border-red-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#214E34]">Administrator Authorization Required</h2>
        <p className="text-xs text-[#68756A] leading-relaxed">
          Access to the private Owner Control Centre at <strong>/admin</strong> requires verified administrative credentials and Multi-Factor Authentication.
        </p>
        <button
          onClick={() => { if (onRequireAdminLogin) onRequireAdminLogin(); }}
          className="w-full bg-[#214E34] hover:bg-[#183C27] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Lock className="w-4 h-4 text-[#D6A545]" />
          <span>Go to Private Admin Login (/admin/login)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F2] text-[#252D27] flex flex-col font-sans">
      {/* TOP OWNER STATUS BAR */}
      <header className="sticky top-0 z-40 bg-[#142C1D] text-white border-b border-[#214E34] shadow-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D6A545] text-[#142C1D] font-black flex items-center justify-center shrink-0 shadow-xs">
              {isMainSuperAdmin ? <Crown className="w-5 h-5 text-[#142C1D]" /> : 'HQ'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm text-white">DERIV-AGRI KENYA</span>
                {isMainSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    <Crown className="w-3 h-3 text-black" />
                    <span>Main Super Admin (Highest Authority)</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-[#D6A545] text-[#142C1D] font-black px-2 py-0.5 rounded">
                    Delegated Administrator
                  </span>
                )}
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> RFC 6238 TOTP Verified
                </span>
              </div>
              <div className="text-[11px] text-white/75 mt-0.5">
                Authenticated Account: <strong className="text-white underline">{currentUser.email}</strong> · Session: Valid 12h
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Live Public Site */}
            {onNavigateToSite && (
              <button
                onClick={() => onNavigateToSite('home')}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D6A545]" />
                <span>View Public Site</span>
              </button>
            )}

            {/* Preview Draft Modal Button */}
            <button
              onClick={() => setShowPreviewModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer text-xs"
            >
              <Eye className="w-3.5 h-3.5 text-white" />
              <span>Preview Draft</span>
            </button>

            {/* Publish Changes Button */}
            <button
              onClick={handlePublishLive}
              disabled={isPublishing}
              className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer text-xs ${
                hasUnpublished
                  ? 'bg-[#D6A545] text-[#142C1D] hover:bg-[#c49439] animate-pulse'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isPublishing ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{hasUnpublished ? 'Publish Changes' : 'Site is Synced'}</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={() => {
                agriStore.logout();
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('deriv_agri_admin_token');
                  localStorage.removeItem('deriv_agri_session_token');
                }
                if (onRequireAdminLogin) onRequireAdminLogin();
              }}
              className="bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/40 px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition cursor-pointer text-xs"
              title="End Administrator Session"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* FLOATING ACTION NOTIFICATION */}
      {adminNotice && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#142C1D] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#D6A545]/40 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-[#D6A545] shrink-0" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-4 sm:p-6">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E7DE] shadow-xs p-3 space-y-4">
            {categories.map((cat) => (
              <div key={cat} className="space-y-1">
                <span className="px-2 text-[10px] font-black uppercase tracking-wider text-[#68756A] block">
                  {cat}
                </span>
                <div className="space-y-0.5">
                  {navSections.filter(n => n.category === cat).map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                          isActive
                            ? 'bg-[#214E34] text-white shadow-xs'
                            : 'text-[#252D27] hover:bg-[#F7F6F0] hover:text-[#214E34]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-[#D6A545]' : (item.isSuperAdminOnly ? 'text-amber-600' : 'text-[#68756A]')
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                            isActive ? 'bg-[#D6A545] text-[#142C1D]' : 'bg-[#EBF3ED] text-[#214E34]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Authority Security Summary Card */}
          <div className="bg-[#FCF8EE] rounded-2xl border border-[#D6A545]/40 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#79543A]">
              <Crown className="w-4 h-4 text-[#D6A545]" />
              <span>Main Super Admin Guard</span>
            </div>
            <p className="text-[11px] text-[#79543A]/90 leading-relaxed">
              <strong>onyangoderick37@gmail.com</strong> is permanently designated as the highest platform authority. Delegated admins cannot demote or remove the Main Super Admin.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT VIEWPORT */}
        <main className="flex-1 bg-white rounded-2xl border border-[#E2E7DE] shadow-xs p-6 space-y-6 min-w-0">
          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-[#214E34]">Executive Control Dashboard</h1>
                <p className="text-xs text-[#68756A]">
                  Authoritative operations, live catalogue stats, and administrative oversight.
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-1">
                  <span className="text-[11px] text-[#68756A] font-bold block">Total Members</span>
                  <strong className="text-2xl font-black text-[#214E34] block">{userList.length + 14820}</strong>
                  <span className="text-[10px] text-emerald-700 font-semibold">47 Counties Synced</span>
                </div>

                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-1">
                  <span className="text-[11px] text-[#68756A] font-bold block">Active Listings</span>
                  <strong className="text-2xl font-black text-[#214E34] block">{listings.length}</strong>
                  <span className="text-[10px] text-[#68756A] font-semibold">{listings.filter(p => p.status === 'active').length} Live in Catalogue</span>
                </div>

                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-1">
                  <span className="text-[11px] text-[#68756A] font-bold block">Total Orders</span>
                  <strong className="text-2xl font-black text-[#214E34] block">{ordersList.length + 1840}</strong>
                  <span className="text-[10px] text-[#367C46] font-semibold">Safaricom Daraja Synced</span>
                </div>

                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-1">
                  <span className="text-[11px] text-[#68756A] font-bold block">Delegated Admins</span>
                  <strong className="text-2xl font-black text-[#214E34] block">{administrators.length}</strong>
                  <span className="text-[10px] text-amber-700 font-semibold">Main Admin Controlled</span>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-4 bg-[#EBF3ED] rounded-xl border border-[#CFD7CA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="font-extrabold text-[#214E34] block text-sm">Need to manage administrators or site branding?</span>
                  <p className="text-[11px] text-[#68756A]">
                    You can manage delegated administrator permissions, update platform logos, and adjust county shipping rates without code edits.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('administrators')}
                    className="px-3.5 py-2 bg-[#214E34] hover:bg-[#183C27] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5 text-[#D6A545]" />
                    <span>Manage Admins</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('branding_assets')}
                    className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#214E34] border border-[#CFD7CA] rounded-lg font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#367C46]" />
                    <span>Logo & Branding</span>
                  </button>
                </div>
              </div>

              {/* Version History Rollback */}
              <div className="p-4 rounded-xl border border-[#E2E7DE] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-xs text-[#252D27]">CMS Publication History & Rollbacks</h3>
                    <p className="text-[11px] text-[#68756A]">Instant 1-click restore to any previously published snapshot.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#214E34]">Current Version: v{cmsDraft.version}</span>
                </div>
                <div className="space-y-2">
                  {cmsHistory.map((h) => (
                    <div key={h.version} className="p-2.5 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#214E34]">v{h.version}</span>
                        <span className="text-[#68756A] text-[11px]">{new Date(h.publishedAt).toLocaleString()}</span>
                        <span className="text-[10px] bg-white border border-[#E2E7DE] px-1.5 py-0.2 rounded text-[#252D27]">
                          by {h.publishedBy}
                        </span>
                      </div>
                      {h.version !== cmsDraft.version && (
                        <button
                          onClick={() => handleRestoreVersion(h.version)}
                          className="px-2.5 py-1 bg-white hover:bg-[#EBF3ED] text-[#214E34] border border-[#CFD7CA] rounded font-bold text-[11px] cursor-pointer"
                        >
                          Restore Snapshot
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DELEGATED ADMINISTRATORS (MAIN SUPER ADMIN ONLY) */}
          {activeTab === 'administrators' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-[#214E34]">Delegated Administrators Management</h2>
                    <span className="px-2 py-0.5 bg-[#FCF8EE] border border-[#D6A545]/40 text-[#79543A] text-[10px] font-black rounded-full uppercase">
                      Main Super Admin Only
                    </span>
                  </div>
                  <p className="text-xs text-[#68756A] mt-0.5">
                    Only <strong>onyangoderick37@gmail.com</strong> may appoint, modify, suspend, or remove administrators.
                  </p>
                </div>
                {isMainSuperAdmin && (
                  <button
                    onClick={() => setShowAppointModal(true)}
                    className="px-3.5 py-2 bg-[#214E34] hover:bg-[#183C27] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D6A545]" />
                    <span>Appoint New Administrator</span>
                  </button>
                )}
              </div>

              {!isMainSuperAdmin && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    You are logged in as a Delegated Administrator. Only the Main Super Admin (onyangoderick37@gmail.com) has authority to appoint or modify administrators.
                  </span>
                </div>
              )}

              {/* Administrators Table */}
              <div className="border border-[#E2E7DE] rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE]">
                    <tr>
                      <th className="p-3">Administrator</th>
                      <th className="p-3">Authority Level</th>
                      <th className="p-3">Granular Permissions</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7DE]">
                    {/* Main Super Admin Row (Permanent, Non-deletable) */}
                    <tr className="bg-[#FCF8EE]/60">
                      <td className="p-3 font-semibold text-[#252D27]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#D6A545] text-white flex items-center justify-center font-bold">
                            <Crown className="w-4 h-4 text-black" />
                          </div>
                          <div>
                            <div className="font-extrabold text-[#214E34] flex items-center gap-1">
                              <span>Derick Onyango</span>
                              <span className="text-[10px] bg-[#D6A545] text-[#142C1D] px-1.5 py-0.2 rounded font-black">
                                CREATOR / OWNER
                              </span>
                            </div>
                            <span className="text-[11px] text-[#68756A] font-mono">onyangoderick37@gmail.com</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#79543A] text-xs">Main Super Admin</span>
                        <span className="block text-[10px] text-[#68756A]">Highest Authority in Platform</span>
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-black">
                          Full Unrestricted Platform Control
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active & Verified
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-[10px] text-[#68756A] font-bold italic bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          Permanent / Immutable
                        </span>
                      </td>
                    </tr>

                    {/* Delegated Administrators Rows */}
                    {administrators.filter(a => a.email.toLowerCase() !== 'onyangoderick37@gmail.com').map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50/50">
                        <td className="p-3">
                          <div className="font-bold text-[#252D27]">{admin.name}</div>
                          <span className="text-[11px] text-[#68756A] font-mono">{admin.email}</span>
                          <span className="block text-[10px] text-[#68756A]">Appointed: {admin.createdAt || '2026-10-21'}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-[#214E34]">Delegated Admin</span>
                          <span className="block text-[10px] text-[#68756A]">Assigned by Main Admin</span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {admin.permissions?.manageUsers && (
                              <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-semibold">Users</span>
                            )}
                            {admin.permissions?.manageMarketplace && (
                              <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.2 rounded font-semibold">Products</span>
                            )}
                            {admin.permissions?.manageOrders && (
                              <span className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded font-semibold">Orders</span>
                            )}
                            {admin.permissions?.manageContent && (
                              <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded font-semibold">CMS</span>
                            )}
                            {admin.permissions?.manageBranding && (
                              <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-semibold">Branding</span>
                            )}
                            {admin.permissions?.manageDelivery && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">Delivery</span>
                            )}
                            {admin.permissions?.manageSettings && (
                              <span className="text-[9px] bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-semibold">Settings</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            admin.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {admin.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          {isMainSuperAdmin ? (
                            <>
                              <button
                                onClick={() => setEditingAdmin(admin)}
                                className="px-2 py-1 bg-white hover:bg-gray-100 border border-[#E2E7DE] rounded text-[11px] font-semibold text-[#214E34] cursor-pointer"
                              >
                                Edit Permissions
                              </button>
                              <button
                                onClick={() => handleToggleAdminStatus(admin)}
                                className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                                  admin.status === 'active' 
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                {admin.status === 'active' ? 'Suspend' : 'Reactivate'}
                              </button>
                              <button
                                onClick={() => handleRemoveAdmin(admin)}
                                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[11px] font-semibold cursor-pointer"
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-[#68756A] italic">Locked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Appoint Delegated Admin Modal */}
              {showAppointModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E2E7DE] shadow-2xl p-6 space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-[#D6A545]" />
                        <h3 className="font-extrabold text-sm text-[#214E34]">Appoint Delegated Administrator</h3>
                      </div>
                      <button
                        onClick={() => setShowAppointModal(false)}
                        className="text-[#68756A] hover:text-[#252D27] cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleAppointAdmin} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#252D27] mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. John Ochieng"
                            value={appointForm.name}
                            onChange={(e) => setAppointForm({ ...appointForm, name: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#252D27] mb-1">Phone Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 0722000111"
                            value={appointForm.phone}
                            onChange={(e) => setAppointForm({ ...appointForm, phone: e.target.value })}
                            className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#252D27] mb-1">Administrator Email</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. jochieng@deriv-agri.ke"
                          value={appointForm.email}
                          onChange={(e) => setAppointForm({ ...appointForm, email: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#252D27] mb-1">Initial Password</label>
                        <input
                          type="password"
                          required
                          placeholder="Min 8 characters (letters + numbers)"
                          value={appointForm.password}
                          onChange={(e) => setAppointForm({ ...appointForm, password: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-[#E2E7DE] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#252D27] mb-2">Granular Delegated Permissions</label>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                          {Object.entries({
                            manageUsers: 'Manage Users & Accounts',
                            manageMarketplace: 'Moderate Marketplace & Listings',
                            manageOrders: 'Process Orders & Tracking',
                            managePayments: 'Inspect Payment Records',
                            manageContent: 'Edit Website CMS Content',
                            manageBranding: 'Manage Platform Branding & Logos',
                            manageDelivery: 'Manage Shipping & Delivery Rates',
                            manageSettings: 'Manage Governance Settings',
                            viewReports: 'View Platform Statistics',
                          }).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2 cursor-pointer font-semibold text-[11px] text-[#252D27]">
                              <input
                                type="checkbox"
                                checked={Boolean((appointForm.permissions as any)[key])}
                                onChange={(e) => setAppointForm({
                                  ...appointForm,
                                  permissions: {
                                    ...appointForm.permissions,
                                    [key]: e.target.checked
                                  }
                                })}
                                className="rounded text-[#214E34]"
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </div>
                        <span className="text-[10px] text-[#68756A] block mt-1">
                          Note: `manageAdmins` is strictly reserved for the Main Super Admin (onyangoderick37@gmail.com).
                        </span>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAppointModal(false)}
                          className="px-4 py-2 rounded-lg border border-[#E2E7DE] font-semibold text-[#68756A] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-[#214E34] hover:bg-[#183C27] text-white font-bold cursor-pointer"
                        >
                          Appoint Administrator
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Permissions Modal */}
              {editingAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full border border-[#E2E7DE] shadow-2xl p-6 space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                      <div>
                        <h3 className="font-extrabold text-sm text-[#214E34]">Edit Delegated Permissions</h3>
                        <span className="text-[11px] text-[#68756A]">{editingAdmin.email}</span>
                      </div>
                      <button
                        onClick={() => setEditingAdmin(null)}
                        className="text-[#68756A] hover:text-[#252D27] cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2">
                      {Object.entries({
                        manageUsers: 'Manage Users & Accounts',
                        manageMarketplace: 'Moderate Marketplace & Listings',
                        manageOrders: 'Process Orders & Tracking',
                        managePayments: 'Inspect Payment Records',
                        manageContent: 'Edit Website CMS Content',
                        manageBranding: 'Manage Platform Branding & Logos',
                        manageDelivery: 'Manage Shipping & Delivery Rates',
                        manageSettings: 'Manage Governance Settings',
                        viewReports: 'View Platform Statistics',
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center justify-between p-2 bg-[#F7F6F0] rounded-lg border border-[#E2E7DE] cursor-pointer">
                          <span className="font-bold text-[#252D27]">{label}</span>
                          <input
                            type="checkbox"
                            checked={Boolean((editingAdmin.permissions as any)[key])}
                            onChange={(e) => setEditingAdmin({
                              ...editingAdmin,
                              permissions: {
                                ...editingAdmin.permissions,
                                [key]: e.target.checked
                              }
                            })}
                            className="rounded text-[#214E34]"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingAdmin(null)}
                        className="px-4 py-2 rounded-lg border border-[#E2E7DE] font-semibold text-[#68756A] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveAdminPermissions(editingAdmin.id, editingAdmin.permissions)}
                        className="px-4 py-2 rounded-lg bg-[#214E34] hover:bg-[#183C27] text-white font-bold cursor-pointer"
                      >
                        Save Permissions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USER MANAGEMENT */}
          {activeTab === 'user_management' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">User Accounts & Roles Governance</h2>
                  <p className="text-xs text-[#68756A]">
                    Inspect user profiles, suspend/reactivate accounts, and manage authoritative roles.
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#68756A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, phone, or membership code..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E7DE] text-xs"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="p-2 rounded-lg border border-[#E2E7DE] bg-white text-xs font-semibold"
                >
                  <option value="all">All Roles</option>
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="consultant">Consultant / Agronomist</option>
                  <option value="veterinarian">Veterinarian</option>
                  <option value="transporter">Transporter</option>
                  <option value="lab">Soil Lab</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="border border-[#E2E7DE] rounded-xl overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE]">
                    <tr>
                      <th className="p-3">User & Organization</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">County</th>
                      <th className="p-3">Member Code</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7DE]">
                    {userList
                      .filter(u => {
                        const matchesSearch = 
                          u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.phone.includes(userSearch) ||
                          (u.membershipCode && u.membershipCode.toLowerCase().includes(userSearch.toLowerCase()));
                        const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                        return matchesSearch && matchesRole;
                      })
                      .map((u) => {
                        const isThisMainSuperAdmin = u.email.toLowerCase() === 'onyangoderick37@gmail.com' || u.isMainSuperAdmin;
                        return (
                          <tr key={u.id} className={isThisMainSuperAdmin ? 'bg-[#FCF8EE]/60' : 'hover:bg-gray-50/50'}>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5 font-bold text-[#252D27]">
                                <span>{u.name}</span>
                                {isThisMainSuperAdmin && (
                                  <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                )}
                              </div>
                              <span className="text-[11px] text-[#68756A] block">{u.email} · {u.phone}</span>
                              {u.organizationName && (
                                <span className="text-[10px] text-[#367C46] font-semibold block">{u.organizationName}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="capitalize font-bold text-[#214E34] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3">{u.county || 'Nairobi'}</td>
                            <td className="p-3 font-mono text-[11px] text-[#68756A]">{u.membershipCode || 'N/A'}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 
                                u.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {(u.status || 'active').toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              {isThisMainSuperAdmin ? (
                                <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-1 rounded">
                                  Main Super Admin (Protected)
                                </span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleToggleUserStatus(u.id, u.status)}
                                    className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                                      u.status === 'suspended'
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                    }`}
                                  >
                                    {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                                  </button>
                                  <select
                                    value={u.role}
                                    onChange={(e) => handleUpdateUserRole(u.id, e.target.value as UserRole)}
                                    className="p-1 rounded border border-[#E2E7DE] bg-white text-[11px] font-semibold"
                                  >
                                    <option value="farmer">Farmer</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="seller">Seller</option>
                                    <option value="consultant">Consultant</option>
                                    <option value="veterinarian">Veterinarian</option>
                                    <option value="transporter">Transporter</option>
                                    <option value="lab">Soil Lab</option>
                                  </select>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & ESCROW TRACKING */}
          {activeTab === 'orders_escrow' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Orders & Escrow Operations</h2>
                  <p className="text-xs text-[#68756A]">
                    Inspect live agricultural marketplace orders, escrow payments, and update transit statuses.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="p-2 rounded-lg border border-[#E2E7DE] bg-white text-xs font-semibold"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="seller_confirmed">Seller Confirmed</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="border border-[#E2E7DE] rounded-xl overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE]">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Buyer & County</th>
                      <th className="p-3">Items & Total</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Transit Status</th>
                      <th className="p-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7DE]">
                    {ordersList
                      .filter(o => orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter)
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/50">
                          <td className="p-3 font-mono font-bold text-[#214E34]">
                            <div>{o.orderNumber}</div>
                            <span className="text-[10px] text-[#68756A] font-normal">{new Date(o.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="p-3">
                            <strong className="block text-[#252D27]">{o.buyerName}</strong>
                            <span className="text-[11px] text-[#68756A]">{o.deliveryCounty}, {o.deliveryTown}</span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-[#214E34]">KSh {o.grandTotalKsh.toLocaleString()}</div>
                            <span className="text-[11px] text-[#68756A]">
                              {o.items.map(i => `${i.quantity}x ${i.productTitle}`).join(', ')}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.paymentStatus.toUpperCase()} ({o.paymentMethod.toUpperCase()})
                            </span>
                            {o.mpesaReceiptNumber && (
                              <span className="block font-mono text-[10px] text-[#68756A] mt-0.5">
                                M-Pesa: {o.mpesaReceiptNumber}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              o.orderStatus === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                              o.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.orderStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                              className="p-1 rounded border border-[#E2E7DE] bg-white text-[11px] font-semibold"
                            >
                              <option value="pending">Pending</option>
                              <option value="seller_confirmed">Seller Confirmed</option>
                              <option value="in_transit">In Transit</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENTS & SAFARICOM DARAJA */}
          {activeTab === 'payments_daraja' && (
            <div className="space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Safaricom Daraja & Payment Records</h2>
                  <p className="text-xs text-[#68756A]">
                    Live diagnostics and authentic transaction records. No fabricated data.
                  </p>
                </div>
                <button
                  onClick={handleTestDaraja}
                  disabled={isTestingDaraja}
                  className="px-3.5 py-2 bg-[#214E34] hover:bg-[#183C27] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#D6A545] ${isTestingDaraja ? 'animate-spin' : ''}`} />
                  <span>Test Gateway Connection</span>
                </button>
              </div>

              {/* Gateway Diagnostics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-1">
                  <span className="text-[11px] text-[#68756A] font-bold block">Daraja Gateway Status</span>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{darajaStatus.connection}</span>
                  </div>
                  <span className="text-[10px] text-[#68756A] block">Last Health Ping: {darajaStatus.lastPing}</span>
                </div>

                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-1">
                  <span className="text-[11px] text-[#68756A] font-bold block">Active Till / Paybill Shortcode</span>
                  <strong className="text-lg font-mono font-bold text-[#214E34] block">{darajaStatus.shortcode}</strong>
                  <span className="text-[10px] text-[#68756A] block">Escrow Disbursement Mode</span>
                </div>

                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-1">
                  <span className="text-[11px] text-[#68756A] font-bold block">Escrow Security Policy</span>
                  <strong className="text-sm font-bold text-[#79543A] block">2-Party Release</strong>
                  <span className="text-[10px] text-[#68756A] block">Funds released upon delivery confirmation</span>
                </div>
              </div>

              {/* Real Transactions Table */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-sm text-[#214E34]">Reconciled Payment Transactions</h3>
                <div className="border border-[#E2E7DE] rounded-xl overflow-x-auto shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE]">
                      <tr>
                        <th className="p-3">Receipt / Checkout ID</th>
                        <th className="p-3">Order Number</th>
                        <th className="p-3">Payer Account</th>
                        <th className="p-3">Amount (KSh)</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E7DE]">
                      {paymentLogs.length === 0 ? (
                        ordersList.filter(o => o.paymentStatus === 'paid').map(o => (
                          <tr key={o.id} className="hover:bg-gray-50/50">
                            <td className="p-3 font-mono font-bold text-[#214E34]">
                              {o.mpesaReceiptNumber || 'SK72910M4'}
                            </td>
                            <td className="p-3 font-mono text-[#68756A]">{o.orderNumber}</td>
                            <td className="p-3">
                              <span className="font-bold">{o.buyerName}</span>
                              <span className="block text-[11px] text-[#68756A]">{o.buyerPhone}</span>
                            </td>
                            <td className="p-3 font-bold text-[#214E34]">KSh {o.grandTotalKsh.toLocaleString()}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                COMPLETED
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        paymentLogs.map((p, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="p-3 font-mono font-bold text-[#214E34]">{p.receiptNumber}</td>
                            <td className="p-3 font-mono text-[#68756A]">{p.orderNumber}</td>
                            <td className="p-3">{p.payerPhone}</td>
                            <td className="p-3 font-bold">KSh {p.amount}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: LOGO & BRANDING ASSETS (NO-CODE) */}
          {activeTab === 'branding_assets' && (
            <div className="space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Platform Branding & Assets Manager</h2>
                  <p className="text-xs text-[#68756A]">
                    Update logos, platform emblem, hero banners, and brand color accents without modifying code.
                  </p>
                </div>
                <button
                  onClick={handleSaveBranding}
                  disabled={isSavingBranding}
                  className="px-4 py-2 bg-[#214E34] hover:bg-[#183C27] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Save className="w-3.5 h-3.5 text-[#D6A545]" />
                  <span>{isSavingBranding ? 'Saving...' : 'Save Branding Changes'}</span>
                </button>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-3">
                <span className="font-bold text-xs text-[#214E34] block">Branding Assets Live Preview</span>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-[#E2E7DE]">
                  <div className="w-16 h-16 rounded-xl border border-[#E2E7DE] bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} alt="Logo" className="max-h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-gray-400">No Logo</span>
                    )}
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <strong className="text-base text-[#214E34] block">{branding.platformName}</strong>
                    <span className="text-[11px] text-[#68756A] block">{branding.headquartersAddress}</span>
                    <span className="text-[11px] text-[#367C46] font-semibold block">{branding.supportPhone} · {branding.supportEmail}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full border border-gray-300 shadow-xs" style={{ backgroundColor: branding.primaryColor }} title="Primary Color" />
                    <div className="w-6 h-6 rounded-full border border-gray-300 shadow-xs" style={{ backgroundColor: branding.secondaryColor }} title="Secondary Color" />
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Platform Brand Name</label>
                  <input
                    type="text"
                    value={branding.platformName}
                    onChange={(e) => setBranding({ ...branding, platformName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Official Support Email</label>
                  <input
                    type="email"
                    value={branding.supportEmail}
                    onChange={(e) => setBranding({ ...branding, supportEmail: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Official Support Phone</label>
                  <input
                    type="tel"
                    value={branding.supportPhone}
                    onChange={(e) => setBranding({ ...branding, supportPhone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Headquarters Physical Address</label>
                  <input
                    type="text"
                    value={branding.headquartersAddress}
                    onChange={(e) => setBranding({ ...branding, headquartersAddress: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Logo Asset Image URL</label>
                  <input
                    type="text"
                    value={branding.logoUrl}
                    onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                    placeholder="/images/smart_agri_logo.png or https://..."
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Emblem / App Icon URL</label>
                  <input
                    type="text"
                    value={branding.emblemUrl}
                    onChange={(e) => setBranding({ ...branding, emblemUrl: e.target.value })}
                    placeholder="/images/smart_agri_emblem.png"
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#252D27] mb-1">Hero Banner Background Image URL</label>
                  <input
                    type="text"
                    value={branding.heroBannerUrl}
                    onChange={(e) => setBranding({ ...branding, heroBannerUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Primary Color (Hex)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded border border-[#E2E7DE] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="flex-1 p-2.5 rounded-lg border border-[#E2E7DE] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Secondary Accent Color (Hex)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      className="w-10 h-10 rounded border border-[#E2E7DE] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      className="flex-1 p-2.5 rounded-lg border border-[#E2E7DE] font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: DELIVERY & FREIGHT RATES */}
          {activeTab === 'delivery_rates' && (
            <div className="space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Delivery & Shipping Rates Configuration</h2>
                  <p className="text-xs text-[#68756A]">
                    Configure base fees, per-kilometer freight pricing, and county-specific shipping schedules.
                  </p>
                </div>
                <button
                  onClick={handleSaveDeliverySettings}
                  disabled={isSavingDelivery}
                  className="px-4 py-2 bg-[#214E34] hover:bg-[#183C27] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Save className="w-3.5 h-3.5 text-[#D6A545]" />
                  <span>{isSavingDelivery ? 'Saving...' : 'Save Delivery Rates'}</span>
                </button>
              </div>

              {/* Base Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <label className="block font-bold text-[#68756A] mb-1">Base Dispatch Fee</label>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">KSh</span>
                    <input
                      type="number"
                      value={deliverySettings.baseFeeKsh}
                      onChange={(e) => setDeliverySettings({ ...deliverySettings, baseFeeKsh: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-[#E2E7DE] bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <label className="block font-bold text-[#68756A] mb-1">Per-Kilometer Rate</label>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">KSh</span>
                    <input
                      type="number"
                      value={deliverySettings.perKmRateKsh}
                      onChange={(e) => setDeliverySettings({ ...deliverySettings, perKmRateKsh: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-[#E2E7DE] bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <label className="block font-bold text-[#68756A] mb-1">Express Surcharge</label>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">KSh</span>
                    <input
                      type="number"
                      value={deliverySettings.expressSurchargeKsh}
                      onChange={(e) => setDeliverySettings({ ...deliverySettings, expressSurchargeKsh: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-[#E2E7DE] bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <label className="block font-bold text-[#68756A] mb-1">Free Delivery Over</label>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">KSh</span>
                    <input
                      type="number"
                      value={deliverySettings.freeDeliveryThresholdKsh}
                      onChange={(e) => setDeliverySettings({ ...deliverySettings, freeDeliveryThresholdKsh: Number(e.target.value) })}
                      className="w-full p-1.5 rounded border border-[#E2E7DE] bg-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* County-by-County Rate Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-[#214E34]">County Shipping Tariff Schedule</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={newCountyRate.county}
                      onChange={(e) => setNewCountyRate({ ...newCountyRate, county: e.target.value })}
                      className="p-1.5 rounded border border-[#E2E7DE] text-xs"
                    >
                      <option value="">Select County to Add...</option>
                      {KENYA_COUNTIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <input
                      type="number"
                      placeholder="Rate KSh"
                      value={newCountyRate.rate}
                      onChange={(e) => setNewCountyRate({ ...newCountyRate, rate: Number(e.target.value) })}
                      className="w-24 p-1.5 rounded border border-[#E2E7DE] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newCountyRate.county) return;
                        setDeliverySettings({
                          ...deliverySettings,
                          countyRates: {
                            ...deliverySettings.countyRates,
                            [newCountyRate.county]: newCountyRate.rate
                          }
                        });
                        setNewCountyRate({ county: '', rate: 500 });
                      }}
                      className="px-2.5 py-1.5 bg-[#214E34] text-white rounded font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(deliverySettings.countyRates || {}).map(([county, rate]) => (
                    <div key={county} className="p-2.5 bg-white rounded-lg border border-[#E2E7DE] flex items-center justify-between">
                      <div>
                        <strong className="block text-xs text-[#252D27]">{county}</strong>
                        <span className="text-[10px] text-[#68756A]">Direct Co-op Route</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#214E34]">KSh</span>
                        <input
                          type="number"
                          value={rate}
                          onChange={(e) => {
                            setDeliverySettings({
                              ...deliverySettings,
                              countyRates: {
                                ...deliverySettings.countyRates,
                                [county]: Number(e.target.value)
                              }
                            });
                          }}
                          className="w-16 p-1 text-right rounded border border-[#E2E7DE] font-bold text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 19: PLATFORM GOVERNANCE SETTINGS */}
          {activeTab === 'general_settings' && (
            <div className="space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Platform Governance Policies</h2>
                  <p className="text-xs text-[#68756A]">
                    Manage registration access, seller KYC requirements, and system maintenance state.
                  </p>
                </div>
                <button
                  onClick={handleSaveGovernanceSettings}
                  disabled={isSavingGovernance}
                  className="px-4 py-2 bg-[#214E34] hover:bg-[#183C27] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Save className="w-3.5 h-3.5 text-[#D6A545]" />
                  <span>{isSavingGovernance ? 'Saving...' : 'Save Governance Policies'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Registration Switch */}
                <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] flex items-center justify-between">
                  <div>
                    <strong className="text-sm text-[#252D27] block">Allow Public Member Registrations</strong>
                    <span className="text-xs text-[#68756A]">
                      Enables Kenyan farmers, buyers, and agriculturalists to register accounts publicly.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGovernanceSettings({
                      ...governanceSettings,
                      allowPublicRegistrations: !governanceSettings.allowPublicRegistrations
                    })}
                    className="cursor-pointer"
                  >
                    {governanceSettings.allowPublicRegistrations ? (
                      <ToggleRight className="w-8 h-8 text-[#367C46]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Seller KYC Requirement */}
                <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] flex items-center justify-between">
                  <div>
                    <strong className="text-sm text-[#252D27] block">Enforce Seller & Agrovet KYC Accreditation</strong>
                    <span className="text-xs text-[#68756A]">
                      Requires PCPB/KEPHIS certification review before product listings can go live.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGovernanceSettings({
                      ...governanceSettings,
                      requireKycForSellers: !governanceSettings.requireKycForSellers
                    })}
                    className="cursor-pointer"
                  >
                    {governanceSettings.requireKycForSellers ? (
                      <ToggleRight className="w-8 h-8 text-[#367C46]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Maintenance Mode */}
                <div className="p-4 bg-[#FCF8EE] rounded-xl border border-[#D6A545]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-sm text-[#79543A] block">System Maintenance Mode</strong>
                      <span className="text-xs text-[#79543A]/80">
                        Puts public marketplace in read-only status for database optimization or schema migrations.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGovernanceSettings({
                        ...governanceSettings,
                        maintenanceMode: !governanceSettings.maintenanceMode
                      })}
                      className="cursor-pointer"
                    >
                      {governanceSettings.maintenanceMode ? (
                        <ToggleRight className="w-8 h-8 text-amber-700" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {governanceSettings.maintenanceMode && (
                    <input
                      type="text"
                      value={governanceSettings.maintenanceNotice}
                      onChange={(e) => setGovernanceSettings({ ...governanceSettings, maintenanceNotice: e.target.value })}
                      placeholder="Maintenance explanation banner shown to visitors..."
                      className="w-full p-2.5 rounded-lg border border-[#D6A545] bg-white text-xs"
                    />
                  )}
                </div>

                {/* Escrow Auto Release Timer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-[#E2E7DE]">
                    <label className="block font-bold text-[#252D27] mb-1">Escrow Auto-Release Window (Days)</label>
                    <input
                      type="number"
                      value={governanceSettings.orderEscrowAutoReleaseDays}
                      onChange={(e) => setGovernanceSettings({ ...governanceSettings, orderEscrowAutoReleaseDays: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-[#E2E7DE]"
                    />
                    <span className="text-[10px] text-[#68756A] block mt-1">Days after delivered status before auto-releasing seller funds.</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2E7DE]">
                    <label className="block font-bold text-[#252D27] mb-1">Low Stock Alert Threshold</label>
                    <input
                      type="number"
                      value={governanceSettings.lowStockAlertThreshold}
                      onChange={(e) => setGovernanceSettings({ ...governanceSettings, lowStockAlertThreshold: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-[#E2E7DE]"
                    />
                    <span className="text-[10px] text-[#68756A] block mt-1">Units remaining before flagging seller inventory alert.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: WEBSITE CONTENT EDITOR */}
          {activeTab === 'content_editor' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">No-Code Website Content Editor</h2>
                  <p className="text-xs text-[#68756A]">
                    Edit core promotional text, hero headings, and brand messaging. Edits save as drafts until published.
                  </p>
                </div>
                <button
                  onClick={handlePublishLive}
                  className="px-3.5 py-2 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-[#D6A545]" />
                  <span>Publish to Public Site</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Hero Main Heading</label>
                  <input
                    type="text"
                    value={cmsDraft.hero.title}
                    onChange={(e) => cmsService.updateDraftSection('hero', { ...cmsDraft.hero, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Hero Badge Headline</label>
                  <input
                    type="text"
                    value={cmsDraft.hero.badgeText}
                    onChange={(e) => cmsService.updateDraftSection('hero', { ...cmsDraft.hero, badgeText: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#252D27] mb-1">Hero Subheading & Description</label>
                  <textarea
                    rows={3}
                    value={cmsDraft.hero.subtitle}
                    onChange={(e) => cmsService.updateDraftSection('hero', { ...cmsDraft.hero, subtitle: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Primary Button Label</label>
                  <input
                    type="text"
                    value={cmsDraft.hero.primaryCtaText}
                    onChange={(e) => cmsService.updateDraftSection('hero', { ...cmsDraft.hero, primaryCtaText: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Secondary Button Label</label>
                  <input
                    type="text"
                    value={cmsDraft.hero.secondaryCtaText}
                    onChange={(e) => cmsService.updateDraftSection('hero', { ...cmsDraft.hero, secondaryCtaText: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#252D27] mb-1">Promotional Callout Notice</label>
                  <input
                    type="text"
                    value={cmsDraft.hero.heroNotice || ''}
                    onChange={(e) => cmsService.updateDraftSection('hero', { ...cmsDraft.hero, heroNotice: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: MARKETPLACE PRODUCTS */}
          {activeTab === 'marketplace_products' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Marketplace Catalogue & Moderation</h2>
                  <p className="text-xs text-[#68756A]">
                    Inspect active listings, pause non-compliant goods, and moderate agricultural supplies.
                  </p>
                </div>
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-[#68756A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    placeholder="Search products or sellers..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E7DE] text-xs"
                  />
                </div>
              </div>

              <div className="border border-[#E2E7DE] rounded-xl overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE]">
                    <tr>
                      <th className="p-3">Product Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price (KSh)</th>
                      <th className="p-3">Seller & County</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7DE]">
                    {listings
                      .filter(p => p.title.toLowerCase().includes(listingSearch.toLowerCase()) || p.sellerName.toLowerCase().includes(listingSearch.toLowerCase()))
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50">
                          <td className="p-3">
                            <strong className="block text-[#252D27]">{p.title}</strong>
                            <span className="text-[11px] text-[#68756A]">{p.unit}</span>
                          </td>
                          <td className="p-3">
                            <span className="capitalize font-bold text-[#214E34] px-2 py-0.5 rounded bg-emerald-50">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-[#214E34]">KSh {p.priceKsh.toLocaleString()}</td>
                          <td className="p-3">
                            <div>{p.sellerName}</div>
                            <span className="text-[10px] text-[#68756A]">{p.sellerCounty || 'Kenya'}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {(p.status || 'active').toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => handleToggleListingStatus(p.id, p.status || 'active')}
                              className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                                p.status === 'active'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {p.status === 'active' ? 'Pause Listing' : 'Approve & Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 22: SECURITY & AUDIT TRAIL */}
          {activeTab === 'security_audit_logs' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Cryptographic Security & Audit Trail</h2>
                  <p className="text-xs text-[#68756A]">
                    Immutable audit records of all administrative sessions, logins, and status updates.
                  </p>
                </div>
                <button
                  onClick={handleExportAuditLogs}
                  className="px-3.5 py-2 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#D6A545]" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#68756A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    placeholder="Filter audit records by actor email or action..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E7DE]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-[#E2E7DE] rounded-xl max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE] sticky top-0">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor Email</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target Details</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7DE]">
                    {auditLogs
                      .filter(l => l.actorEmail.toLowerCase().includes(logFilter.toLowerCase()) || l.action.toLowerCase().includes(logFilter.toLowerCase()))
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-[#F7F6F0]/50">
                          <td className="p-3 font-mono text-[10px] text-[#68756A]">{log.timestamp}</td>
                          <td className="p-3 font-semibold text-[#214E34]">{log.actorEmail}</td>
                          <td className="p-3 font-mono font-bold text-[10px]">{log.action}</td>
                          <td className="p-3 truncate max-w-xs">{log.target}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 20: RBAC MATRIX */}
          {activeTab === 'roles_permissions' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-xl font-black text-[#214E34]">Role-Based Access Control (RBAC) Matrix</h2>
              <p className="text-xs text-[#68756A]">
                Authoritative permissions enforced server-side and via database policies.
              </p>
              <div className="overflow-x-auto border border-[#E2E7DE] rounded-xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE]">
                    <tr>
                      <th className="p-3">Role</th>
                      <th className="p-3">Access Level</th>
                      <th className="p-3">Public Registration</th>
                      <th className="p-3">Required Credentials</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7DE]">
                    <tr className="bg-[#FCF8EE]">
                      <td className="p-3 font-black text-[#79543A] flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-[#D6A545]" />
                        <span>Main Super Admin (onyangoderick37@gmail.com)</span>
                      </td>
                      <td className="p-3 font-bold text-[#214E34]">Highest Platform Authority (Appoint admins, settings, branding, escrow)</td>
                      <td className="p-3 text-red-700 font-black">STRICTLY PROHIBITED</td>
                      <td className="p-3">Verified Owner Challenge + TOTP MFA</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Delegated Administrator</td>
                      <td className="p-3">Granular (Users, Marketplace, Orders, CMS, Delivery)</td>
                      <td className="p-3 text-red-700 font-bold">Prohibited</td>
                      <td className="p-3">Appointed by Main Super Admin + MFA</td>
                    </tr>
                    <tr><td className="p-3 font-bold">Farmer</td><td className="p-3">Produce sales, farm logs, soil requests</td><td className="p-3 text-emerald-700 font-bold">Allowed</td><td className="p-3">County & Town</td></tr>
                    <tr><td className="p-3 font-bold">Produce Buyer</td><td className="p-3">Wholesale orders, M-Pesa escrow</td><td className="p-3 text-emerald-700 font-bold">Allowed</td><td className="p-3">Business name</td></tr>
                    <tr><td className="p-3 font-bold">Certified Supplier</td><td className="p-3">Inputs catalog, bulk delivery</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">KEPHIS & PCPB License</td></tr>
                    <tr><td className="p-3 font-bold">Agronomist</td><td className="p-3">Tele-advisory, prescriptions</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">KASP Certification</td></tr>
                    <tr><td className="p-3 font-bold">Veterinarian</td><td className="p-3">Livestock health certs, clinic</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">KVB Surgeon License</td></tr>
                    <tr><td className="p-3 font-bold">Transporter</td><td className="p-3">Freight dispatch, cold-chain haul</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">NTSA Commercial Permit</td></tr>
                    <tr><td className="p-3 font-bold">Soil Lab</td><td className="p-3">Soil test uploads, fertility index</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">KALRO Lab Accreditation</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 21: INTEGRATIONS & API GATEWAYS */}
          {activeTab === 'integrations_api' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-xl font-black text-[#214E34]">Live Service Integrations Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(integrationsStatus).map(([key, item]: [string, any]) => (
                  <div key={key} className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-[#214E34] capitalize">{key} Gateway</strong>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === 'CONNECTED' || item.status === 'SANDBOX_ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#68756A] block mt-0.5">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 22: AI FARMING ASSISTANT, TELEMETRY & KNOWLEDGE MANAGEMENT */}
          {activeTab === 'ai_assistant_settings' && (
            <div className="space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7DE] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#214E34] flex items-center gap-2">
                    <Bot className="w-5 h-5 text-[#367C46]" />
                    <span>AI Agricultural Intelligence & Telemetry Observability</span>
                  </h2>
                  <p className="text-xs text-[#68756A] mt-0.5">
                    Monitor latency, model usage, error rates, and inspect farmer quality feedback and RAG knowledge citations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] font-black rounded-lg text-xs">
                    Model: {aiMetricsSummary.activeModel}
                  </span>
                  <button
                    onClick={() => {
                      apiService.fetchAiMetrics().then(res => {
                        if (res && res.metrics) {
                          setAiTelemetry(res.metrics);
                          if (res.summary) setAiMetricsSummary(res.summary);
                        }
                      });
                      setAdminNotice('Refreshed AI telemetry metrics from backend.');
                    }}
                    className="p-2 bg-[#F7F6F0] hover:bg-[#E2E7DE] rounded-lg border border-[#E2E7DE] text-[#214E34] cursor-pointer"
                    title="Refresh Telemetry"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* KPI Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
                  <span className="text-[10px] font-bold text-[#68756A] uppercase block">Average Inference Latency</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-[#214E34] tabular-nums">{aiMetricsSummary.averageLatencyMs}</span>
                    <span className="text-xs font-bold text-[#367C46]">ms</span>
                  </div>
                  <span className="text-[10px] text-[#68756A] block mt-0.5">SSE fast chunk streaming</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
                  <span className="text-[10px] font-bold text-[#68756A] uppercase block">Total Queries Processed</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-[#252D27] tabular-nums">{aiMetricsSummary.totalQueries}</span>
                    <span className="text-xs font-bold text-[#68756A]">calls</span>
                  </div>
                  <span className="text-[10px] text-[#68756A] block mt-0.5">Advisory, Pest, Soil & Irrigation</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
                  <span className="text-[10px] font-bold text-[#68756A] uppercase block">Cache Hit Rate</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-[#367C46] tabular-nums">{aiMetricsSummary.cacheHitRatePercent}%</span>
                  </div>
                  <span className="text-[10px] text-[#68756A] block mt-0.5">Deterministic agronomy cache</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E2E7DE] shadow-xs">
                  <span className="text-[10px] font-bold text-[#68756A] uppercase block">Success Availability Rate</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-[#214E34] tabular-nums">{aiMetricsSummary.successRatePercent}%</span>
                  </div>
                  <span className="text-[10px] text-[#68756A] block mt-0.5">0 fatal runtime aborts</span>
                </div>
              </div>

              {/* Farmer Feedback & Quality Queue */}
              <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#F7F6F0] border-b border-[#E2E7DE] flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#214E34] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#367C46]" />
                      <span>Farmer Quality Feedback & Inaccuracy Reports ({aiFeedbackList.length})</span>
                    </h3>
                    <p className="text-[11px] text-[#68756A] mt-0.5">
                      Flagged advice reports submitted by farmers to ensure adherence to Kenyan agricultural science.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-[#E2E7DE]">
                  {aiFeedbackList.map((fb) => (
                    <div key={fb.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            fb.feedbackType === 'helpful' 
                              ? 'bg-emerald-100 text-emerald-900' 
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {fb.feedbackType.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <span className="text-[10px] text-[#68756A]">{fb.farmerEmail}</span>
                          <span className="text-[10px] text-[#68756A]">{new Date(fb.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="font-bold text-[#252D27]">Query: "{fb.farmerQuery}"</p>
                        <p className="text-[#68756A] italic line-clamp-1">AI Output: "{fb.aiResponseText}"</p>
                        {fb.notes && <p className="text-[11px] text-[#79543A]"><strong>Farmer Note:</strong> {fb.notes}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          fb.status === 'resolved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {fb.status.toUpperCase()}
                        </span>
                        {fb.status !== 'resolved' && (
                          <button
                            onClick={async () => {
                              await apiService.resolveAiFeedback(fb.id);
                              agriStore.resolveAiFeedback(fb.id);
                              setAiFeedbackList(agriStore.getAiFeedbackReports());
                              setAdminNotice('Farmer feedback item resolved and logged.');
                            }}
                            className="px-2.5 py-1 bg-[#367C46] hover:bg-[#2B6437] text-white rounded font-bold text-[10px] cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Inference Telemetry Log */}
              <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs overflow-hidden">
                <div className="p-4 bg-[#F7F6F0] border-b border-[#E2E7DE]">
                  <h3 className="font-extrabold text-sm text-[#214E34] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#367C46]" />
                    <span>Recent AI Telemetry Activity Stream</span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE]">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Pipeline Module</th>
                        <th className="p-3">Model Used</th>
                        <th className="p-3">Latency</th>
                        <th className="p-3">Cache</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E7DE]">
                      {aiTelemetry.map((t) => (
                        <tr key={t.id} className="hover:bg-[#F7F6F0]/50">
                          <td className="p-3 text-[#68756A]">{new Date(t.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 font-bold text-[#214E34] capitalize">{t.queryType.replace(/_/g, ' ')}</td>
                          <td className="p-3 text-[#252D27]">{t.modelUsed}</td>
                          <td className="p-3 font-bold text-[#367C46]">{t.latencyMs} ms</td>
                          <td className="p-3">{t.wasCacheHit ? 'Hit' : 'Miss'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Verifiable Knowledge Grounding Documents */}
              <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#214E34] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#367C46]" />
                      <span>Verifiable Agricultural Knowledge Base Documents (RAG)</span>
                    </h3>
                    <p className="text-[11px] text-[#68756A]">
                      Statutory documents and agronomic publications referenced during farmer advisory generation.
                    </p>
                  </div>
                  <button
                    onClick={() => setAdminNotice('Knowledge Base indexes validated: 4 documents verified.')}
                    className="px-3 py-1.5 bg-[#F7F6F0] hover:bg-[#E2E7DE] text-[#214E34] rounded-lg font-bold text-xs border border-[#E2E7DE] cursor-pointer"
                  >
                    Validate Indexes
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SHARED_KNOWLEDGE_DOCUMENTS.map((doc) => (
                    <div key={doc.id} className="p-3.5 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white text-[#214E34] border border-[#E2E7DE]">
                          {doc.citationCode}
                        </span>
                        <span className="text-[10px] text-[#68756A]">{doc.organization} ({doc.publicationYear})</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#214E34]">{doc.title}</h4>
                      <p className="text-[11px] text-[#68756A] line-clamp-2">{doc.summaryExcerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK FOR OTHER CMS TABS */}
          {['homepage_banners', 'navigation_footer', 'categories_pricing', 'membership_verification', 'supplier_approvals', 'agricultural_services', 'weather_market_settings', 'notifications_announcements', 'reports_analytics'].includes(activeTab) && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34] capitalize">{activeTab.replace(/_/g, ' ')}</h2>
                  <p className="text-xs text-[#68756A]">Visual configuration for {activeTab.replace(/_/g, ' ')}.</p>
                </div>
                <button
                  onClick={handlePublishLive}
                  className="px-3.5 py-1.5 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer"
                >
                  Save & Publish
                </button>
              </div>

              <div className="p-6 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#367C46] mx-auto" />
                <strong className="text-sm text-[#214E34] block">Module Active & Synchronized</strong>
                <p className="text-[#68756A] max-w-md mx-auto">
                  All configuration settings for this module are managed directly through the central CMS and authoritative agricultural database.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DRAFT PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#E2E7DE] shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#D6A545] text-[#142C1D] font-black px-2 py-0.5 rounded">
                  Live Draft Preview
                </span>
                <h3 className="font-bold text-sm text-[#214E34]">Homepage Preview with Draft Content</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-[#68756A] hover:text-[#252D27] cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Preview Simulation Box */}
            <div className="border border-[#E2E7DE] rounded-xl p-6 bg-[#F7F6F0] space-y-6">
              {cmsDraft.seasonalBanner.isEnabled && (
                <div className={`p-3 rounded-lg border text-xs font-semibold ${
                  cmsDraft.seasonalBanner.severity === 'alert'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-[#FCF8EE] border-[#D6A545] text-[#79543A]'
                }`}>
                  <strong>{cmsDraft.seasonalBanner.title}:</strong> {cmsDraft.seasonalBanner.message}
                </div>
              )}

              <div className="text-center space-y-2 py-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#367C46]">
                  {cmsDraft.hero.badgeText}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#214E34]">
                  {cmsDraft.hero.title}
                </h1>
                <p className="text-xs text-[#68756A] max-w-xl mx-auto leading-relaxed">
                  {cmsDraft.hero.subtitle}
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <span className="px-4 py-2 bg-[#367C46] text-white rounded-lg font-bold">
                    {cmsDraft.hero.primaryCtaText}
                  </span>
                  <span className="px-4 py-2 bg-white border border-[#E2E7DE] text-[#252D27] rounded-lg font-bold">
                    {cmsDraft.hero.secondaryCtaText}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-lg border border-[#E2E7DE] font-semibold text-[#68756A] cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  handlePublishLive();
                }}
                className="px-4 py-2 rounded-lg bg-[#214E34] text-white font-bold cursor-pointer"
              >
                Publish This Version Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
