"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { PaginatedResponse } from "@/lib/api/types";

interface UseInfiniteQueryParams<T> {
  endpoint: string;
  queryKey: unknown[];
  pageSize?: number;
  filters?: Record<string, unknown>;
  enabled?: boolean;
}

export function useInfiniteQueryData<T>({
  endpoint,
  queryKey,
  pageSize = 10,
  filters = {},
  enabled = true,
}: UseInfiniteQueryParams<T>) {
  const fetchPage = async ({ pageParam = 1 }) => {
    const params = {
      page: pageParam,
      page_size: pageSize,
      ...filters,
    };

    const response = await apiClient.get<PaginatedResponse<T>>(endpoint, { params });
    return response.data;
  };

  const query = useInfiniteQuery({
    queryKey,
    queryFn: fetchPage,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled,
  });

  // Flatten the pages data
  const data = query.data?.pages.flatMap((page) => page.data) || [];

  // Calculate if we've loaded all data
  const hasMoreData = query.hasNextPage;

  // Total count from the API
  const totalCount = query.data?.pages[0]?.total || 0;

  return {
    ...query,
    data,
    hasMoreData,
    totalCount,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    },
  };
} 