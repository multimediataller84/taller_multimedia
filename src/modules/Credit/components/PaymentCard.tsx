import { formatCRC } from "../utils/currency";

type Props = {
  amount: number;
  createdAt: string;
  onDelete: () => void;
  disabled?: boolean;
};

export default function PaymentCard({ amount, createdAt, onDelete, disabled }: Props) {
  const when = new Date(createdAt).toLocaleString("es-CR", { dateStyle: "short", timeStyle: "short" });

  const delClasses = disabled
    ? "py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-full xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300 bg-black border border-black hover:bg-red-800 hover:border-red-800 text-white font-Lato font-bold transition duration-300 border-gray2 text-gray1 font-Lato font-bold transition duration-300 cursor-not-allowed"
    : "py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-full xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300 bg-black border border-black hover:bg-red-800 hover:border-red-800 text-white font-Lato font-bold transition duration-300";

  return (
    <div className="bg-white border border-gray2 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-Lato text-sm text-gray-600">Abono</span>
        <span className="font-Lato text-base">{when}</span>
        <span className="font-Lato font-bold">{formatCRC(amount)}</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={!disabled ? onDelete : undefined}
          disabled={disabled}
          className={delClasses}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
