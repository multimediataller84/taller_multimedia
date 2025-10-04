import { useEffect, useMemo, useState } from "react";
import type { TInvoiceDetail, TInvoiceDetailProduct } from "../models/types/TInvoiceDetail";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";
import { ProductService } from "../../Product/services/productService";

const productService = ProductService.getInstance();

export const useInvoiceDetail = (invoice: TInvoiceEndpoint | null) => {
  const [data, setData] = useState<TInvoiceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const products = base.products ?? [];
        const enriched: TInvoiceDetailProduct[] = await Promise.all(
          products.map(async (p) => {
            try {
              const prod = await productService.get(p.id);
              return {
                id: p.id,
                quantity: p.quantity,
                name: prod.product_name,
                sku: prod.sku,
                unit_price: Number(prod.unit_price),
                tax_id: prod.tax_id,
              } as TInvoiceDetailProduct;
            } catch {
              return { id: p.id, quantity: p.quantity } as TInvoiceDetailProduct;
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
