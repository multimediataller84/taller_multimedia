import { useForm } from "react-hook-form";

type Props = {
  clientName: string;
  onCreate: (amount: number) => void;
};

type FormValues = { amount: number };

export default function CreditAssignForm({ clientName, onCreate }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { amount: 0 }
  });

  const onSubmit = (data: FormValues) => onCreate(Number(data.amount));

  return (
    <div className="p-8">
      <h3 className="font-Lato text-lg mb-6">
        Monto aprobado para credito del cliente: <span className="font-bold">{clientName}</span>
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-4">
        <div className="flex flex-col">
          <label htmlFor="amount" className="mb-2 text-base">ej: 150 000.00</label>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0.00"
            className="w-[220px] h-[34px] border rounded-2xl px-4 text-gray1 border-gray2 bg-white font-medium text-base focus:outline-blue-500 focus:outline-2"
            {...register("amount", {
              required: true,
              min: 0.01,
              validate: (v) => /^\d+(\.\d{1,2})?$/.test(String(v)) || "invalid"
            })}
          />
          {errors.amount && (
            <span className="text-red-600 mt-2 text-sm">El monto ingresado es invalido</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-[110px] h-[34px] rounded-3xl bg-blue-500 border border-blue-500 text-white font-Lato font-bold transition duration-300 hover:bg-blue-800 hover:border-blue-800 disabled:opacity-60"
        >
          Crear
        </button>
      </form>
    </div>
  );
}
