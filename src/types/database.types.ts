// Database Types for LocksmithNow
// These types mirror the database schema

export type UserRole = 'consumer' | 'locksmith_owner' | 'admin';
export type AvailabilityStatus = 'available' | 'busy' | 'offline';
export type FeaturedTier = 'standard' | 'premium' | 'platinum';
export type ServiceCategory = 'residential' | 'automotive' | 'commercial' | 'emergency';
export type LeadStatus = 'pending' | 'viewed' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
export type LeadUrgency = 'now' | 'today' | 'scheduled';

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: UserRole;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface BusinessHours {
    monday: { open: string; close: string } | null;
    tuesday: { open: string; close: string } | null;
    wednesday: { open: string; close: string } | null;
    thursday: { open: string; close: string } | null;
    friday: { open: string; close: string } | null;
    saturday: { open: string; close: string } | null;
    sunday: { open: string; close: string } | null;
}

export interface Locksmith {
    id: string;
    owner_id: string;
    business_name: string;
    description: string | null;
    phone: string;
    email: string | null;
    website: string | null;

    // Location
    location: { lat: number; lng: number };
    address: string;
    city: string;
    province: string;
    postal_code: string;

    // Availability
    availability_status: AvailabilityStatus;
    busy_until: string | null;
    last_active_at: string;

    // Trust signals
    is_verified: boolean;
    verification_date: string | null;
    years_in_business: number | null;
    license_number: string | null;
    insurance_verified: boolean;

    // Hours
    business_hours: BusinessHours;
    is_24_7: boolean;

    // Featured
    featured_tier: FeaturedTier;
    featured_until: string | null;

    // Metrics
    avg_rating: number;
    review_count: number;
    response_time_minutes: number | null;

    created_at: string;
    updated_at: string;
}

export interface LocksmithWithDistance extends Locksmith {
    distance_km: number;
}

export interface ServiceType {
    id: string;
    name: string;
    slug: string;
    category: ServiceCategory;
    description: string | null;
    icon: string | null;
}

export interface LocksmithService {
    id: string;
    locksmith_id: string;
    service_type_id: string;
    price_min: number | null;
    price_max: number | null;
    price_note: string | null;
    service_type?: ServiceType;
}

export interface ServiceCoverage {
    id: string;
    locksmith_id: string;
    coverage_type: 'radius' | 'postal_codes' | 'cities';
    radius_km: number | null;
    postal_codes: string[] | null;
    cities: string[] | null;
    province: string;
}

export interface Lead {
    id: string;
    user_id: string | null;
    locksmith_id: string;

    contact_name: string;
    contact_phone: string;
    contact_email: string | null;

    service_type_id: string | null;
    description: string | null;
    urgency: LeadUrgency;
    scheduled_date: string | null;

    location: { lat: number; lng: number } | null;
    address: string | null;

    status: LeadStatus;
    viewed_at: string | null;
    contacted_at: string | null;

    source: string;

    created_at: string;
    updated_at: string;

    // Joined data
    locksmith?: Locksmith;
    service_type?: ServiceType;
}

export interface Review {
    id: string;
    user_id: string | null;
    locksmith_id: string;
    lead_id: string | null;

    rating: number;
    title: string | null;
    content: string | null;

    is_verified_customer: boolean;
    is_approved: boolean;

    created_at: string;

    // Joined data
    profile?: Profile;
}

export interface Favorite {
    id: string;
    user_id: string;
    locksmith_id: string;
    created_at: string;
    locksmith?: Locksmith;
}

export interface FeaturedPlan {
    id: string;
    name: string;
    tier: FeaturedTier;
    price_monthly: number;
    features: Record<string, unknown>;
    is_active: boolean;
}

export interface Subscription {
    id: string;
    locksmith_id: string;
    plan_id: string;
    status: 'active' | 'cancelled' | 'expired';
    current_period_start: string;
    current_period_end: string;
    created_at: string;
    plan?: FeaturedPlan;
}

// API Request/Response Types
export interface SearchLocksmithsParams {
    lat: number;
    lng: number;
    radius?: number;
    service?: string;
    available_only?: boolean;
    verified_only?: boolean;
    limit?: number;
}

export interface SearchLocksmithsResponse {
    locksmiths: LocksmithWithDistance[];
    total: number;
    search_radius_km: number;
}

export interface CreateLeadRequest {
    locksmith_id: string;
    contact_name: string;
    contact_phone: string;
    contact_email?: string;
    service_type?: string;
    description?: string;
    urgency: LeadUrgency;
    scheduled_date?: string;
    location?: { lat: number; lng: number };
    address?: string;
}

export interface CreateLeadResponse {
    lead: Lead;
    reference_number: string;
    message: string;
}

export interface CreateReviewRequest {
    locksmith_id: string;
    lead_id?: string;
    rating: number;
    title?: string;
    content?: string;
}

// Geolocation Types
export interface Coordinates {
    lat: number;
    lng: number;
}

export interface GeolocationState {
    coordinates: Coordinates | null;
    loading: boolean;
    error: string | null;
}
