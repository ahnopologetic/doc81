import { apiClient, extractResponseData } from "../client";
import { Template, TemplateCreate, TemplateListItem } from "../types";

// Templates API endpoints
const TEMPLATES_ENDPOINT = "/templates";

// Get all templates
export const getTemplates = async (): Promise<TemplateListItem[]> => {
    const response = await apiClient.get<TemplateListItem[]>(`${TEMPLATES_ENDPOINT}/`);
    return extractResponseData(response);
};

// Get template by path or reference
export const getTemplate = async (pathOrRef: string): Promise<Template> => {
    const response = await apiClient.get<Template>(`${TEMPLATES_ENDPOINT}/${pathOrRef}`);
    return extractResponseData(response);
};

export const saveTemplate = async (template: TemplateCreate): Promise<Template> => {
    const response = await apiClient.post<Template>(`${TEMPLATES_ENDPOINT}/`, template);
    return extractResponseData(response);
};

// Generate template with variables
export interface GenerateTemplateParams {
    raw_markdown: string;
}

export const generateTemplate = async (params: GenerateTemplateParams): Promise<string> => {
    const response = await apiClient.post<string>(`${TEMPLATES_ENDPOINT}/generate`, params);
    return extractResponseData(response);
};

export const likeTemplate = async (templateId: string, userId: string): Promise<void> => {
    const response = await apiClient.post<void>(`${TEMPLATES_ENDPOINT}/${templateId}/like?user_id=${userId}`);
    return extractResponseData(response);
};

export const unlikeTemplate = async (templateId: string, userId: string): Promise<void> => {
    const response = await apiClient.delete<void>(`${TEMPLATES_ENDPOINT}/${templateId}/like?user_id=${userId}`);
    return extractResponseData(response);
};
