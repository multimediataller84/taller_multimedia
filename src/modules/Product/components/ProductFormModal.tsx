import { useState, useEffect } from "react";
import { IProduct } from "../models/interfaces/IProduct";
import { addProduct, updateProduct } from "../../../storage/productsLocal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: IProduct) => void; // refresca la tabla en el padre
  initialData?: IProduct | null;
};

// tipado local para permitir "" en inputs numericos
type ProductForm = Omit<IProduct, "id" | "cost" | "basePrice" | "stock" | "tax" | "discount"> & {
  cost: number | "";
  basePrice: number | "";
  stock: number | "";
  tax: number | "";
  discount: number | "";
};

export const ProductFormModal = ({ isOpen, onClose, onSave, initialData }: Props) => {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    category: "",
    cost: "",
    basePrice: "",
    stock: "",
    tax: "",
    discount: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        category: (initialData as any).category ?? "",
        cost: (initialData as any).cost ?? "",
        basePrice: (initialData as any).basePrice ?? "",
        stock: (initialData as any).stock ?? "",
        tax: (initialData as any).tax ?? "",
        discount: (initialData as any).discount ?? "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        cost: "",
        basePrice: "",
        stock: "",
        tax: "",
        discount: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumberField = ["cost", "basePrice", "stock", "tax", "discount"].includes(name);
    setFormData((prev) => ({
      ...prev,
      [name]: isNumberField ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const toNum = (v: number | "" | undefined) => (v === "" || v === undefined ? 0 : Number(v));
  const utilidad = toNum(formData.basePrice) - toNum(formData.cost);

  const reset = () =>
    setFormData({
      name: "",
      category: "",
      cost: "",
      basePrice: "",
      stock: "",
      tax: "",
      discount: "",
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validaciones
    if (
      !formData.name ||
      !formData.category ||
      formData.cost === "" ||
      formData.basePrice === "" ||
      formData.stock === ""
    ) {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }
    if (toNum(formData.cost) <= 0 || toNum(formData.basePrice) <= 0 || toNum(formData.stock) < 0) {
      alert("Revise los valores numericos: costo y precio base deben ser > 0.");
      return;
    }

    // payload para storage
    const payload = {
      name: formData.name,
      category: formData.category,
      cost: toNum(formData.cost),
      basePrice: toNum(formData.basePrice),
      stock: toNum(formData.stock),
      tax: formData.tax === "" ? undefined : toNum(formData.tax),
      discount: formData.discount === "" ? undefined : toNum(formData.discount),
    } as any;

    // si venimos editando, actualizamos; si no, creamos
    const editingId = (initialData as any)?.id as number | undefined;
    if (typeof editingId === "number") {
      const updated = updateProduct(editingId, payload) as unknown as IProduct | null;
      onSave(updated ? updated : { ...(initialData as any), ...payload });
    } else {
      const created = addProduct(payload) as unknown as IProduct;
      onSave(created);
    }

    onClose();
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Editar producto" : "Nuevo producto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccionar categoria</option>
            <option value="Verduras">Verduras</option>
            <option value="Frutas">Frutas</option>
            <option value="Lacteos">Lacteos</option>
            <option value="Carnes">Carnes</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Snacks">Snacks</option>
            <option value="Otros">Otros</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="cost"
              placeholder="Costo"
              value={formData.cost}
              onChange={handleChange}
              className="border p-2 rounded"
              step="0.01"
              required
            />
            <input
              type="number"
              name="basePrice"
              placeholder="Precio base"
              value={formData.basePrice}
              onChange={handleChange}
              className="border p-2 rounded"
              step="0.01"
              required
            />
          </div>

          {/* Utilidad autocalculada (no editable) */}
          <input
            type="text"
            name="profit"
            placeholder="Utilidad (auto)"
            value={Number.isFinite(utilidad) ? utilidad.toFixed(2) : ""}
            readOnly
            disabled
            className="w-full border p-2 rounded bg-gray-100 text-gray-700"
            aria-label="Utilidad (auto)"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="tax"
              placeholder="Impuesto (%) (opcional)"
              value={formData.tax}
              onChange={handleChange}
              className="border p-2 rounded"
              step="0.01"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
