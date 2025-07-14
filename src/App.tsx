import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/components/AuthProvider';
import { AuthGuard } from './features/auth/components/AuthGuard';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './features/auth/components/LoginForm';
import { SignUpForm } from './features/auth/components/SignUpForm';
import { OnboardingWizard } from './features/onboarding/components/OnboardingWizard';
import { TrackingPage } from './components/tracking/TrackingPage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { LeaderboardPage } from './components/social/LeaderboardPage';
import { CommunityPage } from './features/community/components/CommunityPage';
import { GamificationPage } from './features/gamification/components/GamificationPage';
import { ToastContainer } from './components/feedback/Toast';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />

          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            {/* Wrap everything in Layout so navigation is client-side only */}
            <Route element={<Layout />}>
              <Route path="/onboarding" element={<OnboardingWizard />} />
              <Route path="/" element={<TrackingPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/achievements" element={<GamificationPage />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}