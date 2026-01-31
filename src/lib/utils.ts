import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format distance in kilometers
 */
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

/**
 * Format price range for display
 */
export function formatPriceRange(min?: number, max?: number): string {
    if (!min && !max) return 'Call for quote';
    if (min && max && min === max) return `$${min}`;
    if (min && max) return `$${min} - $${max}`;
    if (min) return `From $${min}`;
    return `Up to $${max}`;
}

/**
 * Format rating for display
 */
export function formatRating(rating: number): string {
    return rating.toFixed(1);
}

/**
 * Get availability status label
 */
export function getAvailabilityLabel(status: string): string {
    switch (status) {
        case 'available':
            return 'Available Now';
        case 'busy':
            return 'Busy';
        case 'offline':
            return 'Offline';
        default:
            return status;
    }
}

/**
 * Calculate estimated response time label
 */
export function getResponseTimeLabel(minutes?: number): string {
    if (!minutes) return 'Response time varies';
    if (minutes <= 15) return 'Est. 15 min';
    if (minutes <= 30) return 'Est. 30 min';
    if (minutes <= 60) return 'Est. 1 hour';
    return 'Est. 1+ hours';
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Generate unique reference number
 */
export function generateReferenceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `LN-${year}-${month}${day}-${random}`;
}
