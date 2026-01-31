import type { LocksmithWithDistance, ServiceType } from '@/types/database.types';

// Mock data for development - simulates what would come from Supabase
export const mockServiceTypes: ServiceType[] = [
    { id: '1', name: 'Home Lockout', slug: 'home-lockout', category: 'emergency', description: 'Emergency lockout service for homes', icon: 'home' },
    { id: '2', name: 'Car Lockout', slug: 'car-lockout', category: 'emergency', description: 'Emergency lockout service for vehicles', icon: 'car' },
    { id: '3', name: 'Lock Replacement', slug: 'lock-replacement', category: 'residential', description: 'Full lock replacement service', icon: 'key' },
    { id: '4', name: 'Lock Rekey', slug: 'lock-rekey', category: 'residential', description: 'Rekey existing locks', icon: 'key' },
    { id: '5', name: 'Key Duplication', slug: 'key-duplication', category: 'residential', description: 'Duplicate keys', icon: 'copy' },
    { id: '6', name: 'Smart Lock Installation', slug: 'smart-lock', category: 'residential', description: 'Install smart locks', icon: 'smartphone' },
    { id: '7', name: 'Car Key Replacement', slug: 'car-key-replacement', category: 'automotive', description: 'Replace car keys', icon: 'car' },
    { id: '8', name: 'Commercial Lock Service', slug: 'commercial-lock', category: 'commercial', description: 'Commercial lock services', icon: 'building' },
];

