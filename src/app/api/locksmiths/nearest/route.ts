import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const lat = parseFloat(searchParams.get('lat') || '43.6532');
    const lng = parseFloat(searchParams.get('lng') || '-79.3832');
    const radius = parseInt(searchParams.get('radius') || '50');
    const limit = parseInt(searchParams.get('limit') || '5'); // Default to top 5
    const availableOnly = searchParams.get('available_only') === 'true';
    const verifiedOnly = searchParams.get('verified_only') === 'true';
    const service = searchParams.get('service');

    try {
        const supabase = await createClient();

        // Build the query
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
      `);

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

        // Calculate distances using Haversine formula and sort by distance
        const locksmithsWithDistance = (locksmiths || [])
            .map((locksmith) => {
                const distance = calculateHaversineDistance(lat, lng, locksmith.city);
                return {
                    ...locksmith,
                    distance_km: distance,
                };
            })
            .filter((l) => l.distance_km <= radius)
            .sort((a, b) => {
                // Sort ONLY by distance (closest first)
                return a.distance_km - b.distance_km;
            })
            .slice(0, limit); // Limit to top N results

        return NextResponse.json({
            locksmiths: locksmithsWithDistance,
            total: locksmithsWithDistance.length,
            search_radius_km: radius,
            user_coordinates: { lat, lng },
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Haversine formula for accurate distance calculation
function calculateHaversineDistance(userLat: number, userLng: number, city: string): number {
    // Map of city centers for distance calculation
    const cityCenters: Record<string, { lat: number; lng: number }> = {
        'Toronto': { lat: 43.6532, lng: -79.3832 },
        'Torto': { lat: 43.6532, lng: -79.3832 },
        'North York': { lat: 43.7615, lng: -79.4111 },
        'Scarborough': { lat: 43.7764, lng: -79.2318 },
        'Scarbor': { lat: 43.7764, lng: -79.2318 },
        'Vaughan': { lat: 43.8561, lng: -79.5085 },
        'Mississauga': { lat: 43.5890, lng: -79.6441 },
        'Mississa': { lat: 43.5890, lng: -79.6441 },
        'Brampton': { lat: 43.7315, lng: -79.7624 },
        'Brampt': { lat: 43.7315, lng: -79.7624 },
        'Markham': { lat: 43.8561, lng: -79.3370 },
        'MARKHAM': { lat: 43.8561, lng: -79.3370 },
        'Richmond Hill': { lat: 43.8828, lng: -79.4403 },
        'Richmond': { lat: 43.8828, lng: -79.4403 },
        'East York': { lat: 43.6911, lng: -79.3272 },
        'Hamilton': { lat: 43.2557, lng: -79.8711 },
        'Hamilt': { lat: 43.2557, lng: -79.8711 },
        'Concord': { lat: 43.8028, lng: -79.5380 },
        'Ccord': { lat: 43.8028, lng: -79.5380 },
        'Etobicoke': { lat: 43.6205, lng: -79.5132 },
        'Etobico': { lat: 43.6205, lng: -79.5132 },
        'Oakville': { lat: 43.4675, lng: -79.6877 },
        'Burlington': { lat: 43.3255, lng: -79.7990 },
        'Pickering': { lat: 43.8354, lng: -79.0868 },
        'Ajax': { lat: 43.8509, lng: -79.0204 },
        'Oshawa': { lat: 43.8971, lng: -78.8658 },
        'Whitby': { lat: 43.8975, lng: -78.9429 },
        'London': { lat: 42.9849, lng: -81.2453 },
        'Ottawa': { lat: 45.4215, lng: -75.6972 },
        'Kitchener': { lat: 43.4516, lng: -80.4925 },
        'Waterloo': { lat: 43.4643, lng: -80.5204 },
        'Guelph': { lat: 43.5448, lng: -80.2482 },
        'Cambridge': { lat: 43.3601, lng: -80.3120 },
        'Vancouver': { lat: 49.2827, lng: -123.1207 },
        'Calgary': { lat: 51.0447, lng: -114.0719 },
        'Edmonton': { lat: 53.5461, lng: -113.4938 },
        'Montreal': { lat: 45.5017, lng: -73.5673 },
        'Winnipeg': { lat: 49.8951, lng: -97.1384 },
    };

    // Find city center, default to Toronto if not found
    let cityCenter = cityCenters['Toronto'];
    for (const [key, coords] of Object.entries(cityCenters)) {
        if (city.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(city.toLowerCase())) {
            cityCenter = coords;
            break;
        }
    }

    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = toRad(cityCenter.lat - userLat);
    const dLng = toRad(cityCenter.lng - userLng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(userLat)) * Math.cos(toRad(cityCenter.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Add small random variation (0-0.5km) to differentiate locksmiths in same city
    const variation = Math.random() * 0.5;
    return Math.round((distance + variation) * 10) / 10;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}
