'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, icon, iconPosition = 'left', id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && iconPosition === 'left' && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            `w-full px-4 py-3 rounded-xl
              bg-[var(--background-secondary)]
              border border-[var(--border)]
              text-[var(--foreground)]
              placeholder:text-[var(--foreground-muted)]
              transition-all duration-200
              focus:outline-none focus:border-[var(--primary-500)]
              focus:ring-2 focus:ring-[var(--primary-500)]/20
              disabled:opacity-50 disabled:cursor-not-allowed`,
                            icon && iconPosition === 'left' && 'pl-10',
                            icon && iconPosition === 'right' && 'pr-10',
                            error && 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20',
                            className
                        )}
                        {...props}
                    />
                    {icon && iconPosition === 'right' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                            {icon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
                )}
                {hint && !error && (
                    <p className="mt-1.5 text-sm text-[var(--foreground-muted)]">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        `w-full px-4 py-3 rounded-xl min-h-[120px]
            bg-[var(--background-secondary)]
            border border-[var(--border)]
            text-[var(--foreground)]
            placeholder:text-[var(--foreground-muted)]
            transition-all duration-200 resize-y
            focus:outline-none focus:border-[var(--primary-500)]
            focus:ring-2 focus:ring-[var(--primary-500)]/20
            disabled:opacity-50 disabled:cursor-not-allowed`,
                        error && 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
                )}
                {hint && !error && (
                    <p className="mt-1.5 text-sm text-[var(--foreground-muted)]">{hint}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
