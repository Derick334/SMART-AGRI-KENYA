-- DERIV-AGRI KENYA - Supabase PostgreSQL Schema & Security Policies
-- Migration: 20261021_deriv_agri_auth_and_roles.sql
-- Role-based access control, Row Level Security, Profiles, and Membership Verification

-- 1. Create Enums
DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM (
    'farmer',
    'buyer',
    'seller',
    'consultant',
    'veterinarian',
    'transporter',
    'lab',
    'admin'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE account_status_enum AS ENUM (
    'active',
    'pending_verification',
    'suspended'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table (Extends auth.users securely)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'farmer',
  county TEXT NOT NULL DEFAULT 'Nakuru',
  sub_county TEXT,
  town TEXT,
  farm_name TEXT,
  farm_size_acres NUMERIC(6, 2),
  organization_name TEXT,
  business_type TEXT,
  license_number TEXT,
  member_id TEXT UNIQUE NOT NULL,
  membership_tier TEXT NOT NULL DEFAULT 'Silver',
  status account_status_enum NOT NULL DEFAULT 'active',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for fast search and joins
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_county ON public.profiles(county);
CREATE INDEX IF NOT EXISTS idx_profiles_member_id ON public.profiles(member_id);

-- 3. Membership Records Table (Authoritative registry)
CREATE TABLE IF NOT EXISTS public.membership_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id TEXT UNIQUE NOT NULL REFERENCES public.profiles(member_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role_enum NOT NULL,
  county TEXT NOT NULL,
  status account_status_enum NOT NULL DEFAULT 'active',
  membership_tier TEXT NOT NULL DEFAULT 'Silver',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 year')
);

CREATE INDEX IF NOT EXISTS idx_membership_records_member_id ON public.membership_records(member_id);

-- 4. Audit Logs Table (Security-relevant events)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  target TEXT,
  status TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 5. Helper Function: Is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = check_user_id AND role = 'admin' AND status = 'active'
  );
$$;

-- 6. Trigger: Prevent Self-Promoting to Super Admin & Enforce Server-Side Roles
CREATE OR REPLACE FUNCTION public.enforce_profile_role_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If setting or changing role to admin, verify current caller is existing super admin
  IF NEW.role = 'admin' AND (OLD IS NULL OR OLD.role <> 'admin') THEN
    IF NOT public.is_super_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Privilege escalation rejected: Only authorized administrators may assign the Super Admin role.';
    END IF;
  END IF;

  -- Disallow regular users from modifying their own role
  IF OLD IS NOT NULL AND NEW.role <> OLD.role THEN
    IF NOT public.is_super_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Permission denied: Users may not alter their own assigned platform role.';
    END IF;
  END IF;

  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_role_security ON public.profiles;
CREATE TRIGGER trg_enforce_profile_role_security
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_role_security();

-- 7. Secure Member ID Verification Function (Returns minimal, sanitized non-PII only)
CREATE OR REPLACE FUNCTION public.verify_member_id(p_member_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_record RECORD;
BEGIN
  -- Strict sanitization of input
  p_member_id := UPPER(TRIM(p_member_id));

  SELECT 
    member_id,
    role,
    county,
    status,
    membership_tier
  INTO v_record
  FROM public.membership_records
  WHERE member_id = p_member_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'is_valid', false,
      'code', p_member_id,
      'status', 'not_found',
      'verified_at', NOW(),
      'notes', 'No active membership record found in the national agricultural database.'
    );
  END IF;

  -- Return MINIMAL sanitized data (Zero PII: no name, no email, no phone, no financial data)
  RETURN jsonb_build_object(
    'is_valid', true,
    'code', v_record.member_id,
    'role', v_record.role,
    'county', v_record.county,
    'status', v_record.status,
    'membership_tier', v_record.membership_tier,
    'verified_at', NOW(),
    'notes', 'Official national registry verification confirmed.'
  );
END;
$$;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. Row Level Security Policies
-- PROFILES:
-- Public can NOT view all profiles. Users can read their own profile.
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Super Admins can read all profiles
CREATE POLICY "Super admins can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Users can update non-privileged fields of their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Super admins can update any profile
CREATE POLICY "Super admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- MEMBERSHIP RECORDS:
-- Public can NOT query table directly (must use verify_member_id function which guards PII)
CREATE POLICY "Members can view own membership record"
  ON public.membership_records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all membership records"
  ON public.membership_records
  FOR ALL
  USING (public.is_super_admin(auth.uid()));

-- AUDIT LOGS:
-- Only Super Admins can view audit logs
CREATE POLICY "Super admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Any authenticated user or server service role can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);
