'use client';

import React, { useState, useEffect } from 'react';

interface Coordinates {
    lat: number;
    lng: number;
}

interface GeolocationState {
    coordinates: Coordinates | null;
    loading: boolean;
    error: string | null;
}

interface UseGeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
    const [state, setState] = useState<GeolocationState>({
        coordinates: null,
        loading: false,
        error: null,
    });

    const { enableHighAccuracy = true, timeout = 10000, maximumAge = 60000 } = options;

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setState({
                coordinates: null,
                loading: false,
                error: 'Geolocation is not supported by your browser',
            });
            return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    coordinates: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    loading: false,
                    error: null,
                });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                setState({
                    coordinates: null,
                    loading: false,
                    error: errorMessage,
                });
            },
            {
                enableHighAccuracy,
                timeout,
                maximumAge,
            }
        );
    };

    // Default coordinates for major Canadian cities (used as fallback)
    const defaultCities = {
        toronto: { lat: 43.6532, lng: -79.3832 },
        vancouver: { lat: 49.2827, lng: -123.1207 },
        calgary: { lat: 51.0447, lng: -114.0719 },
        edmonton: { lat: 53.5461, lng: -113.4938 },
        mississauga: { lat: 43.5890, lng: -79.6441 },
    };

    return {
        ...state,
        requestLocation,
        defaultCities,
    };
}
