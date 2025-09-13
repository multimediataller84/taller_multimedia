import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const processDataService = {
  patchUpdateAllTaxes: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await axios.patch(`${API}/admin/data/update/all`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  postProcessExcel: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await axios.post(`${API}/admin/data/process/exel`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};