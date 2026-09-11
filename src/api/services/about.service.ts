import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { About, AboutPayload } from "@/types/about.types";

const toFormData = (payload: AboutPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("subtitle", payload.subtitle);
  formData.append("historyTitle", payload.historyTitle);
  formData.append("historyDescription", payload.historyDescription);
  formData.append("mission", payload.mission);
  formData.append("vision", payload.vision);
  formData.append("values", JSON.stringify(payload.values));
  formData.append("teamMembers", JSON.stringify(payload.teamMembers));
  if (payload.historyImage)
    formData.append("historyImage", payload.historyImage);
  payload.teamImages?.forEach((image) => formData.append("teamImages", image));
  return formData;
};

export const aboutService = {
  getAll: async (): Promise<About[]> => {
    const response = await apiClient.get<About[]>(ENDPOINTS.ABOUT.LIST);
    return response.data;
  },
  create: async (payload: AboutPayload): Promise<About> => {
    const response = await apiClient.post<About>(
      ENDPOINTS.ABOUT.CREATE,
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
  update: async (id: string, payload: AboutPayload): Promise<About> => {
    const response = await apiClient.patch<About>(
      ENDPOINTS.ABOUT.UPDATE(id),
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};
