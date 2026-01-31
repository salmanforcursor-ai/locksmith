'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    className?: string;
    variant?: 'default' | 'navbar' | 'floating';
}

// Custom hook that's safe for SSR
function useThemeSafe() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Get saved theme or default to dark
        const savedTheme = localStorage.getItem('locksmithnow-theme') as 'dark' | 'light';
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('locksmithnow-theme', newTheme);
    };

    return { theme, toggleTheme, mounted };
}

export function ThemeToggle({ className, variant = 'default' }: ThemeToggleProps) {
    const { theme, toggleTheme, mounted } = useThemeSafe();
    const isDark = theme === 'dark';

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className={cn(
                'p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]',
                className
            )}>
                <div className="w-5 h-5" />
            </div>
        );
    }

    if (variant === 'navbar') {
        return (
            <button
                onClick={toggleTheme}
                className={cn(
                    'relative group p-2.5 rounded-xl transition-all duration-500 ease-out',
                    'bg-gradient-to-br hover:scale-105 active:scale-95',
                    isDark
                        ? 'from-[#1e1e2e] to-[#2d2d44] hover:from-[#2d2d44] hover:to-[#3d3d54]'
                        : 'from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200',
                    'border border-[var(--border)] hover:border-[var(--border-hover)]',
                    'shadow-lg hover:shadow-xl',
                    isDark ? 'shadow-purple-500/10' : 'shadow-amber-500/20',
                    className
                )}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {/* Glow effect */}
                <div className={cn(
                    'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md',
                    isDark ? 'bg-purple-500/20' : 'bg-amber-400/30'
                )} />

                {/* Icon container */}
                <div className="relative w-5 h-5">
                    {/* Sun icon */}
                    <Sun className={cn(
                        'absolute inset-0 w-5 h-5 transition-all duration-500',
                        isDark
                            ? 'opacity-0 rotate-90 scale-0 text-amber-400'
                            : 'opacity-100 rotate-0 scale-100 text-amber-500'
                    )} />

                    {/* Moon icon */}
                    <Moon className={cn(
                        'absolute inset-0 w-5 h-5 transition-all duration-500',
                        isDark
                            ? 'opacity-100 rotate-0 scale-100 text-purple-300'
                            : 'opacity-0 -rotate-90 scale-0 text-purple-500'
                    )} />
                </div>

                {/* Sparkle decorations */}
                <Sparkles className={cn(
                    'absolute -top-1 -right-1 w-3 h-3 transition-all duration-300',
                    'group-hover:scale-125',
                    isDark ? 'text-cyan-400 opacity-50' : 'text-amber-400 opacity-70'
                )} />
            </button>
        );
    }

    if (variant === 'floating') {
        return (
            <button
                onClick={toggleTheme}
                className={cn(
                    'fixed bottom-6 right-6 z-50',
                    'p-4 rounded-2xl transition-all duration-500 ease-out',
                    'bg-gradient-to-br hover:scale-110 active:scale-95',
                    isDark
                        ? 'from-[#1e1e2e] to-[#2d2d44] hover:from-purple-900/50 hover:to-violet-900/50'
                        : 'from-white to-amber-50 hover:from-amber-50 hover:to-orange-50',
                    'border-2',
                    isDark ? 'border-purple-500/30' : 'border-amber-300',
                    'shadow-2xl',
                    isDark ? 'shadow-purple-500/25' : 'shadow-amber-500/25',
                    className
                )}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {/* Animated ring */}
                <div className={cn(
                    'absolute inset-0 rounded-2xl animate-pulse',
                    isDark ? 'bg-purple-500/10' : 'bg-amber-400/10'
                )} />

                <div className="relative w-6 h-6">
                    <Sun className={cn(
                        'absolute inset-0 w-6 h-6 transition-all duration-500',
                        isDark
                            ? 'opacity-0 rotate-180 scale-0 text-amber-400'
                            : 'opacity-100 rotate-0 scale-100 text-amber-500'
                    )} />
                    <Moon className={cn(
                        'absolute inset-0 w-6 h-6 transition-all duration-500',
                        isDark
                            ? 'opacity-100 rotate-0 scale-100 text-purple-300'
                            : 'opacity-0 rotate-180 scale-0 text-purple-500'
                    )} />
                </div>
            </button>
        );
    }

    // Default variant
    return (
        <button
            onClick={toggleTheme}
            className={cn(
                'relative p-2 rounded-lg transition-all duration-300',
                'bg-[var(--surface)] hover:bg-[var(--surface-hover)]',
                'border border-[var(--border)]',
                className
            )}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <div className="relative w-5 h-5">
                <Sun className={cn(
                    'absolute inset-0 w-5 h-5 transition-all duration-300',
                    isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100 text-amber-500'
                )} />
                <Moon className={cn(
                    'absolute inset-0 w-5 h-5 transition-all duration-300',
                    isDark ? 'opacity-100 scale-100 text-purple-300' : 'opacity-0 scale-0'
                )} />
            </div>
        </button>
    );
}
