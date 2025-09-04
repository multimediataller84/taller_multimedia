import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL + "/products";

export const productService = {
  async getAll() {
    const response = await axios.get(baseUrl);
    return response.data;
  },
  async create(product: any) {
    const response = await axios.post(baseUrl, product);
    return response.data;
  },
  async update(id: number, product: any) {
    const response = await axios.put(`${baseUrl}/${id}`, product);
    return response.data;
  },
  async delete(id: number) {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
  async search(query: string) {
    const response = await axios.get(`${baseUrl}?q=${query}`);
    return response.data;
  },
};
