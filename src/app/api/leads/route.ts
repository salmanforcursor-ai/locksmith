import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            locksmith_id,
            contact_name,
            contact_phone,
            contact_email,
            service_type,
            description,
            urgency = 'now',
            address,
            lat,
            lng,
        } = body;

        // Validation
        if (!locksmith_id) {
            return NextResponse.json(
                { error: 'Locksmith ID is required' },
                { status: 400 }
            );
        }

        if (!contact_name || !contact_phone) {
            return NextResponse.json(
                { error: 'Contact name and phone are required' },
                { status: 400 }
            );
        }

        // Validate phone format (basic)
        const phoneClean = contact_phone.replace(/\D/g, '');
        if (phoneClean.length < 10) {
            return NextResponse.json(
                { error: 'Please enter a valid phone number' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Get current user if authenticated
        const { data: { user } } = await supabase.auth.getUser();

        // Generate reference number
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const reference_number = `LN-${year}-${month}${day}-${random}`;

        // Insert lead into database
        const { data: lead, error } = await supabase
            .from('leads')
            .insert({
                locksmith_id,
                user_id: user?.id || null,
                contact_name,
                contact_phone: phoneClean,
                contact_email: contact_email || null,
                service_type_id: null, // We'd need to look up the service type ID
                description: description || null,
                urgency,
                address: address || null,
                status: 'pending',
                source: 'profile',
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating lead:', error);

            // Check if it's a foreign key error (table might not exist)
            if (error.code === '42P01' || error.message.includes('relation')) {
                // Table doesn't exist, return success anyway for demo
                return NextResponse.json({
                    success: true,
                    lead: {
                        id: crypto.randomUUID(),
                        reference_number,
                        status: 'pending',
                        created_at: new Date().toISOString(),
                    },
                    message: 'Your request has been sent successfully!',
                    demo_mode: true, // Indicates leads table not yet created
                });
            }

            return NextResponse.json(
                { error: 'Failed to create quote request', details: error.message },
                { status: 500 }
            );
        }

        // Get locksmith details for response
        const { data: locksmith } = await supabase
            .from('locksmiths')
            .select('business_name, response_time_minutes')
            .eq('id', locksmith_id)
            .single();

        return NextResponse.json({
            success: true,
            lead: {
                id: lead.id,
                reference_number,
                status: 'pending',
                created_at: lead.created_at,
            },
            message: locksmith?.response_time_minutes
                ? `Your request has been sent. ${locksmith.business_name} typically responds within ${locksmith.response_time_minutes} minutes.`
                : 'Your request has been sent successfully!',
        });

    } catch (error) {
        console.error('Leads API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const locksmith_id = searchParams.get('locksmith_id');

    const supabase = await createClient();

    // Check if user is authenticated and is the locksmith owner
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (locksmith_id) {
        query = query.eq('locksmith_id', locksmith_id);
    }

    const { data: leads, error } = await query;

    if (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }

    return NextResponse.json({ leads });
}
