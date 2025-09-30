import { useMemo, useState } from "react";
import type { TProductEndpoint } from "../../Product/models/types/TProductEndpoint";
import type { TInvoiceItem } from "../models/types/TInvoiceItem";
import { createItemFromProduct } from "../models/types/TInvoiceItem";

export const useInvoiceItems = () => {
  const [items, setItems] = useState<TInvoiceItem[]>([]);

  const addProduct = (product: TProductEndpoint) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product_id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, createItemFromProduct(product)];
    });
  };

  const removeItem = (product_id: number) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));
  };

  const increaseQty = (product_id: number) => {
    setItems((prev) =>
      prev.map((i) => (i.product_id === product_id ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decreaseQty = (product_id: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.product_id === product_id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
    );
  };

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.unit_price * i.qty, 0),
    [items]
  );

  return {
    items,
    addProduct,
    removeItem,
    increaseQty,
    decreaseQty,
    subtotal,
    clearItems: () => setItems([]),
  };
};
