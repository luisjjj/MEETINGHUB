import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/common/StatCard';
import { useDashboardStats, useMeetings } from '@/hooks/useMeetings';
import { useAuth } from '@/contexts/AuthContext';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats } = useDashboardStats();
  const { data: meetingsData, isLoading: meetingsLoading } = useMeetings({ limit: 5 });

  const upcomingMeetings = meetingsData?.meetings?.slice(0, 3) || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}. Here's your meeting overview.
          </p>
        </div>
        <Link to="/meetings/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Meeting
          </Button>
        </Link>
      </div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Meetings"
          value={stats?.totalMeetings || 0}
          icon={<Calendar className="h-5 w-5 text-primary-500" />}
        />
        <StatCard
          title="Hours Scheduled"
          value={stats?.hoursScheduled || 0}
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendanceRate || 0}%`}
          icon={<Users className="h-5 w-5 text-success" />}
        />
        <StatCard
          title="Recordings Available"
          value={stats?.recordingsAvailable || 0}
          icon={<Video className="h-5 w-5 text-purple-500" />}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Your scheduled meetings</CardDescription>
              </div>
              <Link to="/calendar">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {meetingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting: { id: string; title: string; startTime: string; status: string }) => (
                    <Link key={meeting.id} to={`/meetings/${meeting.id}`}>
                      <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                            <Calendar className="h-5 w-5 text-primary-500" />
                          </div>
                          <div>
                            <p className="font-medium">{meeting.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(meeting.startTime).toLocaleDateString()} -{' '}
                              {new Date(meeting.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge variant={meeting.status === 'scheduled' ? 'default' : 'secondary'}>
                          {meeting.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming meetings</p>
                  <Link to="/meetings/create">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Meeting
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/meetings/create">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Meeting
                </Button>
              </Link>
              <Link to="/ai-workspace">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  AI Workspace
                </Button>
              </Link>
              <Link to="/recordings">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  View Recordings
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>AI Summaries Pending</CardTitle>
            <CardDescription>Meetings awaiting AI summary generation</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.aiSummariesPending && stats.aiSummariesPending > 0 ? (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                    <FileText className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{stats.aiSummariesPending} meetings pending summary</p>
                    <p className="text-sm text-muted-foreground">
                      Generate summaries to extract key insights
                    </p>
                  </div>
                </div>
                <Link to="/ai-workspace">
                  <Button variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">All caught up! No pending summaries.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
