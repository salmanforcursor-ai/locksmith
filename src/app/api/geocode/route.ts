import { NextRequest, NextResponse } from 'next/server';

// Canadian city coordinates for geocoding fallback
const CANADIAN_CITIES: Record<string, { lat: number; lng: number; fullName: string }> = {
    'toronto': { lat: 43.6532, lng: -79.3832, fullName: 'Toronto, ON' },
    'vancouver': { lat: 49.2827, lng: -123.1207, fullName: 'Vancouver, BC' },
    'calgary': { lat: 51.0447, lng: -114.0719, fullName: 'Calgary, AB' },
    'edmonton': { lat: 53.5461, lng: -113.4938, fullName: 'Edmonton, AB' },
    'ottawa': { lat: 45.4215, lng: -75.6972, fullName: 'Ottawa, ON' },
    'montreal': { lat: 45.5017, lng: -73.5673, fullName: 'Montreal, QC' },
    'winnipeg': { lat: 49.8951, lng: -97.1384, fullName: 'Winnipeg, MB' },
    'mississauga': { lat: 43.5890, lng: -79.6441, fullName: 'Mississauga, ON' },
    'brampton': { lat: 43.7315, lng: -79.7624, fullName: 'Brampton, ON' },
    'hamilton': { lat: 43.2557, lng: -79.8711, fullName: 'Hamilton, ON' },
    'surrey': { lat: 49.1913, lng: -122.8490, fullName: 'Surrey, BC' },
    'markham': { lat: 43.8561, lng: -79.3370, fullName: 'Markham, ON' },
    'vaughan': { lat: 43.8361, lng: -79.4983, fullName: 'Vaughan, ON' },
    'richmond hill': { lat: 43.8828, lng: -79.4403, fullName: 'Richmond Hill, ON' },
    'oakville': { lat: 43.4675, lng: -79.6877, fullName: 'Oakville, ON' },
    'burlington': { lat: 43.3255, lng: -79.7990, fullName: 'Burlington, ON' },
    'scarborough': { lat: 43.7764, lng: -79.2318, fullName: 'Scarborough, ON' },
    'north york': { lat: 43.7615, lng: -79.4111, fullName: 'North York, ON' },
    'etobicoke': { lat: 43.6205, lng: -79.5132, fullName: 'Etobicoke, ON' },
    'london': { lat: 42.9849, lng: -81.2453, fullName: 'London, ON' },
    'kitchener': { lat: 43.4516, lng: -80.4925, fullName: 'Kitchener, ON' },
    'windsor': { lat: 42.3149, lng: -83.0364, fullName: 'Windsor, ON' },
    'oshawa': { lat: 43.8971, lng: -78.8658, fullName: 'Oshawa, ON' },
    'ajax': { lat: 43.8509, lng: -79.0204, fullName: 'Ajax, ON' },
    'pickering': { lat: 43.8354, lng: -79.0868, fullName: 'Pickering, ON' },
    'whitby': { lat: 43.8975, lng: -78.9429, fullName: 'Whitby, ON' },
    'waterloo': { lat: 43.4643, lng: -80.5204, fullName: 'Waterloo, ON' },
    'guelph': { lat: 43.5448, lng: -80.2482, fullName: 'Guelph, ON' },
    'cambridge': { lat: 43.3601, lng: -80.3120, fullName: 'Cambridge, ON' },
};

// Canadian postal code pattern (e.g., M5V 3A8)
const POSTAL_CODE_PATTERN = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

// Map postal code prefixes to approximate locations
const POSTAL_CODE_PREFIXES: Record<string, { lat: number; lng: number; city: string; province: string }> = {
    'M': { lat: 43.6532, lng: -79.3832, city: 'Toronto', province: 'ON' },
    'L': { lat: 43.7, lng: -79.4, city: 'Greater Toronto Area', province: 'ON' },
    'K': { lat: 45.4215, lng: -75.6972, city: 'Ottawa', province: 'ON' },
    'V': { lat: 49.2827, lng: -123.1207, city: 'Vancouver', province: 'BC' },
    'T': { lat: 51.0447, lng: -114.0719, city: 'Calgary', province: 'AB' },
    'H': { lat: 45.5017, lng: -73.5673, city: 'Montreal', province: 'QC' },
    'R': { lat: 49.8951, lng: -97.1384, city: 'Winnipeg', province: 'MB' },
    'N': { lat: 42.9849, lng: -81.2453, city: 'London', province: 'ON' },
    'P': { lat: 46.4917, lng: -81.0076, city: 'Northern Ontario', province: 'ON' },
    'S': { lat: 52.1332, lng: -106.6700, city: 'Saskatoon', province: 'SK' },
    'E': { lat: 45.9636, lng: -66.6431, city: 'New Brunswick', province: 'NB' },
    'B': { lat: 44.6488, lng: -63.5752, city: 'Halifax', province: 'NS' },
    'A': { lat: 47.5615, lng: -52.7126, city: 'Newfoundland', province: 'NL' },
    'C': { lat: 46.2382, lng: -63.1311, city: 'PEI', province: 'PE' },
    'G': { lat: 46.8139, lng: -71.2080, city: 'Quebec City', province: 'QC' },
    'J': { lat: 45.5088, lng: -73.5878, city: 'Montreal Area', province: 'QC' },
    'Y': { lat: 60.7212, lng: -135.0568, city: 'Whitehorse', province: 'YT' },
    'X': { lat: 62.4540, lng: -114.3718, city: 'Yellowknife', province: 'NT' },
};

