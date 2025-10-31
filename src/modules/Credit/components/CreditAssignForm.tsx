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
    <div className="p-4 sm:p-6 md:p-8 space-y-4">
      <h3 className="font-Lato text-xs sm:text-sm md:text-base xl:text-base">
        Monto aprobado para credito del cliente: <span className="font-bold">{clientName}</span>
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 2xl:gap-6">
        <div className="flex flex-col space-y-2 flex-1 min-w-[220px]">
          <label htmlFor="amount" className="font-Lato text-xs md:text-base xl:text-base text-gray-600">Ejemplo: ₡150 000</label>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0.00"
            className="appearance-none w-full md:w-[60%] lg:w-[40%] 2xl:w-[30%] py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white text-sm sm:text-base focus:outline-2 focus:outline-blue-500"
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
        
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto md:w-[94px] text-xs sm:text-sm md:text-base bg-blue-500 border border-blue-500 text-white font-Lato font-bold transition duration-300 hover:bg-blue-800 hover:border-blue-800 disabled:opacity-60"
        >
          Crear
        </button>
        
      </form>
    </div>
  );
}
