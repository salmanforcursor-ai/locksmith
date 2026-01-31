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
};

// Canadian postal code pattern (e.g., M5V 3A8)
const POSTAL_CODE_PATTERN = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

// Map postal code prefixes to approximate locations
const POSTAL_CODE_PREFIXES: Record<string, { lat: number; lng: number; city: string }> = {
    'M': { lat: 43.6532, lng: -79.3832, city: 'Toronto' }, // Toronto
    'L': { lat: 43.7, lng: -79.4, city: 'Greater Toronto Area' }, // GTA
    'K': { lat: 45.4215, lng: -75.6972, city: 'Ottawa' },
    'V': { lat: 49.2827, lng: -123.1207, city: 'Vancouver' },
    'T': { lat: 51.0447, lng: -114.0719, city: 'Calgary/Alberta' },
    'H': { lat: 45.5017, lng: -73.5673, city: 'Montreal' },
    'R': { lat: 49.8951, lng: -97.1384, city: 'Winnipeg' },
    'N': { lat: 42.9849, lng: -81.2453, city: 'London/SW Ontario' },
};

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
                return NextResponse.json({
                    success: true,
                    lat: location.lat,
                    lng: location.lng,
                    formattedAddress: `${address.trim().toUpperCase()}, ${location.city}, Canada`,
                    type: 'postal_code',
                });
            }
        }

        // Check if it matches a known city
        for (const [cityKey, cityData] of Object.entries(CANADIAN_CITIES)) {
            if (trimmedAddress.includes(cityKey) || cityKey.includes(trimmedAddress)) {
                return NextResponse.json({
                    success: true,
                    lat: cityData.lat,
                    lng: cityData.lng,
                    formattedAddress: cityData.fullName,
                    type: 'city',
                });
            }
        }

        // Try to extract city name from address string
        const addressParts = trimmedAddress.split(/[,\s]+/);
        for (const part of addressParts) {
            const cityData = CANADIAN_CITIES[part];
            if (cityData) {
                return NextResponse.json({
                    success: true,
                    lat: cityData.lat,
                    lng: cityData.lng,
                    formattedAddress: cityData.fullName,
                    type: 'city',
                });
            }
        }

        // Check for common misspellings or partial matches
        const partialMatches = Object.entries(CANADIAN_CITIES).filter(([key]) =>
            key.startsWith(trimmedAddress.slice(0, 3)) || trimmedAddress.startsWith(key.slice(0, 3))
        );

        if (partialMatches.length > 0) {
            // Return suggestions for ambiguous input
            return NextResponse.json({
                success: false,
                error: 'Address not recognized. Did you mean one of these?',
                suggestions: partialMatches.slice(0, 5).map(([_, data]) => data.fullName),
            });
        }

        // If nothing matches, return error
        return NextResponse.json({
            success: false,
            error: 'Address not recognized. Please enter a valid Canadian city, postal code, or street address.',
            suggestions: ['Toronto, ON', 'Vancouver, BC', 'Calgary, AB', 'Montreal, QC'],
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

    // Find nearest city based on coordinates
    let nearestCity = 'Toronto, ON';
    let minDistance = Infinity;

    for (const [_, cityData] of Object.entries(CANADIAN_CITIES)) {
        const distance = Math.sqrt(
            Math.pow(lat - cityData.lat, 2) + Math.pow(lng - cityData.lng, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = cityData.fullName;
        }
    }

    return NextResponse.json({
        success: true,
        formattedAddress: nearestCity,
        lat,
        lng,
    });
}
