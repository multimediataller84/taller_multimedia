// src/modules/Product/services/productService.ts
import apiClient from "../../Login/interceptors/apiClient";

const basePath = "/product";

export const productService = {
  async getAll() {
    const { data } = await apiClient.get(`${basePath}/all`);
    return data;
  },

  async getById(id: number) {
    const { data } = await apiClient.get(`${basePath}/${id}`);
    return data;
  },

  async create(product: any) {
    const { data } = await apiClient.post(basePath, product);
    return data;
  },

  async update(id: number, product: any) {
    const { data } = await apiClient.patch(`${basePath}/${id}`, product);
    return data;
  },

  async delete(id: number) {
    const { data } = await apiClient.delete(`${basePath}/${id}`);
    return data;
  },

  async search(query: string) {
    console.warn("Search no implementado en backend, devolviendo todos los productos");
    return this.getAll();
  },
};
