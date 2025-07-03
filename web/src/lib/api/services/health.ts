import { apiClient, extractResponseData } from "../client";
import { ApiResponse, HealthCheckResponse } from "../types";

// Health API endpoint
const HEALTH_ENDPOINT = "/health";

// Get health status
export const getHealthStatus = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<ApiResponse<HealthCheckResponse>>(HEALTH_ENDPOINT);
  return extractResponseData(response).data;
}; 