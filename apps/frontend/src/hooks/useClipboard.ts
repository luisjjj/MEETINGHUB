import { useState, useCallback } from 'react';

type CopyFn = (text: string) => Promise<boolean>;

interface UseClipboardReturn {
  copy: CopyFn;
  copied: boolean;
  error: Error | null;
}

export function useClipboard(timeout = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy: CopyFn = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch (err) {
      setCopied(false);
      setError(err instanceof Error ? err : new Error('Failed to copy'));
      return false;
    }
  }, [timeout]);

  return { copy, copied, error };
}
