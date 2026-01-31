import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const supabase = await createClient();

        // Fetch locksmith details
        const { data: locksmith, error } = await supabase
            .from('locksmiths')
            .select(`
        id,
        business_name,
        description,
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
        is_24_7,
        years_in_business,
        business_hours,
        created_at
      `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Locksmith not found' },
                    { status: 404 }
                );
            }
            console.error('Supabase query error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch locksmith', details: error.message },
                { status: 500 }
            );
        }

        // Generate mock services since we don't have services linked yet
        const services = [
            { name: 'Home Lockout', slug: 'home-lockout', price_min: 75, price_max: 150 },
            { name: 'Lock Replacement', slug: 'lock-replacement', price_min: 100, price_max: 250 },
            { name: 'Lock Rekey', slug: 'lock-rekey', price_min: 50, price_max: 100 },
            { name: 'Key Duplication', slug: 'key-duplication', price_min: 5, price_max: 25 },
            { name: 'Car Lockout', slug: 'car-lockout', price_min: 80, price_max: 180 },
        ];

        // Generate mock reviews for now
        const reviews = [
            {
                id: '1',
                user_name: 'Michael T.',
                rating: 5,
                content: 'Excellent service! Arrived quickly and was very professional.',
                created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: '2',
                user_name: 'Sarah K.',
                rating: 5,
                content: 'Very helpful and reasonably priced. Would definitely recommend!',
                created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: '3',
                user_name: 'David M.',
                rating: 4,
                content: 'Good work, arrived on time. Professional and courteous.',
                created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];

        return NextResponse.json({
            locksmith,
            services,
            reviews,
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
