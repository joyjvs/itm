import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  AddMemberPayload,
} from "../../types/project.types";
import { PaginatedResponse } from "@/types/pagination.types";

const unwrapData = <T>(responseData: unknown): T => {
  let current = responseData;

  while (current && typeof current === "object") {
    if ("data" in current) {
      current = (current as { data: unknown }).data;
      continue;
    }

    if ("project" in current) {
      current = (current as { project: unknown }).project;
      continue;
    }

    break;
  }

  return current as T;
};

const ensureProjectId = (project: Project, fallbackId: string): Project => ({
  ...project,
  id: project.id || fallbackId,
  members: project.members ?? [],
});

export const projectsService = {
  async getAll(
    _userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Project>> {
    const response = await axiosClient.get(
      ENDPOINTS.PROJECTS.LIST(page, limit),
    );
    // Asumimos que la API devuelve la paginación directamente en la respuesta
    // Si la estructura es { data: [...], meta: {...} }, usamos eso
    // Si la estructura es { data: [...], total: ..., page: ..., limit: ..., totalPages: ... }, extraemos esos campos
    const responseData = response.data;
    const projects = responseData.data || responseData;
    const totalItems =
      responseData.total || responseData.meta?.totalItems || projects.length;
    const totalPages =
      responseData.totalPages ||
      responseData.meta?.totalPages ||
      Math.ceil(totalItems / limit);

    return {
      data: projects,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalPages || 1, // Evitar NaN
        hasNextPage: page < (totalPages || 1),
        hasPrevPage: page > 1,
      },
    };
  },

  async getById(id: string): Promise<Project> {
    const response = await axiosClient.get(ENDPOINTS.PROJECTS.DETAIL(id));
    return ensureProjectId(unwrapData<Project>(response.data), id);
  },

  async create(payload: CreateProjectPayload): Promise<Project> {
    const response = await axiosClient.post(ENDPOINTS.PROJECTS.CREATE, payload);
    const project = unwrapData<Project>(response.data);
    return project.id ? project : { ...project, members: project.members ?? [] };
  },

  async update(id: string, payload: UpdateProjectPayload): Promise<Project> {
    const response = await axiosClient.put(
      ENDPOINTS.PROJECTS.UPDATE(id),
      payload,
    );
    return ensureProjectId(unwrapData<Project>(response.data), id);
  },

  async delete(_userId: string, id: string): Promise<void> {
    await axiosClient.delete(ENDPOINTS.PROJECTS.DELETE(id));
  },

  async addMember(
    _userId: string,
    projectId: string,
    payload: AddMemberPayload,
  ): Promise<Project> {
    const response = await axiosClient.post(
      ENDPOINTS.PROJECTS.ADD_MEMBER(projectId),
      payload,
    );

    return ensureProjectId(unwrapData<Project>(response.data), projectId);
  },

  async removeMember(
    _userId: string,
    projectId: string,
    memberId: string,
  ): Promise<void> {
    await axiosClient.delete(
      ENDPOINTS.PROJECTS.REMOVE_MEMBER(projectId, memberId),
    );
  },
};
