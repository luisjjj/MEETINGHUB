import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Calendar, Users, Video, FileText, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const searchResults = [
  { type: 'meeting', title: 'Q4 Board Review', description: 'Completed on Dec 15, 2024', icon: Calendar },
  { type: 'participant', title: 'John Doe', description: 'Engineering - Admin', icon: Users },
  { type: 'recording', title: 'Product Strategy Recording', description: '1h duration - Ready', icon: Video },
  { type: 'summary', title: 'Marketing Review Summary', description: 'AI Generated - 3 action items', icon: FileText },
  { type: 'department', title: 'Engineering Department', description: '12 members', icon: Building2 },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-muted-foreground">Search across all your meetings, participants, and files</p>
      </div>

      <div className="relative max-w-2xl">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search meetings, participants, recordings, summaries..."
          className="pl-12 h-12 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Badge variant="secondary" className="cursor-pointer">All</Badge>
        <Badge variant="outline" className="cursor-pointer">Meetings</Badge>
        <Badge variant="outline" className="cursor-pointer">Participants</Badge>
        <Badge variant="outline" className="cursor-pointer">Recordings</Badge>
        <Badge variant="outline" className="cursor-pointer">Summaries</Badge>
        <Badge variant="outline" className="cursor-pointer">Files</Badge>
      </div>

      <div className="space-y-3">
        {searchResults.map((result, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <result.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{result.title}</p>
                <p className="text-sm text-muted-foreground">{result.description}</p>
              </div>
              <Badge variant="outline" className="capitalize">{result.type}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
