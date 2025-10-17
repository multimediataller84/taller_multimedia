import { formatCRC } from "../utils/currency";

type Props = {
  amount: number;
  dueRemaining: number;
  createdAt: string;
  locked?: boolean;
  onPay: () => void;
  onCancel: () => void;
  onDelete: () => void;
  
  selected?: boolean;
  onSelect?: () => void;
};

export default function InvoiceCard({
  amount,
  dueRemaining,
  createdAt,
  locked,
  onPay,
  onCancel,
  onDelete,
  selected = false,
  onSelect,
}: Props) {
  const when = new Date(createdAt).toLocaleString("es-CR", { dateStyle: "short", timeStyle: "short" });

  const disabledClasses = "bg-white border border-gray2 text-gray1 cursor-not-allowed";

  const payBtn = locked
    ? `w-[94px] py-2 rounded-3xl ${disabledClasses} font-Lato font-bold transition duration-300`
    : "w-[94px] py-2 rounded-3xl bg-blue-500 border border-blue-500 hover:bg-blue-800 text-white font-Lato font-bold transition duration-300";

  const cancelBtn = locked
    ? `w-[94px] py-2 rounded-3xl ${disabledClasses} font-Lato font-bold transition duration-300`
    : "w-[94px] py-2 rounded-3xl bg-black border border-black text-white font-Lato font-bold transition duration-300 hover:bg-gray-700 hover:border-gray-700";

  const delBtn = locked
    ? `w-[94px] py-2 rounded-3xl ${disabledClasses} font-Lato font-bold transition duration-300`
    : "w-[94px] py-2 rounded-3xl bg-black border border-black hover:bg-red-800 hover:border-red-800 text-white font-Lato font-bold transition duration-300";

  return (
    <div
      className={`border rounded-2xl p-4 flex items-center justify-between transition-colors ${
        selected ? "bg-gray-100 border-gray-300" : "bg-white border-gray2"
      } ${onSelect ? "cursor-pointer" : ""}`}
      onClick={onSelect}
      role="button"
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onSelect) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex flex-col">
        <span className="font-Lato text-sm text-gray-600">
          {selected ? "Factura (seleccionada)" : "Factura"}
        </span>
        <span className="font-Lato text-base">{when}</span>
        <span className="font-Lato text-sm text-gray-700 mt-1">
          Pendiente de la factura: <b>{formatCRC(dueRemaining)}</b> de <b>{formatCRC(amount)}</b>
        </span>
      </div>

      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={!locked ? onPay : undefined}
          disabled={!!locked}
          className={payBtn}
        >
          Abonar
        </button>
        <button
          type="button"
          onClick={!locked ? onCancel : undefined}
          disabled={!!locked}
          className={cancelBtn}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={!locked ? onDelete : undefined}
          disabled={!!locked}
          className={delBtn}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
