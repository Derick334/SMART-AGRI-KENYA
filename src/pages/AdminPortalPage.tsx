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
  AlertCircle
} from 'lucide-react';
import { agriStore } from '../services/store';
import { cmsService, CmsDataPayload, CmsServiceCard } from '../services/cms';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';
import { UserRole, UserProfile, Product } from '../types';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface AdminPortalPageProps {
  onNavigateToSite?: (tab?: string) => void;
  onRequireAdminLogin?: () => void;
}

export type AdminTab = 
  | 'overview'
  | 'content_editor'
  | 'homepage_banners'
  | 'navigation_footer'
  | 'marketplace_products'
  | 'categories_pricing'
  | 'user_management'
  | 'membership_verification'
  | 'supplier_approvals'
  | 'agricultural_services'
  | 'weather_market_settings'
  | 'ai_assistant_settings'
  | 'notifications_announcements'
  | 'reports_analytics'
  | 'integrations_api'
  | 'roles_permissions'
  | 'security_audit_logs'
  | 'general_settings';

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ 
  onNavigateToSite, 
  onRequireAdminLogin 
}) => {
  const [currentUser, setCurrentUser] = useState(agriStore.getCurrentUser());
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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

  // Verify administrator authorization
  useEffect(() => {
    const user = agriStore.getCurrentUser();
    setCurrentUser(user);
    if (!agriStore.isAuthenticated() || user.role !== 'admin') {
      if (onRequireAdminLogin) onRequireAdminLogin();
    }
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

  // Fetch real integrations status from server
  useEffect(() => {
    const fetchIntegrations = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_admin_token') : null;
      if (!token) return;
      try {
        const res = await fetch('/api/admin/integrations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIntegrationsStatus(data);
        }
      } catch {}
    };
    fetchIntegrations();
  }, []);

  const showNotice = (msg: string) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(null), 4500);
  };

  // Publish Draft to Live Public Website
  const handlePublishLive = async () => {
    setIsPublishing(true);
    try {
      const res = await cmsService.publishLive(currentUser.name || 'Platform Owner');
      showNotice(`🎉 Changes published live successfully! Version ${res.version} is now active.`);
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
  const handleToggleUserStatus = async (userId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    agriStore.updateUserStatus(userId, nextStatus as any);
    setUserList([...agriStore.getUsers()]);
    
    agriStore.addAuditLog({
      actorEmail: currentUser.email,
      actorRole: 'admin',
      action: nextStatus === 'suspended' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      target: `User ID: ${userId}`,
      status: 'SUCCESS',
    });
    setAuditLogs([...agriStore.getAuditLogs()]);
    showNotice(`User status updated to ${nextStatus.toUpperCase()}!`);
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

  // Sidebar navigation items (18 sections)
  const navSections: Array<{ id: AdminTab; label: string; icon: any; category: string; badge?: number }> = [
    // Core & CMS
    { id: 'overview', label: '1. Overview & KPIs', icon: LayoutDashboard, category: 'Core Dashboard' },
    { id: 'content_editor', label: '2. Website Content Editor', icon: FileText, category: 'No-Code CMS' },
    { id: 'homepage_banners', label: '3. Homepage & Banners', icon: Home, category: 'No-Code CMS' },
    { id: 'navigation_footer', label: '4. Navigation & Footer', icon: Menu, category: 'No-Code CMS' },
    
    // Marketplace & Catalog
    { id: 'marketplace_products', label: '5. Marketplace & Products', icon: ShoppingBag, category: 'Commerce Engine', badge: listings.length },
    { id: 'categories_pricing', label: '6. Categories & Pricing', icon: Tag, category: 'Commerce Engine' },
    
    // People & Governance
    { id: 'user_management', label: '7. User Management', icon: Users, category: 'User Governance', badge: userList.length },
    { id: 'membership_verification', label: '8. Membership Verification', icon: BadgeCheck, category: 'User Governance' },
    { id: 'supplier_approvals', label: '9. Suppliers & Expert Approvals', icon: Award, category: 'User Governance', badge: pendingApprovals.length },
    
    // Services & Operations
    { id: 'agricultural_services', label: '10. Agricultural Services', icon: Stethoscope, category: 'Agri Operations' },
    { id: 'weather_market_settings', label: '11. Weather & Market Settings', icon: CloudSun, category: 'Agri Operations' },
    { id: 'ai_assistant_settings', label: '12. AI Assistant Settings', icon: Bot, category: 'Agri Operations' },
    { id: 'notifications_announcements', label: '13. Notifications & Broadcasts', icon: Bell, category: 'Agri Operations' },
    
    // Analytics & System
    { id: 'reports_analytics', label: '14. Reports & Analytics', icon: BarChart3, category: 'System & Security' },
    { id: 'integrations_api', label: '15. Integrations & API Config', icon: PlugZap, category: 'System & Security' },
    { id: 'roles_permissions', label: '16. Roles & Permissions', icon: Key, category: 'System & Security' },
    { id: 'security_audit_logs', label: '17. Security & Audit Logs', icon: Shield, category: 'System & Security', badge: auditLogs.length },
    { id: 'general_settings', label: '18. General Settings', icon: Settings, category: 'System & Security' },
  ];

  // Group sidebar items by category
  const categories = Array.from(new Set(navSections.map(n => n.category)));

  // If unauthorized, render security checkpoint
  if (currentUser.role !== 'admin') {
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
      {/* TOP FLOATING OWNER STATUS BAR */}
      <header className="sticky top-0 z-40 bg-[#142C1D] text-white border-b border-[#214E34] shadow-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D6A545] text-[#142C1D] font-black flex items-center justify-center shrink-0">
              HQ
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm text-white">DERIV-AGRI KENYA</span>
                <span className="text-[10px] bg-[#D6A545] text-[#142C1D] font-black px-2 py-0.5 rounded">
                  Owner Control Centre
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> MFA Authenticated
                </span>
              </div>
              <div className="text-[11px] text-white/70">
                Logged in: <strong>{currentUser.email}</strong> · Session ID: SAK-HQ-2026-OWNER
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
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preview Draft</span>
            </button>

            {/* Publish Live Button */}
            <button
              onClick={handlePublishLive}
              disabled={isPublishing}
              className={`px-3.5 py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                hasUnpublished
                  ? 'bg-[#D6A545] hover:bg-[#c29339] text-[#142C1D] animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPublishing ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{hasUnpublished ? 'Publish Changes Live' : 'Published Live'}</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={() => {
                agriStore.logout();
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('deriv_agri_admin_token');
                }
                if (onRequireAdminLogin) onRequireAdminLogin();
              }}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition cursor-pointer text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notice Toast */}
      {adminNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#142C1D] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-[#D6A545] flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#D6A545]" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* MAIN ADMIN LAYOUT: Responsive Sidebar + Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* RESPONSIVE SIDEBAR (18 Sections) */}
        <aside className="w-72 shrink-0 hidden lg:block bg-white rounded-2xl border border-[#E2E7DE] shadow-xs p-3.5 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
          <div className="px-2 py-1 flex items-center justify-between border-b border-[#E2E7DE] pb-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#68756A]">
              Navigation Menu (18 Modules)
            </span>
            <span className="text-[10px] font-mono bg-[#EBF3ED] text-[#214E34] font-bold px-2 py-0.5 rounded">
              v{cmsDraft.version}
            </span>
          </div>

          {categories.map((category) => (
            <div key={category} className="space-y-1">
              <div className="text-[10px] font-black text-[#68756A] uppercase tracking-wider px-2 py-1">
                {category}
              </div>
              <div className="space-y-0.5">
                {navSections.filter(n => n.category === category).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-[#214E34] text-white shadow-xs'
                          : 'text-[#252D27] hover:bg-[#F7F6F0] hover:text-[#214E34]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D6A545]' : 'text-[#68756A]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
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
        </aside>

        {/* MOBILE HORIZONTAL SELECTOR (For tablets & small screens) */}
        <div className="lg:hidden w-full mb-3">
          <label className="block text-xs font-bold text-[#252D27] mb-1">Select Admin Module</label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AdminTab)}
            className="w-full p-2.5 rounded-xl border border-[#E2E7DE] bg-white font-bold text-xs"
          >
            {navSections.map(n => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>

        {/* MAIN MODULE CONTENT VIEW */}
        <main className="flex-1 bg-white rounded-2xl border border-[#E2E7DE] shadow-xs p-6 space-y-6 overflow-hidden">
          {/* SECTION 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-[#214E34]">Executive Command Overview</h2>
                <p className="text-xs text-[#68756A]">
                  Real-time operational metrics across all 47 Kenyan agricultural counties.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#EBF3ED] border border-[#CFD7CA] space-y-1">
                  <div className="text-[10px] font-bold text-[#68756A] uppercase tracking-wider">Total Platform Users</div>
                  <div className="text-2xl font-black text-[#214E34]">{userList.length}</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Across 47 Counties</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FCF8EE] border border-[#D6A545]/40 space-y-1">
                  <div className="text-[10px] font-bold text-[#79543A] uppercase tracking-wider">Pending KYC Approvals</div>
                  <div className="text-2xl font-black text-[#79543A]">{pendingApprovals.length}</div>
                  <span className="text-[10px] text-amber-700 font-semibold">Action Required</span>
                </div>

                <div className="p-4 rounded-xl bg-[#EBF3ED] border border-[#CFD7CA] space-y-1">
                  <div className="text-[10px] font-bold text-[#68756A] uppercase tracking-wider">Active Marketplace Items</div>
                  <div className="text-2xl font-black text-[#214E34]">{listings.length}</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">KEPHIS & PCPB compliant</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6F0] border border-[#E2E7DE] space-y-1">
                  <div className="text-[10px] font-bold text-[#68756A] uppercase tracking-wider">M-Pesa Escrow Volume</div>
                  <div className="text-2xl font-black text-[#214E34]">KSh 3,840,500</div>
                  <span className="text-[10px] text-[#68756A] font-semibold">0 Open Disputes</span>
                </div>
              </div>

              {/* System Integrations Quick Summary */}
              <div className="p-4 rounded-xl border border-[#E2E7DE] bg-[#F7F6F0] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xs text-[#214E34] flex items-center gap-1.5">
                    <PlugZap className="w-4 h-4 text-[#367C46]" />
                    <span>Real-Time Integration Gateways</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('integrations_api')}
                    className="text-[11px] text-[#367C46] font-bold hover:underline cursor-pointer"
                  >
                    Manage Configurations →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E7DE] flex items-center justify-between">
                    <span>Google Gemini AI</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E7DE] flex items-center justify-between">
                    <span>Safaricom M-Pesa</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E7DE] flex items-center justify-between">
                    <span>Supabase PostgreSQL</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E7DE] flex items-center justify-between">
                    <span>Open-Meteo & KMD</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
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

          {/* SECTION 2: WEBSITE CONTENT EDITOR */}
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
                  className="px-3 py-1.5 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
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

          {/* SECTION 3: HOMEPAGE AND BANNERS */}
          {activeTab === 'homepage_banners' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Homepage & Broadcast Banners</h2>
                  <p className="text-xs text-[#68756A]">
                    Configure emergency weather alerts, pest outbreaks, and seasonal crop announcements.
                  </p>
                </div>
                <button
                  onClick={handlePublishLive}
                  className="px-3 py-1.5 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer"
                >
                  Publish Changes
                </button>
              </div>

              {/* Banner Toggle */}
              <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#252D27]">
                    <input
                      type="checkbox"
                      checked={cmsDraft.seasonalBanner.isEnabled}
                      onChange={(e) => cmsService.updateDraftSection('seasonalBanner', { ...cmsDraft.seasonalBanner, isEnabled: e.target.checked })}
                      className="rounded text-[#367C46]"
                    />
                    <span>Enable Global Announcement Banner on Public Website</span>
                  </label>

                  <select
                    value={cmsDraft.seasonalBanner.severity}
                    onChange={(e) => cmsService.updateDraftSection('seasonalBanner', { ...cmsDraft.seasonalBanner, severity: e.target.value as any })}
                    className="text-xs p-1.5 rounded-lg border border-[#E2E7DE] bg-white font-semibold"
                  >
                    <option value="info">Info (Blue/Green)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="alert">Emergency Alert (Red)</option>
                    <option value="success">Success (Emerald)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={cmsDraft.seasonalBanner.title}
                    onChange={(e) => cmsService.updateDraftSection('seasonalBanner', { ...cmsDraft.seasonalBanner, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Broadcast Message</label>
                  <textarea
                    rows={2}
                    value={cmsDraft.seasonalBanner.message}
                    onChange={(e) => cmsService.updateDraftSection('seasonalBanner', { ...cmsDraft.seasonalBanner, message: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#252D27] mb-1">Action Button Text (Optional)</label>
                    <input
                      type="text"
                      value={cmsDraft.seasonalBanner.ctaText || ''}
                      onChange={(e) => cmsService.updateDraftSection('seasonalBanner', { ...cmsDraft.seasonalBanner, ctaText: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#252D27] mb-1">Destination Tab</label>
                    <select
                      value={cmsDraft.seasonalBanner.ctaTab || 'soil-testing'}
                      onChange={(e) => cmsService.updateDraftSection('seasonalBanner', { ...cmsDraft.seasonalBanner, ctaTab: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#E2E7DE] bg-white text-xs"
                    >
                      <option value="soil-testing">Soil Testing</option>
                      <option value="pest-diagnosis">Pest Diagnosis</option>
                      <option value="market-prices">Market Prices</option>
                      <option value="weather">Weather Advisory</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Service Cards CMS editor */}
              <div>
                <h3 className="font-extrabold text-sm text-[#214E34] mb-2">Homepage Service Cards Editor</h3>
                <div className="space-y-2">
                  {cmsDraft.services.map((card, idx) => (
                    <div key={card.id} className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-[#214E34]">Card #{idx + 1}: {card.title}</strong>
                        <label className="flex items-center gap-1.5 text-xs text-[#68756A] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={card.isActive}
                            onChange={(e) => {
                              const updated = [...cmsDraft.services];
                              updated[idx].isActive = e.target.checked;
                              cmsService.updateDraftSection('services', updated);
                            }}
                            className="rounded text-[#367C46]"
                          />
                          <span>Active on Home</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            const updated = [...cmsDraft.services];
                            updated[idx].title = e.target.value;
                            cmsService.updateDraftSection('services', updated);
                          }}
                          className="p-2 rounded border border-[#E2E7DE] bg-white font-bold"
                          placeholder="Card Title"
                        />
                        <input
                          type="text"
                          value={card.subtitle}
                          onChange={(e) => {
                            const updated = [...cmsDraft.services];
                            updated[idx].subtitle = e.target.value;
                            cmsService.updateDraftSection('services', updated);
                          }}
                          className="p-2 rounded border border-[#E2E7DE] bg-white"
                          placeholder="Card Subtitle"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: NAVIGATION AND FOOTER */}
          {activeTab === 'navigation_footer' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Navigation & Footer Configuration</h2>
                  <p className="text-xs text-[#68756A]">
                    Configure platform brand headers, customer helpline numbers, and legal copyright details.
                  </p>
                </div>
                <button
                  onClick={handlePublishLive}
                  className="px-3 py-1.5 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer"
                >
                  Publish Changes
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={cmsDraft.navFooter.brandName}
                    onChange={(e) => cmsService.updateDraftSection('navFooter', { ...cmsDraft.navFooter, brandName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={cmsDraft.navFooter.brandTagline}
                    onChange={(e) => cmsService.updateDraftSection('navFooter', { ...cmsDraft.navFooter, brandTagline: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Helpline Phone Numbers</label>
                  <input
                    type="text"
                    value={cmsDraft.navFooter.helplinePhone}
                    onChange={(e) => cmsService.updateDraftSection('navFooter', { ...cmsDraft.navFooter, helplinePhone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Support Email Address</label>
                  <input
                    type="email"
                    value={cmsDraft.navFooter.supportEmail}
                    onChange={(e) => cmsService.updateDraftSection('navFooter', { ...cmsDraft.navFooter, supportEmail: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#252D27] mb-1">Headquarters Physical Address</label>
                  <input
                    type="text"
                    value={cmsDraft.navFooter.headquartersAddress}
                    onChange={(e) => cmsService.updateDraftSection('navFooter', { ...cmsDraft.navFooter, headquartersAddress: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#252D27] mb-1">Legal Copyright Text</label>
                  <input
                    type="text"
                    value={cmsDraft.navFooter.copyrightText}
                    onChange={(e) => cmsService.updateDraftSection('navFooter', { ...cmsDraft.navFooter, copyrightText: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: MARKETPLACE AND PRODUCTS */}
          {activeTab === 'marketplace_products' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Marketplace Catalog Moderation</h2>
                  <p className="text-xs text-[#68756A]">
                    Inspect, approve, pause, and verify agricultural crop and input listings.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#68756A]">
                  Total Listings: <strong>{listings.length}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#68756A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    placeholder="Search by crop, seller, or county..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E7DE]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-[#E2E7DE] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE]">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Seller & County</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">KEPHIS Status</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7DE]">
                    {listings.filter(l => l.title.toLowerCase().includes(listingSearch.toLowerCase()) || l.sellerName.toLowerCase().includes(listingSearch.toLowerCase())).map((item) => (
                      <tr key={item.id} className="hover:bg-[#F7F6F0]/50">
                        <td className="p-3 font-bold text-[#214E34]">{item.title}</td>
                        <td className="p-3 capitalize">{item.category}</td>
                        <td className="p-3">{item.sellerName} ({item.sellerCounty || 'Kenya'})</td>
                        <td className="p-3 font-mono font-bold">KSh {(item.priceKsh || 0).toLocaleString()}/{item.unit}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Verified
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleListingStatus(item.id, item.status)}
                            className="px-2.5 py-1 rounded bg-[#EBF3ED] hover:bg-[#CFD7CA] text-[#214E34] font-bold text-[11px] cursor-pointer"
                          >
                            {item.status === 'active' ? 'Pause Listing' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 6: CATEGORIES AND PRICING */}
          {activeTab === 'categories_pricing' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-xl font-black text-[#214E34]">Marketplace Categories & Escrow Pricing</h2>
              <p className="text-xs text-[#68756A]">
                Configure commission fee percentages, minimum wholesale thresholds, and enabled categories.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2">
                  <label className="block font-bold text-[#252D27]">M-Pesa Escrow Processing Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={cmsDraft.general.escrowFeePercent}
                    onChange={(e) => cmsService.updateDraftSection('general', { ...cmsDraft.general, escrowFeePercent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white font-bold"
                  />
                  <span className="text-[10px] text-[#68756A]">Current standard: 1.5% deduction on successful delivery inspection.</span>
                </div>

                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-2">
                  <label className="block font-bold text-[#252D27]">Currency Symbol</label>
                  <input
                    type="text"
                    value={cmsDraft.general.currencySymbol}
                    onChange={(e) => cmsService.updateDraftSection('general', { ...cmsDraft.general, currencySymbol: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white font-bold"
                  />
                  <span className="text-[10px] text-[#68756A]">Default: KSh (Kenyan Shillings)</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: USER MANAGEMENT */}
          {activeTab === 'user_management' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">User Accounts & Roles Governance</h2>
                  <p className="text-xs text-[#68756A]">
                    Review members, manage roles, audit statuses, and suspend or restore accounts.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#68756A]">
                  Total Users: <strong>{userList.length}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#68756A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by member name, email, phone, or county..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="p-2 rounded-lg border border-[#E2E7DE] font-semibold text-xs"
                >
                  <option value="all">All Roles</option>
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Produce Buyer</option>
                  <option value="seller">Certified Supplier</option>
                  <option value="consultant">Agronomist</option>
                  <option value="veterinarian">Veterinarian</option>
                  <option value="transporter">Transporter</option>
                  <option value="lab">Soil Lab</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="overflow-x-auto border border-[#E2E7DE] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F6F0] text-[#68756A] font-bold border-b border-[#E2E7DE]">
                    <tr>
                      <th className="p-3">Member Name & Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">County</th>
                      <th className="p-3">Member ID</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7DE]">
                    {userList
                      .filter(u => userRoleFilter === 'all' || u.role === userRoleFilter)
                      .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                      .map((user) => (
                        <tr key={user.id} className="hover:bg-[#F7F6F0]/50">
                          <td className="p-3">
                            <strong className="text-[#214E34] block">{user.name}</strong>
                            <span className="text-[10px] text-[#68756A]">{user.email} · {user.phone}</span>
                          </td>
                          <td className="p-3 capitalize font-semibold">{user.role}</td>
                          <td className="p-3">{user.county}</td>
                          <td className="p-3 font-mono font-bold text-[11px]">{user.memberId || user.membershipCode}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              user.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {user.status?.toUpperCase() || 'ACTIVE'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleToggleUserStatus(user.id, user.status)}
                                className={`px-2.5 py-1 rounded font-bold text-[11px] cursor-pointer ${
                                  user.status === 'suspended'
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {user.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 8: MEMBERSHIP VERIFICATION */}
          {activeTab === 'membership_verification' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-xl font-black text-[#214E34]">Authoritative Membership Registry Lookup</h2>
              <p className="text-xs text-[#68756A]">
                Issue, revoke, and audit SAK digital identification cards with zero PII exposure policy.
              </p>

              <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-3">
                <span className="font-bold text-xs text-[#214E34]">Registry Member Cards Issued:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 bg-white rounded-lg border border-[#E2E7DE]">
                    <div className="text-[10px] text-[#68756A]">Gold Members</div>
                    <strong className="text-base text-[#214E34]">1,420</strong>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E2E7DE]">
                    <div className="text-[10px] text-[#68756A]">Silver Members</div>
                    <strong className="text-base text-[#214E34]">3,890</strong>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E2E7DE]">
                    <div className="text-[10px] text-[#68756A]">Platinum Partners</div>
                    <strong className="text-base text-[#214E34]">158</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: SUPPLIERS AND EXPERT APPROVALS */}
          {activeTab === 'supplier_approvals' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Suppliers & Expert KYC Accreditation</h2>
                  <p className="text-xs text-[#68756A]">
                    Review and approve submitted business licenses (KEPHIS, PCPB, KVB, NTSA) before granting restricted seller and consultant privileges.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#79543A] bg-[#FCF8EE] px-3 py-1 rounded-full border border-[#D6A545]/40">
                  {pendingApprovals.length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {pendingApprovals.length === 0 ? (
                  <div className="p-8 text-center text-[#68756A]">
                    All professional KYC accreditation requests have been reviewed.
                  </div>
                ) : (
                  pendingApprovals.map((app) => (
                    <div key={app.id} className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-[#214E34]">{app.name}</strong>
                            <span className="text-[10px] bg-[#EBF3ED] text-[#214E34] font-bold px-2 py-0.5 rounded capitalize">
                              {app.role}
                            </span>
                            <span className="text-[10px] text-[#68756A]">{app.county} County</span>
                          </div>
                          <span className="text-[11px] text-[#252D27] block mt-0.5">{app.organizationName} · {app.cropsOrSpecialty}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#68756A]">Applied: {app.appliedDate}</span>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-[#E2E7DE] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#68756A] block">License & Accreditation Code</span>
                          <strong className="font-mono text-[#214E34] text-xs">{app.licenseNumber}</strong>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                          Identity Documents Attached
                        </span>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleKycDecision(app.id, app.name, 'rejected')}
                          className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 font-bold hover:bg-red-50 cursor-pointer"
                        >
                          Reject / Flag
                        </button>
                        <button
                          onClick={() => handleKycDecision(app.id, app.name, 'approved')}
                          className="px-4 py-1.5 rounded-lg bg-[#214E34] hover:bg-[#183C27] text-white font-bold cursor-pointer"
                        >
                          Approve Accreditation
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SECTION 10: AGRICULTURAL SERVICES */}
          {activeTab === 'agricultural_services' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-xl font-black text-[#214E34]">Agricultural Services & Logistics Settings</h2>
              <p className="text-xs text-[#68756A]">
                Configure standard soil laboratory fees, veterinary consultation benchmarks, and KeNHA freight formulas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <label className="block font-bold mb-1">Standard Soil Fertility Package (KSh)</label>
                  <input type="number" defaultValue={2500} className="w-full p-2 bg-white rounded border border-[#E2E7DE]" />
                </div>
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <label className="block font-bold mb-1">Veterinary Tele-Consultation Benchmark (KSh)</label>
                  <input type="number" defaultValue={500} className="w-full p-2 bg-white rounded border border-[#E2E7DE]" />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 11: WEATHER AND MARKET DATA SETTINGS */}
          {activeTab === 'weather_market_settings' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-xl font-black text-[#214E34]">Weather & Commodity Market Settings</h2>
              <p className="text-xs text-[#68756A]">
                Manage Kenya Meteorological Department (KMD) synoptic grid sources and default monitoring county.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Default Monitoring County</label>
                  <select
                    value={cmsDraft.general.defaultMonitoringCounty}
                    onChange={(e) => cmsService.updateDraftSection('general', { ...cmsDraft.general, defaultMonitoringCounty: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white font-bold"
                  >
                    {KENYA_COUNTIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 12: AI ASSISTANT SETTINGS */}
          {activeTab === 'ai_assistant_settings' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">Gemini AI Assistant Guidance Settings</h2>
                  <p className="text-xs text-[#68756A]">
                    Tailor agro-ecological system prompts and temperature for the Senior Agricultural Specialist.
                  </p>
                </div>
                <button
                  onClick={handlePublishLive}
                  className="px-3 py-1.5 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer"
                >
                  Save AI Config
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Active GenAI Model</label>
                    <input
                      type="text"
                      disabled
                      value={cmsDraft.ai.modelName}
                      className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-[#F7F6F0] font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Generation Temperature ({cmsDraft.ai.temperature})</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={cmsDraft.ai.temperature}
                      onChange={(e) => cmsService.updateDraftSection('ai', { ...cmsDraft.ai, temperature: Number(e.target.value) })}
                      className="w-full mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Tailored System Guidance Instruction</label>
                  <textarea
                    rows={4}
                    value={cmsDraft.ai.systemInstructionCustom}
                    onChange={(e) => cmsService.updateDraftSection('ai', { ...cmsDraft.ai, systemInstructionCustom: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 13: NOTIFICATIONS AND ANNOUNCEMENTS */}
          {activeTab === 'notifications_announcements' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-xl font-black text-[#214E34]">Announcements & SMS Broadcast Preview</h2>
              <p className="text-xs text-[#68756A]">
                Dispatch county-wide emergency pest/drought advisories via SMS and platform banners.
              </p>
              <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] space-y-3">
                <label className="block font-bold text-[#252D27]">Broadcast Message Preview</label>
                <textarea rows={3} placeholder="Type broadcast message..." className="w-full p-2.5 rounded border border-[#E2E7DE] bg-white text-xs" />
                <button onClick={() => showNotice('SMS broadcast simulation dispatched to 14,280 farmers.')} className="px-4 py-2 bg-[#214E34] text-white font-bold rounded-lg cursor-pointer">
                  Send Advisory Broadcast
                </button>
              </div>
            </div>
          )}

          {/* SECTION 14: REPORTS AND ANALYTICS */}
          {activeTab === 'reports_analytics' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">National Reports & Analytics</h2>
                  <p className="text-xs text-[#68756A]">Crop trading volumes, escrow fulfillment rates, and county distributions.</p>
                </div>
                <button
                  onClick={handleExportAuditLogs}
                  className="px-3 py-1.5 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report (CSV)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <span className="text-[10px] text-[#68756A] block">Fulfillment Rate</span>
                  <strong className="text-xl text-[#214E34]">99.4%</strong>
                </div>
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <span className="text-[10px] text-[#68756A] block">Top Traded Crop</span>
                  <strong className="text-xl text-[#214E34]">Shangi Potatoes</strong>
                </div>
                <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE]">
                  <span className="text-[10px] text-[#68756A] block">Fastest Growing County</span>
                  <strong className="text-xl text-[#214E34]">Nakuru & Uasin Gishu</strong>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 15: INTEGRATIONS AND API CONFIGURATION */}
          {activeTab === 'integrations_api' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-xl font-black text-[#214E34]">Integrations & Private API Status</h2>
              <p className="text-xs text-[#68756A]">
                Authoritative security verification of external providers. In accordance with zero-trust architecture, secrets are kept exclusively on the server.
              </p>

              <div className="space-y-3">
                {Object.entries(integrationsStatus).map(([key, item]: [string, any]) => (
                  <div key={key} className="p-4 rounded-xl border border-[#E2E7DE] bg-[#F7F6F0] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-[#214E34] capitalize">{key} Service</strong>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#68756A] block mt-0.5">{item.description}</span>
                    </div>
                    {item.maskedKey && (
                      <span className="font-mono text-xs bg-white px-2.5 py-1 rounded border border-[#E2E7DE] text-[#252D27]">
                        {item.maskedKey}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 16: ROLES AND PERMISSIONS */}
          {activeTab === 'roles_permissions' && (
            <div className="space-y-4 text-xs">
              <h2 className="text-xl font-black text-[#214E34]">Role-Based Access Control (RBAC) Matrix</h2>
              <p className="text-xs text-[#68756A]">
                Authoritative permissions enforced via PostgreSQL Row Level Security (RLS) policies.
              </p>
              <div className="overflow-x-auto border border-[#E2E7DE] rounded-xl">
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
                    <tr><td className="p-3 font-bold">Farmer</td><td className="p-3">Produce sales, farm logs, soil requests</td><td className="p-3 text-emerald-700 font-bold">Allowed</td><td className="p-3">County & Town</td></tr>
                    <tr><td className="p-3 font-bold">Produce Buyer</td><td className="p-3">Wholesale orders, M-Pesa escrow</td><td className="p-3 text-emerald-700 font-bold">Allowed</td><td className="p-3">Business name</td></tr>
                    <tr><td className="p-3 font-bold">Certified Supplier</td><td className="p-3">Inputs catalog, bulk delivery</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">KEPHIS & PCPB License</td></tr>
                    <tr><td className="p-3 font-bold">Agronomist</td><td className="p-3">Tele-advisory, prescriptions</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">KASP Certification</td></tr>
                    <tr><td className="p-3 font-bold">Veterinarian</td><td className="p-3">Livestock health certs, clinic</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">KVB Surgeon License</td></tr>
                    <tr><td className="p-3 font-bold">Transporter</td><td className="p-3">Freight dispatch, cold-chain haul</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">NTSA Commercial Permit</td></tr>
                    <tr><td className="p-3 font-bold">Soil Lab</td><td className="p-3">Soil test uploads, fertility index</td><td className="p-3 text-amber-700 font-bold">KYC Vetting</td><td className="p-3">KALRO Lab Accreditation</td></tr>
                    <tr className="bg-[#FCF8EE]"><td className="p-3 font-black text-[#79543A]">Super Admin / Owner</td><td className="p-3 font-bold">Full platform governance & CMS</td><td className="p-3 text-red-700 font-black">STRICTLY PROHIBITED</td><td className="p-3">Server Allowlist + MFA</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 17: SECURITY AND AUDIT LOGS */}
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
                  className="px-3 py-1.5 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
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
                    {auditLogs.filter(l => l.actorEmail.toLowerCase().includes(logFilter.toLowerCase()) || l.action.toLowerCase().includes(logFilter.toLowerCase())).map((log) => (
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

          {/* SECTION 18: GENERAL SETTINGS */}
          {activeTab === 'general_settings' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2E7DE] pb-3">
                <div>
                  <h2 className="text-xl font-black text-[#214E34]">General Platform Governance Settings</h2>
                  <p className="text-xs text-[#68756A]">
                    Configure platform name, maintenance mode, and registration access policies.
                  </p>
                </div>
                <button
                  onClick={handlePublishLive}
                  className="px-3 py-1.5 bg-[#214E34] text-white font-bold rounded-lg hover:bg-[#183C27] cursor-pointer"
                >
                  Save Settings
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Platform Name</label>
                  <input
                    type="text"
                    value={cmsDraft.general.platformName}
                    onChange={(e) => cmsService.updateDraftSection('general', { ...cmsDraft.general, platformName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#252D27] mb-1">Allow Public Registrations</label>
                  <select
                    value={cmsDraft.general.allowPublicRegistrations ? 'true' : 'false'}
                    onChange={(e) => cmsService.updateDraftSection('general', { ...cmsDraft.general, allowPublicRegistrations: e.target.value === 'true' })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white font-bold"
                  >
                    <option value="true">Allowed (Farmers, Buyers, and Verified Roles)</option>
                    <option value="false">Paused (Invitation Only)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 p-4 bg-[#FCF8EE] rounded-xl border border-[#D6A545]/40 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#79543A]">
                    <input
                      type="checkbox"
                      checked={cmsDraft.general.maintenanceMode}
                      onChange={(e) => cmsService.updateDraftSection('general', { ...cmsDraft.general, maintenanceMode: e.target.checked })}
                      className="rounded text-[#79543A]"
                    />
                    <span>Enable Platform Maintenance Mode</span>
                  </label>
                  <input
                    type="text"
                    value={cmsDraft.general.maintenanceNotice || ''}
                    onChange={(e) => cmsService.updateDraftSection('general', { ...cmsDraft.general, maintenanceNotice: e.target.value })}
                    placeholder="Maintenance explanation banner..."
                    className="w-full p-2.5 rounded-lg border border-[#E2E7DE] bg-white text-xs"
                  />
                </div>
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

              {/* Service Cards Grid Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cmsDraft.services.filter(s => s.isActive).map(s => (
                  <div key={s.id} className="p-3 bg-white rounded-xl border border-[#E2E7DE] text-center space-y-1">
                    <strong className="text-xs text-[#214E34] block">{s.title}</strong>
                    <span className="text-[10px] text-[#68756A] line-clamp-2">{s.subtitle}</span>
                    <span className="text-[10px] text-[#367C46] font-bold block pt-1">{s.actionText} →</span>
                  </div>
                ))}
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
