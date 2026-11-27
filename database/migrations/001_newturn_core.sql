-- NewTurn core catalogue, customer applications and operations schema
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_path TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS phone_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_path TEXT,
  network_type TEXT NOT NULL DEFAULT '5G' CHECK (network_type = '5G'),
  base_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (base_price >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(brand_id, slug)
);

CREATE TABLE IF NOT EXISTS model_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES phone_models(id) ON DELETE CASCADE,
  ram_gb INTEGER NOT NULL,
  storage_gb INTEGER NOT NULL,
  price_adjustment NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(model_id, ram_gb, storage_gb)
);

CREATE TABLE IF NOT EXISTS defect_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES phone_models(id) ON DELETE CASCADE,
  defect_key TEXT NOT NULL,
  label TEXT NOT NULL,
  deduction_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (deduction_amount >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(model_id, defect_key)
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code TEXT NOT NULL UNIQUE DEFAULT ('NTC-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT,'-','') FROM 1 FOR 10))),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  pincode TEXT,
  pickup_area TEXT,
  district TEXT,
  state TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers(phone);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_code TEXT NOT NULL UNIQUE DEFAULT ('NTA-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT,'-','') FROM 1 FOR 10))),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  model_id UUID REFERENCES phone_models(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES model_variants(id) ON DELETE SET NULL,
  brand_name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  variant_label TEXT,
  condition_label TEXT,
  defects JSONB NOT NULL DEFAULT '[]'::JSONB,
  evaluation_answers JSONB NOT NULL DEFAULT '{}'::JSONB,
  estimated_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  deduction_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  final_estimate NUMERIC(12,2) NOT NULL DEFAULT 0,
  pincode TEXT,
  pickup_area TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  status TEXT NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete','submitted','converted','closed')),
  call_status TEXT NOT NULL DEFAULT 'pending' CHECK (call_status IN ('pending','interested','not_interested','no_response','busy','switched_off')),
  source_step TEXT NOT NULL DEFAULT 'review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS applications_call_status_idx ON applications(call_status, created_at DESC);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL UNIQUE DEFAULT ('NTO-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT,'-','') FROM 1 FOR 10))),
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_status TEXT NOT NULL DEFAULT 'new' CHECK (order_status IN ('new','pickup_scheduled','picked_up','inspected','completed','cancelled')),
  pickup_status TEXT NOT NULL DEFAULT 'pending',
  final_sale_price NUMERIC(12,2),
  pickup_date DATE,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  actor_email TEXT,
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS application_activity_created_idx ON application_activity(created_at DESC);

INSERT INTO brands(name,slug,sort_order) VALUES
 ('Apple','apple',1),('Samsung','samsung',2),('realme','realme',3),('Redmi','redmi',4),('Xiaomi','xiaomi',5),
 ('OnePlus','oneplus',6),('Motorola','motorola',7),('POCO','poco',8),('OPPO','oppo',9),('vivo','vivo',10),
 ('iQOO','iqoo',11),('Nothing','nothing',12),('CMF','cmf',13),('ASUS','asus',14),('Google','google',15)
ON CONFLICT (slug) DO NOTHING;
