import { useEffect, useState } from "react";
import type { IProductForm } from "../models/interfaces/IProductForm";
import { formToDomain, endpointToForm } from "../adapters/productAdapter";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: TProduct) => void;
  initialData?: TProductEndpoint | null;
  generateSku: (seed?: { product_name?: string; category_id?: string | number }) => string;
  categories: Array<{ id: number; name: string }>;
  taxes: Array<{ id: number; name: string; percentage: number }>;
};

export const ProductFormModal = ({
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  generateSku,
  categories,
  taxes,
}: Props) => {
  const [form, setForm] = useState<IProductForm>({
    product_name: "",
    sku: "",
    category_id: "",
    tax_id: "",
    profit_margin: "",
    unit_price: "",
    stock: "",
    state: "Active",
  });

  const EMPTY: IProductForm = {
  product_name: "", sku: "", category_id: "", tax_id: "",
  profit_margin: "", unit_price: "", stock: "", state: "Active",
  };

  const [skuStatus, setSkuStatus] = useState<"idle"|"checking"|"ok"|"dup">("idle");
  const [skuMsg, setSkuMsg] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm(endpointToForm(initialData));
    } else {
      setForm(EMPTY);
    }
    setSkuStatus("idle");
    setSkuMsg("");
  }, [isOpen, initialData]);

  const handleClose = () => {
    setForm(EMPTY);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "sku") setSkuStatus("idle");
  };

  const handleAutoSku = async () => {
    const sku = generateSku({
    product_name: form.product_name,
    category_id: form.category_id,
  });
  setForm(prev => ({ ...prev, sku }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formToDomain(form));
    setForm(EMPTY);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-[520px]">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Editar producto" : "Nuevo producto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border p-2 rounded"
            required
          />

          {/* SKU con botón Auto */}
          <div className="relative">
              <input
                name="sku"
                value={form.sku}
                onChange={(e) => setForm(f => ({ ...f, sku: e.target.value.toUpperCase() }))}
                placeholder="SKU"
                pattern="^[A-Z0-9\-]+$"
                title="Solo mayúsculas, números y guiones (A-Z, 0-9, -)"
                required
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                onClick={handleAutoSku}
                className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
                title="Generar SKU"
              >
                Auto
              </button>
          </div>

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccione categoría</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            name="tax_id"
            value={form.tax_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccione impuesto</option>
            {taxes.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.percentage}%)
              </option>
            ))}
          </select>

          <input
            type="number"
            step="0.01"
            name="profit_margin"
            value={form.profit_margin}
            onChange={handleChange}
            placeholder="Utilidad (ej. 0.25)"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            step="0.01"
            name="unit_price"
            value={form.unit_price}
            onChange={handleChange}
            placeholder="Precio unitario (₡)"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Active">Activo</option>
            <option value="Inactive">Inactivo</option>
            <option value="Discontinued">Descontinuado</option>
          </select>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              disabled={skuStatus === "dup" || skuStatus === "checking"}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};