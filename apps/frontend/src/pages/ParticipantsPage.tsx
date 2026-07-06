import { motion } from 'framer-motion';
import { Search, Plus, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useParticipants } from '@/hooks/useParticipants';
import { UserAvatar } from '@/components/common/UserAvatar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useState } from 'react';

export default function ParticipantsPage() {
  const [search, setSearch] = useState('');
  const { data: participants, isLoading } = useParticipants();

  const filteredParticipants = participants?.filter(
    (p) =>
      p.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
  ) || [];

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
          <Button>
            <Plus className="mr-2 h-4 w-4" />Add Participant
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search participants..."
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
      ) : filteredParticipants.length === 0 ? (
        <EmptyState
          title="No participants found"
          description="Add participants to get started"
          action={
            <Button>
              <Plus className="mr-2 h-4 w-4" />Add Participant
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 text-sm font-medium">Name</th>
                    <th className="text-left p-4 text-sm font-medium">Email</th>
                    <th className="text-left p-4 text-sm font-medium">Role</th>
                    <th className="text-left p-4 text-sm font-medium">Status</th>
                    <th className="text-left p-4 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            fallback={participant.displayName?.split(' ').map(n => n[0]).join('') || '?'}
                            size="md"
                          />
                          <span className="font-medium">{participant.displayName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{participant.email}</td>
                      <td className="p-4">
                        <Badge variant="secondary">{participant.role}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            participant.status === 'accepted'
                              ? 'success'
                              : participant.status === 'declined'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
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
      )}
    </motion.div>
  );
}
