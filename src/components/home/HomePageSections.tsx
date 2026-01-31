'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGeolocation } from '@/hooks';
import { Button, Input, Card } from '@/components/ui';
import {
    MapPin,
    Search,
    Crosshair,
    Key,
    Car,
    Home,
    Building2,
    Shield,
    Zap,
    Clock,
    Star,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const serviceTypes = [
    { id: 'home-lockout', label: 'Home Lockout', icon: Home, category: 'emergency' },
    { id: 'car-lockout', label: 'Car Lockout', icon: Car, category: 'emergency' },
    { id: 'lock-replacement', label: 'Lock Replacement', icon: Key, category: 'residential' },
    { id: 'commercial', label: 'Commercial', icon: Building2, category: 'commercial' },
];

export function HeroSection() {
    const router = useRouter();
    const { coordinates, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
    const [searchAddress, setSearchAddress] = useState('');
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        setIsSearching(true);
        // Build search URL with query params
        const params = new URLSearchParams();
        if (coordinates) {
            params.set('lat', coordinates.lat.toString());
            params.set('lng', coordinates.lng.toString());
        }
        if (selectedService) {
            params.set('service', selectedService);
        }
        router.push(`/search?${params.toString()}`);
    };

    const handleUseLocation = () => {
        requestLocation();
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid opacity-50" />
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary-600)] rounded-full blur-[150px] opacity-20" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--secondary-600)] rounded-full blur-[150px] opacity-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--neon-cyan)] rounded-full blur-[200px] opacity-5" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] mb-6">
                        <Zap className="w-4 h-4 text-[var(--neon-cyan)]" />
                        <span className="text-sm font-medium text-[var(--foreground-secondary)]">
                            Trusted by 50,000+ Canadians
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        Find a Locksmith{' '}
                        <span className="gradient-text">Available Now</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-[var(--foreground-secondary)] mb-10 max-w-2xl mx-auto">
                        Connect with verified local locksmiths in seconds.
                        Real-time availability, transparent pricing, instant contact.
                    </p>

                    {/* Search Card */}
                    <Card variant="glass" padding="lg" className="max-w-2xl mx-auto mb-8">
                        <div className="space-y-4">
                            {/* Location Input */}
                            <div className="relative">
                                <Input
                                    placeholder={coordinates ? 'Using your current location' : 'Enter your address or postal code'}
                                    value={searchAddress}
                                    onChange={(e) => setSearchAddress(e.target.value)}
                                    icon={<MapPin className="w-5 h-5" />}
                                    className={cn(coordinates && 'border-[var(--success)]')}
                                />
                                <button
                                    onClick={handleUseLocation}
                                    disabled={geoLoading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[var(--surface)] text-[var(--foreground-muted)] hover:text-[var(--primary-400)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50"
                                    title="Use my location"
                                >
                                    <Crosshair className={cn('w-4 h-4', geoLoading && 'animate-pulse')} />
                                </button>
                            </div>

                            {geoError && (
                                <p className="text-sm text-[var(--warning)] text-left">{geoError}</p>
                            )}

                            {coordinates && (
                                <p className="text-sm text-[var(--success)] text-left flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                                    Location detected
                                </p>
                            )}

                            {/* Service Type Selection */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {serviceTypes.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                                        className={cn(
                                            'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                                            selectedService === service.id
                                                ? 'bg-[var(--primary-600)]/20 border-[var(--primary-500)] text-[var(--primary-400)]'
                                                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border-hover)]'
                                        )}
                                    >
                                        <service.icon className="w-5 h-5" />
                                        <span className="text-xs font-medium">{service.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Search Button */}
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                                onClick={handleSearch}
                                loading={isSearching}
                                icon={<Search className="w-5 h-5" />}
                            >
                                Find Available Locksmiths
                            </Button>
                        </div>
                    </Card>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-[var(--foreground-muted)]">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[var(--success)]" />
                            <span>Verified Professionals</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[var(--primary-400)]" />
                            <span>Average 15 min response</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>4.8★ average rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function FeaturesSection() {
    const features = [
        {
            icon: MapPin,
            title: 'Location-Based Search',
            description: 'Find the nearest available locksmiths sorted by distance. Real-time availability status shows who can help right now.',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Shield,
            title: 'Verified Professionals',
            description: 'Every locksmith is vetted with license verification, insurance checks, and background screening.',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: Clock,
            title: 'Instant Contact',
            description: 'Call, message, or request a quote directly. No middlemen, no delays—connect in seconds.',
            gradient: 'from-orange-500 to-red-500',
        },
        {
            icon: Star,
            title: 'Transparent Reviews',
            description: 'Read verified customer reviews. Make informed decisions based on real experiences.',
            gradient: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <section className="py-20 md:py-32 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Choose <span className="gradient-text">LocksmithNow</span>
                    </h2>
                    <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
                        We&apos;ve reimagined how Canadians find locksmith services. Speed, trust, and transparency at every step.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} variant="default" hoverable className="group">
                            <div className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                                'bg-gradient-to-br',
                                feature.gradient,
                                'shadow-lg'
                            )}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--primary-400)] transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-[var(--foreground-secondary)]">
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function HowItWorksSection() {
    const steps = [
        {
            number: '01',
            title: 'Share Your Location',
            description: 'Allow location access or enter your address. We instantly find locksmiths near you.',
        },
        {
            number: '02',
            title: 'Choose Your Locksmith',
            description: 'Browse available professionals, compare ratings, prices, and estimated arrival times.',
        },
        {
            number: '03',
            title: 'Get Help Fast',
            description: 'Contact directly via call, message, or quote request. Problem solved.',
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-[var(--background-secondary)] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-600)] rounded-full blur-[200px] opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
                        From locked out to back inside in three simple steps
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="text-6xl font-bold gradient-text opacity-20 mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-[var(--foreground-secondary)]">{step.description}</p>

                                {index < steps.length - 1 && (
                                    <ChevronRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-[var(--foreground-muted)]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function CTASection() {
    const router = useRouter();

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-900)] to-[var(--secondary-900)]" />
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--neon-cyan)] rounded-full blur-[200px] opacity-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--neon-purple)] rounded-full blur-[200px] opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Ready to Find Your Locksmith?
                    </h2>
                    <p className="text-lg text-[var(--foreground-secondary)] mb-8">
                        Join thousands of Canadians who trust LocksmithNow for fast, reliable locksmith services.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/search">
                            <Button variant="primary" size="lg" icon={<Search className="w-5 h-5" />}>
                                Find a Locksmith Now
                            </Button>
                        </Link>
                        <Link href="/for-locksmiths">
                            <Button variant="neon" size="lg">
                                I&apos;m a Locksmith
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
