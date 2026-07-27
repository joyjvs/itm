// URLs base y endpoints de la API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },

  // Projects
  PROJECTS: {
    LIST: (page: number, limit: number) =>
      `/api/projects?page=${page}&limit=${limit}`,
    CREATE: "/api/projects",
    DETAIL: (id: string) => `/api/projects/${id}`,
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
    ADD_MEMBER: (id: string) => `/api/projects/${id}/members`,
    REMOVE_MEMBER: (id: string, memberId: string) =>
      `/api/projects/${id}/members/${memberId}`,
  },

  // Tasks
  TASKS: {
    LIST: (projectId: string, page: number, limit: number) =>
      `/api/tasks/project/${projectId}?page=${page}&limit=${limit}`,
    CREATE: "/api/tasks",
    DETAIL: (id: string) => `/api/tasks/${id}`,
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
    UPDATE_STATUS: (id: string) => `/api/tasks/${id}/status`,
    UPDATE_PRIORITY: (id: string) => `/api/tasks/${id}/priority`,
  },

  // Users
  USERS: {
    LIST: "/api/users",
    DETAIL: (id: string) => `/api/users/${id}`,
    CREATE: "/api/users",
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
};