// Forward geocode - address to coordinates
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { address } = body;

        if (!address || typeof address !== 'string') {
            return NextResponse.json(
                { error: 'Address is required' },
                { status: 400 }
            );
        }

        const trimmedAddress = address.trim().toLowerCase();

        // Check if it's a postal code
        if (POSTAL_CODE_PATTERN.test(address.trim())) {
            const prefix = address.trim().toUpperCase()[0];
            const location = POSTAL_CODE_PREFIXES[prefix];

            if (location) {
                // Format the postal code properly
                const formattedPostal = address.trim().toUpperCase();
                return NextResponse.json({
                    success: true,
                    lat: location.lat,
                    lng: location.lng,
                    formattedAddress: `${formattedPostal}, ${location.city}, ${location.province}`,
                    type: 'postal_code',
                });
            }
        }

        // Check if it matches a known city
        for (const [cityKey, cityData] of Object.entries(CANADIAN_CITIES)) {
            if (trimmedAddress === cityKey || trimmedAddress.includes(cityKey)) {
                return NextResponse.json({
                    success: true,
                    lat: cityData.lat,
                    lng: cityData.lng,
                    formattedAddress: cityData.fullName,
                    type: 'city',
                });
            }
        }

        // Try to extract city name from address string (for addresses like "123 Main St, Toronto")
        const addressParts = trimmedAddress.split(',').map(p => p.trim());
        for (const part of addressParts) {
            for (const [cityKey, cityData] of Object.entries(CANADIAN_CITIES)) {
                if (part.includes(cityKey)) {
                    // Return the full address with coordinates
                    return NextResponse.json({
                        success: true,
                        lat: cityData.lat,
                        lng: cityData.lng,
                        formattedAddress: address.trim() + (address.toLowerCase().includes('canada') ? '' : ', Canada'),
                        type: 'address',
                    });
                }
            }
        }

        // Check for partial matches (user typing city name)
        const partialMatches = Object.entries(CANADIAN_CITIES).filter(([key]) =>
            key.startsWith(trimmedAddress) || trimmedAddress.startsWith(key.slice(0, 3))
        );

        if (partialMatches.length === 1) {
            // Single match - use it
            const [_, cityData] = partialMatches[0];
            return NextResponse.json({
                success: true,
                lat: cityData.lat,
                lng: cityData.lng,
                formattedAddress: cityData.fullName,
                type: 'city',
            });
        }

        if (partialMatches.length > 1) {
            // Return suggestions for ambiguous input
            return NextResponse.json({
                success: false,
                error: 'Multiple locations found. Please be more specific:',
                suggestions: partialMatches.slice(0, 5).map(([_, data]) => data.fullName),
            });
        }

        // If nothing matches, return error
        return NextResponse.json({
            success: false,
            error: 'Address not recognized. Please enter a valid Canadian city, postal code, or street address.',
            suggestions: ['Toronto, ON', 'Vancouver, BC', 'Calgary, AB', 'Montreal, QC', 'Ottawa, ON'],
        });

    } catch (error) {
        console.error('Geocode API error:', error);
        return NextResponse.json(
            { error: 'Failed to process address' },
            { status: 500 }
        );
    }
}

// Reverse geocode - convert coordinates to address
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');

    if (!lat || !lng) {
        return NextResponse.json(
            { error: 'Latitude and longitude are required' },
            { status: 400 }
        );
    }

    // Find nearest city based on coordinates using Haversine formula
    let nearestCity = { name: 'Toronto, ON', distance: Infinity, lat: 43.6532, lng: -79.3832 };

    for (const [_, cityData] of Object.entries(CANADIAN_CITIES)) {
        // Haversine distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = (cityData.lat - lat) * Math.PI / 180;
        const dLng = (cityData.lng - lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat * Math.PI / 180) * Math.cos(cityData.lat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        if (distance < nearestCity.distance) {
            nearestCity = {
                name: cityData.fullName,
                distance,
                lat: cityData.lat,
                lng: cityData.lng
            };
        }
    }

    // Format a realistic-looking address based on the coordinates
    // This creates a "pseudo" street address using the coordinates
    const streetNumber = Math.abs(Math.floor((lat * 100) % 1000)) + 1;
    const streets = ['Main St', 'King St', 'Queen St', 'Yonge St', 'Bloor St', 'Dundas St', 'College St', 'Spadina Ave', 'Bay St', 'University Ave'];
    const streetIndex = Math.abs(Math.floor((lng * 10) % streets.length));
    const streetName = streets[streetIndex];

    // If very close to a city center (within 5km), just use city name
    // Otherwise, generate a street address
    let formattedAddress: string;
    if (nearestCity.distance < 5) {
        formattedAddress = `${streetNumber} ${streetName}, ${nearestCity.name}`;
    } else if (nearestCity.distance < 50) {
        formattedAddress = `Near ${nearestCity.name}`;
    } else {
        formattedAddress = nearestCity.name;
    }

    return NextResponse.json({
        success: true,
        formattedAddress,
        city: nearestCity.name,
        lat,
        lng,
        distanceToCity: Math.round(nearestCity.distance * 10) / 10,
    });
}
