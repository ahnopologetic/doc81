"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  CreateCompanyParams,
  UpdateCompanyParams,
} from "@/lib/api/services";

// Query keys
export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...companyKeys.lists(), { filters }] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
};

// Hook for fetching all companies
export const useCompanies = () => {
  return useQuery({
    queryKey: companyKeys.lists(),
    queryFn: getCompanies,
  });
};

// Hook for fetching a single company
export const useCompany = (id: string) => {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => getCompany(id),
    enabled: !!id,
  });
};

// Hook for creating a company
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateCompanyParams) => createCompany(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};

// Hook for updating a company
export const useUpdateCompany = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateCompanyParams) => updateCompany(id, params),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};

// Hook for deleting a company
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.removeQueries({ queryKey: companyKeys.detail(id) });
    },
  });
}; 