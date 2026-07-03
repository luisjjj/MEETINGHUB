import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Video, Download, Share2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const meetingData = {
  id: '1',
  title: 'Q4 Board Review',
  description: 'Quarterly board review meeting to discuss financial performance and strategic initiatives.',
  date: 'December 15, 2024',
  time: '10:00 AM - 11:30 AM',
  timezone: 'EST',
  location: 'Virtual (Zoom)',
  status: 'completed',
  organizer: 'John Doe',
  participants: [
    { id: '1', name: 'John Doe', status: 'present', role: 'organizer' },
    { id: '2', name: 'Jane Smith', status: 'present', role: 'presenter' },
    { id: '3', name: 'Mike Johnson', status: 'late', role: 'attendee' },
    { id: '4', name: 'Sarah Williams', status: 'absent', role: 'attendee' },
  ],
  agenda: [
    'Financial Performance Review',
    'Strategic Initiatives Update',
    'Budget Approval',
    'Q&A Session',
  ],
  actionItems: [
    { id: '1', title: 'Prepare budget proposal', assignee: 'John Doe', dueDate: 'Dec 20', status: 'pending' },
    { id: '2', title: 'Send meeting minutes', assignee: 'Jane Smith', dueDate: 'Dec 16', status: 'completed' },
    { id: '3', title: 'Schedule follow-up meeting', assignee: 'Mike Johnson', dueDate: 'Dec 18', status: 'pending' },
  ],
  summary: 'The Q4 board review covered key financial metrics, showing a 15% increase in revenue. Strategic initiatives were discussed with focus on market expansion. Budget for Q1 was approved with minor adjustments.',
};

const statusColors: Record<string, string> = {
  present: 'bg-success',
  late: 'bg-warning',
  absent: 'bg-destructive',
};

export default function MeetingDetailsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{meetingData.title}</h1>
            <Badge variant="outline" className="capitalize">{meetingData.status}</Badge>
          </div>
          <p className="text-muted-foreground">{meetingData.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Edit</Button>
          <Button variant="outline"><Share2 className="mr-2 h-4 w-4" />Share</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export PDF</Button>
          <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
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
                    <p className="text-sm text-muted-foreground">{meetingData.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{meetingData.time} ({meetingData.timezone})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{meetingData.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">{meetingData.participants.length} attendees</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {meetingData.agenda.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{meetingData.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {meetingData.actionItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.status === 'completed'}
                        className="rounded"
                        readOnly
                      />
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Assigned to {item.assignee} - Due {item.dueDate}
                        </p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'success' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {meetingData.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${statusColors[participant.status]}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{participant.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{participant.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">{participant.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 text-center">
                <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Recording Available</p>
                <p className="text-xs text-muted-foreground mb-3">Duration: 1h 25m</p>
                <Button size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Recording
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
