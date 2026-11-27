-- NewTurn initial PostgreSQL schema.
-- Review and run against the intended Neon branch only after confirming the project.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone_e164 TEXT NOT NULL UNIQUE,
  email TEXT,
  email_verified_at TIMESTAMPTZ,
  phone_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS phone_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  name TEXT NOT NULL,
  image_url TEXT,
  is_5g BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  release_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(brand_id, name),
  CONSTRAINT phone_models_5g_catalog_only CHECK (is_5g = true)
);

CREATE TABLE IF NOT EXISTS phone_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES phone_models(id) ON DELETE CASCADE,
  ram_gb INTEGER NOT NULL,
  storage_gb INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(model_id, ram_gb, storage_gb)
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_code TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  model_id UUID NOT NULL REFERENCES phone_models(id),
  variant_id UUID REFERENCES phone_variants(id),
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  pincode CHAR(6),
  address_text TEXT,
  status TEXT NOT NULL DEFAULT 'incomplete'
    CHECK (status IN ('incomplete','interested','not_interested','no_response','busy','switched_off','converted','cancelled')),
  current_step TEXT NOT NULL DEFAULT 'device',
  initial_offer_paise BIGINT,
  final_offer_paise BIGINT,
  evaluation_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL UNIQUE,
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested','pickup_scheduled','picked_up','quality_check','completed','rejected','cancelled')),
  agreed_price_paise BIGINT NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_pincode CHAR(6) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS valuation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES phone_models(id),
  variant_id UUID REFERENCES phone_variants(id),
  base_price_paise BIGINT NOT NULL CHECK (base_price_paise >= 0),
  adjustments JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('admin','customer','system')),
  actor_id UUID,
  application_id UUID REFERENCES applications(id),
  order_id UUID REFERENCES orders(id),
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','manager','agent')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_status_created ON applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_customer ON applications(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_phone_models_brand ON phone_models(brand_id, is_active);
CREATE INDEX IF NOT EXISTS idx_phone_variants_model ON phone_variants(model_id, is_active);

-- Admin dashboard counts should be derived from applications/orders, not duplicated counters.
