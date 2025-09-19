import { api } from "./apiClient";

const SHOULD_CONTINUE = new Set([404, 405]);

export async function getWithFallback<T = any>(paths: string[], params?: Record<string, any>) {
  let lastErr: any;
  for (const p of paths) {
    try {
      const { data } = await api.get<T>(p, { params });
      return data;
    } catch (e: any) {
      const status = e?.response?.status;
      if (!SHOULD_CONTINUE.has(status)) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function postWithFallback<T = any>(candidates: Array<{ path: string; body?: any }>) {
  let lastErr: any;
  for (const { path, body } of candidates) {
    try {
      const { data } = await api.post<T>(path, body ?? {});
      return data;
    } catch (e: any) {
      const status = e?.response?.status;
      if (!SHOULD_CONTINUE.has(status)) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}