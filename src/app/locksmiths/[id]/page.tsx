'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Input, Textarea } from '@/components/ui';
import { formatRating, formatPhone, formatPriceRange, formatRelativeTime, cn } from '@/lib/utils';
import {
    ArrowLeft,
    Phone,
    MessageSquare,
    MapPin,
    Star,
    Clock,
    Shield,
    CheckCircle,
    ExternalLink,
    Heart,
    Share2,
    Award,
    Send,
    User,
    Mail,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface LocksmithData {
    id: string;
    business_name: string;
    description: string | null;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    website: string | null;
    availability_status: 'available' | 'busy' | 'offline';
    is_verified: boolean;
    featured_tier: 'standard' | 'premium' | 'platinum';
    avg_rating: number;
    review_count: number;
    response_time_minutes: number | null;
    is_24_7: boolean;
    years_in_business: number | null;
    business_hours: Record<string, { open: string; close: string } | null> | null;
}

interface Service {
    name: string;
    slug: string;
    price_min: number;
    price_max: number;
}

interface Review {
    id: string;
    user_name: string;
    rating: number;
    content: string;
    created_at: string;
}

interface QuoteFormData {
    name: string;
    phone: string;
    email: string;
    description: string;
}

export default function LocksmithProfilePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params);
    const [locksmith, setLocksmith] = useState<LocksmithData | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);
    const [quoteRef, setQuoteRef] = useState('');
    const [quoteMessage, setQuoteMessage] = useState('');
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [formData, setFormData] = useState<QuoteFormData>({
        name: '',
        phone: '',
        email: '',
        description: '',
    });

    useEffect(() => {
        const fetchLocksmith = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/locksmiths/${id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Locksmith not found');
                    }
                    throw new Error('Failed to fetch locksmith');
                }

                const data = await response.json();
                setLocksmith(data.locksmith);
                setServices(data.services || []);
                setReviews(data.reviews || []);
            } catch (err) {
                console.error('Error fetching locksmith:', err);
                setError(err instanceof Error ? err.message : 'Failed to load locksmith');
            } finally {
                setLoading(false);
            }
        };

        fetchLocksmith();
    }, [id]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setQuoteError(null);
    };

    const validatePhoneNumber = (phone: string): boolean => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10;
    };

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setQuoteError(null);

        // Validation
        if (!formData.name.trim()) {
            setQuoteError('Please enter your name');
            return;
        }

        if (!formData.phone.trim()) {
            setQuoteError('Please enter your phone number');
            return;
        }

        if (!validatePhoneNumber(formData.phone)) {
            setQuoteError('Please enter a valid 10-digit phone number');
            return;
        }

        if (!formData.description.trim()) {
            setQuoteError('Please describe your issue');
            return;
        }

        setQuoteLoading(true);

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    locksmith_id: id,
                    contact_name: formData.name.trim(),
                    contact_phone: formData.phone.trim(),
                    contact_email: formData.email.trim() || null,
                    description: formData.description.trim(),
                    urgency: 'now',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send request');
            }

            setQuoteRef(data.lead?.reference_number || 'LN-' + Date.now());
            setQuoteMessage(data.message || 'Your request has been sent successfully!');
            setQuoteSubmitted(true);
        } catch (err) {
            console.error('Error submitting quote:', err);
            setQuoteError(err instanceof Error ? err.message : 'Failed to send request. Please try again.');
        } finally {
            setQuoteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 pb-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-48 bg-[var(--surface)] rounded" />
                        <div className="h-64 bg-[var(--surface)] rounded-2xl" />
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-6">
                                <div className="h-48 bg-[var(--surface)] rounded-2xl" />
                                <div className="h-64 bg-[var(--surface)] rounded-2xl" />
                            </div>
                            <div className="h-96 bg-[var(--surface)] rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !locksmith) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
                <Card className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-[var(--error)]/10 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-[var(--error)]" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                        {error === 'Locksmith not found' ? 'Locksmith Not Found' : 'Error Loading Profile'}
                    </h2>
                    <p className="text-[var(--foreground-secondary)] mb-6">
                        {error || 'Unable to load this locksmith profile.'}
                    </p>
                    <Link href="/search">
                        <Button variant="primary">
                            Back to Search
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const fullAddress = `${locksmith.address}, ${locksmith.city}, ${locksmith.province} ${locksmith.postal_code}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Back Button */}
                <Link
                    href="/search"
                    className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to results
                </Link>

                {/* Header Card */}
                <Card variant={locksmith.featured_tier !== 'standard' ? 'premium' : 'default'} className="mb-6" padding="lg">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar/Logo */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                {locksmith.business_name.charAt(0)}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start gap-2 mb-2">
                                {locksmith.featured_tier === 'platinum' && (
                                    <Badge variant="premium" size="sm">⭐ Platinum</Badge>
                                )}
                                {locksmith.featured_tier === 'premium' && (
                                    <Badge variant="premium" size="sm">Premium</Badge>
                                )}
                                {locksmith.is_verified && (
                                    <Badge variant="verified" size="sm">
                                        <Shield className="w-3 h-3" /> Verified
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold mb-2 truncate">
                                {locksmith.business_name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-[var(--foreground-secondary)] mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium text-[var(--foreground)]">
                                        {formatRating(locksmith.avg_rating || 4.5)}
                                    </span>
                                    <span>({locksmith.review_count || reviews.length} reviews)</span>
                                </div>
                                {locksmith.years_in_business && (
                                    <div className="flex items-center gap-1">
                                        <Award className="w-4 h-4" />
                                        <span>{locksmith.years_in_business}+ years</span>
                                    </div>
                                )}
                                {locksmith.response_time_minutes && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>~{locksmith.response_time_minutes} min response</span>
                                    </div>
                                )}
                            </div>

                            {/* Availability */}
                            <div className={cn(
                                'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
                                locksmith.availability_status === 'available'
                                    ? 'bg-[var(--success)]/10 text-[var(--success)]'
                                    : locksmith.availability_status === 'busy'
                                        ? 'bg-yellow-500/10 text-yellow-400'
                                        : 'bg-gray-500/10 text-gray-400'
                            )}>
                                <span className={cn(
                                    'w-2 h-2 rounded-full',
                                    locksmith.availability_status === 'available' && 'bg-[var(--success)] animate-pulse',
                                    locksmith.availability_status === 'busy' && 'bg-yellow-400',
                                    locksmith.availability_status === 'offline' && 'bg-gray-400'
                                )} />
                                {locksmith.availability_status === 'available' ? 'Available Now' :
                                    locksmith.availability_status === 'busy' ? 'Currently Busy' : 'Offline'}
                                {locksmith.is_24_7 && <span className="text-xs opacity-70">• 24/7</span>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col gap-2">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={cn(
                                    'p-3 rounded-xl border transition-all',
                                    isFavorite
                                        ? 'bg-pink-500/10 border-pink-500/30 text-pink-400'
                                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                                )}
                            >
                                <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
                            </button>
                            <button className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* About */}
                        {locksmith.description && (
                            <Card padding="lg">
                                <h2 className="text-lg font-semibold mb-4">About</h2>
                                <p className="text-[var(--foreground-secondary)] leading-relaxed">
                                    {locksmith.description}
                                </p>
                            </Card>
                        )}

                        {/* Services & Pricing */}
                        <Card padding="lg">
                            <h2 className="text-lg font-semibold mb-4">Services & Pricing</h2>
                            <div className="space-y-3">
                                {services.map((service) => (
                                    <div key={service.slug} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                                        <span>{service.name}</span>
                                        <span className="font-medium text-[var(--primary-400)]">
                                            {formatPriceRange(service.price_min, service.price_max)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-[var(--foreground-muted)] mt-4">
                                * Prices are estimates and may vary based on specific requirements
                            </p>
                        </Card>

                        {/* Reviews */}
                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Reviews</h2>
                                <div className="flex items-center gap-1 text-[var(--foreground-secondary)]">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium">{formatRating(locksmith.avg_rating || 4.5)}</span>
                                    <span>({reviews.length})</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="pb-4 border-b border-[var(--border)] last:border-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                                                    <User className="w-4 h-4 text-[var(--foreground-muted)]" />
                                                </div>
                                                <span className="font-medium">{review.user_name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={cn(
                                                            'w-4 h-4',
                                                            i < review.rating
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-600'
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[var(--foreground-secondary)] text-sm">
                                            {review.content}
                                        </p>
                                        <p className="text-xs text-[var(--foreground-muted)] mt-2">
                                            {formatRelativeTime(review.created_at)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <Card variant="glass" padding="lg" className="sticky top-24">
                            {!showQuoteForm && !quoteSubmitted && (
                                <>
                                    <h3 className="font-semibold mb-4">Contact {locksmith.business_name}</h3>
                                    <div className="space-y-3">
                                        <a href={`tel:${locksmith.phone}`}>
                                            <Button variant="primary" className="w-full" size="lg" icon={<Phone className="w-5 h-5" />}>
                                                Call Now
                                            </Button>
                                        </a>
                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            size="lg"
                                            onClick={() => setShowQuoteForm(true)}
                                            icon={<MessageSquare className="w-5 h-5" />}
                                        >
                                            Request Quote
                                        </Button>
                                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                                            <Button variant="ghost" className="w-full" icon={<MapPin className="w-5 h-5" />}>
                                                Get Directions
                                            </Button>
                                        </a>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-[var(--border)]">
                                        <p className="text-sm text-[var(--foreground-secondary)] flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {formatPhone(locksmith.phone)}
                                        </p>
                                        <p className="text-sm text-[var(--foreground-secondary)] flex items-center gap-2 mt-2">
                                            <MapPin className="w-4 h-4" />
                                            {locksmith.city}, {locksmith.province}
                                        </p>
                                        {locksmith.website && (
                                            <a
                                                href={locksmith.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-[var(--primary-400)] hover:underline flex items-center gap-2 mt-2"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Visit Website
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}

                            {showQuoteForm && !quoteSubmitted && (
                                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Request a Quote</h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowQuoteForm(false);
                                                setQuoteError(null);
                                            }}
                                            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {quoteError && (
                                        <div className="p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            {quoteError}
                                        </div>
                                    )}

                                    <Input
                                        label="Your Name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        icon={<User className="w-5 h-5" />}
                                        required
                                    />
                                    <Input
                                        label="Phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="(416) 555-0123"
                                        value={formData.phone}
                                        onChange={handleFormChange}
                                        icon={<Phone className="w-5 h-5" />}
                                        required
                                    />
                                    <Input
                                        label="Email (optional)"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        icon={<Mail className="w-5 h-5" />}
                                    />
                                    <Textarea
                                        label="Describe your issue"
                                        name="description"
                                        placeholder="I'm locked out of my apartment..."
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows={3}
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full"
                                        loading={quoteLoading}
                                        icon={quoteLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    >
                                        {quoteLoading ? 'Sending...' : 'Send Request'}
                                    </Button>
                                </form>
                            )}

                            {quoteSubmitted && (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-[var(--success)]" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Request Sent!</h3>
                                    <p className="text-sm text-[var(--foreground-secondary)] mb-4">
                                        {quoteMessage}
                                    </p>
                                    <div className="bg-[var(--background-secondary)] rounded-lg p-3 mb-4">
                                        <p className="text-xs text-[var(--foreground-muted)]">Reference Number</p>
                                        <p className="font-mono font-medium">{quoteRef}</p>
                                    </div>
                                    <a href={`tel:${locksmith.phone}`}>
                                        <Button variant="primary" className="w-full" icon={<Phone className="w-5 h-5" />}>
                                            Call Now Instead
                                        </Button>
                                    </a>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
