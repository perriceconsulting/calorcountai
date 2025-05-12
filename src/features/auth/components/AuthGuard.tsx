import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProfile } from '../hooks/useProfile';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

export function AuthGuard() {
  const location = useLocation();
  const { user, loading: authLoading } = useAuthStore();
  const { profile, loading: profileLoading, fetchProfile } = useProfile();

  React.useEffect(() => {
    if (user && !profile && !profileLoading) {
      fetchProfile();
    }
  }, [user, profile, profileLoading, fetchProfile]);

  // Show loading spinner while checking auth state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if not completed
  if (profile && !profile.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}