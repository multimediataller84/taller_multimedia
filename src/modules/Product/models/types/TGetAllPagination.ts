import { TProductEndpoint } from "./TProductEndpoint";

export type TGetAllPagination = {
  data: TProductEndpoint[],
  total: number;
}