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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const stats = [
  { title: 'Total Meetings', value: '128', icon: Calendar, change: '+12%', color: 'text-primary-500' },
  { title: 'Hours Scheduled', value: '256', icon: Clock, change: '+8%', color: 'text-blue-500' },
  { title: 'Attendance Rate', value: '94%', icon: Users, change: '+2%', color: 'text-success' },
  { title: 'Recordings Available', value: '89', icon: Video, change: '+15%', color: 'text-purple-500' },
];

const upcomingMeetings = [
  {
    id: '1',
    title: 'Q4 Board Review',
    time: '10:00 AM - 11:30 AM',
    participants: 12,
    type: 'board',
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Product Strategy Meeting',
    time: '2:00 PM - 3:00 PM',
    participants: 8,
    type: 'team',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Engineering Standup',
    time: '4:00 PM - 4:30 PM',
    participants: 15,
    type: 'team',
    status: 'scheduled',
  },
];

const recentActivity = [
  { action: 'Meeting completed', detail: 'Marketing Review - Summary generated', time: '2 hours ago' },
  { action: 'Recording available', detail: 'Product Demo - Ready for download', time: '3 hours ago' },
  { action: 'Action item overdue', detail: 'Budget proposal - Assigned to John', time: '5 hours ago' },
  { action: 'New participant', detail: 'Sarah joined Q4 Planning', time: '1 day ago' },
];

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
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John. Here's your meeting overview.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
      </div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Your scheduled meetings for today</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                        <Calendar className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-sm text-muted-foreground">{meeting.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{meeting.participants} participants</Badge>
                      <Badge variant={meeting.type === 'board' ? 'default' : 'secondary'}>
                        {meeting.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="relative">
                      <div className="h-2 w-2 rounded-full bg-primary-500 mt-2" />
                      {index < recentActivity.length - 1 && (
                        <div className="absolute left-0 top-4 h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                  <FileText className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">3 meetings pending summary</p>
                  <p className="text-sm text-muted-foreground">
                    Generate summaries to extract key insights
                  </p>
                </div>
              </div>
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
