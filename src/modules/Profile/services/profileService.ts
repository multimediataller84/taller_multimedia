import apiClient from "../../Login/interceptors/apiClient";
import { IProfileServices } from "../models/interfaces/IProfileServices";
import { TUser } from "../models/types/TUser";

import { TUserEndpoint } from "../models/types/TUserEndpoint";

export class ProfileService implements IProfileServices {
  public static instance: ProfileService;

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  get = async (id: number): Promise<TUserEndpoint> => {
    try {
      const response = await apiClient.get<TUserEndpoint>(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };

  getAll = async (): Promise<TUserEndpoint[]> => {
    try {
      const response = await apiClient.get<TUserEndpoint[]>(`/user/all`);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };

  post = async (data: TUser): Promise<TUserEndpoint> => {
    try {
      const response = await apiClient.post<TUserEndpoint>(
        `/auth/register`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };

  patch = async (id: number, data: TUser): Promise<TUserEndpoint> => {
    try {
      const response = await apiClient.patch<TUserEndpoint>(
        `/user/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };

  delete = async (id: number): Promise<TUserEndpoint> => {
    try {
      const response = await apiClient.delete<TUserEndpoint>(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };
}
