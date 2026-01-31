import React from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import {
    Users,
    TrendingUp,
    MapPin,
    Calendar,
    BarChart3,
    Shield,
    Star,
    Zap,
    CheckCircle,
    ArrowRight,
    Phone,
} from 'lucide-react';

export default function ForLocksmithsPage() {
    const benefits = [
        {
            icon: Users,
            title: 'Reach More Customers',
            description: 'Connect with thousands of Canadians searching for locksmith services in your area.',
        },
        {
            icon: MapPin,
            title: 'Location-Based Leads',
            description: 'Only receive leads from customers actually near you. No wasted time on distant requests.',
        },
        {
            icon: Calendar,
            title: 'Control Your Availability',
            description: 'Toggle your status in real-time. Only appear in searches when you can take jobs.',
        },
        {
            icon: BarChart3,
            title: 'Track Your Performance',
            description: 'See how many views, calls, and quote requests you receive. Optimize your profile.',
        },
        {
            icon: Shield,
            title: 'Build Trust',
            description: 'Get a verified badge to stand out. Show customers you are licensed and insured.',
        },
        {
            icon: Star,
            title: 'Collect Reviews',
            description: 'Let satisfied customers share their experience. Build your reputation online.',
        },
    ];

    const pricingPlans = [
        {
            name: 'Basic',
            price: 'Free',
            period: 'forever',
            description: 'Get started and claim your listing',
            features: [
                'Business profile page',
                'Appear in search results',
                'Receive quote requests',
                'Basic analytics',
            ],
            cta: 'Get Started Free',
            popular: false,
        },
        {
            name: 'Premium',
            price: '$99',
            period: '/month',
            description: 'Boost your visibility and leads',
            features: [
                'Everything in Basic',
                'Priority in search results',
                'Featured badge on profile',
                'Peak hours visibility boost',
                'Detailed analytics dashboard',
                'Priority support',
            ],
            cta: 'Start 14-Day Free Trial',
            popular: true,
        },
        {
            name: 'Platinum',
            price: '$199',
            period: '/month',
            description: 'Maximum exposure for growing businesses',
            features: [
                'Everything in Premium',
                'Top placement in results',
                'Multi-area targeting',
                'Lead priority during high demand',
                'Dedicated account manager',
                'Custom promotional content',
            ],
            cta: 'Contact Sales',
            popular: false,
        },
    ];

    const stats = [
        { value: '50,000+', label: 'Monthly Searches' },
        { value: '85%', label: 'Lead Response Rate' },
        { value: '4.8★', label: 'Average Rating' },
        { value: '15 min', label: 'Avg Response Time' },
    ];

    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary-600)] rounded-full blur-[150px] opacity-20" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-cyan)] rounded-full blur-[150px] opacity-10" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.3)] mb-6">
                            <Zap className="w-4 h-4 text-[var(--neon-cyan)]" />
                            <span className="text-sm font-medium text-[var(--neon-cyan)]">
                                Join 500+ Canadian Locksmiths
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                            Grow Your Locksmith Business{' '}
                            <span className="gradient-text-neon">Online</span>
                        </h1>

                        <p className="text-lg md:text-xl text-[var(--foreground-secondary)] mb-10 max-w-2xl mx-auto">
                            Stop wasting money on ads. Get found by customers who need you right now,
                            right in your service area.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/signup">
                                <Button variant="neon" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                                    Join Free Today
                                </Button>
                            </Link>
                            <Button variant="secondary" size="lg" icon={<Phone className="w-5 h-5" />}>
                                Talk to Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-y border-[var(--border)] bg-[var(--background-secondary)]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-[var(--foreground-secondary)]">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Top Locksmiths Choose <span className="gradient-text">LocksmithNow</span>
                        </h2>
                        <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
                            Everything you need to attract customers, manage leads, and grow your business.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <Card key={index} variant="default" hoverable>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                                    <benefit.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                                <p className="text-[var(--foreground-secondary)]">{benefit.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-20 md:py-32 bg-[var(--background-secondary)]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Simple, Transparent <span className="gradient-text">Pricing</span>
                        </h2>
                        <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
                            Start free. Upgrade when you&apos;re ready to grow faster.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <Card
                                key={index}
                                variant={plan.popular ? 'premium' : 'default'}
                                padding="lg"
                                className={plan.popular ? 'relative md:-mt-4 md:mb-4' : ''}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[var(--primary-600)] to-[var(--secondary-600)] text-white shadow-lg">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-[var(--foreground-secondary)]">{plan.period}</span>
                                    </div>
                                    <p className="text-sm text-[var(--foreground-secondary)] mt-2">
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={plan.popular ? 'primary' : 'secondary'}
                                    className="w-full"
                                >
                                    {plan.cta}
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-900)] to-[var(--secondary-900)]" />
                <div className="absolute inset-0 bg-grid opacity-30" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Ready to Get More Customers?
                        </h2>
                        <p className="text-lg text-[var(--foreground-secondary)] mb-8">
                            Join LocksmithNow today. It takes less than 5 minutes to create your profile.
                        </p>
                        <Link href="/auth/signup">
                            <Button variant="neon" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                                Create Your Free Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
