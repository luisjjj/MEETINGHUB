import { useState, useEffect, useRef } from 'react';

interface UseMediaQueryOptions {
  defaultMatches?: boolean;
}

export function useMediaQuery(query: string, options: UseMediaQueryOptions = {}): boolean {
  const { defaultMatches = false } = options;
  const [matches, setMatches] = useState(defaultMatches);
  const queryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    queryRef.current = mediaQuery;
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
