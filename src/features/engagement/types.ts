export type FeatureId = 'camera' | 'barcode' | 'goals' | 'tracking';

export interface AnalyticsEvent {
  type: 'feature_interaction' | 'achievement_earned' | 'onboarding_complete';
  featureId?: FeatureId;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface EngagementMetrics {
  featureUsage: Record<FeatureId, number>;
  completionRates: Record<string, number>;
  activeUsers: number;
}

export interface Notification {
  title: string;
  message: string;
  icon?: string;
  action?: {
    text: string;
    url: string;
  };
}

export interface NotificationPreferences {
  achievements?: boolean;
  reminders?: boolean;
  tips?: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}