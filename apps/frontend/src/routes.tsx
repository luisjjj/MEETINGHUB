import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoadingScreen } from './components/common/LoadingScreen';

const LoginPage = lazy(() => import('./pages/LoginPage'));
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="meetings/create" element={<CreateMeetingPage />} />
          <Route path="meetings/:id" element={<MeetingDetailsPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="recordings" element={<RecordingsPage />} />
          <Route path="ai-workspace" element={<AIWorkspacePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
