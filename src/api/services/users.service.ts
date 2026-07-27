import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "../../types/auth.types";

const unwrapData = <T>(responseData: unknown): T => {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as { data: T }).data;
  }

  return responseData as T;
};

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await axiosClient.get(ENDPOINTS.USERS.LIST);
    return unwrapData<User[]>(response.data);
  },

  async getById(id: string): Promise<User> {
    const response = await axiosClient.get(ENDPOINTS.USERS.DETAIL(id));
    return unwrapData<User>(response.data);
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await axiosClient.post(ENDPOINTS.USERS.CREATE, payload);
    return unwrapData<User>(response.data);
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const response = await axiosClient.patch(
      ENDPOINTS.USERS.UPDATE(id),
      payload,
    );
    return unwrapData<User>(response.data);
  },

  async delete(id: string): Promise<void> {
    await axiosClient.delete(ENDPOINTS.USERS.DELETE(id));
  },
};
