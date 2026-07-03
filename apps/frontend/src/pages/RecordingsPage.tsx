import { motion } from 'framer-motion';
import { Video, Download, Share2, Trash2, Search, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const recordings = [
  { id: '1', title: 'Q4 Board Review', date: 'Dec 15, 2024', duration: '1h 25m', size: '245 MB', status: 'ready', hasTranscript: true },
  { id: '2', title: 'Product Strategy Meeting', date: 'Dec 14, 2024', duration: '1h', size: '180 MB', status: 'ready', hasTranscript: true },
  { id: '3', title: 'Engineering Standup', date: 'Dec 13, 2024', duration: '30m', size: '85 MB', status: 'processing', hasTranscript: false },
  { id: '4', title: 'Marketing Review', date: 'Dec 12, 2024', duration: '45m', size: '120 MB', status: 'ready', hasTranscript: true },
];

export default function RecordingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recording Center</h1>
          <p className="text-muted-foreground">Access and manage your meeting recordings</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search recordings..." className="pl-10" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recordings.map((recording) => (
          <Card key={recording.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                  <Video className="h-6 w-6 text-primary-500" />
                </div>
                <Badge variant={recording.status === 'ready' ? 'success' : 'secondary'}>
                  {recording.status}
                </Badge>
              </div>
              <h3 className="font-semibold mb-1">{recording.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{recording.date}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {recording.duration}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {recording.size}
                </div>
              </div>
              {recording.hasTranscript && (
                <Badge variant="info" className="mb-4">Transcript Available</Badge>
              )}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />Download
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
