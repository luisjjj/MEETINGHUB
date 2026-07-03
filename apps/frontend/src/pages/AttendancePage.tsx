import { motion } from 'framer-motion';
import { QrCode, Download, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const attendanceData = [
  { id: '1', name: 'John Doe', meeting: 'Q4 Board Review', checkIn: '9:58 AM', status: 'present', duration: '1h 25m' },
  { id: '2', name: 'Jane Smith', meeting: 'Q4 Board Review', checkIn: '10:00 AM', status: 'present', duration: '1h 25m' },
  { id: '3', name: 'Mike Johnson', meeting: 'Q4 Board Review', checkIn: '10:15 AM', status: 'late', duration: '1h 10m' },
  { id: '4', name: 'Sarah Williams', meeting: 'Q4 Board Review', checkIn: '-', status: 'absent', duration: '-' },
  { id: '5', name: 'David Brown', meeting: 'Product Strategy', checkIn: '2:00 PM', status: 'present', duration: '1h' },
  { id: '6', name: 'Emily Davis', meeting: 'Product Strategy', checkIn: '2:05 PM', status: 'late', duration: '55m' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  present: 'success',
  late: 'warning',
  absent: 'destructive',
};

export default function AttendancePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track and manage meeting attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><QrCode className="mr-2 h-4 w-4" />Generate QR</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Excel</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-success">85%</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">10%</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-destructive">5%</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search attendance..." className="pl-10" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium">Name</th>
                  <th className="text-left p-4 text-sm font-medium">Meeting</th>
                  <th className="text-left p-4 text-sm font-medium">Check-in Time</th>
                  <th className="text-left p-4 text-sm font-medium">Duration</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-medium text-primary-600">
                          {record.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{record.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{record.meeting}</td>
                    <td className="p-4 text-sm text-muted-foreground">{record.checkIn}</td>
                    <td className="p-4 text-sm text-muted-foreground">{record.duration}</td>
                    <td className="p-4">
                      <Badge variant={statusVariant[record.status]} className="capitalize">
                        {record.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
