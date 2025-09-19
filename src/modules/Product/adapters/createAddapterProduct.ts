import { TProduct } from "../models/types/TProduct";
import { TProductEndpoint } from "../models/types/TProductEndpoint";

export const createAddapterProduct = (user: TProductEndpoint): TProduct => {
  return {
    product_name: user.product_name,
    sku: user.sku,
    category_id: user.category_id,
    tax_id: user.tax_id,
    profit_margin: user.profit_margin,
    unit_price: user.unit_price,
    stock: user.stock,
    state: user.state
  };
};
