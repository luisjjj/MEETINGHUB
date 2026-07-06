import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useDebounce } from './useDebounce';

interface SearchResult {
  type: string;
  id: string;
  title: string;
  description?: string;
  url: string;
}

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];
      const { data } = await api.get('/search', { params: { q: debouncedQuery } });
      return data.results as SearchResult[];
    },
    enabled: debouncedQuery.length >= 2,
  });
}
