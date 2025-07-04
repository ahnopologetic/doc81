"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getTemplates,
  getTemplate,
  generateTemplate,
  GenerateTemplateParams,
} from "@/lib/api/services";

// Query keys
export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...templateKeys.lists(), { filters }] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

// Hook for fetching all templates
export const useTemplates = () => {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: getTemplates,
  });
};

// Hook for fetching a single template
export const useTemplate = (id: string) => {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => getTemplate(id),
    enabled: !!id,
  });
};

// Hook for generating a template with variables
export const useGenerateTemplate = () => {
  return useMutation<string, Error, GenerateTemplateParams>({
    mutationFn: (params: GenerateTemplateParams) => generateTemplate(params),
  });
}; 