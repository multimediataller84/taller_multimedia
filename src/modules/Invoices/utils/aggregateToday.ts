export type Product = { id: number; name: string; category_id?: number; price?: number };
export type Invoice = { id: number; createdAt: string };
export type InvoiceProduct = { invoice_id: number; product_id: number; quantity: number };

export function aggregateSalesToday(products: Product[], invoices: Invoice[], invoiceProducts: InvoiceProduct[]) {
  const todayInvoiceIds = new Set(invoices.map(i => i.id));
  const byProduct: Record<number, number> = {};

  for (const ip of invoiceProducts) {
    if (todayInvoiceIds.has(ip.invoice_id)) {
      byProduct[ip.product_id] = (byProduct[ip.product_id] || 0) + (ip.quantity || 0);
    }
  }

  const summary = products.map(p => ({
    product_id: p.id,
    name: p.name,
    qty_today: byProduct[p.id] || 0
  }));

  return { summary };
}