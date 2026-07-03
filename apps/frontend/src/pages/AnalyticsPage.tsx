import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const meetingFrequency = [
  { month: 'Jan', meetings: 45 },
  { month: 'Feb', meetings: 52 },
  { month: 'Mar', meetings: 48 },
  { month: 'Apr', meetings: 61 },
  { month: 'May', meetings: 55 },
  { month: 'Jun', meetings: 67 },
];

const attendanceTrends = [
  { month: 'Jan', present: 85, late: 10, absent: 5 },
  { month: 'Feb', present: 88, late: 8, absent: 4 },
  { month: 'Mar', present: 82, late: 12, absent: 6 },
  { month: 'Apr', present: 90, late: 7, absent: 3 },
  { month: 'May', present: 87, late: 9, absent: 4 },
  { month: 'Jun', present: 92, late: 6, absent: 2 },
];

const departmentActivity = [
  { name: 'Engineering', value: 35, color: '#1e3a5f' },
  { name: 'Marketing', value: 25, color: '#64748b' },
  { name: 'Sales', value: 20, color: '#22c55e' },
  { name: 'HR', value: 12, color: '#f59e0b' },
  { name: 'Finance', value: 8, color: '#3b82f6' },
];

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Insights and trends from your meetings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                <BarChart3 className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">328</p>
                <p className="text-sm text-muted-foreground">Total Meetings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">656h</p>
                <p className="text-sm text-muted-foreground">Hours Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">142</p>
                <p className="text-sm text-muted-foreground">AI Summaries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={meetingFrequency}>
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
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrends}>
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
          <CardHeader>
            <CardTitle>Department Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentActivity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={meetingFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="meetings" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
