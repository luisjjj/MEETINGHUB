import { useState, useCallback, useRef } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: (totalPages: number) => void;
  offset: number;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 10 } = options;
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const pageRef = useRef(page);

  const offset = (page - 1) * pageSize;

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
    pageRef.current += 1;
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
    pageRef.current = Math.max(1, pageRef.current - 1);
  }, []);

  const firstPage = useCallback(() => {
    setPage(1);
    pageRef.current = 1;
  }, []);

  const lastPage = useCallback((totalPages: number) => {
    setPage(totalPages);
    pageRef.current = totalPages;
  }, []);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    offset,
  };
}
