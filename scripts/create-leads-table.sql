-- Leads table for storing quote requests
-- Run this in your Supabase SQL Editor

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

-- Index for faster queries
CREATE INDEX IF NOT EXISTS leads_locksmith_id_idx ON leads(locksmith_id);
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own leads
CREATE POLICY "Users can view own leads"
ON leads FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can create leads
CREATE POLICY "Anyone can create leads"
ON leads FOR INSERT
WITH CHECK (true);

-- Policy: Locksmith owners can view leads for their locksmith
-- (requires a locksmith_owners table or checking against locksmiths.owner_id)
CREATE POLICY "Locksmith owners can view their leads"
ON leads FOR SELECT
USING (
    locksmith_id IN (
        SELECT id FROM locksmiths 
        WHERE owner_id = auth.uid()
    )
);

-- Policy: Locksmith owners can update lead status
CREATE POLICY "Locksmith owners can update their leads"
ON leads FOR UPDATE
USING (
    locksmith_id IN (
        SELECT id FROM locksmiths 
        WHERE owner_id = auth.uid()
    )
);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at_trigger
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_leads_updated_at();

-- Grant permissions for the anon role (for unauthenticated quote requests)
GRANT INSERT ON leads TO anon;
GRANT SELECT ON leads TO anon;

-- Grant permissions for authenticated users
GRANT ALL ON leads TO authenticated;

COMMENT ON TABLE leads IS 'Quote requests from customers to locksmiths';
COMMENT ON COLUMN leads.urgency IS 'How urgently the customer needs service';
COMMENT ON COLUMN leads.status IS 'Current status of the lead in the sales pipeline';
COMMENT ON COLUMN leads.source IS 'Where the lead originated from';
