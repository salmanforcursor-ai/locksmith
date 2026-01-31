-- ============================================
-- LocksmithNow Database Schema for Supabase
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Project: LocksmithNow - Canadian Locksmith Directory
-- ============================================

-- Enable PostGIS for geolocation features
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('consumer', 'locksmith_owner', 'admin');
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'offline');
CREATE TYPE featured_tier AS ENUM ('standard', 'premium', 'platinum');
CREATE TYPE service_category AS ENUM ('residential', 'automotive', 'commercial', 'emergency');
CREATE TYPE lead_status AS ENUM ('pending', 'viewed', 'contacted', 'confirmed', 'completed', 'cancelled');
CREATE TYPE lead_urgency AS ENUM ('now', 'today', 'scheduled');

-- ============================================
-- TABLES
-- ============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'consumer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locksmiths table
CREATE TABLE locksmiths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    business_name TEXT NOT NULL,
    description TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    location GEOGRAPHY(POINT, 4326),
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code TEXT,
    availability_status availability_status DEFAULT 'offline',
    busy_until TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date DATE,
    years_in_business INTEGER,
    license_number TEXT,
    insurance_verified BOOLEAN DEFAULT FALSE,
    business_hours JSONB DEFAULT '{}',
    is_24_7 BOOLEAN DEFAULT FALSE,
    featured_tier featured_tier DEFAULT 'standard',
    featured_until DATE,
    avg_rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    response_time_minutes INTEGER,
    source_url TEXT,
    yellowpages_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for locksmiths
CREATE INDEX idx_locksmiths_location ON locksmiths USING GIST(location);
CREATE INDEX idx_locksmiths_availability ON locksmiths(availability_status);
CREATE INDEX idx_locksmiths_city ON locksmiths(city);
CREATE INDEX idx_locksmiths_featured ON locksmiths(featured_tier, featured_until);
CREATE INDEX idx_locksmiths_rating ON locksmiths(avg_rating DESC);

-- Service Types
CREATE TABLE service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category service_category NOT NULL,
    description TEXT,
    icon TEXT
);

-- Locksmith Services (many-to-many with pricing)
CREATE TABLE locksmith_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    service_type_id UUID REFERENCES service_types(id) ON DELETE CASCADE,
    price_min NUMERIC(10,2),
    price_max NUMERIC(10,2),
    price_note TEXT,
    UNIQUE(locksmith_id, service_type_id)
);

-- Leads (quote requests)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    service_type_id UUID REFERENCES service_types(id),
    description TEXT,
    urgency lead_urgency DEFAULT 'now',
    scheduled_date DATE,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    status lead_status DEFAULT 'pending',
    viewed_at TIMESTAMPTZ,
    contacted_at TIMESTAMPTZ,
    source TEXT DEFAULT 'website',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    is_verified_customer BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, locksmith_id)
);

-- Featured Plans
CREATE TABLE featured_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tier featured_tier NOT NULL,
    price_monthly NUMERIC(10,2) NOT NULL,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES featured_plans(id) ON DELETE RESTRICT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default service types
INSERT INTO service_types (name, slug, category, description, icon) VALUES
('Home Lockout', 'home-lockout', 'emergency', 'Emergency lockout service for homes', 'home'),
('Car Lockout', 'car-lockout', 'emergency', 'Emergency lockout service for vehicles', 'car'),
('Lock Replacement', 'lock-replacement', 'residential', 'Full lock replacement service', 'key'),
('Lock Rekey', 'lock-rekey', 'residential', 'Rekey existing locks with new keys', 'key'),
('Key Duplication', 'key-duplication', 'residential', 'Duplicate keys for homes and offices', 'copy'),
('Smart Lock Installation', 'smart-lock', 'residential', 'Install and configure smart locks', 'smartphone'),
('Car Key Replacement', 'car-key-replacement', 'automotive', 'Replace lost or damaged car keys', 'car'),
('Key Fob Programming', 'key-fob', 'automotive', 'Program key fobs and transponders', 'key'),
('Commercial Lock Service', 'commercial-lock', 'commercial', 'Commercial lock installation and repair', 'building'),
('Master Key System', 'master-key', 'commercial', 'Design and install master key systems', 'key'),
('Safe Opening', 'safe-opening', 'emergency', 'Open locked safes', 'lock'),
('Security Consultation', 'security-consultation', 'residential', 'Home security assessment and recommendations', 'shield');

-- Insert featured plans
INSERT INTO featured_plans (name, tier, price_monthly, features) VALUES
('Basic', 'standard', 0, '{"leads_per_month": 5, "profile_visibility": "standard", "support": "email"}'),
('Premium', 'premium', 49.99, '{"leads_per_month": 25, "profile_visibility": "enhanced", "support": "priority", "badge": true}'),
('Platinum', 'platinum', 99.99, '{"leads_per_month": -1, "profile_visibility": "top", "support": "dedicated", "badge": true, "featured_search": true}');

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locksmiths ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE locksmith_services ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- Locksmiths: Anyone can read, owners can update
CREATE POLICY "Locksmiths are viewable by everyone"
    ON locksmiths FOR SELECT USING (true);

