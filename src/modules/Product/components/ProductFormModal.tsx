import { Controller } from "react-hook-form";
import Select from "react-select";
import { useProductForm } from "../hooks/useProductModal";
import { TProduct } from "../models/types/TProduct";
import { TProductEndpoint } from "../models/types/TProductEndpoint";
import { ProductFormInputs } from "../models/types/TProductsForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData: TProductEndpoint | null;
  onSave?: (payload: TProduct) => Promise<void>;
  onChange: () => void;
};

export const ProductFormModal = ({ isOpen, onClose, initialData, onChange }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formattedCategoryOptions,
    formattedTaxesOptions,
    skuStatus,
    setSkuStatus,
    submit,
    isEditing,
  } = useProductForm(initialData, isOpen);

  if (!isOpen) return null;

  const onSubmit = async (data: ProductFormInputs & { cost: string }) => {
    await submit(data);
    await onChange();
    onClose();
  };

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-[520px]">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Editar producto" : "Nuevo producto"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Nombre */}
          <label className="block text-sm text-gray-700 font-medium">Nombre</label>
          <input
            {...register("product_name", { required: true })}
            placeholder="Ej. Lápiz HB"
            className="w-full border p-2 rounded"
          />

          {/* SKU */}
          <label className="block text-sm text-gray-700 font-medium">SKU</label>
          <div className="flex gap-2">
            <input
              {...register("sku", {
                required: true,
                pattern: /^[A-Z0-9-]+$/,
              })}
              onChange={() => setSkuStatus("idle")}
              placeholder="Ej. LPZ-HB-01"
              className="flex-1 border p-2 rounded"
            />
          </div>

          {/* Categoría (bloqueada al editar) */}
          <label className="block text-sm text-gray-700 font-medium">
            Categoría {isEditing && <span className="text-xs text-gray-500">(no editable)</span>}
          </label>
          <Controller
            name="category_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={formattedCategoryOptions}
                placeholder="Seleccione categoría"
                onChange={(opt) => field.onChange((opt as any)?.value)}
                value={
                  formattedCategoryOptions.find((option) => option.value === field.value) || null
                }
                isDisabled={isEditing}
              />
            )}
          />

          {/* Impuesto (bloqueado al editar) */}
          <label className="block text-sm text-gray-700 font-medium">
            Impuesto {isEditing && <span className="text-xs text-gray-500">(no editable)</span>}
          </label>
          <Controller
            name="tax_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={formattedTaxesOptions}
                placeholder="Seleccione impuesto"
                onChange={(opt) => field.onChange((opt as any)?.value)}
                value={
                  formattedTaxesOptions.find((option) => option.value === field.value) || null
                }
                isDisabled={isEditing}
              />
            )}
          />

          {/* Utilidad */}
          <label className="block text-sm text-gray-700 font-medium">
            Utilidad
          </label>
          <input
            type="number"
            step="1"
            {...register("profit_margin", { required: true })}
            placeholder="0"
            className="w-full border p-2 rounded"
          />

          {/*  Costo  */}
          <label className="block text-sm text-gray-700 font-medium">Costo</label>
          <input
            type="number"
            step="0.01"
            {...register("cost", { required: true })}
            placeholder="0.00"
            className="w-full border p-2 rounded"
          />

          {/* Precio unitario */}
          <label className="block text-sm text-gray-700 font-medium">Precio unitario</label>
          <input
            type="number"
            step="0.01"
            {...register("unit_price", { required: true })}
            placeholder="0.00"
            className="w-full border p-2 rounded"
          />

          {/* Stock */}
          <label className="block text-sm text-gray-700 font-medium">Stock</label>
          <input
            type="number"
            {...register("stock", { required: true })}
            placeholder="0"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              disabled={skuStatus === "dup" || skuStatus === "checking"}
            >
              {isEditing ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
