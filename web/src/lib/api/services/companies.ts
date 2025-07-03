import { apiClient, extractResponseData } from "../client";
import { ApiResponse, Company } from "../types";

// Companies API endpoints
const COMPANIES_ENDPOINT = "/companies";

// Get all companies
export const getCompanies = async (): Promise<Company[]> => {
  const response = await apiClient.get<ApiResponse<Company[]>>(COMPANIES_ENDPOINT);
  return extractResponseData(response).data;
};

// Get company by ID
export const getCompany = async (id: string): Promise<Company> => {
  const response = await apiClient.get<ApiResponse<Company>>(`${COMPANIES_ENDPOINT}/${id}`);
  return extractResponseData(response).data;
};

// Create company
export interface CreateCompanyParams {
  name: string;
  description?: string;
}

export const createCompany = async (params: CreateCompanyParams): Promise<Company> => {
  const response = await apiClient.post<ApiResponse<Company>>(COMPANIES_ENDPOINT, params);
  return extractResponseData(response).data;
};

// Update company
export interface UpdateCompanyParams {
  name?: string;
  description?: string;
}

export const updateCompany = async (id: string, params: UpdateCompanyParams): Promise<Company> => {
  const response = await apiClient.put<ApiResponse<Company>>(`${COMPANIES_ENDPOINT}/${id}`, params);
  return extractResponseData(response).data;
};

// Delete company
export const deleteCompany = async (id: string): Promise<void> => {
  await apiClient.delete(`${COMPANIES_ENDPOINT}/${id}`);
}; 