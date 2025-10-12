import { useState } from "react";
import apiClient from "../../Login/interceptors/apiClient";

type Rec = {
  titulo: string;
  accion: string;
  razon?: string;
  confianza?: number;
  product_id?: number | null;
};

export function useAiRecommendations() {
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function generate(payload: any) {
    setLoading(true);
    setError(null);
    setRecs([]);
    try {
      const { data } = await apiClient.post<{ recomendaciones: Rec[] }>(
        "/ai/recommendations",
        payload,
        {
          withCredentials: false,
        }
      );

      const arr = Array.isArray(data?.recomendaciones)
        ? data.recomendaciones
        : [];
      setRecs(arr);
    } catch (e: any) {
      console.error(e);
      setError("request_failed");
      setRecs([]);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, recs, error, generate, setRecs };
}