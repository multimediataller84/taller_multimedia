import { TGetAllOptions } from "../../../../models/types/TGetAllOptions";
import { TCategoryEndpoint } from "../types/TCategoryEndpoint";
import { TGetAllPagination } from "../types/TGetAllPagination";
import { TGetAllPaginationTaxes } from "../types/TGetAllPaginationTaxes";
import { TProduct } from "../types/TProduct";
import { TProductEndpoint } from "../types/TProductEndpoint";
import { TUnitMeasure } from "../types/TUnitMeasure";

export interface IProductRepository {
  get: (id: number) => Promise<TProductEndpoint>;
  getAll: (options: TGetAllOptions) => Promise<TGetAllPagination>;
  getAllCategories: () => Promise<TCategoryEndpoint[]>;
  getAllTaxes: (options: TGetAllOptions) => Promise<TGetAllPaginationTaxes>;
  getAllMeasure: () => Promise<TUnitMeasure[]>;
  post: (data: TProduct) => Promise<TProductEndpoint>;
  patch: (id: number, data: TProduct) => Promise<TProductEndpoint>;
  delete: (id: number) => Promise<TProductEndpoint>;
}
