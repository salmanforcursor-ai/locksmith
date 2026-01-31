'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, Button, Badge, AvailableBadge, BusyBadge, OfflineBadge, VerifiedBadge, PremiumBadge, Input, Textarea } from '@/components/ui';
import { mockLocksmiths, mockServiceTypes } from '@/lib/mock-data';
import type { Locksmith } from '@/types/database.types';
import { cn, formatDistance, formatRating, formatPhone, formatPriceRange } from '@/lib/utils';
import {
    ArrowLeft,
    Phone,
    MessageSquare,
    MapPin,
    Star,
    Clock,
    Calendar,
    Shield,
    Award,
    Globe,
    Mail,
    ExternalLink,
    Heart,
    Share2,
    CheckCircle,
    Navigation,
} from 'lucide-react';

export default function LocksmithDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [locksmith, setLocksmith] = useState<Locksmith | null>(null);
    const [loading, setLoading] = useState(true);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Quote form state
    const [quoteName, setQuoteName] = useState('');
    const [quotePhone, setQuotePhone] = useState('');
    const [quoteService, setQuoteService] = useState('');
    const [quoteDescription, setQuoteDescription] = useState('');
    const [quoteSubmitting, setQuoteSubmitting] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);

    useEffect(() => {
        const id = params.id as string;
        const found = mockLocksmiths.find(l => l.id === id);
        setLocksmith(found || null);
        setLoading(false);

        // Check if action=quote
        if (searchParams.get('action') === 'quote') {
            setShowQuoteForm(true);
        }
    }, [params.id, searchParams]);

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setQuoteSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setQuoteSubmitting(false);
        setQuoteSubmitted(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 pb-12">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-32 skeleton" />
                        <div className="h-64 skeleton rounded-2xl" />
                        <div className="h-48 skeleton rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!locksmith) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
                <Card className="text-center py-12 max-w-md mx-auto">
                    <h2 className="text-xl font-bold mb-2">Locksmith Not Found</h2>
                    <p className="text-[var(--foreground-secondary)] mb-4">
                        The locksmith you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link href="/search">
                        <Button variant="primary">Back to Search</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const isPremium = locksmith.featured_tier === 'premium' || locksmith.featured_tier === 'platinum';

    const AvailabilityBadgeComponent = () => {
        switch (locksmith.availability_status) {
            case 'available':
                return <AvailableBadge size="md" />;
            case 'busy':
                return <BusyBadge size="md" />;
            default:
                return <OfflineBadge size="md" />;
        }
    };

    // Mock services for this locksmith
    const services = [
        { name: 'Home Lockout', price_min: 75, price_max: 150 },
        { name: 'Lock Replacement', price_min: 100, price_max: 250 },
        { name: 'Lock Rekey', price_min: 50, price_max: 100 },
        { name: 'Key Duplication', price_min: 5, price_max: 25 },
    ];

    // Mock reviews
    const reviews = [
        { id: 1, rating: 5, title: 'Excellent service!', content: 'Arrived in 20 minutes and fixed my lock quickly. Very professional.', author: 'Sarah M.', date: '2 weeks ago' },
        { id: 2, rating: 5, title: 'Highly recommend', content: 'Great price and fast response. Will use again.', author: 'Michael T.', date: '1 month ago' },
        { id: 3, rating: 4, title: 'Good service', content: 'Got me back into my house when I was locked out. Friendly technician.', author: 'Jennifer L.', date: '1 month ago' },
    ];

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-4">
                {/* Back button */}
                <Link
                    href="/search"
                    className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to search
                </Link>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Header */}
                        <Card variant={isPremium ? 'premium' : 'default'} padding="lg">
                            <div className="flex flex-col sm:flex-row gap-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center shadow-xl shadow-purple-500/25">
                                        <span className="text-4xl font-bold text-white">
                                            {locksmith.business_name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-start gap-2 mb-2">
                                        <h1 className="text-2xl font-bold">{locksmith.business_name}</h1>
                                        {locksmith.is_verified && <VerifiedBadge size="md" />}
                                        {isPremium && <PremiumBadge size="md" />}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <AvailabilityBadgeComponent />
                                        <span className="text-[var(--foreground-secondary)] flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {locksmith.city}, {locksmith.province}
                                        </span>
                                        {locksmith.response_time_minutes && (
                                            <span className="text-[var(--foreground-secondary)] flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Est. {locksmith.response_time_minutes} min response
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={cn(
                                                        'w-5 h-5',
                                                        star <= Math.round(locksmith.avg_rating)
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-[var(--foreground-muted)]'
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-semibold">{formatRating(locksmith.avg_rating)}</span>
                                        <span className="text-[var(--foreground-secondary)]">
                                            ({locksmith.review_count} reviews)
                                        </span>
                                    </div>

                                    {/* Quick actions on mobile */}
                                    <div className="flex flex-wrap gap-2 sm:hidden">
                                        <a href={`tel:${locksmith.phone}`} className="flex-1">
                                            <Button variant="success" className="w-full" icon={<Phone className="w-4 h-4" />}>
                                                Call
                                            </Button>
                                        </a>
                                        <Button
                                            variant="primary"
                                            className="flex-1"
                                            icon={<MessageSquare className="w-4 h-4" />}
                                            onClick={() => setShowQuoteForm(true)}
                                        >
                                            Quote
                                        </Button>
                                    </div>
                                </div>

                                {/* Actions on desktop */}
                                <div className="hidden sm:flex flex-col gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={cn(
                                            'p-2 rounded-lg border transition-colors',
                                            isFavorite
                                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground-muted)] hover:text-red-400'
                                        )}
                                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
                                    </button>
                                    <button
                                        className="p-2 rounded-lg border bg-[var(--surface)] border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                                        title="Share"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </Card>

                        {/* About */}
                        <Card padding="lg">
                            <h2 className="text-lg font-semibold mb-4">About</h2>
                            <p className="text-[var(--foreground-secondary)] mb-4">
                                {locksmith.description}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {locksmith.years_in_business && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-600)]/10 flex items-center justify-center">
                                            <Award className="w-5 h-5 text-[var(--primary-400)]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{locksmith.years_in_business} Years</p>
                                            <p className="text-sm text-[var(--foreground-muted)]">In Business</p>
                                        </div>
                                    </div>
                                )}
                                {locksmith.is_verified && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--success)]/10 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-[var(--success)]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Verified</p>
                                            <p className="text-sm text-[var(--foreground-muted)]">License & Insurance</p>
                                        </div>
                                    </div>
                                )}
                                {locksmith.is_24_7 && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--secondary-600)]/10 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-[var(--secondary-400)]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">24/7</p>
                                            <p className="text-sm text-[var(--foreground-muted)]">Emergency Service</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Services & Pricing */}
                        <Card padding="lg">
                            <h2 className="text-lg font-semibold mb-4">Services & Pricing</h2>
                            <div className="space-y-3">
                                {services.map((service, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0 last:pb-0"
                                    >
                                        <span className="font-medium">{service.name}</span>
                                        <span className="text-[var(--foreground-secondary)]">
                                            {formatPriceRange(service.price_min, service.price_max)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-[var(--foreground-muted)] mt-4">
                                * Prices are estimates. Final pricing may vary based on job complexity.
                            </p>
                        </Card>

                        {/* Reviews */}
                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Reviews</h2>
                                <span className="text-[var(--foreground-secondary)]">
                                    {locksmith.review_count} reviews
                                </span>
                            </div>
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="pb-4 border-b border-[var(--border)] last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={cn(
                                                            'w-4 h-4',
                                                            star <= review.rating
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-[var(--foreground-muted)]'
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-medium text-sm">{review.title}</span>
                                        </div>
                                        <p className="text-[var(--foreground-secondary)] text-sm mb-2">
                                            {review.content}
                                        </p>
                                        <p className="text-xs text-[var(--foreground-muted)]">
                                            {review.author} • {review.date}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <Card variant="glow" padding="lg" className="sticky top-24">
                            <h3 className="text-lg font-semibold mb-4">Get Help Now</h3>

                            {!showQuoteForm ? (
                                <div className="space-y-3">
                                    <a href={`tel:${locksmith.phone}`} className="block">
                                        <Button variant="success" className="w-full" size="lg" icon={<Phone className="w-5 h-5" />}>
                                            Call {formatPhone(locksmith.phone)}
                                        </Button>
                                    </a>
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        size="lg"
                                        icon={<MessageSquare className="w-5 h-5" />}
                                        onClick={() => setShowQuoteForm(true)}
                                    >
                                        Request Quote
                                    </Button>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${locksmith.address}+${locksmith.city}+${locksmith.province}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button variant="secondary" className="w-full" icon={<Navigation className="w-4 h-4" />}>
                                            Get Directions
                                        </Button>
                                    </a>
                                </div>
                            ) : quoteSubmitted ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-[var(--success)]" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">Quote Requested!</h4>
                                    <p className="text-[var(--foreground-secondary)] text-sm mb-4">
                                        {locksmith.business_name} will contact you shortly.
                                    </p>
                                    <Button variant="secondary" onClick={() => {
                                        setShowQuoteForm(false);
                                        setQuoteSubmitted(false);
                                    }}>
                                        Done
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                                    <Input
                                        label="Your Name"
                                        placeholder="Full name"
                                        value={quoteName}
                                        onChange={(e) => setQuoteName(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        placeholder="+1 (416) 555-0123"
                                        type="tel"
                                        value={quotePhone}
                                        onChange={(e) => setQuotePhone(e.target.value)}
                                        required
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                                            Service Needed
                                        </label>
                                        <select
                                            value={quoteService}
                                            onChange={(e) => setQuoteService(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary-500)]"
                                            required
                                        >
                                            <option value="">Select a service</option>
                                            {services.map((s, i) => (
                                                <option key={i} value={s.name}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Textarea
                                        label="Describe Your Situation"
                                        placeholder="Tell us about your issue..."
                                        value={quoteDescription}
                                        onChange={(e) => setQuoteDescription(e.target.value)}
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full"
                                        loading={quoteSubmitting}
                                    >
                                        Send Quote Request
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setShowQuoteForm(false)}
                                        className="w-full text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}

                            {/* Contact Info */}
                            <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-3">
                                {locksmith.email && (
                                    <a
                                        href={`mailto:${locksmith.email}`}
                                        className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                                    >
                                        <Mail className="w-4 h-4" />
                                        {locksmith.email}
                                    </a>
                                )}
                                {locksmith.website && (
                                    <a
                                        href={locksmith.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                                    >
                                        <Globe className="w-4 h-4" />
                                        Visit Website
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                                <div className="flex items-start gap-3 text-sm text-[var(--foreground-secondary)]">
                                    <MapPin className="w-4 h-4 mt-0.5" />
                                    <span>
                                        {locksmith.address}<br />
                                        {locksmith.city}, {locksmith.province} {locksmith.postal_code}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
