import type { TProduct, TProductStatus } from "./TProduct";

export type TProductEndpoint = TProduct & {
  id: number;
  createdAt: string;
  updatedAt: string;
};