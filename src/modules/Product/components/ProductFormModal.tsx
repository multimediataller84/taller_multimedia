import { useProductForm } from "../hooks/useProductModal";
import { TProduct } from "../models/types/TProduct";
import { TProductEndpoint } from "../models/types/TProductEndpoint";
import { ProductFormInputs } from "../models/types/TProductsForm";
import ConfirmDialog from "../../Credit/components/ConfirmDialog";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData: TProductEndpoint | null;
  onSave?: (payload: TProduct) => Promise<void>;
  onChange: () => void;
};

export const ProductFormModal = ({ isOpen, onClose, initialData, onChange }: Props) => {

  const [visibleConfirmDialog, setVisibleConfirmDialog] = useState(false); 

  const {
    register,
    handleSubmit,
    formattedCategoryOptions,
    formattedTaxesOptions,
    formattedUnitOptions,
    skuStatus,
    setSkuStatus,
    submit,
    isEditing,
  } = useProductForm(initialData, isOpen);

    const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    mode: "", // "create" o "edit"
    payload: null as any,
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ProductFormInputs & { cost: string }) => {
    await submit(data);
    await onChange();
    onClose();
  };

  const handleOpenConfirm = (mode: "create" | "edit") => {
    setConfirmDialog({
      open: true,
      mode,
      payload: null,
    });
  };

  return (
   
  <div className="fixed inset-0 z-50 flex items-center justify-center">
  <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

    <div className="relative z-100 bg-gray3 rounded-2xl shadow-lg w-[60%] sm:w-[70%] md:w-[50%] lg:w-1/3 2xl:w-1/4 p-6 max-h-[90vh] overflow-y-auto ">

    <div className="flex flex-col">
      <div className="justify-between flex">
       <h2 className="text-base sm:text-xl font-semibold">
          {initialData ? "Editar producto" : "Nuevo producto"}
        </h2>
        <button onClick={onClose}
        className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
        >
        Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-col flex space-y-2">
         <div className="flex flex-col space-y-1">
            <label className="text-sm sm:text-base text-black font-medium">Nombre</label>
            <input
              {...register("product_name", { required: true })}
              placeholder="Ej. Lápiz HB"
              className="w-full py-2 border rounded-3xl px-4 text-gray1 bg-white border-gray2 text-sm sm:text-base transition-colors focus:outline-2 focus:outline-blue-500"
            />
         </div>

         <div className="flex flex-col space-y-1">
            <label className="text-sm sm:text-base text-black font-medium">SKU</label>
          
            <input
              {...register("sku", {
                required: true,
                pattern: /^[A-Z0-9-]+$/,
              })}
              onChange={() => setSkuStatus("idle")}
              placeholder="Ej. LPZ-HB-01"
              className="w-full py-2 border rounded-3xl px-4 text-gray1 bg-white border-gray2 text-sm sm:text-base transition-colors focus:outline-2 focus:outline-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm sm:text-base text-black font-medium">
            Categoría{" "}
            {isEditing && (
              <span className="text-sm sm:text-base text-black font-medium">(no editable)</span>
            )}
            </label>
            <div className="relative">
            {formattedCategoryOptions.length > 0 && (
              <select
                {...register("category_id", { required: true })}
                disabled={isEditing}
                className="disabled:bg-gray2 appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
              >
                <option value="">Seleccione categoría</option>
                {formattedCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
              <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
            </svg>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm sm:text-base text-black font-medium">
            Impuesto{" "}
            {isEditing && (
              <span className="text-sm sm:text-base text-black font-medium">(no editable)</span>
            )}
            </label>
            <div className="relative">
            <select
            {...register("tax_id", { required: true })}
            disabled={isEditing}
              className="disabled:bg-gray2 appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
            >
              <option value="">Seleccione impuesto</option>
              {formattedTaxesOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
              <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm sm:text-base text-black font-medium">
            Unidad de medida
            </label>
            <div className="relative">
            <select
              {...register("unit_measure_id")}
              className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
            >
              <option value="">Seleccione unidad</option>
              {formattedUnitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                </svg>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm sm:text-base text-black font-medium">
              Utilidad (%)
            </label>
            <input
              type="number"
              step="1"
              {...register("profit_margin", { required: true })}
              placeholder="0"
              className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-1">
              <label className="text-sm sm:text-base text-black font-medium">Costo</label>
              <input
                type="number"
                step="0.01"
                {...register("cost", { required: true })}
                placeholder="0.00"
                className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
              />
          </div>
          
          <div className="flex flex-col space-y-1">
              <label className="text-sm sm:text-base text-black font-medium">
              Precio unitario
              </label>
              <input
              type="number"
              step="0.01"
              {...register("unit_price", { required: true })}
              placeholder="0.00"
              className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-1">
          <label className="text-sm sm:text-base text-black font-medium">
            Stock
          </label>
          <input
            type="number"
            {...register("stock", { required: true })}
            placeholder="0"
            className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
          />
          </div>
          
          <button
              type="button"
              className="py-2 rounded-3xl px-2 md:px-3 w-full text-xs sm:text-sm md:text-base font-Lato font-bold bg-blue-500 hover:bg-blue-800 text-white disabled:opacity-50"
              disabled={skuStatus === "dup" || skuStatus === "checking"}
              onClick={() => {
                handleOpenConfirm(isEditing ? "edit" : "create");
              }}
            >
              {isEditing ? "Guardar cambios" : "Crear producto"}
            </button>         
      </form>
    </div>
  </div>

        <div className="z-100">
        <ConfirmDialog
        open={confirmDialog.open}
        onCancel={() => setConfirmDialog({ open: false, mode: "", payload: null })}
        onConfirm={() => {
          handleSubmit(async (data) => {
            await onSubmit(data); // ejecuta el submit del formulario
            setConfirmDialog({ open: false, mode: "", payload: null }); // ✅ lo cierra después
          })();
        }}
        title={
          confirmDialog.mode === "edit"
            ? "¿Guardar cambios?"
            : "¿Crear nuevo producto?"
        }
        message={
          confirmDialog.mode === "edit"
            ? "¿Seguro que deseas guardar los cambios de este producto?"
            : "¿Seguro que deseas crear este nuevo producto?"
        }
        confirmLabel={confirmDialog.mode === "edit" ? "Guardar" : "Crear"}
        cancelLabel="Cancelar"
        />
        </div>
        
</div>
  );
};
