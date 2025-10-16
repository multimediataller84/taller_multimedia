import { useEffect, useMemo, useState } from "react";
import type { TInvoiceDetail, TInvoiceDetailProduct } from "../models/types/TInvoiceDetail";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";
import { ProductService } from "../../Product/services/productService";

const productService = ProductService.getInstance();

export const useInvoiceDetail = (invoice: TInvoiceEndpoint | null) => {
  const [data, setData] = useState<TInvoiceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type LineCandidate = {
    id?: number;
    product_id?: number;
    productId?: number;
    product?: { id?: number };
    Product?: { id?: number };
    quantity?: number;
    qty?: number;
    unit_price?: number | string;
    unitPrice?: number | string;
    price?: number | string;
    InvoiceProducts?: { quantity?: number; unit_price?: number | string };
    invoice_products?: { quantity?: number; unit_price?: number | string };
    ProductsInvoices?: { quantity?: number; unit_price?: number | string };
  };

  useEffect(() => {
    let aborted = false;
    const run = async () => {
      if (!invoice) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const base = invoice;
        const products = (base.products ?? []) as Array<LineCandidate>;
        const enriched: TInvoiceDetailProduct[] = await Promise.all(
          products.map(async (p) => {
            // Normalizar ID
            const pid: number | undefined =
              (typeof p.id === "number" && p.id) ||
              (typeof p.product_id === "number" && p.product_id) ||
              (typeof p.productId === "number" && p.productId) ||
              (typeof p.product?.id === "number" && p.product.id) ||
              (typeof p.Product?.id === "number" && p.Product.id) ||
              undefined;

            // Normalizar cantidad
            const qty: number =
              (typeof p.quantity === "number" && p.quantity) ||
              (typeof p.qty === "number" && p.qty) ||
              (typeof p.InvoiceProducts?.quantity === "number" && p.InvoiceProducts.quantity) ||
              (typeof p.invoice_products?.quantity === "number" && p.invoice_products.quantity) ||
              (typeof p.ProductsInvoices?.quantity === "number" && p.ProductsInvoices.quantity) ||
              0;

            // Precio unitario tomado de la línea si existe; si no, del catálogo
            let unitPriceFromLine: number | undefined = undefined;
            const tryNum = (v: unknown): number | undefined => {
              const n = Number(v);
              return isFinite(n) && !isNaN(n) ? n : undefined;
            };
            unitPriceFromLine =
              tryNum(p.unit_price) ??
              tryNum(p.price) ??
              tryNum(p.unitPrice) ??
              tryNum(p.InvoiceProducts?.unit_price) ??
              tryNum(p.invoice_products?.unit_price) ??
              tryNum(p.ProductsInvoices?.unit_price);

            try {
              const prod = pid ? await productService.get(pid) : undefined;
              const result: TInvoiceDetailProduct = {
                id: pid ?? (p.id as number),
                quantity: qty,
                name: prod?.product_name,
                sku: prod?.sku,
                unit_price: unitPriceFromLine ?? (prod ? Number(prod.unit_price) : undefined),
                tax_id: prod?.tax_id,
              };
              return result;
            } catch {
              const result: TInvoiceDetailProduct = {
                id: pid ?? (p.id as number),
                quantity: qty,
                unit_price: unitPriceFromLine,
              };
              return result;
            }
          })
        );
        const detail: TInvoiceDetail = {
          ...base,
          products: enriched,
        } as TInvoiceDetail;
        if (!aborted) setData(detail);
      } catch (e) {
        if (!aborted) setError("No se pudo cargar la factura");
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    run();
    return () => {
      aborted = true;
    };
  }, [invoice]);

  const totals = useMemo(() => {
    const subtotal = data?.subtotal != null ? Number(data.subtotal) : undefined;
    const total = data?.total != null ? Number(data.total) : undefined;
    const tax_total = data?.tax_total != null ? Number(data.tax_total) : undefined;
    return { subtotal, total, tax_total };
  }, [data]);

  return { data, loading, error, totals };
};
