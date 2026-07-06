import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '@/components/common/StatCard';
import { useAnalyticsDashboard, useMeetingFrequency, useDepartmentActivity } from '@/hooks/useAnalytics';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import api from '@/lib/api';

const COLORS = ['#1e3a5f', '#64748b', '#22c55e', '#f59e0b', '#3b82f6'];

function useAttendanceTrends() {
  return useQuery({
    queryKey: ['analytics', 'attendance-trends'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/attendance-trends');
      return data.data as { month: string; present: number; late: number; absent: number }[];
    },
  });
}

function useMeetingDurations() {
  return useQuery({
    queryKey: ['analytics', 'meeting-durations'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/meeting-durations');
      return data.data as { month: string; avg_duration: number }[];
    },
  });
}

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useAnalyticsDashboard();
  const { data: meetingFrequency } = useMeetingFrequency();
  const { data: departmentActivity } = useDepartmentActivity();
  const { data: attendanceTrends } = useAttendanceTrends();
  const { data: meetingDurations } = useMeetingDurations();

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Insights and trends from your meetings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Meetings" value={stats?.totalMeetings || 0} icon={<BarChart3 className="h-5 w-5 text-primary-500" />} />
        <StatCard title="Hours Scheduled" value={`${stats?.hoursScheduled || 0}h`} icon={<Clock className="h-5 w-5 text-blue-500" />} />
        <StatCard title="Avg Attendance" value={`${stats?.attendanceRate || 0}%`} icon={<Users className="h-5 w-5 text-success" />} />
        <StatCard title="AI Summaries" value={stats?.aiSummariesPending || 0} icon={<TrendingUp className="h-5 w-5 text-purple-500" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Meeting Frequency</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={meetingFrequency?.length ? meetingFrequency : [{ month: 'No data', meetings: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="meetings" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Attendance Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrends?.length ? attendanceTrends : [{ month: 'No data', present: 0, late: 0, absent: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Department Activity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentActivity?.length ? departmentActivity : [{ name: 'No data', value: 1 }]}
                  cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100} fill="#8884d8" dataKey="value"
                >
                  {(departmentActivity?.length ? departmentActivity : [{ name: 'No data', value: 1 }]).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Meeting Duration (avg min)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={meetingDurations?.length ? meetingDurations : [{ month: 'No data', avg_duration: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avg_duration" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
