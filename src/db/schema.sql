-- ============================================================================
-- SMART-AGRI KENYA - Relational PostgreSQL & Supabase Database Architecture
-- Production Schema with RLS, Constraints, Foreign Keys, & Audit Triggers
-- ============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM (
  'farmer',
  'buyer',
  'transporter',
  'expert',
  'lab',
  'admin'
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'farmer',
  county VARCHAR(100) NOT NULL,
  sub_county VARCHAR(100),
  ward VARCHAR(100),
  id_number VARCHAR(50),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMER PROFILES & SELLER VERIFICATION
CREATE TABLE IF NOT EXISTS farmer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  farm_name VARCHAR(255) NOT NULL,
  farm_size_acres NUMERIC(8, 2),
  primary_activity VARCHAR(100), -- 'dairy', 'crop', 'mixed', 'poultry', 'horticulture'
  national_id_front_url TEXT,
  national_id_back_url TEXT,
  kra_pin VARCHAR(50),
  cooperative_name VARCHAR(255),
  verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  bank_account_or_paybill VARCHAR(100),
  mpesa_payout_phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCT CATEGORIES & CATALOG
CREATE TABLE IF NOT EXISTS product_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  is_livestock BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  category_id VARCHAR(50) REFERENCES product_categories(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  variety VARCHAR(100),
  price_ksh NUMERIC(12, 2) NOT NULL CHECK (price_ksh > 0),
  unit VARCHAR(50) NOT NULL, -- 'kg', '90kg bag', 'crate', 'litre', 'piece'
  quantity_available NUMERIC(10, 2) NOT NULL DEFAULT 0,
  minimum_order NUMERIC(10, 2) NOT NULL DEFAULT 1,
  county VARCHAR(100) NOT NULL,
  sub_county VARCHAR(100),
  specific_location TEXT,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'sold_out', 'paused', 'pending_approval'
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0
);

-- 4. LIVESTOCK LISTINGS & ATTRIBUTES (SPECIALIZED BREED & HEALTH TRACKING)
CREATE TABLE IF NOT EXISTS livestock_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  animal_type VARCHAR(50) NOT NULL, -- 'dairy_cow', 'beef_cattle', 'bull', 'chicken', 'goat', 'sheep'
  breed VARCHAR(100) NOT NULL,
  age_value NUMERIC(6, 1) NOT NULL,
  age_unit VARCHAR(20) NOT NULL, -- 'days', 'months', 'years'
  sex VARCHAR(20) NOT NULL, -- 'female', 'male', 'mixed_batch'
  purpose VARCHAR(50) NOT NULL, -- 'milk', 'beef', 'breeding', 'eggs', 'meat', 'dual_purpose'
  milk_yield_litres_per_day NUMERIC(6, 2),
  egg_yield_per_week INT,
  weight_kg NUMERIC(8, 2),
  lactation_stage VARCHAR(100),
  ear_tag_or_ring_number VARCHAR(100),
  health_status VARCHAR(100) DEFAULT 'Certified Healthy',
  feed_regime TEXT,
  batch_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS livestock_vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_id UUID REFERENCES livestock_listings(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(100) NOT NULL,
  date_administered DATE NOT NULL,
  vet_name VARCHAR(255),
  vet_license_number VARCHAR(100),
  verified_by_vet BOOLEAN DEFAULT FALSE
);

-- 5. TRANSPORTERS & LOGISTICS
CREATE TABLE IF NOT EXISTS transporters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fleet_type VARCHAR(100) NOT NULL, -- 'Boda Boda Courier', 'Probox / Van', '3-Tonne Canter', 'Livestock Carrier'
  vehicle_registration_plate VARCHAR(50) NOT NULL,
  capacity_kg NUMERIC(10, 2) NOT NULL,
  rate_per_km_ksh NUMERIC(8, 2) NOT NULL,
  base_fare_ksh NUMERIC(8, 2) NOT NULL,
  operating_county VARCHAR(100) NOT NULL,
  is_vetted BOOLEAN DEFAULT FALSE,
  current_status VARCHAR(50) DEFAULT 'Active'
);

-- 6. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  delivery_county VARCHAR(100) NOT NULL,
  delivery_town VARCHAR(100) NOT NULL,
  delivery_address TEXT NOT NULL,
  subtotal_ksh NUMERIC(12, 2) NOT NULL,
  shipping_total_ksh NUMERIC(12, 2) NOT NULL DEFAULT 0,
  grand_total_ksh NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'mpesa',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  mpesa_receipt_number VARCHAR(50),
  order_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'seller_confirmed', 'transporter_assigned', 'in_transit', 'delivered', 'cancelled'
  assigned_transporter_id UUID REFERENCES transporters(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price_ksh NUMERIC(12, 2) NOT NULL,
  total_price_ksh NUMERIC(12, 2) NOT NULL,
  delivery_type VARCHAR(50) NOT NULL, -- 'pickup' or 'delivery'
  shipping_fee_ksh NUMERIC(10, 2) NOT NULL DEFAULT 0
);

