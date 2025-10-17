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
    formattedUnitOptions,
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
      <div className="bg-white p-6 rounded-lg w-[520px] space-y-4">

        <div className="flex w-full items-center justify-between">
          {/* Título */}
          <h2 className="text-xl font-semibold">
            {initialData ? "Editar producto" : "Nuevo producto"}
          </h2>

          {/* Botones alineados a la derecha */}
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="px-5 py-2 rounded-3xl bg-blue-500 text-white font-medium hover:bg-blue-800 
              transition duration-300 disabled:opacity-50"
              disabled={skuStatus === "dup" || skuStatus === "checking"}
            >
              {isEditing ? "Guardar cambios" : "Crear producto"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-3xl bg-black text-white font-medium 
              border border-black hover:bg-gray-700 hover:border-gray-700 transition duration-300"
            >
              Cancelar
            </button>
          </div>
        </div>

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
            Categoría {isEditing && <span className="text-xs text-gray-500"></span>}
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
                isClearable
                classNamePrefix="select"
              />
            )}
          />

          {/* Impuesto (bloqueado al editar) */}
          <label className="block text-sm text-gray-700 font-medium">
            Impuesto {isEditing && <span className="text-xs text-gray-500"></span>}
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
                isClearable
                classNamePrefix="select"
              />
            )}
          />

          {/* Unidad de medida */}
          <label className="block text-sm text-gray-700 font-medium">Unidad de medida</label>
          <Controller
            name="unit_measure_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={formattedUnitOptions}
                placeholder="Seleccione unidad"
                onChange={(opt) => field.onChange((opt as any)?.value ?? "")}
                value={
                  formattedUnitOptions.find((option) => option.value === field.value) || null
                }
                isClearable
                classNamePrefix="select"
              />
            )}
          />

          {/* Utilidad */}
          <label className="block text-sm text-gray-700 font-medium">
            Utilidad <span className="text-xs text-gray-500">(en %)</span>
          </label>
          <input
            type="number"
            step="1"
            {...register("profit_margin", { required: true })}
            placeholder="0"
            className="w-full border p-2 rounded"
          />

          {/* Costo (editable) */}
          <label className="block text-sm text-gray-700 font-medium">Costo</label>
          <input
            type="number"
            step="0.01"
            {...register("cost", { required: true })}
            placeholder="0.00"
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-500 -mt-2"></p>

          {/* Precio final (calculado) */}
          <label className="block text-sm text-gray-700 font-medium">
            Precio final (calculado)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("unit_price", { required: true })}
            placeholder="0.00"
            className="w-full border p-2 rounded bg-gray-100"
            readOnly
          />
          <p className="text-xs text-gray-500 -mt-2"></p>

          {/* Stock */}
          <label className="block text-sm text-gray-700 font-medium">Stock</label>
          <input
            type="number"
            {...register("stock", { required: true })}
            placeholder="0"
            className="w-full border p-2 rounded"
          />
          
        </form>
      </div>
    </div>
  );
};
