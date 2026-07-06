import { motion } from 'framer-motion';
import { Video, Download, Share2, Trash2, Search, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRecordings, useDeleteRecording, useDownloadRecording } from '@/hooks/useRecordings';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RecordingsPage() {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: recordings, isLoading } = useRecordings();
  const deleteRecording = useDeleteRecording();
  const downloadRecording = useDownloadRecording();

  const filteredRecordings = recordings?.filter(
    (r) => r.url?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRecording.mutateAsync(deleteId);
      toast.success('Recording deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete recording');
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const url = await downloadRecording.mutateAsync(id);
      window.open(url, '_blank');
    } catch {
      toast.error('Failed to get download URL');
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
          <h1 className="text-2xl font-bold">Recording Center</h1>
          <p className="text-muted-foreground">Access and manage your meeting recordings</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recordings..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredRecordings.length === 0 ? (
        <EmptyState
          title="No recordings found"
          description="Recordings will appear here after meetings"
          icon={<Video className="h-12 w-12" />}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecordings.map((recording) => (
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
                <h3 className="font-semibold mb-1">Meeting Recording</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {new Date(recording.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {Math.floor(recording.duration / 60)}m
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {(recording.fileSize / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
                {recording.transcript && (
                  <Badge variant="info" className="mb-4">Transcript Available</Badge>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(recording.id)}
                    disabled={downloadRecording.isPending}
                  >
                    <Download className="mr-2 h-4 w-4" />Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(recording.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Recording"
        description="Are you sure you want to delete this recording? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
