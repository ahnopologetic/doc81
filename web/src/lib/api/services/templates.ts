import { apiClient, extractResponseData } from "../client";
import { ApiResponse, Template, TemplateListItem } from "../types";

// Templates API endpoints
const TEMPLATES_ENDPOINT = "/templates";

// Get all templates
export const getTemplates = async (): Promise<TemplateListItem[]> => {
    const response = await apiClient.get<ApiResponse<TemplateListItem[]>>(TEMPLATES_ENDPOINT);
    return extractResponseData(response).data;
};

// Get template by path or reference
export const getTemplate = async (pathOrRef: string): Promise<Template> => {
    const response = await apiClient.get<ApiResponse<Template>>(`${TEMPLATES_ENDPOINT}/${pathOrRef}`);
    return extractResponseData(response).data;
};

// Generate template with variables
export interface GenerateTemplateParams {
    template_path: string;
    variables: Record<string, string>;
}

export const generateTemplate = async (params: GenerateTemplateParams): Promise<string> => {
    const response = await apiClient.post<ApiResponse<{ content: string }>>(`${TEMPLATES_ENDPOINT}/generate`, params);
    return extractResponseData(response).data.content;
}; 