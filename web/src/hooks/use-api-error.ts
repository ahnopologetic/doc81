"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ErrorResponse } from "@/lib/api/types";
import axios, { AxiosError } from "axios";

interface ApiErrorState {
  message: string;
  errors: Record<string, string[]>;
  hasErrors: boolean;
}

const defaultErrorState: ApiErrorState = {
  message: "",
  errors: {},
  hasErrors: false,
};

export function useApiError() {
  const [errorState, setErrorState] = useState<ApiErrorState>(defaultErrorState);

  const handleError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorResponse = axiosError.response?.data;
      
      // Set the error state
      setErrorState({
        message: errorResponse?.message || "An unexpected error occurred",
        errors: errorResponse?.errors || {},
        hasErrors: true,
      });
      
      // Show toast for the error
      toast.error(errorResponse?.message || "An unexpected error occurred");
      
      return errorResponse;
    } else if (error instanceof Error) {
      // Handle regular JS errors
      setErrorState({
        message: error.message,
        errors: {},
        hasErrors: true,
      });
      
      toast.error(error.message);
    } else {
      // Handle unknown errors
      setErrorState({
        message: "An unexpected error occurred",
        errors: {},
        hasErrors: true,
      });
      
      toast.error("An unexpected error occurred");
    }
    
    return null;
  }, []);

  const clearErrors = useCallback(() => {
    setErrorState(defaultErrorState);
  }, []);

  const getFieldError = useCallback((fieldName: string): string | undefined => {
    const fieldErrors = errorState.errors[fieldName];
    return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : undefined;
  }, [errorState.errors]);

  return {
    ...errorState,
    handleError,
    clearErrors,
    getFieldError,
  };
} 