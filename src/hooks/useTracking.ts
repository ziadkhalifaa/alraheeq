import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { eventApi } from '@/api/api';

export function useTracking() {
  const location = useLocation();

  const trackEvent = useCallback(async (type: string, productId?: number) => {
    try {
      await eventApi.track({
        type,
        product_id: productId,
        source_page: location.pathname
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, [location.pathname]);

  return { trackEvent };
}
