-- DERIV-AGRI KENYA - Owner-Only Admin Control Centre Migration
-- Migration: 20261021_owner_admin_cms_and_mfa.sql
-- Enforces server-side authorization, RLS, admin allowlist, MFA records, and CMS content storage.

-- 1. Admin Allowlist Table (Server-Controlled Owner Authorization)
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
  email TEXT PRIMARY KEY,
  owner_name TEXT NOT NULL DEFAULT 'Platform Owner',
  is_active BOOLEAN NOT NULL DEFAULT true,
  granted_by TEXT NOT NULL DEFAULT 'SYSTEM_BOOTSTRAP',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial trusted platform owner
INSERT INTO public.admin_allowlist (email, owner_name, is_active, granted_by)
VALUES 
  ('onyangoderick37@gmail.com', 'Derick Onyango (Platform Owner)', true, 'INITIAL_MIGRATION'),
  ('admin@deriv-agri.ke', 'Admin Operations HQ', true, 'INITIAL_MIGRATION')
ON CONFLICT (email) DO NOTHING;

-- 2. Admin Multi-Factor Authentication (MFA) Credentials Table
CREATE TABLE IF NOT EXISTS public.admin_mfa (
  user_email TEXT PRIMARY KEY REFERENCES public.admin_allowlist(email) ON DELETE CASCADE,
  totp_secret_encrypted TEXT NOT NULL,
  is_mfa_enabled BOOLEAN NOT NULL DEFAULT true,
  backup_codes_hashed TEXT[] NOT NULL DEFAULT '{}',
  last_used_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CMS Content Table (Draft & Published website content for no-code editing)
CREATE TABLE IF NOT EXISTS public.cms_content (
  key TEXT PRIMARY KEY,
  section_title TEXT NOT NULL,
  draft_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  has_unpublished_changes BOOLEAN NOT NULL DEFAULT false,
  version INT NOT NULL DEFAULT 1,
  last_edited_by TEXT,
  last_edited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_by TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CMS Version History Table (Rollback and restore audit)
CREATE TABLE IF NOT EXISTS public.cms_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  content JSONB NOT NULL,
  version INT NOT NULL,
  published_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_history_key_version ON public.cms_history(key, version DESC);

-- 5. Site Settings Table (System integrations, default county, weather configs, AI settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT,
  value JSONB NOT NULL,
  is_secret BOOLEAN NOT NULL DEFAULT false,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Helper Function: Is Authorized Administrator / Owner
CREATE OR REPLACE FUNCTION public.is_authorized_admin(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_allowlist
    WHERE email = LOWER(TRIM(p_email)) AND is_active = true
  );
$$;

-- 7. Enable Row Level Security (RLS) on all admin and CMS tables
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
-- CMS CONTENT:
-- Public can view published content
CREATE POLICY "Public can view published CMS content"
  ON public.cms_content
  FOR SELECT
  USING (true);

-- Only Super Admins can insert, update, or delete CMS content
CREATE POLICY "Super admins can manage CMS content"
  ON public.cms_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- CMS HISTORY:
-- Super Admins can view and create history
CREATE POLICY "Super admins can view CMS history"
  ON public.cms_history
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- SITE SETTINGS:
-- Public can view non-secret site settings
CREATE POLICY "Public can view non-secret site settings"
  ON public.site_settings
  FOR SELECT
  USING (is_secret = false);

-- Only Super Admins can manage site settings
CREATE POLICY "Super admins can manage site settings"
  ON public.site_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- ADMIN ALLOWLIST & MFA:
-- Only Super Admins or Server Service Role can access allowlist
CREATE POLICY "Super admins can access allowlist"
  ON public.admin_allowlist
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- MFA secrets are strictly locked to service role / super admin
CREATE POLICY "Super admins can access mfa records"
  ON public.admin_mfa
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );
