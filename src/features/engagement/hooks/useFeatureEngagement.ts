import { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analyticsService';
import { NotificationService } from '../services/notificationService';
import { FeatureId } from '../types';

export function useFeatureEngagement(featureId: FeatureId) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const analytics = AnalyticsService.getInstance();
  const notifications = NotificationService.getInstance();

  useEffect(() => {
    if (hasInteracted) {
      analytics.trackEvent({
        type: 'feature_interaction',
        featureId,
        timestamp: new Date().toISOString()
      });
    }
  }, [hasInteracted, featureId]);

  const trackInteraction = () => {
    setHasInteracted(true);
  };

  return { trackInteraction };
}