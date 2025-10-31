import { useForm } from "react-hook-form";
import { useMemo } from "react";

type Props = {
  open: boolean;
  title?: string;
  maxAmount?: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

type FormValues = { amount: number };

export default function PaymentModal({ open, title = "Abonar a factura", maxAmount, onClose, onConfirm }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    defaultValues: { amount: 0 }
  });

  const nowText = useMemo(() => {
    const now = new Date();
    return now.toLocaleString("es-CR", { dateStyle: "short", timeStyle: "short" });
  }, [open]);

  if (!open) return null;

  const submit = (data: FormValues) => {
    onConfirm(Number(data.amount));
    reset({ amount: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

        <div className="relative z-100 bg-gray3 rounded-2xl shadow-lg w-[60%] sm:w-[70%] md:w-[50%] lg:w-1/3 2xl:w-1/4 p-6 max-h-[90vh] overflow-y-auto space-y-2">

        <h3 className="text-base sm:text-xl font-semibold">{title}</h3>

        <div className="flex flex-col space-y-1">
          <label className="text-sm sm:text-base text-black font-medium">Fecha y hora</label>
          <div className="relative">
          <input
            type="text"
            readOnly
            value={nowText}
              className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 bg-gray2 border-gray2 text-sm sm:text-base focus:outline-0 "
          />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1">
              <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="amount" className="text-sm sm:text-base text-black font-medium">Monto (₡)</label>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              className="appearance-none w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
              {...register("amount", {
                required: true,
                min: 0.01,
                validate: (v) => {
                  const okDecimals = /^\d+(\.\d{1,2})?$/.test(String(v));
                  if (!okDecimals) return "dec";
                  if (maxAmount !== undefined && Number(v) > maxAmount) return "max";
                  return true;
                }
              })}
            />
            {errors.amount?.type === "dec" && (
              <span className="text-red-600 mt-2 text-sm">El monto ingresado es inválido</span>
            )}
            {errors.amount?.type === "max" && (
              <span className="text-red-600 mt-2 text-sm">El monto excede el máximo permitido</span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base bg-blue-500 border border-blue-500 text-white font-Lato font-bold transition duration-300 hover:bg-blue-800 hover:border-blue-800 disabled:opacity-60"
            >
              Confirmar
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}
