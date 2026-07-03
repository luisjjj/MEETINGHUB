import { motion } from 'framer-motion';
import { Check, CheckCheck, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const notifications = [
  { id: '1', title: 'Meeting Reminder', message: 'Q4 Board Review starts in 30 minutes', type: 'meeting_reminder', isRead: false, time: '10 minutes ago' },
  { id: '2', title: 'Recording Available', message: 'Product Strategy Meeting recording is ready', type: 'recording_available', isRead: false, time: '1 hour ago' },
  { id: '3', title: 'Summary Generated', message: 'AI summary for Marketing Review is complete', type: 'summary_generated', isRead: true, time: '2 hours ago' },
  { id: '4', title: 'Action Item Overdue', message: 'Budget proposal deadline has passed', type: 'action_item_overdue', isRead: true, time: '1 day ago' },
  { id: '5', title: 'Invitation Accepted', message: 'Jane Smith accepted your meeting invitation', type: 'invitation_accepted', isRead: true, time: '1 day ago' },
  { id: '6', title: 'Email Sent', message: 'Follow-up email sent to all participants', type: 'email_sent', isRead: true, time: '2 days ago' },
];

const typeColors: Record<string, string> = {
  meeting_reminder: 'bg-blue-500',
  recording_available: 'bg-purple-500',
  summary_generated: 'bg-success',
  action_item_overdue: 'bg-destructive',
  invitation_accepted: 'bg-primary-500',
  email_sent: 'bg-muted-foreground',
};

export default function NotificationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your meetings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><CheckCheck className="mr-2 h-4 w-4" />Mark All Read</Button>
          <Button variant="outline"><Trash2 className="mr-2 h-4 w-4" />Clear All</Button>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.isRead ? 'opacity-60' : ''}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`h-2 w-2 rounded-full mt-2 ${typeColors[notification.type]}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{notification.title}</h3>
                  {!notification.isRead && <Badge variant="info" className="text-xs">New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
