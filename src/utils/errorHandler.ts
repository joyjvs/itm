// Utilidades para manejo de errores

type ErrorData = {
  message?: string;
  errors?: Record<string, unknown>;
};

type ErrorResponse = {
  status?: number;
  data?: ErrorData;
};

type ErrorLike = {
  message?: string;
  status?: number;
  response?: ErrorResponse;
};

const isErrorLike = (value: unknown): value is ErrorLike => {
  return typeof value === "object" && value !== null;
};

const getStatus = (error: unknown): number | undefined => {
  if (!isErrorLike(error)) {
    return undefined;
  }

  if (typeof error.status === "number") {
    return error.status;
  }

  if (typeof error.response?.status === "number") {
    return error.response.status;
  }

  return undefined;
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  if (!isErrorLike(error)) {
    return "Ocurrió un error inesperado. Por favor, intenta nuevamente.";
  }

  if (error.message) {
    return error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  const errors = error.response?.data?.errors;
  if (typeof errors === "object" && errors !== null) {
    const firstError = Object.values(errors)[0];
    if (Array.isArray(firstError)) {
      return String(firstError[0]);
    }
    return String(firstError);
  }

  return "Ocurrió un error inesperado. Por favor, intenta nuevamente.";
};

export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!isErrorLike(error) || typeof error.response?.data?.errors !== "object" || error.response?.data?.errors === null) {
    return {};
  }

  const errors = error.response.data.errors as Record<string, unknown>;
  const fieldErrors: Record<string, string> = {};

  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages)) {
      fieldErrors[field] = String(messages[0]);
    }
  }

  return fieldErrors;
};

export const isUnauthorized = (error: unknown): boolean => {
  return getStatus(error) === 401;
};

export const isForbidden = (error: unknown): boolean => {
  return getStatus(error) === 403;
};

export const isNotFound = (error: unknown): boolean => {
  return getStatus(error) === 404;
};

export const isValidationError = (error: unknown): boolean => {
  return getStatus(error) === 400;
};

export const isServerError = (error: unknown): boolean => {
  const status = getStatus(error);
  return typeof status === "number" && status >= 500;
};
