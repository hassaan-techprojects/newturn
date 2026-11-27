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

-- Starter catalogue values are provisional and editable in Admin > Phone catalogue.
INSERT INTO phone_models(brand_id,name,slug,base_price)
SELECT b.id,v.name,v.slug,v.price FROM (VALUES
 ('Apple','iPhone 16 Pro Max','iphone-16-pro-max',95000),('Apple','iPhone 16 Pro','iphone-16-pro',82000),('Apple','iPhone 16','iphone-16',62000),('Apple','iPhone 15 Pro Max','iphone-15-pro-max',72000),('Apple','iPhone 15','iphone-15',50000),('Apple','iPhone 14','iphone-14',38000),
 ('Samsung','Galaxy S25 Ultra','galaxy-s25-ultra',85000),('Samsung','Galaxy S25+','galaxy-s25-plus',68000),('Samsung','Galaxy S25','galaxy-s25',58000),('Samsung','Galaxy S24 Ultra','galaxy-s24-ultra',68000),('Samsung','Galaxy A56 5G','galaxy-a56-5g',25000),
 ('OnePlus','OnePlus 13','oneplus-13',55000),('OnePlus','OnePlus 13R','oneplus-13r',35000),('OnePlus','OnePlus 12','oneplus-12',42000),('OnePlus','OnePlus Nord 4','oneplus-nord-4',23000),
 ('Google','Pixel 9 Pro XL','pixel-9-pro-xl',65000),('Google','Pixel 9 Pro','pixel-9-pro',58000),('Google','Pixel 9','pixel-9',45000),('Google','Pixel 8a','pixel-8a',28000),
 ('Xiaomi','Xiaomi 15 Ultra','xiaomi-15-ultra',75000),('Xiaomi','Xiaomi 15','xiaomi-15',55000),('Xiaomi','Xiaomi 14','xiaomi-14',42000),
 ('Redmi','Redmi Note 14 Pro+ 5G','redmi-note-14-pro-plus-5g',22000),('Redmi','Redmi Note 14 Pro 5G','redmi-note-14-pro-5g',19000),('Redmi','Redmi Note 13 5G','redmi-note-13-5g',14000),
 ('realme','realme GT 7 Pro','realme-gt-7-pro',50000),('realme','realme 14 Pro+ 5G','realme-14-pro-plus-5g',28000),('realme','realme 13 Pro 5G','realme-13-pro-5g',21000),
 ('Motorola','Edge 60 Pro','edge-60-pro',33000),('Motorola','Edge 50 Pro','edge-50-pro',24000),('Motorola','Moto G85 5G','moto-g85-5g',14000),
 ('POCO','POCO F7','poco-f7',30000),('POCO','POCO X7 Pro','poco-x7-pro',22000),('POCO','POCO X7 5G','poco-x7-5g',17000),
 ('OPPO','Find X8 Pro','find-x8-pro',72000),('OPPO','Reno 13 Pro 5G','reno-13-pro-5g',38000),('OPPO','Reno 12 5G','reno-12-5g',26000),
 ('vivo','X200 Pro','x200-pro',72000),('vivo','V50 5G','v50-5g',34000),('vivo','V40 Pro','v40-pro',39000),
 ('iQOO','iQOO 13','iqoo-13',55000),('iQOO','iQOO Neo 10','iqoo-neo-10',30000),('iQOO','iQOO Z10','iqoo-z10',18000),
 ('Nothing','Phone (3)','phone-3',50000),('Nothing','Phone (2a) Plus','phone-2a-plus',23000),('Nothing','Phone (2a)','phone-2a',19000),
 ('CMF','CMF Phone 2 Pro','cmf-phone-2-pro',18000),('CMF','CMF Phone 1','cmf-phone-1',12000),
 ('ASUS','ROG Phone 9 Pro','rog-phone-9-pro',85000),('ASUS','ROG Phone 8','rog-phone-8',55000)
) AS v(brand,name,slug,price) JOIN brands b ON b.name=v.brand
ON CONFLICT(brand_id,slug) DO NOTHING;

-- Available variants are explicit records, not generated options. Add more from the admin panel as needed.
INSERT INTO model_variants(model_id,ram_gb,storage_gb)
SELECT m.id,v.ram,v.storage FROM (VALUES
 ('Apple','iPhone 16 Pro Max',8,256),('Apple','iPhone 16 Pro Max',8,512),('Apple','iPhone 16 Pro Max',8,1024),
 ('Apple','iPhone 16 Pro',8,128),('Apple','iPhone 16 Pro',8,256),('Apple','iPhone 16 Pro',8,512),
 ('Apple','iPhone 16',8,128),('Apple','iPhone 16',8,256),('Apple','iPhone 16',8,512),
 ('Samsung','Galaxy S25 Ultra',12,256),('Samsung','Galaxy S25 Ultra',12,512),('Samsung','Galaxy S25 Ultra',12,1024),
 ('Samsung','Galaxy S25+',12,256),('Samsung','Galaxy S25+',12,512),('Samsung','Galaxy S25',12,128),('Samsung','Galaxy S25',12,256),
 ('OnePlus','OnePlus 13',12,256),('OnePlus','OnePlus 13',16,512),('OnePlus','OnePlus 13R',12,256),('OnePlus','OnePlus 13R',16,512),
 ('Google','Pixel 9 Pro XL',16,256),('Google','Pixel 9 Pro XL',16,512),('Google','Pixel 9 Pro',16,128),('Google','Pixel 9 Pro',16,256),('Google','Pixel 9',12,128),('Google','Pixel 9',12,256),
 ('Redmi','Redmi Note 14 Pro+ 5G',8,128),('Redmi','Redmi Note 14 Pro+ 5G',8,256),('Redmi','Redmi Note 14 Pro+ 5G',12,256),
 ('realme','realme GT 7 Pro',12,256),('realme','realme GT 7 Pro',16,512),
 ('POCO','POCO X7 Pro',8,256),('POCO','POCO X7 Pro',12,256),('POCO','POCO X7 Pro',12,512),
 ('vivo','X200 Pro',16,512),('iQOO','iQOO 13',12,256),('iQOO','iQOO 13',16,512)
) AS v(brand,model,ram,storage) JOIN brands b ON b.name=v.brand JOIN phone_models m ON m.brand_id=b.id AND m.name=v.model
ON CONFLICT(model_id,ram_gb,storage_gb) DO NOTHING;