-- 7. MPESA PAYMENTS & AUDIT TRANSACTIONS
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  merchant_request_id VARCHAR(100) NOT NULL,
  checkout_request_id VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  amount_ksh NUMERIC(12, 2) NOT NULL,
  result_code INT,
  result_description TEXT,
  mpesa_receipt_number VARCHAR(50),
  status VARCHAR(50) DEFAULT 'initiated', -- 'initiated', 'completed', 'failed', 'reversed'
  raw_callback_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SOIL TESTING PARTNERS & LABORATORY REPORTS
CREATE TABLE IF NOT EXISTS soil_laboratories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL, -- e.g., KALRO National Agricultural Laboratories (NARL), CropNuts
  county VARCHAR(100) NOT NULL,
  location_address TEXT,
  phone VARCHAR(50),
  accreditation_number VARCHAR(100),
  standard_test_cost_ksh NUMERIC(10, 2) NOT NULL,
  turnaround_days INT DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS soil_test_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_code VARCHAR(50) UNIQUE NOT NULL,
  farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lab_id UUID REFERENCES soil_laboratories(id),
  field_name VARCHAR(100) NOT NULL,
  farm_size_acres NUMERIC(8, 2),
  county VARCHAR(100) NOT NULL,
  sub_county VARCHAR(100),
  intended_crop VARCHAR(100) NOT NULL,
  previous_crop VARCHAR(100),
  submission_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'sample_received', 'analysis_running', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS soil_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID UNIQUE REFERENCES soil_test_requests(id) ON DELETE CASCADE,
  ph NUMERIC(4, 2) NOT NULL,
  ph_classification VARCHAR(50) NOT NULL,
  nitrogen_percent NUMERIC(5, 3),
  phosphorus_ppm NUMERIC(8, 2),
  potassium_ppm NUMERIC(8, 2),
  organic_matter_percent NUMERIC(5, 2),
  soil_texture VARCHAR(100),
  salinity_ec_ds_m NUMERIC(6, 2),
  suitability_score INT CHECK (suitability_score BETWEEN 0 AND 100),
  lime_requirement_kg_per_acre NUMERIC(8, 2) DEFAULT 0,
  recommended_basal_fertilizer TEXT,
  recommended_top_dressing TEXT,
  organic_remedies TEXT[],
  agronomist_notes TEXT,
  lab_officer_name VARCHAR(255),
  report_pdf_url TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PEST & DISEASE KNOWLEDGE BASE (PCPB REGISTERED)
CREATE TABLE IF NOT EXISTS pest_disease_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type VARCHAR(20) NOT NULL, -- 'crop' or 'livestock'
  target_host VARCHAR(100) NOT NULL,
  common_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  symptoms TEXT[] NOT NULL,
  severity VARCHAR(50) NOT NULL,
  cultural_controls TEXT[],
  vet_alert_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pest_approved_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pest_reference_id UUID REFERENCES pest_disease_references(id) ON DELETE CASCADE,
  active_ingredient VARCHAR(255) NOT NULL,
  commercial_brand_examples TEXT,
  pcpb_registration_status VARCHAR(100) DEFAULT 'Approved by PCPB Kenya',
  target_stage VARCHAR(100),
  pre_harvest_interval_days INT NOT NULL,
  ppe_requirement TEXT NOT NULL
);

-- 10. NATIONAL MARKET PRICES (KENYA MARKETS)
CREATE TABLE IF NOT EXISTS market_price_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  variety VARCHAR(100),
  market_name VARCHAR(100) NOT NULL, -- 'Wakulima (Marikiti)', 'Kongowea', 'Kibuye', 'Eldoret'
  county VARCHAR(100) NOT NULL,
  wholesale_price_ksh NUMERIC(10, 2) NOT NULL,
  retail_price_ksh NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  price_trend VARCHAR(20) DEFAULT 'stable', -- 'up', 'down', 'stable'
  change_percent NUMERIC(5, 2) DEFAULT 0,
  data_source VARCHAR(255) NOT NULL,
  is_indicative BOOLEAN DEFAULT TRUE,
  observed_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 11. REVIEWS, RATINGS, & COMPLAINTS
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fraud_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complainant_id UUID REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  reported_product_id UUID REFERENCES products(id),
  reason VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'dismissed'
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. EXPERT CONSULTATIONS & COMMUNITY FORUM
CREATE TABLE IF NOT EXISTS expert_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(id),
  expert_id UUID REFERENCES users(id),
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  consultation_status VARCHAR(50) DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ,
  notes TEXT,
  fee_ksh NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  likes_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT LOGS & PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS platform_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  target_table VARCHAR(100),
  record_id VARCHAR(100),
  metadata JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_county ON products(county);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_livestock_breed ON livestock_listings(breed);
CREATE INDEX IF NOT EXISTS idx_livestock_animal_type ON livestock_listings(animal_type);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_market_prices_observed ON market_price_observations(commodity_name, market_name, observed_date);
CREATE INDEX IF NOT EXISTS idx_soil_requests_farmer ON soil_test_requests(farmer_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_test_requests ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Farmers can manage own products" ON products FOR ALL USING (auth.uid() = seller_id);
CREATE POLICY "Buyers can view own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Admins have full access" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
