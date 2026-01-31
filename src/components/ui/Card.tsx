'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'glow' | 'premium';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', padding = 'md', hoverable = false, children, ...props }, ref) => {
        const variants = {
            default: 'bg-[var(--surface)] border border-[var(--border)]',
            glass: 'bg-[rgba(30,30,46,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)]',
            glow: 'bg-[var(--surface)] border border-[var(--border)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
            premium: `
        bg-gradient-to-br from-[var(--surface)] to-[rgba(139,92,246,0.1)]
        border border-[rgba(139,92,246,0.3)]
        shadow-[0_0_20px_rgba(139,92,246,0.15)]
      `,
        };

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-5',
            lg: 'p-6',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl transition-all duration-200',
                    variants[variant],
                    paddings[padding],
                    hoverable && 'hover:border-[var(--border-hover)] hover:-translate-y-1 cursor-pointer',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-1.5 mb-4', className)}
            {...props}
        />
    )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-xl font-bold text-[var(--foreground)]', className)}
            {...props}
        />
    )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-[var(--foreground-secondary)]', className)}
            {...props}
        />
    )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('', className)} {...props} />
    )
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center pt-4 mt-4 border-t border-[var(--border)]', className)}
            {...props}
        />
    )
);

CardFooter.displayName = 'CardFooter';
