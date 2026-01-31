'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'neon' | 'success' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            loading = false,
            disabled,
            icon,
            iconPosition = 'left',
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-xl
      transition-all duration-200 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-[var(--background)]
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-[var(--primary-600)] to-[var(--secondary-600)]
        text-white shadow-lg shadow-purple-500/25
        hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5
        active:translate-y-0
      `,
            secondary: `
        bg-[var(--surface)] text-[var(--foreground)]
        border border-[var(--border)]
        hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)]
      `,
            neon: `
        bg-transparent text-[var(--neon-cyan)]
        border border-[var(--neon-cyan)]
        shadow-[0_0_10px_rgba(0,245,255,0.3)]
        hover:bg-[rgba(0,245,255,0.1)] hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]
      `,
            success: `
        bg-[var(--success)] text-white
        shadow-lg shadow-emerald-500/25
        hover:shadow-xl hover:shadow-emerald-500/40
      `,
            ghost: `
        bg-transparent text-[var(--foreground-secondary)]
        hover:bg-[var(--surface)] hover:text-[var(--foreground)]
      `,
            danger: `
        bg-[var(--error)] text-white
        shadow-lg shadow-red-500/25
        hover:shadow-xl hover:shadow-red-500/40
      `,
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-6 py-3 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {!loading && icon && iconPosition === 'left' && icon}
                {children}
                {!loading && icon && iconPosition === 'right' && icon}
            </button>
        );
    }
);

Button.displayName = 'Button';
