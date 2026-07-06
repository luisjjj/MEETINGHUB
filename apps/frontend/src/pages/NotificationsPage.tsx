import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { toast } from 'sonner';

const typeColors: Record<string, string> = {
  meeting_reminder: 'bg-blue-500',
  recording_available: 'bg-purple-500',
  summary_generated: 'bg-success',
  action_item_overdue: 'bg-destructive',
  invitation_accepted: 'bg-primary-500',
  email_sent: 'bg-muted-foreground',
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark notifications');
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markRead.mutateAsync(id);
    } catch {
      toast.error('Failed to mark notification');
    }
  };

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
          <Button variant="outline" onClick={handleMarkAllRead} disabled={markAllRead.isPending}>
            <CheckCheck className="mr-2 h-4 w-4" />Mark All Read
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.isRead ? 'opacity-60' : ''}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`h-2 w-2 rounded-full mt-2 ${typeColors[notification.type] || 'bg-muted-foreground'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    {!notification.isRead && <Badge variant="info" className="text-xs">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMarkRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
