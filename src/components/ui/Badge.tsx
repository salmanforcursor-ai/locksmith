'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export type BadgeVariant = 'default' | 'available' | 'busy' | 'offline' | 'verified' | 'premium' | 'success' | 'warning' | 'error';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
    pulse?: boolean;
    icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'sm', pulse = false, icon, children, ...props }, ref) => {
        const variants = {
            default: 'bg-[var(--surface)] text-[var(--foreground-secondary)] border-[var(--border)]',
            available: 'bg-[rgba(16,185,129,0.15)] text-[var(--success)] border-[rgba(16,185,129,0.3)]',
            busy: 'bg-[rgba(245,158,11,0.15)] text-[var(--warning)] border-[rgba(245,158,11,0.3)]',
            offline: 'bg-[rgba(100,116,139,0.15)] text-[var(--foreground-muted)] border-[rgba(100,116,139,0.3)]',
            verified: 'bg-[rgba(139,92,246,0.15)] text-[var(--primary-400)] border-[rgba(139,92,246,0.3)]',
            premium: 'bg-gradient-to-r from-[rgba(139,92,246,0.2)] to-[rgba(59,130,246,0.2)] text-[var(--neon-cyan)] border-[rgba(0,245,255,0.3)]',
            success: 'bg-[rgba(16,185,129,0.15)] text-[var(--success)] border-[rgba(16,185,129,0.3)]',
            warning: 'bg-[rgba(245,158,11,0.15)] text-[var(--warning)] border-[rgba(245,158,11,0.3)]',
            error: 'bg-[rgba(239,68,68,0.15)] text-[var(--error)] border-[rgba(239,68,68,0.3)]',
        };

        const sizes = {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-3 py-1 text-sm',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-1 font-semibold rounded-full border uppercase tracking-wide',
                    variants[variant],
                    sizes[size],
                    pulse && variant === 'available' && 'animate-pulse',
                    className
                )}
                {...props}
            >
                {icon}
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

// Predefined badges for common use cases
export const AvailableBadge = ({ className, ...props }: Omit<BadgeProps, 'variant'>) => (
    <Badge
        variant="available"
        className={className}
        pulse
        {...props}
    >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        Available Now
    </Badge>
);

export const BusyBadge = ({ className, until, ...props }: Omit<BadgeProps, 'variant'> & { until?: string }) => (
    <Badge variant="busy" className={className} {...props}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        Busy{until ? ` until ${until}` : ''}
    </Badge>
);

export const OfflineBadge = ({ className, ...props }: Omit<BadgeProps, 'variant'>) => (
    <Badge variant="offline" className={className} {...props}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        Offline
    </Badge>
);

export const VerifiedBadge = ({ className, ...props }: Omit<BadgeProps, 'variant'>) => (
    <Badge
        variant="verified"
        className={className}
        icon={<CheckCircle className="w-3 h-3" />}
        {...props}
    >
        Verified
    </Badge>
);

export const PremiumBadge = ({ className, ...props }: Omit<BadgeProps, 'variant'>) => (
    <Badge variant="premium" className={className} {...props}>
        ★ Premium
    </Badge>
);
