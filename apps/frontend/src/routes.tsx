import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const CreateMeetingPage = lazy(() => import('./pages/CreateMeetingPage'));
const MeetingDetailsPage = lazy(() => import('./pages/MeetingDetailsPage'));
const ParticipantsPage = lazy(() => import('./pages/ParticipantsPage'));
const AttendancePage = lazy(() => import('./pages/AttendancePage'));
const RecordingsPage = lazy(() => import('./pages/RecordingsPage'));
const AIWorkspacePage = lazy(() => import('./pages/AIWorkspacePage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="meetings/create" element={<CreateMeetingPage />} />
          <Route path="meetings/:id" element={<MeetingDetailsPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="recordings" element={<RecordingsPage />} />
          <Route path="ai-workspace" element={<AIWorkspacePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute requiredRoles={['administrator', 'ict_staff']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
