-- Leads table for storing quote requests
-- Run this in your Supabase SQL Editor
-- NOTE: This script handles existing objects gracefully

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Locksmith owners can view their leads" ON leads;
DROP POLICY IF EXISTS "Locksmith owners can update their leads" ON leads;

-- Create table if not exists
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locksmith_id UUID NOT NULL REFERENCES locksmiths(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    service_type_id UUID,
    description TEXT,
    urgency TEXT DEFAULT 'now' CHECK (urgency IN ('now', 'today', 'this_week', 'flexible')),
    address TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'accepted', 'completed', 'cancelled')),
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'profile', 'search', 'direct')),
    notes TEXT,
    quoted_price DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    responded_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Index for faster queries (use IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS leads_locksmith_id_idx ON leads(locksmith_id);
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Users can view own leads"
ON leads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create leads"
ON leads FOR INSERT
WITH CHECK (true);

-- Grant permissions
GRANT INSERT ON leads TO anon;
GRANT SELECT ON leads TO anon;
GRANT ALL ON leads TO authenticated;

COMMENT ON TABLE leads IS 'Quote requests from customers to locksmiths';
