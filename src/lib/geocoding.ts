/**
 * Geocoding utility using OpenStreetMap Nominatim API
 * Rate limit: 1 request per second (free tier)
 */

interface GeocodingResult {
    lat: number;
    lng: number;
    display_name: string;
}

interface NominatimResponse {
    lat: string;
    lon: string;
    display_name: string;
}

/**
 * Geocode a single address using OpenStreetMap Nominatim
 * @param address - The address to geocode
 * @returns Coordinates and display name, or null if not found
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
    // Add Canada to improve results
    const searchAddress = address.includes('Canada') ? address : `${address}, Canada`;
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&countrycodes=ca&limit=1`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'LocksmithNow/1.0 (https://locksmithnow.ca)',
            },
        });
        
        if (!response.ok) {
            console.error(`Geocoding failed: ${response.status}`);
            return null;
        }
        
        const data: NominatimResponse[] = await response.json();
        
        if (data.length === 0) {
            return null;
        }
        
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            display_name: data[0].display_name,
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

/**
 * Parse a Canadian address into components
 */
export function parseAddress(fullAddress: string): {
    street: string;
    city: string;
    province: string;
    postalCode: string;
} {
    // Handle "Address not available"
    if (fullAddress.toLowerCase().includes('not available')) {
        return { street: '', city: '', province: '', postalCode: '' };
    }
    
    // Try to match Canadian address format: "123 Main St, Toronto, ON M5V 1A1"
    const parts = fullAddress.split(',').map(p => p.trim());
    
    if (parts.length >= 2) {
        const street = parts[0];
        const cityProvince = parts.slice(1).join(', ');
        
        // Extract province code (ON, BC, AB, etc.)
        const provinceMatch = cityProvince.match(/\b(ON|BC|AB|SK|MB|QC|NB|NS|PE|NL|YT|NT|NU)\b/i);
        const province = provinceMatch ? provinceMatch[1].toUpperCase() : '';
        
        // Extract postal code
        const postalMatch = cityProvince.match(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/i);
        const postalCode = postalMatch ? postalMatch[0].toUpperCase().replace(/\s/, ' ') : '';
        
        // Extract city (before province)
        let city = '';
        if (parts.length >= 2) {
            city = parts[1].replace(/\s*(ON|BC|AB|SK|MB|QC|NB|NS|PE|NL|YT|NT|NU)\s*/gi, '').trim();
            city = city.replace(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/i, '').trim();
        }
        
        return { street, city, province, postalCode };
    }
    
    return { street: fullAddress, city: '', province: '', postalCode: '' };
}

/**
 * Format phone number to consistent format
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it starts with 1 (country code), remove it
    const normalized = digits.startsWith('1') && digits.length === 11 
        ? digits.slice(1) 
        : digits;
    
    // Format as XXX-XXX-XXXX
    if (normalized.length === 10) {
        return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6)}`;
    }
    
    return phone; // Return original if can't format
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
