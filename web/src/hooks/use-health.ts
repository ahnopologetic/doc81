"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealthStatus } from "@/lib/api/services";

// Query keys
export const healthKeys = {
  all: ["health"] as const,
  status: () => [...healthKeys.all, "status"] as const,
};

// Hook for fetching health status
export const useHealthStatus = () => {
  return useQuery({
    queryKey: healthKeys.status(),
    queryFn: getHealthStatus,
    refetchInterval: 60000, // Refetch every minute
  });
}; 