import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Calendar, Users, Video, FileText, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/hooks/useSearch';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  meeting: Calendar,
  participant: Users,
  recording: Video,
  summary: FileText,
  department: Building2,
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useSearch(query);

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
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : !results || results.length === 0 ? (
        <EmptyState
          title="No results found"
          description={query ? 'Try a different search term' : 'Start typing to search'}
          icon={<SearchIcon className="h-12 w-12" />}
        />
      ) : (
        <div className="space-y-3">
          {results.map((result, index) => {
            const Icon = iconMap[result.type] || FileText;
            return (
              <Link key={index} to={result.url}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{result.title}</p>
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">{result.type}</Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
