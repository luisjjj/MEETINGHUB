import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Video, Download, Share2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMeeting, useDeleteMeeting } from '@/hooks/useMeetings';
import { useParticipants } from '@/hooks/useParticipants';
import { useRecordings } from '@/hooks/useRecordings';
import { useSummaries } from '@/hooks/useSummaries';
import { UserAvatar } from '@/components/common/UserAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MeetingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: meeting, isLoading, error } = useMeeting(id || '');
  const { data: participants } = useParticipants(id);
  const { data: recordings } = useRecordings({ meetingId: id });
  const { data: summaries } = useSummaries({ meetingId: id });
  const deleteMeeting = useDeleteMeeting();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !meeting) {
    return <ErrorState title="Meeting not found" message="The meeting you're looking for doesn't exist." />;
  }

  const handleDelete = async () => {
    try {
      await deleteMeeting.mutateAsync(id || '');
      toast.success('Meeting deleted successfully');
      navigate('/dashboard/calendar');
    } catch {
      toast.error('Failed to delete meeting');
    }
  };

  const recording = recordings?.[0];
  const summary = summaries?.[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{meeting.title}</h1>
            <StatusBadge variant={meeting.status as 'scheduled' | 'in_progress' | 'completed' | 'cancelled'}>
              {meeting.status}
            </StatusBadge>
          </div>
          {meeting.description && (
            <p className="text-muted-foreground">{meeting.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />Export
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(meeting.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(meeting.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {meeting.location || meeting.room || meeting.format}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">{participants?.length || 0} attendees</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {summary && (
            <Card>
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {summary.executiveSummary || summary.detailedSummary || 'No summary available'}
                </p>
              </CardContent>
            </Card>
          )}

          {summary?.actionItems && (
            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {summary.actionItems}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {participants && participants.length > 0 ? (
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          fallback={participant.displayName?.split(' ').map(n => n[0]).join('') || '?'}
                          size="sm"
                          status={participant.status === 'accepted' ? 'online' : 'offline'}
                        />
                        <div>
                          <p className="text-sm font-medium">{participant.displayName}</p>
                          <p className="text-xs text-muted-foreground capitalize">{participant.role}</p>
                        </div>
                      </div>
                      <StatusBadge
                        variant={
                          participant.status === 'accepted' ? 'success' :
                          participant.status === 'declined' ? 'error' : 'warning'
                        }
                        size="sm"
                      >
                        {participant.status}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No participants"
                  description="Invite participants to this meeting"
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recording</CardTitle>
            </CardHeader>
            <CardContent>
              {recording ? (
                <div className="rounded-lg border p-4 text-center">
                  <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Recording Available</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Duration: {Math.floor(recording.duration / 60)}m {recording.duration % 60}s
                  </p>
                  <Button size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Recording
                  </Button>
                </div>
              ) : (
                <EmptyState
                  title="No recording"
                  description="Recording will appear here after the meeting"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Meeting"
        description="Are you sure you want to delete this meeting? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
