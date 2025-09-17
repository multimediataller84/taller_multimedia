import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const processDataService = {
  patchUpdateAllTaxes: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await axios.patch(`${API}/admin/data/update/all`, fd);
    return data;
  },

  postProcessExcel: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await axios.post(`${API}/admin/data/process/exel`, fd);
    return data;
  },
};