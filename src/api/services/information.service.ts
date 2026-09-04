import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Information,
  InformationPayload,
} from "@/types/information.types";

const toFormData = (payload: InformationPayload) => {
  const formData = new FormData();
  formData.append("address", payload.address);
  formData.append("phone", payload.phone);
  formData.append("email", payload.email);
  formData.append("businessHours", payload.businessHours);
  formData.append("socialNetworks", JSON.stringify(payload.socialNetworks));
  if (payload.logo) formData.append("logo", payload.logo);
  return formData;
};

export const informationService = {
  getAll: async (): Promise<Information[]> => {
    const response = await apiClient.get<Information[]>(
      ENDPOINTS.INFORMATION.LIST,
    );
    return response.data;
  },

  create: async (payload: InformationPayload): Promise<Information> => {
    const response = await apiClient.post<Information>(
      ENDPOINTS.INFORMATION.CREATE,
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  update: async (
    id: string,
    payload: InformationPayload,
  ): Promise<Information> => {
    const response = await apiClient.patch<Information>(
      ENDPOINTS.INFORMATION.UPDATE(id),
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};
