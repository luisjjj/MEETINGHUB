import { motion } from 'framer-motion';
import { Building2, Users, Calendar, Key, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

type Tab = 'organization' | 'departments' | 'meeting-types' | 'api-keys' | 'security' | 'notifications';

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [activeTab, setActiveTab] = useState<Tab>('organization');
  const [formData, setFormData] = useState({
    organizationName: '',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    defaultMeetingDuration: 60,
    enableZoomIntegration: true,
    enableOutlookIntegration: true,
    enableAI: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        organizationName: settings.organizationName || '',
        timezone: settings.timezone || 'UTC',
        dateFormat: settings.dateFormat || 'MM/DD/YYYY',
        defaultMeetingDuration: settings.defaultMeetingDuration || 60,
        enableZoomIntegration: settings.enableZoomIntegration ?? true,
        enableOutlookIntegration: settings.enableOutlookIntegration ?? true,
        enableAI: settings.enableAI ?? true,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        organizationName: formData.organizationName,
        timezone: formData.timezone,
        dateFormat: formData.dateFormat,
        defaultMeetingDuration: formData.defaultMeetingDuration,
        enableZoomIntegration: formData.enableZoomIntegration,
        enableOutlookIntegration: formData.enableOutlookIntegration,
        enableAI: formData.enableAI,
      });
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'organization', label: 'Organization', icon: <Building2 className="mr-2 h-4 w-4" /> },
    { key: 'departments', label: 'Departments', icon: <Users className="mr-2 h-4 w-4" /> },
    { key: 'meeting-types', label: 'Meeting Types', icon: <Calendar className="mr-2 h-4 w-4" /> },
    { key: 'api-keys', label: 'API Keys', icon: <Key className="mr-2 h-4 w-4" /> },
    { key: 'security', label: 'Security', icon: <Shield className="mr-2 h-4 w-4" /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell className="mr-2 h-4 w-4" /> },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your organization and application settings</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}{tab.label}
            </Button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'organization' && (
            <>
              <Card>
                <CardHeader><CardTitle>Organization Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Organization Name</Label>
                      <Input value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="CST">Central Time</SelectItem>
                          <SelectItem value="MST">Mountain Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select value={formData.dateFormat} onValueChange={(value) => setFormData({ ...formData, dateFormat: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Default Meeting Duration</Label>
                      <Select value={String(formData.defaultMeetingDuration)} onValueChange={(value) => setFormData({ ...formData, defaultMeetingDuration: Number(value) })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
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
                <CardHeader><CardTitle>Integrations</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center"><span className="text-white font-bold">Z</span></div>
                      <div><p className="font-medium">Zoom</p><p className="text-sm text-muted-foreground">Video conferencing integration</p></div>
                    </div>
                    <Switch checked={formData.enableZoomIntegration} onCheckedChange={(v) => setFormData({ ...formData, enableZoomIntegration: v })} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center"><span className="text-white font-bold">O</span></div>
                      <div><p className="font-medium">Microsoft Outlook</p><p className="text-sm text-muted-foreground">Calendar and email integration</p></div>
                    </div>
                    <Switch checked={formData.enableOutlookIntegration} onCheckedChange={(v) => setFormData({ ...formData, enableOutlookIntegration: v })} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-500 flex items-center justify-center"><span className="text-white font-bold">AI</span></div>
                      <div><p className="font-medium">OpenAI</p><p className="text-sm text-muted-foreground">AI-powered summaries and insights</p></div>
                    </div>
                    <Switch checked={formData.enableAI} onCheckedChange={(v) => setFormData({ ...formData, enableAI: v })} />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'departments' && (
            <Card>
              <CardHeader><CardTitle>Department Management</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Department management allows you to organize meetings by department. Create and manage departments in the organization settings.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'meeting-types' && (
            <Card>
              <CardHeader><CardTitle>Meeting Types</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configure different meeting types such as Standup, Review, Planning, All Hands, and more.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'api-keys' && (
            <Card>
              <CardHeader><CardTitle>API Keys</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage API keys for third-party integrations. Configure Zoom, OpenAI, and Microsoft API credentials.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configure authentication settings, session management, and access controls.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configure email and in-app notification preferences for meeting invitations, reminders, and updates.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
