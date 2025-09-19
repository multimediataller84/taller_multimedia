import { IProfileRepository } from "../models/interfaces/IProfileRepository";
import { TUser } from "../models/types/TUser";
import { TUserEndpoint } from "../models/types/TUserEndpoint";
import { ProfileService } from "../services/profileService";

export class ProfileRepository implements IProfileRepository {
  public static instance: ProfileRepository;
  private readonly profileService = ProfileService.getInstance();

  static getInstance(): ProfileRepository {
    if (!ProfileRepository.instance) {
      ProfileRepository.instance = new ProfileRepository();
    }
    return ProfileRepository.instance;
  }

  async get(id: number): Promise<TUserEndpoint> {
    try {
      const response = await this.profileService.get(id);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  }

  async getAll(): Promise<TUserEndpoint[]> {
    try {
      const response = await this.profileService.getAll();
      return response;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  }

  async post(data: TUser): Promise<TUserEndpoint> {
    try {
      const response = await this.profileService.post(data);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  }

  async patch(id: number, data: TUser): Promise<TUserEndpoint> {
    try {
      const response = await this.profileService.patch(id, data);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  }

  async delete(id: number): Promise<TUserEndpoint> {
    try {
      const response = await this.profileService.delete(id);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  }
}
