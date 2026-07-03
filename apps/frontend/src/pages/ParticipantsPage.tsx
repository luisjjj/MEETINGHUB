import { motion } from 'framer-motion';
import { Search, Plus, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const participants = [
  { id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering', role: 'Admin', meetings: 45, status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', role: 'Head', meetings: 38, status: 'active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', department: 'Sales', role: 'Employee', meetings: 32, status: 'active' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@company.com', department: 'HR', role: 'Employee', meetings: 28, status: 'inactive' },
  { id: '5', name: 'David Brown', email: 'david@company.com', department: 'Finance', role: 'Head', meetings: 41, status: 'active' },
  { id: '6', name: 'Emily Davis', email: 'emily@company.com', department: 'Engineering', role: 'Employee', meetings: 35, status: 'active' },
];

export default function ParticipantsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Participants</h1>
          <p className="text-muted-foreground">Manage meeting participants and invitees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Import CSV</Button>
          <Button><Plus className="mr-2 h-4 w-4" />Add Participant</Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search participants..." className="pl-10" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium">Name</th>
                  <th className="text-left p-4 text-sm font-medium">Email</th>
                  <th className="text-left p-4 text-sm font-medium">Department</th>
                  <th className="text-left p-4 text-sm font-medium">Role</th>
                  <th className="text-left p-4 text-sm font-medium">Meetings</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-medium text-primary-600">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{participant.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{participant.email}</td>
                    <td className="p-4 text-sm">{participant.department}</td>
                    <td className="p-4"><Badge variant="secondary">{participant.role}</Badge></td>
                    <td className="p-4 text-sm">{participant.meetings}</td>
                    <td className="p-4">
                      <Badge variant={participant.status === 'active' ? 'success' : 'secondary'}>
                        {participant.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
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
