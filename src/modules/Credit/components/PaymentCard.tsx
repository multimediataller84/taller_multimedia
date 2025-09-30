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
    ? "w-[94px] py-2 rounded-3xl bg-white border border-gray2 text-gray1 font-Lato font-bold transition duration-300 cursor-not-allowed"
    : "w-[94px] py-2 rounded-3xl bg-[#FF4747] border border-[#FF4747] hover:bg-[#D32626] text-white font-Lato font-bold transition duration-300";

  return (
    <div className="bg-white border border-gray2 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-Lato text-sm text-gray-600">Abono</span>
        <span className="font-Lato text-base">{when}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-Lato font-bold">{formatCRC(amount)}</span>
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
