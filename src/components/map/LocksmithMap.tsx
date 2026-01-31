'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const AvailableIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const BusyIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const OfflineIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocksmithMarker {
    id: string;
    business_name: string;
    location: { lat: number; lng: number };
    availability_status: 'available' | 'busy' | 'offline';
    phone?: string;
    avg_rating?: number;
    distance_km?: number;
}

interface LocksmithMapProps {
    locksmiths: LocksmithMarker[];
    center: [number, number];
    zoom?: number;
    className?: string;
    onMarkerClick?: (locksmithId: string) => void;
}

export function LocksmithMap({
    locksmiths,
    center,
    zoom = 12,
    className = 'h-[500px] w-full rounded-xl',
    onMarkerClick,
}: LocksmithMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !mapRef.current) return;

        // Initialize map only once
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);
        }

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Add markers for each locksmith
        locksmiths.forEach((locksmith) => {
            if (!locksmith.location?.lat || !locksmith.location?.lng) return;

            const icon =
                locksmith.availability_status === 'available'
                    ? AvailableIcon
                    : locksmith.availability_status === 'busy'
                    ? BusyIcon
                    : OfflineIcon;

            const marker = L.marker([locksmith.location.lat, locksmith.location.lng], { icon })
                .addTo(mapInstanceRef.current!);

            // Create popup content
            const statusColor =
                locksmith.availability_status === 'available'
                    ? '#22c55e'
                    : locksmith.availability_status === 'busy'
                    ? '#f97316'
                    : '#6b7280';

            const statusLabel =
                locksmith.availability_status === 'available'
                    ? 'Available Now'
                    : locksmith.availability_status === 'busy'
                    ? 'Busy'
                    : 'Offline';

            const popupContent = `
                <div style="min-width: 200px; font-family: system-ui, sans-serif;">
                    <h3 style="font-weight: 600; font-size: 14px; margin: 0 0 8px 0; color: #1f2937;">
                        ${locksmith.business_name}
                    </h3>
                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${statusColor};"></span>
                        <span style="font-size: 12px; color: ${statusColor}; font-weight: 500;">
                            ${statusLabel}
                        </span>
                    </div>
                    ${locksmith.avg_rating ? `
                        <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                            ⭐ ${locksmith.avg_rating.toFixed(1)} rating
                        </div>
                    ` : ''}
                    ${locksmith.distance_km ? `
                        <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                            📍 ${locksmith.distance_km.toFixed(1)} km away
                        </div>
                    ` : ''}
                    ${locksmith.phone ? `
                        <a href="tel:${locksmith.phone}" 
                           style="display: inline-block; padding: 6px 12px; background: #8b5cf6; color: white; 
                                  text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                            📞 Call Now
                        </a>
                    ` : ''}
                    <a href="/locksmiths/${locksmith.id}" 
                       style="display: inline-block; margin-left: 8px; padding: 6px 12px; background: #f3f4f6; 
                              color: #374151; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                        View Profile
                    </a>
                </div>
            `;

            marker.bindPopup(popupContent);

            if (onMarkerClick) {
                marker.on('click', () => onMarkerClick(locksmith.id));
            }

            markersRef.current.push(marker);
        });

        // Update map view
        mapInstanceRef.current.setView(center, zoom);

        // Fit bounds if there are markers
        if (markersRef.current.length > 0) {
            const group = L.featureGroup(markersRef.current);
            mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }

        // Cleanup
        return () => {
            // Don't destroy the map on every render, just clear markers
        };
    }, [isClient, locksmiths, center, zoom, onMarkerClick]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    if (!isClient) {
        return (
            <div className={`${className} bg-[var(--surface)] animate-pulse flex items-center justify-center`}>
                <span className="text-[var(--foreground-muted)]">Loading map...</span>
            </div>
        );
    }

    return <div ref={mapRef} className={className} />;
}

export default LocksmithMap;
