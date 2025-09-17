export interface IProductForm {
  product_name: string;
  sku: string;
  category_id: string;
  tax_id: string;
  profit_margin: string;
  unit_price: string;
  stock: string;

  state: "Active" | "Inactive" | "Discontinued";
}