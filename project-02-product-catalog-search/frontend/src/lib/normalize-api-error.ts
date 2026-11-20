import axios from "axios";

import { ApiError } from "../types/api-error";

interface BackendErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

export const normalizeApiError = (error: unknown): ApiError => {
  // Handle Axios errors.
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data;

    // Network error: no response from backend.
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return new ApiError("The request timed out. Please try again.");
      }

      return new ApiError(
        "Unable to connect to the server. Check your connection and try again.",
      );
    }

    // Backend validation errors can contain multiple messages.
    if (Array.isArray(responseData?.message)) {
      return new ApiError(
        responseData.message.join(". "),
        status,
        responseData.message,
      );
    }

    if (typeof responseData?.message === "string") {
      return new ApiError(responseData.message, status);
    }

    return new ApiError(
      error.message || "An unexpected API error occurred.",
      status,
    );
  }

  // Handle ordinary JavaScript errors.
  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("An unexpected error occurred.");
};
