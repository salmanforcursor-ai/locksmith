import { createClient } from './client';
import type { Locksmith, LocksmithWithDistance, Lead } from '@/types/database.types';

/**
 * Search for locksmiths near a location
 */
export async function searchLocksmiths(
    lat: number,
    lng: number,
    options: {
        radiusKm?: number;
        availableOnly?: boolean;
        verifiedOnly?: boolean;
        service?: string;
        limit?: number;
    } = {}
): Promise<LocksmithWithDistance[]> {
    const supabase = createClient();
    const { radiusKm = 25, availableOnly = false, verifiedOnly = false, limit = 20 } = options;

    // Use the RPC function for geospatial search
    const { data, error } = await supabase.rpc('search_locksmiths_nearby', {
        lat,
        lng,
        radius_km: radiusKm,
    });

    if (error) {
        console.error('Error searching locksmiths:', error);
        return [];
    }

    let results = (data || []) as LocksmithWithDistance[];

    // Apply filters
    if (availableOnly) {
        results = results.filter(l => l.availability_status === 'available');
    }
    if (verifiedOnly) {
        results = results.filter(l => l.is_verified);
    }

    return results.slice(0, limit);
}

/**
 * Get a single locksmith by ID
 */
export async function getLocksmithById(id: string): Promise<Locksmith | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('locksmiths')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching locksmith:', error);
        return null;
    }

    return data;
}

/**
 * Get locksmiths by city
 */
export async function getLocksmithsByCity(city: string, limit = 20): Promise<Locksmith[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('locksmiths')
        .select('*')
        .ilike('city', `%${city}%`)
        .order('featured_tier', { ascending: true })
        .order('avg_rating', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching locksmiths by city:', error);
        return [];
    }

    return data || [];
}

/**
 * Get all available locksmiths
 */
export async function getAvailableLocksmiths(limit = 20): Promise<Locksmith[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('locksmiths')
        .select('*')
        .eq('availability_status', 'available')
        .order('featured_tier', { ascending: true })
        .order('avg_rating', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching available locksmiths:', error);
        return [];
    }

    return data || [];
}

/**
 * Create a new lead (quote request)
 */
export async function createLead(lead: {
    locksmith_id: string;
    contact_name: string;
    contact_phone: string;
    contact_email?: string;
    service_type_id?: string;
    description?: string;
    urgency?: 'now' | 'today' | 'scheduled';
}): Promise<{ id: string } | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('leads')
        .insert({
            locksmith_id: lead.locksmith_id,
            contact_name: lead.contact_name,
            contact_phone: lead.contact_phone,
            contact_email: lead.contact_email || null,
            service_type_id: lead.service_type_id || null,
            description: lead.description || null,
            urgency: lead.urgency || 'now',
            status: 'pending',
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error creating lead:', error);
        return null;
    }

    return data;
}

/**
 * Get reviews for a locksmith
 */
export async function getLocksmithReviews(locksmithId: string, limit = 10) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('locksmith_id', locksmithId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }

    return data || [];
}

/**
 * Get service types
 */
export async function getServiceTypes() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching service types:', error);
        return [];
    }

    return data || [];
}

/**
 * Toggle favorite
 */
export async function toggleFavorite(locksmithId: string): Promise<boolean> {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        console.error('User must be logged in to favorite');
        return false;
    }

    // Check if already favorited
    const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('locksmith_id', locksmithId)
        .single();

    if (existing) {
        // Remove favorite
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('id', existing.id);
        
        return !error;
    } else {
        // Add favorite
        const { error } = await supabase
            .from('favorites')
            .insert({
                user_id: user.id,
                locksmith_id: locksmithId,
            });
        
        return !error;
    }
}

/**
 * Get user's favorites
 */
export async function getUserFavorites(): Promise<string[]> {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
        .from('favorites')
        .select('locksmith_id')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }

    return (data || []).map(f => f.locksmith_id);
}