CREATE POLICY "Locksmith owners can update their listing"
    ON locksmiths FOR UPDATE USING (auth.uid() = owner_id);

-- Leads: Locksmith owners can see their leads, anyone can create
CREATE POLICY "Locksmith owners can view their leads"
    ON leads FOR SELECT USING (
        auth.uid() IN (
            SELECT owner_id FROM locksmiths WHERE id = locksmith_id
        )
        OR auth.uid() = user_id
    );

CREATE POLICY "Anyone can create leads"
    ON leads FOR INSERT WITH CHECK (true);

-- Reviews: Anyone can read approved, users can create own
CREATE POLICY "Approved reviews are public"
    ON reviews FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites: Users manage own
CREATE POLICY "Users can view own favorites"
    ON favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
    ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Service types: Public read
CREATE POLICY "Service types are public"
    ON service_types FOR SELECT USING (true);

-- Locksmith services: Public read
CREATE POLICY "Locksmith services are public"
    ON locksmith_services FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to search locksmiths by distance
CREATE OR REPLACE FUNCTION search_locksmiths_nearby(
    lat FLOAT,
    lng FLOAT,
    radius_km FLOAT DEFAULT 25
)
RETURNS TABLE (
    id UUID,
    business_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    province TEXT,
    availability_status availability_status,
    is_verified BOOLEAN,
    featured_tier featured_tier,
    avg_rating NUMERIC,
    review_count INTEGER,
    response_time_minutes INTEGER,
    is_24_7 BOOLEAN,
    location JSONB,
    distance_km FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id,
        l.business_name,
        l.phone,
        l.address,
        l.city,
        l.province,
        l.availability_status,
        l.is_verified,
        l.featured_tier,
        l.avg_rating,
        l.review_count,
        l.response_time_minutes,
        l.is_24_7,
        jsonb_build_object(
            'lat', ST_Y(l.location::geometry),
            'lng', ST_X(l.location::geometry)
        ) as location,
        ST_Distance(
            l.location,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
        ) / 1000 AS distance_km
    FROM locksmiths l
    WHERE
        l.location IS NOT NULL
        AND ST_DWithin(
            l.location,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
            radius_km * 1000
        )
    ORDER BY
        CASE l.featured_tier
            WHEN 'platinum' THEN 0
            WHEN 'premium' THEN 1
            ELSE 2
        END,
        distance_km ASC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update locksmith avg_rating when reviews change
CREATE OR REPLACE FUNCTION update_locksmith_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE locksmiths
    SET
        avg_rating = COALESCE(
            (SELECT AVG(rating)::NUMERIC(3,2) FROM reviews 
             WHERE locksmith_id = COALESCE(NEW.locksmith_id, OLD.locksmith_id) 
             AND is_approved = true),
            0
        ),
        review_count = (
            SELECT COUNT(*) FROM reviews 
            WHERE locksmith_id = COALESCE(NEW.locksmith_id, OLD.locksmith_id) 
            AND is_approved = true
        )
    WHERE id = COALESCE(NEW.locksmith_id, OLD.locksmith_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_locksmith_rating();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'consumer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_locksmiths_updated_at
    BEFORE UPDATE ON locksmiths
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment below to add sample locksmiths for testing

/*
INSERT INTO locksmiths (
    business_name, phone, address, city, province, postal_code,
    location, availability_status, is_verified, is_24_7, featured_tier, avg_rating, review_count
) VALUES
(
    'Toronto Emergency Locksmith',
    '416-555-0123',
    '123 Yonge Street',
    'Toronto',
    'ON',
    'M5C 1W4',
    ST_SetSRID(ST_MakePoint(-79.3832, 43.6532), 4326)::geography,
    'available',
    TRUE,
    TRUE,
    'premium',
    4.8,
    127
),
(
    'Quick Keys Vancouver',
    '604-555-0456',
    '456 Granville Street',
    'Vancouver',
    'BC',
    'V6C 1V5',
    ST_SetSRID(ST_MakePoint(-123.1207, 49.2827), 4326)::geography,
    'available',
    TRUE,
    FALSE,
    'standard',
    4.5,
    89
),
(
    'Calgary Lock & Key',
    '403-555-0789',
    '789 Stephen Avenue',
    'Calgary',
    'AB',
    'T2P 1G8',
    ST_SetSRID(ST_MakePoint(-114.0719, 51.0447), 4326)::geography,
    'busy',
    TRUE,
    TRUE,
    'platinum',
    4.9,
    203
);
*/

-- ============================================
-- DONE!
-- ============================================
-- Your database is now set up for LocksmithNow
-- Next steps:
-- 1. Set up your environment variables in .env.local
-- 2. Run the import script to add locksmith data
-- 3. Configure Google OAuth in Supabase Auth settings
-- ============================================
