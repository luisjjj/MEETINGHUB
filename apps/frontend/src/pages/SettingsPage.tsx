import { motion } from 'framer-motion';
import { Building2, Users, Calendar, Key, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your organization and application settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Building2 className="mr-2 h-4 w-4" />Organization
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />Departments
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />Meeting Types
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Key className="mr-2 h-4 w-4" />API Keys
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Shield className="mr-2 h-4 w-4" />Security
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Bell className="mr-2 h-4 w-4" />Notifications
          </Button>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input defaultValue="MeetingHub Inc." />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="MM/DD/YYYY">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Meeting Duration</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">Z</span>
                  </div>
                  <div>
                    <p className="font-medium">Zoom</p>
                    <p className="text-sm text-muted-foreground">Video conferencing integration</p>
                  </div>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold">O</span>
                  </div>
                  <div>
                    <p className="font-medium">Microsoft Outlook</p>
                    <p className="text-sm text-muted-foreground">Calendar and email integration</p>
                  </div>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-500 flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <p className="font-medium">OpenAI</p>
                    <p className="text-sm text-muted-foreground">AI-powered summaries and insights</p>
                  </div>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
