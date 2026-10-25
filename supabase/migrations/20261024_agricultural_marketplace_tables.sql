-- ==============================================================================
-- SMART-AGRI KENYA: AGRICULTURAL MARKETPLACE SCHEMA & ROW LEVEL SECURITY
-- Migration: 20261024_agricultural_marketplace_tables.sql
-- Covers: Crops & Produce, Pedigree Livestock, Farm Inputs, Market Prices,
--         Buyer Inquiries, and Listing Moderation Reports.
-- ==============================================================================

-- 1. MARKETPLACE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.marketplace_products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('crops', 'livestock', 'inputs', 'equipment', 'fodder')),
  subcategory TEXT,
  product_type TEXT,
  variety TEXT,
  price_ksh NUMERIC(12, 2) NOT NULL CHECK (price_ksh > 0),
  unit TEXT NOT NULL,
  quantity_available NUMERIC(10, 2) NOT NULL DEFAULT 1,
  minimum_order NUMERIC(10, 2) DEFAULT 1,
  seller_id TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  seller_phone TEXT NOT NULL,
  seller_county TEXT NOT NULL,
  seller_sub_county TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_verified_seller BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  delivery_options TEXT[] DEFAULT ARRAY['pickup', 'delivery']::TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold_out', 'paused', 'deleted')),
  
  -- Category-specific attributes
  quality_grade TEXT,
  packaging_type TEXT,
  harvest_date DATE,
  brand TEXT,
  regulatory_approval TEXT,
  livestock_details JSONB, -- Stores animalType, breed, age, ageUnit, sex, purpose, vaccinationStatus, etc.

  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning-fast marketplace searches & multi-filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.marketplace_products (category);
CREATE INDEX IF NOT EXISTS idx_products_county ON public.marketplace_products (seller_county);
CREATE INDEX IF NOT EXISTS idx_products_variety ON public.marketplace_products (variety);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.marketplace_products (price_ksh);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.marketplace_products (status);
CREATE INDEX IF NOT EXISTS idx_products_gin_livestock ON public.marketplace_products USING gin (livestock_details);

-- Enable RLS
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

-- Product Policies
CREATE POLICY "Public and registered users can view active marketplace products"
  ON public.marketplace_products
  FOR SELECT
  USING (status != 'deleted');

CREATE POLICY "Authenticated users can create product listings"
  ON public.marketplace_products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Sellers can update their own product listings"
  ON public.marketplace_products
  FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid()::text OR EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Sellers can delete their own listings"
  ON public.marketplace_products
  FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid()::text OR EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));


-- 2. MARKET PRICE OBSERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.market_price_observations (
  id TEXT PRIMARY KEY,
  commodity_name TEXT NOT NULL,
  category TEXT NOT NULL,
  variety TEXT,
  market_name TEXT NOT NULL,
  county TEXT NOT NULL,
  wholesale_price_ksh NUMERIC(12, 2) NOT NULL CHECK (wholesale_price_ksh >= 0),
  retail_price_ksh NUMERIC(12, 2),
  unit TEXT NOT NULL,
  trend TEXT NOT NULL CHECK (trend IN ('up', 'down', 'stable')),
  change_percent NUMERIC(5, 2) DEFAULT 0.0,
  source TEXT NOT NULL,
  price_type TEXT NOT NULL DEFAULT 'verified_observation' 
    CHECK (price_type IN ('verified_observation', 'seller_asking', 'historical', 'estimated')),
  previous_price_ksh NUMERIC(12, 2),
  observation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  notes TEXT,
  is_indicative BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_market_prices_commodity ON public.market_price_observations (commodity_name);
CREATE INDEX IF NOT EXISTS idx_market_prices_market ON public.market_price_observations (market_name);
CREATE INDEX IF NOT EXISTS idx_market_prices_county ON public.market_price_observations (county);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON public.market_price_observations (observation_date);

ALTER TABLE public.market_price_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read verified market price intelligence"
  ON public.market_price_observations
  FOR SELECT
  USING (true);

CREATE POLICY "Authorized extension officers and admins can publish price observations"
  ON public.market_price_observations
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'extension_officer', 'agronomist')
  ));


-- 3. BUYER PRODUCT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.product_inquiries (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  seller_id TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_email TEXT,
  message TEXT NOT NULL,
  quantity_needed NUMERIC(10, 2),
  desired_delivery_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inquiries_product ON public.product_inquiries (product_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_seller ON public.product_inquiries (seller_id);

ALTER TABLE public.product_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a direct product inquiry"
  ON public.product_inquiries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sellers can view inquiries sent for their listings"
  ON public.product_inquiries
  FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid()::text OR EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));


-- 4. PRODUCT MODERATION REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.product_reports (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  reporter_contact TEXT,
  reason TEXT NOT NULL CHECK (reason IN (
    'suspicious_price', 
    'fake_input', 
    'misleading_photos', 
    'animal_welfare', 
    'seller_unresponsive', 
    'other'
  )),
  details TEXT NOT NULL,
  status TEXT DEFAULT 'under_review' CHECK (status IN ('under_review', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reports_product ON public.product_reports (product_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.product_reports (status);

ALTER TABLE public.product_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can report a suspicious listing"
  ON public.product_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authorized administrators can audit moderation reports"
  ON public.product_reports
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Only administrators can update report status"
  ON public.product_reports
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));
