'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, Button, Input, Badge } from '@/components/ui';
import { LocksmithCard, LocksmithCardSkeleton } from '@/components/locksmith';
import { getNearestLocksmiths } from '@/lib/mock-data';
import type { LocksmithWithDistance } from '@/types/database.types';
import {
    MapPin,
    Filter,
    List,
    Map as MapIcon,
    SlidersHorizontal,
    CheckCircle,
    X,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamic import for map (avoid SSR issues with Leaflet)
const LocksmithMap = dynamic(
    () => import('@/components/map/LocksmithMap').then(mod => mod.LocksmithMap),
    { 
        ssr: false,
        loading: () => (
            <div className="h-[500px] w-full rounded-xl bg-[var(--surface)] animate-pulse flex items-center justify-center">
                <span className="text-[var(--foreground-muted)]">Loading map...</span>
            </div>
        )
    }
);

const serviceFilters = [
    { id: 'all', label: 'All Services' },
    { id: 'home-lockout', label: 'Home Lockout' },
    { id: 'car-lockout', label: 'Car Lockout' },
    { id: 'lock-replacement', label: 'Lock Replacement' },
    { id: 'commercial', label: 'Commercial' },
];

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [locksmiths, setLocksmiths] = useState<LocksmithWithDistance[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [availableOnly, setAvailableOnly] = useState(true);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [selectedService, setSelectedService] = useState('all');
    const [radiusKm, setRadiusKm] = useState(25);

    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 43.6532;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : -79.3832;
    const serviceParam = searchParams.get('service');

    useEffect(() => {
        if (serviceParam) {
            setSelectedService(serviceParam);
        }
    }, [serviceParam]);

    useEffect(() => {
        setLoading(true);
        // Simulate API call delay
        const timer = setTimeout(() => {
            const results = getNearestLocksmiths(lat, lng, {
                available_only: availableOnly,
                verified_only: verifiedOnly,
                service: selectedService !== 'all' ? selectedService : undefined,
            });
            setLocksmiths(results);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [lat, lng, availableOnly, verifiedOnly, selectedService]);

    const availableCount = locksmiths.filter(l => l.availability_status === 'available').length;

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        Locksmiths Near You
                    </h1>
                    <p className="text-[var(--foreground-secondary)] flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Showing results within {radiusKm}km
                        {availableCount > 0 && (
                            <Badge variant="available" size="sm">
                                {availableCount} available now
                            </Badge>
                        )}
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2 flex-1">
                        <button
                            onClick={() => setAvailableOnly(!availableOnly)}
                            className={cn(
                                'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                                availableOnly
                                    ? 'bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]'
                                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border-hover)]'
                            )}
                        >
                            {availableOnly && <CheckCircle className="w-4 h-4" />}
                            Available Now
                        </button>
                        <button
                            onClick={() => setVerifiedOnly(!verifiedOnly)}
                            className={cn(
                                'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                                verifiedOnly
                                    ? 'bg-[var(--primary-600)]/10 border-[var(--primary-500)]/30 text-[var(--primary-400)]'
                                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border-hover)]'
                            )}
                        >
                            {verifiedOnly && <CheckCircle className="w-4 h-4" />}
                            Verified Only
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                                'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border-hover)]'
                            )}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            More Filters
                            <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
                        </button>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-[var(--surface)] rounded-lg p-1 border border-[var(--border)]">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2 rounded-md transition-colors',
                                viewMode === 'list'
                                    ? 'bg-[var(--primary-600)] text-white'
                                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                            )}
                            title="List view"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={cn(
                                'p-2 rounded-md transition-colors',
                                viewMode === 'map'
                                    ? 'bg-[var(--primary-600)] text-white'
                                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                            )}
                            title="Map view"
                        >
                            <MapIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <Card className="mb-6" padding="md">
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Service Type */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                                    Service Type
                                </label>
                                <select
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary-500)]"
                                >
                                    {serviceFilters.map((filter) => (
                                        <option key={filter.id} value={filter.id}>
                                            {filter.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Distance */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                                    Distance: {radiusKm}km
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    step="5"
                                    value={radiusKm}
                                    onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                                    className="w-full accent-[var(--primary-500)]"
                                />
                            </div>
                        </div>
                    </Card>
                )}

                {/* Results */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <LocksmithCardSkeleton key={i} />
                        ))}
                    </div>
                ) : locksmiths.length === 0 ? (
                    <Card className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-[var(--foreground-muted)]" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No locksmiths found</h3>
                        <p className="text-[var(--foreground-secondary)] mb-4">
                            Try adjusting your filters or expanding your search radius.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setAvailableOnly(false);
                                setVerifiedOnly(false);
                                setRadiusKm(50);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Card>
                ) : viewMode === 'map' ? (
                    <div className="space-y-4">
                        <LocksmithMap
                            locksmiths={locksmiths.map(l => ({
                                id: l.id,
                                business_name: l.business_name,
                                location: l.location,
                                availability_status: l.availability_status,
                                phone: l.phone,
                                avg_rating: l.avg_rating,
                                distance_km: l.distance_km,
                            }))}
                            center={[lat, lng]}
                            zoom={12}
                            onMarkerClick={(id) => router.push(`/locksmiths/${id}`)}
                        />
                        <p className="text-center text-sm text-[var(--foreground-muted)]">
                            Click on a marker to view locksmith details
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {locksmiths.map((locksmith) => (
                            <LocksmithCard key={locksmith.id} locksmith={locksmith} />
                        ))}
                    </div>
                )}

                {/* Results count */}
                {!loading && locksmiths.length > 0 && (
                    <p className="text-center text-sm text-[var(--foreground-muted)] mt-8">
                        Showing {locksmiths.length} locksmith{locksmiths.length !== 1 ? 's' : ''} near you
                    </p>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-20 pb-12">
                <div className="container mx-auto px-4">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <LocksmithCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <SearchResultsContent />
        </Suspense>
    );
}
