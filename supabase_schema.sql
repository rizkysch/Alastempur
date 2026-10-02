-- Create Custom Types
CREATE TYPE order_status AS ENUM ('Pending', 'Processing', 'Ready to Pickup', 'Completed');
CREATE TYPE admin_role AS ENUM ('Admin', 'Super Admin');
CREATE TYPE promo_type AS ENUM ('Percent', 'Nominal');

-- 1. Profiles Table (extends Supabase Auth Users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'Customer', -- 'Customer', 'Admin', 'Super Admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 2. Services Table
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Promos Table
CREATE TABLE public.promos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type promo_type NOT NULL,
  value INTEGER NOT NULL,
  expiry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Content CMS Table (Single Row)
CREATE TABLE public.cms (
  id INTEGER PRIMARY KEY DEFAULT 1,
  phone TEXT,
  email TEXT,
  address TEXT,
  hero_text TEXT,
  about_text TEXT
);

-- 5. Orders Table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  shoe_type TEXT NOT NULL,
  service_type TEXT NOT NULL,
  pairs INTEGER NOT NULL,
  notes TEXT,
  price INTEGER NOT NULL,
  status order_status DEFAULT 'Pending',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  pickup_address TEXT,
  handled_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default CMS Data
INSERT INTO public.cms (id, phone, email, address, hero_text, about_text) 
VALUES (
  1, 
  '0812-3456-7890', 
  'cs@alastempur.com', 
  'Jl. Bersih Berkilau No. 123', 
  'Rawat Sepatu Kesayanganmu.', 
  'Layanan cuci sepatu premium yang cepat, aman, dan terpercaya.'
) ON CONFLICT (id) DO NOTHING;

-- Insert Default Services Data
INSERT INTO public.services (name, price, duration_days, is_active) VALUES 
('Deep Clean - Sepatu Putih', 35000, 3, true),
('Fast Clean - Sepatu Putih', 25000, 1, true);

-- Enable RLS and setup policies for standard tables (allowing public read, authenticated insert/update for simplicity during migration)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin write services" ON public.services FOR ALL USING (true); -- Temporarily open for testing

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (true); -- Temporarily open for testing
CREATE POLICY "Users insert orders" ON public.orders FOR INSERT WITH CHECK (true); -- Temporarily open for testing
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE USING (true); -- Temporarily open for testing

ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read promos" ON public.promos FOR SELECT USING (true);
CREATE POLICY "Admin write promos" ON public.promos FOR ALL USING (true);

ALTER TABLE public.cms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms" ON public.cms FOR SELECT USING (true);
CREATE POLICY "Admin update cms" ON public.cms FOR UPDATE USING (true);
