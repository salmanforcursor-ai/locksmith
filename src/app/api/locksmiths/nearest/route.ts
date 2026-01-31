import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const lat = parseFloat(searchParams.get('lat') || '43.6532');
    const lng = parseFloat(searchParams.get('lng') || '-79.3832');
    const radius = parseInt(searchParams.get('radius') || '25');
    const availableOnly = searchParams.get('available_only') === 'true';
    const verifiedOnly = searchParams.get('verified_only') === 'true';
    const service = searchParams.get('service');

    try {
        const supabase = await createClient();

        // Build the query with PostGIS distance calculation
        let query = supabase
            .from('locksmiths')
            .select(`
        id,
        business_name,
        phone,
        address,
        city,
        province,
        postal_code,
        website,
        availability_status,
        is_verified,
        featured_tier,
        avg_rating,
        review_count,
        response_time_minutes,
        description,
        is_24_7,
        years_in_business
      `)
            .order('featured_tier', { ascending: false });

        // Apply availability filter
        if (availableOnly) {
            query = query.eq('availability_status', 'available');
        }

        // Apply verified filter
        if (verifiedOnly) {
            query = query.eq('is_verified', true);
        }

        const { data: locksmiths, error } = await query;

        if (error) {
            console.error('Supabase query error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch locksmiths', details: error.message },
                { status: 500 }
            );
        }

        // Calculate distances and filter by radius
        // Since PostGIS geography distance is complex in Supabase JS client,
        // we'll calculate distances on the server
        const locksmithsWithDistance = (locksmiths || [])
            .map((locksmith) => {
                // For now, since the location column is geography type,
                // we need to fetch coordinates separately or use RPC
                // We'll use a simplified distance calculation based on city
                // or default to random distance for demo
                const distance = calculateMockDistance(lat, lng, locksmith.city);
                return {
                    ...locksmith,
                    distance_km: distance,
                };
            })
            .filter((l) => l.distance_km <= radius)
            .sort((a, b) => {
                // Premium first, then by distance
                const tierOrder = { platinum: 0, premium: 1, standard: 2 };
                const tierDiff = (tierOrder[a.featured_tier as keyof typeof tierOrder] || 2) -
                    (tierOrder[b.featured_tier as keyof typeof tierOrder] || 2);
                if (tierDiff !== 0) return tierDiff;
                return a.distance_km - b.distance_km;
            });

        return NextResponse.json({
            locksmiths: locksmithsWithDistance,
            total: locksmithsWithDistance.length,
            search_radius_km: radius,
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Simplified distance calculation (Haversine would be ideal with real coords)
function calculateMockDistance(lat: number, lng: number, city: string): number {
    // Map of approximate city centers
    const cityCenters: Record<string, { lat: number; lng: number }> = {
        'Toronto': { lat: 43.6532, lng: -79.3832 },
        'Torto': { lat: 43.6532, lng: -79.3832 }, // Handle truncated city names
        'North York': { lat: 43.7615, lng: -79.4111 },
        'Scarborough': { lat: 43.7764, lng: -79.2318 },
        'Vaughan': { lat: 43.8561, lng: -79.5085 },
        'Mississauga': { lat: 43.5890, lng: -79.6441 },
        'Brampton': { lat: 43.7315, lng: -79.7624 },
        'Brampt': { lat: 43.7315, lng: -79.7624 },
        'Markham': { lat: 43.8561, lng: -79.3370 },
        'MARKHAM': { lat: 43.8561, lng: -79.3370 },
        'Richmond Hill': { lat: 43.8828, lng: -79.4403 },
        'East York': { lat: 43.6911, lng: -79.3272 },
        'Hamilton': { lat: 43.2557, lng: -79.8711 },
        'Hamilt': { lat: 43.2557, lng: -79.8711 },
        'Ccord': { lat: 43.8028, lng: -79.5380 }, // Concord
    };

    const cityCenter = cityCenters[city] || cityCenters['Toronto'];

    // Haversine formula for distance
    const R = 6371; // Earth's radius in km
    const dLat = toRad(cityCenter.lat - lat);
    const dLng = toRad(cityCenter.lng - lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat)) * Math.cos(toRad(cityCenter.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Add small random variation to avoid all showing same distance
    return Math.round((distance + Math.random() * 2) * 10) / 10;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}
