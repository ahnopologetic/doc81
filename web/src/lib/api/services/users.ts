import { apiClient, extractResponseData } from "../client";
import { ApiResponse, User } from "../types";

// Users API endpoints
const USERS_ENDPOINT = "/users";

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<ApiResponse<User[]>>(USERS_ENDPOINT);
  return extractResponseData(response).data;
};

// Get user by ID
export const getUser = async (id: string): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(`${USERS_ENDPOINT}/${id}`);
  return extractResponseData(response).data;
};

// Create user
export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export const createUser = async (params: CreateUserParams): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>(USERS_ENDPOINT, params);
  return extractResponseData(response).data;
};

// Update user
export interface UpdateUserParams {
  email?: string;
  full_name?: string;
  password?: string;
}

export const updateUser = async (id: string, params: UpdateUserParams): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>(`${USERS_ENDPOINT}/${id}`, params);
  return extractResponseData(response).data;
};

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`${USERS_ENDPOINT}/${id}`);
}; 