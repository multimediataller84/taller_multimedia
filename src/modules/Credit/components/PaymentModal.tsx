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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-[360px] shadow-xl">
        <h3 className="font-Lato text-lg mb-4">{title}</h3>

        <div className="mb-4">
          <label className="block text-sm mb-2">Fecha y hora</label>
          <input
            type="text"
            readOnly
            value={nowText}
            className="w-full h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-gray-100 font-medium text-base"
          />
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm mb-2">Monto (₡)</label>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              className="w-full h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base focus:outline-blue-500 focus:outline-2"
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
              type="button"
              onClick={onClose}
              className="w-[94px] py-2 rounded-3xl bg-[#FF4747] border border-[#FF4747] hover:bg-[#D32626] text-white font-Lato font-bold transition duration-300"
            >
              Abandonar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-[94px] py-2 rounded-3xl bg-blue-500 border border-blue-500 text-white font-Lato font-bold transition duration-300 hover:bg-blue-800 hover:border-blue-800 disabled:opacity-60"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
