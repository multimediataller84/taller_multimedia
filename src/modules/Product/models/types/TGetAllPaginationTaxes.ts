import { TTaxEndpoint } from "./TTaxEndpoint";

export type TGetAllPaginationTaxes = {
  data: TTaxEndpoint[],
  total: number;
}