"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getTemplates,
  getTemplate,
  generateTemplate,
  GenerateTemplateParams,
  saveTemplate,
} from "@/lib/api/services";
import { Template, TemplateCreate } from "@/lib/api/types";

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

// Hook for saving a template
export const useSaveTemplate = () => {
  return useMutation<Template, Error, TemplateCreate>({
    mutationFn: (template: TemplateCreate) => saveTemplate(template),
  });
};

// Hook for generating a template with variables
export const useGenerateTemplate = () => {
  return useMutation<string, Error, GenerateTemplateParams>({
    mutationFn: (params: GenerateTemplateParams) => generateTemplate(params),
  });
}; 