export const mockLocksmiths: LocksmithWithDistance[] = [
    {
        id: '1',
        owner_id: 'owner1',
        business_name: 'QuickKey Locksmith',
        description: 'Family-owned locksmith business serving the Greater Toronto Area since 2005. We specialize in residential and automotive locksmith services with a focus on customer satisfaction and quick response times.',
        phone: '+1-416-555-0123',
        email: 'info@quickkey.ca',
        website: 'https://quickkey.ca',
        location: { lat: 43.6532, lng: -79.3832 },
        address: '123 Main Street',
        city: 'Toronto',
        province: 'ON',
        postal_code: 'M5V 2T6',
        availability_status: 'available',
        busy_until: null,
        last_active_at: new Date().toISOString(),
        is_verified: true,
        verification_date: '2024-01-15',
        years_in_business: 18,
        license_number: 'LK-2024-12345',
        insurance_verified: true,
        business_hours: {
            monday: { open: '08:00', close: '20:00' },
            tuesday: { open: '08:00', close: '20:00' },
            wednesday: { open: '08:00', close: '20:00' },
            thursday: { open: '08:00', close: '20:00' },
            friday: { open: '08:00', close: '20:00' },
            saturday: { open: '09:00', close: '17:00' },
            sunday: { open: '10:00', close: '16:00' },
        },
        is_24_7: false,
        featured_tier: 'premium',
        featured_until: '2025-12-31',
        avg_rating: 4.9,
        review_count: 127,
        response_time_minutes: 12,
        created_at: '2020-01-01',
        updated_at: new Date().toISOString(),
        distance_km: 1.2,
    },
    {
        id: '2',
        owner_id: 'owner2',
        business_name: 'FastLock Toronto',
        description: 'Professional locksmith services available 24/7. We handle all types of lock emergencies including residential, commercial, and automotive.',
        phone: '+1-416-555-0456',
        email: 'service@fastlocktoronto.ca',
        website: 'https://fastlocktoronto.ca',
        location: { lat: 43.6572, lng: -79.3902 },
        address: '456 Queen Street West',
        city: 'Toronto',
        province: 'ON',
        postal_code: 'M5V 2B4',
        availability_status: 'available',
        busy_until: null,
        last_active_at: new Date().toISOString(),
        is_verified: true,
        verification_date: '2024-02-20',
        years_in_business: 12,
        license_number: 'LK-2024-67890',
        insurance_verified: true,
        business_hours: {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
        },
        is_24_7: true,
        featured_tier: 'platinum',
        featured_until: '2025-12-31',
        avg_rating: 4.8,
        review_count: 89,
        response_time_minutes: 15,
        created_at: '2021-06-15',
        updated_at: new Date().toISOString(),
        distance_km: 2.4,
    },
    {
        id: '3',
        owner_id: 'owner3',
        business_name: 'SecureLock Pro',
        description: 'Trusted locksmith services for residential and commercial clients. Specializing in high-security lock installation and smart lock systems.',
        phone: '+1-416-555-0789',
        email: 'contact@securelockpro.ca',
        website: null,
        location: { lat: 43.6612, lng: -79.3952 },
        address: '789 Dundas Street',
        city: 'Toronto',
        province: 'ON',
        postal_code: 'M5T 1H5',
        availability_status: 'busy',
        busy_until: new Date(Date.now() + 30 * 60000).toISOString(),
        last_active_at: new Date().toISOString(),
        is_verified: true,
        verification_date: '2024-03-10',
        years_in_business: 8,
        license_number: 'LK-2024-11111',
        insurance_verified: true,
        business_hours: {
            monday: { open: '09:00', close: '18:00' },
            tuesday: { open: '09:00', close: '18:00' },
            wednesday: { open: '09:00', close: '18:00' },
            thursday: { open: '09:00', close: '18:00' },
            friday: { open: '09:00', close: '18:00' },
            saturday: { open: '10:00', close: '14:00' },
            sunday: null,
        },
        is_24_7: false,
        featured_tier: 'standard',
        featured_until: null,
        avg_rating: 4.6,
        review_count: 54,
        response_time_minutes: 20,
        created_at: '2022-03-20',
        updated_at: new Date().toISOString(),
        distance_km: 3.1,
    },
    {
        id: '4',
        owner_id: 'owner4',
        business_name: 'Metro Key & Lock',
        description: 'Your neighborhood locksmith. We provide affordable and reliable locksmith services to the Toronto area.',
        phone: '+1-416-555-0321',
        email: 'info@metrokeylock.ca',
        website: 'https://metrokeylock.ca',
        location: { lat: 43.6482, lng: -79.3752 },
        address: '321 Yonge Street',
        city: 'Toronto',
        province: 'ON',
        postal_code: 'M5B 1S1',
        availability_status: 'available',
        busy_until: null,
        last_active_at: new Date().toISOString(),
        is_verified: false,
        verification_date: null,
        years_in_business: 5,
        license_number: null,
        insurance_verified: false,
        business_hours: {
            monday: { open: '08:00', close: '18:00' },
            tuesday: { open: '08:00', close: '18:00' },
            wednesday: { open: '08:00', close: '18:00' },
            thursday: { open: '08:00', close: '18:00' },
            friday: { open: '08:00', close: '18:00' },
            saturday: { open: '09:00', close: '15:00' },
            sunday: null,
        },
        is_24_7: false,
        featured_tier: 'standard',
        featured_until: null,
        avg_rating: 4.2,
        review_count: 23,
        response_time_minutes: 25,
        created_at: '2023-01-10',
        updated_at: new Date().toISOString(),
        distance_km: 4.5,
    },
    {
        id: '5',
        owner_id: 'owner5',
        business_name: 'GTA Emergency Locksmith',
        description: '24/7 emergency locksmith service covering all of the Greater Toronto Area. Fast response, competitive pricing.',
        phone: '+1-647-555-0999',
        email: 'emergency@gtalocksmith.ca',
        website: 'https://gtalocksmith.ca',
        location: { lat: 43.7000, lng: -79.4000 },
        address: '555 Eglinton Avenue',
        city: 'Toronto',
        province: 'ON',
        postal_code: 'M4P 1N8',
        availability_status: 'offline',
        busy_until: null,
        last_active_at: new Date(Date.now() - 60 * 60000).toISOString(),
        is_verified: true,
        verification_date: '2024-01-05',
        years_in_business: 15,
        license_number: 'LK-2024-55555',
        insurance_verified: true,
        business_hours: {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
        },
        is_24_7: true,
        featured_tier: 'premium',
        featured_until: '2025-06-30',
        avg_rating: 4.7,
        review_count: 156,
        response_time_minutes: 18,
        created_at: '2019-05-01',
        updated_at: new Date().toISOString(),
        distance_km: 5.8,
    },
];

// Helper to get locksmiths sorted by distance and featured status
export function getNearestLocksmiths(
    lat: number,
    lng: number,
    options: {
        service?: string;
        available_only?: boolean;
        verified_only?: boolean;
        limit?: number;
    } = {}
): LocksmithWithDistance[] {
    let results = [...mockLocksmiths];

    // Filter by availability
    if (options.available_only) {
        results = results.filter((l) => l.availability_status === 'available');
    }

    // Filter by verified
    if (options.verified_only) {
        results = results.filter((l) => l.is_verified);
    }

    // Sort: featured first (within same tier, sort by distance), then by distance
    results.sort((a, b) => {
        // Premium/platinum first
        const tierOrder = { platinum: 0, premium: 1, standard: 2 };
        const tierDiff = tierOrder[a.featured_tier] - tierOrder[b.featured_tier];
        if (tierDiff !== 0) return tierDiff;

        // Then by distance
        return a.distance_km - b.distance_km;
    });

    // Limit results
    if (options.limit) {
        results = results.slice(0, options.limit);
    }

    return results;
}
