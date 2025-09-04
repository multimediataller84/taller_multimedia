import { useState, useEffect } from "react";
import { IProduct } from "../models/interfaces/IProduct";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: IProduct) => void;
  initialData?: IProduct | null;
};

export const ProductFormModal = ({ isOpen, onClose, onSave, initialData }: Props) => {
  const [formData, setFormData] = useState<IProduct>({
  name: "",
  category: "",
  cost: "" as unknown as number,
  basePrice: "" as unknown as number,
  stock: "" as unknown as number,
  tax: "" as unknown as number,
  discount: "" as unknown as number,
});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: (name === "cost" || name === "basePrice" || name === "stock" || name === "tax" || name === "discount")
      ? (value === "" ? "" : Number(value))
      : value,
  });
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.cost || !formData.basePrice || !formData.stock) {
    alert("Por favor complete todos los campos obligatorios.");
    return;
    }
    onSave(formData);
    onClose();
    setFormData({
    name: "",
    category: "",
    cost: "" as unknown as number,
    basePrice: "" as unknown as number,
    stock: "" as unknown as number,
    tax: "" as unknown as number,
    discount: "" as unknown as number,
  });
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
            <option value="">Seleccionar categoría</option>
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
              required
            />
            <input
              type="number"
              name="basePrice"
              placeholder="Precio base"
              value={formData.basePrice}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="tax"
              placeholder="Impuesto (%) (opcional)"
              value={formData.tax}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
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
