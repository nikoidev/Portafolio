'use client';

import { settingsApi } from '@/lib/settings-api';
import { useEffect, useState } from 'react';
import { GoogleAnalytics } from './GoogleAnalytics';

export function AnalyticsProvider() {
    const [gaId, setGaId] = useState<string>('');

    useEffect(() => {
        // Fetch Google Analytics ID from settings
        const fetchGAId = async () => {
            try {
                const settings = await settingsApi.getPublicSettings();
                if (settings.google_analytics_id) {
                    setGaId(settings.google_analytics_id);
                }
            } catch (error) {
                console.error('Failed to load Google Analytics ID:', error);
            }
        };

        fetchGAId();
    }, []);

    if (!gaId) {
        return null;
    }

    return <GoogleAnalytics gaId={gaId} />;
}

