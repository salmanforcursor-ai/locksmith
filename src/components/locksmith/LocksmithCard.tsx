'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button, AvailableBadge, BusyBadge, OfflineBadge, VerifiedBadge, PremiumBadge } from '@/components/ui';
import { Phone, MessageSquare, MapPin, Star, Clock, ChevronRight } from 'lucide-react';
import { cn, formatDistance, formatRating } from '@/lib/utils';
import type { LocksmithWithDistance, AvailabilityStatus } from '@/types/database.types';

interface LocksmithCardProps {
    locksmith: LocksmithWithDistance;
    variant?: 'default' | 'compact';
}

export function LocksmithCard({ locksmith, variant = 'default' }: LocksmithCardProps) {
    const {
        id,
        business_name,
        distance_km,
        availability_status,
        avg_rating,
        review_count,
        is_verified,
        featured_tier,
        phone,
        response_time_minutes,
        city,
        province,
    } = locksmith;

    const isPremium = featured_tier === 'premium' || featured_tier === 'platinum';

    const AvailabilityBadgeComponent = () => {
        switch (availability_status) {
            case 'available':
                return <AvailableBadge />;
            case 'busy':
                return <BusyBadge />;
            default:
                return <OfflineBadge />;
        }
    };

    if (variant === 'compact') {
        return (
            <Link href={`/locksmiths/${id}`}>
                <Card
                    variant={isPremium ? 'premium' : 'default'}
                    hoverable
                    className="group"
                >
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">
                                {business_name.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold truncate">{business_name}</h3>
                                {is_verified && <VerifiedBadge />}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)]">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {formatDistance(distance_km)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    {formatRating(avg_rating)}
                                </span>
                            </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--primary-400)] transition-colors" />
                    </div>
                </Card>
            </Link>
        );
    }

    return (
        <Card
            variant={isPremium ? 'premium' : 'default'}
            padding="lg"
            className="relative overflow-hidden"
        >
            {/* Premium indicator */}
            {isPremium && (
                <div className="absolute top-4 right-4">
                    <PremiumBadge />
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <span className="text-2xl sm:text-3xl font-bold text-white">
                            {business_name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                        <Link href={`/locksmiths/${id}`} className="hover:text-[var(--primary-400)] transition-colors">
                            <h3 className="text-lg font-bold">{business_name}</h3>
                        </Link>
                        {is_verified && <VerifiedBadge size="md" />}
                    </div>

                    {/* Availability & Location */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <AvailabilityBadgeComponent />
                        <span className="text-sm text-[var(--foreground-secondary)] flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {formatDistance(distance_km)} • {city}, {province}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            'w-4 h-4',
                                            star <= Math.round(avg_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--foreground-muted)]'
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium">{formatRating(avg_rating)}</span>
                            <span className="text-sm text-[var(--foreground-muted)]">({review_count})</span>
                        </div>

                        {response_time_minutes && (
                            <span className="text-sm text-[var(--foreground-secondary)] flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Est. {response_time_minutes} min
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                        <a href={`tel:${phone}`}>
                            <Button
                                variant="success"
                                size="sm"
                                icon={<Phone className="w-4 h-4" />}
                            >
                                Call Now
                            </Button>
                        </a>
                        <Link href={`/locksmiths/${id}?action=quote`}>
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={<MessageSquare className="w-4 h-4" />}
                            >
                                Request Quote
                            </Button>
                        </Link>
                        <Link href={`/locksmiths/${id}`}>
                            <Button variant="ghost" size="sm">
                                View Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Loading skeleton for LocksmithCard
export function LocksmithCardSkeleton() {
    return (
        <Card padding="lg">
            <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl skeleton" />
                <div className="flex-1 space-y-3">
                    <div className="h-6 w-48 skeleton" />
                    <div className="h-4 w-32 skeleton" />
                    <div className="h-4 w-64 skeleton" />
                    <div className="flex gap-2">
                        <div className="h-9 w-24 skeleton" />
                        <div className="h-9 w-32 skeleton" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
