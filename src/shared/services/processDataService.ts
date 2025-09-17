import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const processDataService = {

  postProcessExcel: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await axios.post(`${API}/admin/data/process/exel`, fd);
    return data;
  },
};