import axios, { AxiosError } from "axios";

export const postProcessExcel = async (file: File) => {
  try {
    const fd = new FormData();
    fd.append("file", file);

    const { data } = await axios.post(
      "http://localhost:3000/api/admin/data/process/exel",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return data;
  } catch (err) {
    const axiosError = err as AxiosError<{ message: string }>;
    console.error(
      "Error al subir Excel:",
      axiosError.response?.status,
      axiosError.response?.data
    );
    throw new Error(
      axiosError.response?.data?.message || "Error al subir el archivo"
    );
  }
};
