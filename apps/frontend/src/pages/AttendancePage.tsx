import { motion } from 'framer-motion';
import { QrCode, Download, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAttendance, useGenerateQRCode, useExportAttendance } from '@/hooks/useAttendance';
import { useMeetings } from '@/hooks/useMeetings';
import { UserAvatar } from '@/components/common/UserAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { StatCard } from '@/components/common/StatCard';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AttendancePage() {
  const [search, setSearch] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const { data: meetingsData } = useMeetings({ limit: 100 });
  const { data: attendance, isLoading } = useAttendance(selectedMeetingId || undefined);
  const generateQR = useGenerateQRCode();
  const exportAttendance = useExportAttendance();

  const filteredAttendance = attendance?.filter(
    (a) => a.displayName?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const presentCount = attendance?.filter((a) => a.status === 'present').length || 0;
  const lateCount = attendance?.filter((a) => a.status === 'late').length || 0;
  const absentCount = attendance?.filter((a) => a.status === 'absent').length || 0;
  const total = attendance?.length || 1;

  const handleGenerateQR = async () => {
    if (!selectedMeetingId) {
      toast.error('Please select a meeting first');
      return;
    }
    try {
      const qrCode = await generateQR.mutateAsync(selectedMeetingId);
      if (qrCode) {
        const win = window.open('');
        if (win) {
          win.document.write(`<html><head><title>QR Code</title></head><body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0"><img src="${qrCode}" style="max-width:400px" /></body></html>`);
        }
      }
      toast.success('QR Code generated');
    } catch {
      toast.error('Failed to generate QR code');
    }
  };

  const handleExport = async () => {
    if (!selectedMeetingId) {
      toast.error('Please select a meeting first');
      return;
    }
    try {
      const data = await exportAttendance.mutateAsync(selectedMeetingId);
      const csv = [
        ['Name', 'Email', 'Check-in', 'Check-out', 'Status'].join(','),
        ...data.map((r: any) => [r.displayName, r.email, r.checkInTime || '', r.checkOutTime || '', r.status].join(','))
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-${selectedMeetingId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Attendance exported');
    } catch {
      toast.error('Failed to export attendance');
    }
  };

  const meetings = meetingsData?.meetings || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track and manage meeting attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateQR} disabled={generateQR.isPending}>
            <QrCode className="mr-2 h-4 w-4" />Generate QR
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exportAttendance.isPending}>
            <Download className="mr-2 h-4 w-4" />Export Excel
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-72">
          <Select value={selectedMeetingId} onValueChange={setSelectedMeetingId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a meeting" />
            </SelectTrigger>
            <SelectContent>
              {meetings.map((m: any) => (
                <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedMeetingId && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Present" value={`${Math.round((presentCount / total) * 100)}%`} icon={<div className="h-3 w-3 rounded-full bg-success" />} />
          <StatCard title="Late" value={`${Math.round((lateCount / total) * 100)}%`} icon={<div className="h-3 w-3 rounded-full bg-warning" />} />
          <StatCard title="Absent" value={`${Math.round((absentCount / total) * 100)}%`} icon={<div className="h-3 w-3 rounded-full bg-destructive" />} />
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search attendance..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {!selectedMeetingId ? (
        <EmptyState title="Select a meeting" description="Choose a meeting from the dropdown above to view attendance" />
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
      ) : filteredAttendance.length === 0 ? (
        <EmptyState title="No attendance records" description="Attendance will be tracked when meetings start" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 text-sm font-medium">Name</th>
                    <th className="text-left p-4 text-sm font-medium">Check-in Time</th>
                    <th className="text-left p-4 text-sm font-medium">Duration</th>
                    <th className="text-left p-4 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar fallback={record.displayName?.slice(0, 2).toUpperCase() || '?'} size="md" />
                          <div>
                            <p className="font-medium">{record.displayName}</p>
                            <p className="text-sm text-muted-foreground">{record.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : '-'}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {record.checkInTime && record.checkOutTime
                          ? `${Math.round((new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()) / 60000)}m`
                          : '-'}
                      </td>
                      <td className="p-4">
                        <StatusBadge variant={record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'error'}>
                          {record.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
